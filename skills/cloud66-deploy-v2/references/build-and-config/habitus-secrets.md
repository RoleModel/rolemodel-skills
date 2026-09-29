# Integrating Habitus secrets with Cloud 66


## Overview

Habitus is a great tool for securely managing secrets during builds (among other things). If you'd like to integrate your existing Habitus build flow into a Cloud 66 application, you need to ensure the conditions below are met.

If you’re not an existing Habitus user, you’ll need to read through its [documentation](https://www.habitus.io/) to fully understand the purpose and power of the tool. You should also familiarise yourself with basics of [using Habitus with Cloud 66](../build-and-config/docker-service-configuration.md#using-habitus-for-builds).

## 1. Explicitly define secrets as Habitus environment variables

Your application (or service) must define any secrets you want to access as environment variables (ENV vars) with the format: HABITUS_ + ENV key. For example to access the secret with the key `MY_SECRET` you need to set an environment variable of `HABITUS_MY_SECRET`.

If you need help defining ENV vars in Cloud 66, please [follow our guide](../build-and-config/env-vars.md) on the subject.

Adding any variables with the `HABITUS_` prefix will signal Cloud 66 to automatically start Habitus in secret-serving mode.

## 2. Specify your secrets in your build.yml

Your `build.yml` file needs to specify the secrets that you want to be available during the build. For example the secret `MY_SECRET` defined above would be specified like this:

```yaml
build: 
 version: 2016-03-14 
 steps: 
  builder: 
   name: builder 
   dockerfile: Dockerfile 
   no_cache: true 
   secrets: 
    my_secret: 
     type: env 
     value: MY_SECRET
```

### 3. Call your secrets from your Dockerfile

Your Dockerfile can now securely call and use secrets via `ARG` and `$` statements. For example:

```docker
ARG habitus_host
ARG habitus_port
ARG habitus_password
ARG habitus_user
RUN curl -s -u $habitus_user:$habitus_password http://$habitus_host:$habitus_port/v1/secrets/env/my_secret # && do something with secret && remove the secret
```

You should pull the secret from Habitus, use it and then remove it all as part of the same operation. Doing it this way will mean that your secret will not be embedded into your resulting image.