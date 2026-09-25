# config update


Set a configuration profile to point to an organization.

```shell
$ cx config update <name> [--org <org name>]
```

#### Options

| Argument | Required? | Default | Description |
|  ---  |  ---  |  ---  |  ---  |
| `<name>` | yes | — | Name of the configuration profile to update |
| `--org <org name>` | no | — | Organization name to associate with the profile |

#### Examples

```shell
$ cx config update production --org my-new-organization
$ cx config update staging --org staging-org
```