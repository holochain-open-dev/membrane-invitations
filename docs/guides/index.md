# Guides

The membrane-invitations zome and its accompanying frontend module are designed to implement and export useful functionality around personal membrane-invitation information about the agents in a Holochain DHT.

The only field that this module assumes 

Existing functionalities:

- Creating a membrane-invitation.
- Updating a membrane-invitation.
- Searching agents by nickname.
- Getting the membrane-invitation for a list of agents.

Future functionality will include:

- Configurable membrane-invitation fields.
- MembraneInvitation detail frontend element.

> In the future, when the personas & membrane-invitations application is fully developed, this module will switch to storing data in it, and will serve only as a bridge to get that private data. We hope to maintain the modules and their interfaces as similar as they are now, and that the migration friction is low.

Get started with adding the module into your Holochain app by reading the [Setting Up section](./setting-up/adding-the-zome.md).