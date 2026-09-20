# UI Contract: element IDs, actions and functions

**Feature**: [spec.md](../spec.md) | **Data model**: [data-model.md](../data-model.md)

This is the shared interface required by constitution Principle VI. `index.html`, `style.css` and `app.js` MUST agree on these names, and nothing else may be introduced without updating this file. Files stay at the repository root (Principle VII).

## Page regions (`index.html`)

| Region | Element | Purpose | Spec |
|---|---|---|---|
| Header | `<h1 id="app-title">` | App name "บันทึกรายรับ-รายจ่าย" | Scope |
| Create form | `<form id="item-form" novalidate>` | Add an entry | FR-001..005 |
| Summary | `<section id="summary-section">` → `<div id="summary-text">` | Three live totals | FR-010, FR-019 |
| Filters | `<section id="filter-section">` | Three view buttons | FR-008 |
| List | `<ul id="item-list">` | Rows; the only container `render()` fills | FR-006, 007, 011, 014 |
| Empty state | `<p id="empty-state">` | Welcome / "nothing in this view" message | FR-021, FR-022 |
| Bulk action | `<button id="btn-clear">` | "ล้างข้อมูลทั้งหมด" | FR-015 |

## IDs

**Kept from the base template** (Principle VI): `#item-form`, `#form-error`, `#summary-text`, `#filter-section`, `#item-list`, `#empty-state`, `#input-name`, `#btn-clear`, plus `#form-section`, `#list-section`, `#app-title`.

**Added for this spec:**

| ID | Element | Purpose |
|---|---|---|
| `#input-amount` | `<input type="number" step="any" inputmode="decimal">` | Amount in baht (FR-001, FR-004) |
| `#input-type` | `<select>`: `expense` (default, selected), `income` | Entry type (FR-001) |
| `#input-category` | `<select>`: `food`, `travel`, `shopping`, `other` (default, selected) | Category (FR-002) |
| `#summary-income` | `<span>` inside `#summary-text` | Total income (FR-010) |
| `#summary-expense` | `<span>` inside `#summary-text` | Total expense (FR-010) |
| `#summary-balance` | `<span>` inside `#summary-text` | Balance; gets class `is-negative` when `< 0` (FR-019) |

Removed from the base (not used by the spec): `#app-subtitle`, the footer, the checkbox toggle.

## Filter buttons

Inside `#filter-section`: `<button class="btn btn-filter" data-filter="all|income|expense">`, labels "ทั้งหมด", "เฉพาะรายรับ", "เฉพาะรายจ่าย". The active one has class `is-active`. `data-filter="all"` starts active.

## Row markup produced by `render()` (inside `#item-list`)

Normal row:

```html
<li class="item item-income|item-expense" data-id="{id}">
  <div class="item-main">
    <span class="item-name">{escaped name}</span>
    <span class="item-meta"><span class="badge">รายรับ|รายจ่าย</span> {category label}</span>
  </div>
  <span class="item-amount">{formatBaht}</span>
  <div class="item-actions">
    <button type="button" class="btn btn-icon" data-action="edit">แก้ไข</button>
    <button type="button" class="btn btn-icon" data-action="delete">ลบ</button>
  </div>
</li>
```

Row being edited (only one at a time; replaces the normal row's content):

```html
<li class="item is-editing" data-id="{id}">
  <form class="edit-form" novalidate>
    <input class="input" data-field="name"   value="{escaped draft name}">
    <input class="input" data-field="amount" value="{draft amount}" type="number" step="any" inputmode="decimal">
    <button type="submit" class="btn btn-primary" data-action="save">บันทึก</button>
    <button type="button" class="btn" data-action="cancel">ยกเลิก</button>
    <p class="form-error">{editing.error}</p>   <!-- hidden when empty -->
  </form>
</li>
```

All user text goes through `escapeHtml` before entering `innerHTML`.

## Events (delegated on the containers, bound once)

| Target | Event | Handling |
|---|---|---|
| `#item-form` | `submit` | validate → `addItem` → reset form, focus name → `render()` |
| `#item-list` | `click` on `data-action="edit\|delete\|cancel"` | dispatch to `startEdit` / `deleteItem` (after `confirm`) / `cancelEdit`, then `render()`. A declined `confirm` returns **without** calling `render()`, so text typed into an open edit row is not redrawn from the stale draft |
| `#item-list` | `submit` on `.edit-form` | read the two fields → `saveEdit` → `render()` |
| `#filter-section` | `click` on `[data-filter]` | `state.filter = value`; `state.editing = null`; `render()` |
| `#btn-clear` | `click` | return if no items; `confirm`; `state.items = []`; `render()` |

## `app.js` function names (single copy of each — no duplicates)

| Function | Responsibility |
|---|---|
| `loadState()` / `saveState()` | Read/write `{ items }` under the storage key — see [storage-contract.md](./storage-contract.md) |
| `createId()`, `escapeHtml()`, `showError(message)` | Kept from base |
| `parseAmountSatang(raw)` | Returns a positive safe integer of satang, or `null` if invalid |
| `formatBaht(satang)` | `"1,250.00 บาท"` |
| `validateEntry(name, rawAmount)` | Returns `{ ok, name, amountSatang }` or `{ ok:false, message }` — shared by create and edit |
| `addItem(name, amountSatang, type, category)` | Create + `unshift` |
| `startEdit(id)` / `cancelEdit()` / `saveEdit(id, name, rawAmount)` | Edit lifecycle on `state.editing` |
| `deleteItem(id)` | Remove one entry |
| `getVisibleItems()` | Apply `state.filter` |
| `getSummary()` | Returns `{ incomeSatang, expenseSatang, balanceSatang }` from all items |
| `render()` | **The only function that writes rendered data to the DOM**: list, empty state, summary, filter highlight, edit row; then `saveState()` |

`render()` never touches the create form's input values. Clearing the form (`form.reset()`), focusing an input and showing the create-form error via `showError()` follow the base template's existing pattern.

## CSS class contract (`style.css`)

`.item-income` / `.item-expense` set the row's amount colour (green `--color-success`, red `--color-danger`). `.summary-item` is one of the three summary boxes; `.summary-item.is-negative .summary-value` shows the balance in red. Long text: `.item-name` and `.item-amount` use `overflow-wrap: anywhere` and `min-width: 0` (FR-020). No fixed widths that can cause horizontal scroll at ~360 px (SC-006).
