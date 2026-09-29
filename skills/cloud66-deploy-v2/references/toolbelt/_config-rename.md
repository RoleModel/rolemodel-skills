# config rename


Renames an existing configuration profile.

```shell
$ cx config rename <old name> <new name>
```

#### Options

| Argument | Required? | Default | Description |
|  ---  |  ---  |  ---  |  ---  |
| `<old name>` | yes | — | Current name of the configuration profile |
| `<new name>` | yes | — | New name for the configuration profile |

#### Examples

```shell
$ cx config rename staging staging-env
$ cx config rename old-production production
```