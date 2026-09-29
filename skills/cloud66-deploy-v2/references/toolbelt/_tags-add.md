# tags add


Add tags to a given entity.

```shell
$ cx tags add --entity <entity type> --id <entity ID> --tags <tag>
```

#### Options

| Argument | Required? | Default | Description |
|  ---  |  ---  |  ---  |  ---  |
| `--entity <entity type>` | yes | — | The type of the entity |
| `--id <entity ID>` | yes | — | The id of the entity |
| `--tags <tag>` | yes | — | Tags to add to the given entity (can be multiple) |

#### Examples

```shell
$ cx tags add --entity stack --id 12 --tags foo --tags bar
```