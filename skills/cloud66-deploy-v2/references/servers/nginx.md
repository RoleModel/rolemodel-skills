# Managing and customizing Nginx


## About Nginx

Applications deployed with Cloud 66 use [Nginx](https://nginx.com) as their web server, and its configuration is dependant on the resources of your server(s). Nginx is a high performance, open source web server used by some of the biggest web services in the world.

### Boolean variables

To ensure correct boolean condition checks within your template, always explicitly compare the variable with `true` or `false` (even if you are checking for true).

**Good syntax:**

*   if passenger != true
*   if passenger != false
*   if passenger == true
*   if passenger == false	

**Bad syntax:**

*   if passenger
*   if !passenger

## Default Cloud 66 Nginx error page

When there is a problem with your upstream server (ie. a container), requests will be passed to the default Cloud 66 error page. From there, you can visit the problematic server page in Cloud 66 dashboard to troubleshoot. 

You can customise this page by following [this guide](../servers/nginx.md#customizing-nginx-configurations).

## Default Nginx configuration

The following table outlines the default configuration of Nginx.

|Category|Attribute|Default value|
|--- |--- |--- |
|**General**|||
||user|nginx|
||worker_processes|Dynamically set based on instance size|
||error_log|/var/deploy/[app_name]/web_head/shared/log/nginx_error.log|
|**Events**|||
||worker_connections|1024|
|**HTTP**|||
||gzip|on|
||gzip_min_length|100|
||gzip_proxied|expired no-cache no-store private auth|
||gzip_types|text/plain application/xml text/css application/x-javascript text/javascript|
||gzip_disable|"MSIE [1-6]\."|
||ssl_session_cache|shared:SSL:10m|
||ssl_session_timeout|10m|
||underscores_in_headers|on|
||default_type|application/octet-stream|
||client_max_body_size|50m|
||sendfile|on|
||server_tokens|off|
||keepalive_timeout|65|
|**Server**|||
||listen|80 default_server|
||server_name|_ or SSL server name|
||client_max_body_size|50m|
||root|/var/deploy/[application name]/web_head/current/public|
||ssl_certificate_key|/etc/ssl/localcerts/[ssl cerificate file name].key|
||ssl_certificate|/etc/ssl/localcerts/[ssl cerificate file name].crt|

## Nginx CustomConfig variables

The following variables are available for use in your Nginx CustomConfig.

|Variable Name|Type|Description|
|--- |--- |--- |
|user_name|string|User name running the application process|
|environment|string|Application environment name (lowercase)|
|server_address|string|Server address (IP or fqdn)|
|workers|integer|Number of CPU cores on the server|
|app_name|string|Application name (lowercase)|
|envars|hash|Hash of all environment variables on the application|
|allow_ssl|boolean|Is an SSL Certificate configured for the application?|
|perfect_forward_secrecy|boolean|Is perfect forward secrecy enabled for the application?|
|cors_enabled|boolean|Is CORS enabled for the application?|
|cors_origin|string|CORS Origins string|
|cors_origins|array|List of CORS origins|
|cors_all_origins|boolean|CORS allow all origins|
|cors_methods|string|CORS Methods|
|cors_headers|string|CORS allowed custom headers|
|cors_credentials|boolean|CORS allow credentials|
|has_ha_proxy_load_balancer|boolean|Are you using a HAProxy load balancer?|
|load_balancer_address|string|Address of your load balancer|
|red_http_to_https|boolean|Are you redirecting HTTP to HTTPS?|
|red_www|boolean|Are you redirecting traffic to www?|
|blacklist|hash|List of IPs you are blacklisting|
|supports_realip_module|boolean|Does your Nginx instance use the Real IP module?|
|stack_supports_nginx_tcp_and_udp_reverse_proxy|boolean|Does your application support TCP and UDP reverse proxy?|
|supports_tcp_proxy|boolean|Does your NGINX version support TCP reverse proxy and load balancing?|
|supports_udp_proxy|boolean|Does your NGINX version support UDP reverse proxy and load balancing?|
|has_load_balancer|boolean|Are you using a load balancer?|
|service_containers|array|Contains all services (with *service_name* and *upstreams* information)|
|service_name|string|Part of the *service_containers* hiearchy, containing the name of a specific service|
|upstreams|array|Part of the *service_containers* hiearchy, containing an upstream name, private IPs, traffic matches and port|

### How passenger pool max is calculated

`passenger_pool_max` is a Cloud-66-specific variable that we use to dynamically set a value in Nginx for the native Passenger setting `passenger_max_pool_size`.

We calculate the value for `passenger_pool_max` as follows:

passenger_pool_max = ( server's memory - reserved_server_memory ) / [passenger_process_memory](https://help.cloud66.com/deploy/2/manifest/_rails-rack)

...and this is rounded down to the nearest integer. So if your server has 4GB of free RAM and each process uses 600MB the your `passenger_pool_max` will be 6. 

## Nginx worker configuration

Nginx now supports [autodetection of CPU cores](https://nginx.org/en/docs/ngx_core_module#worker_processes) (and other system resources) so there is no need to configure your worker processes differently depending on your cloud.

## Customizing Nginx configurations

1. Open the application from your [Dashboard](https://app.cloud66.com/dashboard)
2. Click on *Web* in the left-hand nav
3. Click the *&#8615; More* button at the top right of the server group you wish to configure and select *NGINX Custom Config*
4. Edit the config as needed
5. Click *Preview* and check through the changes
6. Add a commit message and click *Commit to Server*

Editing and committing your Nginx CustomConfig will perform the following steps on **every web server in that group**, one by one, sequentially:

1. Open the application from your [Dashboard](https://app.cloud66.com/dashboard)
2. Click on *Application* in the left-hand nav
3. Click on *Servers* in the sub nav
4. Click the *&#8615; More* button at the top right of the server group you wish to configure and select *NGINX Custom Config*
5. Edit the config as needed
6. Click *Preview* and check through the changes
7. Add a commit message and click *Commit to Server*

Editing and committing your Nginx CustomConfig will perform the following steps on **every application server in that group**, one by one, sequentially:

*   Check your template for Liquid syntax errors
*   Count the number of cores on the server
*   Compile the Nginx configuration based on the information from the server
*   Upload the configuration to the server
*   Reload Nginx

Reloading Nginx does not interrupt the serving of traffic. This process will be stopped if an error is encountered. For example, if you have 3 web servers in your application, if the first server fails to be updated, the process will be halted for the other 2 servers to avoid complete service disruption.

A bad configuration may stop your Nginx from functioning, so take extra care when making changes. 

## Working examples 

### Customizing the Nginx error page

There are two ways for you to create a custom Nginx 50X error page:

1. Using a static page on your own server
    - Make your custom error page (for example `50x/`) available in your container (for example in `/usr/app`), and simply mount this folder to the host (for example with `/var/containers:/usr/app`). The path used in the next step would then be `/var/containers/50x/`
    - Customize your Nginx configuration and replace the 50X/ location block with following:  
```shell
    location = /50x/
    {
        root /var/containers/;
    }
```

2. Using external static page
    - Upload your file to a server which is accessible from your server
    - Customize your Nginx configuration and replace the _50X/_ location block with the following:  
```shell
    location = /50x/
    {
        proxy_pass {url-of-your-custom-page};
    }
```

### Enabling HTTP2

Nginx supports HTTP2 and this can be enabled on your application by editing your CustomConfig as follows:

Update the `listen` directive in the `server` block from this:

```shell
server {
        listen 443;
        ssl on;
```

...to this:

```shell
server {
        listen 443 ssl http2;
```

Be sure to remove the separate `ssl on` directive from the config, or it will not work.