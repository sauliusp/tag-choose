import { notFound } from 'next/navigation';
import { pages } from '../../content/pages';
export function generateStaticParams() {
  return Object.keys(pages).map((path) => ({ slug: path.split('/') }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const path = slug.join('/');
  const p = pages[path];
  return p
    ? {
        title: p.title,
        description: p.description,
        alternates: { canonical: `/${path}/` },
        openGraph: {
          title: p.title,
          description: p.description,
          url: `https://tagchoose.site/${path}/`,
          type: 'article',
        },
      }
    : {};
}
function Text({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\[\[.*?\]\])/g).map((part, i) => {
        const match = part.match(/^\[\[(.*?)\|(.*?)\]\]$/);
        return match ? (
          <a key={i} href={match[1]}>
            {match[2]}
          </a>
        ) : (
          part
        );
      })}
    </>
  );
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const p = pages[slug.join('/')];
  if (!p) notFound();
  return (
    <main className="wrap article">
      <p className="eyebrow">
        <a href="/">TAGCHOOSE</a> /{' '}
        {slug[0] === 'guides' ? 'PRACTICAL GUIDES' : 'PRODUCT HELP'}
      </p>
      <h1>{p.title}</h1>
      <p className="intro">{p.intro}</p>
      {p.sections.map((s) => (
        <section key={s.heading}>
          <h2>{s.heading}</h2>
          {s.paragraphs.map((t) => (
            <p key={t}>
              <Text text={t} />
            </p>
          ))}
        </section>
      ))}
      <div className="callout">
        <strong>Keep your next useful page.</strong>
        <p>Choose the folders that fit, then find it again in Chrome.</p>
        <a href="https://chromewebstore.google.com/detail/tagchoose-bookmark-manage/hlfgdfpeekcelanebbfchnnneijhophh">
          View TagChoose in the Chrome Web Store ↗
        </a>
      </div>
    </main>
  );
}
