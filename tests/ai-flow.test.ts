import { test } from 'node:test';
import assert from 'node:assert/strict';
import { AiFlow } from '../src/services/AiFlow';
import {
  AiService,
  AiAvailability,
  DownloadProgressCallback,
} from '../src/services/AiService';
const tick = () => new Promise((resolve) => setTimeout(resolve, 0));
class ControlledAi extends AiService {
  availability: AiAvailability = 'downloadable';
  progress: DownloadProgressCallback | undefined;
  resolveSetup:
    | ((value: { prompt: () => Promise<string>; destroy: () => void }) => void)
    | undefined;
  setupFailure: ((error: Error) => void) | undefined;
  creates = 0;
  destroyed = 0;
  promptResult: Promise<string[]> = Promise.resolve(['a']);
  override async getAiCapabilities() {
    return this.availability;
  }
  override getSession(progress?: DownloadProgressCallback) {
    this.creates++;
    this.progress = progress;
    return new Promise<{ prompt: () => Promise<string>; destroy: () => void }>(
      (resolve, reject) => {
        this.resolveSetup = resolve;
        this.setupFailure = reject;
      },
    );
  }
  ready() {
    this.resolveSetup?.({ prompt: async () => '["a"]', destroy: () => {} });
  }
  override async runPrompt() {
    return this.promptResult;
  }
  override destroy() {
    this.destroyed++;
  }
}
const payload = {
  title: 'CSS reference',
  url: 'https://example.com/css',
  folders: [{ id: 'a', title: 'Web development' }],
};
test('first visit checks availability without starting a download', async () => {
  const service = new ControlledAi();
  const flow = new AiFlow(service);
  await flow.check();
  assert.equal(flow.state.phase, 'downloadable');
  assert.equal(service.creates, 0);
  flow.dispose();
});
test('setup distinguishes waiting, actual progress, 100 percent preparation and ready', async () => {
  const service = new ControlledAi();
  const flow = new AiFlow(service);
  await flow.check();
  const pending = flow.run();
  assert.equal(flow.state.phase, 'waiting');
  assert.equal(flow.state.progress, null);
  service.progress?.(0);
  assert.equal(flow.state.phase, 'downloading');
  service.progress?.(0.45);
  assert.equal(flow.state.progress, 0.45);
  service.progress?.(1);
  assert.equal(flow.state.phase, 'preparing');
  assert.notEqual(flow.state.phase, 'ready');
  service.ready();
  await pending;
  assert.equal(flow.state.phase, 'ready');
  flow.dispose();
});
test('unavailable and already-downloading are distinct initial states', async () => {
  for (const availability of [
    'unavailable',
    'downloading',
    'available',
  ] as const) {
    const service = new ControlledAi();
    service.availability = availability;
    const flow = new AiFlow(service);
    await flow.check();
    assert.equal(
      flow.state.phase,
      availability === 'available' ? 'ready' : availability,
    );
    assert.equal(service.creates, 0);
    flow.dispose();
  }
});
test('idle download shows lack of progress, then recovers when progress resumes', async () => {
  const service = new ControlledAi();
  const flow = new AiFlow(service, 5);
  await flow.check();
  const pending = flow.run();
  await new Promise((resolve) => setTimeout(resolve, 12));
  assert.equal(flow.state.stalled, true);
  assert.equal(flow.state.phase, 'waiting');
  service.progress?.(0.2);
  assert.equal(flow.state.stalled, false);
  service.ready();
  await pending;
  flow.dispose();
});
test('cancel releases UI even if the native create promise never settles; retry works', async () => {
  const service = new ControlledAi();
  const flow = new AiFlow(service);
  await flow.check();
  const pending = flow.run();
  flow.cancel();
  await pending;
  assert.equal(flow.state.phase, 'cancelled');
  const retry = flow.run();
  assert.equal(service.creates, 2);
  service.ready();
  await retry;
  assert.equal(flow.state.phase, 'ready');
  flow.dispose();
});
test('inference begins only after setup and completion carries validated destinations', async () => {
  const service = new ControlledAi();
  const flow = new AiFlow(service);
  await flow.check();
  const pending = flow.run(payload);
  service.progress?.(1);
  assert.equal(flow.state.phase, 'preparing');
  service.ready();
  await pending;
  assert.equal(flow.state.phase, 'complete');
  assert.deepEqual(flow.state.ids, ['a']);
  flow.dispose();
});
test('inference timeout cancels a hung prompt without claiming the model is unsupported', async () => {
  const service = new ControlledAi();
  service.promptResult = new Promise(() => {});
  const flow = new AiFlow(service, 20, 5);
  await flow.check();
  const pending = flow.run(payload);
  service.ready();
  await pending;
  assert.equal(flow.state.phase, 'cancelled');
  assert.match(flow.state.message, /too long/);
  flow.dispose();
});
test('download errors are actionable and retry starts a new operation', async () => {
  const service = new ControlledAi();
  const flow = new AiFlow(service);
  await flow.check();
  const pending = flow.run();
  service.setupFailure?.(
    new Error(
      'Chrome could not download the model. Check your connection and retry.',
    ),
  );
  await pending;
  assert.equal(flow.state.phase, 'error');
  assert.match(flow.state.message, /connection/);
  const retry = flow.run();
  service.ready();
  await retry;
  assert.equal(flow.state.phase, 'ready');
  flow.dispose();
});
test('leaving setup prevents late progress and completion from updating a closed interface', async () => {
  const service = new ControlledAi();
  const flow = new AiFlow(service);
  await flow.check();
  const seen: string[] = [];
  flow.subscribe((state) => seen.push(state.phase));
  const pending = flow.run();
  flow.dispose();
  const count = seen.length;
  service.progress?.(1);
  service.ready();
  await pending;
  await tick();
  assert.equal(seen.length, count);
});
test('reopening does a fresh availability check instead of restoring a stale ready flag', async () => {
  const service = new ControlledAi();
  service.availability = 'available';
  const first = new AiFlow(service);
  await first.check();
  assert.equal(first.state.phase, 'ready');
  first.dispose();
  service.availability = 'downloadable';
  const reopened = new AiFlow(service);
  await reopened.check();
  assert.equal(reopened.state.phase, 'downloadable');
  reopened.dispose();
});
test('a stuck availability check ends without misreporting unsupported hardware', async () => {
  const service = new ControlledAi();
  service.getAiCapabilities = () => new Promise(() => {});
  const flow = new AiFlow(service, 20, 20, 5);
  await flow.check();
  assert.equal(flow.state.phase, 'error');
  assert.match(flow.state.message, /did not confirm/);
  assert.equal(service.creates, 0);
  flow.dispose();
});
test('ready model initialization events do not pretend a new download is required', async () => {
  const service = new ControlledAi();
  service.availability = 'available';
  const flow = new AiFlow(service);
  await flow.check();
  const pending = flow.run();
  service.progress?.(0);
  assert.equal(flow.state.phase, 'preparing');
  service.ready();
  await pending;
  assert.equal(flow.state.phase, 'ready');
  flow.dispose();
});
test('queued progress cannot resurrect a cancelled download or its stall timer', async () => {
  const service = new ControlledAi();
  const flow = new AiFlow(service, 5);
  await flow.check();
  const pending = flow.run();
  flow.cancel();
  await pending;
  service.progress?.(0.9);
  await new Promise((resolve) => setTimeout(resolve, 12));
  assert.equal(flow.state.phase, 'cancelled');
  assert.equal(flow.state.stalled, false);
  flow.dispose();
});
