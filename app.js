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

/* ---------- 1) ค่าคงที่และ state ---------- */

// TODO: เปลี่ยน key ให้เป็นชื่อแอปของทีม เช่น 'sdd-team-1-expense'
const STORAGE_KEY = 'sdd-workshop-base';

// TODO: ปรับ field ของ item ให้ครบตามโจทย์ (เช่น amount, category, rating, dueDate)
let state = {
  items: [],        // รายการทั้งหมด
  filter: 'all',    // มุมมองที่เลือกอยู่
};

/* ---------- 2) อ้างอิง element จาก index.html ---------- */

const form = document.querySelector('#item-form');
const inputName = document.querySelector('#input-name');
const formError = document.querySelector('#form-error');
const summaryText = document.querySelector('#summary-text');
const filterSection = document.querySelector('#filter-section');
const itemList = document.querySelector('#item-list');
const emptyState = document.querySelector('#empty-state');
const clearButton = document.querySelector('#btn-clear');

/* ---------- 3) localStorage ---------- */

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      state = { ...state, ...JSON.parse(saved) };
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

/* ---------- 4) ตัวช่วย ---------- */

function createId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

// ป้องกันข้อความของผู้ใช้ทำ HTML พัง เมื่อนำไปใส่ด้วย innerHTML
function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[char]);
}

function showError(message) {
  formError.textContent = message;
  formError.hidden = !message;
}

/* ---------- 5) การกระทำต่อข้อมูล (Create / Update / Delete) ---------- */

// TODO: รับค่าจากช่องกรอกอื่น ๆ ตามโจทย์ แล้วเก็บเข้า item ด้วย
function addItem(name) {
  state.items.unshift({
    id: createId(),
    name: name,
    done: false,
    createdAt: new Date().toISOString(),
  });
}

function toggleItem(id) {
  const item = state.items.find((entry) => entry.id === id);
  if (item) item.done = !item.done;
}

function deleteItem(id) {
  state.items = state.items.filter((entry) => entry.id !== id);
}

// TODO: เปลี่ยนเงื่อนไขให้ตรงกับตัวกรองของโจทย์
function getVisibleItems() {
  if (state.filter === 'active') return state.items.filter((item) => !item.done);
  if (state.filter === 'done') return state.items.filter((item) => item.done);
  return state.items;
}

/* ---------- 6) วาดหน้าจอ ---------- */

function render() {
  const visibleItems = getVisibleItems();

  // ลิสต์รายการ
  itemList.innerHTML = visibleItems.map((item) => `
    <li class="item ${item.done ? 'is-done' : ''}" data-id="${item.id}">
      <input type="checkbox" data-action="toggle" ${item.done ? 'checked' : ''}>
      <span class="item-text">${escapeHtml(item.name)}</span>
      <button type="button" class="btn btn-icon" data-action="delete">ลบ</button>
    </li>
  `).join('');

  // empty state
  emptyState.hidden = visibleItems.length > 0;

  // TODO: เปลี่ยนข้อความสรุปให้ตรงกับโจทย์ (ยอดเงิน / เปอร์เซ็นต์ / จำนวนที่เหลือ)
  const remaining = state.items.filter((item) => !item.done).length;
  summaryText.textContent = `เหลืออีก ${remaining} รายการ จากทั้งหมด ${state.items.length} รายการ`;

  // ไฮไลต์ปุ่มกรองที่เลือกอยู่
  filterSection.querySelectorAll('.btn-filter').forEach((button) => {
    button.classList.toggle('is-active', button.dataset.filter === state.filter);
  });

  saveState();
}

/* ---------- 7) เชื่อม event ---------- */

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = inputName.value.trim();

  // TODO: เพิ่มการตรวจสอบอื่น ๆ ตามข้อ 2.1 ของโจทย์ (เช่น ตัวเลขต้องมากกว่า 0)
  if (!name) {
    showError('กรุณากรอกข้อมูลก่อนกดเพิ่ม');
    return;
  }

  showError('');
  addItem(name);
  form.reset();
  inputName.focus();
  render();
});

// ใช้ event delegation: ผูก event ครั้งเดียวที่ลิสต์ แทนการผูกทุกแถว
itemList.addEventListener('click', (event) => {
  const action = event.target.dataset.action;
  const id = event.target.closest('.item')?.dataset.id;
  if (!action || !id) return;

  if (action === 'toggle') toggleItem(id);
  if (action === 'delete') deleteItem(id);
  render();
});

filterSection.addEventListener('click', (event) => {
  const filter = event.target.dataset.filter;
  if (!filter) return;
  state.filter = filter;
  render();
});

// TODO: เปลี่ยนพฤติกรรมปุ่มนี้ตามโจทย์ (เช่น ลบเฉพาะรายการที่เสร็จแล้ว)
clearButton.addEventListener('click', () => {
  if (state.items.length === 0) return;
  if (!confirm('ยืนยันการล้างรายการทั้งหมด?')) return;
  state.items = [];
  render();
});

/* ---------- 8) เริ่มทำงาน ---------- */

loadState();
render();
