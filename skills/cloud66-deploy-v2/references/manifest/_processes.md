# Processes Configuration


## Processes

[Background processes](../servers/systemd.md) can be deployed and managed by Cloud 66. Any process in a `Procfile` will be picked up, deployed and monitored by the system.

If you would like more flexibility over the signals used to control the processes, you can use the `procfile_metadata` section. Here is an example:

```yaml
procfile_metadata:
  worker:
    stop_sequence: tstp, 120, term, 30, kill
  web:
    restart_signal: usr1
    stop_sequence: usr1, 30, kill
  nsq:
    restart_on_deploy: false
```

In this example, a process called `worker` is stopped using a `TSTP` signal first. After waiting for 120 seconds, if the process is still running, a `TERM` signal will be sent. If it is still running after 30 seconds, it will be killed.

If your worker process is Sidekiq, the signal that puts it into "quiet mode" (finish current jobs, stop fetching new ones) is `TSTP` — supported since Sidekiq 5.0. `TTIN` only logs thread backtraces and does **not** stop job fetching, so using `TTIN` in a `stop_sequence` leaves Sidekiq pulling new jobs throughout the wait window. `USR1` was the legacy signal for quiet mode and has been deprecated in favour of `TSTP` since Sidekiq 5.0. This is about Sidekiq quiet mode only — `USR1`/`USR2` remain the correct phased-restart signals for web servers like Puma and Unicorn, as in the `web` example above.

For a worked example see [Long-running Sidekiq jobs across deploys](../build-and-config/long-running-sidekiq-across-deploys.md).

As for `web` or `custom_web` processes, you can specify a `restart_signal` which will be sent to the process serving web. This is useful for web servers that can do "phased" or zero-downtime restarts.

All processes restart during each redeployment of the application. If you want to avoid this, you can set `restart_on_deploy` to `false`.

The default values for **process signals** depend on which web server and/or process manager you are using.

For the default signals for web servers, click the links below:

- [Puma](https://help.cloud66.com/deploy/2/build-and-config/puma-rack-server#customizing-shutdown-and-reload-signals)
- [Unicorn](https://help.cloud66.com/deploy/2/build-and-config/unicorn-rack-server#customizing-shutdown-and-reload-signals)
- [Thin](https://help.cloud66.com/deploy/2/build-and-config/thin-rack-server#customizing-shutdown-and-reload-signals)

For non-web processes:

- [systemd](../servers/systemd.md) (our default process manager)
- [Bluepill](../servers/bluepill-legacy.md) (legacy pre-June 2020)

## Process Signal Options

### stop_sequence

Defines the sequence of signals sent to stop a process. Format: `signal, wait_time, signal, wait_time, ...`

Example:
```yaml
stop_sequence: term, 30, int, 10, kill
```
This sends TERM, waits 30 seconds, sends INT, waits 10 seconds, then sends KILL.

### restart_signal

Specifies a single signal to restart the process (useful for zero-downtime restarts).

Example:
```yaml
restart_signal: usr1
```

### restart_on_deploy

Controls whether the process restarts during deployment.

Example:
```yaml
restart_on_deploy: false  # Process won't restart on deploy
```