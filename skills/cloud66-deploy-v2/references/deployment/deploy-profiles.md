# Using deployment profiles


## What are deployment profiles?

Deployment profiles enable you to customise the deployment process depending on the situation. For example, you may only want to deploy your front-end servers, and leave your  databases undisturbed. Rather than manually setting this up each time you need it, you can save it as a profile.

## Creating a deployment profile

To create a new deployment profile: 

1. Log into your Cloud Dashboard and open any of your apps
2. Click on the green Deploy button (top right) and select Create New Profile
3. Name your Deployment Profile
4. Configure it as needed
5. Click Save Profile

## Using a deployment profile

You can use a deployment profile:

- Via the Dashboard by clicking on Deploy and selecting the profile name
- Via redeployment hooks ([see below](#calling-a-deployment-profile-via-a-redeployment-hook))

## Option for deployments

### Git branch or Tag to Deploy

You can set a profile to deploy a specific Git branch or Tag. If you don’t see the branch or tag in the list, click the reload button next to the dropdown to fetch the latest info from your git repo.

### Build / Publish Services

Under this section, you can see all your services are listed. You can choose one or both of the following operations for each service.

- **Build**:     Builds the code into a docker image.
- **Publish**:   Push the built image to servers.

### Deployment strategy

- **Parallel Deployment**: Complete deployment of all services
- [**Fast Deployment**](../deployment/parallel-deployment.md#fast-deployments): Deploys only changes to code and/or images.

- **Parallel Deployment**: Deploy to all your servers simultaneously
- **Serial Deployment**:   Deploy to your servers sequentially.
- **Rolling Deployment**:   Deploy to your servers in two batches 

For more information on how these strategies work, please read our [detailed guide to deployment strategies](../deployment/parallel-deployment.md).

### Pause Jobs

You can choose to pause all your server and application jobs while you’re deploying. The jobs will be automatically resumed once the deployment is completed.

### Upgrades

- **Apply Kubernetes upgrades**: Apply the latest Kubernetes version - you can choose to specify a version in your Manifest and/or to run a clean installation.
- **Apply Security Upgrades**: Install the latest Ubuntu security packages immediately (they are applied once a day by default).
- **Reboot My Servers If Required** - this option will allow your servers to reboot if an upgrade or update process requests it. This will obviously cause downtime during the deployment. 

### Database migration

You can choose whether or not to run database migrations as part of deployments that use this profile. Read our [database management guide](../databases/database-management.md#control-your-rails-database-migrations) for more info. 

### Upgrades

You can choose to upgrade the components and packages that your servers are using as part of a deployment. 

This is quite likely to result in some downtime. We strongly recommend reading [our guide to the subject](../servers/applying-upgrades.md) before doing this.

- **Apply Security Upgrades**: Install the latest Ubuntu security packages immediately (they are applied once a day by default).
- **Apply Ruby/Node upgrades**: Upgrade the version(s) of Ruby and Node to the latest stable version. 
- **Reboot My Servers If Required** - this option will allow your servers to reboot if an upgrade or update process requests it. This will obviously cause downtime during the deployment. 

## Calling a deployment profile via a redeployment hook

Redeployment hooks allow you to initiate a deployment simply by calling a URI. These hooks can be combined with deployment profiles to completely automate the deployment pipeline. Read our [how-to guide on redeployment hooks](../deployment/redeployment-hook.md#calling-a-deployment-profile-via-a-redeployment-hook) for details on how to achieve this.