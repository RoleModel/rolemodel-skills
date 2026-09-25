# Transferring application ownership


## Overview

You can transfer the ownership of between different Cloud 66 accounts, as long as both accounts and the application meet the criteria (see below). This does not transfer the servers on which the application is hosted - instead in detaches them from one Cloud 66 account and then reattaches them to another. 

## Account & user criteria

Before you can transfer an application between Cloud 66 accounts, those accounts need to meet the following conditions:

1. Both accounts must be active (not suspended) and have credit card details added
2. The users transferring the application must **both** (i.e. sender and receiver) be the owners of the respective accounts
3. Both accounts must have access to **the same cloud provider account that also contains the application to be transferred.**

You can check and change most of the above via your [Account Settings](../account/account-management.md). 

## Application criteria

Once all of the account and user conditions are met, you will need to ensure the application is ready to transfer. The application must:

1. Be active and unimpaired (in a "green" state, not a "red" one)
2. Be able to reach all of its own servers 

## Transferring an application

To **initiate** transfer of an application, the **sender** must:

1. Open the application page from your [Dashboard](https://app.cloud66.com/dashboard)
2. Click on ⚙️ *Settings*  in the left-hand nav
3. Click on *Transfer Ownership*, at the bottom of the panel on the right of the screen
4. Fill in the email address of the account **receiver**. This must be the same address they use to log into their Cloud 66 account.
5. Click *Start Application Transfer* 

The system will now run through all the checks to ensure the account and application criteria have all been met. It will halt on any errors and give you information on how to resolve them. 

At the same time it will alert the account **receiver** of the transfer via email and in-app notification (top left of the Dashboard). 

To **accept** the transfer of an application the **receiver** must:

1. Open the application page from your [Dashboard](https://app.cloud66.com/dashboard)
2. Click on the notification and agree to accept the transfer

The transfer process will now begin. Note that if the **receiving** account does not meet one of the criteria when transfer is initiated (e.g. it does not have an active Cloud 66 product of the right type), the transfer will stop and will have to be restarted by the **sender** once this issue is resolved.

## Understanding the application transfer process

Once the initial ownership transfer has taken place (see above), the physical transfer process will begin. This includes:

- Updating all the Cloud 66 components (e.g. the agent) on the servers
- Migrating all server jobs and backup jobs
- Migrating backup files (this will take some time)

## Dealing with a failed transfer

In very rare instances, the transfer process may fail. We will be automatically alerted and will help you resolve the issue. You can also contact us via the support channels below. 

Note that your servers will not be in any danger, even in the event of a failed transfer - we are re-pointing another Cloud 66 account at an existing application, not transferring those servers.