# Disabling older versions of TLS


## Overview

Supporting older versions of TLS / SSL - particularly version 1.0 - will make your application vulnerable to certain attacks. If your application is currently configured to support TLS 1.0 you should remove this support using the method below.

The configuration methods will differ depending on whether your SSL certificate terminates on your application server or on a load balancer.

Some older components still rely on older versions of TLS. We strongly recommend that you thoroughly assess the nature of all your components (including private or API users) before disabling support for any versions of TLS on your servers. 

## Disabling TLS 1.0 on the web server

Applications managed by Cloud 66 use Nginx as a combined web server and reverse proxy.  If traffic is flowing straight to your application server then we need to modify the configuration of your Nginx server.

You can configure the Nginx server for an application using [Custom Config](../custom-config/custom-config.md). In this case we want to change the following line from (for example):

```bash
ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
```

...to...

```bash
ssl_protocols TLSv1.1 TLSv1.2;
```

Your own config files may differ slightly - but the setting that needs to be changed is always named `ssl_protocols`. To disable `TLSv1.1` as well, simply remove it from the same line.

Once you have made the changes, add a commit message and save. The new configuration will be applied immediately. 

## Disabling TLS 1.0 on a load balancer

If your SSL terminates on your load balancer, then you will need to disable TLS 1.0 on the load balancer itself for this to take effect. The method for doing this differs depending on the load balancer you use. We have linked to solutions for popular load balancers below:

- [HAproxy](https://www.haproxy.com/documentation/aloha/) (our default load balancer - you can configure it via [Custom Config](../load-balancers/haproxy.md)
- [Amazon ELB](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/create-https-listener#describe-ssl-policies.)
- [Google Cloud Load Balancing](https://cloud.google.com/load-balancing/docs/use-ssl-policies) (via SSL policies)
- [Linode NodeBalancer](https://www.linode.com/docs/platform/nodebalancer/nodebalancer-reference-guide#tls-cipher-suites) (via cipher suites)
- [Microsoft Azure Application Gateway](https://docs.microsoft.com/en-us/azure/application-gateway/ssl-overview)
- Hetzner does not have a native load balancer but you can use [HAproxy](https://www.haproxy.com/documentation/aloha/) and configure TLS directly