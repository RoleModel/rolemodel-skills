# containers attach


Connect to a container (by container name) and print the `STDOUT` output stream of the container process. This is roughly equivalent to tailing the logs of a container. 

If you need to connect to a container in order to execute commands, you should use the [cx run](../toolbelt/_run.md) command and specify the name of the container.

```shell
$ cx containers attach --stack <application name> <container ID>
```

#### Options

| Argument | Required? | Default | Description |
|  ---  |  ---  |  ---  |  ---  |
| `--stack, -s <application name>` | yes | — | Name of your application |
| `<container ID>` | yes | — | The ID of the container to be attached |

#### Examples

```shell
$ cx containers attach -s mp-app 2844142c
```