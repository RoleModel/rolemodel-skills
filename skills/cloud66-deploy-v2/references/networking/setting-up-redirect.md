# Setting up a redirect


## Overview

All Cloud 66 applications come with a built-in tool to quickly enable commonly-used redirects. This includes:

* Redirecting traffic from HTTP to HTTPS
* Adding or removing the `www` subdomain from URLs

## What you'll need

Before you start, please check you have the following:

* **A Cloud 66 Account** &mdash; If you don't already have one, [sign up for a Cloud 66 account](https://app.cloud66.com/users/sign_up). Your first server is free, no credit card required.
* **An existing application set up in Cloud 66** &mdash; To make the most of this tutorial you need to have an app already set up in Cloud 66. Follow our [Getting Started guide](../getting-started/deploy-your-first-app.md) if you're not sure how to do this.

## Accessing redirect settings

1. Open the application from your [Dashboard](https://app.cloud66.com/dashboard)
2. Click on *Web* in the left-hand nav
3. Click on *Traffic* in the sub nav
4. Make the changes you require (see below for details)
5. Click *Apply Redirects*

1. Open the application from your [Dashboard](https://app.cloud66.com/dashboard)
2. Click on *Application* in the left-hand nav
3. Click on *Traffic* in the sub nav
4. Make the changes you require (see below for details)
5. Click *Apply Redirects*

You can now use this page to set (or remove) redirects.

## Redirect HTTP to HTTPS

If you have [added SSL certificates](../security/ssl.md) to an application, you can redirect all traffic to use HTTPS instead of HTTP.

This works by reconfiguring your Nginx configuration, so any visitor that arrives at port 80 and HTTP will receive a permanent HTTP redirect (301) to the same address on HTTPS.

To enable this: 
* Check the *Redirect HTTP to HTTPS* box 
* Click *Apply Redirects*. 

Remember to give your application a few minutes to enable this change. Then open your app in a browser and ensure the URL starts with `http`. The URL should immediately redirect to `https`. 

Bear in mind that if you haven't set up SSL certificates on your application that your browser will probably refuse to open the page as it appears to be insecure. 

## WWW or non-WWW

Some sites serve traffic on `www.domain.com`, while others use the bare `domain.com`. 

By default, your servers will serve traffic for any DNS record pointing to their address. This setting allows your to redirect visits to `www.domain.com` to `domain.com`, or vice-versa. (You can also choose to not redirect at all)

This works by changing your Nginx configuration to permanently redirect (HTTP 301) visitors to the desired address.

To enable this, choose the required option under *WWW or No-WWW in your URL* and click *Apply Redirects*. Remember to give your application a few minutes to enable this change.