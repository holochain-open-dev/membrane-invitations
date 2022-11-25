//! ## hc_zome_membrane_invitations

use std::collections::BTreeMap;
use std::sync::Arc;

use hdk::prelude::holo_hash::*;
use hdk::prelude::*;

use hc_zome_membrane_invitations_integrity::*;
use hc_zome_membrane_invitations_types::*;

#[hdk_extern]
fn init(_: ()) -> ExternResult<InitCallbackResult> {
    // grant unrestricted access to accept_cap_claim so other agents can send us claims
    let mut functions = BTreeSet::new();
    functions.insert((zome_info()?.name, "recv_remote_signal".into()));
    create_cap_grant(CapGrantEntry {
        tag: "".into(),
        // empty access converts to unrestricted
        access: ().into(),
        functions,
    })?;
    Ok(InitCallbackResult::Pass)
}

#[hdk_extern]
pub fn create_clone_dna_recipe(clone_dna_recipe: CloneDnaRecipe) -> ExternResult<EntryHash> {
    let hash = hash_entry(&clone_dna_recipe)?;

    create_entry(EntryTypes::CloneDnaRecipe(clone_dna_recipe.clone()))?;

    create_link(
        DnaHash::from(clone_dna_recipe.original_dna_hash).retype(hash_type::Entry),
        hash.clone(),
        LinkTypes::DnaHashToRecipe,
        (),
    )?;

    Ok(hash)
}

#[hdk_extern]
pub fn get_clone_recipes_for_dna(original_dna_hash: DnaHash) -> ExternResult<Vec<Record>> {
    let links = get_links(
        DnaHash::from(original_dna_hash).retype(hash_type::Entry),
        LinkTypes::DnaHashToRecipe,
        None,
    )?;
    let get_inputs = links
        .iter()
        .map(|link| GetInput::new(AnyDhtHash::from(EntryHash::from(link.target.clone())), GetOptions::default()))
        .collect();

    let records = HDK.with(|hdk| hdk.borrow().get(get_inputs))?;

    let clones = records.into_iter().filter_map(|r| r).collect();

    Ok(clones)
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(tag = "type")]
#[serde(rename_all = "camelCase")]
pub enum Signal {
    NewInvitation {
        invitation_action_hash: ActionHash,
        invitation: JoinMembraneInvitation,
    },
}

#[hdk_extern]
pub fn invite_to_join_membrane(input: InviteToJoinMembraneInput) -> ExternResult<ActionHash> {
    let tag: LinkTag = match input.membrane_proof.clone() {
        None => LinkTag::new(vec![]),
        Some(mp) => LinkTag::new(mp.bytes().clone()),
    };

    let clone_dna_recipe_hash = hash_entry(&input.clone_dna_recipe)?;

    let invitee_pub_key = input.invitee;

    // create link from invitee to the clone dna recipe
    let action_hash = create_link(
        invitee_pub_key.clone(),
        EntryHash::from(clone_dna_recipe_hash),
        LinkTypes::InviteeToRecipe,
        tag,
    )?;

    let invitation = JoinMembraneInvitation {
        invitee: invitee_pub_key.clone().into(),
        clone_dna_recipe: input.clone_dna_recipe,
        inviter: agent_info()?.agent_initial_pubkey,
        membrane_proof: input.membrane_proof,
        timestamp: sys_time()?,
    };

    let signal = Signal::NewInvitation {
        invitation,
        invitation_action_hash: action_hash.clone(),
    };

    let encoded_signal =
        ExternIO::encode(signal).map_err(|err| wasm_error!(WasmErrorInner::Guest(err.into())))?;

    remote_signal(encoded_signal, vec![invitee_pub_key])?;

    Ok(action_hash)
}

#[hdk_extern]
fn recv_remote_signal(signal: ExternIO) -> ExternResult<()> {
    let sig: Signal = signal
        .decode()
        .map_err(|err| wasm_error!(WasmErrorInner::Guest(err.into())))?;
    Ok(emit_signal(&sig)?)
}

#[hdk_extern]
pub fn get_my_invitations(_: ()) -> ExternResult<Vec<(ActionHash, JoinMembraneInvitation)>> {
    let agent_info = agent_info()?;

    let links = get_links(
        agent_info.agent_initial_pubkey.clone(),
        LinkTypes::InviteeToRecipe,
        None,
    )?;

    let recipes = get_clone_dna_recipes(&links)?;

    let mut my_invitations: Vec<(ActionHash, JoinMembraneInvitation)> = Vec::new();

    for link in links {
        if let Some(recipe) = recipes.get(&EntryHash::from(link.target)) {
            let membrane_proof = match link.tag.0.len() > 0 {
                true => Some(Arc::new(SerializedBytes::from(UnsafeBytes::from(
                    link.tag.0,
                )))),
                false => None,
            };

            // Remove this get when the link struct includes author
            if let Some(record) = get(link.create_link_hash.clone(), GetOptions::default())? {
                let invitation = JoinMembraneInvitation {
                    clone_dna_recipe: recipe.clone(),
                    inviter: record.action().author().clone(),
                    invitee: agent_info.agent_initial_pubkey.clone(),
                    membrane_proof,
                    timestamp: link.timestamp,
                };
                my_invitations.push((link.create_link_hash, invitation));
            }
        }
    }

    Ok(my_invitations)
}

fn get_clone_dna_recipes(links: &Vec<Link>) -> ExternResult<BTreeMap<EntryHash, CloneDnaRecipe>> {
    let get_inputs = links
        .iter()
        .map(|link| GetInput::new(AnyDhtHash::from(EntryHash::from(link.target.clone())), GetOptions::default()))
        .collect();

    let records = HDK.with(|hdk| hdk.borrow().get(get_inputs))?;

    let clones: BTreeMap<EntryHash, CloneDnaRecipe> = records
        .into_iter()
        .filter_map(|r| r)
        .filter_map(|record| {
            let recipe: Option<CloneDnaRecipe> = record.entry().to_app_option().unwrap_or(None);
            recipe.map(|r| (record.action().entry_hash().unwrap().clone(), r))
        })
        .collect();

    Ok(clones)
}

#[hdk_extern]
pub fn remove_invitation(invitation_link_hash: ActionHash) -> ExternResult<()> {
    delete_link(invitation_link_hash.into())?;
    Ok(())
}
