import { describe, it, expect, beforeEach, vi } from 'vitest';
import VisualController from '../src/main.js';
import * as svelte from 'svelte';
import App from '../demo/App.svelte';

vi.mock('svelte', () => ({
  mount: vi.fn(() => ({})),
  unmount: vi.fn(),
}));

describe ( 'VisualController for Svelte 5', () => {

  let containerId = 'test-container';

  beforeEach(() => {
    document.body.innerHTML = `<div id="${containerId}"></div>`;
    vi.clearAllMocks();
  });

  it ( 'Publish a component to a container', async () => {
    const vc = new VisualController();
    const promise = vc.publish(App, { message: 'test message' }, containerId);
    const updates = await promise;

    expect(svelte.mount).toHaveBeenCalled();
    expect(svelte.mount).toHaveBeenCalledWith(App, expect.objectContaining({
      target: document.getElementById(containerId),
      props: expect.objectContaining({
        message: 'test message',
        setupUpdates: expect.any(Function),
      }),
    }));
    expect(updates).toBeDefined();
    expect(typeof updates).toBe('object');
  });


  it ( 'Replaces existing component without calling destroy', async () => {
    const vc = new VisualController();

    await vc.publish(App, {}, containerId);
    svelte.mount.mockClear();

    await vc.publish(App, {}, containerId);

    expect(svelte.unmount).toHaveBeenCalled();
    expect(svelte.mount).toHaveBeenCalledTimes(1);
  });


  it ( 'Destroy a published app', async () => {
    const vc = new VisualController();
    await vc.publish(App, {}, containerId);

    const destroyed = vc.destroy(containerId);
    expect(destroyed).toBe(true);
    expect(svelte.unmount).toHaveBeenCalled();
    expect(vc.has(containerId)).toBe(false);
  });


  it ( 'Test for existing app', () => {
    const vc = new VisualController();
    vc.publish(App, {}, containerId);

    expect(vc.has(containerId)).toBe(true);
  });


  it ( 'Test for non-existent app', () => {
    const vc = new VisualController();

    expect(vc.has('non-existent')).toBe(false);
  });


  it ( 'Fail to destroy non-existent app', () => {
    const vc = new VisualController();

    const result = vc.destroy('non-existent-app');

    expect(result).toBe(false);
    expect(svelte.unmount).not.toHaveBeenCalled();
  });


  it ( 'Updates a published app', async () => {
    const vc = new VisualController();
    await vc.publish(App, {}, containerId);

    const updates = vc.getApp(containerId);
    expect(updates).toBeDefined();
    expect(typeof updates).toBe('object');
  });


  it ( 'Fail to get non-existent app', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const vc = new VisualController();

    const result = vc.getApp('non-existent-app');

    expect(consoleSpy).toHaveBeenCalledWith('App with id: "non-existent-app" was not found');
    expect(result).toBe(false);
  });


  it ( 'Fails when Component is undefined', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const vc = new VisualController();

    const result = await vc.publish(undefined, {}, containerId);

    expect(consoleSpy).toHaveBeenCalledWith('Error: Component is undefined');
    expect(result).toBe(false);
    expect(svelte.mount).not.toHaveBeenCalled();
  });


  it ( 'Fails when container does not exist', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const vc = new VisualController();

    const result = await vc.publish(App, {}, 'non-existent-container');

    expect(consoleSpy).toHaveBeenCalledWith('Can\'t find node with id: "non-existent-container"');
    expect(result).toBe(false);
    expect(svelte.mount).not.toHaveBeenCalled();
  });

}) // describe