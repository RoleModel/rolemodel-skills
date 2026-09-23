# ssh


Allows direct SSH shell into your servers by opening the firewall temporarily for the source IP address and starting a SSH session with one command.

You need to [add your public (local) SSH key](../servers/ssh-to-server.md#cloud-66-toolbelt-cli) to your Cloud 66 account before running this command. You also need to have “shell to server” rights on the application to use this command.

If your server deployed behind a gateway, you need to provide the private key in order to pass through the gateway.

```shell
$ cx ssh  [--gateway-key <path to gateway key>] --stack <application name> <server name>|<server ip>|<server role> --vv [-i <your private key>]
```

#### Options

| Argument | Required? | Default | Description |
|  ---  |  ---  |  ---  |  ---  |
| `--stack, -s <application name>` | yes | — | Name of the application |
| `--gateway-key <path to gateway key>` | no | — | Path to the private key for the gateway server (Rails only) |
| `-v, --vv, --vvv` | no | — | Set the verbosity level of the output |
| `<server name>` | either/or | — | The name of the server to access |
| `<server IP>` | either/or | — | The IP address of the server to access |
| `<server role>` | either/or | — | Role of the server to access (e.g. web) |
| `-i` | no | — | Specify a (local) private key to use when connecting via SSH|

#### Examples

```shell
$ cx ssh -s myapp lion
$ cx ssh -s myapp 52.65.34.98
$ cx ssh -s myapp web
$ cx ssh --gateway-key ~/.ssh/bastion_key  -s mystack db
```