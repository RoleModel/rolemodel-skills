# Long-running Sidekiq jobs across deploys


## Overview

When you deploy, Cloud 66 restarts your background processes — including Sidekiq workers. If a Sidekiq job is mid-execution when its worker is restarted, the job is interrupted and (depending on its retry settings) may be retried, abandoned, or lost. For long-running jobs this is a real risk: a job that takes 90 seconds will rarely finish in the few seconds between a `TERM` signal and a forced `KILL`.

The fix is to tell Cloud 66's process manager how to drain Sidekiq gracefully: first signal Sidekiq to stop fetching new jobs but keep working on the ones already in flight, then give it enough time to finish, and only then send `TERM` and `KILL`. This is configured via `procfile_metadata.stop_sequence` in your [manifest file](../manifest/what-is-a-manifest-file.md).

## Which signal does what

Sidekiq's signal semantics changed across versions. The signals that matter for graceful drains are:

| Signal | Sidekiq 5.0+ behaviour | Notes |
|--------|------------------------|-------|
| `TSTP` | Quiet mode — finish current jobs, stop fetching new ones | The signal you want for graceful drain |
| `TERM` | Graceful shutdown — wait up to `-t` timeout, then exit | Final shutdown signal |
| `TTIN` | Dumps thread backtraces to the log | Diagnostic only; does **not** stop fetching |
| `USR1` | Legacy quiet-mode signal, superseded by `TSTP` | Deprecated in favour of `TSTP` since Sidekiq 5.0; avoid in new config |
| `KILL` | Immediate termination | Last resort |

If you use `TTIN` in a `stop_sequence` — as some older examples show — Sidekiq keeps pulling new jobs throughout the wait window, which defeats the point of waiting.

## Worked example

Suppose your worker jobs can take up to two minutes to finish. In your manifest:

```yaml
procfile_metadata:
  worker:
    stop_sequence: tstp, 120, term, 30, kill
```

This sequence:

1. Sends `TSTP` — Sidekiq enters quiet mode and stops fetching new jobs.
2. Waits 120 seconds for in-flight jobs to finish.
3. Sends `TERM` — Sidekiq begins graceful shutdown, allowing remaining jobs up to its own internal timeout to finish.
4. Waits 30 seconds.
5. Sends `KILL` if the process is still running.

Adjust the wait values to match your worst-case job duration. Note that Sidekiq's own `-t` (timeout, default 25s) controls how long Sidekiq keeps working on in-flight jobs after it receives `TERM` before it re-queues whatever is left and exits. Your `stop_sequence` wait after `TERM` should be at least as long as `-t`, otherwise `KILL` will fire while Sidekiq is still draining.

## Related

- [Processes Configuration](../manifest/_processes.md) — full `procfile_metadata` reference
- [Running background processes](../build-and-config/proc-files.md) — Procfile basics
- [Sidekiq Signals (upstream wiki)](https://github.com/sidekiq/sidekiq/wiki/Signals)