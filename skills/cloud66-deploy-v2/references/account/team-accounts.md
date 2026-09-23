# Managing teams and organizations


## Using team accounts

Adding new users to your Cloud 66 account is a great way to work in a team, and access rights can be fine-tuned per application. Access levels range from no privileges on an application to full administrative privileges.

## User roles and permissions

The account administrator is the only user who can invite other members and change access rights for these members (unless this privilege is granted to another user). There are three types of users - _Finance users_, _Application (stack) users_ and _Service Accounts_ (please read our separate guide on [Service Accounts](../account/service-accounts.md)).
### Finance users

*Finance users* only have access to your *Payment* page, and can change billing information. They will automatically receive email payment notifications (successful and unsuccessful payments) and invoices, but have no access rights to applications.

 A finance user still needs to create a standard Cloud 66 account before they can access records or receive invoices and will be prompted via email to do so if they have not already. 

You can also opt to simply *cc* other email addresses whenever invoices are sent to you. To do this:

1. Open your **[Dashboard](https://app.cloud66.com/dashboard)**
2. Click on your account avatar (top-right) and select *Account Settings*
3. Click *Organizations* in the left-hand panel
4. Click on the name of organization you wish to update
5. Scroll down to the "**Copy invoices to**" field and add the addresses (separated by commas)
6. Click *Save*

### Application users

*Application users* have access rights to view and manage applications, and (depending on access level) to manage the entire Cloud 66 account. 

There are two levels of permissions:

1. Account-level permissions 
2. Application (AKA stack) level permissions

### Account-level permissions

These permissions are focused on global account settings like managing users, adding or removing cloud providers and setting notifications.

To set these permissions for a user:

1. Log into your Cloud 66 Dashboard
2. Click your avatar and then *Account Settings*
3. Click *Teams* (under *Collaboration*)
4. Click *Manage Team Members* 
4. Click the edit icon next to the user in question
5. Check or uncheck permissions as needed
6. Click Save Changes 

You can also use this page to manage application-level permissions (see below). 

### Application-level permissions and roles

Every user has a set of permissions *explicitly* assigned for applications, regardless of their account-level permissions. These are assigned when a user is added. If no permissions are added, the user will have no access to applications. Application permissions are set via roles.

You can specify the exact access rights you would like to grant a user per application by choosing a role for them. The available roles are:

- No role (i.e. not assigned to an app)
- Viewer
- Deployer
- Developer
- Operation
- Power user
- Administrator (has all permissions)

The **owner** of an account always has the maximum permissions for all applications and does not need to be assigned any roles. To move account ownership to another user, see [Changing the account owner](../account/change-owner.md).

The Administrator role has permissions to everything and the other default roles have the following permissions:

| Role / Perms | Viewer | Deployer | Dev | Ops | Power |
| --- | --- | --- | --- | --- | --- |
| View App |  |  |  |  |  |
| Deploy App |  |  |  |  |  |
| Edit App |  |  |  |  |  |
| Shell to Servers |  |  |  |  |  |
| Delete App |  |  |  |  |  |
| App Admin |  |  |  |  |  |
| View service.yml |  |  |  |  |  |
| Edit service.yml |  |  |  |  |  |
| View manifest.yml |  |  |  |  |  |
| Edit manifest.yml |  |  |  |  |  |
| View Firewall Rules |  |  |  |  |  |
| Edit Firewall Rules |  |  |  |  |  |
| View Network Redirects Settings |  |  |  |  |  |
| Edit Network Redirects Settings |  |  |  |  |  |
| View Network Traffic Settings |  |  |  |  |  |
| Edit Network Traffic Settings |  |  |  |  |  |
| View ActiveProtect |  |  |  |  |  |
| View Environment Variables |  |  |  |  |  |
| Edit Environment Variables |  |  |  |  |  |
| View App Info |  |  |  |  |  |
| Edit App Info |  |  |  |  |  |
| View Deploy History |  |  |  |  |  |
| Revert Deployment |  |  |  |  |  |
| Edit Notification Channels |  |  |  |  |  |
| View Live Logs |  |  |  |  |  |
| Edit Stack Settings |  |  |  |  |  |
| Scale Stack |  |  |  |  |  |
| Download SSH Key |  |  |  |  |  |
| Download SSL Cert |  |  |  |  |  |
| Manage Containers |  |  |  |  |  |
| Access APN |  |  |  |  |  |

These roles can be edited, and custom roles can also be created. We recommend creating custom roles rather than editing the defaults. The account owner always has full access to all settings on all applications.

By definition, any user with access to an application will automatically be given the rights for the lower levels of permissions. For example, a user who can deploy an application will also be able to view the same application. 

### Assigning application roles to a user

To assign a user permissions for an application:

1. Log into your Cloud 66 Dashboard
2. Click your avatar and then *Account Settings*
3. Click *Teams*
4. Click the edit icon next to the user in question
5. Scroll down to find the application in question and click on the multi-select box
6. Choose the role you want the user to have for the application
7. Click Save Changes 

You can also quickly assign a user the same role on **all** your application by clicking on the **Default Roles** multi-select, selecting the desired role and then clicking the *Copy roles to ALL existing Applications* link. This will also set the user to use this default role for any new applications created on the account. 

### Creating and editing roles

You can customize the default permissions for the existing roles (not recommended) or create custom roles for your account.

To create a custom role:

1. Log into your Cloud 66 Dashboard
2. Click your avatar and then *Account Settings*
3. Click *Teams*
4. Click the *Roles & Permissions* tab (top of the main panel)
5. Click the green + button to add a role
6. Give it a name and click Save Role

To edit the permissions for a role:

1. Follow 1 - 4 above 
2. Scroll down and use the dropdown to select the role to edit
3. Check the boxes next to the permissions you wish to add (or remove)

Editing the permissions for a role will change the permissions for all existing users assigned that role. Be cautious when doing so. 

## Add a new user (team member)

1. Open your [Dashboard](https://app.cloud66.com/dashboard)
2. Click on your account avatar (top-right) and select *Account Settings*
4. You need to give your team a name before inviting other members. This is the same as your _Company name_ on the _Payments_ page. If you already have entered a company name, you will skip this part.
5. Click on _Team_ in the left-hand panel
6. Click the **+** button in the top right corner. This will allow you to choose a user type (Application or Finance user), input an email address and set the users permissions and its default role for applications.

An email will be sent to the email address specified, giving this user the option to sign up for Cloud 66 with their specified email address. If the invited email already has a Cloud 66 account, they will be notified of the pending invitation. By accepting the invitation, they will join your team.

## Deleting user accounts & teams

If you are the **owner** of an account you can remove (delete) secondary accounts from your (primary) organization and also delete any teams under that organization. 

To delete users:

1. Open your **[Dashboard](https://app.cloud66.com/dashboard)**
2. Click on your account avatar (top-right) and select *Account Settings*
3. Click *Teams* in the left-hand panel
4. Click the red *remove* icon next to the users you want to remove (and confirm each one)

To delete teams:

1. Follow steps 1 - 3 above
2. Click the red *remove* icon next to the names of the teams you wish to delete

## Creating and managing Groups

Groups allow you to create subsets of users within a team. This is useful for setting some users’ access tokens to expire within a specified time period. To add a Group:

- Open Account Settings
- Click on Groups in the Collaboration panel
- Click the *+ Add Group* button (top right of the main panel)
- Name the the Group and add a description if needed
- Select the members of the team to add to the Group
- Set the expiry time for their access tokens (optional - leaving it empty will set tokens to never expire)
- Click Create Group

You can also edit Groups by clicking on their names in the list, or delete them by clicking the trashcan icon next to their names and confirming the deletion.

## Switch organizations

If you are part of several organizations, you will have to switch organization to see applications that belong to a different organization. 

To switch between organizations, click on your account avatar (top-right) and and select the name of the organization you would like to switch to.

## Leave a team

To leave a team, visit the _Account Settings_ page, then click _Organizations_. Next, find the organization you would like to leave, and click the _Leave_ button.

You cannot leave your primary organization (the one you own).