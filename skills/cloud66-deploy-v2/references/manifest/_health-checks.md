# Health Checks Configuration


## Post-deployment availability checks

You can configure your application to automatically run [global availability checks](../servers/application-health-checks.md) against an HTTP endpoint each time it is deployed. Results of these checks are available on your Cloud 66 dashboard under *ActiveProtect*. 

Note that all of the Health Check settings must be nested under the `configuration` → `activeprotect` → `health_check` sub-node.

The following settings are available via the Manifest file:

|Option|Applied on|Description|Clouds|
|--- |--- |--- |--- |
|`endpoint`||The endpoint to that will be queried during the check|All|
|`accept`||The set of HTTP codes we will accept as valid from the endpoint (as an array)|All|
|`timeout`||The timeout limit in seconds of the endpoint (limit: `10`)|All|
|`max_redirects`||The number of acceptable HTTP redirects (limit: `10`)|All|
|`cooldown`||The delay between the end of the deployment process and the start of the test, in seconds. (limit: `1800`)|All|

### Example YAML for post-deployment global availability checks

```yaml
docker:
  configuration:
    activeprotect:
      health_check:
        endpoint: '/' # Default is root '/'
        accept: ["200", "300-399"] # Default is 200
        timeout: 2 # Default is 5
        max_redirects: 5 # Default is 3
        cooldown: 120 # Default is 0 
```

```yaml
rails:
  configuration:
    activeprotect:
      health_check:
        endpoint: '/' # Default is root '/'
        accept: ["200", "300-399"] # Default is 200
        timeout: 2 # Default is 5
        max_redirects: 5 # Default is 3
        cooldown: 120 # Default is 0 
```