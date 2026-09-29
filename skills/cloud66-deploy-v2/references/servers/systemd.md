# Managing processes with systemd


## Overview

By default Cloud 66 uses [**systemd**](https://manpages.ubuntu.com/manpages/bionic/man1/systemd.1/) to monitor and manage processes on all new servers. It is automatically installed on all servers provisioned through Cloud 66. 

The only exception to this is for some legacy servers deployed before June 2020. These servers may use [bluepill](https://github.com/bluepill-rb/bluepill). If you need help migrating from bluepill please see our [separate (legacy) guide](../servers/bluepill-legacy.md). 

## Using systemd

You can use systemd to manually control processes on your servers using the command-line interface. If you are familiar with Ubuntu or other Linux variants you should recognise many of these commands.

When you add processes through the Cloud 66 web interface, they will will also use systemd but will be managed by Cloud 66.

We have documented some of the most common commands below, but please [read the full man page for systemd](https://manpages.ubuntu.com/manpages/bionic/man1/systemd.1/) if you need more detail. You might also read [this excellent guide](https://www.digitalocean.com/community/tutorials/how-to-use-systemctl-to-manage-systemd-services-and-units) from DigitalOcean.

systemd does not require or support daemonized services. Unlike some other process managers (such as Bluepill), you should **not** add the `-d` flag to your systemd commands. 

### Process status

To get the status for all processes:

```shell
$ sudo systemctl 
```

To get the status for a specific process:

```shell 
$ sudo systemctl status <application>.service 
```

An example of this in practice would be `systemctl status nginx.service`

### Stop a service

To stop a service:

```shell 
$ sudo systemctl stop <application>.service 
```

An example of this in practice would be `systemctl stop nginx.service`

### Start a service

To start a service:

```shell 
$ sudo systemctl start <application>.service 
```

An example of this in practice would be `systemctl start nginx.service`

### Restart a service

Stops and then starts a service. Useful for refreshing a service after a configuration update:

```shell 
$ sudo systemctl restart <application>.service 
```

An example of this in practice would be `systemctl reload nginx.service`

### Reload a service

When supported, this reloads a service's config file without interrupting pending operations:

```shell 
$ sudo systemctl reload <application>.service 
```

An example of this in practice would be `systemctl reload nginx.service`

### Check if a service is running

Check if a service is currently running (active):

```shell 
$ sudo systemctl is-active <application>.service 
```

An example of this in practice would be `systemctl is-active nginx.service`

### Set a service to start at bootup

To set a service to start whenever the server is booted:

```shell 
$ sudo systemctl enable <application>.service 
```

An example of this in practice would be `systemctl enable nginx.service`

### Set a service to NOT start at bootup

To set a service to start whenever the server is booted:

```shell 
$ sudo systemctl disable <application>.service 
```

An example of this in practice would be `systemctl disable nginx.service`

## Process signals

The default process signals for systemd processes are:

### Web reload signals

The generic web process restart (reload) signal is `restart_signal`: `hup`

For the default signals for specific web servers, click the links below:

- [Puma](https://help.cloud66.com/deploy/2/build-and-config/puma-rack-server#customizing-shutdown-and-reload-signals)
- [Unicorn](https://help.cloud66.com/deploy/2/build-and-config/unicorn-rack-server#customizing-shutdown-and-reload-signals)
- [Thin](https://help.cloud66.com/deploy/2/build-and-config/thin-rack-server#customizing-shutdown-and-reload-signals)

### Non-Web processes

|Process type|Signal|
|--- |--- |
|sidekiq processes|`stop_sequence`: `term, 90, kill`|
|resque processes|`stop_sequence`: `quit, 75, term, 15, kill`|
|generic processes|`stop_sequence`: `term, 90, kill`|
|Restart|`restart_on_deploy`: `true`|

### Specifying custom signals

If you'd like to specify custom process signals you can do this in [your Manifest file](../manifest/_processes.md).