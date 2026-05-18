---
name: merge-upstream
description: >
  Merge the upstream (public GitHub) branch into the local main branch of this
  company-side blog repo. Use this skill whenever the user wants to sync,
  merge, pull, or update from upstream, or mentions bringing in changes from
  the public repo, or says anything like "merge upstream", "sync from
  upstream", "pull upstream changes", or "update from public repo". Also
  trigger when the user mentions the company blog being out of date with the
  public blog, or wanting to reflect upstream updates.
---

# Merge Upstream Workflow

This skill syncs the company-side blog repo with the public upstream repo,
handling the known merge conflicts that arise from the dual-deployment
architecture.

## Remote Setup

- **origin**: Company GitHub Enterprise (`github.samsungds.net`)
- **upstream**: Public GitHub (`github.com/Taekyo-Lee/taekyo-lee.github.io.git`)

The local `upstream` branch tracks `remotes/upstream/main`.

## Step-by-Step Process

### 1. Pre-flight Check

Before starting, verify the working directory is clean:

```bash
git status
```

If there are uncommitted changes, stop and inform the user. Do not proceed
with a dirty working tree — the merge could destroy their work.

Also confirm we're on the `main` branch:

```bash
git branch --show-current
```

If not on `main`, stop and ask the user if they want to switch.

### 2. Fetch and Update

Fetch the latest from upstream:

```bash
git fetch upstream
```

Update the local `upstream` branch:

```bash
git checkout upstream && git pull upstream main && git checkout main
```

This ensures the local `upstream` branch reflects the latest public state.

### 3. Merge

```bash
git merge upstream
```

This merges the local `upstream` branch into `main`.

### 4. Handle Conflicts

If the merge succeeds without conflicts, skip to Step 5.

If there are conflicts, resolve them according to these rules. These
conflicts happen every time because the company repo differs structurally
from the public repo.

#### `.github/workflows/deploy.yml` — DELETE

This file exists only in the public repo. The company repo uses
`deploy_at_company.yml` instead. Always resolve by deleting:

```bash
git rm .github/workflows/deploy.yml
```

#### `astro.config.mjs` — KEEP COMPANY VERSION + PRESERVE KEY LINE

The company version contains this critical line that the public repo lacks:

```js
process.env.PUBLIC_IS_COMPANY = String(isCompany);
```

This line exposes `isCompany` to pages via `import.meta.env.PUBLIC_IS_COMPANY`
and is used by `about.astro` and `index.astro` for mirror notification display.
Without it, the company site won't show the correct mirror guidance.

Resolution strategy:
1. Accept the company (HEAD) version as the base
2. Incorporate any new upstream changes (new integrations, config additions)
   that are NOT the `PUBLIC_IS_COMPANY` block — the company already has it
3. Verify the `process.env.PUBLIC_IS_COMPANY = String(isCompany);` line is
   present after resolution. If the upstream version was accepted and this
   line was removed, add it back (it goes right after the `isCompany` detection
   block, before the `defineConfig` call)

#### `.gitignore` — KEEP HEAD (COMPANY COMMENTS)

The company `.gitignore` has slightly different comments. Always keep the
HEAD (company) version:

```bash
git checkout --ours .gitignore && git add .gitignore
```

#### Any Other Conflicts — RESOLVE WITH JUDGMENT

For conflicts in files not listed above, apply this principle: **if not
tremendously risky, proceed without asking**. This is a blog repo — the
worst case is a broken dev preview, not data loss or production outage.

When you can reason about which side is correct (e.g., upstream has a clear
bugfix or structural update, HEAD has a company-specific customization), pick
the appropriate side and resolve. Only stop and ask the user when the conflict
is genuinely ambiguous or could break the company-specific deployment logic
(e.g., `base` path, `PUBLIC_IS_COMPANY`, `deploy_at_company.yml` references).

General heuristics for unknown conflicts:
- **Upstream changes to content, styles, components, or page structure**:
  upstream is the source of truth — take upstream version (the public blog
  drives content evolution).
- **Company-specific additions in HEAD**: preserve them. These are customizations
  that don't exist upstream and serve the company deployment.
- **Both sides changed the same thing differently**: if the difference is
  cosmetic (variable naming, comments, label wording), take upstream. If it
  affects routing, deployment config, or company-specific behavior, take HEAD.

### 5. Stage and Commit

After resolving all conflicts (or if there were none):

```bash
git add -A
git commit -m "Merge upstream: resolve conflicts for company repo"
```

### 6. Show Final Status

```bash
git status
git log --oneline -5
```

Present the results to the user.

### 7. DO NOT PUSH

The user pushes manually. Remind them:

> Merge complete. When ready, push with `git push` (or `git push origin main`).

## Error Handling

- **Dirty working tree**: Stop and inform the user. Suggest committing or stashing first.
- **Merge abort needed**: If something goes wrong mid-merge, `git merge --abort` to return to the pre-merge state.
- **Unexpected conflicts**: Resolve using judgment per the conflict resolution heuristics above. Only ask the user for genuinely ambiguous or high-risk conflicts.
- **Network errors**: If `git fetch` fails, suggest checking VPN connectivity (company GitHub Enterprise may require VPN).
---
name: merge-upstream
description: >
  Merge the upstream (public GitHub) branch into the local main branch of this
  company-side blog repo. Use this skill whenever the user wants to sync,
  merge, pull, or update from upstream, or mentions bringing in changes from the
  public repo, or says anything like "merge upstream", "sync from upstream",
  "pull upstream changes", or "update from public repo". Also trigger when the
  user mentions the company blog being out of date with the public blog, or
  wanting to reflect upstream updates. IMPORTANT: This skill only works in the
  COMPANY environment — it must not run on HOME or DEVELOPMENT machines.
---

# Merge Upstream Workflow

This skill syncs the company-side blog repo with the public upstream repo,
handling the known merge conflicts that arise from the dual-deployment
architecture.

## Environment Guard

This skill is designed exclusively for the COMPANY environment, where the blog
repo points to the internal GitHub Enterprise (`github.samsungds.net`). Running
it on HOME or DEVELOPMENT machines would be incorrect — those environments push
directly to the public repo and never merge from upstream.

**Before doing anything else**, check the environment by reading the `.env`
file in the project root:

```bash
grep A2G_LOCATION .env
```

Alternatively, read the `.env` file directly and look for the `A2G_LOCATION`
line. The value is set there (not as a shell environment variable).

- If the value is `COMPANY`, `CORP`, or `PRODUCTION` → proceed with the
  workflow below.
- If the value is anything else (e.g., `HOME`, `DEVELOPMENT`, or the key is
  missing) → **stop immediately** and inform the user:

> This skill can only run in the COMPANY environment (where the repo points to
> the internal GitHub Enterprise). The current environment (`A2G_LOCATION=<value>`)
> is not a company environment. If you're on a company machine, check that
> `A2G_LOCATION` is set correctly in `.env`. If you're on a HOME or DEVELOPMENT
> machine, you don't need this skill — push directly to the public repo instead.

Do not proceed past this check unless the environment matches.

## Remote Setup

- **origin**: Company GitHub Enterprise (`github.samsungds.net`)
- **upstream**: Public GitHub (`github.com/Taekyo-Lee/taekyo-lee.github.io.git`)

The local `upstream` branch tracks `remotes/upstream/main`.

## Step-by-Step Process

### 1. Pre-flight Check

Before starting, verify the working directory is clean:

```bash
git status
```

If there are uncommitted changes, stop and inform the user. Do not proceed
with a dirty working tree — the merge could destroy their work.

Also confirm we're on the `main` branch:

```bash
git branch --show-current
```

If not on `main`, stop and ask the user if they want to switch.

### 2. Fetch and Update

Fetch the latest from upstream:

```bash
git fetch upstream
```

Update the local `upstream` branch:

```bash
git checkout upstream && git pull upstream main && git checkout main
```

This ensures the local `upstream` branch reflects the latest public state.

### 3. Merge

```bash
git merge upstream
```

This merges the local `upstream` branch into `main`.

### 4. Handle Conflicts

If the merge succeeds without conflicts, skip to Step 5.

If there are conflicts, resolve them according to these rules. These
conflicts happen every time because the company repo differs structurally
from the public repo.

#### `.github/workflows/deploy.yml` — DELETE

This file exists only in the public repo. The company repo uses
`deploy_at_company.yml` instead. Always resolve by deleting:

```bash
git rm .github/workflows/deploy.yml
```

#### `astro.config.mjs` — KEEP COMPANY VERSION + PRESERVE KEY LINE

The company version contains this critical line that the public repo lacks:

```js
process.env.PUBLIC_IS_COMPANY = String(isCompany);
```

This line exposes `isCompany` to pages via `import.meta.env.PUBLIC_IS_COMPANY`
and is used by `about.astro` and `index.astro` for mirror notification display.
Without it, the company site won't show the correct mirror guidance.

Resolution strategy:
1. Accept the company (HEAD) version as the base
2. Incorporate any new upstream changes (new integrations, config additions)
   that are NOT the `PUBLIC_IS_COMPANY` block — the company already has it
3. Verify the `process.env.PUBLIC_IS_COMPANY = String(isCompany);` line is
   present after resolution. If the upstream version was accepted and this
   line was removed, add it back (it goes right after the `isCompany` detection
   block, before the `defineConfig` call)

#### `.gitignore` — KEEP HEAD (COMPANY COMMENTS)

The company `.gitignore` has slightly different comments. Always keep the
HEAD (company) version:

```bash
git checkout --ours .gitignore && git add .gitignore
```

#### Any Other Conflicts — RESOLVE WITH JUDGMENT

For conflicts in files not listed above, apply this principle: **if not
tremendously risky, proceed without asking**. This is a blog repo — the
worst case is a broken dev preview, not data loss or production outage.

When you can reason about which side is correct (e.g., upstream has a clear
bugfix or structural update, HEAD has a company-specific customization), pick
the appropriate side and resolve. Only stop and ask the user when the conflict
is genuinely ambiguous or could break the company-specific deployment logic
(e.g., `base` path, `PUBLIC_IS_COMPANY`, `deploy_at_company.yml` references).

General heuristics for unknown conflicts:
- **Upstream changes to content, styles, components, or page structure**:
  upstream is the source of truth — take upstream version (the public blog
  drives content evolution).
- **Company-specific additions in HEAD**: preserve them. These are customizations
  that don't exist upstream and serve the company deployment.
- **Both sides changed the same thing differently**: if the difference is
  cosmetic (variable naming, comments, label wording), take upstream. If it
  affects routing, deployment config, or company-specific behavior, take HEAD.

### 5. Stage and Commit

After resolving all conflicts (or if there were none):

```bash
git add -A
git commit -m "Merge upstream: resolve conflicts for company repo"
```

### 6. Show Final Status

```bash
git status
git log --oneline -5
```

Present the results to the user.

### 7. Start Local Runner and Push to Origin

On the company GitHub Enterprise, GitHub Actions does not work server-side.
Instead, a self-hosted runner in `actions-runner/` must be running locally to
pick up workflow jobs. Pushing to `origin main` triggers a workflow dispatch,
and the local runner executes it.

**Start the local runner in the background first**, then push:

```bash
# Start the self-hosted runner in the background
cd actions-runner && nohup ./run.sh > /dev/null 2>&1 &
cd ..

# Push to origin (triggers the workflow; the local runner picks it up)
git push origin main
```

The runner stays alive as a background process listening for jobs. If it was
already running, starting another instance will fail with a session conflict
— that's fine, the existing runner will handle the job.

After pushing, inform the user:

> Merge complete and pushed to origin. The local Actions runner should pick up
> the workflow job. Check the GitHub Enterprise Actions tab to verify the
> deployment. The runner stays running in the background (idle when no jobs are
> queued — negligible resource cost). Stop it manually with `kill` when desired.

## Error Handling

- **Dirty working tree**: Stop and inform the user. Suggest committing or stashing first.
- **Merge abort needed**: If something goes wrong mid-merge, `git merge --abort` to return to the pre-merge state.
- **Unexpected conflicts**: Resolve using judgment per the conflict resolution heuristics above. Only ask the user for genuinely ambiguous or high-risk conflicts.
- **Network errors**: If `git fetch` fails, suggest checking VPN connectivity (company GitHub Enterprise may require VPN).
