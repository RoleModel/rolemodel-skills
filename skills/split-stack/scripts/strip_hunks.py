#!/usr/bin/env python3
"""Remove the `extract` hunks from a branch, driven by a classification file.

Usage:
    python3 strip_hunks.py <classification.json> [--dry-run]

The classification file is exactly what Step 1 produces:

    {"files": [
      {"path": "app/models/foo.rb",
       "disposition": "mixed",
       "extract_hunks": [{"exact_text": "...", "replacement": ""}]},
      {"path": "app/models/bar.rb", "disposition": "whole"}
    ]}

`whole` files are deleted; `mixed` files get each `exact_text` replaced once by
its `replacement` (empty string means delete the hunk, main's old text means
restore it); `none` files are left alone.

Every replacement must match exactly once. A snippet that is missing or
ambiguous aborts the whole run before anything is written — a half-split commit
is the failure mode this exists to prevent.
"""

import json
import pathlib
import sys


def load(spec_path):
    spec = json.loads(pathlib.Path(spec_path).read_text())
    if not isinstance(spec.get("files"), list):
        sys.exit("classification file needs a top-level 'files' list")
    return spec["files"]


def plan(files):
    """Validate every edit against the real files. Returns (writes, deletes)."""
    writes, deletes, errors = {}, [], []

    for entry in files:
        path = pathlib.Path(entry["path"])
        disposition = entry.get("disposition", "mixed")

        if disposition == "none":
            continue

        if not path.exists():
            errors.append(f"{path}: does not exist")
            continue

        if disposition == "whole":
            deletes.append(path)
            continue

        text = path.read_text()
        for hunk in entry.get("extract_hunks", []):
            old = hunk["exact_text"]
            count = text.count(old)
            if count == 0:
                errors.append(f"{path}: snippet not found — {old[:80]!r}")
            elif count > 1:
                errors.append(
                    f"{path}: snippet appears {count} times, widen it — {old[:80]!r}"
                )
            else:
                text = text.replace(old, hunk.get("replacement", ""), 1)
        writes[path] = text

    if errors:
        sys.exit("\n".join(["aborted, nothing written:", *errors]))

    return writes, deletes


def main():
    args = [a for a in sys.argv[1:] if a != "--dry-run"]
    if len(args) != 1:
        sys.exit(__doc__)
    dry_run = "--dry-run" in sys.argv

    writes, deletes = plan(load(args[0]))

    for path, text in writes.items():
        if not dry_run:
            path.write_text(text)
        print(f"{'would strip' if dry_run else 'stripped'} {path}")

    for path in deletes:
        if not dry_run:
            path.unlink()
        print(f"{'would delete' if dry_run else 'deleted'} {path}")


if __name__ == "__main__":
    main()
