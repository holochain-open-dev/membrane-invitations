export class MembraneInvitationsService {
    constructor(cellClient, zomeName = "membrane_invitations") {
        this.cellClient = cellClient;
        this.zomeName = zomeName;
    }
    createCloneDnaRecipe(recipe) {
        return this.callZome("create_clone_dna_recipe", recipe);
    }
    getCloneRecipesForDna(originalDnaHash) {
        return this.callZome("get_clone_recipes_for_dna", originalDnaHash);
    }
    inviteToJoinMembrane(cloneDnaRecipe, invitee, membraneProof) {
        return this.callZome("invite_to_join_membrane", {
            cloneDnaRecipe,
            invitee,
            membraneProof,
        });
    }
    getMyInvitations() {
        return this.callZome("get_my_invitations", null);
    }
    removeInvitation(invitationLinkHash) {
        return this.callZome("remove_invitation", invitationLinkHash);
    }
    callZome(fn_name, payload) {
        return this.cellClient.callZome(this.zomeName, fn_name, payload);
    }
}
//# sourceMappingURL=membrane-invitations-service.js.map