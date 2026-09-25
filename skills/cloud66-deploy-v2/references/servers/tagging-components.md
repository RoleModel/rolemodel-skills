# How to tag your infrastructural components


## Overview

Many of the infrastructural and configuration components managed by Cloud 66 can be tagged. This includes entire applications, individual servers within an application, and many other elements like services and templates. These tags are useful for searching and filtering application components, both manually and as part of automated processes. 

## Adding tags to a server

There are two methods for adding tags to a server. Via the **Dashboard**, or in your **Manifest file**.

### Adding tags via the Dashboard

To add tags via the **Dashboard**:

1. Log into your Cloud 66 dashboard and click on your application
2. Click through to the server you'd like to tag
4. Click on *Add Server Tags* 🏷
5. Type the name of the tag and then click Save.
6. You will now be able to see the tag listed in the server panel

### Adding tags via the Manifest file

You can add tags to servers (but not to load balancers) via your [Manifest file](../manifest/what-is-a-manifest-file.md).

To add tags via your Manifest use the following syntax:

```yaml
<component name>
  configuration:
    tags: 
      creation:
        - type=web
        - anythingelse
```

So, for a MySQL server the YAML might look as follows:

```yaml
mysql:
  configuration:
    tags:
      creation: 
        - type=db
        - do-not-delete
        - master
```

Tags added via the Manifest are subject to the syntax restrictions and transformations described below.

Tags added via the Manifest file are only appended on the creation of new servers. To add tags to existing servers, use the Dashboard method (see above).

For more details please see our [full Manifest guide](../manifest/what-is-a-manifest-file.md).

## Propagation of tags to cloud providers

Some cloud providers (see table below) support the propagation of your Cloud 66 tags into their own tagging systems. This allows you to more easily identify and link components across different platforms. At the moment the only components that support this feature are **cloud servers** and **load balancers.** The level of support also differs depending on cloud provider. 

### Supported cloud providers and components

|Cloud provider|Components supported|Supports key/value tags?|Tag limit|
|--- |--- |--- |--- |
|AWS|servers, load balancers|yes|50|
|Azure (new)|servers, load balancers|yes|50|
|DigitalOcean|servers|no|64|
|Hetzner|servers|yes|100|
|Packet|servers|no|100|

### Syntax of propagated tags

When Cloud 66 propagates your tags, we transform them to ensure they are compatible with cloud provider systems. The exact nature of this transformation depends on:

- Whether they are **simple text tags**, or **key/value pairs**
- Whether the provider supports **key/value** formatting for tags

### Simple tags

For **simple tags**, we: 

1. Sanitize the tag to conform to DNS standards (non-conforming characters are transformed into `-`) 
2. Remove any trailing and leading dashes and transform any consecutive dashes into single dashes.
3. Prepend the tag with `cloud66-`. 
4. Truncate the tag down to 63 characters in length

So the tag `hello!world` would become `cloud66-hello-world` in the cloud provider's systems.

### Key/value tags

If a provider *supports* **key/value tags** (see table above), then we:

1. Sanitize both key and value to conform to DNS standards (non-conforming characters are transformed into `-`)
2. Remove any trailing and leading dashes and transform any consecutive dashes into single dashes.
3. Prepend the *key* with `cloud66-` and truncate down to 63 characters in length
4. Truncate the *value* to 63 characters in length

So if your original tag is `hello&&there=world` then we will propagate it as:

- KEY: `cloud66-hello-there`
- VALUE: `world`

If a provider *does not support* **key/value tags**, then we concatenate the entire key/value into a single tag, sanitize it, prepend it with `cloud66-` and truncate it as normal. So if your original tag is `hello%fish=world` then we will propagate it as `cloud66-hello-fish-world`

### Tag limits

Cloud providers all have limits on the number of tags each component can have (see table above). If a component has reached its limit for tags we will not attempt to propagate tags to that component as this can result in data loss or other issues.