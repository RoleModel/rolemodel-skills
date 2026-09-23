# Deploying your first app


## What you’ll need

Before you start, please check you have the following:

- **A Cloud 66 Account** — If you don’t already have one, [sign up for a Cloud 66 account](https://app.cloud66.com/users/sign_up). Your first server is free, no credit card required.
- **Application code and/or pre-built images** — Application code should be hosted in a (secure) publicly accessible git repository and pre-built images should be hosted in image publicly accessible repositories.
- **An account with a supported cloud provider or your own servers set up** — Cloud 66 supports a range of cloud providers. Select your preferred provider from the dropdown under Step 4 below.

If you don't have images or code ready, you can use this [simple visit counter application](https://github.com/cloud66/maestro-demo.git) we've created on Github.

Once you're ready, click the green *New Application* button to start the process.

We support every version of Rails from 2.6.3 and upwards, including versions 6.x.x The version installed during deployment is based on the requirements of your application. Versions earlier than 2.6.3 *may* work but will have some compatibility issues with Ubuntu 18.04 and 20.04.

## Step 1: Choose a source

The first thing we need is access to your code, so that we can build and deploy it for you. Click the tab below which best suits your needs:

## Step 2: Define your application

Now that we have access to your git host, you can tell us which repo you want to deploy:

1. Choose the repo you want to deploy and set the branch
2. Choose an environment for your application
3. Give your application a name (this will be used to label your application throughout the Cloud 66 dashboard, and will not be visible to public users.)
4. Click *Analyze* - we will now scan your repo and suggest the optimal settings

## Step 3: Configure and build

Once the analysis is complete you'll see a yellow Information Box that you can use to verify the analysis is correct.

If there are any problems you can make changes and click **Reanalyze my code**. If necessary, you can also add environment variables.

In App Configuration you can make changes to application configuration parameters.

* **Ruby Version** &mdash; That your app is using.
* **Framework Info** &mdash; This allows you alter information about asset pipeline precompilation and whether you want to run `rake db:schema:load`.

### Add and confirm environment variables 

During initial analysis we automatically generate environment variables based on the framework and components used by your app, but you can also add your own by clicking the *Add environment variables* link above the main panel.

Additionally, if we detect environment variables used directly in your code, we will present you with a list of the detected variables. Here you can either supply values for the variables, check the *Allow empty value* box (we will save the variable with a blank value) or, delete them (in which case we will then ignore them).

Once your app is completely configured, click the *Next →* button.

### Static generation or server-side rendering?

If we detect that your application uses Svelte we will ask you to confirm whether your application is **statically generated** (AKA prerendered) or uses **server-side rendering**.

Statically generated applications are rendered entirely during the build process and then then deployed as flat files. For applications that are rendered server-side, the application code runs on the server and renders pages as required. Apps that use server-side rendering *will not build* if you attempt to deploy them using static generation methods, and vice versa.

If you’re unsure of which kind of app you have, you should [read the official documentation](https://kit.svelte.dev/docs/page-options) and examine your code to confirm before you try to deploy.

### Add more services 

If you need to add another service to your app that is not included in your Dockerfile:

1. Click the *+ Add New Service* button at the top right of the **Services** panel
2. Name the service
3. Specify a source for the service. This can be a Github repo, or any other git repo, or an image repository (for pre-built images)
4. Click *Analyze Source*.

You’ll need to configure each service using the steps below.

### Configure services

Next we need to configure network access and (where needed) storage for each of your app's services. You can also specify how many instances of each service you'd like to run and a variety of other custom settings.

#### A. Configure ports

To configure the internal and external ports for a service:

1. Click the *Configure Ports* link in the **Network** column
2. Set the **Container Port**, **HTTP Port** and **HTTPS port**
3. You can also add traffic matching arguments if needed
4. Click *Save Service*

If you're using our sample application you should set the HTTP port to `80` and the Container port to `5000`.

This settings panel is used for both networking and storage options - so you can configure them simultaneously if you'd prefer.

#### B. Configure storage 

To configure storage volumes for a service:

1. Specify the path inside the container where the storage will be mounted
2. Specify the path on the host server where the data will actually be stored
3. You can use the Add Volume button to specify additional storage volumes

Once all your storage volumes are configured, click *Save Service*.

#### C. Set the desired number of instances 

To add instances of a service:

1. Click on the number in the **Desired instances** column
2. Change the number in the **Desired Count** input box
3. You can also add a start command to your service if required
4. Click *Save Service*

### Add and confirm environment variables 

During initial analysis we automatically generate environment variables based on the framework and components used by your app, but you can also add your own by clicking the *Add environment variables* link above the main panel.

Additionally, if we detect environment variables used directly in your code, we will present you with a list of the detected variables. Here you can either supply values for the variables, check the *Allow empty value* box (we will save the variable with a blank value) or, delete them (in which case we will then ignore them).

Once your app is completely configured, click the *Next →* button.

Once the analysis is complete you’ll see a yellow information box that you can use to verify the analysis is correct.

If there are any problems you can make changes and click **Reanalyze my code**. If necessary, you can also add environment variables.

## Step 4: Add a cloud provider

### A. Configure access to your cloud provider

We need access to your cloud account in order to provision and manage servers on your behalf. How you configure that access differs from provider to provider. Select your cloud provider from the dropdown for more help.

We need access to your cloud account in order to provision and manage static sites on your behalf. How you configure that access differs from provider to provider. Because static sites rely on object storage, some of our cloud providers do not currently support static site deployments.

Select a cloud provider from the dropdown for more help.

### B. Add your cloud provider as a deployment target

To add your cloud credentials click the *Add a Deployment Target* button. This will open a panel that will enable you to grant Cloud 66 access to your provider.

Click the green *Add Deployment Target* button once complete.

### C. Specify servers

Next you need to specify where your servers will be situated, how large they should be, and where your data will be stored:

1. Choose a **Server Region**
2. We will suggest a size for your application server - you can change it as needed
3. Specify whether your datastore will share the app server (not recommended for Production), or have its own server. You can also use an existing [external database server](../databases/database-management.md#no-database-external) if you prefer.

If you're using our sample application you will need to set up a Redis instance at this point.

    
    If you are deploying on one of the Deploy v3 supported cloud providers, you will now have the option to choose which version of Cloud 66 Deploy to use.
    To find out more about the differences between the two versions, please visit the [Deploy v3 documentation](../getting-started/deploy-v2-vs-v3.md).
    

Our customization section has more details on the available options.

## Step 5: Deploy your app

When you’re satisfied with your configuration, click the *Start Deployment* button. During the build and deployment process you can view the log to see what’s happening behind the scenes.

You can also close the window and come back later. We will email you once the application is deployed (or if it fails).

The full build and deployment process may take 15 minutes or more because Cloud 66 needs to provision components and resources from the ground up. You can close the window and we will send you an email when the deployment is complete.

### Server build states

In order to allow you to start working with your new app as soon as possible, there are two build states (or stages) for application servers:

1. [Ready](../servers/server-build-states.md#ready-servers) - server is available to use, with the minimum required configuration
2. [Optimized](../servers/server-build-states.md#optimized-servers) - all the latest packages are installed & optimized

## Customizing your app

If your application relies on specific components or non-standard settings or package versions then you can easily customize your configuration to match your requirements.

The method you use to configure a component depends on the nature of the customization. The table below will help you find the right tool:

| Customization required | Configuration tool |
| --- | --- |
| Specific versions of a framework or package | [Manifest file](../manifest/what-is-a-manifest-file.md) |
| Cloud-provider-specific settings for servers (e.g. security groups, subnets) | [Manifest file](../manifest/what-is-a-manifest-file.md) |
| Component configuration (e.g. database engine config files) | [CustomConfig](../custom-config/custom-config.md) |
| Environment Variables  | Dashboard or [Toolbelt](../toolbelt/using-cloud66-toolbelt.md) |
| Non-standard Linux packages or libraries | [Deploy hooks](../deploy-hooks/deploy-hooks.md) |
| Running multiple database types or versions (groups) | [Manifest file](../manifest/what-is-a-manifest-file.md) or Dashboard |

| Customization required | Configuration tool |
| --- | --- |
| Specific versions of a framework or package | [Manifest file](../manifest/what-is-a-manifest-file.md) |
| Environment Variables  | Dashboard or [Toolbelt](../toolbelt/using-cloud66-toolbelt.md) |