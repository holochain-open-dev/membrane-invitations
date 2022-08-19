import { HoloHashMap } from "@holochain-open-dev/utils";
import { derived, writable } from "svelte/store";
import { MembraneInvitationsService } from "./membrane-invitations-service";
export class MembraneInvitationsStore {
    constructor(cellClient, zomeName = "membrane_invitations") {
        this.cellClient = cellClient;
        this.myInvitations = writable(new HoloHashMap());
        this.service = new MembraneInvitationsService(cellClient, zomeName);
        cellClient.addSignalHandler((signal) => {
            const payload = signal.data.payload;
            if (payload.type === "NewInvitation") {
                this.myInvitations.update((i) => {
                    i[payload.invitationHeaderHash] = payload.invitation;
                    return i;
                });
            }
        });
    }
    async fetchMyInvitations() {
        let myInvitations = new HoloHashMap();
        const invitationsArray = await this.service.getMyInvitations();
        invitationsArray.forEach(([actionHash, joinMembraneInvitation]) => {
            myInvitations.put(actionHash, joinMembraneInvitation);
        });
        this.myInvitations.set(myInvitations);
        return derived(this.myInvitations, (i) => i);
    }
    async removeInvitation(invitationHeaderHash) {
        await this.service.removeInvitation(invitationHeaderHash);
        this.myInvitations.update((i) => {
            i.delete(invitationHeaderHash);
            return i;
        });
    }
}
//# sourceMappingURL=membrane-invitations-store.js.map