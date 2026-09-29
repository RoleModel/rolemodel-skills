# config create


Creates a new configuration profile to work with multiple Cloud 66 accounts and/or organizations.

```shell
$ cx config create <name> [--org <org name>]
```

#### Options

| Argument | Required? | Default | Description |
|  ---  |  ---  |  ---  |  ---  |
| `<name>` | yes | — | Name for the new configuration profile |
| `--org <org name>` | no | — | Organization name to associate with the profile |

#### Examples

```shell
$ cx config create staging
$ cx config create production --org my-organization
```