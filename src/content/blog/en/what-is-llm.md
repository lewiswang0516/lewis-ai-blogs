---
title: 'Hands-On AI 01 | What Is a Large Language Model, and Why Does It Make Things Up?'
description: 'A large language model does not look things up. It writes the answer on the spot. This post shows how it learns, why it makes things up with full confidence, and how to make it do that less.'
pubDate: '2026-11-21T00:01:00Z'
---

This post is for people who are new to AI and are not yet sure what it really is. It is the first post in the series, and you need no background knowledge.

Almost everyone who has used ChatGPT or Claude has seen this. You ask a question, and the answer is clear, well organized and confident. Then you check, and it is made up.

The first time, it is confusing. It can write code, edit articles and explain quantum physics, so why does it invent a simple fact? To understand this, you first need to know what a large language model actually does.

## What it does: keep writing

What a large language model does is simple to describe. You give it some text, and it predicts the most likely next word. It writes that word, adds it to the text, and predicts the next one. It keeps adding word after word, and that becomes the answer you see.

This is how it learns. First, it practises "guess the next word" on a huge amount of text: books, web pages, code and papers. This stage is called pre-training. With enough practice, it learns the patterns of language. It also picks up a lot of knowledge along the way. To guess the word after "The capital of France is", it has to "know" that it is Paris.

Being good at continuing text is not enough to be useful. A model that has only been pre-trained is more like a text-continuing machine. If you ask it a question, it may just write three more similar questions. So there is another round of training. It teaches the model to answer in a chat style, follow instructions and refuse things it should not do. Claude, GPT and Gemini, the models we use every day, all went through both steps.

One point here is key. The knowledge it learned is not stored as separate records in a database. It is "pressed" into the model's parameters. When it answers you, it has no original text to look up or check. It can only use these parameters to produce the text that "looks most reasonable".

## It is not a search engine, and not a database

Once you understand the point above, a lot of things start to make sense.

A search engine finds a web page that already exists and gives it to you. A database looks up a stored record, and returns nothing if it cannot find one. A large language model is neither. It "writes" the answer on the spot every time. What it writes is usually correct, because it has seen enough correct content. But it has no mechanism that guarantees a source for every sentence.

So if you ask it "Does this library have a function called X?", it may write a function with a believable name and believable parameters. The only problem is that the function never existed. For the model, "writing a believable function name" and "recalling a real function name" are the same process.

There is another limit that people often miss: the knowledge cutoff date. The model's knowledge stops on the day its training data was collected. Take November 2026 as an example. Anthropic states that the reliable knowledge of its current Claude models goes up to June 2026. OpenAI's GPT-6.2 Astra goes up to 18 May 2026. The model itself does not know about events or new versions after that date, unless it uses a tool such as web search to look them up.

If you ask it about a product that came out recently and it has no web access, its answer is often a "guess" based on old information.

## Why it makes things up

In September 2025, OpenAI published a study that explains why models hallucinate. Hallucination is the formal name for "making things up with full confidence". The study explains two causes very clearly.

### First, some facts cannot be guessed from patterns

During pre-training, the model only sees "correct" text. Nobody labels each sentence as true or false. It learns the overall patterns of language.

Spelling, grammar and matching brackets follow stable patterns, and bigger models make fewer mistakes with them. But scattered facts that appear only a few times have no pattern to follow, such as "a person's birthday" or "the title of a little-known paper". OpenAI gives a comparison. If you label millions of pet photos as "cat" or "dog", an algorithm can learn to tell them apart. But if you label each pet photo with the pet's birthday, any algorithm will make mistakes, because birthdays are random.

So the more obscure, specific and pattern-free a fact is, the more likely the model is to invent it: names, dates, sources, version numbers, and the exact parameters of an API.

### Second, training and tests both reward guessing

The second cause is more interesting. Most evaluations only look at accuracy. A right answer gets a point. A wrong answer and no answer both get zero.

It is like a multiple-choice test. If you leave a question blank, you surely get no points. If you guess, you might get it right. OpenAI's example goes like this. You ask the model for someone's birthday, and it does not know. If it guesses "10 September", it has a one-in-365 chance of being right. If it honestly says "I don't know", it surely gets zero. Over thousands of questions, the model that likes to guess looks better on the leaderboard.

They gave a set of numbers (from the GPT-5 system card, on the SimpleQA test):

| Metric | gpt-5-thinking-mini | o4-mini |
| --- | --- | --- |
| Abstention rate | 52% | 1% |
| Accuracy | 22% | 24% |
| Error rate | 26% | 75% |

If you only look at accuracy, the older model o4-mini is slightly higher. But it almost never says "I don't know", and its error rate is as high as 75%. The newer model chooses not to answer half of the questions. Its accuracy is about the same, but it makes far fewer mistakes.

One line in the study's conclusion is, I think, the most worth remembering. Hallucinations are not unavoidable, because a model can choose not to answer when it is unsure. The problem is that it must be trained to be willing to do that.

## When to be extra careful

Put the two causes together, and you get a rough list of high-risk situations:

- Asking about obscure, specific facts: names, dates, numbers, papers, legal clauses
- Asking about things after its knowledge cutoff date
- Asking it for sources or links when it has no web access
- Asking how to use a specific library or piece of software, especially one that is not popular, or one that changed versions recently
- Putting a false premise in your question, such as "Why is function X so slow?" when function X does not exist

On the other hand, the error rate is much lower when you ask it to explain a well-known concept, rewrite text you give it, or summarize material you provide. In those cases, the basis for the answer is right in front of it, or a lot of correct material supports it.

## How to make it make things up less

Anthropic's official docs have a page about reducing hallucinations. Here are a few tips that ordinary users can also use:

**Let it say "I don't know".** Add one line to your question: "If you are not sure, or the information is not enough, just say you don't know." The official docs say this alone can greatly reduce false information. The reason was explained above. By default, it tends to give an answer, so you need to tell it clearly that not answering is fine.

**Give it the original text.** Instead of asking "What does document X say?", paste the document in and ask it to answer only from what you gave it. If the document is long, first ask it to pull out the relevant passages word for word. Then ask it to answer based on those quotes.

**Ask for sources, then check them.** Ask it to give the basis for each key claim, then pick the important ones and check them yourself. The official docs also suggest asking it to check its own work. For each claim, it should find a supporting quote from the source, and delete the claim if it cannot.

**Ask the same question a few times.** Ask the same question two or three more times. If the answer is different every time, it is most likely guessing.

**Ask it to look first.** With AI coding tools, you can tell it: "Do not draw conclusions about code you have not opened. Read the file before you answer." With tools that can go online, ask it to search the official docs before it answers.

The last one is not a trick. It is an attitude: check the important things yourself. The official docs also say that these methods can greatly reduce hallucinations, but cannot remove them fully. For money, health, law and code that goes to production, treat the AI's answer as a draft, not a conclusion.

## So is it smart or not?

At this point, you may feel that large language models are not very reliable. That is not true.

It is already very useful for most tasks. Writing code, editing articles, organizing material and explaining concepts all save a lot of time. But its "smartness" is not quite the same as human smartness. It has no clear line between "I am sure" and "I am guessing", and it uses the same tone in both cases.

Once you know this, you can use it with more confidence. You know which work you can safely hand to it, and which answers need a second look.

## Coming up next

This post covered how a large language model "thinks". The next post covers how it "charges": what a token is, what a context window is, why the same question costs more in a long chat, and how caching saves you money. Once you understand these ideas, you can work out most of the later posts on tools and saving money by yourself.

Read next: [Hands-On AI 02 | Tokens, Context and Caching: How AI Billing Works](/blog/tokens-context-cache/)

## References

- [Why language models hallucinate](https://openai.com/index/why-language-models-hallucinate/): OpenAI's explanation of its study on why hallucinations happen. The birthday example and the SimpleQA numbers come from here
- [Reduce hallucinations](https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-hallucinations): Anthropic's official guide to reducing hallucinations
- [Models overview](https://platform.claude.com/docs/en/about-claude/models/overview): Knowledge cutoff dates for each Claude model
- [GPT-6.2 Astra](https://developers.openai.com/api/docs/models/gpt-6.2-astra): OpenAI's model page, including the knowledge cutoff date

This post was written in November 2026. Model names and dates follow the official docs at that time.
