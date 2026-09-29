# Custom LiveLogs Configuration


## Custom LiveLog files

You can add custom live log files for each component. For example:

```yaml
rails:
  configuration:
    custom_log_files: ["/tmp/mylog/*/*.log"]

```
...or

```yaml
docker:
  configuration:
    custom_log_files: ["/tmp/dockerlog/*/*.log"]
postgresql:
  configuration:
    custom_log_files: ["/tmp/your-other-log.log"]
```

## Supported Components

Custom log files can be configured for any component including:

- Application frameworks (Rails, Docker, etc.)
- Databases (MySQL, PostgreSQL, MongoDB, Redis, etc.)
- Other services (ElasticSearch, Memcached, etc.)

## Pattern Matching

You can use glob patterns to match multiple log files:

- `/var/log/*.log` - All .log files in /var/log
- `/app/logs/**/*.log` - All .log files in any subdirectory of /app/logs
- `/tmp/app-*.log` - All files matching app-*.log in /tmp

## Multiple Log Files

You can specify multiple log file patterns in the array:

```yaml
rails:
  configuration:
    custom_log_files: [
      "/var/log/custom/*.log",
      "/tmp/application.log",
      "/app/logs/**/*.log"
    ]
```

For more information about **LiveLogs** and additional examples, please see the [LiveLogs help page](../build-and-config/setting-up-custom-livelogs.md).