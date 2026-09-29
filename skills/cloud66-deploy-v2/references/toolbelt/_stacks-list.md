# stacks list


Lists applications. Shows the application name, environment, and last deploy time. You can query (multiple) applications by name - but the command will display all applications by default.

```shell
$ cx stacks list [<application name>] [--output <output style>]
```

#### Options

| Argument | Required? | Default | Description |
|  ---  |  ---  |  ---  |  ---  |
| `<application name>` | no | — | List the details for specific application(s) |
| `--output, -o <output style>` | yes | standard | Tailor the output view. Options are standard or wide |

#### Examples

```shell
$ cx stacks list
		mystack     production   Jan 2 12:34
		mystack     staging      Feb 2 12:34
		mystack-2   development  Jan 2 12:35

$ cx stacks list mystack-2
		mystack-2   development  Jan 2 12:34
```