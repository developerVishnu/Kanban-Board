# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project state

A **working Kanban board** built on Vite + React 19 + TypeScript. Features: 4 default columns (To Do / In Progress / In Review / Done, easily extended), task cards with title/description/priority/assignee/timestamp and priority-keyed colors, a create/edit/delete modal with full validation, drag-and-drop (reorder + cross-column) via `@dnd-kit`, combined search + priority filtering, and localStorage persistence behind a swappable storage port. State lives in a single **zustand** store; styling is **SCSS Modules** with shared tokens. Prefer zustand over Redux/Context for any new board state.

## Folder structure (`src/`)

- `types/` — TypeScript interfaces, one concept per file (`task`, `column`, `filters`), re-exported from `index.ts`. Import types from `../types`.
- `constants/` — `priorities` (metadata map driving colors/sorting/select), `columns` (default lanes), `seed` (first-load sample tasks).
- `services/storage/` — **persistence port**. `BoardStorage` interface + `LocalStorageBoardStorage` impl. Swap the single `boardStorage` export in `index.ts` to migrate to an API; the store/UI never touch localStorage directly.
- `store/` — `boardStore.ts` (zustand: columns, tasks, filters, modal state + actions). `arrangement.ts` holds the pure `moveTaskInList` DnD reorder helper. Persistence is wired via a debounced `subscribe` at the bottom of the store.
- `hooks/` — `useHydrateBoard` (loads snapshot on mount), `useFilteredTasks` (memoized tasks-by-column).
- `utils/` — `id`, `date`, `filterTasks`, `validateTask` (pure, testable).
- `components/ui/` — reusable primitives (`Button`, `Modal`, `Field/{TextField,TextArea,Select}`, `PriorityBadge`), each a folder with `.tsx` + `.module.scss` + `index.ts`.
- `components/` — feature components (`Board` owns the DndContext, `Column`, `TaskCard`, `TaskModal` + `TaskForm`, `Toolbar`, `KanbanApp` top-level).
- `styles/` — `_variables.scss` (design tokens), `_mixins.scss`, `global.scss` (imported once in `main.tsx`).

**DnD note:** drag reorder is computed in `Board.handleDragEnd` against the *real* (unfiltered) store order and applied via `moveTask`, so state stays correct even with active filters. SCSS color functions use the modern `sass:color` module (not deprecated globals like `lighten`).

## Commands

- `npm run dev` — start the Vite dev server with HMR
- `npm run build` — type-check (`tsc -b`) then produce a production build in `dist/`
- `npm run lint` — run ESLint over the repo
- `npm run preview` — serve the built `dist/` locally

There is no test runner configured yet. If adding one, wire it into `package.json` scripts.

## Architecture notes

- **ESM-only project** (`"type": "module"` in package.json). Use `import`/`export`; config files are `.js`/`.ts` ESM.
- **TypeScript project references**: `tsconfig.json` is a thin referencing root that delegates to `tsconfig.app.json` (browser/`src` code) and `tsconfig.node.json` (Vite/tooling config). Add compiler options to the appropriate child config, not the root. `tsc -b` builds via these references.
- **React 19** with `StrictMode`, mounted in `src/main.tsx` via `createRoot` into `#root` (see `index.html`).
- **Static assets in `public/`** (e.g. `icons.svg`, `favicon.svg`) are referenced by absolute root paths like `/icons.svg#documentation-icon`. Assets imported from `src/assets/` go through Vite's bundler instead.
- ESLint uses flat config (`eslint.config.js`) with `typescript-eslint`, `react-hooks`, and `react-refresh` rules; `dist` is ignored. The README documents how to upgrade to type-aware lint rules if needed.
