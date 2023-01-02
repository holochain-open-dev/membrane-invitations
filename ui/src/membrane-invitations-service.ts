import { AppAgentClient } from "@holochain/client";
import {
  MembraneProof,
  Record,
  EntryHash,
  ActionHash,
  DnaHash,
  AgentPubKey,
} from "@holochain/client";
import { CloneDnaRecipe, JoinMembraneInvitation } from "./types";

export class MembraneInvitationsService {
  constructor(
    protected appAgentClient: AppAgentClient,
    protected zomeName = "membrane_invitations"
  ) {}

  public createCloneDnaRecipe(recipe: CloneDnaRecipe): Promise<EntryHash> {
    return this.callZome("create_clone_dna_recipe", recipe);
  }

  public getCloneRecipesForDna(
    originalDnaHash: DnaHash
  ): Promise<Array<Record>> {
    // keys of type EntryHash
    return this.callZome("get_clone_recipes_for_dna", originalDnaHash);
  }

  public inviteToJoinMembrane(
    cloneDnaRecipe: CloneDnaRecipe,
    invitee: AgentPubKey,
    membraneProof: MembraneProof | undefined
  ): Promise<ActionHash> {
    return this.callZome("invite_to_join_membrane", {
      cloneDnaRecipe,
      invitee,
      membraneProof,
    });
  }

  public getMyInvitations(): Promise<
    [ActionHash, JoinMembraneInvitation][] // keys of type ActionHash
  > {
    return this.callZome("get_my_invitations", null);
  }

  public removeInvitation(invitationLinkHash: ActionHash): Promise<void> {
    return this.callZome("remove_invitation", invitationLinkHash);
  }

  private callZome(fn_name: string, payload: any) {
    return this.appAgentClient.callZome({
      role_name: "membrane_invitations",
      zome_name: this.zomeName,
      fn_name,
      payload
    });
  }
}
