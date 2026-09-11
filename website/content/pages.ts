export const pages: Record<
  string,
  {
    title: string;
    description: string;
    intro: string;
    sections: { heading: string; paragraphs: string[] }[];
  }
> = {
  guides: {
    title: 'Chrome bookmark guides',
    description:
      'Practical guides to bookmark folders, multiple-folder saving, private AI suggestions and keyboard shortcuts in TagChoose.',
    intro:
      'A few small habits can make saved links easier to find. Start with the problem you want to solve.',
    sections: [
      {
        heading: 'Choose a guide',
        paragraphs: [
          '[[/guides/save-bookmark-in-multiple-folders/|Save one bookmark in multiple folders]]',
          '[[/guides/chrome-bookmark-tags/|Use Chrome bookmark folders like tags]]',
          '[[/guides/private-ai-bookmark-manager/|Understand what a private AI bookmark manager does]]',
          '[[/guides/bookmark-keyboard-shortcut/|Save bookmarks with a keyboard shortcut]]',
        ],
      },
    ],
  },
  'guides/save-bookmark-in-multiple-folders': {
    title: 'How to save one Chrome bookmark in multiple folders',
    description:
      'Put a useful page in more than one Chrome bookmark folder. Learn how TagChoose uses ordinary bookmark copies, and what happens when you edit or remove one.',
    intro:
      'A page can belong to more than one project. TagChoose lets you select several existing Chrome folders and save a bookmark copy in each, instead of choosing a single location.',
    sections: [
      {
        heading: 'Save a page in several places',
        paragraphs: [
          'Open the page you want to keep, then open TagChoose from the Chrome toolbar. Edit the bookmark title if a clearer name would help you recognize it later.',
          'Search the folder picker and select each destination. For example, an article about accessible forms could belong in Work / Design and Learning / Accessibility. Use the full folder path to tell similar folder names apart in version 2.',
          'Review the selection and save. Chrome will show the page inside each chosen folder. You can use the normal bookmark bar or bookmark manager to find it.',
        ],
      },
      {
        heading: 'Are these linked tags or separate bookmarks?',
        paragraphs: [
          'They are ordinary Chrome bookmark copies. Chrome gives each copy its own location and title. Changing or deleting one copy in Chrome does not automatically change every other copy.',
          'TagChoose 2 updates the title of matching copies in the selected folders and adds missing copies. It keeps copies in unselected folders. That safer saving behavior is part of the version 2 release; check [[/updates/|release status]] before relying on it in an older build.',
        ],
      },
      {
        heading: 'Use two or three useful destinations',
        paragraphs: [
          'More copies are not always more useful. Pick the places you would actually look when you need the page again. A project folder and a topic folder are often enough.',
          'For a broader approach, read [[/guides/chrome-bookmark-tags/|using bookmark folders like tags]].',
        ],
      },
    ],
  },
  'guides/chrome-bookmark-tags': {
    title: 'Can you add tags to Chrome bookmarks?',
    description:
      'Chrome bookmarks use folders rather than native tags. Learn how TagChoose maps folder selections to bookmark copies without creating a separate library.',
    intro:
      'Chrome does not provide a native tag field for ordinary bookmarks. TagChoose uses your existing bookmark folders as destinations, so selecting several folders gives a page several ways to be found.',
    sections: [
      {
        heading: 'Folders are the tags',
        paragraphs: [
          'A folder named Research can serve as your research tag. A folder named Recipes can serve as your recipe tag. TagChoose saves a normal bookmark copy into every selected folder.',
          'This keeps the result usable in Chrome even if you remove TagChoose. It does not require a separate online library, proprietary tag database or account.',
        ],
      },
      {
        heading: 'Choose names that help you retrieve a page',
        paragraphs: [
          'Name folders around your work and interests. Specific names such as Home renovation, CSS reference or Travel / Japan are easier to interpret than Misc or Stuff.',
          'Create and rename folders with Chrome’s bookmark manager. TagChoose works with existing folders; it does not bulk reorganize your library or create a new folder hierarchy for you.',
        ],
      },
      {
        heading: 'When should you use local AI?',
        paragraphs: [
          'Ask for suggestions when you are unsure where a page belongs. TagChoose sends the page title, URL and available folder names to Chrome’s on-device language model. It does not read the full article.',
          'AI can miss context, misunderstand an unfamiliar language or choose a folder that is too broad. Review the choices before saving. Manual selection remains the most direct option when you already know the destination. See [[/help/|AI setup and troubleshooting]].',
        ],
      },
    ],
  },
  'guides/private-ai-bookmark-manager': {
    title: 'A private AI bookmark manager: what stays on your device?',
    description:
      'Understand how TagChoose uses Chrome’s on-device AI, which bookmark data it processes, and how browser sync differs from extension data collection.',
    intro:
      'TagChoose uses Chrome’s built-in language model for automatic folder suggestions. The extension does not send your page titles, URLs or folder names to a remote AI service.',
    sections: [
      {
        heading: 'What the AI receives',
        paragraphs: [
          'When you request suggestions, TagChoose supplies the current page title, its URL and the available bookmark folders. The model selects destinations from that list. TagChoose does not fetch or summarize the full page.',
          'The model runs in Chrome on supported desktop devices. Chrome manages the initial model download and later model updates. Folder suggestions do not require an AI service account or a personal API key.',
        ],
      },
      {
        heading: 'Does private mean nothing ever uses the network?',
        paragraphs: [
          'No. Chrome needs a connection to download the model. Opening websites, help pages or the Chrome Web Store also uses the network. The distinction is that TagChoose does not upload the bookmark information for cloud AI processing.',
          'Your bookmarks are stored by Chrome. If you enable Chrome sync, Google may synchronize them according to your browser settings. TagChoose does not change those settings. Read the [[/privacy-policy/|privacy policy]] for the full boundary.',
        ],
      },
      {
        heading: 'Usefulness without the model',
        paragraphs: [
          'You can choose folders yourself and save without AI. Version 2 keeps those controls available while AI is preparing or suggesting folders and adds clearer failure and progress messages.',
          'Local AI support depends on Chrome, operating system, memory, storage and model availability. Check the [[/help/|setup guide]] before expecting suggestions to work on every computer.',
        ],
      },
    ],
  },
  'guides/bookmark-keyboard-shortcut': {
    title: 'Save Chrome bookmarks with a keyboard shortcut',
    description:
      'Open TagChoose with Ctrl+Shift+Y or Command+Shift+Y, choose multiple bookmark folders, edit the title and save with the keyboard.',
    intro:
      'TagChoose suggests Ctrl+Shift+Y on Windows and Linux, or Command+Shift+Y on macOS, to open its popup. Chrome may leave the shortcut unassigned if another extension already uses it.',
    sections: [
      {
        heading: 'Set or change the shortcut',
        paragraphs: [
          'Open chrome://extensions/shortcuts in Chrome. Find TagChoose and assign an available shortcut under Activate the extension. You can also reach Keyboard shortcuts from the Extensions page.',
          'Keep your regular Chrome bookmark shortcut if you use it. TagChoose’s shortcut opens its own multi-folder saving popup.',
        ],
      },
      {
        heading: 'Choose folders with the keyboard',
        paragraphs: [
          'Press Tab to reach the title or folder field. Type part of a folder name, move through matching choices with the arrow keys, and select a destination with Enter. Repeat to choose more than one folder.',
          'Review the selected folders, then Tab to Save and press Enter. If the suggested shortcut is occupied, opening TagChoose from the extensions menu works too.',
        ],
      },
      {
        heading: 'Keep destination names recognizable',
        paragraphs: [
          'Nested folders can share the same name. Version 2 shows their full paths, so Work / Design and Personal / Design remain distinguishable.',
          'Read [[/guides/save-bookmark-in-multiple-folders/|saving one bookmark in multiple folders]] for how copies behave.',
        ],
      },
    ],
  },
  help: {
    title: 'TagChoose help: local AI setup, downloads and saving',
    description:
      'Troubleshoot unavailable AI, a waiting model download, missing suggestions and bookmark saving in TagChoose. Manual folder selection works without local AI.',
    intro:
      'You can use TagChoose without AI: choose an existing bookmark folder, review the title and save. If suggestions are unavailable, start with Chrome’s model status and requirements.',
    sections: [
      {
        heading: 'Check the extension version first',
        paragraphs: [
          'Open chrome://extensions and find TagChoose. Version 2 introduces clearer AI setup states, cancel and retry controls, full folder paths and safer saving. See [[/updates/|release status]] to check whether it is available in the Store.',
          'Older versions may show less detailed setup information. An extension update cannot make an unsupported device meet Chrome’s model requirements.',
        ],
      },
      {
        heading: 'AI is unavailable',
        paragraphs: [
          'Use a supported, up-to-date desktop version of Google Chrome. TagChoose requires Chrome 138 or later. Mobile Chrome does not run this desktop extension. Other Chromium browsers may not provide the same built-in model.',
          'Chrome checks your operating system, available disk space, memory or GPU resources, network and policy settings. Google currently documents 22 GB of free disk space for initial setup, and GPU or CPU requirements. These can change; consult the [[https://developer.chrome.com/docs/ai/prompt-api#hardware-requirements|current official hardware requirements]].',
          'Use the Check again control in version 2 after updating Chrome or freeing storage. Keep manual saving available rather than changing experimental flags or disabling browser protections.',
        ],
      },
      {
        heading: 'The model seems stuck downloading',
        paragraphs: [
          'In version 2, select Set up local AI. The popup shows waiting, Chrome-reported download percentage, and model preparation separately. Reaching 100% for download does not mean preparation is finished.',
          'A message that Chrome has not reported progress means exactly that. It does not prove a transfer is active or that setup has failed. Keep the popup open while checking progress, or stop waiting and save manually.',
          'Open chrome://on-device-internals in another tab to inspect Chrome’s model information. Check your connection, available storage and browser policy. Chrome owns the model download; closing the popup stops TagChoose’s current session, and a later request checks Chrome’s current state again.',
        ],
      },
      {
        heading: 'Suggestions are missing or inaccurate',
        paragraphs: [
          'Use clear folder names and a descriptive bookmark title. The AI only receives the title, URL and folder list, so a vague title or hidden article context can limit relevance. Folder and page languages outside the model’s supported languages may give poor results.',
          'Version 2 rejects malformed model output and unknown folder IDs, uses exact IDs for duplicate folder names, and offers a retry after an inference error. It also leaves manual edits alone if they were made while a suggestion request was running.',
          'Very large folder lists may exceed the local model’s context budget. In that case, use folder search to choose destinations. TagChoose displays the limitation rather than silently dropping folders.',
        ],
      },
      {
        heading: 'A bookmark will not save',
        paragraphs: [
          'Choose at least one existing, writable folder and enter a title. Open a normal web page rather than a Chrome settings or extension page. If a selected folder was deleted, reopen TagChoose to refresh the list.',
          'Version 2 reports a partial failure if Chrome accepts some destinations but rejects another. It keeps existing bookmarks and lets you inspect the result before retrying.',
        ],
      },
      {
        heading: 'Get help with a specific failure',
        paragraphs: [
          'Use [[https://tagchoose.featurebase.app/|the feedback portal]] or email saulius.developer@gmail.com. Include your Chrome version, operating system, extension version, the exact visible message, and whether manual saving works. Share a public example URL only if you are comfortable doing so. Do not send your private bookmark library.',
        ],
      },
    ],
  },
  'privacy-policy': {
    title: 'Privacy policy',
    description:
      'TagChoose privacy: on-device folder suggestions, ordinary Chrome bookmark storage, no account, no analytics in the extension, and browser-sync boundaries.',
    intro:
      'TagChoose is made by Saulius. This policy explains the extension and this product website. Updated September 11, 2026.',
    sections: [
      {
        heading: 'Data used by the extension',
        paragraphs: [
          'TagChoose reads the active tab’s title and URL, reads bookmark folders, and creates or updates bookmark copies when you save. It requests the bookmarks and tabs permissions for those features.',
          'When you ask for AI suggestions, the current title, URL and available folder names are processed by Chrome’s on-device model. TagChoose does not send that input to the developer or a remote AI provider. It does not collect analytics, run advertising, or require an account.',
        ],
      },
      {
        heading: 'Storage and browser services',
        paragraphs: [
          'Saved bookmarks are ordinary Chrome bookmarks. The extension does not operate its own cloud bookmark store. Removing TagChoose does not remove the bookmarks it saved.',
          'Chrome may download and update its AI model. Chrome sync, if enabled by you, may synchronize bookmarks through Google. Those services are governed by your browser settings and Google’s policies.',
        ],
      },
      {
        heading: 'Website and external links',
        paragraphs: [
          'This website does not add advertising or client analytics trackers. Its hosting provider processes ordinary connection information to deliver and protect the site. The site may link to YouTube, the Chrome Web Store, GitHub, Featurebase and Buy Me a Coffee; those services apply their own privacy policies when you visit them.',
          'A locally hosted video can be played without loading a YouTube embed. Messages you voluntarily send through the feedback portal or email are used to respond and investigate the reported issue. Do not include sensitive browsing data.',
        ],
      },
      {
        heading: 'Contact',
        paragraphs: [
          'For privacy questions, email saulius.developer@gmail.com. The extension source is available at [[https://github.com/sauliusp/bookmark-ai-autotagger|GitHub]].',
        ],
      },
    ],
  },
  updates: {
    title: 'TagChoose release updates',
    description:
      'Follow the TagChoose 2 release: safer multi-folder saving, current local AI integration, visible setup progress, recovery controls and full folder paths.',
    intro:
      'TagChoose 2.0 is being prepared for Chrome Web Store review. The public listing was still serving 1.1.0 when checked on September 11, 2026. A prepared or submitted update is not yet a published update.',
    sections: [
      {
        heading: 'What changes in version 2',
        paragraphs: [
          'Saving adds or updates copies in selected folders and keeps unselected copies. Folder paths distinguish matching names, and existing selections load together with the current page.',
          'Local AI setup has explicit waiting, download and preparation states. Suggestions use exact folder IDs, failed sessions can be retried, and manual saving remains available. Save errors and partial failures are visible.',
        ],
      },
      {
        heading: 'How to check your version',
        paragraphs: [
          'Open chrome://extensions, find TagChoose and check its version. Chrome normally updates installed extensions automatically after a release is published.',
          'The [[https://chromewebstore.google.com/detail/tagchoose-bookmark-manage/hlfgdfpeekcelanebbfchnnneijhophh|Chrome Web Store listing]] is the source of truth for public availability.',
        ],
      },
    ],
  },
  'updates/explaining-the-ai-not-available-message': {
    title: 'Why TagChoose says AI is not available',
    description:
      'Local AI availability depends on Chrome and your device. Learn what to check while continuing to save bookmarks manually.',
    intro:
      'An unavailable AI message means Chrome cannot currently provide the on-device model with the requested settings. It does not prevent manual folder selection.',
    sections: [
      {
        heading: 'Start with browser and device requirements',
        paragraphs: [
          'Update Google Chrome, check storage and review the [[https://developer.chrome.com/docs/ai/prompt-api#hardware-requirements|official Prompt API requirements]]. Corporate policies and unsupported browsers may prevent model access.',
          'Automatic tagging requires Chrome’s local model. Choose your folders manually to keep saving while it is unavailable. For specific steps, see [[/help/|TagChoose setup and troubleshooting]].',
        ],
      },
    ],
  },
  'updates/understanding-initial-ai-model-download': {
    title: 'Understanding TagChoose’s initial AI model download',
    description:
      'What waiting, download percentage and preparation mean when Chrome sets up the on-device AI model for TagChoose.',
    intro:
      'Chrome downloads the local model separately from the extension. A small extension download does not mean the AI model is already installed.',
    sections: [
      {
        heading: 'Waiting is different from downloading',
        paragraphs: [
          'TagChoose 2 only displays a download percentage after Chrome reports progress. Before then, the popup says it is waiting for setup. After the download reaches 100%, Chrome may still need to prepare the model.',
          'A lack of progress is not proof that a download has failed. Check chrome://on-device-internals, your connection, free disk space and the [[https://developer.chrome.com/docs/ai/prompt-api#hardware-requirements|current model requirements]].',
        ],
      },
      {
        heading: 'Keep using bookmarks while setup runs',
        paragraphs: [
          'Manual folder selection does not require the model. Version 2 lets you keep choosing folders, stop waiting and retry later. Closing the popup ends TagChoose’s current session; reopen it to check Chrome’s current availability.',
          'See the [[/help/|full troubleshooting guide]] if setup remains unresolved.',
        ],
      },
    ],
  },
  'technical-details': {
    title: 'How TagChoose works',
    description:
      'TagChoose uses Chrome bookmarks, tabs and the built-in Prompt API. Learn about permissions, folder IDs, local AI and manual saving.',
    intro:
      'TagChoose is a Manifest V3 extension for desktop Chrome. It uses normal bookmark folders as destinations and Chrome’s built-in local language model for all automatic folder suggestions. Manual folder selection is also available.',
    sections: [
      {
        heading: 'Permissions',
        paragraphs: [
          'The bookmarks permission allows TagChoose to list folders and save or update copies. The tabs permission provides the active page title and URL. No host permissions or content scripts are required.',
        ],
      },
      {
        heading: 'AI and save behavior',
        paragraphs: [
          'The Prompt API runs in the extension popup. Version 2 checks model availability, reports setup progress, validates output against real folder IDs and releases sessions after use.',
          'Version 2 does not delete copies in unselected folders. Selected folders are validated before saving; if Chrome rejects part of the operation, an error explains that the result may be partial.',
        ],
      },
      {
        heading: 'Source and support',
        paragraphs: [
          'Read the [[https://github.com/sauliusp/bookmark-ai-autotagger|source code]] or use the [[/help/|help guide]].',
        ],
      },
    ],
  },
};
