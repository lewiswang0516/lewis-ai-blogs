---
title: 'AI 从入门到实战 14｜用 Agent 自动化日常工作'
description: '让 AI 在你不盯着的时候也干活：从 skill、hook、脚本到定时任务和 GitHub Actions，以及放手之前要想清楚的五个问题。'
pubDate: '2026-11-21T01:14:00Z'
---

适合已经习惯用 Claude Code 干活，想让它在你不盯着的时候也能干点事的人。前置阅读：08（MCP）、11（计划模式和给它一个检查）、12（子代理）、13（博客项目复盘）。这是系列的最后一篇。

前面十四篇，基本都是你坐在电脑前，和 AI 一来一回地干活。这篇讲另一种用法：你定好规则，它自己在固定的时间、或者某件事发生的时候开始干，干完把结果交给你。

这听起来很诱人，但我想先泼一点冷水：自动化放大的是你已经验证过的流程。一件事你自己和 AI 手动做了几次，每次都顺利，再考虑把它自动化。一件你都没做明白的事，自动化之后只会更快地做错。

## 什么样的事值得交出去

我会用四个问题筛一遍：

- **重复吗？** 一个月只做一次的事，写自动化的时间可能比手动做还多
- **“做完”说得清吗？** “检查博客里有没有失效链接，列出来”说得清；“让博客更好”说不清
- **能自己检查吗？** 有测试、有构建、有一个能对比的标准答案
- **做错了能撤回吗？** 生成一份报告、开一个 PR，做错了关掉就行；直接发布、发邮件、删数据，就要非常小心

四个都是“是”的，才是好的起点。比如：

- 每天早上把某几个仓库的新 issue 和失败的 CI 整理成一份摘要
- 每周检查一遍博客的死链和图片
- 新 PR 打开时先过一遍自动审查，把结果写成评论
- 依赖更新之后自动跑测试，挂了就尝试修复并开 PR

下面按从轻到重的顺序，讲 Claude Code 里能用的几种手段。

## 第一层：把常用的指令存成 skill

最轻的自动化，是不用每次重新打一遍同样的话。

如果你经常让它“检查一下改过的文件，跑构建，按我们的格式写提交信息”，可以把这段话写成一个 skill：在项目的 `.claude/skills/<名字>/SKILL.md` 里写清楚步骤，以后输入 `/名字` 就能调用。skill 还能附带脚本文件，适合那些“先跑这个命令、再看这个输出”的流程。

这一步还谈不上无人值守，但它把一个流程固定了下来。后面所有的自动化，本质上都是在合适的时机自动调用这样一个固定的流程。

## 第二层：hook，让规则不靠它的记性

hook 是在 Claude Code 运行过程中的固定节点自动执行的命令。常用的节点有：

| 节点 | 什么时候触发 | 典型用法 |
| --- | --- | --- |
| `PreToolUse` | 它调用工具之前 | 拦住危险操作，比如改某个目录 |
| `PostToolUse` | 它调用工具之后 | 改完文件自动格式化 |
| `Stop` | 它想结束这一轮时 | 跑检查，没通过就让它接着干 |
| `Notification` | 它需要你处理时 | 弹一个系统通知 |
| `SessionStart` | 会话开始时 | 注入一些背景信息 |

11 里提过 Stop hook，这里给一个完整的例子，来自官方最佳实践。写在 `.claude/settings.json` 里：

```json
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          { "type": "command", "command": "pnpm tsc --noEmit 1>&2 || exit 2" }
        ]
      }
    ]
  }
}
```

它每次想结束时都会跑一遍类型检查。退出码 2 表示拦住，错误输出会作为理由交还给它，它就会接着修，直到检查通过。为了防止死循环，连续拦了 8 次、中间没有任何工具调用时，Claude Code 会放行。

另一个特别实用的是 `Notification` hook。它需要你确认什么的时候，弹一个系统通知，你就不用一直盯着终端。官方 hook 入门指南的第一个例子就是这个。

hook 和 CLAUDE.md 的分工，官方说得很清楚：CLAUDE.md 是指导，AI 可以判断某条在当前情况下不适用；必须百分之百执行的规则，用 hook 或者权限里的 deny 规则。13 里我说博客的“不准读 `.env`”应该做成 deny 规则，就是这个意思。

hook 不用自己从头写。直接对它说“写一个 hook，禁止修改 migrations 目录”，写好之后用 `/hooks` 看一下配置对不对。

## 第三层：用脚本调用它

`claude -p "指令"` 会执行一次然后退出，不进入交互界面。这是把 Claude Code 放进脚本、定时任务、CI 的基础。

无人值守时，有几个参数基本是必须的：

- `--allowedTools`：事先批准它能用哪些工具
- `--permission-mode dontAsk`：任何需要询问的操作直接拒绝，不会卡在那儿等人点确认
- `--max-turns`：限制最多跑多少轮
- `--max-budget-usd`：估算花费到这个数就停
- `--output-format json`：输出一个结构化的结果，方便脚本解析

官方给的一个例子是批量迁移文件：

```bash
for file in $(cat files.txt); do
  claude --bare -p "把 $file 迁移到新的日志 API 并提交。成功回复 OK，失败回复 FAIL。" \
    --allowedTools "Read,Edit,Bash(git add *),Bash(git commit *)" \
    --permission-mode dontAsk \
    --max-turns 20
done
```

`--bare` 会跳过你本机的 hook、skill、插件、MCP 和 CLAUDE.md，让每次运行的环境干净、可预期。它也不用你的订阅登录，凭证要从 `ANTHROPIC_API_KEY` 之类的地方来。

官方还有一句建议我觉得很重要：先拿三个文件试，看看哪里出错，改好指令，再跑剩下的。

## 第四层：定时和事件触发

Claude 能把一件事做完，但它自己不会决定“现在开始”。总得有个东西去启动它：你、一个定时器，或者一个事件。Claude Code 里有三种定时的方式：

| | `/loop` | 桌面端定时任务 | 云端定时任务 |
| --- | --- | --- | --- |
| 跑在哪 | 你的电脑 | 你的电脑 | Anthropic 的云 |
| 需要电脑开着 | 要 | 要 | 不用 |
| 需要开着会话 | 要 | 不用 | 不用 |
| 能读本地文件 | 能 | 能 | 不能，每次是一份新的仓库签出 |
| 最短间隔 | 1 分钟 | 1 分钟（表单里是 1 小时） | 1 小时 |

**`/loop`** 适合在一个会话里盯着某件事，比如：

```text
/loop 15m 检查这个分支的 CI，挂了就拉下失败任务的日志，修好再推上去
```

每次执行都是同一个会话里新的一轮，所以别在一个已经很长的会话里开着它。09 讲过，每一轮都要背着全部历史。它最多跑七天就会自动过期。

**云端定时任务**（以前叫 routines）用 `/schedule` 创建，或者在 claude.ai/code/routines 网页上管理。它跑在云上，你的电脑关着也没关系。除了按时间触发，还能通过 HTTP 调用触发，或者在 GitHub 上有新 PR、新 release 时触发。目前是研究预览，需要 Pro 及以上的订阅。

官方对云端任务有一条警告值得照做：放手之前，先在 GitHub 上给 `main` 分支加一条它绕不过去的保护规则，并且新任务的前几次运行要亲自看着。

## 第五层：GitHub Actions 和 Agent SDK

如果你的代码在 GitHub 上，Claude Code 有官方的 GitHub Action。在 Claude Code 里运行 `/install-github-app`，它会帮你装好 GitHub 应用、配好密钥、生成工作流文件，然后开一个 PR 给你合并。之后在 issue 或者 PR 评论里 @claude，它就会去分析代码、改代码、推提交。也可以配成在某个事件发生时自动执行一段指令。

再往上走，如果你想把这套能力嵌进自己的程序，可以用 Agent SDK。它就是把 Claude Code 背后的工具、循环和上下文管理做成了 Python 和 TypeScript 的库。这已经是在“开发产品”了，按 Anthropic 的条款，要用 API Key，而不是订阅账号的登录。

## 放手之前的五个问题

官方最佳实践里有一节专门讲让 Claude 在没人看着的情况下运行，列了五个问题。我觉得这是这篇最值得抄下来的部分：

1. **它知道什么叫做完吗？** 一个完成条件、一份需求文档，或者一个要让它变绿的失败测试
2. **它能检查自己的工作吗？** 测试、Stop hook、某种审查步骤
3. **它能碰什么？** 权限规则、`dontAsk`、沙箱、worktree、它唯一能推送的那个分支
4. **什么能让它停下？** `--max-turns`、`--max-budget-usd`、花费上限
5. **结果交到哪儿，谁来签字？** 一个 PR、一条评论或者一份摘要，然后由人来批准合并、部署，以及任何撤不回来的操作

第五条我想多说一句。自动化里最该留给人的，是那些撤不回来的动作：合并到主分支、部署上线、对外发消息、删东西。让 AI 把一切准备好，最后按一下按钮的那个人是你。

还有一个省钱的提醒，和 09、10 一脉相承：后台的活在你不打字的时候也在花钱。`/loop`、目标检查、子代理都会持续发请求。设了定时任务之后，过几天看一眼 `/usage`，确认它花的钱和它带来的价值对得上。

## 写在系列最后

这个系列从“大模型是什么”开始，经过 token 和计费、选模型、写提示词，到上手 Claude Code、写 CLAUDE.md、接 MCP，再到省 token、计划和回退、子代理，最后是一个真实项目和这篇自动化。

回头看，几乎每一篇都绕不开同一件事：把你知道、但 AI 不知道的东西说清楚。项目的规矩写进 CLAUDE.md，任务的完成标准写进指令，做到一半的状态写进交接文档，绝对不能碰的东西写进 hook。工具会一直变，这件事不会。

## 参考

- [Best practices for Claude Code](https://code.claude.com/docs/en/best-practices)：无人值守前的五个问题、脚本示例、Stop hook 示例都出自这里
- [Automate actions with hooks](https://code.claude.com/docs/en/hooks-guide)：hook 入门和通知示例
- [Hooks reference](https://code.claude.com/docs/en/hooks)：所有 hook 节点和退出码规则
- [Extend Claude with skills](https://code.claude.com/docs/en/skills)：自定义 skill
- [Run Claude Code programmatically](https://code.claude.com/docs/en/headless)：`claude -p` 和 `--bare`
- [CLI reference](https://code.claude.com/docs/en/cli-reference)：`--max-turns`、`--max-budget-usd` 等参数
- [Run prompts on a schedule](https://code.claude.com/docs/en/scheduled-tasks)：`/loop` 以及三种定时方式的对比
- [Automate work with scheduled tasks](https://code.claude.com/docs/en/routines)：云端定时任务
- [Claude Code GitHub Actions](https://code.claude.com/docs/en/github-actions)：GitHub Action 的安装和用法
- [Legal and compliance](https://code.claude.com/docs/en/legal-and-compliance)：Agent SDK 等产品开发应使用 API Key 的说明
- [Agent SDK overview](https://code.claude.com/docs/en/agent-sdk/overview)：把 Claude Code 的能力嵌进自己的程序
- [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)：Anthropic 工程博客，讲什么时候该用 agent、什么时候用固定流程就够了

本文写于 2026 年 11 月。定时任务、Agent 团队这类功能还在快速变化，具体命令以你手上的版本为准。
