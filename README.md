# Kanban Board

A fast, single-page Kanban board for organizing tasks across stages of work. Built with **Vite + React 19 + TypeScript**, state managed by **zustand**, drag-and-drop powered by **@dnd-kit**, and styled with **SCSS Modules**. Your board is saved automatically to the browser's `localStorage`, so it survives refreshes.

## Features

- **Four default columns** — To Do, In Progress, In Review, and Done. Columns are data-driven, so adding a new lane is a one-line change.
- **Rich task cards** — each task has a title, description, priority, assignee, and creation timestamp.
- **Priority levels** — Low, Medium, High, and Urgent, each with its own accent color on the card.
- **Create / edit / delete** — a modal form with full validation handles all task changes.
- **Drag and drop** — reorder cards within a column or move them across columns. Reordering is computed against the real (unfiltered) board, so it stays correct even while a filter is active.
- **Search and filter** — filter the board by free-text search (title/description/assignee) combined with a priority filter.
- **Automatic persistence** — the board is debounced-saved to `localStorage` behind a swappable storage port, so swapping in a real API later means changing one file.

## Tech stack

| Concern     | Choice                                      |
| ----------- | ------------------------------------------- |
| Build tool  | Vite 8                                      |
| UI          | React 19 (StrictMode)                       |
| Language    | TypeScript (project references)             |
| State       | zustand                                     |
| Drag & drop | @dnd-kit (core + sortable)                  |
| Styling     | SCSS Modules + shared design tokens         |
| Linting     | ESLint 10 (flat config) + typescript-eslint |

## Getting started

### Prerequisites

- **Node.js 20.19+ or 22.12+** (required by Vite 8)
- **npm** (ships with Node)

### Install

```bash
npm install
```

### Run the dev server

```bash
npm run dev
```

Vite prints a local URL (default <http://localhost:5173>). Open it in your browser; HMR reloads changes instantly.

### Other commands

| Command           | What it does                                                        |
| ----------------- | ------------------------------------------------------------------- |
| `npm run dev`     | Start the Vite dev server with hot-module reloading.                |
| `npm run build`   | Type-check (`tsc -b`) then produce a production build in `dist/`.   |
| `npm run preview` | Serve the built `dist/` locally to verify the production bundle.    |
| `npm run lint`    | Run ESLint over the repo.                                           |

## How to use the board

1. **Add a task** — click **Add Task** in the toolbar, fill in the form, and save. New tasks land in the first column.
2. **Edit a task** — click a card to open it in the modal, change any field, and save.
3. **Delete a task** — use the delete action in the task modal.
4. **Move a task** — drag a card to reorder it within a column or drop it into another column.
5. **Find tasks** — type in the search box and/or pick a priority to narrow what's shown. Clearing the filters restores the full board.

Everything you do is saved automatically — reload the page and your board is still there.

## Project structure

```text
src/
├─ types/         TypeScript interfaces (task, column, filters)
├─ constants/     priorities, default columns, first-load seed tasks
├─ services/      storage port — BoardStorage interface + localStorage impl
├─ store/         zustand board store + pure DnD reorder helper
├─ hooks/         useHydrateBoard (load on mount), useFilteredTasks (memoized)
├─ utils/         id, date, filterTasks, validateTask (pure, testable)
├─ components/
│  ├─ ui/         reusable primitives (Button, Modal, Field, PriorityBadge)
│  └─ ...         feature components (Board, Column, TaskCard, TaskModal, Toolbar, KanbanApp)
└─ styles/        design tokens, mixins, global styles
```

## Architecture notes

- **Single source of truth** — columns, tasks, filters, and modal state all live in one zustand store (`src/store/boardStore.ts`). New board state should go here rather than into Context or component state.
- **Swappable persistence** — the store and UI never touch `localStorage` directly. They depend on the `BoardStorage` interface; the active implementation is the single `boardStorage` export in `src/services/storage/index.ts`. Point that at an API client to migrate off the browser.
- **Filter-safe drag-and-drop** — `Board.handleDragEnd` computes the reorder against the unfiltered store order and applies it via `moveTask`, so dragging behaves correctly even with filters applied.
- **ESM-only + TypeScript project references** — config files are ESM (`.js`/`.ts`); add compiler options to `tsconfig.app.json` (app code) or `tsconfig.node.json` (tooling), not the referencing root `tsconfig.json`.

There is no test runner configured yet. If you add one, wire it into `package.json` scripts.
