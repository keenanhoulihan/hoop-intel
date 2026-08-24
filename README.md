# Hoop Intel

Runs with zero configuration. No API keys, no database, no `.env` required — the
app renders fully on fixtures, and live providers layer on top later.

```bash
npm install
npm run dev       # http://localhost:3000 → redirects to /nba
```

Visit `/nba`, `/nfl`, `/ncaam`. Same component, three different economic systems.

---

## Local setup in VS Code

1. Unzip somewhere sensible — `~/dev/hoop-intel`, not Downloads.
2. `code ~/dev/hoop-intel` (or **File → Open Folder**).
3. Open the integrated terminal: `` Ctrl+` `` / `` Cmd+` ``.
4. `npm install`, then `npm run dev`.

**Extensions worth installing.** Tailwind CSS IntelliSense (autocompletes the
arbitrary-value syntax used throughout), ESLint, Prettier, and the official
Vercel extension if you want deploy status in the sidebar.

**Node version.** Next 15 wants Node 18.18+. Check with `node -v`. If you're
below that, install [nvm](https://github.com/nvm-sh/nvm) rather than fighting a
system Node.

### If you already have the earlier scaffold

Don't overwrite it. Copy in only `src/core/`, `src/leagues/`, and
`src/components/ThresholdRail.tsx`, then confirm your `tsconfig.json` has:

```json
"paths": { "@/*": ["./src/*"] }
```

That alias is what makes every `@/core/league` import resolve. It's the single
most common reason these files won't compile in an existing project.

---

## GitHub

```bash
git init
git add .
git commit -m "League contract, threshold rail, three league modules"
git branch -M main
```

Create an **empty** repo at github.com/new — no README, no .gitignore, no
license. GitHub's starter files cause a merge conflict on your first push.

```bash
git remote add origin https://github.com/YOUR-USERNAME/hoop-intel.git
git push -u origin main
```

`.gitignore` already excludes `.env*`, `node_modules`, `.next`, and `.vercel`.
Verify with `git status` before the first commit that no `.env` file is staged.
A key committed to git history is compromised even after you delete it — you
have to rotate it, so it's worth the ten seconds to check.

---

## Vercel

1. [vercel.com/new](https://vercel.com/new) → **Import Git Repository** → pick
   the repo.
2. Framework preset auto-detects as Next.js. Change nothing. Deploy.

That's the whole setup. Next.js on Vercel needs no build configuration.

**Environment variables** go in Project → Settings → Environment Variables, one
per row, using the names in `.env.example`. Set them for Production, Preview,
and Development separately — Vercel treats those as three distinct scopes, and
a key added only to Production means every preview branch silently degrades to
fixtures. `credentials.ts` is built to survive exactly that, so it won't crash,
but you'll wonder why your preview shows sample data.

Locally, the same keys live in `.env.local`, which is gitignored. Or run
`vercel env pull .env.local` to sync them down.

---

## The update loop

```bash
git checkout -b market-tab
# ...work...
git add .
git commit -m "Add market tab"
git push -u origin market-tab
```

Vercel builds every pushed branch and comments a **preview URL** on the pull
request. That preview is a real deployment on real infrastructure — check it
before merging rather than trusting localhost.

Merge the PR into `main` and Vercel promotes it to production automatically.
No deploy command, no CI config.

**Before you push:**

```bash
npm run typecheck   # tsc --noEmit
npm run build       # catches what typecheck doesn't
```

Vercel runs the build too, and a failed build blocks the deploy rather than
shipping broken code — but catching it locally takes 30 seconds instead of
waiting on a queue.

**Rolling back.** Vercel dashboard → Deployments → find the last good one →
**Promote to Production**. Instant, and it doesn't touch git. Fix forward in a
branch afterward.

---

## Adding a league

One file in `src/leagues/`, one line in `src/leagues/index.ts`. Routes, the
league switcher, and the threshold rail pick it up with no other edits. Use
`nfl.ts` as the template if the league has a hard cap, `nba.ts` if it has soft
bands with rules gated by band.

## Before shipping

Every constant in the `CAP_TABLE` / `TABLE` blocks is marked `VERIFY`. They are
carried from the prototype and predate the current league year. They're isolated
in one table per league specifically so updating them touches no logic.
