# PostgreSQL Configuration


## Postgres

[Postgres](https://www.postgresql.org/) is a powerful, open source object-relational database system with over 30 years of active development that has earned it a strong reputation for reliability, feature robustness, and performance.

The following settings are available via the Manifest file :

|Option|Applied on|Description|Clouds|
|--- |--- |--- |--- |
|`encoding`||Specify the encoding (AKA charset) for the database. Valid values can be found in the [Postgres character set docs](https://www.postgresql.org/docs/current/multibyte#MULTIBYTE-CHARSET-SUPPORTED).|All|
|`groups`||Used to define multiple separate [database groups](../databases/attaching-multiple-databases.md) (of the same type), each with their own configuration. The name of each group in your Manifest must match the names in your Dashboard.|All|
|`iam_instance_profile_name`||The name of the [IAM instance profile](../build-and-config/advanced-cloud-configurations.md#using-iam-instance-profiles-with-your-servers) that should be used when provisioning this server.|AWS|
|`instance_service_account_name`||The name of the [GCE Service Account](../build-and-config/advanced-cloud-configurations.md#using-gce-service-accounts-with-cloud-66) that should be used when provisioning this server.|GCE|
|`operating_system`||The version of Ubuntu to install on the server that hosts Postgres. Accepted values `ubuntu2604`, `ubuntu2404`, or `ubuntu2204`|All|
|`root_disk_size`||Default size of root disk (in GB) for servers used by Postgres. Default value is `50`.|AWS, Azure, GCE|
|`root_disk_type`||Disk type for servers used by Postgres, accepted values being `ssd` and `magnetic`. Default value is `ssd`.|AWS, GCE|
| `tags` |  | Append the listed tags to any servers created for this component. See our [tagging guide](../servers/tagging-components.md) for more info on tag syntax and support. | AWS, Azure, DigitalOcean, Hetzner |
|`tamper_with_yml`||Determines whether Cloud 66 can automatically update your database configuration (username, password and server address). Default is `yes`.|All|
|`version`||Specify the version of Postgres you want to install. NOTE: You can use [database groups](../databases/attaching-multiple-databases.md) to run different versions of the same database in parallel with each other.|All|

### Example YAML for Postgres

For the database group named `default` (the group Cloud 66 creates when you first add Postgres to an application):

```yaml
postgresql:
  configuration:
    iam_instance_profile_name: psql-perms
    version: 18
    encoding: ISO_8859_8
    root_disk_size: 100
    root_disk_type: ssd
```

For any other database group, nest the configuration under the `groups:` block and refer to the group by its Dashboard name:

```yaml
postgresql:
  groups:
    <your-group-name>:
      configuration:
        iam_instance_profile_name: psql-perms
        version: 18
        encoding: ISO_8859_8
        root_disk_size: 100
        root_disk_type: ssd
```

The top-level `postgresql: configuration:` form applies **only** to the group named `default` — it is not a fallback for groups that don't have an explicit configuration. Each group must be configured under its own name in the `groups:` block.

If you need help specifying multiple databases of the same type via your Manifest, please read our guide on [Database Groups](../manifest/_database-groups.md).

## PostGIS

PostGIS and pgvector are automatically installed and available on all Postgres servers running version 16 or later.