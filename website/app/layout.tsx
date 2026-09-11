import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  metadataBase: new URL('https://tagchoose.site'),
  title: {
    default: 'TagChoose | Save Chrome bookmarks in multiple folders',
    template: '%s | TagChoose',
  },
  description:
    'Save a page in multiple Chrome bookmark folders with TagChoose. Get automatic folder suggestions from Chrome’s local AI, or choose folders manually while the model is unavailable. Free, with no account.',
  alternates: { canonical: '/' },
  icons: { icon: '/favicon.png' },
  openGraph: {
    title: 'TagChoose | Chrome local AI bookmark tagging',
    description:
      'Automatic folder suggestions with Chrome local AI. Manual saving stays available.',
    url: 'https://tagchoose.site',
    type: 'website',
    images: [{ url: '/images/multiple-folders.jpg', width: 1280, height: 800 }],
  },
  twitter: { card: 'summary_large_image' },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <a className="skip" href="#content">
          Skip to content
        </a>
        <header className="site-header wrap">
          <a className="wordmark" href="/">
            #TagChoose<span className="brand-dot">.</span>
          </a>
          <nav aria-label="Main navigation">
            <a href="/#how-it-works">How it works</a>
            <a href="/guides/">Guides</a>
            <a href="/help/">Help</a>
            <a
              className="nav-cta"
              href="https://chromewebstore.google.com/detail/tagchoose-bookmark-manage/hlfgdfpeekcelanebbfchnnneijhophh"
            >
              Add to Chrome ↗
            </a>
          </nav>
        </header>
        <div id="content">{children}</div>
        <footer className="wrap site-footer">
          <a className="wordmark" href="/">
            #TagChoose.
          </a>
          <p>Useful links deserve a place you'll remember.</p>
          <nav aria-label="Footer navigation">
            <a href="/privacy-policy/">Privacy</a>
            <a href="/help/">Support</a>
            <a href="https://tagchoose.featurebase.app/">Feedback</a>
            <a href="https://github.com/sauliusp/tag-choose">Source code</a>
          </nav>
          <small>Made by Saulius.</small>
        </footer>
      </body>
    </html>
  );
}
