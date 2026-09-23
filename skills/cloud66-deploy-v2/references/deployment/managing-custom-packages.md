# Managing custom packages


## Overview

Cloud 66 uses Ubuntu as the operating system for all our managed servers. (You can check [which versions we currently support here](../specs-and-policies/technical-specifications.md).) 

If your application relies on (packaged) software libraries that are not distributed with Ubuntu by default, you can configure your application to install them during your deployment. 

## Adding custom packages to your application

The best way to add custom packages to your application is using deploy hooks. If you're not already familiar with using deploy hooks, please follow our [tutorial](../deploy-hooks/deploy-hooks.md). 

Deploy hooks are very flexible, so there are multiple methods for installing packages. We're going to focus on the most straightforward way - running standard Ubuntu `apt-get install` commands via hooks. 

In this example we install the `zip` package to our `Production` environment using a [command hook type](../deploy-hooks/deploy-hooks.md#hook-fields-commands), targeting all our servers and we specify that this should **only be done when we build the server**, using the `apply_during` option: 

```yaml
    production:
        first_thing:
          - command: apt-get install zip -y
            target: any
            apply_during: build_only
            execute: true
```

(Remember to use the `-y` flag to automatically answer "yes" to all the installation prompts.)

If we instead want to install `zip` **every time we deploy** and to do so only on our Rails servers, our hook would look like this:

```yaml
    production:
        first_thing:
          - command: apt-get install zip -y
            target: rails
            apply_during: all
            execute: true
```

These examples assume that the best time in your deployment to add the packages is at the `first_thing` hook point. If your packages are dependent on other components that must be installed first (e.g. your database engine), you can use one of the [other hook points](../deploy-hooks/deploy-hooks.md#hook-points) to ensure the installation happens at the right time.

## More help

- [Deploy hooks](../deploy-hooks/deploy-hooks.md) syntax & commands (reference guide)