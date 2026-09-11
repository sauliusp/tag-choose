import { pages } from '../content/pages';
export default function sitemap() {
  return ['', ...Object.keys(pages)].map((path) => ({
    url: `https://tagchoose.site/${path}${path ? '/' : ''}`,
    lastModified: '2026-09-11',
  }));
}
