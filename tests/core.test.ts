import { test, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import {
  BookmarkService,
  writableFolders,
} from '../src/services/BookmarkService';
import { AiService, parseFolderIds } from '../src/services/AiService';
import { TabPreviewService } from '../src/services/TabPreviewService';
import { reducer, INITIAL_STATE } from '../src/store/Store';

type Node = chrome.bookmarks.BookmarkTreeNode;
const folder = (id: string, title: string, parentId = '1'): Node => ({
  id,
  title,
  parentId,
  children: [],
});
const tree: Node[] = [
  {
    id: '0',
    title: '',
    children: [
      {
        ...folder('1', 'Bookmarks bar', '0'),
        children: [
          folder('a', 'Design'),
          { ...folder('b', 'Work'), children: [folder('c', 'Design', 'b')] },
          folder('comma', 'Read, later'),
          {
            ...folder('locked', 'Managed'),
            unmodifiable: 'managed',
            children: [folder('locked-child', 'Tools', 'locked')],
          },
        ],
      },
      folder('other', 'Other bookmarks', '0'),
    ],
  },
];
let nodes: Node[] = [];
let writes: string[] = [];
function mockBookmarks() {
  nodes = [
    {
      id: 'old',
      title: 'Old title',
      url: 'https://example.com/',
      parentId: 'a',
    },
    {
      id: 'keep',
      title: 'Keep',
      url: 'https://example.com/',
      parentId: 'other',
    },
  ];
  writes = [];
  const api = {
    getTree: async () => structuredClone(tree),
    search: async () => structuredClone(nodes),
    update: async (id: string, change: object) => {
      writes.push(`update:${id}`);
      Object.assign(
        nodes.find((node) => node.id === id)!,
        change,
      );
    },
    create: async (input: Node) => {
      writes.push(`create:${input.parentId}`);
      nodes.push({ ...input, id: `new-${nodes.length}` });
    },
    remove: async () => {
      throw new Error('Deletion must never be called');
    },
  };
  Object.assign(globalThis, { chrome: { bookmarks: api } });
  return api;
}
afterEach(() => {
  Reflect.deleteProperty(globalThis, 'LanguageModel');
  Reflect.deleteProperty(globalThis, 'chrome');
});
test('folder tree excludes invisible root and managed subtree, includes empty folders and full duplicate-name paths', () => {
  const folders = writableFolders(tree);
  assert.deepEqual(
    folders.map((x) => x.id),
    ['1', 'a', 'b', 'c', 'comma', 'other'],
  );
  assert.equal(
    folders.find((x) => x.id === 'c')?.path,
    'Bookmarks bar / Work / Design',
  );
});
test('saving adds selected copies and never removes unselected bookmarks', async () => {
  mockBookmarks();
  const result = await new BookmarkService().upsertBookmarkInMultipleFolders(
    ['a', 'b', 'b'],
    'New title',
    'https://example.com/',
  );
  assert.deepEqual(result, { updated: 1, created: 1 });
  assert.ok(nodes.some((n) => n.id === 'keep'));
  assert.deepEqual(writes, ['update:old', 'create:b']);
});
test('retries are idempotent and ignore URL search near-matches', async () => {
  mockBookmarks();
  nodes.push({
    id: 'near',
    title: 'Near',
    url: 'https://example.com/other',
    parentId: 'b',
  });
  const service = new BookmarkService();
  await service.upsertBookmarkInMultipleFolders(
    ['b'],
    'New',
    'https://example.com/',
  );
  await service.upsertBookmarkInMultipleFolders(
    ['b'],
    'New',
    'https://example.com/',
  );
  assert.equal(writes.filter((x) => x === 'create:b').length, 1);
  assert.equal(nodes.find((x) => x.id === 'near')?.title, 'Near');
});
test('invalid or missing destinations fail before any writes', async () => {
  mockBookmarks();
  const service = new BookmarkService();
  for (const ids of [
    [],
    ['0'],
    ['missing'],
    ['locked-child'],
    ['a', 'missing'],
  ])
    await assert.rejects(
      service.upsertBookmarkInMultipleFolders(
        ids,
        'Title',
        'https://example.com/',
      ),
    );
  assert.deepEqual(writes, []);
});
test('empty titles and browser/internal/script URLs cannot be saved', async () => {
  mockBookmarks();
  const service = new BookmarkService();
  for (const url of [
    'javascript:alert(1)',
    'chrome://settings',
    'chrome-extension://abc/popup.html',
    'not-url',
  ])
    await assert.rejects(
      service.upsertBookmarkInMultipleFolders(['a'], 'Title', url),
    );
  await assert.rejects(
    service.upsertBookmarkInMultipleFolders(
      ['a'],
      '  ',
      'https://example.com/',
    ),
  );
  assert.deepEqual(writes, []);
});
test('partial failure is surfaced and keeps all preexisting copies', async () => {
  const api = mockBookmarks();
  api.create = async () => {
    throw new Error('write failed');
  };
  await assert.rejects(
    new BookmarkService().upsertBookmarkInMultipleFolders(
      ['a', 'b'],
      'New',
      'https://example.com/',
    ),
    /Saved in 1 location/,
  );
  assert.ok(nodes.some((n) => n.id === 'keep'));
});
test('saved folders are restored atomically, including same-name nested destinations', async () => {
  mockBookmarks();
  nodes.push({
    id: 'nested',
    title: 'Same',
    url: 'https://example.com/',
    parentId: 'c',
  });
  const service = new BookmarkService();
  const saved = await service.getSavedTabByUrl('https://example.com/');
  const next = reducer(INITIAL_STATE, {
    type: 'initialize',
    folders: await service.getAllFolders(),
    saved,
    tab: { title: 'Page', url: 'https://example.com/', faviconUrl: '' },
  });
  assert.deepEqual(next.selectedFolderIds, ['a', 'c', 'other']);
  assert.equal(next.title, 'Old title');
});
test('late AI responses preserve manual edits, and suggestion IDs cannot invent folders', () => {
  const start = reducer(INITIAL_STATE, {
    type: 'initialize',
    folders: writableFolders(tree),
    saved: null,
    tab: { title: 'Test', url: 'https://example.com/', faviconUrl: '' },
  });
  const edited = reducer(start, { type: 'select', ids: ['c'] });
  const late = reducer(edited, {
    type: 'suggest',
    ids: ['a', 'missing'],
    revision: 0,
    title: start.title,
  });
  assert.deepEqual(late.selectedFolderIds, ['c']);
  assert.deepEqual(late.suggestedFolderIds, ['a']);
  const timely = reducer(edited, {
    type: 'suggest',
    ids: ['comma', 'c'],
    revision: 1,
    title: start.title,
  });
  assert.deepEqual(timely.selectedFolderIds, ['c', 'comma']);
});
test('AI JSON supports comma-bearing and duplicate folder names by exact ID', () => {
  assert.deepEqual(
    parseFolderIds('```json\n["comma","c","c","fake"]\n```', ['comma', 'c']),
    ['comma', 'c'],
  );
  for (const bad of ['Design, Work', '{"ids":["c"]}', '[4]', 'null'])
    assert.throws(() => parseFolderIds(bad, ['c']));
  assert.deepEqual(parseFolderIds('[]', ['c']), []);
});
test('missing API is unavailable; failed availability remains an unknown error', async () => {
  assert.equal(await new AiService().getAiCapabilities(), 'unavailable');
  Object.assign(globalThis, {
    LanguageModel: {
      availability: async () => {
        throw new Error('No model');
      },
    },
  });
  await assert.rejects(new AiService().getAiCapabilities(), /No model/);
});
test('create uses explicit languages, forwards download progress, retains setup session, and destroys after inference', async () => {
  let creates = 0,
    destroys = 0;
  const progress: number[] = [];
  Object.assign(globalThis, {
    LanguageModel: {
      availability: async () => 'available',
      create: async (options: {
        expectedOutputs: object[];
        monitor: (m: {
          addEventListener: (
            name: string,
            callback: (event: { loaded: number }) => void,
          ) => void;
        }) => void;
      }) => {
        creates++;
        assert.deepEqual(options.expectedOutputs, [
          { type: 'text', languages: ['en'] },
        ]);
        options.monitor({
          addEventListener: (
            _: string,
            callback: (event: { loaded: number }) => void,
          ) => {
            callback({ loaded: 0 });
            callback({ loaded: 0.5 });
            callback({ loaded: 1 });
          },
        });
        return {
          prompt: async (input: string) => {
            assert.ok(input.includes('Read, later'));
            return '["comma"]';
          },
          destroy: () => {
            destroys++;
          },
        };
      },
    },
  });
  const service = new AiService();
  await service.getSession((value) => progress.push(value));
  assert.deepEqual(
    await service.runPrompt({
      title: 'Test',
      url: 'https://example.com',
      folders: writableFolders(tree),
    }),
    ['comma'],
  );
  assert.equal(creates, 1);
  assert.equal(destroys, 1);
  assert.deepEqual(progress, [0, 0.5, 1]);
});
test('failed inference releases session so retry can recover', async () => {
  let attempts = 0,
    destroys = 0;
  Object.assign(globalThis, {
    LanguageModel: {
      create: async () => ({
        prompt: async () => {
          if (++attempts === 1) throw new Error('failed');
          return '["a"]';
        },
        destroy: () => {
          destroys++;
        },
      }),
    },
  });
  const service = new AiService();
  const payload = {
    title: 'Title',
    url: 'https://example.com',
    folders: writableFolders(tree),
  };
  await assert.rejects(service.runPrompt(payload));
  assert.deepEqual(await service.runPrompt(payload), ['a']);
  assert.equal(destroys, 2);
});
test('oversized folder libraries return an actionable error instead of omitting folders', async () => {
  await assert.rejects(
    new AiService().runPrompt({
      title: 'Title',
      url: 'https://example.com',
      folders: [{ id: 'x', title: 'x'.repeat(25000) }],
    }),
    /too many folder names/,
  );
});
test('tabs use URL for absent titles and never request remote favicon images', async () => {
  Object.assign(globalThis, {
    chrome: {
      tabs: {
        query: async () => [
          {
            url: 'https://example.com',
            title: '',
            favIconUrl: 'https://tracking.example/icon.png',
          },
        ],
      },
    },
  });
  assert.deepEqual(await new TabPreviewService().getCurrentTabPreview(), {
    url: 'https://example.com',
    title: 'https://example.com',
    faviconUrl: '',
  });
});
test('editing a prompt title or starting a save invalidates automatic application of an earlier AI response', () => {
  const initial = {
    ...INITIAL_STATE,
    folders: [
      { id: 'a', title: 'Research' },
      { id: 'b', title: 'Design' },
    ],
    selectedFolderIds: ['a'],
  };
  for (const action of [
    { type: 'title', value: 'New subject' },
    { type: 'save-start' },
  ] as const) {
    const changed = reducer(initial, action);
    const result = reducer(changed, {
      type: 'suggest',
      ids: ['b'],
      revision: initial.selectionRevision,
      title: initial.title,
    });
    assert.deepEqual(result.selectedFolderIds, ['a']);
    assert.deepEqual(result.suggestedFolderIds, action.type === 'title' ? [] : ['b']);
  }
});
test('a successful first save keeps the page in existing-bookmark mode after edits', () => {
  const saved = reducer(INITIAL_STATE, { type: 'save-success' });
  assert.equal(saved.saved, true);
  assert.equal(reducer(saved, { type: 'title', value: 'Edited' }).saved, true);
});
test('duplicate bookmarks in one folder remain intact and count as one destination', async () => {
  mockBookmarks();
  nodes.push({
    id: 'duplicate',
    title: 'Older duplicate',
    url: 'https://example.com/',
    parentId: 'a',
  });
  const result = await new BookmarkService().upsertBookmarkInMultipleFolders(
    ['a'],
    'Updated',
    'https://example.com/',
  );
  assert.deepEqual(result, { updated: 1, created: 0 });
  assert.equal(nodes.filter((node) => node.parentId === 'a').length, 2);
  assert.equal(nodes.find((node) => node.id === 'duplicate')?.title, 'Updated');
});
test('changing the title discards only automatically selected folders before the next suggestion', () => {
  const start = {
    ...INITIAL_STATE,
    title: 'Research',
    folders: ['manual', 'old', 'new'].map((id) => ({ id, title: id })),
    selectedFolderIds: ['manual'],
  };
  const suggested = reducer(start, { type: 'suggest', title: start.title, revision: 0, ids: ['old', 'manual'] });
  assert.deepEqual(suggested.autoSelectedFolderIds, ['old']);
  const edited = reducer(suggested, { type: 'title', value: 'Design' });
  assert.deepEqual(edited.selectedFolderIds, ['manual']);
  const refreshed = reducer(edited, { type: 'suggest', title: edited.title, revision: edited.selectionRevision, ids: ['new'] });
  assert.deepEqual(refreshed.selectedFolderIds, ['manual', 'new']);
});
test('removing then manually restoring an AI folder makes it a retained manual choice', () => {
  const start = { ...INITIAL_STATE, folders: [{ id: 'a', title: 'A' }] };
  const suggested = reducer(start, { type: 'suggest', title: start.title, revision: 0, ids: ['a'] });
  const removed = reducer(suggested, { type: 'select', ids: [] });
  const restored = reducer(removed, { type: 'select', ids: ['a'] });
  assert.deepEqual(reducer(restored, { type: 'title', value: 'New title' }).selectedFolderIds, ['a']);
});
test('save keeps explicitly accepted AI locations and unlocks navigation when the operation ends', () => {
  const start = { ...INITIAL_STATE, selectedFolderIds: ['a'], autoSelectedFolderIds: ['a'] };
  const saving = reducer(start, { type: 'save-start' });
  assert.equal(saving.saving, true);
  const ended = reducer(saving, { type: 'save-end' });
  assert.equal(ended.saving, false);
  assert.deepEqual(reducer(ended, { type: 'title', value: 'Edited after save' }).selectedFolderIds, ['a']);
});
