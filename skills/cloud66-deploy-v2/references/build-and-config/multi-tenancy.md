# Running multiple apps on a server


Multi-tenancy is only supported by containerised applications - it is not available for native (monolithic) Rails applications.

Multi-tenancy is only supported by containerised applications - it is not applicable to static sites.

## Overview

Sometimes you need to run multiple applications on the same server (aka multi-tenancy). This could be because none of those applications has enough load to justify having a dedicated server for itself or it could be because all the apps on the server share many resources. Whatever the reason, you can achieve multi-tenancy for your application using [containers](../cloud-66-101/concepts-and-terminology.md).

## Defining Multiple Services

To host multiple applications on the same server, we need to define each one as a separate service. This can be done using the [service.yml](../build-and-config/docker-service-configuration.md) file:

```yaml
services:
  first_app:
    git_url: git@github.com:khash/my_first_app.git
    git_branch: master
    ports:
    - container: 5000
      http: 80  
      https: 443
  second_app:
    git_url: git@github.com:khash/my_second_app.git
    git_branch: master
    ports:
    - container: 5000
      http: 80  
      https: 443
  third_app:
    git_url: git@github.com:khash/my_second_app.git
    git_branch: master
    ports:
    - container: 5000
      http: 80  
      https: 443
```

This, however, has a problem: all applications share the same public ports (80 and 443). This means traffic coming to the server on port 80 (or 443) will be randomly served by any of the applications each time.

To fix this issue we can use the Domain Matching feature. Domain Matching allows us to share ports and split the traffic by the URL domain name that the client has requested:

```yaml
services:
  first_app:
    git_url: git@github.com:khash/my_first_app.git
    git_branch: master
    ports:
    - container: 5000
      http: 80  
      https: 443
    traffic_matches: ["firstpplication.com"]
  second_app:
    git_url: git@github.com:khash/my_second_app.git
    git_branch: master
    ports:
    - container: 5000
      http: 80  
      https: 443
    traffic_matches: ["secondapp.com", "www.secondapp.com", "second-app.com", "www.second-app.com"]
  third_app:
    git_url: git@github.com:khash/my_second_app.git
    git_branch: master
    ports:
    - container: 5000
      http: 80  
      https: 443
    traffic_matches: ["thirdapplication.com", "*.thirdapplication.com"]
```

In this example, we split the traffic based on the requested domain. As you can see you can match traffic based on multiple domains as well as wildcard (`*`) subdomains.

See [Custom Service Configuration](../build-and-config/docker-service-configuration.md) for more information on `service.yml`.