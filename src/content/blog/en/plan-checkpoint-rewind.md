---
title: 'Hands-On AI 11 | Plan Mode, Checkpoints and Rewind: A Workflow with Less Rework'
description: 'Rework is the most expensive part. This post shows how to chain plan mode, checkpoints and rewind into one fixed workflow: agree on the direction before work starts, step back at any time after it starts, and know what to fix after you step back.'
pubDate: '2026-11-21T01:11:00Z'
---

This post is for people who have already built a few small features with Claude Code and now struggle with rework. I suggest you read [Parts 09 and 10](/blog/save-tokens-claude-code-1/) on saving tokens first. This post uses the ideas about context and cache from them directly.

In Part 10 I said that the real cost is often not normal work, but the rework after a mistake. That post was about how rework burns tokens. This post looks at it from another angle: how to cut rework with three built-in Claude Code tools. They are plan mode, checkpoints and rewind.

Each of the three is simple on its own. It is just one key press or one command. The real value comes from chaining them into a fixed workflow: agree on the direction before work starts, step back at any time after it starts, and know what to change after you step back.

## First, be clear about what "done" means

Before plan mode, there is an earlier step: you must know what you want.

A lot of rework is not the AI's fault. The request was unclear from the start. In your head it is "add a search box that can search by title and tag". What you say is "add search". It builds a version that only searches titles, because that is what you said. You say that is wrong, it changes it, and after a few rounds you finally get what you wanted.

If you have not decided yet, you can turn it around and let it ask you. The official Claude Code best practices recommend this. Just say:

```text
I want to add site search to the blog, but I have not worked out the details. Ask me questions until you can write a spec, then write it to SPEC.md.
```

It asks one question at a time: which fields to search, whether to support Chinese word segmentation, how to rank results, which page to put it on. After you answer, it writes the conclusions into SPEC.md.

Next, a small detail: after SPEC.md is written, start a new session before you build. The long Q&A before it does not help with writing code. If it stays in the context, every turn carries that extra part. In the new session, the first message is "build it from SPEC.md". It is clean, and you have a written standard for done. You will use this file again later when you check the work.

## Plan mode: see the plan first, then let it build

### What it does and does not do

In plan mode, Claude reads files and runs some read-only commands to understand the project. Then it writes a plan, but it does not change your source code. Until you approve, all edits are blocked.

There are three ways to enter it:

- Press Shift+Tab in a session to cycle through the permission modes, until the status bar at the bottom shows `⏸ plan mode on`
- Put `/plan` before a message, for example `/plan add previous and next post navigation to the post page`
- Start with a flag: `claude --permission-mode plan`

When the plan is ready, it asks you how to continue. There are roughly three options: approve and let it go on automatically, approve but confirm every edit yourself, or do not approve and keep working on the plan. You can also press Ctrl+G to open the plan in your own editor, change a few lines, and hand it back.

This step costs very little. According to the official docs, when the plan stage needs to explore the code, it hands that to a read-only research subagent (Plan). The file reading stays on its side and does not enter the main conversation. If the direction is wrong and you find it here, you lose one plan. If you find it after the code is written, you have a pile of edits to undo.

### What to look for in a plan

I mainly check four things in a plan:

- **Which files it changes**. If the file list does not match what I expected, it probably misread the request, or it found a dependency I did not know about. Both cases are worth a pause and a question.
- **In what order**. Data structure first or page first, tests first or implementation first. If the order is wrong, some step in the middle will not run.
- **How to verify**. If the plan does not say how to confirm the work is right, I add one line: "When done, run `npm run build`, then open the preview page to confirm."
- **What not to touch**. For example, "do not change the existing URL structure" or "do not add new dependencies". Put this kind of limit into the plan stage. If you do not, it may "improve" things along the way.

If any point is wrong, choose "keep working on the plan" and say what to change. Do not approve first and then correct it during the work. By then it has already changed half the files based on the wrong plan.

### When not to use it

Not every task needs a plan first. If you can say what to change in one sentence, just let it do it. Fixing a typo, changing a button color, adding a parameter to a function: for tasks like these, plan mode only adds an extra round.

My own rule is this: if the change touches more than three files, or I cannot say exactly how to build it, I ask for a plan first.

## Checkpoints: a save point before every message

### How it saves

Before each message you send that starts a new turn, Claude Code records the current state of the code. This is a checkpoint. You do not need to turn it on or save it by hand.

A few specific rules:

- A session keeps file snapshots for the most recent 100 checkpoints
- Checkpoints are saved with the session, so you can still rewind after you go back to an old session with `/resume`
- By default, snapshots are cleaned up after about 30 days. To keep them longer, change the `cleanupPeriodDays` setting

### What it does not cover

Many people miss this part, and they only find out when a rewind is not clean:

- **Files changed from the command line**. Checkpoints only track files that Claude changed with its own edit tools. If a file was only touched by `rm`, `mv` or a script, rewind does not restore it.
- **Files changed by subagents**. In most cases, subagent edits do not go into your checkpoints. Rewind only restores the files changed in the main conversation.
- **Files you changed by hand, or that another session changed**. These are outside what it tracks.
- **Symlinks and hard links**. Rewind skips them and tells you how many files it skipped.

So the official position is this: checkpoints are a quick undo at the session level, not version control. Anything you really want to keep still belongs in git. My habit is to commit each time a small piece works. Checkpoints cover what happens between two commits.

## Rewind: when it goes off course, go back and try again

### How to rewind

Type `/rewind`, or press Esc twice when the input box is empty. A list pops up with every message you sent in this session. Pick one, and you can do these things:

- **Restore code and conversation**: both go back to before that message
- **Restore conversation only**: the conversation goes back, the code stays as it is now
- **Restore code only**: the code goes back, the conversation stays
- **Summarize from here**: compress the conversation after this message into a summary
- **Summarize up to here**: compress the conversation before this message into a summary, and keep what comes after

After you rewind, the message you sent at that point shows up in the input box again. This is very useful: you can make it more precise and send it again.

### Rewind or correct?

When it gets something wrong, you have two options. One is to keep going and say "no, it should be...". The other is to rewind and send a better version of the original message.

These days I almost always choose the second. The reason is in Parts 09 and 10: the wrong attempt stays in the context. Every later turn carries it, and it also affects the AI's judgment. Rewind removes it completely. Rewind also reuses the beginning that is already cached, so the cache does not need to be rebuilt.

The official best practices have a more specific tip: if you correct the same thing twice and it is still wrong, do not correct it a third time. Run `/clear` to start a new session, and put what you learned from the first two tries into a new, clearer instruction. A third correction only adds more to a conversation that already has two failed attempts.

### Try the bold plan first

With rewind, trying things costs very little.

Say a page loads slowly. There is a safe fix (add caching) and a bold fix (switch to a different rendering approach). In the past I tried the safe one first, because the bold one was hard to clean up if it broke things. Now I can let it try the bold one first and check the result. If it does not work, I rewind and try the safe one.

If you want to keep both options to compare, use `/branch`. It copies the current conversation, and you switch to the new branch to try the other direction. The original session stays as it was, and you can go back to it at any time with `/resume`.

## Let it know for itself whether it is done

Rewind solves the "it went off course" problem. Another kind of rework happens when it thinks it is done, but it is not.

The most direct fix is to give it a check that runs and only passes or fails: tests, a build, type checking, lint, any of these. The official docs say that if the project already has such a command, the most useful line in CLAUDE.md is how to run it.

In your instruction, you can write:

```text
After the change, run npm run build. If there are errors, keep fixing until the build passes. Paste the last command you ran and its output.
```

The last sentence matters. "Everything passed" on its own proves nothing. Ask it to paste the command and the output, and one quick look tells you if it is true.

If you want to make it stricter, there are two more ways. I only mention them here. Part 14 covers them in detail when it talks about automation:

- `/goal`: set a completion condition, for example "all tests in the tests folder pass". At the end of each turn, another model checks whether it is met. If not, it keeps working
- Stop hook: each time Claude wants to end a turn, it runs a check command you choose. If the check fails, the error goes back to Claude

## Putting it together: one full workflow

Take "add site search to the blog" as the example, and follow this post's workflow:

1. In a new session, let it ask you questions and write SPEC.md
2. Start another new session, enter plan mode, and let it write a plan from SPEC.md
3. Check the plan: which files, what order, how to verify, what not to touch. If something is wrong, keep working on the plan
4. Approve, let it build, and ask it to run the build after each step
5. Watch the first minute or two. As soon as it heads in a strange direction, press Esc to stop it
6. If it goes off course, `/rewind`, make the instruction more precise and send it again. If two corrections on the same problem still fail, `/clear` and start over
7. Commit each time a piece works
8. When everything is done, start a subagent to check the work against SPEC.md (the next post shows how)

## How it maps to Codex

Codex also has a plan mode. Open it with `/plan` or Shift+Tab, and it works much like the one here. The details of checkpoints and rewind differ between the two. I have not compared them carefully on Codex, so I will not go into it. Before you use them, I suggest you read its official docs. Whatever tool you use, git as a safety net is always right.

## Next post

The last step of this post mentioned subagents. Part 10 said they can help you save tokens, but they are useful for more than that, and they cost more than tokens.

The next post is about subagents and multi-agent work: what each built-in subagent does, how to write your own reviewer that can read but not edit, when running several subagents in parallel is really faster, and when it only costs more.

## References

- [Checkpointing](https://code.claude.com/docs/en/checkpointing): the official Claude Code docs on checkpoints and rewind
- [Permission modes: plan mode](https://code.claude.com/docs/en/permission-modes): how to enter plan mode and how approval works
- [Best practices for Claude Code](https://code.claude.com/docs/en/best-practices): the source for letting Claude interview you, starting over after two corrections, and giving it a check
- [Sessions](https://code.claude.com/docs/en/sessions): session management such as `/branch` and `/resume`
- [Commands](https://code.claude.com/docs/en/commands): commands such as `/plan`, `/rewind` and `/goal`
- [Codex best practices](https://developers.openai.com/codex/learn/best-practices): OpenAI's best practices for Codex users

Written in November 2026. Commands and behavior follow the official docs at that time.
