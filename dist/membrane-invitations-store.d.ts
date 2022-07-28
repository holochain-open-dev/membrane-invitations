import { CellClient } from "@holochain-open-dev/cell-client";
import { HeaderHashB64 } from "@holochain-open-dev/core-types";
import { Writable } from "svelte/store";
import { MembraneInvitationsService } from "./membrane-invitations-service";
import { JoinMembraneInvitation } from "./types";
export declare class MembraneInvitationsStore {
    protected cellClient: CellClient;
    service: MembraneInvitationsService;
    myInvitations: Writable<Record<HeaderHashB64, JoinMembraneInvitation>>;
    constructor(cellClient: CellClient, zomeName?: string);
    fetchMyInvitations(): Promise<import("svelte/store").Readable<Record<string, JoinMembraneInvitation>>>;
    removeInvitation(invitationHeaderHash: HeaderHashB64): Promise<void>;
}
