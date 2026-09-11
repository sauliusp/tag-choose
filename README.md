# TagChoose

TagChoose suggests Chrome bookmark folders using Chrome’s on-device AI. Review or adjust the suggestions, then save a page in multiple folders. Manual folder selection works while the model downloads, on unsupported devices and after an AI error. There is no cloud AI or algorithmic automatic fallback.

- Website: https://tagchoose.site/
- Chrome Web Store: https://chromewebstore.google.com/detail/tagchoose-bookmark-manage/hlfgdfpeekcelanebbfchnnneijhophh
- Feedback: https://tagchoose.featurebase.app/

## Development

Use Node 22 or later, desktop Chrome 138 or later, and npm.

```sh
npm ci
npm test
npm run typecheck
npm run lint
npm run build
```

Load `dist` through Chrome Extensions > Developer mode > Load unpacked. The production build removes the development public key. No origin trial or unsafe flag changes are required. AI availability depends on Chrome’s current hardware, storage, network and policy requirements, documented at https://developer.chrome.com/docs/ai/prompt-api.

The popup opens the active page. First-time users can open a separate setup tab, inspect requirements, explicitly start the model download, watch actual progress, cancel and retry. `100% downloaded` is separate from a ready model. Returning users get AI suggestions automatically when Chrome reports readiness. They remain free to select folders manually.

## Saving contract

Selected writable folders receive a copy or an updated title for an exact URL match. Other copies are never removed. Full paths distinguish folders with the same name. A partial Chrome API failure is surfaced; retrying avoids new duplicate copies in already-saved destinations. Folders are created and managed through Chrome.

## Release

`npm run zip` builds a clean package and creates `release/tagchoose-2.0.0-chrome.zip` with `manifest.json` at the archive root. `qa/release/STATUS.md` tracks local QA, browser QA, review, website/video, Store submission and public publication separately. A successful build is not a published release.

## Website and video

`website` contains the Sites project, including product help and bookmark guides. The source is mirrored to the Sites repository when deployed. `marketing` contains the existing Store screenshots, their provenance and the new narration/rendering sources. The private voice reference remains outside this repository.

## Privacy

The extension requests bookmarks and tabs permissions. There are no content scripts, host permissions, remote model calls, analytics or tracking pixels. Chrome owns bookmark storage and any browser sync configured by the user. AI inputs are page title, URL and folder names, not full page content.
