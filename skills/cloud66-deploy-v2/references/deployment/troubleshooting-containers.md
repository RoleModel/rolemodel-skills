# Troubleshooting containers


## Overview

Many Cloud 66 applications use containers to host and run their code. These container are powered by Docker, but you don’t need to be a Docker expert to use them. If a container is behaving incorrectly or refusing to start, there are some simple steps you can take to diagnose and fix the problem. 

## Checking the status of your containers

You can check the status of your app’s containers using:

- your [Cloud 66 Dashboard](https://app.cloud66.com/dashboard)
- the [command line](../toolbelt/_containers-list.md) (Toolbelt)

### Checking containers via the Dashboard

1. Log into your Cloud 66 Dashboard
2. Click on your application
3. Click on *Application* in the left-hand nav
3. Under the **Services** panel you will see a list of services with the number of containers (”instances”) for each one
4. Click on the name of a service to see a list of all the containers

The Debug Info button can be very useful when troubleshooting. 

### Checking containers via command line

You can use the `cx containers list` command to check on the status of your application’s containers. Please read the [how-to-guide](../toolbelt/_containers-list.md) for more details.

## Troubleshooting a container that won’t start

When you deploy your application with Cloud 66, the containers created from your image may have issues starting. 

You should ensure that your [containers run in development](https://docker-curriculum.com/#hello-world) before deploying with Cloud 66, as this will avoid the most common issues.

If a container is refusing to start you can find detailed logs in your Dashboard to help you diagnose the issue. These include:

- Application LiveLogs - real-time logging for your servers and services (a bit like tailing the log files on the server itself)
- Deployment logs - the logs from your cluster (i.e. the system hosting your containers)

To find these logs:

1. Log into your Cloud 66 Dashboard
2. Click on your application
3. Click on *Application* in the left-hand nav
4. Click on the name of a service 
5. Click the small down-arrow to the far right of the pod you wish to check and select the kind of logs you wish to view.

If a container will not start, the Deployment logs will often contain an explanation for the failure. If not, check the server and service logs to see if the problem is reflected in them.

## Troubleshooting a container that has started

If your container has started, but isn’t behaving as expected, you can follow these steps to troubleshoot:

1. Use the Dashboard to check the log output from your containers (see above)
2. Use the `cx containers attach` command to connect to detailed output (`STDOUT`) from the container ([guide here](../toolbelt/_containers-attach.md))
3. Use the `cx run` command with the `--interactive` argument and specify the name of the container to run commands inside it ([guide here](../toolbelt/_run.md)) It’s useful to be “attached” to a container while running commands to track the effects.

You can achieve much the same thing as 3 by clicking on the *Shell into container* button from the logs dropdown, but this is a web-based terminal emulator and many people prefer the native terminal.

Running standard debugging commands (like `HTOP`), or the debug commands appropriate to your application’s framework, will usually quickly reveal the source of the issue.