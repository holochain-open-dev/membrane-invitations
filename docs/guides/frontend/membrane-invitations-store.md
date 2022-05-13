# Frontend Docs >> MembraneInvitationsStore ||20

The `MembraneInvitationsStore` is a JS class that contains `svelte` stores, to which you can subscribe to get reactive updates in your elements.

```js
import { MembraneInvitationsStore } from "@holochain-open-dev/membrane-invitations";

const config = {
  avatarMode: "identicon",
  additionalFields: ["Location", "Bio"], // Custom app level membrane-invitation fields
};
const store = new MembraneInvitationsStore(cellClient, config);
```

> Learn how to setup the `CellClient` object [here](https://www.npmjs.com/package/@holochain-open-dev/cell-client).

The config for the `MembraneInvitationsStore` has these options:

```ts
export interface MembraneInvitationsConfig {
  zomeName: string; // default: 'membrane-invitations'
  avatarMode: "identicon" | "avatar"; // default: 'avatar'
  additionalFields: string[]; // default: []
  minNicknameLength: number; // default: 3
}
```

Learn more about the stores and how to integrate them in different frameworks [here](https://holochain-open-dev.github.io/reusable-modules/frontend/using/#stores).
