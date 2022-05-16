import { AgentPubKeyB64, DnaHashB64 } from "@holochain-open-dev/core-types";
import { MembraneProof } from "@holochain/client";
export interface CloneDnaRecipe {
    originalDnaHash: DnaHashB64;
    properties: any;
    uid: string | undefined;
    resultingDnaHash: DnaHashB64;
}
export interface JoinMembraneInvitation {
    cloneDnaRecipe: CloneDnaRecipe;
    inviter: AgentPubKeyB64;
    invitee: AgentPubKeyB64;
    membraneProof: MembraneProof | undefined;
}
