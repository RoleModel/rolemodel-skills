# Using service accounts


## Overview

Service accounts are special, limited accounts that:

- Belong to a team (not to account owners)
- Have no login privileges on your main Cloud 66 account

They are useful for centralizing automated actions such as webhooks, API calls and notifications. Because they are not directly tied to any team member, people can leave and join your team(s) without any danger of breaking an integration that is tied to their Cloud 66 account, and because they are centralized, there is no time wasted in figuring out which team member's account is responsible for a specific integration or notification. 

## Creating a service account

Service accounts are created like normal users, and can be set up by the owner of a team or any team member who is assigned `create` permissions under `service accounts`.

To create a service account:

1. Log into your Dashboard, click your avatar at the top right of the screen and then *Account Settings*
2. Click on *Teams* in the **Account** panel on the left
3. Click on the green + at the top right of the **Team** panel
4. Select *Service Account*
5. Assign the new account the required permissions
6. Click *Invite Team Member*

You'll notice that you don't (and can't) associate an email address with a service account. Instead we will automatically assign each service account a dummy email address. This address is used exclusively as a unique identifier for the account - it isn't attached to a working email system.

You also cannot use this dummy address to sign into Cloud 66. Service accounts are designed specifically to act as "headless" automation drones. However, this does not mean you should assign them overly broad privileges on your account. These accounts still have programmatic access to your account and applications and should be treated with the same care as your normal user accounts.

## Granting API access to a service account

Each service account can be granted scoped API access to your account via a unique access token. To set up an access token for a service account:

1. On the **Teams** page in **Settings**, click on the *Access Token* icon next to a service account (or click *Access Tokens* in the **Settings** panel on the left)
2. Find the service account in question in the Service Account Tokens panel and click the edit icon next to it
3. Check the boxes as required to assign the scope of the permissions you wish to grant the account
4. Click *Save Changes*
5. Copy the token next to the service account and save it somewhere - you will not be able to access it again in future.

You can now use this token to programmatically access the API via the service account, just as you would for any other account. Note that if you don't check any of the boxes the service account will not be able access the API at all. 

You can also adjust the scope of a service account token whenever you need to. Just click on the edit icon next to the token, adjust the scope and click *Save Changes*.

 You will only ever be shown a token once. If you lose a token, you will need to delete and recreate a service account to regain access to the API. This token grants access to any of the resources attached to the service account, so please be sure to keep it somewhere safe and reliable. If it is compromised or lost, please delete and recreate the service account to ensure your account remains secure. 

## Configuring notifications and webhooks

Unlike normal account notifications, service account notifications are set at **application** level, rather than at **account** level. They are also limited to Slack notifications because service accounts don't have (real) email addresses associated with them. You can also set up webhooks in the same way as notifications:

1. Create a service account & assign it permissions for the application
2. Open the application in question
3. Click *Settings* in the left-hand nav
4. Click the *Notifications* tab
5. Click on the *Switch User* dropdown at the top-right of the Personal Notifications panel and select the name of the service account you just created (if you can't see it, double check that you gave it the required permissions in Step 1)
6. Click on the Slack and webhook icons for the events you want to track 

With each webhook you will, of course, need to provide a URL that is called when the webhook is triggered.