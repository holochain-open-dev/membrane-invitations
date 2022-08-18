import { CellClient } from "@holochain-open-dev/cell-client";
import { HoloHashMap } from "@holochain-open-dev/utils";
import { ActionHash } from "@holochain/client";
import { Writable } from "svelte/store";
import { MembraneInvitationsService } from "./membrane-invitations-service";
import { JoinMembraneInvitation } from "./types";
export declare class MembraneInvitationsStore {
    protected cellClient: CellClient;
    service: MembraneInvitationsService;
    myInvitations: Writable<HoloHashMap<ActionHash, JoinMembraneInvitation>>;
    constructor(cellClient: CellClient, zomeName?: string);
    fetchMyInvitations(): Promise<import("svelte/store").Readable<HoloHashMap<Uint8Array, JoinMembraneInvitation>>>;
    removeInvitation(invitationHeaderHash: ActionHash): Promise<void>;
}
