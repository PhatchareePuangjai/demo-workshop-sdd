# Storage Contract: `localStorage`

**Feature**: [spec.md](../spec.md) | **Data model**: [data-model.md](../data-model.md)

Persistence for FR-016 / FR-017. `localStorage` is the only allowed storage (Principle II); no network calls.

## Key and value

- **Key**: `sdd-team-1-expense` (the base's `STORAGE_KEY`, renamed as its TODO suggests).
- **Value**: a JSON string of exactly this shape:

```json
{
  "items": [
    {
      "id": "lz3k9q1a2b",
      "name": "ข้าวมันไก่",
      "amountSatang": 6000,
      "type": "expense",
      "category": "food",
      "createdAt": "2026-09-20T09:30:00.000Z"
    }
  ]
}
```

`items` is ordered newest first. `filter` and `editing` are never written (see data-model).

## Write rules

- `saveState()` is called by `render()` after every state change, so add / edit / delete / clear-all are persisted immediately (FR-016).
- It writes `JSON.stringify({ items: state.items })`.
- A failed write (quota exceeded, storage disabled) is caught, logged with `console.warn`, and does not stop the UI.

## Read rules (`loadState()`) — FR-017

1. Read the key. If absent → start with `items = []`.
2. `JSON.parse` inside `try/catch`. A parse error → `items = []`.
3. The parsed value must be a non-null object whose `items` is an array; otherwise → `items = []`.
4. Keep only entries where **all** hold, silently dropping the rest:
   - `id`: non-empty string
   - `name`: string with non-empty trimmed value
   - `amountSatang`: safe integer `> 0`
   - `type`: `"income"` or `"expense"`
   - `category`: `"food"`, `"travel"`, `"shopping"` or `"other"`
   - `createdAt`: string
5. The app always renders successfully afterwards; it never shows a blank or frozen page because of stored data.

## Out of scope

No versioning/migration, no sync between browsers or devices, no export. Data lives only in the current browser profile (spec Assumptions).
