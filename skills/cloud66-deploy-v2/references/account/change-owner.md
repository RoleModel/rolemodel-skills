# Changing the account owner


## Overview

Every Cloud 66 account has a single **owner** — the user with maximum permissions on every application in the account ([more on roles](../account/team-accounts.md#user-roles-and-permissions)).

There's no dedicated "transfer owner" button in the Dashboard, but you can achieve the same result in one of three ways. The first two simply change the email and login identity on the existing account and take a moment to do yourself; the third moves your applications to a separate account and is mainly useful when the new owner wants a completely separate account of their own. Work through them in order and use the first one that fits.

In every case the change is made by the **current account owner**. A prospective new owner can't initiate the change themselves, since it's tied to whoever currently controls the account — so if you're not the current owner, ask them to make the change.

## Option 1: Rename the account's email address

If the email the new owner wants to use isn't already registered with Cloud 66, the current owner can simply change the account's email address to it under *Account Settings* (click your avatar, top-right → *Account Settings*). The account and all of its applications stay exactly as they are — only the login and contact identity changes. This is the simplest option, so try it first.

The only requirement is that the new email address isn't **already in use by another Cloud 66 account** — each account needs its own unique email address. If that email already exists as a Cloud 66 account but doesn't have any applications or history worth keeping, you can log in as that user and [delete the account](../account/account-management.md#closing-your-account), which frees the email up for the rename.

## Option 2: Use another email under your control

If the new owner's main email is already registered with Cloud 66 and includes applications or history you want to keep (so Option 1 won't work), use a **different email address they control** instead. Any address that reaches them works — and the current owner changes the account's email to it under *Account Settings*, exactly as in Option 1.

If they don't have a spare mailbox to hand, there's a handy trick: most mail providers support "+" sub-addressing, so an address like `newowner+project@example.com` still lands in the `newowner@example.com` inbox while counting as a distinct address on Cloud 66. Gmail, Fastmail, and Microsoft 365 support this; some corporate mail systems don't.

Having multiple emails owned by the same user is intended for genuine ownership management on paying accounts. Registering multiple free Cloud 66 accounts via different email variations isn't permitted — it's treated as abuse and can lead to account suspension without warning.

## Option 3: Transfer the applications to another account

If the new owner would rather have a completely separate account of their own, you can transfer your applications across to it instead, one at a time. This is a self-service flow — see [Transferring application ownership](../account/application-transfer.md) for the requirements and steps.

It involves a few more steps than the email options, because moving applications between accounts also moves things like billing, DNS and failover groups, backups, server agents, and cloud-credential mappings (for example, the destination account needs access to the same cloud credentials as the existing servers, and the account plans need to match too). There are a number of moving parts with this process, so the above email options are usually the easier place to start.

## How to make the change

All of these are done by the **current account owner**:

- **Options 1 and 2** — change the account's email address under *Account Settings* (click your avatar, top-right → *Account Settings*).
- **Option 3** — run the [application transfer](../account/application-transfer.md) from the Dashboard.

If you're not the current owner, ask them to make the change. And if you're unsure which option fits, or you'd like us to handle it for you, [contact support](mailto:support@cloud66.com) and we'll help.

## Related

- [Transferring application ownership](../account/application-transfer.md) — moving individual applications between accounts (Option 3)
- [Manage your account](../account/account-management.md) — changing your account email and other settings
- [Managing teams and organizations](../account/team-accounts.md) — roles and permissions