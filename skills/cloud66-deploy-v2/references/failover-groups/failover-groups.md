# Failover groups


## Overview

A failover group is a managed, quick-response DNS address that automatically follows your application's web endpoints. 

You can connect it to up to two instances of an application at any time - a _primary_ and _backup_ instance. Should you need to switch traffic between your instances, you can flip a switch and your traffic will begin flowing to the _backup_ instance within 5 minutes.

## Tutorial

### What you'll need

Before you start, please check you have the following:

* **A Cloud 66 Account** &mdash; If you don't already have one, [sign up for a Cloud 66 account](https://app.cloud66.com/users/sign_up). Your first server is free, no credit card required.
* **An existing application set up in Cloud 66** &mdash; To make the most of this tutorial you need to have an app already set up in Cloud 66. Follow our [Getting Started guide](../getting-started/deploy-your-first-app.md) if you're not sure how to do this.

### Creating a failover group

To add your first Failover Group:

1. Click the *Failover Groups* link in the right-hand nav of the main *Dashboard* landing page (which lists all your apps). 
2. Click the *Add a failover group* button
3. Select your live application as the Primary Application
4. Leave the Backup Application set to "No Secondary application yet"

You'll now be taken to a list of your Failover Groups, and you'll see the Group you just set up. 

Notice that the group has its own unique domain, separate from your application servers. If you click on that domain, you will reach the same application that you created by following our [Getting Started](../getting-started/deploy-your-first-app.md) guide. 

This is the power of Failover Groups at work - the public CNAME for your application can stay static while the underlying servers change within a matter of minutes.

### Adding a secondary application

In order to properly use a failover group, you need to have a second instance of your application running somewhere. 

The simplest way to do this is to clone the demo application - follow [these instructions](../cloud-66-101/adding-updating-deleting.md#clone-an-application) to do so. 

Once your Secondary app has been successfully deployed:

1. Navigate back to the **Failover Groups** page
2. Click on the edit icon the the right of your only failover group
3. Set the clone application you created above as your *Backup Application using the dropdown.
4. Click *Update Group*

You'll now see that your failover group has two radio buttons - one for each of your application instances -  and that the button for your Primary instance is green. This means that it is currently receiving traffic while the Secondary is dormant. 

### Switching between instances

To switch between application instances in your failover group: 

* Click on the (grey) radio button of the Secondary instance. 
* A pop-up will open warning you about what is about to happen. 
* Click *Switch Traffic Now* to start the switching process.

After five minutes traffic will begin flowing to the Secondary instance. 

You can test this by visiting the failover address. The count of visits on your Secondary instance will be different from your Primary application. You can double check this by visiting the direct address for your Primary and comparing the visit counts. 

## How failover groups work

A failover group follows the web head of your application. In other words it points at your load balancer or, if you don't have one, your web server.

A failover group will automatically update to point at any newly added load balancer. Similarly, it is automatically updated when you rename your application or change your web servers.

A great way to test this is to use the `dig` command in your terminal, for example `dig 414-262-781.cloud66.net`, which allows you to see where the DNS is pointing.

## Why use failover groups?

There are two major use cases for this:

- **Application resilience**  
 By building and nominating a secondary backup on a different cloud provider or data center you can use a failover group to switch your visitors from the _Primary_ to the _Backup_ instances of your application with ease.
 
- **Cloning applications**  
 If you need to clone or rebuild your application, you can use a failover group to switch your traffic to the backup instance without interruptions to your service.

## Requirements and limitations

- You don't need to select any applications for your failover group. This allows you to reserve the address provided for future use. This is particularly useful when you want to keep address the same.
- Having a _backup_ application is not mandatory.
- You can only delete a failover group when it isn't pointing at any applications.
- Once you delete a failover group, the DNS record for it is permanently deleted and you won't be able to get the same address back.

## How reliable are Failover Groups?

Failover Groups are a fast response (low TTL) DNS system managed by Cloud 66 but backed by [AWS Route53](https://aws.amazon.com/route53/). In the unlikely event that Cloud 66 were to go down, your Failover Groups would remain up as long as AWS Route53 (which has a 100% uptime) is available. There is also no added latency involved in the system since it's based on DNS.
 
## Environment variables

There is an environment variable called `FAILOVER_STATUS` with three different values:

* `online` - traffic is flowing to this application
* `offline` - traffic is not flowing to this application
* `none` - this application is not part of any Failover Group

This variable allows you to configure notifications and other jobs on both applications that will only run for the app that is currently online.

## Using Failover Groups with SSL certificates

One of the challenges of switching to a backup instance of an application is SSL certificates: 

- If your certificate is not kept updated on the backup, then switching traffic over will result in errors and prevent your customers from reaching your app.
- If you're using Let's Encrypt, your SSL certificate on your backup stack can't be created or renewed because it doesn't actually receive traffic via your public (external) domain.

To solve these issues, Cloud 66 automatically handles the transfer of your SSL certificate(s) when you switch between your primary and backup applications (or visa versa). However for this to work correctly **ONE** of the following conditions must be met:

1. Your backup application must have **no certificate** installed 
2. The certificate on your backup application must declare the same **server names** as the SSL certificate on your primary application

This applies to both custom certificates (i.e. from a third party supplier) and to Let's Encrypt certificates.

Since your backup application is, by definition, not receiving traffic while your primary application is active, we will not automatically renew your Let's Encrypt SSL certificates on the application which is acting as a backup. It will be transferred and resume automatic renewal when you switch using your Failover Group.

## Testing Failover Groups

A great way to test Failover Groups is to use the `dig` command in your terminal, for example `dig 414-262-781.cloud66.net`. This allows you to see exactly where the Cloud 66 DNS is pointing.