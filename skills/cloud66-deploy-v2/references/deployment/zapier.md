# Automating tasks using Zapier


This feature is currently in Beta and only applies to Rails applications for now. Please contact us via our support channels if you run into any issues.

## Overview

Zapier is a SaaS platform that connects different services to each other and allows users of those services to build their own automated workflows to save on manual work and improve their reaction time. It's essentially a kind of middleware-as-a-service but with no additional coding required by either users or platforms.

Zapier has over 2,000 apps in its library including many of the largest cloud providers, and most of the major monitoring and reporting tools. This doc will explain the underlying principles of Zapier and walk you through setting up your own workflows. 

## Zaps, triggers and actions

The building blocks of Zapier are called **Zaps** - simple workflows based on **triggers** and **actions.** 

**Triggers** are conditions that, when met, cause a workflow to start. These are most commonly notifications and alerts. Cloud 66 currently has one **trigger event**: *New application created*. You can use this to make Zaps that fire each time you create a new application. 

**Actions** are the changes made to other systems as a result of a workflow being triggered. Cloud 66 currently has three **actions** available on Zapier:

- Scale up application
- Scale down application
- (re)Deploy application

These actions would allow you to, for example, scale up your application whenever your (Zapier-supported) monitoring tool reported 80% resource usage for a period longer than 10 mins, and then scale down again when resource usage dropped below 40% for 30 mins.

## Making a simple Zap

The best way to get going with Zapier is to create a simple Zap. This will allow you to:

- Connect the services you need to Zapier
- Learn how to configure each part of the Zap (the **trigger** and the resulting **action**)
- Test your Zap and see it in operation

In our example we're going to use a post in a private [Slack](https://slack.com/) channel as the **trigger** to redeploy our application. 

### Step 1: Set up the trigger

- Create a new private channel on your Slack account (give it an obvious name like "Zapier test")
- Log into Zapier and click the black + **Make a Zap** button
- Give your Zap a name (in the top bar)
- In the *Choose App* field, search for "Slack" and click on its icon
- Choose the trigger event called *New Message Posted to Private Channel*
- Click *Continue* and then *Sign in to Slack* (if you're already signed in and have multiple accounts, you can select the correct account now)
- Choose the private channel you created above and click *Continue*
- Click *Test & Continue* - the test should pass and move you on to Step 2.

### Step 2: Set up the action

- Search for "Cloud 66" in the *Choose app* field and click on its icon
- Choose the action event called *Deploy Application*
- Click *Continue* and then *Sign in to Cloud 66* (if you're already signed in and have multiple accounts, you can select the correct account now)
- Select the application you want to deploy when you trigger this Zap. The rest of the fields are optional, but give you an idea of the customizations available.
- Click *Continue* and then *Test & Continue*
- Turn on your Zap using the toggle switch that appears.

### Step 3: Trigger your Zap

We can now trigger our app to deploy by posting anything in our private channel. To see this in action:

- Open Slack and navigate to the private channel
- Open your Cloud 66 dashboard to the overview page
- Post a message in the channel and check your dashboard - the app status should immediately change to "deploying".

## Scaling up or down via Zapier

You can use Zapier to automatically trigger your applications to scale up or down based on inputs from any of the applications it supports. A great example would be connecting a monitoring service like Datadog to a Zap that scales your application up when it breaches a usage threshold. 

If you're planning to use this feature for an application please be sure of the following:

- Ensure the application has a load balancer in place. Without a load balancer the additional app servers cannot share the traffic! (This applies even if your minimum number of app servers is one).
- If your application has servers that should not be scaled down (because they are running a custom component or workload), be sure to tag them with [delete protection](../servers/scaling.md#delete-protection).