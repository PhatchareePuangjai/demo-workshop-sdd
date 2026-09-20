# Phase 0 Research: Web Expense Tracker

**Feature**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

The technical stack is fixed by the constitution (vanilla HTML/CSS/JS, `localStorage` only, root-level files, edit the base template in place), so there were no stack unknowns. The research below covers the design decisions the base template and the spec leave open. No `NEEDS CLARIFICATION` items remain.

## R1 — Build on the base template in place

- **Decision**: Edit the root `index.html`, `style.css`, `app.js` directly on branch `team-1`. Keep the shared contract from Principle VI (`#item-form`, `#form-error`, `#summary-text`, `#filter-section`, `#item-list`, `#empty-state`, the single `state` object, `render()`), keep `#btn-clear` for the clear-all button, and add only the IDs this spec needs.
- **Rationale**: Principles VI and VIII require it; the branch diff against the base is the reviewed deliverable (Branch-per-Team rule 4).
- **Alternatives considered**: A new `team-1.html`/`main.js` (rejected — forbidden by VIII); restructuring into modules (rejected — no build step, more files, no benefit at this size).

## R2 — Represent money as integer satang

- **Decision**: Store each amount as an integer number of satang (`amountSatang = Math.round(baht * 100)`). Sum in integers; format by dividing by 100 at display time.
- **Rationale**: The spec requires the displayed amounts and the summary to always agree (SC-002) and requires amounts to round to 2 decimals at save time (spec edge case "12.345 → 12.35", "0.001 → rejected"). Integer arithmetic removes floating-point drift (`0.1 + 0.2`) from totals.
- **Validation rule**: raw input → `Number()` → must be finite → `amountSatang` must be a safe integer and `> 0`. This rejects empty, `0`, negative, non-numeric, `Infinity` (e.g. `1e999`) and absurdly large values in one place.
- **Known limitation**: `Math.round(1.005 * 100)` yields `100` (binary floating point), so `1.005` saves as `1.00` rather than `1.01`. Accepted: it only affects inputs with 3+ decimals, which the spec treats as an edge case, and no dependency-free fix is worth the time budget.
- **Alternatives considered**: Store floats and only round for display (rejected — totals can disagree with displayed lines); a decimal library (rejected — forbidden by Principle I/Tech Stack).

## R3 — Validation runs in JavaScript, not the browser's native form validation

- **Decision**: Put `novalidate` on `#item-form` and drop the base's `required` attribute. All checks run in the submit handler and report through `#form-error`. Amount input is `type="number" step="any" inputmode="decimal"`.
- **Rationale**: FR-003/FR-004 require a *visible* error message and treat whitespace-only names as empty; native `required` shows a browser tooltip and accepts `"   "`. `type="number"` gives the numeric keypad on phones and blocks most letter input, while JS remains the source of truth for `0`, negatives and exponents.
- **Alternatives considered**: `type="text"` + regex (rejected — needs custom rules for commas, dots, exponent forms and gives no numeric keypad on some phones).

## R4 — Inline row editing, with edit state inside `state`

- **Decision**: Clicking "แก้ไข" on a row sets `state.editing = { id, name, amount, error }`. `render()` draws that one row as a small `<form>` (name input, amount input, "บันทึก", "ยกเลิก", an error line). Saving runs the same validators as create (FR-012); on failure it keeps the typed values in `state.editing` and sets `error`. Only one row is editable at a time; any other state-changing action (successful add, confirmed delete, filter change, confirmed clear-all, editing another row) discards the current edit.
- **Rationale**: Principle VI says `render()` is the only DOM writer and `state` the only source of truth, so the edit UI's visibility and error text live in `state` and are drawn by `render()`. Inline error text is more usable than `prompt()`, which cannot show validation errors or keep typed input. Wrapping edit fields in a `<form>` gives Enter-to-save for free without custom key handlers. "Discard on any other action" matches the spec edge case "reload during edit discards it" and avoids draft-merging logic.
- **Alternatives considered**: `window.prompt()` for name then amount (rejected — no inline error, poor mobile UX, cannot cancel cleanly); modal dialog (rejected — extra markup/CSS beyond the time box); keeping multiple rows editable (rejected — more state, no requirement).

## R5 — Persist `items` only; validate on load

- **Decision**: Save `{ items }` under the key `sdd-team-1-expense`. `filter` and `editing` are session-only. `loadState()` wraps parse in `try/catch`, requires an object whose `items` is an array, and keeps only entries that pass a shape check (string `id`, non-empty string `name`, positive safe-integer `amountSatang`, `type` ∈ {income, expense}, `category` ∈ the four categories, string `createdAt`). Anything else is dropped; a fully unreadable store yields an empty list.
- **Rationale**: Base `saveState()` writes the whole `state`, which would restore a stale filter and could restore a half-finished edit on refresh, contradicting the spec edge case (FR-008 default "ทั้งหมด"). FR-017 requires the app to start in the empty state rather than crash on bad data; the base `{ ...state, ...JSON.parse(saved) }` would let `"null"`, `"[]"` or `{ "items": 5 }` break `render()`.
- **Alternatives considered**: Persist the filter (rejected — spec says the default is "ทั้งหมด"; not required); a schema-version field and migrations (rejected — over-engineering for a workshop app).

## R6 — Money formatting

- **Decision**: One helper `formatBaht(satang)` using `Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })` on `satang / 100`, then append `" บาท"`. Used for every displayed amount (list and summary).
- **Rationale**: FR-018 needs `1,250.00 บาท`. Pinning the locale to `en-US` guarantees Western digits and comma grouping on every device; a single helper prevents inconsistent formatting between list and summary (SC-005).
- **Alternatives considered**: `th-TH` locale (rejected — output depends on the user's system/numbering settings); manual regex grouping (rejected — reinvents a standard API).

## R7 — Summary markup vs. the shared `#summary-text` contract

- **Decision**: Keep `#summary-section` as the card, and turn `#summary-text` into the wrapper of three summary items whose value elements are `#summary-income`, `#summary-expense`, `#summary-balance`. `render()` writes only to those three spans and toggles an `is-negative` class on the balance item when the balance is `< 0` (not for exactly `0`).
- **Rationale**: Principle VI says teams SHOULD keep the base IDs but MAY add IDs the spec needs; FR-010 needs three separate values (and FR-019 needs to style one of them), which a single text node cannot express cleanly.
- **Alternatives considered**: Render all three values as one string in `#summary-text` (rejected — cannot colour the balance independently without `innerHTML` string building).

## R8 — One `#empty-state` element, two messages

- **Decision**: Keep the single `#empty-state`. `render()` hides it when at least one row is visible; otherwise it shows the welcome message (FR-021) when `state.items` is empty, or the "no items in this view" message (FR-022) when items exist but the filter hides them all.
- **Rationale**: Keeps the shared ID, avoids a second element, and makes the two cases mutually exclusive by construction.

## R9 — Confirmations use the browser's native `confirm()`

- **Decision**: Keep the base's `confirm()` for single delete (FR-014) and clear-all (FR-015). "Clear all" with zero items returns early without asking (matches the base and the spec edge case).
- **Rationale**: Already in the base template, zero markup, works on `file://` and mobile. Custom modals are out of the time box.

## R10 — Colour and accessibility

- **Decision**: Income = green, expense = red, distinguished additionally by a text label ("รายรับ"/"รายจ่าย") on each row, so colour is not the only cue. Darken the base `--color-success` from `#16a34a` to `#15803d` so green text on white meets WCAG AA contrast (4.5:1); `--color-danger` `#dc2626` already does.
- **Rationale**: FR-007 requires a clear distinction; the type label is already required by FR-007, so this costs nothing.

## R11 — Testing approach

- **Decision**: No automated framework. Verification is manual in a browser, following [quickstart.md](./quickstart.md), which maps scenarios to the spec's acceptance scenarios and success criteria. The app is opened via `file://` and, once, via `python3 -m http.server`.
- **Rationale**: Principle I forbids npm packages/build tooling; Workflow step 4 requires local browser testing. The logic is small enough that the quickstart checklist gives full coverage of the 5 user stories.

## R12 — Base-template cleanup (Principle VIII)

Items to delete or replace because the spec does not use them: the "SDD WORKSHOP — BASE TEMPLATE" header comments and every `TODO` comment in all three files; the to-do concepts `done`, `toggleItem`, the checkbox, `.is-done` styling and the `active`/`done` filter values; the subtitle and footer (not required by the spec); the placeholder `<title>`/heading text. The header keeps a single `<h1>` with the app name as the app's identity from the brief.

## R13 — Time-box check (Principle IV, 75 minutes)

| Slice | Estimate |
|---|---|
| Markup (form, summary, filters, list, empty state, clear) | 8 min |
| CSS (tokens, layout, rows, badges, responsive, long-text) | 12 min |
| JS core: state, load/save + validation, add + validators, `render()`, summary, formatting | 18 min |
| Filter | 4 min |
| Inline edit | 10 min |
| Delete + clear all | 5 min |
| Persistence hardening (bad-data load) | 4 min |
| Manual QA via quickstart + base cleanup | 10 min |
| **Total** | **71 min** (4 min buffer) |

Fits the time box. If time runs short, cut in reverse priority order per the spec: US4 (edit) first, then US5 (delete / clear all); US1–US3 are the must-haves.

## R14 — Visual identity from the reference image (FR-024..026)

- **Decision**: Restyle with CSS only (tokens on `:root`), inspired by the reference image's palette and shapes — cream/peach striped page, orange primary, mint/pink/yellow pastel tiles, rounded "sticker" cards with cream borders, bold orange title with a white outline. No image files, no web fonts, no characters/logos from the reference (FR-026, Principle VII flat layout, Principle I). Decoration uses only shapes, colour and standard emoji (`::before`).
- **Palette sampled from the reference** → **token actually used** (bright colours are kept for *fills*; text colours are darkened to pass contrast, FR-025):

| Role | Reference | Token used | Why it differs |
|---|---|---|---|
| Page background | `#f6dfbe` / `#f5d5b5` | `--color-bg #f8dfbf`, stripe `#f4d3aa` | same family |
| Card surface | cream `#fbf0e0` | `--color-surface #fffaf0` | lighter so text stays ≥ 12:1 |
| Card border | `#f0ddb9` | `--color-border #f0d5aa` | same family |
| Primary (fill) | orange `#fc7b29` | `--color-primary #fc7b29` | kept; text on it is dark brown |
| Body text | — | `--color-text #4a2b16` | 12.25:1 on surface |
| Muted text | brown `#a66548` | `--color-muted #80502c` | `#a66548` is < 4.5:1; darkened (6.5:1 surface, 5.25:1 page) |
| Income | mint `#1bb58f` (2.61:1 on white — fails as text) | text `--color-success #0d6e55`, tile `#d9f5ec` | ≥ 4.8:1 everywhere |
| Expense / negative | coral `#ff5843` (3.12:1 — fails as text) | text `--color-danger #b3260e`, tile `#ffe3de` | ≥ 5.09:1 everywhere |
| Balance tile | yellow `#ffc800` | tile `#fff0b8`, text = body text | 11.17:1 |
| Title | orange `#fc7b29` + white outline | fill `#dd5208`, white outline | large text ≥ 3:1: 3.97:1 vs the white outline, 3.08:1 vs page (the reference orange gives only 2.62 / 2.04) |
| Sub-heading | teal `#1bbd9c` | `#0a7f6a` (4.74:1) | contrast |
| Placeholder | — | `#8f6a47` on white (4.86:1) | ≥ 4.5 |

- **Contrast checked** (WCAG relative luminance, script in the scratchpad; results in the table above): white text on the reference orange = 2.62:1 (fails), so primary buttons use **dark brown text on orange** (4.86:1), not white. Hover state lightens (`#ff8a3d`, 5.43:1) instead of darkening (`#f06a14` would be 4.11:1).
- **Colour is not the only cue** (unchanged from R10): rows keep the text badge "รายรับ"/"รายจ่าย", and the summary tiles have text labels.
- **Alternatives considered**: a web font like the reference's rounded display face (rejected — external network dependency, breaks offline/`file://`, FR-026); SVG/PNG decorations (rejected — extra files violate Principle VII; copying the reference's characters is also an IP problem); using the reference colours verbatim for text (rejected — fails FR-025).
