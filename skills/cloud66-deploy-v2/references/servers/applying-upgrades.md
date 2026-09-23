# Applying system upgrades


## Automated package update policy

Cloud 66 aims to make it easier to build **immutable** infrastructure. Building servers and applications from scratch is much better than modifying existing server configurations and tinkering with settings until things start to work.

When a new server is provisioned we automatically install the latest versions of packages. After the server is created we only auto-install packages that are marked as `security updates`. Cloud 66 doesn't (typically) automatically update other packages because it doesn't want to risk disrupting your existing application. However, depending on your configuration, we *may* update your packages each time you redeploy your app (see below).

## Controlling package updates

You can add custom Linux (Ubuntu) packages to your application using Deploy Hooks (read [our full guide here](../deployment/managing-custom-packages.md).)  Depending on how you've set them up,  Deploy Hooks can either install packages only when a new server is created, or on every (re)deploy (or both).

## Managing high-risk updates

If you're concerned about a major update to one of the packages you depend on, our first recommendation is to build a new application and redirect your traffic to the new application using your [Failover Address](../failover-groups/failover-groups.md).

If rebuilding is impractical or impossible, there are three approaches to dealing with the issue:

- Ignore the package update — this is the safest bet if you're concerned about app stability, but can create issues in the longer term. Be sure to check and update your Deploy Hooks so that the package doesn't get automatically installed the next time you deploy.
- Manually update the packages by logging into the servers and using `sudo apt-get -y upgrade` or `dist-upgrade`
- Update the packages indirectly through scaling up a new server, and then dropping the old one. New servers will have the latest packages installed on them unless you have explicitly locked package versions using Deploy Hooks.

 Some package updates require servers to be rebooted. When scaling up we restart your new servers automatically to ensure everything works correctly. Alternatively, you can reboot your servers manually or via the Toolbelt. 

## Upgrade package types

### Security updates

In the event of a security vulnerability on any of the components we deploy on the servers, we aim to be as quick as possible to roll out the recommended patches.

### Ubuntu

To manually trigger security upgrades:

1. Open the application from your [Dashboard](https://app.cloud66.com/dashboard)
2. Clicking on the *Deploy* button and choose *Deploy with Options*
3. Click on the *Options* tab
4. Check *Apply Security Upgrades* and *Yes, reboot my servers if required*
5. Click *Run Now*

This will perform operating system security package upgrades and also set up [unattended upgrades](https://help.ubuntu.com/community/AutomaticSecurityUpdates) for your application. Unattended upgrades will automatically check for and install the latest Ubuntu security packages on a daily basis.

Note that some security packages may require a server restart. We don't automatically restart your server, and it is at your discretion to do so. 

If the file `/var/run/reboot-required` exists, that means your server requires a restart. To see which packages contributed to the requirement for a restart, read `/var/run/reboot-required.pkgs`.

### Ruby

There are multiple options and considerations when upgrading your base version of Ruby. Please read our [detailed guide](https://help.cloud66.com/deploy/2/build-and-config/managing-and-upgrading-ruby-versions) on the subject.

A quick summary:

* Ruby version should be defined in your `manifest.yml` and *not* in a Gemfile (or `.ruby_version`)
* A safe way to roll out the upgraded version is to use our "scale up" feature to create a new server that uses the new version of Ruby

### Bundler

We automatically install the latest available version of Bundler whenever either:

- a new server is created
- the version of Ruby is upgraded on an existing server

If an existing server is throwing errors related to your Bundler version, the best option is usually to [upgrade Ruby](https://help.cloud66.com/deploy/2/build-and-config/managing-and-upgrading-ruby-versions) to a more recent version. Be sure to follow our best practice (linked above) when doing so to ensure the upgrade runs smoothly.

### Rails

Rails should be upgraded in the same way as Ruby. See above for details. 

### Passenger

The recommended way to upgrade your passenger to the latest one is to deploy to a new web server and drop the old one, so the scaled up one will automatically have the [latest version](../specs-and-policies/technical-specifications.md#component-versions) supported by Cloud 66.

### Docker

It is best to keep your Docker version up to date as they are released quite frequently with bug/security fixes.

1. Update your manifest file (Configuration Files -> Manifest.yml) and change the Docker version to the [latest one](../specs-and-policies/technical-specifications.md#component-versions).

2. Click on **Deploy** and choose **Deploy with options**
3. Go to the **More options** tab and tick the **Apply Docker upgrades** check box.

Upgrading in-place involves downtime as the Docker engine and local files are all upgraded. To maintain zero down-time you should clone your application and use [failover groups](../failover-groups/failover-groups.md) to switch to the new instance.

## Switching from malloc to jemalloc

If you’d prefer to use [jemalloc](https://jemalloc.net/) as your memory allocator, you can change this via your [manifest file](https://help.cloud66.com/deploy/2/manifest/_rails-rack). However, when you deploy (with upgrades) this **will** cause downtime as it is applied to each server. There are two solutions for avoiding downtime:

1. Use a [rolling deployment strategy](../deployment/parallel-deployment.md) (requires a load balancer & at least four servers)
2. Scale up new servers, upgrade them, and then switch them with the current servers ([see above](#managing-high-risk-updates))

## About manual upgrades

If you need to upgrade any part of your application the best course of action is always to build a new server. However, if that is not desirable or possible, you can always perform manual upgrades.

We detect the version of all the components we have configured or deployed on your servers on a regular basis and after each deployment. If you upgrade any part of your application manually, the upgrade will be detected by Cloud 66. This helps with the future automated upgrades.

## Troubleshooting package upgrades

Although there are an almost infinite number of issues that could occur with updating different packages, we have summarised some common issues:

### Deployment failed: Unable to install package(s)

The most common reason for this error is that the version of one or more components specified in your `manifest.yml` and/or `Docker` file conflicts with other components - particularly with the version of the underlying operating system (Ubuntu). 

If you are trying to upgrade an existing application - particularly one that had been running for 12 months or longer - be sure to check both your [Manifest file](../manifest/what-is-a-manifest-file.md) and (where appropriate) your Docker file. You can view and edit these files via your Dashboard or directly in your git repo.

If you have explicitly specified a version for any component in either of these files, Cloud 66 will attempt to use that version on the assumption that you have specified it for a good reason (such as backward compatibility). 

### "Failed to Fetch ... 404 Not Found" errors

The most common cause of these kinds of errors is some kind of interruption in network connectivity - typically between your cloud provider and the package repository. Such interruptions are not uncommon, and typically resolve themselves quickly. Wait a few minutes and try again. If the problem persists:

1. Check you can reach the server yourself ([via SSH](../servers/ssh-to-server.md))
2. If you can access the machine, you should attempt to run the package upgrade manually via ssh (using the standard `apt-get install <package>` command)
3. If you're still getting 404s you should check that your cloud provider's firewall isn't blocking access to the package repo (and/or [Cloud 66's IP range](../specs-and-policies/security.md#customer-protection)). 

### "Unable to find expected entry" errors

If your application depends on older or legacy packages, these packages (or the repos that support them) can sometimes cease to exist, particularly when an older version of an operating system reaches "end of life" (EOL). There are sometimes manual workarounds for this kind of things, but in general we recommend upgrading to packages that are being actively maintained. 

### "...has no installation candidate" errors

This typically only occurs if you're using your own ("registered") servers and running an unsupported operating system and/or distribution. You can [check which versions of Ubuntu we currently support](../specs-and-policies/technical-specifications.md#operating-system). The best plan here is to reinstall a supported version of Ubuntu.