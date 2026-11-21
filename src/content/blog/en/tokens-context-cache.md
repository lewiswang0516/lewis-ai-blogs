---
title: 'Hands-On AI 02 | Tokens, Context and Caching: How AI Billing Works'
description: 'AI charges by the token, and every request sends the whole context again. This post explains how tokens, context, caching and subscription quotas are counted.'
pubDate: '2026-11-21T00:02:00Z'
---

This post is for people who want to understand how AI is really priced, whether you pay a monthly subscription or pay per use through the API. I suggest you read Part 01 first, so you know that a large language model "keeps adding one word after another".

When people first get a shock from an AI bill or a used-up quota, they all react the same way: "But I only asked a few questions."

The problem is the unit "a few questions". AI does not charge by the sentence or by the question. It charges by the token. And when you think you sent one sentence, it may actually process tens of thousands of tokens. This post explains it from the start.

## Tokens: the unit AI reads and writes in

A token is the smallest unit of text that a model processes. A model does not read one character or one word at a time. It first cuts the text into pieces called tokens, and then processes them.

The model's tokenizer decides how to cut the text. In English, a common word is usually one token, and a long word is split into several pieces. Chinese works differently. One Chinese character may be one token or more, and common phrases are sometimes joined into one piece.

Two points are worth knowing:

First, different models use different tokenizers, so the same text gives a different token count on different models. Anthropic's pricing docs say that Claude 4.7 and later models use a new tokenizer. The same text now uses about 30% more tokens than before.

Second, most official conversion rates are estimated for English. Anthropic says that on the current tokenizer, 1 million tokens is about 555,000 English words, or 2.5 million characters. You need to test the rate for Chinese yourself.

For daily use, you do not need an exact conversion. It is enough to remember that "tokens are the billing unit, and more text means more tokens".

## The kinds of tokens on your bill

When you pay per use, the bill for one request usually has these parts. The example below uses Anthropic's official prices from November 2026, in US dollars per million tokens:

| Model | Input | Output | Cache read | 5-minute cache write |
| --- | --- | --- | --- | --- |
| Claude Opus 5.5 | 4 | 20 | 0.20 | 5 |
| Claude Sonnet 5.5 | 2 | 10 | 0.10 | 2.50 |
| Claude Haiku 5.5 (up to 100,000 tokens) | 0.10 | 0.50 | 0.01 | 0.125 |

Let's go through them one by one.

**Input**: Everything you send to the model, not only the sentence you just typed. Later we will see what else is included.

**Output**: What the model writes back to you. As you can see, the output price is 5 times the input price. This pattern is about the same across providers. For the main models from OpenAI and Google, output is also several times more expensive than input.

**Thinking**: Most models now "think" before they answer, and this thinking is also billed as output. Google's price table says it plainly: the output price includes thinking tokens. So the higher you set the thinking level, the more you spend.

**Cache read and cache write**: These two are the key to saving money. We cover them in their own section below.

Each provider also has some extra rules. For example, Claude Haiku 5.5 requests over 100,000 tokens use a higher price. For OpenAI's GPT-6.2 series, the input price doubles when the input is over 272,000 tokens. Batch processing (the Batch API) usually costs half price with each provider, and it suits tasks where you do not need the result right away.

## Context: everything it can see this time

To understand billing, the most important idea is "context".

Context is everything the model can see in one request. It includes the system prompt, every message you sent before, every reply it gave before, the files you pasted in, and the results it got from tools. The sentence you just typed comes last.

The context window is the upper limit of what it "can see". As of November 2026, the current Claude models and the Gemini 4 series all have 1 million tokens. OpenAI's GPT-6.2 series has 1.05 million. The limit for a single output is separate. Claude and GPT-6.2 both allow 128,000 tokens.

Part 01 said that the model itself remembers nothing. You have been "chatting for a long time", and it can follow along only because the chat app packs up the whole conversation every time. It then sends it again together with your new message.

This is the answer to "But I only asked a few questions". Say a chat has already built up 50,000 tokens. Then you ask, "So what is this variable called?" That sentence may be only a dozen or so tokens, but the input for this request is over 50,000. The longer the chat, the higher the "base price" of every message.

With AI coding tools, this effect gets bigger. Every file it reads and every command it runs puts its result into the context. And it often calls many tools to do one thing. Every tool call is a new request that carries the whole history.

## Caching: the repeated part is cheaper

If every request has to send the same long history again, can we avoid paying full price every time? This is what prompt caching does.

The idea is simple. If the start of this request is exactly the same as the last one, the server can reuse the work it already did. That part is billed at a much cheaper price. Look at the table above. For Sonnet 5.5, a cache read costs 0.10 dollars, only 5% of the normal input price.

Let's do the maths. Say you send one request to Sonnet 5.5, with 50,000 input tokens and 2,000 output tokens:

- No cache: input 0.05 × 2 = 0.10 dollars, output 0.002 × 10 = 0.02 dollars, total 0.12 dollars
- The first 48,000 tokens hit the cache: cache read 0.048 × 0.10 ≈ 0.005 dollars, the 2,000 new tokens at the cache write price 0.002 × 2.50 = 0.005 dollars, output still 0.02 dollars, total about 0.03 dollars

For the same request, the difference is about four times. Long chats stay affordable only because of caching.

Caching has two limits to remember:

First, it only matches from the start. The text must be exactly the same from the first character. If you change one thing in the middle, everything from that point on must be processed again.

Second, it expires. Anthropic's cache writes come in two tiers, 5 minutes and 1 hour, and the 1-hour tier costs more to write. OpenAI's cache write price is for a 30-minute retention period. If you step away for a while and come back, the cache may be gone, and your first message is charged at full price.

Parts 09 and 10 cover which actions break the cache and how to avoid them. For now, just know that this happens.

## Subscriptions and pay-per-use are two different systems

Everything above is about pay-per-use, which is how you pay when you call the API directly. Most individual users actually use a subscription.

Take Claude as an example. The official prices in November 2026 are: Pro at 20 dollars a month (17 dollars a month if paid yearly), Max at 100 dollars a month, and Ultra at 200 dollars a month. A subscription does not charge by the token. Instead, it gives you a usage quota: one quota every 5 hours, plus a total weekly quota. Max has 5 times the weekly quota of Pro, and Ultra has 10 times. Verified accounts also have no 5-hour limit. The Free plan can also chat, but it does not include Claude Code.

OpenAI's Codex is similar. It is included in the different ChatGPT subscription plans. Plans like Plus estimate usage per 5 hours, and there may also be a weekly limit.

A subscription quota is not shown as tokens, but the logic behind it is the same. The longer the context, the bigger the model, the deeper the thinking and the fewer the cache hits, the faster the quota goes down. So the ideas in this post are just as useful for subscription users.

## How to see how much you used

If you pay per use, every provider's console has a usage page. It shows how much you spent each day, and how much went to input and output.

If you use Claude Code, two commands are very useful. `/usage` shows the cost of the current session and how much of your plan quota you used. Subscription users can also see where the quota went. `/context` shows a colored grid of what is taking up the context right now.

I suggest you go and look at your own numbers now. After you see them once, you will get a feel for "how much one message really costs".

## Summary

Here is this post in a few lines:

- Tokens are the billing unit. Output costs several times more than input, and thinking is billed as output
- Every request sends the whole context again, so the longer the chat, the more each message costs
- Caching makes a repeated start much cheaper, but it only matches from the start, and it expires
- A subscription does not charge by the token, but the quota is used up by the same logic

Once you know where the money goes, how to save it is another topic. Parts 09 and 10 use Claude Code as the example and cover five habits for saving tokens. They include when to start a new session, how to avoid breaking the cache, and when to hand work to a subagent.

## Coming up next

Now that you know how billing works, the next question is: with so many models, which one should I use? The next post puts the current tiers of Claude, GPT and Gemini side by side. It covers how to pick a model by task, and why you should not only look at leaderboards.

Read next: [Hands-On AI 03 | How to Choose Between Claude, GPT, Gemini and Other Major Models](/blog/choose-a-model/)

## References

- [Pricing](https://platform.claude.com/docs/en/about-claude/pricing): Anthropic's official API prices, including cache prices and notes on the tokenizer
- [Models overview](https://platform.claude.com/docs/en/about-claude/models/overview): Context windows and output limits for each Claude model
- [How Claude Code uses prompt caching](https://code.claude.com/docs/en/prompt-caching): The official Claude Code guide to caching
- [OpenAI API Pricing](https://developers.openai.com/api/docs/pricing): OpenAI's official prices, including long-context and cache rules
- [Gemini Developer API pricing](https://ai.google.dev/gemini-api/docs/pricing): Google's official prices
- [Claude subscription pricing](https://claude.com/pricing): Prices and quotas for Pro, Max and Ultra
- [Codex Pricing](https://developers.openai.com/codex/pricing): Codex usage in each ChatGPT subscription plan

This post was written in November 2026. Prices follow the official pages at that time. These prices change often, so check them again before you rely on them.
