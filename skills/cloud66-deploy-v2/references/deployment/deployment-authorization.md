# Using Deployment Approval


## Overview

For applications where you want additional control over deployment you can use Deployment Approval to set a deployment lockdown strategy. There are currently three lockdown strategies available:

 -  **No Deployment Lockdown:**
   This is the default behavior and means that deployments will go through without any additional authorization.
 - **Anyone on your team:**
   This setting implies that deployments will only happen if *at least* two members on your project with deploy permissions agree to deploy your application. This is commonly known as "four-eyes authorization".
 - **Specific team members:**
   This setting implies that only a specific user (or users in this group) will have permissions to authorize (approve) deployment requests.

## Enabling Deployment Approval

To restrict deployment for an application:

1. Open your application via the Dashboard
2. Click on ⚙️*Settings* in the left-hand nav 
3. Click on *Deployment* in the sub nav
4. Click on the Approval tab 
5. Select the level of lockdown you require, and select authorized team members where needed.
6. Click *Save Lockdown Settings*

## How Deployment Approval works

If a deployment lockdown strategy is in place, then the "Deploy" button will be replaced with a "Request Deploy" button. Users with approval rights can then visit the application's Deployment Timeline, and approve or deny requests. The person who raised the request can also cancel that request here.

Once a deployment request is approved, the deployment will take place. The audit log and deployment history pages will list who raised the deployment request and who approved it.

## Cloud Lockdown

For larger organizations with multiple cloud keys and multiple departments requiring access to different cloud keys, we now allow deployment "targets" to be locked down at a user permission level for all users in your team. 

To assign and edit permissions:

1. Open your [Dashboard](https://app.cloud66.com/dashboard)
2. Click on your account avatar (top-right) and select *Account Settings*
3. Click on *Teams* in the **Account** panel on the left.
4. Click on the edit icon next to any user to edit their permissions and roles.

To specifically limit the deployment targets for any user, find the *Restrict deployment targets* field and select the  targets for which the user has rights.