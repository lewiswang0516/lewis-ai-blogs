---
title: 'Hands-On AI 13 | Build a Full Project from Scratch with AI: My Blog Retrospective'
description: 'The blog you are reading was built from scratch with AI. This post looks back at it through the commit history: picking the stack, setting rules, deploying, adding two languages, restyling, what went well and what could be better.'
pubDate: '2026-11-21T01:13:00Z'
---

This post is for people who want to finish a project with AI on their own and put it online, but do not know where to start. Read these first: Part 06 (your first Claude Code project), Part 07 (CLAUDE.md), and Parts 09 to 12. This post puts what the earlier posts covered into a real project.

The blog you are reading now is the project for this post. It lives at blogs.lewiswang.com.au, and the code is public on GitHub: lewiswang0516/lewis-ai-blogs.

It is not a complex system. It is a static blog in Chinese and English, deployed on Cloudflare. I chose it for this review because it is small and complete. It went from an empty folder to a site with a domain, posts, two languages and one restyle. Every step is in the git history, so you can follow along in the repo.

## Start with the timeline

Here are a few points from the git history. Times are Melbourne time.

| Time | Commit | What it did |
| --- | --- | --- |
| Nov 18, 12:24 | Set up Astro blog with Cloudflare Workers deploy | Start the project from the Astro blog template and set up deployment |
| Nov 21, 14:15 | Add two-part post on saving tokens with Claude Code | Publish the first set of posts, Parts 09 and 10 |
| Nov 21, 14:18 | Serve the blog on blogs.lewiswang.com.au | Connect the custom domain |
| Nov 21, 14:36 | Add English/Chinese i18n and a real homepage | Two languages and a homepage |
| Nov 21, 15:08 | Restyle the blog to match piggyway.com.au | Restyle |

Look only at the commit times. On November 18 around noon, the project started and deployment was set up. On November 21, from the first set of posts (14:15) to the restyle merge (15:09), it took less than an hour. Of course, commit times only record results. They do not include the preparation before or the back and forth in between.

This speed is not because AI is magic. It is because the project is small, the stack is mature, and every step had a clear goal. Below, I go step by step.

## Step 1: Pick the stack, pick the most boring option

I have only one rule for picking a stack: pick what the AI knows best, what has the most docs, and what is easiest to look up when something breaks.

Astro has an official blog template. One command gives you a blog with RSS, a sitemap and Markdown support. The README in the repo is still the one that came with the template. This shows the starting point was the official template, with no tricks.

For deployment, I chose static asset hosting on Cloudflare Workers. The built blog is just a set of HTML, CSS and image files. Workers serves the `dist` folder as static assets directly, so no server is needed.

One more word for beginners. On your first full project, do not learn a new framework, a new deployment platform and a new database at the same time. AI can write code for you, but when something breaks, you need to understand what it is doing. The more common the stack, the less likely the AI makes mistakes, and the easier it is for you to look things up.

## Step 2: Set the rules first, then write code

After the project started, I did not ask it to build features right away. First, I set down a few things it must "follow every time from now on":

- One command each for building, local preview and deployment
- Keys live only in environment variables. They never go into any file that gets committed to git, and they are never printed in the terminal
- Every change must build successfully, and big changes get a handover document

Part 07 covered these. The AI cannot see them from the code, but getting them wrong costs a lot. Write them down early, and every new session works by the same rules. You do not need to explain them again each time.

Looking back, there is one thing I could do better here. The AI follows rules in the instructions file almost all the time, but they are "guidance", not "enforcement". The official Claude Code best practices suggest this: for rules that must be followed 100% of the time, use deny rules in permissions or a hook instead, for example to block reading `.env` files directly. I will cover this in Part 14 when I talk about hooks.

## Step 3: Deployment config

Only a few lines in `wrangler.jsonc` matter:

```jsonc
{
  "name": "lewis-ai-blogs",
  "compatibility_date": "2026-11-01",
  "routes": [
    { "pattern": "blogs.lewiswang.com.au", "custom_domain": true }
  ],
  "assets": {
    "directory": "./dist",
    "not_found_handling": "404-page"
  },
  "observability": { "enabled": true }
}
```

- `assets.directory` points to Astro's build output
- `not_found_handling` is set to `404-page`, so a missing page returns the custom 404
- `routes` uses `custom_domain` to connect my own domain, and Cloudflare handles the DNS records and certificates automatically
- `observability` turns on logs, so when something breaks I can watch live logs with `npm run tail`

The deploy command is in `package.json`. `npm run deploy` builds first, then runs `wrangler deploy`. This way, whether it is me or the AI, there is only one way to deploy. It cannot happen that "it deployed with a different set of options".

## Step 4: Writing posts, and the first set of posts

Posts use Astro content collections. Each post is a Markdown file with a title, description and publish date at the top. The fields are defined in `src/content.config.ts`, and the build fails if you get them wrong.

The first set of posts is [Parts 09 and 10](/blog/save-tokens-claude-code-1/) of this series. I also wrote them together with AI.

The token stack chart in those posts is an SVG made by a script. There is one loose end here. The script that makes the chart is not in the repo. The handover document has a special note about it: to change the chart, you must regenerate the SVGs for both languages together.

## Step 5: Two languages, and a handover document

Adding two languages was the biggest change in this project. English is the default language, and its paths have no prefix. Chinese lives under `/zh/`. Posts sit in two folders by language, `src/content/blog/en/` and `src/content/blog/zh/`. Files with the same name are a translated pair, and the language switch in the header links them up automatically.

There is one design detail I really like. If a post is not inside a language folder, the build fails on purpose. This is much better than quietly publishing it as an English post. The error shows up on your own machine.

This step left a handover document, `docs/handover/i18n.md`. Its structure is the set of sections from Part 09: goal, current state, how it works, key files, how to run and check it, known issues and next steps. For example, "known issues" says the build does not run type checking. So if a key is missing from the Chinese UI text, it only shows as blank and does not raise an error.

The value of this document is not now, but next time. Next time, whether it is me or a new AI session that needs to change something about the two languages, the first message can be "read docs/handover/i18n.md first". A few hundred words explain the background.

## Step 6: The restyle

The last step was to make the blog's style match another site, piggyway.com.au. The fonts, color variable names and card colors all match. All colors are CSS variables with the same names as on that site, so it is easy to adjust both sites together later.

One detail is worth a mention. During the restyle, the charts in the posts did not change color at first. The reason is in the handover document: the text mentions "the big gray block" and "the blue bar", so if the chart colors changed, the text would no longer match. Later, the chart was regenerated in the site's purple (#dcd7ff) and navy (#050451), and the color words in both the Chinese and English text were changed at the same time. Chart colors and the text that describes them must change together. The AI finds it hard to notice this kind of cross-file dependency by itself, so someone has to point it out.

## Review: what went well, what could be better

### What went well

- **A safe stack**. The official template plus a mainstream deployment platform meant almost no time lost on environment problems
- **Rules first**. How to build, deploy and handle keys was decided before any feature was written
- **Only one way to deploy**. `npm run deploy`, and no other path
- **A handover document**. The biggest step has a document, so the next change does not need to start from zero

### What could be better

- **The README is still the template's**. The repo is public, and visitors see Astro's default description. It should be replaced with an introduction to this blog
- **The chart script is not in the repo**. This makes changing the chart depend on "the computer it was made on"
- **Hard rules are still only words**. A rule with zero exceptions, like "never read `.env`", should be a deny rule
- **The build does not type check**. A missing key in the UI text for either language does not raise an error. Adding an `astro check` step would fix that

### For people who want to start

If you also want to build a project from scratch with AI, my advice is to start with something this size: a blog, a portfolio page, or a small tool for yourself. The goal is to go through the whole process once: start the project, write the instructions file, deploy, go live, change a requirement once, and leave a handover document.

After one full run, your sense of "what AI can do for me, and what I must check myself" will be much more accurate than after ten tutorials.

## Next post

After this blog went live, there are still many small repeated tasks: checking for dead links, sorting new issues, running the build before publishing a post. The next post is the last one in the series. It covers how to automate this kind of daily work with agents: which tasks are worth handing off, how to use hooks, scripts, scheduled tasks and GitHub Actions to let it work while you are away, and five questions to answer before you let go.

## References

- [lewis-ai-blogs](https://github.com/lewiswang0516/lewis-ai-blogs): the source code of the blog this post reviews
- [Deploy your Astro site to Cloudflare](https://docs.astro.build/en/guides/deploy/cloudflare/): Astro's official guide to deploying on Cloudflare
- [Content collections](https://docs.astro.build/en/guides/content-collections/): Astro content collections
- [Internationalization (i18n) routing](https://docs.astro.build/en/guides/internationalization/): Astro routing for multiple languages
- [Static Assets](https://developers.cloudflare.com/workers/static-assets/): static asset hosting on Cloudflare Workers
- [Custom Domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/): custom domains for Workers
- [Best practices for Claude Code](https://code.claude.com/docs/en/best-practices): the advice to use hooks and deny rules for hard rules

Written in November 2026. Repo contents follow the main branch at the time of writing.
