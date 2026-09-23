# settings set


Sets and applies the value of a setting to an application.

```shell
$ cx settings set --stack <application name> <setting> <values>
```

#### Options

| Argument | Required? | Default | Description |
|  ---  |  ---  |  ---  |  ---  |
| `--stack, -s <application name>` | yes | — | Name of the application |
| `<setting>` | yes | — | The setting(s) to query (can be used multiple times) |
| `<values>` | yes | — | The values to apply to the setting |

#### Examples

```shell
$ cx settings set -s mystack git.branch dev
$ cx settings set -s mystack allowed.web.source 191.203.12.10
$ cx settings set -s mystack allowed.web.source anywhere
$ cx settings set -s mystack maintenance.mode  1|true|on|enable
$ cx settings set -s mystack maintenance.mode  0|false|off|disable
```

#### Available settings

| Setting | Default | Description |
|  ---  |  ---  |  ---  |
| allowed.web.source | nil i.e. `0.0.0.0` | IP addresses that are allowed to access a stacks web servers (with IP addresses in the command or a CSV file with IP addresses as input) |
| asset.prefix | nil | If you change your default Rails assets folder, you can set it here |
| continuous.deploy | `false` | Enable or disable continuous deployment on Github. |
| custom.build.command | - | Set custom build command. Only applies to Sinatra or Padrino stacks |
| custom.deploy.command | - | Set custom deploy command. Only applies to Sinatra or Padrino stacks |
| db.check.backup.size | `true` | Enable/Disable Check free space before taking backup |
| git.branch | - | Change the Git branch of the application repository |
| git.repository | - | Change the Git repository URL |
| logrotate.app.frequency | `daily` | For application specific log files accepted value: `hourly`  `daily`  `weekly`  `monthly` |
| logrotate.app.keep.count | `14` | The number of log files to keep for each logfile |
| logrotate.server.frequency | `daily` | For server specific log files accepted values: `hourly`  `daily`  `weekly`  `monthly` |
| logrotate.server.keep.count | `14` | The number of log files to keep for each logfile |
| maintenance.mode | `false` | Enable or disable maintenance mode on the application. |
| reconfigure.nginx | `true` | If set to true, it will regenerate Nginx configuration and restart it (only on the next deployment) |
| run.deploy.command | `true` | Enable or disable option run deploy command on every deployment ("database migrations" for Rails stacks). |
| stack.name |  | View your application name |