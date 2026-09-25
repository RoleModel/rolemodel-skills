# tags delete


Remove tags from a given entity.

```shell
$ cx tags delete --entity <entity type> --id <entity ID> --tags <tag>
```

#### Options

| Argument | Required? | Default | Description |
|  ---  |  ---  |  ---  |  ---  |
| `--entity <entity type>` | yes | — | The type of the entity |
| `--id <entity ID>` | yes | — | The id of the entity |
| `--tags <tag>` | yes | — | Tags to remove from the given entity (can be multiple) |

#### Examples

```shell
$ cx tags delete --entity stack --id 45 --tags buzz --tags fuzz
```