# Using Preview Deployments


## Overview

Preview Deployments are automatically generated deployments of newer versions of your application code that run alongside your active application. They are designed to allow you to quickly test changes to your application code without having to deploy to a separate environment. 

Preview Deployments are triggered by changes in the git repository of your application - this means that simply pulling new code into your repo can automatically update your Preview (depending on your settings).

Previews run on separate, unique subdomains and they are only visible via those URLs.

Applications created on Cloud 66 before June 2024 may need to be updated before they can use this functionality. [See below for more details](#preparing-existing-applications-for-previews).

 Preview Deployments only apply to your applications **web components**  - they use the same database(s), and the same environment variables, components and manifest settings as the base application. They are *not* a truly separate instance of your application and should not be treated as such.  

## Types of Preview Deployments

We support three kinds of (mutually exclusive) Preview Deployments:

- **Branches** - creates new Preview Deployments based on git branch names
- **Tags** - creates new Preview Deployments based on git tag names
- **Pull Requests** - creates & removes Preview Deployments based on git pull requests

Both **branches** and **tags** can be matched using the [glob format](https://en.wikipedia.org/wiki/Glob_(programming)) - so, for example, if you specify `feature*` as your branch name, we will create a Preview for any branch with the word "feature" in it.

## Previews & database migrations

Preview Deployments run database migrations if needed. As such, **please be sure that any database changes are backward-compatible**, as both the "active" application and the Preview will be use the newly migrated database.

## Enabling and disabling Preview Deployments

By default Preview Deployments are disabled. You can enable Preview Deployments via you Cloud 66 Dashboard:

1. Log in and click on your application
2. Click the *Previews* tab above the main panel
3. Click the *Set Up Previews* button
4. Select the method of Preview Deployment you prefer
5. If you select **Branches** of **Tags**, you will need to specify at least one name (or [glob](../cloud-66-101/understanding-globs.md)) to match. You can also specify a branch name for **Pull Requests** but this is optional. 
6. Click *Save*

Once you have enabled Previews for your application, you will need to [enable previews](#setting-up-previews-on-git-hub) with your git provider to complete the setup.

## Enabling and disabling Preview Deployments

By default Preview Deployments are disabled. You can enable Preview Deployments via you Cloud 66 Dashboard:

1. Log in and click on your application
2. Click on *Application* in the left nav
3. Click on the *+ Set Up Previews* button below the main Services panel
4. Select the method of Preview Deployment you prefer
5. If you select **Branches** of **Tags**, you will need to specify at least one name (or [**glob**](https://help.cloud66.com/docs/cloud-66-101/understanding-globs)) to match. You can also specify a branch name for **Pull Requests** but this is optional.
6. Click *Save*

Once you have enabled Previews for your application, you will need to [**enable previews**](#setting-up-previews-on-git-hub) with your git provider to complete the setup.

### Disabling Previews

To disable Previews, follow the same process but select **No Preview Deployments** instead. Note that this will not remove any Previews currently deployed on your servers. To delete Previews, [see our guide below](#deleting-previews).

## Triggering Preview Deployments via your git provider

If you have connected your GitHub account to your Cloud 66 account, we will automatically trigger Preview deploys based on your Preview settings. 

For other git providers, you need to add a webhook URL to your account or repo. You can find the redeployment webhook URL on the Deployments settings page (under ⚙️ *Settings → Deployments*). Copy the URL and then use it to set up the automation with your git provider.

## Monitoring Preview Deployments

Whenever a Preview Deployment is underway, a link will appear on the Previews page that will allow you to follow the logs for that deployment. 

If the deployment fails for any reason we will keep the logs, otherwise we will discard them after the deployment is complete.

## Browsing and managing Previews

To see all active Previews open your Dashboard and click the *Previews* tab (above the main panel). This lists all the Previews currently running on your servers, which branch of your code they originate from, and the most recent commit hash.

To browse a Preview click on the *Preview* link for the branch you wish to browse - this will open the unique subdomain on which your Preview is hosted. 

You can use this URL to share the Preview with people outside of your team, but it should not be made public or used in any DNS settings.

### Redeploying Previews

You can manually trigger the redeploy of a Preview by clicking the icon next to it. Bear in mind that we this will redeploy the current commit. 

### Deleting Previews

You can use this interface to delete old or unwanted Preview Deployments. To do so, click on the trash can icon next to any Preview to delete it. Remember that if you push code to the same branch again, you will also spawn the Preview again.

## Monitoring Preview Deployments

Whenever a Preview Deployment is underway, it will appear in the Deployments timeline. You can click on the link to see logs of the deployment process.

## Browsing and managing Previews

To see all active Previews open your Dashboard and click the switch just below the latest deployment date (above the main panel). This switch won’t appear unless you have active Previews.

This will open a list of all the Previews currently running. To browse a Preview: 

1. Click the name of the branch 
2. Click the *Visit Preview* link. This will open the unique subdomain on which your Preview is hosted.

You can use this URL to share the Preview with people outside of your team, but it should not be made public or used in any DNS settings.

### Deleting Previews

To delete old or unwanted Previews, switch to that Preview and click on the trash can icon in the top panel to delete it. Remember that if you push code to the same branch again, you will also spawn the Preview again, unless you update the app’s Preview settings.

While we do not limit the number of Previews an app can have, we strongly recommend against having more than a few at any time. By their nature, Previews require resources to run (RAM, CPU cycles etc.) and thus reduce the capacity of your application to serve your visitors.

### Deleting Previews using Cloud 66 Toolbelt

You can also list and delete unwanted Previews using the Cloud 66 Toolbelt (cx) to do this use the following commands:

```bash
cx stacks variants list -s my-stack --type preview  # Lists previews with UIDs

cx stacks variants delete [UID] -s my-stack # Deletes a preview by UID
```

## Preparing existing applications for Previews

Applications created on Cloud 66 before June 2024 may need to be prepared before they are able to use Previews - particularly if those applications have [**custom Nginx configuration files**](https://help.cloud66.com/docs/servers/nginx#customizing-nginx-configurations).

Before using Previews with your existing application, you should:

1. Check that there are no [**Application Updates**](https://help.cloud66.com/docs/build-and-config/application-updates) that need to be applied
2. If you have made modifications to the Nginx config for your application, follow the steps below.

### Migrating your customized Nginx file

Supporting Previews requires an upgrade of Nginx as well as a new Nginx configuration. If you have made changes to your Nginx configuration, you can follow these steps to ensure your changes are not lost when the Application Updates run.

1. Copy your customized Nginx file to a local file for backup and reference
2. Reset the your configs to default using the button on the page, but don’t apply them
3. Add your changes manually to the new file
4. Commit the new file