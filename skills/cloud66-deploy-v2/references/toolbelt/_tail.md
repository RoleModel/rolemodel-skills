# tail


Runs a Linux `tail` command on the specified server and given log file. You must specify the log file name including the extension. If you don’t specify a path, or specify a relative path, then we will assume `<stack-directory>/current/log` (i.e. the subdirectory und `$STACK_PATH`) as the current directory. You can specify a different (absolute) log path as needed.

This command is only supported on Linux and OS X.

```shell
$ cx tail --stack <application name> <server name> | <server ip> | <server role> /optional/log/path/<log filename>
```

#### Options

| Argument | Required? | Default | Description |
|  ---  |  ---  |  ---  |  ---  |
| `--stack, -s <application name>` | yes | — | The application name |
| `<server name>` | either/or | — | Name of the server to query |
| `<server ip>` | either/or | — | IP of the server to query |
| `<server role>` | either/or | — | Role of the server to query |
| `/optional/log/path/<log filename>` | no | — | The log file to query (must include extension) |

#### Examples

```shell
$ cx tail -s mystack production.log
$ cx tail -s mystack 52.65.34.98 nginx_error.log
$ cx tail -s mystack web /custom/logs/my.log
```