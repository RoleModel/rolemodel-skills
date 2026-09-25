# Managing required restarts


## Overview

When Ubuntu issues critical security patches, we update your servers immediately whenever we can. If doing so would disrupt your services, we need you to trigger the restart manually (so that we don't disrupt your application(s)). 

If you'd like to understand more about why these restarts are required, please read our [reference guide on the subject](../servers/server-restart-notifications.md).

## Restarting servers

### Preparing to restart

Doing so after-hours is recommended to minimize disruption.

In order to minimize downtime, you can restart one server at a time if you have a [load balancer](../load-balancers/load-balancer.md) in place, or you can use [failover groups](../failover-groups/failover-groups.md) to achieve the same thing.

You can also use the [maintenance page](../deployment/using-maintenance-mode.md) to temporarily notify your users that you are performing maintenance.

### Restarting via SSH

To restart your server, it is recommended that you [SSH](../servers/ssh-to-server.md) to your server and run either of the following terminal commands:

```shell
sudo reboot 
```

```shell
sudo shutdown -r now
```

Depending on your cloud provider, if you shut your server down via their dashboard, you may have new IP addresses assigned to your server. These may take a little while to propagate to Cloud 66 and your DNS provider, meaning you may have some unnecessary downtime should you choose this restart method.