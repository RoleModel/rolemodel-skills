# AWS Load Balancer Configuration


## AWS load balancer

You can use your Manifest file to customize the AWS load balancer deployed by Cloud 66.

The following settings are available via the Manifest file:

|Option|Applied on|Description|
|--- |--- |--- |
|`alb_ssl_policy`||The SSL policy to associate with your ALB when performing SSL termination. See the official AWS docs for [available ALB SSL policies.](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/create-https-listener#describe-ssl-policies) (Applies only to Application Load Balancers)|
|`elb_ssl_policy`||The SSL policy to associate with your ELB when performing SSL termination. See the official AWS docs for [available ELB SSL policies](https://docs.aws.amazon.com/elasticloadbalancing/latest/classic/elb-security-policy-table/). (Applies only to Classic Load Balancers)|
|`httpchk`||The URL visited to check your server health|
|`wait_after_adding_servers`||The time (in seconds) we will wait after adding a server back to the load balancer before we begin routing traffic to that server. Read our [in-depth guide on configuration lag](../deployment/parallel-deployment.md#coping-with-load-balancer-configuration-lag) for more details.|
|`wait_after_removing_servers`||The time (in seconds) we will wait after adding a server back to the load balancer before we begin routing traffic to that server. Read our [in-depth guide on configuration lag](../deployment/parallel-deployment.md#coping-with-load-balancer-configuration-lag) for more details.|

### Example YAML for AWS load balancers

```yaml
load_balancer:
  configuration:
    httpchk: /
    wait_after_adding_servers: 30 # default is 0
    wait_after_removing_servers: 10 # default is 0         
    alb_ssl_policy: ELBSecurityPolicy-FS-1-2-2019-08 # default
    elb_ssl_policy: ELBSecurityPolicy-TLS-1-2-2017-01 # default  
```

## Automatic endpoint test

Load balancers periodically check the health of your servers by connecting to a URL endpoint. If the server responds with an HTTP 200 OK status, it is considered healthy. The `httpchk` setting allows you to specify which URL path should be checked.

The default value is `/` (root path) but you can customize it to any valid endpoint in your application that returns a 200 status when healthy.