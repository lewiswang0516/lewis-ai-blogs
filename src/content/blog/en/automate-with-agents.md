---
title: 'Hands-On AI 14 | Automate Daily Work with Agents'
description: 'Let AI work while you are not watching: from skills, hooks and scripts to scheduled tasks and GitHub Actions, plus five questions to answer before you let go.'
pubDate: '2026-11-21T01:14:00Z'
---

This post is for people who already work with Claude Code every day, and want it to get things done while they are not watching. Read these first: Part 08 (MCP), Part 11 (plan mode and giving it a check), Part 12 (subagents), and Part 13 (the blog project retrospective). This is the last post in the series.

In the previous thirteen posts, you mostly sat at the computer and worked with the AI back and forth. This post covers a different way to use it. You set the rules, and it starts on its own at a fixed time, or when something happens. When it finishes, it hands the result to you.

This sounds attractive, but let me add a word of caution first. Automation amplifies a process you have already proven. Only think about automating a task after you and the AI have done it by hand a few times, and it went smoothly each time. If you have not worked out a task yourself, automation only makes it go wrong faster.

## What is worth handing off

I filter tasks with four questions:

- **Does it repeat?** For a task you do once a month, writing the automation may take longer than doing it by hand
- **Is "done" clear?** "Check the blog for broken links and list them" is clear. "Make the blog better" is not
- **Can it check itself?** There are tests, a build, or a reference answer to compare with
- **Can you undo a mistake?** If it writes a report or opens a PR, you just close it when it is wrong. Publishing directly, sending email or deleting data needs a lot of care

Only tasks with "yes" to all four are a good place to start. For example:

- Every morning, sum up the new issues and failed CI runs in a few repos
- Every week, check the blog for dead links and broken images
- When a new PR opens, run an automatic review first and post the result as a comment
- After a dependency update, run the tests automatically. If they fail, try a fix and open a PR

Below, I go from light to heavy through the tools you can use in Claude Code.

## Layer 1: Save common instructions as a skill

The lightest automation is not typing the same words again every time.

If you often tell it to "check the changed files, run the build, and write the commit message in our format", you can turn this into a skill. Write the steps in `.claude/skills/<name>/SKILL.md` in your project, and then type `/name` to call it. A skill can also include script files. This suits flows like "run this command first, then look at this output".

This is not yet unattended work, but it fixes a process in place. All the automation after this is, at its core, calling a fixed process like this one automatically at the right moment.

## Layer 2: Hooks, so rules do not depend on its memory

A hook is a command that runs automatically at fixed points while Claude Code runs. The common points are:

| Point | When it fires | Typical use |
| --- | --- | --- |
| `PreToolUse` | Before it calls a tool | Block risky actions, like changing a certain folder |
| `PostToolUse` | After it calls a tool | Format files automatically after edits |
| `Stop` | When it wants to end the turn | Run a check, and keep it working if the check fails |
| `Notification` | When it needs you | Show a system notification |
| `SessionStart` | When a session starts | Add some background information |

Part 11 mentioned the Stop hook. Here is a full example from the official best practices. Put it in `.claude/settings.json`:

```json
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          { "type": "command", "command": "pnpm tsc --noEmit 1>&2 || exit 2" }
        ]
      }
    ]
  }
}
```

Each time it wants to finish, it runs a type check. Exit code 2 means block, and the error output goes back to it as the reason. It then keeps fixing until the check passes. To prevent an endless loop, Claude Code lets it through after 8 blocks in a row with no tool calls in between.

Another very useful one is the `Notification` hook. When it needs you to confirm something, it shows a system notification, so you do not need to watch the terminal all the time. This is the first example in the official hooks guide.

The official docs are clear about how hooks and CLAUDE.md split the work. CLAUDE.md is guidance, and the AI can decide that a rule does not apply in the current case. For rules that must run 100% of the time, use a hook or a deny rule in permissions. In Part 13 I said the blog's "never read `.env`" rule should be a deny rule. This is what I meant.

You do not need to write hooks from scratch. Just tell it "write a hook that blocks changes to the migrations folder". When it is done, use `/hooks` to check the config is right.

## Layer 3: Call it from a script

`claude -p "instruction"` runs once and then exits, without the interactive screen. This is the base for putting Claude Code into scripts, scheduled jobs and CI.

For unattended runs, a few flags are almost required:

- `--allowedTools`: approve in advance which tools it can use
- `--permission-mode dontAsk`: any action that would need a question is refused right away, so it does not get stuck waiting for someone to confirm
- `--max-turns`: limit how many turns it can run
- `--max-budget-usd`: stop when the estimated cost reaches this amount
- `--output-format json`: output a structured result that scripts can parse easily

One official example is migrating files in bulk:

```bash
for file in $(cat files.txt); do
  claude --bare -p "Migrate $file to the new logging API and commit. Reply OK on success, FAIL on failure." \
    --allowedTools "Read,Edit,Bash(git add *),Bash(git commit *)" \
    --permission-mode dontAsk \
    --max-turns 20
done
```

`--bare` skips your local hooks, skills, plugins, MCP and CLAUDE.md, so every run has a clean, predictable environment. It also does not use your subscription login. Credentials must come from a place like `ANTHROPIC_API_KEY`.

There is one more official tip I think is important: try three files first, see where it fails, improve the instruction, and then run the rest.

## Layer 4: Scheduled and event triggers

Claude can finish a task, but it does not decide "start now" by itself. Something has to start it: you, a timer, or an event. Claude Code has three ways to schedule work:

| | `/loop` | Desktop scheduled tasks | Cloud scheduled tasks |
| --- | --- | --- | --- |
| Where it runs | Your computer | Your computer | Anthropic's cloud |
| Computer must be on | Yes | Yes | No |
| Session must be open | Yes | No | No |
| Can read local files | Yes | Yes | No, each run is a fresh checkout of the repo |
| Shortest interval | 1 minute | 1 minute (1 hour in the form) | 1 hour |

**`/loop`** suits watching something inside one session, for example:

```text
/loop 15m check CI on this branch. If it fails, pull the logs of the failed job, fix it and push again
```

Each run is a new turn in the same session, so do not leave it on in a session that is already long. As Part 09 explained, every turn carries the whole history. It expires automatically after at most seven days.

**Cloud scheduled tasks** (once called routines) are created with `/schedule`, or managed on the claude.ai/code/routines web page. They run in the cloud, so it does not matter if your computer is off. Besides time triggers, they can also be triggered by an HTTP call, or by a new PR or new release on GitHub. They are currently a research preview and need a Pro plan or higher.

The official docs give one warning about cloud tasks that is worth following. Before you let go, add a protection rule on GitHub for the `main` branch that it cannot get around. Also watch the first few runs of a new task yourself.

## Layer 5: GitHub Actions and the Agent SDK

If your code is on GitHub, Claude Code has an official GitHub Action. Run `/install-github-app` in Claude Code. It installs the GitHub app, sets up the secrets, creates the workflow file, and then opens a PR for you to merge. After that, mention @claude in an issue or PR comment, and it analyzes the code, changes it and pushes commits. You can also set it up to run an instruction automatically when an event happens.

One step further, if you want to build this power into your own program, use the Agent SDK. It turns the tools, loop and context management behind Claude Code into Python and TypeScript libraries. This is already "building a product". Under Anthropic's terms, you must use an API key, not a subscription account login.

## Five questions before you let go

The official best practices have a section about letting Claude run with nobody watching, and it lists five questions. I think this is the part of this post most worth copying down:

1. **Does it know what done means?** A completion condition, a spec, or a failing test it must make pass
2. **Can it check its own work?** Tests, a Stop hook, or some kind of review step
3. **What can it touch?** Permission rules, `dontAsk`, a sandbox, a worktree, the one branch it can push to
4. **What makes it stop?** `--max-turns`, `--max-budget-usd`, a spending limit
5. **Where do results go, and who signs off?** A PR, a comment or a summary. Then a person approves the merge, the deployment, and any action that cannot be undone

I want to say a bit more about the fifth. In automation, the actions that should stay with people are the ones you cannot undo: merging to the main branch, deploying, sending messages to others, deleting things. Let the AI prepare everything, and you are the one who presses the final button.

One more tip on saving money, in line with Parts 09 and 10: background work costs money even when you are not typing. `/loop`, goal checks and subagents all keep sending requests. After you set up a scheduled task, check `/usage` after a few days. Make sure what it costs matches the value it brings.

## At the end of the series

This series started with "what is a large language model". It went through tokens and billing, picking a model and writing prompts. Then it covered getting started with Claude Code, writing CLAUDE.md and connecting MCP. After that came saving tokens, planning and rewind, and subagents. It ended with a real project and this post on automation.

Looking back, almost every post comes back to the same thing: clearly state what you know but the AI does not. Project rules go into CLAUDE.md. A task's definition of done goes into the instruction. Half-finished state goes into a handover document. Things it must never touch go into a hook. The tools will keep changing, but this will not.

## References

- [Best practices for Claude Code](https://code.claude.com/docs/en/best-practices): the source of the five questions before unattended runs, the script example and the Stop hook example
- [Automate actions with hooks](https://code.claude.com/docs/en/hooks-guide): a hooks introduction and the notification example
- [Hooks reference](https://code.claude.com/docs/en/hooks): all hook points and exit code rules
- [Extend Claude with skills](https://code.claude.com/docs/en/skills): custom skills
- [Run Claude Code programmatically](https://code.claude.com/docs/en/headless): `claude -p` and `--bare`
- [CLI reference](https://code.claude.com/docs/en/cli-reference): flags such as `--max-turns` and `--max-budget-usd`
- [Run prompts on a schedule](https://code.claude.com/docs/en/scheduled-tasks): `/loop` and a comparison of the three ways to schedule
- [Automate work with scheduled tasks](https://code.claude.com/docs/en/routines): cloud scheduled tasks
- [Claude Code GitHub Actions](https://code.claude.com/docs/en/github-actions): how to install and use the GitHub Action
- [Legal and compliance](https://code.claude.com/docs/en/legal-and-compliance): the note that product development such as the Agent SDK should use an API key
- [Agent SDK overview](https://code.claude.com/docs/en/agent-sdk/overview): build Claude Code's power into your own program
- [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents): an Anthropic engineering blog post on when to use an agent, and when a fixed workflow is enough

Written in November 2026. Features like scheduled tasks and agent teams are still changing fast, so follow the commands in the version you have.
