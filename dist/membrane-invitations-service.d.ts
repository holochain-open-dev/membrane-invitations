import { CellClient } from "@holochain-open-dev/cell-client";
import { AgentPubKeyB64, DnaHashB64, EntryHashB64, HeaderHashB64 } from "@holochain-open-dev/core-types";
import { MembraneProof } from "@holochain/client";
import { CloneDnaRecipe, JoinMembraneInvitation } from "./types";
export declare class MembraneInvitationsService {
    protected cellClient: CellClient;
    protected zomeName: string;
    constructor(cellClient: CellClient, zomeName?: string);
    createCloneDnaRecipe(recipe: CloneDnaRecipe): Promise<EntryHashB64>;
    getCloneRecipesForDna(originalDnaHash: DnaHashB64): Promise<Record<EntryHashB64, CloneDnaRecipe>>;
    inviteToJoinMembrane(cloneDnaRecipe: CloneDnaRecipe, invitee: AgentPubKeyB64, membraneProof: MembraneProof | undefined): Promise<Record<EntryHashB64, CloneDnaRecipe>>;
    getMyInvitations(): Promise<Record<HeaderHashB64, JoinMembraneInvitation>>;
    removeInvitation(invitationLinkHash: HeaderHashB64): Promise<void>;
    private callZome;
}
