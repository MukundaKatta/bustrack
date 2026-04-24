<!--
Replace BT-XX everywhere below. Branch naming:
  feat/BT-XX-short-slug   or   fix/BT-XX-short-slug
-->

## Summary

**Ticket:** BT-XX  
**What:** One or two sentences on what changed and why it matters.  
**Closes:** BT-XX _(link the Jira issue in the PR sidebar if your workflow uses that instead)_

## Changes

- …
- …

## How to test

1. `pnpm install`
2. `pnpm prisma:generate` _(if Prisma schema or client changed)_
3. `pnpm --filter @bustrack/web typecheck` _(and/or the commands your ticket lists)_
4. …

## Definition of Done

- [ ] Branch is up to date with `dev` and targets `dev` for merge (squash-merge via reviewed PR)
- [ ] Second reviewer requested (CODEOWNERS assigns the team lead; you pick the other reviewer)
- [ ] Two approvals (team lead + teammate) per branch protection
- [ ] CI green: lint, typecheck, build as required by the repo
- [ ] Ticket acceptance criteria verified manually
- [ ] UI change: screenshot or short recording in **Screenshot / recording** below
- [ ] Jira ticket moved to Done after merge (or per team policy)
- [ ] Verified on deployed environment when the ticket requires it, not only locally

## Screenshot / recording

<!-- Required for UI changes; otherwise write N/A -->
