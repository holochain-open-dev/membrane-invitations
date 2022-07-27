import { CellClient } from "@holochain-open-dev/cell-client";
import { HoloHashMap } from '@holochain-open-dev/utils';
import { MembraneProof, EntryHash, ActionHash, DnaHash, AgentPubKey } from "@holochain/client";
import { CloneDnaRecipe, JoinMembraneInvitation } from "./types";
export declare class MembraneInvitationsService {
    protected cellClient: CellClient;
    protected zomeName: string;
    constructor(cellClient: CellClient, zomeName?: string);
    createCloneDnaRecipe(recipe: CloneDnaRecipe): Promise<EntryHash>;
    getCloneRecipesForDna(originalDnaHash: DnaHash): Promise<HoloHashMap<CloneDnaRecipe>>;
    inviteToJoinMembrane(cloneDnaRecipe: CloneDnaRecipe, invitee: AgentPubKey, membraneProof: MembraneProof | undefined): Promise<ActionHash>;
    getMyInvitations(): Promise<[
        ActionHash,
        JoinMembraneInvitation
    ][]>;
    removeInvitation(invitationLinkHash: ActionHash): Promise<void>;
    private callZome;
}
