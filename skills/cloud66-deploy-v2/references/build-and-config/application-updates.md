# Managing Application Updates


## Overview

Application Updates allow you to manage changes to your application's components and supporting tools. This includes two 

1. Updates to the infrastructural components of your application
2. Updates to your Cloud 66 Dashboard or other related Cloud 66 tools

These can be the kinds of updates that *could* break your application if they are not tested first, or if they are done when your server resource utilisation is high (e.g. the busiest time of day or week). 

Some Application Updates have a **due date** and will be applied automatically when that deadline is past (during the maintenance window you have specified). Alternatively they can be manually applied at the time of your choosing.

Application Updates that have already been applied or are not applicable to your application are not shown.

## Using Application Updates

To see your Application Updates:

1. Log into your Cloud 66 Dashboard
2. Click on the app you wish to update (or check)
3. Click on ⚙️ *Settings* in the left-hand nav
4. Click on *Application Updates* in the subnav

This page lists all the updates that either:

- Still need to be rolled out
- Have been successfully rolled out

If an Application Update has a **due date** we will list it here. Once that date is reached we will roll out the update automatically during your next maintenance window.

### Setting a maintenance window

The default window for automatically rolling out overdue updates is Saturdays at `02:00 UTC`.  To set your preferred time window:

- Click the *Set maintenance window* link at the top right of the main Application Updates panel
- Choose the day and time (in `UTC`) you prefer. Bear in mind that times are for the UTC timezone and in 24-hour / military format.