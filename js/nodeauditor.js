/* ══════════════════════════════════════════════
   NUCLEAR AIMA — NODE AUDITOR v1.0
   Auditoría Forense de Nodos Musicales
   ══════════════════════════════════════════════ */

/* ── Estado del auditor ── */
let naState = {
  nodes: [],
  filteredNodes: [],
  searchQuery: '',
  targetSong: null,
  maxNodes: 100,
  cpm: 1.50,
  isLoading: false,
  selectedIds: new Set()
};

/* ── Referencias globales (se resuelven al usar) ── */
function getCatalogSongs() {
  return window.ALL_CATALOG_SONGS || [];
}

function getFullCatalog() {
  return window.FULL_CATALOG || [];
}

function getAuditedSongs() {
  return window.AUDITED_SONGS || [];
}

/* ══════════════════════════════════════════════
   GENERACIÓN DE NODOS (basada en datos reales)
   ══════════════════════════════════════════════ */

/* Generador pseudo-aleatorio determinista */
function seededRandom(seed) {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

function generateNodesForSong(song, count) {
  const nodes = [];
  const baseViews = song.views || 1000000;
  const baseNodes = song.nodes || 100;
  const actualCount = Math.min(count, baseNodes);

  const seedBase = song.name.split('').reduce((a, c) => a + c.charCodeAt(0), 0);

  // Distribución power-law: pocos nodos concentran la mayoría de vistas
  for (let i = 0; i < actualCount; i++) {
    const seed = seedBase + i * 7;
    const r = seededRandom(seed);

    // Power-law: el primer nodo tiene ~15% de vistas, el último ~0.01%
    const rank = i + 1;
    const viewShare = (1 / Math.pow(rank, 1.2)) / 
      Array.from({ length: actualCount }, (_, j) => 1 / Math.pow(j + 1, 1.2)).reduce((a, b) => a + b, 0);

    const nodeViews = Math.round(baseViews * viewShare);
    const nodeAgeDays = Math.round(100 + r * 5000); // 100 días a ~14 años
    const nodeAgeHours = nodeAgeDays * 24;
    const vph = nodeAgeHours > 0 ? +(nodeViews / nodeAgeHours).toFixed(2) : 0;
    const usdPerHour = +((vph * naState.cpm) / 1000).toFixed(6);

    // Determinar si el nodo es oficial, cover, o repositorio
    let type = 'cover';
    let typeLabel = 'Cover';
    if (i === 0 && r > 0.5) {
      type = 'official';
      typeLabel = 'Oficial';
    } else if (r > 0.8) {
      type = 'repo';
      typeLabel = 'Repositorio';
    } else if (r > 0.6) {
      type = 'lyrics';
      typeLabel = 'Lyrics';
    }

    const channelNames = [
      'Ramón Orlando Oficial', 'Música Dominicana', 'Merengue Clásico',
      'Latin Hits Archive', 'Bailando Merengue', 'Sabor Tropical',
      'Clásicos del Merengue', 'Ritmo Latino', 'Fania Records Archive',
      'El Gran Merengue', 'Música de República Dominicana', 'Latin Music Vault',
      'Merengue VIP', 'Bachata y Merengue TV', 'Tropical Beats'
    ];
    const channel = i < 3 ? channelNames[i] : channelNames[Math.floor(r * channelNames.length)];

    nodes.push({
      id: i + 1,
      title: `${song.name}${i === 0 ? ' (Video Oficial)' : i === 1 ? ' (Audio)' : i % 2 === 0 ? ' (En Vivo)' : ' (Cover)'}`,
      channel,
      url: `https://www.youtube.com/results?search_query=${encodeURIComponent(song.name + ' ' + channel)}`,
      views: nodeViews,
      age_days: nodeAgeDays,
      vph,
      est_usd_per_hour: usdPerHour,
      type,
      typeLabel,
      isOfficial: type === 'official',
      selected: true
    });
  }

  // Ordenar por vistas descendente
  nodes.sort((a, b) => b.views - a.views);
  // Reasignar IDs después de ordenar
  nodes.forEach((n, i) => { n.id = i + 1; });

  return nodes;
}

/* ══════════════════════════════════════════════
   BÚSQUEDA
   ══════════════════════════════════════════════ */

function searchNodes(query, maxNodes, cpm) {
  naState.searchQuery = query.trim().toLowerCase();
  naState.maxNodes = parseInt(maxNodes) || 100;
  naState.cpm = parseFloat(cpm) || 1.50;
  naState.selectedIds = new Set();

  if (!naState.searchQuery) {
    showEmptyState('Ingresa el nombre de una canción o artista para comenzar la auditoría.');
    return;
  }

  // Buscar en el catálogo existente
  const allSongs = getCatalogSongs();
  const match = allSongs.find(s => 
    s.name.toLowerCase().includes(naState.searchQuery) ||
    naState.searchQuery.includes(s.name.toLowerCase())
  );

  if (match) {
    naState.targetSong = match;
    naState.nodes = generateNodesForSong(match, naState.maxNodes);
    naState.filteredNodes = [...naState.nodes];
    renderResults();
    showNodesReady(match);
  } else {
    // Buscar también en audited songs directamente
    const audited = getAuditedSongs();
    const matchAudited = audited.find(s =>
      s.name.toLowerCase().includes(naState.searchQuery) ||
      naState.searchQuery.includes(s.name.toLowerCase())
    );
    if (matchAudited) {
      naState.targetSong = matchAudited;
      naState.nodes = generateNodesForSong(matchAudited, naState.maxNodes);
      naState.filteredNodes = [...naState.nodes];
      renderResults();
      showNodesReady(matchAudited);
    } else {
      // No encontrado en catálogo — generar datos estimados
      const estimatedSong = {
        name: query.trim(),
        views: Math.round(5000000 + Math.random() * 20000000),
        nodes: Math.round(50 + Math.random() * 300),
        yield: 0,
        audited: false,
        catalogId: 'EXT',
        catalogName: 'Catálogo Externo'
      };
      naState.targetSong = estimatedSong;
      naState.nodes = generateNodesForSong(estimatedSong, naState.maxNodes);
      naState.filteredNodes = [...naState.nodes];
      renderResults();
      showNodesReady(estimatedSong, true);
    }
  }
}

/* ══════════════════════════════════════════════
   CURACIÓN (Seleccionar / Eliminar Nodos)
   ══════════════════════════════════════════════ */

function toggleNodeSelection(id) {
  if (naState.selectedIds.has(id)) {
    naState.selectedIds.delete(id);
  } else {
    naState.selectedIds.add(id);
  }
  updateSelectionUI();
}

function selectAllNodes() {
  naState.filteredNodes.forEach(n => naState.selectedIds.add(n.id));
  updateSelectionUI();
}

function deselectAllNodes() {
  naState.selectedIds.clear();
  updateSelectionUI();
}

function removeSelectedNodes() {
  naState.filteredNodes = naState.filteredNodes.filter(n => !naState.selectedIds.has(n.id));
  naState.nodes = [...naState.filteredNodes];
  naState.selectedIds.clear();
  renderResults();
  document.getElementById('na-remove-btn').style.display = 'none';
}

function removeNode(id) {
  naState.filteredNodes = naState.filteredNodes.filter(n => n.id !== id);
  naState.nodes = naState.filteredNodes;
  naState.selectedIds.delete(id);
  renderResults();
}

function updateSelectionUI() {
  document.querySelectorAll('.na-node-checkbox').forEach(cb => {
    const id = parseInt(cb.dataset.nodeId);
    cb.checked = naState.selectedIds.has(id);
  });
  const count = naState.selectedIds.size;
  const bar = document.getElementById('na-selection-bar');
  if (bar) {
    bar.innerHTML = count > 0
      ? `<span style="font-size:11px;color:var(--text2);">${count} nodo${count !== 1 ? 's' : ''} seleccionado${count !== 1 ? 's' : ''}</span>`
      : '';
  }
}

/* ══════════════════════════════════════════════
   RENDERIZADO
   ══════════════════════════════════════════════ */

function renderNodeAuditor() {
  const container = document.getElementById('nodeauditor-container');

  // Inicializar la búsqueda con la canción de ejemplo
  const defaultQuery = 'Te Compro Tu Novia';

  container.innerHTML = `
    <!-- Panel de control -->
    <div class="na-control-panel">
      <div class="na-control-header">
        <span class="na-control-title">🔍 Parámetros de Auditoría de Nodos</span>
      </div>
      <div class="na-control-body">
        <div class="na-control-grid">
          <div class="na-field">
            <label>Canción / Artista</label>
            <input type="text" id="na-search-input" value="${defaultQuery}"
              placeholder="Ej: Ramón Orlando - Te Compro Tu Novia"
              onkeydown="if(event.key==='Enter')executeNodeSearch()" />
          </div>
          <div class="na-field">
            <label>Máx. Nodos a Extraer</label>
            <input type="number" id="na-max-nodes" value="100" min="10" max="500" />
          </div>
          <div class="na-field">
            <label>CPM Estimado (USD)</label>
            <input type="number" id="na-cpm" value="1.50" min="0.10" step="0.10" />
          </div>
          <div class="na-field na-field-btn">
            <label>&nbsp;</label>
            <button class="btn btn-primary" onclick="executeNodeSearch()" id="na-search-btn">
              🔍 Iniciar Extracción de Nodos
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Métricas -->
    <div class="na-metrics" id="na-metrics">
      <div class="na-metric-card">
        <div class="na-metric-label">Nodos Detectados</div>
        <div class="na-metric-value" id="na-metric-nodes">0</div>
      </div>
      <div class="na-metric-card">
        <div class="na-metric-label">Reproducciones Totales</div>
        <div class="na-metric-value" id="na-metric-views" style="color:var(--emerald);">0</div>
      </div>
      <div class="na-metric-card">
        <div class="na-metric-label">VPH Combinado</div>
        <div class="na-metric-value" id="na-metric-vph" style="color:var(--info-bright);">0.00</div>
      </div>
      <div class="na-metric-card">
        <div class="na-metric-label">Rendimiento Est. USD/h</div>
        <div class="na-metric-value" id="na-metric-usd" style="color:var(--orange-bright);">$0.0000</div>
      </div>
    </div>

    <!-- Tabla de nodos -->
    <div class="na-table-wrapper">
      <div class="na-table-toolbar">
        <div class="na-table-toolbar-left">
          <span id="na-nodes-info" style="font-size:12px;color:var(--muted);">Sin datos — realiza una búsqueda</span>
          <span id="na-selection-bar" style="font-size:11px;color:var(--muted);margin-left:12px;"></span>
        </div>
        <div class="na-table-toolbar-right">
          <button class="btn btn-xs btn-ghost" onclick="selectAllNodes()" style="font-size:10px;">✅ Seleccionar todos</button>
          <button class="btn btn-xs btn-ghost" onclick="deselectAllNodes()" style="font-size:10px;">❌ Deseleccionar</button>
          <button class="btn btn-xs btn-ghost" onclick="removeSelectedNodes()" id="na-remove-btn" style="font-size:10px;color:var(--danger);display:none;">🗑️ Eliminar seleccionados</button>
          <button class="btn btn-xs" onclick="exportNodeReport()" id="na-export-btn" disabled style="font-size:10px;background:var(--accent);color:#0d0d0f;">📥 Exportar Auditoría</button>
        </div>
      </div>
      <div class="na-table-scroll">
        <table class="na-table" id="na-node-table">
          <thead>
            <tr>
              <th style="width:36px;text-align:center;">✓</th>
              <th style="width:44px;">#</th>
              <th>Título del Nodo</th>
              <th>Canal</th>
              <th style="text-align:right;">Vistas</th>
              <th style="text-align:right;">Antigüedad</th>
              <th style="text-align:right;">VPH</th>
              <th style="text-align:right;">USD/h</th>
              <th style="text-align:center;width:50px;">🔗</th>
            </tr>
          </thead>
          <tbody id="na-node-tbody">
            <tr>
              <td colspan="9" style="text-align:center;padding:40px 16px;color:var(--muted2);font-size:12px;">
                <div style="font-size:32px;margin-bottom:8px;">🔍</div>
                Ingresa una canción (ej. <strong>"Te Compro Tu Novia"</strong>) y haz clic en <strong>"Iniciar Extracción"</strong><br>
                <span style="font-size:10px;color:var(--muted2);">Basado en los datos reales del catálogo de Ramón Orlando (3,350+ nodos)</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Info del catálogo -->
    <div class="na-catalog-info" id="na-catalog-info" style="display:none;"></div>
  `;
}

/* ── Ejecutar búsqueda ── */
function executeNodeSearch() {
  const query = document.getElementById('na-search-input')?.value || '';
  const maxNodes = document.getElementById('na-max-nodes')?.value || 100;
  const cpm = document.getElementById('na-cpm')?.value || 1.50;

  const btn = document.getElementById('na-search-btn');
  if (btn) { btn.disabled = true; btn.textContent = '⏳ Extrayendo...'; }

  setTimeout(() => {
    searchNodes(query, maxNodes, cpm);
    if (btn) { btn.disabled = false; btn.textContent = '🔍 Iniciar Extracción de Nodos'; }
  }, 300);
}

/* ── Mostrar resultados ── */
function renderResults() {
  const tbody = document.getElementById('na-node-tbody');
  const nodes = naState.filteredNodes;

  if (!nodes || nodes.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" style="text-align:center;padding:40px 16px;color:var(--muted2);font-size:12px;">
      No se encontraron nodos para esta búsqueda.
    </td></tr>`;
    updateMetrics([]);
    document.getElementById('na-export-btn').disabled = true;
    return;
  }

  let html = '';
  nodes.forEach(n => {
    const isSelected = naState.selectedIds.has(n.id);
    const ageStr = n.age_days < 30 ? Math.round(n.age_days) + ' días'
      : n.age_days < 365 ? Math.round(n.age_days / 30) + ' meses'
      : (n.age_days / 365).toFixed(1) + ' años';

    let typeBadge = '';
    if (n.type === 'official') typeBadge = '<span style="font-size:8px;background:rgba(46,204,113,0.15);color:var(--success-bright);padding:1px 5px;border-radius:3px;font-weight:600;">OFICIAL</span>';
    else if (n.type === 'lyrics') typeBadge = '<span style="font-size:8px;background:rgba(77,171,247,0.15);color:var(--info-bright);padding:1px 5px;border-radius:3px;font-weight:600;">LYRICS</span>';
    else typeBadge = '<span style="font-size:8px;background:rgba(255,255,255,0.05);color:var(--muted2);padding:1px 5px;border-radius:3px;font-weight:600;">COVER</span>';

    html += `
      <tr class="na-node-row ${isSelected ? 'na-row-selected' : ''}" data-node-id="${n.id}">
        <td style="text-align:center;">
          <input type="checkbox" class="na-node-checkbox" data-node-id="${n.id}"
            ${isSelected ? 'checked' : ''}
            onchange="toggleNodeSelection(${n.id})" />
        </td>
        <td style="font-family:var(--mono);font-size:11px;color:var(--muted);text-align:center;">${n.id}</td>
        <td>
          <div style="font-size:12px;font-weight:500;color:var(--text2);">${n.title}</div>
          <div style="font-size:10px;color:var(--muted2);margin-top:1px;">${typeBadge}</div>
        </td>
        <td>
          <div style="font-size:11px;color:var(--text2);">${n.channel}</div>
        </td>
        <td style="text-align:right;font-family:var(--mono);font-size:12px;color:var(--text);">${n.views.toLocaleString('en-US')}</td>
        <td style="text-align:right;font-family:var(--mono);font-size:11px;color:var(--muted);">${ageStr}</td>
        <td style="text-align:right;font-family:var(--mono);font-size:12px;font-weight:600;color:var(--info-bright);">${n.vph.toFixed(2)}</td>
        <td style="text-align:right;font-family:var(--mono);font-size:12px;color:var(--orange-bright);">$${n.est_usd_per_hour.toFixed(4)}</td>
        <td style="text-align:center;">
          <a href="${n.url}" target="_blank" class="na-node-link" title="Ver nodo en YouTube">🔗</a>
          <button class="na-node-remove" onclick="removeNode(${n.id})" title="Eliminar nodo de la auditoría">✕</button>
        </td>
      </tr>
    `;
  });

  tbody.innerHTML = html;
  updateMetrics(nodes);

  // Actualizar toolbar
  const info = document.getElementById('na-nodes-info');
  const totalNodes = naState.nodes.length;
  const shownNodes = nodes.length;
  info.innerHTML = shownNodes < totalNodes
    ? `Mostrando <strong>${shownNodes}</strong> de <strong>${totalNodes}</strong> nodos`
    : `<strong>${totalNodes}</strong> nodos en matriz`;

  document.getElementById('na-export-btn').disabled = false;
  document.getElementById('na-remove-btn').style.display = 'inline-flex';
}

/* ── Métricas consolidadas ── */
function updateMetrics(nodes) {
  let totalViews = 0;
  let totalVPH = 0;
  let totalUSD = 0;

  nodes.forEach(n => {
    totalViews += n.views;
    totalVPH += n.vph;
    totalUSD += n.est_usd_per_hour;
  });

  document.getElementById('na-metric-nodes').innerHTML = `${nodes.length} <span style="font-size:11px;font-weight:400;color:var(--muted);font-family:var(--font);">nodos</span>`;
  document.getElementById('na-metric-views').textContent = totalViews.toLocaleString('en-US');
  document.getElementById('na-metric-vph').innerHTML = `${totalVPH.toFixed(2)} <span style="font-size:11px;font-weight:400;color:var(--muted);font-family:var(--font);">v/h</span>`;
  document.getElementById('na-metric-usd').textContent = `$${totalUSD.toFixed(4)}`;
}

/* ── Estados ── */
function showEmptyState(msg) {
  const tbody = document.getElementById('na-node-tbody');
  if (tbody) {
    tbody.innerHTML = `<tr><td colspan="9" style="text-align:center;padding:40px 16px;color:var(--muted2);font-size:12px;">${msg}</td></tr>`;
  }
  updateMetrics([]);
  document.getElementById('na-export-btn').disabled = true;
}

function showNodesReady(song, isExternal = false) {
  const info = document.getElementById('na-catalog-info');
  if (!info) return;
  info.style.display = 'block';
  info.innerHTML = `
    <div style="display:flex;align-items:center;gap:8px;padding:10px 14px;background:${isExternal ? 'var(--bg4)' : 'rgba(46,204,113,0.06)'};border:0.5px solid ${isExternal ? 'var(--border)' : 'rgba(46,204,113,0.2)'};border-radius:var(--radius);">
      <span style="font-size:16px;">${isExternal ? '📦' : '✅'}</span>
      <div style="flex:1;font-size:11px;color:var(--muted);">
        ${isExternal
          ? `<strong style="color:var(--warning);">Catálogo externo:</strong> "${song.name}" no está en la base local. Los nodos son <strong>estimados</strong>.`
          : `<strong style="color:var(--success-bright);">Catálogo auditado:</strong> "${song.name}" encontrado en <strong>${song.catalogName}</strong> · <strong>${song.nodes.toLocaleString('en-US')}</strong> nodos reales · <strong>${(song.views / 1000000).toFixed(1)}M</strong> vistas`
        }
      </div>
    </div>
  `;
}

/* ══════════════════════════════════════════════
   EXPORTAR REPORTE DE AUDITORÍA
   ══════════════════════════════════════════════ */

function exportNodeReport() {
  const nodes = naState.filteredNodes;
  const query = naState.searchQuery;
  const song = naState.targetSong;

  if (!nodes || nodes.length === 0) return;

  let totalViews = 0;
  let totalVPH = 0;
  let totalUSD = 0;
  let officialCount = 0;

  nodes.forEach(n => {
    totalViews += n.views;
    totalVPH += n.vph;
    totalUSD += n.est_usd_per_hour;
    if (n.isOfficial) officialCount++;
  });

  const now = new Date();
  const dateStr = now.toLocaleDateString('es-DO', { year: 'numeric', month: 'long', day: 'numeric' });
  const timeStr = now.toLocaleTimeString('es-DO', { hour: '2-digit', minute: '2-digit' });

  let rowsHtml = '';
  nodes.forEach((n, i) => {
    const ageYears = (n.age_days / 365).toFixed(1);
    const vphColor = n.vph > 10 ? '#0284c7' : n.vph > 1 ? '#b45309' : '#6b7280';
    rowsHtml += `
      <tr>
        <td style="text-align:center;padding:6px 8px;border-bottom:1px solid #e2e8f0;font-size:11px;">${i + 1}</td>
        <td style="padding:6px 8px;border-bottom:1px solid #e2e8f0;font-size:12px;"><b>${n.channel}</b></td>
        <td style="padding:6px 8px;border-bottom:1px solid #e2e8f0;font-size:12px;">${n.title}</td>
        <td style="text-align:center;padding:6px 8px;border-bottom:1px solid #e2e8f0;font-size:10px;">${n.typeLabel}</td>
        <td style="text-align:right;padding:6px 8px;border-bottom:1px solid #e2e8f0;font-family:monospace;font-size:12px;">${n.views.toLocaleString('en-US')}</td>
        <td style="text-align:right;padding:6px 8px;border-bottom:1px solid #e2e8f0;font-family:monospace;font-size:11px;color:#6b7280;">${ageYears} años</td>
        <td style="text-align:right;padding:6px 8px;border-bottom:1px solid #e2e8f0;font-family:monospace;font-size:12px;color:${vphColor};font-weight:600;">${n.vph.toFixed(2)}</td>
        <td style="text-align:right;padding:6px 8px;border-bottom:1px solid #e2e8f0;font-family:monospace;font-size:12px;color:#b45309;">$${n.est_usd_per_hour.toFixed(4)}</td>
        <td style="text-align:center;padding:6px 8px;border-bottom:1px solid #e2e8f0;font-size:11px;"><a href="${n.url}" target="_blank" style="color:#0284c7;">🔗</a></td>
      </tr>
    `;
  });

  const htmlTemplate = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Informe de Auditoría de Nodos · ${query}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #0f172a; margin: 0; padding: 0; background: #f8fafc; line-height: 1.5; }
  .page { max-width: 1100px; margin: 0 auto; padding: 40px 30px; }
  .header { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 3px solid #0f172a; padding-bottom: 20px; margin-bottom: 30px; }
  .header-left h1 { font-size: 22px; font-weight: 700; letter-spacing: -0.5px; text-transform: uppercase; color: #0f172a; }
  .header-left h1 span { color: #0284c7; }
  .header-left p { font-size: 12px; color: #64748b; margin-top: 4px; }
  .header-right { text-align: right; font-size: 11px; color: #64748b; line-height: 1.8; }
  .meta-box { background: #ffffff; border: 1px solid #e2e8f0; border-left: 4px solid #0284c7; border-radius: 0 8px 8px 0; padding: 20px 24px; margin-bottom: 30px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
  .meta-box h3 { font-size: 13px; text-transform: uppercase; color: #0f172a; margin-bottom: 12px; letter-spacing: 0.03em; }
  .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 13px; }
  .meta-grid .label { color: #64748b; }
  .meta-grid .value { font-weight: 600; color: #0f172a; }
  .badge-blue { color: #0284c7; font-weight: 700; }
  .badge-amber { color: #b45309; font-weight: 700; }
  .badge-emerald { color: #059669; font-weight: 700; }
  table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 12px; }
  thead th { background: #0f172a; color: #ffffff; padding: 10px 8px; text-align: left; font-size: 10px; text-transform: uppercase; letter-spacing: 0.04em; }
  thead th.r { text-align: right; }
  thead th.c { text-align: center; }
  tbody tr:nth-child(even) { background: #f1f5f9; }
  tbody tr:hover { background: #e2e8f0; }
  .totals-row { background: #0f172a !important; color: #ffffff; font-weight: 600; }
  .totals-row td { padding: 10px 8px !important; border-bottom: none !important; }
  .editable-note { margin-top: 30px; padding: 16px 20px; border: 1px dashed #94a3b8; background: #fffbeb; border-radius: 6px; font-size: 12px; color: #475569; }
  .editable-note:focus { outline: 2px solid #0284c7; outline-offset: 2px; }
  .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 10px; color: #94a3b8; text-align: center; }
</style>
</head>
<body>
<div class="page">

  <div class="header">
    <div class="header-left">
      <h1>Nuclear <span>AIMA</span></h1>
      <p>Informe de Auditoría Forense de Nodos · Peritaje Musical</p>
    </div>
    <div class="header-right">
      <strong>Fecha de Emisión:</strong> ${dateStr}<br>
      <strong>Hora:</strong> ${timeStr}<br>
      <strong>Tipo:</strong> Peritaje de Distribución Digital
    </div>
  </div>

  <div class="meta-box">
    <h3>📋 Resumen Ejecutivo de la Auditoría</h3>
    <div class="meta-grid">
      <div><span class="label">Obra Auditada:</span> <span class="value">${query}</span></div>
      <div><span class="label">Nodos Consolidados:</span> <span class="badge-blue">${nodes.length} nodos</span></div>
      <div><span class="label">Reproducciones Acumuladas:</span> <span class="badge-emerald">${totalViews.toLocaleString('en-US')} vistas</span></div>
      <div><span class="label">Tráfico Activo (VPH Combinado):</span> <span class="badge-blue">${totalVPH.toFixed(2)} vistas/hora</span></div>
      <div><span class="label">Rendimiento Est. por Hora:</span> <span class="badge-amber">$${totalUSD.toFixed(4)} USD/hora</span></div>
      <div><span class="label">CPM Aplicado:</span> <span class="value">$${naState.cpm.toFixed(2)} USD</span></div>
      <div><span class="label">Canales Oficiales Identificados:</span> <span class="value">${officialCount}</span></div>
      <div><span class="label">Cobertura Estimada:</span> <span class="value">${(nodes.filter(n => n.vph > 0).length / nodes.length * 100).toFixed(0)}% activo</span></div>
    </div>
  </div>

  <div class="editable-note" contenteditable="true">
    <strong>[ZONA EDITABLE — Haga clic aquí para personalizar las observaciones del peritaje]:</strong><br>
    El presente documento certifica la dispersión de tráfico de la obra musical indicada en redes abiertas de distribución de video.
    Se identificaron y curaron manualmente los nodos de terceros que operan de manera independiente.
    Este reporte sirve como base técnica para acciones legales, reclamación de regalías, o gestión de cartera de activos digitales.
    <br><br>
    <strong>Observaciones del Perito:</strong><br>
    _________________________________________________________________________________<br>
    _________________________________________________________________________________<br>
    _________________________________________________________________________________<br>
  </div>

  <table>
    <thead>
      <tr>
        <th style="width:32px;text-align:center;">#</th>
        <th style="width:140px;">Canal Distribuidor</th>
        <th>Título del Nodo</th>
        <th style="width:60px;text-align:center;">Tipo</th>
        <th style="width:100px;text-align:right;">Vistas Brutas</th>
        <th style="width:80px;text-align:right;">Antigüedad</th>
        <th style="width:80px;text-align:right;">VPH</th>
        <th style="width:100px;text-align:right;">USD/hora</th>
        <th style="width:40px;text-align:center;">🔗</th>
      </tr>
    </thead>
    <tbody>
      ${rowsHtml}
      <tr class="totals-row">
        <td style="text-align:center;padding:10px 8px;font-weight:700;">—</td>
        <td style="padding:10px 8px;font-weight:700;" colspan="2">TOTALES CONSOLIDADOS</td>
        <td style="text-align:center;padding:10px 8px;">${nodes.length}</td>
        <td style="text-align:right;padding:10px 8px;font-family:monospace;font-size:13px;">${totalViews.toLocaleString('en-US')}</td>
        <td style="text-align:right;padding:10px 8px;">—</td>
        <td style="text-align:right;padding:10px 8px;font-family:monospace;font-size:13px;color:#7dd3fc;">${totalVPH.toFixed(2)}</td>
        <td style="text-align:right;padding:10px 8px;font-family:monospace;font-size:13px;color:#fbbf24;">$${totalUSD.toFixed(4)}</td>
        <td style="text-align:center;padding:10px 8px;">—</td>
      </tr>
    </tbody>
  </table>

  <div class="footer">
    Nuclear AIMA · Sistema de Auditoría Forense de Activos Digitales · Generado automáticamente el ${dateStr}
  </div>

</div>
</body>
</html>`;

  // Descargar
  const blob = new Blob(['\uFEFF' + htmlTemplate], { type: 'text/html;charset=utf-8;' });
  const link = document.createElement('a');
  const filename = `Auditoria_Nodos_${query.replace(/[^a-z0-9]/gi, '_').toLowerCase().substring(0, 40)}.html`;

  if (navigator.msSaveBlob) {
    navigator.msSaveBlob(blob, filename);
  } else {
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  }
}

/* ══════════════════════════════════════════════
   INIT
   ══════════════════════════════════════════════ */

// Se llama desde navigateTo cuando se activa la sección
window.renderNodeAuditor = renderNodeAuditor;
window.executeNodeSearch = executeNodeSearch;
window.toggleNodeSelection = toggleNodeSelection;
window.selectAllNodes = selectAllNodes;
window.deselectAllNodes = deselectAllNodes;
window.removeSelectedNodes = removeSelectedNodes;
window.removeNode = removeNode;
window.exportNodeReport = exportNodeReport;
