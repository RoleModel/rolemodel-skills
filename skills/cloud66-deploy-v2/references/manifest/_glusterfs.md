# GlusterFS Configuration


## GlusterFS

[GlusterFS](https://www.gluster.org/) is a scalable network filesystem suitable for data-intensive tasks such as cloud storage and media streaming.

### Restrictions with GlusterFS

- Renaming a volume will actually **delete that volume** and create a new one.
- After you change the volume list, you need to redeploy your application for new configuration be applied to your application.
- You cannot change `replica_count` after GlusterFS added to your application.
- You cannot use `glusterfs group` or any of its servers in `mount_targets`.

The following settings are available via the Manifest file:

|Option|Applied on|Description|Clouds|
|--- |--- |--- |--- |
|`iam_instance_profile_name`||The name of the [IAM instance profile](../build-and-config/advanced-cloud-configurations.md#using-iam-instance-profiles-with-your-servers) that should be used when provisioning this server.|AWS|
|`instance_service_account_name`||The name of the [GCE Service Account](../build-and-config/advanced-cloud-configurations.md#using-gce-service-accounts-with-cloud-66) that should be used when provisioning this server.|GCE|
|`mount_targets`||List of servers and server groups on which GlusterFS should be mounted. You can specify the name of the server or server group (e.g. `rails` or `mysql`). You can also use app and db keywords: `app` is your main app server group (e.g. rails) and `db` is your database server groups (e.g. `mysql` or `redis`). The default value is `app`.|All|
|`replica_count`||The number of nodes in the GlusterFS cluster to which data will be replicated (e.g. `2` means your data exist on two nodes). Default value is `1`.|All|
|`root_disk_size`||Default size of root disk (in GB) for servers used by GlusterFS. Default value is `50`.|AWS, Azure, GCE|
|`root_disk_type`||Disk type for servers used by GlusterFS, accepted values being `ssd` and `magnetic`. Default value is `ssd`.|AWS, GCE|
| `tags` |  | Append the listed tags to any servers created for this component. See our [tagging guide](../servers/tagging-components.md) for more info on tag syntax and support. | AWS, Azure, DigitalOcean, Hetzner |
|`version`||The version of GlusterFS you wish to install.NOTE: You can use [database groups](../databases/attaching-multiple-databases.md) to run different versions of the same database in parallel with each other.|All|

### Example YAML for GlusterFS

```yaml
glusterfs:
  configuration:
    version: 11.0
    replica_count: 2
    mount_targets: ['app','redis']
```