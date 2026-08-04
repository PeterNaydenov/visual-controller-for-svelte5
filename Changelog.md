# Release History



## 3.0.0 (2026-08-04)
- [x] **Breaking change.** v3 is region-only. The `id`-based API (`publish(component, data, containerID)` etc.) is removed. Regions are defined via the new `set` method, which mirrors `dim.set` exactly.
- [x] New API: `set`, `publish(alias, component, data?, extraParams?)`, `destroy`, `has`, `getApp`, `isEmpty`, `list`, `reset`.
- [x] `destroy()` is now polymorphic — accepts no argument (destroys every published app across all aliases, returns the count), an alias string (existing behavior), or an array of alias strings (destroys each, silently skips missing ones, returns the count). Markers stay in the DOM in every form.
- [x] Multiple placeholders can coexist inside a single parent without DOM `id` collisions — selection is by alias returned from the `set` callback.
- [x] Destroying an app empties the region but keeps the markers, so the same alias can host a different app later.
- [x] Mount container is a bare `<span style="display:contents">` — invisible to layout, no DOM wrapper authored by the user.
- [x] Added `peerDependencies.svelte: ^5.0.0` to `package.json`.
- [x] **`@peter.naydenov/dim` dependency removed.** The minimal subset of dim the controller actually uses (`set` / `get` / `reset` / `aliases` on the dim instance, plus `isEmpty` on the range API) is now inlined as `src/dim.js`. The file header documents the relationship to the official `@peter.naydenov/dim` package and points at the source of truth for syncing if the upstream API changes.
- [x] SSR hydration preserved: when the range already contains content at publish time, the controller picks it as the mount target (single element → direct mount, multiple siblings → wrapped in a mount span) and uses Svelte 5's `mount`. The existing DOM is kept in place.
- [x] `isEmpty(alias)` delegates to dim's `range.isEmpty()` — returns `true` for collapsed or orphaned ranges, `undefined` for unknown aliases.
- [x] `extraParams` slot accepted but ignored — reserved for future use.
- [x] Demo rewritten to match the v3 region model (header + sidebar apps in a single `<main>`, with controls for update, increment, swap, destroy×2, reset).
- [x] README rewritten to match the v3 API; `Migration.guide.md` added for the v2 → v3 transition.



## 1.1.1 (2026-07-22)
- [x] Dependency update. 'ask-for-promise' from 3.2.0;
- [x] Dev dependency update. Typescript v.7.0.2;



## 1.1.0 (2026-04-14)
- [x] Convert from 'class' to 'functional' approach;
- [x] Adding 'jsdoc' description to the library;
- [x] Build d.ts file based on JSDoc;
- [x] Add test coverage;



## 1.0.2 (2025-10-24)
- [x] Dependency update. 'ask-for-promise' from 3.1.0



## 1.0.1 (2025-10-16)
- [x] Dependency update. 'ask-for-promise' from 3.0.1 to 3.0.2



## 1.0.0 (2024-12-21)
- [x] Code;
- [x] Documentation;
