# jobs run


Runs the given job once with the given parameters.

```shell
$ cx jobs run --stack <application name> --arg [--arg option --arg option] <job name>
```

#### Options

| Argument | Required? | Default | Description |
|  ---  |  ---  |  ---  |  ---  |
| `--stack, -s <application name>` | yes | — | Full or partial name of the application |
| `<job name>` | yes | — | The name of the job |
| `--arg [--arg option --arg option]` | no | — | Parameters to be passed to the job |

#### Examples

```shell
$ cx job run -s "My Awesome App" my_job
$ cx job run -s "My Awesome App" --arg "arg1" --arg "arg2" my_job
```