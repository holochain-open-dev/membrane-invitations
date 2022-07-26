//! ## hc_zome_membrane_invitations

use hdi::prelude::*;

use hc_zome_membrane_invitations_types::*;

#[hdk_entry_defs]
#[unit_enum(UnitEntryTypes)]
pub enum EntryTypes {
    CloneDnaRecipe(CloneDnaRecipe),
}

#[hdk_link_types]
pub enum LinkTypes {
    DnaHashToRecipe,
    InviteeToRecipe,
}

#[hdk_extern]
pub fn validate(_op: Op) -> ExternResult<ValidateCallbackResult> {
  Ok(ValidateCallbackResult::Valid)
}
