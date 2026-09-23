# Routing traffic to services using Nginx


## Overview

You can configure NGINX to route traffic to different services in a containerized application, based on variables like DNS matches and ports, using a combination of the `service.yml` file and the NGINX Custom Config file.

NGINX configurations for Cloud 66 applications use [templatized config files](../custom-config/custom-config.md) (written in [Liquid template language](https://shopify.github.io/liquid/)), which are hydrated based on the underlying application and service configurations.

The [service configuration](../build-and-config/docker-service-configuration.md) options relevant to the NGINX configuration are the service's name, as well as its `ports` and `traffic_matches`.

## High level overview

At a high level, the parts in the NGINX configuration relevant to targeting a specific service are as follows:

```liquid
http {
  # list of upstreams, which are maps of a name to a specific k8s service
  # all upstream names in the http NGINX block have the following structure:
  # {{ APPLICATION_UID }}_{{ SERVICE_NAME }}_http_{{ EXTERNAL_PORT }}_{{ VARIANT_TAG }}
  upstream UPSTREAM_NAME {
    # ...
  }

  server {
    # the port this server is listening on
    listen PORT;

    # all DNS matches that have the same protocol + port + upstream + SSL certificate combination
    server_name DNS_MATCHES;

    # list of server locations
    # currently we only generate one location at "/" that points to the service, but that might change in the future
    location / {
      proxy_pass UPSTREAM_NAME;
    }
  }
}
```

Based on the above, you have three choices of targeting services:

1. DNS matches for a service.
2. The port it's listening on (though this might match multiple services).
3. The upstream name that the default location points to.

## Targeting service by DNS matches

You can direct traffic from distinct domains to separate services within a single application by using the `traffic_matches` key in its `service.yml` file. For example, consider the following two services:

```liquid
services:
  nginx:
    image: nginx
    ports:
    - container: 80
      http: 80
      https: 443
    traffic_matches:
    - nginx.example.com
  caddy:
    image: caddy
    ports:
    - container: 80
      http: 80
      https: 443
    traffic_matches:
    - caddy.example.com
```

Both services listen on port 80 and 443, so just hitting port 80 or 443 on the server is ambiguous. However, because of the `traffic_matches` settings, hitting `nginx.example.com` will **always** go to to the NGINX service, and hitting `caddy.example.com` will **always** go to the caddy service.

You can then update your NGINX configuration to match traffic for specific domains. For example, the default NGINX configuration has the following blocks:

```liquid
<For server in servers>
<If server.protocol == "http">
server {
# ...
}
<Endif >
<If server.protocol == "https">
server {
# ...
}
<Endif >
<Endfor >
```

To add custom NGINX configuration to match traffic for `caddy.example.com`, you can do the following:

```liquid
<For server in servers>
<If server.protocol == "http">
server {
# ...
<If server.server_name contains "caddy.example.com">
# CUSTOM NGINX CONFIGURATION FOR caddy.example.com
<Endif>
}
<Endif >
<If server.protocol == "https">
server {
# ...
<If server.server_name contains "caddy.example.com">
# CUSTOM NGINX CONFIGURATION FOR caddy.example.com
<Endif>
}
<Endif >
<Endfor >
```

Because `server.server_name` is a space-separated list of domains, the code above would match other subdomains like `subdomain.caddy.example.com`. If you want to match a domain exactly, you can do the following:

```liquid
<For server in servers>
<If server.protocol == "http">
server {
# ...
<Assign server_names_array = server.server_name | split: " ">
<If server_names_array contains "caddy.example.com">
# CUSTOM NGINX CONFIGURATION FOR caddy.example.com
<Endif>
}
<Endif >
<If server.protocol == "https">
server {
# ...
<Assign server_names_array = server.server_name | split: " ">
<If server_names_array contains "caddy.example.com">
# CUSTOM NGINX CONFIGURATION FOR caddy.example.com
<Endif>
}
<Endif >
<Endfor >
```

One major caveat to this method is that, because NGINX servers are grouped by protocol + port + upstream name + SSL certificate, by routing traffic for one domain you might also route traffic intended for other domains to this service if they end up in the same NGINX server block. As such you should explicitly define domain matches and separate them into different blocks whenever possible.

## Targeting by port

You are also able to target services using the port on which they are exposed. For example, let's say you need a custom SSL configuration for all services that are exposed on port 8443. You can do this with the following NGINX configuration:

```liquid
<For server in servers>
<If server.protocol == "http">
server {
# ...
}
<Endif >
<If server.protocol == "https">
server {
# ...
<If server.listen_port == 8443>
# CUSTOM SSL CONFIGURATION FOR ALL SERVICES LISTENING ON PORT 8443
<Endif >
}
<Endif >
<Endfor >
```

## Targeting by upstream name

You can target services by matching on the upstream name that the `location` variable points to. Let's say you want to target the “caddy” service. The upstream name, has the format `# {{ APPLICATION_UID }}_{{ SERVICE_NAME }}_http_{{ EXTERNAL_PORT }}_{{ VARIANT_TAG }}`. To target by service name based on that syntax:

```liquid
<For server in servers>
<If server.protocol == "http">
server {
# ...
<For location in server.locations>
location {{ location.location }} {
<If location.proxy_pass contains "caddy">
# CUSTOM CONFIGURATION FOR THE caddy SERVICE
<Endif >
}
<Endfor >
}
<Endif >
<If server.protocol == "https">
server {
# ...
<For location in server.locations>
location {{ location.location }} {
<If location.proxy_pass contains "caddy">
# CUSTOM CONFIGURATION FOR THE caddy SERVICE
<Endif >
}
<Endfor >
}
<Endif >
<Endfor >
```

As per the previous example, you can use Liquid's `split` filter if you need to be more precise with matching.

There are a couple of caveats to using the upstream name:

1. The location variable is only available at the “location” point in the NGINX configuration, so you should ideally only use it to set location-level NGINX configuration.
2. If you are running in a cluster, then you can potentially have two services with the same name running on two different applications, but which share the NGINX configuration because they are running on the same cluster. In this case, you need to include APPLICATION_UID in your `contains` statement if you want to target accurately.