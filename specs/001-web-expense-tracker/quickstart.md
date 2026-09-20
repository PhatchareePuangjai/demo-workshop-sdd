# Quickstart: validating the Web Expense Tracker

**Feature**: [spec.md](./spec.md) | **Contracts**: [ui-contract](./contracts/ui-contract.md), [storage-contract](./contracts/storage-contract.md) | **Data model**: [data-model.md](./data-model.md)

A manual, browser-based check that the finished app satisfies the spec. No install or build step exists (constitution Principle I).

## Prerequisites

- A modern desktop browser (Chrome, Edge, Firefox or Safari) with DevTools; optionally a phone or DevTools device mode for the responsive checks.
- You are on branch `team-1` and the root `index.html`, `style.css`, `app.js` are edited in place.

## Run it

Either of these must work (Technical Stack rule):

```bash
open index.html                    # macOS: opens via file://
python3 -m http.server 8000        # then browse to http://localhost:8000
```

Start from a clean slate for each scenario set: DevTools → Application → Local Storage → delete the `sdd-team-1-expense` key, then reload. Keep the Console open; there must be **no errors** at any point.

## Scenarios

Numbers in brackets link to spec items.

### A. Add and see the overview (User Story 1, FR-001..010, FR-018..021, SC-001, SC-002, SC-005)

1. Fresh load. **Expect**: the welcome message "ยังไม่มีรายการ เริ่มบันทึกรายรับ-รายจ่ายแรกของคุณได้เลย!" and all three summary values "0.00 บาท".
2. Add `เงินเดือน`, `25000`, รายรับ. **Expect**: row on top, green, "25,000.00 บาท", welcome message gone, income = 25,000.00.
3. Add `ข้าวมันไก่`, `1250`, รายจ่าย, หมวด อาหาร. **Expect**: new row above the first, red, "1,250.00 บาท", category "อาหาร", expense = 1,250.00, balance = 23,750.00.
4. Add expense `ทริป`, `30000`. **Expect**: balance = −6,250.00 shown in **red**. Then delete/adjust until the balance is exactly 0.00. **Expect**: not red.
5. Submit with an empty name; with a name of only spaces. **Expect**: visible message in `#form-error`, list unchanged, typed amount still in the field.
6. Submit amounts `` (empty), `0`, `-5`, `0.001`, `1e999`. **Expect**: each rejected with the amount message, list unchanged, no console error.
7. Add `12.345` (expense). **Expect**: saved and shown as `12.35 บาท`; the expense total and the balance change by exactly 12.35 (not 12.345).
8. Add a name of ~200 characters, once with spaces and once as one unbroken string. **Expect** (also at 360 px width): wraps inside the card, no horizontal scrollbar.
9. Add `<b>x</b>` as a name. **Expect**: shown literally as text, not bold.

### B. Persistence (User Story 2, FR-016, FR-017, SC-003)

1. With several entries present, refresh. **Expect**: same rows, order, colours, categories and totals; filter is back on "ทั้งหมด".
2. Quit and reopen the browser, open the app again. **Expect**: same as above.
3. Edit one entry and delete another, refresh. **Expect**: the changes stayed.
4. Bad data: in the Console run `localStorage.setItem('sdd-team-1-expense', '{oops')`, reload. **Expect**: app opens empty with the welcome message, no crash. Repeat with `'null'`, `'{"items":5}'` and `'{"items":[{"name":1}]}'`. **Expect**: same.
5. Bulk load: in the Console generate 50 entries via the UI or a small script writing valid JSON to the key, reload. **Expect**: all 50 present (SC-003).

### C. Filter (User Story 3, FR-008, FR-009, FR-022)

1. With mixed entries, click "เฉพาะรายรับ". **Expect**: only income rows; active button highlighted; summary unchanged.
2. Click "เฉพาะรายจ่าย", then "ทั้งหมด". **Expect**: matching lists, newest first.
3. With only income entries present, choose "เฉพาะรายจ่าย". **Expect**: a short "no items in this view" message, **not** the welcome message.
4. While on "เฉพาะรายจ่าย", add an income entry. **Expect**: saved and summary updated; it is not shown until the filter changes.

### D. Edit (User Story 4, FR-011..013)

1. Click "แก้ไข" on an expense of 60. Change the name and amount to 75. Save. **Expect**: row shows the new values in place (same position, same type/category); expense and balance updated at once.
2. Edit, clear the name, save. **Expect**: inline error in the row, typed values kept, entry unchanged. Repeat with amount `0`, `-1`, empty.
3. Edit then click "ยกเลิก". **Expect**: original values, no change.
4. Start an edit, type something, refresh. **Expect**: edit discarded, saved values shown.
5. Start an edit, click a filter button. **Expect**: edit closed, draft discarded.

### E. Delete and clear all (User Story 5, FR-014, FR-015)

1. Click "ลบ" on a row, **accept** the confirmation. **Expect**: row gone, totals recalculated.
2. Click "ลบ" on another row, **decline**. **Expect**: nothing changes.
3. Click "ล้างข้อมูลทั้งหมด", decline. **Expect**: nothing changes. Click again, accept. **Expect**: welcome message back, all summary values "0.00 บาท".
4. Click "ล้างข้อมูลทั้งหมด" with no entries. **Expect**: no prompt, no error.
5. Delete the last remaining entry. **Expect**: welcome message shows.

### F. Responsive (FR-023, SC-006, SC-007)

Use DevTools device mode at 360 px, 768 px and desktop widths. **Expect** at each: form, summary, filters, rows and buttons are all reachable and usable, no horizontal scrollbar, large values (e.g. `1234567890.5`) do not overflow their box.

### G. Visual identity (FR-024..026, SC-009, SC-010)

1. Open the app next to the reference image. **Expect**: cream/peach page with soft stripes, bold orange title with a white outline, white rounded cards with cream borders, an orange "บันทึก" button and orange active filter, and three summary tiles in mint / pink / yellow.
2. Add income and expense rows. **Expect**: green vs red amounts, each with a "รายรับ"/"รายจ่าย" badge; a negative balance is still red.
3. **Expect**: no cartoon characters, logos, `<img>`, `url(...)`, `@import` or external fonts anywhere: `grep -nE "<img|url\(|@import|https?://" index.html style.css app.js` prints nothing.
4. Contrast: every text/background pair is ≥ 4.5:1 (title ≥ 3:1). Verify with the palette table in [research R14](./research.md) or a DevTools contrast check on the title, body text, muted text, income/expense text, badges, primary and filter buttons, placeholders.
5. Turn the network off and reload. **Expect**: identical appearance.

## Ready to ship when

- Every **Expect** above holds and the Console shows no errors.
- No `TODO` string remains in `index.html`, `style.css` or `app.js` (`grep -n TODO index.html style.css app.js` prints nothing).
- Root layout is unchanged: `index.html`, `style.css`, `app.js` at the repo root, no new entry file.
- The branch diff against the base contains only changes traceable to a spec requirement (Principle V).
