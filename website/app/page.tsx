const store =
  'https://chromewebstore.google.com/detail/tagchoose-bookmark-manage/hlfgdfpeekcelanebbfchnnneijhophh';
export default function Home() {
  return (
    <main>
      <section className="hero wrap">
        <div className="hero-copy">
          <p className="eyebrow">LESS FILING. MORE FINDING.</p>
          <h1>
            One page.
            <br />
            All the <em>right folders.</em>
          </h1>
          <p className="intro">
            Chrome’s local AI suggests the right bookmark folders. Review the
            choices, then save one page in every place it belongs.
          </p>
          <a className="button" href={store}>
            Get TagChoose for Chrome <span aria-hidden="true">↗</span>
          </a>
          <p className="fine">Free · Chrome local AI · No account</p>
          <p className="fine">
            Automatic tagging needs Chrome’s local model. Manual saving works
            while it downloads or when AI is unavailable.{' '}
            <a href="/help/">Check compatibility</a>
          </p>
        </div>
        <div
          className="folder-art"
          aria-label="One bookmark can belong in several folders"
        >
          <div className="bookmark-note">
            <span className="note-star">✳</span>
            <small>A PAGE WORTH KEEPING</small>
            <strong>
              Your next
              <br />
              good idea.
            </strong>
            <span>Saved once. Found your way.</span>
          </div>
          <div className="folder folder-one">
            <span>01</span> Research
          </div>
          <div className="folder folder-two">
            <span>02</span> Inspiration
          </div>
          <div className="folder folder-three">
            <span>03</span> Next project
          </div>
          <p className="art-caption">ONE BOOKMARK. MORE THAN ONE WAY BACK.</p>
        </div>
      </section>
      <section className="band">
        <div className="wrap">
          <p>Built around the folders you already know.</p>
          <span>No separate library to maintain.</span>
        </div>
      </section>
      <section className="wrap section" id="how-it-works">
        <p className="eyebrow">A SMALLER DECISION</p>
        <h2>
          Keep the link.
          <br />
          Skip the folder dilemma.
        </h2>
        <div className="steps">
          {[
            [
              '01',
              'Open the page',
              'Click TagChoose, or use its keyboard shortcut. The default is Ctrl+Shift+Y, or Command+Shift+Y on Mac, when available.',
            ],
            [
              '02',
              'Choose where it belongs',
              'Let Chrome’s local AI suggest folders, then review them. You can also select folders manually.',
            ],
            [
              '03',
              'Make it easy to find again',
              'Edit the title, review the folders, and save a copy in each chosen location.',
            ],
          ].map(([n, title, text]) => (
            <article key={n}>
              <span className="step-number">{n}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="wrap section">
        <p className="eyebrow">INSIDE TAGCHOOSE</p>
        <h2>
          Your folders.
          <br />
          Your familiar browser.
        </h2>
        <div className="screenshots">
          <figure>
            <img
              src="/images/multiple-folders.jpg"
              width="512"
              height="320"
              alt="Existing TagChoose screenshot showing one bookmark saved in several Chrome folders"
              loading="lazy"
            />
            <figcaption>
              Existing Store screenshot. The version 2 interface is being
              updated.
            </figcaption>
          </figure>
          <div>
            <h3>A bookmark manager that stays out of the way.</h3>
            <p>
              TagChoose saves the page you have open into the Chrome folders you
              choose. Your bookmarks remain ordinary Chrome bookmarks, so you
              can use them without keeping a separate app open.
            </p>
            <p>
              It does not bulk reorganize old bookmarks, read whole pages, or
              create folders automatically.
            </p>
            <a href="/technical-details/">How it works under the hood ↗</a>
          </div>
        </div>
      </section>
      <section className="wrap section" id="video">
        <p className="eyebrow">THIRTY SECONDS TO GET THE IDEA</p>
        <h2>See where a good link can go.</h2>
        <video
          controls
          preload="none"
          poster="/images/video-poster.jpg"
          aria-label="TagChoose 30-second introduction"
        >
          <source src="/video/tagchoose-30s.mp4" type="video/mp4" />
          <track
            kind="captions"
            src="/video/tagchoose-en.vtt"
            srcLang="en"
            label="English"
            default
          />
        </video>
        <p className="fine">
          <a href="https://www.youtube.com/watch?v=Rc8u494w-Dc">
            Watch on YouTube ↗
          </a>
        </p>
        <details className="video-transcript">
          <summary>Read the video transcript</summary>
          <p>
            Save a page where you will actually find it again. TagChoose puts
            one bookmark in all the folders that fit. Choose your folders, or
            ask private, on-device AI for suggestions. Edit the title. Review
            your choices. Save. No account. Your bookmarks stay in Chrome.
            TagChoose. One page. All the right folders.
          </p>
          <p>
            Automatic tagging uses Chrome’s local AI. Manual saving stays
            available. The video uses existing Store screenshots.
          </p>
        </details>
      </section>
      <section className="wrap section">
        <p className="eyebrow">GOOD QUESTIONS</p>
        <h2>Before you add it.</h2>
        <div className="faq">
          {[
            [
              'Is TagChoose free?',
              'Yes. There is no account, subscription or API key required to use the extension.',
            ],
            [
              'Does it work without AI?',
              'Yes. Choose existing bookmark folders manually and save. Automatic tagging uses Chrome’s local AI and needs a ready model. Manual selection works while it downloads or if it is unavailable.',
            ],
            [
              'Are my bookmarks sent to an AI server?',
              'TagChoose does not send page titles, URLs or folder names to a cloud AI service. Suggestions run on your device. Chrome sync, if enabled, follows your browser settings.',
            ],
            [
              'Can a bookmark appear in more than one folder?',
              'Yes. Each selected folder gets an ordinary Chrome bookmark copy. The copies are separate bookmarks, not a shared tag record.',
            ],
            [
              'Will local AI work on every computer?',
              'No. It requires a supported desktop Chrome installation and suitable hardware, storage and model availability. Check the setup guide for current requirements.',
            ],
          ].map(([q, a]) => (
            <details key={q}>
              <summary>{q}</summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
        <p style={{ marginTop: 25 }}>
          <a href="/help/">Setup and troubleshooting ↗</a>
        </p>
      </section>
      <section className="wrap section">
        <p className="eyebrow">FIND IT AGAIN</p>
        <h2>
          A little structure.
          <br />A lot less searching.
        </h2>
        <div className="cards">
          <article className="guide-card">
            <a href="/guides/save-bookmark-in-multiple-folders/">
              One bookmark, multiple folders
            </a>
            <p>Give a useful page more than one sensible home.</p>
          </article>
          <article className="guide-card">
            <a href="/guides/chrome-bookmark-tags/">Use folders like tags</a>
            <p>Keep the organization in the browser you already use.</p>
          </article>
          <article className="guide-card">
            <a href="/guides/private-ai-bookmark-manager/">
              What private AI means here
            </a>
            <p>Understand local processing, downloads and browser sync.</p>
          </article>
          <article className="guide-card">
            <a href="/guides/bookmark-keyboard-shortcut/">
              Save from the keyboard
            </a>
            <p>Open, choose and save without hunting through menus.</p>
          </article>
        </div>
      </section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'TagChoose',
            url: 'https://tagchoose.site/',
            applicationCategory: 'BrowserApplication',
            operatingSystem: 'Desktop Google Chrome 138+',
            description:
              'Save a page in multiple Chrome bookmark folders, with Chrome local AI folder suggestions.',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
            author: { '@type': 'Person', name: 'Saulius' },
            downloadUrl: store,
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'VideoObject',
            name: 'TagChoose: Chrome Local AI Bookmark Tagging in 30 Seconds',
            description:
              'Save a page in multiple Chrome folders. Automatic suggestions use Chrome local AI; manual saving stays available. Uses existing Store screenshots.',
            thumbnailUrl: 'https://tagchoose.site/images/video-poster.jpg',
            uploadDate: '2026-09-11T06:38:00Z',
            duration: 'PT30S',
            contentUrl: 'https://tagchoose.site/video/tagchoose-30s.mp4',
            embedUrl: 'https://www.youtube.com/embed/Rc8u494w-Dc',
          }),
        }}
      />
    </main>
  );
}
