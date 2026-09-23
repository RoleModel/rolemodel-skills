# Configuring DNS & IP Addresses


## Cloud 66 hostnames

Cloud 66 creates unique DNS hostnames for each server you deploy with us. All servers are accessible via their Cloud 66 DNS name which follows the following pattern: 

`[server_name].[app_name].[environment].c66.me`. 

These use animal names to make them more easily recognizable. For example:

```shell
puma.railsdemo.development.c66.me
walrus.myapp.production.c66.me
```

Load Balancers also get a name from Cloud 66 DNS. The load balancer names look like `[app_name].[environment].c66.me`. For example, the DNS could look like: `myapp.test.c66.me`. Production applications don't have the environment in their names, for example `myapp.c66.me`.

This allows you to change the servers (and therefore IP addresses) for your application without needing to change any public DNS entries. You will need to manage the DNS records of your domain name to ensure that it's pointing to Cloud 66.

### Browsing your app via Cloud 66 DNS

You can browse your application directly by visiting the Cloud 66 address for the primary web server. To do this:

1. Log into your Dashboard
2. Open your application
3. Click on the Visit Site link (next to the app's name)

Cloud 66 creates unique DNS hostnames for each application you deploy with us. All servers are accessible via their Cloud 66 DNS name which follows the following pattern: 

`name-of-app-and-some-numbers.c66.me`

You can browse your application directly by visiting the Cloud 66 address. To do this:

1. Log into your Dashboard
2. Open your application
3. Click on the Visit Site link (next to the app's name)

## Finding your Cloud 66 hostnames

To find the Cloud 66 hostname for any server: 

1. Open your Dashboard and click on the application 
2. Click *Web* in the left-hand nav
3. Click the name of your server. This page displays your server's _Primary address_ (hostname) as well as the _Secondary address_ (IP address).

Some cloud providers automatically assign a new IP address to restarted servers.

## Finding your Cloud 66 hostnames

To find the Cloud 66 hostname for any server:

1. Open your Dashboard and click on the application 
2. Click *Application* in the left-hand nav
3. Click on *Servers* in the sub nav
3. Click the name of a server. This page displays your server's _Primary address_ (hostname) as well as the _Secondary address_ (IP address).

Some cloud providers automatically assign a new IP address to restarted servers.

### Failover hostnames

In addition to unique hostnames per server, Cloud 66 also offers [Failover Groups](../failover-groups/failover-groups.md) - managed, quick-response DNS addresses that automatically follow the web endpoints of applications.

Each Failover Group has a unique hostname with a 9 digit prefix (subdomain). For example `958-797-516.cloud66.net`. For maximum reliability, you should point your DNS at a Failover Group address.

## Configuring your DNS

There are three approaches to configuring your DNS - in the following recommended order:

### 1. Use an Alias or Aname

Some DNS hosts provide a CNAME-like functionality at the zone apex (root domain) using a custom record type.

The setup is similar for each provider - simply point the ALIAS or CNAME for your root domain to the [Cloud 66 hostname](#cloud-66-hostnames) for your application.

### 2. Use an A record with a load balancer

This involves using an `A` record to point your root domain at your load balancer and then redirecting traffic to www in Nginx.

1.  Create a CNAME record for `www` pointing at the [Cloud 66 hostname](#cloud-66-hostnames) of your load balancer.
2.  Create an `A` record for your root domain (e.g. `example.com`) pointing at your load balancer IP address.
3.  ​Use [network redirects](../networking/setting-up-redirect.md) to permanently redirect all traffic from `example.com` to `www.example.com`.

### 3. Subdomain redirection

This method will not work if you are serving content with SSL, and only works for HTTP traffic (i.e. not TCP or UDP). 

This method creates a 301 permanent redirect to a specified subdomain for all root domain traffic.

1. Create a DNS forward of `example.com` to `www.example.com`.
2. Create a CNAME record with value `www` to the [Cloud 66 hostname](#cloud-66-hostnames).

## Best practices for DNS

Where possible, you should avoid using a DNS A-record (which points directly at an IP address). Instead, you should use `CNAME` records to point your domain at a Cloud 66 hostname (either your server or failover group hostname). 

However, this may not be possible with your DNS provider. While CNAME records do not require hard-coded IP addresses, they are often not available to root domains (e.g. `example.com`). In other words, you may not be able to set a CNAME record pointing example.com to a Cloud 66 hostname. See **option 2** above for a solution to this issue.

To use wildcard subdomains with Cloud 66 hostnames, simply create a CNAME record pointing `*. .com` to your Cloud 66 hostname. 

## Cloud 66 Agent

Cloud 66 automatically detects the internal and external IP addresses of your servers through an agent installed on each server. This agent sends information about your server back to us at a 5 minute interval, which is used to auto-generate the `WEB_ADDRESS_INT` and `WEB_ADDRESS_EXT` environment variables (among others) when necessary.

To allow users the flexibility of choosing which one to use in their application, we also provide a WEB_ADDRESS environment variable, which by default is set to `{{WEB_ADDRESS_INT}}` but can be modified by the user.

### New IP addresses

If the agent fails to send us information for 20 minutes, the server owner is notified by email. Should the server IP address subsequently change, we are notified by the agent, which in turn updates the environment variables affected.

If the new IP address is reachable, Cloud 66 ensures that firewall rules are reconstructed, ActiveProtect is reconfigured and DNS records are updated accordingly. 

Furthermore, if required, the load balancer is updated to serve the new IP address. Once this process is complete, the server owner receives a notification of success by email and will be encouraged to redeploy the application.

## What’s next?

* Learn how to set up a [Failover Group](../failover-groups/failover-groups.md)
* Learn how to [configure network access](../networking/network-configuration.md) to your application
* Learn how to [add a load balancer](../load-balancers/load-balancer.md) to your application

## Adding custom domains for static sites

You can add one or more custom domains to any prebuilt application managed by Cloud 66. This allows your visitors to access your site via your own preferred web address (e.g. `www.mysite.com`) rather than your Cloud 66 address. See below for detailed instructions.

We automatically enable SSL on your domain when we set up your DNS. We will also automatically redirect any visits to HTTP to HTTPS. 

## Setting up a Custom Domain 

Setting up a custom domain for your Sites app has two stages - setting up a DNS record for your domain and then enabling it in Cloud 66.

### Stage 1: Add a CNAME to your DNS records

Before you enable your custom domain on your Sites app, you need to set it up to point to Cloud 66. To do this you will need to **log into your domain provider** and navigate to the **DNS record manager** (or editor) which will allow you to add a record pointing to your new site.

The next step depends on the kind of domain record you want to use. There are two types:

- Standard subdomains (e.g. `www.mysite.com` or `store.mysite.com`)
- Apex domains (e.g. `mysite.com`)

### Adding a subdomain record

If you’d like your site to use a subdomain like `help.mysite.com` or `blog.mysite.com` then you will add a **CNAME** record pointing to `ct.cloud66content.com`

For example, to set up your site to use `https://blog.mysite.com`:

1. Log into your domain provider and open the DNS manager
2. Add a CNAME record with the **host** (or **name**) field set to `blog`
3. Point the record to `ct.cloud66content.com` (the field is often named **value** or **data**)
4. Use the default `TTL` (you don’t need to change it)
5. Save (or apply) your changes

It can take up to 24 hours for this change to propagate, so you may need to attempt Stage 2 several times.

If you’re not sure how to do any of the above, google your domain providers name (e.g. GoDaddy) and the phrase “add domain record”.

### Adding an apex record

If you’d like your site to use an apex domain like `mysite.com` or `my-other-site.com` then you will need to add an `A` record pointing to Cloud 66’s IP address (`35.211.152.218`)

For example, to set up your site to use http://mysite.com

1. Log into your domain provider and open the DNS manager
2. Add an A record with the **host** (or **name**) field set to `@` or `root`
3. Point the record to `35.211.152.218` (the field is often named **value** or **data**)
4. Use the default `TTL` (you don’t need to change it)
5. Save (or apply) your changes

It can take up to 24 hours for this change to propagate, so you may need to attempt Stage 2 several times.

If you’re not sure how to do any of the above, google your domain providers name (e.g. GoDaddy) and the phrase “add domain record”.

### Stage 2: Enable your custom domain

1. Log into your [Cloud 66 dashboard](https://app.cloud66.com/) and click on the app
2. Click ⚙️ *Settings* in the left-hand nav
3. Click the *Add a Custom Domain*  link in the main panel 
3. Enter the custom domain you want to use and click *SAVE*
4. We will now attempt to set up a SSL certificate for your domain. If your DNS record is not properly set up or has not propagated yet, this process will fail.
5. To retry the process, click the *View Certificate* link and then the *Request Renewal* button

## Adding multiple custom domains

You can point multiple custom domains at a Sites site - including apex and subdomain records from the same domain. So, for example, you can set your site to work with both  `mysite.com` and `blog.mysite.com`. The only requirements for using multiple domains are:

1. That all of the required domain records have been configured with the domain provider
2. That all of the domains and subdomains are enabled on Cloud 66 (see Stage 2 above)

We will provision SSL certificates for each of these domains.

## Editing your custom domain

You can update your custom domain at any time by clicking the *Edit* button and then saving the update. However bear in mind that:

- You will need to update the DNS records for the new domain before this will work
- Editing your custom domain will trigger the creation of a new certificate for your app

## What's next?

- Configuring continuous deployment using [redeployment hooks](../deployment/redeployment-hook.md)
- Setting up [preview deployments](../deployment/preview-deployments.md)