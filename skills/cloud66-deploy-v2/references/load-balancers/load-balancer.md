# Adding & Managing Load Balancers


## Overview 

A load balancer is used to distribute traffic across your web servers, and offers benefits such as maximizing throughoutput, minimizing response times and avoiding overload on any single server. Ultimately, load balancing increases the reliability of your application.

You can add either native load balancers (for [cloud vendors with native load balancer support](#supported-cloud-load-balancers)) or an HAProxy load balancer for cloud vendors with no native load balancer support (currently OVH and Vultr) and [Registered Servers](../servers/registered-servers.md).

If you have set your `config.hosts` in Rails to only allow traffic from your own domain(s), your load balancer can be seen as a different host and be blocked by your application, which can bring down your entire application. You will need to add your load balancer's hostname to your allowed list, or disable the config.hosts feature (which we recommend against)

## Add a load balancer

To add a load balancer to your application: 

1. Open the **application** from the [Dashboard](https://app.cloud66.com/dashboard).
2. Click *Web* in the left-hand nav 
3. Click *Load Balancers* in the sub nav
3. Click the *+ Add Load Balancer* button
4. A panel will slide out from the left with options. Select what you need and then click *+ Add* to continue.

You can now watch the logs, as usual to see the progress of the process. Depending on which cloud provider you use, this load balancer will be set up differently.

### Supported Cloud Load Balancers

- **Amazon AWS**: [Elastic Load Balancing](https://aws.amazon.com/elasticloadbalancing/)
- **DigitalOcean**: [Load Balancers](https://docs.digitalocean.com/products/networking/load-balancers/)
- **Google Cloud Engine**: [Forwarding rules, target pools & health checks](https://developers.google.com/compute/docs/load-balancing/)
- **Hetzner Cloud**: [Load Balancers](https://docs.hetzner.com/cloud/load-balancers/overview)
- **Linode**: [NodeBalancer](https://www.linode.com/nodebalancers/)
- **Microsoft Azure**: [ApplicationGateway](https://learn.microsoft.com/en-us/azure/application-gateway/overview-v2)

### Automatic endpoint test

When a new load balancer is set up it will begin to ping your web endpoints to check their health. By default load balancers ping the root path of your application (`/`) and if they receive a `200` response code, they will consider a server healthy.

If your application does not have a valid endpoint or route set for `/` then you can specify a custom path under the `httpchk` option in your [manifest file](../manifest/_load-balancer-others.md) to ensure your application responds appropriately. We will configure the load balancer to ping that path rather than the root.

If your servers respond positively to the ping test, the load balancer will begin to distribute the load between them. If any of these ping tests fail, the load balancer will not distribute traffic to those servers that failed.

This feature is only available if you have deployed using a cloud vendor, and for applications running in production.

### Parallel deployments

When you have a load balancer on your application, your deployments can take place in serial to reduce downtime, or in [parallel](../deployment/parallel-deployment.md). Deploying in serial involves removing each server from the load balancer, deploying to it and then re-adding it to the load balancer in sequence.

## Adding multiple load balancers

One potential drawback of having a load balancer is that it is a single point of failure. To improve the high availability of an application, you can add more than one load balancer to it.

To add a second load balancer to your application:

* First add a standard load balancer to your application. You can follow the instructions above to do so. 
* Once this is in place, click the **+ Add** button in the panel at the bottom of the Load Balancer page (titled "Need to add additional types of load balancer to this application?")

This new load balancer is essentially a clone of your first one. Whenever changes are applied to your first load balancer, they will also be applied to any clones. Both load balancers are “live” and can distribute traffic to your application, but actually switching between load balancers requires an update to your DNS (see below).

### Switching between load balancers (with Failover Group)

If your external DNS record is pointing at a Failover Group targeting this application, then you can switch Load Balancers by specifying the "active" load balancer. To do this, click on "Make Active" dropdown on the row which will update the Failover Group DNS record to use the specified Load Balancer. If you don't see this dropdown, please note that this action requires permissions to edit the load balancer.

### Switching between load balancers (without Failover Group)

To switch traffic between load balancers, you should update the public DNS record for your application to point at the CNAME of your target load balancer. You can see the CNAME for any load balancer on the Load Balancers page (Click on Network &rarr; Load Balancers in the left-hand nav)

We recommend keeping your TTL for these records set to 300 (5 minutes) to reduce any downtime to a minimum.