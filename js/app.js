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
    tools: ['Herramientas', 'Shadow Audit · Copy Generator'],
    admin: ['Administración', 'Configuración del sistema'],
    jlg: ['JLG 440', 'Juan Luis Guerra · 16 canciones auditadas'],
    milly: ['Milly Quezada', 'Reina del Merengue · 3 canciones auditadas'],
    villalona: ['Fernando Villalona', 'El Mayimbe · 3 canciones auditadas'],
    vargas: ['Wilfrido Vargas', 'Merengue Internacional · 3 canciones auditadas'],
    multiartist: ['Multi-Artista', 'Consolidado de todos los catálogos auditados']
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
  else if (section === 'tools') renderTools();
  else if (section === 'admin') renderAdmin();
  else if (section === 'jlg') renderArtistSection('jlg');
  else if (section === 'milly') renderArtistSection('milly');
  else if (section === 'villalona') renderArtistSection('villalona');
  else if (section === 'vargas') renderArtistSection('vargas');
  else if (section === 'multiartist') renderMultiArtist();
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

/* ══════════════════════════════════════════════
   JUAN LUIS GUERRA 440 — Canciones por Álbum
   ══════════════════════════════════════════════ */

// Álbum 1: Soplando (1984)
const JLG_ALBUM_1 = ['Soplando','El Hombre de la Tierra','Amor de Conuco','La Cosquillita','Ojalá Que Llueva Café (versión temprana)','Sabor a Coco','Mi Tierra','El Piano de Juan','Ritmo de Mi Pueblo','Los Pueblos Se Levantan'];
// Álbum 2: Mudanza y Acarreo (1985)
const JLG_ALBUM_2 = ['Mudanza y Acarreo','La Bilirrubina','Bachata Rosa (demo)','Señor Cantante','A Pedir Su Mano','Ay Mujer','El Farolito','Carta de Amor','Frío Frío','Corazón de Madera'];
// Álbum 3: Mientras Más Lo Pienso...Tú (1987)
const JLG_ALBUM_3 = ['Mientras Más Lo Pienso...Tú','Woman del Callao','Amor de Madre','De Tu Boca','Guarocuya','Donde el Viento Nos Lleve','Sueño Contigo','Ven a Mi Mesa','El Hombre de la Naturaleza','Río Abajo'];
// Álbum 4: Ojalá Que Llueva Café (1989)
const JLG_ALBUM_4 = ['Ojalá Que Llueva Café','Visa Para un Sueño','La Llave de Mi Corazón','Reina de la Noche','Carmen','El Amor de la Mujer','La Costurera','José y Pedro','Ayer la Vi','Naturaleza de Amor','Los Pájaros Cantan'];
// Álbum 5: Bachata Rosa (1990) — EL CLÁSICO
const JLG_ALBUM_5 = ['Bachata Rosa','Burbujas de Amor','A Pedir Su Mano','Carta de Amor','Rosalía','El Farolito','La Bilirrubina','Señora de Madera','Como Abeja al Panal','Cuando Te Beso','Cancioncita de Amor','Estrellitas y Duendes'];
// Álbum 6: Areíto (1992)
const JLG_ALBUM_6 = ['El Costo de la Vida','Naboría','Si Dios Fuera Negro','Coronación de Flores','Frío Frío','Popurrí de Bachata','Los Pueblos Se Levantan','El Tiempo','La Mujer de Mi Vida','San Vito','Patria','Ojalá Que Llueva Café (Remix)'];
// Álbum 7: Fogaraté (1994)
const JLG_ALBUM_7 = ['Fogaraté','El Beso de la Ciguapa','La Hormiguita','Viviré','Amor de Amor','Los Pájaros Perdidos','Sobrepasa','Mi amor','Silencio','La Noche'];
// Álbum 8: Ni Es Lo Mismo Ni Es Igual (1998)
const JLG_ALBUM_8 = ['Ni Es Lo Mismo Ni Es Igual','El Príncipe','Mi Bendición','Palomita Blanca','Píntame','Amor de la Mujer','Quisiera','Testimonio','Los Dos','Sueño de Amor'];
// Álbum 9: Para Ti (2004)
const JLG_ALBUM_9 = ['Para Ti','Las Avispas','La Calle','El Ángel de la Guarda','Corazón y Fuego','Los Recuerdos','Amanece','Todo Es Posible','Dame Luz','Cristal de Amor'];
// Álbum 10: La Llave de Mi Corazón (2007)
const JLG_ALBUM_10 = ['La Llave de Mi Corazón','Que Me Den la Visa','Todo Tiene Su Hora','La Travesía','El Amor de Dios','Cristiana','Soldado','En el Cielo','Mi País','Gloria a Dios','La Noche de los Dos'];
// Álbum 11: Colección Cristiana (2012)
const JLG_ALBUM_11 = ['El Amor de Dios','Eres Tú Jesús','Gloria a Ti','Mi Compañero Fiel','Santo Espíritu','Alabanza Eterna','Te Alabaré','Dulce Presencia','Fe y Esperanza','Mi Fe','Bendito Seas'];
// Álbum 12: Todo Tiene Su Hora (2014)
const JLG_ALBUM_12 = ['Todo Tiene Su Hora','Lere Lere','El Capotillo','Canto a la Vida','Para Qué Sufrir','Los Dos Amores','La Paz de Dios','Yo Bailo Con Ella','Tus Ojos','Amor de Todos','Ven a Mi'];
// Álbum 13: Radio Güira (2023)
const JLG_ALBUM_13 = ['Radio Güira','Mambo 23','La Gracia de Dios','El Farolito (Remix)','Bachata Rosa 2023','Los Libros de la Buena Memoria','Algodón de Azúcar','Burbujas de Amor (Acústico)','La Bilirrubina (Sinfónico)','Dulce Veneno','Mil Preguntas'];

/* ══════════════════════════════════════════════
   MILLY QUEZADA — Canciones por Álbum
   ══════════════════════════════════════════════ */

const MQ_ALBUM_1 = ['La Reina del Merengue','Eras','Lo Que Más Me Gusta de Ti','Quiero Amanecer','El Hombre de Tu Vida','Sé Que No','Aprenderé','No Hace Falta Nada','Al Final','Vete y Pregona','Luz de Mi Vida','Hoy Te Confieso','Lluvia de Amor'];
const MQ_ALBUM_2 = ['Volvió Juanita','Una Vez Más','Me Muero','De Mí','Cómo Será','Déjame','Si No Te Tengo','La Mujer Que Habla','Bendito Amor',"Pa' Qué Me Sirve",'Te Necesito','Amor Secreto'];

/* ══════════════════════════════════════════════
   FERNANDO VILLALONA — Canciones por Álbum
   ══════════════════════════════════════════════ */

const FV_ALBUM_1 = ['El Mayimbe','La Quiero a Ella','Celos','Dime','Amor de Cristal','El Pequeño Músico','Quisiera Ser','Ay Doctor','No Me Extraña Nada','Te Amo','Corazón de Madera'];
const FV_ALBUM_2 = ['Mi Mujer','Copas de Licor','Vete','Yo Soy el Hombre','Por Cobardía','Te Extraño','La Última Noche','Ritmo de Mi Pueblo','Dime Que Sí','Agua de Amor','Canto a Mi Patria'];

/* ══════════════════════════════════════════════
   WILFRIDO VARGAS — Canciones por Álbum
   ══════════════════════════════════════════════ */

const WV_ALBUM_1 = ['El Jardinero','Amanecer','Abusadora','El Loco','La Medicina','Barbarazo','El Papelito Blanco','Baile del Suá Suá','El Año Viejo','El Músico','Playas de Mi Tierra','Los Cangrejos'];
const WV_ALBUM_2 = ['Cobarde','El Comején','El Motor','La Chacabana','Las Mujeres','Mambo','Merengue Internacional','Más Que un Hombre','No Te Quiero','Pechito de Hierro','María','El Merengón'];

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

// Juan Luis Guerra 440
const JLG_AUDITED = [
  { name: 'Bachata Rosa',               nodes: 2800, views: 180000000, yield: 7200, cat: 'JLG-01' },
  { name: 'Burbujas de Amor',           nodes: 3200, views: 250000000, yield: 10000, cat: 'JLG-01' },
  { name: 'Ojalá Que Llueva Café',      nodes: 1800, views: 120000000, yield: 4800, cat: 'JLG-01' },
  { name: 'La Bilirrubina',             nodes: 2000, views: 140000000, yield: 5600, cat: 'JLG-01' },
  { name: 'A Pedir Su Mano',            nodes: 1200, views: 85000000,  yield: 3400, cat: 'JLG-01' },
  { name: 'El Farolito',                nodes: 900,  views: 65000000,  yield: 2600, cat: 'JLG-01' },
  { name: 'Fogaraté',                   nodes: 800,  views: 55000000,  yield: 2200, cat: 'JLG-02' },
  { name: 'Ni Es Lo Mismo Ni Es Igual', nodes: 750,  views: 50000000,  yield: 2000, cat: 'JLG-02' },
  { name: 'Visa Para un Sueño',         nodes: 700,  views: 48000000,  yield: 1920, cat: 'JLG-01' },
  { name: 'La Llave de Mi Corazón',     nodes: 650,  views: 42000000,  yield: 1680, cat: 'JLG-03' },
  { name: 'Todo Tiene Su Hora',         nodes: 600,  views: 38000000,  yield: 1520, cat: 'JLG-03' },
  { name: 'Las Avispas',                nodes: 550,  views: 35000000,  yield: 1400, cat: 'JLG-02' },
  { name: 'El Costo de la Vida',        nodes: 500,  views: 32000000,  yield: 1280, cat: 'JLG-02' },
  { name: 'Para Ti',                    nodes: 480,  views: 30000000,  yield: 1200, cat: 'JLG-03' },
  { name: 'Estrellitas y Duendes',      nodes: 450,  views: 28000000,  yield: 1120, cat: 'JLG-01' },
  { name: 'Radio Güira',                nodes: 600,  views: 40000000,  yield: 1600, cat: 'JLG-04' }
];

// Milly Quezada
const MQ_AUDITED = [
  { name: 'Eras',                       nodes: 600,  views: 40000000,  yield: 1600, cat: 'MQ-01' },
  { name: 'Volvió Juanita',             nodes: 450,  views: 32000000,  yield: 1280, cat: 'MQ-01' },
  { name: 'Lo Que Más Me Gusta de Ti',  nodes: 400,  views: 28000000,  yield: 1120, cat: 'MQ-01' }
];

// Fernando Villalona
const FV_AUDITED = [
  { name: 'El Mayimbe',                 nodes: 500,  views: 35000000,  yield: 1400, cat: 'FV-01' },
  { name: 'La Quiero a Ella',           nodes: 380,  views: 25000000,  yield: 1000, cat: 'FV-01' },
  { name: 'Celos',                      nodes: 350,  views: 22000000,  yield: 880,  cat: 'FV-01' }
];

// Wilfrido Vargas
const WV_AUDITED = [
  { name: 'El Jardinero',               nodes: 700,  views: 48000000,  yield: 1920, cat: 'WV-01' },
  { name: 'Abusadora',                  nodes: 550,  views: 38000000,  yield: 1520, cat: 'WV-01' },
  { name: 'Amanecer',                   nodes: 500,  views: 35000000,  yield: 1400, cat: 'WV-01' }
];

// Combinado para compatibilidad con FULL_CATALOG
const AUDITED_SONGS = [...RO_AUDITED, ...JLG_AUDITED, ...MQ_AUDITED, ...FV_AUDITED, ...WV_AUDITED];

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
  // ══════════════════════════════════════════════
  //  JUAN LUIS GUERRA 440
  // ══════════════════════════════════════════════
  {
    id: 'JLG-01',
    name: 'Juan Luis Guerra · Bachata Rosa Época',
    period: '1984-1992',
    description: 'Álbumes 1-6 · Soplando a Areíto · La era dorada',
    color: '#f0c040',
    bgColor: '#1a2a0a',
    icon: '🎸',
    songCount: 65,
    auditedSongs: AUDITED_SONGS.filter(s => s.cat === 'JLG-01'),
    estimatedSongs: [
      ...makeSongBatch(JLG_ALBUM_1, 8000000, 100, 'JLG-01'),
      ...makeSongBatch(JLG_ALBUM_2, 10000000, 120, 'JLG-01'),
      ...makeSongBatch(JLG_ALBUM_3, 12000000, 140, 'JLG-01'),
      ...makeSongBatch(JLG_ALBUM_4, 15000000, 180, 'JLG-01'),
      ...makeSongBatch(JLG_ALBUM_5, 25000000, 300, 'JLG-01'),
      ...makeSongBatch(JLG_ALBUM_6, 18000000, 200, 'JLG-01')
    ]
  },
  {
    id: 'JLG-02',
    name: 'Juan Luis Guerra · Merengue Moderno',
    period: '1994-2004',
    description: 'Álbumes 7-9 · Fogaraté · Ni Es Lo Mismo · Para Ti',
    color: '#2ecc71',
    bgColor: '#0a2a1a',
    icon: '🎺',
    songCount: 32,
    auditedSongs: AUDITED_SONGS.filter(s => s.cat === 'JLG-02'),
    estimatedSongs: [
      ...makeSongBatch(JLG_ALBUM_7, 14000000, 160, 'JLG-02'),
      ...makeSongBatch(JLG_ALBUM_8, 12000000, 140, 'JLG-02'),
      ...makeSongBatch(JLG_ALBUM_9, 10000000, 120, 'JLG-02')
    ]
  },
  {
    id: 'JLG-03',
    name: 'Juan Luis Guerra · Baladas y Cristiano',
    period: '2007-2014',
    description: 'Álbumes 10-12 · La Llave · Colección Cristiana · Todo Tiene Su Hora',
    color: '#7db8e8',
    bgColor: '#0a1a2a',
    icon: '🙏',
    songCount: 33,
    auditedSongs: AUDITED_SONGS.filter(s => s.cat === 'JLG-03'),
    estimatedSongs: [
      ...makeSongBatch(JLG_ALBUM_10, 9000000, 100, 'JLG-03'),
      ...makeSongBatch(JLG_ALBUM_11, 5000000, 60, 'JLG-03'),
      ...makeSongBatch(JLG_ALBUM_12, 8000000, 90, 'JLG-03')
    ]
  },
  {
    id: 'JLG-04',
    name: 'Juan Luis Guerra · 440 Contemporáneo',
    period: '2023',
    description: 'Álbum 13: Radio Güira · La nueva era 440',
    color: '#ff6b4a',
    bgColor: '#2a1a0a',
    icon: '📻',
    songCount: 11,
    auditedSongs: AUDITED_SONGS.filter(s => s.cat === 'JLG-04'),
    estimatedSongs: makeSongBatch(JLG_ALBUM_13, 12000000, 150, 'JLG-04')
  },
  // ══════════════════════════════════════════════
  //  MILLY QUEZADA
  // ══════════════════════════════════════════════
  {
    id: 'MQ-01',
    name: 'Milly Quezada · Reina del Merengue',
    period: '1985-2005',
    description: 'Los grandes éxitos de la Reina del Merengue',
    color: '#e87d9e',
    bgColor: '#2a0a1a',
    icon: '👑',
    songCount: 25,
    auditedSongs: AUDITED_SONGS.filter(s => s.cat === 'MQ-01'),
    estimatedSongs: [
      ...makeSongBatch(MQ_ALBUM_1, 6000000, 80, 'MQ-01'),
      ...makeSongBatch(MQ_ALBUM_2, 4500000, 60, 'MQ-01')
    ]
  },
  // ══════════════════════════════════════════════
  //  FERNANDO VILLALONA
  // ══════════════════════════════════════════════
  {
    id: 'FV-01',
    name: 'Fernando Villalona · El Mayimbe',
    period: '1980-2000',
    description: 'Grandes éxitos del Mayimbe dominicano',
    color: '#b87de8',
    bgColor: '#1a0a2a',
    icon: '🎤',
    songCount: 22,
    auditedSongs: AUDITED_SONGS.filter(s => s.cat === 'FV-01'),
    estimatedSongs: [
      ...makeSongBatch(FV_ALBUM_1, 5000000, 70, 'FV-01'),
      ...makeSongBatch(FV_ALBUM_2, 4000000, 55, 'FV-01')
    ]
  },
  // ══════════════════════════════════════════════
  //  WILFRIDO VARGAS
  // ══════════════════════════════════════════════
  {
    id: 'WV-01',
    name: 'Wilfrido Vargas · Merengue Internacional',
    period: '1980-2000',
    description: 'El rey del merengue internacional · +12 éxitos',
    color: '#5c8ce0',
    bgColor: '#0a1a2a',
    icon: '🌍',
    songCount: 24,
    auditedSongs: AUDITED_SONGS.filter(s => s.cat === 'WV-01'),
    estimatedSongs: [
      ...makeSongBatch(WV_ALBUM_1, 7000000, 90, 'WV-01'),
      ...makeSongBatch(WV_ALBUM_2, 5500000, 75, 'WV-01')
    ]
  }
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

// Helper: obtener canciones auditadas de un artista específico
function getArtistAudited(artistPrefix) {
  return AUDITED_SONGS.filter(s => s.cat.startsWith(artistPrefix));
}
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

/* ── Render Artist Section (JLG, Milly, Villalona, Vargas) ── */
function renderArtistSection(artistKey) {
  const container = document.getElementById(artistKey + '-container');
  if (!container) return;

  const ARTIST_MAP = {
    jlg: { name: 'Juan Luis Guerra 440', icon: '🎸', color: '#f0c040', bgColor: '#1a2a0a', audited: JLG_AUDITED, cats: ['JLG-01','JLG-02','JLG-03','JLG-04'] },
    milly: { name: 'Milly Quezada', icon: '👑', color: '#e87d9e', bgColor: '#2a0a1a', audited: MQ_AUDITED, cats: ['MQ-01'] },
    villalona: { name: 'Fernando Villalona', icon: '🎤', color: '#b87de8', bgColor: '#1a0a2a', audited: FV_AUDITED, cats: ['FV-01'] },
    vargas: { name: 'Wilfrido Vargas', icon: '🌍', color: '#5c8ce0', bgColor: '#0a1a2a', audited: WV_AUDITED, cats: ['WV-01'] }
  };

  const artist = ARTIST_MAP[artistKey];
  if (!artist) return;

  const songs = artist.audited;
  const totalViews = songs.reduce((a, s) => a + s.views, 0);
  const totalYield = songs.reduce((a, s) => a + s.yield, 0);
  const totalNodes = songs.reduce((a, s) => a + s.nodes, 0);

  const songRows = songs.map(s => `
    <div class="catalog-song-item">
      <span class="csi-name"><strong>${s.name}</strong></span>
      <span class="csi-nodes">${s.nodes.toLocaleString('en-US')}</span>
      <span class="csi-views">${formatViewsShort(s.views)}</span>
      <span class="csi-yield" style="color:${artist.color};">$${s.yield.toLocaleString('en-US')}/mo</span>
    </div>
  `).join('');

  container.innerHTML = `
    <div style="background:var(--bg2);border:0.5px solid var(--border);border-radius:var(--radius2);padding:20px;">
      <div style="display:flex;align-items:center;gap:14px;margin-bottom:16px;">
        <div style="font-size:32px;width:56px;height:56px;display:flex;align-items:center;justify-content:center;background:${artist.bgColor};color:${artist.color};border-radius:var(--radius);">${artist.icon}</div>
        <div>
          <h2 style="margin:0;font-size:18px;font-weight:500;">${artist.name}</h2>
          <div style="font-size:12px;color:var(--muted);margin-top:2px;">${songs.length} canciones auditadas · ${formatViewsShort(totalViews)} vistas · ${formatMoneyCompact(totalYield)}/mes proyectado</div>
        </div>
      </div>

      <div class="catalog-card-body" style="border:0.5px solid var(--border);border-radius:var(--radius);overflow:hidden;">
        <div style="font-size:10px;padding:8px 16px;color:var(--muted2);display:flex;gap:16px;background:var(--bg3);border-bottom:0.5px solid var(--border);">
          <span style="flex:1;">Canción</span>
          <span style="width:60px;text-align:right;">Nodos</span>
          <span style="width:70px;text-align:right;">Vistas</span>
          <span style="width:80px;text-align:right;">Yield/mes</span>
        </div>
        <div class="catalog-song-list">${songRows}</div>
        <div class="catalog-total-row">
          <span>Total ${songs.length} canciones</span>
          <span style="color:var(--text2);">${totalNodes.toLocaleString('en-US')} nodos</span>
          <span style="color:var(--text2);">${formatViewsShort(totalViews)}</span>
          <span style="color:${artist.color};">${formatMoneyCompact(totalYield)}/mo</span>
        </div>
      </div>

      <div style="margin-top:16px;display:flex;gap:10px;flex-wrap:wrap;">
        ${artist.cats.map(catId => {
          const cat = FULL_CATALOG.find(c => c.id === catId);
          if (!cat) return '';
          const catSongs = ALL_CATALOG_SONGS.filter(s => s.catalogId === catId);
          const catYield = catSongs.reduce((a, s) => a + s.yield, 0);
          return `
            <div style="flex:1;min-width:180px;background:var(--bg3);border:0.5px solid var(--border);border-radius:var(--radius);padding:12px;">
              <div style="font-size:11px;font-weight:600;color:${cat.color};">${cat.icon} ${cat.id} · ${cat.name}</div>
              <div style="font-size:10px;color:var(--muted);margin-top:4px;">${catSongs.length} canciones · ${cat.period || ''}</div>
              <div style="font-size:11px;color:${cat.color};margin-top:4px;">${formatMoneyCompact(catYield)}/mo</div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

/* ── Render Multi-Artista Consolidado ── */
let multiArtistTab = 'all';

function renderMultiArtist() {
  const container = document.getElementById('multiartist-container');
  if (!container) return;

  const tabs = [
    { id: 'all', label: '📀 Todos', color: 'var(--accent)' },
    { id: 'RO', label: '🎷 Ramón Orlando', color: '#f0c040' },
    { id: 'JLG', label: '🎸 JLG 440', color: '#f0c040' },
    { id: 'MQ', label: '👑 Milly Q.', color: '#e87d9e' },
    { id: 'FV', label: '🎤 Villalona', color: '#b87de8' },
    { id: 'WV', label: '🌍 Vargas', color: '#5c8ce0' }
  ];

  let filtered = AUDITED_SONGS;
  if (multiArtistTab !== 'all') {
    filtered = AUDITED_SONGS.filter(s => s.cat.startsWith(multiArtistTab));
  }

  const totalViews = filtered.reduce((a, s) => a + s.views, 0);
  const totalYield = filtered.reduce((a, s) => a + s.yield, 0);
  const totalNodes = filtered.reduce((a, s) => a + s.nodes, 0);

  const songRows = filtered.map(s => {
    const cat = FULL_CATALOG.find(c => c.id === s.cat);
    const catColor = cat ? cat.color : 'var(--muted)';
    return `
      <div class="catalog-song-item">
        <span class="csi-name"><strong>${s.name}</strong> <span style="font-size:9px;color:var(--muted2);">${s.cat}</span></span>
        <span class="csi-nodes">${s.nodes.toLocaleString('en-US')}</span>
        <span class="csi-views">${formatViewsShort(s.views)}</span>
        <span class="csi-yield" style="color:${catColor};">$${s.yield.toLocaleString('en-US')}/mo</span>
      </div>
    `;
  }).join('');

  const tabHtml = tabs.map(t => `
    <button class="catalog-filter-tab ${multiArtistTab === t.id ? 'active' : ''}"
      onclick="multiArtistTab='${t.id}';renderMultiArtist()"
      style="${multiArtistTab === t.id ? 'border-color:' + t.color + ';color:' + t.color + ';' : ''}">
      ${t.label}
    </button>
  `).join('');

  container.innerHTML = `
    <div style="margin-bottom:14px;display:flex;gap:6px;flex-wrap:wrap;">${tabHtml}</div>

    <div style="display:flex;gap:10px;margin-bottom:14px;flex-wrap:wrap;">
      <div class="catalog-stat-pill"><div class="csp-value" style="color:var(--accent);">${filtered.length}</div><div class="csp-label">Canciones</div></div>
      <div class="catalog-stat-pill"><div class="csp-value" style="color:var(--tomato-light);">${formatViewsShort(totalViews)}</div><div class="csp-label">Vistas</div></div>
      <div class="catalog-stat-pill"><div class="csp-value" style="color:var(--success-bright);">${formatMoneyCompact(totalYield)}/mes</div><div class="csp-label">Yield</div></div>
      <div class="catalog-stat-pill"><div class="csp-value" style="color:var(--info-bright);">${totalNodes.toLocaleString('en-US')}</div><div class="csp-label">Nodos</div></div>
    </div>

    <div class="catalog-card-body" style="border:0.5px solid var(--border);border-radius:var(--radius);overflow:hidden;">
      <div style="font-size:10px;padding:8px 16px;color:var(--muted2);display:flex;gap:16px;background:var(--bg3);border-bottom:0.5px solid var(--border);">
        <span style="flex:1;">Canción · Catálogo</span>
        <span style="width:60px;text-align:right;">Nodos</span>
        <span style="width:70px;text-align:right;">Vistas</span>
        <span style="width:80px;text-align:right;">Yield/mes</span>
      </div>
      <div class="catalog-song-list">${songRows}</div>
      <div class="catalog-total-row">
        <span>Total ${filtered.length} canciones · ${multiArtistTab === 'all' ? 'Todos los artistas' : tabs.find(t => t.id === multiArtistTab)?.label || ''}</span>
        <span style="color:var(--text2);">${totalNodes.toLocaleString('en-US')} nodos</span>
        <span style="color:var(--text2);">${formatViewsShort(totalViews)}</span>
        <span style="color:var(--success-bright);">${formatMoneyCompact(totalYield)}/mo</span>
      </div>
    </div>
  `;
}

/* ══════════════════════════════════════════════
   SHORTS DASHBOARD — Métricas Agregadas de Todos los Artistas
   ══════════════════════════════════════════════ */

let _dashboardShortsCache = null;

function updateShortsDashboard() {
  // Si hay datos reales del API, intentar cargarlos
  _dashboardShortsCache = null;
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
      de todos los artistas en el sistema.
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
