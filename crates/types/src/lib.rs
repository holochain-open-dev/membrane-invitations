use hdi::prelude::holo_hash::*;
use hdi::prelude::*;

#[hdk_entry_helper]
#[serde(rename_all = "camelCase")]
#[derive(Clone)]
pub struct CloneDnaRecipe {
    pub original_dna_hash: DnaHash,
    pub properties: SerializedBytes,
    pub network_seed: Option<String>,
    pub resulting_dna_hash: DnaHash,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct InviteToJoinMembraneInput {
    pub clone_dna_recipe: CloneDnaRecipe,
    pub invitee: AgentPubKey,
    pub membrane_proof: Option<MembraneProof>,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct JoinMembraneInvitation {
    pub clone_dna_recipe: CloneDnaRecipe,
    pub inviter: AgentPubKey,
    pub invitee: AgentPubKey,
    pub membrane_proof: Option<MembraneProof>,
    pub timestamp: Timestamp,
}
