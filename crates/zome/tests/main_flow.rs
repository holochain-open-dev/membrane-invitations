use std::collections::BTreeMap;

use ::fixt;
use hc_zome_membrane_invitations_types::*;
use hdk::prelude::holo_hash::fixt::DnaHashB64Fixturator;
use hdk::prelude::holo_hash::*;
use hdk::prelude::*;
use holochain::test_utils::consistency_10s;
use holochain::{conductor::config::ConductorConfig, sweettest::*};

#[tokio::test(flavor = "multi_thread")]
async fn main_flow() {
    // Use prebuilt DNA file
    let dna_path = std::env::current_dir()
        .unwrap()
        .join("../../workdir/dna/membrane_invitations.dna");
    let dna = SweetDnaFile::from_bundle(&dna_path).await.unwrap();

    // Set up conductors
    let mut conductors = SweetConductorBatch::from_config(2, ConductorConfig::default()).await;
    let apps = conductors
        .setup_app("membrane_invitations", &[dna])
        .await
        .unwrap();
    conductors.exchange_peer_info().await;

    let ((alice,), (bobbo,)) = apps.into_tuples();

    let alice_zome = alice.zome("membrane_invitations");
    let bob_zome = bobbo.zome("membrane_invitations");

    let mut f = DnaHashB64Fixturator::new(fixt::Predictable);
    let original_dna_hash = f.next().unwrap();
    let resulting_dna_hash = f.next().unwrap();

    let create_clone_dna_recipe_input = CloneDnaRecipe {
        original_dna_hash: original_dna_hash.clone(),

        properties: SerializedBytes::try_from(()).unwrap(),
        uid: Some(String::from("hi")),

        resulting_dna_hash,
    };

    let clone_dna_recipe_hash: EntryHashB64 = conductors[0]
        .call(
            &alice_zome,
            "create_clone_dna_recipe",
            create_clone_dna_recipe_input.clone(),
        )
        .await;

    let clone_recipes: BTreeMap<EntryHashB64, CloneDnaRecipe> = conductors[0]
        .call(
            &alice_zome,
            "get_clone_recipes_for_dna",
            original_dna_hash.clone(),
        )
        .await;

    assert_eq!(clone_recipes.len(), 1);
    assert_eq!(
        clone_recipes.get(&clone_dna_recipe_hash).unwrap().original_dna_hash,
        original_dna_hash
    );

    let invitation = InviteToJoinMembraneInput {
        clone_dna_recipe: create_clone_dna_recipe_input.clone(),
        invitee: bob_zome.cell_id().agent_pubkey().clone().into(),
        membrane_proof: Some(SerializedBytes::try_from(()).unwrap()),
    };

    let invitation_header_hash: HeaderHashB64 = conductors[0]
        .call(&alice_zome, "invite_to_join_membrane", invitation)
        .await;

    consistency_10s(&[&alice, &bobbo]).await;

    let bobs_invitations: BTreeMap<HeaderHashB64, JoinMembraneInvitation> = conductors[1]
        .call(&bob_zome, "get_my_invitations", ())
        .await;

    assert_eq!(bobs_invitations.len(), 1);
    assert_eq!(
        bobs_invitations
            .get(&invitation_header_hash)
            .unwrap()
            .clone_dna_recipe
            .original_dna_hash,
        original_dna_hash
    );
}
