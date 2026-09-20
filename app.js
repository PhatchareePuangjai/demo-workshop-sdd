'use strict';

const STORAGE_KEY = 'sdd-team-2-flashcards';

let state = {
  items: [],
  filter: 'all',
  currentReviewIndex: 0,
  editingId: null,
};

// DOM References
const form = document.querySelector('#item-form');
const inputVocab = document.querySelector('#input-vocab');
const inputTranslation = document.querySelector('#input-translation');
const formError = document.querySelector('#form-error');
const summaryText = document.querySelector('#summary-text');
const itemList = document.querySelector('#item-list');
const emptyState = document.querySelector('#empty-state');
const btnClear = document.querySelector('#btn-clear');
const carousel = document.querySelector('#carousel');
const btnPrev = document.querySelector('#btn-prev');
const btnNext = document.querySelector('#btn-next');

// State Management
function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) state = { ...state, ...JSON.parse(saved) };
  } catch (e) { console.warn('Failed to load state', e); }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function toggleItem(id) {
  state.items = state.items.map(item =>
    item.id === id ? { ...item, isMemorized: !item.isMemorized } : item
  );
  render();
}

function bulkDeleteMemorized() {
  state.items = state.items.filter(item => !item.isMemorized);
  state.currentReviewIndex = 0;
  render();
}

function createId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function showError(msg) {
  formError.textContent = msg;
  formError.hidden = !msg;
}

// Rendering
function render() {
  saveState();
  
  // Progress Summary
  const total = state.items.length;
  const memorized = state.items.filter(i => i.isMemorized).length;
  summaryText.textContent = total === 0 
    ? 'ยังไม่มีคำศัพท์' 
    : `จำได้แล้ว ${memorized} จาก ${total} คำ`;
  
  // Empty State Logic
  const hasItems = state.items.length > 0;
  itemList.hidden = !hasItems;
  emptyState.hidden = hasItems;

  // Render list (assuming list item rendering structure)
  itemList.innerHTML = '';
  state.items.forEach(item => {
    const li = document.createElement('li');
    li.className = `item ${item.isMemorized ? 'is-memorized' : ''}`;
    li.innerHTML = `
      <div class="item-text">${item.vocab} - ${item.translation}</div>
      <button class="btn btn-icon" onclick="toggleItem('${item.id}')">✓</button>
    `;
    itemList.appendChild(li);
  });
  
  console.log('Rendering state:', state);
}

// Initialize
btnClear.addEventListener('click', bulkDeleteMemorized);
loadState();
render();
