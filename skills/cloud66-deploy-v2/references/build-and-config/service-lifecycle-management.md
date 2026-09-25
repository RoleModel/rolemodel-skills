# Customizing service life-cycle management


## Orchestration engine

Cloud 66 provides an orchestration engine to roll out Docker images to your servers and initialize containers from them. This includes:

- Bringing up containers
- Monitoring
- Scaling
- Port forwarding
- Load balancing
- Health checks
- Graceful draining and shutdown of workers
- Traffic switching
- Deployment rollbacks (version control)

 In the case of **Cloud 66 Container Service V2** this engine is Kubernetes. In the case of **Version 1** it is Cloud 66's own engine. 

## Deploying your application

The above can be summarized as the life-cycle management of your containers, which occurs with each new deployment of your application. This is what happens when you redeploy your application:

1. Your latest code is pulled from Git and new images are built
2. These images are rolled out to your server(s)
3. Containers are initialized from these images, with all relevant environment variables and internal networking made available to them.
4. If and when your health checks are successful, your old containers are gracefully drained and traffic is switched to the new containers (on the specified port(s)).

## Configuration

Below are all the directives you can set in your service configuration (`service.yml`) to customize your container life-cycle management.

(Read [our guide to using service.yml](../build-and-config/docker-service-configuration.md) for more help on customizing your service configuration.)

### Health

    
        Cloud 66 Container Service V2
        Cloud 66 Container Service V1
    

 
The `health` option allows you to specify different types of checks on your containers - **readiness** checks, **liveness** checks, and **startup** checks. These checks define a set of rules that determine whether your application is currently healthy. For instance, you can check whether an application is responding on an HTTP endpoint, or if a post-initialization file is present.

**Readiness checks** test whether newly started containers are ready to replace old containers. Until the new containers are ready, the old containers will not be killed, and the new containers will not be served traffic. This effectively provides zero down-time deployments.

**Liveness checks** continuously monitor your application while it is running. If your application fails a liveness check, it will be restarted. This is useful for issues that cannot be resolved otherwise.

**Startup checks** detect when a container has started. An active startup check will disable liveness and readiness checks until it succeeds. This prevents other checks from interrupting application startup. This is particularly useful for slow starting containers, because otherwise liveness checks might cause them to be killed before they are up and running. *Requires Kubernetes v1.16 or greater.*

Please see the [official Kubernetes documentation](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/) regarding these checks.

The options below are available for all health checks. Note that you aren't required to configure all the options. Any options not configured will use their default values.

-  **type** (*string, defaults to 'http'*): Accepted values are **http**, **https**, **tcp**, and **exec**.

-  **endpoint** (*string, defaults to '/'*): The endpoint tested for status. Only for the **http**, and the **https** types.

-  **command** (*string, no default*): The command executed to test for status. Must return exit-code 0. Only for the **exec** type.

-  **timeout** (*integer, defaults to 5*): Maximum time in seconds to wait for a health check to complete.

-  **success_threshold** (*integer, defaults to 1*): Number of consecutive successes to be considered healthy.

-  **failure_threshold** (*integer, defaults to 1*): Number of consecutive failures to be considered unhealthy.

-  **initial_delay** (*integer, defaults to 1*): Time in seconds to wait after container has started before starting liveness checks.

-  **period** (*integer, defaults to 5*): Number of seconds between each consecutive health check.

-  **port** (*integer, defaults to container port*): The port to run the health check against. Only for the **http**, **https**, and **tcp** types.

-  **http_headers** (*array, defaults to []*): Custom headers to add for HTTP traffic. Only for the **http**, and **https** types. Contains an array of hashes with the **name** and **value** keys, both of string type.

```yaml
services:
    [service_name]:
        health:
            ready:
                type: exec
                command: 'cat /tmp/initialization_complete'
            alive:
                type: http
                endpoint: /healthz
                success_threshold: 2
                failure_threshold: 2
                initial_delay: 10
                period: 30
                http_headers:
                - name: 'X-ID-Header'
                  value: 'john-smith'
            startup:
                type: exec
                command: 'cat /tmp/app_started'                  
```

You can also use the default health rules with `health: default`, or explicitly disable health checking by leaving the `health` option out or specifying `health: none`.

The `health` option allows you to specify rules to automatically determine if your newly started containers are healthy before killing old containers. This effectively provides zero down-time deployments. There are two types of health checks - `inbound` and `outbound`:

**Inbound health checks** use Cloud 66 to determine the health of your containers based on rules that you provide - when a new container is started during deployment, we will automatically attempt to get a response from the container on the specified endpoints. If we don't get the specified HTTP response code back within the "timeout" period we will assume the deploy has failed and roll back the container deployments.

**Outbound health checks** on the other hand allows your container to notify us of its health state, which is useful for services that don't expose an endpoint. The environment variable `CONTAINER_NOTIFY_URL` is automatically created and injected into your container, which accepts a POST request with two different JSON payloads depending on the health state.

A healthy container would be expected to POST `{"ready":true}` as its payload, while an unhealthy container can POST `{"ready":false, "reason":"error message"}`.

The rules below are available to health checks - note that you aren't required to specify all options. Any options not used will use their default values.

- **type** (*defaults to inbound*): Accepted values are `inbound` or `outbound`.
- **endpoint** (*defaults to `/`*): The endpoint tested for status.
- **protocol** (*defaults to HTTP*): Accepted values are `HTTP` or `HTTPS`.
- **timeout** (*defaults to 30s*): Maximum time to wait for a container to start, in seconds.
- **accept** (*defaults to 200 and 300-399*): HTTP response codes to accept.

```yaml
services:
    [service_name]:
        health:
          type: inbound
          endpoint: "/healthy"
          protocol: "http"
          timeout: "45s"
          accept: ["200"]
```

You can also use the default health rules with `health: default`, or explicitly disable health checking by leaving the `health` option out or specifying `health: none`.

### Post-start command

This is a `command` that executes immediately after a container is created.

### Pre-stop command

This is a `command` that executes immediately before a container is terminated.

### Pre-start signal

    
        Cloud 66 Container Service V2
        Cloud 66 Container Service V1
    

**This command is not supported by Cloud 66 Container Service V2.**

This is a signal that is sent to the existing containers of the service before the new containers are started during deployment. An example could be `USR1` - but it depends on what your container is running as to which signals make sense.

```yaml
services:
    [service_name]:
        pre_start_signal: USR1
```

### Pre-stop sequence

    
        Cloud 66 Container Service V2
        Cloud 66 Container Service V1
    

**This command is not supported by Cloud 66 Container Service V2.**

This is a stop sequence that is executed on your running containers before they are shut down. It is a sequence of wait times and signals to send to the process. If the sequence completes and the container is still running, a force kill will be sent. For example:

```yaml

services:
    [service_name]:
        pre_stop_sequence: 1m:USR2:30s:USR1:50s
```

The example above, we'll wait 1 minute before sending the USR2 signal, then wait 30 seconds before sending the USR1 signal, and then wait 50 seconds before we force a kill. These are some examples of duration values that `stop_grace` and `pre_stop_sequence` can use - `1m` (1 minute), `30s` (30 seconds) and `1h` (1 hour).

Valid time values are `s` for seconds, `m` for minutes and `h` for hours. Valid signal values for a signal are (without the quotes):

```ruby
'ABRT', 'ALRM', 'BUS', 'CHLD', 'CONT', 'FPE', 'HUP', 'ILL', 'INT', 'IO', 'IOT', 'KILL', 'PIPE', 'PROF', 'QUIT', 'SEGV', 'STOP', 'SYS', 'TERM', 'TRAP', 'TSTP', 'TTIN', 'TTOU', 'URG', 'USR1', 'USR2', 'VTALRM', 'WINCH', 'XCPU', 'XFSZ'
```

### Requires

    
        Cloud 66 Container Service V2
        Cloud 66 Container Service V1
    

**This command is not supported by Cloud 66 Container Service V2.**

In some cases, you may want to make sure that a service is only started if another, related service is also started. The `requires` option allows you to set such dependencies. For example:

```yaml
services:
    [service_name]:
        image: cloud66/sample
        requires:
          - "my_api"
```

### Restart on deploy

A boolean value to indicate whether the containers of this service should be restarted during deployment (set to *true* by default). For example:

```yaml
services:
    [service_name]:
        restart_on_deploy: false
```

### Stop grace

Sets the duration between the Docker `TERM` and `KILL` signals when Docker stop is run and a container is stopped. For example:

```yaml
services:
    [service_name]:
        stop_grace: 30
```