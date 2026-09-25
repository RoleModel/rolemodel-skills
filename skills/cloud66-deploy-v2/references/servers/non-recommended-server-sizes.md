# Recommended minimum server sizes


## Recommended minimum specs

Although most cloud providers offer servers with the minimum specs required to run Ubuntu, we do not recommend using these, even for testing. We recommend the following **minimum specs** for any virtual machine being used to host an application or one of its components (such as a database):

- At least 2GB of RAM
- At least 4 vCPUs
- At least 25GB of storage

## Minimum specs for a Kubernetes cluster

Kubernetes is an extremely flexible and powerful way to host applications, but this power means that the platform has some minimum requirements with regards to server resources. While frameworks like Rails and Node can comfortably fit on a relatively tiny server, Kubernetes (and thus Cloud 66) requires more headroom. Therefore we recommend the following minimum specs for Cloud 66 servers: 

These specifications apply to a cluster with a single master node - i.e. the simplest possible cluster setup. 

- 2 GB or more of RAM per machine (any less will leave little room for your apps)
- 2 CPUs or more (less than this will cause a deployment error)

These specs come directly from the Kubernetes project - please [review the full list](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/install-kubeadm#before-you-begin) if you're unsure about anything. 

In general all of the other nodes in your cluster should be at least this large. It is possible over time to tune your setup so that non-master nodes are less powerful but, particularly for new deployments, we recommend erring on the side of more capacity.

## Allowing headroom for your app

It is theoretically possible for you to run a cluster with less powerful servers, but we strongly recommend against it. It's also important to consider the resource needs of the application itself. For example if your app requires 2GB of RAM to work optimally, your cluster should have at least 4GB RAM.

## Potential consequences of using under-powered servers

Using any of these server sizes may result in slow response times and intermittent downtime. Some applications may not function at all with the limited headroom afforded by these machines.

In particular, Elasticsearch on a standalone under-powered server will not start up. This is because we configure Elasticsearch to lock its memory and prevent swapping on standalone servers as per the [official recommendation](https://www.elastic.co/guide/en/elasticsearch/guide/current/heap-sizing/), and there is simply not enough memory for it to run it successfully.

Depending on whether or not you have deployed your application elsewhere, it may be hard to gauge the amount of resources that you need. On a PaaS like Heroku for example, you can choose between 1X (512 MB), 2X (1 GB) and PX (6 GB) server sizes. This makes it easy to calculate your server requirements, and we recommend that you use similar server resources when deploying your application with Cloud 66. We also recommend that you have a seperate server for your database in production environments.

If you haven't deployed your application in a production environment yet, you can deploy to a reasonably sized server and use [load testing](../servers/load-testing.md) to determine your exact needs.

## Under-powered server sizes (not recommended)

The following server sizes **are not recommended** (especially not in production). Some of these may only be available via [Registered Servers](../servers/registered-servers.md).

### Amazon Web Services

- t1.micro
- t2.micro

### Cloud-A

- 512 MB - General Purpose

### DigitalOcean

- 512MB - 1 CPU

### Google Compute Engine

- f1-micro

### Microsoft Azure

- A0

### Vultr

- Cloud Compute - 1 vCPUs - 1024 MB RAM - 25 GB SSD - 1.00 TB BW
- Cloud Compute - 1 vCPUs - 2048 MB RAM - 55 GB SSD - 2.00 TB BW