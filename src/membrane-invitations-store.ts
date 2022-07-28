import { CellClient } from "@holochain-open-dev/cell-client";
import { HeaderHashB64 } from "@holochain-open-dev/core-types";
import { derived, Writable, writable } from "svelte/store";
import { MembraneInvitationsService } from "./membrane-invitations-service";
import { JoinMembraneInvitation } from "./types";

export class MembraneInvitationsStore {
  public service: MembraneInvitationsService;

  myInvitations: Writable<Record<HeaderHashB64, JoinMembraneInvitation>> =
    writable({});

  constructor(
    protected cellClient: CellClient,
    zomeName = "membrane_invitations"
  ) {
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

  async removeInvitation(invitationHeaderHash: HeaderHashB64) {
    await this.service.removeInvitation(invitationHeaderHash);

    this.myInvitations.update((i) => {
      delete i[invitationHeaderHash];
      return i;
    });
  }
}
