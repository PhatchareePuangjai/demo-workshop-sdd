# Tasks: Web Flashcard Vocabulary Application

**Input**: Design documents from `/specs/001-flashcard-app/`

**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and base template adaptation

- [x] T001 Adapt `index.html` structure to match Flashcard App requirements
- [x] T002 Adapt `style.css` for 3D card flipping and card layout
- [x] T003 Adapt `app.js` with `state` structure and `render()` loop

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core logic and state management that MUST be complete before ANY user story can be implemented

- [x] T004 Implement `loadState()` and `saveState()` using `localStorage` in `app.js`
- [x] T005 Implement `createId()` helper function
- [x] T006 Implement `render()` function skeletal structure
- [x] T007 Implement validation logic (`showError`, `escapeHtml`)

---

## Phase 3: User Story 1 - Create and Manage Vocabulary Cards (Priority: P1) 🎯 MVP

**Goal**: Enable users to create, view, edit, and delete vocabulary cards.

- [ ] T008 [US1] Implement card creation logic (`addItem`) in `app.js`
- [ ] T009 [US1] Connect form submission to `addItem` and update `render()`
- [ ] T010 [US1] Implement card list rendering logic in `render()`
- [ ] T011 [US1] Implement card editing logic (populate form from existing card)
- [ ] T012 [US1] Implement card deletion logic (`deleteItem`) in `app.js`

---

## Phase 4: User Story 2 - Interactive Vocabulary Review with Flips and Filtering (Priority: P2)

**Goal**: Provide interactive review mode with flip animation and filtering.

- [ ] T013 [US2] Implement CSS 3D flip animation in `style.css`
- [ ] T014 [US2] Implement review carousel rendering logic in `render()`
- [ ] T015 [US2] Implement navigation controls ("ถัดไป", "ก่อนหน้า") with wrapping logic
- [ ] T016 [US2] Implement filter logic (`getVisibleItems`) based on `state.filter`
- [ ] T017 [US2] Connect filter buttons to state and update `render()`

---

## Phase 5: User Story 3 - Mastery Status Tracking and Real-Time Progress Summary (Priority: P3)

**Goal**: Track mastery status, show progress, and bulk-clear memorized cards.

- [ ] T018 [US3] Implement mastery toggle logic (`toggleItem`) in `app.js`
- [ ] T019 [US3] Implement real-time progress summary rendering in `render()`
- [ ] T020 [US3] Implement bulk-delete logic for memorized cards in `app.js`
- [ ] T021 [US3] Add visual styles for "Memorized" cards in `style.css`

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements and final validation

- [ ] T022 Implement empty state messaging (`empty-state` in `index.html` + `render()` logic)
- [ ] T023 Apply responsive layout optimizations in `style.css`
- [ ] T024 Perform end-to-end verification using `quickstart.md`
