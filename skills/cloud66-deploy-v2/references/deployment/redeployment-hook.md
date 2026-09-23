# Using redeployment hooks


## Overview

Redeployment hooks allow you to achieve continuous deployment by deploying your application whenever you push a change to your Git repository or when your continuous integration pipeline builds successfully.

Cloud 66 offers several methods for achieving continuous integration. Please read our [continuous integration guide](../deployment/continuous-deployment.md) to compare and select the ideal method to suit your requirements.

## Accessing redeployment hooks

A unique redeployment hook URL is automatically generated for each Cloud 66 application. To access it:

1. Open the application from your [Dashboard](https://app.cloud66.com/dashboard)
2. Click on ⚙️ *Settings*  in the left-hand nav
3. Click on *Deployment* in the sub nav
4. Copy the hook URL from the **Redeployment Hook** row

You can use the Redeployment Hook URL to trigger automated deployments via your preferred Git or CI service.

### Usage example

An example of a standard redeployment hook:

```shell
https://hooks.cloud66.com/stacks/redeploy/xxxx/yyyy
```

 The xxxx/yyyy in the examples is for illustrative purposes only and should be replaced with your redeployment URL on your Application Information page. 

## Services modifiers

You might have multiple services which rely on a combination of images or Git sources. Furthermore, the Git sources can be the same or different branches, or even completely different repositories. 

To handle this you can append your redployment hook with a  _services modifier_ as a query string parameter.

### Usage examples

An example redeployment **hook with a single services modifier:**

```shell
https://hooks.cloud66.com/stacks/redeploy/xxxx/yyyy?services=my-web-service
```

An example redeployment **hook with a many-service modifier:**

```shell
https://hooks.cloud66.com/stacks/redeploy/xxxx/yyyy?services=my-web-service,api
```

### How service modifiers work

When a redeployment hook is invoked:

* If the commit hook payload **includes Git information** (Git source, branch and/or reference) then we will attempt to find a matching service on your application that corresponds to this, and build that service. We will deploy _only_ the services that have a Git type (_not_ the image-based services).

* If the commit hook payload **does not include Git information**, then we will automatically redeploy _all_ services defined on your application.

* If you use the services modifier to **specify specific services** to deploy, then the same logic applies as in 1) and 2) above, the only difference being that we will only deploy the services you have specified.

 In the case where the payload of the commit hook does not contain any branch information (Github and Bitbucket payload formats are supported) then the application will redeploy without attempting to match branch. 

## Calling a deployment profile via a redeployment hook

[Deployment profiles](../deployment/deploy-profiles.md) allow you to customise the deployment process depending on your requirements - for example deploying some components and not others. You can also call deployment profiles directly via redeployment hooks using the following syntax:

```shell
https://hooks.cloud66.com/stacks/redeploy/xxxx/yyyy/?deployment_profile=name_of_deployment_profile
```

The name of the profile can be found via your app Dashboard under ⚙️ *Settings* &rarr; Build & Deployment Profiles. If your deployment profile's name has spaces in it, you should replace each space with either `+` or `%20`. 

## Github integration

Users who have signed in through Github (and who have enough access to create and edit deployment events for their applications on GitHub) can activate continuous deployments on GitHub. 

To do this: access your [Application settings](../toolbelt/_settings-set.md) via the toolbelt and set **continuous.deploy** to _true_.

```shell
$ cx settings set -s my_app_name continuous.deploy true
```

This will create a new webhook for your repository on GitHub or simply modify an existing one to let Cloud 66 receive _deployment_ events as well.

If you edit your webhooks manually on Github, they must be configured to be triggered by both *Push* and *Deployment* events in order for continuous deployment to work.

With this feature enabled, whenever you push a new commit, Cloud 66 will automatically generate a new _deployment event_ based on receiving the _push event_ from GitHub. We will also send _deployment status events_ on different deployment statuses, such as started, canceled, succeeded and failed.

 The deployment event will be created with the same environment as your application. 

## Adding redeployment hooks to your pipeline

The process of adding the hook differs by Git host, so we will guide you through doing this with GitHub, Bitbucket and a generic solution.

### GitHub Setup

On your application, click *Settings* in the right sidebar and then the *Information* tab. Then copy the URL provided in the _Redeployment hook_ field. 

Next, visit your GitHub repository, click _Settings_ in the right sidebar, and then _Webhooks & Services_ in the left sidebar.

In the _Webhooks_ window, click _Add webhook_ and paste the redeployment hook URL into the _Payload URL_ field. When you confirm by clicking _Add webhook_, GitHub will automatically test your hook with a _Ping_ and you should get a green HTTP200 response.

### Bitbucket Setup

On your application, click *Settings* in the right sidebar and then the *Information* tab. Then copy the URL provided in the _Redeployment hook_ field.  

Next, visit your Bitbucket repository, click _Settings_ in the left sidebar, and then _Hooks_ in the settings menu that appears. In the _Select a hook_ field, select a _POST_ hook, click _Add hook_ and paste your redeployment hook URL into the field provided. Click _Save_ to confirm.

### Generic Setup

Most Git providers have a commit hook mechanism that you can use to post to the Cloud 66 redeployment hook URL. Please check your Git provider documentation for this information. If your Git provider has a non-conforming payload format (not compatible with Github or BitBucket formats) then please get in touch and we can extend our payload support!

### Invoking your redeployment hook manually

To invoke the redeployment hook manually, you can POST an HTTP request to your redeployment hook URL. You can do this in curl like this:

```shell
curl -X POST [your redeployment hook URL]
```

You can also use your redeployment hook to deploy a specific git ref/SHA as with the following example:

```shell
curl -X POST [your redeployment hook URL]?git_ref=...
```

 If you are manually invoking redeployments you should consider using [Cloud 66 Toolbelt](../toolbelt/_redeploy.md) instead, as it has additional features!