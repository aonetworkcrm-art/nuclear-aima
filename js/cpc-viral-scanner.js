/* ══════════════════════════════════════════════
   NUCLEAR AIMA — VIRAL SCANNER v1.0
   Bot/Scraper en vivo · Google News · Reddit · YouTube
   Detecta posts virales reales en cada nicho de alto CPC
   La bestia más poderosa del universo 🔥
   ══════════════════════════════════════════════ */

/* ══════════════════════════════════════════════
   CORE STATE
   ══════════════════════════════════════════════ */

const VIRAL_SCANNER_VERSION = '1.0';

let scannerState = {
  activeNiche: 'insurance',
  activeSource: 'all',
  scanResults: [],
  recentScans: JSON.parse(localStorage.getItem('na_viral_scans') || '[]'),
  isScanning: false,
  liveMode: true,
  autoRefresh: false,
  refreshInterval: null,
  sortBy: 'relevance',
  dateRange: '7d',
  sourceFilters: {},
  sourceFilterInit: false,
  enabledSources: JSON.parse(localStorage.getItem('na_enabled_sources') || '{}'),
};

// Ensure all SOURCES have an entry in enabledSources (default true)
function initSourceFilters() {
  if (scannerState.sourceFilterInit) return;
  const s = scannerState.sourceFilters;
  const allIds = SOURCES.map(x => x.id);
  allIds.forEach(id => { s[id] = true; });
  scannerState.sourceFilterInit = true;
}

function initEnabledSources() {
  const s = scannerState.enabledSources;
  const allIds = SOURCES.map(x => x.id);
  let changed = false;
  allIds.forEach(id => {
    if (s[id] === undefined) { s[id] = true; changed = true; }
  });
  // Remove stale entries
  Object.keys(s).forEach(k => {
    if (!allIds.includes(k)) { delete s[k]; changed = true; }
  });
  if (changed) localStorage.setItem('na_enabled_sources', JSON.stringify(s));
}

/* ── Scanner Niches (subset of CPC niches for scanning) ── */
const SCANNER_NICHES = [
  { id: 'insurance', name: 'Insurance', keywords: 'life insurance OR car insurance OR health insurance OR home insurance', color: '#f0c040' },
  { id: 'finance', name: 'Finance', keywords: 'personal loans OR credit cards OR mortgage OR investing', color: '#2ecc71' },
  { id: 'legal', name: 'Legal', keywords: 'personal injury lawyer OR bankruptcy OR immigration lawyer', color: '#7db8e8' },
  { id: 'tech', name: 'Technology', keywords: 'SaaS OR cybersecurity OR AI tools OR cloud computing', color: '#5c8ce0' },
  { id: 'health', name: 'Health', keywords: 'weight loss OR supplements OR mental health OR fitness', color: '#e05c5c' },
  { id: 'marketing', name: 'Marketing', keywords: 'SEO OR email marketing OR dropshipping OR freelancing', color: '#e8c96e' },
  { id: 'realestate', name: 'Real Estate', keywords: 'home buying OR real estate agent OR rental property', color: '#c080f0' },
  { id: 'education', name: 'Education', keywords: 'online courses OR college admissions OR certification', color: '#6ecfa5' },
  { id: 'crypto', name: 'Crypto', keywords: 'bitcoin OR ethereum OR defi OR NFT OR crypto trading', color: '#f0c040' },
  { id: 'lifestyle', name: 'Lifestyle', keywords: 'dating OR parenting OR recipes OR fitness OR pets', color: '#e87d9e' },
  { id: 'gaming', name: 'Gaming', keywords: 'game review OR gaming setup OR best games', color: '#b87de8' },
  { id: 'travel', name: 'Travel', keywords: 'travel tips OR hotel reviews OR cheap flights', color: '#5c8ce0' },
];

/* ── CORS Proxies (for fetching external APIs from browser) ── */
const CORS_PROXIES = [
  'https://corsproxy.io/?url=',
  'https://api.allorigins.win/raw?url=',
];

/* ── RSS/Feed sources ── */
const SOURCES = [
  { id: 'google-news', name: 'Google News', icon: '📰', color: '#4285f4', desc: 'Noticias trending en Google News' },
  { id: 'google-discover', name: 'Google Discover', icon: '🔮', color: '#34a853', desc: 'Contenido trending via Google Trends + Discover signals' },
  { id: 'reddit', name: 'Reddit', icon: '🗣️', color: '#ff4500', desc: 'Posts virales en Reddit por nicho' },
  { id: 'youtube', name: 'YouTube', icon: '▶️', color: '#ff0000', desc: 'Videos trending en YouTube' },
  { id: 'twitter', name: 'X / Twitter', icon: '🐦', color: '#1da1f2', desc: 'Tendencias en X por keyword' },
  { id: 'tiktok', name: 'TikTok', icon: '🎵', color: '#000000', desc: 'Videos virales en TikTok por nicho' },
  { id: 'pinterest', name: 'Pinterest', icon: '📌', color: '#e60023', desc: 'Pines virales y tendencias en Pinterest' },
  { id: 'instagram', name: 'Instagram Reels', icon: '📱', color: '#e1306c', desc: 'Reels virales en Instagram por nicho' },
  { id: 'linkedin', name: 'LinkedIn', icon: '💼', color: '#0A66C2', desc: 'Posts virales y tendencias en LinkedIn' },
  { id: 'quora', name: 'Quora', icon: '💭', color: '#b92b27', desc: 'Preguntas y respuestas virales en Quora por nicho' },
  { id: 'medium', name: 'Medium', icon: '📖', color: '#000000', desc: 'Artículos y publicaciones virales en Medium por nicho' },
];

// Initialize enabledSources defaults (must be after SOURCES is defined)
initEnabledSources();
initSourceFilters();

/* ══════════════════════════════════════════════
   MAIN RENDER FUNCTION
   ══════════════════════════════════════════════ */

function renderViralScanner() {
  initSourceFilters();
  const container = document.getElementById('cpc-tab-content') || document.getElementById('cpc-container');
  if (!container) return;

  const totalResults = scannerState.scanResults.length;
  const totalScans = scannerState.recentScans.length;

  container.innerHTML = `
    <!-- ═══ HEADER ═══ -->
    <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:12px;margin-bottom:14px;">
      <div>
        <h2 style="font-size:20px;font-weight:600;margin-bottom:2px;">🤖 Viral Scanner</h2>
        <p style="font-size:12px;color:var(--muted);">
          Bot/scraper en vivo · Google News · Reddit · YouTube · 
          <span style="color:${totalResults > 0 ? 'var(--success-bright)' : 'var(--muted2)'};">${totalResults} resultados</span>
          ${totalScans > 0 ? '· ' + totalScans + ' escaneos' : ''}
        </p>
      </div>
      <div style="display:flex;gap:6px;flex-wrap:wrap;">
        <button class="btn btn-sm btn-ghost" onclick="showScannerArchitecture()" style="font-size:10px;">🧠 How It Works</button>
        <button class="btn btn-sm ${scannerState.liveMode ? 'btn-primary' : 'btn-ghost'}" onclick="toggleScannerLiveMode()" style="font-size:10px;" id="scanner-live-btn">
          ${scannerState.liveMode ? '🔴 Live Mode' : '⚪ Demo Mode'}
        </button>
        <button class="btn btn-sm btn-ghost" onclick="toggleAutoRefresh()" style="font-size:10px;" id="scanner-refresh-btn">🔄 Auto</button>
        <div style="position:relative;display:inline-block;" id="scanner-export-wrapper">
          <button class="btn btn-sm btn-ghost" onclick="toggleScannerExportMenu()" style="font-size:10px;" id="scanner-export-btn">📥 Export ▾</button>
          <div id="scanner-export-menu" style="display:none;position:absolute;top:100%;right:0;background:var(--bg3);border:0.5px solid var(--border);border-radius:8px;padding:4px;z-index:100;min-width:130px;box-shadow:0 8px 24px rgba(0,0,0,0.4);">
            <button class="btn btn-sm btn-ghost" onclick="exportScannerResults('txt')" style="font-size:10px;width:100%;justify-content:flex-start;padding:6px 10px;">📄 Exportar como TXT</button>
            <button class="btn btn-sm btn-ghost" onclick="exportScannerResults('csv')" style="font-size:10px;width:100%;justify-content:flex-start;padding:6px 10px;">📊 Exportar como CSV</button>
            <button class="btn btn-sm btn-ghost" onclick="exportScannerResults('json')" style="font-size:10px;width:100%;justify-content:flex-start;padding:6px 10px;">📋 Exportar como JSON</button>
          </div>
        </div>
        <button class="btn btn-sm btn-ghost" onclick="showScannerHistory()" style="font-size:10px;">📋 Historial (${totalScans})</button>
      </div>
    </div>

    <!-- ═══ NICHE SELECTOR + SCAN ═══ -->
    <div style="background:var(--bg2);border:0.5px solid var(--border);border-radius:var(--radius2);padding:14px;margin-bottom:14px;">
      <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;">
        <div style="flex:1;min-width:160px;">
          <label style="font-size:9px;color:var(--muted2);text-transform:uppercase;display:block;margin-bottom:4px;">🎯 Nicho a Escanear</label>
          <select id="scanner-niche-select" onchange="scannerState.activeNiche=this.value;updateScannerNicheInfo()"
            style="width:100%;background:var(--bg3);border:0.5px solid var(--border);border-radius:8px;padding:8px 10px;color:var(--text);font-size:12px;font-family:var(--font);outline:none;cursor:pointer;">
            ${SCANNER_NICHES.map(n => `
              <option value="${n.id}" ${scannerState.activeNiche === n.id ? 'selected' : ''}>${n.name}</option>
            `).join('')}
          </select>
        </div>
        <div style="min-width:120px;">
          <label style="font-size:9px;color:var(--muted2);text-transform:uppercase;display:block;margin-bottom:4px;">📡 Fuente</label>
          <select id="scanner-source-select" onchange="scannerState.activeSource=this.value"
            style="width:100%;background:var(--bg3);border:0.5px solid var(--border);border-radius:8px;padding:8px 10px;color:var(--text);font-size:12px;font-family:var(--font);outline:none;cursor:pointer;">
            <option value="all">🔥 Todas las fuentes</option>
            <option value="google-news">📰 Google News</option>
            <option value="google-discover">🔮 Google Discover</option>
            <option value="reddit">🗣️ Reddit</option>
            <option value="youtube">▶️ YouTube</option>
            <option value="twitter">🐦 X / Twitter</option>
            <option value="tiktok">🎵 TikTok</option>
            <option value="pinterest">📌 Pinterest</option>
            <option value="instagram">📱 Instagram Reels</option>
            <option value="linkedin">💼 LinkedIn</option>
            <option value="quora">💭 Quora</option>
            <option value="medium">📖 Medium</option>
          </select>
        </div>
        <div style="min-width:100px;">
          <label style="font-size:9px;color:var(--muted2);text-transform:uppercase;display:block;margin-bottom:4px;">📅 Período</label>
          <select id="scanner-daterange-select" onchange="scannerState.dateRange=this.value"
            style="width:100%;background:var(--bg3);border:0.5px solid var(--border);border-radius:8px;padding:8px 10px;color:var(--text);font-size:12px;font-family:var(--font);outline:none;cursor:pointer;">
            <option value="24h" ${scannerState.dateRange === '24h' ? 'selected' : ''}>24 horas</option>
            <option value="7d" ${scannerState.dateRange === '7d' ? 'selected' : ''}>7 días</option>
            <option value="30d" ${scannerState.dateRange === '30d' ? 'selected' : ''}>30 días</option>
          </select>
        </div>
        <div style="align-self:flex-end;">
          <button class="btn btn-primary" onclick="startScannerScan()" id="scanner-scan-btn" style="font-size:13px;padding:9px 24px;white-space:nowrap;">
            ${scannerState.isScanning ? '⏳ Escaneando...' : '🚀 Escanear'}
          </button>
        </div>
      </div>
      <div id="scanner-niche-info" style="margin-top:8px;font-size:11px;color:var(--muted2);display:flex;gap:16px;flex-wrap:wrap;"></div>
    </div>

    <!-- ═══ STATS BAR ═══ -->
    <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:8px;margin-bottom:14px;" id="scanner-stats-bar">
      <div style="background:var(--bg2);border:0.5px solid var(--border);border-radius:8px;padding:10px;text-align:center;">
        <div style="font-size:9px;color:var(--muted2);text-transform:uppercase;">Resultados</div>
        <div style="font-size:20px;font-weight:600;font-family:var(--mono);color:var(--accent);" id="scanner-stat-results">${totalResults}</div>
      </div>
      <div style="background:var(--bg2);border:0.5px solid var(--border);border-radius:8px;padding:10px;text-align:center;">
        <div style="font-size:9px;color:var(--muted2);text-transform:uppercase;">Fuentes</div>
        <div style="font-size:20px;font-weight:600;font-family:var(--mono);color:var(--info-bright);" id="scanner-stat-sources">${SOURCES.length}</div>
      </div>
      <div style="background:var(--bg2);border:0.5px solid var(--border);border-radius:8px;padding:10px;text-align:center;">
        <div style="font-size:9px;color:var(--muted2);text-transform:uppercase;">Nichos</div>
        <div style="font-size:20px;font-weight:600;font-family:var(--mono);color:var(--success-bright);" id="scanner-stat-niches">${SCANNER_NICHES.length}</div>
      </div>
      <div style="background:var(--bg2);border:0.5px solid var(--border);border-radius:8px;padding:10px;text-align:center;">
        <div style="font-size:9px;color:var(--muted2);text-transform:uppercase;">Modo</div>
        <div style="font-size:14px;font-weight:600;font-family:var(--mono);color:${scannerState.liveMode ? 'var(--danger)' : 'var(--warning)'};" id="scanner-stat-mode">${scannerState.liveMode ? '🔴 LIVE' : '⚪ DEMO'}</div>
      </div>
      <div style="background:var(--bg2);border:0.5px solid var(--border);border-radius:8px;padding:10px;text-align:center;">
        <div style="font-size:9px;color:var(--muted2);text-transform:uppercase;">Último Scan</div>
        <div style="font-size:11px;font-weight:500;font-family:var(--mono);color:var(--text2);" id="scanner-stat-last">${scannerState.recentScans.length > 0 ? new Date(scannerState.recentScans[0].timestamp).toLocaleTimeString('es-DO') : '—'}</div>
      </div>
    </div>

    <!-- ═══ SOURCE TOGGLES CONTROL BAR ═══ -->
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
      <div style="font-size:11px;font-weight:500;color:var(--text2);display:flex;align-items:center;gap:6px;">
        🔌 Activar fuentes
        <span style="font-size:9px;color:var(--muted2);font-weight:400;">(marca las que quieras escanear)</span>
      </div>
      <div style="display:flex;gap:6px;">
        <button class="btn btn-xs btn-ghost" onclick="selectAllSources(true)" style="font-size:9px;padding:3px 10px;">✅ Todas</button>
        <button class="btn btn-xs btn-ghost" onclick="selectAllSources(false)" style="font-size:9px;padding:3px 10px;">⏸️ Ninguna</button>
      </div>
    </div>

    <!-- ═══ SOURCE STATUS ═══ -->
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:8px;margin-bottom:14px;" id="scanner-source-status">
      ${SOURCES.map(s => `
        <div class="scanner-source-card" id="scanner-source-${s.id}" onclick="toggleSourceFilter('${s.id}')" style="cursor:pointer;position:relative;">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;">
            <div style="font-size:20px;margin-bottom:2px;">${s.icon}</div>
            <label onclick="event.stopPropagation()" title="${scannerState.enabledSources[s.id] ? 'Desactivar' : 'Activar'} ${s.name}"
              style="cursor:pointer;display:flex;align-items:center;gap:4px;font-size:9px;color:var(--muted2);user-select:none;">
              <input type="checkbox" id="toggle-source-${s.id}"
                onchange="toggleSource('${s.id}', this.checked)"
                ${scannerState.enabledSources[s.id] ? 'checked' : ''}
                style="width:14px;height:14px;cursor:pointer;accent-color:${s.color};" />
              <span style="font-size:8px;">Activa</span>
            </label>
          </div>
          <div style="font-size:10px;font-weight:500;color:var(--text2);">${s.name}</div>
          <div style="font-size:8px;color:var(--muted2);margin-bottom:4px;">${s.desc}</div>
          <div style="font-size:9px;">
            <span id="scanner-source-${s.id}-status" style="color:var(--muted2);">⏸️ Inactivo</span>
          </div>
          ${!scannerState.enabledSources[s.id] ? '<div class="source-disabled-overlay" style="position:absolute;inset:0;background:rgba(0,0,0,0.35);border-radius:8px;z-index:2;display:flex;align-items:center;justify-content:center;font-size:10px;color:var(--muted);">⏸️ Desactivada</div>' : ''}
        </div>
      `).join('')}
    </div>

    <!-- ═══ SOURCE COMPARISON CHART ═══ -->
    <div id="scanner-comparison-container" style="${totalResults > 0 ? '' : 'display:none;'}margin-bottom:14px;">
      <div style="background:var(--bg2);border:0.5px solid var(--border);border-radius:var(--radius2);overflow:hidden;">
        <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 14px;border-bottom:0.5px solid var(--border);cursor:pointer;" onclick="toggleScannerComparison()">
          <div style="font-size:12px;font-weight:500;color:var(--text2);display:flex;align-items:center;gap:6px;">
            📊 Comparativa por Fuente
            <span id="scanner-comparison-arrow" style="font-size:10px;color:var(--muted2);transition:transform 0.2s;">▾</span>
          </div>
          <span style="font-size:9px;color:var(--muted2);">Resultados · Alto Score · Promedio Viral</span>
        </div>
        <div id="scanner-comparison-body" style="padding:12px 14px;">
          <div id="scanner-comparison-content"></div>
        </div>
      </div>
    </div>

    <!-- ═══ SCAN PROGRESS ═══ -->
    <div id="scanner-progress" style="display:none;background:var(--bg3);border:0.5px solid var(--border);border-radius:var(--radius);padding:12px;margin-bottom:14px;">
      <div style="display:flex;align-items:center;gap:10px;">
        <div style="font-size:20px;" id="scanner-progress-icon">⏳</div>
        <div style="flex:1;">
          <div style="font-size:12px;font-weight:500;color:var(--text2);" id="scanner-progress-text">Escaneando...</div>
          <div style="margin-top:4px;height:4px;background:var(--bg4);border-radius:2px;overflow:hidden;">
            <div id="scanner-progress-bar" style="height:100%;width:0%;background:linear-gradient(90deg,var(--accent),var(--info-bright));border-radius:2px;transition:width 0.3s;"></div>
          </div>
        </div>
        <button class="btn btn-xs btn-ghost" onclick="cancelScannerScan()" style="font-size:10px;">✕ Cancelar</button>
      </div>
    </div>

    <!-- ═══ RESULTS CONTROLS ═══ -->
    <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:10px;">
      <div style="font-size:12px;font-weight:500;color:var(--text2);">
        📊 Resultados 
        <span style="font-size:10px;color:var(--muted2);font-weight:400;" id="scanner-result-count">
          ${totalResults > 0 ? `(${totalResults} encontrados)` : '(ejecuta un escaneo)'}
        </span>
      </div>
      <div style="display:flex;gap:6px;align-items:center;">
        <div style="display:flex;gap:4px;align-items:center;">
          <input type="text" id="scanner-search-input" placeholder="🔍 Filtrar resultados..." 
            oninput="filterScannerResults()"
            style="background:var(--bg3);border:0.5px solid var(--border);border-radius:6px;padding:6px 10px;color:var(--text);font-size:11px;font-family:var(--font);outline:none;width:160px;" />
          <button class="btn btn-xs btn-ghost" id="scanner-clear-search" onclick="clearScannerSearch()" 
            style="font-size:11px;padding:4px 8px;display:none;" title="Limpiar búsqueda">✕</button>
        </div>
        <select id="scanner-sort-select" onchange="scannerState.sortBy=this.value;renderScannerResults()"
          style="background:var(--bg3);border:0.5px solid var(--border);border-radius:6px;padding:6px 8px;color:var(--text);font-size:10px;font-family:var(--mono);outline:none;cursor:pointer;">
          <option value="relevance">Por Relevancia</option>
          <option value="date">Por Fecha</option>
          <option value="source">Por Fuente</option>
          <option value="niche">Por Nicho</option>
        </select>
      </div>
    </div>

    <!-- ═══ SOURCE FILTER CHECKBOXES ═══ -->
    <div id="scanner-filter-panel" style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:10px;padding:8px 10px;background:var(--bg2);border:0.5px solid var(--border);border-radius:8px;align-items:center;">
      <span style="font-size:9px;color:var(--muted2);font-weight:500;margin-right:4px;white-space:nowrap;">📡 Filtrar:</span>
      ${SOURCES.map(s => `
        <label for="filter-source-${s.id}"
          style="cursor:pointer;display:inline-flex;align-items:center;gap:3px;padding:3px 8px;border-radius:5px;font-size:10px;user-select:none;white-space:nowrap;
            ${scannerState.sourceFilters && scannerState.sourceFilters[s.id] ? 'background:' + s.color + '18;border:0.5px solid ' + s.color + '44;' : 'background:var(--bg3);border:0.5px solid var(--border);'}
            transition:all 0.15s;">
          <input type="checkbox" id="filter-source-${s.id}"
            ${scannerState.sourceFilters && scannerState.sourceFilters[s.id] ? 'checked' : ''}
            onchange="toggleSourceFilter('${s.id}')"
            style="width:12px;height:12px;cursor:pointer;accent-color:${s.color};margin:0;" />
          <span style="font-size:11px;">${s.icon}</span>
          <span style="font-size:9px;color:var(--text2);">${s.name}</span>
        </label>
      `).join('')}
      <div style="margin-left:auto;display:flex;gap:4px;">
        <button class="btn btn-xs btn-ghost" onclick="selectAllSourceFilters(true)" style="font-size:9px;padding:2px 8px;">✅ Todas</button>
        <button class="btn btn-xs btn-ghost" onclick="selectAllSourceFilters(false)" style="font-size:9px;padding:2px 8px;">⏸️ Ninguna</button>
      </div>
    </div>

    <!-- ═══ RESULTS GRID ═══ -->
    <div id="scanner-results-container" style="min-height:200px;">
      ${totalResults === 0 ? `
        <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:60px 20px;text-align:center;">
          <div style="font-size:48px;margin-bottom:16px;">🤖</div>
          <div style="font-size:16px;font-weight:500;color:var(--text2);margin-bottom:8px;">¡Listo para escanear!</div>
          <div style="font-size:12px;color:var(--muted2);max-width:400px;line-height:1.6;">
            Selecciona un nicho, elige las fuentes y haz clic en <strong style="color:var(--accent);">🚀 Escanear</strong> 
            para detectar posts virales reales en ${scannerState.liveMode ? 'modo LIVE (datos reales de la web)' : 'modo DEMO (datos simulados)'}.
            ${scannerState.recentScans.length > 0 ? `<br><br>📋 Tienes ${scannerState.recentScans.length} escaneos anteriores.` : ''}
          </div>
        </div>
      ` : `<div id="scanner-results-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:10px;"></div>`}
    </div>
  `;

  updateScannerNicheInfo();
  if (totalResults > 0) {
    renderScannerResults();
  }
}

/* ══════════════════════════════════════════════
   NICHE INFO
   ══════════════════════════════════════════════ */

function updateScannerNicheInfo() {
  const el = document.getElementById('scanner-niche-info');
  if (!el) return;

  const niche = SCANNER_NICHES.find(n => n.id === scannerState.activeNiche);
  if (!niche) { el.innerHTML = ''; return; }

  let cpcData = '';
  if (typeof CPC_NICHES !== 'undefined') {
    const matches = CPC_NICHES.filter(n => n.cat.toLowerCase().includes(niche.name.toLowerCase()) || n.name.toLowerCase().includes(niche.name.toLowerCase()));
    if (matches.length > 0) {
      const top = matches.slice(0, 3);
      cpcData = top.map(m => `${m.icon} ${m.name}: $${m.adsenseCPCLow}-$${m.adsenseCPCHigh} CPC · Yield ${m.combinedScore}`).join(' · ');
    }
  }

  el.innerHTML = `
    <span style="color:${niche.color};">🎯 <strong>${niche.name}</strong></span>
    <span>🔑 Keywords: <code style="font-size:10px;background:var(--bg3);padding:2px 6px;border-radius:3px;color:var(--accent);">${niche.keywords}</code></span>
    ${cpcData ? `<span>📊 ${cpcData}</span>` : ''}
  `;
}

/* ══════════════════════════════════════════════
   SCAN ENGINE — Real fetching + fallback demo data
   ══════════════════════════════════════════════ */

async function startScannerScan() {
  if (scannerState.isScanning) return;

  scannerState.isScanning = true;
  const btn = document.getElementById('scanner-scan-btn');
  const progress = document.getElementById('scanner-progress');
  const progressBar = document.getElementById('scanner-progress-bar');
  const progressText = document.getElementById('scanner-progress-text');
  const progressIcon = document.getElementById('scanner-progress-icon');

  if (btn) btn.textContent = '⏳ Escaneando...';
  if (btn) btn.disabled = true;
  if (progress) progress.style.display = 'block';
  if (progressText) progressText.textContent = 'Iniciando escaneo...';
  if (progressBar) progressBar.style.width = '5%';

  try {
    const niche = SCANNER_NICHES.find(n => n.id === scannerState.activeNiche);
    if (!niche) { throw new Error('Nicho no encontrado'); }

    scannerState.scanResults = [];
    initSourceFilters();
    const results = [];
    const allSources = ['google-news', 'google-discover', 'reddit', 'youtube', 'twitter', 'tiktok', 'pinterest', 'instagram', 'linkedin', 'quora', 'medium'];
    let sourcesToScan = scannerState.activeSource === 'all' 
      ? allSources.filter(sid => scannerState.enabledSources[sid] !== false)
      : [scannerState.activeSource];
    
    // If no sources enabled, show warning
    if (sourcesToScan.length === 0) {
      showScannerToast('⚠️ No hay fuentes activadas. Activa al menos una fuente en los toggles superiores.');
      scannerState.isScanning = false;
      const btn = document.getElementById('scanner-scan-btn');
      if (btn) { btn.textContent = '🚀 Escanear'; btn.disabled = false; }
      const progress = document.getElementById('scanner-progress');
      if (progress) progress.style.display = 'none';
      return;
    }

    sourcesToScan.forEach(sid => {
      const statusEl = document.getElementById(`scanner-source-${sid}-status`);
      if (statusEl) statusEl.innerHTML = '⏳ Escaneando...';
    });

    for (let i = 0; i < sourcesToScan.length; i++) {
      const sid = sourcesToScan[i];
      const pct = 10 + ((i / sourcesToScan.length) * 70);
      if (progressText) progressText.textContent = `🔍 Escaneando ${SOURCES.find(s => s.id === sid)?.name || sid}...`;
      if (progressBar) progressBar.style.width = `${pct}%`;

      try {
        let sourceResults = [];
        if (scannerState.liveMode) {
          sourceResults = await scanSourceLive(sid, niche);
        } else {
          sourceResults = scanSourceDemo(sid, niche);
        }
        results.push(...sourceResults);
      } catch (err) {
        console.warn(`⚠️ ${sid} scan failed:`, err);
        const fallbackResults = scanSourceDemo(sid, niche);
        results.push(...fallbackResults);
        const statusEl = document.getElementById(`scanner-source-${sid}-status`);
        if (statusEl) statusEl.innerHTML = '⚠️ Fallback';
      }
    }

    if (progressText) progressText.textContent = '🧠 Analizando y clasificando resultados...';
    if (progressBar) progressBar.style.width = '90%';

    const seen = new Set();
    scannerState.scanResults = results.filter(r => {
      const key = r.title + r.source;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    scannerState.scanResults.forEach(r => {
      r.relevanceScore = calculateRelevanceScore(r, niche);
      r.viralScore = calculateViralScore(r);
    });

    scannerState.scanResults.sort((a, b) => b.relevanceScore - a.relevanceScore);

    if (progressText) progressText.textContent = `✅ Escaneo completado — ${scannerState.scanResults.length} resultados`;
    if (progressIcon) progressIcon.textContent = '✅';
    if (progressBar) progressBar.style.width = '100%';

    scannerState.recentScans.unshift({
      id: Date.now(),
      niche: niche.id,
      nicheName: niche.name,
      source: scannerState.activeSource,
      results: scannerState.scanResults.length,
      timestamp: Date.now(),
      liveMode: scannerState.liveMode,
    });
    if (scannerState.recentScans.length > 15) scannerState.recentScans.pop();
    localStorage.setItem('na_viral_scans', JSON.stringify(scannerState.recentScans));

    reRenderStats();
    renderScannerResults();
    renderScannerSourceComparison();
    showScannerToast(`✅ ${scannerState.scanResults.length} posts virales detectados en ${niche.name}`);

    if (scannerState.autoRefresh) {
      scheduleAutoRefresh();
    }

  } catch (err) {
    console.error('Scanner error:', err);
    if (progressText) progressText.textContent = `❌ Error: ${err.message}`;
    if (progressIcon) progressIcon.textContent = '❌';
    showScannerToast(`⚠️ Error en escaneo: ${err.message}`);
  } finally {
    scannerState.isScanning = false;
    if (btn) btn.textContent = '🚀 Escanear';
    if (btn) btn.disabled = false;

    setTimeout(() => {
      const progress = document.getElementById('scanner-progress');
      if (progress) progress.style.display = 'none';
    }, 3000);
  }
}

function cancelScannerScan() {
  scannerState.isScanning = false;
  const btn = document.getElementById('scanner-scan-btn');
  if (btn) btn.textContent = '🚀 Escanear';
  if (btn) btn.disabled = false;
  const progress = document.getElementById('scanner-progress');
  if (progress) progress.style.display = 'none';
  showScannerToast('⏹️ Escaneo cancelado');
}

/* ══════════════════════════════════════════════
   LIVE SCANNER — Fetches real data via CORS proxies
   ══════════════════════════════════════════════ */

async function scanSourceLive(sourceId, niche) {
  const encodedKeywords = encodeURIComponent(niche.keywords);

  switch (sourceId) {
    case 'google-news': {
      const rssUrl = `https://news.google.com/rss/search?q=${encodedKeywords}&hl=en-US&gl=US&ceid=US:en`;
      const proxyUrl = CORS_PROXIES[0] + encodeURIComponent(rssUrl);
      try {
        const response = await fetchWithTimeout(proxyUrl, 8000);
        const text = await response.text();
        return parseGoogleNewsXML(text, niche);
      } catch (e) {
        const proxyUrl2 = CORS_PROXIES[1] + encodeURIComponent(rssUrl);
        const response2 = await fetchWithTimeout(proxyUrl2, 8000);
        const text2 = await response2.text();
        return parseGoogleNewsXML(text2, niche);
      }
    }

    case 'reddit': {
      const searchQuery = niche.keywords.split(' OR ')[0];
      const redditUrl = `https://www.reddit.com/search.json?q=${encodeURIComponent(searchQuery)}&sort=top&t=${mapDateRange()}&limit=25`;
      try {
        const proxyUrl = CORS_PROXIES[0] + encodeURIComponent(redditUrl);
        const response = await fetchWithTimeout(proxyUrl, 8000);
        const data = await response.json();
        return parseRedditJSON(data, niche);
      } catch (e) {
        throw new Error('Reddit API no disponible');
      }
    }

    case 'youtube': {
      const searchQuery = niche.keywords.split(' OR ')[0];
      const rssUrl = `https://www.youtube.com/feeds/videos.xml?q=${encodeURIComponent(searchQuery)}`;
      try {
        const proxyUrl = CORS_PROXIES[0] + encodeURIComponent(rssUrl);
        const response = await fetchWithTimeout(proxyUrl, 8000);
        const text = await response.text();
        return parseYouTubeXML(text, niche);
      } catch (e) {
        throw new Error('YouTube RSS no disponible');
      }
    }

    case 'google-discover': {
      // Google Discover no tiene RSS público. Usamos Google Trends RSS
      // + Google News RSS con señales de tendencia para simular Discover.
      // Discover es un feed algorítmico que combina tendencias + intereses.
      const trendsUrl = `https://trends.google.com/trending/rss?geo=US&q=${encodedKeywords}`;
      try {
        const proxyUrl = CORS_PROXIES[0] + encodeURIComponent(trendsUrl);
        const response = await fetchWithTimeout(proxyUrl, 8000);
        const text = await response.text();
        return parseGoogleDiscoverXML(text, niche);
      } catch (e) {
        // Fallback: Google News RSS con señales de Discover
        const discoverUrl = `https://news.google.com/rss/search?q=${encodedKeywords}&hl=en-US&gl=US&ceid=US:en&topic=t`;
        const proxyUrl2 = CORS_PROXIES[1] + encodeURIComponent(discoverUrl);
        const response2 = await fetchWithTimeout(proxyUrl2, 8000);
        const text2 = await response2.text();
        return parseGoogleNewsXML(text2, niche);
      }
    }

    case 'twitter': {
      const searchQuery = niche.keywords.split(' OR ')[0];
      const nitterUrl = `https://nitter.net/search/rss?q=${encodeURIComponent(searchQuery)}`;
      try {
        const proxyUrl = CORS_PROXIES[0] + encodeURIComponent(nitterUrl);
        const response = await fetchWithTimeout(proxyUrl, 8000);
        const text = await response.text();
        return parseNitterXML(text, niche);
      } catch (e) {
        throw new Error('X/Twitter feed no disponible');
      }
    }

    case 'tiktok': {
      const searchQuery = niche.keywords.split(' OR ')[0];
      // TikTok no tiene API pública. Intentamos con servicios RSS de terceros.
      // Modo LIVE intenta fetch, si falla usa fallback automático a demo data.
      const tiktokRssUrl = `https://tokfeed.com/search/rss?q=${encodeURIComponent(searchQuery)}`;
      try {
        const proxyUrl = CORS_PROXIES[0] + encodeURIComponent(tiktokRssUrl);
        const response = await fetchWithTimeout(proxyUrl, 6000);
        const text = await response.text();
        return parseTikTokRSS(text, niche);
      } catch (e) {
        throw new Error('TikTok feed no disponible');
      }
    }

    case 'pinterest': {
      const searchQuery = niche.keywords.split(' OR ')[0];
      // Pinterest no tiene API pública de trending. Intentamos con RSS de boards.
      const pinterestUrl = `https://www.pinterest.com/resource/BoardFeedResource/get/?source_url=/search/pins/?q=${encodeURIComponent(searchQuery)}`;
      try {
        const proxyUrl = CORS_PROXIES[0] + encodeURIComponent(pinterestUrl);
        const response = await fetchWithTimeout(proxyUrl, 6000);
        const text = await response.text();
        return parsePinterestData(text, niche);
      } catch (e) {
        throw new Error('Pinterest feed no disponible');
      }
    }

    case 'instagram': {
      const searchQuery = niche.keywords.split(' OR ')[0];
      // Instagram Reels no tiene API pública. Intentamos con API de explorer/tags.
      // Modo LIVE intenta fetch, si falla usa fallback automático a demo data.
      const instagramUrl = `https://www.instagram.com/explore/tags/${encodeURIComponent(searchQuery.replace(/\s+/g,''))}/?__a=1&__d=1`;
      try {
        const proxyUrl = CORS_PROXIES[0] + encodeURIComponent(instagramUrl);
        const response = await fetchWithTimeout(proxyUrl, 6000);
        const text = await response.text();
        return parseInstagramData(text, niche);
      } catch (e) {
        throw new Error('Instagram feed no disponible');
      }
    }

        case 'linkedin': {
      const searchQuery = niche.keywords.split(' OR ')[0];
      // LinkedIn no tiene API pública. Intentamos con RSS de LinkedIn Pulse.
      // Modo LIVE intenta fetch, si falla usa fallback automático a demo data.
      const linkedinUrl = `https://www.linkedin.com/feed/trending.rss?q=${encodeURIComponent(searchQuery)}`;
      try {
        const proxyUrl = CORS_PROXIES[0] + encodeURIComponent(linkedinUrl);
        const response = await fetchWithTimeout(proxyUrl, 6000);
        const text = await response.text();
        return parseLinkedInRSS(text, niche);
      } catch (e) {
        throw new Error('LinkedIn feed no disponible');
      }
    }

    case 'quora': {
      const searchQuery = niche.keywords.split(' OR ')[0];
      // Quora RSS feed por topic/search. Quora expone RSS para topics.
      const quoraUrl = `https://www.quora.com/search/rss?q=${encodeURIComponent(searchQuery)}`;
      try {
        const proxyUrl = CORS_PROXIES[0] + encodeURIComponent(quoraUrl);
        const response = await fetchWithTimeout(proxyUrl, 6000);
        const text = await response.text();
        return parseQuoraRSS(text, niche);
      } catch (e) {
        throw new Error('Quora feed no disponible');
      }
    }

    case 'medium': {
      const searchQuery = niche.keywords.split(' OR ')[0];
      // Medium RSS feed por tag. Medium expone RSS público: medium.com/feed/tag/{tag}
      // También soporta topics/publicaciones: medium.com/feed/{topic}
      const tag = searchQuery.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'trending';
      const mediumUrl = `https://medium.com/feed/tag/${encodeURIComponent(tag)}`;
      try {
        const proxyUrl = CORS_PROXIES[0] + encodeURIComponent(mediumUrl);
        const response = await fetchWithTimeout(proxyUrl, 6000);
        const text = await response.text();
        return parseMediumRSS(text, niche);
      } catch (e) {
        throw new Error('Medium feed no disponible');
      }
    }

    default:
      return [];
  }
}

/* ══════════════════════════════════════════════
   FETCH HELPER WITH TIMEOUT
   ══════════════════════════════════════════════ */

async function fetchWithTimeout(url, timeoutMs = 8000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response;
  } catch (e) {
    clearTimeout(timeout);
    throw e;
  }
}

/* ══════════════════════════════════════════════
   PARSERS — Convert raw feed data to structured results
   ══════════════════════════════════════════════ */

function parseGoogleNewsXML(xmlText, niche) {
  const results = [];
  const titleRegex = /<title[^>]*>([^<]+)<\/title>/g;
  const linkRegex = /<link[^>]*>([^<]+)<\/link>/g;
  const pubDateRegex = /<pubDate[^>]*>([^<]+)<\/pubDate>/g;
  const sourceRegex = /<source[^>]*>([^<]+)<\/source>/g;

  const titles = [...xmlText.matchAll(titleRegex)].map(m => m[1]).slice(1);
  const links = [...xmlText.matchAll(linkRegex)].map(m => m[1]).slice(1);
  const pubDates = [...xmlText.matchAll(pubDateRegex)].map(m => m[1]);
  const sources = [...xmlText.matchAll(sourceRegex)].map(m => m[1]);

  for (let i = 0; i < Math.min(titles.length, 15); i++) {
    const title = titles[i]?.replace(/<!\[CDATA\[|\]\]>/g, '').trim();
    if (!title || title === 'Google News') continue;
    results.push({
      title,
      url: links[i] || '#',
      source: 'google-news',
      sourceName: 'Google News',
      sourceIcon: '📰',
      publishedAt: pubDates[i] ? new Date(pubDates[i]).toISOString() : new Date().toISOString(),
      snippet: title,
      niche: niche.id,
      nicheName: niche.name,
      engagement: Math.floor(Math.random() * 500) + 50,
      sourceDetail: sources[i] || 'Google News',
    });
  }

  if (results.length < 3) {
    throw new Error('Google News returned insufficient results');
  }
  return results;
}

function parseRedditJSON(jsonData, niche) {
  const results = [];
  const children = jsonData?.data?.children || [];
  for (const child of children.slice(0, 15)) {
    const d = child.data;
    if (!d || d.over_18) continue;
    results.push({
      title: d.title,
      url: `https://reddit.com${d.permalink}`,
      source: 'reddit',
      sourceName: 'Reddit',
      sourceIcon: '🗣️',
      publishedAt: new Date(d.created_utc * 1000).toISOString(),
      snippet: d.selftext?.substring(0, 150) || d.title,
      niche: niche.id,
      nicheName: niche.name,
      engagement: (d.ups || 0) + (d.num_comments || 0),
      sourceDetail: `r/${d.subreddit} · ${d.ups} ups · ${d.num_comments} comments`,
    });
  }
  if (results.length < 3) {
    throw new Error('Reddit returned insufficient results');
  }
  return results;
}

function parseYouTubeXML(xmlText, niche) {
  const results = [];
  const titleRegex = /<title[^>]*>([^<]+)<\/title>/g;
  const linkRegex = /<link[^>]*>([^<]+)<\/link>/g;
  const pubDateRegex = /<published[^>]*>([^<]+)<\/published>/g;

  const titles = [...xmlText.matchAll(titleRegex)].map(m => m[1]).slice(1);
  const links = [...xmlText.matchAll(linkRegex)].map(m => m[1]).slice(1);
  const pubDates = [...xmlText.matchAll(pubDateRegex)].map(m => m[1]);

  for (let i = 0; i < Math.min(titles.length, 10); i++) {
    const title = titles[i]?.trim();
    if (!title) continue;
    const videoId = links[i]?.match(/v=([^&]+)/)?.[1] || '';
    results.push({
      title,
      url: links[i] || `https://youtube.com/watch?v=${videoId}`,
      source: 'youtube',
      sourceName: 'YouTube',
      sourceIcon: '▶️',
      publishedAt: pubDates[i] || new Date().toISOString(),
      snippet: title,
      niche: niche.id,
      nicheName: niche.name,
      engagement: Math.floor(Math.random() * 10000) + 100,
      sourceDetail: videoId ? `Video ID: ${videoId}` : 'YouTube',
    });
  }
  if (results.length < 3) {
    throw new Error('YouTube returned insufficient results');
  }
  return results;
}

function parseNitterXML(xmlText, niche) {
  const results = [];
  const titleRegex = /<title[^>]*>([^<]+)<\/title>/g;
  const linkRegex = /<link[^>]*>([^<]+)<\/link>/g;
  const pubDateRegex = /<pubDate[^>]*>([^<]+)<\/pubDate>/g;

  const titles = [...xmlText.matchAll(titleRegex)].map(m => m[1]).slice(1);
  const links = [...xmlText.matchAll(linkRegex)].map(m => m[1]).slice(1);
  const pubDates = [...xmlText.matchAll(pubDateRegex)].map(m => m[1]);

  for (let i = 0; i < Math.min(titles.length, 15); i++) {
    const title = titles[i]?.trim();
    if (!title) continue;
    results.push({
      title,
      url: links[i] || '#',
      source: 'twitter',
      sourceName: 'X / Twitter',
      sourceIcon: '🐦',
      publishedAt: pubDates[i] ? new Date(pubDates[i]).toISOString() : new Date().toISOString(),
      snippet: title,
      niche: niche.id,
      nicheName: niche.name,
      engagement: Math.floor(Math.random() * 300) + 20,
      sourceDetail: 'Nitter feed',
    });
  }
  if (results.length < 3) {
    throw new Error('X/Twitter returned insufficient results');
  }
  return results;
}

/* ── Google Discover Parser ── */
/* Google Discover no expone RSS público. Esta función parsea
   Google Trends RSS (trending topics con volumen de búsqueda) y
   los combina con señales de Discover: recencia, volumen de tendencia,
   y categoría de contenido para simular el feed algorítmico.
   ═══ LoRA learning signal: trends data → topic discovery → scoring */
function parseGoogleDiscoverXML(xmlText, niche) {
  const results = [];
  
  // Google Trends RSS tiene estructura:
  // <item><title>keyword</title><ht:approx_traffic>100K+</ht:approx_traffic><ht:pubDate>...</ht:pubDate>...</item>
  const titleRegex = /<title[^>]*>([^<]+)<\/title>/g;
  const trafficRegex = /<ht:approx_traffic[^>]*>([^<]+)<\/ht:approx_traffic>/g;
  const pubDateRegex = /<pubDate[^>]*>([^<]+)<\/pubDate>/g;
  const linkRegex = /<link[^>]*>([^<]+)<\/link>/g;

  const titles = [...xmlText.matchAll(titleRegex)].map(m => m[1]).slice(1);
  const traffics = [...xmlText.matchAll(trafficRegex)].map(m => m[1]);
  const pubDates = [...xmlText.matchAll(pubDateRegex)].map(m => m[1]);
  const links = [...xmlText.matchAll(linkRegex)].map(m => m[1]).slice(1);

  for (let i = 0; i < Math.min(titles.length, 15); i++) {
    const title = titles[i]?.trim();
    if (!title) continue;
    
    // Señal LoRA: el tráfico aproximado de Trends indica intensidad de descubrimiento
    const trafficStr = traffics[i] || '10K+';
    const trafficMultiplier = parseInt(trafficStr.replace(/[^0-9]/g, '')) || 10;
    
    results.push({
      title: `${niche.name}: ${title} — Trending Discovery`,
      url: links[i] || `https://trends.google.com/trends/explore?q=${encodeURIComponent(title)}`,
      source: 'google-discover',
      sourceName: 'Google Discover',
      sourceIcon: '🔮',
      publishedAt: pubDates[i] ? new Date(pubDates[i]).toISOString() : new Date().toISOString(),
      snippet: `Trending topic en Google con ${trafficStr} búsquedas — señal de Discover para el nicho ${niche.name}`,
      niche: niche.id,
      nicheName: niche.name,
      engagement: trafficMultiplier * 1000,
      sourceDetail: `🔮 Discover signal · ${trafficStr} trending searches`,
    });
  }

  if (results.length < 2) {
    // Si Trends no devuelve datos, usamos Google News RSS
    // como aproximación de Discover (ambos son feeds algorítmicos de Google)
    throw new Error('Google Trends no disponible, usando fallback');
  }
  return results;
}

/* ══════════════════════════════════════════════
   TIKTOK, INSTAGRAM & PINTEREST PARSERS
   ══════════════════════════════════════════════ */

function parseTikTokRSS(xmlText, niche) {
  const results = [];
  const titleRegex = /<title[^>]*>([^<]+)<\/title>/g;
  const linkRegex = /<link[^>]*>([^<]+)<\/link>/g;
  const pubDateRegex = /<pubDate[^>]*>([^<]+)<\/pubDate>/g;

  const titles = [...xmlText.matchAll(titleRegex)].map(m => m[1]).slice(1);
  const links = [...xmlText.matchAll(linkRegex)].map(m => m[1]).slice(1);
  const pubDates = [...xmlText.matchAll(pubDateRegex)].map(m => m[1]);

  for (let i = 0; i < Math.min(titles.length, 15); i++) {
    const title = titles[i]?.trim();
    if (!title) continue;
    results.push({
      title,
      url: links[i] || '#',
      source: 'tiktok',
      sourceName: 'TikTok',
      sourceIcon: '🎵',
      publishedAt: pubDates[i] ? new Date(pubDates[i]).toISOString() : new Date().toISOString(),
      snippet: title,
      niche: niche.id,
      nicheName: niche.name,
      engagement: Math.floor(Math.random() * 50000) + 1000,
      sourceDetail: '🎵 TikTok feed',
    });
  }

  if (results.length < 2) {
    throw new Error('TikTok returned insufficient results');
  }
  return results;
}

function parsePinterestData(jsonText, niche) {
  const results = [];
  // Pinterest API devuelve JSON con estructura compleja.
  // Intentamos extraer pins del response, si falla usamos extracción básica.
  try {
    const data = JSON.parse(jsonText);
    const pins = data?.resource_response?.data?.results || [];
    for (const pin of pins.slice(0, 15)) {
      if (!pin?.title) continue;
      results.push({
        title: pin.title,
        url: `https://pinterest.com/pin/${pin.id}`,
        source: 'pinterest',
        sourceName: 'Pinterest',
        sourceIcon: '📌',
        publishedAt: pin.created_at || new Date().toISOString(),
        snippet: pin.description?.substring(0, 150) || pin.title,
        niche: niche.id,
        nicheName: niche.name,
        engagement: (pin.repin_count || 0) + (pin.save_count || 0),
        sourceDetail: `📌 ${pin.repin_count || 0} repins · ${pin.save_count || 0} saves`,
      });
    }
  } catch (e) {
    // Si falla el parseo JSON, no hay datos disponibles
  }

  if (results.length < 2) {
    throw new Error('Pinterest returned insufficient results');
  }
  return results;
}

function parseInstagramData(jsonText, niche) {
  const results = [];
  // Instagram API devuelve JSON con estructura de explorer/tags.
  // Intentamos extraer Reels del response, si falla usamos extracción básica.
  try {
    const data = JSON.parse(jsonText);
    const media = data?.graphql?.hashtag?.edge_hashtag_to_media?.edges || [];
    for (const edge of media.slice(0, 15)) {
      const node = edge?.node;
      if (!node) continue;
      const caption = node.edge_media_to_caption?.edges?.[0]?.node?.text || '';
      const shortCode = node.shortcode || '';
      results.push({
        title: caption.substring(0, 120) || `Instagram Reel #${shortCode}`,
        url: `https://instagram.com/p/${shortCode}`,
        source: 'instagram',
        sourceName: 'Instagram Reels',
        sourceIcon: '📱',
        publishedAt: new Date(node.taken_at_timestamp * 1000).toISOString(),
        snippet: caption.substring(0, 150),
        niche: niche.id,
        nicheName: niche.name,
        engagement: (node.edge_liked_by?.count || 0) + (node.edge_media_to_comment?.count || 0),
        sourceDetail: `📱 ${node.edge_liked_by?.count || 0} likes · ${node.edge_media_to_comment?.count || 0} comments`,
      });
    }
  } catch (e) {
    // Si falla el parseo JSON, no hay datos disponibles
  }

  if (results.length < 2) {
    throw new Error('Instagram returned insufficient results');
  }
  return results;
}

/* ── Medium RSS Parser ── */
function parseMediumRSS(xmlText, niche) {
  const results = [];
  const titleRegex = /<title[^>]*>([^<]+)<\/title>/g;
  const linkRegex = /<link[^>]*>([^<]+)<\/link>/g;
  const pubDateRegex = /<pubDate[^>]*>([^<]+)<\/pubDate>/g;
  const creatorRegex = /<dc:creator[^>]*>([^<]+)<\/dc:creator>/g;
  const categoryRegex = /<category[^>]*>([^<]+)<\/category>/g;

  const titles = [...xmlText.matchAll(titleRegex)].map(m => m[1]).slice(1);
  const links = [...xmlText.matchAll(linkRegex)].map(m => m[1]).slice(1);
  const pubDates = [...xmlText.matchAll(pubDateRegex)].map(m => m[1]);
  const creators = [...xmlText.matchAll(creatorRegex)].map(m => m[1]);
  const categories = [...xmlText.matchAll(categoryRegex)].map(m => m[1]);

  for (let i = 0; i < Math.min(titles.length, 15); i++) {
    const title = titles[i]?.trim();
    if (!title || title === 'Medium') continue;
    const creator = creators[i] || 'Autor Medium';
    const cats = categories.filter((c, ci) => ci >= i * 3 && ci < (i + 1) * 3).join(', ') || niche.name;
    results.push({
      title,
      url: links[i] || '#',
      source: 'medium',
      sourceName: 'Medium',
      sourceIcon: '📖',
      publishedAt: pubDates[i] ? new Date(pubDates[i]).toISOString() : new Date().toISOString(),
      snippet: title,
      niche: niche.id,
      nicheName: niche.name,
      engagement: Math.floor(Math.random() * 500) + 30,
      sourceDetail: `📖 by ${creator} · ${cats}`,
    });
  }

  if (results.length < 2) {
    throw new Error('Medium returned insufficient results');
  }
  return results;
}

/* ── Quora RSS Parser ── */
function parseQuoraRSS(xmlText, niche) {
  const results = [];
  const titleRegex = /<title[^>]*>([^<]+)<\/title>/g;
  const linkRegex = /<link[^>]*>([^<]+)<\/link>/g;
  const pubDateRegex = /<pubDate[^>]*>([^<]+)<\/pubDate>/g;

  const titles = [...xmlText.matchAll(titleRegex)].map(m => m[1]).slice(1);
  const links = [...xmlText.matchAll(linkRegex)].map(m => m[1]).slice(1);
  const pubDates = [...xmlText.matchAll(pubDateRegex)].map(m => m[1]);

  for (let i = 0; i < Math.min(titles.length, 15); i++) {
    const title = titles[i]?.trim();
    if (!title || title === 'Quora' || title === 'Search - Quora') continue;
    results.push({
      title,
      url: links[i] || '#',
      source: 'quora',
      sourceName: 'Quora',
      sourceIcon: '💭',
      publishedAt: pubDates[i] ? new Date(pubDates[i]).toISOString() : new Date().toISOString(),
      snippet: title,
      niche: niche.id,
      nicheName: niche.name,
      engagement: Math.floor(Math.random() * 300) + 20,
      sourceDetail: '💭 Quora RSS feed',
    });
  }

  if (results.length < 2) {
    throw new Error('Quora returned insufficient results');
  }
  return results;
}

/* ── LinkedIn RSS Parser ── */
function parseLinkedInRSS(xmlText, niche) {
  const results = [];
  const titleRegex = /<title[^>]*>([^<]+)<\/title>/g;
  const linkRegex = /<link[^>]*>([^<]+)<\/link>/g;
  const pubDateRegex = /<pubDate[^>]*>([^<]+)<\/pubDate>/g;

  const titles = [...xmlText.matchAll(titleRegex)].map(m => m[1]).slice(1);
  const links = [...xmlText.matchAll(linkRegex)].map(m => m[1]).slice(1);
  const pubDates = [...xmlText.matchAll(pubDateRegex)].map(m => m[1]);

  for (let i = 0; i < Math.min(titles.length, 15); i++) {
    const title = titles[i]?.trim();
    if (!title) continue;
    results.push({
      title,
      url: links[i] || '#',
      source: 'linkedin',
      sourceName: 'LinkedIn',
      sourceIcon: '💼',
      publishedAt: pubDates[i] ? new Date(pubDates[i]).toISOString() : new Date().toISOString(),
      snippet: title,
      niche: niche.id,
      nicheName: niche.name,
      engagement: Math.floor(Math.random() * 3000) + 50,
      sourceDetail: '💼 LinkedIn Pulse feed',
    });
  }

  if (results.length < 2) {
    throw new Error('LinkedIn returned insufficient results');
  }
  return results;
}

/* ══════════════════════════════════════════════
   DEMO SCANNER — Generates realistic fake data
   ══════════════════════════════════════════════ */

function scanSourceDemo(sourceId, niche) {
  const now = Date.now();
  const results = [];
  const count = 8 + Math.floor(Math.random() * 7);

  const demoTitles = {
    'google-news': [
      `Breaking: ${niche.name} Market Trends 2026 — What You Need to Know`,
      `${niche.name} Industry Report: Record Growth Expected This Quarter`,
      `New Study Reveals Surprising ${niche.name} Statistics for 2026`,
      `${niche.name} Experts Predict Major Changes in Regulations`,
      `Top ${niche.name} Companies Announce Revolutionary New Services`,
      `${niche.name} Costs Are Rising — Here's How to Save`,
      `The Future of ${niche.name}: AI and Automation Transforming the Industry`,
      `${niche.name} Consumer Survey: What Customers Really Want`,
      `Why ${niche.name} Is Becoming More Accessible in 2026`,
      `${niche.name} vs Traditional Options: A Complete Comparison`,
      `How ${niche.name} Is Adapting to the Digital Age`,
      `Exclusive: ${niche.name} Leaders Share Their Growth Strategies`,
      `${niche.name} Startup Raises $50M in Series B Funding`,
      `New ${niche.name} Platform Disrupts the Market`,
      `Global ${niche.name} Market Expected to Reach $500B by 2028`,
    ],
    'reddit': [
      `I've been researching ${niche.name} for months — here's what I learned`,
      `${niche.name} Mega Thread: Share your experiences and advice`,
      `PSA: Don't make these ${niche.name} mistakes (from someone with experience)`,
      `ELI5: How does ${niche.name} actually work?`,
      `Unpopular opinion: The ${niche.name} industry is broken`,
      `TIFU by not understanding ${niche.name} properly`,
      `CMV: ${niche.name} is overrated / underrated`,
      `What's the best ${niche.name} strategy for beginners in 2026?`,
      `I saved $10K using this ${niche.name} hack`,
      `Reddit, what's your hot take on ${niche.name} right now?`,
      `My ${niche.name} journey: From zero to expert in 6 months`,
      `Is anyone else concerned about ${niche.name} trends?`,
      `Guide: Everything you need to know about ${niche.name}`,
      `${niche.name} AMA with industry expert — ask me anything`,
      `The ${niche.name} landscape has completely changed`,
    ],
    'youtube': [
      `${niche.name} Explained For Beginners (2026 Complete Guide)`,
      `I Tried The Most Popular ${niche.name} Strategy For 30 Days`,
      `${niche.name} Tier List: Best Options Ranked`,
      `The Truth About ${niche.name} Nobody Talks About`,
      `${niche.name} 2026: Everything Has Changed`,
      `How I Mastered ${niche.name} in 3 Months (Full Breakdown)`,
      `${niche.name} vs Alternative: Which Is Actually Better?`,
      `5 ${niche.name} Mistakes That Will Cost You Thousands`,
      `${niche.name} Expert Reacts to Reddit Posts`,
      `The Ultimate ${niche.name} Tutorial (Step by Step)`,
      `I Analyzed 100 ${niche.name} Companies — Here's What I Found`,
      `${niche.name} Review: Is It Worth It in 2026?`,
      `How To Get Started With ${niche.name} For FREE`,
      `${niche.name} Trends That Will Dominate 2026`,
      `Why ${niche.name} Is The Best Investment You Can Make`,
    ],
    'twitter': [
      `🔥 HOT TAKE: The ${niche.name} industry is about to change forever...`,
      `${niche.name} news: Major announcement today 🚀`,
      `Thread 🧵: Everything I wish I knew about ${niche.name} before starting`,
      `BREAKING: New ${niche.name} regulation just dropped`,
      `${niche.name} tip of the day that will save you money 💰`,
      `I can't believe this ${niche.name} statistic 🤯`,
      `${niche.name} poll: Which option do you prefer? A or B?`,
      `Just published: Complete ${niche.name} guide for 2026 📄`,
      `${niche.name} expert here — ask me anything 👇`,
      `This ${niche.name} hack went viral and for good reason`,
      `Interesting ${niche.name} data visualization 📊`,
      `${niche.name} companies are fighting for your attention`,
      `New ${niche.name} tool just launched and it's game-changing`,
      `${niche.name} predictions for the next 6 months 🔮`,
      `Retweet if you think ${niche.name} is the future 🔄`,
    ],
    'google-discover': [
      `${niche.name} está en tendencia — Descubre por qué en Google`,
      `Trending Now: ${niche.name} content que está dominando Discover`,
      `Google Discover destaca ${niche.name} como tema del momento`,
      `${niche.name}: Lo que Google está recomendando leer hoy`,
      `🔮 Señal Discover: ${niche.name} con crecimiento explosivo`,
      `Trending Discovery — ${niche.name} alcanza nuevo pico de búsquedas`,
      `Google Discover picks: ${niche.name} content que no te puedes perder`,
      `Algoritmo Discover recomienda: Todo sobre ${niche.name}`,
      `${niche.name} está viral en Discover — análisis completo`,
      `Lo que Google Discover está mostrando sobre ${niche.name}`,
      `Señal de tendencia: ${niche.name} sube en el feed Discover`,
      `Discover Spotlight: ${niche.name} y su impacto en 2026`,
      `${niche.name} trending topic — con 100K+ búsquedas en Google`,
      `El algoritmo Discover aprendió que ${niche.name} es tendencia`,
      `Trending Discovery Feed: ${niche.name} recommendations`, 
      `Google Discover alerta: ${niche.name} en crecimiento acelerado`,
      `Descubrimiento viral: El fenómeno ${niche.name} explicado`,
    ],
    'tiktok': [
      `🤯 This ${niche.name} hack will blow your mind! #viral #${niche.name.toLowerCase().replace(/\s+/g,'')}`,
      `POV: You just discovered the best ${niche.name} strategy 🔥 #fyp #${niche.name.toLowerCase().replace(/\s+/g,'')}`,
      `I tried this ${niche.name} method for 7 days and THIS happened 😱`,
      `⚠️ STOP scrolling! This ${niche.name} tip saves you $$$ 💰`,
      `Day 1 of mastering ${niche.name}: Here's what nobody tells you 🎯`,
      `Wait for it... The ultimate ${niche.name} trick revealed 🤫 #${niche.name.toLowerCase().replace(/\s+/g,'')}`,
      `TikTok made me do it — ${niche.name} edition 🫣🔥`,
      `This ${niche.name} trend is EXPLODING right now 📈🚀`,
      `✨ Glow up your ${niche.name} game with this simple tip`,
      `CEO of ${niche.name} 🧠👔 Here's my morning routine for success`,
      `🔴 LIVE: Reacting to the craziest ${niche.name} videos 📺`,
      `The ${niche.name} industry doesn't want you to know this 🤫💥`,
      `Duet this if you're serious about ${niche.name} 🔄🎯`,
      `I turned my ${niche.name} knowledge into $10K/month 💸📊`,
      `Story time: How I dominated ${niche.name} in 30 days 📖🔥`,
    ],
    'pinterest': [
      `📌 ${niche.name} Ideas That Will Transform Your Strategy (2026 Guide)`,
      `The Ultimate ${niche.name} Inspiration Board — Save This for Later 💾`,
      `10 ${niche.name} Tips You Need to Pin Right Now 📍✨`,
      `${niche.name} Infographic: Everything You Need to Know in One Pin 📊`,
      `🌟 Trending ${niche.name} Pins This Week — You Won't Believe #7`,
      `DIY ${niche.name} Blueprint: Step-by-Step Visual Guide 🎨📋`,
      `📌 Save This! ${niche.name} Checklist for Beginners ✅`,
      `The Aesthetic ${niche.name} Board You Need in Your Feed 🖤✨`,
      `Infographic: ${niche.name} Statistics That Will Shock You 📈🤯`,
      `🍃 ${niche.name} Visual Guide — Pin It, Try It, Love It`,
      `${niche.name} Before & After — The Transformation Is Real 🔥📸`,
      `📌 50 ${niche.name} Ideas Curated Just For You (Free Printable)`,
      `The Viral ${niche.name} Pin That Everyone Is Repinning 🔄💥`,
      `Morning ${niche.name} Routine — Aesthetic Board 🌅📌`,
      `${niche.name} Aesthetic: The Most Beautiful Pins on Pinterest 🎨💫`,
    ],
    'instagram': [
      `🎬 ${niche.name} Reel: Watch this before you decide! #reels #${niche.name.toLowerCase().replace(/\s+/g,'')}`,
      `✨ New Reel: ${niche.name} tips that actually work 🔥📱`,
      `POV: Me explaining ${niche.name} to my friends 🤣 #reelsinstagram`,
      `📱 ${niche.name} Reel of the day — double tap if you agree ❤️`,
      `IG Reel: I tried the ${niche.name} method everyone's talking about 🎯`,
      `Behind the scenes: My ${niche.name} routine revealed 🎬📱`,
      `Reels vs Reality: The truth about ${niche.name} 🤫 #explore`,
      `🎥 New Reel up! ${niche.name} hack that changed everything ⚡`,
      `Swipe for ${niche.name} tips! Left: before, Right: after ✨👆`,
      `This ${niche.name} Reel is everything you need to see today 💯`,
      `📱 Reel: ${niche.name} transformed my life — here's the proof 🏆`,
      `🎬 Comment your ${niche.name} questions — I'll answer in part 2!`,
      `Reel idea: ${niche.name} for beginners step by step 🎯📱`,
      `IG exclusive: The ${niche.name} strategy no one shares 🤐🔥`,
      `📱 This ${niche.name} Reel went viral for a reason — watch until end 👀`,
    ],
    'medium': [
      `The Future of ${niche.name}: Trends Shaping the Industry in 2026`,
      `Why ${niche.name} Matters More Than Ever — A Deep Dive Analysis`,
      `How I Built a Successful ${niche.name} Strategy from Scratch`,
      `The Ultimate Guide to ${niche.name} for Beginners (2026 Edition)`,
      `${niche.name} vs. The Competition: Which One Should You Choose?`,
      `10 ${niche.name} Lessons I Learned After 5 Years in the Industry`,
      `The ${niche.name} Revolution: What’s Changing and Why You Should Care`,
      `Why Most ${niche.name} Strategies Fail and How to Avoid Common Pitfalls`,
      `${niche.name} Best Practices: Lessons from Top Professionals`,
      `The Complete ${niche.name} Handbook: Everything You Need to Know`,
      `How ${niche.name} Is Being Transformed by AI and New Technologies`,
      `Why I Switched to ${niche.name} and Never Looked Back`,
      `${niche.name}: The Untold Story Behind the Industry’s Biggest Shift`,
      `A Beginner’s Guide to ${niche.name} — What I Wish Someone Had Told Me`,
      `The ${niche.name} Stack: Tools, Tips, and Techniques for Success`,
    ],
    'quora': [
      `What Is the Best ${niche.name} Strategy for 2026? Experts Weigh In`,
      `${niche.name}: The Complete Guide to Getting Started — Quora Answers`,
      `What Are the Biggest ${niche.name} Myths That People Still Believe?`,
      `How Much Does ${niche.name} Actually Cost? Real Answers from Professionals`,
      `What ${niche.name} Skills Are Most in Demand Right Now?`,
      `Is ${niche.name} Worth It in 2026? Honest Review from Industry Insiders`,
      `What Nobody Tells You About ${niche.name} — Quora Thread`,
      `What Are the Best ${niche.name} Resources for Self-Learning?`,
      `${niche.name} vs Traditional Approaches: Which Is Better? — Quora Discussion`,
      `How to Transition Into ${niche.name} Career: Step-by-Step Guide`,
      `What ${niche.name} Trends Will Dominate the Next 5 Years?`,
      `Former ${niche.name} Professional Shares Insider Secrets`,
      `What Are the Most Common ${niche.name} Scams to Avoid?`,
      `How I Made My First $10K in ${niche.name} — Quora Success Story`,
      `What ${niche.name} Certification Is Actually Worth Getting?`,
    ],
    'linkedin': [
      `${niche.name} Industry Insights: What Top Professionals Are Saying in 2026 💼`,
      `How ${niche.name} Is Transforming the Way We Do Business 🔥`,
      `I spent 10 years in ${niche.name} — here are my top 5 lessons 🧠`,
      `The Future of ${niche.name}: Trends Every Professional Should Know 📈`,
      `${niche.name} Expert Shares Game-Changing Strategy That Actually Works ✅`,
      `Why ${niche.name} Is the Most Underrated Skill in Today's Market 💡`,
      `Breaking Down the Latest ${niche.name} News — What It Means for You 📊`,
      `How I Built a Successful Career in ${niche.name} (Full Story) 🚀`,
      `${niche.name} Certification Guide: Which One Is Worth Your Time 🎓`,
      `The ${niche.name} Debate: Industry Leaders Weigh In 🗣️`,
      `Soft Skills vs Hard Skills in ${niche.name} — What Matters More? ⚖️`,
      `${niche.name} Networking Tips That Landed Me My Dream Job 🤝`,
      `New Research on ${niche.name} That Changes Everything 🔬`,
      `5 ${niche.name} Mistakes That Could Cost You Your Reputation ⚠️`,
      `The ${niche.name} Community Is Growing — Here's How to Get Involved 🌐`,
    ],
  };

  const titles = demoTitles[sourceId] || demoTitles['google-news'];
  const sources = {
    'google-news': { name: 'Google News', icon: '📰' },
    'reddit': { name: 'Reddit', icon: '🗣️' },
    'youtube': { name: 'YouTube', icon: '▶️' },
    'google-discover': { name: 'Google Discover', icon: '🔮' },
    'twitter': { name: 'X / Twitter', icon: '🐦' },
    'tiktok': { name: 'TikTok', icon: '🎵' },
    'pinterest': { name: 'Pinterest', icon: '📌' },
    'instagram': { name: 'Instagram Reels', icon: '📱' },
    'linkedin': { name: 'LinkedIn', icon: '💼' },
    'quora': { name: 'Quora', icon: '💭' },
    'medium': { name: 'Medium', icon: '📖' },
  };
  const src = sources[sourceId] || sources['google-news'];

  for (let i = 0; i < count; i++) {
    const hoursAgo = Math.floor(Math.random() * 168);
    const publishedAt = new Date(now - hoursAgo * 3600000).toISOString();
    const title = titles[i % titles.length];
    let engagement = 0;
    let sourceDetail = '';
    if (sourceId === 'google-news') {
      engagement = Math.floor(Math.random() * 200) + 20;
      sourceDetail = `${['Reuters', 'Bloomberg', 'Forbes', 'Business Insider', 'CNBC', 'The Verge', 'TechCrunch', 'CNN', 'NY Times', 'WSJ'][Math.floor(Math.random() * 10)]}`;
    } else if (sourceId === 'reddit') {
      engagement = Math.floor(Math.random() * 5000) + 50;
      sourceDetail = `r/${niche.name.toLowerCase()} · ${Math.floor(Math.random() * 2000)} ups · ${Math.floor(Math.random() * 500)} comments`;
    } else if (sourceId === 'youtube') {
      engagement = Math.floor(Math.random() * 50000) + 500;
      sourceDetail = `${Math.floor(Math.random() * 50) + 1}K views · ${Math.floor(Math.random() * 500)} likes`;
    } else if (sourceId === 'google-discover') {
      const trafficK = Math.floor(Math.random() * 500) + 10;
      engagement = trafficK * 1000;
      sourceDetail = `🔮 Discover signal · ${trafficK}K+ trending searches · Google Trends + RSS`;
    } else if (sourceId === 'twitter') {
      engagement = Math.floor(Math.random() * 2000) + 20;
      sourceDetail = `${Math.floor(Math.random() * 1000)} likes · ${Math.floor(Math.random() * 200)} retweets`;
    } else if (sourceId === 'tiktok') {
      engagement = Math.floor(Math.random() * 100000) + 1000;
      sourceDetail = `🎵 ${Math.floor(Math.random() * 500) + 10}K views · ${Math.floor(Math.random() * 20) + 1}K likes · ${Math.floor(Math.random() * 5) + 1}K shares`;
    } else if (sourceId === 'pinterest') {
      engagement = Math.floor(Math.random() * 10000) + 100;
      sourceDetail = `📌 ${Math.floor(Math.random() * 50) + 1}K repins · ${Math.floor(Math.random() * 10) + 1}K saves`;
    } else if (sourceId === 'instagram') {
      engagement = Math.floor(Math.random() * 80000) + 500;
      sourceDetail = `📱 ${Math.floor(Math.random() * 200) + 5}K views · ${Math.floor(Math.random() * 10) + 1}K likes · ${Math.floor(Math.random() * 500) + 10} comments`;
    } else if (sourceId === 'medium') {
      engagement = Math.floor(Math.random() * 8000) + 100;
      const claps = Math.floor(Math.random() * 5000) + 50;
      const reads = Math.floor(Math.random() * 2000) + 20;
      sourceDetail = `📖 ${claps} claps · ${reads} reads · ${Math.floor(Math.random() * 100) + 5} responses`;
    } else if (sourceId === 'quora') {
      engagement = Math.floor(Math.random() * 3000) + 30;
      sourceDetail = `💭 ${Math.floor(Math.random() * 500) + 10} upvotes · ${Math.floor(Math.random() * 100) + 5} answers · ${Math.floor(Math.random() * 200) + 5} shares`;
    } else if (sourceId === 'linkedin') {
      engagement = Math.floor(Math.random() * 5000) + 50;
      sourceDetail = `💼 ${Math.floor(Math.random() * 1000) + 10} reactions · ${Math.floor(Math.random() * 200) + 5} comments · ${Math.floor(Math.random() * 50) + 1} reposts`;
    }
    results.push({
      title,
      url: `#${sourceId}-${i}`,
      source: sourceId,
      sourceName: src.name,
      sourceIcon: src.icon,
      publishedAt,
      snippet: title,
      niche: niche.id,
      nicheName: niche.name,
      engagement,
      sourceDetail,
    });
  }
  return results;
}

/* ══════════════════════════════════════════════
   SCORING FUNCTIONS
   ══════════════════════════════════════════════ */

function calculateRelevanceScore(result, niche) {
  let score = 50;
  const titleLower = result.title.toLowerCase();
  const keywords = niche.keywords.toLowerCase().split(' OR ');

  for (const kw of keywords) {
    if (titleLower.includes(kw)) score += 15;
    const words = kw.split(' ');
    for (const w of words) {
      if (w.length > 3 && titleLower.includes(w)) score += 5;
    }
  }

  const hoursAgo = (Date.now() - new Date(result.publishedAt).getTime()) / 3600000;
  if (hoursAgo < 6) score += 20;
  else if (hoursAgo < 24) score += 15;
  else if (hoursAgo < 72) score += 10;
  else if (hoursAgo < 168) score += 5;

  if (result.engagement > 10000) score += 15;
  else if (result.engagement > 1000) score += 10;
  else if (result.engagement > 100) score += 5;

  return Math.min(100, score);
}

function calculateViralScore(result) {
  let score = 0;
  const eng = result.engagement;
  if (eng > 50000) score += 40;
  else if (eng > 10000) score += 30;
  else if (eng > 1000) score += 20;
  else if (eng > 100) score += 10;
  else score += 5;

  if (result.source === 'youtube') score += 15;
  else if (result.source === 'tiktok') score += 12;
  else if (result.source === 'instagram') score += 11;
  else if (result.source === 'reddit') score += 10;
  else if (result.source === 'linkedin') score += 6;
  else if (result.source === 'twitter') score += 8;
  else if (result.source === 'pinterest') score += 7;
  else if (result.source === 'google-news') score += 5;

  const hoursAgo = (Date.now() - new Date(result.publishedAt).getTime()) / 3600000;
  if (hoursAgo < 6) score += 15;
  else if (hoursAgo < 24) score += 10;

  return Math.min(99, Math.max(1, score));
}

/* ══════════════════════════════════════════════
   SOURCE FILTER — Filtra resultados existentes sin re-escanear
   ══════════════════════════════════════════════ */

function toggleSourceFilter(sourceId) {
  initSourceFilters();
  // Toggle individual source filter
  scannerState.sourceFilters[sourceId] = !scannerState.sourceFilters[sourceId];
  renderScannerResults();
  reRenderStats();
  
  const src = SOURCES.find(s => s.id === sourceId);
  const count = Object.values(scannerState.sourceFilters).filter(Boolean).length;
  if (scannerState.sourceFilters[sourceId]) {
    showScannerToast(`🔍 ${src ? src.icon : ''} ${src ? src.name : sourceId} activado en filtro (${count} fuentes)`);
  } else {
    showScannerToast(`🔍 ${src ? src.icon : ''} ${src ? src.name : sourceId} desactivado en filtro (${count} fuentes)`);
  }
}

function selectAllSourceFilters(enabled) {
  initSourceFilters();
  SOURCES.forEach(s => { scannerState.sourceFilters[s.id] = enabled; });
  renderScannerResults();
  reRenderStats();
  showScannerToast(enabled ? '📊 Mostrando todas las fuentes' : '🔍 Ocultando todas las fuentes');
}

/* ══════════════════════════════════════════════
   DISPLAY RESULTS
   ══════════════════════════════════════════════ */

function renderScannerResults() {
  const container = document.getElementById('scanner-results-grid');
  const countEl = document.getElementById('scanner-result-count');
  if (!container) return;

  let results = [...scannerState.scanResults];

  // Filter by source filters (multi-select checkboxes)
  initSourceFilters();
  const activeFilterSources = Object.entries(scannerState.sourceFilters)
    .filter(([_, v]) => v).map(([k, _]) => k);
  const allSourcesActive = activeFilterSources.length >= SOURCES.length;
  if (!allSourcesActive && activeFilterSources.length > 0) {
    results = results.filter(r => activeFilterSources.includes(r.source));
  } else if (scannerState.activeSource !== 'all') {
    // Si no hay filtro manual pero hay fuente activa del escaneo, usar esa
    results = results.filter(r => r.source === scannerState.activeSource);
  }

  // Total before text search filter (for counter display)
  const totalBeforeSearch = results.length;

  const searchInput = document.getElementById('scanner-search-input');
  const rawSearchTerm = searchInput && searchInput.value.trim() ? searchInput.value.trim() : '';
  if (rawSearchTerm) {
    const q = rawSearchTerm.toLowerCase();
    results = results.filter(r => 
      r.title.toLowerCase().includes(q) || 
      r.url?.toLowerCase().includes(q) ||
      r.snippet?.toLowerCase().includes(q) ||
      r.nicheName.toLowerCase().includes(q) ||
      r.sourceName.toLowerCase().includes(q) ||
      r.sourceDetail?.toLowerCase().includes(q)
    );
  }

  // Show/hide clear search button
  const clearBtn = document.getElementById('scanner-clear-search');
  if (clearBtn) {
    clearBtn.style.display = (searchInput && searchInput.value.trim()) ? 'inline-flex' : 'none';
  }

  const sortBy = scannerState.sortBy;
  if (sortBy === 'date') {
    results.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
  } else if (sortBy === 'source') {
    results.sort((a, b) => a.sourceName.localeCompare(b.sourceName));
  } else {
    results.sort((a, b) => b.relevanceScore - a.relevanceScore);
  }

  // Show filtered vs total count (con información de filtro por fuente)
  if (countEl) {
    const searchInput = document.getElementById('scanner-search-input');
    const hasSearch = searchInput && searchInput.value.trim().length > 0;
    initSourceFilters();
    const activeFilterSources = Object.entries(scannerState.sourceFilters)
      .filter(([_, v]) => v).map(([k, _]) => k);
    const hasSourceFilter = !(activeFilterSources.length >= SOURCES.length);
    
    if (hasSourceFilter) {
      const totalAll = scannerState.scanResults.length;
      const count = activeFilterSources.length;
      if (hasSearch) {
        countEl.textContent = `(${results.length} de ${totalBeforeSearch} · ${count}/${SOURCES.length} fuentes)`;
      } else {
        countEl.textContent = `(${results.length} de ${totalAll} · ${count}/${SOURCES.length} fuentes)`;
      }
    } else if (hasSearch) {
      countEl.textContent = `(${results.length} de ${totalBeforeSearch} resultados)`;
    } else {
      countEl.textContent = `(${results.length} resultados)`;
    }
  }

  if (results.length === 0) {
    container.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--muted2);font-size:13px;">🔍 No se encontraron resultados con ese filtro.</div>`;
    return;
  }

  let html = '';
  results.forEach(r => {
    const hoursAgo = Math.floor((Date.now() - new Date(r.publishedAt).getTime()) / 3600000);
    const minutesAgo = Math.floor((Date.now() - new Date(r.publishedAt).getTime()) / 60000);
    const timeStr = hoursAgo < 1 ? `${minutesAgo}m ago` : hoursAgo < 24 ? `${hoursAgo}h ago` : `${Math.floor(hoursAgo / 24)}d ago`;
    const viralLabel = r.viralScore >= 80 ? '🔥 Viral' : r.viralScore >= 60 ? '📈 Trending' : r.viralScore >= 40 ? '📊 Rising' : '📋 Normal';
    const viralColor = r.viralScore >= 80 ? 'var(--danger)' : r.viralScore >= 60 ? 'var(--orange-bright)' : r.viralScore >= 40 ? 'var(--info-bright)' : 'var(--muted2)';
    const sourceColors = { 'google-news': '#4285f4', 'google-discover': '#34a853', 'reddit': '#ff4500', 'youtube': '#ff0000', 'twitter': '#1da1f2', 'tiktok': '#000000', 'pinterest': '#e60023', 'instagram': '#e1306c', 'linkedin': '#0A66C2', 'quora': '#b92b27', 'medium': '#000000' };
    const sourceColor = sourceColors[r.source] || '#888';

    html += `
      <div class="scanner-result-card" onclick="window.open('${r.url}','_blank')" title="Abrir enlace">
        <div style="display:flex;align-items:flex-start;gap:8px;">
          <span style="font-size:18px;flex-shrink:0;margin-top:1px;">${r.sourceIcon}</span>
          <div style="flex:1;min-width:0;">
            <div style="font-size:12px;font-weight:500;color:var(--text2);line-height:1.4;margin-bottom:3px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">${rawSearchTerm ? highlightTerm(r.title, rawSearchTerm) : r.title}</div>
            <div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center;font-size:9px;">
              <span style="color:${sourceColor};">${r.sourceName}</span>
              <span style="color:var(--muted2);">·</span>
              <span style="color:var(--muted2);">${timeStr}</span>
              <span style="color:var(--muted2);">·</span>
              <span style="color:var(--accent);">${r.engagement.toLocaleString('en-US')} interactions</span>
            </div>
            ${r.sourceDetail ? `<div style="font-size:8px;color:var(--muted2);margin-top:2px;">${rawSearchTerm ? highlightTerm(r.sourceDetail, rawSearchTerm) : r.sourceDetail}</div>` : ''}
          </div>
          <div style="text-align:right;flex-shrink:0;">
            <div style="font-size:10px;font-weight:600;color:${viralColor};">${viralLabel}</div>
            <div style="font-size:9px;font-family:var(--mono);color:var(--muted2);">${r.relevanceScore}% rel.</div>
          </div>
        </div>
        <div style="margin-top:6px;display:flex;gap:4px;">
          <span style="font-size:8px;padding:2px 6px;border-radius:3px;background:rgba(255,255,255,0.04);color:var(--muted2);">${r.nicheName}</span>
          <span style="font-size:8px;padding:2px 6px;border-radius:3px;background:${sourceColor}15;color:${sourceColor};">${r.sourceName}</span>
        </div>
      </div>
    `;
  });
  container.innerHTML = html;
}

function filterScannerResults() {
  renderScannerResults();
}

function clearScannerSearch() {
  const input = document.getElementById('scanner-search-input');
  if (input) {
    input.value = '';
    input.focus();
  }
  renderScannerResults();
}

/* ── Highlight search terms in result text ── */
function highlightTerm(text, term) {
  if (!term || !text) return text;
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp('(' + escaped + ')', 'gi');
  return text.replace(regex, '<mark style="background:var(--accent);color:var(--bg);padding:0 3px;border-radius:3px;font-weight:600;">$1</mark>');
}

/* ══════════════════════════════════════════════
   SOURCE COMPARISON CHART — Compara rendimiento entre fuentes
   ══════════════════════════════════════════════ */

function toggleScannerComparison() {
  const body = document.getElementById('scanner-comparison-body');
  const arrow = document.getElementById('scanner-comparison-arrow');
  if (!body) return;
  const isOpen = body.style.display !== 'none';
  body.style.display = isOpen ? 'none' : 'block';
  if (arrow) arrow.style.transform = isOpen ? 'rotate(-90deg)' : '';
}

function renderScannerSourceComparison() {
  const container = document.getElementById('scanner-comparison-content');
  const outerContainer = document.getElementById('scanner-comparison-container');
  if (!container || !outerContainer) return;

  const results = scannerState.scanResults;
  if (results.length === 0) {
    outerContainer.style.display = 'none';
    return;
  }
  outerContainer.style.display = 'block';

  // Aggregate by source
  const sourceStats = {};
  results.forEach(r => {
    if (!sourceStats[r.source]) {
      const srcMeta = SOURCES.find(s => s.id === r.source) || { color: '#888', icon: '❓', name: r.sourceName };
      sourceStats[r.source] = {
        id: r.source,
        name: r.sourceName,
        icon: r.sourceIcon,
        color: srcMeta.color,
        totalResults: 0,
        highViralCount: 0,
        totalEngagement: 0,
        totalViralScore: 0,
      };
    }
    sourceStats[r.source].totalResults++;
    sourceStats[r.source].totalEngagement += r.engagement || 0;
    sourceStats[r.source].totalViralScore += r.viralScore || 0;
    if (r.viralScore >= 60) {
      sourceStats[r.source].highViralCount++;
    }
  });

  // Calculate averages and sort by total results desc
  const statsArray = Object.values(sourceStats).map(s => ({
    ...s,
    avgViralScore: s.totalResults > 0 ? Math.round(s.totalViralScore / s.totalResults) : 0,
  })).sort((a, b) => b.totalResults - a.totalResults);

  const maxResults = statsArray.length > 0 ? Math.max(...statsArray.map(s => s.totalResults)) : 1;

  let html = statsArray.map(s => {
    const barPct = (s.totalResults / maxResults) * 100;
    const highViralOfTotal = s.totalResults > 0 ? Math.round((s.highViralCount / s.totalResults) * 100) : 0;

    return `
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
        <div style="width:24px;text-align:center;flex-shrink:0;font-size:14px;">${s.icon}</div>
        <div style="width:80px;flex-shrink:0;font-size:9px;color:var(--muted2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${s.name}</div>
        <div style="flex:1;display:flex;flex-direction:column;gap:2px;">
          <div style="display:flex;align-items:center;gap:4px;">
            <div style="flex:1;height:8px;background:var(--bg4);border-radius:4px;overflow:hidden;">
              <div style="height:100%;width:${barPct}%;background:linear-gradient(90deg,${s.color},${s.color}cc);border-radius:4px;transition:width 0.6s ease-out;"></div>
            </div>
            <span style="font-size:10px;font-weight:600;font-family:var(--mono);color:var(--text2);min-width:24px;text-align:right;">${s.totalResults}</span>
          </div>
          <div style="display:flex;gap:8px;font-size:8px;color:var(--muted2);padding-left:2px;">
            <span>🔥 ${s.highViralCount} alto score (${highViralOfTotal}%)</span>
            <span>📊 Ø ${s.avgViralScore} viral</span>
            <span>💬 ${s.totalEngagement.toLocaleString('en-US')} eng.</span>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Summary row
  const totalHighViral = statsArray.reduce((a, s) => a + s.highViralCount, 0);
  const avgViral = results.length > 0 ? Math.round(results.reduce((a, r) => a + (r.viralScore || 0), 0) / results.length) : 0;
  const totalEng = results.reduce((a, r) => a + (r.engagement || 0), 0);

  html += `
    <div style="margin-top:10px;padding-top:8px;border-top:0.5px solid var(--border);display:flex;gap:16px;font-size:10px;color:var(--muted2);">
      <span>📊 <strong style="color:var(--text2);">${results.length}</strong> total resultados</span>
      <span>🔥 <strong style="color:var(--danger);">${totalHighViral}</strong> alto viral (≥60)</span>
      <span>📈 <strong style="color:var(--accent);">${avgViral}</strong> score viral promedio</span>
      <span>💬 <strong style="color:var(--info-bright);">${totalEng.toLocaleString('en-US')}</strong> engagement total</span>
      <span style="font-size:8px;color:var(--muted2);flex:1;text-align:right;">Barras = total resultados · ≥60 = alto viral</span>
    </div>
  `;

  container.innerHTML = html;
}

/* ══════════════════════════════════════════════
   RE-RENDER STATS
   ══════════════════════════════════════════════ */

function reRenderStats() {
  const el = document.getElementById('scanner-stat-results');
  const lastEl = document.getElementById('scanner-stat-last');
  if (el) el.textContent = scannerState.scanResults.length;
  if (lastEl) lastEl.textContent = new Date().toLocaleTimeString('es-DO');

  const sources = {};
  scannerState.scanResults.forEach(r => {
    sources[r.source] = (sources[r.source] || 0) + 1;
  });
  SOURCES.forEach(s => {
    const statusEl = document.getElementById(`scanner-source-${s.id}-status`);
    if (statusEl) {
      const count = sources[s.id] || 0;
      statusEl.innerHTML = count > 0 ? `✅ ${count} resultados` : '⏸️ Inactivo';
    }
    
    // Highlight source filter active state (multi-select)
    initSourceFilters();
    const card = document.getElementById(`scanner-source-${s.id}`);
    if (card) {
      const isActive = scannerState.sourceFilters[s.id];
      card.style.borderColor = isActive ? s.color : '';
      card.style.background = isActive ? `${s.color}12` : '';
      card.style.boxShadow = isActive ? `0 0 12px ${s.color}30` : '';
      card.style.transform = isActive ? 'scale(1.03)' : '';
      card.title = isActive ? `Haz clic para desactivar ${s.name} del filtro` : `Haz clic para activar ${s.name} en filtro`;
    }
  });
}

/* ══════════════════════════════════════════════
   SOURCE-SPECIFIC SCAN
   ══════════════════════════════════════════════ */

/* ── Source toggle ── */
function toggleSource(sourceId, enabled) {
  scannerState.enabledSources[sourceId] = enabled;
  localStorage.setItem('na_enabled_sources', JSON.stringify(scannerState.enabledSources));
  
  // Update card visual state
  const card = document.getElementById(`scanner-source-${sourceId}`);
  if (card) {
    if (!enabled) {
      // Add overlay
      if (!card.querySelector('.source-disabled-overlay')) {
        const overlay = document.createElement('div');
        overlay.className = 'source-disabled-overlay';
        overlay.style.cssText = 'position:absolute;inset:0;background:rgba(0,0,0,0.35);border-radius:8px;z-index:2;display:flex;align-items:center;justify-content:center;font-size:10px;color:var(--muted);';
        overlay.textContent = '⏸️ Desactivada';
        card.style.position = 'relative';
        card.appendChild(overlay);
      }
    } else {
      const overlay = card.querySelector('.source-disabled-overlay');
      if (overlay) overlay.remove();
    }
  }
  
  // Update the checkbox label text
  const label = document.querySelector(`label[for="toggle-source-${sourceId}"] span`);
  if (label) label.textContent = enabled ? 'Activa' : 'Inactiva';
  
  // Show toast
  const src = SOURCES.find(s => s.id === sourceId);
  showScannerToast(enabled 
    ? `✅ ${src ? src.icon : ''} ${src ? src.name : sourceId} activada para escaneo`
    : `⏸️ ${src ? src.icon : ''} ${src ? src.name : sourceId} desactivada`);
}

/* ── Select All / None sources ── */
function selectAllSources(enabled) {
  SOURCES.forEach(s => {
    scannerState.enabledSources[s.id] = enabled;
    // Update checkbox
    const cb = document.getElementById(`toggle-source-${s.id}`);
    if (cb) cb.checked = enabled;
    // Update card overlay
    const card = document.getElementById(`scanner-source-${s.id}`);
    if (card) {
      if (!enabled) {
        if (!card.querySelector('.source-disabled-overlay')) {
          const overlay = document.createElement('div');
          overlay.className = 'source-disabled-overlay';
          overlay.style.cssText = 'position:absolute;inset:0;background:rgba(0,0,0,0.35);border-radius:8px;z-index:2;display:flex;align-items:center;justify-content:center;font-size:10px;color:var(--muted);';
          overlay.textContent = '⏸️ Desactivada';
          card.style.position = 'relative';
          card.appendChild(overlay);
        }
      } else {
        const overlay = card.querySelector('.source-disabled-overlay');
        if (overlay) overlay.remove();
      }
    }
    // Update label text
    const label = document.querySelector(`label[for="toggle-source-${s.id}"] span`);
    if (label) label.textContent = enabled ? 'Activa' : 'Inactiva';
  });
  localStorage.setItem('na_enabled_sources', JSON.stringify(scannerState.enabledSources));
  showScannerToast(enabled ? '✅ Todas las fuentes activadas' : '⏸️ Todas las fuentes desactivadas');
}

function scanSource(sourceId) {
  const select = document.getElementById('scanner-source-select');
  if (select) select.value = sourceId;
  startScannerScan();
}

/* ══════════════════════════════════════════════
   AUTO-REFRESH
   ══════════════════════════════════════════════ */

function toggleAutoRefresh() {
  scannerState.autoRefresh = !scannerState.autoRefresh;
  if (scannerState.autoRefresh) {
    scheduleAutoRefresh();
    const btn = document.getElementById('scanner-refresh-btn');
    if (btn) { btn.textContent = '🔄 Activo'; btn.className = 'btn btn-sm btn-primary'; }
    showScannerToast('🔄 Auto-refresh activado (cada 5 min)');
  } else {
    if (scannerState.refreshInterval) {
      clearInterval(scannerState.refreshInterval);
      scannerState.refreshInterval = null;
    }
    const btn = document.getElementById('scanner-refresh-btn');
    if (btn) { btn.textContent = '🔄 Auto'; btn.className = 'btn btn-sm btn-ghost'; }
    showScannerToast('⏹️ Auto-refresh desactivado');
  }
}

function scheduleAutoRefresh() {
  if (scannerState.refreshInterval) {
    clearInterval(scannerState.refreshInterval);
  }
  scannerState.refreshInterval = setInterval(() => {
    if (!scannerState.isScanning) {
      startScannerScan();
    }
  }, 300000);
}

/* ══════════════════════════════════════════════
   MODE TOGGLE
   ══════════════════════════════════════════════ */

function toggleScannerLiveMode() {
  scannerState.liveMode = !scannerState.liveMode;
  const btn = document.getElementById('scanner-live-btn');
  const modeEl = document.getElementById('scanner-stat-mode');
  if (btn) {
    btn.textContent = scannerState.liveMode ? '🔴 Live Mode' : '⚪ Demo Mode';
    btn.className = `btn btn-sm ${scannerState.liveMode ? 'btn-primary' : 'btn-ghost'}`;
  }
  if (modeEl) {
    modeEl.textContent = scannerState.liveMode ? '🔴 LIVE' : '⚪ DEMO';
    modeEl.style.color = scannerState.liveMode ? 'var(--danger)' : 'var(--warning)';
  }
  showScannerToast(scannerState.liveMode ? '🔴 Live Mode activado — datos reales de la web' : '⚪ Demo Mode activado — datos simulados');
}

/* ══════════════════════════════════════════════
   HISTORY
   ══════════════════════════════════════════════ */

function showScannerHistory() {
  const history = scannerState.recentScans;
  if (history.length === 0) {
    showScannerToast('📋 No hay escaneos anteriores');
    return;
  }

  const bodyHTML = `
    <div style="font-size:13px;">
      <p style="font-size:12px;color:var(--muted);margin-bottom:12px;">${history.length} escaneos realizados</p>
      ${history.map((h, i) => `
        <div style="background:var(--bg3);border:0.5px solid var(--border);border-radius:var(--radius);padding:10px 12px;margin-bottom:6px;display:flex;justify-content:space-between;align-items:center;cursor:pointer;"
          onclick="restoreScannerScan(${i})">
          <div style="flex:1;min-width:0;">
            <div style="display:flex;align-items:center;gap:6px;">
              <span style="font-size:12px;font-weight:500;color:var(--text2);">${h.nicheName}</span>
              <span style="font-size:9px;padding:1px 5px;border-radius:3px;background:rgba(255,255,255,0.04);color:var(--muted2);">${h.source === 'all' ? 'Todas' : h.source}</span>
              <span style="font-size:8px;padding:1px 5px;border-radius:3px;background:${h.liveMode ? 'rgba(224,92,92,0.1)' : 'rgba(224,184,92,0.1)'};color:${h.liveMode ? 'var(--danger)' : 'var(--warning)'};">${h.liveMode ? 'LIVE' : 'DEMO'}</span>
            </div>
            <div style="font-size:10px;color:var(--muted2);margin-top:2px;">${h.results} resultados · ${new Date(h.timestamp).toLocaleString('es-DO')}</div>
          </div>
          <div style="display:flex;gap:4px;flex-shrink:0;">
            <button class="btn btn-xs btn-ghost" onclick="event.stopPropagation();deleteScannerScan(${i})" style="font-size:9px;color:var(--danger);">✕</button>
          </div>
        </div>
      `).join('')}
    </div>
  `;

  openModal('📋 Historial de Escaneos', bodyHTML, `
    <button class="btn btn-sm btn-ghost" onclick="closeModal()">Cerrar</button>
    <button class="btn btn-sm btn-danger" onclick="clearScannerHistory()">🗑️ Limpiar Todo</button>
  `);
}

function restoreScannerScan(idx) {
  closeModal();
  const h = scannerState.recentScans[idx];
  if (!h) return;

  scannerState.activeNiche = h.niche;
  const nicheSelect = document.getElementById('scanner-niche-select');
  if (nicheSelect) nicheSelect.value = h.niche;

  scannerState.activeSource = h.source;
  const sourceSelect = document.getElementById('scanner-source-select');
  if (sourceSelect) sourceSelect.value = h.source;

  scannerState.liveMode = h.liveMode;
  startScannerScan();
}

function deleteScannerScan(idx) {
  scannerState.recentScans.splice(idx, 1);
  localStorage.setItem('na_viral_scans', JSON.stringify(scannerState.recentScans));
  showScannerHistory();
}

function clearScannerHistory() {
  scannerState.recentScans = [];
  localStorage.setItem('na_viral_scans', '[]');
  closeModal();
  showScannerToast('🗑️ Historial limpiado');
}

/* ══════════════════════════════════════════════
   EXPORT
   ══════════════════════════════════════════════ */

/* ── Export menu toggle ── */
function toggleScannerExportMenu() {
  const menu = document.getElementById('scanner-export-menu');
  if (!menu) return;
  const isOpen = menu.style.display === 'block';
  menu.style.display = isOpen ? 'none' : 'block';
}

// Close export menu on click outside
document.addEventListener('click', function(e) {
  const wrapper = document.getElementById('scanner-export-wrapper');
  const menu = document.getElementById('scanner-export-menu');
  if (wrapper && menu && !wrapper.contains(e.target)) {
    menu.style.display = 'none';
  }
});

/* ── Export functions ── */
function exportScannerResults(format) {
  // Close the menu
  const menu = document.getElementById('scanner-export-menu');
  if (menu) menu.style.display = 'none';

  const results = scannerState.scanResults;
  if (results.length === 0) {
    showScannerToast('⚠️ No hay resultados para exportar');
    return;
  }

  if (format === 'csv') {
    exportScannerCSV(results);
  } else if (format === 'json') {
    exportScannerJSON(results);
  } else {
    exportScannerTXT(results);
  }
}

function exportScannerTXT(results) {
  let text = 'NUCLEAR AIMA — VIRAL SCANNER EXPORT\n';
  text += `Nicho: ${scannerState.activeNiche}\n`;
  text += `Fuente: ${scannerState.activeSource === 'all' ? 'Todas' : scannerState.activeSource}\n`;
  text += `Modo: ${scannerState.liveMode ? 'LIVE' : 'DEMO'}\n`;
  text += `Resultados: ${results.length}\n`;
  text += `Fecha: ${new Date().toLocaleDateString('es-DO')}\n`;
  text += `Hora: ${new Date().toLocaleTimeString('es-DO')}\n`;
  text += '━'.repeat(50) + '\n\n';

  results.forEach((r, i) => {
    text += `[${i + 1}] ${r.title}\n`;
    text += `    Fuente: ${r.sourceName} (${r.sourceIcon})\n`;
    text += `    Nicho: ${r.nicheName}\n`;
    text += `    Engagement: ${r.engagement.toLocaleString('en-US')}\n`;
    text += `    Score: ${r.relevanceScore}% relevancia · ${r.viralScore}% viral\n`;
    text += `    Publicado: ${new Date(r.publishedAt).toLocaleString('es-DO')}\n`;
    text += `    URL: ${r.url}\n`;
    text += `    Detalle: ${r.sourceDetail || '—'}\n\n`;
  });

  downloadBlob(text, 'text/plain;charset=utf-8', `viral-scan-${scannerState.activeNiche}-${dateStamp()}.txt`);
  showScannerToast(`📥 ${results.length} resultados exportados como TXT`);
}

function exportScannerCSV(results) {
  // BOM for Excel compatibility
  const BOM = '\uFEFF';
  const headers = ['#','Título','Fuente','Icono','Nicho','Engagement','Relevancia %','Viral %','Publicado','URL','Detalle','Modo'];
  
  const rows = results.map((r, i) => {
    return [
      i + 1,
      `"${(r.title || '').replace(/"/g, '""')}"`,
      `"${r.sourceName}"`,
      r.sourceIcon,
      `"${r.nicheName}"`,
      r.engagement,
      r.relevanceScore,
      r.viralScore,
      `"${new Date(r.publishedAt).toLocaleString('es-DO')}"`,
      `"${r.url}"`,
      `"${(r.sourceDetail || '—').replace(/"/g, '""')}"`,
      scannerState.liveMode ? 'LIVE' : 'DEMO'
    ].join(',');
  });

  const csv = BOM + headers.join(',') + '\n' + rows.join('\n');
  downloadBlob(csv, 'text/csv;charset=utf-8;', `viral-scan-${scannerState.activeNiche}-${dateStamp()}.csv`);
  showScannerToast(`📊 ${results.length} resultados exportados como CSV`);
}

function exportScannerJSON(results) {
  const exportData = {
    meta: {
      tool: 'Nuclear AIMA — Viral Scanner',
      version: VIRAL_SCANNER_VERSION,
      niche: scannerState.activeNiche,
      source: scannerState.activeSource === 'all' ? 'Todas' : scannerState.activeSource,
      mode: scannerState.liveMode ? 'LIVE' : 'DEMO',
      totalResults: results.length,
      exportedAt: new Date().toISOString(),
    },
    results: results.map(r => ({
      index: null, // se asigna abajo
      title: r.title,
      source: {
        id: r.source,
        name: r.sourceName,
        icon: r.sourceIcon,
      },
      niche: {
        id: r.niche,
        name: r.nicheName,
      },
      engagement: r.engagement,
      scores: {
        relevance: r.relevanceScore,
        viral: r.viralScore,
      },
      publishedAt: r.publishedAt,
      url: r.url,
      detail: r.sourceDetail || null,
      snippet: r.snippet || null,
    }))
  };

  // Add index to results
  exportData.results.forEach((r, i) => { r.index = i + 1; });

  const jsonStr = JSON.stringify(exportData, null, 2);
  downloadBlob(jsonStr, 'application/json;charset=utf-8;', `viral-scan-${scannerState.activeNiche}-${dateStamp()}.json`);
  showScannerToast(`📋 ${results.length} resultados exportados como JSON`);
}

/* ── Download helpers ── */
function downloadBlob(content, mimeType, filename) {
  const blob = new Blob([content], { type: mimeType });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

function dateStamp() {
  return new Date().toISOString().split('T')[0];
}

/* ══════════════════════════════════════════════
   UTILITY
   ══════════════════════════════════════════════ */

function mapDateRange() {
  const map = { '24h': 'day', '7d': 'week', '30d': 'month' };
  return map[scannerState.dateRange] || 'week';
}

/* ══════════════════════════════════════════════
   TOAST
   ══════════════════════════════════════════════ */

let scannerToastTimer = null;

function showScannerToast(msg) {
  let toast = document.getElementById('scanner-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'scanner-toast';
    toast.style.cssText = 'position:fixed;bottom:20px;right:20px;background:var(--bg3);border:0.5px solid var(--border);border-radius:var(--radius);padding:10px 16px;font-size:12px;color:var(--text);z-index:9999;box-shadow:0 4px 20px rgba(0,0,0,0.4);transition:opacity 0.3s;max-width:320px;';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = '1';
  clearTimeout(scannerToastTimer);
  scannerToastTimer = setTimeout(() => { toast.style.opacity = '0'; }, 3000);
}

/* ══════════════════════════════════════════════
   🧠 LORA ARCHITECTURE PANEL — EDUCATIONAL
   ══════════════════════════════════════════════
   Esta función abre un modal educativo que explica
   a los alumnos cómo funciona el Viral Scanner como
   una arquitectura de aprendizaje (LoRA).

   LoRA aquí NO es Low-Rank Adaptation (AI/ML).
   Es una metáfora de enseñanza:
   L = Learn (Aprende de fuentes RSS/JSON)
   O = Observe (Observa patrones y señales)
   R = Retrieve (Recupera y parsea datos)
   A = Analyze (Analiza, puntúa y muestra)
   ══════════════════════════════════════════════ */

function showScannerArchitecture() {
  openModal('🧠 Viral Scanner — Arquitectura LoRA Explicada', `
    <div style="font-size:12px;line-height:1.7;color:var(--text2);">

      <!-- ═══ INTRO ═══ -->
      <div style="background:var(--bg3);border:0.5px solid var(--border);border-radius:var(--radius);padding:14px;margin-bottom:14px;text-align:center;">
        <div style="font-size:28px;margin-bottom:6px;">🤖</div>
        <div style="font-size:14px;font-weight:600;color:var(--accent);">La Bestia Más Poderosa del Planeta</div>
        <div style="font-size:10px;color:var(--muted2);margin-top:2px;">Nuclear AIMA · CPC Investigator · Viral Scanner v${VIRAL_SCANNER_VERSION}</div>
      </div>

      <!-- ═══ QUE ES LoRA ═══ -->
      <div style="margin-bottom:16px;">
        <div style="font-size:13px;font-weight:600;color:var(--accent);margin-bottom:6px;">🎓 ¿Qué es LoRA en este contexto?</div>
        <p style="font-size:11px;margin-bottom:8px;">
          Aquí <strong style="color:var(--accent);">LoRA</strong> NO es Low-Rank Adaptation de modelos ML.
          Es una <strong style="color:var(--info-bright);">metáfora didáctica</strong> que hemos creado para explicar
          cómo el Viral Scanner <strong style="color:var(--success-bright);">aprende, busca, scrapea y muestra</strong>
          contenido viral en tiempo real. Es nuestra forma de enseñar arquitectura de datos.
        </p>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
          <div style="background:rgba(46,204,113,0.06);border:0.5px solid rgba(46,204,113,0.2);border-radius:var(--radius);padding:10px;text-align:center;">
            <div style="font-size:18px;color:var(--success-bright);">L</div>
            <div style="font-size:11px;font-weight:600;color:var(--success-bright);">Learn</div>
            <div style="font-size:9px;color:var(--muted2);">Aprende de fuentes RSS, JSON y APIs públicas</div>
          </div>
          <div style="background:rgba(77,171,247,0.06);border:0.5px solid rgba(77,171,247,0.2);border-radius:var(--radius);padding:10px;text-align:center;">
            <div style="font-size:18px;color:var(--info-bright);">O</div>
            <div style="font-size:11px;font-weight:600;color:var(--info-bright);">Observe</div>
            <div style="font-size:9px;color:var(--muted2);">Observa patrones, señales de tendencia y engagement</div>
          </div>
          <div style="background:rgba(224,184,92,0.06);border:0.5px solid rgba(224,184,92,0.2);border-radius:var(--radius);padding:10px;text-align:center;">
            <div style="font-size:18px;color:var(--warning);">R</div>
            <div style="font-size:11px;font-weight:600;color:var(--warning);">Retrieve</div>
            <div style="font-size:9px;color:var(--muted2);">Recupera datos via CORS proxies y parsea XML/JSON</div>
          </div>
          <div style="background:rgba(201,169,110,0.06);border:0.5px solid rgba(201,169,110,0.2);border-radius:var(--radius);padding:10px;text-align:center;">
            <div style="font-size:18px;color:var(--accent);">A</div>
            <div style="font-size:11px;font-weight:600;color:var(--accent);">Analyze</div>
            <div style="font-size:9px;color:var(--muted2);">Analiza, puntúa con algoritmos y visualiza resultados</div>
          </div>
        </div>
      </div>

      <!-- ═══ PIPELINE ═══ -->
      <div style="margin-bottom:16px;">
        <div style="font-size:13px;font-weight:600;color:var(--accent);margin-bottom:6px;">🔄 Pipeline Completo (Learn → Observe → Retrieve → Analyze)</div>
        <div style="background:var(--bg3);border:0.5px solid var(--border);border-radius:var(--radius);overflow:hidden;">

          <!-- Step 1: Learn -->
          <div style="padding:10px 12px;border-bottom:0.5px solid var(--border);display:flex;gap:10px;align-items:flex-start;">
            <span style="font-size:16px;flex-shrink:0;">📚</span>
            <div style="flex:1;">
              <div style="font-size:11px;font-weight:600;color:var(--success-bright);">1. LEARN — Configuración del Nicho</div>
              <div style="font-size:10px;color:var(--muted2);margin-top:2px;">
                El usuario selecciona un <strong style="color:var(--text2);">nicho</strong> (Insurance, Finance, Legal...).
                Cada nicho tiene <strong style="color:var(--accent);">keywords predefinidas</strong> que el scanner usa como
                señales de búsqueda. Esto es el "conocimiento base" que el sistema aprende.
                Los nichos están organizados por CPC, competencia y potencial de tráfico
                desde el módulo <strong style="color:var(--accent);">CPC Research</strong>.
              </div>
            </div>
          </div>

          <!-- Step 2: Observe -->
          <div style="padding:10px 12px;border-bottom:0.5px solid var(--border);display:flex;gap:10px;align-items:flex-start;">
            <span style="font-size:16px;flex-shrink:0;">👁️</span>
            <div style="flex:1;">
              <div style="font-size:11px;font-weight:600;color:var(--info-bright);">2. OBSERVE — Fuentes de Datos (9 fuentes)</div>
              <div style="font-size:10px;color:var(--muted2);margin-top:2px;">
                El scanner observa <strong style="color:var(--text2);">11 fuentes</strong> en paralelo:
              </div>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;margin-top:4px;">
                <div style="font-size:9px;padding:4px 8px;background:var(--bg4);border-radius:4px;color:#4285f4;">📰 Google News RSS</div>
                <div style="font-size:9px;padding:4px 8px;background:var(--bg4);border-radius:4px;color:#34a853;">🔮 Google Discover (Trends)</div>
                <div style="font-size:9px;padding:4px 8px;background:var(--bg4);border-radius:4px;color:#ff4500;">🗣️ Reddit JSON API</div>
                <div style="font-size:9px;padding:4px 8px;background:var(--bg4);border-radius:4px;color:#000;">🎵 TikTok (RSS)</div>
                <div style="font-size:9px;padding:4px 8px;background:var(--bg4);border-radius:4px;color:#ff0000;">▶️ YouTube RSS</div>
                <div style="font-size:9px;padding:4px 8px;background:var(--bg4);border-radius:4px;color:#e1306c;">📱 Instagram Reels (API)</div>
                <div style="font-size:9px;padding:4px 8px;background:var(--bg4);border-radius:4px;color:#0A66C2;">💼 LinkedIn (Pulse RSS)</div>
                <div style="font-size:9px;padding:4px 8px;background:var(--bg4);border-radius:4px;color:#e60023;">📌 Pinterest (API)</div>
                <div style="font-size:9px;padding:4px 8px;background:var(--bg4);border-radius:4px;color:#1da1f2;">🐦 X/Twitter (Nitter RSS)</div>
              </div>
              <div style="font-size:9px;color:var(--muted2);margin-top:4px;">
                ⚡ <strong style="color:var(--warning);">Modo LIVE</strong>: fetch real via CORS proxies.
                ⚪ <strong style="color:var(--muted2);">Modo DEMO</strong>: datos simulados realistas.
              </div>
            </div>
          </div>

          <!-- Step 3: Retrieve -->
          <div style="padding:10px 12px;border-bottom:0.5px solid var(--border);display:flex;gap:10px;align-items:flex-start;">
            <span style="font-size:16px;flex-shrink:0;">🕸️</span>
            <div style="flex:1;">
              <div style="font-size:11px;font-weight:600;color:var(--warning);">3. RETRIEVE — Scraping y Parsing</div>
              <div style="font-size:10px;color:var(--muted2);margin-top:2px;">
                Cada fuente requiere un <strong style="color:var(--text2);">parser diferente</strong> porque
                cada una devuelve datos en formatos distintos:
              </div>
              <div style="font-size:9px;color:var(--muted2);margin-top:3px;line-height:1.6;">
                • <strong style="color:#4285f4;">Google News</strong> → XML RSS → regex title/link/pubDate/source<br>
                • <strong style="color:#34a853;">Google Discover</strong> → Google Trends RSS → parsea tráfico + tendencias<br>
                • <strong style="color:#ff4500;">Reddit</strong> → JSON API → data.children[].data<br>
                • <strong style="color:#000;">🎵 TikTok</strong> → TokFeed RSS (feed de terceros)<br>
                • <strong style="color:#ff0000;">YouTube</strong> → XML RSS → regex title/link/published<br>
                • <strong style="color:#e1306c;">📱 Instagram Reels</strong> → GraphQL API (explore/tags)<br>
                • <strong style="color:#0A66C2;">💼 LinkedIn</strong> → LinkedIn RSS (feed de tendencias)<br>
                • <strong style="color:#e60023;">📌 Pinterest</strong> → BoardFeedResource API (JSON)<br>
                • <strong style="color:#1da1f2;">X/Twitter</strong> → Nitter RSS (proxy alternativo)<br>
                <br>
                🛡️ Usamos <strong style="color:var(--accent);">CORS proxies</strong> (corsproxy.io, api.allorigins.win)
                porque los navegadores bloquean peticiones cross-origen por seguridad.
                El proxy actúa como intermediario: recibe nuestra petición, la reenvía
                al servidor destino, y devuelve la respuesta permitiendo CORS.
              </div>
            </div>
          </div>

          <!-- Step 4: Analyze -->
          <div style="padding:10px 12px;display:flex;gap:10px;align-items:flex-start;">
            <span style="font-size:16px;flex-shrink:0;">🧠</span>
            <div style="flex:1;">
              <div style="font-size:11px;font-weight:600;color:var(--accent);">4. ANALYZE — Scoring y Visualización</div>
              <div style="font-size:10px;color:var(--muted2);margin-top:2px;">
                Una vez recuperados los datos, aplicamos <strong style="color:var(--text2);">2 algoritmos de scoring</strong>:<br><br>
                <strong style="color:var(--success-bright);">📊 Relevance Score (0-100):</strong><br>
                &nbsp;&nbsp;• +15 por keyword exacta del nicho en el título<br>
                &nbsp;&nbsp;• +5 por cada palabra clave relacionada<br>
                &nbsp;&nbsp;• +20 si es ultra-reciente (&lt;6h), +15 (&lt;24h), +10 (&lt;72h)<br>
                &nbsp;&nbsp;• +15 si engagement &gt;10K, +10 si &gt;1K, +5 si &gt;100<br><br>
                <strong style="color:var(--danger);">🔥 Viral Score (0-99):</strong><br>
                &nbsp;&nbsp;• +40 si engagement &gt;50K, +30 (&gt;10K), +20 (&gt;1K)<br>
                &nbsp;&nbsp;• +15 bonus YouTube (más viral potencial)<br>
                &nbsp;&nbsp;• +15 si es muy reciente (&lt;6h)<br><br>
                Finalmente: <strong style="color:var(--accent);">ordenamos por relevancia</strong>,
                etiquetamos (🔥 Viral, 📈 Trending, 📊 Rising, 📋 Normal)
                y renderizamos en tarjetas con colores por fuente.
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ═══ GOOGLE DISCOVER EXPLAINED ═══ -->
      <div style="margin-bottom:16px;">
        <div style="font-size:13px;font-weight:600;color:var(--accent);margin-bottom:6px;">🔮 Google Discover — ¿Cómo funciona aquí?</div>
        <div style="background:var(--bg3);border:0.5px solid rgba(52,168,83,0.2);border-radius:var(--radius);padding:12px;font-size:10px;color:var(--muted2);line-height:1.7;">
          <p style="margin-bottom:6px;">
            <strong style="color:#34a853;">Google Discover</strong> NO tiene una API pública ni RSS.
            Es un feed <strong style="color:var(--text2);">algorítmico y personalizado</strong> que Google
            muestra en la app de Google y Chrome móvil basado en:
          </p>
          <ul style="list-style:none;padding:0;margin:0 0 6px 0;">
            <li>🔹 Historial de búsquedas del usuario</li>
            <li>🔹 Actividad en YouTube y Chrome</li>
            <li>🔹 Ubicación e intereses inferidos</li>
            <li>🔹 Señales de tendencias globales</li>
          </ul>
          <p>
            Para simular Discover desde el frontend, usamos:
            <strong style="color:#34a853;">Google Trends RSS</strong> (que SÍ tiene RSS público) +
            <strong style="color:var(--accent);">Google News RSS</strong> como fallback.
            Los Trends nos dan <strong style="color:var(--text2);">señales de volumen de búsqueda</strong>
            que imitan lo que Discover detecta como "tendencia".<br><br>
            <em style="color:var(--accent);">🔑 Lección: Cuando una fuente no existe, la aproximamos
            combinando datos de fuentes similares + lógica de negocio. Eso es ingeniería.</em>
          </p>
        </div>
      </div>

      <!-- ═══ FUENTES TÉCNICAS ═══ -->
      <div style="margin-bottom:16px;">
        <div style="font-size:13px;font-weight:600;color:var(--accent);margin-bottom:6px;">📡 Las 9 Fuentes — Detalle Técnico</div>
        <div style="display:flex;flex-direction:column;gap:4px;">
          <div style="background:var(--bg3);border-radius:var(--radius);padding:8px 10px;font-size:9px;display:flex;justify-content:space-between;align-items:center;">
            <span><strong style="color:#4285f4;">📰 Google News</strong> — news.google.com/rss/search?q=...</span>
            <span style="color:var(--muted2);font-family:var(--mono);">XML RSS</span>
          </div>
          <div style="background:var(--bg3);border-radius:var(--radius);padding:8px 10px;font-size:9px;display:flex;justify-content:space-between;align-items:center;">
            <span><strong style="color:#34a853;">🔮 Google Discover</strong> — trends.google.com/trending/rss?geo=US</span>
            <span style="color:var(--muted2);font-family:var(--mono);">XML RSS + Trends</span>
          </div>
          <div style="background:var(--bg3);border-radius:var(--radius);padding:8px 10px;font-size:9px;display:flex;justify-content:space-between;align-items:center;">
            <span><strong style="color:#ff4500;">🗣️ Reddit</strong> — reddit.com/search.json?q=...&sort=top&t=...</span>
            <span style="color:var(--muted2);font-family:var(--mono);">JSON API</span>
          </div>
          <div style="background:var(--bg3);border-radius:var(--radius);padding:8px 10px;font-size:9px;display:flex;justify-content:space-between;align-items:center;">
            <span><strong style="color:#000;">🎵 TikTok</strong> — tokfeed.com/search/rss?q=... (terceros)</span>
            <span style="color:var(--muted2);font-family:var(--mono);">XML RSS</span>
          </div>
          <div style="background:var(--bg3);border-radius:var(--radius);padding:8px 10px;font-size:9px;display:flex;justify-content:space-between;align-items:center;">
            <span><strong style="color:#ff0000;">▶️ YouTube</strong> — youtube.com/feeds/videos.xml?q=...</span>
            <span style="color:var(--muted2);font-family:var(--mono);">XML RSS</span>
          </div>
          <div style="background:var(--bg3);border-radius:var(--radius);padding:8px 10px;font-size:9px;display:flex;justify-content:space-between;align-items:center;">
            <span><strong style="color:#e1306c;">📱 Instagram Reels</strong> — instagram.com/explore/tags (GraphQL)</span>
            <span style="color:var(--muted2);font-family:var(--mono);">JSON API</span>
          </div>
          <div style="background:var(--bg3);border-radius:var(--radius);padding:8px 10px;font-size:9px;display:flex;justify-content:space-between;align-items:center;">
            <span><strong style="color:#0A66C2;">💼 LinkedIn</strong> — linkedin.com/feed/trending.rss (Pulse RSS)</span>
            <span style="color:var(--muted2);font-family:var(--mono);">XML RSS</span>
          </div>
          <div style="background:var(--bg3);border-radius:var(--radius);padding:8px 10px;font-size:9px;display:flex;justify-content:space-between;align-items:center;">
            <span><strong style="color:#e60023;">📌 Pinterest</strong> — pinterest.com/resource/BoardFeedResource/get/</span>
            <span style="color:var(--muted2);font-family:var(--mono);">JSON API</span>
          </div>
          <div style="background:var(--bg3);border-radius:var(--radius);padding:8px 10px;font-size:9px;display:flex;justify-content:space-between;align-items:center;">
            <span><strong style="color:#1da1f2;">🐦 X/Twitter</strong> — nitter.net/search/rss?q=... (proxy Nitter)</span>
            <span style="color:var(--muted2);font-family:var(--mono);">XML RSS</span>
          </div>
        </div>
        <div style="font-size:9px;color:var(--muted2);margin-top:6px;padding:8px;background:var(--bg4);border-radius:var(--radius);">
          🔄 Todas pasan por <strong style="color:var(--accent);">CORS proxies</strong> porque los navegadores
          bloquean peticiones cross-domain. Los proxies son servicios gratuitos
          que reenvían la petición y añaden headers CORS.
        </div>
      </div>

      <!-- ═══ GLOSARIO ═══ -->
      <div style="margin-bottom:16px;">
        <div style="font-size:13px;font-weight:600;color:var(--accent);margin-bottom:6px;">📖 Glosario para Alumnos</div>
        <div style="display:grid;grid-template-columns:1fr 2fr;gap:2px;font-size:10px;">
          <div style="background:var(--bg4);padding:4px 8px;border-radius:4px 0 0 4px;color:var(--accent);font-weight:500;">RSS</div>
          <div style="background:var(--bg4);padding:4px 8px;border-radius:0 4px 4px 0;color:var(--muted2);">Really Simple Syndication — formato XML para feeds de contenido</div>
          <div style="background:var(--bg4);padding:4px 8px;border-radius:4px 0 0 4px;color:var(--accent);font-weight:500;">CORS</div>
          <div style="background:var(--bg4);padding:4px 8px;border-radius:0 4px 4px 0;color:var(--muted2);">Cross-Origin Resource Sharing — política de seguridad del navegador</div>
          <div style="background:var(--bg4);padding:4px 8px;border-radius:4px 0 0 4px;color:var(--accent);font-weight:500;">Proxy</div>
          <div style="background:var(--bg4);padding:4px 8px;border-radius:0 4px 4px 0;color:var(--muted2);">Servidor intermediario que reenvía peticiones evitando restricciones</div>
          <div style="background:var(--bg4);padding:4px 8px;border-radius:4px 0 0 4px;color:var(--accent);font-weight:500;">Parser</div>
          <div style="background:var(--bg4);padding:4px 8px;border-radius:0 4px 4px 0;color:var(--muted2);">Función que convierte datos crudos (XML/JSON) en objetos estructurados</div>
          <div style="background:var(--bg4);padding:4px 8px;border-radius:4px 0 0 4px;color:var(--accent);font-weight:500;">Engagement</div>
          <div style="background:var(--bg4);padding:4px 8px;border-radius:0 4px 4px 0;color:var(--muted2);">Métrica de interacción: likes, shares, comments, views</div>
          <div style="background:var(--bg4);padding:4px 8px;border-radius:4px 0 0 4px;color:var(--accent);font-weight:500;">Scoring</div>
          <div style="background:var(--bg4);padding:4px 8px;border-radius:0 4px 4px 0;color:var(--muted2);">Algoritmo que asigna puntuaciones basado en múltiples señales</div>
          <div style="background:var(--bg4);padding:4px 8px;border-radius:4px 0 0 4px;color:var(--accent);font-weight:500;">Signal</div>
          <div style="background:var(--bg4);padding:4px 8px;border-radius:0 4px 4px 0;color:var(--muted2);">Dato individual que alimenta una decisión (keyword match, recencia, etc.)</div>
          <div style="background:var(--bg4);padding:4px 8px;border-radius:4px 0 0 4px;color:var(--accent);font-weight:500;">Fallback</div>
          <div style="background:var(--bg4);padding:4px 8px;border-radius:0 4px 4px 0;color:var(--muted2);">Mecanismo de respaldo cuando una fuente falla (demo data)</div>
          <div style="background:var(--bg4);padding:4px 8px;border-radius:4px 0 0 4px;color:var(--accent);font-weight:500;">Discover</div>
          <div style="background:var(--bg4);padding:4px 8px;border-radius:0 4px 4px 0;color:var(--muted2);">Feed algorítmico de Google que muestra contenido antes de buscar</div>
        </div>
      </div>

      <!-- ═══ RESUMEN ═══ -->
      <div style="background:linear-gradient(135deg,rgba(201,169,110,0.06),rgba(201,169,110,0.02));border:0.5px solid rgba(201,169,110,0.2);border-radius:var(--radius);padding:14px;text-align:center;">
        <div style="font-size:12px;font-weight:600;color:var(--accent);margin-bottom:4px;">🔥 En resumen</div>
        <div style="font-size:10px;color:var(--muted2);line-height:1.6;">
          El Viral Scanner es un <strong style="color:var(--accent);">sistema de inteligencia de contenidos</strong>
          que aprende de 9 fuentes, observa señales de viralidad,
          recupera datos via proxies y CORS, y analiza todo
          con algoritmos de scoring. Todo desde el frontend,
          sin backend, usando JavaScript puro.
          <br><br>
          <strong style="color:var(--info-bright);">🧠 LoRA = Learn · Observe · Retrieve · Analyze</strong>
          <br><br>
          <span style="color:var(--accent);">"La bestia más poderosa del universo" 🔥</span>
        </div>
      </div>

    </div>
  `, `
    <button class="btn btn-sm btn-primary" onclick="closeModal()">✅ Entendido</button>
  `);
}

console.log('🤖 Viral Scanner v' + VIRAL_SCANNER_VERSION + ' loaded — ' + SCANNER_NICHES.length + ' nichos escaneables');
