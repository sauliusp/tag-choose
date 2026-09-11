import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AiFlow, initialAiState } from './services/AiFlow';
import { AiService } from './services/AiService';
import './setup.css';
function Setup() {
  const [state, setState] = useState(initialAiState);
  const flow = useRef<AiFlow | null>(null);
  useEffect(() => {
    const f = new AiFlow(new AiService());
    flow.current = f;
    const unsub = f.subscribe(setState);
    void f.check();
    return () => {
      unsub();
      f.dispose();
    };
  }, []);
  const busy =
    ['waiting', 'preparing', 'suggesting'].includes(state.phase) ||
    (state.phase === 'downloading' && state.progress !== null);
  const ready = state.phase === 'ready';
  const heading =
    state.phase === 'checking'
      ? 'Checking your browser…'
      : state.phase === 'unavailable'
        ? 'Local AI is not available here'
        : state.phase === 'downloadable'
          ? 'Set up your private bookmark AI'
          : state.phase === 'waiting'
            ? 'Waiting for Chrome to begin'
            : state.phase === 'downloading' && state.progress === null
              ? 'Chrome is downloading its model'
              : state.phase === 'downloading'
                ? `Downloading the model · ${Math.round((state.progress ?? 0) * 100)}%`
                : state.phase === 'preparing'
                  ? 'Preparing the local model…'
                  : ready
                    ? 'Your local AI is ready'
                    : state.phase === 'cancelled'
                      ? 'Setup paused'
                      : 'Let’s get setup working';
  return (
    <main>
      <header>
        <strong>#TagChoose.</strong>
        <a href="https://tagchoose.site/help/" target="_blank" rel="noreferrer">
          Setup help ↗
        </a>
      </header>
      <p className="eyebrow">ONE-TIME SETUP · ON YOUR DEVICE</p>
      <h1>{heading}</h1>
      <p className="intro">
        TagChoose uses Chrome’s local AI to suggest bookmark folders. Automatic
        suggestions need a downloaded, ready model. You can select folders
        manually and save at any time.
      </p>
      <ol className="steps" aria-label="Setup steps">
        <li>Check compatibility</li>
        <li>Download model</li>
        <li>Prepare AI</li>
        <li>Start bookmarking</li>
      </ol>
      <section aria-live="polite" role="status">
        {state.phase === 'checking' && (
          <p>
            Checking Chrome’s reported model availability. No download has been
            started by TagChoose.
          </p>
        )}
        {state.phase === 'unavailable' && (
          <>
            <p>
              Chrome cannot currently offer the required model. Check that you
              use an up-to-date desktop Chrome and a supported device with
              enough free storage.
            </p>
            <p>
              Automatic suggestions need local AI. Until it is available, open
              TagChoose and select your folders manually. There is no automatic
              rules-based substitute.
            </p>
          </>
        )}
        {(state.phase === 'downloadable' ||
          (state.phase === 'downloading' && state.progress === null)) && (
          <>
            <p>
              The model is downloaded by Chrome, separately from this small
              extension. It can take several minutes. Google currently requires
              at least 22 GB of free space for initial setup, although the model
              itself is smaller.
            </p>
            <p>
              Use an unmetered connection. Keep this setup tab open; you can
              continue browsing in other tabs. Closing it stops this setup
              session. Reopening checks Chrome’s current state.
            </p>
            <p>
              Page titles, URLs and folder names are processed on your device
              when you ask for suggestions. They are not uploaded to a cloud AI
              service.
            </p>
          </>
        )}
        {busy && (
          <>
            <p>
              {state.phase === 'waiting'
                ? 'No download progress has been reported yet. Waiting does not mean data is already transferring.'
                : state.phase === 'preparing'
                  ? 'Chrome is preparing its local model. Wait for the ready confirmation.'
                  : 'This percentage comes from Chrome’s download events.'}
            </p>
            <progress
              aria-label="Model download progress"
              max="1"
              value={
                state.phase === 'downloading'
                  ? (state.progress ?? undefined)
                  : undefined
              }
            />
            {state.stalled && (
              <div className="notice">
                <strong>No new progress reported for 20 seconds.</strong>
                <p>
                  Check your connection and free storage. You can stop waiting
                  and retry. We cannot tell from silence alone whether Chrome’s
                  download has failed.
                </p>
              </div>
            )}
          </>
        )}
        {ready && (
          <>
            <p>
              Chrome reports that the local model is available. Return to a page
              you want to bookmark, then open TagChoose. AI will suggest
              destinations; review them and save.
            </p>
            <p>
              Use the extension icon or its configured keyboard shortcut. AI can
              make mistakes, so you stay in control of the final folders.
            </p>
          </>
        )}
        {state.message && <p className="notice">{state.message}</p>}
      </section>
      <div className="actions">
        {ready ? (
          <button onClick={() => window.close()}>Done, close setup</button>
        ) : busy ? (
          <button onClick={() => flow.current?.cancel()}>Stop waiting</button>
        ) : state.phase === 'checking' ? null : state.phase ===
          'unavailable' ? (
          <button onClick={() => void flow.current?.check()}>
            Check compatibility again
          </button>
        ) : (
          <button onClick={() => void flow.current?.run()}>
            {state.phase === 'downloadable'
              ? 'Download & set up local AI'
              : state.phase === 'downloading'
                ? 'Connect to download progress'
                : 'Retry setup'}
          </button>
        )}
        <a
          href="https://developer.chrome.com/docs/ai/prompt-api#hardware-requirements"
          target="_blank"
          rel="noreferrer"
        >
          Current requirements ↗
        </a>
      </div>
      <details>
        <summary>Still waiting? Inspect Chrome’s model status</summary>
        <p>
          Open <code>chrome://on-device-internals</code> in another tab. Chrome
          controls the model and may pause setup because of storage, network,
          hardware or browser policy. Do not disable security protections to
          force setup.
        </p>
      </details>
      <footer>No account. No API key. No cloud AI.</footer>
    </main>
  );
}
createRoot(document.getElementById('root')!).render(<Setup />);
