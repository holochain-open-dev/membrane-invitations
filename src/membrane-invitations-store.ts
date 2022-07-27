import { CellClient } from "@holochain-open-dev/cell-client";
import { HoloHashMap } from "@holochain-open-dev/utils";
import { ActionHash } from "@holochain/client";
import { derived, Writable, writable } from "svelte/store";
import { MembraneInvitationsService } from "./membrane-invitations-service";
import { JoinMembraneInvitation } from "./types";

export class MembraneInvitationsStore {
  public service: MembraneInvitationsService;

  myInvitations: Writable<HoloHashMap<JoinMembraneInvitation>> = // keys of type ActionHash
    writable(new HoloHashMap<JoinMembraneInvitation>());

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
    let myInvitations = new HoloHashMap<JoinMembraneInvitation>();
    const invitationsArray: [ActionHash, JoinMembraneInvitation][] = await this.service.getMyInvitations();
    invitationsArray.forEach(([actionHash, joinMembraneInvitation]) => {
      myInvitations.put(actionHash, joinMembraneInvitation);
    })

    this.myInvitations.set(myInvitations);

    return derived(this.myInvitations, (i) => i);
  }

  async removeInvitation(invitationHeaderHash: ActionHash) {
    await this.service.removeInvitation(invitationHeaderHash);

    this.myInvitations.update((i) => {
      i.delete(invitationHeaderHash);
      return i;
    });
  }
}
