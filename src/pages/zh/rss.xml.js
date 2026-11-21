import { buildFeed } from '../../i18n/rss';

export function GET(context) {
	return buildFeed('zh', context);
}
