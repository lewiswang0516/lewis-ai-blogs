---
title: 'How to Save Tokens: Claude Code as an Example (Part 2)'
description: 'The context is already there. Here is how to get more value from it: do not break the cache, take fewer detours, hand the grunt work to subagents, and use a checklist.'
pubDate: '2026-11-21T01:05:00Z'
---

This is Part 2. Part 1 covered where the money goes, and the first two habits: pick the right tier, and keep the context small. If you have not read it yet, I suggest you start with [Part 1](/blog/save-tokens-claude-code-1/).

The three habits in this part look at the problem from another angle: the context is already there, so how do you get more value from it?

## Habit 3: Do not break the cache

As I said in Part 1, long sessions are affordable only because of the cache. But the cache is easier to break than you might think.

To decide whether it can use the cache, the server checks whether the start of this request is exactly the same as last time. The part that matches is re-read at the low price, and only the new end needs full processing. But if even one thing changes at the start, everything after that point has to be computed again ([source](https://code.claude.com/docs/en/prompt-caching)).

Think of a neat stack of plates. Adding one more plate on top is easy. To replace a plate near the bottom, you have to take off everything above it and stack it again. The actions below are the ones that touch the plates at the bottom.

### Actions that break the cache

| Action | Result | How to avoid it |
| --- | --- | --- |
| Switch model mid-session | The whole history is re-read without the cache | Pick at the start, and ask simple questions in a new session |
| Change thinking effort mid-session | On most models it is re-read too, some newer models are not affected | Pick at the start |
| Compact the conversation | The history is replaced by a summary, and the cache for the conversation part is rebuilt | Do it at a pause between tasks |
| Stay away too long | The cache expires, and the first message after you return processes all the context again | Wrap up before you leave, and open a new session when you return |

The content of the table comes from the official Claude Code docs.

The first three are things you do on purpose, so once you know about them, they are easy to avoid. The last one is the hardest to notice. The cache has a lifetime, five minutes or one hour by default, depending on how you pay. For subscription users within the plan quota, the cache of the main conversation lasts one hour. For pay-as-you-go users, it is five minutes ([source](https://code.claude.com/docs/en/prompt-caching)). So if you go to a meeting or to lunch, the first question you ask when you return may be the most expensive one in the whole session. If you need to be away for a while, ask it to write a handover file first, and open a new session when you come back.

### Two common misunderstandings

Two things that many people think break the cache actually do not.

The first is editing CLAUDE.md mid-session. It does not break the cache, but the change also does not take effect right away. Claude Code reads CLAUDE.md once at the start of the session and uses that version from then on. It reloads only at the next `/clear`, `/compact` or restart ([source](https://code.claude.com/docs/en/prompt-caching)). If you just edited your notes and the AI seems to "ignore" them, most likely it has not read the new version yet.

The second is rewinding the conversation. When you use `/rewind` to go back to an earlier turn, it uses the start that is already cached, so nothing needs to be rebuilt. So if you notice you went the wrong way, rewinding is cheaper than compacting.

This "match from the start" rule is not unique to Claude Code. The caches of most model services work this way. In short, once a session has started, avoid touching the things at the start.

## Habit 4: Take fewer detours

The first three habits save the cost of normal work. The real big cost is often the rework after something goes wrong. The tokens spent on five rounds of corrections are far more than the cost of writing three more sentences at the start, and it also uses up your patience.

### Say it clearly once

The AI cannot read your mind. The vaguer your information is, the more it has to search and guess by itself, and every search puts more into the context.

OpenAI has a very practical format for Codex users. A good task description has four parts:

- **Goal**: What to change, and what it should look like when done
- **Relevant context**: Which files, docs and error messages are involved
- **Constraints**: The rules and architecture to follow, and what must not be touched
- **Done criteria**: When the task counts as finished, for example all tests pass or a certain bug no longer appears

For example, take "there is a problem with login, take a look". It has to search the project for login code first, and then guess what you mean by "problem". Compare this: "the login function in auth.ts does not report an error when the password is empty, add validation, and all existing tests must pass". Now it can open that file and start right away, and it knows when it is done.

### For complex work, ask for a plan first

For a complex task, do not rush to let it start. Ask it to investigate and propose a plan first, and write code only after you read it and agree.

If the direction is wrong and you find out in the planning stage, you lose a few thousand tokens. If you find out after the code is written, you have to tear it all down and start over. In Claude Code, press Shift+Tab to switch to plan mode.

### When you see it going wrong, stop it right away

Many people let the AI finish first and then say "no, do it again". But the whole wrong section is already in the context. It is carried in every later turn, and it may keep disturbing the AI's judgment.

As soon as you see it heading in the wrong direction, press Esc to interrupt. Then use `/rewind` (or press Esc twice) to roll the conversation and the code back to the checkpoint before the mistake ([source](https://code.claude.com/docs/en/costs)). The wrong section then disappears from the context completely.

### Let it check its own work

Attach a test case, the expected output or a screenshot to the task, so it knows what "correct" looks like. If it can verify the result itself, problems are found before the work reaches you. This saves a round of "look, this part is wrong".

### Ask it to say less

One more small detail: output costs more than input. You can ask it to change only what needs to change and not rewrite the whole file. You can also ask it to give the conclusion directly and not repeat your question first. If you put these requests in CLAUDE.md, you do not need to say them every time.

All of this applies to Codex as well. Its plan mode opens with `/plan` or Shift+Tab.

## Habit 5: Hand the grunt work to subagents

This habit needs to be used smartly. Used badly, it costs more.

### Why subagents save money

Some jobs are not hard, but the process is very wordy: running the tests, checking a document, reading through thousands of lines of logs, or finding the definition of one function among dozens of files. What you really want is only the conclusion, such as "the test on line 42 failed because of a null pointer". But if the main conversation does it, every file it opens and every line of output stays in the context.

This is what subagents are for. A subagent searches in its own separate context, and when it is done, it hands back only the conclusion. The whole process stays on its side ([source](https://code.claude.com/docs/en/costs)). The main conversation stays clean, every later turn is cheaper, and the AI stays more focused.

### But it is not free

The requests a subagent sends still count toward your usage. Also, it starts from zero and cannot read the cache of the main conversation, so it has to build its own ([source](https://code.claude.com/docs/en/prompt-caching)).

Whether a job is worth sending out depends on whether its process is long and useless. Thousands of lines of logs or dozens of files are worth it. If it only reads one or two small files, doing it in the main conversation is cheaper.

### Two ways to save money

- **Give subagents a small model.** For simple jobs like searching and organizing, you can set the subagent to use Haiku in its config.
- **Do not start too many at once.** The official docs give one number: when several agents work together as a team, the usage in plan mode is about 7 times that of a normal session ([source](https://code.claude.com/docs/en/costs)).

Codex also has a similar subagent feature. The advice is the same: hand off clearly bounded jobs such as exploring, testing and troubleshooting, so the main thread can focus on the core problem.

## Don't overdo the saving

After reading this far, you may want to cut every session into small pieces and throw every job to the smallest model. Wait.

What you want to lower is the total cost of finishing one task, not the tokens used by a single message. If you only look at the latter, it is easy to lose on both sides:

- **Too little information.** You skip the background to save a few hundred tokens, it gets the work wrong, and the redo costs tens of thousands.
- **A model that is too small.** A small model keeps failing to fix it, and after three rounds it costs more than a big model getting it right once, and it also wastes your time.
- **Sessions cut too small.** If it is still the same problem, stay in the same session, because the earlier reasoning is still useful. OpenAI's wording is that one session should be one complete unit of work. What you really should avoid is putting a whole project in one session.
- **Sending everything to subagents.** For a small job, the start-up cost is higher than the job itself.

Here is a simple self-check: if you find yourself correcting it again and again, the problem is probably not that you used too many tokens. It is that you saved too much earlier.

## A checklist

You do not need to remember all five habits. I put them into a checklist by stage: before you start, while you work, and when you finish. Keep it close at hand.

**Before you start**

- Is this a new topic? If yes, open a new session
- Did you pick the model and thinking effort? If yes, do not change them midway
- Does the task description have the goal, relevant files, constraints and done criteria?
- Is the task complex? If yes, ask for a plan first

**While you work**

- Is it going off track? Interrupt and rewind right away, do not wait for it to finish
- Do you need to look through a lot of material or run a command with long output? Give it to a subagent
- Do you need to paste a log? Filter out the useful lines first
- Are you leaving for a while? Ask it to write a handover file before you go

**When you finish**

- Has the task reached a stopping point? Clear, or compact at this pause
- Take a look at `/usage`: is the cache hit rate normal, and what takes up the most?
- Did it make the same mistake twice? Write the lesson into the project notes

## How it maps to other tools

| Concept | Claude Code | Codex |
| --- | --- | --- |
| Project notes | CLAUDE.md | AGENTS.md |
| Check usage and context | `/usage`, `/context` | `/status` |
| Compact history | `/compact` | `/compact` |
| Find an old session | `/resume` | `/resume` |
| Plan before you act | Shift+Tab for plan mode | `/plan` or Shift+Tab |
| Pass long tasks between sessions | handover file | PLANS.md execution plan |

The Codex column comes from OpenAI's official best practices ([source](https://developers.openai.com/codex/learn/best-practices)).

## Final thoughts

Back to that Wednesday afternoon. Looking back now, almost every mistake that day has a match in these two posts: one session dragged from Tuesday to Wednesday, with the cache long expired after a night; an unrelated topic like deployment slipped in halfway; and when I could not read an error, I pasted in the whole log.

None of these habits is a complex trick. Most are common sense, like "open a new session when the topic changes" and "say it clearly before you start". The hard part is remembering them when you are deep in the work. I hope these two posts help you remember a bit sooner.

## Further reading

- [Manage costs effectively](https://code.claude.com/docs/en/costs): The official Claude Code cost management docs, where most of the numbers in this post come from
- [How Claude Code uses prompt caching](https://code.claude.com/docs/en/prompt-caching): The most detailed explanation of when the cache hits and when it fails
- [Codex best practices](https://developers.openai.com/codex/learn/best-practices): OpenAI's list of habits for Codex users
- [Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents): The Anthropic engineering blog, on why context is the scarcest resource for agents

This post was written in November 2026. The commands and numbers come from the official docs at that time. These tools update fast, so follow the version you have for the exact commands. The principles and habits will not change.
