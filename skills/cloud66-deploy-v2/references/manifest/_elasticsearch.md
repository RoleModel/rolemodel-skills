# ElasticSearch Configuration


## ElasticSearch

[Elasticsearch](https://www.elastic.co/elastic-stack) is a search engine based on the Lucene library. It provides a distributed, multitenant-capable full-text search engine with an HTTP web interface and schema-free JSON documents.

The following settings are available via the Manifest file:

|Option|Applied on|Description|Clouds|
|--- |--- |--- |--- |
|`groups`||Used to define multiple separate [database groups](../databases/attaching-multiple-databases.md) (of the same type), each with their own configuration. The name of each group in your Manifest must match the names in your Dashboard.|All|
|`iam_instance_profile_name`||The name of the [IAM instance profile](../build-and-config/advanced-cloud-configurations.md#using-iam-instance-profiles-with-your-servers) that should be used when provisioning this server.|AWS|
|`instance_service_account_name`||The name of the [GCE Service Account](../build-and-config/advanced-cloud-configurations.md#using-gce-service-accounts-with-cloud-66) that should be used when provisioning this server.|GCE|
|`operating_system`||The version of Ubuntu to install on the server that hosts ElasticSearch. Accepted values `ubuntu2604`, `ubuntu2404`, or `ubuntu2204`|All|
|`root_disk_size`||Default size of root disk (in GB) for servers used by ElasticSearch. Default value is `50`.|AWS, Azure, GCE|
|`root_disk_type`||Disk type for servers used by ElasticSearch, accepted values being `ssd` and `magnetic`. Default value is `ssd`.|AWS, GCE|
| `tags` |  | Append the listed tags to any servers created for this component. See our [tagging guide](../servers/tagging-components.md) for more info on tag syntax and support. | AWS, Azure, DigitalOcean, Hetzner |
|`version`||The version of ElasticSearch you want to install. NOTE: You can use [database groups](../databases/attaching-multiple-databases.md) to run different versions of the same database in parallel with each other.|All|

### Example YAML for ElasticSearch

```yaml
elasticsearch:
  configuration:
    iam_instance_profile_name: elastic-perms
    version: 8.15
    root_disk_size: 1000
    root_disk_type: ssd

```

If you need help specifying multiple databases of the same type via your Manifest, please read our guide on [Database Groups](../manifest/_database-groups.md).