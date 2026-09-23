# ActiveProtect


## What is ActiveProtect&trade;?

All applications deployed with Cloud 66 are automatically protected against [denial of service](https://en.wikipedia.org/wiki/Denial-of-service_attack) and [brute-force](https://en.wikipedia.org/wiki/Brute-force_attack) attacks. ActiveProtect also notifies you if important config files (such as `/etc/hosts`) are modified.

## ActiveProtect&trade; interface

The **ActiveProtect** page shows a list of current and past attacks (in the last 24 hours) with information about the source and destination.

To reach the page:

1. Open the application from your [Dashboard](https://app.cloud66.com/dashboard)
2. Click on the *ActiveProtect* tab above the main panel

## Configuring ActiveProtect&trade;

ActiveProtect is intended to be fully automated, but there are some cases where you can modify its behaviour.

* You can exclude your own IP addresses from being rate limited using the [Network Tools](../networking/network-configuration.md#application-surge-protection) in your Dashboard.
* You can add the same exception directly via your [Manifest file](../manifest/what-is-a-manifest-file.md).
* You can also manually [whitelist or block IP addresses](../networking/ip-filtering.md#allowing-traffic-whitelisting) using the same methods. 

## SSH soft blocking

Servers deployed with Cloud 66 only allow incoming SSH traffic from known IP addresses. To protect against brute-force SSH attacks, the servers are also configured to only accept SSH keys and not passwords. However, it is possible that user configurations result in vulnerabilities, and for such cases, repeated SSH login attempts are detected and blocked for at least 10 minutes.