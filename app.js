/* ===== Grocery Assist — app.js ===== */

/* ─── Storage helpers ─── */
const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
const save = (k, v) => localStorage.setItem(k, JSON.stringify(v));

/* ─── State ─── */
let items    = load('ga_items',    []);
let expenses = load('ga_expenses', []);
let budget   = load('ga_budget',   0);
let ocrItems = [];

/* ─── Tab switching ─── */
document.querySelectorAll('.tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(s => s.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
  });
});

/* ─── Shopping List ─── */
function renderList() {
  const search = document.getElementById('searchItems').value.toLowerCase();
  const catFilter = document.getElementById('filterCategory').value;
  const list = document.getElementById('itemList');
  const filtered = items.filter(i =>
    (!search || i.name.toLowerCase().includes(search)) &&
    (!catFilter || i.category === catFilter)
  );

  list.innerHTML = filtered.length === 0
    ? '<p style="color:#4a5568;text-align:center;padding:20px;">No items yet. Add your first item above!</p>'
    : filtered.map(item => `
      <div class="item-card ${item.checked ? 'checked' : ''}" data-id="${item.id}">
        <input type="checkbox" ${item.checked ? 'checked' : ''} onchange="toggleItem('${item.id}')" />
        <span class="item-name">${escHtml(item.name)}</span>
        <span class="cat-badge">${escHtml(item.category)}</span>
        <span class="item-meta">Qty: ${item.qty}</span>
        <span class="item-price">${item.price ? 'R ' + (item.price * item.qty).toFixed(2) : '—'}</span>
        <div class="item-actions">
          <button class="edit" onclick="editItem('${item.id}')">✏️</button>
          <button class="del" onclick="deleteItem('${item.id}')">🗑️</button>
        </div>
      </div>`).join('');

  const checked = items.filter(i => i.checked).length;
  const total   = items.reduce((s, i) => s + (i.price ? i.price * i.qty : 0), 0);
  document.getElementById('totalItems').textContent   = items.length;
  document.getElementById('checkedItems').textContent = checked;
  document.getElementById('estTotal').textContent     = 'R ' + total.toFixed(2);
}

document.getElementById('addItem').addEventListener('click', () => {
  const name  = document.getElementById('itemName').value.trim();
  if (!name) return alert('Please enter an item name.');
  const qty   = parseFloat(document.getElementById('itemQty').value)  || 1;
  const price = parseFloat(document.getElementById('itemPrice').value) || 0;
  const cat   = document.getElementById('itemCategory').value;
  items.push({ id: Date.now().toString(), name, qty, price, category: cat, checked: false });
  save('ga_items', items);
  document.getElementById('itemName').value  = '';
  document.getElementById('itemQty').value   = '1';
  document.getElementById('itemPrice').value = '';
  renderList();
});

window.toggleItem = id => {
  const i = items.find(x => x.id === id);
  if (i) { i.checked = !i.checked; save('ga_items', items); renderList(); }
};

window.deleteItem = id => {
  if (!confirm('Remove this item?')) return;
  items = items.filter(x => x.id !== id);
  save('ga_items', items);
  renderList();
};

window.editItem = id => {
  const i = items.find(x => x.id === id);
  if (!i) return;
  const newName  = prompt('Item name:', i.name);
  if (newName === null) return;
  const newQty   = parseFloat(prompt('Quantity:', i.qty))  || 1;
  const newPrice = parseFloat(prompt('Est. price (R):', i.price)) || 0;
  i.name = newName.trim() || i.name;
  i.qty   = newQty;
  i.price = newPrice;
  save('ga_items', items);
  renderList();
};

document.getElementById('clearAll').addEventListener('click', () => {
  if (!confirm('Clear all items, expenses, and budget?')) return;
  items = []; expenses = []; budget = 0;
  save('ga_items', items); save('ga_expenses', expenses); save('ga_budget', budget);
  renderList(); renderExpenses(); renderBudget();
});

document.getElementById('searchItems').addEventListener('input', renderList);
document.getElementById('filterCategory').addEventListener('change', renderList);

/* ─── Budget ─── */
document.getElementById('monthlyBudget').value = budget || '';

function renderBudget() {
  const spent = expenses.reduce((s, e) => s + e.amount, 0);
  const pct   = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;
  const bar   = document.getElementById('budgetBar');
  bar.style.width = pct + '%';
  bar.classList.toggle('over', spent > budget && budget > 0);
  document.getElementById('spentLabel').textContent  = 'Spent: R ' + spent.toFixed(2);
  document.getElementById('remainLabel').textContent = budget > 0
    ? 'Remaining: R ' + Math.max(budget - spent, 0).toFixed(2)
    : 'No budget set';
}

document.getElementById('saveBudget').addEventListener('click', () => {
  budget = parseFloat(document.getElementById('monthlyBudget').value) || 0;
  save('ga_budget', budget);
  renderBudget();
  alert('Budget saved!');
});

function renderExpenses() {
  const list = document.getElementById('expenseList');
  list.innerHTML = expenses.length === 0
    ? '<p style="color:#4a5568;text-align:center;padding:20px;">No expenses recorded yet.</p>'
    : expenses.map(e => `
      <div class="expense-item">
        <span class="exp-desc">${escHtml(e.desc)}</span>
        <span class="exp-date">${e.date}</span>
        <span class="exp-amt">R ${e.amount.toFixed(2)}</span>
        <button class="exp-del" onclick="deleteExpense('${e.id}')">🗑️</button>
      </div>`).join('');
  renderBudget();
}

document.getElementById('addExpense').addEventListener('click', () => {
  const desc   = document.getElementById('expenseDesc').value.trim();
  const amount = parseFloat(document.getElementById('expenseAmt').value);
  const date   = document.getElementById('expenseDate').value;
  if (!desc || isNaN(amount)) return alert('Please fill in description and amount.');
  expenses.push({ id: Date.now().toString(), desc, amount, date: date || new Date().toISOString().slice(0,10) });
  save('ga_expenses', expenses);
  document.getElementById('expenseDesc').value = '';
  document.getElementById('expenseAmt').value  = '';
  renderExpenses();
});

window.deleteExpense = id => {
  expenses = expenses.filter(x => x.id !== id);
  save('ga_expenses', expenses);
  renderExpenses();
};

/* ─── OCR / Scan Receipt ─── */
const uploadZone   = document.getElementById('uploadZone');
const receiptFile  = document.getElementById('receiptFile');
const previewWrap  = document.getElementById('previewWrap');
const ocrProgress  = document.getElementById('ocrProgress');
const ocrStatus    = document.getElementById('ocrStatus');
const ocrResultEl  = document.getElementById('ocrResult');
const ocrItemList  = document.getElementById('ocrItemList');

uploadZone.addEventListener('click', () => receiptFile.click());

uploadZone.addEventListener('dragover', e => { e.preventDefault(); uploadZone.style.borderColor = '#4ecca3'; });
uploadZone.addEventListener('dragleave', () => { uploadZone.style.borderColor = ''; });
uploadZone.addEventListener('drop', e => {
  e.preventDefault();
  uploadZone.style.borderColor = '';
  if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
});
receiptFile.addEventListener('change', () => { if (receiptFile.files[0]) handleFile(receiptFile.files[0]); });

function handleFile(file) {
  const url = URL.createObjectURL(file);
  document.getElementById('receiptPreview').src = url;
  previewWrap.style.display = 'block';
  ocrResultEl.style.display = 'none';
  runOCR(url);
}

async function runOCR(imageUrl) {
  ocrProgress.style.display = 'flex';
  ocrStatus.textContent = 'Initialising OCR engine…';
  try {
    if (typeof Tesseract === 'undefined') {
      throw new Error('Tesseract.js not loaded. Please check your internet connection.');
    }
    const result = await Tesseract.recognize(imageUrl, 'eng', {
      logger: m => { if (m.status) ocrStatus.textContent = m.status + (m.progress ? ` (${Math.round(m.progress*100)}%)` : ''); }
    });
    ocrProgress.style.display = 'none';
    parseReceiptText(result.data.text);
  } catch (err) {
    ocrProgress.style.display = 'none';
    alert('OCR Error: ' + err.message);
  }
}

function parseReceiptText(text) {
  // Parse lines that have text followed by a price
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const priceRe = /(?:R\s*)?(\d+[\.,]\d{2})\s*$/;
  ocrItems = [];

  lines.forEach((line, idx) => {
    const m = line.match(priceRe);
    if (m) {
      const price = parseFloat(m[1].replace(',', '.'));
      const name  = line.replace(priceRe, '').replace(/[^a-zA-Z0-9\s\-]/g, '').trim();
      if (name.length > 1 && price > 0 && price < 10000) {
        ocrItems.push({ id: 'ocr_' + idx, name, price, selected: true });
      }
    }
  });

  if (ocrItems.length === 0) {
    alert('No items could be extracted from this receipt. Try a clearer image.');
    return;
  }

  ocrItemList.innerHTML = ocrItems.map(i => `
    <div class="ocr-item">
      <input type="checkbox" id="ocr_${i.id}" checked onchange="toggleOcrItem('${i.id}')" />
      <label class="ocr-name" for="ocr_${i.id}">${escHtml(i.name)}</label>
      <span class="ocr-price">R ${i.price.toFixed(2)}</span>
    </div>`).join('');

  ocrResultEl.style.display = 'block';
}

window.toggleOcrItem = id => {
  const item = ocrItems.find(x => x.id === id);
  if (item) item.selected = !item.selected;
};

document.getElementById('importOcr').addEventListener('click', () => {
  const toImport = ocrItems.filter(x => x.selected);
  if (toImport.length === 0) return alert('Select at least one item.');
  toImport.forEach(i => {
    items.push({ id: Date.now().toString() + Math.random(), name: i.name, qty: 1, price: i.price, category: 'Other', checked: false });
  });
  save('ga_items', items);
  alert(`${toImport.length} item(s) imported to your shopping list!`);
  // switch to list tab
  document.querySelector('[data-tab="list"]').click();
  renderList();
});

/* ─── Price Compare ─── */
// Simulated price data for SA grocery stores
const STORE_PRICES = {
  checkers: { name: 'Checkers', variance: 0.95 },
  shoprite: { name: 'Shoprite', variance: 0.90 },
  woolworths: { name: 'Woolworths', variance: 1.25 },
  pick_n_pay: { name: "Pick n Pay", variance: 1.00 },
  spar: { name: 'SPAR', variance: 1.05 },
  food_lover: { name: "Food Lover's Market", variance: 0.98 }
};

// Base prices for common items (ZAR)
const BASE_PRICES = {
  milk: 22, bread: 16, eggs: 38, butter: 48, cheese: 62,
  chicken: 85, beef: 120, pork: 95, fish: 75, rice: 32,
  pasta: 18, sugar: 28, flour: 22, oil: 52, salt: 8,
  pepper: 18, tomato: 24, onion: 18, potato: 32, apple: 28,
  banana: 22, orange: 26, yoghurt: 38, cream: 35, coffee: 95,
  tea: 42, juice: 32, water: 12, cola: 18, beer: 22,
  wine: 85, chips: 24, chocolate: 38, biscuits: 28, cereal: 64,
  soap: 18, shampoo: 55, toothpaste: 32, tissue: 22, detergent: 68
};

document.getElementById('priceSearch').addEventListener('click', searchPrices);
document.getElementById('priceSearchInput').addEventListener('keydown', e => { if (e.key === 'Enter') searchPrices(); });

function searchPrices() {
  const query = document.getElementById('priceSearchInput').value.trim().toLowerCase();
  if (!query) return;

  const results = document.getElementById('priceResults');

  // Find matching items
  const matches = Object.keys(BASE_PRICES).filter(k => k.includes(query) || query.includes(k));

  if (matches.length === 0) {
    results.innerHTML = `<div class="price-card"><p style="color:#8892a4;">No pricing data found for "<strong>${escHtml(query)}</strong>". Try a common grocery term.</p></div>`;
    return;
  }

  results.innerHTML = matches.slice(0, 6).map(item => {
    const base = BASE_PRICES[item];
    const stores = Object.values(STORE_PRICES).map(s => ({
      name: s.name,
      price: +(base * s.variance * (0.9 + Math.random() * 0.2)).toFixed(2)
    })).sort((a,b) => a.price - b.price);

    return `
      <div class="price-card">
        <h3>🛍️ ${item.charAt(0).toUpperCase() + item.slice(1)}</h3>
        <div class="store-list">
          ${stores.map((s, idx) => `
            <div class="store-row">
              <span class="store-name">${escHtml(s.name)}</span>
              <span class="store-price ${idx === 0 ? 'best' : idx === stores.length-1 ? 'high' : ''}">
                R ${s.price.toFixed(2)}
                ${idx === 0 ? '<span class="best-tag">BEST</span>' : ''}
              </span>
            </div>`).join('')}
        </div>
      </div>`;
  }).join('');
}

/* ─── Utility ─── */
function escHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

/* ─── Init ─── */
renderList();
renderExpenses();
renderBudget();
