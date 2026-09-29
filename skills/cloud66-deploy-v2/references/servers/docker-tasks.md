# Adding & Managing Application Jobs


## Overview

Application Jobs allow you to define and schedule regular tasks (shell commands) that will run against your Cloud 66 application's **services** (i.e inside your containers). Commands run using the `sh` shell by default. Each time an application job runs, it starts a new container from the service, executes the task and then destroys the container. 

If you need to run a job on the underlying server, rather than the service, you should use [Server Jobs](../servers/shell.md) instead.

## Adding a new application job

To add a new application job: 

1. Open your **application** from the [Dashboard](https://app.cloud66.com/dashboard)
2. Click *Jobs* in the left-hand nav
3. Click on the *New Application Job* button
4. Choose the service to which the job applies
4. Give your new job a name
5. Specify the command(s) you want to run
6. Set a schedule for the job - you can use [cron syntax](../servers/understanding-cron-syntax.md) for more control over your scheduling - or set it to run on demand
7. Click Save

You will now see your new job listed in your application. You can edit it by clicking on the small downward arrow. Your run results (success, failure and any output) can be seen in real-time on the job detail page. 

## Pausing jobs

You can pause jobs in a number of ways:

- Via the Jobs page in your Dashboard (see next section)
- Whenever you Deploy with Options (see below)
- Via [our API](https://developers.cloud66.com/#jobs)

Pausing an Application job suspends it in Kubernetes.

### Pausing via the dashboard

To pause Jobs via the Dashboard:

1. Log into your Dashboard and open your app
2. Click on *Jobs* in the left-hand nav
3. Click the small down arrow next to the job you wish to pause
4. Choose *Pause this job*

The job will remain paused until you unpause it (using the same sequence above). 

You can also pause all jobs by clicking the *Pause All* button at the top of the panel (or *Unpause All* as needed).

### Pausing while deploying

When you deploy, you can choose Deploy with Options and check the **Pause Jobs** option to temporarily pause jobs during the deployment process. We will pause any *currently unpaused jobs* and then unpause (only) those jobs after deployment. You can also set this option as part of any deployment profile.

## Using parameters

When you run a job you can pass it parameters (if it is written to accept them).

### Notation

Jobs use a facility in the shell called *positional parameters*. Positional parameters are a series of special variables (\$1, \$2 ... \$n) that contain the contents of the command line. Where **n** is greater than 9 using braces. For example, to refer to the 15th positional parameter, use the notation `${15}`.

```bash
cp $1 $2
ls $1 $2 $3 $4 $5 $6 $7 $8 $9 ${10} ${11}

```

### Default values

You can handle default value for the parameter with following notation: `${n:-YOUR_DEFAULT_VALUE}`.

Example below cp file `$1` to `tmp` directory by default

```bash
cp $1 ${2:-/tmp}
```

### Passing parameters to a job

Since job is using positional parameters pass you arguments in order, eg: if you pass `arg1` `arg2`, `$1` would contain `arg1` and `$2` would contain `arg2`

You can also quote your argument if there is a space in the value.

#### Example

|||
|--- |--- |
|Job command|`cp $1 ${2:-/tmp}`|
|Passing arguments via dashboard|`"log*.txt" tmp/logs`|
|Passing arguments via Toolbelt|`--arg "log*.txt" -- arg tmp/logs`|