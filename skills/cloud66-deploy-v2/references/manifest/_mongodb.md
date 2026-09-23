# MongoDB Configuration


## MongoDB

[MongoDB](https://www.mongodb.com/) is a cross-platform document-oriented database program. Classified as a NoSQL database program, MongoDB uses JSON-like documents with optional schemas.

The following settings are available via the Manifest file :

|Option|Applied on|Description|Clouds|
|--- |--- |--- |--- |
|`groups`||Used to define multiple separate [database groups](../databases/attaching-multiple-databases.md) (of the same type), each with their own configuration. The name of each group in your Manifest must match the names in your Dashboard.|All|
|`iam_instance_profile_name`||The name of the [IAM instance profile](../build-and-config/advanced-cloud-configurations.md#using-iam-instance-profiles-with-your-servers) that should be used when provisioning this server.|AWS|
|`instance_service_account_name`||The name of the [GCE Service Account](../build-and-config/advanced-cloud-configurations.md#using-gce-service-accounts-with-cloud-66) that should be used when provisioning this server.|GCE|
|`operating_system`||The version of Ubuntu to install on the server that hosts MongoDB. Accepted values `ubuntu2604`, `ubuntu2404`, or `ubuntu2204`|All|
|`root_disk_size`||Default size of root disk (in GB) for servers used by MongoDB. Default value is `50`.|AWS, Azure, GCE|
|`root_disk_type`||Disk type for servers used by MongoDB, accepted values being `ssd` and `magnetic`. Default value is `ssd`.|AWS, GCE|
| `tags` |  | Append the listed tags to any servers created for this component. See our [tagging guide](../servers/tagging-components.md) for more info on tag syntax and support. | AWS, Azure, DigitalOcean, Hetzner |
|`tamper_with_yml`||Determines whether Cloud 66 can automatically update your database configuration (username, password and server address). Default is `yes`.|All|
|`version`||Specify the version of MongoDB you want to install. NOTE: You can use [database groups](../databases/attaching-multiple-databases.md) to run different versions of the same database in parallel with each other.|All|

### Example YAML for MongoDB

For the database group named `default` (the group Cloud 66 creates when you first add MongoDB to an application):

```yaml
mongodb:
  configuration:
    version: 2.4.8
    root_disk_size: 100
    root_disk_type: ssd
```

For any other database group, nest the configuration under the `groups:` block and refer to the group by its Dashboard name:

```yaml
mongodb:
  groups:
    <your-group-name>:
      configuration:
        version: 2.4.8
        root_disk_size: 100
        root_disk_type: ssd
```

The top-level `mongodb: configuration:` form applies **only** to the group named `default` — it is not a fallback for groups that don't have an explicit configuration. Each group must be configured under its own name in the `groups:` block.

If you need help specifying multiple databases of the same type via your Manifest, please read our guide on [Database Groups](../manifest/_database-groups.md).