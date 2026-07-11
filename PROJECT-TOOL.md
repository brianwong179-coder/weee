# Project tool

Two ways to create, edit, and delete the projects that appear on
[mrwongsshenanigans.com](https://www.mrwongsshenanigans.com/). Both edit the
same file — `content/projects.json` — so you can mix and match.

> Requires Node ≥ 18.18 (same as the site itself).

## Web admin (visual, with live preview)

```bash
pnpm dev          # or: npm run dev
```

Open **http://localhost:3000/admin**.

- **New project** — fill the form. Category and status are dropdowns; specs,
  stack items, and write-up sections are add/remove lists. The card preview
  updates as you type, and you can upload a cover image (it's saved into
  `public/projects/`).
- **Edit** — click the pencil on any project.
- **Delete** — click the trash icon (asks to confirm).

The `/admin` route only runs in development. It is hidden on the deployed
Vercel site, so it never ships publicly. (Set `ENABLE_ADMIN=1` if you ever
need it in a production build.)

## CLI (fast, keyboard-only)

```bash
pnpm project          # interactive menu
pnpm project:list     # list all projects
pnpm project:new      # create one
pnpm project:edit     # pick and edit
pnpm project:delete   # pick and delete
```

You can also target a project directly: `pnpm project:edit vega-1-quadcopter`.
Press Enter at any prompt to keep the current/default value.

## Publishing

Both tools write to disk locally. To put changes on the live site:

```bash
git add -A
git commit -m "Add/update project"
git push
```

Vercel redeploys automatically on push to `main`.

## Data model

Each project in `content/projects.json`:

| Field      | Notes                                                        |
| ---------- | ------------------------------------------------------------ |
| `slug`     | URL segment (`/projects/<slug>`); auto-derived from title    |
| `title`    | Display name                                                 |
| `category` | `Drone`, `Rocket`, or `Flight Control`                       |
| `status`   | `Flying`, `In Development`, `Retired`, or `Bench Testing`    |
| `year`     | e.g. `2025`                                                  |
| `tagline`  | One line shown on the card                                   |
| `summary`  | Short paragraph at the top of the project page               |
| `cover`    | Image path, e.g. `/projects/my-build.png`                    |
| `stack`    | List of tech/tools                                           |
| `specs`    | List of `{ label, value }` rows for the spec sidebar         |
| `sections` | List of `{ heading, body[] }` — each `body` item is a paragraph |

The valid categories/statuses live in `lib/projects.ts`; add new ones there.
