import { ActionHash } from "@holochain/client";
import { asyncReadable } from "@holochain-open-dev/stores";
import { HoloHashMap } from "@holochain-open-dev/utils";
import { MembraneInvitationsClient } from "./membrane-invitations-client.js";
import { JoinMembraneInvitation } from "./types.js";

export class MembraneInvitationsStore {
  constructor(public client: MembraneInvitationsClient) {}

  myInvitations = asyncReadable<
    HoloHashMap<ActionHash, JoinMembraneInvitation>
  >(async (set) => {
    const invitations = await this.client.getMyInvitations();
    set(invitations);

    return this.client.onSignal((payload) => {
      if (payload.type === "NewInvitation") {
        invitations.set(payload.invitation_action_hash, payload.invitation);
        set(invitations);
      } else if (
        payload.type === "EntryDeleted" &&
        payload.original_app_entry.type === "CloneDnaRecipe"
      ) {
        invitations.delete(payload.action.hashed.content.deletes_address);
        set(invitations);
      }
    });
  });
}
