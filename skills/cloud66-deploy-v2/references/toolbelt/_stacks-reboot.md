# stacks reboot


Reboots groups of servers in your application. Valid values for the `<group>` argument are `all`, `web`, `haproxy`, and `db`.  Database specific values like `mysql` or `redis` are also supported.

`<strategy>` specifies whether you want your web servers to be rebooted in `parallel` or in `serial`.  For serial reboots web servers are removed and re-added to the load balancer one by one. Non-web server will always be rebooted in parallel. If this value is left unspecified, Cloud 66 will determine the best strategy based on your infrastructure layout.

```shell
$ cx stacks reboot --stack <application name> --group <server group> --strategy <reboot strategy> -y
```

#### Options

| Argument | Required? | Default | Description |
|  ---  |  ---  |  ---  |  ---  |
| `--stack, -s <application name>` | yes | — | The application name |
| `--group <server group>` | no | all | The group of servers to reboot. Valid values: all, web, haproxy, db, mysql, redis, postgres, mongodb |
| `--strategy <reboot strategy>` | no | — | The strategy for rebooting the app's web servers. Valid values: serial, parallel |
| `-y` | no | — | Answer "yes" to confirmations |

#### Examples

```shell
$ cx stacks reboot -s mystack
$ cx stacks reboot -s mystack --group web
$ cx stacks reboot -s mystack --group all -y
$ cx stacks reboot -s mystack --strategy parallel
$ cx stacks reboot -s mystack --group web --strategy serial -y
```