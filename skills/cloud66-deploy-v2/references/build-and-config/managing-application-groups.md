# Managing Application Groups


## Overview

Application Groups are arbitrary collections of your applications that can be deployed simultaneously. Groups are not mutually exclusive - applications can exist in more than one group. 

## Adding Application Groups

Application Groups are managed via the main landing page (the application list page) of your Cloud 66 account. They are simply filtered lists of your existing applications.

To add an Application Group:

1. Log into your Cloud 66 Dashboard  
2. Click the *New Application Group* button in the right-hand column (under the *New Application* button)
3. In the side panel that opens, give your new Group a name
4. Choose the specific applications you wish to add to the group, or add all the applications that match a pattern (see below) or some combination of these two methods.
5. Click Create Group

You will now see that a new tab has been added to your application list page. This tab will list all the apps in the Group you just created. You can switch back to *All Applications* by clicking that tab.

### Using glob patterns for Groups

Rather than choosing individual applications, you can specify a [glob](../cloud-66-101/understanding-globs.md) that will match applications based on any one of the following selectors:

- `name` (i.e. name of the application)
- `branch` (i.e. name of the git branch used by the application)
- `environment` (i.e. environment of the application)
- `tag` (i.e. application's tag)

The format is `<selector>`:`<glob>` - for example `tag:*revamp*` will find **all** applications with a tag that contains the string "revamp". You cannot use multiple selectors in a single group.

## Deploying Application Groups

The main point of Application Groups is that they allow you to simultaneously deploy multiple applications. To do this:

1. Log into your Cloud 66 Dashboard  
2. Click on the Group's tab (on the application list page)
3. Click the *Deploy Group* button (top-right) and then click *Deploy All Applications*
4. In the panel that opens click *Deploy Group* to confirm

We will now attempt to deploy all the apps in the Group. You can monitor all of the deployments from the Group view, or click down into individual apps to see more detail. 

## Editing and deleting groups

To **edit** an Application Group:

1. Click on the Group's tab (on the application list page)
2. Click the Edit Group icon in the right-hand column
3. Make your required changes 
4. Click *Update Group*

To **delete** a Group, click on it's tab and then click Delete Group in the right-hand column. This deletes the group, but will not affect any applications in the group.