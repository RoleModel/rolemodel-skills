# Configuring Service storage


## Overview

Given the ephemeral nature of containers, it’s important to consider storage solutions to avoid data loss. We suggest mounting volumes from your container to the host.

This guide applies to containerized applications. We have a separate guide for Rails applications that deals with [persistent and shared directories](/rails/build-and-config/rails-shared-directories).

## Adding simple storage volumes

The `volumes` directive of the `service.yml` allows you to mount custom host folders inside your container. This is useful if you need to run a database service for instance, as data written to the local filesystem of your container will not be persisted between container instances. 

The **volumes** option is expressed as a comma separated list with the following form: `HOST_FOLDER:CONTAINER_FOLDER`.

You can optionally add `ro` or `rw` to specify that the container can read/write to the host folder (the default is read/write).

(Read [our guide to using service.yml](../build-and-config/docker-service-configuration.md) for more help on customizing your service configuration.)

Paths for storage volumes must be absolute. 

```yaml
services:
  <service_name>:
    volumes: ["/tmp/host/foo:/tmp/container/foo", "/tmp/host/bar:/tmp/container/bar:ro"]
```

This is the equivalent expanded form of the example above:
```yaml
services:
  <service_name>:
    volumes:
    - mount_path: "/tmp/container/foo"
      host_path: 
        path: "/tmp/host/foo"
    - mount_path: "/tmp/container/bar"
      read_only: true
      host_path: 
        path: "/tmp/host/bar"
```

## Adding Secret and/or ConfigMap storage volumes

Cloud 66 has a specific syntax to allow you to generate a [Kubernetes Secret](https://kubernetes.io/docs/concepts/configuration/secret/) (or [Kubernetes ConfigMap](https://kubernetes.io/docs/concepts/configuration/configmap/)), and mount them to a path inside your service containers - making them available in a local folder your service application. 

You can choose whether to populate the mounted folder from a Secret or ConfigMap - the contents of which are automatically generated from your application [ConfigStore](../build-and-config/config-store.md) or [Environment Variables](../build-and-config/env-vars.md). 

Optionally you can filter the included values based on a tag/metadata filter. The filter must be of the syntax `key=value` ie. `foo=bar`. When applied to ConfigStore entries, it will match based on the entry metadata. When applied to Environment Variables, it will match based on [tags](../servers/tagging-components.md).

 Because Secret and ConfigMap stores are application level and not service-specific, you cannot use service-level Environment Variables. 

The following examples illustrate your options: 

```yaml
services:
  <service_name>:
    volumes:
    # Include all ConfigStore into a Secret
    # and mount it in your container at: "/secret-config-store" 
    - mount_path: "/secret-config-store"
      secret: 
        from: "config_store"

    # Include all Environment Variables into a ConfigMap
    # and mount it in your container at: "/config-map-env-vars" 
    - mount_path: "/config-map-env-vars"
      config_map:
        from: "env_vars"

    # Include ConfigStore entries with metadata matching "mount=true" into a Secret
    # and mount it in your container at: "/secret-config-store-filtered" 
    - mount_path: "/secret-config-store-filtered"
      secret:
        from: "config_store"
        filter: "mount=true"
```

## Adding custom storage volumes (advanced)

If you need to connect a container to a non-standard volume (for example NFS), Cloud 66 supports all the same [volume types as Kubernetes.](https://kubernetes.io/docs/concepts/storage/volumes#types-of-volumes) 
For example a custom [emptyDir volume](https://kubernetes.io/docs/concepts/storage/volumes#emptydir)  would look something like:

```yaml
services:
  <service_name>:
    volumes:
    - mount_path: "/cache"
      empty_dir:
        medium: "Memory"
```

This would mount an emptyDir volume in the `/cache` folder of your container(s) and that volume would use RAM for storage instead of the disk (because `medium` is set to "memory").

### Volume settings

Cloud 66 supports the following general settings for all volume-types:

|Option|Format|Description|
|--- |--- |--- |
|mount_path|string|Path within the container at which the volume should be mounted. Must not contain `:`|
|mount_propagation|string|Determines how mounts are propagated from the host to container and the other way around. When not set, `None` is used.|
|read_only|boolean|Mounted read-only if true, read-write otherwise. Defaults to false.|
|sub_path|string|The path within the volume from which the container's volume should be mounted. Defaults to `""` (volume's root). Mutually exclusive with `sub_path_expr`.|
|sub_path_expr|string|Expanded path within the volume from which the container's volume should be mounted. Behaves similarly to `sub_path` but environment variable references $(VAR_NAME) are expanded using the container's environment. Defaults to `""` (volume's root). Mutually exclusive with `sub_path`.|

For more information on any of these settings, please consult the [official Kubernetes docs](https://kubernetes.io/docs/concepts/storage/volumes/) about volumes.