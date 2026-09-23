# upload


Copies a file from your local computer to the remote server. Uploads the files to the `/tmp` directory by default, unless a path is specified.

This command open the firewall for SSH from your IP address temporarily (20 minutes) and starts a SSH session. If a role is specified the command will connect to the first server with that role.

You need to [add your public (local) SSH key](../servers/ssh-to-server.md#adding-your-public-key-to-your-cloud-66-account) to your Cloud 66 account before running this command. You also need to have “shell to server” rights on the application to use this command.

This command is only supported on Linux and OS X (for Windows you can run this in a virtual machine if necessary)

```shell
$ cx upload --stack <application name> --server <server name> | <server IP> | <server role> /path/to/source/file /path/to/target/directory
```

#### Options

| Argument | Required? | Default | Description |
|  ---  |  ---  |  ---  |  ---  |
| `--stack, -s <application name>` | yes | — | The application name |
| `--server <server name> \| <server ip> \| <server role>` | yes | — | Name or IP or role of the server to which the file will be uploaded |
| `/path/to/source/file` | yes | — | Local path to the file that will be uploaded |
| `/path/to/target/dir` | no | /tmp | Path on the server where the file will be saved |

#### Examples

```shell
$ cx upload -s mystack --server lion /tmp/file.txt
$ cx upload -s mystack --server lion /mydir/files/file.txt /var/www/app
$ cx upload -s mystack --server 52.65.34.98 /user/archives/yes.zip
$ cx upload -s mystack --server web /path/to/source/file /path/to/target/directory
```