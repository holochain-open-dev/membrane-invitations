import { derived, writable } from "svelte/store";
import { MembraneInvitationsService } from "./membrane-invitations-service";
export class MembraneInvitationsStore {
    constructor(cellClient, zomeName = "membrane_invitations") {
        this.cellClient = cellClient;
        this.myInvitations = writable({});
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
        const myInvitations = await this.service.getMyInvitations();
        this.myInvitations.set(myInvitations);
        return derived(this.myInvitations, (i) => i);
    }
    async removeInvitation(invitationHeaderHash) {
        await this.service.removeInvitation(invitationHeaderHash);
        this.myInvitations.update((i) => {
            delete i[invitationHeaderHash];
            return i;
        });
    }
}
//# sourceMappingURL=membrane-invitations-store.js.map