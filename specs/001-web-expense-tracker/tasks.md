---

description: "Task list for the Web Expense Tracker (บันทึกรายรับ-รายจ่าย)"
---

# Tasks: Web Expense Tracker (บันทึกรายรับ-รายจ่าย)

**Input**: Design documents from `/specs/001-web-expense-tracker/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/ui-contract.md](./contracts/ui-contract.md), [contracts/storage-contract.md](./contracts/storage-contract.md), [quickstart.md](./quickstart.md)

**Tests**: No automated test tasks. The spec does not request them and constitution Principle I forbids test tooling/packages. Each story ends with a **manual verification** task that runs the matching [quickstart.md](./quickstart.md) scenarios in a browser (Workflow step 4).

**Organization**: Tasks are grouped by user story. All application code lives in the three root files edited **in place** (Principles VII and VIII): `index.html`, `style.css`, `app.js`. No new files, no subfolders.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: The first task of a file's chain that can start alongside chains in *other* files. Tasks that edit the same file are always sequential, so only one task per file in a group carries `[P]`.
- **[Story]**: US1–US5, mapping to the user stories in spec.md.
- Names (IDs, functions, classes) come from [contracts/ui-contract.md](./contracts/ui-contract.md); do not invent others (Principle VI).
- Every task must trace to a spec requirement (Principle V); the FR/AC it serves is given in brackets.

## Path Conventions

Repository root: `index.html`, `style.css`, `app.js` (siblings, plain relative paths `./style.css`, `./app.js`).

---

## Phase 1: Setup (base template cleanup)

**Purpose**: Turn the generic to-do base template into a clean scaffold, without leaving unused markup, styling or `TODO`s (Principle VIII). The app must still open without errors after this phase.

- [X] T001 [P] In `index.html`, delete the "SDD WORKSHOP — BASE TEMPLATE" header comment block, every `TODO` comment, the subtitle `<p id="app-subtitle">` and the whole `<footer class="app-footer">`; set `<title>` and `<h1 id="app-title">` to "บันทึกรายรับ-รายจ่าย" [research R12]
- [X] T002 [P] In `style.css`, delete the "SDD WORKSHOP — BASE TEMPLATE" header comment, every `TODO` comment, the `.item.is-done` and `.item.is-done .item-text` rules and the `.app-footer` rules; change `--color-success` from `#16a34a` to `#15803d` [research R10, R12]
- [X] T003 [P] In `app.js`, delete the header comment block and every `TODO` comment; remove `toggleItem`, the `done` field on new items, the checkbox markup in `render()` and the `'toggle'` branch of the list click handler; set `STORAGE_KEY` to `'sdd-team-1-expense'`; make `getVisibleItems()` return `state.items` for now (the real filter arrives in US3) [research R12, storage-contract]

**Checkpoint**: Base is clean and `index.html` still opens in the browser with no console errors.

---

## Phase 2: Foundational (shared logic, blocks all user stories)

**Purpose**: The state shape and pure helpers that US1, US3 and US4 all call. All in `app.js`, so these run in order.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T004 In `app.js`, change `state` to exactly `{ items: [], filter: 'all', editing: null }` and add two label lookup constants: type labels `income` → "รายรับ", `expense` → "รายจ่าย"; category labels `food` → "อาหาร", `travel` → "เดินทาง", `shopping` → "ช้อปปิ้ง", `other` → "อื่น ๆ" [data-model: state, Entry display labels]
- [X] T005 In `app.js`, add `parseAmountSatang(raw)`: `Number(raw)` must be finite, then `Math.round(n * 100)` must be a safe integer and `> 0`; return that integer, otherwise `null` (rejects empty, `0`, negative, non-numeric, `Infinity` such as `1e999`, and amounts that round to 0.00 such as `0.001`; `12.345` → `1235`) [FR-004, research R2, spec edge cases]
- [X] T006 In `app.js`, add `formatBaht(satang)` using `Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })` on `satang / 100`, then append `" บาท"` (e.g. `125000` → `"1,250.00 บาท"`, `0` → `"0.00 บาท"`) [FR-018, research R6]
- [X] T007 In `app.js`, add `validateEntry(name, rawAmount)` shared by create and edit: name check first — `name.trim()` must be non-empty, else `{ ok: false, message: 'กรุณากรอกชื่อรายการ' }`; then `parseAmountSatang(rawAmount)`, else `{ ok: false, message: 'กรุณากรอกจำนวนเงินเป็นตัวเลขที่มากกว่า 0' }`; on success `{ ok: true, name: <trimmed>, amountSatang }` [FR-003, FR-004, FR-012, data-model: Validation rules]
- [X] T008 In `app.js`, add `getSummary()` returning `{ incomeSatang, expenseSatang, balanceSatang }` computed from **all** `state.items` regardless of `state.filter`: income = Σ `amountSatang` where `type === 'income'`, expense = Σ where `type === 'expense'`, balance = income − expense [FR-009, FR-010, data-model: Summary]

**Checkpoint**: Foundation ready — helpers exist and the page still loads without errors.

---

## Phase 3: User Story 1 - บันทึกรายการและดูภาพรวมการเงิน (Priority: P1) 🎯 MVP

**Goal**: Add an income/expense entry and see it newest-first in green/red, with a live 3-value summary, validation errors and the welcome empty state.

**Independent Test**: [quickstart.md](./quickstart.md) scenario **A** (A1–A9): start empty → add income + expense → check list order, colours, formatting and all three totals; try invalid inputs and a very long name.

### Implementation for User Story 1

- [X] T009 [P] [US1] In `index.html`, rebuild the create form: add `novalidate` to `<form id="item-form">`, remove `required` from `#input-name` (placeholder "ชื่อรายการ"), add `<input id="input-amount" class="input" type="number" step="any" inputmode="decimal" placeholder="จำนวนเงิน (บาท)">`, `<select id="input-type" class="select">` with options `expense` (selected, "รายจ่าย") and `income` ("รายรับ"), `<select id="input-category" class="select">` with options `food` "อาหาร", `travel` "เดินทาง", `shopping` "ช้อปปิ้ง", `other` "อื่น ๆ" (selected); rename the submit button "บันทึก"; keep `#form-error` [FR-001, FR-002, FR-003, FR-004, spec Assumptions: default type]
- [X] T010 [US1] In `index.html`, replace `<p id="summary-text">` inside `#summary-section` with `<div id="summary-text">` holding three `.summary-item` boxes, each with a label and a `.summary-value` span: "รายรับรวม" → `#summary-income`, "รายจ่ายรวม" → `#summary-expense`, "ยอดคงเหลือ" → `#summary-balance`; leave `<p id="empty-state" class="empty-state">` empty (its text is set by `render()`) [FR-010, FR-021, research R7, R8]
- [X] T011 [P] [US1] In `style.css`, style the summary and rows: `.summary` as a responsive grid of three `.summary-item` cards (stack in one column at ≤ 480 px), `.summary-value` bold with `overflow-wrap: anywhere`, `#summary-income` green (`--color-success`), `#summary-expense` red (`--color-danger`), `.summary-item.is-negative .summary-value` red; rows `.item-main` (flex 1, `min-width: 0`), `.item-name` (`overflow-wrap: anywhere`), `.item-meta` (small, muted), `.badge`, `.item-amount` (bold, `overflow-wrap: anywhere`, right-aligned), `.item-income .item-amount` green, `.item-expense .item-amount` red; on ≤ 480 px make `.input, .select` `flex: 0 0 auto` (the column-direction form otherwise turns the base `flex: 1 1 180px` into a 180 px height); rows must never cause horizontal scroll at ~360 px [FR-007, FR-019, FR-020, FR-023, SC-006, SC-007, ui-contract: CSS class contract]
- [X] T012 [P] [US1] In `app.js`, update the element references: add `inputAmount` (`#input-amount`), `inputType` (`#input-type`), `inputCategory` (`#input-category`), `summaryIncome`, `summaryExpense`, `summaryBalance`; remove the now-unused `summaryText` reference [ui-contract: IDs]
- [X] T013 [US1] In `app.js`, change `addItem(name, amountSatang, type, category)` to `state.items.unshift({ id: createId(), name, amountSatang, type, category, createdAt: new Date().toISOString() })` (newest first; `type` ∈ `'income' | 'expense'`, `category` ∈ `'food' | 'travel' | 'shopping' | 'other'`) [FR-001, FR-002, FR-006, data-model: Entry]
- [X] T014 [US1] In `app.js`, rewrite the form `submit` handler: call `validateEntry(inputName.value, inputAmount.value)`; if not ok → `showError(result.message)` and return **without** resetting the form (typed values stay); if ok → `showError('')`, `addItem(result.name, result.amountSatang, inputType.value, inputCategory.value)`, `form.reset()`, `inputName.focus()`, `render()`; also remove the base `deleteItem` and the `#item-list` click handler, which nothing calls until US4/US5 add per-row buttons [FR-001, FR-003, FR-004, FR-005, Principle V]
- [X] T015 [US1] In `app.js`, rewrite the list part of `render()` to emit the normal row from the ui-contract: `<li class="item item-income|item-expense" data-id>` with `.item-main` → `.item-name` (via `escapeHtml`) + `.item-meta` (`.badge` with the type label, then the category label), then `.item-amount` via `formatBaht` (no `.item-actions` container yet — US4/US5 add it together with their buttons, so no dead markup ships) [FR-006, FR-007, FR-018, FR-020]
- [X] T016 [US1] In `app.js`, finish `render()`: write the three summary values from `getSummary()` into `summaryIncome`, `summaryExpense`, `summaryBalance` with `formatBaht`; toggle `is-negative` on `summaryBalance.closest('.summary-item')` only when `balanceSatang < 0` (exactly 0 is not negative); set `emptyState.textContent` to "ยังไม่มีรายการ เริ่มบันทึกรายรับ-รายจ่ายแรกของคุณได้เลย!" and `emptyState.hidden = visibleItems.length > 0` [FR-010, FR-019, FR-021]
- [X] T017 [US1] Verify User Story 1 in a browser: run scenarios A1–A9 from `specs/001-web-expense-tracker/quickstart.md`; the Console must show no errors (filter buttons still show base labels until US3 — ignore them)

**Checkpoint**: US1 is fully functional and testable on its own — this is the MVP.

---

## Phase 4: User Story 2 - ข้อมูลไม่หายเมื่อปิดหรือรีเฟรช (Priority: P2)

**Goal**: Entries and totals survive refresh and browser restart; bad stored data never breaks the page.

**Independent Test**: [quickstart.md](./quickstart.md) scenario **B** (B1–B5).

### Implementation for User Story 2

- [X] T018 [P] [US2] In `app.js`, change `saveState()` to write only `JSON.stringify({ items: state.items })` under `STORAGE_KEY`; `filter` and `editing` are never persisted; keep the `try/catch` with `console.warn` so a failed write does not stop the UI [FR-016, storage-contract: Write rules, research R5]
- [X] T019 [US2] In `app.js`, rewrite `loadState()` per the storage-contract: key absent → empty; `JSON.parse` inside `try/catch` (error → `items = []`); parsed value must be a non-null object whose `items` is an array (else `items = []`); keep only entries passing an `isValidEntry(entry)` helper — `id`: non-empty string; `name`: string with non-empty trimmed value; `amountSatang`: safe integer `> 0`; `type`: `"income"` or `"expense"`; `category`: `"food"`, `"travel"`, `"shopping"` or `"other"`; `createdAt`: string — dropping the rest silently; never restore `filter` or `editing` (they stay `'all'` / `null`) [FR-016, FR-017, storage-contract: Read rules]
- [X] T020 [US2] Verify User Story 2 in a browser: run scenarios B1–B5 from `specs/001-web-expense-tracker/quickstart.md`, including the four corrupted-storage values; the Console must show no uncaught errors

**Checkpoint**: US1 and US2 both work independently.

---

## Phase 5: User Story 3 - กรองดูเฉพาะรายรับหรือรายจ่าย (Priority: P2)

**Goal**: Switch the list between all / income only / expense only without changing the summary.

**Independent Test**: [quickstart.md](./quickstart.md) scenario **C** (C1–C4).

### Implementation for User Story 3

- [X] T021 [P] [US3] In `index.html`, replace the base filter buttons in `#filter-section` with three `<button type="button" class="btn btn-filter" data-filter="…">`: `all` "ทั้งหมด" (with `is-active`), `income` "เฉพาะรายรับ", `expense` "เฉพาะรายจ่าย" [FR-008]
- [X] T022 [P] [US3] In `app.js`, implement `getVisibleItems()`: `'all'` → every item; `'income'` / `'expense'` → items whose `type` equals it; preserve order (newest first); the summary must keep using **all** items, never this result [FR-008, FR-009, data-model: Visible list]
- [X] T023 [US3] In `app.js`, extend the empty-state branch in `render()` to two messages: when `state.items` is empty → the welcome text from T016; when items exist but none are visible → "ไม่มีรายการในมุมมองนี้"; keep `emptyState.hidden = visibleItems.length > 0` [FR-021, FR-022, research R8]
- [X] T024 [US3] Verify User Story 3 in a browser: run scenarios C1–C4 from `specs/001-web-expense-tracker/quickstart.md`

**Checkpoint**: US1, US2 and US3 all work independently.

---

## Phase 6: User Story 4 - แก้ไขรายการที่บันทึกไว้ (Priority: P3)

**Goal**: Edit an entry's name and amount inline, reusing the create validation, with the summary recalculating at once.

**Independent Test**: [quickstart.md](./quickstart.md) scenario **D** (D1–D5).

### Implementation for User Story 4

- [X] T025 [P] [US4] In `style.css`, add `.item-actions` (flex, gap, `flex-shrink: 0`; at ≤ 480 px `.item-actions .btn { width: auto }` so the base full-width mobile button rule does not stretch row buttons) and style the edit row: `.item.is-editing` and `.edit-form` (flex, wrap, gap; inputs `min-width: 0` so nothing overflows at ~360 px), reuse `.form-error` for the row's error line [FR-023, ui-contract: Row being edited]
- [X] T026 [P] [US4] In `app.js`, add the edit lifecycle functions: `startEdit(id)` sets `state.editing = { id, name: <entry name>, amount: (amountSatang / 100).toFixed(2), error: '' }` (replacing any current edit); `cancelEdit()` sets `state.editing = null`; `saveEdit(id, name, rawAmount)` runs `validateEntry` — on failure keep the typed values and set `state.editing = { id, name, amount: rawAmount, error: result.message }`; on success update **only** the entry's `name` and `amountSatang` in place (`type`, `category`, `createdAt` and array position never change) and set `state.editing = null` [FR-011, FR-012, FR-013, data-model: EditSession, Edit lifecycle]
- [X] T027 [US4] In `app.js`, update `render()` rows: add an `.item-actions` container after `.item-amount` holding `<button type="button" class="btn btn-icon" data-action="edit">แก้ไข</button>`; when `state.editing?.id === item.id` render the edit row instead — `<li class="item is-editing" data-id>` with `<form class="edit-form" novalidate>` containing `<input class="input" data-field="name">` (value = `escapeHtml(editing.name)`), `<input class="input" data-field="amount" type="number" step="any" inputmode="decimal">` (value = `escapeHtml(editing.amount)`), `<button type="submit" class="btn btn-primary">บันทึก</button>` (**no** `data-action`), `<button type="button" class="btn" data-action="cancel">ยกเลิก</button>` and `<p class="form-error">` showing `editing.error`, hidden when empty [FR-011, FR-012, ui-contract: Row being edited]
- [X] T028 [US4] In `app.js`, wire the events: (re)create the `#item-list` click handler (removed in T014) and dispatch `edit` → `startEdit(id)` and `cancel` → `cancelEdit()`, and `return` early for any other `data-action` so the handler's trailing `render()` cannot rebuild an open edit form before `submit`; add a `submit` listener on `itemList` for `.edit-form` (`preventDefault`, read `[data-field="name"]` and `[data-field="amount"]` values from that form, call `saveEdit`, then `render()`); after `render()` on `startEdit` focus the row's name input; also set `state.editing = null` inside the successful-add path of the form `submit` handler and inside the filter click handler, so any other action discards an open edit [FR-011, FR-012, spec edge case "reload during edit", data-model: Edit lifecycle]
- [X] T029 [US4] Verify User Story 4 in a browser: run scenarios D1–D5 from `specs/001-web-expense-tracker/quickstart.md`

**Checkpoint**: US1–US4 all work independently.

---

## Phase 7: User Story 5 - ลบรายการและล้างข้อมูลทั้งหมด (Priority: P3)

**Goal**: Delete one entry with confirmation, and clear everything with confirmation.

**Independent Test**: [quickstart.md](./quickstart.md) scenario **E** (E1–E5).

### Implementation for User Story 5

- [X] T030 [P] [US5] In `index.html`, change the label of `#btn-clear` to "ล้างข้อมูลทั้งหมด" [FR-015]
- [X] T031 [P] [US5] In `app.js`, add `<button type="button" class="btn btn-icon" data-action="delete">ลบ</button>` to the normal row's `.item-actions` in `render()` (create the container and its CSS from T025 if US4 has not been done); add the `#item-list` click handler back if it does not exist (removed in T014) with a `delete` branch that calls `confirm('ยืนยันการลบรายการนี้?')` and **return without calling `render()`** if declined (so text typed in an open edit row is not redrawn from the stale draft); if accepted call `deleteItem(id)`, set `state.editing = null`, then `render()` [FR-014, ui-contract: Events]
- [X] T032 [US5] In `app.js`, update the `#btn-clear` click handler: return immediately when `state.items.length === 0` (no prompt); `confirm('ยืนยันการล้างข้อมูลทั้งหมด?')` and return without `render()` if declined; otherwise `state.items = []`, `state.editing = null`, `render()` [FR-015, FR-021, spec Assumptions: confirm before clear-all]
- [X] T033 [US5] Verify User Story 5 in a browser: run scenarios E1–E5 from `specs/001-web-expense-tracker/quickstart.md`

**Checkpoint**: All five user stories work independently.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Constitution compliance and full-app verification.

- [X] T034 [P] Run `grep -n TODO index.html style.css app.js` from the repository root and delete or fulfil every hit; also remove any leftover base markup, CSS rules (e.g. unused `.btn-icon`/`.select` variants) or JS functions no requirement uses, in `index.html`, `style.css` and `app.js` [Principle V, Principle VIII]
- [X] T035 Check the responsive layout at 360 px, 768 px and desktop widths (quickstart scenario F) with a 200-character name and a value like `1234567890.5`; fix any horizontal scroll or overflow in `style.css` [FR-020, FR-023, SC-006, SC-007]
- [X] T036 Run the complete `specs/001-web-expense-tracker/quickstart.md` (scenarios A–F) once via `file://` (open the root `index.html`) and once via `python3 -m http.server 8000`; the Console must show no errors [SC-001..SC-008, Principle VII]
- [X] T037 Review `git diff main` for Principle V/VIII: root `index.html`, `style.css`, `app.js` are the only application files changed, no new entry file exists, and every changed line traces to an FR in `specs/001-web-expense-tracker/spec.md`

---

## Phase 9: Visual Identity (FR-024, FR-025, FR-026) — added after the user supplied a reference image

**Purpose**: Restyle to the reference image's look (warm cream/peach, orange, pastel tiles, rounded shapes) with CSS only. No behaviour change, so all earlier tests must still pass. Palette, contrast ratios and rejected options are in [research R14](./research.md).

- [X] T038 [P] In `index.html`, add `<meta name="theme-color" content="#f8dfbf">` to `<head>` and no other markup change (no images, no external fonts or stylesheets) [FR-024, FR-026]
- [X] T039 [P] In `style.css`, replace the `:root` tokens with the R14 palette: `--color-bg #f8dfbf`, `--color-stripe #f4d3aa`, `--color-surface #fffaf0`, `--color-border #f0d5aa`, `--color-text #4a2b16`, `--color-muted #80502c`, `--color-primary #fc7b29`, `--color-primary-hover #ff8a3d`, `--color-success #0d6e55`, `--color-danger #b3260e`, `--color-income-bg #d9f5ec`, `--color-expense-bg #ffe3de`, `--color-balance-bg #fff0b8`, `--color-title #dd5208`, `--color-teal #0a7f6a`, larger `--radius`; give `body` the cream background with soft stripes (`repeating-linear-gradient`), a decorative emoji above the title via `.app-header::before`, and make `#app-title` bold `--color-title` with a white outline (`-webkit-text-stroke` + `paint-order: stroke fill`) [FR-024, FR-025, FR-026]
- [X] T040 In `style.css`, restyle the components with those tokens: `.card` (surface, 3 px `--color-border`, rounded, soft solid shadow), `.section-title` in `--color-teal`, `.input`/`.select` (rounded, 2 px border, orange focus ring, placeholder `#8f6a47`), `.btn` (rounded), `.btn-primary` and `.btn-filter.is-active` (`--color-primary` fill with `--color-text` text, thick lower border), `.btn-danger`, `.summary-item` tiles (mint / pink / yellow backgrounds for `#summary-income` / `#summary-expense` / `#summary-balance`, text on them in `--color-success` / `--color-danger` / `--color-text`, `is-negative` stays `--color-danger`), `.badge` (pastel fill matching the type), row dividers, `.item-amount` colours, `.edit-form`, and `.empty-state::before` (decorative emoji); keep every rule from the ui-contract CSS class contract and the ≤ 480 px responsive block working [FR-007, FR-019, FR-024, FR-025]
- [X] T041 Verify contrast and rules: compute WCAG contrast for every text/background pair actually used (body, muted, title, section titles, income/expense text on surface and on their tiles, badges, primary and filter buttons, placeholders, danger button) — each ≥ 4.5:1, title ≥ 3:1 — and run `grep -nE "<img|url\(|@import|https?://" index.html style.css app.js` (must print nothing) [FR-025, FR-026, SC-009]
- [X] T042 Verify no regression and the look: update the colour constants in the browser tests to the new `--color-success` / `--color-danger`, rerun all suites (US1–US5 at 1200 / 768 / 360 px, host tests, `file://` and `http://`), then take desktop and 360 px screenshots and compare them with the reference image (quickstart scenario G) [FR-024, SC-010]

**Checkpoint**: Same behaviour as before, new look, contrast rules met.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: no dependencies; T001, T002, T003 touch different files and can run in parallel.
- **Foundational (Phase 2)**: depends on T003 (same file); T004 → T008 run in order. **Blocks all user stories.**
- **User Stories (Phase 3–7)**: all depend on Phase 2. US1 first (MVP); the rest follow priority order.
- **Polish (Phase 8)**: after every story you intend to ship.

### User Story Dependencies

- **US1 (P1)**: needs Phase 2 only. Defines the row markup and `render()` that later stories extend.
- **US2 (P2)**: needs Phase 2 and the `render()` → `saveState()` call from US1 to be observable end to end.
- **US3 (P2)**: needs Phase 2; independent of US2. Extends the empty-state branch added in T016.
- **US4 (P3)**: needs US1 (rows/`render()`); independent of US2, US3, US5 (its discard-on-filter hook is in T028 and is a no-op if US3 was skipped).
- **US5 (P3)**: needs US1 (rows/`render()`); independent of the others. Its `state.editing = null` lines are harmless without US4 because `editing` exists from T004.
- US4 and US5 both edit the row markup in `render()` (T027, T031): do them in sequence, not simultaneously.

### Within Each User Story

- `index.html` and `style.css` tasks and the first `app.js` task can start together (different files); the remaining `app.js` tasks follow in order.
- Helpers (Phase 2) before the code that calls them; `render()` last; the verification task closes every story.

### Parallel Opportunities

- **Phase 1**: T001 ‖ T002 ‖ T003.
- **US1**: T009 → T010 (same file) ‖ T011 ‖ T012 → T013 → T014 → T015 → T016.
- **US3**: T021 ‖ T022 → T023.
- **US4**: T025 ‖ T026 → T027 → T028.
- **US5**: T030 ‖ T031 → T032.
- **Different stories in parallel**: after Phase 2 and US1, US2, US3, US4 and US5 could go to different people, but they all edit `app.js`, so expect merge conflicts. In the 75-minute workshop, do them sequentially.

### Parallel Example: User Story 1

```text
# Three file-chains that can start together:
Chain A (index.html): T009 → T010
Chain B (style.css):  T011
Chain C (app.js):     T012 → T013 → T014 → T015 → T016
# Then, once all three are done:
T017 verify in the browser
```

---

## Implementation Strategy

### MVP First (User Story 1 only)

1. Phase 1: Setup (≈ 5 min)
2. Phase 2: Foundational (≈ 8 min)
3. Phase 3: US1 (≈ 22 min)
4. **STOP and VALIDATE**: scenario A. This already delivers the core value (record entries and see the balance).

### Incremental Delivery

1. Setup + Foundational + US1 → MVP.
2. + US2 (≈ 5 min) → data survives refresh. (Do this straight after the MVP; a tracker that forgets everything is barely usable.)
3. + US3 (≈ 5 min) → filtering.
4. + US4 (≈ 10 min) → editing.
5. + US5 (≈ 5 min) → delete / clear all.
6. Polish (≈ 10 min).

Total ≈ 70 minutes, inside the 75-minute limit (Principle IV). If time runs short, drop stories from the end: US5, then US4. US1–US3 are the must-haves; each story is a shippable increment and the branch stays deployable after each one (Branch-per-Team rule 5).

---

## Notes

- Constraints quoted in tasks come verbatim from [data-model.md](./data-model.md) and [storage-contract.md](./contracts/storage-contract.md) so nothing is left to implementation-time judgement.
- Commit after each task or small group; each commit should leave the root `index.html` opening without errors.
- Do not touch the constitution, `README.md`, or another team's spec (Branch-per-Team rule 3).
- Avoid: creating any file besides the three root files, adding libraries, calling `fetch`/`XMLHttpRequest`, or adding features beyond the spec (search, charts, export, undo).
