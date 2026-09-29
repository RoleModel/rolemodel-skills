# Concepts & terminology


## What is Cloud 66?

Cloud 66 is a DevOps-automation service that allows you to easily build, deploy and maintain your applications, and their supporting components, on any cloud or server. 

Cloud 66 allows you to centralize the provisioning and management of:

* Applications (and app servers)
* Databases
* Load Balancers
* Caches 
* Message queues
* File storage
* Firewalls
* SSL certificates
* Monitoring and logging

...as well as all the configuration files, settings and environment variables on which these components rely.

Cloud 66 also caters for prebuilt / JAMstack apps - [see below](#prebuilt-applications).

### How does this differ from other PaaS providers?

Unlike traditional PaaS offerings like Heroku or Google App Engine, Cloud 66 allows you to use your own servers - whether in the cloud, in a data center or even on your own premises. We support both public and private clouds, as well as hybrids and bare metal installations.

Cloud 66 is primarily developer-focused. It automates and standardizes the important but repetitive (and error-prone) tasks involved in configuring and deploying code to infrastructure. The platform is designed to work for both small teams without dedicated DevOps resources, and larger organizations with separate DevOps teams.

## How we define "application"

For the purposes of this documentation an application is the complete set of software, configuration and hardware components needed for your software to run. This includes all of the [components](#what-is-cloud-66-for-rails) described above.

## Application components

You have a great degree of freedom when choosing the different components of your application.

### Load balancer (optional)

A load balancer is used to distribute traffic across your web servers, and offers benefits such as maximizing throughput, minimizing response times and avoiding overload on any single server. Ultimately, load balancing increases the reliability of your application.

The type of  [load balancer deployed in your application](../load-balancers/load-balancer.md) is dependent on your cloud provider.

### Web servers

By default, your applications are served with Nginx, and you are also free to customize this selection for Rack-based applications. You can [scale your web server](../servers/scaling.md) with the click of a button.

### Background workers (optional)

To relieve pressure from your application, we recommend that you use background workers to run memory-intensive processes. Cloud 66 makes it easy for you to control and monitor these processes, as well as [scale them](../build-and-config/proc-files.md) at the click of a button.

### Database servers (optional)

You can choose between any of four supported databases:

- MySQL
- Postgres
- MongoDB
- Redis

Cloud 66 makes it easy for you to [backup your database](../databases/database-backups.md), [verify the backup](../databases/backup-verifiers.md) and [replicate your databases](../databases/database-replication.md).

### Operating system

Your servers will be deployed with Ubuntu 26.04 LTS.

### Cloud vendor

You can either [deploy to your preferred cloud provider](../specs-and-policies/technical-specifications.md#supported-cloud-providers) <PerProduct includes={["rails", "deploy"]}>or [deploy to your own server](../servers/registered-servers.md).

## Application environments

To reflect the different stages of your software, you can deploy your application in different environments:

* **Development**: Use this when you're developing your application
* **Production**: For live applications
* **QA**: Used for quality assurance
* **Staging**: Mirrors the production environment but is only used for testing

In addition to these environments, you can define your own environments from the _Account_ page, in the _Setting_ -> _Custom environment_ menu. Once the new environment is added, you will be able to see it in the list of supported environments when creating a new application. Custom environments don't influence anything on the application. They will result in the relevant environment variables like `RAILS_ENV` and `RACK_ENV` (for Rack-based applications) having the correct values. The usage of those custom values is up to your application.

Depending on your configuration, your application will act differently in each environment. For example, a Ruby on Rails application has a directory in `config/environments` that contains settings for each environment.

There is no difference between these environments when it comes to features and supported tools apart from what you define in your code.

</PerProduct>

## Containers & containerization

Containers, at their most basic, are pieces of software (or “code”) bundled together with the other components they require to function (such as system libraries and configuration files). This bundle (or “container”) is treated as a standalone executable file.

There are many benefits to treating software applications this way. Containers are:

* **Self-contained** Each container runs as an independent process or thread. This greatly reduces the chance of conflict with other applications using the same infrastructure.
* **Less resource intensive** Because they only contain the minimum components required to function they do not consume unnecessary resources. This saves on infrastructure costs and can make applications faster for end users.
* **Highly portable**  Containers are not dependent on specific server or environmental variables, so they can be quickly and easily deployed or moved between different server environments.
* **Easily scalable** Containers can be initialised in milliseconds, so adding, moving or removing them is close to instant. And because they are self-contained, the need for time-consuming configuration changes is greatly reduced.
* **Secure** Containers are highly abstracted and isolated from their environments as well as from other applications sharing those environments. This makes securing applications and implementing policies easier and cleaner.

Apart from these technical benefits, containers also make it easier for **development** and **operations** teams to work together more efficiently. Because the containers are abstracted from the underlying server environment, they allow developers to focus on writing good code, and operations engineers to focus on managing environments. This clean division of responsibility paradoxically allows for more flexibility and easier collaboration between teams.

These benefits have led many large technology firms to adopt containers as their default approach to shipping and deploying their software. Examples include Netflix, PayPal and Expedia.

Many of these firms began by taking existing software and repackaging it into containers. This process is called **containerization**, and it affects the entire technology team from developers to devops and infrastructure teams.

Containerization is made possible by **container engines** - systems that allow containers to be developed, packaged and run on your infrastructure. At Cloud 66 we support [Docker](https://www.docker.com/) which is the market leading container engine (or “runtime”).

## Orchestration

Software orchestration is a way to automate the routine management of your applications and the infrastructural environments on which those applications run.

One of the challenges of containerization is that, instead of deploying and managing a single, monolithic application, you need to deploy and manage dozens, hundreds or even thousands of containers. This quickly makes manual management of many operational tasks, like scaling or migration, effectively impossible.

Container orchestration platforms provide the framework to systematise and automate the entire lifecycle of a containerized and distributed application. In other words, these platforms allow you to define the way you want any management task to work - for example rolling back code - and then let the platform handle that task with little to no human intervention required.

At Cloud 66 we rely on Kubernetes - the market leading solution - to orchestrate containers and applications in clustered environments. Cloud 66 streamlines and extends Kubernetes to allow for the centralised management of your entire application - including the non-containerized components.

## BuildGrid and Build Minutes

BuildGrid is Cloud 66's integrated container image builder. Whenever you build images from source code, or retag existing images, you make use of a metered resource called Build Minutes. All Cloud 66 accounts have a number of “free” Build Minutes per month.

Learn more about Build Minutes, monthly allowances and overages in our [detailed guide](../account/build-minutes.md).

## Applications and services

### What is an application?

In the context of Cloud 66, an **application** is a complete and discrete piece of software, usually made up of several components, not all of which are necessarily containerized.

For example, a simple application might consist of:

* A container with all the business logic of the application written in Python
* A standalone MySQL database to which the container connects
* An instance of Memcached running on the host alongside the container

A Cloud 66 application is distinct from the physical (or virtual) infrastructure - it describes the components required for the software to function, and not the substrate on which those components happen to be running.

### Application vs service

In Cloud 66 an **application** is typically made up of several different services. These can include:

* Containers
* Databases
* A message queue
* A caching service
* A filestore or CDN

…and many more. Services are encapsulated by applications - they don’t operate independently.

A Cloud 66 service is not necessarily equivalent to a Kubernetes service. Containers hosted using Cloud 66 will, by definition, become Kubernetes services, but Cloud 66 services can also be non-containerized components (see above).

## Application components

You have a great degree of freedom when choosing the different components of your application.

### Load balancer (optional)

A load balancer is used to distribute traffic across your web servers, and offers benefits such as maximizing throughput, minimizing response times and avoiding overload on any single server. Ultimately, load balancing increases the reliability of your application.

The type of  [load balancer deployed in your application](../load-balancers/load-balancer.md) is dependent on your cloud provider.

### Web servers

By default, your applications are served with Nginx, and you have full control over the way Nginx is configured.

### Database servers (optional)

You can choose between any of four supported databases:

- MySQL
- Postgres
- MongoDB
- Redis

Cloud 66 makes it easy for you to [backup your database](../databases/database-backups.md), [verify the backup](../databases/backup-verifiers.md) and [replicate your databases](../databases/database-replication.md).

### Operating system

Your servers will be deployed with Ubuntu 26.04 LTS.

### Cloud vendor

You can either [deploy to your preferred cloud provider](../specs-and-policies/technical-specifications.md#supported-cloud-providers) or [deploy to your own server](../servers/registered-servers.md).

## Container lifecycle management

Containers have, in a very real sense, a lifecycle. They are “born” by being built from images and deployed onto infrastructure. They “live” on that host, performing their functions and then, when they are obsolete or no longer needed, they are removed and “die”.

This ability to spawn new containers to handle additional load, to retire them when they are no longer needed and to replace fleets of obsolete containers with new ones, is what makes them so flexible and powerful.

Cloud 66's job is to streamline and automate the management of this lifecycle. This includes:

* Managing Kubernetes clusters
* Configuration management
* Monitoring
* Provisioning and managing databases
* Providing persistent storage
* Security and firewalling
* Failover and high-availability

## Service networking

It's likely that some services inside your application will need to respond to queries from the public internet.

For a service to be available to anyone outside the container, we need to bridge it from inside to outside of the container. In the context of Kubernetes (and thus Cloud 66), this is called “service networking”.

For example, a container with a web application might be set to listen on port 3000 within the internal (Kubernetes) cluster network, and that port could then be exposed to port 80 on the public network attached to the cluster.

This is not limited to HTTP or web traffic. The same concepts apply if a container serves non-HTTP traffic (like web sockets, DB containers or custom TCP / UDP traffic).

If you’d like to understand this concept better, read this [excellent in-depth explainer](https://sookocheff.com/post/kubernetes/understanding-kubernetes-networking-model/) by Kevin Sookocheff.

In this context, *outside world* is used for any client of your service that's not inside the container. This includes any of your other services running on other environments.

## DaemonSets

DaemonSets ensure that each Node in your cluster runs a single copy of specific Pod. Whenever a new Node is added, the DaemonSet ensure a copy of the chosen Pod is spawned on that Node. 

As their name suggests, DaemonSets are useful for running background processes like log collection and monitoring, but they can be used for any purpose that requires a service (or set of services) to be present on every Node in a cluster. 

If you need more technical detail you can read the [official Kubernetes documentation](https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/) on DaemonSets, but this is not necessary to use Cloud 66. 

If you'd like to start adding DaemonSets to your application, you can go straight to our [how-to guide](../build-and-config/docker-service-configuration.md#adding-a-daemonset).

## Nodes, masters & workers

### Overview

In Kubernetes nomenclature, each server (whether physical or virtual) running Kubernetes-related tasks is called a “node”. There are two main types of nodes:

1. **Masters** which provide the control plane for a cluster
2. **Workers** which run the application containers (AKA workloads)

It’s quite common for nodes to be shared between Masters and Workers. This is useful for smaller and less complex Kubernetes environments but is not recommended for applications with significant traffic.

### Shared vs dedicated Master nodes

In a purist Kubernetes setup, Master nodes are kept separate from Worker nodes, but it’s often more efficient to allow your Master node to run workloads. This is particularly useful in development environments because it reduces the number of servers required by the cluster.

The first time Cloud 66 provisions a new Kubernetes cluster, we default to the **shared master** architecture. This can be changed via the [Dashboard](../servers/scaling.md#kubernetes-cluster-servers) or [manifest.yml](../manifest/what-is-a-manifest-file.md).

## High availability & multiple masters

### High availability for Worker nodes

One of the benefits of using Kubernetes is its inherent capacity for high availability. Because pods and containers are ephemeral, workloads can easily be shifted between nodes. This makes achieving high availability for workloads very similar to scaling: by adding more Worker nodes you can achieve both scale and redundancy.

### High availability for Master nodes

Unlike Workers, Master nodes don’t automatically benefit from being scaled horizontally. This is because Kubernetes masters use a **majority consensus** algorithm to resolve any disputes that might occur. This means that the minimum number of Masters required for high availability is **three**.

To understand why this is, consider the following example: You create a cluster with 10 Workers and 2 dedicated Masters. The cluster runs fine until there’s a network disruption and the Masters disagree about the state of one of the Workers. Since the replication algorithm relies on a majority consensus, the Masters will be unable to come to a majority “decision” (because there is a 50:50 split in “opinion”). So a cluster with two Masters is actually **less highly available** than a cluster with a single master.

So, in order for a Kubernetes to be truly highly available, it needs to have **an odd number of Masters that is greater than 1**.

## Scaling

As your application gains users, it may require more resources to support its functions. In the context and Kubernetes (and thus Cloud 66) there are three main ways to scale an application:

1. Add new hosts / servers to a cluster (“horizontal” scaling)
2. Increase the capacity of existing hosts / servers in the cluster (“vertical” scaling)
3. Adding more containers to the cluster to make more efficient use of resources

The third method above is predicated on the fact that node resources are often underutilised by the applications running on them. Internal system limitations and user-imposed caps can leave significant room for more intensive CPU or RAM usage per node. For example a less processor-intensive container may work equally well with a 25% share of CPU as it does with 50%, effectively doubling the carrying capacity of a node.

It is also possible, with some advanced configuration, to scale applications across entirely different clusters in different data centres or regions.

## What is Cloud 66 Container Service?

Cloud 66 Container Service is a service for configuring and managing the infrastructure required to serve and support containerized applications.

Cloud 66 uses **Docker** and **Kubernetes** for container and application management, but also supports many of the non-containerized services used by a typical application including components like **databases** and **load-balancers**.

Cloud 66 is designed as a complete solution - it can manage every aspect of your container infrastructure - but it can also be integrated with other services.

Cloud 66 is server-agnostic - it supports both physical and virtual servers and both public and private clouds.

### Version 1 vs Version 2

There are two versions of Cloud 66 Container Service:

* *Version 1* uses the Cloud 66 scheduler and Docker to manage fleets of containers
* *Version 2* uses Kubernetes and Docker to do the same thing

Version 1 (also called CSv1) is a *legacy product* and is only available by special request. We have many customers who are perfectly happy using Version 1, but our default option is Version 2 (CSv2) because it uses Kubernetes - the global standard in containerized application management.

Throughout this documentation, you will find references to these versions. If you’re in any doubt, you should rely on the information for Version 2.

## Cloud 66 Container Service architecture

### Version 2

In order to manage containerized applications, Cloud 66 Container Service V2 (CSv2) relies on three core components:

* A container runtime (Docker)
* A container orchestration platform (Kubernetes)
* A reverse proxy (Nginx)

The **Docker runtime** supports the elements that make up a container, and acts as a broker between those elements and the underlying infrastructure. It is the engine that makes containers “work”.

The **Kubernetes** platform orchestrates the entire lifecycle of a containerized application including deployment, grouping, container-to-container networking and service discovery. It also facilitates the deployment of native components directly to servers, where required. This is often done with stateful components (like databases), although these can also be containerized if necessary.

In the context of CSv2, **Nginx** is mainly used for SSL termination and load balancing. In the case of applications that span across different Kubernetes clusters, Nginx is used for communication between those clusters.

### Version 1

In order to manage containerized applications, Cloud 66 Container Service V1 (CSv1) relies on three core components:

* A container runtime (Docker)
* Cloud 66’s proprietary container management service
* A reverse proxy (Nginx)

The **Docker runtime** supports the elements that make up a container, and acts as a broker between those elements and the underlying infrastructure. It is the engine that makes containers “work”.

The **Cloud 66 container management service** performs much the same task as Kubernetes does in CSv2 (see above) - it manages the lifecycle of containers in your environments. This includes container-to-container networking, as well as container-to-non-container (e.g. DBs) networking. It also includes DNS based service discovery

In the context of CSv1, **Nginx** is responsible for managing Layer-7 (HTTP/HTTPS) traffic from outside of the application into the containers and facilitates functions like SSL termination and load balancing.

## About Docker

[Docker](https://www.docker.com/) is an open-source project that helps developers publish applications inside containers. There are many benefits to using Docker:

- **Separation of Dev and Ops**: It has previously been difficult to separate the responsibility between Dev and Ops. With Docker deployments, Devs simply put their code into a container (which they can verify works as expected), and Ops take responsibility for rolling it out and managing it.

- **Micro-services**: Instead of running monolithic applications, complex systems can be built from collections of small, loosely coupled components. Being able to run multiple micro-services on the same server (multi-tenancy) is easy with Docker.

- **Portability**: Docker containers make it a lot easier to achieve immutable infrastructure, as the main logic of your application isn't tied to a specific server.

- **Static containers**: You can now achieve consistency across environments - that is, you can replicate your production environment locally if needed.

- **Deploy anything!**: As long as you can put it in a container, you can deploy it to any cloud with Cloud 66.

### Cloud 66 Docker support

Cloud 66 builds Docker containers in two ways:

1. **Pulling code from Git**: This option uses Cloud 66 BuildGrid to automatically build a Docker image from your code. You just need to provide a [Dockerfile](https://docs.docker.com/reference/builder/) that specifies how you'd like us to build the image. Once your image is ready, it is deployed to your servers and managed. We also version the image and allow you to download it if needed.
2. **Pre-built image**: You provide a Docker image that you've built or one from a public repo. We deploy that image to your servers and manage its lifecycle.

## Application vs stack

In previous versions of Cloud 66, and this documentation, we used the concept of a “stack” to describe much the same concept as we now describe using “application”. The two concepts are related but not identical.

In particular “stack” tends to include both underlying infrastructure and the components running on that substrate, whereas “application” is more abstracted from the underlying infrastructure.

However, when reading any documentation or our forums, it will often be helpful to think of “stack” and “application” as effectively synonymous.

In a general sense, both these terms encapsulate the same thing: an interconnected collection of components, configurations and services that are presented to the world as a single, coherent piece of software.

## The principle of immutability

At Cloud 66 we believe in the principle that application components should be treated as **immutable** whenever possible. This means that, if a configuration change is required, **it is always preferable to build a new version of that component** from scratch, and swap it with an existing component than to manually modify the configuration of that component. 

That's why we focus our efforts on making the building and deploying of components as quick, reliable and automated as possible. If spinning up a new version of an existing component takes ten minutes, why bother trying to fiddle with configurations, or upgrade in place - actions that could easily break your application?

## Automation and repeatability

Whether upgrading, building from scratch or scaling horizontally, we focus on making the roll-out of components as automated, consistent and repeatable as possible. We have many features that support this, including:

- The [Manifest file](../manifest/what-is-a-manifest-file.md) captures settings for infrastructural components in a simple YAML format, making it quick and easy to roll out additional instances of a component without any manual intervention
- [CustomConfig](../custom-config/custom-config.md) gives you a powerful, version-controlled interface for customizing the configuration files for components like databases and Nginx
- [Deploy Hooks](../deploy-hooks/deploy-hooks.md) allow you to automate the customization of components during your build and deployment process - for example installing a custom package, or a series of packages that depend on one another.

## Load balancing

Cloud 66 supports several levels and methods of balancing the load on an application:

1. External load balancing via cloud services / providers
2. Load balancing across your application’s own hosts via Nginx or HAproxy
3. Load balancing across the containers and Pods running within the application via Kubernetes

All of these methods share the same goal - ensuring that your application is able to cope with the influx of users and traffic without degrading in performance or running out of resources completely.

This documentation addresses the configuration of cloud-based load balancers, Nginx and HAproxy, but there are dozens of other platforms and methods that can help you manage the load on your application.

If you are interested in learning more about this subject, Matt Klein has written [an excellent introduction](https://blog.envoyproxy.io/introduction-to-modern-network-load-balancing-and-proxying-a57f6ff80236) to load balancing.

### Proxies and SSL / TLS termination

Both Nginx and HAproxy can be set up to handle SSL / TLS termination - in other words, they act as the public face of an application and provide a route to your SSL certificates. This saves you from having to set up multiple instances of your certificates throughout your infrastructure and allows for more advanced load balancing features like X-Forwarded HTTP headers (XFF).

## What is StackScore?

StackScore&trade; is a score that provides an indication of how reliable, resilient and performant your application is when deployed on your servers. It consists of five key metrics that are graded from **A** to **F**, and the overall StackScore is the lowest of the scores across these five metrics.

- **Code:** Ensures your code does not have security issues by checking for known vulnerabilities.
- **Backups and data integrity:** This tracks whether or not you are backing up your databases (with managed and/or unmanaged backups), and whether or not you verify your backups.
- **Connectivity:** Checks whether or not you are sharing your front-end and back-end on the same server. This is affected by how much memory you have on your servers, among other factors.
- **Performance:** Checks if you have a load balancer, as well as different server configuration metrics.
- **Security:** Tracks your firewall settings for potential security issues.

#### Suggestion
Always try to keep your stacks at an **A** StackScore&trade; level to ensure application health.

Cloud 66 constantly seeks to update and improve the StackScore algorithm to consider new data points as well as external conditions, which means that your StackScore will change over time.

## Prebuilt applications

Cloud 66 makes building, deploying and managing **prebuilt web applications** on your own infrastructure easy, reliable and fast. In just a few minutes you can have your static site up and running on your own hosting account. We support the major static site generators:

- [Jekyll](https://jekyllrb.com/) (Ruby)
- [Hugo](https://gohugo.io/) (Go)
- [Gatsby](https://www.gatsbyjs.com/) (React)
- [Next.js](https://nextjs.org/) (React)
- [Vue.js](https://vuejs.org/) (Node)
- [Nuxt.js](https://nuxtjs.org/) (Vue.js)
- [Svelte](https://svelte.dev/) (Node)
- [Middleman](https://middlemanapp.com/) (Ruby)
- [Docusaurus](https://docusaurus.io/) (React)

Cloud 66 allows you to benefit from the power of the [Jamstack](https://jamstack.org/) without being locked into a proprietary infrastructure solution. Your application is hosted on your own object storage via your own cloud account. 

Cloud 66 gives you access to all of Cloud 66's best-in-class management and automation tools, allowing you to easily manage deployments, previews, team access and notifications. 

## What are prebuilt web apps?

Prebuilt applications are also known as "preprocessed", "pre-rendered" or "static sites". Instead of relying on the traditional web architecture of web servers, applications and databases, they process the application's front-end code before deployment and output a discrete collection of static files:

- HTML & CSS
- Javascript
- Images

These static files are faster to serve and easier to scale. They can be hosted across multiple regions without any extra coding, putting them closer to your users without the hassle and expense of replicating data or managing multiple application stacks. They are generally hosted on object storage solutions (such as Amazon S3) which are relatively cheap and much easier to scale up.

They are also generally more secure because they have less "surface area" to attack and fewer moving parts that need to be secured (database servers, application code etc).

## Are prebuilt apps completely static?

Not necessarily, no. The Jamstack architecture uses Javascript to make prebuilt sites dynamic by calling backend APIs. This means that prebuilt sites can be used for a wide variety of purposes including:

- Publishing
- Documentation
- Online shopping / e-commerce
- Online learning

With a rich enough set of APIs and micro-services, there are no theoretical limits on the kind of application you build.

## What are the advantages of prebuilt apps?

Prebuilt web apps decouple the user front-end from backend operations. This means they are:

- (Much) faster to serve - static elements benefit disproportionately from caching and distributed hosting, and have no complex runtime processing to slow you down
- Highly portable - they can be hosted across multiple regions and even multiple cloud providers
- Easily scalable - adding capacity does not require replication or retooling - you simply scale up your object storage
- More secure - there are fewer components to attack, and most of them are (by definition) read-only

## Do I need to learn a new language?

If you are already building and running a web applications, then you already have the skills required to build a Jamstack application. The majority of the work is in languages and frameworks you already use:

- HTML 5
- CSS (including SASS etc)
- Javascript (and related frameworks)
- APIs (RESTful and other)

## How do I get started?

You can have your first Cloud 66 application up and running in literally minutes. All you need is:

- An online git repository (public or private) containing your app's code
- A cloud storage account with AWS, Google Compute Engine, DigitalOcean, Azure, or Linode
- A Cloud 66 account (we offer 4-week free trials with no credit card required)

Follow our 5 minute [Getting Started Guide](../getting-started/deploy-your-first-app.md).