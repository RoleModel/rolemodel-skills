# Redis Configuration


## Redis

[Redis](https://redis.io/) is an in-memory data structure store, used as a distributed, in-memory key–value database, cache and message broker, with optional durability.

The following settings are available via the Manifest file :

|Option|Applied on|Description|Clouds|
|--- |--- |--- |--- |
|`iam_instance_profile_name`||The name of the [IAM instance profile](../build-and-config/advanced-cloud-configurations.md#using-iam-instance-profiles-with-your-servers) that should be used when provisioning this server.|AWS|
|`instance_service_account_name`||The name of the [GCE Service Account](../build-and-config/advanced-cloud-configurations.md#using-gce-service-accounts-with-cloud-66) that should be used when provisioning this server.|GCE|
|`groups`||Used to define multiple separate [database groups](../databases/attaching-multiple-databases.md) (of the same type), each with their own configuration. The name of each group in your Manifest must match the names in your Dashboard.|All|
|`operating_system`||The version of Ubuntu to install on the server that hosts Redis. Accepted values `ubuntu2604`, `ubuntu2404`, or `ubuntu2204` |All|
|`root_disk_size`||Default size of root disk (in GB) for servers used by Redis. Default value is `50`.|AWS, Azure, GCE|
|`root_disk_type`||Disk type for servers used by Redis, accepted values being `ssd` and `magnetic`. Default value is `ssd`.|AWS, GCE|
| `tags` |  | Append the listed tags to any servers created for this component. See our [tagging guide](../servers/tagging-components.md) for more info on tag syntax and support. | AWS, Azure, DigitalOcean, Hetzner |
|`version`||Specify the version of Redis you want to install. NOTE: You can use [database groups](../databases/attaching-multiple-databases.md) to run different versions of the same database in parallel with each other.|All|

### Example YAML for Redis

For the database group named `default` (the group Cloud 66 creates when you first add Redis to an application):

```yaml
redis:
  configuration:
    version: 8.4
    root_disk_size: 100
    root_disk_type: ssd
    iam_instance_profile_name: redis-perms
```

For any other database group, nest the configuration under the `groups:` block and refer to the group by its Dashboard name:

```yaml
redis:
  groups:
    <your-group-name>:
      configuration:
        version: 8.4
        root_disk_size: 100
        root_disk_type: ssd
        iam_instance_profile_name: redis-perms
```

The top-level `redis: configuration:` form applies **only** to the group named `default` — it is not a fallback for groups that don't have an explicit configuration. Each group must be configured under its own name in the `groups:` block.

If you need help specifying multiple databases of the same type via your Manifest, please read our guide on [Database Groups](../manifest/_database-groups.md).