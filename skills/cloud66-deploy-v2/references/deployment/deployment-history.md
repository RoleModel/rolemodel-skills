# Using the Timeline


## Overview

The **Timeline** is a useful tool for tracking the version history of any application.

This timeline includes information about: 

* Who deployed
* When they deployed
* What code revision was deployed 
* How the deployment was triggered (web, [API](https://developers.cloud66.com) or [redeployment hook](../deployment/redeployment-hook.md)). 

## Accessing the timeline

The timeline is available for any application that has been deployed at least once. Open the application from your [Dashboard](https://app.cloud66.com/dashboard) - the timeline is on the "home" of each application. You can scroll through the history (it's in descending date order) or filter by the type of item.

You can also use this interface to see any activity (such as builds) currently in progress for the application.

## Deployment Status

A "Live" status indicates that the code in that commit is live on your servers.

A  deployment indicates that it has been successful, whereas a  one indicates failure.

A reverted deployment is one that is no longer on your servers (the application was rolled back to an earlier deployment).