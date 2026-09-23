# Gateway Configuration


## Gateway

The gateway should be defined and open before you can use it in manifest.

The following settings are available via the Manifest file:

|Option|Applied on|Description|Clouds|
|--- |--- |--- |--- |
|`name`||Specify the name of gateway you want to use for your application.|All|
|`username`||Specify the username which should be used to connect to Bastion server.|All|

### Example YAML for gateway

```yaml
gateway:
  name: aws_bastion
  username: ec2-user
```