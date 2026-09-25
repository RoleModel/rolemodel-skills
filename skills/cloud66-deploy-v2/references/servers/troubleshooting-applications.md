# Troubleshooting application issues


## Application not serving content

There are a number of factors that can lead your application to stop serving content. Follow this guide to eliminate the most common issues.

## Check you can SSH to your server

Start by checking if you can SSH to your server - follow our [SSH guide](../servers/ssh-to-server.md) if you need help. If you’re able to SSH to the server, try the steps below. If not, we recommend that you use your cloud vendor dashboard to try to connect to the server. Our separate guide to [troubleshooting server issues](../servers/troubleshooting-server-connection.md) may be of some help here. 

## Run a Health Check

You can run a [quick health check](../servers/application-health-checks.md#global-availability-checks) from your Cloud 66 dashboard. This will tell you if your application is responding to HTTP requests from our testing servers in four different regions. This will reveal (or rule out) any network connectivity issues between your own computer and your application.

To run a quick health check:

1. Log into your Cloud 66 Dashboard 
2. Open your application
3. Click the *Health Check* link at the top of the main panel (next to your application's name) 

A drawer will open from the left and will display the results of the test. A `200` response indicates that the web server is accepting and responding to connections. A timeout suggests that it is offline.  

## Check for HTTPS redirect

Is your application redirecting to HTTPS by default, and you don't have an SSL certificate installed?

You can check by visiting the IP address of your server in your browser, or using the following command to see if there is a redirect in place:

```bash
$ curl -I http://www.site.com
```

The output of this command provides you with lots of useful information, for example response codes, redirects and more. 

Additionally, an *immediate bounce* of this command indicates that there is no server listening, whereas a more *lengthy response* could indicate a [firewall](../security/firewall-rule.md) issue.

## Restart Nginx

Try restarting Nginx by issuing `sudo service nginx restart` on the server.

This should determine whether or not Nginx is having issues starting or serving content. For more detailed error logs, you can either check LiveLogs on your Dashboard or look at the log files in:

```bash
$ $STACK_PATH/log/nginx_error.log
```

It may be worth checking your [Nginx CustomConfig](../custom-config/custom-config.md#accessing-custom-config) history to see if any recent configuration changes are causing issues.

## Check web server logs

You may be experiencing an issue with your web server - the best way to check is to look at its logs in Live Logs. To find these:

- Log into your Cloud 66 Dashboard
- Open your application
- Click Live Logs in the left-hand nav
- Filter the logs to display your web server logs

## Check your application console

If everything is working until this point, you may have an issue  with your application's code. To find out, go to your application path by issuing `cd $STACK_PATH`.

You can then start the Rails console: `rails c`. Any error output will help you troubleshoot your issue. Once you've fixed the error, you can redeploy your code and your application should begin working again.

You can then start the console or shell for your chosen framework. Any error output will help you troubleshoot your issue. Once you've fixed the error, you can redeploy your code and your application should begin working again.