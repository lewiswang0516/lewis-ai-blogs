---
title: 'AI 从入门到实战 05｜从网页聊天到 AI 编程工具：Claude Code、Codex、Cursor 有什么区别'
description: 'agent 能自己读文件、改代码、跑命令，不用你来回复制粘贴。这篇对比 Claude Code、Codex、Cursor 的形态、模型和收费，再讲怎么选。'
pubDate: '2026-11-21T00:05:00Z'
---

这篇写给已经习惯在网页上和 AI 聊天、想试试 AI 编程工具，但不知道从哪个下手的人。建议先读第 02 篇，后面会用到“上下文”这个概念。

很多人用 AI 写代码的方式是这样的：在网页上描述需求，AI 给出一段代码，复制到编辑器里，跑一下，报错了，把报错复制回网页，AI 再改，再复制回去。

这个流程能用，但你会发现自己成了一个人肉搬运工。AI 看不到你的项目，不知道其他文件里写了什么，也没法自己跑一下验证。每一轮你都得手动把它需要的信息喂给它。

AI 编程工具要解决的就是这个问题。

## 聊天和 agent，差在哪儿

网页聊天里的 AI 只能做一件事：读你发的文字，回一段文字。

Claude Code、Codex、Cursor 这类工具里的 AI，通常被叫做 agent（智能体）。区别在于它手里有工具：能读你项目里的文件，能改文件，能在终端里跑命令，能搜索代码。你给它一个任务，它会自己决定先看哪些文件、改哪里、跑什么命令验证，看到结果不对再接着改，直到做完或者需要问你。

拿修一个 bug 来比：

- 网页聊天：你贴报错，它猜原因，给代码，你复制粘贴，跑，再贴新的报错
- agent：你说“登录页输错密码后白屏，修一下”，它自己找到相关代码，读懂逻辑，改掉问题，跑测试确认，然后告诉你改了什么

省下的不只是复制粘贴的时间。它能看到整个项目，判断往往也更准。

代价是什么？第 02 篇讲过，它读的每个文件、跑的每条命令的输出，都会进入上下文。所以 agent 比聊天更费 token，这也是第 09、10 篇要专门讲省 token 的原因。另外，它能改文件、能跑命令，也就意味着它可能改错、跑错，所以这类工具都有权限设置，下一篇会讲。

## 三个工具，三种形态

Claude Code、Codex、Cursor 都能干上面说的事，核心能力越来越接近。真正的区别在于：谁家做的，能用哪些模型，主要在哪儿用，怎么收费。

先放一张表，信息来自 2026 年 11 月各家官方文档：

| | Claude Code | Codex | Cursor |
| --- | --- | --- | --- |
| 出品方 | Anthropic | OpenAI | Cursor |
| 模型 | Claude 系列 | OpenAI 的 GPT 系列 | 多家可选：Claude、GPT、Grok、Kimi 等 |
| 主要形态 | 终端命令行，另有 VS Code 和 JetBrains 插件、桌面应用、网页版 | 终端命令行、IDE 插件、ChatGPT 桌面应用、网页版云端任务 | 独立的编辑器应用 |
| 项目说明书 | CLAUDE.md（也能读 AGENTS.md） | AGENTS.md | `.cursor/rules` 或 AGENTS.md |
| 怎么付费 | Claude 订阅（Pro 起）或 API | 包含在 ChatGPT 订阅里，或用 API key | 自己的订阅，第三方模型另按用量计费 |

下面分开说。

### Claude Code

Anthropic 自家的工具，最早是一个在终端里运行的命令行程序，现在也有 VS Code 和 JetBrains 插件、独立的桌面应用和网页版。官方文档说，这些入口背后是同一个引擎，项目里的 CLAUDE.md、设置和 MCP 配置在各个入口通用。

只能用 Claude 系列模型。需要 Claude 的付费订阅（Pro、Max、Ultra、Team 或 Enterprise），或者 Anthropic 控制台的 API 账户，免费版不包含。

它的特点是命令行用起来很顺：除了交互式聊天，还能用 `claude -p "任务"` 一次性执行，接到脚本、CI 里自动跑。习惯终端的人会很喜欢。

### Codex

OpenAI 的对应产品。形态和 Claude Code 很像，也有命令行版，安装后在项目目录里运行 `codex` 就能开始，内置 `/init`、`/model`、`/review` 这些命令。另外它和 ChatGPT 结合得很紧：ChatGPT 桌面应用里可以直接切到 Codex，网页版还能把任务交给云端跑。

Codex 包含在 ChatGPT 的订阅里，从 Free、Go 到 Plus、Pro 都能用，只是可用的模型和用量不同。比如 Free 和 Go 只能在桌面应用里用 GPT-6 Luna，Plus 起才有命令行和 IDE 插件。如果你已经在付 ChatGPT 的钱，Codex 就是零额外成本的选择。

### Cursor

Cursor 走的是另一条路：它本身就是一个代码编辑器，AI 内置在里面。你在编辑器里打开项目，按 Cmd+I 打开 Agent 面板下任务，它改的每一处都会以 diff 的形式显示在编辑器里，看得清清楚楚。

它最大的特点是模型多。官方模型列表里有 Anthropic、OpenAI 的模型，也有 Cursor 和 SpaceXAI 联合训练的 Grok 系列，还有 Kimi、Meta 等家的模型。

收费方式在 2026 年变化挺大。按官网 11 月的价格页，Cursor 的订阅现在和 X 的会员合在一起：免费版有少量额度；Plus 每月 8 美元，只能用 Grok 模型；Premium 每月 30 美元，可以按 API 原价使用第三方模型，这部分用量单独计费。所以想在 Cursor 里用 Claude 或 GPT，订阅费之外还要另算。

## 怎么选

三个工具的能力差距没有大到非选某一个不可，我的建议是看你现在的情况。

**看你已经在付哪家的钱。** 有 Claude 订阅，就用 Claude Code；有 ChatGPT Plus 或 Pro，就用 Codex。先把已经付过钱的用起来，用顺了再考虑别的。

**看你习不习惯终端。** Claude Code 和 Codex 的命令行版功能最全，但要在终端里操作。如果你平时很少碰终端，看到黑框框就紧张，Cursor 这种编辑器形态上手更平滑。不过 Claude Code 也有桌面应用和 VS Code 插件，不一定要用终端。

**看你想不想换模型。** 想在同一个工具里对比不同家的模型，Cursor 最方便。只用一家的模型，那就用那家自己的工具，通常新功能也最先在自家工具上出现。

这几个工具也不是互斥的。Claude Code 的官方文档里，就专门给了在 Cursor 里安装 Claude Code 插件的入口。项目说明书方面，AGENTS.md 已经成了一个通用格式，Codex、Cursor 都直接读它，Claude Code 在没有 CLAUDE.md 的项目里也会读它，所以一个项目同时给几个工具用，并不麻烦。第 07 篇会细讲。

## 新手最常见的三个误会

**以为 AI 编程工具是给程序员用的。** 其实不完全是。它们能做的不只是写代码，整理一个文件夹里的文档、批量改文件名、把一堆表格合并，这类活也能交给它。只要你的工作和电脑上的文件打交道，就用得上。

**以为它什么都能自己搞定。** agent 确实能自己干很多事，但需求说不清楚，它照样会走错方向。第 04 篇讲的把话说清楚，在这里更重要，因为它走错一步，可能已经改了十几个文件。

**以为越自动越好。** 这些工具都能设置成不经确认就直接改文件、跑命令。刚开始用，建议把审批打开，看它每一步在干什么，熟悉了再逐步放权。

## 下一篇预告

道理讲完了，下一篇动手。以 Claude Code 为例，从安装、登录，到用它从零做出一个能在浏览器里打开的小网页，每一步的命令都写出来，照着做就行。

继续阅读：[AI 从入门到实战 06｜Claude Code 从安装到完成第一个小项目](/zh/blog/claude-code-first-project/)

## 参考

- [Claude Code overview](https://code.claude.com/docs/en/overview)：Claude Code 官方介绍，含各个入口和在 Cursor 里安装插件的说明
- [Claude Code quickstart](https://code.claude.com/docs/en/quickstart)：需要哪些订阅或账户
- [Codex CLI](https://developers.openai.com/codex/cli)：Codex 命令行版的安装和功能
- [Codex Pricing](https://developers.openai.com/codex/pricing)：Codex 在各档 ChatGPT 订阅里的可用范围
- [Cursor Documentation](https://cursor.com/docs)：Cursor 官方文档和模型列表
- [Cursor Quickstart](https://cursor.com/docs/get-started/quickstart)：Cursor 的安装和 Agent 用法
- [Cursor Pricing](https://cursor.com/pricing)：Cursor 当前的订阅方案

本文写于 2026 年 11 月。这几个工具更新极快，具体功能和价格以你阅读时的官方文档为准。
