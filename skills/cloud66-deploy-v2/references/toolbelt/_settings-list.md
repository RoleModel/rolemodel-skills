# settings list


Lists all the settings for the given application, including the key, value and readonly flag for each setting. You can use `<setting>` multiples times to query multiple services.

```shell
$ cx settings list --stack <application name> <setting>
```

#### Options

| Argument | Required? | Default | Description |
|  ---  |  ---  |  ---  |  ---  |
| `--stack, -s <application name>` | yes | — | Name of the application |
| `<setting>` | no | — | The setting(s) to query (can be used multiple times) |

#### Examples

```shell
$ cx settings list -s mystack
stack.name mystack readonly
git.branch master read/write
git.repository git://git@github.com:cloud66-samples...git  read/write

$ cx settings list -s mystack git.branch
git.branch master read/write
```