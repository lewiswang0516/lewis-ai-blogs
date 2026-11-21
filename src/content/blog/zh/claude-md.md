---
title: 'AI 从入门到实战 07｜CLAUDE.md 和项目说明书怎么写'
description: 'Claude Code 每次开会话都从白纸开始。CLAUDE.md 把每次都要交代的话写进一个文件：放在哪儿、写什么、怎么写，以及 AGENTS.md 和 auto memory。'
pubDate: '2026-11-21T00:07:00Z'
---

这篇写给已经用 AI 编程工具做过一两个项目、开始觉得“每次都要重新交代一遍”很烦的人。建议先读第 06 篇，最好已经跑过一次 `/init`。

每次开新会话，Claude Code 都是从一张白纸开始的。它不记得你上次说过“这个项目用 pnpm 不用 npm”，不记得你纠正过它“测试文件放在 tests 目录”，也不记得哪个目录千万别碰。

于是你会发现自己在不同的会话里，一遍遍打着同样的话。

CLAUDE.md 就是解决这个问题的：把这些每次都要说的话写进一个文件，它每次开会话都先读一遍。

## 它是什么

CLAUDE.md 是一个普通的 Markdown 文件，用大白话写，没有特殊语法。Claude Code 在每个会话开始时读它，把内容当作背景信息放进上下文。

这里有个容易误会的地方，官方文档专门强调了：CLAUDE.md 是上下文，不是强制配置。它更像你写给新同事的一份交接说明，同事会尽量照做，但不保证百分之百。写得越具体、越简洁，它遵守得越稳定。

如果某件事必须杜绝，比如绝不能删某个目录，那应该用 hook（钩子）在执行前拦截，而不是只在 CLAUDE.md 里写一句“不要删”。

## 放在哪儿

CLAUDE.md 可以放在好几个位置，作用范围不同。最常用的是这三个：

| 位置 | 作用范围 | 适合写什么 |
| --- | --- | --- |
| `~/.claude/CLAUDE.md` | 你自己的所有项目 | 个人习惯，比如“回答用中文”“代码注释用英文” |
| 项目根目录的 `CLAUDE.md` 或 `.claude/CLAUDE.md` | 这个项目，通过 Git 和团队共享 | 项目结构、构建命令、代码规范 |
| 项目根目录的 `CLAUDE.local.md` | 只有你，只在这个项目 | 你本地的测试地址、个人偏好，记得加进 `.gitignore` |

另外，公司还可以在系统目录放一份统一的规定，管理所有员工的 Claude Code，个人用户一般用不到。

这几个文件不是互相覆盖，而是拼在一起读。顺序是从范围大到范围小：先读个人的，再读项目的，同一目录下 `CLAUDE.local.md` 排在 `CLAUDE.md` 后面。越靠后读到的，越接近你当前的工作。

还有一个细节：启动时，Claude Code 会读当前目录以及所有上级目录里的 CLAUDE.md；子目录里的 CLAUDE.md 不会一开始就读，等它碰到那个子目录里的文件时才加载。

## 从 /init 开始

最省事的起点是第 06 篇提到的 `/init`。在项目里运行它，Claude 会分析代码，自动生成一份 CLAUDE.md，写上它找到的构建命令、测试方法和项目约定。如果已经有 CLAUDE.md，它会给出改进建议，而不是直接覆盖。

如果项目里已经有给 Codex 或 Gemini CLI 用的配置，`/init` 还会问你要不要导入过来。

但 `/init` 生成的只是初稿。它能写出从代码里看得出来的东西，看不出来的，比如“这个接口是给老客户端用的，不能改”，得你自己补。

## 写什么

官方给了一个很实用的判断标准：凡是你本来要反复解释的东西，就写进去。具体来说，出现下面几种情况时就该加一条：

- 它第二次犯同一个错误
- 代码审查时发现了一个它本该知道的问题
- 你发现自己又打了一遍上次会话里打过的纠正
- 一个新同事来了，也需要知道这件事才能上手

写的内容应该是每个会话都用得上的事实：构建和测试命令、代码规范、目录结构、“总是要做 X”这类规矩。

反过来，只在特定时候用得上的长流程，比如怎么发版、怎么做数据库迁移，不要塞进来。这些更适合做成 skill（按需加载的技能），或者用下面会讲的按路径加载的规则。

## 怎么写

### 写成能检查的句子

官方的对比例子很直观：

- 写“用 2 个空格缩进”，而不是“代码格式要规范”
- 写“提交前运行 `npm test`”，而不是“记得测试”
- 写“API 处理函数放在 `src/api/handlers/`”，而不是“文件要组织好”

模糊的要求，它只能猜你的标准；具体的要求，它照做就行，你也能一眼看出它有没有做到。

### 控制在 200 行以内

官方建议每个 CLAUDE.md 控制在 200 行以内。原因有两个：一是它每个会话都要加载，第 02 篇讲过，上下文里每多一样东西，之后每一轮都要为它付钱；二是写得越长，它遵守得越差，重要的规矩会被淹没在大段文字里。

### 用标题和列表组织

相关的规矩放在同一个标题下，用列表写。官方说结构清楚的内容比大段文字更容易被遵守。

### 定期清理矛盾

两条规矩互相矛盾时，它可能随便挑一条执行。项目做久了，CLAUDE.md 难免积累过时的内容。新版本的 Claude Code 提供了 `/doctor prompt-audit`，会帮你检查说明书里过时、矛盾或者引用了不存在文件的地方，给出修改建议，你同意之后才会改。这个命令需要 v2.1.283 或更新的版本。

## 一个例子

拿第 06 篇的番茄钟项目举例，一份够用的 CLAUDE.md 大概是这样：

```markdown
# 番茄钟

单文件网页应用，自用。

## 结构
- 所有代码都在 index.html 里，不拆分文件
- 不引入任何外部库或 CDN

## 规矩
- 改完后在浏览器里打开 index.html 验证，确认倒计时、暂停、重置正常
- 界面文字用中文
- 每完成一个功能就提交一次，提交说明用中文

## 注意
- 浏览器通知需要用户授权，授权被拒时要降级为页面内提示，不能报错
```

不到 20 行，但新会话一开始就知道这个项目的边界在哪儿。

## 几个进阶用法

### 引用其他文件

CLAUDE.md 里可以用 `@路径` 引用别的文件，比如 `@README` 或 `@docs/git-instructions.md`，被引用的文件会和 CLAUDE.md 一起加载。引用可以嵌套，最多四层。

注意，引用只是方便整理，不省上下文。被引用的文件照样全部加载进来。

### 按路径加载的规则

项目大了，可以把规矩拆到 `.claude/rules/` 目录下，一个主题一个文件。更有用的是，规则可以限定只在处理特定文件时加载：

```markdown
---
paths:
  - "src/api/**/*.ts"
---

# API 规范
- 所有接口都要做输入校验
- 错误统一用标准格式返回
```

这样写前端的时候，API 的规矩就不会占地方。

### 写给人看的注释

CLAUDE.md 里用 HTML 注释 `<!-- -->` 写的内容，在发给模型之前会被去掉。想给维护这份文件的同事留个说明，又不想占 token，就用注释。

### 改了之后什么时候生效

会话进行中改 CLAUDE.md，改动不会马上生效。根目录的 CLAUDE.md 会在 `/compact` 之后重新从磁盘读取，或者等你 `/clear`、重启开新会话。如果你刚改完说明书，它好像“不听话”，多半是还没读到新版本。

## 别的工具怎么办：AGENTS.md

CLAUDE.md 是 Claude Code 专用的。其他工具有自己的约定，现在最通用的是 AGENTS.md。它最早由 OpenAI 推出，2025 年 12 月和 MCP 一起成为 Linux 基金会旗下 Agentic AI Foundation 的创始项目。

几个工具对它的支持：

- **Codex**：读 AGENTS.md，从全局目录 `~/.codex` 开始，再从项目根目录一路读到当前目录，合并后默认上限 32 KiB，超出的部分不读
- **Cursor**：支持 AGENTS.md，也支持自家的 `.cursor/rules`，子目录里的 AGENTS.md 也会生效
- **Claude Code**：项目里只有 AGENTS.md、没有 CLAUDE.md 时，直接读 AGENTS.md；两个都有时，默认只读 CLAUDE.md

所以如果一个项目要给几个工具用，比较省事的做法是：主要内容写在 AGENTS.md 里，CLAUDE.md 只写一行 `@AGENTS.md` 引用它，再补上 Claude Code 专用的内容。一份说明书，几个工具共用。

## 还有一种记忆：auto memory

最后提一下 Claude Code 的自动记忆。和 CLAUDE.md 不同，它是 Claude 自己写的：根据你的纠正和偏好，自动记下一些笔记，存在 MEMORY.md 里，开启后每个会话加载前 200 行或 25KB。用 `/memory` 可以查看和开关。

两者的分工是：你想规定它怎么做，写 CLAUDE.md；你懒得写，让它自己从你的纠正里学，靠 auto memory。我的建议是重要的规矩还是自己写进 CLAUDE.md，自动记忆当补充。

## 下一篇预告

CLAUDE.md 解决的是让 AI 了解你的项目。但它的视野仍然局限在你电脑上的文件里：看不到你的日历、你的数据库、你在 Notion 里写的需求文档。下一篇讲 MCP，一个让 AI 接上外部工具和数据的开放标准，也是第二阶段的最后一篇。

继续阅读：[AI 从入门到实战 08｜MCP 是什么，怎么给 AI 接上外部工具](/zh/blog/mcp/)

## 参考

- [How Claude remembers your project](https://code.claude.com/docs/en/memory)：CLAUDE.md、rules、AGENTS.md 和 auto memory 的官方说明，本文大部分内容出自这里
- [Commands](https://code.claude.com/docs/en/commands)：`/init`、`/memory` 等命令说明
- [Custom instructions with AGENTS.md](https://developers.openai.com/codex/guides/agents-md)：Codex 如何读取 AGENTS.md
- [Cursor Rules](https://cursor.com/docs/rules)：Cursor 的规则和 AGENTS.md 支持
- [AGENTS.md](https://agents.md)：AGENTS.md 官方网站
- [Linux Foundation 成立 Agentic AI Foundation](https://www.linuxfoundation.org/press/linux-foundation-announces-the-formation-of-the-agentic-ai-foundation)：AGENTS.md 和 MCP 加入基金会的公告

本文写于 2026 年 11 月，以当时的官方文档为准。
