# Using Cloud 66 via a firewall


## Overview

Most modern web infrastructure has built-in security systems, including firewalls, that are enabled by default. These can interfere with Cloud 66's systems and prevent us from reaching your servers to deploy and manage your applications. In order for Cloud 66's services to function correctly, we need you to ensure that your security systems give us the access we need.

You should only consult this guide if you are having trouble deploying to your servers. The vast majority of the time we are able to configure servers automatically and this information should be irrelevant to you. 

## Ports that Cloud 66 requires

In order to manage your servers we need full access to two TCP ports from specific (static) IP addresses:

- Port `22` from our entire range of [authorized IP addresses](#cloud-66s-authorized-ip-addresses) (see below).
- Port `3022` from our IP address `159.89.253.143` (this IP is static)
- Port `6443` from our entire range of [authorized IP addresses](#cloud-66s-authorized-ip-addresses) (see below).

- Port `22` from our entire range of [authorized IP addresses](#cloud-66s-authorized-ip-addresses) (see below).
- Port `3022` from our IP address `159.89.253.143` (this IP is static)

In general, with most cloud providers, we are able to gain access to these ports and set everything up automatically. It's generally only when we're dealing with [registered servers](../servers/registered-servers.md), or with cloud accounts in which additional security has been implemented, that we need your manual intervention. 

If you are manually managing access to these ports, be sure to only allow access to them from the specified IP addresses / ranges. Keeping them open to all hosts would be a major security risk. 

## Cloud 66's authorized IP addresses

Cloud 66 connects to users' servers from a set of authorized IP addresses:

All provisioned servers are configured to only allow SSH (and other secure) connections from these addresses. We may add new IP addresses to this range from time to time. You can check the very latest list of IP addresses via [this link](https://app.cloud66.com/authorized_ips).