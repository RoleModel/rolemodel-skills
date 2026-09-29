# Bluepill (deprecated)


## Overview

Bluepill *was* Cloud 66's default process manager until June 2020. It has been replaced by [systemd](../servers/systemd.md). Some legacy servers (deployed before June 2020) may still be using Bluepill. 

To migrate from Bluepill to systemd, please follow the migration checklist below:

systemd is only supported by Ubuntu version 16.04 and up. As such you cannot migrate servers running 14.04 and below to systemd. Bluepill is only compatible with Ruby v2.2 and below - so you will need to migrate your app to a newer version of Ubuntu before you can upgrade Ruby beyond v2.2.

## Migrating from Bluepill to systemd

If your servers are currently using Bluepill and you would like to transition to using systemd then please follow this checklist:

1. Ensure none of your process **initialization strings** - including processes for custom web servers - use daemonization flags like `-d` or `-daemonize`.  Using these flag with systemd will cause the process to terminate prematurely. 
2. Check and update any of your **config files** that enable daemonization. This is particularly relevant for users using custom web servers:
    - [Puma](https://help.cloud66.com/deploy/2/build-and-config/puma-rack-server)
    - [Thin](https://help.cloud66.com/deploy/2/build-and-config/thin-rack-server)
    - [Unicorn](https://help.cloud66.com/deploy/2/build-and-config/unicorn-rack-server)
3. Set your application(s) to migrate (NOTE that this will require admin perms on the stack)
    - EITHER via web Dashboard: click ⚙️ *Settings* in the left-hand nav, then click the *Application Updates* tab, then **apply** the *Server Process Manager* update (if that update is not available, your app is already using systemd)
    - OR use the Toolbelt command: `cx settings set -s APPLICATION_NAME migrate.bluepill.to.systemd true`
4. **Redeploy** your application

As always, we recommend testing your changes in a non-production environment before updating your live application.