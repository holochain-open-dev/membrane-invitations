import { CellClient } from "@holochain-open-dev/cell-client";
import {
  AgentPubKeyB64,
  DnaHashB64,
  EntryHashB64,
  HeaderHashB64,
} from "@holochain-open-dev/core-types";
import { MembraneProof } from "@holochain/client";
import { CloneDnaRecipe, JoinMembraneInvitation } from "./types";

export class MembraneInvitationsService {
  constructor(
    protected cellClient: CellClient,
    protected zomeName = "membrane_invitations"
  ) {}

  public createCloneDnaRecipe(recipe: CloneDnaRecipe): Promise<EntryHashB64> {
    return this.callZome("create_clone_dna_recipe", recipe);
  }

  public getCloneRecipesForDna(
    originalDnaHash: DnaHashB64
  ): Promise<Record<EntryHashB64, CloneDnaRecipe>> {
    return this.callZome("get_clone_recipes_for_dna", originalDnaHash);
  }

  public inviteToJoinMembrane(
    cloneDnaRecipe: CloneDnaRecipe,
    invitee: AgentPubKeyB64,
    membraneProof: MembraneProof | undefined
  ): Promise<Record<EntryHashB64, CloneDnaRecipe>> {
    return this.callZome("invite_to_join_membrane", {
      cloneDnaRecipe,
      invitee,
      membraneProof,
    });
  }

  public getMyInvitations(): Promise<
    Record<HeaderHashB64, JoinMembraneInvitation>
  > {
    return this.callZome("get_my_invitations", null);
  }

  public removeInvitation(invitationLinkHash: HeaderHashB64): Promise<void> {
    return this.callZome("remove_invitation", invitationLinkHash);
  }

  private callZome(fn_name: string, payload: any) {
    return this.cellClient.callZome(this.zomeName, fn_name, payload);
  }
}
