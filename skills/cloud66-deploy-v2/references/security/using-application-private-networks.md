# Using Application Private Networks


## Overview

An Application Private Network (APN) is a private, encrypted network running in parallel with your standard network - essentially a VPN for your application. Every Cloud 66 application automatically has an APN installed. This allows you to:

- Securely access your servers over an encrypted tunnel
- (More) securely exchange data between your servers within an application
- For the purpose of DB replications, connects the servers of *different* Cloud 66 applications to one another over a secure (encrypted) tunnel regardless of where they are hosted (including different regions and/or different cloud providers)

By completely eliminating the need for your servers to have any direct, public-facing network access, your APN can make your servers exponentially more secure. APNs run on [WireGuard](https://www.wireguard.com/), a very simple but very secure virtual private network (VPN) tunnel.

## APN Tutorial

All applications managed by Cloud 66 automatically have their own separate virtual private network. We call these **Application Private Networks** (APNs for short). The safest way to directly access any of your servers, whether via SSH, TCP, HTTP or another protocol, is through your app's APN.

This guide explains how to connect to an application's APN from your desktop machine and your mobile phone.

### What you'll need

- **A Cloud 66 Account** — If you don’t already have one, **[sign up for a Cloud 66 account](https://app.cloud66.com/users/sign_up)**. Your first server is free, no credit card required. 
- **An existing application set up in Cloud 66** — To make the most of this tutorial you need to have an app already set up. Follow our **[Getting Started guide](../getting-started/deploy-your-first-app.md)** if you’re not sure how to do this.
- **A WireGuard client on your device** - your APN runs on WireGuard, a very simple but very secure virtual private network (VPN) tunnel. [Install the client](https://www.wireguard.com/install/) that best suits your device.

### 1. Configure your APN client

Your APN is automatically configured at account-level. This means that, if you have multiple apps, **the same configuration file gives you access to all of them**.

To access your APN configuration file:

- Open your [Cloud 66 Dashboard](https://app.cloud66.com/)
- Click on your avatar (top-right) and choose *Account Settings*
- Click on the *Application Private Network* tab
- Click *App Private Network* in the **Account** panel on the left

The way to apply a configuration depends on the platform you're using:

#### Configuring a computer

- Scroll down to *Connecting your Computer to the APN*
- Download the WireGuard configuration file (by clicking on the link)
- Open your WireGuard client and select "Import tunnel(s) from file"
- Choose the config file you just downloaded

#### Configuring a mobile device

- Scroll down to *Connecting Mobile Devices to the APN*
- Scan the QR code using the WireGuard app
- This will create a new tunnel - be sure to accept or save the config

- If your app has more than 10 servers then you won't be able to use a QR code (the config file is too long to fit into such a code). You will need to download the config file and apply it as you would do for a computer.
- If you add servers to an application, you will need to download a new config file in order to access your APN.

### 2. Allow access via your application firewall

You need to allow WireGuard access via your application's firewall. To do this:

- Open the application page for the application in question
- Click on *Network* in the left-hand nav
- Click on *Private Network* in the sub nav
- Click the *Lease Now* button

This gives you 24 hours of APN access which you will need to renew, unless you create a [firewall rule](../security/firewall-rule.md).

### 3. Connect to your APN

You can now use the WireGuard to connect to your APN. 

- Select your APN tunnel from the list the Wireguard client
- Click *Activate*

You are now connected to your APN via the IP listed in the WireGuard client. 

### 4. Connect to your servers

Your servers are allocated to a specific IP range in the APN. For example:

`172.16.10.45/32`

You can find the APN-specific IP address of a server on your Dashboard:

- Open your application page
- Click on *Network* in the left-hand nav
- Click on the *Application Private Network* tab

You can use this IP connect to your servers directly from your device using your preferred method (SSH, HTTP etc).

If you change access levels for a user, they should download and re-apply the configuration.

## Configuring your APN

All Cloud 66 accounts have an APN automatically configured, and servers for each application are allocated to an [APN-specific IP-range](#apn-specific-ip-ranges--private-dns). 

Each time you add servers to an application, this configuration is automatically updated to include them. The only manual configuration required is to your firewall if you need to access your APN from an external IP (see below)

 If you're accessing your servers remotely via the WireGuard client, you will need to download a new config file whenever you add new servers to your app. 

### Allowing access via your firewall

There are two ways to allow access your APN via your firewall:

1. Temporarily, via the APN settings page for your application
2. Permanently via your firewall settings page

**Method 1** opens your firewall to APN access for 24 hours. To do this:

- Open the application page for the application in question
- Click on *Network* in the left-hand nav
- Click on the *Application Private Network* tab
- Click the *Lease Now* button

This creates a 24-hour lease based on the (current) local IP address of your computer.

**Method 2** requires you to manually add a firewall rule. WireGuard (and thus your APN) runs over **port 51820** and uses **UDP**. Please follow our [tutorial on adding firewall rules](../security/firewall-rule.md) for help on how to do this.

## Giving team members access to the APN

If your team members need access via the APN:

1. Open the *Account Settings* page
2. Click Teams on the account panel 
3. Ensure the team member has **Developer or HIGHER** role permissions for the application.

## Exchanging data between servers via APN

Servers can exchange data securely simply by using their APN-specific IP-range. All of the traffic exchanged across these IP addresses runs over the encrypted APN tunnels between servers. 

This means that, even if someone gained access to the private IP range of your servers, they would be unable to decrypt this traffic without the private keys of each server (which we store in encrypted format). 

## APN-specific IP ranges & private DNS

Each application under your Cloud 66 account has a range of (private) IP addresses over which the APN traffic flows.

You can find the IP address of a server on your Cloud 66 Dashboard:

1. Open the application page for the application in question
2. Click on *Network* in the left-hand nav
3. Click on *Private Network* in the sub nav
4. You'll see a list of your servers, each with their APN-specific IP address

### Private DNS

The APN also has a private DNS based on the names of the servers that allows you to route internal application traffic more easily (without having to use IP addresses). You'll find these domain names for each server in the same place and their APN IP addresses (see above).

The format is always: `<name of server>.apn`

You'll notice that there is also a DNS entry that uses the **application's private domain name.** This allows applications to communicate with each other without namespace collisions. 

## APN tech specs

Application Private Networks (APNs) use [WireGuard](https://www.wireguard.com/) to facilitate encrypted VPN tunnels, both between servers themselves, and remotely from the development team. 

### The security profile of WireGuard

WireGuard uses a set of [simple but powerful protocols](https://www.wireguard.com/protocol/) to make the VPN connections it establishes both extremely secure and quite robust. 

WireGuard has also undergone (and passed) many different [formal verifications](https://www.wireguard.com/formal-verification/), including "Symbolic Verification of Protocol using Tamarin", "Computational Proof of Protocol in eCK Model" and "Computational Proof of Protocol in ACCE Model". These include checks of properties such as:

- Correctness
- Strong key agreement & authenticity
- Key-compromise impersonation resistance
- Unknown key-share attack resistance
- Key secrecy
- Forward secrecy
- Session uniqueness
- Identity hiding

WireGuard is so well regarded that it is now included in the latest Linux kernel and will soon be bundled natively into Android OS.

### Our implementation of Wireguard

Cloud 66 has scrupulously adhered to best practices in integrating WireGuard into our systems including:

- Encrypting database entries for both public and private keys for each server
- Optimal use of routing & network namespace integration
- We follow best practices in the secure distribution of all WireGuard config files

### More info

- WireGuard's [official security page](https://www.wireguard.com/protocol/) (including a technical whitepaper)