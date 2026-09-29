# Querying server metadata


## Overview

Although your Cloud 66 Dashboard provides a complete view of all your applications, it can be useful to query metadata directly from a server. This can be useful for automating task management and status tracking, as well as for investigative tasks like debugging. The special `metadata` endpoint allows you to query a server's metadata while you are logged into it (via SSH).

## How to query metadata from a server

In order to manually query a server's metadata, you must first [log into the server via SSH](../servers/ssh-to-server.md). 

Once on the server, newer Cloud 66 servers will have a metadata server running locally on port `17540`. This metadata server is created and maintained automatically by the Cloud 66 agent running on your server. Note that older servers may still require metadata calls to https://app.cloud66.com/api

For newer servers: Please run the following,
```shell
curl localhost:17540/metadata
```

For older servers: Please run the following, (note the usage of Environment Variables that should be available on your server)
```shell
curl -s -H "Accept: application/json" https://$CLOUD66_ACCOUNT_API_KEY:X@app.cloud66.com/api/tooling/metadata/$CLOUD66_APPLICATION_API_KEY
```

The commands above will return **all** the available metadata for the server. However, you can also query subsets of the metadata using the names for each element and sub-element. Note that if your application doesn't have a local metadata server available you can replace the examples below with the older server example above.

For example this command:

```shell
curl localhost:17540/metadata/deployment/triggered_by
```

...will return metadata about who **triggered** the last **deployment**. 

Finally, when querying for metadata, it can be useful to parse the json response. We suggest installing and using `jq` for this. To install `jq`

```shell
apt install -y jq
```

## Examples of available metadata

### 1. deployment information

```shell
$ curl localhost:17540/metadata/deployment | jq
```

```shell
`{
  "response": {
    "finished_at": "2020-07-07T13:40:51Z",
    "outcome": {
      "code": 1,
      "meaning": "success"
    },
    "source": {
      "app": {
        "repo": "git://github.com/cloud66-samples/rails-mysql",
        "branch": "feature/redis",
        "hash": "a99f026df617ffaf9688d6c01fb1c4497189afd8"
      }
    },
    "started_at": "2020-07-07T13:37:35Z",
    "triggered_by": "your-email@yourdomain.com",
    "triggered_via": {
      "code": 0,
      "meaning": "web"
    }
  }
}
```

### 2. Server OS information

```shell
curl localhost:17540/metadata/server/os | jq
```

```shell
`{
  "response": {
    "distro": "ubuntu",
    "version": "26.04"
  }
}
```

### 3. Find out who deployed last (or currently)

```shell
curl localhost:17540/metadata/deployment/triggered_by | jq -r '.response'
```

```shell
`your-email@yourdomain.com
```

### 4. Find out which version of the code is deployed

```shell
curl localhost:17540/metadata/deployment/source | jq -r '.response'
```

#### Sample for Rails applications

```shell
`{
  "app": {
    "repo": "git://github.com/cloud66-samples/rails-mysql",
    "branch": "feature/samples",
    "hash": "a99f026df617************1fb1c4497189afd8"
  }
}
```

#### Sample for Container applications

```shell
`{
  "webapp1": {
    "image": "my/webapp:123"
  },
  "webapp2": {
    "repo": "git://github.com/cloud66-samples/rails-mysql",
    "branch": "feature/samples",
    "hash": "a99f026df617************1fb1c4497189afd8"
  }
}
```

## Using metadata in a workflow

One handy way to call this method is via a [deploy hook](../deploy-hooks/deploy-hooks.md). For example, you might want to fetch the name of the person who deployed to a server and pass it to a task tracking or audit logging system.

The deploy hook to achieve that would look something like this:

```yaml
`first_thing:
- target: any
  execute: true
  apply_during: all 
  sudo: false
  inline: |
    #!/usr/bin/env bash
    current_deployer=$(curl localhost:17540/metadata/deployment/triggered_by | jq -r '.response')
    echo "Deployed by: $current_deployer"
```

This hook will fire as soon as deployment starts (`first_thing`) and will query the `triggered_by` field and store the value in a variable. You can then use this variable as you need!