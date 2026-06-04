/* ══════════════════════════════════════════════
   NUCLEAR AIMA — NODE AUDITOR v1.2
   Auditoría Forense de Nodos Musicales
   Detección de Canales Piratas + YouTube Shorts Virales
   ══════════════════════════════════════════════ */

/* ── Canales Piratas Conocidos ── */
const PIRATE_CHANNELS = [
  'Karin Records', 'Karin Records RD', 'Karin Music',
  'Música Sin Fronteras', 'Latin Music Pirate', 'Merengue Full HD',
  'Exitos del Ayer', 'Música Sin Copyright', 'Sabor Latino HD',
  'El Bombazo Musical', 'Ritmo y Sabor', 'Tropical Hits',
  'Merengue Manía', 'Pura Musica Latina', 'Latinos por el Mundo',
  'Música Sin Dueño', 'Exitos Latinos', 'El Merengue No Muere',
  'Bailando Con Todo', 'Fiesta Latina Total'
];

/* ── Estado del auditor ── */
let naState = {
  nodes: [],
  filteredNodes: [],
  searchQuery: '',
  targetSong: null,
  targetArtist: null,
  artistSongs: [],
  maxNodes: 100,
  cpm: 1.50,
  isLoading: false,
  selectedIds: new Set(),
  naView: 'nodes', // 'nodes' | 'pirates' | 'shorts' | 'audioshorts'
  naSearchMode: 'song', // 'song' | 'artist'
  useRealData: false,
  apiBaseUrl: 'http://localhost:5000',
  // Shorts data
  shorts: [],
  shortsFiltered: [],
  // Shorts filter/sort state
  shortsSearch: '',
  shortsSortBy: 'views',
  shortsChannelFilter: 'all',
  shortsPage: 1,
  shortsPerPage: 25,
  // Audio Shorts data
  audioShorts: [],
  audioShortsFiltered: [],
  // Audio Shorts filter/sort state
  audioSearch: '',
  audioSortBy: 'views',
  audioChannelFilter: 'all',
  audioPage: 1,
  audioPerPage: 25
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

/* ── Determina si un canal es pirata ── */
function isPirateChannel(channelName) {
  const name = channelName.toLowerCase();
  return PIRATE_CHANNELS.some(p => name.includes(p.toLowerCase())) ||
    name.includes('pirate') ||
    name.includes('sin copyright') ||
    name.includes('sin due') ||
    name.includes('full hd');
}

/* ══════════════════════════════════════════════
   GENERACIÓN DE NODOS (basada en datos reales)
   ══════════════════════════════════════════════ */

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

  const officialChannels = [
    'Ramón Orlando Oficial', 'Ramón Orlando VEVO', 'Ramón Orlando Topic'
  ];
  const normalChannels = [
    'Música Dominicana', 'Merengue Clásico',
    'Latin Hits Archive', 'Bailando Merengue', 'Sabor Tropical',
    'Clásicos del Merengue', 'Ritmo Latino', 'Fania Records Archive',
    'El Gran Merengue', 'Música de República Dominicana', 'Latin Music Vault',
    'Merengue VIP', 'Bachata y Merengue TV', 'Tropical Beats',
    'Sonido Dominicano', 'Merengue de Colección'
  ];

  // Distribución power-law
  for (let i = 0; i < actualCount; i++) {
    const seed = seedBase + i * 7;
    const r = seededRandom(seed);

    const rank = i + 1;
    const viewShare = (1 / Math.pow(rank, 1.2)) /
      Array.from({ length: actualCount }, (_, j) => 1 / Math.pow(j + 1, 1.2)).reduce((a, b) => a + b, 0);

    const nodeViews = Math.round(baseViews * viewShare);
    const nodeAgeDays = Math.round(100 + r * 5000);
    const nodeAgeHours = nodeAgeDays * 24;
    const vph = nodeAgeHours > 0 ? +(nodeViews / nodeAgeHours).toFixed(2) : 0;
    const usdPerHour = +((vph * naState.cpm) / 1000).toFixed(6);

    // Asignar tipo y canal
    let type, typeLabel, channel, isPirate;

    if (i < 2) {
      // Top 2: oficiales
      type = 'official'; typeLabel = 'Oficial';
      channel = officialChannels[i];
      isPirate = false;
    } else if (r > 0.65) {
      // ~35%: canales piratas
      type = 'pirate'; typeLabel = '🏴‍☠️ Pirata';
      const pIdx = Math.floor(seededRandom(seed + 999) * PIRATE_CHANNELS.length);
      channel = PIRATE_CHANNELS[pIdx];
      isPirate = true;
    } else {
      // Resto: canales legítimos no-oficiales
      type = r > 0.4 ? 'cover' : 'repo';
      typeLabel = type === 'cover' ? 'Cover' : 'Repositorio';
      const nIdx = Math.floor(seededRandom(seed + 777) * normalChannels.length);
      channel = normalChannels[nIdx];
      isPirate = false;
    }

    nodes.push({
      id: i + 1,
      title: `${song.name}${i === 0 ? ' (Video Oficial)' : i === 1 ? ' (Audio Oficial)' : type === 'pirate' ? ' (Cover HD)' : ' (En Vivo)'}`,
      channel,
      url: `https://www.youtube.com/results?search_query=${encodeURIComponent(song.name)}+${encodeURIComponent(channel)}`,
      views: nodeViews,
      age_days: nodeAgeDays,
      vph,
      est_usd_per_hour: usdPerHour,
      type,
      typeLabel,
      isOfficial: type === 'official',
      isPirate,
      selected: true
    });
  }

  nodes.sort((a, b) => b.views - a.views);
  nodes.forEach((n, i) => { n.id = i + 1; });

  return nodes;
}

/* ══════════════════════════════════════════════
   GENERACIÓN DE SHORTS (simulación viral)
   ══════════════════════════════════════════════ */

function generateShortsForSong(song, count) {
  const shorts = [];
  const baseViews = song.views || 1000000;
  const seedBase = song.name.split('').reduce((a, c) => a + c.charCodeAt(0), 0);

  // Los Shorts tienen distribución ultra-concentrada:
  // El top 1-3 son virales masivos, el resto decae rápido
  const actualCount = Math.min(count || 25, 50);

  const shortTemplates = [
    ' #shorts #viral', ' 🕺 Bailando', ' 💃 Coreografía',
    ' 🎵 Para ti', ' 🔥 Challenge', ' #parati',
    ' 🏆 Viral Dance', ' 💫 Ritmo', ' ⚡ Short',
    ' 🎶 #fyp', ' 🌟 Trend', ' 🔁 Remix Short'
  ];

  // Canales de Shorts virales (fanáticos y cuentas de baile)
  const shortChannelGroups = [
    ['Dance Latinos 🕺', 'Bailando en Casa', 'Ritmo Viral', 'Merengue Challenge', 'Pasito Dominicano'],
    ['Dance Fitness RD', 'Coreografías Latinas', 'Baila Conmigo', 'Latin Vibes Shorts', 'El Baile del Momento'],
    ['Dembow Shorts', 'Virales RD', 'TikTok Merengue', 'Dance Trends 2025', 'Ritmo Latino Shorts'],
    ['Salsa y Merengue Shorts', 'Bailando con el Ritmo', 'Sabor Tropical Shorts', 'Bailar es Salud', 'Ritmo y Movimiento']
  ];

  for (let i = 0; i < actualCount; i++) {
    const seed = seedBase + i * 13 + 9999;
    const r = seededRandom(seed);

    const rank = i + 1;
    // Los Shorts virales tienen distribución aún más concentrada (exponente 1.8)
    const viewShare = (1 / Math.pow(rank, 1.8)) /
      Array.from({ length: actualCount }, (_, j) => 1 / Math.pow(j + 1, 1.8)).reduce((a, b) => a + b, 0);

    // Los Shorts generan vistas masivas relativas al tamaño del catálogo
    const shortViews = Math.round(baseViews * 1.5 * viewShare);

    // Shorts son más recientes (días, no años)
    const shortAgeDays = Math.round(1 + r * 120);
    const shortAgeHours = shortAgeDays * 24;
    const vph = shortAgeHours > 0 ? +(shortViews / shortAgeHours).toFixed(2) : 0;

    // CPM de Shorts es ~50% del CPM regular (YouTube Shorts Fund)
    const usdPerHour = +((vph * naState.cpm * 0.5) / 1000).toFixed(6);

    // Asignar canal según grupo
    const groupIdx = Math.floor(seededRandom(seed + 5555) * shortChannelGroups.length);
    const channelGroup = shortChannelGroups[groupIdx];
    const channelIdx = Math.floor(seededRandom(seed + 7777) * channelGroup.length);
    const channel = channelGroup[channelIdx];

    // Título del Short (más corto, más viral)
    const template = shortTemplates[Math.floor(seededRandom(seed + 3333) * shortTemplates.length)];
    const title = `${song.name}${template}`;

    shorts.push({
      id: i + 1,
      title,
      channel,
      url: `https://www.youtube.com/results?search_query=${encodeURIComponent(song.name + ' short')}`,
      views: shortViews,
      age_days: shortAgeDays,
      vph,
      est_usd_per_hour: usdPerHour,
      type: 'short',
      typeLabel: '📱 Short',
      isPirate: false,
      isOfficial: false,
      isShort: true,
      // Métricas específicas de Shorts
      viralScore: Math.min(99, Math.round(seededRandom(seed + 1111) * 100)),
      estViewsPerDay: Math.round(shortViews / Math.max(1, shortAgeDays))
    });
  }

  shorts.sort((a, b) => b.views - a.views);
  shorts.forEach((s, i) => { s.id = i + 1; });

  return shorts;
}

/* ══════════════════════════════════════════════
   GENERACIÓN DE AUDIO SHORTS (Shorts con este audio)
   ══════════════════════════════════════════════ */

function generateAudioShortsForSong(song, count) {
  // Genera shorts mock que simulan los "Shorts con este audio"
  // que aparecen en la página del video de YouTube.
  const shorts = [];
  const baseViews = song.views || 1000000;
  const seedBase = song.name.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const actualCount = Math.min(count || 15, 30);

  const audioChannelPools = [
    ['Remix Creator 🎧', 'Music Cover', 'Audio Remix', 'Sound Studio', 'Beat Maker'],
    ['Vocal Cover', 'Instrumental Cover', 'Remix Oficial', 'Mashup Master', 'Audio Edit'],
    ['Cover Latino', 'Remix Dominicano', 'Sonido Pro', 'Musica Original', 'Estudio Grabación'],
    ['Dj Mix Shorts', 'Producción Musical', 'Cover Academy', 'Audio Viral', 'Remix Factory'],
    ['Merengue Cover', 'Bachata Remix', 'Sabor Musical', 'Ritmo Studio', 'Piano Covers']
  ];

  const audioTemplates = [
    ' (Cover)', ' - Remix', ' 🎤 Cover Vocal', ' 🎸 Versión',
    ' 🎧 Remix 2025', ' (Recreación)', ' 🎹 Piano Cover', ' 🎵 Versión Acústica',
    ' 🔥 Remix', ' 🎶 Cover', ' (Audio Original)',
    ' 🎧 con este audio', ' 🎸 Tocando', ' 🎹 Al Piano', ' 🎤 Cantando'
  ];

  for (let i = 0; i < actualCount; i++) {
    const seed = seedBase + i * 17 + 5555;
    const r = seededRandom(seed);
    const rank = i + 1;
    const viewShare = (1 / Math.pow(rank, 1.3)) /
      Array.from({ length: actualCount }, (_, j) => 1 / Math.pow(j + 1, 1.3)).reduce((a, b) => a + b, 0);

    const shortViews = Math.round(baseViews * 0.8 * viewShare);
    const shortAgeDays = Math.round(5 + r * 200);
    const shortAgeHours = shortAgeDays * 24;
    const vph = shortAgeHours > 0 ? +(shortViews / shortAgeHours).toFixed(2) : 0;
    const usdPerHour = +((vph * naState.cpm * 0.5) / 1000).toFixed(6);

    const poolIdx = Math.floor(seededRandom(seed + 111) * audioChannelPools.length);
    const pool = audioChannelPools[poolIdx];
    const chIdx = Math.floor(seededRandom(seed + 222) * pool.length);
    const channel = pool[chIdx];

    const template = audioTemplates[Math.floor(seededRandom(seed + 333) * audioTemplates.length)];
    const title = `${song.name}${template}`;

    shorts.push({
      id: i + 1,
      title,
      channel,
      url: `https://www.youtube.com/results?search_query=${encodeURIComponent(song.name + ' cover')}`,
      views: shortViews,
      age_days: shortAgeDays,
      vph,
      est_usd_per_hour: usdPerHour,
      type: 'audio-short',
      typeLabel: '🎵 Audio Short',
      isPirate: false,
      isOfficial: false,
      isShort: true,
      source: 'audio-shelf-mock',
      audioSource: `https://www.youtube.com/watch?v=mock_${song.name.replace(/[^a-z]/gi, '')}`
    });
  }

  shorts.sort((a, b) => b.views - a.views);
  shorts.forEach((s, i) => { s.id = i + 1; });

  return shorts;
}

/* ══════════════════════════════════════════════
   CONSOLIDACIÓN POR CANAL PIRATA
   ══════════════════════════════════════════════ */

function consolidatePirateChannels(nodes) {
  const pirateNodes = nodes.filter(n => n.isPirate);
  const byChannel = {};

  pirateNodes.forEach(n => {
    if (!byChannel[n.channel]) {
      byChannel[n.channel] = {
        channel: n.channel,
        songs: [],
        totalViews: 0,
        totalVPH: 0,
        totalUSD: 0,
        nodeCount: 0
      };
    }
    byChannel[n.channel].songs.push(n);
    byChannel[n.channel].totalViews += n.views;
    byChannel[n.channel].totalVPH += n.vph;
    byChannel[n.channel].totalUSD += n.est_usd_per_hour;
    byChannel[n.channel].nodeCount++;
  });

  return Object.values(byChannel).sort((a, b) => b.totalViews - a.totalViews);
}

function getPirateTotals(nodes) {
  const pirates = nodes.filter(n => n.isPirate);
  return {
    totalPirates: pirates.length,
    uniqueChannels: new Set(pirates.map(n => n.channel)).size,
    totalViews: pirates.reduce((a, n) => a + n.views, 0),
    totalVPH: pirates.reduce((a, n) => a + n.vph, 0),
    totalUSD: pirates.reduce((a, n) => a + n.est_usd_per_hour, 0)
  };
}

/* ══════════════════════════════════════════════
   CONSOLIDACIÓN DE SHORTS POR CANAL
   ══════════════════════════════════════════════ */

function consolidateShortsByChannel(shorts) {
  const byChannel = {};

  shorts.forEach(s => {
    if (!byChannel[s.channel]) {
      byChannel[s.channel] = {
        channel: s.channel,
        shorts: [],
        totalViews: 0,
        totalVPH: 0,
        totalUSD: 0,
        totalVPD: 0,
        shortCount: 0
      };
    }
    byChannel[s.channel].shorts.push(s);
    byChannel[s.channel].totalViews += s.views;
    byChannel[s.channel].totalVPH += s.vph;
    byChannel[s.channel].totalUSD += s.est_usd_per_hour;
    byChannel[s.channel].totalVPD += s.estViewsPerDay || 0;
    byChannel[s.channel].shortCount++;
  });

  return Object.values(byChannel).sort((a, b) => b.totalViews - a.totalViews);
}

function getShortsTotals(shorts) {
  return {
    totalShorts: shorts.length,
    uniqueChannels: new Set(shorts.map(s => s.channel)).size,
    totalViews: shorts.reduce((a, s) => a + s.views, 0),
    totalVPH: shorts.reduce((a, s) => a + s.vph, 0),
    totalUSD: shorts.reduce((a, s) => a + s.est_usd_per_hour, 0),
    totalVPD: shorts.reduce((a, s) => a + (s.estViewsPerDay || 0), 0),
    avgViralScore: Math.round(shorts.reduce((a, s) => a + (s.viralScore || 0), 0) / Math.max(1, shorts.length))
  };
}

/* ══════════════════════════════════════════════
   BÚSQUEDA POR ARTISTA
   ══════════════════════════════════════════════ */

function searchArtistCatalog(artistName, maxNodes, cpm) {
  naState.searchQuery = artistName.trim().toLowerCase();
  naState.maxNodes = parseInt(maxNodes) || 100;
  naState.cpm = parseFloat(cpm) || 1.50;
  naState.naSearchMode = 'artist';
  naState.selectedIds = new Set();
  naState.naView = 'nodes';

  const fullCatalog = getFullCatalog();
  const allSongs = getCatalogSongs();

  // Buscar por nombre de catálogo o artista
  const matchedCatalogs = fullCatalog.filter(c =>
    c.name.toLowerCase().includes(naState.searchQuery) ||
    c.id.toLowerCase().includes(naState.searchQuery)
  );

  if (matchedCatalogs.length > 0) {
    naState.targetArtist = {
      name: matchedCatalogs.map(c => c.id + ' · ' + c.name).join(', '),
      songCount: allSongs.filter(s => matchedCatalogs.some(c => c.id === s.catalogId)).length
    };
    naState.artistSongs = allSongs.filter(s => matchedCatalogs.some(c => c.id === s.catalogId));
    showArtistResults(naState.artistSongs);
    return;
  }

  // Si no encuentra en la base, tratar como artista externo
  naState.targetArtist = { name: artistName.trim(), songCount: 0 };
  naState.artistSongs = [];
  // Generar una canción estimada genérica
  const estimatedSong = {
    name: artistName.trim() + ' - Canción Representativa',
    views: Math.round(5000000 + Math.random() * 20000000),
    nodes: Math.round(50 + Math.random() * 300),
    yield: 0, audited: false, catalogId: 'EXT', catalogName: 'Catálogo Externo'
  };
  naState.nodes = generateNodesForSong(estimatedSong, naState.maxNodes);
  naState.filteredNodes = [...naState.nodes];
  naState.targetSong = estimatedSong;
  renderResults();
  showNodesReady(estimatedSong, true);
}

function showArtistResults(songs) {
  const container = document.getElementById('nodeauditor-container');
  const metrics = document.getElementById('na-metrics');
  const wrapper = document.querySelector('.na-table-wrapper');
  const info = document.getElementById('na-catalog-info');

  // Esconder tabla, mostrar grid de canciones
  if (wrapper) wrapper.innerHTML = `
    <div style="padding:16px;">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;flex-wrap:wrap;gap:8px;">
        <div>
          <span style="font-size:16px;font-weight:600;">🎵 ${songs.length} canciones encontradas</span>
          <span style="font-size:11px;color:var(--muted);margin-left:8px;">en el catálogo</span>
        </div>
        <button class="btn btn-sm" onclick="auditAllArtistSongs()" style="background:var(--accent);color:#0d0d0f;font-size:11px;">📊 Auditar Todas</button>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:8px;">
        ${songs.map(s => `
          <div style="background:var(--bg3);border:0.5px solid var(--border);border-radius:var(--radius);padding:10px 14px;cursor:pointer;transition:all 0.12s;"
               onmouseover="this.style.borderColor='var(--accent)'"
               onmouseout="this.style.borderColor=''"
               onclick="auditSingleSong('${s.name.replace(/'/g, "\\'")}', ${s.nodes || 50}, ${s.views || 1000000}, '${s.catalogId || 'EXT'}')">
            <div style="font-size:13px;font-weight:500;color:var(--text2);">${s.name}</div>
            <div style="font-size:10px;color:var(--muted2);margin-top:4px;display:flex;gap:12px;">
              <span>📂 ${s.catalogName || s.catalogId}</span>
              <span>👁️ ${(s.views || 0).toLocaleString('en-US')} vistas</span>
              <span>🔗 ${(s.nodes || 0).toLocaleString('en-US')} nodos</span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  // Actualizar métricas
  const totalViews = songs.reduce((a, s) => a + (s.views || 0), 0);
  const totalNodes = songs.reduce((a, s) => a + (s.nodes || 0), 0);
  metrics.innerHTML = `
    <div class="na-metric-card"><div class="na-metric-label">Canciones</div><div class="na-metric-value" style="font-size:22px;">${songs.length}</div></div>
    <div class="na-metric-card"><div class="na-metric-label">Vistas Totales</div><div class="na-metric-value" style="color:var(--emerald);font-size:20px;">${(totalViews / 1000000).toFixed(1)}M</div></div>
    <div class="na-metric-card"><div class="na-metric-label">Nodos Totales</div><div class="na-metric-value" style="color:var(--info-bright);font-size:20px;">${totalNodes.toLocaleString('en-US')}</div></div>
    <div class="na-metric-card"><div class="na-metric-label">Acción</div><div style="font-size:11px;color:var(--muted);margin-top:6px;">Haz clic en una canción para auditar sus nodos</div></div>
  `;

  if (info) info.style.display = 'none';
  document.getElementById('na-export-btn').disabled = true;
}

function auditSingleSong(name, nodes, views, catId) {
  const song = { name, nodes: nodes || 50, views: views || 1000000, yield: 0, audited: false, catalogId: catId || 'EXT', catalogName: 'Catálogo' };
  naState.targetSong = song;
  naState.nodes = generateNodesForSong(song, naState.maxNodes);
  naState.filteredNodes = [...naState.nodes];
  naState.shorts = generateShortsForSong(song, 25);
  naState.shortsFiltered = [...naState.shorts];
  naState.audioShorts = generateAudioShortsForSong(song, 15);
  naState.audioShortsFiltered = [...naState.audioShorts];
  naState.naSearchMode = 'song';
  renderResults();
  showNodesReady(song);
}

function auditAllArtistSongs() {
  const songs = naState.artistSongs;
  if (!songs || songs.length === 0) return;

  const toAudit = songs.slice(0, Math.min(20, songs.length));
  const btn = document.getElementById('na-search-btn');
  if (btn) { btn.disabled = true; btn.textContent = '⏳ Auditando catálogo...'; }

  // Si tiene datos reales activados, llamar a la API batch
  if (naState.useRealData) {
    const payload = {
      songs: toAudit.map(s => ({ name: s.name })),
      max_nodes_per_song: Math.min(20, naState.maxNodes),
      cpm: naState.cpm,
      include_shorts: true
    };

    fetch(naState.apiBaseUrl + '/api/audit/batch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(120000)
    })
      .then(r => r.json())
      .then(data => {
        if (data.status === 'success') {
          naState.nodes = (data.nodes || []).map(n => ({ ...n, selected: true }));
          naState.filteredNodes = [...naState.nodes];
          naState.shorts = (data.shorts || []).map(s => ({ ...s, isShort: true }));
          naState.shortsFiltered = [...naState.shorts];
          naState.audioShorts = (data.audio_shorts || []).map(s => ({ ...s, source: 'audio-shelf' }));
          naState.audioShortsFiltered = [...naState.audioShorts];
          naState.targetSong = { name: toAudit.length + ' canciones del catálogo' };
          renderResults();
          showNodesReady(naState.targetSong);
        }
      })
      .catch(err => {
        console.error('Batch API error:', err);
        alert('Error conectando al backend. Usando datos simulados.');
        generateMockBatch(toAudit);
      })
      .finally(() => {
        if (btn) { btn.disabled = false; btn.textContent = '🔍 Iniciar Extracción'; }
      });
  } else {
    generateMockBatch(toAudit);
    if (btn) { btn.disabled = false; btn.textContent = '🔍 Iniciar Extracción'; }
  }
}

function generateMockBatch(toAudit) {
  let allNodes = [];
  let allShorts = [];
  let nodeId = 1;
  toAudit.forEach(s => {
    const songNodes = generateNodesForSong(
      { name: s.name, nodes: s.nodes || 50, views: s.views || 1000000, yield: 0, audited: false, catalogId: s.catalogId, catalogName: s.catalogName },
      Math.min(30, naState.maxNodes)
    );
    songNodes.forEach(n => {
      n.id = nodeId++;
      n.songName = s.name;
      allNodes.push(n);
    });
    // Generar Shorts para cada canción
    const songShorts = generateShortsForSong(
      { name: s.name, views: s.views || 1000000 },
      15
    );
    songShorts.forEach(sh => {
      sh.songName = s.name;
      allShorts.push(sh);
    });
  });
  naState.nodes = allNodes;
  naState.filteredNodes = [...allNodes];
  naState.shorts = allShorts;
  naState.shortsFiltered = [...allShorts];
  // Generar audio shorts mock para el batch
  const allAudioShorts = [];
  toAudit.forEach(s => {
    const audioShorts = generateAudioShortsForSong(
      { name: s.name, views: s.views || 1000000 },
      8
    );
    audioShorts.forEach(sh => {
      sh.songName = s.name;
      allAudioShorts.push(sh);
    });
  });
  naState.audioShorts = allAudioShorts;
  naState.audioShortsFiltered = [...allAudioShorts];
  naState.targetSong = { name: toAudit.length + ' canciones de ' + (naState.targetArtist?.name || 'artista') };
  renderResults();
  showNodesReady(naState.targetSong);
}

/* ══════════════════════════════════════════════
   BÚSQUEDA POR CANCIÓN
   ══════════════════════════════════════════════ */

function searchNodes(query, maxNodes, cpm) {
  naState.searchQuery = query.trim().toLowerCase();
  naState.maxNodes = parseInt(maxNodes) || 100;
  naState.cpm = parseFloat(cpm) || 1.50;
  naState.selectedIds = new Set();
  naState.naView = 'nodes';

  if (!naState.searchQuery) {
    showEmptyState('Ingresa el nombre de una canción o artista para comenzar la auditoría.');
    return;
  }

  const allSongs = getCatalogSongs();
  const match = allSongs.find(s =>
    s.name.toLowerCase().includes(naState.searchQuery) ||
    naState.searchQuery.includes(s.name.toLowerCase())
  );

  if (match) {
    naState.targetSong = match;
    naState.nodes = generateNodesForSong(match, naState.maxNodes);
    naState.filteredNodes = [...naState.nodes];
    naState.shorts = generateShortsForSong(match, 25);
    naState.shortsFiltered = [...naState.shorts];
    naState.audioShorts = generateAudioShortsForSong(match, 15);
    naState.audioShortsFiltered = [...naState.audioShorts];
    renderResults();
    showNodesReady(match);
  } else {
    const audited = getAuditedSongs();
    const matchAudited = audited.find(s =>
      s.name.toLowerCase().includes(naState.searchQuery) ||
      naState.searchQuery.includes(s.name.toLowerCase())
    );
    if (matchAudited) {
      naState.targetSong = matchAudited;
      naState.nodes = generateNodesForSong(matchAudited, naState.maxNodes);
      naState.filteredNodes = [...naState.nodes];
      naState.shorts = generateShortsForSong(matchAudited, 25);
      naState.shortsFiltered = [...naState.shorts];
      naState.audioShorts = generateAudioShortsForSong(matchAudited, 15);
      naState.audioShortsFiltered = [...naState.audioShorts];
      renderResults();
      showNodesReady(matchAudited);
    } else {
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
      naState.shorts = generateShortsForSong(estimatedSong, 25);
      naState.shortsFiltered = [...naState.shorts];
      naState.audioShorts = generateAudioShortsForSong(estimatedSong, 15);
      naState.audioShortsFiltered = [...naState.audioShorts];
      renderResults();
      showNodesReady(estimatedSong, true);
    }
  }
}

/* ══════════════════════════════════════════════
   CURACIÓN
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

/* ── Cambiar vista ── */
function switchNAView(view) {
  naState.naView = view;
  // Resetear filtros al cambiar de vista
  if (view === 'shorts') {
    naState.shortsSearch = '';
    naState.shortsSortBy = 'views';
    naState.shortsChannelFilter = 'all';
    naState.shortsPage = 1;
    naState.shortsFiltered = [...naState.shorts];
  } else if (view === 'audioshorts') {
    naState.audioSearch = '';
    naState.audioSortBy = 'views';
    naState.audioChannelFilter = 'all';
    naState.audioPage = 1;
    naState.audioShortsFiltered = [...naState.audioShorts];
  }
  renderResults();
  // Update tab UI
  document.querySelectorAll('.na-view-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.view === view);
  });
  // Show/hide filter bars
  const shortsBar = document.getElementById('na-shorts-filter-bar');
  if (shortsBar) shortsBar.style.display = (view === 'shorts') ? 'flex' : 'none';
  const audioBar = document.getElementById('na-audio-filter-bar');
  if (audioBar) audioBar.style.display = (view === 'audioshorts') ? 'flex' : 'none';
}

/* ══════════════════════════════════════════════
   RENDERIZADO
   ══════════════════════════════════════════════ */

function renderNodeAuditor() {
  const container = document.getElementById('nodeauditor-container');
  const defaultQuery = 'Te Compro Tu Novia';

  container.innerHTML = `
    <div class="na-control-panel">
      <div class="na-control-header">
        <span class="na-control-title">🔍 Parámetros de Auditoría de Nodos + Shorts</span>
      </div>
      <div class="na-control-body">
        <!-- Modo de búsqueda -->
        <div style="display:flex;gap:8px;margin-bottom:12px;">
          <button class="na-search-mode-btn active" data-mode="song" onclick="setSearchMode('song')" id="na-mode-song">🎵 Buscar Canción</button>
          <button class="na-search-mode-btn" data-mode="artist" onclick="setSearchMode('artist')" id="na-mode-artist">🎤 Buscar Artista / Catálogo</button>
        </div>
        <div class="na-control-grid">
          <div class="na-field">
            <label id="na-search-label">Nombre de la Canción</label>
            <input type="text" id="na-search-input" value="${defaultQuery}"
              placeholder="Ej: Te Compro Tu Novia"
              onkeydown="if(event.key==='Enter')executeNodeSearch()" />
          </div>
          <div class="na-field">
            <label>Máx. Nodos</label>
            <input type="number" id="na-max-nodes" value="100" min="10" max="500" />
          </div>
          <div class="na-field">
            <label>CPM (USD)</label>
            <input type="number" id="na-cpm" value="1.50" min="0.10" step="0.10" />
          </div>
          <div class="na-field na-field-btn">
            <label>&nbsp;</label>
            <button class="btn btn-primary" onclick="executeNodeSearch()" id="na-search-btn" style="font-size:12px;">
              🔍 Iniciar Extracción
            </button>
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:8px;margin-top:10px;padding:8px 12px;background:var(--bg3);border-radius:var(--radius);">
          <span style="font-size:10px;color:var(--muted);">Fuente de datos:</span>
          <button class="na-source-btn active" data-source="mock" onclick="setDataSource('mock')" id="na-source-mock" style="font-size:10px;">📊 Datos del Catálogo</button>
          <button class="na-source-btn" data-source="api" onclick="setDataSource('api')" id="na-source-api" style="font-size:10px;">🌐 YouTube Real (API)</button>
          <span id="na-api-status" style="font-size:9px;color:var(--muted2);margin-left:auto;"></span>
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
    <div class="na-table-wrapper">        <div class="na-table-toolbar">
        <div class="na-table-toolbar-left">
          <!-- View Tabs -->
          <div class="na-view-tabs">
            <button class="na-view-tab active" data-view="nodes" onclick="switchNAView('nodes')">
              📋 Nodos <span id="na-tab-nodes-count" style="font-size:9px;opacity:0.7;"></span>
            </button>
            <button class="na-view-tab" data-view="pirates" onclick="switchNAView('pirates')">
              🏴‍☠️ Piratas <span id="na-tab-pirates-count" style="font-size:9px;opacity:0.7;"></span>
            </button>
            <button class="na-view-tab" data-view="shorts" onclick="switchNAView('shorts')" id="na-tab-shorts">
              📱 Shorts <span id="na-tab-shorts-count" style="font-size:9px;opacity:0.7;"></span>
            </button>
            <button class="na-view-tab" data-view="audioshorts" onclick="switchNAView('audioshorts')" id="na-tab-audioshorts">
              🎵 Audio <span id="na-tab-audioshorts-count" style="font-size:9px;opacity:0.7;"></span>
            </button>
          </div>
          <span id="na-nodes-info" style="font-size:11px;color:var(--muted);margin-left:8px;"></span>
          <span id="na-selection-bar" style="font-size:11px;color:var(--muted);margin-left:8px;"></span>
        </div>
        <div class="na-table-toolbar-right">
          <button class="btn btn-xs btn-ghost" onclick="selectAllNodes()" style="font-size:10px;display:none;" id="na-select-all-btn">✅ Todos</button>
          <button class="btn btn-xs btn-ghost" onclick="deselectAllNodes()" style="font-size:10px;display:none;" id="na-deselect-btn">❌ Ninguno</button>
          <button class="btn btn-xs btn-ghost" onclick="removeSelectedNodes()" id="na-remove-btn" style="font-size:10px;color:var(--danger);display:none;">🗑️ Eliminar</button>
          <button class="btn btn-xs" onclick="exportNodeReport()" id="na-export-btn" disabled style="font-size:10px;background:var(--accent);color:#0d0d0f;">📥 HTML</button>
          <button class="btn btn-xs btn-ghost" onclick="exportNodePDF()" id="na-export-pdf-btn" disabled style="font-size:10px;">📄 PDF</button>
        </div>
      </div>
      <!-- Shorts Filter Bar (hidden by default) -->
      <div id="na-shorts-filter-bar" style="display:none;padding:8px 16px;border-bottom:0.5px solid var(--border);background:var(--bg3);align-items:center;gap:8px;flex-wrap:wrap;">
        <input type="text" id="na-shorts-search" placeholder="🔍 Buscar Shorts por título o canal..."
          style="flex:1;min-width:120px;padding:6px 10px;background:var(--bg4);border:0.5px solid var(--border);border-radius:6px;color:var(--text);font-size:11px;font-family:var(--font);outline:none;"
          oninput="naState.shortsSearch=this.value;filterShorts()" />
        <select id="na-shorts-sort" style="padding:6px 10px;background:var(--bg4);border:0.5px solid var(--border);border-radius:6px;color:var(--text);font-size:11px;font-family:var(--font);outline:none;cursor:pointer;"
          onchange="applyShortsSort(this.value)">
          <option value="views">👁️ Por vistas</option>
          <option value="vph">📈 Por VPH</option>
          <option value="vpd">📅 Por vistas/día</option>
          <option value="viral">🔥 Por viral score</option>
          <option value="date">🕐 Más recientes</option>
        </select>
        <select id="na-shorts-channel-filter" style="padding:6px 10px;background:var(--bg4);border:0.5px solid var(--border);border-radius:6px;color:var(--text);font-size:11px;font-family:var(--font);outline:none;cursor:pointer;max-width:160px;"
          onchange="applyShortsChannelFilter(this.value)">
          <option value="all">📱 Todos los canales</option>
        </select>
        <button class="btn btn-xs btn-ghost" onclick="shortsPrevPage()" style="font-size:10px;" id="na-shorts-prev">◀</button>
        <span id="na-shorts-page-info" style="font-size:10px;color:var(--muted2);white-space:nowrap;">—</span>
        <button class="btn btn-xs btn-ghost" onclick="shortsNextPage()" style="font-size:10px;" id="na-shorts-next">▶</button>
      </div>
      <!-- Audio Shorts Filter Bar (hidden by default) -->
      <div id="na-audio-filter-bar" style="display:none;padding:8px 16px;border-bottom:0.5px solid var(--border);background:rgba(110,207,165,0.04);align-items:center;gap:8px;flex-wrap:wrap;border-top:0.5px solid rgba(110,207,165,0.1);">
        <span style="font-size:10px;color:var(--success-bright);font-weight:500;white-space:nowrap;">🎵 Shorts con este audio</span>
        <input type="text" id="na-audio-search" placeholder="🔍 Buscar por título o canal..."
          style="flex:1;min-width:120px;padding:6px 10px;background:var(--bg4);border:0.5px solid var(--border);border-radius:6px;color:var(--text);font-size:11px;font-family:var(--font);outline:none;"
          oninput="naState.audioSearch=this.value;filterAudioShorts()" />
        <select id="na-audio-sort" style="padding:6px 10px;background:var(--bg4);border:0.5px solid var(--border);border-radius:6px;color:var(--text);font-size:11px;font-family:var(--font);outline:none;cursor:pointer;"
          onchange="applyAudioSort(this.value)">
          <option value="views">👁️ Por vistas</option>
          <option value="vph">📈 Por VPH</option>
          <option value="date">🕐 Más recientes</option>
        </select>
        <select id="na-audio-channel-filter" style="padding:6px 10px;background:var(--bg4);border:0.5px solid var(--border);border-radius:6px;color:var(--text);font-size:11px;font-family:var(--font);outline:none;cursor:pointer;max-width:160px;"
          onchange="applyAudioChannelFilter(this.value)">
          <option value="all">🎵 Todos los canales</option>
        </select>
        <button class="btn btn-xs btn-ghost" onclick="audioPrevPage()" style="font-size:10px;" id="na-audio-prev">◀</button>
        <span id="na-audio-page-info" style="font-size:10px;color:var(--muted2);white-space:nowrap;">—</span>
        <button class="btn btn-xs btn-ghost" onclick="audioNextPage()" style="font-size:10px;" id="na-audio-next">▶</button>
      </div>
      <div class="na-table-scroll">
        <div id="na-table-container">
          <table class="na-table" id="na-node-table">
            <thead id="na-table-head"></thead>
            <tbody id="na-node-tbody"></tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="na-catalog-info" id="na-catalog-info" style="display:none;"></div>
  `;
}

/* ── Ejecutar búsqueda ── */
function setSearchMode(mode) {
  naState.naSearchMode = mode;
  document.querySelectorAll('.na-search-mode-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.mode === mode);
  });
  const label = document.getElementById('na-search-label');
  const input = document.getElementById('na-search-input');
  if (mode === 'artist') {
    if (label) label.textContent = 'Nombre del Artista / Catálogo';
    if (input) input.placeholder = 'Ej: Ramón Orlando, Juan Luis Guerra...';
  } else {
    if (label) label.textContent = 'Nombre de la Canción';
    if (input) input.placeholder = 'Ej: Te Compro Tu Novia';
  }
}

function setDataSource(source) {
  naState.useRealData = (source === 'api');
  document.querySelectorAll('.na-source-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.source === source);
  });
  const status = document.getElementById('na-api-status');
  if (source === 'api') {
    status.textContent = '🔌 Conectando al backend local...';
    fetch(naState.apiBaseUrl + '/api/health', { signal: AbortSignal.timeout(3000) })
      .then(r => r.json())
      .then(d => {
        if (d.status === 'ok') {
          status.textContent = '✅ API conectada en ' + naState.apiBaseUrl;
          status.style.color = 'var(--success-bright)';
        }
      })
      .catch(() => {
        status.textContent = '⚠️ API no disponible en ' + naState.apiBaseUrl + ' (inicia el backend)';
        status.style.color = 'var(--warning)';
      });
  } else {
    status.textContent = '📊 Usando datos del catálogo local + Shorts simulados';
    status.style.color = 'var(--muted2)';
  }
}

function executeNodeSearch() {
  const query = document.getElementById('na-search-input')?.value || '';
  const maxNodes = document.getElementById('na-max-nodes')?.value || 100;
  const cpm = document.getElementById('na-cpm')?.value || 1.50;

  const btn = document.getElementById('na-search-btn');
  if (btn) { btn.disabled = true; btn.textContent = '⏳ Extrayendo...'; }

  if (naState.useRealData) {
    fetch(naState.apiBaseUrl + '/api/audit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, max_nodes: parseInt(maxNodes), cpm: parseFloat(cpm), include_shorts: true }),
      signal: AbortSignal.timeout(30000)
    })
      .then(r => r.json())
      .then(data => {
        if (data.status === 'success') {
          naState.nodes = (data.nodes || []).map(n => ({
            ...n,
            isPirate: n.isPirate,
            isOfficial: n.isOfficial,
            selected: true
          }));
          naState.filteredNodes = [...naState.nodes];
          naState.shorts = (data.shorts || []).map(s => ({ ...s, isShort: true }));
          naState.shortsFiltered = [...naState.shorts];
          naState.audioShorts = (data.audio_shorts || []).map(s => ({ ...s, source: 'audio-shelf' }));
          naState.audioShortsFiltered = [...naState.audioShorts];
          naState.targetSong = { name: query, nodes: data.song_info?.totalNodes || data.total };
          renderResults();
          showNodesReady(naState.targetSong, false);
        } else {
          alert('Error de API: ' + (data.message || 'Error desconocido'));
        }
      })
      .catch(err => {
        console.error('API error:', err);
        alert('No se pudo conectar al backend. Asegúrate de que Flask esté corriendo en ' + naState.apiBaseUrl + '\n\nUsando datos simulados como respaldo...');
        if (naState.naSearchMode === 'artist') {
          searchArtistCatalog(query, maxNodes, cpm);
        } else {
          searchNodes(query, maxNodes, cpm);
        }
      })
      .finally(() => {
        if (btn) { btn.disabled = false; btn.textContent = '🔍 Iniciar Extracción'; }
      });
  } else {
    setTimeout(() => {
      if (naState.naSearchMode === 'artist') {
        searchArtistCatalog(query, maxNodes, cpm);
      } else {
        searchNodes(query, maxNodes, cpm);
      }
      if (btn) { btn.disabled = false; btn.textContent = '🔍 Iniciar Extracción'; }
    }, 300);
  }
}

/* ── Renderizar vista actual ── */
function renderResults() {
  if (naState.naView === 'shorts') {
    renderShortsView();
  } else if (naState.naView === 'audioshorts') {
    renderAudioShortsView();
  } else if (naState.naView === 'pirates') {
    renderPirateView();
  } else {
    renderNodeView();
  }
}

/* ── Vista de Nodos individuales ── */
function renderNodeView() {
  const thead = document.getElementById('na-table-head');
  const tbody = document.getElementById('na-node-tbody');
  const nodes = naState.filteredNodes;

  thead.innerHTML = `
    <tr>
      <th style="width:36px;text-align:center;">✓</th>
      <th style="width:36px;">#</th>
      <th>Título del Nodo</th>
      <th style="width:160px;">Canal</th>
      <th style="text-align:right;">Vistas</th>
      <th style="text-align:right;">Antigüedad</th>
      <th style="text-align:right;">VPH</th>
      <th style="text-align:right;">USD/h</th>
      <th style="text-align:center;width:54px;">🔗</th>
    </tr>
  `;

  if (!nodes || nodes.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" style="text-align:center;padding:40px 16px;color:var(--muted2);font-size:12px;">
      No se encontraron nodos para esta búsqueda.
    </td></tr>`;
    updateMetrics([]);
    document.getElementById('na-export-btn').disabled = true;
    document.getElementById('na-select-all-btn').style.display = 'none';
    document.getElementById('na-deselect-btn').style.display = 'none';
    document.getElementById('na-tab-pirates-count').textContent = '';
    document.getElementById('na-tab-shorts-count').textContent = '';
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
    else if (n.isPirate) typeBadge = '<span style="font-size:8px;background:rgba(224,92,92,0.15);color:var(--danger);padding:1px 5px;border-radius:3px;font-weight:600;">🏴‍☠️ PIRATA</span>';
    else if (n.type === 'lyrics') typeBadge = '<span style="font-size:8px;background:rgba(77,171,247,0.15);color:var(--info-bright);padding:1px 5px;border-radius:3px;font-weight:600;">LYRICS</span>';
    else typeBadge = '<span style="font-size:8px;background:rgba(255,255,255,0.05);color:var(--muted2);padding:1px 5px;border-radius:3px;font-weight:600;">COVER</span>';

    const rowBg = n.isPirate ? 'style="background:rgba(224,92,92,0.03);"' : '';

    html += `
      <tr class="na-node-row ${isSelected ? 'na-row-selected' : ''}" ${rowBg} data-node-id="${n.id}">
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
          <div style="font-size:11px;color:${n.isPirate ? 'var(--danger)' : 'var(--text2)'};">${n.channel}</div>
        </td>
        <td style="text-align:right;font-family:var(--mono);font-size:12px;color:var(--text);">${n.views.toLocaleString('en-US')}</td>
        <td style="text-align:right;font-family:var(--mono);font-size:11px;color:var(--muted);">${ageStr}</td>
        <td style="text-align:right;font-family:var(--mono);font-size:12px;font-weight:600;color:var(--info-bright);">${n.vph.toFixed(2)}</td>
        <td style="text-align:right;font-family:var(--mono);font-size:12px;color:${n.isPirate ? 'var(--danger)' : 'var(--orange-bright)'};">$${n.est_usd_per_hour.toFixed(4)}</td>
        <td style="text-align:center;">
          <a href="${n.url}" target="_blank" class="na-node-link" title="Buscar video en YouTube">🔍</a>
          <button class="na-node-remove" onclick="removeNode(${n.id})" title="Eliminar nodo">✕</button>
        </td>
      </tr>
    `;
  });

  tbody.innerHTML = html;
  updateMetrics(nodes);

  const info = document.getElementById('na-nodes-info');
  const totalNodes = naState.nodes.length;
  const shownNodes = nodes.length;
  info.innerHTML = shownNodes < totalNodes
    ? `<strong>${shownNodes}</strong> de <strong>${totalNodes}</strong> nodos`
    : `<strong>${totalNodes}</strong> nodos`;

  // Update pirate tab count
  const pirateCount = nodes.filter(n => n.isPirate).length;
  document.getElementById('na-tab-pirates-count').textContent = `(${pirateCount})`;
  // Update shorts tab count
  document.getElementById('na-tab-shorts-count').textContent = `(${naState.shorts.length})`;
  // Update audio shorts tab count
  document.getElementById('na-tab-audioshorts-count').textContent = `(${naState.audioShorts.length})`;

  document.getElementById('na-export-btn').disabled = false;
  document.getElementById('na-select-all-btn').style.display = 'inline-flex';
  document.getElementById('na-deselect-btn').style.display = 'inline-flex';
  document.getElementById('na-remove-btn').style.display = 'inline-flex';
}

/* ── Vista Consolidada de Canales Piratas ── */
function renderPirateView() {
  const thead = document.getElementById('na-table-head');
  const tbody = document.getElementById('na-node-tbody');
  const nodes = naState.filteredNodes;
  const pirates = nodes.filter(n => n.isPirate);
  const consolidated = consolidatePirateChannels(nodes);
  const totals = getPirateTotals(nodes);

  thead.innerHTML = `
    <tr>
      <th style="width:36px;">#</th>
      <th style="width:180px;">Canal Pirata</th>
      <th style="text-align:center;">Canciones</th>
      <th style="text-align:right;">Vistas Robadas</th>
      <th style="text-align:right;">VPH Total</th>
      <th style="text-align:right;">USD/h Robado</th>
      <th style="text-align:right;">Pérdida Est./mes</th>
      <th style="text-align:center;width:60px;">Acción</th>
    </tr>
  `;

  if (pirates.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;padding:40px 16px;color:var(--muted2);font-size:12px;">
      🏴‍☠️ No se detectaron canales piratas en esta búsqueda.
    </td></tr>`;
    updateMetrics(nodes);
    document.getElementById('na-export-btn').disabled = false;
    document.getElementById('na-select-all-btn').style.display = 'none';
    document.getElementById('na-deselect-btn').style.display = 'none';
    document.getElementById('na-remove-btn').style.display = 'none';
    return;
  }

  let html = '';
  consolidated.forEach((ch, i) => {
    const monthlyLoss = ch.totalUSD * 730;
    const monthlyStr = monthlyLoss >= 1000
      ? '$' + (monthlyLoss / 1000).toFixed(1) + 'K'
      : '$' + monthlyLoss.toFixed(0);

    const topSongs = ch.songs.slice(0, 3).map(s => s.title.split(' (')[0]).join(', ');
    const extra = ch.songs.length > 3 ? ` y ${ch.songs.length - 3} más` : '';

    html += `
      <tr class="na-node-row" style="background:rgba(224,92,92,0.03);">
        <td style="font-family:var(--mono);font-size:11px;color:var(--muted);text-align:center;">${i + 1}</td>
        <td>
          <div style="font-size:13px;font-weight:600;color:var(--danger);">🏴‍☠️ ${ch.channel}</div>
          <div style="font-size:10px;color:var(--muted2);margin-top:2px;">${topSongs}${extra}</div>
        </td>
        <td style="text-align:center;font-family:var(--mono);font-size:14px;font-weight:600;color:var(--text);">${ch.nodeCount}</td>
        <td style="text-align:right;font-family:var(--mono);font-size:13px;font-weight:600;color:var(--emerald);">${ch.totalViews.toLocaleString('en-US')}</td>
        <td style="text-align:right;font-family:var(--mono);font-size:13px;font-weight:600;color:var(--info-bright);">${ch.totalVPH.toFixed(1)}</td>
        <td style="text-align:right;font-family:var(--mono);font-size:13px;font-weight:600;color:var(--danger);">$${ch.totalUSD.toFixed(4)}</td>
        <td style="text-align:right;font-family:var(--mono);font-size:13px;font-weight:600;color:var(--orange-bright);">${monthlyStr}</td>
        <td style="text-align:center;">
          <a href="https://www.youtube.com/results?search_query=${encodeURIComponent(ch.channel)}" target="_blank" class="na-node-link" title="Buscar canal en YouTube">🔍</a>
        </td>
      </tr>
    `;
  });

  const totalMonthlyLoss = totals.totalUSD * 730;
  const totalMonthlyStr = totalMonthlyLoss >= 1000
    ? '$' + (totalMonthlyLoss / 1000).toFixed(1) + 'K'
    : '$' + totalMonthlyLoss.toFixed(0);

  html += `
    <tr style="background:var(--bg4);font-weight:700;">
      <td style="font-family:var(--mono);font-size:11px;color:var(--muted);text-align:center;padding:10px 8px;">—</td>
      <td style="font-size:13px;color:var(--danger);padding:10px 8px;"><strong>TOTAL PIRATAS</strong></td>
      <td style="text-align:center;font-family:var(--mono);font-size:14px;color:var(--text);padding:10px 8px;">${totals.totalPirates}</td>
      <td style="text-align:right;font-family:var(--mono);font-size:14px;color:var(--emerald);padding:10px 8px;">${totals.totalViews.toLocaleString('en-US')}</td>
      <td style="text-align:right;font-family:var(--mono);font-size:14px;color:var(--info-bright);padding:10px 8px;">${totals.totalVPH.toFixed(1)}</td>
      <td style="text-align:right;font-family:var(--mono);font-size:14px;color:var(--danger);padding:10px 8px;">$${totals.totalUSD.toFixed(4)}</td>
      <td style="text-align:right;font-family:var(--mono);font-size:14px;color:var(--orange-bright);padding:10px 8px;">${totalMonthlyStr}</td>
      <td style="text-align:center;padding:10px 8px;">—</td>
    </tr>
  `;

  tbody.innerHTML = html;

  document.getElementById('na-metric-nodes').innerHTML = `${totals.uniqueChannels} <span style="font-size:11px;font-weight:400;color:var(--muted);font-family:var(--font);">canales</span>`;
  document.getElementById('na-metric-views').innerHTML = `${totals.totalViews.toLocaleString('en-US')} <span style="font-size:11px;font-weight:400;color:var(--muted);font-family:var(--font);">robadas</span>`;
  document.getElementById('na-metric-vph').innerHTML = `${totals.totalVPH.toFixed(1)} <span style="font-size:11px;font-weight:400;color:var(--muted);font-family:var(--font);">v/h</span>`;
  document.getElementById('na-metric-usd').innerHTML = `$${totals.totalUSD.toFixed(4)} <span style="font-size:11px;font-weight:400;color:var(--danger);font-family:var(--font);">/h robados</span>`;

  const info = document.getElementById('na-nodes-info');
  info.innerHTML = `<strong style="color:var(--danger);">${totals.totalPirates}</strong> nodos piratas en <strong style="color:var(--danger);">${totals.uniqueChannels}</strong> canales`;

  document.getElementById('na-export-btn').disabled = false;
  document.getElementById('na-select-all-btn').style.display = 'none';
  document.getElementById('na-deselect-btn').style.display = 'none';
  document.getElementById('na-remove-btn').style.display = 'none';
}

/* ── Filtros de Shorts ── */
function filterShorts() {
  const search = naState.shortsSearch.toLowerCase().trim();
  const sortBy = naState.shortsSortBy;
  const channelFilter = naState.shortsChannelFilter;
  
  let filtered = [...naState.shorts];
  
  // Búsqueda por título
  if (search) {
    filtered = filtered.filter(s => 
      s.title.toLowerCase().includes(search) || 
      s.channel.toLowerCase().includes(search)
    );
  }
  
  // Filtro por canal
  if (channelFilter !== 'all') {
    filtered = filtered.filter(s => s.channel === channelFilter);
  }
  
  // Ordenamiento
  if (sortBy === 'views') {
    filtered.sort((a, b) => b.views - a.views);
  } else if (sortBy === 'vph') {
    filtered.sort((a, b) => b.vph - a.vph);
  } else if (sortBy === 'date') {
    filtered.sort((a, b) => a.age_days - b.age_days);
  } else if (sortBy === 'viral') {
    filtered.sort((a, b) => (b.viralScore || 0) - (a.viralScore || 0));
  } else if (sortBy === 'vpd') {
    filtered.sort((a, b) => (b.estViewsPerDay || 0) - (a.estViewsPerDay || 0));
  }
  
  naState.shortsFiltered = filtered;
  naState.shortsPage = 1;
  renderShortsView();
}

function applyShortsSort(sortBy) {
  naState.shortsSortBy = sortBy;
  filterShorts();
  document.querySelectorAll('.na-sort-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.sort === sortBy);
  });
}

function applyShortsChannelFilter(channel) {
  naState.shortsChannelFilter = channel;
  filterShorts();
  document.querySelectorAll('.na-channel-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.channel === channel);
  });
}

function shortsPrevPage() {
  if (naState.shortsPage > 1) {
    naState.shortsPage--;
    renderShortsView();
  }
}

function shortsNextPage() {
  const maxPage = Math.ceil(naState.shortsFiltered.length / naState.shortsPerPage);
  if (naState.shortsPage < maxPage) {
    naState.shortsPage++;
    renderShortsView();
  }
}

/* ══════════════════════════════════════════════
   FILTROS DE AUDIO SHORTS
   ══════════════════════════════════════════════ */

function filterAudioShorts() {
  const search = naState.audioSearch.toLowerCase().trim();
  const sortBy = naState.audioSortBy;
  const channelFilter = naState.audioChannelFilter;
  
  let filtered = [...naState.audioShorts];
  
  if (search) {
    filtered = filtered.filter(s => 
      s.title.toLowerCase().includes(search) || 
      s.channel.toLowerCase().includes(search)
    );
  }
  
  if (channelFilter !== 'all') {
    filtered = filtered.filter(s => s.channel === channelFilter);
  }
  
  if (sortBy === 'views') {
    filtered.sort((a, b) => b.views - a.views);
  } else if (sortBy === 'vph') {
    filtered.sort((a, b) => b.vph - a.vph);
  } else if (sortBy === 'date') {
    filtered.sort((a, b) => a.age_days - b.age_days);
  }
  
  naState.audioShortsFiltered = filtered;
  naState.audioPage = 1;
  renderAudioShortsView();
}

function applyAudioSort(sortBy) {
  naState.audioSortBy = sortBy;
  filterAudioShorts();
}

function applyAudioChannelFilter(channel) {
  naState.audioChannelFilter = channel;
  filterAudioShorts();
}

function audioPrevPage() {
  if (naState.audioPage > 1) {
    naState.audioPage--;
    renderAudioShortsView();
  }
}

function audioNextPage() {
  const maxPage = Math.ceil(naState.audioShortsFiltered.length / naState.audioPerPage);
  if (naState.audioPage < maxPage) {
    naState.audioPage++;
    renderAudioShortsView();
  }
}

/* ══════════════════════════════════════════════
   VISTA DE SHORTS VIRALES
   ══════════════════════════════════════════════ */

function renderShortsView() {
  const thead = document.getElementById('na-table-head');
  const tbody = document.getElementById('na-node-tbody');
  const shorts = naState.shortsFiltered;
  const consolidated = consolidateShortsByChannel(shorts);
  const totals = getShortsTotals(shorts);

  thead.innerHTML = `
    <tr>
      <th style="width:36px;">#</th>
      <th style="width:170px;">Canal Viral</th>
      <th>Título del Short</th>
      <th style="text-align:right;width:110px;">Vistas</th>
      <th style="text-align:right;width:70px;">Edad</th>
      <th style="text-align:right;width:70px;">VPH</th>
      <th style="text-align:right;width:80px;">Vistas/día</th>
      <th style="text-align:right;width:80px;">USD/h</th>
      <th style="text-align:center;width:54px;">🔗</th>
    </tr>
  `;

  if (!shorts || shorts.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" style="text-align:center;padding:40px 16px;color:var(--muted2);font-size:12px;">
      📱 No se detectaron Shorts virales para esta búsqueda.<br>
      <span style="font-size:11px;color:var(--muted);">Los Shorts se generan automáticamente al auditar una canción.</span>
    </td></tr>`;
    updateShortsMetrics(shorts);
    document.getElementById('na-export-btn').disabled = false;
    document.getElementById('na-select-all-btn').style.display = 'none';
    document.getElementById('na-deselect-btn').style.display = 'none';
    document.getElementById('na-remove-btn').style.display = 'none';
    return;
  }

  // ── Filter Bar visible ──
  const filterBar = document.getElementById('na-shorts-filter-bar');
  if (filterBar) filterBar.style.display = 'flex';
  
  // ── Poblar dropdown de canales ──
  const channelSelect = document.getElementById('na-shorts-channel-filter');
  if (channelSelect && channelSelect.options.length <= 1) {
    const channels = [...new Set(shorts.map(s => s.channel))].sort();
    channels.forEach(ch => {
      const opt = document.createElement('option');
      opt.value = ch;
      opt.textContent = `📱 ${ch.substring(0, 30)}`;
      channelSelect.appendChild(opt);
    });
  }
  
  // ── Actualizar paginación ──
  const pageInfo = document.getElementById('na-shorts-page-info');
  if (pageInfo) {
    pageInfo.textContent = `${naState.shortsPage}/${maxPage}`;
  }

  // ── Paginación ──
  const startIdx = (naState.shortsPage - 1) * naState.shortsPerPage;
  const endIdx = Math.min(startIdx + naState.shortsPerPage, shorts.length);
  const pageShorts = shorts.slice(startIdx, endIdx);
  const maxPage = Math.ceil(shorts.length / naState.shortsPerPage);

  // ── Top Bar Chart ──
  const maxViews = consolidated.length > 0 ? consolidated[0].totalViews : 1;
  let html = '';

  // Primero: métricas consolidadas por canal
  html += `<tr><td colspan="9" style="padding:0;"><div style="padding:10px 14px;background:rgba(92,140,224,0.06);border-bottom:0.5px solid rgba(92,140,224,0.15);">
    <div style="display:flex;gap:14px;flex-wrap:wrap;margin-bottom:8px;">
      <span style="font-size:11px;color:var(--muted);">🏆 <strong style="color:var(--text2);">${totals.totalShorts}</strong> Shorts · <strong style="color:var(--text2);">${totals.uniqueChannels}</strong> canales virales</span>
      <span style="font-size:11px;color:var(--muted);">👁️ <strong style="color:var(--emerald);">${totals.totalViews.toLocaleString('en-US')}</strong> vistas totales</span>
      <span style="font-size:11px;color:var(--muted);">📈 <strong style="color:var(--info-bright);">${totals.totalVPD.toLocaleString('en-US')}</strong> vistas/día</span>
      <span style="font-size:11px;color:var(--muted);">💎 Viral Score: <strong style="color:${totals.avgViralScore > 70 ? 'var(--success)' : 'var(--warning)'};">${totals.avgViralScore}/100</strong></span>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:8px;">
      <div style="background:var(--bg3);border-radius:var(--radius);padding:10px;">
        <div style="font-size:9px;font-weight:600;color:var(--info-bright);text-transform:uppercase;letter-spacing:0.03em;margin-bottom:8px;text-align:center;">📊 Distribución por Canal</div>
        ${renderDonutChart(consolidated.slice(0, 12), 'totalViews', 'channel', 160, 28)}
      </div>
      <div>
        <div style="font-size:9px;font-weight:600;color:var(--info-bright);text-transform:uppercase;letter-spacing:0.03em;margin-bottom:8px;text-align:center;">📈 Top Canales (barras)</div>
        <div style="display:flex;gap:3px;height:120px;align-items:flex-end;padding:0 4px;">
          ${consolidated.slice(0, 8).map(ch => {
            const h = Math.max(4, (ch.totalViews / (consolidated[0]?.totalViews || 1)) * 100);
            const color = ch.totalViews > (consolidated[0]?.totalViews || 1) * 0.5 ? 'var(--info-bright)' : ch.totalViews > (consolidated[0]?.totalViews || 1) * 0.2 ? 'var(--info)' : 'var(--muted2)';
            return `<div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;height:100%;">
              <div style="font-size:7px;color:var(--muted2);margin-bottom:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:50px;text-align:center;line-height:1.2;">${ch.channel.substring(0, 6)}</div>
              <div style="width:100%;height:${Math.round(h)}%;background:${color};border-radius:3px 3px 0 0;min-height:3px;transition:height 0.4s ease-out;" title="${ch.channel}: ${ch.totalViews.toLocaleString()} vistas"></div>
            </div>`;
          }).join('')}
        </div>
        <div style="font-size:8px;color:var(--muted2);margin-top:4px;text-align:center;">Top canales por vistas totales</div>
      </div>
    </div>
  </div></td></tr>`;

  // Tabla de Shorts individuales (paginada)
  pageShorts.forEach((s, i) => {
    const ageStr = s.age_days < 30 ? Math.round(s.age_days) + ' días'
      : Math.round(s.age_days / 30) + ' meses';

    const viralBadge = s.viralScore > 80
      ? '<span style="font-size:8px;background:rgba(224,92,92,0.15);color:var(--danger);padding:1px 5px;border-radius:3px;font-weight:600;">🔥 VIRAL</span>'
      : s.viralScore > 60
      ? '<span style="font-size:8px;background:rgba(224,184,92,0.15);color:var(--warning);padding:1px 5px;border-radius:3px;font-weight:600;">⚡ TRENDING</span>'
      : '<span style="font-size:8px;background:rgba(92,140,224,0.15);color:var(--info);padding:1px 5px;border-radius:3px;font-weight:600;">📈 ACTIVO</span>';

    const viewsColor = s.views > 5000000 ? 'var(--danger)' : s.views > 1000000 ? 'var(--warning)' : 'var(--text)';

    html += `
      <tr class="na-node-row" style="background:rgba(92,140,224,0.02);cursor:pointer;" 
          onclick="showShortDetail(naState.shortsFiltered[${startIdx + i}])"
          onmouseover="this.style.background='rgba(92,140,224,0.08)'"
          onmouseout="this.style.background='rgba(92,140,224,0.02)'">
        <td style="font-family:var(--mono);font-size:11px;color:var(--muted);text-align:center;">${startIdx + i + 1}</td>
        <td>
          <div style="font-size:12px;font-weight:500;color:var(--info-bright);">📱 ${s.channel}</div>
          <div style="font-size:10px;color:var(--muted2);margin-top:1px;">${viralBadge}</div>
        </td>
        <td>
          <div style="font-size:12px;font-weight:500;color:var(--text2);">${s.title}</div>
          <div style="font-size:9px;color:var(--muted2);margin-top:1px;">Score viral: ${s.viralScore}/100</div>
        </td>
        <td style="text-align:right;font-family:var(--mono);font-size:12px;font-weight:600;color:${viewsColor};">${s.views.toLocaleString('en-US')}</td>
        <td style="text-align:right;font-family:var(--mono);font-size:11px;color:var(--muted);">${ageStr}</td>
        <td style="text-align:right;font-family:var(--mono);font-size:12px;font-weight:600;color:var(--info-bright);">${s.vph.toFixed(2)}</td>
        <td style="text-align:right;font-family:var(--mono);font-size:12px;font-weight:600;color:var(--accent);">${(s.estViewsPerDay || 0).toLocaleString()}</td>
        <td style="text-align:right;font-family:var(--mono);font-size:12px;color:var(--orange-bright);">$${s.est_usd_per_hour.toFixed(6)}</td>
        <td style="text-align:center;">
          <a href="${s.url}" target="_blank" class="na-node-link" title="Buscar Short en YouTube" onclick="event.stopPropagation()">🔍</a>
        </td>
      </tr>
    `;
  });

  // Totales
  const totalMonthlyLoss = totals.totalUSD * 730;
  html += `
    <tr style="background:var(--bg4);font-weight:700;">
      <td style="font-family:var(--mono);font-size:11px;color:var(--muted);text-align:center;padding:10px 8px;">—</td>
      <td style="padding:10px 8px;" colspan="2"><strong style="color:var(--info-bright);">TOTAL SHORTS</strong></td>
      <td style="text-align:right;font-family:var(--mono);font-size:14px;color:var(--emerald);padding:10px 8px;">${totals.totalViews.toLocaleString('en-US')}</td>
      <td style="text-align:right;padding:10px 8px;">—</td>
      <td style="text-align:right;font-family:var(--mono);font-size:14px;color:var(--info-bright);padding:10px 8px;">${totals.totalVPH.toFixed(1)}</td>
      <td style="text-align:right;font-family:var(--mono);font-size:14px;color:var(--accent);padding:10px 8px;">${totals.totalVPD.toLocaleString()}</td>
      <td style="text-align:right;font-family:var(--mono);font-size:14px;color:var(--orange-bright);padding:10px 8px;">$${totals.totalUSD.toFixed(4)}</td>
      <td style="text-align:center;padding:10px 8px;">—</td>
    </tr>
  `;

  tbody.innerHTML = html;
  updateShortsMetrics(shorts);

  // Update info bar
  const info = document.getElementById('na-nodes-info');
  info.innerHTML = `<strong style="color:var(--info-bright);">${shorts.length}</strong> Shorts · <strong>${totals.uniqueChannels}</strong> canales · Mostrando ${startIdx + 1}-${endIdx}`;
  
  // Pagination controls
  if (maxPage > 1) {
    info.innerHTML += ` · <span style="color:var(--muted2);">Pág ${naState.shortsPage}/${maxPage}</span>`;
  }

  document.getElementById('na-export-btn').disabled = false;
  document.getElementById('na-select-all-btn').style.display = 'none';
  document.getElementById('na-deselect-btn').style.display = 'none';
  document.getElementById('na-remove-btn').style.display = 'none';
}

/* ══════════════════════════════════════════════
   VISTA DE AUDIO SHORTS (Shorts con este audio)
   ══════════════════════════════════════════════ */

function consolidateAudioShortsByChannel(shorts) {
  const byChannel = {};
  shorts.forEach(s => {
    if (!byChannel[s.channel]) {
      byChannel[s.channel] = {
        channel: s.channel,
        shorts: [],
        totalViews: 0,
        totalVPH: 0,
        totalUSD: 0,
        shortCount: 0
      };
    }
    byChannel[s.channel].shorts.push(s);
    byChannel[s.channel].totalViews += s.views;
    byChannel[s.channel].totalVPH += s.vph;
    byChannel[s.channel].totalUSD += s.est_usd_per_hour || 0;
    byChannel[s.channel].shortCount++;
  });
  return Object.values(byChannel).sort((a, b) => b.totalViews - a.totalViews);
}

function getAudioShortsTotals(shorts) {
  if (!shorts || shorts.length === 0) {
    return {
      totalShorts: 0, totalViews: 0, totalVPH: 0.0,
      uniqueChannels: 0, totalUSD: 0, avgViewsPerShort: 0
    };
  }
  return {
    totalShorts: shorts.length,
    totalViews: shorts.reduce((a, s) => a + s.views, 0),
    totalVPH: shorts.reduce((a, s) => a + s.vph, 0),
    totalUSD: shorts.reduce((a, s) => a + (s.est_usd_per_hour || 0), 0),
    uniqueChannels: new Set(shorts.map(s => s.channel)).size,
    avgViewsPerShort: Math.round(shorts.reduce((a, s) => a + s.views, 0) / Math.max(1, shorts.length))
  };
}

function renderAudioShortsView() {
  const thead = document.getElementById('na-table-head');
  const tbody = document.getElementById('na-node-tbody');
  const shorts = naState.audioShortsFiltered;
  const consolidated = consolidateAudioShortsByChannel(shorts);
  const totals = getAudioShortsTotals(shorts);

  thead.innerHTML = `
    <tr>
      <th style="width:36px;">#</th>
      <th style="width:170px;">Canal</th>
      <th>Título del Short</th>
      <th style="text-align:right;width:110px;">Vistas</th>
      <th style="text-align:right;width:70px;">Edad</th>
      <th style="text-align:right;width:70px;">VPH</th>
      <th style="text-align:right;width:80px;">USD/h</th>
      <th style="text-align:center;width:54px;">🔗</th>
    </tr>
  `;

  if (!shorts || shorts.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;padding:40px 16px;color:var(--muted2);font-size:12px;">
      🎵 No se encontraron Shorts con este audio para esta búsqueda.<br>
      <span style="font-size:11px;color:var(--muted);">Estos Shorts usan la misma pista de audio que el video original. Aparecen cuando el backend puede extraerlos de YouTube.</span>
    </td></tr>`;
    updateAudioShortsMetrics(shorts);
    document.getElementById('na-export-btn').disabled = false;
    document.getElementById('na-select-all-btn').style.display = 'none';
    document.getElementById('na-deselect-btn').style.display = 'none';
    document.getElementById('na-remove-btn').style.display = 'none';
    return;
  }

  // ── Filter Bar visible ──
  const filterBar = document.getElementById('na-audio-filter-bar');
  if (filterBar) filterBar.style.display = 'flex';
  
  // ── Poblar dropdown de canales ──
  const channelSelect = document.getElementById('na-audio-channel-filter');
  if (channelSelect && channelSelect.options.length <= 1) {
    const channels = [...new Set(shorts.map(s => s.channel))].sort();
    channels.forEach(ch => {
      const opt = document.createElement('option');
      opt.value = ch;
      opt.textContent = `🎵 ${ch.substring(0, 30)}`;
      channelSelect.appendChild(opt);
    });
  }
  
  // ── Paginación ──
  const startIdx = (naState.audioPage - 1) * naState.audioPerPage;
  const endIdx = Math.min(startIdx + naState.audioPerPage, shorts.length);
  const pageShorts = shorts.slice(startIdx, endIdx);
  const maxPage = Math.ceil(shorts.length / naState.audioPerPage);
  
  const pageInfo = document.getElementById('na-audio-page-info');
  if (pageInfo) {
    pageInfo.textContent = `${naState.audioPage}/${maxPage}`;
  }

  // ── Consolidado por canal en miniatura ──
  const maxViews = consolidated.length > 0 ? consolidated[0].totalViews : 1;
  let html = '';

  html += `<tr><td colspan="8" style="padding:0;"><div style="padding:10px 14px;background:rgba(110,207,165,0.06);border-bottom:0.5px solid rgba(110,207,165,0.15);">
    <div style="display:flex;gap:14px;flex-wrap:wrap;margin-bottom:8px;">
      <span style="font-size:11px;color:var(--muted);">🎵 <strong style="color:var(--success-bright);">${totals.totalShorts}</strong> Shorts con este audio · <strong style="color:var(--success-bright);">${totals.uniqueChannels}</strong> canales</span>
      <span style="font-size:11px;color:var(--muted);">👁️ <strong style="color:var(--emerald);">${totals.totalViews.toLocaleString('en-US')}</strong> vistas totales</span>
      <span style="font-size:11px;color:var(--muted);">📈 <strong style="color:var(--info-bright);">${totals.totalVPH.toFixed(1)}</strong> VPH combinado</span>
    </div>
    <div style="display:flex;gap:3px;height:80px;align-items:flex-end;padding:0 4px;">
      ${consolidated.slice(0, 8).map(ch => {
        const h = Math.max(4, (ch.totalViews / (consolidated[0]?.totalViews || 1)) * 100);
        const color = ch.totalViews > (consolidated[0]?.totalViews || 1) * 0.5 ? 'var(--success-bright)' :
                      ch.totalViews > (consolidated[0]?.totalViews || 1) * 0.2 ? 'var(--success)' : 'var(--muted2)';
        return `<div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;height:100%;">
          <div style="font-size:7px;color:var(--muted2);margin-bottom:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:50px;text-align:center;line-height:1.2;">${ch.channel.substring(0, 6)}</div>
          <div style="width:100%;height:${Math.round(h)}%;background:${color};border-radius:3px 3px 0 0;min-height:3px;transition:height 0.4s ease-out;" title="${ch.channel}: ${ch.totalViews.toLocaleString()} vistas"></div>
        </div>`;
      }).join('')}
    </div>
    <div style="font-size:8px;color:var(--muted2);margin-top:4px;text-align:center;">Top canales por vistas · Shorts que usan la misma pista de audio</div>
  </div></td></tr>`;

  // Tabla de Shorts individuales
  pageShorts.forEach((s, i) => {
    const ageStr = s.age_days < 30 ? Math.round(s.age_days) + ' días'
      : Math.round(s.age_days / 30) + ' meses';

    const audioBadge = s.source === 'audio-shelf' || s.source === 'audio-shelf-dynamic'
      ? '<span style="font-size:8px;background:rgba(110,207,165,0.15);color:var(--success-bright);padding:1px 5px;border-radius:3px;font-weight:600;">🎵 AUDIO</span>'
      : '<span style="font-size:8px;background:rgba(92,140,224,0.15);color:var(--info);padding:1px 5px;border-radius:3px;font-weight:600;">📱 SHORT</span>';

    html += `
      <tr class="na-node-row" style="background:rgba(110,207,165,0.02);">
        <td style="font-family:var(--mono);font-size:11px;color:var(--muted);text-align:center;">${startIdx + i + 1}</td>
        <td>
          <div style="font-size:12px;font-weight:500;color:var(--success-bright);">🎵 ${s.channel}</div>
          <div style="font-size:10px;color:var(--muted2);margin-top:1px;">${audioBadge}</div>
        </td>
        <td>
          <div style="font-size:12px;font-weight:500;color:var(--text2);">${s.title}</div>
          ${s.audioSource ? `<div style="font-size:9px;color:var(--muted2);margin-top:1px;">🎬 De: ${s.audioSource.substring(0, 50)}</div>` : ''}
        </td>
        <td style="text-align:right;font-family:var(--mono);font-size:12px;font-weight:600;color:${s.views > 5000000 ? 'var(--danger)' : s.views > 1000000 ? 'var(--warning)' : 'var(--text)'};">${s.views.toLocaleString('en-US')}</td>
        <td style="text-align:right;font-family:var(--mono);font-size:11px;color:var(--muted);">${ageStr}</td>
        <td style="text-align:right;font-family:var(--mono);font-size:12px;font-weight:600;color:var(--info-bright);">${s.vph.toFixed(2)}</td>
        <td style="text-align:right;font-family:var(--mono);font-size:12px;color:var(--orange-bright);">$${(s.est_usd_per_hour || 0).toFixed(6)}</td>
        <td style="text-align:center;">
          <a href="${s.url}" target="_blank" class="na-node-link" title="Buscar Short en YouTube">🔍</a>
        </td>
      </tr>
    `;
  });

  // Totales
  html += `
    <tr style="background:var(--bg4);font-weight:700;">
      <td style="font-family:var(--mono);font-size:11px;color:var(--muted);text-align:center;padding:10px 8px;">—</td>
      <td style="padding:10px 8px;" colspan="2"><strong style="color:var(--success-bright);">TOTAL AUDIO SHORTS</strong></td>
      <td style="text-align:right;font-family:var(--mono);font-size:14px;color:var(--emerald);padding:10px 8px;">${totals.totalViews.toLocaleString('en-US')}</td>
      <td style="text-align:right;padding:10px 8px;">—</td>
      <td style="text-align:right;font-family:var(--mono);font-size:14px;color:var(--info-bright);padding:10px 8px;">${totals.totalVPH.toFixed(1)}</td>
      <td style="text-align:right;font-family:var(--mono);font-size:14px;color:var(--orange-bright);padding:10px 8px;">$${(totals.totalUSD || 0).toFixed(4)}</td>
      <td style="text-align:center;padding:10px 8px;">—</td>
    </tr>
  `;

  tbody.innerHTML = html;
  updateAudioShortsMetrics(shorts);

  const info = document.getElementById('na-nodes-info');
  info.innerHTML = `<strong style="color:var(--success-bright);">${shorts.length}</strong> Shorts con este audio · <strong>${totals.uniqueChannels}</strong> canales · Mostrando ${startIdx + 1}-${endIdx}`;
  if (maxPage > 1) {
    info.innerHTML += ` · <span style="color:var(--muted2);">Pág ${naState.audioPage}/${maxPage}</span>`;
  }

  document.getElementById('na-export-btn').disabled = false;
  document.getElementById('na-select-all-btn').style.display = 'none';
  document.getElementById('na-deselect-btn').style.display = 'none';
  document.getElementById('na-remove-btn').style.display = 'none';
}

function updateAudioShortsMetrics(shorts) {
  const totals = getAudioShortsTotals(shorts);
  document.getElementById('na-metric-nodes').innerHTML = `${totals.totalShorts} <span style="font-size:11px;font-weight:400;color:var(--muted);font-family:var(--font);">audio shorts</span>`;
  document.getElementById('na-metric-views').innerHTML = `${totals.totalViews.toLocaleString('en-US')} <span style="font-size:11px;font-weight:400;color:var(--muted);font-family:var(--font);">vistas</span>`;
  document.getElementById('na-metric-vph').innerHTML = `${totals.totalVPH.toFixed(1)} <span style="font-size:11px;font-weight:400;color:var(--muted);font-family:var(--font);">v/h</span>`;
  document.getElementById('na-metric-usd').innerHTML = `$${(totals.totalUSD || 0).toFixed(6)} <span style="font-size:11px;font-weight:400;color:var(--success-bright);font-family:var(--font);">/h audio shorts</span>`;
}

/* ══════════════════════════════════════════════
   MODAL DE DETALLE DE SHORT
   ══════════════════════════════════════════════ */

function showShortDetail(short) {
  if (!short) return;
  
  const ageStr = short.age_days < 30 ? Math.round(short.age_days) + ' días'
    : short.age_days < 365 ? Math.round(short.age_days / 30) + ' meses'
    : (short.age_days / 365).toFixed(1) + ' años';
  
  const viralLevel = short.viralScore > 80 ? '🔥 Viral' 
    : short.viralScore > 60 ? '⚡ Trending' 
    : '📈 Activo';
  
  const viralColor = short.viralScore > 80 ? 'var(--danger)' 
    : short.viralScore > 60 ? 'var(--warning)' 
    : 'var(--info)';
  
  const monthlyLoss = (short.est_usd_per_hour || 0) * 730;
  const monthlyStr = monthlyLoss >= 1000 
    ? '$' + (monthlyLoss / 1000).toFixed(1) + 'K' 
    : '$' + monthlyLoss.toFixed(2);
  
  const bodyHTML = `
    <div style="font-size:13px;line-height:1.7;">
      <!-- Header -->
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;padding-bottom:14px;border-bottom:0.5px solid var(--border);">
        <div style="width:48px;height:48px;border-radius:12px;background:rgba(92,140,224,0.15);display:flex;align-items:center;justify-content:center;font-size:24px;flex-shrink:0;">📱</div>
        <div style="flex:1;min-width:0;">
          <div style="font-size:14px;font-weight:600;color:var(--text);">${short.title}</div>
          <div style="font-size:11px;color:var(--info-bright);margin-top:2px;">📱 ${short.channel}</div>
        </div>
        <div style="text-align:right;">
          <span style="font-size:10px;padding:2px 10px;border-radius:4px;background:rgba(92,140,224,0.12);color:var(--info-bright);font-weight:600;">${viralLevel}</span>
          <div style="font-size:9px;color:var(--muted2);margin-top:4px;">Score: ${short.viralScore}/100</div>
        </div>
      </div>
      
      <!-- Métricas en grid -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px;">
        <div style="background:var(--bg3);border-radius:var(--radius);padding:12px;text-align:center;">
          <div style="font-size:9px;color:var(--muted);text-transform:uppercase;letter-spacing:0.03em;margin-bottom:4px;">Vistas</div>
          <div style="font-size:18px;font-weight:700;font-family:var(--mono);color:var(--text);">${short.views.toLocaleString('en-US')}</div>
        </div>
        <div style="background:var(--bg3);border-radius:var(--radius);padding:12px;text-align:center;">
          <div style="font-size:9px;color:var(--muted);text-transform:uppercase;letter-spacing:0.03em;margin-bottom:4px;">VPH</div>
          <div style="font-size:18px;font-weight:700;font-family:var(--mono);color:var(--info-bright);">${short.vph.toFixed(2)}</div>
        </div>
        <div style="background:var(--bg3);border-radius:var(--radius);padding:12px;text-align:center;">
          <div style="font-size:9px;color:var(--muted);text-transform:uppercase;letter-spacing:0.03em;margin-bottom:4px;">Vistas/día</div>
          <div style="font-size:15px;font-weight:700;font-family:var(--mono);color:var(--accent);">${(short.estViewsPerDay || 0).toLocaleString('en-US')}</div>
        </div>
        <div style="background:var(--bg3);border-radius:var(--radius);padding:12px;text-align:center;">
          <div style="font-size:9px;color:var(--muted);text-transform:uppercase;letter-spacing:0.03em;margin-bottom:4px;">Antigüedad</div>
          <div style="font-size:15px;font-weight:700;font-family:var(--mono);color:var(--muted);">${ageStr}</div>
        </div>
      </div>
      
      <!-- Detalles adicionales -->
      <div style="background:var(--bg3);border-radius:var(--radius);padding:12px;margin-bottom:12px;">
        <div style="font-size:10px;font-weight:600;color:var(--muted2);text-transform:uppercase;letter-spacing:0.03em;margin-bottom:8px;">📊 Rendimiento Estimado</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:12px;">
          <div style="color:var(--muted);">USD/hora:</div>
          <div style="font-family:var(--mono);color:var(--orange-bright);font-weight:600;text-align:right;">$${short.est_usd_per_hour.toFixed(6)}</div>
          <div style="color:var(--muted);">USD/mes:</div>
          <div style="font-family:var(--mono);color:var(--orange-bright);font-weight:600;text-align:right;">${monthlyStr}</div>
          <div style="color:var(--muted);">Fuente:</div>
          <div style="font-family:var(--mono);color:var(--muted2);text-align:right;">${short.source || 'Simulado'}</div>
          <div style="color:var(--muted);">Duración:</div>
          <div style="font-family:var(--mono);color:var(--muted2);text-align:right;">${short.duration || '0:00-1:00'}</div>
        </div>
      </div>
      
      <!-- Viral Score Bar -->
      <div style="background:var(--bg3);border-radius:var(--radius);padding:12px;margin-bottom:12px;">
        <div style="font-size:10px;font-weight:600;color:var(--muted2);text-transform:uppercase;letter-spacing:0.03em;margin-bottom:6px;">🔥 Viral Score</div>
        <div style="height:20px;background:var(--bg4);border-radius:10px;overflow:hidden;border:0.5px solid var(--border);">
          <div style="height:100%;width:${short.viralScore}%;background:linear-gradient(90deg,var(--info),${viralColor});border-radius:10px;transition:width 0.6s ease-out;"></div>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:9px;color:var(--muted2);margin-top:3px;">
          <span>0</span>
          <span style="font-weight:600;color:${viralColor};">${short.viralScore}/100 — ${viralLevel}</span>
          <span>100</span>
        </div>
      </div>
      
      ${short.songName ? `
      <div style="font-size:10px;color:var(--muted2);padding:6px 0;">
        🎵 Short asociado a: <strong style="color:var(--text2);">${short.songName}</strong>
      </div>` : ''}
    </div>
  `;
  
  const footerHTML = `
    <button class="btn btn-sm btn-ghost" onclick="closeModal()">Cerrar</button>
    <a href="${short.url}" target="_blank" class="btn btn-sm" style="background:var(--info-bright);color:#0d0d0f;border:none;text-decoration:none;">🔍 Buscar en YouTube</a>
    <button class="btn btn-sm btn-ghost" onclick="closeModal();showShortsBreakdown()" style="display:${naState.naView === 'shorts' ? 'none' : 'inline-flex'};">📊 Ver todos los Shorts</button>
  `;
  
  openModal('📱 Detalle del Short', bodyHTML, footerHTML);
}


/* ══════════════════════════════════════════════
   GRÁFICO DE DONA (DONUT CHART) — SVG puro
   ══════════════════════════════════════════════ */

const DONUT_COLORS = [
  '#4dabf7', '#6ecfa5', '#ff922b', '#e05c5c', '#b87de8',
  '#f0c040', '#5c8ce0', '#e87d9e', '#2ecc71', '#ff6b8a',
  '#7db8e8', '#e8c96e', '#5ce0dc', '#e8a06e', '#9e7de8',
  '#4cad7c', '#e05c8c', '#c9a96e', '#5c8ce0', '#ff4444'
];

function renderDonutChart(data, valueKey, labelKey, size = 180, donutWidth = 32) {
  /**
   * Genera HTML de un gráfico de dona SVG.
   * 
   * @param {Array} data - Array de objetos con datos
   * @param {string} valueKey - Key numérico (e.g. 'totalViews')
   * @param {string} labelKey - Key del label (e.g. 'channel')
   * @param {number} size - Diámetro del SVG
   * @param {number} donutWidth - Grosor del anillo
   * @returns {string} HTML string con SVG + leyenda
   */
  if (!data || data.length === 0) return '<div style="font-size:11px;color:var(--muted2);text-align:center;padding:20px;">Sin datos</div>';
  
  const total = data.reduce((sum, d) => sum + (d[valueKey] || 0), 0);
  if (total === 0) return '<div style="font-size:11px;color:var(--muted2);text-align:center;padding:20px;">Sin datos</div>';
  
  const cx = size / 2;
  const cy = size / 2;
  const radius = (size - donutWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  
  // Top N + "Otros"
  const maxSlices = 8;
  let slices;
  if (data.length <= maxSlices) {
    slices = data.map(d => ({ ...d }));
  } else {
    const top = data.slice(0, maxSlices - 1);
    const others = data.slice(maxSlices - 1);
    const othersAggregated = {
      [labelKey]: 'Otros canales',
      [valueKey]: others.reduce((sum, d) => sum + (d[valueKey] || 0), 0)
    };
    slices = [...top, othersAggregated];
  }
  
  // Calcular segmentos
  let currentOffset = 0;
  const segments = slices.map((d, i) => {
    const val = d[valueKey] || 0;
    const pct = val / total;
    const length = pct * circumference;
    const offset = currentOffset;
    currentOffset += length;
    return {
      ...d,
      pct,
      length,
      offset,
      color: DONUT_COLORS[i % DONUT_COLORS.length],
      index: i
    };
  });
  
  // SVG
  const rotation = -90; // empezar desde arriba
  let svgArcs = segments.map((seg, i) => {
    const dashArray = `${seg.length} ${circumference - seg.length}`;
    const dashOffset = -seg.offset;
    return `<circle cx="${cx}" cy="${cy}" r="${radius}" fill="none"
      stroke="${seg.color}" stroke-width="${donutWidth}"
      stroke-dasharray="${dashArray}"
      stroke-dashoffset="${dashOffset}"
      transform="rotate(${rotation} ${cx} ${cy})"
      style="transition: stroke-dashoffset 0.6s ease-out;"
      opacity="0.92" />`;
  }).join('\n');
  
  // Centro del donut: total
  const totalShort = formatViewsShort(total);
  
  const svg = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    ${svgArcs}
    <text x="${cx}" y="${cy - 6}" text-anchor="middle" fill="var(--text)"
      font-size="${size * 0.13}" font-weight="700" font-family="var(--mono)">${totalShort}</text>
    <text x="${cx}" y="${cy + 14}" text-anchor="middle" fill="var(--muted2)"
      font-size="${size * 0.055}" font-family="var(--font)">vistas</text>
  </svg>`;
  
  // Leyenda
  const legend = segments.map(seg => {
    const pctStr = (seg.pct * 100).toFixed(1) + '%';
    const label = seg[labelKey] || '';
    const shortLabel = label.length > 18 ? label.substring(0, 16) + '…' : label;
    const valStr = formatViewsShort(seg[valueKey] || 0);
    return `<div style="display:flex;align-items:center;gap:6px;padding:3px 0;font-size:10px;color:var(--text2);">
      <span style="width:10px;height:10px;border-radius:3px;background:${seg.color};flex-shrink:0;"></span>
      <span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${shortLabel}</span>
      <span style="font-family:var(--mono);font-size:9px;color:var(--muted);">${valStr}</span>
      <span style="font-family:var(--mono);font-size:9px;color:${seg.pct > 0.15 ? 'var(--success)' : 'var(--muted2)'};font-weight:600;">${pctStr}</span>
    </div>`;
  }).join('');
  
  return `<div style="display:flex;gap:16px;align-items:center;flex-wrap:wrap;">
    <div style="flex-shrink:0;">${svg}</div>
    <div style="flex:1;min-width:140px;">${legend}</div>
  </div>`;
}


/* ══════════════════════════════════════════════
   MÉTRICAS
   ══════════════════════════════════════════════ */

function updateMetrics(nodes) {
  if (naState.naView === 'pirates') return;
  if (naState.naView === 'shorts') return;
  if (naState.naView === 'audioshorts') return;
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

function updateShortsMetrics(shorts) {
  if (!shorts || shorts.length === 0) {
    document.getElementById('na-metric-nodes').innerHTML = `0 <span style="font-size:11px;font-weight:400;color:var(--muted);font-family:var(--font);">shorts</span>`;
    document.getElementById('na-metric-views').textContent = '0';
    document.getElementById('na-metric-vph').innerHTML = `0.00 <span style="font-size:11px;font-weight:400;color:var(--muted);font-family:var(--font);">v/h</span>`;
    document.getElementById('na-metric-usd').textContent = '$0.0000';
    return;
  }

  const totals = getShortsTotals(shorts);
  document.getElementById('na-metric-nodes').innerHTML = `${totals.totalShorts} <span style="font-size:11px;font-weight:400;color:var(--muted);font-family:var(--font);">shorts</span>`;
  document.getElementById('na-metric-views').innerHTML = `${totals.totalViews.toLocaleString('en-US')} <span style="font-size:11px;font-weight:400;color:var(--muted);font-family:var(--font);">virales</span>`;
  document.getElementById('na-metric-vph').innerHTML = `${totals.totalVPH.toFixed(1)} <span style="font-size:11px;font-weight:400;color:var(--muted);font-family:var(--font);">v/h</span>`;
  document.getElementById('na-metric-usd').innerHTML = `$${totals.totalUSD.toFixed(6)} <span style="font-size:11px;font-weight:400;color:var(--info-bright);font-family:var(--font);">/h shorts</span>`;
}

/* ── Estados ── */
function showEmptyState(msg) {
  const tbody = document.getElementById('na-node-tbody');
  if (tbody) {
    tbody.innerHTML = `<tr><td colspan="9" style="text-align:center;padding:40px 16px;color:var(--muted2);font-size:12px;">${msg}</td></tr>`;
  }
  updateMetrics([]);
  document.getElementById('na-export-btn').disabled = true;
  document.getElementById('na-select-all-btn').style.display = 'none';
  document.getElementById('na-deselect-btn').style.display = 'none';
  document.getElementById('na-remove-btn').style.display = 'none';
}

function showNodesReady(song, isExternal = false) {
  const info = document.getElementById('na-catalog-info');
  if (!info) return;
  info.style.display = 'block';
  const shortCount = naState.shorts?.length || 0;
  info.innerHTML = `
    <div style="display:flex;align-items:center;gap:8px;padding:10px 14px;background:${isExternal ? 'var(--bg4)' : 'rgba(46,204,113,0.06)'};border:0.5px solid ${isExternal ? 'var(--border)' : 'rgba(46,204,113,0.2)'};border-radius:var(--radius);">
      <span style="font-size:16px;">${isExternal ? '📦' : '✅'}</span>
      <div style="flex:1;font-size:11px;color:var(--muted);">
        ${isExternal
          ? `<strong style="color:var(--warning);">Catálogo externo:</strong> "${song.name}" no está en la base local. Los nodos son <strong>estimados</strong>.`
          : `<strong style="color:var(--success-bright);">Catálogo auditado:</strong> "${song.name}" encontrado en <strong>${song.catalogName}</strong> · <strong>${song.nodes.toLocaleString('en-US')}</strong> nodos · <strong>${(song.views / 1000000).toFixed(1)}M</strong> vistas`
        }
        ${shortCount > 0 ? ` · <strong style="color:var(--info-bright);">${shortCount} Shorts</strong> virales detectados` : ''}
      </div>
    </div>
  `;
}

/* ══════════════════════════════════════════════
   EXPORTAR REPORTE DE AUDITORÍA
   ══════════════════════════════════════════════ */

function exportNodeReport() {
  const nodes = naState.filteredNodes;
  const shorts = naState.shortsFiltered;
  const query = naState.searchQuery;

  if (!nodes || nodes.length === 0) return;

  let totalViews = 0, totalVPH = 0, totalUSD = 0, officialCount = 0;
  const pirates = nodes.filter(n => n.isPirate);
  const pirateConsolidated = consolidatePirateChannels(nodes);
  const pirateTotals = getPirateTotals(nodes);
  const shortsTotals = getShortsTotals(shorts);

  nodes.forEach(n => {
    totalViews += n.views;
    totalVPH += n.vph;
    totalUSD += n.est_usd_per_hour;
    if (n.isOfficial) officialCount++;
  });

  const now = new Date();
  const dateStr = now.toLocaleDateString('es-DO', { year: 'numeric', month: 'long', day: 'numeric' });
  const timeStr = now.toLocaleTimeString('es-DO', { hour: '2-digit', minute: '2-digit' });

  // ── Filas de nodos ──
  let rowsHtml = '';
  nodes.forEach((n, i) => {
    const ageYears = (n.age_days / 365).toFixed(1);
    const vphColor = n.vph > 10 ? '#0284c7' : n.vph > 1 ? '#b45309' : '#6b7280';
    const channelColor = n.isPirate ? '#dc2626' : '#0f172a';
    const pirateTag = n.isPirate ? ' 🏴‍☠️' : '';
    rowsHtml += `
      <tr>
        <td style="text-align:center;padding:6px 8px;border-bottom:1px solid #e2e8f0;font-size:11px;">${i + 1}</td>
        <td style="padding:6px 8px;border-bottom:1px solid #e2e8f0;font-size:12px;color:${channelColor};"><b>${n.channel}${pirateTag}</b></td>
        <td style="padding:6px 8px;border-bottom:1px solid #e2e8f0;font-size:12px;">${n.title}</td>
        <td style="text-align:center;padding:6px 8px;border-bottom:1px solid #e2e8f0;font-size:10px;">${n.typeLabel}</td>
        <td style="text-align:right;padding:6px 8px;border-bottom:1px solid #e2e8f0;font-family:monospace;font-size:12px;">${n.views.toLocaleString('en-US')}</td>
        <td style="text-align:right;padding:6px 8px;border-bottom:1px solid #e2e8f0;font-family:monospace;font-size:11px;color:#6b7280;">${ageYears} años</td>
        <td style="text-align:right;padding:6px 8px;border-bottom:1px solid #e2e8f0;font-family:monospace;font-size:12px;color:${vphColor};font-weight:600;">${n.vph.toFixed(2)}</td>
        <td style="text-align:right;padding:6px 8px;border-bottom:1px solid #e2e8f0;font-family:monospace;font-size:12px;color:${n.isPirate ? '#dc2626' : '#b45309'};">$${n.est_usd_per_hour.toFixed(4)}</td>
      </tr>
    `;
  });

  // ── Filas de piratas ──
  let pirateRowsHtml = '';
  pirateConsolidated.forEach((ch, i) => {
    const monthlyLoss = ch.totalUSD * 730;
    pirateRowsHtml += `
      <tr>
        <td style="text-align:center;padding:6px 8px;border-bottom:1px solid #e2e8f0;font-size:11px;">${i + 1}</td>
        <td style="padding:6px 8px;border-bottom:1px solid #e2e8f0;font-size:12px;color:#dc2626;"><b>🏴‍☠️ ${ch.channel}</b></td>
        <td style="text-align:center;padding:6px 8px;border-bottom:1px solid #e2e8f0;font-size:12px;">${ch.nodeCount}</td>
        <td style="text-align:right;padding:6px 8px;border-bottom:1px solid #e2e8f0;font-family:monospace;font-size:12px;">${ch.totalViews.toLocaleString('en-US')}</td>
        <td style="text-align:right;padding:6px 8px;border-bottom:1px solid #e2e8f0;font-family:monospace;font-size:12px;color:#0284c7;">${ch.totalVPH.toFixed(1)}</td>
        <td style="text-align:right;padding:6px 8px;border-bottom:1px solid #e2e8f0;font-family:monospace;font-size:12px;color:#dc2626;">$${ch.totalUSD.toFixed(4)}</td>
        <td style="text-align:right;padding:6px 8px;border-bottom:1px solid #e2e8f0;font-family:monospace;font-size:12px;color:#b45309;">$${(monthlyLoss >= 1000 ? (monthlyLoss / 1000).toFixed(1) + 'K' : monthlyLoss.toFixed(0))}</td>
      </tr>
    `;
  });

  // ── Filas de Shorts ──
  let shortsRowsHtml = '';
  if (shorts && shorts.length > 0) {
    shorts.slice(0, 20).forEach((s, i) => {
      shortsRowsHtml += `
        <tr>
          <td style="text-align:center;padding:6px 8px;border-bottom:1px solid #e2e8f0;font-size:11px;">${i + 1}</td>
          <td style="padding:6px 8px;border-bottom:1px solid #e2e8f0;font-size:12px;color:#0284c7;"><b>📱 ${s.channel}</b></td>
          <td style="padding:6px 8px;border-bottom:1px solid #e2e8f0;font-size:12px;">${s.title}</td>
          <td style="text-align:center;padding:6px 8px;border-bottom:1px solid #e2e8f0;font-size:10px;">SHORT</td>
          <td style="text-align:right;padding:6px 8px;border-bottom:1px solid #e2e8f0;font-family:monospace;font-size:12px;font-weight:600;color:#0284c7;">${s.views.toLocaleString('en-US')}</td>
          <td style="text-align:right;padding:6px 8px;border-bottom:1px solid #e2e8f0;font-family:monospace;font-size:11px;color:#6b7280;">${Math.round(s.age_days / 30)} meses</td>
          <td style="text-align:right;padding:6px 8px;border-bottom:1px solid #e2e8f0;font-family:monospace;font-size:12px;color:#0284c7;font-weight:600;">${s.vph.toFixed(2)}</td>
          <td style="text-align:right;padding:6px 8px;border-bottom:1px solid #e2e8f0;font-family:monospace;font-size:12px;color:#b45309;">$${s.est_usd_per_hour.toFixed(6)}</td>
        </tr>
      `;
    });
  }

  const totalMonthlyLoss = pirateTotals.totalUSD * 730;
  const shortsMonthlyLoss = shortsTotals.totalUSD * 730;

  // ── Construir HTML ──
  const htmlTemplate = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Informe de Auditoría de Nodos · ${query}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #0f172a; margin: 0; padding: 0; background: #f8fafc; line-height: 1.5; font-size: 13px; }
  .page { max-width: 1100px; margin: 0 auto; padding: 40px 30px; }
  .header { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 3px solid #0f172a; padding-bottom: 20px; margin-bottom: 30px; }
  .header-left h1 { font-size: 22px; font-weight: 700; letter-spacing: -0.5px; text-transform: uppercase; color: #0f172a; }
  .header-left h1 span { color: #0284c7; }
  .header-left p { font-size: 12px; color: #64748b; margin-top: 4px; }
  .header-right { text-align: right; font-size: 11px; color: #64748b; line-height: 1.8; }
  .meta-box { background: #ffffff; border: 1px solid #e2e8f0; border-left: 4px solid #0284c7; border-radius: 0 8px 8px 0; padding: 20px 24px; margin-bottom: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
  .meta-box h3 { font-size: 13px; text-transform: uppercase; color: #0f172a; margin-bottom: 12px; letter-spacing: 0.03em; }
  .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 13px; }
  .section-title { font-size: 15px; font-weight: 700; color: #0f172a; margin: 24px 0 12px; padding-bottom: 6px; border-bottom: 2px solid #0f172a; }
  .section-title-shorts { font-size: 15px; font-weight: 700; color: #0284c7; margin: 24px 0 12px; padding-bottom: 6px; border-bottom: 2px solid #0284c7; }
  table { width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 12px; }
  thead th { background: #0f172a; color: #ffffff; padding: 8px; text-align: left; font-size: 10px; text-transform: uppercase; letter-spacing: 0.04em; }
  thead th.r { text-align: right; }
  thead th.c { text-align: center; }
  thead th.shorts-h { background: #0284c7; }
  tbody tr:nth-child(even) { background: #f1f5f9; }
  tbody tr:hover { background: #e2e8f0; }
  .totals-row { background: #0f172a !important; color: #ffffff; font-weight: 600; }
  .editable-note { margin-top: 30px; padding: 16px 20px; border: 1px dashed #94a3b8; background: #fffbeb; border-radius: 6px; font-size: 12px; color: #475569; }
  .editable-note:focus { outline: 2px solid #0284c7; outline-offset: 2px; }
  .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 10px; color: #94a3b8; text-align: center; }
  .badge-pirate { color: #dc2626; font-weight: 700; }
  .badge-blue { color: #0284c7; font-weight: 700; }
  .badge-amber { color: #b45309; font-weight: 700; }
  .badge-short { color: #0284c7; font-weight: 700; }
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
      <strong>Tipo:</strong> Peritaje de Distribución Digital<br>
      <strong>Shorts Detectados:</strong> <span class="badge-short">${shortsTotals.totalShorts} virales</span>
    </div>
  </div>

  <!-- Resumen Ejecutivo -->
  <div class="meta-box">
    <h3>📋 Resumen Ejecutivo de la Auditoría</h3>
    <div class="meta-grid">
      <div><strong style="color:#64748b;">Obra Auditada:</strong> ${query}</div>
      <div><strong style="color:#64748b;">Nodos Consolidados:</strong> <span class="badge-blue">${nodes.length} nodos</span></div>
      <div><strong style="color:#64748b;">Reproducciones Acumuladas:</strong> <span style="color:#059669;font-weight:700;">${totalViews.toLocaleString('en-US')} vistas</span></div>
      <div><strong style="color:#64748b;">Shorts Virales:</strong> <span class="badge-short">${shortsTotals.totalShorts} Shorts en ${shortsTotals.uniqueChannels} canales</span></div>
      <div><strong style="color:#64748b;">Nodos Piratas:</strong> <span class="badge-pirate">${pirateTotals.totalPirates} nodos en ${pirateTotals.uniqueChannels} canales</span></div>
      <div><strong style="color:#64748b;">VPH Combinado (Nodos):</strong> <span class="badge-blue">${totalVPH.toFixed(2)} v/h</span></div>
      <div><strong style="color:#64748b;">VPH Shorts:</strong> <span class="badge-short">${shortsTotals.totalVPH.toFixed(1)} v/h</span></div>
      <div><strong style="color:#64748b;">Rendimiento USD/h:</strong> <span class="badge-amber">$${totalUSD.toFixed(4)} nodos / $${shortsTotals.totalUSD.toFixed(4)} shorts</span></div>
      <div><strong style="color:#64748b;">Pérdida Piratas/mes:</strong> <span class="badge-pirate">$${(totalMonthlyLoss >= 1000 ? (totalMonthlyLoss / 1000).toFixed(1) + 'K' : totalMonthlyLoss.toFixed(0))}</span></div>
      <div><strong style="color:#64748b;">Pérdida Shorts/mes:</strong> <span class="badge-short">$${(shortsMonthlyLoss >= 1000 ? (shortsMonthlyLoss / 1000).toFixed(1) + 'K' : shortsMonthlyLoss.toFixed(0))}</span></div>
    </div>
  </div>

  <!-- Shorts Virales -->
  ${shorts && shorts.length > 0 ? `
  <div class="section-title-shorts">📱 Shorts Virales Identificados</div>
  <table>
    <thead>
      <tr>
        <th style="width:32px;text-align:center;">#</th>
        <th style="width:190px;">Canal</th>
        <th>Título del Short</th>
        <th style="text-align:center;width:50px;">Tipo</th>
        <th style="text-align:right;width:100px;">Vistas</th>
        <th style="text-align:right;width:60px;">Edad</th>
        <th style="text-align:right;width:65px;">VPH</th>
        <th style="text-align:right;width:85px;">USD/h</th>
      </tr>
    </thead>
    <tbody>
      ${shortsRowsHtml}
      <tr class="totals-row">
        <td style="text-align:center;padding:8px;">—</td>
        <td style="padding:8px;font-weight:700;" colspan="2">TOTAL SHORTS</td>
        <td style="text-align:center;padding:8px;">${shortsTotals.totalShorts}</td>
        <td style="text-align:right;padding:8px;font-family:monospace;font-size:13px;">${shortsTotals.totalViews.toLocaleString('en-US')}</td>
        <td style="text-align:right;padding:8px;">—</td>
        <td style="text-align:right;padding:8px;font-family:monospace;font-size:13px;color:#0284c7;">${shortsTotals.totalVPH.toFixed(1)}</td>
        <td style="text-align:right;padding:8px;font-family:monospace;font-size:13px;color:#b45309;">$${shortsTotals.totalUSD.toFixed(4)}</td>
      </tr>
    </tbody>
  </table>` : ''}

  <!-- Piratas -->
  ${pirateTotals.totalPirates > 0 ? `
  <div class="section-title">🏴‍☠️ Canales Piratas Identificados</div>
  <table>
    <thead>
      <tr>
        <th style="width:32px;text-align:center;">#</th>
        <th style="width:200px;">Canal Pirata</th>
        <th style="text-align:center;">Canciones</th>
        <th style="text-align:right;">Vistas Robadas</th>
        <th style="text-align:right;">VPH</th>
        <th style="text-align:right;">USD/h Robado</th>
        <th style="text-align:right;">Pérdida/mes</th>
      </tr>
    </thead>
    <tbody>
      ${pirateRowsHtml}
      <tr class="totals-row">
        <td style="text-align:center;padding:8px;">—</td>
        <td style="padding:8px;font-weight:700;">TOTAL PIRATAS</td>
        <td style="text-align:center;padding:8px;">${pirateTotals.totalPirates}</td>
        <td style="text-align:right;padding:8px;font-family:monospace;font-size:13px;">${pirateTotals.totalViews.toLocaleString('en-US')}</td>
        <td style="text-align:right;padding:8px;font-family:monospace;font-size:13px;">${pirateTotals.totalVPH.toFixed(1)}</td>
        <td style="text-align:right;padding:8px;font-family:monospace;font-size:13px;color:#dc2626;">$${pirateTotals.totalUSD.toFixed(4)}</td>
        <td style="text-align:right;padding:8px;font-family:monospace;font-size:13px;color:#dc2626;">$${(totalMonthlyLoss >= 1000 ? (totalMonthlyLoss / 1000).toFixed(1) + 'K' : totalMonthlyLoss.toFixed(0))}</td>
      </tr>
    </tbody>
  </table>` : ''}

  <!-- Nodos -->
  <div class="section-title">📋 Matriz Completa de Nodos</div>
  <table>
    <thead>
      <tr>
        <th style="width:32px;text-align:center;">#</th>
        <th style="width:170px;">Canal</th>
        <th>Título del Nodo</th>
        <th style="text-align:center;width:50px;">Tipo</th>
        <th style="text-align:right;width:100px;">Vistas</th>
        <th style="text-align:right;width:70px;">Edad</th>
        <th style="text-align:right;width:70px;">VPH</th>
        <th style="text-align:right;width:80px;">USD/h</th>
      </tr>
    </thead>
    <tbody>
      ${rowsHtml}
      <tr class="totals-row">
        <td style="text-align:center;padding:8px;">—</td>
        <td style="padding:8px;font-weight:700;" colspan="2">TOTALES CONSOLIDADOS</td>
        <td style="text-align:center;padding:8px;">${nodes.length}</td>
        <td style="text-align:right;padding:8px;font-family:monospace;font-size:13px;">${totalViews.toLocaleString('en-US')}</td>
        <td style="text-align:right;padding:8px;">—</td>
        <td style="text-align:right;padding:8px;font-family:monospace;font-size:13px;color:#0284c7;">${totalVPH.toFixed(2)}</td>
        <td style="text-align:right;padding:8px;font-family:monospace;font-size:13px;color:#b45309;">$${totalUSD.toFixed(4)}</td>
      </tr>
    </tbody>
  </table>

  <div class="editable-note" contenteditable="true">
    <strong>[ZONA EDITABLE]:</strong><br>
    El presente documento certifica la dispersión de tráfico de la obra musical indicada en redes abiertas.
    Se identificaron y curaron manualmente <strong>${nodes.length} nodos</strong> de terceros,
    incluyendo <strong>${pirateTotals.uniqueChannels} canales piratas</strong> y <strong>${shortsTotals.uniqueChannels} canales de Shorts virales</strong>
    que operan sin licencia o generan réplicas de contenido.
    <br><br>
    <strong>Observaciones del Perito:</strong><br>
    _________________________________________________________________________________<br>
    _________________________________________________________________________________<br>
    _________________________________________________________________________________<br>
  </div>

  <div class="footer">
    Nuclear AIMA · Sistema de Auditoría Forense de Activos Digitales + Shorts · Generado el ${dateStr}
  </div>

</div>
</body>
</html>`;

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
   EXPORTAR A PDF
   ══════════════════════════════════════════════ */

function exportNodePDF() {
  const nodes = naState.filteredNodes;
  const shorts = naState.shortsFiltered;
  const query = naState.searchQuery;
  if (!nodes || nodes.length === 0) return;

  const { jsPDF } = window.jspdf;
  if (!jsPDF) {
    alert('La librería PDF aún no ha cargado. Intenta de nuevo.');
    return;
  }

  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'letter' });
  const pageW = 270;

  let totalViews = 0, totalVPH = 0, totalUSD = 0;
  const pirates = nodes.filter(n => n.isPirate);
  const pirateTotals = getPirateTotals(nodes);
  const shortsTotals = getShortsTotals(shorts);

  nodes.forEach(n => {
    totalViews += n.views; totalVPH += n.vph; totalUSD += n.est_usd_per_hour;
  });

  const now = new Date();
  const dateStr = now.toLocaleDateString('es-DO');

  // ── Header ──
  doc.setFontSize(16);
  doc.setTextColor(201, 169, 110);
  doc.text('Nuclear AIMA · Node Auditor', 14, 15);
  doc.setFontSize(7);
  doc.setTextColor(120, 120, 120);
  doc.text(dateStr + ' | Shorts: ' + shortsTotals.totalShorts, pageW - 14, 15, { align: 'right' });

  // ── Línea ──
  doc.setDrawColor(201, 169, 110);
  doc.line(14, 19, pageW - 14, 19);

  // ── Info de búsqueda ──
  doc.setFontSize(11);
  doc.setTextColor(220, 220, 220);
  doc.text('Obra: ' + query, 14, 26);
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text('Nodos: ' + nodes.length + ' | Vistas: ' + totalViews.toLocaleString('en-US') + ' | VPH: ' + totalVPH.toFixed(2) + ' | USD/h: ' + totalUSD.toFixed(4), 14, 31);
  doc.text('Piratas: ' + pirateTotals.totalPirates + ' nodos en ' + pirateTotals.uniqueChannels + ' canales | Shorts: ' + shortsTotals.totalShorts + ' virales', 14, 36);

  // ── Tabla ──
  const colX = [14, 110, 145, 175, 200, 225, 250];
  const headers = ['Canal', 'Título', 'Vistas', 'VPH', 'USD/h', 'Tipo'];
  let y = 42;

  doc.setFontSize(7);
  doc.setTextColor(201, 169, 110);
  doc.setFillColor(22, 22, 26);
  doc.rect(14, y - 3, pageW - 28, 5, 'F');
  headers.forEach((h, i) => doc.text(h, colX[i], y));
  y += 5;

  doc.setFontSize(6.5);
  nodes.slice(0, 80).forEach((n, i) => {
    if (y > 185) {
      doc.addPage();
      y = 15;
      doc.setFontSize(7);
      doc.setTextColor(201, 169, 110);
      doc.setFillColor(22, 22, 26);
      doc.rect(14, y - 3, pageW - 28, 5, 'F');
      headers.forEach((h, i) => doc.text(h, colX[i], y));
      y += 5;
      doc.setFontSize(6.5);
    }
    doc.setTextColor(n.isPirate ? 220 : 180, n.isPirate ? 80 : 180, n.isPirate ? 80 : 180);
    doc.text(n.channel.substring(0, 22), colX[0], y);
    doc.setTextColor(200, 200, 200);
    doc.text(n.title.substring(0, 20), colX[1], y);
    doc.text(n.views.toLocaleString('en-US'), colX[2], y, { align: 'right' });
    doc.setTextColor(100, 180, 230);
    doc.text(n.vph.toFixed(2), colX[3], y, { align: 'right' });
    doc.setTextColor(220, 160, 80);
    doc.text('$' + n.est_usd_per_hour.toFixed(4), colX[4], y, { align: 'right' });
    doc.setTextColor(150, 150, 150);
    doc.text(n.isPirate ? 'PIRATA' : n.isOfficial ? 'OFICIAL' : n.type === 'short' ? 'SHORT' : 'COVER', colX[5], y);
    y += 4;
  });

  // ── Footer ──
  doc.setDrawColor(201, 169, 110);
  doc.line(14, y + 4, pageW - 14, y + 4);
  doc.setFontSize(6);
  doc.setTextColor(100, 100, 100);
  doc.text('Nuclear AIMA · Sistema de Auditoría Forense de Activos Digitales + Shorts · Generado: ' + dateStr, pageW / 2, y + 10, { align: 'center' });

  const filename = `Auditoria_${query.replace(/[^a-z0-9]/gi, '_').toLowerCase().substring(0, 30)}.pdf`;
  doc.save(filename);
}

/* ══════════════════════════════════════════════
   INIT
   ══════════════════════════════════════════════ */

window.renderNodeAuditor = renderNodeAuditor;
window.executeNodeSearch = executeNodeSearch;
window.setSearchMode = setSearchMode;
window.setDataSource = setDataSource;
window.toggleNodeSelection = toggleNodeSelection;
window.selectAllNodes = selectAllNodes;
window.deselectAllNodes = deselectAllNodes;
window.removeSelectedNodes = removeSelectedNodes;
window.removeNode = removeNode;
window.exportNodeReport = exportNodeReport;
window.exportNodePDF = exportNodePDF;
window.switchNAView = switchNAView;
window.auditSingleSong = auditSingleSong;
window.auditAllArtistSongs = auditAllArtistSongs;
window.renderShortsView = renderShortsView;
window.filterShorts = filterShorts;
window.applyShortsSort = applyShortsSort;
window.applyShortsChannelFilter = applyShortsChannelFilter;
window.shortsPrevPage = shortsPrevPage;
window.shortsNextPage = shortsNextPage;
window.generateShortsForSong = generateShortsForSong;
window.showShortDetail = showShortDetail;

window.renderAudioShortsView = renderAudioShortsView;
window.filterAudioShorts = filterAudioShorts;
window.applyAudioSort = applyAudioSort;
window.applyAudioChannelFilter = applyAudioChannelFilter;
window.audioPrevPage = audioPrevPage;
window.audioNextPage = audioNextPage;
window.generateAudioShortsForSong = generateAudioShortsForSong;
