# Understanding server build states


## Overview

Whenever you add new application servers (either when deploying a new app, or adding new servers to an existing app), those server(s) will go through two build states (or stages):

1. Ready
2. Optimized

We do this to allow you to start working with the new server(s) as soon as possible, while we optimize their configuration in the background.

## Build states explained

Servers will automatically progress from "ready" to "optimized" after we have installed all of the available updates and updated all of the configurations. This allows a significant saving in build times - particularly when you're building multiple servers.

### "Ready" servers

This means that the server is up and running and serving your application using the minimum of updates and packages. The server is available on your load balancer at this point (if you have one). Background processes are not running yet.

### "Optimized" servers

This means we've installed all the latest packages on your server and fully optimized the configurations. Background processes are now running.