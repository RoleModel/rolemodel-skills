# Filtering traffic to your application


## Overview

By default, all traffic is allowed to visit your web servers on ports `80`, `443`, `8080` and `8443`. Traffic filtering caters for six exceptions to this:

1. Explicitly allowing only certain IP addresses (whitelisting)
2. Explicitly allowing traffic only from certain countries
3. Explicitly denying certain IP addresses (blacklisting)
4. Explicitly denying traffic from certain countries (blacklisting)
5. Forcing traffic to flow via your load balancer(s) rather than hitting servers directly
6. Blocking (or allowing) direct traffic via your app's default *.c66.me domain

Cloud 66 also automatically rate limits IP addresses and will temporarily block an address that hits your application too often. Please read our [Application Surge Protection](../networking/network-configuration.md#application-surge-protection) guide for more details.

## Configuring Traffic Filters

To configure traffic filters for your application:

1. Open the application from your [Dashboard](https://app.cloud66.com/dashboard)
2. Click on *Web* in the left-hand nav
3. Click on *Traffic* in the sub nav
4. Click on the *Traffic Filters* tab above the main panel
5. Make the changes you require (see below for details of each type of filter)
6. Click *Review changes* and then *Apply changes*

1. Open the application from your [Dashboard](https://app.cloud66.com/dashboard)
2. Click on *Application* in the left-hand nav
3. Click on *Traffic* in the sub nav
4. Click on the *Traffic Filters* tab above the main panel
5. Make the changes you require (see below for details of each type of filter)
6. Click *Review changes* and then *Apply changes*

Whitelisting is not the same as removing [Application Surge Protection](../networking/network-configuration.md#application-surge-protection). These are two separate lists with separate functions. A whitelisted IP could still be rate limited.

## Allowing traffic (whitelisting)

Whitelisting is useful in cases where you need to lock down an application completely and only allow access for a specific IP (or range of IPs) or from specific countries. 

To whitelist a list of **IP addresses** or IP address **ranges**, navigate to the Traffic Filters page ([see above](#configuring-traffic-filters) for instructions) and then add the IP address or range to the *Only allow traffic from these sources* field. Then click *Review changes* and then *Apply changes*.

IP addresses and ranges can be entered as comma separated lists. For example:

```shell
23.213.76.19
23.213.76.1/16
23.213.76.19,31.152.18.22,197.222.132.0/24
```

You can also add lists of addresses via URLs. The URL must point to either a `txt` or `JSON` formatted document. See our [reference guide](../networking/network-configuration.md#traffic-filters) for more details. 

### Allowing traffic by country

To whitelist a **country** or set of countries, navigate to the Traffic Filters page ([see above](#configuring-traffic-filters) for instructions) and then select (or search) for the countries you wish to white list in the *Only allow traffic from these Countries* field. Then click *Review changes* and then *Apply changes*.

## Denying traffic (blacklisting)

You can also blacklist specific IPs and/or ranges from visiting the ports mentioned above. To do so, navigate to the Traffic Filters page ([see above](#configuring-traffic-filters) for instructions) and then add the IP address or range to the *Block traffic from these sources* field. Then click *Review changes* and then *Apply changes*.

You can test this by adding your [own IP address](https://whatsmyip.com/) to the *Deny* list and then trying to visit your application in the browser. If you've configured this correctly you will get a *403 Forbidden* error from your app's Nginx proxy. 

As above, you can enter IP addresses in comma separated lists, as ranges, or a combination. You can also add lists of addresses via URLs. The URL must point to either a `txt` or `JSON` formatted document. See our [reference guide](../networking/network-configuration.md#traffic-filters) for more details. 

### Denying traffic by country

Works identically to whitelisting by countries [above](#whitelisting-by-country), except that it uses the *Block traffic from these Countries* field.

## Control direct web traffic to default domains

We automatically provision (unique) [default (sub)domains](../networking/configure-dns.md#cloud-66-hostnames) for every application under `c66.me`. You can control whether this domain is directly reachable or not (it is reachable by default).

To control direct access to this domain: 

1. Open the application from your [Dashboard](https://app.cloud66.com/dashboard)
2. Click on *Web* in the left-hand nav
3. Click on *Traffic* in the sub nav
4. Click on the *Traffic Filters* tab above the main panel
5. Select the option you require (see below for details)
6. Click *Review changes* and then *Apply changes*

1. Open the application from your [Dashboard](https://app.cloud66.com/dashboard)
2. Click on *Application* in the left-hand nav
3. Click on *Traffic* in the sub nav
4. Click on the *Traffic Filters* tab above the main panel
5. Select the option you require (see below for details)
6. Click *Review changes* and then *Apply changes*

### Access options

By default web traffic is **allowed**, which can result in SEO penalties if search engines have found and indexed this domain.

**Blocking** direct traffic will return a 404 to visitors to that domain, and display [custom error page](../servers/nginx.md#customizing-nginx-configurations) you have configured. 

You can **redirect** any visits to another domain but the target domain needs a valid SSL certificate in order to enable this option.