# Using Maintenance Mode


The maintenance mode feature is not available for containerised applications.

## Overview

When you have to make manual changes to your application or push out a breaking change, you may not be able to guarantee that your application remains responsive and functional during the deployment process.

During such times, you can set your application to *maintenance mode*, which serves a static holding page for the duration of your maintenance work.

## Using Maintenance Mode

1. Open the application from your [Dashboard](https://app.cloud66.com/dashboard)
2. Click on ⚙️ *Settings* in the left-hand nav
3. Click on the checkbox next to **Maintenance Mode**

Remember to give your application a few minutes to enable this change. 

You can still safely redeploy your application while maintenance mode is enabled - the maintenance page will be served until you turn off maintenance mode (by *unchecking* the same box).

## Setting a custom maintenance page

To supply your own maintenance page, simply place an HTML file in the following path of your repository:

```bash
/.cloud66/maintenance.html
```

This will override the default Cloud 66 maintenance page.