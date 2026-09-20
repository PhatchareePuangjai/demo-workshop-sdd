# Data Model: Web Flashcard Vocabulary Application (บัตรคำศัพท์)

This document defines the schema, validations, and storage structure for the Web Flashcard Vocabulary Application, satisfying the **Storage Constraint (Principle II)**.

## 1. Local Storage Schema

The application stores its entire state in a single stringified JSON object in the browser's `localStorage` under the key:
`sdd-team-2-flashcards`

### JSON State Object
```json
{
  "items": [
    {
      "id": "lf2q83j8_8p3q1",
      "vocab": "Apple",
      "translation": "แอปเปิ้ล",
      "isMemorized": false,
      "createdAt": "2026-09-20T12:00:00.000Z"
    }
  ],
  "filter": "all",
  "currentReviewIndex": 0
}
```

---

## 2. Entity Definition: `Flashcard`

Each card created by the user is structured as an object with the following properties:

| Property | Type | Required | Description |
|---|---|---|---|
| `id` | `string` | **Yes** | Unique generated identifier (e.g., `"lf2q83j8_8p3q1"`), using timestamp + random characters. |
| `vocab` | `string` | **Yes** | The vocabulary word, phrase, or sentence shown on the card's front. Cannot be blank or whitespace-only. |
| `translation` | `string` | **Yes** | The translation or meaning shown on the card's back. Cannot be blank or whitespace-only. |
| `isMemorized` | `boolean` | **Yes** | Mastery status: `true` for "จำได้แล้ว" (Memorized), `false` for "ยังจำไม่ได้" (Not Memorized). Default is `false`. |
| `createdAt` | `string` | **Yes** | ISO-8601 string representation of when the card was created. |

---

## 3. Entity Validation Rules

Before saving any changes to a flashcard object (creation or modification), the application must enforce the following validation rules (**FR-002**):

- **Non-Empty Check**: Both `vocab` and `translation` must contain at least one non-whitespace character.
- **Trimming**: Before storing or validating, whitespace from the beginning and end of both fields must be trimmed (`.trim()`).
- **Length Constraint**: No technical limit is enforced for creation, but standard CSS word-wrapping (`word-wrap: break-word`, `overflow-wrap: break-word`) must be configured on the cards to prevent long content from breaking the visual card container boundary.

---

## 4. State Transitions

The application operates as a finite state machine driven by user actions:

```text
       [ User inputs card ]
                │
                ▼
         ┌─────────────┐
         │ Validated?  ├─ No ──► Show error (#form-error)
         └──────┬──────┘
                │ Yes
                ▼
      ┌──────────────────┐
      │   isMemorized    │◄────────────────────────┐
      │  (Default: false)│                         │
      └────────┬─────────┘                         │
               │                                   │
      User toggles status                 User toggles status
               │                                   │
               ▼                                   │
      ┌──────────────────┐                         │
      │   isMemorized    ├─────────────────────────┘
      │      (true)      │
      └──────────────────┘
```

- **Card Creation**: Appends a new `Flashcard` to the beginning of `state.items` (using `unshift`), sets default `isMemorized: false`, updates `localStorage`, and calls `render()`.
- **Card Edit**: Populates input fields with active card details, sets `state.editingId`. When saved, replaces the existing card values in `state.items` where `item.id === state.editingId`, resets `state.editingId` to `null`, updates `localStorage`, and calls `render()`.
- **Card Delete**: Filters out the card matching `id` from `state.items`. If the deleted card was being viewed in the carousel, recalculates `state.currentReviewIndex` to avoid out-of-bounds, updates `localStorage`, and calls `render()`.
- **Bulk Delete ("ล้างบัตรที่จำได้แล้ว")**: Filters out all cards where `isMemorized === true` from `state.items`. Resets `state.currentReviewIndex = 0`, updates `localStorage`, and calls `render()`.
- **Mastery Toggle**: Flips the value of `isMemorized` for the selected card, updates `localStorage`, and calls `render()`.
