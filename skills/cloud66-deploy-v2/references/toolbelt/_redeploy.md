# redeploy


Enqueues redeployment of an existing application. If the app is already building, another build will be enqueued and performed immediately after the current one is finished.

```shell
$ cx redeploy --stack <application name> --listen [-y] [--git-ref <git_ref>] [--service <service>] [--deploy-strategy <strategy>] [--rollout-strategy <strategy>] [--canary-percentage <percentage>] [--deployment-profile <profile name>]
```

#### Options

| Argument | Required? | Default | Description |
|  ---  |  ---  |  ---  |  ---  |
| `--stack, -s <application name>` | yes | — | Full or partial name of the application |
| `-y` | no | — | Answer yes to confirmations |
| `--listen` | no | — | Waits for deployment to complete, shows progress and log output when available |
| `--git-ref <git_ref>` | no | — | Redeploy the specific git reference (branch, tag or hash). |
| `--service <service>` | no | — | Will deploy the specified services from your application. Each service can have an optional colon-separated reference which is an image tag or git reference. |
| `--deploy-strategy <strategy>` | no | — | Set a strategy for this redeployment. Options are serial, parallel, rolling (Rails/Rack) or fast (containerized apps) |
| `--rollout-strategy <strategy>` | no | none | Set a rollout strategy for this redeployment. Options are none, blue_green_immediate, blue_green_delayed, or canary |
| `--canary-percentage <percentage>` | no | — | Set the percentage of traffic to direct to a canary rollout |
| `--deployment-profile <profile name>` | no | — | Use an existing profile for this redeployment. |

#### Examples

```shell
$ cx redeploy -s "My Awesome App" -e production --deploy-strategy fast
$ cx redeploy -s "My Awesome App" -e production -y --git-ref my_git_ref_value
$ cx redeploy -s "My Awesome Containerized App" --service web:8c7f3d393162f88b8b9493f6babec574b03ca957 --service api:latest
```