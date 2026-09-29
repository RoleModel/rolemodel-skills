# Understanding server restart notifications


## Overview

When Cloud 66 provisions a server, it automatically installs and configures the **unattended-upgrades** package. This package is responsible for automatically applying security patches that are released by the Ubuntu package maintainers. Sometimes a package will be updated that impacts an already running process on your server, and the only way to update the already running process is to restart it. 

However, there is no generic way that the package manager can restart all affected processes, so it instead marks your system with a “restart required” flag, requesting user action to reboot the server (such that all affected processes are restarted). Unattended-upgrades could be configured to perform the restart automatically, but in any production environment, this is obviously not desirable! 

For affected servers, you will see a notification in your console when you connect to your server in the format: *** System restart required ***. Cloud 66 also displays these notifications in your dashboard.

If you need help restarting your servers safely, refer to [our guide on the subject](../servers/managing-required-restarts.md).

## Do I need to take immediate action?

Unfortunately, there is no generic way to answer that question. It very much depends on what has been updated and how critical your systems are. 

For instance, in general, it is more important to update your servers that are exposed to the outside world (ie. any servers that have external ports opened such as web or api servers) than an internal backend server not accessible from anywhere except internal systems. 

For this reason, Cloud 66 will prioritize restart notifications for any server with ports exposed to "anywhere" externally, although all restart notifications are visible on the server detail page. 

If the restart has not taken place for a long time then eventually the notification will surface on the application details page too. However, the urgency is very much application dependent.

## How do I restart my servers?
In order to minimize down-time, you can restart one server at a time (assuming you have a [load balancer](../load-balancers/load-balancer.md) in place). Selecting an out-of-hours time is recommended to minimize disruption. You can also use the [maintenance page](../deployment/using-maintenance-mode.md) to temporarily notify your users that you are performing maintenance.

To restart your server, it is recommended that you [SSH to your server](../servers/ssh-to-server.md) and run either of the following terminal commands:

```shell
sudo reboot 
```

```shell
sudo shutdown -r now
```

Depending on your cloud provider, if you instead choose to shut your server down, then start it again via the cloud provider dashboard, you may have new IP addresses assigned to your server. That can take a little while to propagate to Cloud 66 and your DNS provider, meaning you may have some unnecessary downtime should you choose this restart method.

## How does Cloud 66 determine my server needs a restart?

The unattended-upgrades package signals to the operating system that a restart is required by creating a file */var/run/reboot-required*. Cloud 66 will check periodically if this file is present and bring that forward into the UI. 

### I've restarted, but I still see the notification

It can take up to 12 hours for your notifications to be cleared. Deploying your application will cause an immediate refresh of your restart notification state (after deployment completes). You can also manually check your restart required status on your server by running the command:

```shell
sudo bash -c "if [ -f /var/run/reboot-required ]; then echo 'Server is requesting restart'; fi"
```

## Additional information

Visit the [Ubuntu documentation on automatic security updates](https://help.ubuntu.com/community/AutomaticSecurityUpdates) for additional information about Ubuntu unattended-upgrades.

## How do a restart my servers?

If you need help restarting your servers safely, refer to [our guide on the subject](../servers/managing-required-restarts.md).