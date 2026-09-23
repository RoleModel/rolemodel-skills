# env-vars set


Adds (or updates) a single environment variables for your application. You can use the `--apply-strategy` option to specify when Cloud 66 will apply the change in environment variables to your servers. The default is `immediately`.

```shell
$ cx env-vars set --stack <application name> [--apply-strategy] <key> <value> 
```

#### Options

| Argument | Required? | Default | Description |
|  ---  |  ---  |  ---  |  ---  |
| `--stack, -s <application name>` | yes | — | Name of your application |
| `<key>` | yes | — | The KEY for the env-var that will be added or updated |
| `<value>` | yes | — | The value assigned to the KEY |
| `--apply strategy` | no | immediately | When the changes will be applied. Options are immediately, deployment |

#### Examples

```shell
$ cx env-vars set -s mystack FIRST_VAR=123
$ cx env-vars set -s mystack SECOND_VAR='this value has spaces in it'
$ cx env-vars set -s mystack --apply-strategy immediately THIRD_VAR='value-applied-now'
$ cx env-vars set -s mystack --apply-strategy deployment FOURTH_VAR='value-after-deployment'
```