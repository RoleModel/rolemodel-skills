# Getting started with Clusters


Clusters are only compatible with applications built using Cloud 66 [Container Management Service Version 2](../cloud-66-101/concepts-and-terminology.md#version-1-vs-version-2). 

## What you’ll need

Before you start, please check you have the following:

* **A Cloud 66 Account** &mdash; If you don't already have one, [sign up for a Cloud 66 account](https://app.cloud66.com/users/sign_up). Your first server is free, no credit card required.
* **Application code and/or pre-built images** &mdash; Application code should be hosted in a (secure) publicly accessible git repository and pre-built images should be hosted in image publicly accessible repositories.
* **A Cloud account linked to Cloud 66 or your own servers set up** &mdash; See below.

## Creating a Cloud 66 Cluster

To get started with your cluster &mdash; firstly click on *Clusters* in main navigation bar at the top of the page.

Then, click the green *new cluster* button.

Next, give your cluster a name that will make it easy to identify. Then, choose the deployment target for your cluster. You can choose one of your existing cloud providers, or click *Add Clouds* to add a new cloud provider.

You can also use your own server - although you will need to [register it](../servers/registered-servers.md#register-a-server) first. In our example we're choosing to deploy to Digital Ocean.

Depending on which cloud or registered server you selected above, we can now choose options for our new cluster, such as region and capacity. In this example we'll choose *3* servers with 2GB of RAM each in the Amsterdam 3 Region.

Clusters support both AMD/Intel (x86-64) and ARM64 servers. To use ARM, choose a cloud instance type that's ARM-based when picking your cluster's capacity, or, for your own servers, run the [registration script](../servers/registered-servers.md#register-a-server) on an ARM machine.

 The first server in your cluster will always be your Kubernetes master node. You can decide later if you would like this server to share application workloads or only run Kubernetes management tasks. 

## Deployment

Once you're happy with your choices; hit the *Create Cluster* button to start building your new Cloud 66 cluster!

You can watch the progess of the build on your dashboard, or you can close the window and get on with other work. We will alert you via email when your cluster is up and running.

During the build and deployment process you can view the log to see what's happening behind the scenes. You can also drill down to specific servers to see what is going on there during deployment.

When your deployment is complete you'll have your first Cloud 66 cluster up and running!

## Configuring the Cluster

As we have a cluster that has multiple servers, we can easily switch our master node from a **shared master** to a **dedicated master**. To do this we simply click the *shared master* dropdown link and select *Yes! Switch to Dedicated Master*

We can also easily add additional server nodes to this cluster or remove existing server nodes from this cluster.
(Note that the master server cannot be removed without deleting the entire cluster.)

## Deploying applications to the cluster

If you now create a new Cloud 66 application (see [Getting Started with Cloud 66 for help with this(/getting-started/deploy-your-first-app)) at the point where you can select your Cloud provider, you will now see additional items clusters. Select your cluster, and deploy your application!

## What's next?

* Learn how to add a [load balancer](../load-balancers/load-balancer.md) to your application.
* Learn about using [failover groups](../failover-groups/failover-groups.md) to make your application highly available
* Learn how to [deploy your service(s) in parallel](../deployment/parallel-deployment.md) to speed up the deployment process.
* Your deployment configuration is stored in a *manifest.yml* file. Learn how to [edit your manifest file](../manifest/what-is-a-manifest-file.md) to access advanced deployment features.