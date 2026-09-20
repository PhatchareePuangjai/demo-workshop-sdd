'use strict';

/* ---------- 1) ค่าคงที่และ state ---------- */

const STORAGE_KEY = 'sdd-team-1-expense';

let state = {
  items: [],        // รายการทั้งหมด (ล่าสุดอยู่ต้นอาร์เรย์)
  filter: 'all',    // 'all' | 'income' | 'expense'
  editing: null,    // { id, name, amount, error } ของแถวที่กำลังแก้ไข
};

const TYPE_LABELS = { income: 'รายรับ', expense: 'รายจ่าย' };
const CATEGORY_LABELS = { food: 'อาหาร', travel: 'เดินทาง', shopping: 'ช้อปปิ้ง', other: 'อื่น ๆ' };

/* ---------- 2) อ้างอิง element จาก index.html ---------- */

const form = document.querySelector('#item-form');
const inputName = document.querySelector('#input-name');
const inputAmount = document.querySelector('#input-amount');
const inputType = document.querySelector('#input-type');
const inputCategory = document.querySelector('#input-category');
const formError = document.querySelector('#form-error');
const summaryIncome = document.querySelector('#summary-income');
const summaryExpense = document.querySelector('#summary-expense');
const summaryBalance = document.querySelector('#summary-balance');
const filterSection = document.querySelector('#filter-section');
const itemList = document.querySelector('#item-list');
const emptyState = document.querySelector('#empty-state');
const clearButton = document.querySelector('#btn-clear');

/* ---------- 3) localStorage ---------- */

// ตรวจรูปแบบของรายการที่อ่านจาก localStorage (ข้อมูลอาจเสียหรือถูกแก้มือ)
function isValidEntry(entry) {
  return Boolean(entry)
    && typeof entry.id === 'string' && entry.id !== ''
    && typeof entry.name === 'string' && entry.name.trim() !== ''
    && Number.isSafeInteger(entry.amountSatang) && entry.amountSatang > 0
    && Object.keys(TYPE_LABELS).includes(entry.type)
    && Object.keys(CATEGORY_LABELS).includes(entry.category)
    && typeof entry.createdAt === 'string';
}

// อ่านเฉพาะ items เท่านั้น: filter และ editing เริ่มต้นใหม่ทุกครั้งที่เปิดหน้า
// ข้อมูลอ่านไม่ได้หรือรูปแบบผิด → เริ่มจากรายการว่าง ไม่ให้แอปพัง
function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && Array.isArray(saved.items)) {
      state.items = saved.items.filter(isValidEntry);
    }
  } catch (error) {
    console.warn('โหลดข้อมูลเดิมไม่สำเร็จ เริ่มจากข้อมูลว่าง', error);
  }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ items: state.items }));
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

// แปลงค่าที่ผู้ใช้กรอกเป็นสตางค์ (จำนวนเต็ม) ปัดเป็นทศนิยม 2 ตำแหน่ง
// คืน null ถ้าไม่ใช่ตัวเลข หรือปัดแล้วไม่มากกว่า 0
function parseAmountSatang(raw) {
  const baht = Number(raw);
  if (!Number.isFinite(baht)) return null;
  const satang = Math.round(baht * 100);
  return Number.isSafeInteger(satang) && satang > 0 ? satang : null;
}

const bahtFormat = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function formatBaht(satang) {
  return `${bahtFormat.format(satang / 100)} บาท`;
}

// ตรวจชื่อ + จำนวนเงิน ใช้ร่วมกันทั้งตอนเพิ่มและตอนแก้ไข
function validateEntry(name, rawAmount) {
  const trimmed = name.trim();
  if (!trimmed) return { ok: false, message: 'กรุณากรอกชื่อรายการ' };

  const amountSatang = parseAmountSatang(rawAmount);
  if (amountSatang === null) {
    return { ok: false, message: 'กรุณากรอกจำนวนเงินเป็นตัวเลขที่มากกว่า 0' };
  }
  return { ok: true, name: trimmed, amountSatang };
}

/* ---------- 5) การกระทำต่อข้อมูล ---------- */

function addItem(name, amountSatang, type, category) {
  state.items.unshift({
    id: createId(),
    name,
    amountSatang,
    type,
    category,
    createdAt: new Date().toISOString(),
  });
}

// แก้ไขได้ทีละแถว: เริ่มแก้แถวใหม่ = ทิ้งฉบับร่างของแถวเดิม
function startEdit(id) {
  const item = state.items.find((entry) => entry.id === id);
  if (!item) return;
  state.editing = { id, name: item.name, amount: (item.amountSatang / 100).toFixed(2), error: '' };
}

function cancelEdit() {
  state.editing = null;
}

// แก้เฉพาะชื่อและจำนวนเงิน: ประเภท หมวดหมู่ เวลา และตำแหน่งในลิสต์ไม่เปลี่ยน
function saveEdit(id, name, rawAmount) {
  const result = validateEntry(name, rawAmount);
  if (!result.ok) {
    // ไม่ผ่าน: รายการคงเดิม เก็บค่าที่พิมพ์ไว้ให้แก้ต่อ พร้อมข้อความในแถว
    state.editing = { id, name, amount: rawAmount, error: result.message };
    return;
  }
  const item = state.items.find((entry) => entry.id === id);
  if (item) {
    item.name = result.name;
    item.amountSatang = result.amountSatang;
  }
  state.editing = null;
}

function deleteItem(id) {
  state.items = state.items.filter((entry) => entry.id !== id);
}

// ตัวกรองมีผลกับลิสต์เท่านั้น (สรุปยอดใช้รายการทั้งหมด)
function getVisibleItems() {
  if (state.filter === 'all') return state.items;
  return state.items.filter((item) => item.type === state.filter);
}

// สรุปยอดคำนวณจากรายการทั้งหมดเสมอ ไม่ขึ้นกับตัวกรอง
function getSummary() {
  let incomeSatang = 0;
  let expenseSatang = 0;
  state.items.forEach((item) => {
    if (item.type === 'income') incomeSatang += item.amountSatang;
    if (item.type === 'expense') expenseSatang += item.amountSatang;
  });
  return { incomeSatang, expenseSatang, balanceSatang: incomeSatang - expenseSatang };
}

/* ---------- 6) วาดหน้าจอ ---------- */

function itemRowHtml(item) {
  return `
    <li class="item item-${item.type}" data-id="${item.id}">
      <div class="item-main">
        <span class="item-name">${escapeHtml(item.name)}</span>
        <span class="item-meta"><span class="badge">${TYPE_LABELS[item.type]}</span> ${CATEGORY_LABELS[item.category]}</span>
      </div>
      <span class="item-amount">${formatBaht(item.amountSatang)}</span>
      <div class="item-actions">
        <button type="button" class="btn btn-icon" data-action="edit">แก้ไข</button>
        <button type="button" class="btn btn-icon" data-action="delete">ลบ</button>
      </div>
    </li>
  `;
}

function editRowHtml(editing) {
  return `
    <li class="item is-editing" data-id="${editing.id}">
      <form class="edit-form" novalidate>
        <input class="input" data-field="name" placeholder="ชื่อรายการ" value="${escapeHtml(editing.name)}">
        <input class="input" data-field="amount" type="number" step="any" inputmode="decimal" placeholder="จำนวนเงิน (บาท)" value="${escapeHtml(editing.amount)}">
        <button type="submit" class="btn btn-primary">บันทึก</button>
        <button type="button" class="btn" data-action="cancel">ยกเลิก</button>
        <p class="form-error" ${editing.error ? '' : 'hidden'}>${escapeHtml(editing.error)}</p>
      </form>
    </li>
  `;
}

function render() {
  const visibleItems = getVisibleItems();

  // ลิสต์รายการ (แถวที่กำลังแก้ไขวาดเป็นฟอร์ม)
  itemList.innerHTML = visibleItems.map((item) => (
    state.editing && state.editing.id === item.id ? editRowHtml(state.editing) : itemRowHtml(item)
  )).join('');

  // empty state: ยังไม่มีรายการเลย ≠ มีรายการแต่ตัวกรองไม่ตรงสักรายการ
  emptyState.textContent = state.items.length === 0
    ? 'ยังไม่มีรายการ เริ่มบันทึกรายรับ-รายจ่ายแรกของคุณได้เลย!'
    : 'ไม่มีรายการในมุมมองนี้';
  emptyState.hidden = visibleItems.length > 0;

  // สรุปยอด (ติดลบเท่านั้นที่เป็นสีแดง ยอด 0 ไม่ถือว่าติดลบ)
  const { incomeSatang, expenseSatang, balanceSatang } = getSummary();
  summaryIncome.textContent = formatBaht(incomeSatang);
  summaryExpense.textContent = formatBaht(expenseSatang);
  summaryBalance.textContent = formatBaht(balanceSatang);
  summaryBalance.closest('.summary-item').classList.toggle('is-negative', balanceSatang < 0);

  // ไฮไลต์ปุ่มกรองที่เลือกอยู่
  filterSection.querySelectorAll('.btn-filter').forEach((button) => {
    button.classList.toggle('is-active', button.dataset.filter === state.filter);
  });

  saveState();
}

/* ---------- 7) เชื่อม event ---------- */

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const result = validateEntry(inputName.value, inputAmount.value);

  // ไม่ผ่าน: แจ้งข้อผิดพลาด และคงค่าที่กรอกไว้ในฟอร์มเพื่อให้แก้ต่อได้
  if (!result.ok) {
    showError(result.message);
    return;
  }

  showError('');
  addItem(result.name, result.amountSatang, inputType.value, inputCategory.value);
  state.editing = null;
  form.reset();
  inputName.focus();
  render();
});

// ใช้ event delegation: ผูก event ครั้งเดียวที่ลิสต์ แทนการผูกทุกแถว
itemList.addEventListener('click', (event) => {
  const action = event.target.dataset.action;
  const id = event.target.closest('.item')?.dataset.id;
  if (!action || !id) return;

  // ปุ่มอื่น (เช่น ปุ่มบันทึกของฟอร์มแก้ไข) ต้องไม่ render ก่อน submit
  // ไม่งั้นฟอร์มถูกวาดใหม่และค่าที่พิมพ์หาย
  if (action === 'edit') startEdit(id);
  else if (action === 'cancel') cancelEdit();
  else if (action === 'delete') {
    // ยกเลิกการยืนยัน = ไม่ทำอะไรเลย และไม่ render (ไม่ให้ค่าที่พิมพ์ค้างในแถวแก้ไขถูกวาดทับ)
    if (!confirm('ยืนยันการลบรายการนี้?')) return;
    deleteItem(id);
    state.editing = null;
  } else return;

  render();
  if (action === 'edit') itemList.querySelector('[data-field="name"]')?.focus();
});

itemList.addEventListener('submit', (event) => {
  event.preventDefault();
  const editForm = event.target.closest('.edit-form');
  if (!editForm) return;

  saveEdit(
    editForm.closest('.item').dataset.id,
    editForm.querySelector('[data-field="name"]').value,
    editForm.querySelector('[data-field="amount"]').value,
  );
  render();
});

filterSection.addEventListener('click', (event) => {
  const filter = event.target.dataset.filter;
  if (!filter) return;
  state.filter = filter;
  state.editing = null;
  render();
});

clearButton.addEventListener('click', () => {
  if (state.items.length === 0) return;
  if (!confirm('ยืนยันการล้างข้อมูลทั้งหมด?')) return;
  state.items = [];
  state.editing = null;
  render();
});

/* ---------- 8) เริ่มทำงาน ---------- */

loadState();
render();
