---
title: 'Hands-On AI 06 | Claude Code from Install to Your First Small Project'
description: 'Starting with install, sign-in and permission modes, this post walks you step by step through using Claude Code to build a Pomodoro timer web page from scratch that opens in a browser.'
pubDate: '2026-11-21T00:06:00Z'
---

This post is for people who want to try Claude Code for the first time. It walks you through installing it step by step, and then using it to build a Pomodoro timer web page from scratch that opens in a browser. Read Part 05 first, so you know the difference between an agent and web chat.

You do not need to know how to code, but you do need to be willing to open a terminal and copy and paste a few commands. If you have never used a terminal, Claude Code has an official terminal guide for beginners. The link is at the end of this post.

## Before you start

Check three things first.

**Account.** Claude Code needs one of these: a Claude Pro, Max, Ultra, Team or Enterprise subscription, an Anthropic Console API account (prepaid), or access through a cloud platform like Amazon Bedrock, Google Cloud or Microsoft Foundry. The free plan does not include Claude Code. For individuals, the simplest option is Pro, which costs 20 US dollars a month as of November 2026.

**System.** The official requirements are macOS 13.0 or later, Windows 10 1809 or later, or a Linux distribution such as Ubuntu 20.04 or Debian 10 or later. You need at least 4 GB of memory and an internet connection.

**Git (recommended).** It is not required, but I strongly suggest you install it. It records every change, so if the AI breaks something, you can go back. For Windows users, the official docs recommend Git for Windows, so that Claude Code can run commands with Bash.

## Step 1: Install

Open a terminal and copy the command for your system.

macOS, Linux or WSL:

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

Windows PowerShell:

```powershell
irm https://claude.ai/install.ps1 | iex
```

Windows CMD:

```batch
curl -fsSL https://claude.ai/install.cmd -o install.cmd && install.cmd && del install.cmd
```

How do you tell PowerShell from CMD? Look at the prompt. If it starts with `PS C:\`, it is PowerShell. If it shows only `C:\`, it is CMD.

The installer does not show progress, so just wait until it finishes. On a Mac, you can also install with Homebrew: `brew install --cask claude-code`. But the Homebrew version does not update by itself, so you need to run `brew upgrade claude-code` from time to time. The version installed with the official script updates itself in the background.

After it installs, open a new terminal window and type:

```bash
claude --version
```

If you see a version number followed by `(Claude Code)`, the install worked.

If it says the `claude` command cannot be found, the install folder is usually not in your PATH yet. The "Fix your PATH" section of the official docs explains what to do on each system.

## Step 2: Create a project and start for the first time

First, create a folder for this small project, go into it, and set up Git:

```bash
mkdir pomodoro
cd pomodoro
git init
```

Then start Claude Code:

```bash
claude
```

The first time you start it, it asks you to sign in. With a subscription account, follow the prompts and approve access in your browser. Your sign-in is saved, so you do not need to sign in again later.

After you sign in, you see an input box. Above it, it shows the version, the current model, and the working folder. At this point, it can see what is in the `pomodoro` folder, which is empty for now.

## Step 3: Learn the permission modes

Before you start, spend a minute on permission modes. They decide whether it asks you before it changes files or runs commands.

Press `Shift+Tab` at any time to switch modes. The common ones are:

| Mode | What it can do without asking | Good for |
| --- | --- | --- |
| Manual (default) | Read files in the working folder | Sensitive work, unfamiliar code |
| acceptEdits | Read files, change files, common file operations | When you review changes as it works |
| plan | Only read and investigate, no changes | Getting a plan before any changes |
| auto | Everything, with safety checks in the background | Long tasks where you do not want to keep approving |

Note that the official docs say that from v2.1.283, interactive terminal sessions start in auto mode by default. This means it runs most actions by itself, and another model does safety checks in the background.

For your first time, I suggest you switch to Manual mode. Watch what it wants to do at each step, and approve before it runs. Give it more freedom once you are used to it.

## Step 4: Ask for a plan first

For this first project, use plan mode. Press `Shift+Tab` to switch to plan, then type your request.

To write the request, look back at Part 04: include the goal, background, limits and done criteria. For example:

```text
I want to build a Pomodoro timer web page for my own use.

Requirements:
- Use only one index.html file, with the HTML, CSS and JavaScript all inside it. Do not depend on any external library. It should open in a browser with a double-click
- Default to 25 minutes of focus and 5 minutes of break, with start, pause and reset
- When time is up, play a sound and show a browser notification
- Keep the interface simple, show the time left in large numbers, and make it readable on a phone

Done when: I open it in a browser, click start, see the countdown running, and pause and reset both work.

Give me an implementation plan first. Do not write code yet.
```

It first gives you a plan: the page structure, how the timer logic works, and how the sound works. Read it, and if you do not like something, just say so, for example "I want to set the break time myself". Once the plan is final, let it start writing.

This step looks unnecessary, but it is a habit worth building. As Part 10 explains, if the direction is wrong and you catch it at the planning stage, you lose very little. If you only find out after the code is written, you have to start over.

## Step 5: Let it build

After you confirm the plan, switch back to Manual or acceptEdits mode, and tell it "build it according to this plan".

It creates `index.html`. In Manual mode, it asks you before it writes the file, so choose Yes to approve. When it finishes, it usually tells you what it did and how to open the page.

Double-click `index.html` in the folder, or run `open index.html` (Mac) in the terminal to open it and take a look.

## Step 6: Change it in small steps

The first version is rarely perfect. When you find a problem, tell it in plain words:

```text
When I click pause and then start again, the time jumps a little. Fix it.
```

```text
Let me set the break time myself. Keep the default at 5 minutes.
```

Ask for only one or two changes at a time, and check the result before you ask for the next. If you send ten requests at once, it can easily miss some, and it is hard for you to check.

If it changes things beyond recognition, do not just ask it to "change it back". Type `/rewind` to roll both the chat and the code back to an earlier checkpoint.

## Step 7: Save your work with Git

When you are happy, save a version. You do not need to remember Git commands. Just tell it:

```text
Commit the current changes with a clear commit message.
```

It runs `git add` and `git commit` for you. After that, commit each time you have a version you like. Then no matter how the AI changes things later, you can go back to any saved version.

## Step 8: Wrap up

There are three more commands worth trying in your first project.

`/init`: it analyzes the project and creates a CLAUDE.md file. The file records things like the project structure and how to run it. In the next session, it reads this file first. This is the topic of Part 07.

`/usage`: see how much this session used. Subscribers can see what share of their plan's quota it took. Check it after your first project, and you will get a feel for how much usage a small web page takes.

`/clear`: when this project is at a stopping point, start a clean new session. If you want to work on something else, do not keep chatting in this session. Part 09 explains why.

## Quick command reference

| Command | Where to use it | What it does |
| --- | --- | --- |
| `claude` | Terminal | Start interactive mode |
| `claude -c` | Terminal | Continue the most recent chat in the current folder |
| `claude -r` | Terminal | Pick an earlier chat to continue |
| `/help` | Inside Claude Code | Show available commands |
| `/clear` | Inside Claude Code | Start a new chat. You can get the old one back with `/resume` |
| `/rewind` | Inside Claude Code | Roll back to an earlier checkpoint |
| `/exit` | Inside Claude Code | Exit. You can also press Ctrl+D twice |

## Next up

After this small project, you may notice that every new session needs the same explanation again: what the project is, what technology it uses, and what the rules are. The next post covers CLAUDE.md, the project instructions file written for AI: where it goes, what to write, how long it should be, and why writing too much actually hurts.

Read next: [Hands-On AI 07 | How to Write CLAUDE.md and Project Instructions](/blog/claude-md/)

## References

- [Claude Code quickstart](https://code.claude.com/docs/en/quickstart): the official quickstart. Install, sign-in and the common commands all come from here
- [Advanced setup](https://code.claude.com/docs/en/setup): system requirements, all install methods, and how to uninstall
- [Choose a permission mode](https://code.claude.com/docs/en/permission-modes): how permission modes work
- [Commands](https://code.claude.com/docs/en/commands): all Claude Code commands
- [Claude pricing](https://claude.com/pricing): prices for each subscription plan
- [Terminal guide](https://code.claude.com/docs/en/terminal-guide): if you have never used a terminal, read this official guide first
- [Checkpointing](https://code.claude.com/docs/en/checkpointing): the official guide to `/rewind` and checkpoints

Written in November 2026. The commands follow the official docs at that time. Claude Code updates quickly, so the interface and default settings may look a little different for you.
