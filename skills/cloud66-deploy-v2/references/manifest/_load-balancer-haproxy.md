# HAProxy Configuration


## HAProxy

You can use your Manifest file to configure and define any HAProxy load balancers deployed by Cloud 66. These changes will be either be applied when you redeploy an application with more than one server, rebuild HAProxy or edit [HAProxy CustomConfig](../security/multi-cert_haproxy.md). 

Because HAProxy load balancers are not "cloud native", you will need to specify the **server configuration** in the same YAML node as your HAProxy settings. The server configuration settings are :

|Server options|Applied on|Description|
|--- |--- |--- |
|`key_name`||Default|
|`region`||DigitalOcean's region|
|`size`||The size of the instance|
|`unique_name`||Name of the instance|

The following **HAProxy settings** are available via the Manifest file:

|Option|Applied on|Description|
|--- |--- |--- |
|`balance`||The load balancing strategy. Valid values: `roundrobin`, `leastconn` or `source`|
|`errorfile_*ERROR_CODE*`||Location of your own custom error page(s) to serve in the case of receiving a HTTP error code on the load balancer. You can configure one page per error code.|
|`haproxy_password`||The password for your HAProxy stats interface.|
|`haproxy_username`||The username for your HAProxy stats interface.|
|`httpchk`||The URL visited to check your server health|
|`wait_after_adding_servers`||The time (in seconds) we will wait after adding a server back to the load balancer before we begin routing traffic to that server. Read our [in-depth guide on configuration lag](../deployment/parallel-deployment.md#coping-with-load-balancer-configuration-lag) for more details.|
|`wait_after_removing_servers`||The time (in seconds) we will wait after adding a server back to the load balancer before we begin routing traffic to that server. Read our [in-depth guide on configuration lag](../deployment/parallel-deployment.md#coping-with-load-balancer-configuration-lag) for more details.|

Refer to the [HAProxy documentation](http://haproxy.1wt.eu/download/1.3/doc/configuration.txt) for more information

### Example YAML for HAProxy load balancers

```yaml
load_balancer:
  servers:
    - server:
        unique_name: bananana
        size: 1gb
        region: ams2
        vendor: digitalocean
        key_name: Default
  configuration:
    httpchk: "HEAD / HTTP/1.1\r\nHost:haproxy"  #default value
    balance: roundrobin #default value
    errorfile_400: /etc/haproxy/errors/400.http
    errorfile_403: /etc/haproxy/errors/403.http
    errorfile_500: /etc/haproxy/errors/500.http
    errorfile_504: /etc/haproxy/errors/504.https
    wait_after_adding_servers: 30 # default is 0
    wait_after_removing_servers: 10 # default is 0
```

## Automatic endpoint test

Load balancers periodically check the health of your servers by connecting to a URL endpoint. If the server responds with an HTTP 200 OK status, it is considered healthy. The `httpchk` setting allows you to specify which URL path should be checked.

The default value is `httpchk: "HEAD / HTTP/1.1\r\nHost:haproxy"` but you can customize it to any valid endpoint in your application that returns a 200 status when healthy.