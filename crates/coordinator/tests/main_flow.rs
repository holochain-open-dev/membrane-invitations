use std::collections::BTreeMap;
use std::sync::Arc;

use hc_zome_membrane_invitations_types::*;
use ::fixt::fixt;
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

    let original_dna_hash = fixt!(DnaHash);
    let resulting_dna_hash = fixt!(DnaHash);



    let create_clone_dna_recipe_input = CloneDnaRecipe {
        original_dna_hash: original_dna_hash.clone(),

        properties: SerializedBytes::try_from(()).unwrap(),
        uid: Some(String::from("hi")),

        resulting_dna_hash,
    };

    println!("Calling zome create_clone_dna_recipe");

    let clone_dna_recipe_hash: EntryHash = conductors[0]
        .call(
            &alice_zome,
            "create_clone_dna_recipe",
            create_clone_dna_recipe_input.clone(),
        )
        .await;


    println!("Calling zome create_clone_dna_recipe");


    let clone_recipes: BTreeMap<EntryHash, CloneDnaRecipe> = conductors[0]
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
        membrane_proof: Some(Arc::new(SerializedBytes::try_from(()).unwrap())),
    };

    println!("Calling zome invite_to_join_membrane");


    let _invitation_header_hash: ActionHash = conductors[0]
        .call(&alice_zome, "invite_to_join_membrane", invitation)
        .await;

    consistency_10s(&[&alice, &bobbo]).await;

    println!("Calling zome get_my_invitations");

    let bobs_invitations: Vec<(ActionHash, JoinMembraneInvitation)> = conductors[1]
        .call(&bob_zome, "get_my_invitations", ())
        .await;

    assert_eq!(bobs_invitations.len(), 1);
    assert_eq!(
        bobs_invitations
            .first()
            .unwrap().1
            .clone_dna_recipe
            .original_dna_hash,
        original_dna_hash
    );
}
