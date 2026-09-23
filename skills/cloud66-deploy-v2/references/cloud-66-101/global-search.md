# Using Global Search


## Overview

Global Search is a powerful tool accessible from anywhere in your [Cloud 66 Dashboard](https://app.cloud66.com/dashboard). It searches across all your applications, servers, services, containers and more across your entire account.

## Basic Search

You can type any word or phrase in the search bar at the top of each page to start your search. By default this will search the following:

- Applications
- Servers
- Services
- Containers
- Firewall Rules
- Environment Variables
- Deployments

All queries can be a full or partial string. So both `awesome` and `awes` will find all entities with `awesome` somewhere.

## Advanced Search

You can narrow the search down with the "advanced search syntax". The general search syntax is `key:value`. This means you can run queries like this:

```shell
type:server
```

Global search supports the generic search directives:

- `tag` Search the tags
- `type` Search by type. Valid values are `stack`, `server`, `service`, `container`, `firewall`, 'environment' and 'deployment'

Each specific type might have some specific directives.

### Application directives

- `name` Search the application name
- `env` Search the application environment

### Server directives

- `name` Search the server name
- `address` Search server's IP address or DNS name
- `vid` Search the cloud provider (vendor's) ID for the VM

### Service directives

- `name` Search the service name

### Firewall directives

Firewalls can be searched only by their tags.

### Container directives

- `service` Search containers by service name
- `id` Search container by Docker UID
- `address` Search by Docker or ContainerNet container IP addresses
- `image` Search by the image name used by the container
- `server` Search by the name of the server running containers

### Environment Variables

- `key` Search environment variables by their key

### Deployment Variables

- `deployed_by` Name of the person triggering this deployment
- `git_hash` Git hash used in this deployment
- `git_ref` Git ref used in this deployment

## Complex queries
 
You can always combine queries to narrow your search down. Some examples are below:

- `type:server type:stack` returns all servers and applications under your currently selected account
- `env:production tag:active` returns all production applications tagged with `active`
- `lion type:firewall type:server name:bigcustomer` returns everything within servers and firewall rules of any entity with a name of `bigcustomer` that has `lion` in it.