# run


Execute a command directly on a remote server, in a service, or in a existing container. To do this it: 

1. Opens the firewall for SSH from your IP address temporarily (20 minutes)
2. Starts a SSH session 
3. Executes the command specified and returns its output.

You need to [add your public (local) SSH key](../servers/ssh-to-server.md#adding-your-public-key-to-your-cloud-66-account) to your Cloud 66 account before running this command. You also need to have “shell to server” rights on the application to use this command.

 You can use either the server name (e.g. `lion`) or the server IP (e.g. `123.123.123.123`) or the server role (e.g. `web`). If a role is specified the command will connect to the first server with that role. 

This command is only supported on Linux and OS X clients (for Windows you can run this in a virtual machine if necessary)

```shell
$ cx run --stack <application name> [--server <server name> | <IP address>] [--service <service name>] [--container <container name>] [--interactive] '<commands>'
```

#### Options

| Argument | Required? | Default | Description |
|  ---  |  ---  |  ---  |  ---  |
| `--stack, -s <application name>` | yes | — | Name of the application |
| `--server, --svr <server name>\|<IP address>` | either/or | — | The name or IP address of the server on which to run the command |
| `--service, --svc <service name>` | either/or | — | (containerized apps only) Name of the service in which to run the command |
| `--container, --cnt <container name>` | either/or | — | (containerized apps only) Name of the pod/container in which to run the command  |
| `--interactive, -i` | no | — | Set the session to interactive mode |
| `<commands>` | yes | — | The linux commands to run.  |

#### Examples

```shell
$ cx run -s mystack --server lion 'ls -la'
$ cx run -s mystack --server lion -i
$ cx run -s mystack --svc webapp 'ls -la'
$ cx run -s mystack --service api --interactive 'bundle exec rails c'
$ cx run -s mystack --container web-123 -i 'bundle exec rails c'
```