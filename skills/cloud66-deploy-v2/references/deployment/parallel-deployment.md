# Choosing a deployment strategy


## Overview

Whenever you update your application code, you can adjust two aspects of the way it is updated:

1. How the updated code is pushed to your servers (the **deployment strategy**) 
2. How the updated version is shown to customers (the **rollout strategy**) 

This guide is concerned with the first aspect - how the new code gets to your servers. 

If you need help with the second aspect - how the new version of your application is presented to your customers - please read our separate [guide to rollout strategies](../deployment/rollout-strategies.md).

## Types of deployment strategies

Your application's deployment strategy dictates how we push changes out to your servers. There are three strategies available:

1. Serial deployment
2. Parallel deployment 
3. Rolling deployment 

We cover how to set the strategy for your application, as well as the [pros and cons](#pros-and-cons-of-each-deployment-strategy) of each strategy below. 

Cloud 66 defaults to the safest available deployment strategy for your web server. For webservers that support rolling restarts (Puma, Unicorn, Passenger Enterprise) we will default to parallel deployment. For Passenger Community, we will default to serial. You can override this decision at any point choosing any of the available strategies.

Cloud 66 supports two deployment strategies:

1. Parallel (default)
2. Fast

When you deploy in **parallel**, all the deployment tasks for the servers in your application will run in parallel. You will redeploy the entire application - including all code, pre-built images and configurations.

**Fast** Deployments *only* push changes to code and/or images.

## Fast Deployments

Fast Deployments are designed to quickly push out changes to the code of your application (for instance via a continuous deployment pipeline). When you enable Fast Deployment for an application, we will:

- Build your code into images AND/OR
- Apply updated images to services
- Run the `deploy_command` (ie. for DB Migrations)

If you have made any other changes to your application apart from changing the code, a fast deploy will not capture those changes. It is not intended to handle structural or configuration changes.

## Changing your application's deployment strategy

There are three ways to set a deployment strategy for an app:

1. Using the Dashboard and selecting "Deploy with options"
2. Creating a deployment profile that defines a strategy
3. Setting deployment strategy using Cloud 66 Toolbelt

### Using "Deploy with options"

You can trigger a deployment that uses any of the three strategies by clicking the *Deploy* button on your **application** page and choosing *Deploy with Options*. This will allow you to choose between the three strategies. 

*This will only apply to the current deployment* - it does not change the default deployment strategy for your app.

You won't be given the option to choose a deployment strategy unless you have multiple servers.

### Using a deployment profile

Deployment profiles allow you to customise how your app will be deployed, including the deployment strategy it should use. 

To **create** a profile:

1. From your app dashboard, click on the green *Deploy* button and then the *Create New Profile* link.
2. Name the profile
3. Choose a deployment strategy
4. Choose which components will be deployed (optional)
5. Define upgrade settings (optional)
6. Save the profile

To **deploy** using a profile:

1. From your app dashboard, click on the green *Deploy* button 
2. Click on the name of the profile you'd like to use for this deployment

For more information on deployment profiles, please read [our reference guide](../deployment/deploy-profiles.md).

### Using the Toolbelt (command line)

You can use Toolbelt to set the deployment strategy for an application. The command is `cx setting set deploy.strategy <strategy>` and valid values for the `strategy` parameter are:

- `serial`
- `parallel`
- `rolling`

This is a **persistent change** to your app's deployment strategy - the app will use this strategy for all future deployments (until you change this setting).

You can also trigger a Fast Deployment using Cloud 66 Toolbelt using the following command:

```shell
cx stacks redeploy --deploy-strategy fast
```
If you're planning to use this strategy regularly, you should consider creating a [deployment profile](../deployment/deploy-profiles.md) to make triggering Fast Deployments quicker. You can do this via the *Deploy with Options* menu by clicking the *Save these deployment options?* link. 

Remember you can also trigger deployment profiles using Toolbelt:

```shell
cx stacks redeploy --deployment-profile my-fast-deploy
```

## How deployment strategies work

All the deployment strategies have a few things in common:

- Database migrations always occur first, regardless of strategy. Given that some of your servers will be running legacy code for a (hopefully short) period, you should follow best practice around migrations. For example, don't delete columns/tables that are currently in use by legacy code.
- By definition all three strategies require at least some of your servers to be unavailable during deployment - the only difference is how many servers, and for how long. If your application has no redundancy, we strongly recommend scaling your application up (even temporarily).

If you're planning to use parallel or rolling deployments, we recommend [adding health checks](../servers/application-health-checks.md#deployment-success-checks) to your deployment process. 

### Serial deployment

In this strategy we deploy to each server one at a time. We take each server off the load balancer and then add it back once the deployment has succeeded. If a server fails to deploy we will halt the process and alert you. 

### Parallel deployment

In this strategy we deploy to all your server simultaneously. Servers are not taken off the load balancer. If your webserver does not support zero-downtime reloads you will most likely have some downtime while your application reloads.

### Rolling deployment

In order to use rolling deployments, your application needs:

- A load balancer
- At least four servers (not including the load balancer)…
- …two of which **must be web servers**

Rolling deployments work as follows:

1. Your servers are split into two groups based on a heuristic that takes factors like server size into account. The groups are balanced by server load and role (as far as possible).
2. The first group is taken off the load balancer, deployed to in parallel, then added back to the load balancer
3. If the first group deploys successfully, the second group will then be taken off the load balancer, deployed to in parallel, then added back
4. If either group deployment fails, it will not be added back to load balancer and deployment will stop.
5. When deploying again, the previously failed group (if present) will always go first

You can [tag your application servers](../servers/tagging-components.md) as either `c66.deployment.group.sapphire` or `c66.deployment.group.emerald` to indicate your preference for grouping.

 We strongly recommend adding [deployment success checks](../servers/application-health-checks.md#deployment-success-checks) to your application to help catch a wider range of errors (i.e. errors that may not disrupt code deployment but that nonetheless break your application). 

## Pros and cons of each deployment strategy

|Strategy|Pros|Cons|
|--- |--- |--- |
|Serial|The safest option - only one server is ever affected|The slowest option with a long period of overlap between old and new code being served|
|Parallel|The fastest option with a very brief overlap of old and new code being served|The riskiest strategy - a bad deploy can impair all your servers. Will result in some downtime for webservers that don't support live reloads|
|Rolling|A balance between safe and fast. Very brief overlap of old and new code being served|Requires at least 4 servers and a load balancer. Half your servers will be unavailable during deployment so load on the application needs to be managed carefully|

## Coping with load balancer configuration lag

Load balancers - particularly native cloud load balancers - can be prone to configuration lags. In other words, they can sometimes report that they have removed a server whereas, in reality, some traffic is still being routed to that server for a few seconds or minutes. 

This can also work in the opposite direction - the load balancer may report that it has added a server but it does not actually begin routing traffic to a server for a short period.

For many lag-tolerant applications this short delay does not matter, but some applications are more sensitive and can suffer adverse affects from this configuration lag.

If your application is "lag-sensitive" we recommend adding short delays to your [load balancer configurations](../manifest/_load-balancer-aws.md). You can do this using the **`wait_after_adding_servers`** and **`wait_after_removing_servers`** options under the load balancers section of your application's [manifest file](../manifest/_load-balancer-aws.md).

Bear in mind that adding these delays can slow down the deployment process significantly. For **serial deployments** the additional delay will be: 

*(wait time per server)x(number of servers) = (extra deployment time).* 

If you use this option in your manifest, subsequent deployments will use the value set. To remove this delay, set the value to `0` in your manifest, and then redeploy. Simply deleting this value from your manifest will not result in removing the setting once it has been applied.

## Serial deployment

In this strategy we deploy to each server one at a time. We take each server off the load balancer and then add it back once the deployment has succeeded. If a server fails to deploy we will halt the process and alert you.