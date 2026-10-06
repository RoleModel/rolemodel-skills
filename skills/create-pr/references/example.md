# Example description

A filled-in description using the default headings, for a PR with a UI change and post-merge work.

```markdown
## Why

Users could not tell whether an invite had been sent, so support kept fielding "did it go through?" tickets. This adds a visible status on the invite list.

Delivery status comes from the mail provider's webhook rather than our own send call, because our send only proves we queued the message.

## What Changed

- [x] Show delivery status on each row of the invite list
- [x] Record provider webhook events against the invite
- [x] Backfill status for invites sent in the last 30 days
- [x] Add the mail provider's webhook gem

## Post-merge

- [ ] Run `rake invites:backfill_status` — existing invites show no status until it runs.
- [ ] Point the provider's webhook at `/webhooks/mail` in the provider dashboard; no new events record until then.

## Screenshots

![Invite list showing delivery status](<scratchpad>/invite-status.png)
```
