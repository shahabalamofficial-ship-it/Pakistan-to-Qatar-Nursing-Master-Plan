/* =========================================================
   Pakistan → Qatar Nursing Master Plan — app logic
   No build step, no frameworks: fetch JSON, render, persist
   progress to localStorage, offer export/import + print.
   ========================================================= */

const STORAGE_KEY = 'nursing-plan-progress-v1';
const DATA_URL = 'data/roadmap.json';

const els = {
  timeline: document.getElementById('timeline'),
  dedication: document.getElementById('dedication'),
  disclaimer: document.getElementById('disclaimer'),
  routeFrom: document.getElementById('route-from'),
  routeTo: document.getElementById('route-to'),
  progressLabel: document.getElementById('progress-label'),
  progressFill: document.getElementById('progress-fill'),
  progressBar: document.getElementById('progress-bar'),
  offlineNote: document.getElementById('offline-note'),
  footerYear: document.getElementById('footer-year'),
  btnExport: document.getElementById('btn-export'),
  btnImport: document.getElementById('btn-import'),
  fileImport: document.getElementById('file-import'),
  btnPrint: document.getElementById('btn-print'),
  btnReset: document.getElementById('btn-reset'),
};

let roadmap = null;

/** Load saved checklist progress: { [stageId]: { [itemIndex]: true } } */
function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (err) {
    console.error('Could not read saved progress:', err);
    return {};
  }
}

function saveProgress(progress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (err) {
    console.error('Could not save progress:', err);
  }
}

let progress = loadProgress();

function stageStatus(stage) {
  const done = progress[stage.id] || {};
  const total = stage.checklist.length;
  const checkedCount = Object.values(done).filter(Boolean).length;
  if (total > 0 && checkedCount === total) return 'done';
  if (checkedCount > 0) return 'current';
  return 'pending';
}

function markFirstPendingAsCurrent(statuses) {
  const firstPendingIndex = statuses.findIndex(s => s === 'pending');
  if (firstPendingIndex !== -1) statuses[firstPendingIndex] = 'current';
  return statuses;
}

function renderStage(stage, status) {
  const li = document.createElement('li');
  li.className = 'stage';
  li.dataset.status = status;

  const stamp = document.createElement('div');
  stamp.className = 'stage__stamp';
  stamp.innerHTML = `<span>${stage.id}</span>`;
  li.appendChild(stamp);

  const card = document.createElement('div');
  card.className = 'stage__card';

  const head = document.createElement('div');
  head.className = 'stage__head';
  head.innerHTML = `
    <h2 class="stage__title">${stage.title}</h2>
    <span class="stage__duration">${stage.duration}</span>
  `;
  card.appendChild(head);

  const titleUr = document.createElement('p');
  titleUr.className = 'stage__title-ur';
  titleUr.lang = 'ur';
  titleUr.dir = 'rtl';
  titleUr.textContent = stage.titleUr || '';
  card.appendChild(titleUr);

  const desc = document.createElement('p');
  desc.className = 'stage__desc';
  desc.textContent = stage.description;
  card.appendChild(desc);

  const list = document.createElement('ul');
  list.className = 'stage__checklist';
  stage.checklist.forEach((item, idx) => {
    const itemLi = document.createElement('li');
    const label = document.createElement('label');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = !!(progress[stage.id] && progress[stage.id][idx]);
    checkbox.addEventListener('change', () => {
      if (!progress[stage.id]) progress[stage.id] = {};
      progress[stage.id][idx] = checkbox.checked;
      saveProgress(progress);
      renderAll();
    });
    const span = document.createElement('span');
    span.textContent = item;
    label.appendChild(checkbox);
    label.appendChild(span);
    itemLi.appendChild(label);
    list.appendChild(itemLi);
  });
  card.appendChild(list);

  li.appendChild(card);
  return li;
}

function renderAll() {
  if (!roadmap) return;

  els.dedication.textContent = roadmap.meta.subtitle;
  els.disclaimer.textContent = roadmap.meta.disclaimer;
  els.routeFrom.textContent = roadmap.meta.route.from;
  els.routeTo.textContent = roadmap.meta.route.to;

  const statuses = markFirstPendingAsCurrent(
    roadmap.stages.map(stageStatus)
  );

  els.timeline.innerHTML = '';
  roadmap.stages.forEach((stage, i) => {
    els.timeline.appendChild(renderStage(stage, statuses[i]));
  });

  const doneCount = statuses.filter(s => s === 'done').length;
  const total = roadmap.stages.length;
  els.progressLabel.textContent = `${doneCount} / ${total}`;
  const pct = total ? Math.round((doneCount / total) * 100) : 0;
  els.progressFill.style.width = pct + '%';
  els.progressBar.setAttribute('aria-valuenow', String(pct));
}

async function init() {
  els.footerYear.textContent = new Date().getFullYear();

  try {
    const res = await fetch(DATA_URL);
    if (!res.ok) throw new Error('Network response was not ok');
    roadmap = await res.json();
    renderAll();
  } catch (err) {
    console.error('Failed to load roadmap data:', err);
    els.timeline.innerHTML = `<li class="stage"><div class="stage__card">
      <p class="stage__desc">روڈ میپ ڈیٹا لوڈ نہیں ہو سکا۔ اگر آپ یہ فائل براہ راست کھول رہے ہیں تو براہ کرم اسے کسی لوکل سرور یا GitHub Pages کے ذریعے چلائیں۔</p>
    </div></li>`;
  }

  window.addEventListener('online', () => els.offlineNote.hidden = true);
  window.addEventListener('offline', () => els.offlineNote.hidden = false);
  if (!navigator.onLine) els.offlineNote.hidden = false;
}

/* ---------- Actions: export / import / print / reset ---------- */

els.btnExport.addEventListener('click', () => {
  const blob = new Blob([JSON.stringify(progress, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'nursing-plan-progress.json';
  a.click();
  URL.revokeObjectURL(url);
});

els.btnImport.addEventListener('click', () => els.fileImport.click());

els.fileImport.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const text = await file.text();
    const imported = JSON.parse(text);
    progress = imported;
    saveProgress(progress);
    renderAll();
  } catch (err) {
    console.error('Import failed:', err);
    alert('یہ فائل درست فارمیٹ میں نہیں ہے۔');
  }
  e.target.value = '';
});

els.btnPrint.addEventListener('click', () => window.print());

els.btnReset.addEventListener('click', () => {
  const confirmed = confirm('کیا آپ واقعی اپنی تمام پیش رفت ری سیٹ کرنا چاہتے ہیں؟');
  if (!confirmed) return;
  progress = {};
  saveProgress(progress);
  renderAll();
});

/* ---------- PWA: register service worker ---------- */

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(err => {
      console.error('Service worker registration failed:', err);
    });
  });
}

init();
