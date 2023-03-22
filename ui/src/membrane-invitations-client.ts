import { ActionHashMap, ZomeClient } from "@holochain-open-dev/utils";
import {
  MembraneProof,
  Record,
  EntryHash,
  ActionHash,
  DnaHash,
  AgentPubKey,
  AppAgentClient,
} from "@holochain/client";
import {
  CloneDnaRecipe,
  JoinMembraneInvitation,
  MembraneInvitationsSignal,
} from "./types";

export class MembraneInvitationsClient extends ZomeClient<MembraneInvitationsSignal> {
  constructor(
    public client: AppAgentClient,
    public roleName: string,
    public zomeName = "membrane_invitations"
  ) {
    super(client, roleName, zomeName);
  }

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
      clone_dna_recipe: cloneDnaRecipe,
      invitee,
      membrane_proof: membraneProof,
    });
  }

  public async getMyInvitations(): Promise<
    ActionHashMap<JoinMembraneInvitation>
  > {
    return new ActionHashMap(await this.callZome("get_my_invitations", null));
  }

  public removeInvitation(invitationLinkHash: ActionHash): Promise<void> {
    return this.callZome("remove_invitation", invitationLinkHash);
  }
}
