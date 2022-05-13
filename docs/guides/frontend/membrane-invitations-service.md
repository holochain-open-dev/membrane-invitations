# Frontend Docs >> MembraneInvitationsService ||30

The `MembraneInvitationsService` is a state-less class that provides typings wrapping the zome calls that can be made to `hc_zome_clone_invitations`.

```js
import { MembraneInvitationsService } from '@holochain-open-dev/membrane-invitations';

const service = new MembraneInvitationsService(cellClient);

service.getMyMembraneInvitation().then(myMembraneInvitation => console.log(myMembraneInvitation));
```

Learn more about the services [here](https://holochain-open-dev.github.io/reusable-modules/frontend/using/#services). 