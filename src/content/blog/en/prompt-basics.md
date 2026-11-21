---
title: 'Hands-On AI 04 | Prompt Basics: How to Say Clearly What You Want'
description: 'When AI gives the wrong answer, the cause is usually an unclear request. This post covers a few principles that the official docs repeat: state the result, the background, the limits and the finish line, give examples, and keep material apart from instructions.'
pubDate: '2026-11-21T00:04:00Z'
---

This post is for people who think AI is "not very smart" and often answers the wrong question. Read Part 01 first, so you know that the model continues from the text you give it.

Two people can use the same model. One gets great results, and the other thinks it is dumb. From what I have seen, the difference is rarely an advanced trick. Most of the time, it comes from a very simple thing: did you say clearly what you want?

There are many prompt "magic spells" online, like "You are a senior expert" or "Take a deep breath and think step by step". This post does not teach spells. It covers only a few principles that the official docs repeat again and again, and that anyone can use right away.

## Treat it like a smart new colleague

Anthropic's prompting guide has an idea I really like: treat Claude as a very smart employee who just joined the company. They are very capable, but they do not know your habits, your project, or the unwritten rules in your head. The more exactly you explain, the better they do.

The guide also gives a test. Show your prompt to a colleague who knows nothing about the task, and ask them to follow it. If they are confused, the AI will be too.

With this test, the problem with our everyday questions becomes clear. For example:

> Write me a leave email.

A new colleague who gets this sentence would need to ask at least five questions. How many days? What reason? Who is it for? How formal? Chinese or English? The AI does not ask. It guesses an answer for you. If the guess is wrong, you fix it, and you go back and forth for a few rounds.

Try it another way:

> Write a leave email to my direct manager. I want two days off next Wednesday and Thursday for a family matter, no need for details. The tone should be polite but not too formal, because we usually talk casually. I will hand in my weekly report before Tuesday, so mention that in the email. Write it in Chinese, under 200 characters.

You write a few dozen more words, and you get a usable version in one go.

## The things you need to make clear

Different tasks need different details, but most of them fall into these few items.

### What result you want

Not just "write an email", but how far to take it: how long, what format, and who will read it. The official guide says that if you want it to do more than the literal request, you need to say so clearly. Do not expect it to guess from vague words.

For example, "build a data dashboard" and "build a data dashboard, add as many related charts and interactions as you can, make it a complete working version, not just a basic frame" will give you very different things.

### Background and reasons

This one is the easiest to miss. Many people only give orders and never say why.

The official guide gives an example. Instead of writing "never use ellipses", write "your answer will be read aloud by text-to-speech software, so do not use ellipses, because the software does not know how to read them". With the second version, the model does not just follow the rule. It can also apply the idea to other cases, for example by avoiding other symbols that are hard to read aloud.

Daily use is the same. "Make this paragraph shorter" is weaker than "This paragraph will go on X. Cut it to under 140 characters, keep the data, and remove the polite filler." Once it knows where the text will be used, it knows what to cut.

### Limits and boundaries

What must not change, and what rules it must follow. For example, when you edit a resume, say "do not make up experience I do not have". When you change code, say "do not change the existing interfaces".

Here is a small tip that the official guide also mentions: tell it what to do, not what not to do. Instead of "do not use Markdown in your answer", say "write in flowing paragraphs". A positive description gives it a clear target. A negative rule only tells it which road is closed.

### What counts as done

For more complex tasks especially, tell it when the task is finished. For code, it can be "all tests pass". For an article, it can be "after reading, the reader knows what to do next". With a clear standard, it can check its own work instead of handing it in as soon as it stops writing.

OpenAI has a similar list of four elements for Codex users: the goal, the relevant context, the constraints, and the done criteria. Part 10 uses it again when it talks about avoiding wasted work.

## Examples work better than descriptions

Some requirements are hard to put into words, like the tone, format or style you want. In these cases, giving examples works best.

The official guide says examples are one of the most reliable ways to control the format, tone and structure of the output, and suggests giving 3 to 5. The examples should be close to your real use case, and they should differ from each other a bit. If not, it may learn things you did not mean to teach. For example, if every example happens to have three paragraphs, it may think it must always write three paragraphs.

Say you want it to write posts in your style. Instead of describing "short, casual, a bit funny", paste three to five posts you wrote and liked, and say "write in this style".

## With a lot of content, mark what is what

When your prompt has instructions, material and examples together, it is best to separate them with clear markers. Claude's official advice is to use XML tags, for example:

```text
Based on the meeting notes below, list the action items. For each one, state the owner and the due date.

<meeting_notes>
(paste the meeting notes)
</meeting_notes>

<format_example>
- [Alex] Submit the budget sheet by Friday
</format_example>
```

The tag names do not matter. What matters is that they stay consistent and the meaning is clear. This way, it will not mistake a sentence in the meeting notes for an instruction from you.

When the material is long, there is one more small detail: put the long material first, and the question and instructions at the end. In Anthropic's tests, putting the question at the end improved answer quality by up to 30%, especially when several documents were given at once.

## Let it say "I don't know"

Part 01 covered this, but I mention it again here because it is so useful. Add one sentence to your question: "If the information is not enough or you are not sure, just say so."

By default, the model tends to give an answer. If you do not give it this way out, it will make one up.

## Let it ask you first

There is also a reverse use. When you are not sure what you want yourself, do not force out a vague prompt. Just let it ask you first.

> I want to build a personal blog, but I have not decided what technology to use. Do not give me a plan yet. Ask me a few questions to understand my needs first.

It will ask about your budget, your technical level, whether you want to run your own server, and so on. After you answer these questions, you will also be clearer about what you want, and the plan that follows will fit better.

## If the first try is not good, fix the prompt, do not patch it

Last, a habit.

Many people are not happy with the first answer, so they add more messages: "No, make it shorter." "A bit more formal." "Drop that number from before." After a few rounds, the chat is full of change requests that fight each other.

If the result is far off, it is better to go back to the start, add these requirements to the original prompt, and ask again. The result is cleaner. Also, as Part 02 explained, the longer the chat, the more each round costs. You can also save the improved prompt and use it again next time.

## Do roles help?

To finish, a common question: does it help to start with "You are a senior XX"?

It helps, but not as much as people say. Anthropic's docs say that setting a role in the system prompt, even in one sentence, can make the answer's direction and tone more focused. But it cannot replace the points above. A "senior lawyer" who gets a vague question can still only guess. A role is a nice extra. Saying clearly what you want is the foundation.

## Next up

The first four posts covered the basic skills for chatting with AI. From the next post, we move to the second stage: from web chat to AI coding tools. What is the difference between Claude Code, Codex and Cursor, and how are they different from chatting on a web page? The next post explains it all.

Read next: [Hands-On AI 05 | From Web Chat to AI Coding Tools: How Claude Code, Codex and Cursor Differ](/blog/chat-vs-coding-agents/)

## References

- [Prompting best practices](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices): Anthropic's official prompting guide. The new employee idea, giving examples, XML tags, and putting long documents first all come from here
- [Reduce hallucinations](https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-hallucinations): the official advice on letting the model say "I don't know"
- [Codex best practices](https://developers.openai.com/codex/learn/best-practices): OpenAI's four elements of a task description

Written in November 2026.
