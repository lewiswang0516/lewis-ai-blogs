import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { SITE_TITLE } from '../consts';
import { htmlLang, ui, type Lang } from './ui';
import { getPosts, postPath } from './utils';

export async function buildFeed(lang: Lang, context: APIContext) {
	if (!context.site) throw new Error('`site` must be set in astro.config.mjs to build the RSS feed.');
	const posts = await getPosts(lang);
	return rss({
		title: SITE_TITLE,
		description: ui[lang]['site.description'],
		site: context.site,
		customData: `<language>${htmlLang[lang]}</language>`,
		items: posts.map((post) => ({
			title: post.data.title,
			description: post.data.description,
			pubDate: post.data.pubDate,
			link: postPath(post),
		})),
	});
}
