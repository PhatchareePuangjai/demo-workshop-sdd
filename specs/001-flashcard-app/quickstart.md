# Quickstart Validation Guide: Web Flashcard Vocabulary Application (บัตรคำศัพท์)

This guide documents the procedures to set up, run, and manually validate the Web Flashcard Vocabulary Application. It serves as the primary verification checklist for the feature's acceptance.

---

## 1. Local Setup & Execution

Since the application complies with **Principle I (Simplicity First)** and **Principle VII (Root-Level Entry Point)**, there are no build steps, compiling, or package installations needed.

### Running the App:
- **Option A (Direct File System)**: Simply double-click on the `index.html` file at the root of the repository to open it in any web browser.
- **Option B (Local HTTP Server)**: Open a terminal in the project root directory and run:
  ```bash
  python -m http.server 8000
  ```
  Then navigate to `http://localhost:8000` in your web browser.

---

## 2. Manual Validation Scenarios

Follow these scenarios step-by-step to verify compliance with all functional requirements and acceptance criteria.

### Scenario 1: Vocabulary Card Management (CRUD)
1. **Empty State Validation**: Open the app. If no cards exist in `localStorage`, verify that the screen displays:
   - "ยังไม่มีบัตรคำ เริ่มสร้างคำศัพท์แรกของคุณได้เลย!" (or similar).
   - The review carousel section is hidden.
2. **Card Creation (P1/FR-001)**: 
   - Fill in `"Apple"` in the Vocabulary field and `"แอปเปิ้ล"` in the Translation field. Click the **"เพิ่ม"** button.
   - Verify that a card is added, the empty state disappears, and the card list displays the new card.
3. **Empty Form Validation (FR-002)**:
   - Try to submit the form with empty inputs or spaces.
   - Verify that a clear validation error is displayed in `#form-error` and the card is not saved.
4. **Card Editing (FR-011)**:
   - Click the **"แก้ไข"** button on the `"Apple"` card.
   - Verify that the input fields are populated with the card's current values.
   - Change the translation to `"ผลแอปเปิ้ล"` and click the **"บันทึกการแก้ไข"** button.
   - Verify the card updates dynamically in the list and the review carousel.
5. **Card Deletion (FR-012)**:
   - Click the **"ลบ"** button on a card.
   - Verify that the card is permanently deleted from the DOM and `localStorage`.

### Scenario 2: Interactive Study Carousel (P2/FR-004, FR-005, FR-006)
1. **Preparation**: Add 3 cards:
   - Card 1: `Apple` / `แอปเปิ้ล`
   - Card 2: `Banana` / `กล้วย`
   - Card 3: `Cherry` / `เชอร์รี่`
2. **Carousel Sequential Display**:
   - Verify that the review section is now visible and displays Card 1 (`Apple`).
   - Verify that the progress counter reads: `"บัตรที่ 1 จาก 3"`.
3. **Smooth 3D Card Flipping**:
   - Click on the body of Card 1.
   - Verify that the card performs a smooth flipping animation in under 0.4 seconds to display `"แอปเปิ้ล"`. Click again to flip it back.
4. **Next & Previous Sequential Wrapping**:
   - Click the **"ถัดไป"** (Next) button. Card 2 (`Banana`) should display with the counter `"บัตรที่ 2 จาก 3"`.
   - Click **"ถัดไป"** again to see Card 3 (`Cherry`).
   - Click **"ถัดไป"** once more. The carousel must wrap around to Card 1 (`Apple`), updating the counter to `"บัตรที่ 1 จาก 3"`.
   - Click **"ก่อนหน้า"** (Previous). The carousel must wrap around to Card 3 (`Cherry`), updating the counter to `"บัตรที่ 3 จาก 3"`.

### Scenario 3: Mastery Status & Filter Control (P3/FR-007, FR-008, FR-009, FR-010, FR-013)
1. **Toggle Mastery Status**:
   - On Card 1 (`Apple`), toggle its status to **"จำได้แล้ว"** (Memorized).
   - Verify that:
     - The card in the list or carousel has a distinct visual highlight (e.g. green border or background).
     - The real-time progress text immediately updates to `"จำได้แล้ว 1 จาก 3 คำ"`.
2. **Filter Views**:
   - Change the active filter to **"เฉพาะที่จำได้แล้ว"** (Memorized only).
   - Verify that only Card 1 is shown in both the management list and the review carousel. The carousel counter must read `"บัตรที่ 1 จาก 1"`.
   - Change the filter to **"เฉพาะที่ยังจำไม่ได้"** (Not Memorized only).
   - Verify that only Card 2 and Card 3 are shown.
3. **Bulk-Delete Memorized Cards**:
   - Change the filter back to **"ทั้งหมด"**.
   - Click the **"ล้างบัตรที่จำได้แล้ว"** button.
   - Verify that Card 1 is permanently deleted, leaving only Card 2 and Card 3. The progress text must update to `"จำได้แล้ว 0 จาก 2 คำ"`.
