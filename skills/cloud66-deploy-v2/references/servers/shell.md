# Adding & Managing Server Jobs


## Overview

Server Jobs allow you to define and schedule regular server tasks (shell commands). Under the hood, these are run as [cronjobs](../servers/understanding-cron-syntax.md).

If you need to run a job against a Cloud 66 service (i.e. inside a container), rather than on the underlying server, you should use [Application Jobs](../servers/docker-tasks.md) instead.

## Adding a new server job

To add a new server job: 

1. Click the **Jobs** in the left-hand nav
2. Click on the button for the type of job you wish to add
3. Give give your new job a name
4. Specify the command(s) you want to run and the user
5. Set a schedule for the job - you can use [cron syntax](../servers/understanding-cron-syntax.md) for more control over your scheduling
6. Click Save

You will now see your new job listed on the Jobs page.  You can edit it, or run it on demand by clicking on the small downward arrow. Your run results (success, failure and any output) can be seen in real-time on the job detail page.

## Pausing jobs

You can pause jobs in a number of ways:

- Via the Jobs page in your Dashboard (see next section)
- Whenever you Deploy with Options (see below)
- Via [our API](https://developers.cloud66.com/#jobs)

Pausing a server or Rake job removes it from the cron for as long as it remains paused.

### Pausing via the dashboard

To pause Jobs via the Dashboard:

1. Log into your Dashboard and open your app
2. Click on Jobs in the left-hand nav
3. Click the small down arrow next to the job you wish to pause
4. Choose *Pause this job*

The job will remain paused until you unpause it (using the same sequence above). 

You can also pause all jobs by clicking the *Pause All* button at the top of the panel (or *Unpause All* as needed).

### Pausing while deploying

When you deploy, you can choose Deploy with Options and check the **Pause Jobs** option to temporarily pause jobs during the deployment process. We will pause any *currently unpaused jobs* and then unpause (only) those jobs after deployment. You can also set this option as part of any deployment profile.

## Using parameters

When you are running a job on demand via dashboard or [toolbelt](../toolbelt/_jobs-run.md), you can pass it parameters (if it is written to accept them).

### Notation

Jobs use a facility in the shell called *positional parameters*. Positional parameters are a series of special variables ($1, $2 ... $n) that contain the contents of the command line. Where **n** is greater than 9 using braces. For example, to refer to the 15th positional parameter, use the notation `${15}`.

```bash
cp $1 $2
ls $1 $2 $3 $4 $5 $6 $7 $8 $9 ${10} ${11}

```

### Default values

You can handle default value for the parameter with following notation: `${n:-YOUR_DEFAULT_VALUE}`. This is useful when you have ha job that scheduled and also you need to run it on demand sometimes.

Example below cp file `$1` to `tmp` directory by default

```bash
cp $1 ${2:-/tmp}
```

### Passing parameters to job

Since job is using positional parameters pass you arguments in order, eg: if you pass `arg1` `arg2`, `$1` would contain `arg1` and `$2` would contain `arg2`

You can also quote your argument if there is a space in the value.

#### Example

|||
|--- |--- |
|Job command|`cp $1 ${2:-/tmp}`|
|Passing arguments via dashboard|`"log*.txt" tmp/logs`|
|Passing arguments via Toolbelt|`--arg "log*.txt" -- arg tmp/logs`|

## Support for whenever gem

We also support the [whenever gem](https://github.com/javan/whenever) for managing CRON jobs. However, we recommend using our native Server Jobs feature (see above) instead. This has many benefits:

1. It allows you to choose which server these tasks run on 
2. It gives visibility in the UI when tasks are running, and displays their outputs
3. You can set tasks to run on-demand
4. It alerts you if tasks fail

If you'd prefer to use the gem, simply add `whenever` to your Gemfile and redploy your code. We will automatically use the config/schedule.rb in your source code to build the CRON jobs on the relevant servers. You should see the message "Handling whenever schedule" on your server detail page log.