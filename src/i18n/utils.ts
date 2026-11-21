import { getCollection, type CollectionEntry } from 'astro:content';
import { defaultLang, languages, ui, type Lang, type UiKey } from './ui';

export function getLangFromUrl(url: URL): Lang {
	const [, first] = url.pathname.split('/');
	if (first in languages) return first as Lang;
	return defaultLang;
}

export function useTranslations(lang: Lang) {
	return function t(key: UiKey): string {
		return ui[lang][key];
	};
}

export function localizePath(path: string, lang: Lang): string {
	return lang === defaultLang ? path : `/${lang}${path}`;
}

export function alternatesFor(path: string): Record<Lang, string> {
	return Object.fromEntries(
		(Object.keys(languages) as Lang[]).map((lang) => [lang, localizePath(path, lang)]),
	) as Record<Lang, string>;
}

export type Post = CollectionEntry<'blog'> & { slug: string; lang: Lang };

export async function getPosts(lang: Lang): Promise<Post[]> {
	const entries = await getCollection('blog');
	return entries
		.flatMap((entry) => {
			const [prefix, ...rest] = entry.id.split('/');
			if (!(prefix in languages) || rest.length === 0) {
				throw new Error(`Blog entry "${entry.id}" must live under a language folder (${Object.keys(languages).join(', ')}).`);
			}
			return prefix === lang ? [{ ...entry, slug: rest.join('/'), lang }] : [];
		})
		.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export function postPath(post: Post): string {
	return localizePath(`/blog/${post.slug}/`, post.lang);
}

export async function getPostPaths(lang: Lang) {
	const posts = await getPosts(lang);
	const slugsByLang = Object.fromEntries(
		await Promise.all(
			(Object.keys(languages) as Lang[]).map(async (l) => [l, new Set((await getPosts(l)).map((p) => p.slug))]),
		),
	) as Record<Lang, Set<string>>;
	return posts.map((post) => ({
		params: { slug: post.slug },
		props: {
			post,
			alternates: Object.fromEntries(
				(Object.keys(languages) as Lang[])
					.filter((l) => slugsByLang[l].has(post.slug))
					.map((l) => [l, localizePath(`/blog/${post.slug}/`, l)]),
			) as Partial<Record<Lang, string>>,
		},
	}));
}
