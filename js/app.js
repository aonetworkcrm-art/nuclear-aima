/* ══════════════════════════════════════════════
   NUCLEAR AIMA — APP CORE v1.0
   Router, Auth, Keys, Navigation, Modals
   ══════════════════════════════════════════════ */

/* ── State ── */
let accessKeys = JSON.parse(localStorage.getItem('na_access_keys') || '[]');
let currentSection = 'dashboard';

/* ── Clave Maestra (única) ── */
function generateMasterKey() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let key = '';
  for (let i = 0; i < 20; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return key.match(/.{1,4}/g).join('-');
}

function setupMasterKey() {
  const key = generateMasterKey();
  accessKeys = [key];
  localStorage.setItem('na_access_keys', JSON.stringify([key]));
  return [key];
}

function copyMasterKey(btn) {
  const key = accessKeys[0] || '';
  navigator.clipboard.writeText(key).then(() => {
    btn.textContent = '✓ Copiada';
    btn.style.color = 'var(--success)';
    setTimeout(() => { btn.textContent = '📋'; btn.style.color = ''; }, 2000);
  });
}

function regenerateMasterKey() {
  if (!confirm('¿Generar nueva clave maestra? La anterior dejará de funcionar inmediatamente.')) return;
  const key = generateMasterKey();
  accessKeys = [key];
  localStorage.setItem('na_access_keys', JSON.stringify([key]));
  renderAdmin();
  updateDashboardKeys();
}

/* ── Navigation ── */
function navigateTo(section) {
  currentSection = section;

  // Hide all sections
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));

  // Show target section
  const target = document.getElementById('section-' + section);
  if (target) target.classList.add('active');

  // Update nav items
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const navItem = document.querySelector(`.nav-item[data-section="${section}"]`);
  if (navItem) navItem.classList.add('active');

  // Update topbar
  const titles = {
    dashboard: ['Dashboard', 'Resumen general'],
    masterplan: ['Master Plan', 'Manual Maestro de Infraestructura Digital'],
    cotizador: ['Cotizador', 'Scaling Flow IA · Servicios Instagram'],
    tools: ['Herramientas', 'Shadow Audit · Copy Generator'],
    admin: ['Administración', 'Configuración del sistema']
  };
  const t = titles[section] || ['Nuclear AIMA', ''];
  document.getElementById('topbar-title').textContent = t[0];
  document.getElementById('topbar-breadcrumb').textContent = t[1];

  // Clear hash when navigating to tools from sidebar so grid always shows
  if (section === 'tools') {
    if (window.location.hash) window.location.hash = '';
  }

  // Render section content
  if (section === 'masterplan') renderMasterPlan();
  else if (section === 'cotizador') renderCotizador();
  else if (section === 'tools') renderTools();
  else if (section === 'admin') renderAdmin();
  else if (section === 'dashboard') {
    updateDashboardKeys();
    updateChecklistProgress();
    checkChecklistReminder();
  }

  // Close mobile menu
  const sidebar = document.querySelector('.sidebar');
  if (sidebar) sidebar.style.display = '';
}

function toggleMobileMenu() {
  const sidebar = document.querySelector('.sidebar');
  if (!sidebar) return;
  const current = sidebar.style.display;
  sidebar.style.display = current === 'flex' ? 'none' : 'flex';
}

/* ── Modal System ── */
function openModal(title, bodyHTML, footerHTML) {
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-body').innerHTML = bodyHTML || '';
  document.getElementById('modal-footer').innerHTML = footerHTML || '<button class="btn btn-sm btn-ghost" onclick="closeModal()">Cerrar</button>';
  document.getElementById('modal-overlay').classList.add('open');
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
}

// Close modal on overlay click
document.getElementById('modal-overlay').addEventListener('click', e => {
  if (e.target === document.getElementById('modal-overlay')) closeModal();
});

/* ── Render Admin ── */
function renderAdmin() {
  const container = document.getElementById('admin-container');

  const adminCartCount = Object.keys(window.cotizadorAdminCart || {}).filter(k => (window.cotizadorAdminCart[k] || 0) > 0).length;
  const clientCartCount = Object.keys(window.cotizadorClientCart || {}).filter(k => (window.cotizadorClientCart[k] || 0) > 0).length;
  const masterKey = accessKeys[0] || '';

  container.innerHTML = `
    <div class="settings-grid">
      <div class="setting-card">
        <h4>Clave maestra</h4>
        <div class="setting-val" style="font-size:16px;">1<span> única</span></div>
      </div>
      <div class="setting-card">
        <h4>Cotizaciones abiertas</h4>
        <div class="setting-val" style="font-size:16px;">
          <span style="color:var(--success);">${adminCartCount} admin</span> ·
          <span style="color:var(--info);">${clientCartCount} cliente</span>
        </div>
      </div>
    </div>

    <div class="keys-section">
      <h4 style="font-size:12px;text-transform:uppercase;letter-spacing:0.05em;color:var(--muted);margin-bottom:10px;">🔑 Clave Maestra de Acceso</h4>
      <div class="key-item" style="display:flex;align-items:center;justify-content:space-between;background:var(--bg3);border:0.5px solid var(--border);border-radius:var(--radius);padding:12px 16px;">
        <div>
          <div class="key-item-label" style="font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:0.04em;margin-bottom:4px;">Clave maestra</div>
          <div class="key-item-code" style="font-family:var(--mono);font-size:14px;color:var(--accent);letter-spacing:0.5px;user-select:all;">${masterKey}</div>
        </div>
        <div style="display:flex;gap:6px;">
          <button class="btn btn-xs btn-ghost" onclick="copyMasterKey(this)" style="font-size:11px;padding:4px 8px;" title="Copiar clave">📋</button>
          <button class="btn btn-xs btn-ghost" onclick="regenerateMasterKey()" style="font-size:11px;padding:4px 8px;color:var(--accent);" title="Generar nueva clave">🔄</button>
        </div>
      </div>
      <div style="margin-top:8px;font-size:10px;color:var(--muted2);">Esta es tu clave única de acceso. Puedes regenerarla cuando quieras.</div>
    </div>

    <div class="keys-section">
      <h4 style="font-size:12px;text-transform:uppercase;letter-spacing:0.05em;color:var(--muted);margin-bottom:10px;">🔐 Seguridad</h4>
      <div style="background:var(--bg3);border:0.5px solid var(--border);border-radius:var(--radius2);padding:16px;">
        <div style="display:flex;gap:12px;align-items:flex-end;flex-wrap:wrap;">
          <div class="form-group" style="flex:1;min-width:200px;margin:0;">
            <label style="font-size:11px;">Cambiar contraseña de acceso</label>
            <input type="password" id="admin-new-password" placeholder="Nueva contraseña" style="background:var(--bg4);border:0.5px solid var(--border);border-radius:var(--radius);padding:8px 12px;color:var(--text);font-size:13px;font-family:var(--font);outline:none;width:100%;" />
          </div>
          <button class="btn btn-sm btn-primary" onclick="changeAppPassword()" style="font-size:11px;">Guardar</button>
        </div>
        <div id="admin-pw-status" style="font-size:11px;margin-top:8px;"></div>
      </div>
    </div>

    <div class="keys-section">
      <h4 style="font-size:12px;text-transform:uppercase;letter-spacing:0.05em;color:var(--muted);margin-bottom:10px;">📈 Calibración del Contador</h4>
      <div style="background:var(--bg3);border:0.5px solid var(--border);border-radius:var(--radius2);padding:16px;">
        <div style="display:flex;gap:12px;align-items:flex-end;flex-wrap:wrap;">
          <div class="form-group" style="flex:1;min-width:160px;margin:0;">
            <label style="font-size:11px;">Vistas por segundo</label>
            <div style="display:flex;gap:6px;">
              <input type="number" id="admin-fugitive-vps" value="${getFugitiveViewsPerSec()}" min="1" max="10000" style="background:var(--bg4);border:0.5px solid var(--border);border-radius:var(--radius);padding:8px 12px;color:var(--text);font-size:13px;font-family:var(--mono);outline:none;width:120px;" />
              <button class="btn btn-sm btn-primary" onclick="saveFugitiveVps()" style="font-size:11px;">Guardar</button>
            </div>
          </div>
          <div style="font-size:11px;color:var(--muted);line-height:1.5;">
            <div>Actual: <strong id="admin-vps-current" style="color:var(--accent);">${getFugitiveViewsPerSec()}</strong> vistas/seg</div>
            <div style="margin-top:2px;">Est. diario: <strong id="admin-vps-daily" style="color:var(--accent);">${(getFugitiveViewsPerSec() * 86400).toLocaleString('en-US')}</strong> vistas/día</div>
          </div>
        </div>
        <div id="admin-vps-status" style="font-size:11px;margin-top:8px;"></div>
      </div>
    </div>

    <div style="margin-bottom:20px;">
      <button class="btn btn-sm btn-danger" onclick="logout()">🚪 Cerrar sesión</button>
    </div>

    <div class="keys-section">
      <h4 style="font-size:12px;text-transform:uppercase;letter-spacing:0.05em;color:var(--muted);margin-bottom:10px;">📋 Información del Sistema</h4>
      <div style="background:var(--bg3);border:0.5px solid var(--border);border-radius:var(--radius);padding:14px;font-size:12px;color:var(--muted);line-height:1.8;">
        <div><strong style="color:var(--text);">Versión:</strong> 1.0.0</div>
        <div><strong style="color:var(--text);">Framework:</strong> Vanilla JS SPA</div>
        <div><strong style="color:var(--text);">Despliegue:</strong> Netlify + GitHub</div>
        <div><strong style="color:var(--text);">Proyecto:</strong> Ramón Orlando · Nuclear AIMA</div>
        <div><strong style="color:var(--text);">Última actualización:</strong> Junio 2026</div>
      </div>
    </div>
  `;
}

/* ── Dashboard Key Count ── */
function updateDashboardKeys() {
  const el = document.getElementById('dash-key-count');
  if (el) el.textContent = accessKeys.length;
}

/* ── Checklist Reminder System ── */
const CHECKLIST_REMINDER_DAYS = 3;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

function checkChecklistReminder() {
  const banner = document.getElementById('checklist-reminder');
  const textEl = document.getElementById('checklist-reminder-text');
  if (!banner || !textEl) return;

  const lastUpdate = parseInt(localStorage.getItem('na_checklist_lastupdate') || '0');
  const saved = JSON.parse(localStorage.getItem('na_checklist') || '{}');
  const completed = Object.values(saved).filter(Boolean).length;

  // Si ya completaron toda la checklist, no mostrar recordatorio
  if (completed >= CHECKLIST_TOTAL) {
    banner.style.display = 'none';
    return;
  }

  // Si nunca se ha interactuado con la checklist
  if (!lastUpdate) {
    banner.style.display = 'none';
    return;
  }

  const elapsed = Date.now() - lastUpdate;
  const daysSince = Math.floor(elapsed / MS_PER_DAY);

  if (daysSince >= CHECKLIST_REMINDER_DAYS) {
    const plural = daysSince === 1 ? 'día' : 'días';
    textEl.textContent = `Han pasado ${daysSince} ${plural} desde tu última actualización en la checklist. Tienes ${20 - completed} de 20 items pendientes.`;
    banner.style.display = 'block';
  } else {
    banner.style.display = 'none';
  }
}

/* ── Checklist Progress Widget ── */
const CHECKLIST_TOTAL = 20;
const CHECKLIST_STORAGE_KEY = 'na_checklist';

function updateChecklistProgress() {
  const countEl = document.getElementById('dash-checklist-count');
  const barEl = document.getElementById('dash-checklist-bar');
  const subEl = document.getElementById('dash-checklist-sub');
  if (!countEl) return;

  try {
    const saved = JSON.parse(localStorage.getItem(CHECKLIST_STORAGE_KEY) || '{}');
    const completed = Object.values(saved).filter(Boolean).length;
    const pct = Math.round((completed / CHECKLIST_TOTAL) * 100);

    countEl.textContent = completed + '/' + CHECKLIST_TOTAL;
    if (barEl) barEl.style.width = pct + '%';
    if (subEl) {
      if (completed === 0) subEl.textContent = 'Ningún item completado — abre el Master Plan';
      else if (completed === CHECKLIST_TOTAL) subEl.textContent = '🎉 ¡Todo listo para enviar el Mensaje 3!';
      else subEl.textContent = completed + ' de ' + CHECKLIST_TOTAL + ' completados · ' + pct + '%';
    }
  } catch {
    if (countEl) countEl.textContent = '0/20';
    if (barEl) barEl.style.width = '0%';
    if (subEl) subEl.textContent = 'Abre el Master Plan para empezar';
  }
}

/* ── Real-Time Fugitive Views Counter ── */
let fugitiveInterval = null;
const FUGITIVE_BASE_VIEWS = 491_000_000;     // 12 canciones auditadas
const FUGITIVE_REVENUE_PER_VIEW = 0.00004;    // $19,640/mes ÷ 491M vistas
const FUGITIVE_SONGS = [
  { name: 'Te Compro Tu Novia',      nodes: 2000, views: 71000000,  yield: 2840 },
  { name: 'No Hay Nadie Más',        nodes: 310,  views: 48000000,  yield: 1920 },
  { name: 'Gotas de Pena',           nodes: 290,  views: 42000000,  yield: 1680 },
  { name: '15,500 Noches',           nodes: 340,  views: 55000000,  yield: 2200 },
  { name: 'Amándote',                nodes: 270,  views: 38000000,  yield: 1520 },
  { name: 'Mujer Divina',            nodes: 260,  views: 35000000,  yield: 1400 },
  { name: 'Me Liberé',               nodes: 240,  views: 31000000,  yield: 1240 },
  { name: 'No Me Compares',          nodes: 280,  views: 40000000,  yield: 1600 },
  { name: 'Sabor a Mentira',         nodes: 250,  views: 33000000,  yield: 1320 },
  { name: 'La Chica de los Ojos Cafés', nodes: 230, views: 28000000, yield: 1120 },
  { name: 'Yo Soy el Que Manda',     nodes: 220,  views: 26000000,  yield: 1040 },
  { name: 'El Merengue',             nodes: 300,  views: 44000000,  yield: 1760 }
];
/* ── Configurable views-per-second rate ── */
const FUGITIVE_VPS_DEFAULT = 83;
const FUGITIVE_VPS_STORAGE_KEY = 'na_fugitive_views_per_sec';

function getFugitiveViewsPerSec() {
  const saved = localStorage.getItem(FUGITIVE_VPS_STORAGE_KEY);
  if (saved === null) return FUGITIVE_VPS_DEFAULT;
  const val = parseInt(saved, 10);
  return (val > 0 && val <= 10000) ? val : FUGITIVE_VPS_DEFAULT;
}

function setFugitiveViewsPerSec(val) {
  const num = parseInt(val, 10);
  if (isNaN(num) || num < 1 || num > 10000) return false;
  localStorage.setItem(FUGITIVE_VPS_STORAGE_KEY, num.toString());
  // Resetear contador para que el cambio tenga efecto inmediato
  sessionStorage.removeItem('na_fugitive_savetime');
  sessionStorage.removeItem('na_fugitive_savedviews');
  sessionStorage.removeItem('na_fugitive_current');
  sessionStorage.removeItem('na_fugitive_session_start');
  sessionStorage.removeItem('na_fugitive_session_views');
  return true;
}

// Timestamp when the app was first loaded this session (for "desde que entraste")
let fugitiveSessionStart = Date.now();

/* ── Formatting helpers ── */
function formatViewsFull(n) {
  // Full format with commas: 491,083,249
  return Math.round(n).toLocaleString('en-US');
}

function formatViewsShort(n) {
  // Compact: 491.08M / 1.23B
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(2) + 'B';
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
  return Math.round(n).toLocaleString('en-US');
}

function formatMoneyFull(n) {
  if (n >= 1_000_000) return '$' + (n / 1_000_000).toFixed(2) + 'M';
  if (n >= 1_000) return '$' + (n / 1_000).toFixed(2) + 'K';
  return '$' + n.toFixed(2);
}

function formatMoneyCompact(n) {
  if (n >= 1_000_000) return '$' + (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return '$' + (n / 1_000).toFixed(1) + 'K';
  return '$' + n.toFixed(2);
}

/* ── Per-song breakdown modal ── */
function showFugitiveBreakdown() {
  const viewsEl = document.getElementById('dash-fugitive-views');
  const moneyEl = document.getElementById('dash-fugitive-money');
  const currentViews = parseFloat(sessionStorage.getItem('na_fugitive_current') || FUGITIVE_BASE_VIEWS);
  const currentMoney = currentViews * FUGITIVE_REVENUE_PER_VIEW;

  let rows = FUGITIVE_SONGS.map(s => {
    const viewsSince = Math.round(currentViews * (s.views / FUGITIVE_BASE_VIEWS));
    return `
      <tr>
        <td><strong>${s.name}</strong></td>
        <td class="num">${s.nodes.toLocaleString('en-US')}</td>
        <td class="num">${formatViewsShort(s.views)}</td>
        <td class="num" style="color:#6ecfa5;">$${s.yield.toLocaleString('en-US')}/mes</td>
        <td class="num" style="color:#e05c5c;">${formatViewsShort(viewsSince)}</td>
      </tr>
    `;
  }).join('');

  const totalYield = FUGITIVE_SONGS.reduce((a, s) => a + s.yield, 0);
  const totalViews = FUGITIVE_SONGS.reduce((a, s) => a + s.views, 0);

  openModal('📈 Detalle de Reproducciones Fugadas', `
    <div style="margin-bottom:14px;font-size:12px;color:var(--muted);line-height:1.6;">
      Datos extraídos de la auditoría de las <strong>12 canciones principales</strong> del catálogo de Ramón Orlando.
      Estas 12 canciones representan el ~7% del catálogo total de 178 canciones.
      El contador en vivo estima las reproducciones acumuladas desde que se realizó la auditoría.
    </div>
    <table style="width:100%;border-collapse:collapse;font-size:12px;">
      <tr>
        <th style="text-align:left;padding:6px 8px;background:var(--bg4);color:var(--accent);border:0.5px solid var(--border);">Canción</th>
        <th style="text-align:right;padding:6px 8px;background:var(--bg4);color:var(--accent);border:0.5px solid var(--border);">Nodos</th>
        <th style="text-align:right;padding:6px 8px;background:var(--bg4);color:var(--accent);border:0.5px solid var(--border);">Vistas base</th>
        <th style="text-align:right;padding:6px 8px;background:var(--bg4);color:var(--accent);border:0.5px solid var(--border);">Yield/mes</th>
        <th style="text-align:right;padding:6px 8px;background:var(--bg4);color:var(--accent);border:0.5px solid var(--border);">Fugadas hoy</th>
      </tr>
      ${rows}
      <tr style="background:var(--bg3);font-weight:700;">
        <td style="padding:8px;border:0.5px solid var(--border);color:var(--text);"><strong>TOTALES 12 CANCIONES</strong></td>
        <td class="num" style="padding:8px;border:0.5px solid var(--border);color:var(--text);">3,350+</td>
        <td class="num" style="padding:8px;border:0.5px solid var(--border);color:var(--text);">${formatViewsShort(totalViews)}</td>
        <td class="num" style="padding:8px;border:0.5px solid var(--border);color:#6ecfa5;">$${totalYield.toLocaleString('en-US')}/mes</td>
        <td class="num" style="padding:8px;border:0.5px solid var(--border);color:#e05c5c;">${formatViewsShort(currentViews)}</td>
      </tr>
    </table>
    <div style="margin-top:12px;padding:10px;background:var(--bg3);border-radius:var(--radius);font-size:11px;color:var(--muted);text-align:center;line-height:1.6;">
      💰 <strong>Dinero perdido acumulado:</strong> ${formatMoneyFull(currentMoney)}
      · 📈 <strong>Tasa:</strong> ${getFugitiveViewsPerSec().toLocaleString('en-US')} vistas/segundo
      · 🎯 <strong>Proyectado:</strong> $19,640/mes solo estas 12 canciones
      <br><span style="font-size:10px;">Fuente: Scalin Flow IA · eCPM $1.20 género tropical</span>
    </div>
  `);
}

/* ── Admin: Save fugitive views-per-second calibration ── */
function saveFugitiveVps() {
  const input = document.getElementById('admin-fugitive-vps');
  const status = document.getElementById('admin-vps-status');
  const val = input?.value;
  if (!val) return;

  if (setFugitiveViewsPerSec(val)) {
    // Update the display values
    const currentEl = document.getElementById('admin-vps-current');
    const dailyEl = document.getElementById('admin-vps-daily');
    const newVps = getFugitiveViewsPerSec();
    if (currentEl) currentEl.textContent = newVps.toLocaleString('en-US');
    if (dailyEl) dailyEl.textContent = (newVps * 86400).toLocaleString('en-US');
    if (status) {
      status.textContent = '✅ Tasa actualizada a ' + newVps + ' vistas/seg. El contador se reiniciará al entrar al Dashboard.';
      status.style.color = 'var(--success)';
    }
  } else {
    if (status) {
      status.textContent = '⚠️ Ingresa un número entre 1 y 10,000';
      status.style.color = 'var(--warning)';
    }
  }
  setTimeout(() => { if (status) status.textContent = ''; }, 4000);
}

/* ── Export Fugitive Report as PDF ── */
function exportFugitiveReport() {
  const { jsPDF } = window.jspdf;
  if (!jsPDF) {
    alert('La librería PDF aún no ha cargado. Intenta de nuevo.');
    return;
  }

  // Capturar estado actual del contador
  const currentViews = parseFloat(sessionStorage.getItem('na_fugitive_current') || FUGITIVE_BASE_VIEWS);
  const currentMoney = currentViews * FUGITIVE_REVENUE_PER_VIEW;
  const vps = getFugitiveViewsPerSec();
  const now = new Date();

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'letter' });

  // ── Encabezado ──
  doc.setFontSize(18);
  doc.setTextColor(201, 169, 110); // gold
  doc.text('Reporte de Fugacidad', 105, 20, { align: 'center' });

  doc.setFontSize(11);
  doc.setTextColor(120, 120, 120);
  doc.text('Catálogo Ramón Orlando · Nuclear AIMA', 105, 28, { align: 'center' });

  doc.setFontSize(9);
  doc.text('Generado: ' + now.toLocaleDateString('es-ES') + ' ' + now.toLocaleTimeString('es-ES'), 105, 34, { align: 'center' });

  // ── Resumen ──
  doc.setDrawColor(201, 169, 110);
  doc.line(14, 40, 196, 40);

  doc.setFontSize(13);
  doc.setTextColor(240, 237, 232);
  doc.text('Resumen del Contador', 14, 50);

  doc.setFontSize(10);
  doc.setTextColor(180, 180, 180);
  doc.text('Vistas acumuladas:', 20, 60);
  doc.setTextColor(224, 92, 92);
  doc.text(formatViewsFull(currentViews), 80, 60);

  doc.setTextColor(180, 180, 180);
  doc.text('Dinero perdido:', 20, 67);
  doc.setTextColor(224, 92, 92);
  doc.text(formatMoneyFull(currentMoney), 80, 67);

  doc.setTextColor(180, 180, 180);
  doc.text('Tasa:', 20, 74);
  doc.setTextColor(240, 237, 232);
  doc.text(vps.toLocaleString('en-US') + ' vistas/segundo', 80, 74);

  doc.setTextColor(180, 180, 180);
  doc.text('Estimado mensual:', 20, 81);
  doc.setTextColor(110, 207, 165);
  doc.text('$19,640 USD (solo 12 canciones auditadas)', 80, 81);

  // ── Tabla: 12 canciones ──
  doc.setDrawColor(201, 169, 110);
  doc.line(14, 88, 196, 88);

  doc.setFontSize(13);
  doc.setTextColor(240, 237, 232);
  doc.text('Desglose por Canción', 14, 97);

  // Encabezados de tabla
  const colX = [14, 70, 100, 130, 160];
  const colW = [56, 30, 30, 30, 36];
  const headers = ['Canción', 'Nodos', 'Vistas', 'Yield/mes', '% del total'];
  const rowY = 104;

  doc.setFontSize(8);
  doc.setTextColor(201, 169, 110);
  doc.setFillColor(22, 22, 26);
  doc.rect(14, rowY - 3, 182, 6, 'F');
  headers.forEach((h, i) => {
    doc.text(h, colX[i] + (i === 0 ? 0 : colW[i]), rowY, { align: i === 0 ? 'left' : 'right' });
  });

  // Filas
  const totalViews = FUGITIVE_SONGS.reduce((a, s) => a + s.views, 0);
  const totalYield = FUGITIVE_SONGS.reduce((a, s) => a + s.yield, 0);
  let y = rowY + 7;

  doc.setFontSize(7.5);
  FUGITIVE_SONGS.forEach((s, i) => {
    if (y > 260) return; // evitar salirse de la página
    const pct = (s.views / totalViews * 100).toFixed(1) + '%';
    doc.setTextColor(200, 200, 200);
    doc.text(s.name.substring(0, 25), colX[0] + 1, y);
    doc.text(s.nodes.toLocaleString('en-US'), colX[1] + colW[1], y, { align: 'right' });
    doc.text(formatViewsShort(s.views), colX[2] + colW[2], y, { align: 'right' });
    doc.text('$' + s.yield.toLocaleString('en-US'), colX[3] + colW[3], y, { align: 'right' });
    doc.setTextColor(180, 180, 180);
    doc.text(pct, colX[4] + colW[4], y, { align: 'right' });
    y += 5;
  });

  // Totales
  y += 2;
  doc.setDrawColor(80, 80, 80);
  doc.line(14, y - 1, 196, y - 1);
  doc.setFontSize(8);
  doc.setTextColor(240, 237, 232);
  doc.setFillColor(22, 22, 26);
  doc.rect(14, y - 2, 182, 5, 'F');
  doc.text('TOTALES 12 CANCIONES', colX[0] + 1, y + 1);
  doc.text('3,350+', colX[1] + colW[1], y + 1, { align: 'right' });
  doc.text(formatViewsShort(totalViews), colX[2] + colW[2], y + 1, { align: 'right' });
  doc.setTextColor(110, 207, 165);
  doc.text('$' + totalYield.toLocaleString('en-US') + '/mes', colX[3] + colW[3], y + 1, { align: 'right' });
  doc.setTextColor(240, 237, 232);
  doc.text('100%', colX[4] + colW[4], y + 1, { align: 'right' });

  // ── Footer ──
  y += 10;
  doc.setDrawColor(201, 169, 110);
  doc.line(14, y, 196, y);
  doc.setFontSize(7);
  doc.setTextColor(100, 100, 100);
  doc.text('Fuente: Scalin Flow IA · eCPM $1.20 género tropical · Nuclear AIMA v1.0', 105, y + 6, { align: 'center' });
  doc.text('Documento generado automáticamente — los valores reflejan el estado del contador al momento de la exportación.', 105, y + 10, { align: 'center' });

  doc.save('reporte-fugacidad-ramon-orlando.pdf');
}

/* ── Counter engine ── */
function startFugitiveCounter() {
  // Limpiar intervalo anterior si existe
  if (fugitiveInterval) clearInterval(fugitiveInterval);

  const viewsEl = document.getElementById('dash-fugitive-views');
  const moneyEl = document.getElementById('dash-fugitive-money');
  const rateEl = document.getElementById('dash-fugitive-rate');
  const sessionEl = document.getElementById('dash-fugitive-session');
  if (!viewsEl || !moneyEl) return;

  // Persistencia con timestamp: guardamos el último timestamp conocido
  // y el valor de views en ese momento. Así al recargar podemos interpolar.
  let lastSaveTime = parseInt(sessionStorage.getItem('na_fugitive_savetime') || '0');
  let lastSavedViews = parseFloat(sessionStorage.getItem('na_fugitive_savedviews') || '0');

  // Si no hay datos guardados o son inválidos, comenzar desde la base
  let currentViews;
  if (!lastSaveTime || lastSaveTime === 0 || !lastSavedViews || lastSavedViews < FUGITIVE_BASE_VIEWS) {
    currentViews = FUGITIVE_BASE_VIEWS;
    lastSaveTime = Date.now();
    lastSavedViews = FUGITIVE_BASE_VIEWS;
  } else {
    // Interpolar: cuántos segundos pasaron desde el último guardado
    const elapsedSec = (Date.now() - lastSaveTime) / 1000;
    currentViews = lastSavedViews + elapsedSec * getFugitiveViewsPerSec();
  }

  // Para la métrica "desde que entraste"
  if (!sessionStorage.getItem('na_fugitive_session_start')) {
    sessionStorage.setItem('na_fugitive_session_start', Date.now().toString());
    sessionStorage.setItem('na_fugitive_session_views', currentViews.toString());
  }
  const sessionStartViews = parseFloat(sessionStorage.getItem('na_fugitive_session_views') || currentViews);

  function animateIncomeBars() {
    // Animar las barras de proyección de ingresos
    const chart = document.querySelector('.income-chart');
    if (!chart) return;
    chart.classList.add('show');
    // Retrasar para gatillar la animación CSS
    setTimeout(() => {
      const projected = chart.querySelector('.bar-fill-projected');
      const actual = chart.querySelector('.bar-fill-actual');
      if (projected) projected.style.width = '100%';
      if (actual) actual.style.width = '2%'; // $0 vs $19,640 — casi invisible pero no cero
    }, 50);
  }

  function updateCounter() {
    // Incrementar por los segundos transcurridos desde el último tick
    // (en lugar de sumar 83 fijo, usamos delta time real para precisión)
    const now = Date.now();
    const deltaSec = (now - lastSaveTime) / 1000;
    if (deltaSec > 0.5) {
      currentViews = lastSavedViews + deltaSec * getFugitiveViewsPerSec();
    } else {
      currentViews += getFugitiveViewsPerSec();
    }
    lastSaveTime = now;
    lastSavedViews = currentViews;

    const moneyLost = currentViews * FUGITIVE_REVENUE_PER_VIEW;
    const sessionViews = currentViews - sessionStartViews;
    const sessionMoney = sessionViews * FUGITIVE_REVENUE_PER_VIEW;

    // Mostrar formato compacto en la tarjeta principal
    viewsEl.textContent = formatViewsShort(currentViews);
    moneyEl.textContent = formatMoneyCompact(moneyLost);

    // Indicador de velocidad (se actualiza cada tick)
    if (rateEl) {
      rateEl.textContent = '🔴 ' + getFugitiveViewsPerSec().toLocaleString('en-US') + ' vistas/seg';
    }

    // Métrica "desde que entraste"
    if (sessionEl) {
      const minutesAgo = Math.floor((now - parseInt(sessionStorage.getItem('na_fugitive_session_start') || now)) / 60000);
      sessionEl.textContent = formatViewsShort(sessionViews) + ' vistas · ' + formatMoneyCompact(sessionMoney) + ' en ' + minutesAgo + ' min';
    }

    // Guardar estado cada 2 ticks (~2 segundos) para no saturar sessionStorage
    if (Math.round(currentViews) % 166 === 0) {
      sessionStorage.setItem('na_fugitive_savetime', now.toString());
      sessionStorage.setItem('na_fugitive_savedviews', currentViews.toString());
      sessionStorage.setItem('na_fugitive_current', currentViews.toString());
    }
  }

  // Animar barras al iniciar
  animateIncomeBars();

  updateCounter();
  fugitiveInterval = setInterval(updateCounter, 1000);
}

function stopFugitiveCounter() {
  if (fugitiveInterval) {
    clearInterval(fugitiveInterval);
    fugitiveInterval = null;
  }
}

function formatViews(n) {
  return formatViewsShort(n);
}

function formatMoney(n) {
  return formatMoneyCompact(n);
}

// Hook into navigateTo to start/stop counter based on section visibility
const origNavigateTo = window.navigateTo;
window.navigateTo = function(section) {
  if (section === 'dashboard') {
    startFugitiveCounter();
  } else {
    stopFugitiveCounter();
  }
  // Call original navigateTo
  origNavigateTo(section);
};

/* ── Login / Session ── */
const DEFAULT_PASSWORD = 'Poppop92@@@';

function getStoredPassword() {
  try { return localStorage.getItem('na_app_password') || DEFAULT_PASSWORD; }
  catch { return DEFAULT_PASSWORD; }
}

function handleLogin() {
  const input = document.getElementById('login-password');
  const error = document.getElementById('login-error');
  const pw = input?.value || '';

  if (pw === getStoredPassword()) {
    sessionStorage.setItem('na_session', 'authenticated');
    sessionStorage.setItem('na_session_time', Date.now().toString());
    document.getElementById('login-overlay').classList.add('hidden');
    if (error) error.classList.remove('show');
    if (input) input.value = '';
  } else {
    if (error) {
      error.textContent = '❌ Contraseña incorrecta';
      error.classList.add('show');
    }
    if (input) {
      input.value = '';
      input.focus();
      input.style.borderColor = 'var(--danger)';
      setTimeout(() => { input.style.borderColor = ''; }, 1500);
    }
  }
}

function logout() {
  if (!confirm('¿Cerrar sesión? Se requerirá la contraseña nuevamente.')) return;
  sessionStorage.removeItem('na_session');
  sessionStorage.removeItem('na_session_time');
  document.getElementById('login-overlay').classList.remove('hidden');
  const input = document.getElementById('login-password');
  if (input) { input.value = ''; input.focus(); }
  navigateTo('dashboard');
}

function checkSession() {
  const session = sessionStorage.getItem('na_session');
  const overlay = document.getElementById('login-overlay');
  if (!overlay) return;

  if (session === 'authenticated') {
    overlay.classList.add('hidden');
    // Check session age (24 hour expiry)
    const sessionTime = parseInt(sessionStorage.getItem('na_session_time') || '0');
    if (Date.now() - sessionTime > 24 * 60 * 60 * 1000) {
      logout();
    }
  } else {
    overlay.classList.remove('hidden');
    setTimeout(() => {
      const input = document.getElementById('login-password');
      if (input) input.focus();
    }, 300);
  }
}

function changeAppPassword() {
  const input = document.getElementById('admin-new-password');
  const status = document.getElementById('admin-pw-status');
  const newPw = input?.value.trim();
  if (!newPw || newPw.length < 4) {
    if (status) { status.textContent = '⚠️ La contraseña debe tener al menos 4 caracteres'; status.style.color = 'var(--warning)'; }
    return;
  }
  localStorage.setItem('na_app_password', newPw);
  if (input) input.value = '';
  if (status) { status.textContent = '✅ Contraseña actualizada correctamente'; status.style.color = 'var(--success)'; }
  setTimeout(() => { if (status) status.textContent = ''; }, 3000);
}

/* ── Init ── */
(function init() {
  if (accessKeys.length === 0) setupMasterKey();
  updateDashboardKeys();
  checkSession();
})();
