---
title: 'Hands-On AI 12 | Subagents and Multi-Agent Work: When Are They Worth It'
description: 'Subagents and multi-agent setups give you parallel work and a fresh pair of eyes, not smarter answers. This post covers what they can do, what they cost, and when to use them or not.'
pubDate: '2026-11-21T01:12:00Z'
---

This post is for people who can already build a full feature with Claude Code and want it to do several things at once. I suggest you read Part 10 first (the section on saving tokens with subagents) and Part 11 (plan mode and rewind).

Part 10 talked about subagents from the angle of saving tokens: send the noisy work out, and keep the main conversation clean. This post does not repeat that. It asks a different question: what can subagents and multi-agent setups actually help you do, what do they cost, and when should you use them or not.

The conclusion first. The Claude Code best practices contain one sentence I think matters most. When you hand a task to a subagent, by default the same model (or a smaller one) still does it. You get parallel work or a fresh pair of eyes, not a smarter answer.

Almost every judgment below starts from this sentence.

## First, tell the levels apart

The word "multi-agent" is used very loosely today. In Claude Code, from light to heavy, there are roughly these levels:

| Form | What it is | Where the result goes |
| --- | --- | --- |
| Subagent | A helper the main conversation sends out, with its own context | It hands one result back to the main conversation when done |
| Fork | A special subagent that inherits the whole history of the main conversation | Same as above |
| Agent team | Several independent Claude Code instances, with one as the lead | Members message each other directly and share a task list |
| Several parallel sessions | You open a few sessions yourself, each doing its own work | You combine the results yourself |

The first two are the most used in daily work. Agent teams are still an experimental feature and are off by default. The last one is not a feature but a way of working. It is very practical, and I cover it later.

## Subagents: most of the time it uses them on its own

### The three built-in ones

Claude Code comes with a few subagents. You do not need to set them up. It sends them out on its own when the situation fits:

- **Explore**: read-only, made for searching and analyzing the codebase. If you ask "where does this project handle login", it will most likely send Explore to look.
- **Plan**: read-only, does research for the main conversation in plan mode. Part 11 covered this.
- **general-purpose**: can use every tool, and handles multi-step tasks that need both research and changes.

Explore and Plan do not load your CLAUDE.md when they start, so they stay fast and cheap. This sometimes confuses people. You wrote a rule in CLAUDE.md, but Explore seems not to know it. It really did not read it.

### Fork: go to work with the full memory

A normal subagent starts from zero. It knows only what you give it. A fork is different. It inherits everything in the main conversation so far, then does one job in the background and hands back the result when done.

One benefit is that you do not need to explain the background again. Another benefit is the cache. A fork has exactly the same system prompt and tool definitions as the main conversation, so its first request can reuse the main conversation's cache. For tasks that need the same background, it is cheaper than a new subagent.

You can start one yourself with `/subtask`, for example:

```text
/subtask Add unit tests for the parser code changed so far
```

It runs in the background, and you keep working on other things in the main conversation. In the current version, fork mode is on by default, and Claude also decides on its own when to fork.

## When it is worth sending work out

The official docs list four cases. Here is how I understand them:

**One: independent work that can run in parallel.** For example, you need to research three modules at once: auth, database and API. The three jobs do not depend on each other, so three subagents can look at the same time, and the total time is much shorter. This only works if they truly do not depend on each other. If B has to wait for A's result, parallel work makes no sense.

**Two: work with long output where you only need the conclusion.** Running the full test suite, searching the whole repo, reading a long log. This is the case Part 10 talked about.

**Three: you need a pair of eyes that did not see the process.** I think this is the most underrated use. After the main conversation writes code for a long time, it "agrees" with its own thinking. If you ask it to check its own work, it easily misses problems. A subagent that did not see the code being written does a much better review. The official `/code-review` follows this idea: it reviews the current changes in a brand-new subagent.

**Four: work where you want to limit permissions.** For example, a reviewer that can only read and cannot edit. Claude Code enforces this limit. It is not a "please do not edit" request in the prompt.

On the other hand, these cases are better kept in the main conversation:

- Work that needs you to confirm and adjust back and forth often
- Planning, building and testing stages that share a lot of background
- Small changes of one or two lines
- When you are in a hurry. A new subagent has to learn the background on its own first, and sometimes it is slower than doing the work in the main conversation directly

There is one more case where you do not even need a subagent. If you just want to ask a small question about the content of the current conversation, use `/btw`. It does not call tools, and its answer is not added to the conversation history.

## Write your own subagent

If the built-in ones are not enough, you can write your own. A subagent is just a Markdown file with a YAML header. Put it in `.claude/agents/` (works only for the current project) or `~/.claude/agents/` (works for all your projects).

The best one to write first is a read-only reviewer. The example in the official docs is roughly like this:

```markdown
---
name: reviewer
description: Reviews changed files against the spec. Use after a feature is built and before it is committed.
tools: Read, Grep, Glob
---
You are reviewing code you did not write. Compare the changed files with the spec you are given,
confirm that every requirement is built and every listed edge case has a test,
and report only problems that affect correctness, not code style.
```

A few key points:

- `tools` only gives `Read, Grep, Glob`, so it cannot change any file
- Do not drop the last part, "not code style". The official docs warn about this on purpose. If you ask a reviewer to find problems, it will always find something. If you fix every point, you end up with a pile of extra layers of abstraction and tests you did not need
- For simple work you can add a line `model: haiku`, which is much cheaper

After you write it, you can ask Claude to use it directly: "use reviewer to check this change against SPEC.md". The result goes back to the main conversation, and the main conversation goes on to fix things. This fits right into the last step of the workflow from Part 11.

You can also skip writing the file yourself. Just tell Claude what kind of subagent you want and where to save it, and let it write the file. After that, open the file and check that the header config is right.

## What it costs

Every request a subagent makes counts toward your usage. Part 10 said it cannot read the main conversation's cache (forks are the exception), and a subagent's cache lasts only 5 minutes by default.

The official docs give a few ways to save money. Here they are, with my own understanding added:

- Use Haiku for simple work
- Ask it to hand back a short summary. If you send out twenty subagents and each hands back a long block of text, the main conversation still fills up
- Use `/usage` to see how much each type of subagent uses, and decide which ones are worth keeping
- Watch background work. Subagents keep sending requests even when you are not typing

By default, Claude Code runs at most 20 subagents at the same time. Subagents can also send out their own subagents, up to three levels deep by default. These limits are there to stop things from getting out of control. They are not targets to reach.

## Agent teams: first make sure you really need one

Agent teams are a different thing. They start several fully independent Claude Code instances. One acts as the lead, assigns tasks and combines the results. Members can message each other directly, and they share one task list.

It is still an experimental feature. To turn it on, you add the environment variable `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` in your settings. The official docs also state that there are known issues with resuming sessions, task coordination and shutdown.

The officially suggested use cases are:

- Several members research the same problem from different angles, then challenge each other
- A new module, where each member owns a part that does not affect the others
- Debugging with several competing hypotheses, where each member tests one
- Changes across frontend, backend and tests, with one member for each layer

The cost is also stated clearly. When members run in plan mode, a team uses about 7 times the tokens of a normal session. For tasks that run in order, tasks that edit the same file, or tasks with many dependencies, a single session or subagents fit better.

When the Anthropic engineering blog described its multi-agent research system, it gave a clearer set of numbers. In their data, a single agent uses about 4 times the tokens of a normal chat, and a multi-agent system uses about 15 times. In the same article, the multi-agent version did 90.2% better than a single agent on their internal research evaluation. Put the two numbers together: multi-agent setups can do things a single agent cannot, but they only pay off when the task is worth the cost.

## Simpler parallel work: open a few sessions yourself

Often the parallel work you want does not need any advanced feature. Open two terminals, run one Claude Code in each, and give each one a job.

The only thing to watch is that they do not edit the same code. The official approach is git worktree, with a separate working folder for each session:

```bash
claude -w feature-search
```

This starts a session in a new worktree. The new worktree is a fresh checkout. Files that git ignores, like `.env`, are not copied over, and dependencies are not installed. If needed, you can put a `.worktreeinclude` file in the repo root that lists files to copy over, like `.env`.

A second session also has a ready-made use: as a reviewer. One session writes the code, and another session reads the finished files. It did not see the writing process. You paste the problems it finds back into the first session. This is the cheapest and easiest-to-understand "multi-agent work", and you are the lead who passes the messages.

## A decision table

| Your situation | Suggestion |
| --- | --- |
| Changing one or two lines, or you need to confirm back and forth often | Do it directly in the main conversation |
| You only want to ask a small question about the current content | `/btw` |
| You need to run commands with long output, or search a large area of code | A subagent, with a small model |
| Adding tests or writing docs in the background, with the current background needed | A fork (`/subtask`) |
| You want an independent review | A read-only review subagent, or `/code-review` |
| Several truly independent jobs you want to move forward at the same time | Several sessions with worktrees, or parallel subagents |
| Several directions need to discuss and challenge each other | Only then think about an agent team, and check the usage first |

## Coming next

With this post, Stage 3, "Use it well and use it cheaply", is done. From the next post on, we move to real projects.

Part 13 is a retrospective of one full project: how I built this blog from scratch with AI, from choosing the stack, setting the rules and deploying it, to adding two languages and a redesign. It shows how plan mode, handover docs and subagents from the earlier posts worked in a real project, and where I hit problems.

Read next: [Hands-On AI 13 | Build a Full Project from Scratch with AI: My Blog Retrospective](/blog/project-retrospective-blog/)

## References

- [Create custom subagents](https://code.claude.com/docs/en/sub-agents): The official Claude Code subagent docs. Built-in subagents, forks, and the limits on concurrency and nesting are all here
- [Orchestrate teams of Claude Code sessions](https://code.claude.com/docs/en/agent-teams): How to turn on agent teams, their use cases and limits
- [Manage costs effectively](https://code.claude.com/docs/en/costs): The source of the "about 7 times" usage for agent teams
- [Best practices for Claude Code](https://code.claude.com/docs/en/best-practices): "Subagents do not give you smarter answers", the reviewer example, and parallel work with worktrees
- [Worktrees](https://code.claude.com/docs/en/worktrees): `claude -w` and `.worktreeinclude`
- [How we built our multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system): The Anthropic engineering blog post, source of the 4 times, 15 times and 90.2% figures

This post was written in November 2026. Features and defaults follow the official docs at that time. Experimental features like agent teams change especially fast.
