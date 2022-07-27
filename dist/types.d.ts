import { AgentPubKey, DnaHash, MembraneProof, Timestamp } from "@holochain/client";
export interface CloneDnaRecipe {
    originalDnaHash: DnaHash;
    properties: any;
    uid: string | undefined;
    resultingDnaHash: DnaHash;
}
export interface JoinMembraneInvitation {
    cloneDnaRecipe: CloneDnaRecipe;
    inviter: AgentPubKey;
    invitee: AgentPubKey;
    membraneProof: MembraneProof | undefined;
    timestamp: Timestamp;
}
