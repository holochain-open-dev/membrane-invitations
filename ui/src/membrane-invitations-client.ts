import {
  ActionHashMap,
  isSignalFromCellWithRole,
} from "@holochain-open-dev/utils";
import {
  MembraneProof,
  Record,
  EntryHash,
  ActionHash,
  DnaHash,
  AgentPubKey,
  AppAgentClient,
  AppAgentCallZomeRequest,
} from "@holochain/client";
import { UnsubscribeFunction } from "emittery";
import {
  CloneDnaRecipe,
  JoinMembraneInvitation,
  MembraneInvitationsSignal,
} from "./types";

export interface MembraneInvitationsEvents {
  ["signal"]: MembraneInvitationsSignal;
}

export class MembraneInvitationsClient {
  constructor(
    public client: AppAgentClient,
    public roleName: string,
    public zomeName = "membrane_invitations"
  ) {}

  on<Name extends keyof MembraneInvitationsEvents>(
    eventName: Name | readonly Name[],
    listener: (
      eventData: MembraneInvitationsEvents[Name]
    ) => void | Promise<void>
  ): UnsubscribeFunction {
    return this.client.on(eventName, async (signal) => {
      if (
        (await isSignalFromCellWithRole(this.client, this.roleName, signal)) &&
        this.zomeName === signal.zome_name
      ) {
        listener(signal.payload as MembraneInvitationsSignal);
      }
    });
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
      cloneDnaRecipe,
      invitee,
      membraneProof,
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

  private callZome(fn_name: string, payload: any) {
    const req: AppAgentCallZomeRequest = {
      role_name: this.roleName,
      zome_name: this.zomeName,
      fn_name,
      payload,
    };
    return this.client.callZome(req);
  }
}
