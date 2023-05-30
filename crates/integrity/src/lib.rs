//! ## hc_zome_membrane_invitations

use hdi::prelude::*;

#[hdk_entry_helper]
#[derive(Clone)]
pub struct CloneDnaRecipe {
    pub original_dna_hash: DnaHash,
    pub properties: SerializedBytes,
    pub network_seed: Option<String>,
    pub resulting_dna_hash: DnaHash,
    pub custom_content: SerializedBytes,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct InviteToJoinMembraneInput {
    pub clone_dna_recipe: CloneDnaRecipe,
    pub invitee: AgentPubKey,
    pub membrane_proof: Option<MembraneProof>,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct JoinMembraneInvitation {
    pub clone_dna_recipe: CloneDnaRecipe,
    pub inviter: AgentPubKey,
    pub invitee: AgentPubKey,
    pub membrane_proof: Option<MembraneProof>,
    pub timestamp: Timestamp,
}

#[derive(Serialize, Deserialize)]
#[hdk_entry_defs]
#[unit_enum(UnitEntryTypes)]
#[serde(tag = "type")]
pub enum EntryTypes {
    CloneDnaRecipe(CloneDnaRecipe),
}

#[derive(Serialize, Deserialize)]
#[hdk_link_types]
pub enum LinkTypes {
    DnaHashToRecipe,
    InviteeToRecipe,
}

#[hdk_extern]
pub fn validate(_op: Op) -> ExternResult<ValidateCallbackResult> {
    Ok(ValidateCallbackResult::Valid)
}
