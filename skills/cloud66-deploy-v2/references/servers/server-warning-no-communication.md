# Debugging server warnings


## Overview

If you see the following warning message on your dashboard:

**Server Warning** - No communication for at least 20 minutes

…please follow the guide below to try to determine the cause and the suggested next steps.

## What does the error mean?

If the Cloud 66 agent on a server is not able to ping Cloud 66 for **20 minutes**, we will display the *Server Warning* notice on the dashboard and on the individual server detail page.  (We will also notify you directly via your chosen channels.)

## Why has my Server lost Communication with Cloud 66?

This may happen for a number of reasons. We’ll explore some of the common scenarios below and describe how you might troubleshoot this problem and determine what action you should take.

### Is the Server Down?

- **Can you visit your website?** — Does it respond in your browser as you would expect? Try to browse it using both the web address and the IP of the server (the IP is available in the server detail page of the Cloud 66 Dashboard). If your site loads there may have been an intermittent connectivity issue that will resolve itself and the notification will be removed.
- **Has the server been shut down or paused?** — Check your cloud provider dashboard for details. Make sure the server is running. You can also try rebooting the server via your cloudn provider’s interface.
- [Can you connect to your server via SSH?](../servers/ssh-to-server.md) — If you can connect via SSH try running `htop` as described below.

### Is the server unresponsive due to high load?

This can happen if your server is overloaded. To determine if this is the case, SSH to the server and run the `top` or `htop` commands.

This will show you which processes are running and how much memory and CPU is being utilized. If you see excessive load, reboot the server via your Cloud Provider dashboard.

If the server is consistently coming under high load you should investigate upgrading it or scaling your application to use more servers.

### Are there any network connectivity problems?

It may be possible that there is either an intermittent or persistent network connectivity issue.

- **Check if you can ping your server** — This will help to determine if there are any network connectivity issues. To do this use this command in your local terminal: `ping yourdomain.com`
- **Run a trace route** — Try running the `traceroute` command via your local terminal.

If you see connectivity problems you should check your cloud provider and see if there are any network issues. Please check the status page of your cloud provider (see below).

### Is your Cloud Provider Down?

Occasionally your service provider may have problems. You can check this by visiting the status page of your Cloud Provider:

- AWS ([Status page](https://health.aws.amazon.com/health/status), [Twitter](https://twitter.com/awscloud))
- DigitalOcean ([Status page](https://status.digitalocean.com/), [Twitter](https://twitter.com/digitalocean))
- Equinix Metal (formerly Packet) ([Status page](https://status.equinix.com/))
- Google Cloud ([Status page](https://status.cloud.google.com/), [Twitter](https://twitter.com/googlecloud))
- Hetzner Cloud ([Status page](https://status.hetzner.com/))
- Microsoft Azure ([Status page](https://status.azure.com/), [Twitter](https://twitter.com/azure))
- Latitude.sh [Status page](https://status.latitude.sh/)
- Linode ([Status page](http://status.linode.com/))
- OVHcloud ([Status page](https://www.status-ovhcloud.com/))
- Vultr ([Status page](https://status.vultr.com/))

### Is Cloud 66 Down?

This may very occasionally happen due to site maintenance. Please check our service status pages:

- [Cloud 66 Status Page](http://status.cloud66.com/)
- [Cloud 66 Twitter account](https://twitter.com/cloud66status)

### I have none of these problems, but I still see this message

If you have ruled out the issues described above, and still see the notification please [contact support](http://app.cloud66.com/support_tickets/new).