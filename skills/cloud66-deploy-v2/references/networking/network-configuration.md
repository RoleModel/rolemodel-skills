# Configuring network access to your application


## Overview

All applications deployed via Cloud 66 use Nginx as a combined web server and reverse proxy. By default traffic will be routed to your application over ports 80 and 443 for HTTP and HTTPS traffic respectively. However, you may need your application to be accessible via a different port. This guide walks you through a basic example of changing the port through which your application is served. 

If you need help with service networking for containerized applications, please read our [Service Networking for Containers](../networking/service-networking.md) guide.

### What you'll need

Before you start, please check you have the following:

* **A Cloud 66 Account** &mdash; If you don't already have one, [sign up for a Cloud 66 account](https://app.cloud66.com/users/sign_up). Your first server is free, no credit card required.
* **An existing application set up in Cloud 66** &mdash; To make the most of this tutorial you need to have an app already set up in Cloud 66. Follow our [Getting Started guide](../getting-started/deploy-your-first-app.md) if you're not sure how to do this. 

## Changing the HTTP port

Let’s imagine that for some reason your application needs to use port 8080 rather than port 80 to serve traffic to the web. To achieve this we will need to override the default settings in Nginx. To do this:

1. Open the application from your [Dashboard](https://app.cloud66.com/dashboard)
2. Click on **Application** &rarr; **Servers** in the left-hand nav
3. Click on the **&#8615; More button** at the top right of the server panel you wish to configure and select NGINX Custom Config. 
4. Scroll through the configuration file until you find the `listen` and change the value from `80` to `8080`
5. Click the green *Preview* button to parse your updated configuration
6. Check the file, then add a commit message and click *Commit to Server*

If you now return to **application** and click on the *visit site* link, the page should fail to load. Now add `:8080` to the end of the URL and the index page should now load.

The change we made above was immediately applied to Nginx and did not require us to redeploy our application, but some changes do require that you redeploy you entire application before they are enabled. 

## More advanced options

Cloud 66 supports a wide range of configuration customizations for Nginx. You can read our [in-depth reference guide](../servers/nginx.md) for more details.

All changes to configuration files in Cloud 66 are automatically tracked and version controlled by CustomConfig git. Read [our guide](../custom-config/custom-config.md) to better understand the power of this feature.

Editing your Nginx configuration should be approached with caution as an incorrect value can break your application on the front-end. We suggest testing all changes in your non-production environments before applying them to a live application.
 

## Using Traffic Filters

By default, all web traffic is allowed to visit your servers on your desired ports. For Rails applications this is `80`, `443`, `8080` and `8443`. For Cloud 66 applications these ports are extracted from your exposed service configurations. The *Traffic Filters* tab allows you to set rules for access via these ports. 

You can filter traffic based on:

- The **source** (IP address range) it originates from
- The **country** it originates from

Each of these filters has three (mutually exclusive) strategies:

1. Allow traffic from any source and/or country (the default)
2. Only allow traffic from certain sources and/or countries ("whitelisting")
3. Block traffic from specific sources and/or countries  ("blacklisting")

### Source filtering

For the "allow" and "block" rules, you can use any combination of:

- Single IP addresses
- IP ranges (e.g. `23.12.123.54/16`)
- A URL that lists IP addresses in either `.txt` or `JSON` format.

Addresses in text format can be either comma separated or newline separated (but **not** a combination).

The JSON document can list IP addresses as an array:

```json
[192.168.1.1, 192.168.1.2] 
```

...or as a hash with a key where the key can be either "ips" or "ip_addresses", or "addresses" pointing to array:

```json
{ips:[192.168.1.1, 192.168.1.2, 192.168.2.2]}
```

### Country filtering

To add a country as a filter condition, click on the dropdown and then select it from the list. You can also type in the name of the country to "search" the list.

### Managing Traffic Filters

To implement or update Traffic Filters for your application:

1. Log in to your [Cloud 66 Dashboard](https://app.cloud66.com/) and click on your application
2. Click on *Application* in the left-hand nav
3. Click on *Traffic* in the sub-nav
4. Click the *Traffic Filters* tab above the main panel
5. Click on the radio buttons of the rule types you want to implement
6. Add your sources and/or countries as needed (multiple sources are supported for both block and allow)
7. Click *Review Changes* 
8. Review the rules that will be applied and then click *Apply Changes*

### Load Balancer Traffic

You can configure your application to only allow web traffic via your load balancers. This is useful for hardening your other servers against intrusions. However you may still want your own team to be able to query your other servers directly via the web. To allow this, you can specify a set of IP addresses that are exceptions to this rule.

To force all web traffic to flow via your load balancer:

1. Log in to your [Cloud 66 Dashboard](https://app.cloud66.com/) and click on your application
2. Click on *Application* in the left-hand nav
3. Click on *Traffic* in the sub-nav
4. Click the *Traffic Filters* tab above the main panel
5. Scroll down to *Load Balancer Traffic* and check the box to enable it
6. If needed check the "allow direct traffic to servers from these sources" box and then add your sources (multiple sources are supported)
7. Click *Review Changes* 
8. Review the rules that will be applied and then click *Apply Changes* 

## Using network redirects

The *Redirects* tab helps you perform simple but frequently used network redirects. These include redirecting traffic from *HTTP* to *HTTPS* or adding or removing the *www* prefix from your domain.

### Redirect HTTP to HTTPS

You use the Cloud 66 [SSL feature](../security/ssl.md) to add a certificate to your application and serve your traffic securely via HTTPS. To ensure that all your visitors use HTTPS, you should redirect anyone using HTTP to HTTPS.

This works by reconfiguring your Nginx configuration, so any visitor that arrives at port 80 and HTTP will receive a permanent HTTP redirect (301) to the same address on HTTPS.

To enable it:

1. Log in to your [Cloud 66 Dashboard](https://app.cloud66.com/) and click on your application
2. Click on *Application* in the left-hand nav
3. Click on *Traffic* in the sub-nav
4. Check the box next to **Redirect HTTP to HTTPS** 
5. Click *Apply Redirects*

### WWW or non-WWW in your URL

Some sites serve traffic on `www.domain.com`, while others use the bare `domain.com`. By default, your servers will serve traffic for any DNS record pointing to their address. This setting allows your to redirect visits to `www.domain.com` to `domain.com`, and vice-versa. This works by changing your Nginx configuration to permanently redirect (HTTP 301) visitors to the desired address.

To enable or disable it:

1. Log in to your [Cloud 66 Dashboard](https://app.cloud66.com/) and click on your application
2. Click on *Application* in the left-hand nav
3. Click on *Traffic* in the sub-nav
4. Select option 
5. Click *Apply Redirects*

## Setting custom headers for server responses

You can add custom HTTP headers to all the responses from your application. You can also clear existing headers, as needed.

In order to use custom headers, you may need to update Nginx via our Application Updates interface.

### Adding headers

To **add** headers to your app’s HTTP responses:

1. Log into your Dashboard and open your app
2. Click on *Application* in the left-hand navigation
3. Click on *Traffic* in the sub-nav 
4. Click on the **Headers** tab at the top of the main panel
5. Add header names and values as required (click the *+ Add Header* button to add multiple headers)
6. Click Save and Apply

We supply all the most common header names, but you can also add your own custom names as required. 

These headers will not overwrite existing headers - duplicates are allowed. To replace a header, you’ll need to add your own and then clear the existing header (see next section).

### Clearing headers

You can **clear** any of the standard headers normally sent from your application. To do this:

1. Log into your Dashboard and open your app
2. Click on *Application* in the left-hand navigation
3. Click on *Traffic* in the sub-nav 
4. Click on the **Headers** tab at the top of the main panel
5. Use the **Headers to Clear** field to select the headers you want to clear
6. Click Save and Apply

Bear in mind that headers perform important functions, so be cautious about removing them wholesale.

### Adding headers

To **add** headers to your app’s HTTP responses:

1. Log into your Dashboard and open your app
2. Click on *Settings* in the left-hand navigation
3. Click on *Headers* in the sub-nav 
4. Add header names and values as required (click the *+ Add Header* button to add multiple headers)
5. Click Save and Apply

We supply all the most common header names, but you can also type your own custom names as required. These headers will not overwrite existing headers - duplicates are allowed. To replace a header, you’ll need to add your own and then clear the existing header (see next section)

### Clearing headers

You can clear any of the standard headers normally sent from your application. To do this:

1. Log into your Dashboard and open your app
2. Click on *Settings* in the left-hand navigation
3. Click on *Headers* in the sub-nav 
4. Use the **Headers to Clear** field to select the headers you want to clear
5. Click Save and Apply

Bear in mind that headers perform important functions, so be cautious about removing them wholesale.

## CORS

Cross-Origin Resource Sharing (CORS) is an HTTP-header based mechanism that allows restricted resources on a web page to be requested from another domain outside the domain from which the first resource was served. This allows, for example, Ajax requests across domains. We strongly recommend [learning about CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) before attempting to implement it. 

If you have previously specified CORS settings in your [Manifest file](../manifest/_nginx.md), we will use these settings in the interface described below.

To manage CORS settings for your application via the Dashboard: 

1. Log in to your [Cloud 66 Dashboard](https://app.cloud66.com/) and click on your application
2. Click on *Application* in the left-hand nav
3. Click on the *Traffic* sub nav
4. Click on the *CORS* tab above the main panel
5. Click on the radio button to enable (or disable) CORS for your application
6. If you have enabled CORS, you can also configure the **Origin**, **Methods** and **Headers** settings (see the link above for more info on what these mean)
7. You can choose to share credentials by checking the box
8. Once you are finished, click *Review Changes* 
9. Review the rules that will be applied and then click *Apply Changes* 

You can also managed these settings via your [Manifest file](../manifest/_nginx.md).

## Application Surge Protection

To help prevent denial of service (DOS) attack, Cloud 66 automatically blocks any IP address that makes more than 1,500 requests per minute to your server(s). We call this Surge Protection. You can see if any IP addresses are currently being block by clicking on the [Active Protect](../security/active-protect.md) tab on your application's **Home** page.

You can enable or disable Surge Protection as needed, and you can also add exclusions to prevent your own sources from being blocked. If you use CloudFlare and/or AWS CloudFront we allow you to automatically exclude their entire IP ranges.

To configure Surge Protection for your application:

1. Log in to your [Cloud 66 Dashboard](https://app.cloud66.com/) and click on your application
2. Click on *Application* in the left-hand nav
3. Click on the *Traffic* sub nav
4. Click on the *Surge Protection* tab above the main panel
5. Click on the checkbox to enable or disable Surge Protection
6. Check the CloudFlare and AWS CloudFront boxes as needed
7. Add custom exclusions as needed (multiple sources are supported)
8. Click *Review Changes* 
9. Review the rules that will be applied and then click *Apply Changes* 

## Web Application Firewalls

Please read our [separate guide](../security/web-application-firewalls.md) for details on WAF.

### OWASP Rules

Please read our [separate guide](../security/web-application-firewalls.md#using-owasp-rules-with-your-waf) for details on OWASP rules for WAF.

## What’s next?

* Learn how to use [CustomConfig](../custom-config/custom-config.md) to manage the configuration files for components like Nginx 
* Learn how to [configure your public DNS](../networking/configure-dns.md) to work optimally with Cloud 66
* Learn how to [add a load balancer](../networking/configure-dns.md) to your application