# Understanding Build Minutes


## What are Build Minutes?

BuildGrid is Cloud 66's integrated Docker image builder. Whenever you build images from source code you make use of a metered resource called **Build Minutes**.

## Calculating Build Minutes

Usage of Build Minutes is calculated by measuring the exact time (to the nearest second) that it takes for **your image(s) to build from code**. This includes the time taken to push the images into the image repo.

All other actions and functions do not consume BuildGrid minutes. This includes:

* Time in the BuildGrid queue 
* Time waiting for endpoints
* Time spent provisioning servers
* Time spent publishing / deploying images to servers

## Monthly Build Minutes

Each Cloud 66 account has a quota of Build Minutes included which refreshes each month. The number of Minutes available depends on the kind of account you have:

* Free accounts: 50 Build Minutes / month
* Startup: 200 Build Minutes / month ($0\.03 per min over)
* Growth: 200 Build Minutes / month ($0\.03 per min over)
* Premium: 200 Build Minutes / month ($0\.03 per min over)

## Build Minute overages

All **paid** accounts can exceed their monthly quota of Build Minutes. You will be charged for overages based on the following formula:

> (number of build minutes) x  $0\.03

So, for example, 4 extra hours of Build time would cost $7\.20 (240 mins x 3 cents per minute = $1.20).

At the end of each billing period we add up all overages and then round up to the nearest dollar.