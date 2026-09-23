# Configuring HAProxy


## Overview

HAProxy CustomConfig allows you to configure an HAproxy load balancer via the Cloud 66 Dashboard. In addition to the settings described below, you could also refer to the [HAProxy documentation](https://www.haproxy.org#docs) for more information about configurations.

## Change the HAProxy endpoint

By default, HAProxy will visit the _/_ endpoint on your application every 2 seconds to determine its state. This endpoint may need to change if that endpoint isn't available to the load balancer.

You will want to look at the _httpchk_ option to change the endpoint - the simplest solution is to create a low overhead non-auth HTTP route somewhere in your application.

For example, you could place a file called _check/_ in your _/public_ folder, which would be served directly by Nginx (not your application). It would be available at _/check/_.

In this case, you could replace the _httpchk_ section with this:

`httpchk HEAD /check/ HTTP/1.0`.

## Configuring HAProxy with CustomConfig

You can customize the HAProxy configuration on your HAProxy server using CustomConfig (below).

CustomConfig uses the [Liquid templating language](https://shopify.github.io/liquid/s). You can find many incredible guides and tutorials into the Liquid syntax around the web, but the syntax is easy enough to pick up in minutes.

The following variables are available to use in HAProxy CustomConfig.

### Config variables

|Variable Name|Type|Description|
|--- |--- |--- |
|haproxy_username|string|Your HAProxy username|
|haproxy_password|string|Your HAProxy password|
|httpchk|string|Default value is "HEAD / HTTP/1.0" unless specified in your manifest file|
|balance|array|Default value is "roundrobin" unless specified in your manifest file|
|errorfile_lines|array|Default is empty array unless specified in your manifest file|
|servers|array|Array of "server" objects that are to be load balanced (see below)|
|server.ext_ipv4|string|External IPv4 address (server is one of the items in the "servers" array above)|
|server.int_ipv4|string|Internal IPv4 address (server is one of the items in the "servers" array above)|

## Commit HAProxy CustomConfig

Editing and committing HAProxy CustomConfig will do the following steps for your HAProxy web server:

* Check the template for basic Liquid syntax errors
* Compile the HAProxy configuration based on the information from your load balanced web servers
* Upload the configuration to your HAProxy server
* Reload HAProxy

This process will be stopped if an error is encountered.

A bad HAProxy configuration might stop your HAProxy server from working. Take extra care to make sure the configuration is correct.

## Configuring HAProxy for maintenance mode

For **containerized applications** you can set your HAproxy to show a maintenance page when it cannot connect to the container.

* Create custom maintenance page
* Upload to haproxy server using the toolbelt:
```shell
cx upload -s stack_name --server haproxy_server_name maintenance.html
```
* Move the file haproxy directory:
```shell
sudo mv /tmp/maintenance.html /etc/haproxy/maintenance.html
```
* Configure haproxy to show the maintenance file by adding the below line to the end of the default section: `errorfile 503 /etc/haproxy/maintenance.html`

## Configure HAProxy to use internal IPs

By default, HAProxy is configured to use the external IP address of your servers, but it can be changed to use the internal addresses if you have private networking enabled.

Simply replace any `server.ext_ipv4` values with `server.int_ipv4` using HAProxy CustomConfig (below).

## Specify an HAProxy test interval

You can also specify your own test interval if you like - this is done in the _server_ section of your HAProxy configuration. This section is on line 53 of the default configuration.

To change the test interval to every 30 seconds (instead of the default 2 seconds), the template should look like this:

```shell
server web {{ forloop.index }} {{ server.ext_ipv4 }}:80 cookie "LSW_WEB{{ forloop.index }}" check inter 30000 
```

Please note the `inter 3000` at the end - this defines the test interval as 3000 milliseconds. Once this template is applied, it looks like this:

```shell
server web1 107.170.99.39:80 cookie "LSW_WEB1" check inter 30000
```