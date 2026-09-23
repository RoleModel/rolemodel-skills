# Configuring Pod updates


## Overview

When you deploy new versions of your code to your application, Cloud 66 updates your Pods using the default (Kubernetes) strategy of rolling updates. This means that some of the Pods are "killed" while new Pods are being created, and others are left running (to ensure the application can continue serving clients). This process is repeated until all the old Pods have been replaced. 

The settings described below allow you to control the pace of this process and manage the resources the process can consume. The two available settings are:

- Max Unavailable
- Max Surge

These settings are service-specific, so different services in a single app can use different options. Both can be specified under the `constraints` directive in the `service.yml`. Read [our guide to using service.yml](../build-and-config/docker-service-configuration.md) for more help.

## Using the Max Unavailable setting

Setting `max_unavailable` for a service tells your cluster the maximum number of Pods that can be unavailable during the rolling update. This essentially sets a "floor" on the number of Pods that will be offline during the process. 

The value for `max_unavailable` can be a percentage or an absolute number. The default value is 50%. 

For example:

```yaml
services:
 your_service_name:
  constraints:
   max_unavailable: 30%
```

For more detailed information please read the [official Kubernetes documentation](https://kubernetes.io/docs/concepts/workloads/controllers/deployment#max-unavailable) on this setting. 

## Using the Max Surge setting

The `max_surge` setting controls how many extra pods can be created during the update process (i.e. in excess of your normal "desired" number of Pods). Increasing this gives your cluster more (temporary) headroom to spin up new Pods without first killing existing ones.

The value for `max_surge` can be a percentage or an absolute number. The default value is 50%. 

For example:

```yaml
services:
 your_service_name:
  constraints:
   max_surge: 20%
```

For more detailed information please read the [official Kubernetes documentation](https://kubernetes.io/docs/concepts/workloads/controllers/deployment#max-surge) on this setting.