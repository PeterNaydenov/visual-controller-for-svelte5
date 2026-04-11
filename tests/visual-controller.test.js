import { describe, it, expect, beforeEach, vi } from 'vitest';
import VisualController from '../src/main.js';
import * as svelte from 'svelte';

// Mock svelte's mount and unmount
vi.mock('svelte', () => ({
  mount: vi.fn(() => ({})), // Return a simple object representing the app
  unmount: vi.fn(),
}));

describe('VisualController', () => {
  let html;
  let containerId = 'test-container';

  beforeEach(() => {
    // Reset DOM and mocks
    document.body.innerHTML = `<div id="${containerId}"></div>`;
    vi.clearAllMocks();
    html = new VisualController({});
  });

  it('should publish a component to a container', async () => {
    const MockComponent = {}; 
    const promise = html.publish(MockComponent, { foo: 'bar' }, containerId);
    const updates = await promise;

    expect(svelte.mount).toHaveBeenCalled();
    expect(html.has(containerId)).toBe(true);
    expect(typeof updates).toBe('object');
  });

  it('should destroy a published app', async () => {
    const MockComponent = {};
    const promise = html.publish(MockComponent, {}, containerId);
    await promise;

    const destroyed = html.destroy(containerId);
    expect(destroyed).toBe(true);
    expect(svelte.unmount).toHaveBeenCalled();
    expect(html.has(containerId)).toBe(false);
  });

  it('should return false when destroying a non-existent app', () => {
    const destroyed = html.destroy('non-existent');
    expect(destroyed).toBe(false);
  });

  it('should get updates from a published app', async () => {
    const MockComponent = {};
    const promise = html.publish(MockComponent, {}, containerId);
    await promise;

    const controls = html.getApp(containerId);
    expect(controls).toBeDefined();
  });

  it('should return false when getting a non-existent app', () => {
    const controls = html.getApp('non-existent');
    expect(controls).toBe(false);
  });
});
