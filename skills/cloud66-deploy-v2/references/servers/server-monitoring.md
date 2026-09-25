# Monitoring your servers' resources


## Overview

Cloud 66 automatically monitors resource usage on all servers deployed via our service. We monitor utilisation of the following:

- CPU
- Memory
- Disk
- Network

This allows you to check whether your servers are experiencing high load and to diagnose any issues more quickly. Server Metrics are automatically collected and require no configuration. 

For more in-depth monitoring, we offer a [native Datadog integration](../servers/datadog-integration.md). 

## Where to find server metrics

To find metrics for any server:

1. Log into your Cloud 66 Dashboard
2. Open the application in question
3. Click through to a specific server 
4. Click on the Metrics tab above the main panel

You can also see Server-Group-level aggregates. These are visible on the Server Group page under the Metrics tab.

### I don’t see my metrics?

If your existing server displays no metrics, you should deploy the application and all the required components will be installed and configured. This is a one-off action for existing servers. New servers will have metrics enabled on them by default. You may have to wait for up to 20 mins for the first data points to be displayed.

## Understanding data collection

Cloud 66 automatically installs and configures the monitoring service (based on the Telegraf OSS project) on all servers. The service collects utilization data at 1 minute intervals and stores them for 7 days. 

## Options for additional monitoring

Most cloud providers now offer built-in server resource monitoring via their online dashboard, which can be a useful addition to your monitoring. If you need more specific detail (such as code-level monitoring) or or more granular reporting, we recommend implementing one of the many excellent cloud reporting solutions (see below).

Cloud 66 supports any third-party resource monitoring solution that is compatible with servers running [the versions of Ubuntu we currently support](../specs-and-policies/technical-specifications.md#operating-system). We have listed some commonly used solutions below, but this list is not exhaustive.

## Adding external monitoring services to your app

We offer a [native Datadog integration](../servers/datadog-integration.md) for more in-depth and feature rich application monitoring. 

If you'd prefer to use another external monitoring service, you can add it to your application in one of two ways:

1. Using a [deploy hook](../deploy-hooks/deploy-hooks.md)
2. Manually, [via SSH](../servers/ssh-to-server.md)

Deploy hooks are generally the best choice because they integrate the monitoring tool into your deployment pipeline and ensure it will be rolled out to every server in your application when you scale up, and that the latest version will be fetched whenever you redeploy. 

If you use a deploy hook, you should consider using Cloud 66's [custom environment variables](../build-and-config/env-vars.md) feature to manage the configuration variables for the service. This will allow you to control configuration without having to commit sensitive config files to your repo. 

## Common monitoring solutions

There are several excellent monitoring platforms on the market. For example:

* [Datadog](../servers/datadog-integration.md)
* [Scout](https://scoutapp.com/)
* [New Relic](https://newrelic.com/)
* [Prometheus](https://prometheus.io/)
* [Grafana](https://grafana.com/)
* [Nagios](https://www.nagios.org/)