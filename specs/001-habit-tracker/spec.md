# Feature Specification: Web Habit Tracker (ติดตามนิสัยประจำวัน)

**Feature Branch**: `001-habit-tracker`

**Created**: 20 กันยายน 2569

**Status**: Draft

**Input**: User description: "Specs from specs/โจทย์/team-4.md"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Create and View Habits (Priority: P1)

As a user looking to build consistency, I want to add new habits to my weekly tracker and toggle their daily completion states from Monday to Sunday, so that I can see my progress visually.

**Why this priority**: This is the core MVP loop of the application. Without the ability to add a habit, view the weekly grid, or toggle completions, the tracker has no utility.

**Independent Test**: Can be fully tested by creating a habit named "Read Book", checking the Monday cell, and verifying that the cell highlights as "completed" and shows "1/7 วัน" (1/7 days).

**Acceptance Scenarios**:

1. **Given** the application is loaded with no habits, **When** the user types "Read Book" in the habit input field and presses Enter (or clicks the add button), **Then** "Read Book" is added to the weekly habit list table and stored in LocalStorage.
2. **Given** a habit "Read Book" in the table, **When** the user clicks on the cell under the "จันทร์" (Monday) column, **Then** that cell's background color changes to indicate completion (e.g., green/blue with a checkmark), the individual habit summary updates to "1/7 วัน", and the state is persisted.
3. **Given** a habit cell "จันทร์" (Monday) which is in "Done" state, **When** the user clicks it again, **Then** the cell reverts to its "Undone" state, the habit summary updates to "0/7 วัน", and the state is persisted.

---

### User Story 2 - Real-time Progress and Multi-view Filtering (Priority: P2)

As a goal-oriented user, I want to see a live visual summary of my weekly progress and filter my habit list, so that I can easily focus on habits that still need attention.

**Why this priority**: Live summary stats and filtering provide immediate motivation and help users manage multiple habits efficiently as the list grows.

**Independent Test**: Can be fully tested by creating 2 habits, marking one as completed for all 7 days and the other with only 3 days completed, then filtering by "เฉพาะที่ยังทำไม่ครบ" and verifying that only the second habit is shown.

**Acceptance Scenarios**:

1. **Given** two habits exist (e.g., "Exercise" and "Read Book") resulting in 14 possible completions for the week, **When** the user marks "Exercise" completed for 3 days and "Read Book" for 2 days, **Then** the header summary text dynamically displays: "สัปดาห์นี้ทำสำเร็จแล้ว 5 จาก 14 ครั้ง (36%)".
2. **Given** two habits exist: "Exercise" (7/7 days completed) and "Read Book" (5/7 days completed), **When** the user selects the "เฉพาะที่ยังทำไม่ครบ" filter, **Then** only "Read Book" is rendered in the list.
3. **Given** the "เฉพาะที่ยังทำไม่ครบ" filter is active, **When** the user selects the "ทั้งหมด" filter, **Then** both "Exercise" and "Read Book" are rendered in the list.

---

### User Story 3 - Habit Management: Editing, Deleting, and Weekly Reset (Priority: P3)

As a user whose routine changes, I want to edit habit names, delete habits I no longer wish to track, and reset my completions for a new week while keeping my list of habits.

**Why this priority**: Real life requires flexibility. Users need to correct typos, retire habits, and restart their week without re-entering all their habits.

**Independent Test**: Can be fully tested by clicking edit on a habit name, renaming it, deleting a habit after confirming, and clicking the "Reset week" button to wipe all completions back to 0/7.

**Acceptance Scenarios**:

1. **Given** a habit "Exer-cise" in the list, **When** the user clicks its edit icon or name, types "Exercise", and saves, **Then** the habit name is successfully updated to "Exercise" across the view and LocalStorage.
2. **Given** a habit "Bad Habit" in the list, **When** the user clicks its delete button and confirms the prompt, **Then** "Bad Habit" is completely removed from the table and LocalStorage.
3. **Given** multiple habits exist with various completions checked, **When** the user clicks the "รีเซ็ตสัปดาห์ใหม่" (Reset New Week) button and confirms, **Then** all weekly completion cells revert to "Undone", individual summaries reset to "0/7 วัน", the overall weekly progress resets to "0 จาก X ครั้ง (0%)", while all habit names are preserved.

### Edge Cases

- **Empty Habit Name**: If a user attempts to add a blank name or name with only spaces, the system MUST prevent submission, show an error message `#form-error`, and keep focus on the input field.
- **Extremely Long Habit Names**: If a habit name is extremely long (e.g., 100+ characters), the name MUST wrap or show ellipsis in a clean layout without overflowing the table container, distorting column widths, or causing horizontal layout breakage.
- **Empty State**: When there are no habits tracked, the table and filters are hidden, and a welcoming empty-state container `#empty-state` is displayed with the message: "ยังไม่มีนิสัยที่ติดตาม เริ่มสร้างนิสัยดี ๆ อันแรกของคุณได้เลย!".
- **Responsive Layout**: On mobile viewports, the weekly tracker table must fit the device width elegantly. If columns exceed screen width, the table container must allow smooth horizontal scrolling (`overflow-x: auto`), ensuring cells remain large enough to tap easily.
- **Today Column Highlight**: The column corresponding to the current day of the week (determined via client's local system date) MUST have a prominent CSS style class (e.g., today-highlight) applied to highlight it, making it clear to the user which column is today.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow users to add new habits via an input field with submission on clicking the submit button or pressing the `Enter` key.
- **FR-002**: System MUST trim whitespace from the habit name input and prevent empty entries from being added, showing a message inside `#form-error` if an invalid entry is attempted.
- **FR-003**: System MUST render habits as rows in a responsive HTML table, with columns for the habit name, days from Monday to Sunday, individual weekly completion counts (e.g., "X/7 วัน"), and management controls (Edit, Delete).
- **FR-004**: System MUST allow users to click any day cell (Monday to Sunday) to toggle its state between "Completed" (Done) and "Incomplete" (Undone).
- **FR-005**: System MUST render completed day cells with a distinct background color and/or a checkmark icon to distinguish them from incomplete cells.
- **FR-006**: System MUST show an individual habit summary for each row displaying the number of completed days out of 7 (e.g., "3/7 วัน").
- **FR-007**: System MUST provide a filter section with view options "ทั้งหมด" (All) and "เฉพาะที่ยังทำไม่ครบ" (Incomplete), where "Incomplete" displays only habits that have fewer than 7 completed days.
- **FR-008**: System MUST display a dynamic weekly completion statistic `#summary-text` representing "Completed actions out of Total potential actions (percentage)" (e.g., "สัปดาห์นี้ทำสำเร็จแล้ว 5 จาก 14 ครั้ง (36%)"), where Total potential actions is equal to `number_of_habits * 7`.
- **FR-009**: System MUST allow users to edit existing habit names in place or through a prompt, saving the changes instantly upon confirmation.
- **FR-010**: System MUST allow users to delete a habit row from the tracker, showing a standard browser confirmation dialog before deletion.
- **FR-011**: System MUST provide a "รีเซ็ตสัปดาห์ใหม่" (Reset New Week) button that clears all checked completions for all habits (setting them to "Undone") while leaving the list of habit names intact, with a confirmation dialog before action.
- **FR-012**: System MUST automatically persist all habit names and completion states to the browser's `localStorage` and load them on page refresh.
- **FR-013**: System MUST identify the current day of the week (Monday through Sunday) using the client system's local clock and apply a visually distinct highlight style to the corresponding day's table header and cells.
- **FR-014**: System MUST follow the flat, root-level project structure specified in the Constitution, modifying `index.html`, `style.css`, and `app.js` at the root directory only.

### Key Entities *(include if feature involves data)*

- **Habit**: Represents an individual habit tracked by the user.
  - `id`: Unique identifier (string or number, e.g., timestamp-based).
  - `name`: Name of the habit (trimmed string, non-empty).
  - `completions`: An array of 7 boolean values representing completion status for Monday through Sunday (index 0 = Monday, index 6 = Sunday).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can add a new habit and see it rendered in the weekly table in less than 2 seconds from clicking the add button or pressing Enter.
- **SC-002**: Data persistence is 100% reliable; reloading or reopening the browser restores the exact list of habits and completion checkmarks with zero data loss.
- **SC-003**: All interface interactions—toggling completions, updating filters, and updating summaries—must occur instantaneously (visual feedback in under 100ms) with no page reloads.
- **SC-004**: Resetting the week clears 100% of completion status checkboxes back to 0/7 across all habits within 2 clicks (clicking Reset, confirming the dialog), with 100% of habit names correctly preserved.

## Assumptions

- **Client Environment**: The user runs the application in a modern standard web browser that supports HTML5 LocalStorage, standard CSS Flexbox/Grid, and ES6+ JavaScript.
- **System Date Integration**: The "Today Column Highlight" relies on the client computer's local clock. If the user changes timezone or date on their device, the highlighted column will shift accordingly.
- **Language**: The user interface, including days of the week ("จันทร์", "อังคาร", etc.) and status messages, will be in Thai to align with the provided team-4 specification.
- **Constitution Compliance**: The implementation adheres to the flat root-level workspace layout (files `index.html`, `style.css`, `app.js` modified at the repository root), with zero external frameworks or backend calls.
