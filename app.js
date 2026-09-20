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

function createId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function showError(msg) {
  formError.textContent = msg;
  formError.hidden = !msg;
}

// Logic: Create / Edit Card
function saveCard(vocab, translation) {
  if (!vocab.trim() || !translation.trim()) {
    showError('กรุณากรอกคำศัพท์และคำแปลให้ครบถ้วน');
    return false;
  }

  if (state.editingId) {
    const card = state.items.find(i => i.id === state.editingId);
    if (card) {
      card.vocab = vocab.trim();
      card.translation = translation.trim();
    }
    state.editingId = null;
    form.querySelector('button[type="submit"]').textContent = 'เพิ่มบัตร';
  } else {
    const newCard = {
      id: createId(),
      vocab: vocab.trim(),
      translation: translation.trim(),
      isMemorized: false,
    };
    state.items.push(newCard);
  }
  
  render();
  return true;
}

// Rendering
function render() {
  saveState();
  
  // 1. Render Summary
  const memorizedCount = state.items.filter(i => i.isMemorized).length;
  summaryText.textContent = state.items.length > 0 
    ? `จำได้แล้ว ${memorizedCount} จาก ${state.items.length} คำ` 
    : 'ยังไม่มีคำศัพท์';

  // 2. Render List
  itemList.innerHTML = '';
  state.items.forEach(card => {
    const li = document.createElement('li');
    li.className = `item ${card.isMemorized ? 'memorized' : ''}`;
    li.innerHTML = `
      <div class="item-text"><strong>${card.vocab}</strong>: ${card.translation}</div>
      <div class="actions">
        <button class="btn btn-icon" onclick="toggleMemorized('${card.id}')">✓</button>
        <button class="btn btn-icon" onclick="startEdit('${card.id}')">✎</button>
        <button class="btn btn-icon" onclick="deleteCard('${card.id}')">✕</button>
      </div>
    `;
    itemList.appendChild(li);
  });
  emptyState.hidden = state.items.length > 0;

  // 3. Render Carousel
  renderCarousel();
}

function renderCarousel() {
  const filtered = state.items.filter(item => {
    if (state.filter === 'memorized') return item.isMemorized;
    if (state.filter === 'not_memorized') return !item.isMemorized;
    return true;
  });
  
  if (filtered.length === 0) {
    carousel.innerHTML = '<p>ไม่มีบัตรคำในหมวดหมู่นี้</p>';
    return;
  }

  const card = filtered[state.currentReviewIndex % filtered.length];
  carousel.innerHTML = `
    <div class="flashcard-container" onclick="this.classList.toggle('is-flipped')">
      <div class="flashcard-inner">
        <div class="flashcard-front">${card.vocab}</div>
        <div class="flashcard-back">${card.translation}</div>
      </div>
    </div>
    <p>บัตรที่ ${ (state.currentReviewIndex % filtered.length) + 1} จาก ${filtered.length}</p>
  `;
}

// Event Listeners (Added filtering and navigation)
form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (saveCard(inputVocab.value, inputTranslation.value)) {
    inputVocab.value = '';
    inputTranslation.value = '';
    showError('');
  }
});

document.querySelector('#filter-section').addEventListener('click', (e) => {
  if (e.target.classList.contains('btn-filter')) {
    state.filter = e.target.dataset.filter;
    state.currentReviewIndex = 0; // Reset index on filter change
    document.querySelectorAll('.btn-filter').forEach(btn => btn.classList.remove('is-active'));
    e.target.classList.add('is-active');
    render();
  }
});

btnPrev.addEventListener('click', () => {
  const filtered = state.items.filter(item => {
    if (state.filter === 'memorized') return item.isMemorized;
    if (state.filter === 'not_memorized') return !item.isMemorized;
    return true;
  });
  if (filtered.length > 0) {
    state.currentReviewIndex = (state.currentReviewIndex - 1 + filtered.length) % filtered.length;
    render();
  }
});

btnNext.addEventListener('click', () => {
  const filtered = state.items.filter(item => {
    if (state.filter === 'memorized') return item.isMemorized;
    if (state.filter === 'not_memorized') return !item.isMemorized;
    return true;
  });
  if (filtered.length > 0) {
    state.currentReviewIndex = (state.currentReviewIndex + 1) % filtered.length;
    render();
  }
});

window.startEdit = (id) => {
  const card = state.items.find(i => i.id === id);
  if (card) {
    state.editingId = id;
    inputVocab.value = card.vocab;
    inputTranslation.value = card.translation;
    form.querySelector('button[type="submit"]').textContent = 'บันทึกการแก้ไข';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

window.deleteCard = (id) => {
  state.items = state.items.filter(i => i.id !== id);
  render();
};

window.toggleMemorized = (id) => {
  const card = state.items.find(i => i.id === id);
  if (card) {
    card.isMemorized = !card.isMemorized;
    render();
  }
};

btnClear.addEventListener('click', () => {
  state.items = state.items.filter(i => !i.isMemorized);
  state.currentReviewIndex = 0;
  render();
});
