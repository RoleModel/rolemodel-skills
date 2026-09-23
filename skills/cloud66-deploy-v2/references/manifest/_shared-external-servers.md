# Shared and External Servers


## Shared Servers

You can share a server between two components. This allows you to, for example, use a server for both your front-end app and the database server backing it.

|Option|Applied on|Description|Clouds|
|--- |--- |--- |--- |
|`same_as`||The name of another server definition in the same manifest file. This component will use the same server when it is deployed.|All|

### Example of shared server

```yaml
rails:
  servers:
  - server:
      unique_name: my_rails_app
      vendor: aws
      key_name: Default
      region: us-east-1
      size: m3.medium
mongodb:
  servers:
  - server:
      same_as: my_rails_app
```

## External Servers

If you would like to use an external server for a component (like using your own MySQL or AWS RDS instance, for example), you can define that server as external.

External server definitions specify that the component is hosted on a server external to Cloud 66. This is not a valid target for your main application (e.g. rails) but may be appropriate for another component (e.g. MongoDB):

```yaml
mysql:
  servers:
  - server: external
```

## Specifying external databases via your manifest

If your app uses databases that aren't managed by Cloud 66 you can still specify them via your Manifest. To set a database as external via your manifest, use the following syntax:

```yaml
# For example, an external MySQL server
mysql: 
  server: external
```