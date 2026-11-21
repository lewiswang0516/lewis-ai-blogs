---
title: 'Hands-On AI 05 | From Web Chat to AI Coding Tools: How Claude Code, Codex and Cursor Differ'
description: 'An agent can read files, change code and run commands by itself, so you stop copying and pasting back and forth. This post compares the form, models and pricing of Claude Code, Codex and Cursor, and then explains how to choose.'
pubDate: '2026-11-21T00:05:00Z'
---

This post is for people who are used to chatting with AI on the web and want to try AI coding tools, but do not know which one to start with. Read Part 02 first, because this post uses the idea of "context".

Many people write code with AI like this. They describe what they need on a web page, and the AI gives a piece of code. They copy it into an editor and run it. It shows an error, so they copy the error back to the web page. The AI changes the code, and they copy it back again.

This flow works, but you will find that you have become a human courier. The AI cannot see your project. It does not know what other files contain, and it cannot run the code to check it. In every round, you have to feed it the information it needs by hand.

AI coding tools exist to solve this problem.

## Chat vs agent: what is the difference

The AI in a web chat can do only one thing: read the text you send and reply with text.

The AI in tools like Claude Code, Codex and Cursor is usually called an agent. The difference is that it has tools. It can read files in your project, change files, run commands in the terminal, and search the code. You give it a task, and it decides by itself which files to look at first, what to change, and which commands to run to check. If the result is wrong, it keeps changing things until it finishes or needs to ask you.

Compare how each one fixes a bug:

- Web chat: you paste the error, it guesses the cause and gives code, you copy and paste, run it, and paste the new error
- Agent: you say "The login page goes blank after a wrong password, fix it". It finds the related code, understands the logic, fixes the problem, runs the tests to confirm, and then tells you what it changed

You save more than the time spent copying and pasting. It can see the whole project, so its judgment is often more accurate too.

What is the cost? As Part 02 explained, every file it reads and the output of every command it runs go into the context. So an agent uses more tokens than chat, which is why Parts 09 and 10 cover saving tokens. Also, because it can change files and run commands, it can also change the wrong thing or run the wrong command. So these tools all have permission settings, which the next post covers.

## Three tools, three forms

Claude Code, Codex and Cursor can all do what I described above, and their core abilities are getting closer. The real differences are: who makes it, which models it can use, where you mainly use it, and how you pay.

Here is a table first. The information comes from each company's official docs in November 2026:

| | Claude Code | Codex | Cursor |
| --- | --- | --- | --- |
| Made by | Anthropic | OpenAI | Cursor |
| Models | Claude family | OpenAI's GPT family | Many to choose from: Claude, GPT, Grok, Kimi and more |
| Main form | Terminal command line, plus VS Code and JetBrains plugins, a desktop app, and a web version | Terminal command line, IDE plugins, the ChatGPT desktop app, and cloud tasks on the web | A standalone editor app |
| Project instructions file | CLAUDE.md (can also read AGENTS.md) | AGENTS.md | `.cursor/rules` or AGENTS.md |
| How you pay | Claude subscription (Pro and up) or API | Included in ChatGPT subscriptions, or use an API key | Its own subscription, with third-party models billed separately by usage |

Now let's look at each one.

### Claude Code

This is Anthropic's own tool. It started as a command-line program that runs in the terminal. Now it also has VS Code and JetBrains plugins, a standalone desktop app, and a web version. The official docs say all these entry points share the same engine. The CLAUDE.md, settings and MCP config in a project work across all of them.

It can only use Claude models. You need a paid Claude subscription (Pro, Max, Ultra, Team or Enterprise), or an API account in the Anthropic Console. The free plan does not include it.

Its strength is that the command line feels very smooth. Besides interactive chat, you can run a task once with `claude -p "task"`, and plug it into scripts or CI to run automatically. People who like the terminal will love it.

### Codex

This is OpenAI's matching product. Its form is very similar to Claude Code. It also has a command-line version: after you install it, run `codex` in your project folder to start. It has built-in commands like `/init`, `/model` and `/review`. It also works closely with ChatGPT. You can switch to Codex directly in the ChatGPT desktop app, and the web version can send tasks to run in the cloud.

Codex is included in ChatGPT subscriptions. You can use it on every plan from Free and Go to Plus and Pro, but the models and usage limits differ. For example, Free and Go can only use GPT-6 Luna in the desktop app, and the command line and IDE plugins start at Plus. If you already pay for ChatGPT, Codex costs you nothing extra.

### Cursor

Cursor takes a different path. It is a code editor with AI built in. You open a project in the editor and press Cmd+I to open the Agent panel and give it a task. Every change it makes shows as a diff in the editor, so you can see it clearly.

Its biggest strength is the number of models. The official model list includes models from Anthropic and OpenAI, the Grok family trained jointly by Cursor and SpaceXAI, and models from Kimi, Meta and others.

Its pricing changed a lot in 2026. According to the pricing page in November, a Cursor subscription now comes bundled with an X membership. The free plan has a small amount of usage. Plus costs 8 US dollars a month and can only use Grok models. Premium costs 30 US dollars a month and can use third-party models at API list price, with that usage billed separately. So if you want to use Claude or GPT in Cursor, you pay for it on top of the subscription.

## How to choose

The gap between the three tools is not big enough that you must pick one. My advice is to look at your current situation.

**Look at which company you already pay.** If you have a Claude subscription, use Claude Code. If you have ChatGPT Plus or Pro, use Codex. Start with what you already pay for, and think about others once you are comfortable.

**Look at whether you are used to the terminal.** The command-line versions of Claude Code and Codex have the most features, but you work in the terminal. If you rarely touch the terminal and a black window makes you nervous, an editor like Cursor is easier to start with. But Claude Code also has a desktop app and a VS Code plugin, so you do not have to use the terminal.

**Look at whether you want to switch models.** If you want to compare models from different companies in one tool, Cursor is the most convenient. If you only use one company's models, use that company's own tool. New features usually appear there first.

These tools are not exclusive either. The official Claude Code docs even have a section on installing the Claude Code plugin in Cursor. For project instructions, AGENTS.md has become a common format. Codex and Cursor read it directly, and Claude Code also reads it in projects that have no CLAUDE.md. So using one project with several tools is not hard. Part 07 covers this in detail.

## Three common misunderstandings for beginners

**Thinking AI coding tools are only for programmers.** That is not quite true. They can do more than write code. You can also give them jobs like organizing the documents in a folder, renaming files in bulk, or merging a pile of spreadsheets. If your work involves files on a computer, you can use them.

**Thinking it can handle everything by itself.** An agent can do a lot on its own, but if your request is unclear, it will still go the wrong way. Saying clearly what you want, from Part 04, matters even more here. One wrong step may already have changed a dozen files.

**Thinking more automation is always better.** All these tools can be set to change files and run commands without asking you. When you are new, I suggest you keep approvals on and watch what it does at each step. Give it more freedom slowly as you get used to it.

## Next up

That is enough theory. The next post is hands-on. Using Claude Code as the example, it goes from install and sign-in to building a small web page from scratch that opens in a browser. Every command is written out, so you can just follow along.

Read next: [Hands-On AI 06 | Claude Code from Install to Your First Small Project](/blog/claude-code-first-project/)

## References

- [Claude Code overview](https://code.claude.com/docs/en/overview): the official Claude Code introduction, including each entry point and how to install the plugin in Cursor
- [Claude Code quickstart](https://code.claude.com/docs/en/quickstart): which subscriptions or accounts you need
- [Codex CLI](https://developers.openai.com/codex/cli): install and features of the Codex command-line version
- [Codex Pricing](https://developers.openai.com/codex/pricing): what Codex includes on each ChatGPT plan
- [Cursor Documentation](https://cursor.com/docs): Cursor's official docs and model list
- [Cursor Quickstart](https://cursor.com/docs/get-started/quickstart): how to install Cursor and use the Agent
- [Cursor Pricing](https://cursor.com/pricing): Cursor's current plans

Written in November 2026. These tools change very fast, so check the official docs for the latest features and prices when you read this.
