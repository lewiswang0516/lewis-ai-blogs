export const languages = {
	en: 'English',
	zh: '中文',
} as const;

export type Lang = keyof typeof languages;

export const defaultLang: Lang = 'en';

export const htmlLang: Record<Lang, string> = {
	en: 'en',
	zh: 'zh-CN',
};

export const dateLocale: Record<Lang, string> = {
	en: 'en-AU',
	zh: 'zh-CN',
};

export const ui = {
	en: {
		'site.description': 'Notes on how I use AI tools in my daily work.',
		'nav.home': 'Home',
		'nav.blog': 'Blog',
		'nav.switch': '中文',
		'nav.switchLabel': '切换到中文',
		'social.github': 'GitHub',
		'social.portfolio': 'Portfolio',
		'home.greeting': "Hi, I'm Lewis.",
		'home.intro':
			'I write about how I use AI tools in my daily work: the habits that help, the ones that waste money, and what I learn along the way.',
		'home.latest': 'Latest posts',
		'home.allPosts': 'All posts',
		'post.updated': 'Last updated on',
		'footer.rights': 'All rights reserved.',
	},
	zh: {
		'site.description': '记录我在日常工作中怎么用 AI 工具。',
		'nav.home': '首页',
		'nav.blog': '文章',
		'nav.switch': 'EN',
		'nav.switchLabel': 'Switch to English',
		'social.github': 'GitHub',
		'social.portfolio': '作品集',
		'home.greeting': '你好，我是 Lewis。',
		'home.intro': '这里记录我在日常工作中怎么用 AI 工具：哪些习惯有用，哪些在白花钱，以及一路上学到的东西。',
		'home.latest': '最新文章',
		'home.allPosts': '全部文章',
		'post.updated': '最后更新于',
		'footer.rights': '保留所有权利。',
	},
} as const satisfies Record<Lang, Record<string, string>>;

export type UiKey = keyof (typeof ui)['en'];
