# MySQL Configuration


## MySQL

[MySQL](https://www.mysql.com/) is an open-source relational database management system.

The following settings are available via the Manifest file :

|Option|Applied on|Description|Clouds|
|--- |--- |--- |--- |
|`encoding`||Specify the encoding (AKA charset) for the database. Valid values can be found in the [MySQL charset docs](https://dev.mysql.com/doc/refman/8.0/en/charset-charsets/).|All|
|`engine`||Specify the MySQL engine you want to install. Valid values are `mysql` and `percona`|All|
|`groups`||Used to define multiple separate [database groups](../databases/attaching-multiple-databases.md) (of the same type), each with their own configuration. The name of each group in your Manifest must match the names in your Dashboard.|All|
|`iam_instance_profile_name`||The name of the [IAM instance profile](../build-and-config/advanced-cloud-configurations.md#using-iam-instance-profiles-with-your-servers) that should be used when provisioning this server.|AWS|
|`instance_service_account_name`||The name of the [GCE Service Account](../build-and-config/advanced-cloud-configurations.md#using-gce-service-accounts-with-cloud-66) that should be used when provisioning this server.|GCE|
|`operating_system`||The version of Ubuntu to install on the server that hosts MySQL. Accepted values `ubuntu2604`, `ubuntu2404`, or `ubuntu2204`|All|
|`root_disk_size`||Default size of root disk (in GB) for servers used by MySQL. Default value is `50`.|AWS, Azure, GCE|
|`root_disk_type`||Disk type for servers used by MySQL, accepted values being `ssd` and `magnetic`. Default value is `ssd`.|AWS, GCE|
| `tags` |  | Append the listed tags to any servers created for this component. See our [tagging guide](../servers/tagging-components.md) for more info on tag syntax and support. | AWS, Azure, DigitalOcean, Hetzner |
|`tamper_with_yml`||Determines whether Cloud 66 can automatically update your database configuration (username, password and server address). Default is `yes`.|All|
|`version`||Specify the version of MySQL you want to install. Valid values are `8.0` or `8.4` NOTE: You can use [database groups](../databases/attaching-multiple-databases.md) to run different versions of the same database in parallel with each other.|All|

### Example YAML for MySQL

For the database group named `default` (the group Cloud 66 creates when you first add MySQL to an application):

```yaml
mysql:
  configuration:
    version: 8.0
    root_disk_size: 100
    root_disk_type: ssd
    engine: percona
    encoding: koi8u
    iam_instance_profile_name: mysql-perms
```

For any other database group, nest the configuration under the `groups:` block and refer to the group by its Dashboard name:

```yaml
mysql:
  groups:
    <your-group-name>:
      configuration:
        version: 8.0
        root_disk_size: 100
        root_disk_type: ssd
        engine: percona
        encoding: koi8u
        iam_instance_profile_name: mysql-perms
```

The top-level `mysql: configuration:` form applies **only** to the group named `default` — it is not a fallback for groups that don't have an explicit configuration. Each group must be configured under its own name in the `groups:` block.

If you need help specifying multiple databases of the same type via your Manifest, please read our guide on [Database Groups](../manifest/_database-groups.md).