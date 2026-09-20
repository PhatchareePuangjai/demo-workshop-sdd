# Technical Research: Web Flashcard Vocabulary Application (บัตรคำศัพท์)

This research document analyzes the technical approaches for implementing the Interactive 3D Card Flipping, Carousel Navigation, Local Storage Persistence, and Single Source of Truth Re-rendering for the Web Flashcard Vocabulary Application.

## 1. CSS 3D Card Flipping Animation

To meet **FR-006** and **SC-002** (smooth flipping animation under 0.4 seconds), we will use CSS 3D Transforms.

### Recommended CSS Structure
```css
/* Card container establishing the 3D perspective space */
.flashcard-container {
  perspective: 1000px;
  width: 100%;
  max-width: 400px;
  height: 250px;
  margin: 20px auto;
  cursor: pointer;
}

/* Inner container holding front and back, applying the 3D transform style */
.flashcard-inner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.4s ease-in-out;
  transform-style: preserve-3d;
}

/* Flip effect when active class is applied */
.flashcard-container.is-flipped .flashcard-inner {
  transform: rotateY(180deg);
}

/* Front and Back side shared properties */
.flashcard-front, .flashcard-back {
  position: absolute;
  width: 100%;
  height: 100%;
  -webkit-backface-visibility: hidden; /* For Safari compatibility */
  backface-visibility: hidden;
  border-radius: var(--radius);
  border: 2px solid var(--color-border);
  background: var(--color-surface);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: var(--gap);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

/* Front side design */
.flashcard-front {
  color: var(--color-text);
}

/* Back side rotated 180 degrees initially */
.flashcard-back {
  transform: rotateY(180deg);
  color: var(--color-primary);
  background: #f8fafc;
}
```

### Rationale & Alternatives Considered
- **CSS Transitions (`rotateY`)**: Chosen because it is hardware-accelerated, highly performant, handles responsive scaling perfectly, and takes exactly 0.4s which satisfies SC-002.
- **JS-based Flip**: Rejected because CSS 3D transforms offer better frame rates and comply directly with the "Simplicity First" principle (no JS animation libraries required).

---

## 2. Carousel Navigation & State Tracking

The user story requires sequential card-by-card navigation with carousel wrapping.

### State Model Tracking
We must track:
1. `state.currentReviewIndex`: index of the currently displayed card in the *filtered* list.
2. `state.filter`: `'all'`, `'memorized'`, or `'not_memorized'`.

### Navigation Wrapping Logic
When navigating through a filtered list of length `N`:
- **ถัดไป (Next)**: `(currentReviewIndex + 1) % N`
- **ก่อนหน้า (Previous)**: `(currentReviewIndex - 1 + N) % N`

### Single-Card & Empty States
- If `N === 1`: Navigation buttons remain active but the index stays `0`.
- If `N === 0`: The carousel review container is hidden, and an appropriate empty state is displayed:
  - If there are no cards in the system: `"ยังไม่มีบัตรคำ เริ่มสร้างคำศัพท์แรกของคุณได้เลย!"`
  - If a filter is active but matches no cards: `"ไม่มีคำศัพท์ในหมวดหมู่นี้"`

---

## 3. Storage State Synchronizer & LocalStorage

To satisfy **FR-003** and **SC-004**, we serialize and deserialize the application state on every modification.

```js
const STORAGE_KEY = 'sdd-team-2-flashcards';

let state = {
  items: [],              // Array of Flashcard objects
  filter: 'all',          // 'all', 'memorized', 'not_memorized'
  currentReviewIndex: 0,  // Carousel active pointer
  editingId: null,        // Pointer for inline/form editing
};
```

### Uniqueness & Key Generation
We will use a secure combination of timestamp and random characters for generating unique card IDs:
```js
function createId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}
```

---

## 4. Single-Source-of-Truth rendering Loop

To comply with **Principle VI (Shared Interface)**, we implement a centralized `render()` function that writes to the DOM based entirely on the `state` object.

```js
function render() {
  // 1. Form and input styling updates (including edit vs add mode labels)
  // 2. Render progress summaries and counters
  // 3. Filter list items based on state.filter
  // 4. Render the list of all vocab cards for management (CRUD)
  // 5. Render the interactive active review card (front/back) with correct indexes
  // 6. Manage hidden state of empty views
  // 7. Update bulk-action buttons visibility
}
```
Whenever an action happens (add, edit, toggle, delete), we mutate `state`, invoke `saveState()`, and then call `render()`. This eliminates race conditions and ensures visual synchronization.
