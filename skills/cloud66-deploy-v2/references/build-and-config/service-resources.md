# Setting limits for services


## Overview

In general Cloud 66 services will consume resources and spawn containers as needed, but you may want to explicitly limit a particularly resource-hungry service, or ensure that a service is only assigned (scheduled) to a node with sufficient resources to handle its needs. You can also set a minimum or maximum number of containers a service may use.

Cloud 66 supports four kinds of resource allocations:

- Limits
- Requests
- Number of containers
- Node allocation

All of these service configurations are defined in your application's `service.yml` file. Read [our guide to using service.yml](../build-and-config/docker-service-configuration.md) for more help on customizing your service configuration.

## Understanding resource management options

When setting resource parameters, it's vital to understand the differences between your options.

- **[Limits](#limiting-cpu-and-ram-usage)** act like a ceiling on the resource usage for any service. They tell your cluster that the service may only use a *maximum* of the specified resource.
- **[Requests](#requesting-cpu-and-ram)** act like a floor on the resources for a service. They tell your cluster "this service needs X" in order to run. Cloud 66 uses these requests to decide how services should be distributed ("scheduled") on your physical nodes. For example a service which has a request of 4GB of RAM will never be scheduled to a node with only 1GB of RAM.
- **[Number of containers](#limiting-the-number-of-containers)** sets a hard limit on the number of containers your cluster will spawn for a service. This can be a minimum (e.g. "always spawn at least one container") or a maximum ("no more than 10") or a combination.
- **[Node allocation](#allocating-services-to-nodes)** limits containers to run only on certain nodes based on the names and/or tags of those nodes.

For more detailed information on Limits and Requests, please read the [in-depth Kubernetes documentation](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/) on the subject. For more detailed info on node allocation please read the Kubernetes documentation on [node affinity](https://kubernetes.io/docs/tasks/configure-pod-container/assign-pods-nodes-using-node-affinity/).

## Limiting CPU and RAM usage

By default, Docker services will use as much CPU and memory as they require. You may wish to set a hard limit on memory, or the relative CPU shares used by a service.

This can be accomplished in Cloud 66 by adding the `constraints/resources` directive to your service's `service.yml`.

### CPU limits

CPU usage is measured in millicpu. One full CPU is 1000m, so 100m is equivalent to 10% of a CPU's capacity. In the context of limits, this is how much CPU capacity a service can consume, but the service may not need this capacity and will not reserve it.

If multiple services attempt to use a CPU and the aggregate demand is greater than 100%, Cloud 66 will share the CPU on a proportional basis (e.g. giving larger shares to the services with higher limits).

### RAM limits

    
        Cloud 66 Container Service V2
        Cloud 66 Container Service V1
    

Memory limits apply to RAM usage and SWAP usage. A valid entry is a positive number, followed by one of, "K", "M", or "G", with the minimum being "4M". (You can also use the power-of-two equivalents like Gi, Mi, Ki if you prefer.)

Memory limits apply to RAM usage and SWAP usage. A valid entry is a positive number, followed by one of, "k", "m", or "g", with the minimum being "4m".

### Example of limits

```yaml
services:
 your_service_name:
  constraints:
   resources:
    requests:
     memory: "100m"
     cpu: 500m

```

## Requesting CPU and RAM

To request resources for a service, you should add the `constraints/resources` directive to your service's `service.yml`. If the aggregate resource requests of all of the services in an application exceed the capacity of the destination cluster, some services will not be distributed. Please read the [in-depth Kubernetes documentation](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/) to understand the implications of this.

### CPU requests

CPU usage is measured in *millicpu*. One full CPU is 1000m, so 100m is equivalent to 10% of a CPU's capacity. In the context of **requests**, this is the minimum CPU capacity a service requires, but a service can use more resources than it has requested, as long as it is not also **limited**.

### RAM requests

    
        Cloud 66 Container Service V2
        Cloud 66 Container Service V1
    

Memory requests set the minimum RAM required by a service. A valid entry is a positive number, followed by one of, "K", "M", or "G", with the minimum being "4M". (You can also use the power-of-two equivalents like Gi, Mi, Ki if you prefer.)

Memory requests set the minimum RAM required by a service. A valid entry is a positive number, followed by one of, "k", "m", or "g", with the minimum being "4m".

### Example of requests

```yaml
services:
 your_service_name:
  constraints:
   resources:
    requests:
     memory: "100m"
     cpu: 500m
```

## Combining limits and requests

You can set both requests and limits for a service. By definition **request** values must always be lower than **limit** values.

```yaml
services:
 your_service_name:
  constraints:
   resources:
    requests:
     memory: "100m"
     cpu: 500m
    limits:
     memory: "500m"
     cpu: 1000m
```

The example above will ensure this service always has access to at least 10% of a CPU and 100MB of RAM, and will allow this service to use up to a full CPU and 500MB of RAM.

## Limiting the number of containers

You can limit the number of containers that a service may use. You can set both minimum and maximum limits for each service. For example:

```yaml
services:
    your_service_name:
        constraints:
            min_count: 2
            max_count: 7
```

This would ensure that the service would always have at least 2 containers, but that it would never have more than 7.

## Allocating services to nodes

Node allocation is a mechanism for ensuring that services only spawn on nodes that meet certain criteria. You might want services with high volume of disk I/O to only spawn on the nodes that have access to SSD drives, for example. To allocate a service to nodes, you need to specify nodes using **name(s)** and/or **tag(s)**.

### Allocating nodes using names

This will limit services to only use nodes that match specified names.

```yaml
services:
  webapp:
    constraints:                    
      servers: 
        names:                      
        - "alpha"
        - "zeta"
```

This will ensure that the **webapp** service will only ever spawn on any nodes (servers) named **alpha** *or* **zeta**. These names are totally arbitrary and can be whatever you like. 

Kubernetes will still handle the scheduling as usual, and other constraints may also affect the outcome. For example if all the nodes named Alpha are over capacity, the service may only spawn on Zeta nodes. 

### Allocating nodes using tags

This will limit services to only use nodes that match (arbitrary) tags. To use this method, you first need to [tag the node(s)](../servers/tagging-components.md#adding-tags-to-a-server) in question using the format "key=value" (for example `disk=large`). Once you have tagged nodes according to your needs, you can allocate services to them like this:

```yaml
services:
  webapp:
    constraints:                    
      servers: 
        tags:                       
        - "disk=large"
```

This will ensure that the **webapp** service will only spawn on nodes that are tagged with `disk=large`. Since the tags are arbitrary and do not reflect the underlying nature of a Node, it's critical to tag your nodes with great care. Setting everything to `disk=large`, for example, will defeat the point.

### Allocating nodes using a combination of names and tags

You can use a combination of names and tags allocate your services to nodes. If you include both these criteria, this is interpreted as a logical *AND*. For example this:

```yaml
services:
  webapp:
    constraints:                    
      servers: 
        names:                      
        - "alpha"
        - "zeta"      
        tags:                       
        - "priority=high"
        - "priority=medium"
```

...tells your service that it must spawn on nodes that are named `alpha` *or* `zeta` AND that are tagged `priority=high` *or* `priority=medium`. If, for example, a node is named Alpha but is tagged as low priority, the **webapp** service will not use that node.