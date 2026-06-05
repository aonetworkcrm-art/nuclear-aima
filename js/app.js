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

function maskMasterKey(key) {
  if (!key || key.length < 8) return key;
  const first = key.substring(0, 4);
  const last = key.substring(key.length - 4);
  return first + '••••••••' + last;
}

let masterKeyVisible = false;

function toggleMasterKeyVisibility() {
  const display = document.getElementById('admin-master-key-display');
  const toggle = document.getElementById('admin-master-key-toggle');
  const key = accessKeys[0] || '';
  if (!display || !toggle) return;
  masterKeyVisible = !masterKeyVisible;
  display.textContent = masterKeyVisible ? key : maskMasterKey(key);
  toggle.textContent = masterKeyVisible ? '👁️‍🗨️' : '👁️';
  toggle.title = masterKeyVisible ? 'Ocultar clave' : 'Mostrar clave';
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
    nodeauditor: ['Node Auditor', 'Auditoría Forense de Nodos Musicales'],
    cpc: ['CPC Investigator', 'Análisis de Nichos de Alto CPC · AdSense + Monetag'],
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
  else if (section === 'nodeauditor') renderNodeAuditor();
  else if (section === 'cpc') renderCPCInvestigator();
  else if (section === 'tools') renderTools();
  else if (section === 'admin') renderAdmin();
  else if (section === 'dashboard') {
    updateDashboardKeys();
    updateChecklistProgress();
    updateRecoveryDashboard();
    updateCatalogDashboard();
    updateShortsDashboard();
    updateTrendingShortsDashboard();
    checkChecklistReminder();
  }

  // Close mobile menu
  const sidebar = document.querySelector('.sidebar');
  if (sidebar) sidebar.style.display = '';
}

function toggleMobileMenu() {
  const sidebar = document.querySelector('.sidebar');
  if (!sidebar) return;
  sidebar.classList.toggle('mobile-open');
  // Create or remove overlay
  let overlay = document.querySelector('.sidebar-overlay');
  if (sidebar.classList.contains('mobile-open')) {
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'sidebar-overlay';
      overlay.onclick = toggleMobileMenu;
      document.body.appendChild(overlay);
    }
    overlay.classList.add('active');
  } else {
    if (overlay) overlay.classList.remove('active');
  }
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
  masterKeyVisible = false;
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
          <div id="admin-master-key-display" class="key-item-code" style="font-family:var(--mono);font-size:14px;color:var(--accent);letter-spacing:0.5px;user-select:all;">${maskMasterKey(masterKey)}</div>
        </div>
        <div style="display:flex;gap:6px;">
          <button class="btn btn-xs btn-ghost" onclick="toggleMasterKeyVisibility()" id="admin-master-key-toggle" style="font-size:13px;padding:4px 6px;" title="Mostrar/ocultar clave">👁️</button>
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

/* ══════════════════════════════════════════════
   RECOVERY DASHBOARD — Regalías Perdidas por Plataforma
   ══════════════════════════════════════════════ */

const RECOVERY_STREAMS = [
  {
    id: 'soundexchange',
    name: 'SoundExchange',
    icon: '📻',
    iconBg: '#0a2a1a',
    iconColor: '#6ecfa5',
    status: 'Pendiente',
    statusClass: 'ri-pending',
    estimated: 60000,
    range: '$40K – $80K',
    timelineMonths: 2,
    timelineLabel: '2-4 meses',
    description: 'Regalías de radio digital satelital (SiriusXM), cable no interactivo y webcasts. Libera retroactivo desde la primera reproducción.',
    action: 'Registrar en SoundExchange',
    actionLink: 'https://www.soundexchange.com/'
  },
  {
    id: 'ascap',
    name: 'ASCAP / BMI',
    icon: '🎵',
    iconBg: '#1a1a35',
    iconColor: '#7db8e8',
    status: 'Pendiente',
    statusClass: 'ri-pending',
    estimated: 24000,
    range: '$15K – $35K/año',
    timelineMonths: 3,
    timelineLabel: '3-6 meses',
    description: 'Derechos de ejecución pública. Cada vez que la música suena en radio, TV, restaurantes, bares o live venues. Registro retroactivo hasta 3 años.',
    action: 'Registrar en ASCAP',
    actionLink: 'https://www.ascap.com/'
  },
  {
    id: 'youtube',
    name: 'YouTube Content ID',
    icon: '▶',
    iconBg: '#2a1a1a',
    iconColor: '#ff6b4a',
    status: 'Pendiente',
    statusClass: 'ri-pending',
    estimated: 19640,
    range: '$19,640/mes',
    timelineMonths: 1,
    timelineLabel: '1-3 meses',
    description: 'Reclama los 3,350+ nodos identificados en YouTube. Cada video no reclamado está generando dinero que se queda en los canales infractores.',
    action: 'Activar Content ID (DistroKid)',
    actionLink: 'https://distrokid.com/'
  },
  {
    id: 'sgacedom',
    name: 'SGACEDOM',
    icon: '🇩🇴',
    iconBg: '#0a1a2a',
    iconColor: '#5c8ce0',
    status: 'Pendiente',
    statusClass: 'ri-pending',
    estimated: 12000,
    range: '$8K – $15K/año',
    timelineMonths: 4,
    timelineLabel: '4-8 meses',
    description: 'Sociedad de Gestión Colectiva de República Dominicana. Captura regalías locales por radiodifusión, presentaciones públicas y streaming doméstico.',
    action: 'Registrar en SGACEDOM',
    actionLink: 'https://sgacedom.com/'
  },
  {
    id: 'streaming',
    name: 'Streaming Directo (Spotify/Apple)',
    icon: '🎧',
    iconBg: '#1a2a0a',
    iconColor: '#2ecc71',
    status: 'Pendiente',
    statusClass: 'ri-pending',
    estimated: 140000,
    range: '$95K – $140K/mes',
    timelineMonths: 2,
    timelineLabel: '2-4 meses',
    description: 'Regalías directas de Spotify, Apple Music, Amazon Music, Deezer, etc. Con distribución activa y Content ID, el catálogo completo de 178 canciones genera esto mensualmente.',
    action: 'Activar distribución (Believe/Too Lost)',
    actionLink: ''
  }
];

function renderRecoveryDashboard() {
  const container = document.getElementById('recovery-grid-container');
  if (!container) return;

  const totalRecoverable = RECOVERY_STREAMS.reduce((s, r) => s + r.estimated, 0);
  const maxMonths = Math.max(...RECOVERY_STREAMS.map(r => r.timelineMonths));
  const minMonths = Math.min(...RECOVERY_STREAMS.map(r => r.timelineMonths));

  let html = RECOVERY_STREAMS.map(r => {
    const pct = Math.round((r.timelineMonths / maxMonths) * 100);
    const amtStr = r.estimated >= 1000 ? '$' + (r.estimated / 1000).toFixed(r.estimated >= 100000 ? 0 : 1) + 'K' : '$' + r.estimated.toFixed(0);
    return `
      <div class="recovery-item ${r.statusClass}" onclick="toggleRecoveryDetail('${r.id}')">
        <div class="ri-header">
          <div class="ri-icon" style="background:${r.iconBg};color:${r.iconColor};">${r.icon}</div>
          <span class="ri-name">${r.name}</span>
          <span class="ri-status">${r.status}</span>
        </div>
        <div class="ri-amount" style="color:${r.iconColor};">${amtStr}</div>
        <div class="ri-timeline">
          <div class="tl-bar-track">
            <div class="tl-bar-fill" id="tl-fill-${r.id}" style="width:0%;background:${r.iconColor};"></div>
          </div>
          <div class="tl-labels">
            <span>⚠️ Sin acción</span>
            <span style="color:${r.iconColor};">✅ ${r.timelineLabel}</span>
          </div>
        </div>
        <div class="ri-detail" id="ri-detail-${r.id}">
          ${r.description}
          <div class="ri-cta" onclick="event.stopPropagation();window.open('${r.actionLink}','_blank')">
            → ${r.action}
          </div>
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = html;

  // Update totals
  const totalEl = document.getElementById('recovery-total');
  if (totalEl) {
    totalEl.textContent = (totalRecoverable >= 1_000_000 ? '$' + (totalRecoverable / 1_000_000).toFixed(2) + 'M' :
      totalRecoverable >= 1000 ? '$' + (totalRecoverable / 1000).toFixed(0) + ',000' :
      '$' + totalRecoverable.toFixed(0));
  }

  const windowEl = document.getElementById('recovery-window');
  if (windowEl) {
    windowEl.textContent = minMonths + ' – ' + maxMonths + ' meses';
  }

  // Animate bars after render
  setTimeout(() => {
    RECOVERY_STREAMS.forEach(r => {
      const pct = Math.round((r.timelineMonths / maxMonths) * 100);
      const fill = document.getElementById('tl-fill-' + r.id);
      if (fill) fill.style.width = pct + '%';
    });
  }, 300);
}

function toggleRecoveryDetail(id) {
  const detail = document.getElementById('ri-detail-' + id);
  if (!detail) return;
  const item = detail.closest('.recovery-item');
  if (item) item.classList.toggle('expanded');
}

/* ── Hook recovery into dashboard render ── */
function updateRecoveryDashboard() {
  renderRecoveryDashboard();
}

/* ══════════════════════════════════════════════
   BEATBREAD — Financiadora Principal
   ══════════════════════════════════════════════ */

function showBeatBreadDetails() {
  const bodyHTML = `
    <div style="font-size:12px;color:var(--text2);line-height:1.6;">
      <div class="highlight-box-highlight" style="background:linear-gradient(135deg,var(--bg3),rgba(77,171,247,0.04));border:0.5px solid rgba(77,171,247,0.2);border-radius:var(--radius);padding:14px;margin-bottom:14px;text-align:center;">
        <div style="font-size:22px;font-weight:700;color:var(--info-bright);font-family:var(--mono);">$1,000 — $10,000,000+</div>
        <div style="font-size:11px;color:var(--muted);margin-top:4px;">Adelanto disponible sin ceder propiedad</div>
      </div>

      <h4 style="color:var(--text);font-size:13px;margin-bottom:8px;">¿Por qué beatBread para Ramón Orlando?</h4>
      <table style="width:100%;border-collapse:collapse;font-size:12px;">
        <tr>
          <td style="padding:6px 8px;border-bottom:0.5px solid var(--border);color:var(--muted);width:30%;"><strong style="color:var(--text2);">Adelanto</strong></td>
          <td style="padding:6px 8px;border-bottom:0.5px solid var(--border);color:var(--text2);">Basado en ingresos de streaming históricos y futuros</td>
        </tr>
        <tr>
          <td style="padding:6px 8px;border-bottom:0.5px solid var(--border);color:var(--muted);"><strong style="color:var(--text2);">Propiedad</strong></td>
          <td style="padding:6px 8px;border-bottom:0.5px solid var(--border);color:var(--text2);">🍞 <strong style="color:var(--success-bright);">Conservas el 100%</strong> de tus masters y publishing</td>
        </tr>
        <tr>
          <td style="padding:6px 8px;border-bottom:0.5px solid var(--border);color:var(--muted);"><strong style="color:var(--text2);">Distribución</strong></td>
          <td style="padding:6px 8px;border-bottom:0.5px solid var(--border);color:var(--text2);">Puedes mantener a Too Lost o cualquier distribuidor — no exigen exclusividad</td>
        </tr>
        <tr>
          <td style="padding:6px 8px;border-bottom:0.5px solid var(--border);color:var(--muted);"><strong style="color:var(--text2);">Red de Financiamiento</strong></td>
          <td style="padding:6px 8px;border-bottom:0.5px solid var(--border);color:var(--text2);">Comparas ofertas de múltiples distribuidores en una sola plataforma</td>
        </tr>
        <tr>
          <td style="padding:6px 8px;border-bottom:0.5px solid var(--border);color:var(--muted);"><strong style="color:var(--text2);">Trayectoria</strong></td>
          <td style="padding:6px 8px;border-bottom:0.5px solid var(--border);color:var(--text2);">Desde 2020 · 2,000+ clientes en 6 continentes</td>
        </tr>
        <tr>
          <td style="padding:6px 8px;border-bottom:0.5px solid var(--border);color:var(--muted);"><strong style="color:var(--text2);">Para quién</strong></td>
          <td style="padding:6px 8px;border-bottom:0.5px solid var(--border);color:var(--text2);">Artistas, sellos, compositores y titulares de derechos independientes</td>
        </tr>
      </table>

      <div style="margin-top:14px;padding:10px;background:var(--bg3);border-radius:var(--radius);font-size:11px;color:var(--muted);text-align:center;line-height:1.6;">
        <strong style="color:var(--info-bright);">🎯 Estrategia:</strong> beatBread puede dar el adelanto rápido mientras Too Lost activa distribución y Content ID.
        Usa la Red de Financiamiento para comparar ofertas de Believe, The Orchard y otros.
      </div>
    </div>
  `;

  openModal('🍞 beatBread · Financiamiento Inteligente', bodyHTML, `
    <button class="btn btn-sm btn-ghost" onclick="closeModal()">Cerrar</button>
    <button class="btn btn-sm" style="background:var(--info-bright);color:#0d0d0f;border:none;" onclick="window.open('https://beatbread.com','_blank');closeModal()">🌐 Ir a beatBread</button>
  `);
}

/* ══════════════════════════════════════════════
   FULL CATALOG — 178 Canciones en Dashboard
   ══════════════════════════════════════════════ */

let catalogFilter = 'all';

function renderFullCatalog() {
  const container = document.getElementById('catalog-grid-container');
  const statsBar = document.getElementById('catalog-stats-bar');
  const filterTabs = document.getElementById('catalog-filter-tabs');
  const searchVal = (document.getElementById('catalog-search')?.value || '').toLowerCase().trim();
  const sortBy = document.getElementById('catalog-sort')?.value || 'yield-desc';
  if (!container) return;

  // ── Stats bar ──
  const stats = CATALOG_STATS;
  if (statsBar) {
    statsBar.innerHTML = `
      <div class="catalog-stat-pill">
        <div class="csp-value" style="color:var(--accent);">${stats.totalSongs}</div>
        <div class="csp-label">Canciones Totales</div>
      </div>
      <div class="catalog-stat-pill">
        <div class="csp-value" style="color:var(--tomato-light);">${formatViewsShort(stats.totalViews)}</div>
        <div class="csp-label">Vistas Totales</div>
      </div>
      <div class="catalog-stat-pill">
        <div class="csp-value" style="color:var(--success-bright);">${formatMoneyCompact(stats.totalYield)}/mes</div>
        <div class="csp-label">Yield Mensual Proyectado</div>
      </div>
      <div class="catalog-stat-pill">
        <div class="csp-value" style="color:var(--info-bright);">${formatViewsShort(stats.totalNodes)}</div>
        <div class="csp-label">Nodos Detectados</div>
      </div>
      <div class="catalog-stat-pill">
        <div class="csp-value" style="color:var(--purple-bright);">${stats.auditedSongs}</div>
        <div class="csp-label">Canciones Auditadas</div>
      </div>
      <div class="catalog-stat-pill">
        <div class="csp-value" style="color:var(--orange-bright);">${formatMoneyCompact(stats.auditedYield)}</div>
        <div class="csp-label">Yield Auditado/mes</div>
      </div>
    `;
  }

  // ── Filter tabs ──
  if (filterTabs) {
    filterTabs.innerHTML = `
      <button class="catalog-filter-tab ${catalogFilter === 'all' ? 'active' : ''}" onclick="catalogFilter='all';document.getElementById('catalog-search').value='';renderFullCatalog()">📀 Todos</button>
      ${FULL_CATALOG.map(c => {
        const isActive = catalogFilter === c.id;
        let activeClass = 'active';
        if (c.id === 'RO-01') activeClass = 'active-tomato';
        else if (c.id === 'RO-02') activeClass = 'active-green';
        else if (c.id === 'RO-03') activeClass = 'active-blue';
        else if (c.id === 'RO-06') activeClass = 'active-tomato';
        return `<button class="catalog-filter-tab ${isActive ? activeClass : ''}" onclick="catalogFilter='${c.id}';document.getElementById('catalog-search').value='';renderFullCatalog()">${c.icon} ${c.id}</button>`;
      }).join('')}
      <button class="catalog-filter-tab ${catalogFilter === 'audited' ? 'active-green' : ''}" onclick="catalogFilter='audited';document.getElementById('catalog-search').value='';renderFullCatalog()">✅ Auditadas</button>
    `;
  }

  // ── Build catalog cards ──
  let catalogsToRender = FULL_CATALOG;
  if (catalogFilter === 'audited') {
    // Show only the audited songs aggregated
    catalogsToRender = FULL_CATALOG.filter(c => c.auditedSongs.length > 0);
  } else if (catalogFilter !== 'all') {
    catalogsToRender = FULL_CATALOG.filter(c => c.id === catalogFilter);
  }

  const totalEstimatedViews = ALL_CATALOG_SONGS.reduce((a, s) => a + s.views, 0);

  let html = catalogsToRender.map(cat => {
    // Get all songs for this catalog from ALL_CATALOG_SONGS
    let songs = ALL_CATALOG_SONGS.filter(s => s.catalogId === cat.id);

    // Apply search filter
    if (searchVal) {
      songs = songs.filter(s => s.name.toLowerCase().includes(searchVal));
    }

    // Apply sort
    if (sortBy === 'yield-desc') songs.sort((a, b) => b.yield - a.yield);
    else if (sortBy === 'views-desc') songs.sort((a, b) => b.views - a.views);
    else if (sortBy === 'nodes-desc') songs.sort((a, b) => b.nodes - a.nodes);
    else if (sortBy === 'name-asc') songs.sort((a, b) => a.name.localeCompare(b.name));

    const catTotalYield = songs.reduce((a, s) => a + s.yield, 0);
    const catTotalViews = songs.reduce((a, s) => a + s.views, 0);
    const catTotalNodes = songs.reduce((a, s) => a + s.nodes, 0);
    const auditedCount = songs.filter(s => s.audited).length;

    const songRows = songs.map(s => {
      const nameHtml = searchVal
        ? s.name.replace(new RegExp(searchVal.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), m => `<span class="highlight">${m}</span>`)
        : s.name;
      return `
        <div class="catalog-song-item">
          <span class="csi-name">${nameHtml}</span>
          <span class="csi-badge ${s.audited ? 'audited' : 'estimated'}">${s.audited ? '✅' : '📊'}</span>
          <span class="csi-nodes">${s.nodes.toLocaleString('en-US')}</span>
          <span class="csi-views">${formatViewsShort(s.views)}</span>
          <span class="csi-yield" style="color:${s.audited ? 'var(--success-bright)' : 'var(--muted)'};">$${s.yield.toLocaleString('en-US')}/mo</span>
        </div>
      `;
    }).join('');

    const catYieldFormatted = catTotalYield >= 1000 ? '$' + (catTotalYield / 1000).toFixed(1) + 'K' : '$' + catTotalYield;
    const catViewsFormatted = formatViewsShort(catTotalViews);

    return `
      <div class="catalog-card">
        <div class="catalog-card-header" onclick="this.parentElement.classList.toggle('expanded')">
          <div class="cch-icon" style="background:${cat.bgColor};color:${cat.color};">${cat.icon}</div>
          <div class="cch-info">
            <div class="cch-title">${cat.id} · ${cat.name}</div>
            <div class="cch-sub">${cat.period ? cat.period + ' · ' : ''}${songs.length} canciones${auditedCount > 0 ? ' · ' + auditedCount + ' auditadas' : ''}</div>
          </div>
          <div class="cch-stats">
            <div class="cch-yield" style="color:${cat.color};">${catYieldFormatted}/mo</div>
            <div class="cch-count">${catViewsFormatted} vistas</div>
          </div>
          <span class="cch-expand">▾</span>
        </div>
        <div class="catalog-card-body">
          <div style="font-size:9px;padding:6px 16px;color:var(--muted2);display:flex;gap:16px;border-bottom:0.5px solid var(--border);">
            <span style="flex:1;">Canción</span>
            <span style="width:45px;text-align:right;">Estado</span>
            <span style="width:55px;text-align:right;">Nodos</span>
            <span style="width:70px;text-align:right;">Vistas</span>
            <span style="width:70px;text-align:right;">Yield/mes</span>
          </div>
          <div class="catalog-song-list">${songRows}</div>
          <div class="catalog-total-row">
            <span>Total ${cat.id}</span>
            <span style="color:var(--muted);">${catTotalNodes.toLocaleString('en-US')} nodos</span>
            <span style="color:var(--muted);">${catViewsFormatted}</span>
            <span style="color:${cat.color};">${catYieldFormatted}/mo</span>
          </div>
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = html;

  // Update catalog title based on filter
  const titleEl = document.getElementById('dash-catalog-title');
  if (titleEl) {
    const totalSongs = ALL_CATALOG_SONGS.length;
    const auditedCount = ALL_CATALOG_SONGS.filter(s => s.audited).length;
    if (catalogFilter === 'all') titleEl.textContent = totalSongs + ' Canciones';
    else if (catalogFilter === 'audited') titleEl.textContent = auditedCount + ' Canciones Auditadas';
    else {
      const cat = FULL_CATALOG.find(c => c.id === catalogFilter);
      titleEl.textContent = cat ? cat.id + ' · ' + cat.name : totalSongs + ' Canciones';
    }
  }
}

function filterCatalogSongs() {
  renderFullCatalog();
}

function updateCatalogDashboard() {
  renderFullCatalog();
}

/* ── Exportar Catálogo Completo a CSV ── */
function exportCatalogCSV() {
  const BOM = '\uFEFF';
  const headers = ['Canción','Catálogo','Período','Nodos','Vistas','Yield/mes','Auditada'];
  const rows = ALL_CATALOG_SONGS.map(s => {
    const cat = FULL_CATALOG.find(c => c.id === s.catalogId);
    const period = cat ? cat.period : '';
    return [
      `"${s.name.replace(/"/g, '""')}"`,
      s.catalogId,
      period,
      s.nodes,
      s.views,
      s.yield,
      s.audited ? 'Sí' : 'No'
    ].join(',');
  });

  const csv = BOM + headers.join(',') + '\n' + rows.join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'catalogo-completo-ramon-orlando.csv';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/* ══════════════════════════════════════════════
   FULL CATALOG — 178 Canciones Reales en 6 Catálogos
   Fuente: Bóveda de Seguridad Ramón Orlando
   17 Álbumes · 1956-2026
   ══════════════════════════════════════════════ */

const CATALOG_ECPM = 1.20;
const CATALOG_REVENUE_PER_VIEW = 0.00004;

/* ── Las 178 Canciones Reales Organizadas por Álbum ── */

// Álbum 1: Los Orígenes y la Herencia (1983)
const ALBUM_1 = ['El Juicio','No Matarás','Pagando Mi Ley','Te Invito a Bailar','Micharén','Sisi y Ricardo','Mentirosa','La Temperatura','Un Rincón del Alma','Sinfonía en Merengue (Instrumental)'];
// Álbum 2: Ramón Orlando y su Orquesta Internacional (1986)
const ALBUM_2 = ['Tonto Corazón','Weo','Fiebre','Tú Posesión','Al Son de los Tambores','Bailando Contigo','La Orquesta de Moda','Por un Pedazo de Tu Amor','A Ritmo de Piano','Vuelve'];
// Álbum 3: Loco de Amor (1987)
const ALBUM_3 = ['Loco de Amor','Mar de Amores','Qué Ironía','Gotas de Fuego','Me Enamoré','El Piano Mágico','Noche de Luna','No Puedo Olvidarte','Baila Mi Merengue','Es Tarde Ya'];
// Álbum 4: Juntos Otra Vez (1988)
const ALBUM_4 = ['Dos Sonámbulos','Amor de Conuco','El Baile del Suá Suá','Cariño Lindo','El Ritmo de la Noche','Te Quiero Te Quiero','Esencia Dominicana','Juntos de Nuevo','Piano Sincopado','Unión Eterna'];
// Álbum 5: El Hijo de la Mazurca (1989)
const ALBUM_5 = ['El Hijo de la Mazurca','Raza Latina','Herencia de Sangre','El Merengazo','Nostalgia de Cuco','Baila Mi Pueblo','Sabor Antillano','Te Extraño','El Son del Piano','Tambores y Güira','Un Canto al Caribe'];
// Álbum 6: Solo Ganar (1990)
const ALBUM_6 = ['Noche de Bodas','Solo Ganar','El Rompecorazones','Dime Que Sí','A Fuego Lento','La Dueña de Mi Piano','Merengue Caliente','Falso Amor','Para Siempre','Ritmo Violento'];
// Álbum 7: Ring... Ring (1991)
const ALBUM_7 = ['Ring... Ring (El Teléfono)','Cabecita Loca','Doy','Que Vuelva el Amor','La Chica de la Foto','Te Vas Conmigo','Un Toque de Piano','Corazón de Piedra','Ritmo de la Calle','Llamada Perdida'];
// Álbum 8: Todos! (1992)
const ALBUM_8 = ['El Hombre de la Noche','Todos a Bailar','Amor de Juventud','Piano y Corazón','No Me Dejes Solo','Fuerza Latina','El Ritmo Nos Une','Dulce Amada','A Todo Tren','Fiesta Dominicana'];
// Álbum 9: América Sin Queja (1993)
const ALBUM_9 = ['Te Compro Tu Novia','América Sin Queja','Pedacito de Patria','Ganas de Amarte','El Profesor de Baile','Mi Piano Romántico','Bailando el Ritmo','No Llores Más','Esclavo de Tu Amor','Gente Alegre','Unión de Naciones'];
// Álbum 10: El Maestro (1995)
const ALBUM_10 = ['Esa Muchacha','El Maestro del Ritmo','Gotas de Nostalgia','Por Ti Respiro','Piano Virtuoso','Amor Oculto','El Baile de la Noche','Sentimiento Puro','Vuelve a Mí','Fin de Fiesta'];
// Álbum 11: Evolución (1997)
const ALBUM_11 = ['Balada de Amor','Evolución de Merengue','El Siglo Termina','La Chica del Siglo','Te Dedico Mi Piano','Amor de Fin de Año','Ritmo de Fin de Siglo','Corazón Herido','Vuelve Mi Amor','Baila el Nuevo Ritmo','Camino al Futuro'];
// Álbum 12: Solo Bachatas para Ti (2001)
const ALBUM_12 = ['Bachata de Amargue','Corazón Partido','Guitarra Amarga','Lágrimas de Amor','Mi Niña Consentida','Por un Te Quiero','Te Extraño Tanto','Amor de Cuerdas','Falso Juramento','Baila Mi Bachata','Despedida de Amor'];
// Álbum 13: En Tierra Ajena (2005)
const ALBUM_13 = ['En Tierra Ajena','Nostalgia de Mi Pueblo','Lejos de Casa','Un Canto a Nueva York','El Viajero Dominicano','Recuerdos de Quisqueya','Mi Piano en la Distancia','Cartas de Amor','Sabor de Patria','El Regreso'];
// Álbum 14: El Duro (2007)
const ALBUM_14 = ['El Duro','Mambo del Piano','Merengue de la Calle','La Fuerza del Ritmo','Con el Piano Encendido','Gozadera Total','El Ritmo No Muere','A Corazón Abierto','Baila Sin Parar','Sabor Callejero','Fin del Mambo'];
// Álbum 15: Adoración en el Trono (2014)
const ALBUM_15 = ['Adoración en el Trono','Canto de Alabanza','Ante Ti Señor','Gracias por Tu Amor','Piano Celestial','Fe y Esperanza','Alaba a Dios','En Tu Presencia','Canto de Victoria','Oración Final'];
// Álbum 16: Crónicas (2021)
const ALBUM_16 = ['Crónicas del Día a Día','El Baile de la Vida','Volver a Empezar','Abrazo Virtual','Piano de la Esperanza','Historias del Pueblo','Canto de Fe','Un Nuevo Despertar','Ritmo Sanador','Unidos por el Ritmo','Cierre de Crónicas'];
// Álbum 17: Sencillos de la Nueva Era (2022-2026)
const ALBUM_17 = ['El Tiki Tiki del Amor','Aunque No Quisieran','El Merengue Vive','Colaboración de Oro','Piano Moderno','Ritmo de la Nueva Ola','Sencillo de Corazón','Amor Digital','Mambo 2026','Raíces y Futuro','El Legado Sigue','Canto de Oro (Final de Antología)'];


/* ── Helper: asigna yield según popularidad ── */
function getYieldByPopularity(views) {
  return Math.round(views * CATALOG_REVENUE_PER_VIEW);
}

/* ── Helper: genera datos para un lote de canciones ── */
function makeSongBatch(names, baseViews, baseNodes, catId) {
  return names.map((name, i) => {
    const seed = ((i * 7 + 13) % 100) / 100;
    const variation = 0.3 + seed * 1.4;
    const views = Math.round(baseViews * variation / 100000) * 100000;
    const nodeSeed = ((i * 11 + 5) % 100) / 100;
    const nodes = Math.max(5, Math.round(baseNodes * (0.2 + nodeSeed * 0.8)));
    return { name, nodes, views, yield: getYieldByPopularity(views), cat: catId, audited: false };
  });
}

/* ── CANCIONES AUDITADAS POR ARTISTA ── */

// Ramón Orlando — Top 12 (capitanes del contador fugitivo)
const RO_AUDITED = [
  { name: 'Te Compro Tu Novia',      nodes: 2100, views: 85000000,  yield: 3400, cat: 'RO-02' },
  { name: 'Loco de Amor',            nodes: 1850, views: 78000000,  yield: 3120, cat: 'RO-01' },
  { name: 'Ring... Ring (El Teléfono)', nodes: 1700, views: 72000000, yield: 2880, cat: 'RO-02' },
  { name: 'La Temperatura',          nodes: 1200, views: 58000000,  yield: 2320, cat: 'RO-01' },
  { name: 'Tonto Corazón',           nodes: 950,  views: 52000000,  yield: 2080, cat: 'RO-01' },
  { name: 'Dos Sonámbulos',          nodes: 880,  views: 49000000,  yield: 1960, cat: 'RO-01' },
  { name: 'Noche de Bodas',          nodes: 820,  views: 46000000,  yield: 1840, cat: 'RO-02' },
  { name: 'Cabecita Loca',           nodes: 780,  views: 43000000,  yield: 1720, cat: 'RO-02' },
  { name: 'Esa Muchacha',            nodes: 720,  views: 39000000,  yield: 1560, cat: 'RO-02' },
  { name: 'El Tiki Tiki del Amor',   nodes: 680,  views: 36000000,  yield: 1440, cat: 'RO-06' },
  { name: 'El Baile del Suá Suá',    nodes: 640,  views: 34000000,  yield: 1360, cat: 'RO-01' },
  { name: 'América Sin Queja',       nodes: 600,  views: 32000000,  yield: 1280, cat: 'RO-02' }
];


// Combinado para compatibilidad con FULL_CATALOG
const AUDITED_SONGS = [...RO_AUDITED];

/* ── FULL_CATALOG — 6+ catálogos con canciones reales ── */
const FULL_CATALOG = [
  {
    id: 'RO-01',
    name: 'Clásicos del Merengue',
    period: '1983-1990',
    description: 'Los orígenes · Álbumes 1-5: De la Tribu a la Internacional',
    color: '#f0c040',
    bgColor: '#2a1a0a',
    icon: '🎷',
    songCount: 51,
    auditedSongs: AUDITED_SONGS.filter(s => s.cat === 'RO-01'),
    estimatedSongs: [
      ...makeSongBatch(ALBUM_1, 6000000, 90, 'RO-01'),
      ...makeSongBatch(ALBUM_2, 7000000, 100, 'RO-01'),
      ...makeSongBatch(ALBUM_3, 6500000, 95, 'RO-01'),
      ...makeSongBatch(ALBUM_4, 5500000, 85, 'RO-01'),
      ...makeSongBatch(ALBUM_5, 5000000, 80, 'RO-01')
    ]
  },
  {
    id: 'RO-02',
    name: 'Década de Oro',
    period: '1990-1997',
    description: 'Álbumes 6-11 · Éxitos masivos y rotación global',
    color: '#2ecc71',
    bgColor: '#0a2a1a',
    icon: '💿',
    songCount: 62,
    auditedSongs: AUDITED_SONGS.filter(s => s.cat === 'RO-02'),
    estimatedSongs: [
      ...makeSongBatch(ALBUM_6, 8000000, 120, 'RO-02'),
      ...makeSongBatch(ALBUM_7, 12000000, 180, 'RO-02'),
      ...makeSongBatch(ALBUM_8, 9000000, 130, 'RO-02'),
      ...makeSongBatch(ALBUM_9, 10000000, 150, 'RO-02'),
      ...makeSongBatch(ALBUM_10, 7000000, 100, 'RO-02'),
      ...makeSongBatch(ALBUM_11, 6000000, 90, 'RO-02')
    ]
  },
  {
    id: 'RO-03',
    name: 'Baladas y Sentimiento',
    period: '2001',
    description: 'Álbum 12: Solo Bachatas para Ti · Cuerdas de amargue',
    color: '#7db8e8',
    bgColor: '#0a1a2a',
    icon: '🎹',
    songCount: 11,
    auditedSongs: AUDITED_SONGS.filter(s => s.cat === 'RO-03'),
    estimatedSongs: makeSongBatch(ALBUM_12, 4000000, 60, 'RO-03')
  },
  {
    id: 'RO-04',
    name: 'En Tierra Ajena',
    period: '2005-2007',
    description: 'Álbumes 13-14 · Diáspora y merengue de calle',
    color: '#e87d9e',
    bgColor: '#2a0a1a',
    icon: '🎤',
    songCount: 21,
    auditedSongs: [],
    estimatedSongs: [
      ...makeSongBatch(ALBUM_13, 5000000, 70, 'RO-04'),
      ...makeSongBatch(ALBUM_14, 4500000, 65, 'RO-04')
    ]
  },
  {
    id: 'RO-05',
    name: 'Espiritual y Motivacional',
    period: '2014',
    description: 'Álbum 15: Adoración en el Trono · Música sacra',
    color: '#b87de8',
    bgColor: '#1a0a2a',
    icon: '🙏',
    songCount: 10,
    auditedSongs: [],
    estimatedSongs: makeSongBatch(ALBUM_15, 2500000, 35, 'RO-05')
  },
  {
    id: 'RO-06',
    name: '50 Aniversario / Nueva Era',
    period: '2021-2026',
    description: 'Álbumes 16-17 · Crónicas y Sencillos del Legado',
    color: '#ff6b4a',
    bgColor: '#2a1a0a',
    icon: '🎉',
    songCount: 23,
    auditedSongs: AUDITED_SONGS.filter(s => s.cat === 'RO-06'),
    estimatedSongs: [
      ...makeSongBatch(ALBUM_16, 3500000, 50, 'RO-06'),
      ...makeSongBatch(ALBUM_17, 5000000, 75, 'RO-06')
    ]
  },
  
];


// Compute all songs from FULL_CATALOG for easy access
function getAllCatalogSongs() {
  const all = [];
  FULL_CATALOG.forEach(cat => {
    cat.auditedSongs.forEach(s => {
      const audited = AUDITED_SONGS.find(a => a.name === s.name);
      all.push({ ...s, audited: !!audited, catalogId: cat.id, catalogName: cat.name });
    });
    cat.estimatedSongs.forEach(s => {
      all.push({ ...s, audited: false, catalogId: cat.id, catalogName: cat.name });
    });
  });
  return all;
}

const ALL_CATALOG_SONGS = getAllCatalogSongs();

// Compute aggregates
function computeCatalogStats() {
  const all = ALL_CATALOG_SONGS;
  return {
    totalSongs: all.length,
    totalViews: all.reduce((a, s) => a + s.views, 0),
    totalYield: all.reduce((a, s) => a + s.yield, 0),
    totalNodes: all.reduce((a, s) => a + s.nodes, 0),
    auditedSongs: AUDITED_SONGS.length,
    auditedViews: AUDITED_SONGS.reduce((a, s) => a + s.views, 0),
    auditedYield: AUDITED_SONGS.reduce((a, s) => a + s.yield, 0),
    auditedNodes: AUDITED_SONGS.reduce((a, s) => a + s.nodes, 0)
  };
}

const CATALOG_STATS = computeCatalogStats();

/* ── FUGITIVE_SONGS — Solo las 12 capitanes de Ramón Orlando ── */
const FUGITIVE_SONGS = RO_AUDITED.map(s => ({
  name: s.name,
  nodes: s.nodes,
  views: s.views,
  yield: s.yield
}));
const FUGITIVE_BASE_VIEWS = RO_AUDITED.reduce((a, s) => a + s.views, 0);

const FUGITIVE_REVENUE_PER_VIEW = CATALOG_REVENUE_PER_VIEW;

/* ── Real-Time Fugitive Views Counter ── */
let fugitiveInterval = null;
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
      Auditoría de las <strong>${FUGITIVE_SONGS.length} canciones principales</strong> (capitanes) del catálogo de <strong>Ramón Orlando</strong>.
      Estas ${FUGITIVE_SONGS.length} canciones lideran las 178 canciones totales de su catálogo de 17 álbumes.
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
        <td style="padding:8px;border:0.5px solid var(--border);color:var(--text);"><strong>TOTALES ${FUGITIVE_SONGS.length} CANCIONES</strong></td>
        <td class="num" style="padding:8px;border:0.5px solid var(--border);color:var(--text);">3,350+</td>
        <td class="num" style="padding:8px;border:0.5px solid var(--border);color:var(--text);">${formatViewsShort(totalViews)}</td>
        <td class="num" style="padding:8px;border:0.5px solid var(--border);color:#6ecfa5;">$${totalYield.toLocaleString('en-US')}/mes</td>
        <td class="num" style="padding:8px;border:0.5px solid var(--border);color:#e05c5c;">${formatViewsShort(currentViews)}</td>
      </tr>
    </table>
    <div style="margin-top:12px;padding:10px;background:var(--bg3);border-radius:var(--radius);font-size:11px;color:var(--muted);text-align:center;line-height:1.6;">
      💰 <strong>Dinero perdido acumulado:</strong> ${formatMoneyFull(currentMoney)}
      · 📈 <strong>Tasa:</strong> ${getFugitiveViewsPerSec().toLocaleString('en-US')} vistas/segundo
      · 🎯 <strong>Proyectado:</strong> ${formatMoneyCompact(totalYield)}/mes · ${FUGITIVE_SONGS.length} canciones auditadas
      <br><span style="font-size:10px;">Fuente: Scalin Flow IA · eCPM $1.20 género tropical</span>
    </div>
    <div style="margin-top:10px;padding:8px;background:rgba(77,171,247,0.06);border:0.5px solid rgba(77,171,247,0.15);border-radius:var(--radius);text-align:center;font-size:10px;color:var(--muted);">
      📀 <strong style="color:var(--info-bright);">Catálogo completo de 178 canciones</strong> disponible en la sección de abajo → <span style="color:var(--accent);cursor:pointer;" onclick="closeModal();document.getElementById('dash-catalog-card').scrollIntoView({behavior:'smooth'})">Ver todas las canciones</span>
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
  const roYield = FUGITIVE_SONGS.reduce((a, s) => a + s.yield, 0);
  const estMonthly = roYield >= 1000 ? '$' + (roYield / 1000).toFixed(roYield >= 100000 ? 0 : 1) + 'K' : '$' + roYield.toFixed(0);
  doc.text(estMonthly + ' USD (' + FUGITIVE_SONGS.length + ' capitanes Ramón Orlando)', 80, 81);

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
  doc.text('TOTALES ' + FUGITIVE_SONGS.length + ' CANCIONES', colX[0] + 1, y + 1);
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

  _fugitiveLastUpdate = Date.now();
  var tsEl = document.getElementById('dash-fugitive-timestamp');
  if (tsEl) tsEl.textContent = formatTrendingTimestamp(_fugitiveLastUpdate);
  startFugitiveTimer();

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
    stopFugitiveTimer();
    stopShortsTimer();
  }
  // Call original navigateTo
  origNavigateTo(section);
};

/* ── Login / Session (core functions defined in index.html inline script) ── */

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

/* ══════════════════════════════════════════════
/* ══════════════════════════════════════════════
   UNIVERSAL SEARCH — Busca en TODA la app (Nuclear Search)
   16 fuentes de datos | 80 resultados máx | La bestia total
   ══════════════════════════════════════════════ */

function universalSearch(query) {
  const dropdown = document.getElementById('us-dropdown');
  const clearBtn = document.getElementById('us-clear');
  const q = query.trim().toLowerCase();

  if (clearBtn) clearBtn.style.display = q.length > 0 ? 'flex' : 'none';

  if (!q || q.length < 2) {
    if (dropdown) dropdown.classList.remove('open');
    return;
  }

  if (!window._usActions) window._usActions = [];
  window._usActions.length = 0;

  const MAX = 80;
  const results = [];
  const push = (r) => { if (results.length < MAX) { results.push(r); return true; } return false; };

  // ═══════════════════════════════════════════════
  //  1. CPC NICHOS — 50+ nichos de alto CPC
  // ═══════════════════════════════════════════════
  if (typeof CPC_NICHES !== 'undefined') {
    CPC_NICHES.forEach(n => {
      if (results.length >= MAX) return;
      const matchName = n.name.toLowerCase().includes(q);
      const matchKeywords = n.keywords.toLowerCase().includes(q);
      const matchCat = n.cat.toLowerCase().includes(q);
      const matchAngles = n.contentAngles.toLowerCase().includes(q);
      if (matchName || matchKeywords || matchCat || matchAngles) {
        const sub = matchCat ? '📊 ' + n.cat : '🔑 ' + n.keywords.substring(0, 60);
        push({
          section: 'CPC - Nichos', sectionIcon: '📊',
          icon: n.icon, iconBg: '#2a1a0a', iconColor: '#f0c040',
          title: n.name, subtitle: sub.substring(0, 80),
          action: function() { navigateTo('cpc'); switchCPCTab('research'); showNicheDetail(n.id); },
          sectionBadge: 'CPC', badgeColor: 'var(--accent)'
        });
      }
    });
  }

  // ═══════════════════════════════════════════════
  //  2. MASTER PLAN — 18 secciones del manual
  // ═══════════════════════════════════════════════
  if (typeof MASTER_SECTIONS !== 'undefined') {
    MASTER_SECTIONS.forEach(s => {
      if (results.length >= MAX) return;
      const matchTitle = s.title.toLowerCase().includes(q);
      const matchSub = s.subtitle.toLowerCase().includes(q);
      const matchContent = s.content && s.content.toLowerCase().includes(q);
      if (matchTitle || matchSub || matchContent) {
        push({
          section: 'Master Plan', sectionIcon: '📚',
          icon: s.icon, iconBg: s.iconBg || '#1a1a2a', iconColor: s.iconColor || '#c9a96e',
          title: s.title.replace(/\d+\.\s*/, '').substring(0, 60), subtitle: s.subtitle,
          action: function() { navigateTo('masterplan'); navigateMasterSection(s.id); },
          sectionBadge: 'Plan', badgeColor: 'var(--success)'
        });
      }
    });
  }

  // ═══════════════════════════════════════════════
  //  3. CATÁLOGO — 178 canciones de Ramón Orlando
  // ═══════════════════════════════════════════════
  if (typeof ALL_CATALOG_SONGS !== 'undefined') {
    const songs = getAllCatalogSongs();
    songs.forEach(s => {
      if (results.length >= MAX) return;
      if (s.name.toLowerCase().includes(q)) {
        push({
          section: 'Catálogo', sectionIcon: '💿',
          icon: '🎵', iconBg: '#0a2a1a', iconColor: '#2ecc71',
          title: s.name, subtitle: (s.catalogName || s.catalogId) + ' · ' + (s.views || 0).toLocaleString('en-US') + ' vistas',
          action: function() { navigateTo('dashboard'); document.getElementById('dash-catalog-card')?.scrollIntoView({behavior:'smooth'}); catalogFilter=s.catalogId;renderFullCatalog(); },
          sectionBadge: 'Canción', badgeColor: 'var(--success-bright)'
        });
      }
    });
  }

  // ═══════════════════════════════════════════════
  //  4. CPC TABS — Herramientas del Investigator
  // ═══════════════════════════════════════════════
  if (typeof CPC_TABS !== 'undefined') {
    CPC_TABS.forEach(t => {
      if (results.length >= MAX) return;
      if (t.label.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q)) {
        push({
          section: 'CPC Investigator', sectionIcon: '📊',
          icon: t.icon, iconBg: '#1a1a2a', iconColor: t.color,
          title: t.label, subtitle: t.desc,
          action: function() { navigateTo('cpc'); switchCPCTab(t.id); },
          sectionBadge: 'Herramienta', badgeColor: 'var(--info-bright)'
        });
      }
    });
  }

  // ═══════════════════════════════════════════════
  //  5. NAVEGACIÓN — Secciones del sistema
  // ═══════════════════════════════════════════════
  const navSections = [
    { id: 'dashboard', icon: '📊', name: 'Dashboard', desc: 'Resumen general del sistema' },
    { id: 'masterplan', icon: '📚', name: 'Master Plan', desc: 'Manual Maestro de Infraestructura Digital' },
    { id: 'cotizador', icon: '💰', name: 'Cotizador', desc: 'Scaling Flow IA · Servicios Instagram' },
    { id: 'nodeauditor', icon: '🕸️', name: 'Node Auditor', desc: 'Auditoría Forense de Nodos Musicales' },
    { id: 'cpc', icon: '📊', name: 'CPC Investigator', desc: 'Análisis de Nichos de Alto CPC' },
    { id: 'tools', icon: '🛠️', name: 'Herramientas', desc: 'Shadow Audit · Copy Generator' },
    { id: 'admin', icon: '⚙️', name: 'Admin', desc: 'Configuración del sistema' },
  ];
  navSections.forEach(ns => {
    if (results.length >= MAX) return;
    if (ns.name.toLowerCase().includes(q) || ns.desc.toLowerCase().includes(q)) {
      push({
        section: 'Navegación', sectionIcon: '📍',
        icon: ns.icon, iconBg: '#1a1a2a', iconColor: '#7db8e8',
        title: ns.name, subtitle: ns.desc,
        action: function() { navigateTo(ns.id); },
        sectionBadge: 'Ir', badgeColor: 'var(--muted)'
      });
    }
  });

  // ═══════════════════════════════════════════════
  //  6. TOOLS — Shadow Audit, Copy Generator
  // ═══════════════════════════════════════════════
  if (typeof TOOLS !== 'undefined') {
    TOOLS.forEach(t => {
      if (results.length >= MAX) return;
      if (t.title.toLowerCase().includes(q) || (t.desc && t.desc.toLowerCase().includes(q))) {
        push({
          section: 'Herramientas', sectionIcon: '🛠️',
          icon: t.icon || '🛠️', iconBg: '#1a1a2a', iconColor: '#5c8ce0',
          title: t.title, subtitle: t.desc || '',
          action: function() { navigateTo('tools'); if(t.id) location.hash = '#' + t.id; },
          sectionBadge: 'Tool', badgeColor: 'var(--info)'
        });
      }
    });
  }

  // ═══════════════════════════════════════════════
  //  7. DORKS — 65+ Google Dorks de alto impacto
  // ═══════════════════════════════════════════════
  if (typeof DORKS !== 'undefined') {
    DORKS.forEach(d => {
      if (results.length >= MAX) return;
      if (d.name.toLowerCase().includes(q) || d.desc.toLowerCase().includes(q) || (d.dork && d.dork.toLowerCase().includes(q)) || (d.googleUrl && d.googleUrl.toLowerCase().includes(q))) {
        push({
          section: 'Dorking Engine', sectionIcon: '🔍',
          icon: '🔍', iconBg: '#1a1a2a', iconColor: 'var(--info-bright)',
          title: d.name, subtitle: (d.desc || '').substring(0, 80),
          action: function() { navigateTo('cpc'); switchCPCTab('dorking'); },
          sectionBadge: 'Dork', badgeColor: 'var(--info-bright)'
        });
      }
    });
  }

  // ═══════════════════════════════════════════════
  //  8. DORK CATEGORIES
  // ═══════════════════════════════════════════════
  if (typeof DORK_CATEGORIES !== 'undefined') {
    DORK_CATEGORIES.forEach(c => {
      if (results.length >= MAX) return;
      if (c.name.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q)) {
        push({
          section: 'Dorking · Categorías', sectionIcon: '📂',
          icon: c.icon || '📂', iconBg: '#1a1a2a', iconColor: 'var(--accent)',
          title: c.name, subtitle: (c.desc || '').substring(0, 80),
          action: function() { navigateTo('cpc'); switchCPCTab('dorking'); },
          sectionBadge: 'Categoría', badgeColor: 'var(--accent)'
        });
      }
    });
  }

  // ═══════════════════════════════════════════════
  //  9. COTIZADOR — Servicios Instagram
  // ═══════════════════════════════════════════════
  if (typeof SERVICES !== 'undefined') {
    SERVICES.forEach(s => {
      if (results.length >= MAX) return;
      if (s.name.toLowerCase().includes(q) || s.detail.toLowerCase().includes(q) || s.cat.toLowerCase().includes(q) || s.subcat.toLowerCase().includes(q)) {
        push({
          section: 'Cotizador · Servicios', sectionIcon: '💰',
          icon: '📦', iconBg: '#0a2a1a', iconColor: '#2ecc71',
          title: s.name + ' (' + s.cat + ')', subtitle: s.detail + ' · $' + s.price + '/unidad',
          action: function() { navigateTo('cotizador'); },
          sectionBadge: 'Servicio', badgeColor: 'var(--success-bright)'
        });
      }
    });
  }

  // ═══════════════════════════════════════════════
  //  10. RECOVERY STREAMS — Plataformas de regalías
  // ═══════════════════════════════════════════════
  if (typeof RECOVERY_STREAMS !== 'undefined') {
    RECOVERY_STREAMS.forEach(r => {
      if (results.length >= MAX) return;
      if (r.name.toLowerCase().includes(q) || r.description.toLowerCase().includes(q) || (r.action && r.action.toLowerCase().includes(q))) {
        push({
          section: 'Recuperación de Regalías', sectionIcon: '💎',
          icon: r.icon, iconBg: r.iconBg || '#1a1a2a', iconColor: r.iconColor || '#c9a96e',
          title: r.name, subtitle: (r.range || r.estimated ? '💰 ' + (r.range || '$' + r.estimated) : (r.description || '').substring(0, 80)),
          action: function() { navigateTo('dashboard'); document.getElementById('dash-recovery-card')?.scrollIntoView({behavior:'smooth'}); },
          sectionBadge: 'Regalías', badgeColor: 'var(--accent)'
        });
      }
    });
  }

  // ═══════════════════════════════════════════════
  //  11. FUGITIVE SONGS — 12 capitanes auditadas
  // ═══════════════════════════════════════════════
  if (typeof FUGITIVE_SONGS !== 'undefined') {
    FUGITIVE_SONGS.forEach(s => {
      if (results.length >= MAX) return;
      if (s.name.toLowerCase().includes(q)) {
        push({
          section: 'Contador Fugitivo', sectionIcon: '🔴',
          icon: '🎵', iconBg: '#2a1a1a', iconColor: '#e05c5c',
          title: s.name, subtitle: s.nodes + ' nodos · ' + formatViewsShort(s.views) + ' vistas · $' + s.yield.toLocaleString('en-US') + '/mes',
          action: function() { navigateTo('dashboard'); },
          sectionBadge: 'Auditada', badgeColor: 'var(--danger)'
        });
      }
    });
  }

  // ═══════════════════════════════════════════════
  //  12. SCANNER NICHES — Nichos del Viral Scanner
  // ═══════════════════════════════════════════════
  if (typeof SCANNER_NICHES !== 'undefined') {
    SCANNER_NICHES.forEach(n => {
      if (results.length >= MAX) return;
      if (n.name.toLowerCase().includes(q) || (n.keywords && n.keywords.toLowerCase().includes(q))) {
        push({
          section: 'Viral Scanner · Nichos', sectionIcon: '🤖',
          icon: '🎯', iconBg: '#2a1a1a', iconColor: n.color || '#e05c5c',
          title: n.name, subtitle: (n.keywords || '').substring(0, 80),
          action: function() { navigateTo('cpc'); switchCPCTab('scanner'); },
          sectionBadge: 'Scanner', badgeColor: 'var(--danger)'
        });
      }
    });
  }

  // ═══════════════════════════════════════════════
  //  13. SOURCES — Fuentes del Viral Scanner
  // ═══════════════════════════════════════════════
  if (typeof SOURCES !== 'undefined') {
    SOURCES.forEach(s => {
      if (results.length >= MAX) return;
      if (s.name.toLowerCase().includes(q) || (s.desc && s.desc.toLowerCase().includes(q))) {
        push({
          section: 'Viral Scanner · Fuentes', sectionIcon: '📡',
          icon: s.icon || '📡', iconBg: '#1a1a2a', iconColor: s.color || 'var(--info)',
          title: s.name, subtitle: s.desc || '',
          action: function() { navigateTo('cpc'); switchCPCTab('scanner'); },
          sectionBadge: 'Fuente', badgeColor: 'var(--info-bright)'
        });
      }
    });
  }

  // ═══════════════════════════════════════════════
  //  14. VIRAL PATTERNS — Patrones virales OSINT
  // ═══════════════════════════════════════════════
  if (typeof VIRAL_PATTERNS !== 'undefined') {
    VIRAL_PATTERNS.forEach(p => {
      if (results.length >= MAX) return;
      if ((p.title && p.title.toLowerCase().includes(q)) || (p.desc && p.desc.toLowerCase().includes(q)) || (p.pattern && p.pattern.toLowerCase().includes(q))) {
        push({
          section: 'OSINT · Patrones Virales', sectionIcon: '🕵️',
          icon: '🔥', iconBg: '#1a1a2a', iconColor: 'var(--purple-bright)',
          title: p.title || p.pattern || '', subtitle: (p.desc || '').substring(0, 80),
          action: function() { navigateTo('cpc'); switchCPCTab('osint'); },
          sectionBadge: 'Patrón', badgeColor: 'var(--purple-bright)'
        });
      }
    });
  }

  // ═══════════════════════════════════════════════
  //  15. TRENDING GENRES
  // ═══════════════════════════════════════════════
  if (typeof TRENDING_GENRES !== 'undefined') {
    TRENDING_GENRES.forEach(g => {
      if (results.length >= MAX) return;
      if (g.label.toLowerCase().includes(q)) {
        push({
          section: 'Trending Shorts · Géneros', sectionIcon: '🔥',
          icon: g.icon || '🔥', iconBg: '#2a1a1a', iconColor: 'var(--danger)',
          title: g.label, subtitle: 'Filtrar Shorts virales por género',
          action: function() { navigateTo('dashboard'); fetchTrendingByGenre(g.id); },
          sectionBadge: 'Trending', badgeColor: 'var(--danger)'
        });
      }
    });
  }

  // ═══════════════════════════════════════════════
  //  16. NODE AUDITOR — Shorts y audios
  // ═══════════════════════════════════════════════
  const nodeItems = [
    { name: 'Node Auditor', desc: 'Auditoría Forense de Nodos Musicales', icon: '🕸️', color: 'var(--info-bright)' },
    { name: 'Shorts Auditor', desc: 'Auditar Shorts de YouTube por canción', icon: '📱', color: 'var(--danger)' },
    { name: 'Audio Auditor', desc: 'Auditar audios de YouTube por canción', icon: '🎧', color: 'var(--accent)' },
  ];
  nodeItems.forEach(n => {
    if (results.length >= MAX) return;
    if (n.name.toLowerCase().includes(q) || n.desc.toLowerCase().includes(q)) {
      push({
        section: 'Node Auditor', sectionIcon: '🕸️',
        icon: n.icon, iconBg: '#1a1a2a', iconColor: n.color,
        title: n.name, subtitle: n.desc,
        action: function() { navigateTo('nodeauditor'); },
        sectionBadge: 'Nodo', badgeColor: 'var(--info-bright)'
      });
    }
  });

  // ═══════════════════════════════════════════════
  //  Render dropdown
  // ═══════════════════════════════════════════════
  if (!dropdown) return;

  if (results.length === 0) {
    dropdown.innerHTML = '<div class="us-dropdown-empty">🔍 No se encontraron resultados para "' + query + '"</div>';
    dropdown.classList.add('open');
    return;
  }

  // Group by section
  const groups = {};
  results.forEach(r => {
    if (!groups[r.section]) {
      groups[r.section] = { icon: r.sectionIcon, items: [] };
    }
    groups[r.section].items.push(r);
  });

  let html = '';
  const sectionKeys = Object.keys(groups);
  sectionKeys.forEach((s) => {
    const group = groups[s];
    html += '<div class="us-dropdown-group">';
    html += '<div class="us-group-label">' + group.icon + ' ' + s + ' (' + group.items.length + ')</div>';
    group.items.forEach(r => {
      const re = new RegExp('(' + q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
      const hlTitle = r.title.replace(re, '<span class="us-highlight">$1</span>');
      const hlSub = r.subtitle.replace(re, '<span class="us-highlight">$1</span>');
      const actionIdx = window._usActions.length;
      window._usActions.push(r.action);
      html += '<div class="us-result-item" onclick="closeUniversalSearch();window._usActions[' + actionIdx + ']()">';
      html += '  <div class="us-result-icon" style="background:' + r.iconBg + ';color:' + r.iconColor + ';">' + r.icon + '</div>';
      html += '  <div class="us-result-text">';
      html += '    <div class="us-result-title">' + hlTitle + '</div>';
      html += '    <div class="us-result-sub">' + hlSub + '</div>';
      html += '  </div>';
      html += '  <span class="us-section-badge" style="background:' + (r.badgeColor || 'var(--bg4)') + '22;color:' + (r.badgeColor || 'var(--muted2)') + ';">' + r.sectionBadge + '</span>';
      html += '</div>';
    });
    html += '</div>';
  });

  html += '<div style="padding:6px 12px;font-size:9px;color:var(--muted2);text-align:center;border-top:0.5px solid var(--border);">🔎 ' + results.length + ' resultado' + (results.length !== 1 ? 's' : '') + ' de 16 fuentes · Presiona Escape para cerrar</div>';

  dropdown.innerHTML = html;
  dropdown.classList.add('open');
}


function closeUniversalSearch() {
  const dropdown = document.getElementById('us-dropdown');
  if (dropdown) dropdown.classList.remove('open');
}

function clearUniversalSearch() {
  const input = document.getElementById('us-input');
  const dropdown = document.getElementById('us-dropdown');
  const clearBtn = document.getElementById('us-clear');
  if (input) { input.value = ''; input.focus(); }
  if (dropdown) dropdown.classList.remove('open');
  if (clearBtn) clearBtn.style.display = 'none';
}

// Close search on click outside
document.addEventListener('click', function(e) {
  const search = document.getElementById('universal-search');
  const dropdown = document.getElementById('us-dropdown');
  if (search && dropdown && !search.contains(e.target)) {
    dropdown.classList.remove('open');
  }
});

/* ══════════════════════════════════════════════
   SHORTS DASHBOARD — Métricas Agregadas
   ══════════════════════════════════════════════ */

let _dashboardShortsCache = null;

function updateShortsDashboard() {
  // Si hay datos reales del API, intentar cargarlos
  _dashboardShortsCache = null;
  _shortsLastUpdate = Date.now();
  var tsEl = document.getElementById('dash-shorts-timestamp');
  if (tsEl) tsEl.textContent = formatTrendingTimestamp(_shortsLastUpdate);
  startShortsTimer();
  generateAggregatedShortsData();
  renderShortsCard();
}

function generateAggregatedShortsData() {
  // Generar Shorts para TODAS las canciones auditadas de todos los artistas
  // Usar cache para evitar regenerar en cada render
  if (_dashboardShortsCache) return _dashboardShortsCache;

  const allShorts = [];
  AUDITED_SONGS.forEach(song => {
    const shorts = generateShortsForSong(
      { name: song.name, views: song.views || 1000000 },
      10  // 10 Shorts por canción para no saturar
    );
    shorts.forEach(sh => {
      sh.artistCat = song.cat;
      sh.songName = song.name;
      allShorts.push(sh);
    });
  });

  // Agrupar por canal viral
  const byChannel = {};
  allShorts.forEach(s => {
    if (!byChannel[s.channel]) {
      byChannel[s.channel] = {
        channel: s.channel,
        count: 0,
        totalViews: 0,
        totalVPH: 0,
        totalUSD: 0,
        totalVPD: 0
      };
    }
    byChannel[s.channel].count++;
    byChannel[s.channel].totalViews += s.views;
    byChannel[s.channel].totalVPH += s.vph;
    byChannel[s.channel].totalUSD += s.est_usd_per_hour;
    byChannel[s.channel].totalVPD += s.estViewsPerDay || 0;
  });

  const channels = Object.values(byChannel).sort((a, b) => b.totalViews - a.totalViews);

  const totals = {
    totalShorts: allShorts.length,
    totalViews: allShorts.reduce((a, s) => a + s.views, 0),
    totalVPH: allShorts.reduce((a, s) => a + s.vph, 0),
    totalUSD: allShorts.reduce((a, s) => a + s.est_usd_per_hour, 0),
    totalVPD: allShorts.reduce((a, s) => a + (s.estViewsPerDay || 0), 0),
    uniqueChannels: channels.length,
    topChannels: channels.slice(0, 8),
    allShorts
  };

  // Compactar: solo guardar lo esencial para el card
  _dashboardShortsCache = totals;
  return totals;
}

function renderShortsCard() {
  const data = generateAggregatedShortsData();
  if (!data) return;

  const viewsEl = document.getElementById('dash-shorts-views');
  const countEl = document.getElementById('dash-shorts-count');
  const channelsEl = document.getElementById('dash-shorts-channels');
  const vpdEl = document.getElementById('dash-shorts-vpd');
  const usdEl = document.getElementById('dash-shorts-usd');
  const chartEl = document.getElementById('dash-shorts-bar-chart');

  if (viewsEl) viewsEl.textContent = formatViewsShort(data.totalViews);
  if (countEl) countEl.textContent = data.totalShorts.toLocaleString('en-US');
  if (channelsEl) channelsEl.textContent = data.uniqueChannels.toLocaleString('en-US');
  if (vpdEl) vpdEl.innerHTML = `📈 <strong>${Math.round(data.totalVPD).toLocaleString('en-US')}</strong> vistas/día combinadas`;
  if (usdEl) usdEl.innerHTML = `💰 <strong>${formatMoneyCompact(data.totalUSD)}</strong>/h en Shorts · ${formatMoneyCompact(data.totalUSD * 730)}/mes perdidos`;

  // Mini bar chart de top canales
  if (chartEl && data.topChannels.length > 0) {
    const maxViews = data.topChannels[0].totalViews;
    chartEl.innerHTML = data.topChannels.map(ch => {
      const h = Math.max(3, (ch.totalViews / maxViews) * 100);
      const color = ch.totalViews > maxViews * 0.5 ? 'var(--info-bright)' :
                    ch.totalViews > maxViews * 0.2 ? 'var(--info)' : 'var(--muted2)';
      return `<div style="flex:1;height:${Math.round(h)}%;background:${color};border-radius:2px 2px 0 0;min-height:3px;" title="${ch.channel}: ${formatViewsShort(ch.totalViews)}"></div>`;
    }).join('');
  }
}

function showShortsBreakdown() {
  const data = generateAggregatedShortsData();
  if (!data) return;

  // Top Shorts por vistas
  const topShorts = data.allShorts.sort((a, b) => b.views - a.views).slice(0, 30);

  // ── Agrupar por canal para el donut chart ──
  const byChannel = {};
  data.allShorts.forEach(s => {
    if (!byChannel[s.channel]) {
      byChannel[s.channel] = { channel: s.channel, totalViews: 0, count: 0 };
    }
    byChannel[s.channel].totalViews += s.views;
    byChannel[s.channel].count++;
  });
  const channelData = Object.values(byChannel).sort((a, b) => b.totalViews - a.totalViews);
  const donutHtml = typeof renderDonutChart === 'function'
    ? renderDonutChart(channelData, 'totalViews', 'channel', 200, 36)
    : '';

  // Tabla de Shorts
  const shortsRows = topShorts.map((s, i) => `
    <tr>
      <td style="font-size:11px;color:var(--muted);text-align:center;padding:4px 6px;">${i + 1}</td>
      <td style="padding:4px 6px;">
        <div style="font-size:12px;font-weight:500;color:var(--info-bright);">📱 ${s.channel}</div>
        <div style="font-size:10px;color:var(--muted2);">${s.songName}</div>
      </td>
      <td style="padding:4px 6px;font-size:11px;color:var(--text2);">${s.title}</td>
      <td style="text-align:right;padding:4px 6px;font-family:var(--mono);font-size:12px;font-weight:600;color:${s.views > 5000000 ? 'var(--danger)' : 'var(--text)'};">${formatViewsShort(s.views)}</td>
      <td style="text-align:right;padding:4px 6px;font-family:var(--mono);font-size:11px;color:var(--accent);">${(s.estViewsPerDay || 0).toLocaleString('en-US')}</td>
      <td style="text-align:right;padding:4px 6px;font-family:var(--mono);font-size:11px;color:${s.viralScore > 70 ? 'var(--danger)' : 'var(--warning)'};">${s.viralScore}/100</td>
    </tr>
  `).join('');

  const totalMonthlyLoss = data.totalUSD * 730;

  openModal('📱 YouTube Shorts · Panorama General', `
    <div style="margin-bottom:14px;font-size:12px;color:var(--muted);line-height:1.6;">
      Shorts virales generados por fans, cuentas de baile y canales virales que utilizan
      las canciones del catálogo sin licencia. Datos agregados de <strong>${AUDITED_SONGS.length} canciones auditadas</strong>
      de Ramón Orlando.
    </div>

    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:16px;">
      <div style="background:var(--bg3);border-radius:var(--radius);padding:12px;text-align:center;">
        <div style="font-size:10px;color:var(--muted);text-transform:uppercase;">Total Shorts</div>
        <div style="font-size:24px;font-weight:700;color:var(--info-bright);">${data.totalShorts.toLocaleString('en-US')}</div>
        <div style="font-size:10px;color:var(--muted);">en ${data.uniqueChannels} canales</div>
      </div>
      <div style="background:var(--bg3);border-radius:var(--radius);padding:12px;text-align:center;">
        <div style="font-size:10px;color:var(--muted);text-transform:uppercase;">Vistas Totales</div>
        <div style="font-size:20px;font-weight:700;color:var(--emerald);font-family:var(--mono);">${formatViewsShort(data.totalViews)}</div>
        <div style="font-size:10px;color:var(--muted);">${Math.round(data.totalVPD).toLocaleString('en-US')} vistas/día</div>
      </div>
      <div style="background:var(--bg3);border-radius:var(--radius);padding:12px;text-align:center;">
        <div style="font-size:10px;color:var(--muted);text-transform:uppercase;">Pérdida Est.</div>
        <div style="font-size:18px;font-weight:700;color:var(--danger);font-family:var(--mono);">${formatMoneyCompact(totalMonthlyLoss)}/mes</div>
        <div style="font-size:10px;color:var(--muted);">${formatMoneyCompact(data.totalUSD)}/h</div>
      </div>
    </div>

    ${donutHtml ? `
    <div style="margin-bottom:16px;background:var(--bg2);border:0.5px solid var(--border);border-radius:var(--radius);padding:14px;">
      <div style="font-size:11px;color:var(--muted);margin-bottom:8px;font-weight:500;">🎯 Distribución de Shorts por canal</div>
      ${donutHtml}
    </div>
    ` : ''}

    <h4 style="font-size:12px;color:var(--accent);margin-bottom:8px;">📱 Top Shorts Virales (${topShorts.length})</h4>
    <div style="overflow-x:auto;">
      <table style="width:100%;border-collapse:collapse;font-size:12px;">
        <thead>
          <tr>
            <th style="width:30px;text-align:center;padding:4px 6px;background:var(--bg4);color:var(--muted);font-size:10px;">#</th>
            <th style="text-align:left;padding:4px 6px;background:var(--bg4);color:var(--muted);font-size:10px;">Canal / Canción</th>
            <th style="text-align:left;padding:4px 6px;background:var(--bg4);color:var(--muted);font-size:10px;">Título</th>
            <th style="text-align:right;padding:4px 6px;background:var(--bg4);color:var(--muted);font-size:10px;">Vistas</th>
            <th style="text-align:right;padding:4px 6px;background:var(--bg4);color:var(--muted);font-size:10px;">Vistas/día</th>
            <th style="text-align:right;padding:4px 6px;background:var(--bg4);color:var(--muted);font-size:10px;">🔥 Viral</th>
          </tr>
        </thead>
        <tbody>
          ${shortsRows}
        </tbody>
      </table>
    </div>

    <div style="margin-top:12px;padding:10px;background:var(--bg3);border-radius:var(--radius);font-size:11px;color:var(--muted);text-align:center;line-height:1.6;">
      💰 <strong>Dinero perdido en Shorts:</strong> ${formatMoneyCompact(totalMonthlyLoss)}/mes
      · 📈 <strong>VPH combinado:</strong> ${data.totalVPH.toFixed(1)} vistas/hora
      · 🎯 <strong>Canales virales:</strong> ${data.uniqueChannels}
      <br><span style="font-size:10px;">Los Shorts tienen CPM reducido (~50% del video regular) por el YouTube Shorts Fund</span>
    </div>
  `);
}

/* ══════════════════════════════════════════════
   TRENDING SHORTS — Shorts Virales del Momento
   Consume el endpoint /api/shorts/trending
   ══════════════════════════════════════════════ */

// URL base de la API. En Netlify (produccion) se usa proxy,
// en desarrollo local se puede sobreescribir via window.API_BASE
// Ejemplo: window.API_BASE = 'http://localhost:5000';
let API_BASE = window.API_BASE || '';

let _trendingShortsCache = null;
let _trendingShortsLoading = false;
let _trendingGenre = 'all';
let _trendingLastUpdate = 0;
let _reloadingButton = false;
let _trendingTimerInterval = null;
let _fugitiveLastUpdate = 0;
let _shortsLastUpdate = 0;
let _fugitiveTimerInterval = null;
let _shortsTimerInterval = null;

function formatTrendingTimestamp(ts) {
  if (!ts) return '';
  var elapsed = Math.floor((Date.now() - ts) / 1000);
  if (elapsed < 5) return '\uD83D\uDD50 Ahora';
  if (elapsed < 60) return '\uD83D\uDD50 Hace ' + elapsed + ' seg';
  var mins = Math.floor(elapsed / 60);
  if (mins < 60) return '\uD83D\uDD50 Hace ' + mins + ' min';
  var hrs = Math.floor(mins / 60);
  return '\uD83D\uDD50 Hace ' + hrs + 'h ' + (mins % 60) + 'min';
}

function startTrendingTimer() {
  stopTrendingTimer();
  _trendingTimerInterval = setInterval(function() {
    var tsEl = document.getElementById('dash-trending-timestamp');
    if (tsEl && _trendingLastUpdate > 0) {
      tsEl.textContent = formatTrendingTimestamp(_trendingLastUpdate);
    }
  }, 10000);  // cada 10 segundos
}

function stopTrendingTimer() {
  if (_trendingTimerInterval) {
    clearInterval(_trendingTimerInterval);
    _trendingTimerInterval = null;
  }
}

function startFugitiveTimer() {
  stopFugitiveTimer();
  _fugitiveTimerInterval = setInterval(function() {
    var tsEl = document.getElementById('dash-fugitive-timestamp');
    if (tsEl && _fugitiveLastUpdate > 0) {
      tsEl.textContent = formatTrendingTimestamp(_fugitiveLastUpdate);
    }
  }, 10000);
}

function stopFugitiveTimer() {
  if (_fugitiveTimerInterval) {
    clearInterval(_fugitiveTimerInterval);
    _fugitiveTimerInterval = null;
  }
}

function startShortsTimer() {
  stopShortsTimer();
  _shortsTimerInterval = setInterval(function() {
    var tsEl = document.getElementById('dash-shorts-timestamp');
    if (tsEl && _shortsLastUpdate > 0) {
      tsEl.textContent = formatTrendingTimestamp(_shortsLastUpdate);
    }
  }, 10000);
}

function stopShortsTimer() {
  if (_shortsTimerInterval) {
    clearInterval(_shortsTimerInterval);
    _shortsTimerInterval = null;
  }
}

const TRENDING_GENRES = [
  { id: 'all', label: '🔥 Todos', icon: '🔥' },
  { id: 'latin', label: '🇵🇷 Latino', icon: '🇵🇷' },
  { id: 'merengue', label: '🇩🇴 Merengue', icon: '🇩🇴' },
  { id: 'bachata', label: '🎸 Bachata', icon: '🎸' },
  { id: 'reggaeton', label: '🎧 Reggaetón', icon: '🎧' },
  { id: 'salsa', label: '💃 Salsa', icon: '💃' },
  { id: 'pop', label: '🌟 Pop', icon: '🌟' },
  { id: 'hip-hop', label: '🎤 Hip-Hop', icon: '🎤' },
];

function reloadTrendingShorts() {
  if (_trendingShortsLoading) return;
  stopTrendingTimer();
  var btn = document.getElementById('trending-reload-btn');
  if (btn) { btn.textContent = '\u23f3'; btn.style.color = 'var(--accent)'; }
  _trendingShortsCache = null;
  _trendingGenre = 'all';
  _trendingLastUpdate = 0;
  _reloadingButton = true;
  fetchTrendingShorts();
}

function updateTrendingShortsDashboard() {
  _trendingShortsCache = null;
  fetchTrendingShorts();
}

async function fetchTrendingShorts() {
  if (_trendingShortsLoading) return;
  _trendingShortsLoading = true;

  stopTrendingTimer();
  const sourceEl = document.getElementById('dash-trending-source');
  if (sourceEl) sourceEl.textContent = '📡 Cargando...';

  try {
    const resp = await fetch(API_BASE + '/api/shorts/trending?max_results=20&min_views=100');
    const data = await resp.json();

    if (data && data.status === 'success') {
      _trendingShortsCache = data;
      _trendingLastUpdate = Date.now();
      renderTrendingShortsCard();
      startTrendingTimer();
    } else {
      if (sourceEl) sourceEl.textContent = '⚠️ Error al cargar';
    }
  } catch (e) {
    console.warn('Trending Shorts API no disponible:', e.message);
    if (sourceEl) sourceEl.textContent = '📡 Backend no disponible';
    // Generar datos simulados de respaldo
    _trendingShortsCache = generateMockTrendingShorts();
    renderTrendingShortsCard();
  }
  _trendingShortsLoading = false;
  // Restaurar boton de recarga si estaba activo
  if (_reloadingButton) {
    _reloadingButton = false;
    var btn = document.getElementById('trending-reload-btn');
    if (btn) {
      btn.innerHTML = '\uD83D\uDD04';
      btn.style.color = '';
    }
  }
}

function generateMockTrendingShorts() {
  const mockChannels = [
    { channel: 'Dance Vibes', views: 2500000, count: 15 },
    { channel: 'Music Trends', views: 1800000, count: 12 },
    { channel: 'Viral Hits', views: 1200000, count: 8 },
    { channel: 'Latino Beats', views: 900000, count: 6 },
    { channel: 'Short King', views: 650000, count: 5 },
    { channel: 'Reel Factory', views: 400000, count: 4 },
    { channel: 'Merengue Dance', views: 250000, count: 3 },
    { channel: 'Merengue Hits', views: 180000, count: 2 },
    { channel: 'Bachata Sensation', views: 120000, count: 2 },
  ];
  const allShorts = [];
  const titles = ['Bachata Challenge', 'Merengue Dance Step', 'Salsa Night Fever', 'Reggaeton Flow', 'Dance Tutorial', 'Lip Sync Battle', 'Musica Latina'];
  mockChannels.forEach((ch, ci) => {
    for (let i = 0; i < ch.count; i++) {
      allShorts.push({
        id: allShorts.length + 1,
        title: titles[(ci + i) % titles.length] + ' #' + (i + 1),
        channel: ch.channel,
        views: Math.round(ch.views * (0.3 + Math.random() * 0.7)),
        age_days: Math.round(Math.random() * 30),
        vph: Math.round(Math.random() * 500),
        video_id: 'mock_' + ci + '_' + i,
        url: '#',
        est_usd_per_hour: 0,
        type: 'short',
        typeLabel: 'Short',
        isTrending: true,
        trendingSource: 'mock'
      });
    }
  });
  allShorts.sort((a, b) => b.views - a.views);
  return {
    total: allShorts.length,
    shorts: allShorts,
    trending_source: 'mock',
    shorts_info: {
      totalShorts: allShorts.length,
      totalViews: allShorts.reduce((a, s) => a + s.views, 0),
      totalVPH: allShorts.reduce((a, s) => a + s.vph, 0),
      uniqueChannels: mockChannels.length,
      topChannels: mockChannels.slice(0, 5),
      avgViewsPerShort: Math.round(allShorts.reduce((a, s) => a + s.views, 0) / allShorts.length)
    }
  };
}

function renderTrendingShortsCard() {
  const data = _trendingShortsCache;
  if (!data) return;

  const countEl = document.getElementById('dash-trending-count');
  const viewsEl = document.getElementById('dash-trending-views');
  const sourceEl = document.getElementById('dash-trending-source');
  const chartEl = document.getElementById('dash-trending-bar-chart');

  const shorts = data.shorts || [];
  const totalViews = data.shorts_info?.totalViews || shorts.reduce((a, s) => a + (s.views || 0), 0);
  const uniqueChannels = data.shorts_info?.uniqueChannels || new Set(shorts.map(s => s.channel)).size;
  const tsEl = document.getElementById('dash-trending-timestamp');
  if (tsEl) tsEl.textContent = formatTrendingTimestamp(_trendingLastUpdate);
  const sourceLabel = data.trending_source === 'mock' ? '📡 Datos simulados' :
                      data.trending_source === 'trending-shelf' ? '🔥 YouTube Trending' :
                      '🔍 Búsqueda viral';

  if (countEl) countEl.textContent = shorts.length.toLocaleString('en-US');
  if (viewsEl) viewsEl.textContent = formatViewsShort(totalViews);
  if (sourceEl) sourceEl.textContent = sourceLabel + ' · ' + uniqueChannels + ' canales';

  // Mini bar chart de top channels
  if (chartEl && shorts.length > 0) {
    const byChannel = {};
    shorts.forEach(s => {
      if (!byChannel[s.channel]) byChannel[s.channel] = { views: 0 };
      byChannel[s.channel].views += s.views || 0;
    });
    const channels = Object.entries(byChannel)
      .map(([ch, v]) => ({ channel: ch, totalViews: v.views }))
      .sort((a, b) => b.totalViews - a.totalViews)
      .slice(0, 8);
    const maxViews = channels[0]?.totalViews || 1;
    chartEl.innerHTML = channels.map(ch => {
      const h = Math.max(3, (ch.totalViews / maxViews) * 100);
      const color = ch.totalViews > maxViews * 0.5 ? 'var(--danger)' :
                    ch.totalViews > maxViews * 0.2 ? 'var(--warning)' : 'var(--muted2)';
      return '<div style="flex:1;height:' + Math.round(h) + '%;background:' + color + ';border-radius:2px 2px 0 0;min-height:3px;" title="' + ch.channel + ': ' + formatViewsShort(ch.totalViews) + '"></div>';
    }).join('');
  }
}


async function fetchTrendingByGenre(genre) {
  _trendingGenre = genre;
  if (genre === 'all') {
    const data = _trendingShortsCache || generateMockTrendingShorts();
    renderTrendingModalContent(data);
    return;
  }
  const body = document.getElementById("modal-body");
  if (body) {
    body.innerHTML = "<div style='text-align:center;padding:30px;'><div style='font-size:24px;margin-bottom:12px;'>\u23f3</div><div style='font-size:14px;color:var(--muted);'>Buscando Shorts de " + genre + "...</div></div>";
  }
  try {
    const resp = await fetch(API_BASE + "/api/shorts/trending/music?max_results=20&genre=" + encodeURIComponent(genre) + "&cpm=1.50");
    const data = await resp.json();
    if (data && data.status === 'success') {
      renderTrendingModalContent(data);
    } else {
      const fallback = _trendingShortsCache || generateMockTrendingShorts();
      renderTrendingModalContent(fallback);
    }
  } catch (e) {
    console.warn("Error fetching genre shorts:", e.message);
    const fallback = _trendingShortsCache || generateMockTrendingShorts();
    renderTrendingModalContent(fallback);
  }
}

function renderTrendingModalContent(data) {
  if (!data || !data.shorts) return;
  const shorts = data.shorts.slice(0, 30);
  const totalViews = shorts.reduce((a, s) => a + (s.views || 0), 0);
  const totalVPH = shorts.reduce((a, s) => a + (s.vph || 0), 0);
  const genre = _trendingGenre || 'all';

  const tabsHTML = TRENDING_GENRES.map(g => {
    const activeStyle = g.id === genre
      ? ';border-color:var(--danger);color:var(--danger);background:rgba(255,107,74,0.08);'
      : '';
    return '<button class="trending-genre-tab" style="font-size:10px;padding:4px 10px;border-radius:12px;border:0.5px solid var(--border);background:var(--bg2);color:var(--muted);cursor:pointer;font-family:var(--font);white-space:nowrap;transition:all 0.15s' + activeStyle + '" onclick="fetchTrendingByGenre(\'' + g.id + '\')">' + g.icon + ' ' + g.label + '</button>';
  }).join('');

  const byChannel = {};
  shorts.forEach(s => {
    if (!byChannel[s.channel]) byChannel[s.channel] = { channel: s.channel, totalViews: 0, count: 0 };
    byChannel[s.channel].totalViews += s.views || 0;
    byChannel[s.channel].count++;
  });
  const channelData = Object.values(byChannel).sort((a, b) => b.totalViews - a.totalViews);
  const donutHtml = typeof renderDonutChart === 'function'
    ? renderDonutChart(channelData, 'totalViews', 'channel', 200, 36)
    : '';

  const rowsHTML = shorts.map((s, i) => {
    const vs = s.viralScore || Math.min(99, Math.round((s.views || 0) / 50000));
    return '<tr>' +
      '<td style="font-size:11px;color:var(--muted);text-align:center;padding:4px 6px;">' + (i + 1) + '</td>' +
      '<td style="padding:4px 6px;"><div style="font-size:12px;font-weight:500;color:var(--danger);">' + (s.channel || '?') + '</div>' +
        '<div style="font-size:10px;color:var(--muted2);">' + (s.title || '').substring(0, 40) + '</div></td>' +
      '<td style="text-align:right;padding:4px 6px;font-family:var(--mono);font-size:12px;font-weight:600;color:' + (s.views > 1000000 ? 'var(--danger)' : 'var(--text)') + ';">' + formatViewsShort(s.views || 0) + '</td>' +
      '<td style="text-align:right;padding:4px 6px;font-family:var(--mono);font-size:11px;color:var(--accent);">' + Math.round(s.vph || 0).toLocaleString('en-US') + '</td>' +
      '<td style="text-align:right;padding:4px 6px;font-family:var(--mono);font-size:11px;color:' + (vs > 70 ? 'var(--danger)' : 'var(--warning)') + ';">' + vs + '/100</td>' +
      '<td style="text-align:right;padding:4px 6px;">' +
        '<a href="' + (s.url || '#') + '" target="_blank" onclick="event.stopPropagation()" style="color:var(--info-bright);font-size:10px;text-decoration:none;">\u25b6</a>' +
      '</td>' +
    '</tr>';
  }).join('');

  const sourceLabel = data.trending_source === 'trending-shelf' ? 'YouTube Trending' :
                      data.trending_source === 'generic-search' ? 'B\u00fasqueda viral' :
                      data.trending_source === 'mock' ? 'Datos simulados' :
                      genre !== 'all' ? 'Shorts de ' + genre : data.trending_source || 'API';
  const totalEstUSD = shorts.reduce((a, s) => a + (s.est_usd_per_hour || 0), 0);

  const modalBody =
    '<div style="margin-bottom:12px;display:flex;gap:4px;flex-wrap:wrap;overflow-x:auto;padding-bottom:4px;">' + tabsHTML + '</div>' +
    '<div style="margin-bottom:14px;font-size:12px;color:var(--muted);line-height:1.6;">Shorts <strong style="color:var(--danger);">m\u00e1s virales del momento</strong> extra\u00eddos de YouTube. Fuente: <strong>' + sourceLabel + '</strong>.' +
    (genre !== 'all' ? ' Filtro: <strong style="color:var(--danger);">' + genre + '</strong>.' : '') + '</div>' +
    '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:16px;">' +
      '<div style="background:var(--bg3);border-radius:var(--radius);padding:12px;text-align:center;"><div style="font-size:10px;color:var(--muted);text-transform:uppercase;">Total Shorts</div><div style="font-size:24px;font-weight:700;color:var(--danger);">' + shorts.length.toLocaleString('en-US') + '</div><div style="font-size:10px;color:var(--muted);">virales ahora</div></div>' +
      '<div style="background:var(--bg3);border-radius:var(--radius);padding:12px;text-align:center;"><div style="font-size:10px;color:var(--muted);text-transform:uppercase;">Vistas Combinadas</div><div style="font-size:20px;font-weight:700;color:var(--emerald);font-family:var(--mono);">' + formatViewsShort(totalViews) + '</div><div style="font-size:10px;color:var(--muted);">' + Math.round(totalVPH).toLocaleString('en-US') + ' VPH</div></div>' +
      '<div style="background:var(--bg3);border-radius:var(--radius);padding:12px;text-align:center;"><div style="font-size:10px;color:var(--muted);text-transform:uppercase;">Canales \u00danicos</div><div style="font-size:24px;font-weight:700;color:var(--info-bright);">' + channelData.length + '</div><div style="font-size:10px;color:var(--muted);">' + (totalEstUSD > 0 ? formatMoneyCompact(totalEstUSD) + '/h' : '') + '</div></div>' +
    '</div>' +
    (donutHtml ? '<div style="margin-bottom:16px;background:var(--bg2);border:0.5px solid var(--border);border-radius:var(--radius);padding:14px;"><div style="font-size:11px;color:var(--muted);margin-bottom:8px;font-weight:500;">\ud83d\udd25 Distribuci\u00f3n de Shorts virales por canal</div>' + donutHtml + '</div>' : '') +
    '<h4 style="font-size:12px;color:var(--danger);margin-bottom:8px;">\ud83d\udd25 Top Shorts Virales</h4>' +
    '<div style="overflow-x:auto;"><table style="width:100%;border-collapse:collapse;font-size:12px;">' +
      '<thead><tr>' +
        '<th style="width:30px;text-align:center;padding:4px 6px;background:var(--bg4);color:var(--muted);font-size:10px;">#</th>' +
        '<th style="text-align:left;padding:4px 6px;background:var(--bg4);color:var(--muted);font-size:10px;">Canal</th>' +
        '<th style="text-align:right;padding:4px 6px;background:var(--bg4);color:var(--muted);font-size:10px;">Vistas</th>' +
        '<th style="text-align:right;padding:4px 6px;background:var(--bg4);color:var(--muted);font-size:10px;">VPH</th>' +
        '<th style="text-align:right;padding:4px 6px;background:var(--bg4);color:var(--muted);font-size:10px;">\ud83d\udd25 Viral</th>' +
        '<th style="width:30px;text-align:center;padding:4px 6px;background:var(--bg4);color:var(--muted);font-size:10px;">URL</th>' +
      '</tr></thead><tbody>' + rowsHTML + '</tbody></table></div>' +
    '<div style="margin-top:12px;padding:10px;background:var(--bg3);border-radius:var(--radius);font-size:11px;color:var(--muted);text-align:center;line-height:1.6;">\ud83d\udd25 <strong>Shorts virales del momento:</strong> ' + shorts.length + ' videos en ' + channelData.length + ' canales \u00b7 \ud83d\udcc8 <strong>VPH combinado:</strong> ' + Math.round(totalVPH).toLocaleString('en-US') + ' \u00b7 <strong>Fuente:</strong> ' + sourceLabel + '<br><span style="font-size:10px;">Haz clic en \u25b6 para abrir cada Short en YouTube \u00b7 Cambia de g\u00e9nero con los filtros de arriba</span></div>';

  const title = genre !== 'all'
    ? genre.charAt(0).toUpperCase() + genre.slice(1) + ' \u00b7 Shorts Virales'
    : '\ud83d\udd25 YouTube Shorts Virales \u00b7 Momento Actual';
  const modalEl = document.getElementById("modal-title");
  if (modalEl) modalEl.textContent = title;
  const body = document.getElementById("modal-body");
  if (body) body.innerHTML = modalBody;
}

function showTrendingShortsBreakdown() {
  if (_trendingShortsLoading) {
    openModal('\ud83d\udd25 YouTube Shorts Virales',
      '<div style="text-align:center;padding:30px;">' +
        '<div style="font-size:24px;margin-bottom:12px;">\u23f3</div>' +
        '<div style="font-size:14px;color:var(--muted);">Cargando Shorts virales...</div>' +
        '<div style="font-size:11px;color:var(--muted2);margin-top:8px;">Espera unos segundos y vuelve a hacer clic</div>' +
      '</div>'
    );
    return;
  }
  _trendingGenre = 'all';
  const data = _trendingShortsCache || generateMockTrendingShorts();
  renderTrendingModalContent(data);
}

/* ── Init ── */
(function init() {
  if (accessKeys.length === 0) setupMasterKey();
  updateDashboardKeys();
  checkSession();
  // Navigate to dashboard to trigger all dashboard render functions
  setTimeout(() => navigateTo('dashboard'), 50);
})();
