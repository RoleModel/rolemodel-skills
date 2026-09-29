# Server Definitions


## Server definitions

Every component defined in the manifest file must be bound to a server. However, if you'd like configurations to apply to all your servers, you don't need to specify a server type.

Servers can be deployed specifically to host a single component, be shared between multiple components (e.g. Rails and MySQL on the same server) or be an external server (e.g. using an external database).

Here is an example of a simple server definition:

```yaml
rails:
  servers:
  - server:
      unique_name: app

```

These are the parameters that the _server_ section can take:

|Option|Applied on|Description|Clouds|
|--- |--- |--- |--- |
|`availability_zone`||Availability zone of the server instance in AWS EC2 region.|AWS|
|`key_name`||The name of the API key for the cloud account where the server will be built. You can see (and edit) all your cloud API key names in your [Dashboard Settings](https://app.cloud66.com/clouds). This is used when an account has multiple keys for a given cloud vendor. The default value is `Default`.|All|
|`region`||The [data center region](https://developers.cloud66.com#cloud-vendor-instance-regions) where the server will be built.|All|
|`root_disk_size`||Default size of root disk (in GB) for servers used by application. Default value is 50.|AWS, Azure, GCE|
|`root_disk_type`||Disk type, accepted values being `ssd` and `magnetic`. Default is `ssd`.|AWS, GCE|
|`size`||The [size of the server instance](https://developers.cloud66.com#cloud-vendor-instance-names) to be created.|All|
|`subnet_id`||**ID** or **name** of the AWS subnet in which you would like to create your servers. If not supplied, we will attempt to identify the single [map_public_ip_on_launch](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-subnet#cfn-ec2-subnet-mappubliciponlaunch) set to true|AWS|
|`unique_name`||A unique name for this server (**Required** if you are specifying a server type)|All|
|`vendor`||Cloud vendor where the server will be built. Valid values: `aws`, `azure_rm` (use `azure` for older Azure accounts), `digitalocean`, `googlecloud`, `hetzner`, `linode`, `maxihost`, `ovh`, and `vultr`|All|

All of the servers for an application must belong to a single cloud vendor and region. Different applications may use different clouds, but a single application cannot use multiple clouds.

A more complex server example

```yaml
rails:
  servers:
  - server:
      unique_name: app
      vendor: aws
      key_name: Default
      region: us-east-1
      size: m3.medium
      root_disk_size: 100
      root_disk_type: ssd
      subnet_id: subnet-40000000
      availability_zone: us-east-1c
```

## Specifying an operating system version

Cloud 66 uses Ubuntu as our operating system. By default we use the current LTS version of Ubuntu, but you can explicitly set a component to use an older version if you need to. Be aware that the `operating_system` setting is a feature of **components** (e.g. MySQL, Redis or Rails) and not **servers**.

The `operating_system` setting is currently available for:

- Application frameworks (Rails, docker etc.)
- ElasticSearch
- MySQL
- MongoDB
- Postgres
- Redis

Acceptable values are: `ubuntu2604`, `ubuntu2404`, or `ubuntu2204`

For example:

```yaml
rails:
  configuration:
    ...
    operating_system: ubuntu2604
```

## Detailed examples of Manifest files

In this example we're defining a MySQL server with all the bells and whistles:

```yaml
mysql:
  groups:
    default:
      configuration:
        version: 8.0
        root_disk_size: 1000
        root_disk_type: ssd
        engine: percona
        iam_instance_profile_name: mysql-perms
        custom_log_files: [ "/tmp/mysqllog/*/*.log" ]
      servers:
      - server:
          unique_name: mysql-main
          vendor: aws
          key_name: Default
          region: us-east-1
          size: m3.medium
          subnet_id: subnet-40000000
          availability_zone: us-east-1c
```

In this example we're defining a Rails app and an accompanying MySQL instance, and applying these settings only in the **production** environment:

```yaml
production:
  rails:
    configuration:
      ruby_version: 2.7.2
      asset_pipeline_precompile: true
      do_initial_db_schema_load: false
      reserved_server_memory: 0 #default value
      passenger_process_memory: 200 #default value
      memory_allocator: jemalloc # malloc is default
    servers:
    - server:
      unique_name: rails-main
      vendor: aws
      key_name: Default
      region: us-east-1
      size: m3.medium
      subnet_id: subnet-40000000
      availability_zone: us-east-1c
  mysql:
    groups:
      default: 
        configuration:
          version: 8.4
```

Notice that *we haven't specified a server for the MySQL instance* in this YAML. In cases like this the Cloud 66 Dashboard will prompt you to specify a server during the deployment process, and that server will be installed with MySQL V8.4.