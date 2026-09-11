import { AiService, AiAvailability, aiService } from './AiService';
import { PromptPayload } from '../types/PromptPayload';
export type AiPhase =
  | 'checking'
  | 'unavailable'
  | 'downloadable'
  | 'downloading'
  | 'waiting'
  | 'preparing'
  | 'ready'
  | 'suggesting'
  | 'complete'
  | 'cancelled'
  | 'error';
export interface AiState {
  phase: AiPhase;
  progress: number | null;
  stalled: boolean;
  message: string;
  ids: string[];
}
export const initialAiState: AiState = {
  phase: 'checking',
  progress: null,
  stalled: false,
  message: '',
  ids: [],
};
export class AiFlow {
  state: AiState = { ...initialAiState };
  private listeners = new Set<(state: AiState) => void>();
  private controller: AbortController | null = null;
  private stallTimer: ReturnType<typeof setTimeout> | undefined;
  private limitTimer: ReturnType<typeof setTimeout> | undefined;
  private generation = 0;
  constructor(
    private service: AiService = aiService,
    private stallMs = 20000,
    private inferenceMs = 45000,
  ) {}
  subscribe(listener: (state: AiState) => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }
  private set(patch: Partial<AiState>) {
    this.state = { ...this.state, ...patch };
    this.listeners.forEach((listener) => listener(this.state));
  }
  async check() {
    const generation = ++this.generation;
    this.set({ ...initialAiState });
    try {
      const result = await this.service.getAiCapabilities();
      if (generation === this.generation)
        this.set({ phase: result === 'available' ? 'ready' : result });
    } catch {
      if (generation === this.generation)
        this.set({
          phase: 'error',
          message: 'Could not check local AI. Retry the compatibility check.',
        });
    }
  }
  private watchProgress() {
    clearTimeout(this.stallTimer);
    this.stallTimer = setTimeout(
      () => this.set({ stalled: true }),
      this.stallMs,
    );
  }
  async run(payload?: PromptPayload) {
    if (this.controller) return;
    const controller = new AbortController();
    this.controller = controller;
    const generation = ++this.generation;
    const availability = this.state.phase;
    this.set({
      phase:
        availability === 'ready' || availability === 'complete'
          ? 'preparing'
          : 'waiting',
      message: '',
      progress: null,
      stalled: false,
      ids: [],
    });
    this.watchProgress();
    // Race native promises against cancellation: even a hung browser API must not trap the interface.
    const cancelled = new Promise<never>((_, reject) =>
      controller.signal.addEventListener(
        'abort',
        () => reject(new DOMException('Cancelled', 'AbortError')),
        { once: true },
      ),
    );
    try {
      await Promise.race([
        this.service.getSession((progress) => {
          if (generation !== this.generation) return;
          this.set({
            progress,
            phase: progress < 1 ? 'downloading' : 'preparing',
            stalled: false,
          });
          this.watchProgress();
        }, controller.signal),
        cancelled,
      ]);
      if (generation !== this.generation) return;
      clearTimeout(this.stallTimer);
      this.set({ phase: 'ready', stalled: false });
      if (payload) {
        this.set({ phase: 'suggesting' });
        this.limitTimer = setTimeout(
          () => controller.abort('timeout'),
          this.inferenceMs,
        );
        const ids = await Promise.race([
          this.service.runPrompt(payload, controller.signal),
          cancelled,
        ]);
        if (generation === this.generation)
          this.set({
            phase: 'complete',
            ids,
            message: ids.length
              ? 'AI suggestions are ready. Review or change the folders, then save.'
              : 'AI found no confident match. Review the page and choose the folders that fit.',
          });
      }
    } catch (error) {
      if (generation === this.generation)
        this.set({
          phase: controller.signal.aborted ? 'cancelled' : 'error',
          stalled: false,
          message:
            controller.signal.reason === 'timeout'
              ? 'AI took too long to respond. Retry the suggestions.'
              : controller.signal.aborted
                ? 'Stopped waiting. Your bookmarks were not changed. You can retry setup or suggestions.'
                : error instanceof Error
                  ? error.message
                  : 'Local AI could not complete. Retry or open setup help.',
        });
    } finally {
      if (generation === this.generation) {
        this.clearTimers();
        this.controller = null;
        this.service.destroy();
      }
    }
  }
  cancel() {
    this.controller?.abort();
  }
  private clearTimers() {
    clearTimeout(this.stallTimer);
    clearTimeout(this.limitTimer);
  }
  dispose() {
    ++this.generation;
    this.controller?.abort();
    this.controller = null;
    this.clearTimers();
    this.service.destroy();
    this.listeners.clear();
  }
}
export const availabilityPhase = (availability: AiAvailability): AiPhase =>
  availability === 'available' ? 'ready' : availability;
