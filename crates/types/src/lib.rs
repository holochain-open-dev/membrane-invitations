use hdk::prelude::holo_hash::*;
use hdk::prelude::*;

#[hdk_entry(id = "clone_dna_recipe")]
#[serde(rename_all = "camelCase")]
#[derive(Clone)]
pub struct CloneDnaRecipe {
    pub original_dna_hash: DnaHashB64,

    pub properties: SerializedBytes,
    pub uid: Option<String>,

    pub resulting_dna_hash: DnaHashB64,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct InviteToJoinMembraneInput {
    pub clone_dna_recipe: CloneDnaRecipe,
    pub invitee: AgentPubKeyB64,
    pub membrane_proof: Option<MembraneProof>,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct JoinMembraneInvitation {
    pub clone_dna_recipe: CloneDnaRecipe,
    pub inviter: AgentPubKeyB64,
    pub invitee: AgentPubKeyB64,
    pub membrane_proof: Option<MembraneProof>,
}
