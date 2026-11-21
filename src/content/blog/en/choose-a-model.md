---
title: 'Hands-On AI 03 | How to Choose Between Claude, GPT, Gemini and Other Major Models'
description: 'Every provider sorts its models into tiers, and the same tier costs about the same. This post shows how to pick a tier by difficulty, volume and tool, adjust thinking effort first, and test with your own tasks.'
pubDate: '2026-11-21T00:03:00Z'
---

This post is for people who face a long list of model names and do not know which one to pick. I suggest you read Part 02 first, so you know how input, output and thinking are each billed.

Open the model list in any AI tool, and you see a string of confusing names. Anthropic alone lists more than twenty in the model table of its official docs, and OpenAI and Google are about the same. New ones appear every month or two.

The good news is that you do not need to understand all of them. This post does not rank who is number one. It only gives a way of thinking about how to pick a model. A way of thinking lasts longer than a list, and the list will change in a few months.

## First, one fact: every provider has tiers

The three providers name their models in very different ways, but the structure is almost the same. Each has a flagship that is the strongest and most expensive, a main model with good value, and a light model that is cheap and fast.

Below are the current line-ups from each provider's official docs in November 2026. Prices are in US dollars per million tokens, input / output:

| Tier | Anthropic | OpenAI | Google |
| --- | --- | --- | --- |
| Strongest | Claude Fable 5.2, 8 / 40 | GPT-6.2 Astra, 8 / 40 | Gemini 4 Carbon, 2 / 10 (4 / 20 from 1 December) |
| Main | Claude Opus 5.5, 4 / 20 | GPT-6.2 Sol, 2 / 10 | Gemini 4 Neon, 3 / 15 |
| Balanced | Claude Sonnet 5.5, 2 / 10 | GPT-6.1 Terra, 1 / 5 | Gemini 4 Hydrogen, 1.5 / 7.5 |
| Light | Claude Haiku 5.5, from 0.10 / 0.50 | GPT-6 Luna, 0.10 / 0.50 | Gemini 3.x Flash series |

I sorted the models into these tiers myself, roughly by price and official descriptions. It is not an official grouping, and the line between "main" and "balanced" is not that clear for each provider. Google also has Gemini 4 Argon. Google describes it as an efficient version of Carbon. At the same price, it answers faster and uses fewer tokens per turn.

The most obvious thing in this table is that, within the same tier, the three providers' prices are not far apart. The real gap is between tiers. The strongest and the lightest differ by dozens of times.

## What each provider recommends

Before you listen to others, first see what the providers themselves recommend.

Anthropic's advice is this. If you are not sure, start with Opus 5.5, which suits most tasks. Move up to Fable 5.2 for tasks that need deep reasoning or long autonomous work, or when Opus at a high effort level is still not enough. Sonnet 5.5 is the balance point between speed and ability. Haiku 5.5 suits high-volume, speed-sensitive work such as classification and information extraction.

OpenAI's advice is this. Use the flagship GPT-6.2 Astra for complex reasoning and coding. Use GPT-6.2 Sol for daily work and for running agents at large scale. Use GPT-6 Luna for high-volume tasks where cost matters.

Google positions Gemini 4 Carbon as its strongest reasoning model, for complex software engineering and research. It positions Gemini 4 Hydrogen as the fast model for daily coding and running agents. Hydrogen is also available on the free tier, while the other Gemini 4 models have no free tier.

When you put the three providers' advice together, the pattern is clear: keep the strongest tier for hard problems, and use the main or balanced tier for daily work.

## Pick by task, not by brand

My own habit is to ask three questions first.

### Is the task hard?

Difficulty decides the tier. To fix a typo, translate a paragraph, or turn meeting notes into key points, the balanced tier or even the light tier is enough. A flagship will not do much better. It will only be more expensive and slower.

The tasks that really need a flagship need many steps of reasoning, where one wrong step ruins everything. Examples are complex architecture design, stubborn bugs, and long tasks where it must work by itself for several hours.

For daily coding I use Opus, and I switch to Fable only for really hard problems.

### Is the volume large?

Some tasks repeat thousands or tens of thousands of times, such as labelling a batch of product reviews or pulling fields out of a pile of documents. For these, the unit price becomes the main issue. Try the light tier first, and do not upgrade if the results are good enough. A price gap of dozens of times, multiplied by tens of thousands of runs, is a lot of money.

### What tool are you using?

This question often makes half of the decision for you.

Claude Code uses Claude models, and Codex uses OpenAI models. In these two tools, you are really only picking a tier. Editors like Cursor can connect to models from many providers. You have more choice there, and you also need more of your own judgment.

Your subscription also affects the choice. For example, on Claude's Pro plan, Fable costs extra usage credit. Max and Ultra include Fable, and it can use up to half of the weekly quota. If you use a subscription, first check which models your plan includes.

## Thinking effort is the second dial

With today's models, you can pick a model and also adjust "how deeply it thinks".

The current Claude models all use adaptive thinking. The model decides how much to think, and you guide it with effort (thinking effort). The official default values differ: Fable 5.2 and Sonnet 5.5 default to high, while Opus 5.5 and Haiku 5.5 default to medium. In Claude Code, you change it with `/effort`. OpenAI's models also have several reasoning levels from low to max. In Codex, you pick it together with the model through `/model`.

My advice is: change the thinking effort first, then change the model. Often a main model with one level higher effort can solve the problem, and you do not need to jump to the most expensive model. The other way round, for simple work, lower the thinking effort. The output tokens you save add up, because thinking is billed at the output price.

## Do not trust leaderboards too much

Every new model comes with a pile of benchmark scores. These scores are useful as a reference, but do not use them directly to make your decision.

First, the benchmark questions are not your work. A model that scores high on maths competition problems is not always the best at writing the business code in your project.

Second, as Part 01 mentioned, OpenAI's study shows that benchmarks that only look at accuracy reward models for guessing. The model with the highest score is not always the most honest one.

A more reliable way is to build a small test yourself. Pick three to five tasks that you really do in normal work. Examples are a piece of code to change, an article to summarize, or a question you know the right answer to. Run them once on each candidate model, and compare the results, cost and speed. One hour of this is more useful than reading ten review articles.

## A few details people often miss

**Free tier data may be used for training.** Google's pricing page says it clearly: content on the Gemini free tier is used to improve its products, and content on the paid tier is not. With Claude's personal subscriptions, you can choose in the settings not to let your chats be used for training. Before you work with company code or sensitive material, check the rules for the plan you use.

**Switching models midway can cost more.** If you suddenly switch models in a very long session, the cache stops working, and the whole history is re-read at full price. Part 09 covers this in detail.

**Models get retired.** Anthropic's model table lists the earliest retirement date for every model. If you wrote a program that calls a fixed model, watch for these notices.

## My default choices

If you just want an answer you can follow directly, here is my advice:

- Daily chat, writing and organizing material: the main or balanced tier, such as Opus 5.5, Sonnet 5.5 or GPT-6.2 Sol
- Coding: start with the main tier, and move up to the flagship for hard problems
- Batch processing: try the light tier first, and upgrade if the results are not good enough
- When you are not sure: start with the default model that the provider recommends, use it for a while, then adjust based on your experience

Model names will change in a few months. But this way of thinking will not: pick the tier by difficulty, adjust thinking effort first, and test with your own tasks.

## Coming up next

Once you have picked a model, the next thing that decides the result is how you talk to it. The next post covers the basics of prompting: why some people find the same model easy to use, while others think it is stupid. Most of the difference is not about tricks. It is about whether you say clearly what you want.

Read next: [Hands-On AI 04 | Prompt Basics: How to Say Clearly What You Want](/blog/prompt-basics/)

## References

- [Models overview](https://platform.claude.com/docs/en/about-claude/models/overview): Anthropic's official model comparison, including recommended uses, default thinking effort and retirement dates
- [OpenAI Models](https://developers.openai.com/api/docs/models): OpenAI's official model list and recommendations
- [OpenAI API Pricing](https://developers.openai.com/api/docs/pricing): Prices for models such as GPT-6.1 Terra
- [Gemini models](https://ai.google.dev/gemini-api/docs/models): Google's official model list
- [Gemini Developer API pricing](https://ai.google.dev/gemini-api/docs/pricing): Google's official prices, including notes on how free tier data is used
- [Claude subscription pricing](https://claude.com/pricing): The models included in each subscription plan

This post was written in November 2026. Models change fast, so check the official pages for current models and prices when you read this.
