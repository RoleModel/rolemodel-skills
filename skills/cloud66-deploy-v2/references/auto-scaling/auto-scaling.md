# Configuring Autoscaling


Autoscaling adds (or removes) resources to (or from) your application in response to changes in their utilization levels or responsiveness. So, for example, if your application servers are starting to run out of RAM, Autoscaling could fire up a new server in the background and add it to your load balancer automatically.

You can autoscale the following resources:

- Servers
- Workers

- Servers
- Services

Autoscaling is entirely determined by rules that you specify, so you have complete control over whether resources are added and removed (and when that happens).

## Configuring Autoscalers 

Autoscalers are sets of rules that are configured and managed via your Dashboard. The setup process differs slightly depending on which type of resource you want to autoscale.

Each application can only have one CPU, memory and response time Autoscaler, and one Queue Size Autoscalers per queue. 

### Autoscaling servers

To add or change a rule for your **servers**:

1. Open the application from your [Dashboard](https://app.cloud66.com/dashboard)
2. Click on *Web/Application* in the left-hand nav, and then *Servers* in the sub-nav
3. Click on the Autoscaling tab 
4. Click Add Autoscaler and select the type of rule (CPU, Memory, Response Time, [Queue Size](#configuring-queue-based-autoscalers))
5. A drawer will open from the left that allows you to configure the rule (see below for more detail on each type of rule)
6. Configure the parameters as required
7. Click *Save*

Your new Autoscaler will be active immediately - no need to deploy. You can check its logs (see below) to see how it is operating. 

### Autoscaling workers (processes)

To add or change a rule for your **workers**:

1. Open the application from your **[Dashboard](https://app.cloud66.com/dashboard)**
2. Click on *Workers* in the left-hand nav
3. Click on the *Autoscaling* tab above the main panel
4. Click *Add Autoscaler* and select the type of rule (CPU, Memory, Response Time, [Queue Size](#configuring-queue-based-autoscalers))
5. A drawer will open from the left that allows you to configure the rule (see below for more detail on each type of rule)
6. Configure the parameters as required (including which worker should be scaled)
7. Click *Save*

Your new Autoscaler will be active immediately - no need to deploy. You can check its logs (see below) to see how it is operating. Workers are scaled differently to servers - see the section below for details.

### Autoscaling services

To add or change a rule for your **services**:

1. Open the application from your **[Dashboard](https://app.cloud66.com/dashboard)**
2. Click on *Application* in the left-hand nav
3. Click on the *Autoscaling* tab above the main panel
4. Click *Add Autoscaler* and select the type of rule (CPU, Memory, Response Time, [Queue Size](#configuring-queue-based-autoscalers))
5. A drawer will open from the left that allows you to configure the rule (see below for more detail on each type of rule)
6. Configure the parameters as required (including which service should be scaled)
7. Click *Save*

Your new Autoscaler will be active immediately - no need to deploy. You can check its logs (see below) to see how it is operating.

### Configuring queue-based autoscalers

In order to use queue size as a metric, your application needs to have a task queuing resource of some kind in place. We support these options for autoscaling:

- Rails-based queue frameworks (Sidekiq, Resque, Delayed Job) via the [Cloud 66 gem](https://github.com/cloud66-oss/cloud66-rails)
- [RabbitMQ](../servers/rabbitmq.md)

In order to use queue size as a metric, you need to [add RabbitMQ](../servers/rabbitmq.md) to your application and actively use it as your message queue. 

Queue-based autoscalers use “queue size” as their metric. This counts the total number of jobs waiting in a queue and, if it breaches one of your thresholds, triggers one of your rules.

### Using the Cloud 66 gem

In order to enable queue-based autoscalers for your Rails app, you will need to add the Cloud 66 gem to your application. To install the gem, [visit the repo on GitHub](https://github.com/cloud66-oss/cloud66-rails) and follow the instructions.

The gem collects queue data from your preferred framework (Sidekiq, Resque or Delayed Job) and passes is to our metrics system. It automatically mounts an endpoint at `/cloud66/metrics/queue` which is only available from localhost.

## Managing Autoscalers

You can edit an existing Autoscaler by clicking on its name in the Autoscaling page of the Dashboard.

Existing Autoscalers can be **enabled** or **disabled** by clicking the small down arrow on the right, and then the respective button. You can **delete** Autoscalers via the same route. 

You can view the **logs** for an active Autoscaler by clicking its name and then clicking the *Logs* tab. This will show what recent activity the autoscaler has encountered. Note that we only log a small percentage of “no action needed” messages (to keep the logs compact and readable).

## Understanding Autoscaling rules

All Autoscalers have a common set of parameters: 

- A **range** (or tolerance) in which they operate
- A **lookback period** (the period used when calculating the average of the appropriate metric)
- **Upper** and **lower** limits for the number of resources. We will not scale resources below the lower limit, or above the upper limit. The range for both limits is 1 - 20. 
- You can also set an optional **cooldown** period between scaling events and allow **multiple resources** to scale simultaneously

An Autoscaler continuously calculates the **average** of the metric (CPU, Memory, Response Time) that it monitors over the **lookback period** and, if that average breaches the threshold(s) you have specified, it either adds resources to your application or removes them.

When servers are scaled down, they will not be automatically deleted unless you have have changed the [related setting](../servers/server-deletion.md) for your application

### Server sizes

Autoscalers will create servers based on the size of the last server added to a group. So, for example, if your current application runs on a t3.large instance from AWS with 2 cores and 8GB of RAM, your Autoscalers will create more servers of this exact size and type.

### How workers are autoscaled

When workers are autoscaled, they cannot be assigned to a particular server. Instead we analyse all of your servers and spawn a new worker process on the server with the fewest of those processes. We repeat this heuristic for each worker added, so that workers are evenly distributed across all your application servers. We use the inverse of this logic when we scale workers down.

You cannot currently select a specific server to which workers should be added, but we plan to add this in the near future.

### Autoscaler parameters

Autoscalers work using thresholds. You set an explicit range within which a resource may operate, and the Autoscaler will automatically scale up if the average of that metric exceeds the upper bound of that tolerance, and will scale down in the opposite case. 

Be aware that if you make this range very narrow, you will (possibly) breach it more frequently and therefore trigger scale ups (and scale downs) more often. If you set a threshold to either 0% or 100% then your application will never scale down or up (respectively) because you are explicitly indicating that the resource can run at its limit with no consequences. 

You can set both **upper** and **lower** limits on the number of resources for an Autoscaler. It will not create (or remove) resources outside of those limits. The minimum must always be greater than or equal to 1, and the maximum is 20. So if you already have, for example, 25 servers we will not scale up any further.  

The advanced options allow you to specify batches of resources for simultaneous creation and deletion (minimum of 1 and maximum of 10). You can also set a **cooldown period** (in minutes) between scaling events (the minimum is 20 minutes, with no maximum).

### Lookback periods

The period of time used to calculate the average of a metric - its lookback period - can have a dramatic effect on scaling. A very short lookback period might result in resources being scaled up prematurely due to a short-lived blip in utilization, whereas an overlong period might result in resources not scaling up despite load being unacceptably high for a sustained period. 

You should choose your lookback period carefully, ideally based on trends you have observed in your resource utilization. Always bear in mind that the ***average*** of the chosen metric must breach one of your limits before the Autoscaler will be triggered. So, for example, setting your upper CPU limit to 95% gives you very little headroom if utilization is climbing steeply.