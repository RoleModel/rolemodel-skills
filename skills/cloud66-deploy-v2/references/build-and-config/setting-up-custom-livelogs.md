# Setting up custom LiveLog files


## Overview

Live Logs is Cloud 66's real-time logging interface. It allows you to monitor your app via the Cloud 66 Dashboard. You can set up custom Live Logs via your [Manifest file](../manifest/_custom-livelogs.md).

## Defining custom Live Logs

All log paths specified **must exist on the server before the logs will work**, so you must create the directories manually where needed.

You can have multiple custom logs defined for different server roles. For instance the example below to add custom logs to all Docker servers and two sets of custom logs for all MySQL servers (on the same application):

```yaml
production:
    docker:
        configuration:
            custom_log_files: ["/tmp/dockerlogs/*/*.log"]
    mysql:
        configuration:
            custom_log_files:
            - "/another_mysql_dump_log/*.log"
            - "/var/log/mysql/error.log"
```

Server log file paths changes are refreshed after each deployment, so if you change your logs in your manifest, be sure to redeploy in order to see them on the Live Logs page.