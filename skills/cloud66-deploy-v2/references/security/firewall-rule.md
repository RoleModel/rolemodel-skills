# Configuring firewalls


## Overview

All Cloud 66 applications come with a built-in firewall. This firewall is automatically updated to allow traffic from ports and IP addresses as you add different components to your application.

However, you may want to use a service or component hosted outside of Cloud 66. The **Firewall** interface allows you to check existing (and default) rules and to set up (or edit) custom rules.

## Default firewall rules

By default, Cloud 66 gateway servers (eg. 54.84.166.97) are the only servers allowed SSH (port 22) access to application servers. 

The default firewall rules include database and web ports appropriate for the application deployed but also includes ports 8080 and 8443 as alternative HTTP ports for WebSocket-based applications. 

Editing and removing the default firewall rules is disabled to ensure that your servers remain secure at all times.

## Adding a custom firewall rule

If you need to SSH directly into your servers from an external IP address, and for whatever reason, you can't use the [Toolbelt](../toolbelt/using-cloud66-toolbelt.md#access-your-servers-via-toolbelt) to do so, you will need to add a custom rule.

By default, the firewall will block any attempts to SSH from a foreign IP address. To find the IP of a server, visit **application**, click the *Server* tab and look for the IP next to each server.

In this example, we're going to add a rule that allows you to SSH into your server from your own desktop. There is actually a [quicker way to do this temporarily](#enabling-temporary-access) but we will be adding a permanent rule instead. 

Before we start you need to look up your current public IP. You can simply google this, or use a site like [WhatsMyIp](https://www.whatismyip.com/).

### Adding and applying the rule

1. Open the application from your [Dashboard](https://app.cloud66.com/dashboard)
2. Click on *Network*  in the left-hand nav
3. Click the *Add a new firewall rule* button
4. This will add a set of input fields that allow you to configure your first rule. Paste or type your own **IP address** into the *From* field 
5. Choose the **server** you're going to access from the *To* dropdown (*master* is a good choice)
6. Choose the **protocol** of allowed connections (this should be *TCP*)
7. Choose the **port** you will open (22)
8. Click *Apply Rules*

If you want to open a custom port to you server in Microsoft Azure, you must add an endpoint for that VM in your Azure management portal after adding the rule in your Cloud 66 dashboard.

### Testing the rule

Now give your application 5 to 10 minutes to reconfigure itself, and try to SSH into the server again. The server should now respond, rather than timing out.

Note that, unless you have set up an authentication key, your login attempt will fail - but the server should still respond with the details of the denial.

## Removing a custom firewall rule

1. Open the application from your [Dashboard](https://app.cloud66.com/dashboard)
2. Click on *Network*  in the left-hand nav
3. Click the small red icon next to the rule you want to remove
4. Click *Apply Rules*

Remember to give your application a few minutes to apply the new setting(s).

## Enabling temporary access

If you need to access your server (via SSH or another protocol), there is a quick way to do this without setting a permanent rule:

1. Open the application from your [Dashboard](https://app.cloud66.com/dashboard)
2. Click on *Network*  in the left-hand nav
3. Click the small plug icon at the top right of the Application Firewall Rules panel
4. This will automatically fetch your current IP address, but you can also manually enter any IP address
5. Choose how long the port should be open (10 or 20 mins)
6. Define the **port** you're using (the default is 22)
7. Click *Let me in now*