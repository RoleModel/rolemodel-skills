# Adding Datadog to Cloud 66


## Overview

[Datadog](https://www.datadoghq.com/) is natively integrated with Cloud 66. You can add it to your Cloud 66 account via the web Dashboard. We will handle the installation and integration with your application. All you need to get going is:

- An active Cloud 66 application
- A Datadog account
- A Datadog API key ([how-to](https://docs.datadoghq.com/account_management/api-app-keys/#add-an-api-key-or-client-token))

We support a variety implementations from basic (just Metrics) to full which includes Metrics, Logs, APM (Application Performance Management) and Processes, NPM & Security (containerized apps only). 

## Enabling Datadog on your account

To enable Datadog on your account:

1. Log into your [Dashboard](https://app.cloud66.com/) and open an app you wish to monitor
2. Click on *Settings* in the left-hand panel
3. Click on *Integrations* in the sub-menu that opens
4. Click the *Add Datadog Account Details* button 
5. Add your API key and choose the Datadog site you use (.com or .eu)
6. Click *Save*

You will taken back to the **Integrations** section of your app where you can activate the integration. To do this:

1. Click the Add Integration button
2. Choose the type of installation you require (we install Metrics by default - all other features are optional)
3. Click *Save* 

We’ll now install Datadog on your app - you should see metrics begin flowing within a few minutes of installation (depending on how much traffic your app receives).

### Enabling Datadog on other apps

Once you’ve enabled Datadog on your account, integrating it with your other apps is a quicker process. 

1. Log into your [Dashboard](https://app.cloud66.com/) and open an app you wish to monitor
2. Click on *Settings* in the left-hand panel
3. Click on *Integrations* in the sub-menu that opens
4. Click the *Add Integration* button
5. Choose the type of installation you require (we install Metrics by default - all other features are optional)
6. Click *Save* 

## Excluding Nginx logs from Datadog

By default the Datadog integration will collect all the logs from your application, including those from Nginx. If you’d prefer to exclude Nginx logs from your Datadog account:

1. Add the following environment variable to your application:
   ```bash
   DD_CONTAINER_EXCLUDE_LOGS=kube_namespace:^datadog$ kube_namespace:^kube- name:nginx
   ```
2. Edit the Datadog integration on your application, and save it again, which will cause it to be re-installed.

Note that this env_var actually already exists by default with the default value: `kube_namespace:^datadog$ kube_namespace:^kube-`, and excludes logs generally considered unhelpful (from Kubernetes and Datadog itself). All we are doing here is explicitly adding `name:nginx` so that logs with file paths including “nginx” will *also* be excluded from Datadog.

## Updating a Datadog integration

If you need to add or remove Datadog features from an app: 

1. Log into your [Dashboard](https://app.cloud66.com/) and open the app
2. Click on *Settings* in the left-hand panel
3. Click on *Integrations* in the sub-menu that opens
4. Click the *Edit Configuration* link
5. Update your integration settings
6. Click *Save Changes*

## Removing Datadog from an app

To remove Datadog:

1. Log into your [Dashboard](https://app.cloud66.com/) and open the app
2. Click on *Settings* in the left-hand panel
3. Click on *Integrations* in the sub-menu that opens
4. Click the trashcan icon to delete the integration 

We will now uninstall Datadog from your app. 

## Updating your Datadog API key

To update your Datadog API key:

- Log into your [Dashboard](https://app.cloud66.com/) and click your avatar (top right)
- Select *Account Settings*
- Click on *External Services* in the **Settings** panel on the left
- Click on the **Datadog** tab at the top of the main panel
- Click *Edit Account Configuration*
- Add the new API key and click *Save*

You can also delete your Datadog settings completely using this page, if you prefer.