# Customizing service configurations


## Overview

Service configuration allows you to be more explicit about your Cloud 66 services and control settings that are not usually available through the user interface or Cloud 66 Toolbelt. These are defined in the `service.yml` file. 

These settings describe the composition of your services. Here are some common examples of service configurations you can define:

- Defining build and deploy commands
- Specifying a central logging folder
- Setting port definitions for your containers
- Mounting volumes into your containers
- Setting dependencies between your containers

For a full list of available options, see the [table](#service-configuration-options) at the end of this document.

## Editing service.yml

There are three ways to directly edit your `service.yml` file:

1. While you're **building** an application, by clicking on the *Edit services (advanced)* link. 
2. For **existing** apps by clicking *Application* in the left-hand nav, then *&#8615; More* (top-right of the main panel) and selecting *Edit service.yml* 
3. By editing individual **services** and clicking the *Advanced* tab (note that this only edits the portion of the file related to that component)

## Service configuration examples

### Getting Started service.yml

If you followed our Getting Started guide, your `service.yml` should initially look a lot like this:

```yaml
version: 2
services:
  demo-app:
    git_url: https://github.com/cloud66/maestro-demo
    git_branch: master
    ports:
    - container: 5000
      http: 80
    dockerfile_path: Dockerfile
databases:
- redis

```

To edit this file: 

1. Open the **application** from the [Dashboard](https://app.cloud66.com/dashboard).
2. Click on *Application* in the left-hand nav - this will open the Services page
3. Click the *&#8615; More* button at the top-right of the **Services** panel and select *Edit service.yml* 

To add https access, you would modify the *ports* sub-section under the *demo-app* section of *services*, adding `https: 443` on a new line.

The end result should look like this:

```yaml
version: 2
services:
  demo-app:
    git_url: https://github.com/cloud66/maestro-demo
    git_branch: master
    ports:
    - container: 5000
      http: 80
      https: 443
    dockerfile_path: Dockerfile
databases:
- redis
```

Now add a commit message for the update and click *Commit*. To test if these changes have worked, open your application and click on the *Services* tab. The **Network** column of the **Services** panel should now list the new ports.

In order for these new settings to apply to your service, you will need to redeploy your application. To do this, click the *Deploy* button on the application.

### Single service with MySQL database

In this example, we'll be configuring a service called *web*, which is pulled from a Git repository and requires a MySQL database.

```yaml
services:
 web:
  log_folder: "/usr/src/app/log"
  ports:
   - container: 3000
      http: 80
      https: 443
   git_url: https://github.com/cloud66-samples/pilot
   git_branch: master
   dockerfile_path: Dockerfile
databases:
- mysql
```

As you can see above, the *web* service is pulled from a sample project on GitHub called Pilot. It specifies both a path for the Dockerfile and a logging folder. Finally, the container is set to listen on port 3000 and uses external ports 80 and 443.

### Multiple services and databases

In this example, we'll be running three services - one called *seller*, one called *buyer* and one called *dashboard* as well as a Redis database. You can define as many services as you need. 

```yaml
services:
 seller:
  git_url: https://github.com/cloud66-samples/acme.git
  git_branch: master
  dockerfile_path: "./Dockerfile"
  build_root: seller
  command: seller --redis redis:6379
 buyer:
  git_url: https://github.com/cloud66-samples/acme.git
  git_branch: master
  dockerfile_path: "./Dockerfile"
  build_root: buyer
  command: buyer --redis redis:6379
 dashboard:
  git_url: https://github.com/cloud66-samples/acme.git
  git_branch: master
  ports:
  - container: 5000
     http: 80
  dockerfile_path: "./Dockerfile"
  build_root: dashboard
  command: "/go/src/dashboard/dashboard --redis redis:6379"
 redis:
  image: redis
  ports:
  - 6379
```

### Using Habitus for builds

[Habitus is a build workflow tool for Docker-based applications](https://www.habitus.io/). It allows you to create a build workflow consisting of multiple steps for your Cloud 66 application. Cloud 66 fully supports Habitus. To enable Habitus , you need to do the following:

1. Add a `build.yml` to your repository
2. Set `use_habitus` attribute to `true` in your `service.yml`
3. Set the `use_habitus_step` to the step you would like to use for your service in your `service.yml`

You can edit your `service.yml` directly from the Dashboard by clicking *Edit service* and then clicking the *Advanced* tab.

A Habitus build usually has multiple steps and each step can generate a Docker image. Using `use_habitus_step` attribute you can specify which step's results you would like to use as the image for the container.

Check out the [Habitus website](https://www.habitus.io/) for more information about generating a `build.yml`.

## Adding a DaemonSet

A DaemonSet ensures that a (single) copy of a specific Pod is added to every Node. This is useful for running background processes (aka daemons) but has many other uses. For more detail pleased read our [explanatory doc](../cloud-66-101/concepts-and-terminology.md#daemonsets) on the subject.

To create a DaemonSet we simply set the `type` of any service to `daemon_set`. For example:

```yaml
service:
 web:
  image: training/webapp
  type: daemon_set
  ports:
  - container: 5000
     http: 80
```

This will use the image called "webapp" to spawn a single Pod called "web" on every Node in your Cluster.

## Database configurations

The first time you deploy an application, you can specify any required databases in the service configuration. These databases will be deployed and configured automatically, and their addresses and access credentials will be made available to the containers across the application with environment variables.

Once your application has been deployed, you can still add databases via the Dashboard.

As databases are fairly static components that rarely change without a migration, they aren't run in containers. This avoids the complexity and overhead of running databases in a container and allows Cloud 66 to perform replication and backups as normal. 

The allowed database values are: `postgresql`, `mysql`, `redis`, `mongodb`, `elasticsearch` , `rabbitmq` and `glusterfs`. For example:

```yaml
services:
 service_name:
  databases:
  - mysql
  - elasticsearch
```

## Environment variables

Any [environment variable](../build-and-config/env-vars.md) defined in your application will be made available within your service container.

The syntax for defining environment variables in a service definition is:

```yaml
services:
 service_name:
  env_vars:
  VAR1: _env(VALUE_OF_VARIABLE)
```

You can also reference environment variable in other applications or services. For more info please read our [detailed guide](../build-and-config/env-vars.md#syntax-examples) to the sharing env vars between apps and services.

### Handling complex env_vars

Complex environment variables are variables that [reference other applications](../build-and-config/env-vars.md#intra-app-referencing-syntax) or [services](../build-and-config/env-vars.md#intra-service-referencing). For example: `_env(STACK[543247533d756a39a1f516f103c62efa].SERVICE[nginx].FOO)`

If you need to reference a complex environment variable in your `service.yml`, you need to define it first, either in the `env_vars` block or in [your app’s Dashboard](../build-and-config/env-vars.md#adding-an-environmental-variable).

For example, if we want to use the complex variable above in our Service we would do the following:

```yaml
ports:
- container: 80
  http: 80
  https: 443
volumes: []
env_vars:
  BAR: _env(STACK[543247533d756a39a1f516f103c62efa].SERVICE[nginx].FOO)
traffic_matches: []
deploy_command: _env(BAR)
image: nginx 
```

So we set the value of the `BAR` variable in the `env_vars` block and then we can use it in the `deploy_command`.

## Setting a Service Account name

Kubernetes relies on its "[Service Accounts](https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/)" feature to manage the identity of processes running inside Pods.

By default all services belong to a service account named `default`. Normally this provides sufficient access for your application. However, should you require elevated access (e.g. to allow for log collection or metrics gathering), you can set a custom Service Account for any service using the `service_account_name`. For example:

```yaml
services:
 web:
  ports:
  - container: 3000
    http: 80
 service_account_name: public-front-end
```

This will make the service named "web" run under the "public-front-end" Service Account in Kubernetes.

Bear in mind that this service account will first need to be created on your cluster (with associated access bindings) before it will function correctly. Please read the [Kubernetes guide to configuring Service Accounts](https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/) for more detail.

## Service configuration options

Below is a table of the available configurations for a given service with a brief description. For more detailed information about an option, click the link provided.

    
        Cloud 66 Container Service V2
        Cloud 66 Container Service V1
    

|Option|Description|
|--- |--- |
|[annotations](../build-and-config/service-tags-annotations.md#service-annotations)|Annotations for your services in key/value format - these will also become annotations on your Kubernetes resources|
|[build_command](../build-and-config/building-your-service.md#build-command)|Specifies the command you would like to run during application build.|
|[build_root](../build-and-config/building-your-service.md#build-root)|Specifies the directory of your repository in which you wish to run your Docker build.|
|[command](../build-and-config/building-your-service.md#command)|Specifies the command used to start your container.|
|[constraints](../build-and-config/service-resources.md)|Limits the [allocates services to nodes](../build-and-config/service-resources.md#limiting-the-number-of-containers) number of containers or the [resource usage](../build-and-config/service-resources.md) of a service across the cluster, or based on [names and/or tags](../build-and-config/service-resources.md#allocating-services-to-nodes).|
|constraints/tolerations|This is an optional hash for advanced configuration of [Kubernetes Tolerations](https://kubernetes.io/docs/concepts/scheduling-eviction/taint-and-toleration/).|
|[deploy_command](../build-and-config/building-your-service.md#deploy-command)|Specifies the command you would like to run during application deploy (runs once per service).|
|[dns_behaviour](../networking/service-networking.md#dns-behaviour)|Specifies the dns behaviour for this service. Accepted values: *versioned*, *non-versioned*. Defaults to *versioned*.|
|[dockerfile_path](../build-and-config/building-your-service.md#dockerfile-path)|Specifies the location of the Dockerfile to be used for building this service, eg. *docker/Dockerfile*.|
|[git_url](../build-and-config/building-your-service.md#git-url)|The URL for the Git repository from which your Docker image will be built.|
|[git_branch](../build-and-config/building-your-service.md#git-branch)|The Git repository branch your Docker image will be based on.|
|[use_habitus](#using-habitus-for-builds)|Use [Habitus](https://www.habitus.io) build workflow|
|[use_habitus_step](#using-habitus-for-builds)|The [Habitus](https://www.habitus.io) step to use for the build.|
|[health](../build-and-config/service-lifecycle-management.md#health)|One of the values: *default*, *none* or a hash. Use this to configure *Readiness*, *Liveness*, and *Startup* probes|
|[image](../build-and-config/building-your-service.md#image)|The image you would typically run `docker pull` from.|
|[load_balancing](../networking/service-networking.md#load-balancing)|Specifies the load balancing method for this service. Accepted values: *roundrobin*, *sticky*, *closest*. Default value is *roundrobin*|
|log_folder|Specify the folder on your container in which your services will save logs. This folder is mounted to `/var/log/containers/NAMESPACE/SERVICE_NAME` on the host filesystem. (more about [namespace and service name](../build-and-config/connecting-between-containerized-services.md))|
|[ports](../networking/service-networking.md)|The ports that are running within the container, as well as their corresponding external ports.|
|[post_start_command](../build-and-config/service-lifecycle-management.md#pre-start-command)|This command runs immediately after a container is created.|
|[pre_stop_command](../build-and-config/service-lifecycle-management.md#pre-stop-command)|This command runs immediately before a container is terminated.|
|[requires](../build-and-config/service-lifecycle-management.md#requires)|Array of other defined service names that should be started before this service during build and deployment.|
|[restart_on_deploy](../build-and-config/service-lifecycle-management.md#restart-on-deploy) *(default: true)*|Boolean value to indicate whether the containers of this service should be restarted during deployment.|
|security_context|This is an optional hash for advanced configuration of Kubernetes Security Context. Valid keys are: *fs_group, host_ipc, host_network, host_pid, privileged, run_as_group, run_as_non_root, run_as_user, supplemental_groups*.|
|[service_account_name](#setting-a-service-account-name)|Assigns the service to a specific Kubernetes Service Account. The default value is `default`|
|[stop_grace](../build-and-config/service-lifecycle-management.md#stop-grace)|Duration between the Docker `TERM` and `KILL` signals when Docker stop is run and a container is stopped.|
|[traffic_matches](../networking/service-networking.md#traffic-matching)|The automatically configured traffic names in your Nginx config that will route traffic to these containers based on request DNS name. Allows microservices on the same port routes by subdomain for instance.|
|[tags](../build-and-config/service-tags-annotations.md)|Arbitrary text tags for your services - these will also become labels on your Kubernetes resources|
|type|Specifies the type of service being defined. Accepted values: `service`, `deployment`, `daemon_set`|
|[volumes](../build-and-config/service-storage.md)|The volumes that are mounted from your host into your container.  You must use absolute paths.|
|work_dir|Specifies the [working directory](https://docs.docker.com/reference/builder#workdir) in your image for any command to be run.|

    

|**Option**|**Description**|
|--- |--- |
|[build_command](/deploy/1/build-and-config/building-your-service)|Specifies the command you would like to run during application build.|
|[build_root](/deploy/1/build-and-config/building-your-service)|Specifies the directory of your repository in which you wish to run your Docker build.|
|[command](/deploy/1/build-and-config/building-your-service)|Specifies the command used to start your container.|
|[deploy_command](/deploy/1/build-and-config/building-your-service)|Specifies the command you would like to run during application deploy (runs once per service).|
|[dns_behaviour](/deploy/1/networking/service-network-configuration#dns_behaviour)|Specifies the dns behaviour for this service. Accepted values: *versioned*, *non-versioned*. Defaults to *versioned*.|
|[dockerfile_path](/deploy/1/build-and-config/building-your-service#dockerfile-path)|Specifies the location of the Dockerfile to be used for building this service, eg. *docker/Dockerfile*.|
|tags|Arbitrary tags for services|
|[git_url](/deploy/1/build-and-config/building-your-service)|The URL for the Git repository from which your Docker image will be built.|
|[git_branch](/deploy/1/build-and-config/building-your-service#git-branch)|The Git repository branch your Docker image will be based on.|
|[use_habitus](/deploy/1/build-and-config/building-your-service#using-habitus-for-builds)|Use [Habitus](https://www.habitus.io) build workflow|
|[use_habitus_step](/deploy/1/build-and-config/building-your-service#using-habitus-for-builds)|The [Habitus](https://www.habitus.io) step to use for the build.|
|[health](../build-and-config/service-lifecycle-management.md#health)|One of the values: *default*, *none* or a hash containing at least one of *type*, *endpoint*, *protocol*, *accept* or *timeout*.|
|[image](/deploy/1/build-and-config/building-your-service#image)|The image you would typically run `docker pull` from.|
|[load_balancing](/deploy/1/networking/service-network-configuration#load-balancing)|Specifies the load balancing method for this service. Accepted values: *roundrobin*, *sticky*, *closest*. Default value is *roundrobin*|
|log_folder|Folder your services logs to, mounted to `/var/log/containers/service` on the host filesystem.|
|[ports](/deploy/1/networking/service-network-configuration#ports)|The ports that are running within the container, as well as their corresponding external ports.|
|privileged *(default: false)*|Boolean value to indicate whether the container should be [run with extended privileges](https://docs.docker.com/engine/reference/run#runtime-privilege-and-linux-capabilities).|
|[requires](/deploy/1/networking/service-network-configuration#requires)|Array of other defined service names that should be started before this service during build and deployment.|
|[restart_on_deploy](/deploy/1/networking/service-network-configuration#restart) *(default: true)*|Boolean value to indicate whether the containers of this service should be restarted during deployment.|
|[stop_grace](/deploy/1/networking/service-network-configuration#stop_grace)|Duration between the Docker `TERM` and `KILL` signals when Docker stop is run and a container is stopped.|
|[traffic_matches](/deploy/1/networking/service-network-configuration#traffic_matches)|The automatically configured traffic names in your Nginx config that will route traffic to these containers based on request DNS name. Allows microservices on the same port routes by subdomain for instance.|
|volumes|Volumes mounted from host into container. Syntax: Array of absolute paths, with the format `HOST_FOLDER:CONTAINER_FOLDER`. Optional 'ro' on the end for read-only. e.g. `/tmp/host:/tmp/container:ro`|
|work_dir|Specifies the [working directory](https://docs.docker.com/reference/builder#workdir) in your image for any command to be run.|