# Implementation Plan: Web Expense Tracker (บันทึกรายรับ-รายจ่าย)

**Branch**: `team-1` | **Date**: 2026-09-20 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-web-expense-tracker/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command; its definition describes the execution workflow.

## Summary

A single-page income/expense tracker: add entries (name, amount, type, category), see them newest-first in green/red with a live 3-value summary (income, expense, balance), filter by type, edit name/amount inline, delete with confirmation, clear all, and keep everything across refreshes.

Technical approach: edit the base template's root `index.html`, `style.css` and `app.js` in place. A single `state` object (`items`, `filter`, transient `editing`) is the source of truth and `render()` is the only function that draws data. Amounts are stored as integer satang so totals always match the displayed lines. Only `items` is persisted to `localStorage`, with defensive loading so bad stored data yields the empty state. Decisions and alternatives are in [research.md](./research.md).

## Technical Context

**Language/Version**: HTML5, CSS3, ECMAScript 2020+ (vanilla, no transpiling)

**Primary Dependencies**: None (standard browser APIs only: DOM, `localStorage`, `Intl.NumberFormat`)

**Storage**: Browser `localStorage`, key `sdd-team-1-expense`, value `{ "items": [...] }` — see [contracts/storage-contract.md](./contracts/storage-contract.md)

**Testing**: Manual, browser-based, following [quickstart.md](./quickstart.md); no test framework (Principle I forbids packages/build tooling)

**Target Platform**: Current evergreen browsers on desktop and mobile; opens via `file://` and static hosting (e.g. Vercel, `python3 -m http.server`)

**Project Type**: Single-page static web app (no backend)

**Performance Goals**: Every action reflected on screen immediately (full re-render of the list per action is sufficient); interactive at ≥ 50 entries (SC-003)

**Constraints**: No frameworks, no build step, no network calls, no authentication; flat root-level files; must fit the 75-minute build session

**Scale/Scope**: One user, one browser, tens to low hundreds of entries; 1 page, 5 user stories, 23 functional requirements

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Source: `.specify/memory/constitution.md` v1.2.0.

| Principle | Gate | Pre-research | Post-design |
|---|---|---|---|
| I. Simplicity First | Vanilla HTML/CSS/JS only; no framework, bundler, compiler | ✅ | ✅ No dependencies; `Intl.NumberFormat` and `confirm()` are standard browser APIs |
| II. Storage Constraint | `localStorage` only; no backend/network persistence | ✅ | ✅ [storage-contract.md](./contracts/storage-contract.md) uses one `localStorage` key |
| III. No Authentication | No login/session/access control | ✅ | ✅ None introduced |
| IV. Time-boxed Scope | Buildable in 75 min; nothing beyond the spec | ✅ | ✅ 71-min estimate ([research R13](./research.md)); non-goals listed in the spec (search, charts, export, undo…) stay out |
| V. Traceability | Every code line maps to an acceptance criterion | ✅ | ✅ See the traceability table below |
| VI. Shared Interface | Keep base IDs, single `state`, `render()` only DOM writer | ✅ | ✅ Base IDs kept; new IDs listed in [ui-contract.md](./contracts/ui-contract.md). Edit UI lives in `state.editing` and is drawn by `render()`. Base-pattern exceptions (`form.reset()`, focus, `showError()`) are retained as in the template |
| VII. Root-Level Entry Point | `index.html` at repo root; plain relative paths | ✅ | ✅ `./style.css`, `./app.js` next to root `index.html` |
| VIII. Base Template Starting Point | Edit base files in place; no new entry file; delete unused base markup/TODOs | ✅ | ✅ Cleanup list in [research R12](./research.md): to-do concepts, subtitle, footer, all `TODO`s removed |

**Result**: No violations. Complexity Tracking is not needed.

**Repository note (Branch-per-Team rule 3/4)**: this feature adds only team-owned material (`specs/001-web-expense-tracker/` documents plus the three root app files) and does not modify the constitution, `README.md` or any other team's spec. `.specify/feature.json` (Spec Kit tooling state, updated to point at this feature) is git-ignored and does not appear in the branch diff.

## Project Structure

### Documentation (this feature)

```text
specs/001-web-expense-tracker/
├── plan.md                        # This file (/speckit-plan)
├── research.md                    # Phase 0: decisions and alternatives
├── data-model.md                  # Phase 1: state, entry, summary, edit lifecycle, validation
├── quickstart.md                  # Phase 1: manual validation scenarios
├── contracts/
│   ├── ui-contract.md             # Phase 1: element IDs, row markup, events, function names
│   └── storage-contract.md        # Phase 1: localStorage key, JSON shape, load/save rules
├── checklists/
│   └── requirements.md            # Spec quality checklist (/speckit-specify)
└── tasks.md                       # Phase 2 (/speckit-tasks — NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
<repo root>/
├── index.html      # edited in place: header, create form, summary, filters, list, empty state, clear button
├── style.css       # edited in place: tokens, layout, rows, badges, summary, edit row, responsive
├── app.js          # edited in place: state, load/save, validation, actions, render(), events
└── specs/
    ├── โจทย์/team-1.md            # the brief (read-only for this team)
    └── 001-web-expense-tracker/   # the documents above
```

**Structure Decision**: The constitution's mandated flat layout — three files at the repository root, no subfolders for application code, no new files. The base `index.html`, `style.css` and `app.js` are modified in place.

### Base template changes per file

| File | Keep | Change / add | Remove |
|---|---|---|---|
| `index.html` | Sections, base IDs, `<link>`/`<script>` paths | App title; `novalidate` form with `#input-name`, `#input-amount`, `#input-type`, `#input-category`; three summary items; filters `all/income/expense`; welcome text; "ล้างข้อมูลทั้งหมด" label | Workshop comment block, all `TODO`s, subtitle, footer, `required` on the name input |
| `style.css` | Tokens, layout, `.card`, `.btn*`, `.input/.select`, `.form-error`, `.empty-state`, responsive block | `--color-success` → `#15803d`; `.summary-item`, `.is-negative`, `.item-income/-expense`, `.badge`, `.item-amount`, `.edit-form`; keep `overflow-wrap: anywhere` | `.item.is-done` rules, `TODO`s, header comment |
| `app.js` | `createId`, `escapeHtml`, `showError`, delegation pattern, `loadState`/`saveState` skeleton | Storage key; item shape; `parseAmountSatang`, `formatBaht`, `validateEntry`, `getSummary`, edit functions; filter logic; two-message empty state; robust `loadState`; `saveState` writes `{ items }` only | `toggleItem`, `done`, checkbox markup, `TODO`s, header comment |

## Requirements traceability (Principle V)

| Requirement | Where it is met | Verified by (quickstart) |
|---|---|---|
| FR-001, FR-002 | `index.html` form fields; `addItem` | A2–A3 |
| FR-003, FR-004, FR-005 | `validateEntry`, `parseAmountSatang`, submit handler | A5–A7 |
| FR-006, FR-007 | `addItem` (`unshift`); row markup + `.item-income/-expense` | A2–A3 |
| FR-008, FR-009, FR-022 | `getVisibleItems`, filter click handler, empty-state branch | C1–C4 |
| FR-010, FR-019 | `getSummary`, `#summary-*`, `.is-negative` | A1–A4 |
| FR-011, FR-012, FR-013 | `startEdit`, `saveEdit`, `cancelEdit`, `state.editing` | D1–D5 |
| FR-014, FR-015 | `deleteItem`, `#btn-clear` handler with `confirm()` | E1–E5 |
| FR-016, FR-017 | `saveState`, `loadState` | B1–B5 |
| FR-018 | `formatBaht` | A2–A4, A7 |
| FR-020 | `overflow-wrap: anywhere` on name and amount | A8, F |
| FR-021 | Empty-state branch when `state.items` is empty | A1, E3, E5 |
| FR-023 | Responsive CSS | F |

## Complexity Tracking

No constitution violations — nothing to justify.
