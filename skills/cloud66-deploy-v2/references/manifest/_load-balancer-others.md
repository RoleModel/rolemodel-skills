# Other Load Balancer Configuration


## DigitalOcean Load Balancer

You can use a manifest file to configure DigitalOcean Load Balancers deployed by Cloud 66.

The following settings are available via the Manifest file:

|Option|Applied on|Description|
|--- |--- |--- |
|`httpchk`||The URL visited to check your server health|
|`wait_after_adding_servers`||The time (in seconds) we will wait after adding a server back to the load balancer before we begin routing traffic to that server. Read our [in-depth guide on configuration lag](../deployment/parallel-deployment.md#coping-with-load-balancer-configuration-lag) for more details.|
|`wait_after_removing_servers`||The time (in seconds) we will wait after adding a server back to the load balancer before we begin routing traffic to that server. Read our [in-depth guide on configuration lag](../deployment/parallel-deployment.md#coping-with-load-balancer-configuration-lag) for more details.|

Refer to the [DigitalOcean documentation](https://docs.digitalocean.com/products/networking/load-balancers/) for more detail on these settings.

---

## Hetzner Cloud Load Balancer

You can use a manifest file to configure Hetzner Cloud Load Balancers deployed by Cloud 66.

The following settings are available via the Manifest file:

|Option|Applied on|Description|
|--- |--- |--- |
|`balance`||The load balancing strategy. Valid values: `round_robin` or `least_connections`|
|`httpchk`||The URL visited to check your server health|
|`wait_after_adding_servers`||The time (in seconds) we will wait after adding a server back to the load balancer before we begin routing traffic to that server. Read our [in-depth guide on configuration lag](../deployment/parallel-deployment.md#coping-with-load-balancer-configuration-lag) for more details.|
|`wait_after_removing_servers`||The time (in seconds) we will wait after adding a server back to the load balancer before we begin routing traffic to that server. Read our [in-depth guide on configuration lag](../deployment/parallel-deployment.md#coping-with-load-balancer-configuration-lag) for more details.|

Refer to the [Hetzner documentation](https://docs.hetzner.com/cloud/load-balancers/overview) for more detail on these settings.

---

## Linode Nodebalancer

You can use a manifest file to configure Linode Nodebalancers deployed by Cloud 66.

The following settings are available via the Manifest file:

|Option|Applied on|Description|
|--- |--- |--- |
|`balance`||The load balancing strategy. Valid values: `roundrobin`, `leastconn` or `source`|
|`httpchk`||The URL visited to check your server health|
|`wait_after_adding_servers`||The time (in seconds) we will wait after adding a server back to the load balancer before we begin routing traffic to that server. Read our [in-depth guide on configuration lag](../deployment/parallel-deployment.md#coping-with-load-balancer-configuration-lag) for more details.|
|`wait_after_removing_servers`||The time (in seconds) we will wait after adding a server back to the load balancer before we begin routing traffic to that server. Read our [in-depth guide on configuration lag](../deployment/parallel-deployment.md#coping-with-load-balancer-configuration-lag) for more details.|

Refer to the [Linode documentation](https://www.linode.com/docs/platform/nodebalancer/nodebalancer-reference-guide) for more detail on these settings.

### Example YAML for Linode Nodebalancer

```yaml
load_balancer:
  configuration:
    httpchk: /
    balance: leastconn
    wait_after_adding_servers: 30 # default is 0
    wait_after_removing_servers: 10 # default is 0
```

## Automatic endpoint test

Load balancers periodically check the health of your servers by connecting to a URL endpoint. If the server responds with an HTTP 200 OK status, it is considered healthy. The `httpchk` setting allows you to specify which URL path should be checked.

The default value is `/` (root path) but you can customize it to any valid endpoint in your application that returns a 200 status when healthy.