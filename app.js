/* ============================================================
   SDD WORKSHOP — BASE TEMPLATE (app.js)
   ============================================================
   โครงโค้ดกลางที่ใช้ได้กับทุกโจทย์ ประกอบด้วย
   - state เดียวที่เป็นแหล่งความจริง (single source of truth)
   - โหลด/บันทึกลง localStorage
   - render() วาดหน้าจอใหม่ทั้งหมดจาก state

   แต่ละทีมแก้ส่วนที่เขียนว่า TODO ให้ตรงกับโจทย์ของตัวเอง
   ต้องวางไฟล์นี้ไว้ที่ root ข้าง ๆ index.html เสมอ
   ============================================================ */

'use strict';

const STORAGE_KEY = 'habit-tracker-state';
const DAYS = ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์', 'อาทิตย์'];

let state = {
  habits: [],
  filter: 'all',
};

const form = document.querySelector('#item-form');
const inputName = document.querySelector('#input-name');
const formError = document.querySelector('#form-error');
const summaryText = document.querySelector('#summary-text');
const filterSection = document.querySelector('#filter-section');
const itemList = document.querySelector('#item-list');
const emptyState = document.querySelector('#empty-state');
const clearButton = document.querySelector('#btn-clear');

function createId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[char]);
}

function showError(message) {
  formError.textContent = message;
  formError.hidden = !message;
}

function getTodayColumnIndex() {
  const jsDay = new Date().getDay();
  return (jsDay + 6) % 7;
}

function normalizeHabitName(value) {
  return String(value).trim();
}

function getHabitCompletionCount(habit) {
  return Array.isArray(habit.completions)
    ? habit.completions.filter(Boolean).length
    : 0;
}

function getVisibleHabits() {
  if (state.filter === 'incomplete') {
    return state.habits.filter((habit) => getHabitCompletionCount(habit) < 7);
  }
  return state.habits;
}

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;

    const parsed = JSON.parse(saved);
    if (parsed && Array.isArray(parsed.habits)) {
      state = {
        ...state,
        ...parsed,
      };
    }
  } catch (error) {
    console.warn('โหลดข้อมูลเดิมไม่สำเร็จ เริ่มจากข้อมูลว่าง', error);
  }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn('บันทึกข้อมูลไม่สำเร็จ', error);
  }
}

function addHabit(name) {
  state.habits.unshift({
    id: createId(),
    name,
    completions: Array(7).fill(false),
  });
}

function toggleHabitDay(habitId, dayIndex) {
  const habit = state.habits.find((entry) => entry.id === habitId);
  if (!habit || !Array.isArray(habit.completions)) return;

  habit.completions[dayIndex] = !habit.completions[dayIndex];
}

function deleteHabit(habitId) {
  state.habits = state.habits.filter((entry) => entry.id !== habitId);
}

function resetWeek() {
  state.habits = state.habits.map((habit) => ({
    ...habit,
    completions: Array(7).fill(false),
  }));
}

function renderSummary() {
  const totalCompleted = state.habits.reduce(
    (sum, habit) => sum + getHabitCompletionCount(habit),
    0,
  );
  const possible = state.habits.length * 7;
  const percent = possible > 0 ? Math.round((totalCompleted / possible) * 100) : 0;
  summaryText.textContent = `สัปดาห์นี้ทำสำเร็จแล้ว ${totalCompleted} จาก ${possible} ครั้ง (${percent}%)`;
}

function renderHabitRows() {
  const visibleHabits = getVisibleHabits();
  const todayIndex = getTodayColumnIndex();

  itemList.innerHTML = visibleHabits.map((habit) => {
    const completed = getHabitCompletionCount(habit);

    return `
      <tr class="habit-row" data-id="${habit.id}">
        <td class="habit-name-cell">
          <span class="habit-name">${escapeHtml(habit.name)}</span>
        </td>
        ${DAYS.map((day, index) => {
          const checked = Boolean(habit.completions[index]);
          const isToday = index === todayIndex;
          return `
            <td class="day-cell ${checked ? 'is-done' : ''} ${isToday ? 'today-highlight' : ''}">
              <button
                type="button"
                class="day-toggle"
                data-action="toggle-day"
                data-habit-id="${habit.id}"
                data-day-index="${index}"
                aria-label="${day} ${checked ? 'ทำสำเร็จแล้ว' : 'ยังไม่ได้ทำ'}"
              >${checked ? '✓' : ''}</button>
            </td>
          `;
        }).join('')}
        <td class="result-cell">${completed}/7 วัน</td>
        <td class="action-cell">
          <button type="button" class="btn btn-icon" data-action="edit" data-habit-id="${habit.id}">แก้ไข</button>
          <button type="button" class="btn btn-icon" data-action="delete" data-habit-id="${habit.id}">ลบ</button>
        </td>
      </tr>
    `;
  }).join('');

  document.querySelectorAll('.day-header').forEach((header, index) => {
    header.classList.toggle('today-highlight', index === todayIndex);
  });

  emptyState.hidden = visibleHabits.length > 0;
}

function render() {
  renderSummary();
  renderHabitRows();

  filterSection.querySelectorAll('.btn-filter').forEach((button) => {
    button.classList.toggle('is-active', button.dataset.filter === state.filter);
  });

  saveState();
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = normalizeHabitName(inputName.value);

  if (!name) {
    showError('กรุณากรอกชื่อนิสัยก่อนกดเพิ่ม');
    inputName.focus();
    return;
  }

  showError('');
  addHabit(name);
  form.reset();
  inputName.focus();
  render();
});

itemList.addEventListener('click', (event) => {
  const action = event.target.dataset.action;
  const habitId = event.target.dataset.habitId;
  const dayIndex = Number(event.target.dataset.dayIndex);

  if (!action || !habitId) return;

  if (action === 'toggle-day') {
    toggleHabitDay(habitId, dayIndex);
  }

  if (action === 'delete') {
    if (!confirm('ต้องการลบนิสัยนี้ใช่หรือไม่?')) return;
    deleteHabit(habitId);
  }

  if (action === 'edit') {
    const habit = state.habits.find((entry) => entry.id === habitId);
    if (!habit) return;

    const nextName = window.prompt('แก้ไขชื่อนิสัย', habit.name);
    if (nextName === null) return;

    const cleaned = normalizeHabitName(nextName);
    if (!cleaned) {
      showError('ชื่อนิสัยไม่สามารถเป็นช่องว่างได้');
      return;
    }

    habit.name = cleaned;
    showError('');
  }

  render();
});

filterSection.addEventListener('click', (event) => {
  const filter = event.target.dataset.filter;
  if (!filter) return;
  state.filter = filter;
  render();
});

clearButton.addEventListener('click', () => {
  if (state.habits.length === 0) return;
  if (!confirm('รีเซ็ตสัปดาห์ใหม่จะล้างเครื่องหมายทุกวันของนิสัยทั้งหมด ใช่หรือไม่?')) return;
  resetWeek();
  render();
});

loadState();
render();

