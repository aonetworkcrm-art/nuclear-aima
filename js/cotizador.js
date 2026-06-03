/* ══════════════════════════════════════════════
   NUCLEAR AIMA — COTIZADOR v1.0
   Servicios Instagram Scaling Flow IA
   ══════════════════════════════════════════════ */

/* ── Service Data ── */
const SERVICES = [
  // Seguidores Global
  { id: '8573', cat: 'Seguidores', subcat: 'Global', name: 'Seguidores Instagram', detail: 'Calidad Global · Reabastecimiento 30 días · 50K/día', price: 0.38, min: 50, max: 100000 },
  { id: '8574', cat: 'Seguidores', subcat: 'Global', name: 'Seguidores Instagram', detail: 'Calidad Global · Reabastecimiento 1 año · 50K/día', price: 0.44, min: 50, max: 100000 },
  { id: '8575', cat: 'Seguidores', subcat: 'Global', name: 'Seguidores Instagram', detail: 'Calidad Global · Reabastecimiento de por vida · 50K/día', price: 0.53, min: 50, max: 100000 },
  // Seguidores LATAM
  { id: '8722', cat: 'Seguidores', subcat: 'Latinoamérica', name: 'Seguidores Instagram Latinoamérica', detail: 'Reabastecimiento 30 días · 30K/día', price: 4.72, min: 20, max: 250000 },
  { id: '8723', cat: 'Seguidores', subcat: 'Latinoamérica', name: 'Seguidores Instagram Brasil', detail: 'Reabastecimiento 30 días · 30K/día', price: 4.72, min: 20, max: 150000 },
  // Seguidores Premium
  { id: '8497', cat: 'Seguidores', subcat: 'Premium', name: 'Seguidores Instagram EE.UU.', detail: '100% Real Alta Calidad · 2K/día', price: 16.00, min: 10, max: 40000 },
  { id: '8584', cat: 'Seguidores', subcat: 'Premium', name: 'Seguidores Instagram Premium', detail: 'Reabastecimiento 30 días · 20K/día', price: 8.45, min: 20, max: 2000000 },
  { id: '8718', cat: 'Seguidores', subcat: 'Premium', name: 'Seguidores Latinoamérica Premium', detail: 'Reabastecimiento 30 días · Máx 5K · 1K/día', price: 5.74, min: 10, max: 5000 },
  { id: '8719', cat: 'Seguidores', subcat: 'Premium', name: 'Seguidores Latinoamérica 100% Real', detail: 'Cancelación permitida · Caída 5-10% · 10K/día', price: 5.32, min: 10, max: 10000 },
  { id: '8585', cat: 'Seguidores', subcat: 'Premium', name: 'Seguidores Premium — Mujeres', detail: 'Reabastecimiento 30 días · 20K/día', price: 8.45, min: 20, max: 2000000 },
  { id: '8586', cat: 'Seguidores', subcat: 'Premium', name: 'Seguidores Premium — Hombres', detail: 'Reabastecimiento 30 días · 20K/día', price: 8.45, min: 20, max: 2000000 },
  // Me Gusta
  { id: '8576', cat: 'Me Gusta', subcat: 'Global', name: 'Me Gusta Instagram Global', detail: 'Reabastecimiento 30 días · 50K/día', price: 0.07, min: 100, max: 500000 },
  { id: '8577', cat: 'Me Gusta', subcat: 'Global', name: 'Me Gusta Instagram Global', detail: 'Reabastecimiento de por vida · 50K/día', price: 0.09, min: 100, max: 500000 },
  { id: '8571', cat: 'Me Gusta', subcat: 'Premium', name: 'Me Gusta Latinoamérica — Cuentas reales', detail: 'Con foto de perfil · Sin caída · Reposición 30 días', price: 0.40, min: 20, max: 50000 },
  // Comentarios
  { id: '8721', cat: 'Comentarios', subcat: 'Orgánico', name: 'Me Gusta + Comentarios · Descubrimiento', detail: '100% Orgánico · Máximo 500', price: 55.11, min: 5, max: 500 },
  // Compartidos
  { id: '8181', cat: 'Compartidos', subcat: 'Premium', name: 'Publicaciones Compartidas por Seguidores', detail: 'Cuentas reales 10K-100K · 1 pieza = $0.75', price: 750.00, min: 1, max: 50 },
  // Visualizaciones
  { id: '8039', cat: 'Visualizaciones', subcat: 'Vídeo', name: 'Visualizaciones IGTV + Reels', detail: 'Máx 20M · 5K/hora', price: 0.01, min: 100, max: 20000000 },
  { id: '8390', cat: 'Visualizaciones', subcat: 'Vídeo', name: 'Visualizaciones Vídeo — Económico', detail: 'Todos los enlaces', price: 0.003, min: 250, max: 2000 },
  { id: '8391', cat: 'Visualizaciones', subcat: 'Vídeo', name: 'Visualizaciones Vídeo + Reel + IGTV', detail: 'Rápido y estable · Todos los enlaces', price: 0.02, min: 100, max: 2000 },
  // Historias
  { id: '8587', cat: 'Visualizaciones', subcat: 'Historias', name: 'Visualizaciones Historias — Global', detail: '100% Usuarios Globales', price: 0.39, min: 10, max: 1000 },
  { id: '8588', cat: 'Visualizaciones', subcat: 'Historias', name: 'Visualizaciones Historias — Latinoamérica', detail: '100% Usuarios Latinos', price: 0.39, min: 20, max: 50000 },
  { id: '8589', cat: 'Visualizaciones', subcat: 'Historias', name: 'Visualizaciones Historias — España', detail: '100% Usuarios Españoles', price: 0.39, min: 10, max: 50000 },
  { id: '8590', cat: 'Visualizaciones', subcat: 'Historias', name: 'Visualizaciones Historias — Italia', detail: '100% Usuarios Italianos', price: 0.39, min: 20, max: 50000 },
  // Impresiones
  { id: '8393', cat: 'Impresiones', subcat: 'Alcance', name: 'Visitas al Perfil desde Publicaciones', detail: '50K/día', price: 0.14, min: 100, max: 100000 },
  { id: '8392', cat: 'Impresiones', subcat: 'Alcance', name: 'Impresiones + Alcance — Brasileños', detail: '50K/día', price: 0.09, min: 100, max: 100000 },
  { id: '8394', cat: 'Impresiones', subcat: 'Alcance', name: 'Impresiones [Inicio + Explorar + Ubicación + Perfil]', detail: '10K/día', price: 0.07, min: 10, max: 1000 },
  { id: '8395', cat: 'Impresiones', subcat: 'Alcance', name: 'Impresiones de Publicación — Todos los enlaces', detail: '50K/día', price: 0.04, min: 100, max: 10000 },
  { id: '8397', cat: 'Impresiones', subcat: 'Alcance', name: 'Impresiones + Elementos Compartidos', detail: 'Máx 5M · 100K/día', price: 0.55, min: 100, max: 5000000 },
  // Automatizaciones
  { id: '6899', cat: 'Automatizaciones', subcat: 'Vídeo Auto', name: 'Visualizaciones Auto — IGTV + Reels', detail: 'Máx 100M · Rápido', price: 0.12, min: 100, max: 100000 },
  { id: '6900', cat: 'Automatizaciones', subcat: 'Vídeo Auto', name: 'Visualizaciones Auto — Rápido', detail: 'Máx 10M', price: 0.33, min: 100, max: 20000 },
  { id: '6901', cat: 'Automatizaciones', subcat: 'Vídeo Auto', name: 'Visualizaciones Auto — Instantáneo', detail: 'Máx 20M', price: 0.02, min: 100, max: 100000 },
  { id: '6902', cat: 'Automatizaciones', subcat: 'Impresiones Auto', name: 'Auto Impresiones + Alcance + Visitas + Visualización', detail: 'Alta Calidad · Máx 5M · Rápido', price: 0.29, min: 100, max: 5000 },
  // Guardados
  { id: '8398', cat: 'Guardados', subcat: 'Estándar', name: 'Publicaciones Guardadas', detail: 'Máx 30K · 10K/día', price: 0.01, min: 5, max: 30000 },
  { id: '8399', cat: 'Guardados', subcat: 'Estándar', name: 'Guardados Reales — Estable', detail: 'Todos los enlaces', price: 0.12, min: 10, max: 50000 },
  { id: '6904', cat: 'Guardados', subcat: 'Auto', name: 'Guardados Auto — Alta calidad', detail: 'Máx 30K · Instantáneo · Siempre estable', price: 0.12, min: 10, max: 30000 },
  { id: '6905', cat: 'Guardados', subcat: 'Auto', name: 'Guardados Auto — Instantáneo', detail: 'Máx 50K', price: 0.12, min: 10, max: 50000 },
  // Contenido Compartido
  { id: '8388', cat: 'Contenido Compartido', subcat: 'Estándar', name: 'Contenido Compartido — Súper rápido', detail: 'Garantía 1 año · 100K/día', price: 0.24, min: 100, max: 1000000 },
  { id: '8389', cat: 'Contenido Compartido', subcat: 'Estándar', name: 'Compartido + Interacción + Alcance', detail: 'Máx 1M · 10K/día', price: 0.17, min: 10, max: 1000000 },
];

const CAT_ICONS = {
  'Seguidores': { icon: '👤', bg: '#1a2535', color: '#7db8e8' },
  'Me Gusta': { icon: '❤', bg: '#2a1a25', color: '#e87d9e' },
  'Comentarios': { icon: '💬', bg: '#1a1a35', color: '#9e7de8' },
  'Compartidos': { icon: '↗', bg: '#1a2a1a', color: '#6ecfa5' },
  'Visualizaciones': { icon: '▶', bg: '#1a2535', color: '#7db8e8' },
  'Impresiones': { icon: '📊', bg: '#2a251a', color: '#e8c96e' },
  'Automatizaciones': { icon: '⚡', bg: '#252a1a', color: '#b8e87d' },
  'Guardados': { icon: '🔖', bg: '#251a2a', color: '#c96ee8' },
  'Contenido Compartido': { icon: '🔄', bg: '#1a2a25', color: '#6ecfa5' },
};

/* ── State ── */
let cotizadorAdminCart = {};
let cotizadorClientCart = {};
let cotizadorMarkup = 11; // 1000% default
let cotizadorActiveFilter = 'all';
let cotizadorCurrentMode = null;

// Expose to app.js
window.cotizadorAdminCart = cotizadorAdminCart;
window.cotizadorClientCart = cotizadorClientCart;

/* ── Helpers ── */
function getCategories() {
  return [...new Set(SERVICES.map(s => s.cat))];
}

function getPrice(s, mode) {
  return mode === 'client' ? s.price * cotizadorMarkup : s.price;
}

function getPriceTier(p) {
  if (p >= 5) return 'price-high';
  if (p >= 0.5) return 'price-mid';
  return 'price-low';
}

function fmtPrice(p) {
  if (p < 0.001) return '$' + (p * 1000).toFixed(4) + '/K';
  if (p < 0.01) return '$' + p.toFixed(4);
  return '$' + p.toFixed(p >= 10 ? 2 : p >= 1 ? 2 : 4);
}

function fmtNum(n) {
  if (n >= 1000000) return (n/1000000).toFixed(1)+'M';
  if (n >= 1000) return (n/1000).toFixed(0)+'K';
  return n;
}

function getCart(mode) {
  return mode === 'admin' ? cotizadorAdminCart : cotizadorClientCart;
}

function cartTotal(mode) {
  const cart = getCart(mode);
  return Object.keys(cart).reduce((sum, id) => {
    const s = SERVICES.find(x => x.id === id);
    return s ? sum + (cart[id] / 1000 * getPrice(s, mode)) : sum;
  }, 0);
}

function cartCount(mode) {
  return Object.keys(getCart(mode)).filter(k => getCart(mode)[k] > 0).length;
}

/* ── Render Cotizador ── */
function renderCotizador() {
  const container = document.getElementById('cotizador-container');
  const cats = getCategories();

  let html = '';

  // Markup Controls (header)
  const markupPcts = [500, 800, 1000, 1500];
  html += `
    <div class="cotizador-header">
      <div>
        <span style="font-size:13px;color:var(--muted);">${SERVICES.length} servicios disponibles</span>
      </div>
      <div class="markup-controls">
        <label>Markup cliente:</label>
        ${markupPcts.map(p => `
          <button class="markup-btn ${cotizadorMarkup === (1+p/100) ? 'active' : ''}" onclick="setCotizadorMarkup(${p})">${p}%</button>
        `).join('')}
      </div>
    </div>

    <div style="display:flex;gap:8px;margin-bottom:16px;">
      <button class="btn btn-sm ${cotizadorActiveFilter === 'all' ? 'btn-primary' : 'btn-ghost'}" onclick="setCotizadorFilter('all')">Todos</button>
      ${cats.map(c => `
        <button class="btn btn-sm ${cotizadorActiveFilter === c ? 'btn-primary' : 'btn-ghost'}" onclick="setCotizadorFilter('${c}')">${c}</button>
      `).join('')}
    </div>
  `;

  // Tables grouped by category
  const filteredCats = cotizadorActiveFilter === 'all' ? cats : [cotizadorActiveFilter];
  const cart = cotizadorAdminCart;

  filteredCats.forEach(cat => {
    const items = SERVICES.filter(s => s.cat === cat);
    const meta = CAT_ICONS[cat] || { icon: '•', bg: '#1a1a1a', color: '#aaa' };

    html += `
      <div class="master-section" style="margin-bottom:16px;">
        <div class="master-section-header" style="cursor:default;">
          <div class="ms-icon" style="background:${meta.bg};color:${meta.color};font-size:14px;">${meta.icon}</div>
          <div class="ms-info">
            <div class="ms-title">${cat}</div>
            <div class="ms-sub">${items.length} servicios</div>
          </div>
        </div>
        <div class="master-section-body" style="padding:0;overflow-x:auto;">
          <table class="cotizador-table" style="border:none;border-radius:0;">
            <thead>
              <tr>
                <th class="col-id">ID</th>
                <th>Servicio</th>
                <th class="r">$/1K</th>
                <th class="r">Mín</th>
                <th class="r col-num">Máx</th>
                <th class="r">Cantidad</th>
                <th class="r">Total</th>
              </tr>
            </thead>
            <tbody>
              ${items.map(s => renderCotizadorRow(s, cart)).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  });

  // Cart Bar
  html += renderCartBar();

  container.innerHTML = html;
  updateCartBarUI();
}

function renderCotizadorRow(s, cart) {
  const qty = cart[s.id] || 0;
  const total = qty > 0 ? (qty / 1000 * s.price) : 0;
  const sel = qty > 0 ? 'selected' : '';
  const tier = getPriceTier(s.price);

  return `<tr class="${sel}" id="cz-row-${s.id}" onclick="focusCotizadorInput('${s.id}')">
    <td class="col-id">${s.id}</td>
    <td>
      <div style="font-size:13px;font-weight:500;">${s.name}</div>
      <div style="font-size:11px;color:var(--muted);margin-top:1px;">${s.detail}</div>
    </td>
    <td class="r"><span class="col-price ${tier}">${fmtPrice(s.price)}</span></td>
    <td class="r col-num">${fmtNum(s.min)}</td>
    <td class="r col-num">${fmtNum(s.max)}</td>
    <td class="r">
      <input class="qty-input" type="number" min="${s.min}" max="${s.max}" step="${s.min}"
        value="${qty || ''}" placeholder="${fmtNum(s.min)}"
        onclick="event.stopPropagation()"
        onchange="setCotizadorQty('${s.id}', this.value, ${s.min}, ${s.max})"
        id="cz-input-${s.id}" />
    </td>
    <td class="r"><span class="qty-total" id="cz-total-${s.id}">${qty > 0 ? '$'+total.toFixed(2) : '—'}</span></td>
  </tr>`;
}

function renderCartBar() {
  return `
    <div class="cart-bar">
      <div class="cart-summary">
        <div class="cart-count">Ítems: <span id="cz-count">0</span></div>
        <div>
          <div class="cart-total-label">Total neto</div>
          <div class="cart-total-val" id="cz-total">$0.00</div>
        </div>
      </div>
      <div class="cart-actions">
        <button class="btn btn-sm btn-ghost" onclick="clearCotizadorCart()">Limpiar</button>
        <button class="btn btn-sm btn-ghost" onclick="openCotizadorQuote()">Ver cotización</button>
      </div>
    </div>
  `;
}

/* ── Actions ── */
function setCotizadorMarkup(pct) {
  cotizadorMarkup = 1 + (pct / 100);
  cotizadorClientCart = {};
  renderCotizador();
}

function setCotizadorFilter(cat) {
  cotizadorActiveFilter = cat;
  renderCotizador();
}

function focusCotizadorInput(id) {
  const inp = document.getElementById('cz-input-' + id);
  if (inp) inp.focus();
}

function setCotizadorQty(id, rawVal, min, max) {
  min = parseInt(min);
  max = parseInt(max);
  let val = parseInt(rawVal) || 0;
  if (val > 0 && val < min) val = min;
  if (val > max) val = max;

  if (val <= 0) { delete cotizadorAdminCart[id]; }
  else { cotizadorAdminCart[id] = val; }

  // Update row
  const s = SERVICES.find(x => x.id === id);
  const total = val > 0 ? (val / 1000 * s.price) : 0;
  const row = document.getElementById('cz-row-' + id);
  if (row) {
    row.className = val > 0 ? 'selected' : '';
    const totalEl = document.getElementById('cz-total-' + id);
    if (totalEl) totalEl.textContent = val > 0 ? '$' + total.toFixed(2) : '—';
    const inputEl = document.getElementById('cz-input-' + id);
    if (inputEl) inputEl.value = val > 0 ? val : '';
  }

  updateCartBarUI();
}

function updateCartBarUI() {
  const count = cartCount('admin');
  const total = cartTotal('admin');
  const countEl = document.getElementById('cz-count');
  const totalEl = document.getElementById('cz-total');
  if (countEl) countEl.textContent = count;
  if (totalEl) totalEl.textContent = '$' + total.toFixed(2);
}

function clearCotizadorCart() {
  cotizadorAdminCart = {};
  renderCotizador();
}

/* ── Quote Modal ── */
function openCotizadorQuote() {
  const mode = cotizadorCurrentMode || 'admin';
  const cart = getCart(mode);
  const ids = Object.keys(cart).filter(id => cart[id] > 0);

  if (ids.length === 0) {
    openModal('Cotización', '<p style="color:var(--muted);font-size:13px;">No hay servicios seleccionados. Ingresa cantidades en la tabla para cotizar.</p>');
    return;
  }

  const rows = ids.map(id => {
    const s = SERVICES.find(x => x.id === id);
    const p = getPrice(s, mode);
    const qty = cart[id];
    return { s, p, qty, total: qty / 1000 * p };
  });

  const grandTotal = rows.reduce((sum, r) => sum + r.total, 0);
  const date = new Date().toLocaleDateString('es-DO', { year: 'numeric', month: 'long', day: 'numeric' });

  let bodyHTML = `<p style="font-size:12px;color:var(--muted);margin-bottom:14px;">Fecha: ${date}</p>`;

  if (mode === 'admin') {
    bodyHTML += `<p style="font-size:11px;color:var(--warning);margin-bottom:12px;padding:8px 12px;background:rgba(224,184,92,0.08);border-radius:6px;border:0.5px solid rgba(224,184,92,0.15);">⚠️ Precios netos — Confidencial</p>`;
  }

  bodyHTML += `
    <table class="quote-table">
      <thead><tr>
        <th>Servicio</th>
        <th class="r">Cantidad</th>
        <th class="r">$/1K</th>
        <th class="r">Total</th>
        <th></th>
      </tr></thead>
      <tbody>
        ${rows.map(r => `<tr>
          <td>
            <div style="font-size:13px;font-weight:500;">${r.s.name}</div>
            <div style="font-size:11px;color:var(--muted);">ID ${r.s.id} · ${r.s.detail}</div>
          </td>
          <td class="r">${r.qty.toLocaleString()}</td>
          <td class="r">${fmtPrice(r.p)}</td>
          <td class="r" style="color:var(--accent);font-weight:500;">$${r.total.toFixed(2)}</td>
          <td style="text-align:center"><button class="remove-item" onclick="removeCotizadorItem('${r.s.id}'); openCotizadorQuote();">×</button></td>
        </tr>`).join('')}
      </tbody>
    </table>
    <div class="quote-total-row">
      <span class="quote-total-label">Total estimado</span>
      <span class="quote-total-val">$${grandTotal.toFixed(2)}</span>
    </div>
    ${mode === 'client' ? '<p style="font-size:11px;color:var(--muted);margin-top:1rem;">Precios en USD. Sujeto a confirmación.</p>' : ''}
  `;

  const footerHTML = `
    <button class="btn btn-sm btn-ghost" onclick="closeModal()">Cerrar</button>
    <button class="btn btn-sm btn-ghost" onclick="downloadCotizadorCSV()">CSV</button>
    <button class="btn btn-sm btn-success" onclick="downloadCotizadorPDF()">PDF</button>
  `;

  openModal('Cotización — ' + (mode === 'admin' ? 'Precios Netos' : 'Cliente'), bodyHTML, footerHTML);
}

function removeCotizadorItem(id) {
  delete cotizadorAdminCart[id];
  updateCartBarUI();
  // Update row
  const row = document.getElementById('cz-row-' + id);
  if (row) {
    row.className = '';
    const totalEl = document.getElementById('cz-total-' + id);
    if (totalEl) totalEl.textContent = '—';
    const inputEl = document.getElementById('cz-input-' + id);
    if (inputEl) inputEl.value = '';
  }
}

/* ── Downloads ── */
function getCotizadorRows() {
  return Object.keys(cotizadorAdminCart).filter(id => cotizadorAdminCart[id] > 0).map(id => {
    const s = SERVICES.find(x => x.id === id);
    const qty = cotizadorAdminCart[id];
    return { s, p: s.price, qty, total: qty / 1000 * s.price };
  });
}

function downloadCotizadorCSV() {
  const rows = getCotizadorRows();
  if (!rows.length) return;
  const date = new Date().toLocaleDateString('es-DO');
  const header = ['ID', 'Servicio', 'Detalle', 'Cantidad', 'Precio/1K (USD)', 'Total (USD)'];
  const lines = [
    `Nuclear AIMA · Scaling Flow IA`,
    `Cotización Interna — ${date}`,
    '',
    header.join(','),
    ...rows.map(r => [r.s.id, `"${r.s.name}"`, `"${r.s.detail}"`, r.qty, r.p.toFixed(4), r.total.toFixed(2)].join(',')),
    '',
    `Total,,,,,"$${rows.reduce((s,r) => s+r.total, 0).toFixed(2)}"`,
  ];
  const blob = new Blob(['\uFEFF' + lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `cotizacion_nuclear_aima_${Date.now()}.csv`;
  a.click();
}

async function downloadCotizadorPDF() {
  const rows = getCotizadorRows();
  if (!rows.length) return;

  // Show loading state on the PDF button
  const btn = document.querySelector('#modal-footer .btn-success');
  if (btn) { btn.textContent = '⏳ Generando...'; btn.disabled = true; }

  try {
    // Load jsPDF library (reuse from tools.js)
    if (typeof loadPDFLibrary === 'function') {
      await loadPDFLibrary();
    }
    if (!window.jspdf) { throw new Error('jsPDF no disponible'); }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const W = 210, margin = 18;
  const date = new Date().toLocaleDateString('es-DO', { year: 'numeric', month: 'long', day: 'numeric' });

  // Header
  doc.setFillColor(20, 20, 22);
  doc.rect(0, 0, W, 40, 'F');
  doc.setFillColor(201, 169, 110);
  doc.roundedRect(margin, 10, 20, 20, 3, 3, 'F');
  doc.setTextColor(20, 20, 22);
  doc.setFontSize(12); doc.setFont('helvetica', 'bold');
  doc.text('NA', margin + 4, 23);
  doc.setTextColor(240, 237, 232);
  doc.setFontSize(16); doc.setFont('helvetica', 'bold');
  doc.text('Nuclear AIMA', margin + 26, 19);
  doc.setFontSize(9); doc.setFont('helvetica', 'normal');
  doc.setTextColor(150, 145, 140);
  doc.text('Scaling Flow IA · Cotizador de Servicios Instagram', margin + 26, 26);
  doc.text('Fecha: ' + date, margin + 26, 32);

  // Label
  doc.setFillColor(201, 169, 110);
  const lbl = 'PRECIOS NETOS — CONFIDENCIAL';
  doc.setFontSize(8); doc.setFont('helvetica', 'bold');
  doc.setTextColor(20, 20, 22);
  const lw = doc.getTextWidth(lbl) + 8;
  doc.roundedRect(W - margin - lw, 14, lw, 7, 1.5, 1.5, 'F');
  doc.text(lbl, W - margin - lw/2, 19, { align: 'center' });

  let y = 50;
  doc.setFillColor(28, 28, 32);
  doc.rect(margin, y, W - margin*2, 8, 'F');
  doc.setFontSize(8); doc.setFont('helvetica', 'bold');
  doc.setTextColor(120, 120, 115);
  doc.text('SERVICIO', margin + 3, y + 5.5);
  doc.text('CANTIDAD', W - 90, y + 5.5);
  doc.text('$/1K', W - 65, y + 5.5);
  doc.text('TOTAL USD', W - margin - 3, y + 5.5, { align: 'right' });
  y += 8;

  let grandTotal = 0;
  rows.forEach((r, i) => {
    const rowH = 14;
    if (i % 2 === 1) { doc.setFillColor(22, 22, 24); doc.rect(margin, y, W - margin*2, rowH, 'F'); }
    doc.setFontSize(9); doc.setFont('helvetica', 'bold');
    doc.setTextColor(240, 237, 232);
    doc.text(r.s.name.substring(0, 52), margin + 3, y + 6);
    doc.setFontSize(7.5); doc.setFont('helvetica', 'normal');
    doc.setTextColor(120, 115, 110);
    doc.text('ID ' + r.s.id + ' · ' + r.s.detail.substring(0, 58), margin + 3, y + 11);
    doc.setFontSize(9); doc.setFont('helvetica', 'normal');
    doc.setTextColor(180, 175, 170);
    doc.text(r.qty.toLocaleString(), W - 90, y + 7.5);
    doc.text('$' + r.p.toFixed(r.p < 0.01 ? 4 : 2), W - 65, y + 7.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(201, 169, 110);
    doc.text('$' + r.total.toFixed(2), W - margin - 3, y + 7.5, { align: 'right' });
    grandTotal += r.total;
    y += rowH;
    if (y > 265) { doc.addPage(); doc.setFillColor(20, 20, 22); doc.rect(0, 0, W, 12, 'F'); y = 18; }
  });

  y += 4;
  doc.setFillColor(201, 169, 110);
  doc.rect(margin, y, W - margin*2, 12, 'F');
  doc.setFontSize(11); doc.setFont('helvetica', 'bold');
  doc.setTextColor(20, 20, 22);
  doc.text('TOTAL ESTIMADO', margin + 3, y + 8);
  doc.text('$' + grandTotal.toFixed(2), W - margin - 3, y + 8, { align: 'right' });

  y += 22;
  doc.setFontSize(8); doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 95, 90);
  doc.text('DOCUMENTO CONFIDENCIAL — Solo uso interno Nuclear AIMA y Scaling Flow IA', margin, y);
  doc.text('Precios netos. No distribuir.', margin, y + 5);

  doc.save('cotizacion_nuclear_aima_' + Date.now() + '.pdf');

    if (btn) { btn.textContent = '✅ PDF Exportado'; btn.disabled = false; }
  } catch (e) {
    console.error('PDF export error:', e);
    if (btn) { btn.textContent = '❌ Error'; btn.disabled = false; }
    alert('Error al generar PDF: ' + e.message);
  }
}
