# Managing log files


## Overview

When Cloud 66 provisions servers, we automatically configure logging for various services. There are several logs available for different server components. Depending on the specifics of your application, log names and directories may vary. The information below is for a typical case.

## Containerized applications

Given the ephemeral nature of containers, we recommend you use the `log_folder` directive to persist container logs on your host, so that they don't disappear when the container stops. 

By default, any logs specified in the `log_folder` option of your service definition will **also** be available on the host (server) under `/var/log/containers/<namespace>/<service_name>`, for example:

```yaml
services:
    <service_name>:
        log_folder: /var/deploy/app/log
```

Please note that your we won't automatically capture STDOUT logs, and for this example, your application will need to be configured to write logs to a file under `/var/deploy/app/log`  (for example `/var/deploy/app/log/production.log`). 

This will store the logs for your service in **two places**:

- Inside the container: `/var/deploy/app/log`
- On the server hosting the container: `/var/log/containers/<namespace>/<service_name>`

The log path for a service is mounted **on the server hosting that pod** - not (necessarily) the Master.

## Rails applications

### Default Rails deployments

Default Rails deployments on Cloud 66 use Passenger (via Nginx) and the logs are stored in `$STACK_PATH/log`:

- Application (Rails) log: `$STACK_PATH/log/<environment>.log`
- Nginx error (server) log: `$STACK_PATH/log/nginx_error.log`
- Background processes: `$STACK_PATH/log/<PROCESS_NAME>_<NUMBER_OF_PROCESS>.log`

### Custom Rails deployments

If you are using a [custom web server](https://help.cloud66.com/deploy/2/servers/custom-web-servers), such as [Puma](https://help.cloud66.com/deploy/2/build-and-config/puma-rack-server), [Thin](https://help.cloud66.com/deploy/2/build-and-config/thin-rack-server) or [Unicorn](https://help.cloud66.com/deploy/2/build-and-config/unicorn-rack-server) then your log files will be as follows:

- Application (Rails) log: `$STACK_PATH/log/<environment>.log`
- Application logs (STDOUT + STDERR):  
  - Web: `$STACK_PATH/log/custom_web.log`  
  - Background processes: `$STACK_PATH/log/<PROCESS_NAME>_<NUMBER_OF_PROCESS>.log`  
- System logs  
  - Web server: `sudo journalctl -u cloud66_web_server`  
  - Background processes: `sudo journalctl -u cloud66_process_<PROCESS_NAME>@* -f`

## Other log directories

* Auth requests, Fail2Ban: `/var/log` 
* Nginx access and errors: `/opt/nginx/logs`

## Log rotation

Your logs in `$STACK_PATH/log` and `/var/log` are automatically rotated on a daily basis and by default kept for 14 days into a sub-directory called `archive` in each respective directory. These logs are compressed, and can be uncompressed with the following command: 
`gzip -d <log_file>.log.gz`.

You can set the frequency and the number of rotations to be kept [using the Cloud 66 Toolbelt](../toolbelt/_stacks-configuration-list.md).