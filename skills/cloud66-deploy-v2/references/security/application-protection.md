# Using Application Protection


## What is Application Protection?

If an application is particularly critical to your business, you can add an additional layer of protection to prevent it from being accidentally disrupted by high risk changes. 

Application Protection completely prevents an application from being:

- Deployed
- Scaled down
- Deleted

Any user with admin rights can both enable and disable Application Protection. This level of access should be extended to as few people as possible. 

## Enabling Application Protection

In order to enable (or disable) protection, you need to be an administrator on the application in question.

To enable Application Protection:

1. Log into your Cloud 66 Dashboard
2. Click on the application you wish to protect
3. Click on ⚙️ *Settings* in the left-hand nav
4. Click the checkbox in the *Application Protection* row

When an app is protected, you will not be able to trigger a deployment or to scale any servers or services down via the Dashboard or the Toolbelt. You will also be unable to delete the app. 

You can easily see which of your applications are currently protected by visiting your Dashboard's app list - protected apps are clearly marked.

## More ways to protect your app:

- [Application Private Networks](../security/using-application-private-networks.md) - a VPN built into your application
- [Web Application Firewalls](../security/web-application-firewalls.md)
- [Failover Groups](../failover-groups/failover-groups.md) - managed, quick-response DNS addresses that automatically follow your application’s web endpoints