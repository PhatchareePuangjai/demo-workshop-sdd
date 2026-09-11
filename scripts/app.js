// Simple Todo List implementation (HTML/CSS/JS)

// ---------- Persistence Layer (Foundational) ----------
function loadIssues() {
  const data = localStorage.getItem('issues');
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch (e) {
    showError('Failed to parse stored issues.');
    return [];
  }
}

function saveIssues(issues) {
  try {
    localStorage.setItem('issues', JSON.stringify(issues));
  } catch (e) {
    showError('Failed to save issues.');
  }
}

function generateId() {
  // Simple unique ID based on timestamp + random suffix
  return Date.now().toString() + '-' + Math.floor(Math.random() * 1000);
}

function showError(msg) {
  // For now, use alert – can be replaced with UI toast later
  alert(msg);
}

// ---------- Rendering ----------
function renderIssue(issue) {
  const li = document.createElement('li');
  li.dataset.id = issue.id;

  const titleSpan = document.createElement('span');
  titleSpan.textContent = issue.title;
  li.appendChild(titleSpan);

  // Optional description (shown on hover)
  if (issue.description) {
    titleSpan.title = issue.description;
  }

  // Edit button
  const editBtn = document.createElement('button');
  editBtn.textContent = 'Edit';
  editBtn.setAttribute('aria-label', `Edit issue ${issue.title}`);
  editBtn.addEventListener('click', () => editIssue(issue.id));
  li.appendChild(editBtn);

  // Delete button
  const delBtn = document.createElement('button');
  delBtn.textContent = 'Delete';
  delBtn.setAttribute('aria-label', `Delete issue ${issue.title}`);
  delBtn.addEventListener('click', () => deleteIssue(issue.id));
  li.appendChild(delBtn);

  return li;
}

function renderAll() {
  const list = document.getElementById('issue-list');
  list.innerHTML = '';
  const issues = loadIssues();
  issues.forEach(issue => {
    list.appendChild(renderIssue(issue));
  });
}

// ---------- Handlers ----------
function handleAdd(event) {
  event.preventDefault();
  const titleInput = document.getElementById('title');
  const descInput = document.getElementById('description');
  const title = titleInput.value.trim();
  if (!title) {
    showError('Title cannot be empty.');
    return;
  }
  const description = descInput.value.trim();
  const newIssue = {
    id: generateId(),
    title,
    description: description || undefined,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    status: 'open',
  };
  const issues = loadIssues();
  issues.push(newIssue);
  saveIssues(issues);
  renderAll();
  // clear form
  titleInput.value = '';
  descInput.value = '';
}

function deleteIssue(id) {
  let issues = loadIssues();
  const before = issues.length;
  issues = issues.filter(i => i.id !== id);
  if (issues.length === before) {
    showError('Issue not found or already deleted.');
    return;
  }
  saveIssues(issues);
  renderAll();
}

function editIssue(id) {
  const issues = loadIssues();
  const issue = issues.find(i => i.id === id);
  if (!issue) {
    showError('Issue not found for editing.');
    return;
  }

  // Find the list item element
  const li = document.querySelector(`li[data-id='${id}']`);
  if (!li) {
    showError('UI element for issue not found.');
    return;
  }

  // Replace content with inline edit form
  li.innerHTML = '';

  const titleInput = document.createElement('input');
  titleInput.type = 'text';
  titleInput.value = issue.title;
  titleInput.required = true;
  li.appendChild(titleInput);

  const descInput = document.createElement('textarea');
  descInput.value = issue.description || '';
  li.appendChild(descInput);

  const saveBtn = document.createElement('button');
  saveBtn.textContent = 'Save';
  saveBtn.addEventListener('click', () => {
    const newTitle = titleInput.value.trim();
    if (!newTitle) {
      showError('Title cannot be empty.');
      return;
    }
    issue.title = newTitle;
    issue.description = descInput.value.trim() || undefined;
    issue.updated_at = new Date().toISOString();
    saveIssues(issues);
    renderAll();
  });
  li.appendChild(saveBtn);

  const cancelBtn = document.createElement('button');
  cancelBtn.textContent = 'Cancel';
  cancelBtn.addEventListener('click', () => {
    renderAll();
  });
  li.appendChild(cancelBtn);
}

// ---------- History View ----------
function openHistory() {
  const modal = document.getElementById('history-modal');
  const list = document.getElementById('history-list');
  list.innerHTML = '';
  const issues = loadIssues();
  if (issues.length === 0) {
    const empty = document.createElement('li');
    empty.textContent = 'No issues created yet.';
    list.appendChild(empty);
  } else {
    issues.forEach(issue => {
      const li = document.createElement('li');
      li.textContent = issue.title + (issue.description ? ` – ${issue.description}` : '');
      list.appendChild(li);
    });
  }
  modal.classList.remove('hidden');
}

function closeHistory() {
  document.getElementById('history-modal').classList.add('hidden');
}

// ---------- Initialization ----------
document.addEventListener('DOMContentLoaded', () => {
  // Setup form handler
  const form = document.getElementById('add-issue');
  form.addEventListener('submit', handleAdd);

  // History button
  document.getElementById('history-btn').addEventListener('click', openHistory);
  document.getElementById('history-close').addEventListener('click', closeHistory);

  // Initial render
  renderAll();
});

// End of app.js
