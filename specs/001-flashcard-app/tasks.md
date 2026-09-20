---
description: "Tasks list for the Flashcard App feature"
---

# Tasks: Flashcard App

**Input**: Design documents from `/specs/001-flashcard-app/`

## Phase 1: Setup (Shared Infrastructure)

- [ ] T001 Initialize base project structure in index.html, style.css, app.js
- [ ] T002 Implement basic HTML structure for card form, summary, and card list
- [ ] T003 [P] Configure basic CSS for layout, containers, and card flipping animation
- [ ] T004 Implement basic JS state manager for flashcards

---

## Phase 2: Foundational (Blocking Prerequisites)

- [ ] T005 Implement storage manager for `localStorage` (key: `sdd-team-2-flashcards`)
- [ ] T006 Implement base `render()` loop and DOM update mechanism
- [ ] T007 Implement validation logic for non-empty vocabulary/translation
- [ ] T008 Implement card creation logic (adds to state and `localStorage`)

---

## Phase 3: User Story 1 - Create and Manage Vocabulary Cards (Priority: P1) 🎯 MVP

**Goal**: Enable creating, editing, and deleting flashcards.

- [ ] T009 [US1] Implement card edit/delete functionality in the list view
- [ ] T010 [US1] Implement validation error display for the form
- [ ] T011 [US1] Implement empty state display when no cards exist

---

## Phase 4: User Story 2 - Interactive Vocabulary Review with Flips and Filtering (Priority: P2)

**Goal**: Enable interactive review, card flipping, navigation, and filtering.

- [ ] T012 [US2] Implement flip animation in CSS
- [ ] T013 [US2] Implement navigation (Next/Previous) with wrap-around logic
- [ ] T014 [US2] Implement filtering logic (All, Memorized, Not Memorized)
- [ ] T015 [US2] Implement progress indicator ("บัตรที่ X จาก Y")

---

## Phase 5: User Story 3 - Mastery Status Tracking and Real-Time Progress Summary (Priority: P3)

**Goal**: Enable toggling mastery status, progress summary, and bulk-deleting memorized cards.

- [ ] T016 [US3] Implement mastery toggle logic (update status and visual style)
- [ ] T017 [US3] Implement real-time progress summary calculation
- [ ] T018 [US3] Implement bulk-delete ("ล้างบัตรที่จำได้แล้ว") logic

---

## Phase 6: Polish & Cross-Cutting Concerns

- [ ] T019 [P] Optimize CSS flip animations for responsiveness
- [ ] T020 [P] Final visual styling and edge-case handling (long text, empty states)
