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

// Rendering
function render() {
  saveState();
  // Simplified render skeleton for now
  console.log('Rendering state:', state);
}

// Initialize
loadState();
render();
