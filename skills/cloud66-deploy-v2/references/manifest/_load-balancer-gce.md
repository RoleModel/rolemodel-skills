# GCE Load Balancer Configuration


## GCE (Google) load balancer

You can use your Manifest file to customize any GCE load balancers deployed by Cloud 66.

The following settings are available via the Manifest file:

|Option|Applied on|Description|
|--- |--- |--- |
|`balance`||The load balancing strategy. Valid values: `NONE`, `CLIENT_IP` or `CLIENT_IP_PROTO`|
|`httpchk`||The URL visited to check your server health|
|`wait_after_adding_servers`||The time (in seconds) we will wait after adding a server back to the load balancer before we begin routing traffic to that server. Read our [in-depth guide on configuration lag](../deployment/parallel-deployment.md#coping-with-load-balancer-configuration-lag) for more details.|
|`wait_after_removing_servers`||The time (in seconds) we will wait after adding a server back to the load balancer before we begin routing traffic to that server. Read our [in-depth guide on configuration lag](../deployment/parallel-deployment.md#coping-with-load-balancer-configuration-lag) for more details.|

Refer to the [GCE documentation](https://cloud.google.com/compute/docs/load-balancing/network/target-pools) for more detail on these settings.

### Example YAML for GCE load balancers

```yaml
load_balancer:
  configuration:
    httpchk: /
    balance: CLIENT_IP_PROTO
    wait_after_adding_servers: 30 # default is 0
    wait_after_removing_servers: 10 # default is 0
```

## Automatic endpoint test

Load balancers periodically check the health of your servers by connecting to a URL endpoint. If the server responds with an HTTP 200 OK status, it is considered healthy. The `httpchk` setting allows you to specify which URL path should be checked.

The default value is `/` (root path) but you can customize it to any valid endpoint in your application that returns a 200 status when healthy.