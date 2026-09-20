# Feature Specification: Web Flashcard Vocabulary Application (บัตรคำศัพท์)

**Feature Branch**: `001-flashcard-app`

**Created**: 2026-09-20

**Status**: Draft

**Input**: User description: "specs/โจทย์/team-2.md"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Create and Manage Vocabulary Cards (Priority: P1)

As a learner, I can create new flashcards with vocabulary on the front and translation on the back, edit existing cards, and delete individual cards so that I can maintain a personalized list of terms to study.

**Why this priority**: It is the core content-creation engine of the application. Without the ability to add, edit, and delete cards, no subsequent review or tracking features can function.

**Independent Test**: The user can successfully create a new card, view it in the card list, edit its content, and delete it, verified entirely through local storage updates and DOM changes.

**Acceptance Scenarios**:

1. **Given** the application has no cards (empty state), **When** the user fills in "Apple" for the vocabulary field and "แอปเปิ้ล" for the translation field and clicks the add button, **Then** a new flashcard is created and saved to `localStorage`, and the empty state is replaced by the list of cards.
2. **Given** the card creation form, **When** the user attempts to add a card with an empty vocabulary field or an empty translation field, **Then** the system displays a clear validation error message and does not save or add the card.
3. **Given** a list of existing flashcards, **When** the user clicks the "Edit" button on a specific card, **Then** they can modify the vocabulary and/or translation fields, and saving those changes updates the card's content dynamically in the review and list views as well as in `localStorage`.
4. **Given** a list of existing flashcards, **When** the user clicks the "Delete" button on a card, **Then** the card is permanently removed from the interface and from `localStorage`.

---

### User Story 2 - Interactive Vocabulary Review with Flips and Filtering (Priority: P2)

As a learner, I can view my cards in an interactive review interface, click each card to flip between front (vocabulary) and back (translation), navigate through them sequentially, and filter the view to focus on specific categories (All, Memorized, Not Memorized).

**Why this priority**: Interactive study and active recall are the primary value-drivers of the flashcard application. Filtering allows targeted practice.

**Independent Test**: The user can navigate through a subset of cards, flip them back and forth with animations, and filter the review session based on card mastery.

**Acceptance Scenarios**:

1. **Given** a set of 3 cards, **When** entering the review mode, **Then** the cards are shown one at a time, displaying the first card's front side alongside a counter saying "บัตรที่ 1 จาก 3".
2. **Given** a card displayed in review mode, **When** the user clicks on the card body, **Then** the card executes a smooth flipping animation to swap between showing the vocabulary (front) and the translation (back).
3. **Given** a set of 3 cards in review mode, **When** the user clicks the "ถัดไป" (Next) button on the 3rd card, **Then** the review carousel wraps around and displays the 1st card with the counter "บัตรที่ 1 จาก 3" without errors.
4. **Given** a set of 3 cards in review mode, **When** the user clicks the "ก่อนหน้า" (Previous) button on the 1st card, **Then** the review carousel wraps around and displays the 3rd card with the counter "บัตรที่ 3 จาก 3" without errors.
5. **Given** a mixed set of 5 cards (2 marked "Memorized" and 3 marked "Not Memorized"), **When** the user selects the "เฉพาะที่จำได้แล้ว" filter, **Then** the review mode only displays the 2 memorized cards, updating the carousel and the counter to reflect the filtered set (e.g., "บัตรที่ 1 จาก 2").

---

### User Story 3 - Mastery Status Tracking and Real-Time Progress Summary (Priority: P3)

As a learner, I can mark each card as "remembered" (จำได้แล้ว) or "not remembered" (ยังจำไม่ได้), see a real-time summary of my progress, and clear all memorized cards in a single action to clean up my list.

**Why this priority**: Tracking mastery provides direct feedback on learning progress and enables users to manage their workload by filtering out or clearing mastered words.

**Independent Test**: The user can change a card's mastery status, witness the visual style and real-time counter update instantly, and bulk-delete memorized cards.

**Acceptance Scenarios**:

1. **Given** a card, **When** the user marks it as "จำได้แล้ว" (Memorized), **Then** the card's visual design is immediately updated with a distinctive highlight (such as a green border or background) and the real-time progress text updates immediately (e.g., "จำได้แล้ว 1 จาก 10 คำ").
2. **Given** a card marked as "จำได้แล้ว", **When** the user marks it as "ยังจำไม่ได้" (Not Memorized), **Then** the card reverts to the standard neutral style and the progress text is updated accordingly.
3. **Given** a set of cards where some are marked as "จำได้แล้ว", **When** the user clicks the "ล้างบัตรที่จำได้แล้ว" (Clear Memorized Cards) button, **Then** all cards with the "Memorized" status are deleted from the system and `localStorage` in a single action, and the list and progress indicators are refreshed.

### Edge Cases

- **Long Text Handling**: When the vocabulary word or translation is extremely long, the card container must use word-wrapping to ensure text stays beautifully inside the card borders without overflowing or breaking the layout.
- **Empty States**: If there are no cards at all, or if a selected filter matches no cards, the app must display a friendly, clear empty state message (e.g., "ยังไม่มีบัตรคำ เริ่มสร้างคำศัพท์แรกของคุณได้เลย!" or "ไม่มีคำศัพท์ในหมวดหมู่นี้") and hide the review interface.
- **One-Card Navigation**: When there is only 1 card, clicking "ถัดไป" or "ก่อนหน้า" should keep displaying that card without errors, and the counter should read "บัตรที่ 1 จาก 1".

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow users to input "Vocabulary" (front) and "Translation/Meaning" (back) via a form.
- **FR-002**: System MUST validate that neither the vocabulary nor translation fields are empty or whitespace-only before saving a card.
- **FR-003**: System MUST save all flashcards and their states (mastery status) to the browser's `localStorage` to persist data across page reloads and browser restarts.
- **FR-004**: System MUST support a single-card review view that displays one card at a time with "ก่อนหน้า" (Previous) and "ถัดไป" (Next) navigation controls.
- **FR-005**: System MUST display a progress indicator showing the active card index and the total count of cards currently being reviewed (e.g., "บัตรที่ X จาก Y").
- **FR-006**: System MUST flip the card visually when clicked, transitioning smoothly between the front side (vocabulary) and the back side (translation) using a CSS animation.
- **FR-007**: System MUST provide three review filters: "ทั้งหมด" (All), "เฉพาะที่จำได้แล้ว" (Memorized only), and "เฉพาะที่ยังจำไม่ได้" (Not Memorized only).
- **FR-008**: System MUST allow users to toggle the mastery status of each card between "จำได้แล้ว" (Memorized) and "ยังจำไม่ได้" (Not Memorized).
- **FR-009**: System MUST apply a distinct visual style (using colors, borders, or badges) to cards marked as "จำได้แล้ว" to make them easily distinguishable.
- **FR-010**: System MUST display a real-time progress summary showing the number of memorized cards compared to the total number of cards (e.g., "จำได้แล้ว X จาก Y คำ").
- **FR-011**: System MUST allow editing both the vocabulary and translation of any existing card.
- **FR-012**: System MUST allow deleting cards individually.
- **FR-013**: System MUST provide a bulk-delete action ("ล้างบัตรที่จำได้แล้ว") that removes all cards marked as "จำได้แล้ว" simultaneously.
- **FR-014**: System MUST display an empty state message when there are no cards in the current selected filter view.

### Key Entities *(include if feature involves data)*

- **Flashcard**: Represents a vocabulary card. Key attributes include:
  - `id`: Unique identifier (string or timestamp).
  - `vocab`: The vocabulary word or phrase (front side, non-empty string).
  - `translation`: The meaning or translation (back side, non-empty string).
  - `isMemorized`: Boolean status representing if the user has mastered this card (`true` for "จำได้แล้ว", `false` for "ยังจำไม่ได้").

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A user can create a new flashcard and see it added to the list in under 10 seconds.
- **SC-002**: Visual card flip transitions are smooth, taking no more than 0.4 seconds, and use CSS transforms.
- **SC-003**: Real-time progress stats and filtered counts update instantly (in under 0.1 seconds) upon status toggling or card deletion.
- **SC-004**: System preserves 100% of the cards and their states in local storage across browser page reloads.

## Assumptions

- **Target Environment**: The app is run as a single-page static website (no backend, no database) using vanilla HTML, CSS, and JS, compatible with modern web browsers on desktop and mobile.
- **Scope Limits**:
  - No database server or authentication features are implemented, in accordance with the project constitution.
  - Media uploads (images or audio) for flashcards are out of scope.
  - Review carousel wrapping behavior is implemented such that clicking "Next" on the last card loops to the first card, and clicking "Previous" on the first card loops to the last card.
- **Storage**: Browser `localStorage` is available and has sufficient storage capacity (standard 5MB limit is plenty for thousands of plain text flashcards).
- **Base HTML/CSS Constraints**: The application will integrate directly into the existing root-level files (`index.html`, `style.css`, `app.js`), preserving or reshaping standard elements and using single-source-of-truth state rendering.
