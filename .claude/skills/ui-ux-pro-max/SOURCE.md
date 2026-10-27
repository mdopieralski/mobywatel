# Source

Vendored third-party skill. Do not edit except the "In this repo" note and the script paths in `SKILL.md`.

- Upstream: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill (`.claude/skills/ui-ux-pro-max`)
- Commit: `28b3b8dee8c976df4fa3e94aed4e092ad43fcb03` (2026-10-26)
- License: MIT (`LICENSE`)
- Left out: `scripts/tests/` (the upstream test suite and fixtures).
- Changed: script calls in `SKILL.md` use `python3 .claude/skills/ui-ux-pro-max/scripts/search.py` (run
  from the repo root) instead of `${CLAUDE_PLUGIN_ROOT}`, which is only set for plugin installs.
- Reviewed 2026-10-27: Python standard library only, no network calls, no shell commands; writes files only
  with `--persist`.

To update: clone upstream into an empty folder, review the diff, copy the folder again, re-apply the two
changes above.
