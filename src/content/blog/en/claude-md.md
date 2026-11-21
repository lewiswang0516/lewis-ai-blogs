---
title: 'Hands-On AI 07 | How to Write CLAUDE.md, Your Project Guide'
description: 'Claude Code starts every session from a blank page. CLAUDE.md puts the things you always have to explain into one file: where it goes, what to write, how to write it, plus AGENTS.md and auto memory.'
pubDate: '2026-11-21T00:07:00Z'
---

This post is for people who have built one or two projects with an AI coding tool and now find it annoying to "explain everything again every time". I suggest you read Part 06 first, and ideally run `/init` once.

Every time you start a new session, Claude Code begins with a blank page. It does not remember that you said "this project uses pnpm, not npm" last time. It does not remember that you corrected it with "test files go in the tests folder". It also does not remember which folder it must never touch.

So you find yourself typing the same things again and again, in different sessions.

CLAUDE.md solves this problem. You write the things you always have to say into one file, and it reads that file first at the start of every session.

## What it is

CLAUDE.md is a normal Markdown file, written in plain language, with no special syntax. Claude Code reads it at the start of every session and puts its content into the context as background information.

There is one point people often get wrong, and the official docs stress it: CLAUDE.md is context, not enforced configuration. It is more like a handover note you write for a new coworker. The coworker will try to follow it, but there is no 100% guarantee. The more specific and short you make it, the more reliably it is followed.

If something must never happen, for example a folder must never be deleted, you should use a hook to block it before it runs. Do not just write "do not delete" in CLAUDE.md.

## Where it goes

CLAUDE.md can live in several places, and each place has a different scope. These three are the most common:

| Location | Scope | What to write there |
| --- | --- | --- |
| `~/.claude/CLAUDE.md` | All your own projects | Personal habits, like "answer in Chinese" or "write code comments in English" |
| `CLAUDE.md` or `.claude/CLAUDE.md` in the project root | This project, shared with the team through Git | Project structure, build commands, code style |
| `CLAUDE.local.md` in the project root | Only you, only in this project | Your local test URLs and personal preferences. Remember to add it to `.gitignore` |

A company can also put one shared set of rules in a system folder to manage Claude Code for all its staff. Individual users usually do not need this.

These files do not replace each other. They are read and joined together. The order goes from wide scope to narrow scope: first your personal file, then the project file. In the same folder, `CLAUDE.local.md` comes after `CLAUDE.md`. The later a file is read, the closer it is to your current work.

There is one more detail. At startup, Claude Code reads CLAUDE.md in the current folder and in all parent folders. CLAUDE.md files in subfolders are not read at the start. They load only when it touches a file inside that subfolder.

## Start with /init

The easiest starting point is `/init`, which Part 06 mentioned. Run it in your project, and Claude analyzes the code and writes a CLAUDE.md for you. The file lists the build commands, test methods and project conventions it found. If a CLAUDE.md already exists, it suggests improvements instead of overwriting it.

If the project already has config files for Codex or Gemini CLI, `/init` also asks if you want to import them.

But what `/init` writes is only a first draft. It can write down what is visible in the code. For things that are not visible, like "this API is for old clients, do not change it", you have to add them yourself.

## What to write

The official docs give a very useful test: if you would otherwise explain something again and again, write it down. In practice, add a line when one of these things happens:

- It makes the same mistake a second time
- A code review finds a problem it should have known about
- You notice you are typing a correction you already typed in an earlier session
- A new coworker would also need to know this to get started

The content should be facts that every session can use: build and test commands, code style, folder structure, and rules like "always do X".

On the other hand, do not put long procedures in it that you only need sometimes, like how to release or how to run a database migration. These fit better as a skill (a skill loads only when needed), or as path-based rules, which I cover below.

## How to write it

### Write sentences you can check

The official examples make the contrast clear:

- Write "use 2-space indentation", not "keep the code well formatted"
- Write "run `npm test` before you commit", not "remember to test"
- Write "put API handlers in `src/api/handlers/`", not "keep files organized"

With a vague rule, it can only guess your standard. With a specific rule, it just follows it, and you can see at a glance if it did.

### Keep it under 200 lines

The official docs suggest you keep each CLAUDE.md under 200 lines. There are two reasons. First, it loads in every session. As Part 02 explained, every extra thing in the context costs you money in every later turn. Second, the longer it is, the worse it is followed, because important rules get lost in long blocks of text.

### Use headings and lists

Put related rules under the same heading, and write them as a list. The official docs say clearly structured content is followed more easily than long paragraphs.

### Clean up conflicts from time to time

When two rules conflict, it may pick either one. After a project runs for a while, CLAUDE.md always collects some outdated content. Newer versions of Claude Code have `/doctor prompt-audit`. It checks your guide for content that is outdated, conflicting, or points to files that do not exist. It then suggests changes, and it only edits the file after you agree. This command needs v2.1.283 or newer.

## An example

Take the Pomodoro timer project from Part 06. A CLAUDE.md that is good enough looks roughly like this:

```markdown
# Pomodoro Timer

A single-file web app for personal use.

## Structure
- All code lives in index.html. Do not split it into files
- Do not add any external library or CDN

## Rules
- After a change, open index.html in the browser and check that countdown, pause and reset work
- UI text is in Chinese
- Commit after each finished feature, with the commit message in Chinese

## Notes
- Browser notifications need user permission. If permission is denied, fall back to an in-page message. Do not throw an error
```

It is under 20 lines, but a new session knows the limits of this project from the very start.

## Some advanced uses

### Import other files

In CLAUDE.md you can use `@path` to import other files, for example `@README` or `@docs/git-instructions.md`. The imported file loads together with CLAUDE.md. Imports can be nested, up to four levels deep.

Note that imports only help you organize. They do not save context. The imported file still loads in full.

### Path-based rules

When a project gets big, you can split rules into the `.claude/rules/` folder, one topic per file. Even more useful, a rule can be set to load only when it works on certain files:

```markdown
---
paths:
  - "src/api/**/*.ts"
---

# API Rules
- Every endpoint must validate its input
- Return errors in one standard format
```

This way, the API rules take up no space while you work on the frontend.

### Comments for humans

Content in CLAUDE.md that you write inside HTML comments `<!-- -->` is removed before it goes to the model. If you want to leave a note for coworkers who maintain this file, without spending tokens, use a comment.

### When changes take effect

If you change CLAUDE.md in the middle of a session, the change does not take effect right away. The root CLAUDE.md is read again from disk after `/compact`, or when you `/clear` or restart a new session. If it seems to "ignore" your guide right after you edit it, it most likely has not read the new version yet.

## What about other tools: AGENTS.md

CLAUDE.md is only for Claude Code. Other tools have their own conventions, and the most common one now is AGENTS.md. OpenAI first released it. In December 2025, it became a founding project of the Agentic AI Foundation under the Linux Foundation, together with MCP.

How some tools support it:

- **Codex**: reads AGENTS.md. It starts from the global folder `~/.codex`, then reads from the project root down to the current folder. The merged result has a default limit of 32 KiB, and anything past that is not read
- **Cursor**: supports AGENTS.md, and also its own `.cursor/rules`. AGENTS.md files in subfolders also take effect
- **Claude Code**: if a project has only AGENTS.md and no CLAUDE.md, it reads AGENTS.md directly. If both exist, by default it reads only CLAUDE.md

So if one project is used with several tools, an easy approach is this: put the main content in AGENTS.md, and make CLAUDE.md a single line, `@AGENTS.md`, that imports it. Then add any content that is only for Claude Code. One guide, shared by several tools.

## Another kind of memory: auto memory

Last, a quick word on Claude Code's auto memory. Unlike CLAUDE.md, Claude writes it itself. Based on your corrections and preferences, it saves notes in MEMORY.md. When it is on, each session loads the first 200 lines or 25KB. You can view it and turn it on or off with `/memory`.

Here is how the two split the work. If you want to set how it should work, write CLAUDE.md. If you do not want to write it and want it to learn from your corrections, use auto memory. My advice is to still write important rules into CLAUDE.md yourself, and use auto memory as an extra.

## Coming next

CLAUDE.md helps the AI understand your project. But its view is still limited to the files on your computer. It cannot see your calendar, your database, or the requirements doc you wrote in Notion. The next post covers MCP, an open standard that connects AI to external tools and data. It is also the last post of Stage 2.

Read next: [Hands-On AI 08 | What Is MCP, and How to Connect AI to External Tools](/blog/mcp/)

## References

- [How Claude remembers your project](https://code.claude.com/docs/en/memory): The official docs on CLAUDE.md, rules, AGENTS.md and auto memory. Most of this post comes from here
- [Commands](https://code.claude.com/docs/en/commands): Docs for `/init`, `/memory` and other commands
- [Custom instructions with AGENTS.md](https://developers.openai.com/codex/guides/agents-md): How Codex reads AGENTS.md
- [Cursor Rules](https://cursor.com/docs/rules): Cursor's rules and AGENTS.md support
- [AGENTS.md](https://agents.md): The official AGENTS.md website
- [Linux Foundation announces the formation of the Agentic AI Foundation](https://www.linuxfoundation.org/press/linux-foundation-announces-the-formation-of-the-agentic-ai-foundation): The announcement of AGENTS.md and MCP joining the foundation

This post was written in November 2026, based on the official docs at that time.
