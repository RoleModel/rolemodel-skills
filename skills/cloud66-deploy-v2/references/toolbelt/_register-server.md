# register server


A shortcut to run the server registration script on a group of servers.

```shell
$ cx register-server [--org <organization>] [--server <IP address>] [--file <filename.txt>] [--user <username>] [--key <private SSH key>] [--force-local-ip <bool>] [--tags <tagA,tagB>]
```

#### Options

| Argument | Required? | Default | Description |
|  ---  |  ---  |  ---  |  ---  |
| `--server <IP address>` | either/or | — | The public IP address of the server to register |
| `--file <filename.txt>` | either/or | — | A text file containing a list of IP addresses for servers (one per line) |
| `--org <organization>` | yes | — | The name of the Cloud 66 organization to which the server(s) must be added |
| `--user <username>` | yes | — | The username to use when connecting to server(s) |
| `--key <private SSH key>` | yes | — | The private SSH key to use to connect to the server(s) |
| `--force-local-ip <bool>` | no | false | Use the local ip address of the registered server |
| `--tags <tagA,tagB>` | no | — | Comma separated list of tags to add to the server(s) |

#### Examples

```shell
$ cx register-server --org team --user root --server 149.56.134.22 --key ~/.ssh/private_key
$ cx register-server --org team --user ubuntu --file servers.txt --key ~/.ssh/private_key
$ cx register-server --org team --user ubuntu --file servers.txt --key ~/.ssh/private_key --force-local-ip true
$ cx register-server --org team --user ubuntu --file servers.txt --key ~/.ssh/private_key --tags "dc 1,az2"
```