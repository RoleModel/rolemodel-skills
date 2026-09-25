# Customizing service build commands


## Overview

If your service needs a custom build process, you can configure this in your application's `service.yml` file. If you're unfamiliar with custom service configurations, please read [our introductory guide](../build-and-config/docker-service-configuration.md) first. 

You can use the directives below in your `service.yml` to customize how a service's image is built.

## Build command

Specifies the command you would like to run during initial application build (runs on your Kubernetes host).

```yaml
services:
    <service_name>:
        build_command: bundle exec rake db:schema:load
```

## Build root

Specifies the directory of your repository in which you wish to run your build. You can also specify a [Dockerfile path](#dockerfile-path), which will be the Dockerfile used when building your service which is a relative value to this one.

```yaml
services:
  <service_name>:
    build_root: my_app_subfolder
```

This will default to the *root folder* of your repository if not specified.

## Command

Specifies the command used to start your container(s) (runs on your Kubernetes host).

```yaml
services:
    <service_name>:
        command: bundle exec rails s
```

## Deploy command

Specifies the command you would like to run during every application deploy (runs once per service).

```yaml
services:
  <service_name>:
    deploy_command: bundle exec rake db:migrate
```

## Dockerfile path

Specifies a relative path for your Dockerfile (from your *build_root*) to be used for building this service. For example, if you have a subfolder in the root of your repository called *docker* where your Dockerfile lives, you can specify this as follows:

```yaml
services:
  <service_name>:
    dockerfile_path: docker/Dockerfile

```

This will default to the value of *build_root*/Dockerfile if not specified.

## Git URL

The Git repository URL from which your image will be built. The Git URL you use to [allow us access to your repository](../cloud-66-101/access-your-code.md) will differ for public and private repositories.

```yaml
services:
  <service_name>:
    git_url: git@github.com:pkallberg/node-js-app.git
```

## Git branch

The Git repository branch your Docker image will be based on, for example `master`.

```yaml
services:
  <service_name>:
    git_branch: master
```

## Image

The source of your Docker image, which can come from a private repository that the credentials are provided. For [Docker Hub](https://registry.hub.docker.com/) images, use the following URL format:

```yaml
services:
  <service_name>:
    image: <namespace>/<image_name>:/<tag>
```

If you are pulling a public image from Docker Hub, use the following format:

```yaml
services:
  <service_name>:
    image: <namespace>/<image_name>:/<tag>
```

If you are using [Quay.io](https://quay.io/) for your image repository, you will use the following URL format:

```yaml
services:
    <service_name>:
        image: quay.io/<namespace>/<image_name>:/<tag>
```

## Using Habitus for builds

[Habitus is a build workflow tool for Docker](https://www.habitus.io/). It allows you to create a build workflow consisting of multiple steps for your Cloud 66 application. To enable Habitus you need to do the following:

1. Add a `build.yml` to your repository
2. Set `use_habitus` attribute to `true` in your `service.yml`
3. Set the `use_habitus_step` to the step you would like to use for your service in your `service.yml`

Check out the [Habitus website](https://www.habitus.io/) for more information about generating a `build.yml`. Read [our guide to using service.yml](../build-and-config/docker-service-configuration.md) for more help on custom service configurations.