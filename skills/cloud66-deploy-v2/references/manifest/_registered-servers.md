# Registered Servers


## Deploy to your own server

You can deploy to one of your [Registered servers](../servers/registered-servers.md) via manifest settings. The server must be registered before deployment.

|Option|Applied on|Description|Clouds|
|--- |--- |--- |--- |
|`address`||IP address of the server, only applicable to [Registered Servers](../servers/registered-servers.md)|Registered servers|
|`unique_name`||Unique name for the registered server|Registered servers|

### Example of registered server

```yaml
redis:
  servers:
  - server:
      unique_name: redis-main
      address: 123.123.123.123
```