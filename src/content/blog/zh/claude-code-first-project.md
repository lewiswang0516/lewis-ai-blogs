---
title: 'AI 从入门到实战 06｜Claude Code 从安装到完成第一个小项目'
description: '从安装、登录、权限模式讲起，一步步用 Claude Code 从零做出一个能在浏览器里打开的番茄钟网页。'
pubDate: '2026-11-21T00:06:00Z'
---

这篇写给想第一次上手 Claude Code 的人，会一步步带你装好它，再用它从零做一个能在浏览器里打开的番茄钟网页。建议先读第 05 篇，知道 agent 和网页聊天的区别。

你不需要会写代码，但需要愿意打开终端，复制粘贴几行命令。如果你从来没用过终端，Claude Code 官方有一篇终端入门指南，链接放在文末。

## 开始之前

先确认三件事。

**账户。** Claude Code 需要以下任意一种：Claude 的 Pro、Max、Ultra、Team 或 Enterprise 订阅，Anthropic 控制台的 API 账户（预充值），或者通过 Amazon Bedrock、Google Cloud、Microsoft Foundry 这类云平台接入。免费版不包含 Claude Code。个人用户最简单的是 Pro，2026 年 11 月的价格是每月 20 美元。

**系统。** 官方要求 macOS 13.0 以上，Windows 10 1809 以上，或者 Ubuntu 20.04、Debian 10 以上等 Linux 发行版；内存 4 GB 以上；需要联网。

**Git（建议装）。** 不是必需的，但强烈建议装上。它能帮你记录每一次改动，AI 改坏了可以退回去。Windows 用户官方推荐装 Git for Windows，这样 Claude Code 能用 Bash 执行命令。

## 第一步：安装

打开终端，按你的系统复制对应的命令。

macOS、Linux 或 WSL：

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

Windows PowerShell：

```powershell
irm https://claude.ai/install.ps1 | iex
```

Windows CMD：

```batch
curl -fsSL https://claude.ai/install.cmd -o install.cmd && install.cmd && del install.cmd
```

怎么分 PowerShell 和 CMD？看提示符：开头是 `PS C:\` 的是 PowerShell，只有 `C:\` 的是 CMD。

安装过程中不会显示进度，等它跑完就行。用 Mac 的话也可以用 Homebrew 装：`brew install --cask claude-code`，不过 Homebrew 装的版本不会自动更新，要自己定期 `brew upgrade claude-code`。用官方安装脚本装的会在后台自动更新。

装完后，打开一个新的终端窗口，输入：

```bash
claude --version
```

能看到一个版本号，后面跟着 `(Claude Code)`，就说明装好了。

如果提示找不到 `claude` 命令，通常是安装目录还没加进 PATH，官方文档的“Fix your PATH”一节有各系统的处理方法。

## 第二步：建项目，第一次启动

先给这个小项目建一个文件夹，进去，初始化 Git：

```bash
mkdir pomodoro
cd pomodoro
git init
```

然后启动 Claude Code：

```bash
claude
```

第一次启动会让你登录。用订阅账户的话，按提示在浏览器里完成授权就行。登录信息会被保存，之后不用再登。

登录后你会看到输入框，上方显示版本、当前模型和工作目录。到这里，它就能看到 `pomodoro` 这个文件夹里的东西了，当然现在是空的。

## 第三步：了解权限模式

动手之前，先花一分钟了解权限模式，这决定了它改文件、跑命令前要不要问你。

按 `Shift+Tab` 可以随时切换模式。常用的几种：

| 模式 | 不用问你就能做的事 | 适合 |
| --- | --- | --- |
| Manual（default） | 读工作目录里的文件 | 敏感的工作、不熟悉的代码 |
| acceptEdits | 读文件、改文件、常见的文件操作 | 你在边看边改的时候 |
| plan | 只读和调查，不动手 | 动手前先出方案 |
| auto | 所有操作，后台有安全检查 | 长任务，不想频繁点确认 |

要注意，官方文档说从 v2.1.283 起，交互式终端会话默认就从 auto 模式开始，也就是它会自己执行大部分操作，由另一个模型在后台做安全检查。

第一次用，我建议切到 Manual 模式，看它每一步想干什么，批准了再执行。熟悉之后再放开。

## 第四步：先让它出方案

对于第一个项目，我们用计划模式。按 `Shift+Tab` 切到 plan，然后输入需求。

需求怎么写，回顾第 04 篇：目标、背景、限制、完成标准都写上。比如：

```text
我想做一个番茄钟网页，自己用。

要求：
- 只用一个 index.html 文件，HTML、CSS、JavaScript 都写在里面，不要依赖任何外部库，双击就能在浏览器里打开
- 默认 25 分钟专注、5 分钟休息，可以开始、暂停、重置
- 时间到了要有提示音和浏览器通知
- 界面简洁，大号数字显示剩余时间，手机上打开也能看

完成标准：我在浏览器里打开，点开始，能看到倒计时在走，暂停和重置都正常。

先给我一个实现方案，别急着写代码。
```

它会先给出一份方案：页面结构、计时逻辑怎么写、提示音怎么做。你看一下，有不满意的地方直接说，比如“休息时间我想要能自己设置”。方案定了，再让它开始写。

这一步看起来多余，但养成习惯很值。第 10 篇会讲到，方向错了在计划阶段发现，损失很小；代码写完才发现，就得推倒重来。

## 第五步：让它动手

方案确认后，切回 Manual 或 acceptEdits 模式，告诉它“按这个方案实现”。

它会创建 `index.html`，在 Manual 模式下，写文件之前会问你，选 Yes 批准就行。写完后它通常会告诉你做了什么、怎么打开。

在文件夹里双击 `index.html`，或者在终端里运行 `open index.html`（Mac）打开看看。

## 第六步：小步修改

第一版很少完美。发现问题，直接用大白话告诉它：

```text
点了暂停再点开始，时间会跳一下，修一下。
```

```text
休息时间改成可以自己设置，默认还是 5 分钟。
```

每次只提一两个修改，改完看一眼再提下一个。一次塞十个要求，它容易漏，你也不好检查。

如果它改得面目全非，别急着让它“改回去”。输入 `/rewind`，可以把对话和代码一起退回到之前的某个检查点。

## 第七步：用 Git 存档

满意了就存个档。不用记 Git 命令，直接跟它说：

```text
把现在的改动提交一下，写一个清楚的提交说明。
```

它会帮你执行 `git add` 和 `git commit`。之后每完成一个满意的版本就提交一次，以后不管 AI 怎么改，你都能回到任何一个存过档的版本。

## 第八步：收尾

还有三个命令值得在第一个项目里就试一下。

`/init`：让它分析项目，自动生成一份 CLAUDE.md，记录项目结构、怎么运行之类的信息，下次开会话时它会先读这个文件。这是第 07 篇的主题。

`/usage`：看看这次会话花了多少，订阅用户能看到占了套餐额度的多少。第一个项目做完看一眼，对“做一个小网页大概要多少用量”心里就有数了。

`/clear`：这个项目告一段落，开一个干净的新会话。要接着做别的事，就别在这个会话里继续聊了，原因第 09 篇会讲。

## 常用命令速查

| 命令 | 在哪儿用 | 作用 |
| --- | --- | --- |
| `claude` | 终端 | 启动交互模式 |
| `claude -c` | 终端 | 继续当前目录最近的一次对话 |
| `claude -r` | 终端 | 选一个以前的对话继续 |
| `/help` | Claude Code 里 | 查看可用命令 |
| `/clear` | Claude Code 里 | 开新对话，旧的可以用 `/resume` 找回 |
| `/rewind` | Claude Code 里 | 退回到之前的检查点 |
| `/exit` | Claude Code 里 | 退出，也可以连按两次 Ctrl+D |

## 下一篇预告

做完这个小项目，你可能会发现，每次开新会话都要重新交代一遍：这是什么项目、用什么技术、有什么规矩。下一篇讲 CLAUDE.md，也就是写给 AI 看的项目说明书：放在哪儿、写什么、写多长，以及为什么写得太长反而不好。

继续阅读：[AI 从入门到实战 07｜CLAUDE.md 和项目说明书怎么写](/zh/blog/claude-md/)

## 参考

- [Claude Code quickstart](https://code.claude.com/docs/en/quickstart)：官方快速上手，安装、登录、常用命令都出自这里
- [Advanced setup](https://code.claude.com/docs/en/setup)：系统要求、各种安装方式和卸载方法
- [Choose a permission mode](https://code.claude.com/docs/en/permission-modes)：权限模式说明
- [Commands](https://code.claude.com/docs/en/commands)：Claude Code 全部命令
- [Claude 订阅价格](https://claude.com/pricing)：各档订阅价格
- [Terminal guide](https://code.claude.com/docs/en/terminal-guide)：没用过终端的话，先看这篇官方入门
- [Checkpointing](https://code.claude.com/docs/en/checkpointing)：`/rewind` 和检查点的官方说明

本文写于 2026 年 11 月，命令以当时的官方文档为准。Claude Code 更新很快，界面和默认设置可能和你看到的略有不同。
