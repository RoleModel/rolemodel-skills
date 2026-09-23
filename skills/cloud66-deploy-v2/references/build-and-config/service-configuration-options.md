# Service configuration options


## Overview 

Service configurations allow you to customize many aspects of a Cloud 66 services. These are defined in the `service.yml` file.  If you're unfamiliar with service configurations, please read our [introductory guide](../build-and-config/docker-service-configuration.md) first. 

## Service configuration options

This is the complete list of all service configuration directives for Cloud 66 Container Service V2. For more detailed information about an option, click the link provided.

|**Option**|**Description**|
|--- |--- |
|[annotations](../build-and-config/service-tags-annotations.md#service-annotations)|Annotations for your services in key/value format - these will also become annotations on your Kubernetes resources|
|[build_command](../build-and-config/building-your-service.md#build-command)|Specifies the command you would like to run during application build.|
|[build_root](../build-and-config/building-your-service.md#build-root)|Specifies the directory of your repository in which you wish to run your Docker build.|
|[command](../build-and-config/building-your-service.md#command)|Specifies the command used to start your container.|
|[constraints](../build-and-config/service-resources.md)|Limits the [number of containers](../build-and-config/service-resources.md#limiting-the-number-of-containers) or the [resource usage](../build-and-config/service-resources.md) of a service across the cluster, or [allocates services to nodes](../build-and-config/service-resources.md#allocating-services-to-nodes) based on names and/or tags.|
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
|[volumes](../build-and-config/service-storage.md)|The volumes that are mounted from your host into your container.  Must use absolute paths.|
|work_dir|Specifies the [working directory](https://docs.docker.com/reference/builder#workdir) in your image for any command to be run.|