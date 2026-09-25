# Logging & tracking support requests


## Overview

Our support ticketing system is integrated into the Cloud 66 Dashboard, and allows you to log new support tickets, and to check on the status of existing tickets. In addition, when you log a new ticket we run an availability check against your endpoints to provide additional insights into the issue you're raising.

## Logging a new support issue

To log an issue, just click on the *Support* link in the header bar of your [Dashboard](https://app.cloud66.com/dashboard). We will ask you for some details about your issue. 

If your  issue concerns a specific application or server, you should select that item from the dropdown list as this helps us enormously in tracking down the root cause of your issue. You'll notice that, as soon as you select an app or a component, we run a simple ping-style health check against its endpoints. [See below](#application-availability-testing) for more info.

You can choose to give our Support team permission to access your servers and/or deploy your application. Having these permissions normally speeds up the Support process considerably, but neither of them are requirements.

Once you have submitted a support request we will email you with the details of your ticket, and we will then communicate with you via that email thread for the rest of the support process. You can check the status of your tickets via the Dashboard (see below).

## Checking the status of a ticket

Our main channel for communicating about support issues is the email thread created when you submit your original request. However you can also see a summary of the last 10 tickets logged from your account.

To see the status of these tickets, click on Support in the header bar and then click the *Support Ticket Tracker* tab. This will give you a summary of each ticket. 

If you have accidentally deleted or lost track of a support request, please log a new request but include details of your previous request. 

## Application availability testing

Whenever you log a new support issue, we send an HTTP GET from multiple datacenter regions to the selected application or server using its Cloud 66 DNS name (e.g.`your-app-name.c66.me`).  If we get anything other than a `200 OK` response from any region we note this in your the ticket. 

If your application redirects traffic using HTTP Redirect, we will follow the redirections up to 3 times. Your application should respond to the call within 1 second.

The datacenter regions that we check from are:

- US West (Los Angeles)
- US East (North Virginia)
- Europe West (Netherlands)
- Asia North (Tokyo)
- Australia (Sydney)

This testing uses our open source project, [Watchman](https://github.com/cloud66-oss/watchman), a light, multi-instance service in different geographical locations that provides a full picture of a web endpoint's general health and global accessibility.