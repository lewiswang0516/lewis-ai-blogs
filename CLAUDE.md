# CLAUDE.md

Personal blog about how I use AI tools. Built with Astro (blog template), deployed as static assets on Cloudflare Workers.
Also read `AGENTS.md` for Astro dev server notes.

## Cloudflare account

This project uses my **personal** Cloudflare account only, never the company account.

- Auth comes from `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`, injected into every Bash command by `.claude/settings.local.json`.
- `wrangler.jsonc` pins `account_id` to the personal account, so a fallback to any other login fails instead of deploying elsewhere.
- Never run `wrangler login` or `wrangler logout`.
- Do not use Cloudflare MCP tools or plugins for account operations (deploy, DNS, logs, resources). They are signed in to the company account. Docs search tools are fine.
- Never print, echo or cat the token, and never write it into tracked files.
- Before the first account operation in a session, run `npx wrangler whoami` and check the account is the personal one.

## Common tasks

- Write a post: add a Markdown or MDX file to `src/content/blog/`. Frontmatter fields are defined in `src/content.config.ts`.
- Local dev: `npm run dev` (use `astro dev --background` from an agent).
- Deploy: `npm run deploy` (builds, then `wrangler deploy`).
- Live logs: `npm run tail`.
- DNS and custom domains: prefer `routes` with `"custom_domain": true` in `wrangler.jsonc`. For other DNS records use the Cloudflare API with `curl` and `$CLOUDFLARE_API_TOKEN`.

## Git

- Remote: `github.com/lewiswang0516/lewis-ai-blogs` (public).
- Push directly to `main`. No feature branches or PRs for this repo.
- Commits use the GitHub noreply email set in this repo's local git config. Do not change it to the company email.
