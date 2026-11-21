---
title: 'AI 从入门到实战 13｜用 AI 从零做一个完整项目：我的博客复盘'
description: '你正在看的这个博客，就是用 AI 从零做出来的。这篇按提交记录复盘：怎么选型、定规矩、部署、做双语、改版，哪些做对了，哪些可以更好。'
pubDate: '2026-11-21T01:13:00Z'
---

适合想用 AI 独立做完一个能上线的项目、但不知道从哪儿下手的人。前置阅读：06（Claude Code 第一个项目）、07（CLAUDE.md）、09 到 12。这篇会把前面讲过的东西放进一个真实项目里看。

你现在看的这个博客，就是这篇的项目。地址是 blogs.lewiswang.com.au，代码公开在 GitHub 上：lewiswang0516/lewis-ai-blogs。

它不是什么复杂的系统，一个静态博客，中英双语，部署在 Cloudflare 上。选它来复盘，正是因为它够小、够完整：从一个空目录到有域名、有文章、有两种语言、换过一次皮，每一步都留在 git 记录里，你可以对着仓库看。

## 先看时间线

下面是 git 记录里的几个节点，时间是墨尔本时间。

| 时间 | 提交 | 做了什么 |
| --- | --- | --- |
| 11 月 18 日 12:24 | Set up Astro blog with Cloudflare Workers deploy | 用 Astro 博客模板起项目，配好部署 |
| 11 月 21 日 14:15 | Add two-part post on saving tokens with Claude Code | 发第一组文章，也就是 09、10 |
| 11 月 21 日 14:18 | Serve the blog on blogs.lewiswang.com.au | 绑自定义域名 |
| 11 月 21 日 14:36 | Add English/Chinese i18n and a real homepage | 双语和首页 |
| 11 月 21 日 15:08 | Restyle the blog to match piggyway.com.au | 改版 |

光看提交时间：11 月 18 日中午起项目、配好部署；11 月 21 日从提交第一组文章（14:15）到改版合并（15:09），也不到一个小时。当然，提交时间只记录了结果，不包括之前的准备和中间的来回。

这个速度不是因为 AI 多神，而是因为项目小、技术选型成熟、每一步的目标都很具体。下面一步一步说。

## 第一步：选型，选最无聊的那个

技术选型我只有一个原则：选 AI 最熟、资料最多、出了问题最好查的。

Astro 有官方的博客模板，一条命令就能起一个带 RSS、站点地图、Markdown 支持的博客。仓库里的 README 到现在还是模板自带的那份，说明起点就是官方模板，没有任何花活。

部署选了 Cloudflare Workers 的静态资源托管。博客构建出来就是一堆 HTML、CSS 和图片，Workers 直接把 `dist` 目录当静态资源发出去，不需要服务器。

对新手我想多说一句：做第一个完整项目时，别同时学一门新框架、一个新部署平台、一种新数据库。AI 能帮你写代码，但出问题时你得能看懂它在干什么。选型越常见，AI 犯错的概率越低，你查资料也越容易。

## 第二步：先定规矩，再写代码

起完项目，我没有马上让它写功能，而是先把几件“以后每次都要遵守”的事定下来：

- 怎么构建、怎么本地预览、怎么部署，各只有一条命令
- 密钥只放在环境变量里，不写进任何会提交到 git 的文件，也不在终端里打印出来
- 每次改完都要能构建通过，改动大的地方留一份交接文档

这些在 07 里讲过，属于 AI 从代码里看不出来、但做错了代价不小的东西。早点写下来，后面每个新会话都按同一套规矩干活，不用每次重新交代。

回头看，这里还有一个可以做得更好的地方。写在说明书里的规矩，AI 绝大多数时候会遵守，但它是“指导”，不是“强制”。Claude Code 官方最佳实践的建议是：必须百分之百遵守的规则，改用权限里的 deny 规则或者 hook 来做，比如直接禁止读取 `.env` 文件。这件事我放到 14 篇讲 hook 的时候再展开。

## 第三步：部署配置

`wrangler.jsonc` 里有用的就几行：

```jsonc
{
  "name": "lewis-ai-blogs",
  "compatibility_date": "2026-11-01",
  "routes": [
    { "pattern": "blogs.lewiswang.com.au", "custom_domain": true }
  ],
  "assets": {
    "directory": "./dist",
    "not_found_handling": "404-page"
  },
  "observability": { "enabled": true }
}
```

- `assets.directory` 指向 Astro 的构建产物
- `not_found_handling` 设成 `404-page`，找不到页面时返回自定义的 404
- `routes` 里用 `custom_domain` 绑定自己的域名，Cloudflare 会自动处理 DNS 记录和证书
- `observability` 打开日志，出问题能用 `npm run tail` 看实时日志

部署命令写在 `package.json` 里，`npm run deploy` 就是先构建、再 `wrangler deploy`。这样不管是我还是 AI，部署都只有一个入口，不会出现“它用了另一套参数部署”的情况。

## 第四步：写文章，以及第一组文章本身

文章是 Astro 的内容集合（content collections），每篇是一个 Markdown 文件，头部写标题、描述、发布日期，字段在 `src/content.config.ts` 里定义好，写错了构建会报错。

第一组文章就是这个系列的 [09 和 10](/zh/blog/save-tokens-claude-code-1/)。写作本身也是和 AI 一起做的。

文章里那张 token 堆叠图是用脚本生成的 SVG。这里留了一个小尾巴：生成图的脚本没有放进仓库，交接文档里专门记了一笔，要改图就得两种语言的 SVG 一起重新生成。

## 第五步：双语，以及一份交接文档

双语是这个项目里改动最大的一次：英文是默认语言，路径不带前缀；中文放在 `/zh/` 下面。文章按语言放在 `src/content/blog/en/` 和 `src/content/blog/zh/` 两个文件夹，同名文件就是一对译文，页头的语言切换会自动对上。

实现细节里有一个我很喜欢的设计：如果一篇文章没有放在语言文件夹里，构建会故意失败。这比默默把它当成英文文章发出去要好得多，错误在本地就暴露了。

这一步留下了一份交接文档 `docs/handover/i18n.md`。它的结构就是 09 里讲的那几块：目标、当前状态、怎么实现的、关键文件、怎么运行和检查、已知问题、下一步。比如“已知问题”里写着：构建不跑类型检查，所以中文界面文字漏了一个键，只会显示成空白，不会报错。

这份文档的价值不在当下，而在下次。下次不管是我自己、还是一个新开的 AI 会话要改双语相关的东西，第一句话都可以是“先读 docs/handover/i18n.md”，几百字就把背景交代清楚了。

## 第六步：改版

最后一步是把博客的样式改成和另一个站点 piggyway.com.au 一致：字体、颜色变量名、卡片的配色都对齐。颜色统一写成 CSS 变量，名字和那个站点保持一样，以后两边要一起调整也方便。

有一个细节值得一提：改版时，文章里的图表一开始没有跟着换颜色。原因写在交接文档里，因为正文里提到了“灰色那一大片”“蓝色那一条”，图的颜色一换，文字就对不上了。后来图表按站点的紫色（#dcd7ff）和深蓝（#050451）重新生成，中英文正文里描述颜色的词也同时改掉了。图的颜色和描述它的文字必须一起改，这种跨文件的依赖，AI 自己很难想到，得有人提醒。

## 复盘：哪些做对了，哪些可以更好

### 做对的

- **选型保守**。官方模板加主流部署平台，几乎没有在环境问题上浪费时间
- **规矩先行**。构建、部署、密钥怎么处理，在写功能之前就定好了
- **部署只有一个入口**。`npm run deploy`，没有别的路径
- **留了交接文档**。改动最大的那一步有文档，下次改不用重新摸索

### 可以更好的

- **README 还是模板的**。仓库是公开的，别人点进来看到的是 Astro 的默认说明，应该换成这个博客自己的介绍
- **生成图表的脚本没进仓库**。这让改图变成了一件依赖“当时那台电脑”的事
- **硬规则还停留在文字层面**。像“不准读 `.env`”这种零例外的规则，应该做成 deny 规则
- **构建不做类型检查**。双语的界面文字漏键不会报错，可以加一步 `astro check`

### 给想动手的人

如果你也想用 AI 从零做一个项目，我的建议是从一个这种尺寸的东西开始：一个博客、一个作品集页面、一个给自己用的小工具。目标是完整地走完一遍：起项目、写说明书、部署、上线、改一次需求、留一份交接文档。

走完一遍之后，你对“AI 能帮我做什么、哪些得我自己把关”的判断，会比看十篇教程准确得多。

## 下一篇

这个博客上线之后，还有不少重复的小事：检查死链、整理新 issue、发文章前跑一遍构建。下一篇是系列的最后一篇，讲怎么用 Agent 把这类日常工作自动化：哪些事值得交出去，怎么用 hook、脚本、定时任务和 GitHub Actions 让它在你不在的时候干活，以及放手之前要想清楚的五个问题。

## 参考

- [lewis-ai-blogs](https://github.com/lewiswang0516/lewis-ai-blogs)：本文复盘的博客源码
- [Deploy your Astro site to Cloudflare](https://docs.astro.build/en/guides/deploy/cloudflare/)：Astro 官方的 Cloudflare 部署指南
- [Content collections](https://docs.astro.build/en/guides/content-collections/)：Astro 内容集合
- [Internationalization (i18n) routing](https://docs.astro.build/en/guides/internationalization/)：Astro 多语言路由
- [Static Assets](https://developers.cloudflare.com/workers/static-assets/)：Cloudflare Workers 静态资源托管
- [Custom Domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/)：Workers 自定义域名
- [Best practices for Claude Code](https://code.claude.com/docs/en/best-practices)：硬规则改用 hook 和 deny 规则的建议

本文写于 2026 年 11 月，仓库内容以写作时的 main 分支为准。
