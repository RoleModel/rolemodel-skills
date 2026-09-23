# servers list


List details for all the servers used by an application including  name, IP address, server role and the date/time it was created. The `<name>` argument can be a list of server names entered as separate parameters. The optional `<columns>` argument sets the type of server info to display in each column, and their order. 

Column options: `availability-zone`, `cores`, `created-at`, `distro`, `distro-version`, `dns`, `health`, `is-kubernetes-master`, `memory`, `name`, `notifications`, `private-ip`, `product-uuid`, `public-ip`, `region`, `roles`, `root-disk-size`, `root-disk-type`, `subnet-id`, `uid`, `vendor-uid`, `vpc-id`

```shell
$ cx servers list --stack <application name> --columns="<list of columns, comma separated>" <server name>
```

#### Options

| Argument | Required? | Default | Description |
|  ---  |  ---  |  ---  |  ---  |
| `--stack, -s <application name>` | yes | — | Name of the application |
| `<server name>` | no | — | The name of the server(s) to query |
| `--columns` | no | `name`, `public-ip`, `roles` , `health` , `created-at`, `notifications` | Set the type of server info to display in each column, and their order (see intro above for options) |

#### Examples

```shell
$ cx servers list -s mystack
orca         162.243.201.164  [rails web app]  Healthy   Mar 26 11:23
snowleopard  107.170.98.160   [mysql db]       Building  Mar 26 11:23
$ cx servers list -s mystack orca
orca         162.243.201.164  [rails web app]  Healthy   Mar 26 11:23
$ cx servers list -s mystack --columns="name,vendor-uid,public-ip,private-ip" orca
orca         i-013bxxxxxxdbc2d1f  162.243.201.164  172.31.16.6 
```