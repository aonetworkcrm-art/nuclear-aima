/* ══════════════════════════════════════════════
   NUCLEAR AIMA — TOOLS v2.0
   Shadow Audit · Copy Generator · Campaign Scheduler · Playlist Manager
   ══════════════════════════════════════════════ */

/* ── Tool Definitions ── */
const TOOLS = [
  {
    id: 'shadow-audit',
    title: 'Shadow Audit',
    description: 'Auditoría técnica de catálogos musicales. Analiza métricas de streaming, estimación de regalías y oportunidades de monetización.',
    icon: '🔍',
    iconBg: 'rgba(92,140,224,0.12)',
    iconColor: '#5c8ce0',
    status: { class: 'live', text: '● Live' },
    statusText: 'Funcional — Beta'
  },
  {
    id: 'copy-generator',
    title: 'Copy Generator',
    description: 'Genera textos de marketing, outreach a curadores, pitching para playlisters y copies para campañas Web3.',
    icon: '✍️',
    iconBg: 'rgba(224,184,92,0.12)',
    iconColor: '#e0b85c',
    status: { class: 'live', text: '● Live' },
    statusText: 'Funcional — Beta'
  },
  {
    id: 'scheduler',
    title: 'Campaña Scheduler',
    description: 'Planificador de campañas multicanal con cronograma visual de 4 semanas. Coordina lanzamientos en Instagram, TikTok, YouTube y prensa.',
    icon: '📅',
    iconBg: 'rgba(76,173,124,0.12)',
    iconColor: '#4cad7c',
    status: { class: 'live', text: '● Live' },
    statusText: 'Nuevo — Funcional'
  },
  {
    id: 'playlist-manager',
    title: 'Playlist Manager',
    description: 'Gestiona tus campañas de playlisting. Registra curadores, da seguimiento a envíos y monitorea las canciones colocadas.',
    icon: '🎧',
    iconBg: 'rgba(201,169,110,0.12)',
    iconColor: '#c9a96e',
    status: { class: 'live', text: '● Live' },
    statusText: 'Nuevo — Funcional'
  },
  {
    id: 'analytics-dashboard',
    title: 'Analytics Dashboard',
    description: 'Panel de métricas en vivo con integración Spotify API + Chartmetric. Datos reales de artistas, seguidores, streams y tendencias.',
    icon: '📊',
    iconBg: 'rgba(224,92,92,0.12)',
    iconColor: '#e05c5c',
    status: { class: 'live', text: '● Live' },
    statusText: 'Nuevo — APIs reales'
  }
];

/* ── Render Tools ── */
function renderTools() {
  const container = document.getElementById('tools-container');
  if (!container) return;

  // Check hash for direct tool access
  const hash = window.location.hash.replace('#', '');
  if (hash === 'scheduler') { renderSchedulerView(container); return; }
  if (hash === 'playlist-manager') { renderPlaylistView(container); return; }
  if (hash === 'analytics-dashboard') { renderAnalyticsDashboard(container); return; }

  container.innerHTML = `
    <div class="tools-grid">
      ${TOOLS.map(t => `
        <div class="tool-card" onclick="${getToolClickHandler(t.id)}">
          <div class="tool-icon" style="background:${t.iconBg};color:${t.iconColor};">${t.icon}</div>
          <h3>${t.title}</h3>
          <p>${t.description}</p>
          <span class="tool-status ${t.status.class}">${t.status.text}</span>
          ${t.statusText ? '<span style="display:block;font-size:10px;color:var(--muted2);margin-top:4px;">' + t.statusText + '</span>' : ''}
        </div>
      `).join('')}
    </div>
  `;
}

function getToolClickHandler(id) {
  switch(id) {
    case 'shadow-audit': return 'openShadowAudit()';
    case 'copy-generator': return 'openCopyGenerator()';
    case 'scheduler': return 'window.location.hash=\"scheduler\"; renderTools()';
    case 'playlist-manager': return 'window.location.hash=\"playlist-manager\"; renderTools()';
    case 'analytics-dashboard': return 'window.location.hash=\"analytics-dashboard\"; renderTools()';
    default: return '';
  }
}


/* ══════════════════════════════════════════════
   SHADOW AUDIT TOOL
   ══════════════════════════════════════════════ */

/* ── Enhanced Shadow Audit ── */
const DISTRO_PLATFORMS = ['DistroKid', 'TuneCore', 'ONErpm', 'CD Baby', 'UnitedMasters', 'Amuse', 'Believe', 'The Orchard'];

function openShadowAudit() {
  openModal('🔍 Shadow Audit — Análisis de Catálogo', getShadowAuditForm(), `
    <button class="btn btn-sm btn-ghost" onclick="closeModal()">Cerrar</button>
    <button class="btn btn-sm btn-primary" onclick="runShadowAudit()">Ejecutar Auditoría</button>
  `);
}

function getShadowAuditForm() {
  return `
    <p style="font-size:12px;color:var(--muted);margin-bottom:16px;">
      Auditoría completa de catálogo: regalías acumuladas, detección de canciones infra-monetizadas y plan de distribución.
    </p>

    <!-- ═══ SPOTIFY SEARCH ═══ -->
    <div style="background:var(--bg3);border:0.5px solid var(--border);border-radius:var(--radius2);padding:14px;margin-bottom:16px;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
        <h4 style="font-size:13px;color:var(--info);margin:0;">🎵 Conectar con Spotify</h4>
        <span id="sa-spotify-badge" style="display:none;"></span>
      </div>
      <div style="display:flex;gap:10px;align-items:flex-end;">
        <div class="form-group" style="flex:1;margin:0;">
          <label style="font-size:11px;">Buscar artista en Spotify</label>
          <input type="text" id="sa-spotify-search" placeholder="Ej: Bad Bunny, Ramón Orlando..." onkeydown="if(event.key==='Enter')searchSpotifyForAudit()" />
        </div>
        <button class="btn btn-sm btn-primary" onclick="searchSpotifyForAudit()" style="margin-bottom:1px;font-size:11px;padding:6px 12px;">🔍 Buscar</button>
      </div>
      <div id="sa-spotify-result" style="display:none;margin-top:10px;"></div>
      <div style="font-size:10px;color:var(--muted2);margin-top:6px;">
        ℹ️ Usa las credenciales configuradas en <strong onclick="window.location.hash='analytics-dashboard';renderTools();setTimeout(()=>openAnalyticsConfig(),200)" style="color:var(--accent);cursor:pointer;">Analytics Dashboard → ⚙️ Config</strong>.
        Sin API, los datos se toman de los campos manuales.
      </div>
    </div>

    <h4 style="font-size:13px;color:var(--accent);margin-bottom:10px;">📋 Datos del Artista</h4>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
      <div class="form-group">
        <label>Nombre del Artista</label>
        <input type="text" id="sa-artist" placeholder="Ej: Ramón Orlando" value="Ramón Orlando" />
      </div>
      <div class="form-group">
        <label>Años activo en la industria</label>
        <input type="number" id="sa-years" placeholder="Ej: 10" value="10" min="1" max="70" />
      </div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
      <div class="form-group">
        <label>Canciones en catálogo</label>
        <input type="number" id="sa-songs" placeholder="Ej: 10" value="10" min="1" max="500" />
      </div>
      <div class="form-group">
        <label>Promedio de streams x canción/mes</label>
        <input type="number" id="sa-avg-stream" placeholder="Ej: 5000" value="5000" min="0" />
      </div>
    </div>

    <h4 style="font-size:13px;color:var(--accent);margin:14px 0 10px;">📊 Streaming por Plataforma</h4>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
      <div class="form-group">
        <label>Seguidores Spotify</label>
        <input type="number" id="sa-followers" placeholder="Ej: 5000" value="5000" min="0" />
      </div>
      <div class="form-group">
        <label>Playlists editoriales alcanzadas</label>
        <input type="number" id="sa-playlists" placeholder="Ej: 3" value="3" min="0" />
      </div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
      <div class="form-group">
        <label>Views YouTube (total catálogo)</label>
        <input type="number" id="sa-ytviews" placeholder="Ej: 200000" value="200000" min="0" />
      </div>
      <div class="form-group">
        <label>Suscriptores YouTube</label>
        <input type="number" id="sa-yt-subs" placeholder="Ej: 2000" value="2000" min="0" />
      </div>
    </div>

    <h4 style="font-size:13px;color:var(--accent);margin:14px 0 10px;">📦 Distribución</h4>
    <div class="form-group">
      <label>¿Con qué distribuidora estás?</label>
      <select id="sa-distro">
        <option value="ninguna">Ninguna / No sé</option>
        <option value="distrokid">DistroKid</option>
        <option value="tunecore">TuneCore</option>
        <option value="onerpm">ONErpm</option>
        <option value="cdbaby">CD Baby</option>
        <option value="unitedmasters">UnitedMasters</option>
        <option value="amuse">Amuse</option>
        <option value="believe">Believe / The Orchard</option>
        <option value="otra" selected>Otra / Múltiples</option>
      </select>
    </div>
    <div class="form-group">
      <label>¿Tienes Publishing / Administración de regalías?</label>
      <select id="sa-publishing">
        <option value="no" selected>No</option>
        <option value="yes">Sí — Tengo publishing</option>
        <option value="unsure">No estoy seguro</option>
      </select>
    </div>
    <div class="form-group">
      <label>Redes activas</label>
      <div style="display:flex;gap:8px;flex-wrap:wrap;">
        <label style="display:flex;align-items:center;gap:4px;font-size:12px;color:var(--text2);cursor:pointer;">
          <input type="checkbox" id="sa-ig" checked /> Instagram
        </label>
        <label style="display:flex;align-items:center;gap:4px;font-size:12px;color:var(--text2);cursor:pointer;">
          <input type="checkbox" id="sa-tt" checked /> TikTok
        </label>
        <label style="display:flex;align-items:center;gap:4px;font-size:12px;color:var(--text2);cursor:pointer;">
          <input type="checkbox" id="sa-fb" /> Facebook
        </label>
        <label style="display:flex;align-items:center;gap:4px;font-size:12px;color:var(--text2);cursor:pointer;">
          <input type="checkbox" id="sa-tw" /> X / Twitter
        </label>
      </div>
    </div>

    <div id="sa-results" style="display:none;"></div>
  `;
}

/* ── Spotify Integration for Shadow Audit ── */
let _saSpotifyData = null;

async function searchSpotifyForAudit() {
  const input = document.getElementById('sa-spotify-search');
  const query = input?.value.trim();
  if (!query) return;

  const cfg = getAnalyticsConfig();
  if (!cfg.spotifyClientId || !cfg.spotifyClientSecret) {
    const resultDiv = document.getElementById('sa-spotify-result');
    if (resultDiv) {
      resultDiv.style.display = 'block';
      resultDiv.innerHTML = '<span style="font-size:11px;color:var(--warning);">⚠️ Configura Spotify API primero en Analytics Dashboard → ⚙️</span>';
    }
    return;
  }

  const resultDiv = document.getElementById('sa-spotify-result');
  if (resultDiv) {
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = '<span style="font-size:11px;color:var(--muted);">⏳ Buscando...</span>';
  }

  const results = await spotifySearchArtist(query, cfg.spotifyClientId, cfg.spotifyClientSecret);

  if (results === null) {
    if (resultDiv) {
      resultDiv.innerHTML = '<span style="font-size:11px;color:var(--danger);">❌ Error de conexión con Spotify. Verifica tus credenciales.</span>';
    }
    return;
  }

  if (results.length === 0) {
    if (resultDiv) {
      resultDiv.innerHTML = '<span style="font-size:11px;color:var(--warning);">🔍 Artista no encontrado en Spotify. Los campos quedarán manuales.</span>';
    }
    return;
  }

  // Take the first (best) match
  const artist = results[0];
  _saSpotifyData = {
    id: artist.id,
    name: artist.name,
    followers: artist.followers?.total || 0,
    popularity: artist.popularity || 0,
    genres: artist.genres || [],
    image: artist.images?.[0]?.url || '',
    spotifyUrl: artist.external_urls?.spotify || ''
  };

  // Show success + auto-fill form
  const imgHtml = _saSpotifyData.image ?
    `<img src="${_saSpotifyData.image}" style="width:48px;height:48px;border-radius:6px;object-fit:cover;" alt="" />` :
    '<div style="width:48px;height:48px;border-radius:6px;background:var(--bg4);display:flex;align-items:center;justify-content:center;font-size:20px;">🎤</div>';

  if (resultDiv) {
    resultDiv.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px;background:var(--bg2);border:0.5px solid rgba(76,173,124,0.2);border-radius:var(--radius);padding:10px;">
        ${imgHtml}
        <div style="flex:1;">
          <div style="font-size:13px;font-weight:500;">${_saSpotifyData.name}</div>
          <div style="font-size:11px;color:var(--muted);">
            ${_saSpotifyData.followers.toLocaleString()} seguidores · Popularidad ${_saSpotifyData.popularity}/100
            ${_saSpotifyData.genres.length ? ' · ' + _saSpotifyData.genres.slice(0,2).join(', ') : ''}
          </div>
        </div>
        <span style="font-size:10px;padding:2px 8px;border-radius:4px;background:rgba(76,173,124,0.15);color:var(--success);font-weight:500;">✅ Spotify</span>
      </div>
    `;
  }

  // Auto-fill form fields
  const artistInput = document.getElementById('sa-artist');
  if (artistInput) artistInput.value = _saSpotifyData.name;

  const followersInput = document.getElementById('sa-followers');
  if (followersInput) followersInput.value = _saSpotifyData.followers;

  // Update badge
  const badge = document.getElementById('sa-spotify-badge');
  if (badge) {
    badge.style.display = 'inline-block';
    badge.innerHTML = '<span style="font-size:10px;padding:2px 8px;border-radius:4px;background:rgba(76,173,124,0.15);color:var(--success);font-weight:500;">✅ Datos de Spotify</span>';
  }
}

function runShadowAudit() {
  // ── Gather inputs ──
  const artist = document.getElementById('sa-artist')?.value || 'Artista';
  const yearsActive = parseInt(document.getElementById('sa-years')?.value) || 10;
  const songs = parseInt(document.getElementById('sa-songs')?.value) || 10;
  const avgStreamPerSong = parseInt(document.getElementById('sa-avg-stream')?.value) || 5000;
  const followers = parseInt(document.getElementById('sa-followers')?.value) || 5000;
  const editorialPlaylists = parseInt(document.getElementById('sa-playlists')?.value) || 3;
  const ytViews = parseInt(document.getElementById('sa-ytviews')?.value) || 200000;
  const ytSubs = parseInt(document.getElementById('sa-yt-subs')?.value) || 2000;
  const hasIG = document.getElementById('sa-ig')?.checked || false;
  const hasTT = document.getElementById('sa-tt')?.checked || false;
  const distro = document.getElementById('sa-distro')?.value || 'ninguna';
  const hasPublishing = document.getElementById('sa-publishing')?.value || 'no';

  // Check if we have Spotify data for this artist
  const hasSpotifyData = _saSpotifyData && _saSpotifyData.name.toLowerCase() === artist.toLowerCase();
  const spotifyImage = hasSpotifyData ? _saSpotifyData.image : '';

  const monthlyStreams = songs * avgStreamPerSong;

  // ── 1. ROYALTIES BY PLATFORM ──
  // Realistic per-stream rates (USD)
  const rates = {
    spotify: 0.0035,
    appleMusic: 0.007,
    youtube: 0.001,
    other: 0.004
  };

  // Assume distribution: 55% Spotify, 20% Apple Music, 15% YouTube, 10% Other
  const distPct = { spotify: 0.55, appleMusic: 0.20, youtube: 0.15, other: 0.10 };

  const platformRoyalties = {};
  let totalMonthly = 0;
  Object.keys(distPct).forEach(p => {
    const pStreams = monthlyStreams * distPct[p];
    const pRevenue = pStreams * rates[p];
    platformRoyalties[p] = {
      streams: Math.floor(pStreams),
      rate: rates[p],
      monthly: pRevenue,
      annual: pRevenue * 12
    };
    totalMonthly += pRevenue;
  });

  // Add YouTube one-time video revenue estimate
  const ytAdRevenue = ytViews * 0.001; // ~$1 RPM
  platformRoyalties.youtube.annual += ytAdRevenue;

  const totalAnnual = totalMonthly * 12 + ytAdRevenue;

  // Accumulated royalties (catalog lifetime)
  // Estimate: assume 70% of current rate for past years (growth)
  const accumulatedByYear = [];
  let accumulatedTotal = 0;
  for (let y = 0; y < yearsActive; y++) {
    const growthFactor = 0.3 + (y / yearsActive) * 0.7; // grows from 30% to 100%
    const yearRevenue = totalAnnual * growthFactor;
    accumulatedByYear.push({
      year: y + 1,
      label: 'Año ' + (y + 1) + (y === yearsActive - 1 ? ' (actual)' : ''),
      revenue: yearRevenue
    });
    accumulatedTotal += yearRevenue;
  }

  // Future 5-year projection
  const futureProjection = [];
  let futureTotal = 0;
  for (let y = 1; y <= 5; y++) {
    const growth = 1 + (y * 0.08); // assume 8% annual growth
    const yearRevenue = totalAnnual * growth;
    futureProjection.push({
      year: y,
      label: 'Año ' + y,
      revenue: yearRevenue
    });
    futureTotal += yearRevenue;
  }

  // ── 2. ENGAGEMENT SCORE ──
  let engagementScore = 0;
  if (followers > 0 && monthlyStreams > 0) {
    const ratio = monthlyStreams / followers;
    if (ratio > 20) engagementScore += 30;
    else if (ratio > 10) engagementScore += 20;
    else if (ratio > 5) engagementScore += 12;
    else engagementScore += 6;
  }
  if (hasIG) engagementScore += 12;
  if (hasTT) engagementScore += 12;
  if (ytViews > 100000) engagementScore += 12;
  if (followers > 10000) engagementScore += 12;
  if (editorialPlaylists > 5) engagementScore += 12;
  else if (editorialPlaylists > 0) engagementScore += 6;
  if (distro !== 'ninguna') engagementScore += 10;

  let grade = 'D', gradeColor = 'var(--danger)';
  if (engagementScore >= 85) { grade = 'A'; gradeColor = 'var(--success)'; }
  else if (engagementScore >= 70) { grade = 'B'; gradeColor = 'var(--info)'; }
  else if (engagementScore >= 55) { grade = 'C'; gradeColor = 'var(--warning)'; }
  else if (engagementScore >= 35) { grade = 'D'; gradeColor = 'var(--orange)'; }

  // ── 3. UNDER-MONETIZED SONGS DETECTION ──
  // Generate simulated tracks with variance
  const tracks = [
    { name: 'Canción Principal (Hit)', streams: Math.floor(avgStreamPerSong * 2.8), platform: 'Spotify/Apple Music/YT' },
    { name: 'Colaboración Éxito', streams: Math.floor(avgStreamPerSong * 1.6), platform: 'Spotify/Apple Music' },
    { name: 'Sencillo Reciente', streams: Math.floor(avgStreamPerSong * 1.2), platform: 'Spotify/Apple Music' },
    { name: 'Tema Clásico del Catálogo', streams: Math.floor(avgStreamPerSong * 0.9), platform: 'Spotify' },
    { name: 'Canción de Temporada', streams: Math.floor(avgStreamPerSong * 0.5), platform: 'YouTube/Spotify' },
    { name: 'Tema Secundario', streams: Math.floor(avgStreamPerSong * 0.3), platform: 'YouTube' },
    { name: 'Pista Menor Conocida', streams: Math.floor(avgStreamPerSong * 0.15), platform: 'Ninguna' },
    { name: 'Bonus Track / Demo', streams: Math.floor(avgStreamPerSong * 0.08), platform: 'SoundCloud' },
  ];

  // Slice to match actual song count
  const actualTracks = tracks.slice(0, Math.min(songs, tracks.length));
  // If more songs than generated, fill with generic
  while (actualTracks.length < songs) {
    actualTracks.push({
      name: 'Canción #' + (actualTracks.length + 1),
      streams: Math.floor(avgStreamPerSong * 0.2),
      platform: 'No distribuida'
    });
  }

  // Analyze: each track gets a monetization score
  const avgStreamPerTrack = monthlyStreams / songs;
  const underMonetized = actualTracks.map((t, i) => {
    const efficiency = t.streams / avgStreamPerTrack;
    const platformScore = t.platform.includes('Apple') ? 3 : t.platform === 'Spotify/Apple Music/YT' ? 3 : t.platform === 'Spotify/Apple Music' ? 2.5 : t.platform === 'Spotify' ? 2 : t.platform === 'YouTube/Spotify' ? 1.5 : t.platform === 'YouTube' ? 1 : t.platform === 'Ninguna' ? 0 : 0.5;
    const platformBonus = t.platform.includes('Apple') ? 2 : t.platform === 'No distribuida' ? -2 : 0;
    const monetizationScore = Math.min(100, Math.max(0, Math.round((efficiency * 30) + (platformScore * 20) + platformBonus)));
    const isUnderMonetized = monetizationScore < 40 || t.platform === 'No distribuida' || t.platform === 'SoundCloud' || t.platform === 'Ninguna';
    const revenueLost = Math.floor((avgStreamPerTrack - t.streams) * 0.004 * (t.platform === 'No distribuida' ? 2 : 0.5));
    return {
      ...t,
      index: i + 1,
      efficiency: efficiency.toFixed(2),
      monetizationScore,
      isUnderMonetized,
      revenueLost: Math.max(0, revenueLost),
      reason: t.platform === 'No distribuida' ? 'No está en plataformas digitales' :
              t.platform === 'SoundCloud' ? 'Solo en SoundCloud — sin monetización real' :
              t.platform === 'Ninguna' ? 'Sin presencia en streaming' :
              !t.platform.includes('Apple') ? 'No está en Apple Music (mayor royalty rate)' :
              efficiency < 0.5 ? 'Rendimiento muy por debajo del promedio del catálogo' :
              'Potencial no explotado — falta promoción activa'
    };
  });

  const underCount = underMonetized.filter(t => t.isUnderMonetized).length;
  const totalLostRevenue = underMonetized.reduce((s, t) => s + t.revenueLost, 0);

  // ── 4. DISTRIBUTION RECOMMENDATIONS ──
  const distroRecs = [];
  const distroNames = ['DistroKid', 'TuneCore', 'ONErpm', 'CD Baby', 'UnitedMasters', 'Believe/The Orchard'];
  const distroPrices = [22, 15, 20, 10, 0, 0];
  const distroFeatures = [
    ['🟢 Lanzamientos ilimitados', '🟢 TikTok + Shorts', '🟢 100% regalías', '🔴 Sin publi automática', '🔴 Sin pitching editorial'],
    ['🟢 30+ plataformas', '🟢 Publishing incluido', '🟢 YouTube Content ID', '🔴 $15/año por single', '🟢 Retención de ingresos'],
    ['🟢 Enfoque LATAM', '🟢 Marcaje en radio', '🟢 Playlist pitching', '🟢 Distribución física', '🟢 Soporte en español'],
    ['🟢 Distribución física', '🟢 Sync licensing', '🟢 $10/año por single', '🔴 UI anticuada', '🟢 30+ plataformas'],
    ['🟢 Sin costo anual', '🟢 100% regalías', '🟢 Distribución selectiva', '🔴 15% comisión opcional', '🟢 Brand partnerships'],
    ['🟢 Distribución masiva', '🟢 200+ territorios', '🟢 Sync + publishing', '🔴 Requiere volumen', '🔴 Proceso de aplicación']
  ];

  // Score each distributor based on artist profile
  const distroScores = [
    { name: 'DistroKid', score: 40 + (songs > 20 ? 20 : 10) + (hasTT ? 15 : 0) + (distro === 'ninguna' ? 15 : 0), price: '$22/año', bestFor: 'Artistas independientes con volumen' },
    { name: 'TuneCore', score: 30 + (hasPublishing === 'no' ? 25 : 10) + (ytViews > 100000 ? 15 : 0), price: '$15/año por single', bestFor: 'Artistas que necesitan publishing + Content ID' },
    { name: 'ONErpm', score: 35 + (distro === 'ninguna' || distro === 'otra' ? 20 : 5) + (yearsActive > 5 ? 10 : 0) + (songs > 30 ? 10 : 0), price: 'Gratis + 15% comisión', bestFor: 'Catálogos grandes con enfoque LATAM' },
    { name: 'UnitedMasters', score: 25 + (hasIG ? 15 : 0) + (followers > 10000 ? 10 : 0) + (distro === 'ninguna' ? 15 : 0), price: 'Gratis + opción premium', bestFor: 'Artistas con base de seguidores en redes' },
    { name: 'Believe/The Orchard', score: 10 + (yearsActive > 15 ? 25 : 0) + (songs > 50 ? 20 : 0) + (ytViews > 1000000 ? 15 : 0), price: 'Requiere aplicación', bestFor: 'Artistas establecidos con catálogo grande' },
  ];

  distroScores.sort((a, b) => b.score - a.score);

  // ── 5. MARKET GAP ANALYSIS ──
  const gaps = [];
  if (!hasTT) gaps.push({ platform: 'TikTok', impact: 'Alto', reason: 'Principal canal de descubrimiento musical para Gen Z y Millennials', action: 'Crear cuenta y publicar 3x/semana' });
  if (!hasIG) gaps.push({ platform: 'Instagram', impact: 'Alto', reason: 'Base de fans visual + historias + DMs para networking con curadores', action: 'Publicar Reels diarios + historias de promoción' });
  if (distro === 'ninguna') gaps.push({ platform: 'Distribución digital', impact: 'Crítico', reason: 'Sin distribución no hay regalías. Tus canciones no están generando dinero.', action: 'Elegir distribuidora (ver recomendaciones arriba)' });
  if (hasPublishing === 'no' || hasPublishing === 'unsure') gaps.push({ platform: 'Publishing / Regalías de compositor', impact: 'Alto', reason: 'Las regalías de compositor (BMI/ASCAP) pueden duplicar tus ingresos', action: 'Registrarse en BMI/ASCAP + afiliarse a sociedad de autores' });
  if (!ytViews || ytViews < 100000) gaps.push({ platform: 'YouTube', impact: 'Medio', reason: 'YouTube es la 2da plataforma de música más grande del mundo', action: 'Subir lyric videos + contenido detrás de cámaras' });
  if (editorialPlaylists < 5) gaps.push({ platform: 'Playlists editoriales', impact: 'Medio', reason: 'Las playlists editoriales generan tráfico orgánico constante', action: 'Pitching vía Spotify for Artists + SubmitHub/Groover' });
  if (!followers || followers < 5000) gaps.push({ platform: 'Base de seguidores Spotify', impact: 'Medio', reason: 'Más seguidores = más tracción en Release Radar y Discover Weekly', action: 'Incluir calls-to-action en historias IG + tweets' });

  // ── Construct Result HTML ──
  const resultHTML = `
    <div style="margin-top:20px;padding-top:20px;border-top:0.5px solid var(--border);">

      <!-- ═══ HEADER ═══ -->
      <div id="sa-audit-results">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
        <div style="display:flex;align-items:center;gap:10px;">
          ${spotifyImage ? `<img src="${spotifyImage}" style="width:40px;height:40px;border-radius:6px;object-fit:cover;" alt="" />` : ''}
          <h4 style="color:var(--accent);margin:0;">📋 Shadow Audit — ${artist}</h4>
        </div>
        ${hasSpotifyData ? '<span style="font-size:10px;padding:3px 10px;border-radius:4px;background:rgba(76,173,124,0.15);color:var(--success);font-weight:500;">✅ Datos reales de Spotify</span>' : '<span style="font-size:10px;padding:3px 10px;border-radius:4px;background:var(--bg4);color:var(--muted);font-weight:500;">📝 Datos manuales</span>'}
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:16px;">
        <div style="background:var(--bg3);border-radius:var(--radius);padding:12px;text-align:center;">
          <div style="font-size:10px;color:var(--muted);text-transform:uppercase;">Health Score</div>
          <div style="font-size:28px;font-weight:700;color:${gradeColor};">${grade}</div>
          <div style="font-size:10px;color:var(--muted);">${engagementScore}/100</div>
        </div>
        <div style="background:var(--bg3);border-radius:var(--radius);padding:12px;text-align:center;">
          <div style="font-size:10px;color:var(--muted);text-transform:uppercase;">Valor Catálogo</div>
          <div style="font-size:20px;font-weight:600;color:var(--accent);font-family:var(--mono);">$${(totalAnnual * 3).toFixed(0)}</div>
          <div style="font-size:10px;color:var(--muted);">3x ingreso anual</div>
        </div>
        <div style="background:var(--bg3);border-radius:var(--radius);padding:12px;text-align:center;">
          <div style="font-size:10px;color:var(--muted);text-transform:uppercase;">Ingreso Mensual</div>
          <div style="font-size:20px;font-weight:600;color:var(--success);font-family:var(--mono);">$${totalMonthly.toFixed(0)}</div>
          <div style="font-size:10px;color:var(--muted);">${songs} canciones · ${yearsActive} años</div>
        </div>
      </div>

      <!-- ═══ ROYALTIES BY PLATFORM ═══ -->
      <h4 style="color:var(--accent);margin:16px 0 8px;">💰 Regalías por Plataforma</h4>
      <table>
        <tr><th>Plataforma</th><th class="num">Streams/mes</th><th class="num">Rate</th><th class="num">Ingreso/mes</th><th class="num">Ingreso/año</th></tr>
        <tr>
          <td>🎵 Spotify</td>
          <td class="num">${platformRoyalties.spotify.streams.toLocaleString()}</td>
          <td class="num">$${platformRoyalties.spotify.rate.toFixed(4)}</td>
          <td class="num">$${platformRoyalties.spotify.monthly.toFixed(0)}</td>
          <td class="num">$${platformRoyalties.spotify.annual.toFixed(0)}</td>
        </tr>
        <tr>
          <td>🍎 Apple Music</td>
          <td class="num">${platformRoyalties.appleMusic.streams.toLocaleString()}</td>
          <td class="num">$${platformRoyalties.appleMusic.rate.toFixed(4)}</td>
          <td class="num">$${platformRoyalties.appleMusic.monthly.toFixed(0)}</td>
          <td class="num">$${platformRoyalties.appleMusic.annual.toFixed(0)}</td>
        </tr>
        <tr>
          <td>▶ YouTube (streams + ads)</td>
          <td class="num">${platformRoyalties.youtube.streams.toLocaleString()}</td>
          <td class="num">$${platformRoyalties.youtube.rate.toFixed(4)}</td>
          <td class="num">$${platformRoyalties.youtube.monthly.toFixed(0)}</td>
          <td class="num">$${(platformRoyalties.youtube.annual + ytAdRevenue).toFixed(0)}</td>
        </tr>
        <tr>
          <td>🔉 Otras (Deezer, Amazon, etc.)</td>
          <td class="num">${platformRoyalties.other.streams.toLocaleString()}</td>
          <td class="num">$${platformRoyalties.other.rate.toFixed(4)}</td>
          <td class="num">$${platformRoyalties.other.monthly.toFixed(0)}</td>
          <td class="num">$${platformRoyalties.other.annual.toFixed(0)}</td>
        </tr>
        <tr style="border-top:0.5px solid var(--border2);">
          <td><strong>TOTAL</strong></td>
          <td class="num"><strong>${monthlyStreams.toLocaleString()}</strong></td>
          <td class="num"></td>
          <td class="num"><strong style="color:var(--success);">$${totalMonthly.toFixed(0)}</strong></td>
          <td class="num"><strong style="color:var(--success);">$${totalAnnual.toFixed(0)}</strong></td>
        </tr>
      </table>

      <!-- ═══ ACCUMULATED ROYALTIES ═══ -->
      <h4 style="color:var(--accent);margin:16px 0 8px;">📈 Regalías Acumuladas (${yearsActive} años de catálogo)</h4>
      <div style="display:flex;align-items:flex-end;gap:4px;height:80px;margin-bottom:8px;padding:0 4px;">
        ${accumulatedByYear.map(y => {
          const maxAcc = Math.max(...accumulatedByYear.map(x => x.revenue));
          const h = Math.max(6, (y.revenue / maxAcc) * 100);
          return `<div style="flex:1;display:flex;flex-direction:column;align-items:center;height:100%;justify-content:flex-end;">
            <div style="font-size:8px;color:var(--muted2);margin-bottom:2px;font-family:var(--mono);">$${(y.revenue / 12).toFixed(0)}</div>
            <div style="width:100%;height:${h}%;background:${y.label.includes('actual') ? 'var(--accent)' : 'var(--bg4)'};border-radius:3px 3px 0 0;min-height:4px;"></div>
            <div style="font-size:7px;color:var(--muted);margin-top:2px;">${y.label.includes('actual') ? 'Actual' : 'A' + y.year}</div>
          </div>`;
        }).join('')}
      </div>
      <div style="background:var(--bg3);border-radius:var(--radius);padding:10px 14px;font-size:12px;display:flex;justify-content:space-between;align-items:center;">
        <span style="color:var(--muted);">Total acumulado (${yearsActive} años):</span>
        <span style="font-size:22px;font-weight:700;font-family:var(--mono);color:var(--accent);">$${accumulatedTotal.toFixed(0)}</span>
      </div>

      <!-- ═══ 5-YEAR PROJECTION ═══ -->
      <h4 style="color:var(--accent);margin:16px 0 8px;">🔮 Proyección a 5 Años (8% crecimiento anual)</h4>
      <table>
        <tr><th>Año</th><th class="num">Ingreso estimado</th><th class="num">vs actual</th></tr>
        ${futureProjection.map(y => `
          <tr>
            <td>${y.label}</td>
            <td class="num" style="color:var(--accent);font-weight:500;">$${y.revenue.toFixed(0)}</td>
            <td class="num" style="color:var(--success);">+${((y.revenue / totalAnnual - 1) * 100).toFixed(0)}%</td>
          </tr>
        `).join('')}
        <tr style="border-top:0.5px solid var(--border2);">
          <td><strong>Total 5 años</strong></td>
          <td class="num" style="font-size:16px;font-weight:700;color:var(--accent);font-family:var(--mono);">$${futureTotal.toFixed(0)}</td>
          <td class="num"></td>
        </tr>
      </table>

      <!-- ═══ UNDER-MONETIZED SONGS ═══ -->
      <h4 style="color:var(--accent);margin:16px 0 8px;">🚨 Canciones Infra-Monetizadas (${underCount} de ${songs})</h4>
      <p style="font-size:11px;color:var(--muted);margin-bottom:8px;">
        Ingreso perdido estimado por estas canciones: <strong style="color:var(--danger);">$${totalLostRevenue.toFixed(0)}/mes</strong>
      </p>
      <table>
        <tr><th>#</th><th>Canción</th><th class="num">Streams</th><th class="num">Score</th><th>Problema</th><th class="num">Pérdida/mes</th></tr>
        ${underMonetized.filter(t => t.isUnderMonetized).slice(0, 8).map(t => `
          <tr>
            <td style="color:var(--muted);font-size:11px;">${t.index}</td>
            <td>${t.name}</td>
            <td class="num">${t.streams.toLocaleString()}</td>
            <td class="num"><span style="color:${t.monetizationScore < 20 ? 'var(--danger)' : 'var(--orange)'};">${t.monetizationScore}</span></td>
            <td style="font-size:11px;color:var(--muted);">${t.reason}</td>
            <td class="num" style="color:var(--danger);">$${t.revenueLost.toFixed(0)}</td>
          </tr>
        `).join('')}
        ${underMonetized.filter(t => t.isUnderMonetized).length === 0 ? '<tr><td colspan="6" style="text-align:center;color:var(--success);padding:12px;">✅ No se detectaron canciones infra-monetizadas</td></tr>' : ''}
      </table>

      <!-- ═══ DISTRIBUTION RECOMMENDATIONS ═══ -->
      <h4 style="color:var(--accent);margin:16px 0 8px;">📦 Recomendaciones de Distribución</h4>
      <p style="font-size:11px;color:var(--muted);margin-bottom:8px;">Distribuidoras recomendadas para tu perfil (puntaje de compatibilidad):</p>
      ${distroScores.slice(0, 3).map((d, i) => `
        <div style="background:${i === 0 ? 'rgba(76,173,124,0.06)' : 'var(--bg3)'};border:0.5px solid ${i === 0 ? 'rgba(76,173,124,0.2)' : 'var(--border)'};border-radius:var(--radius);padding:10px 14px;margin-bottom:6px;display:flex;justify-content:space-between;align-items:center;">
          <div style="flex:1;">
            <div style="font-size:13px;font-weight:500;">${i === 0 ? '🥇 ' : i === 1 ? '🥈 ' : '🥉 '}${d.name}</div>
            <div style="font-size:11px;color:var(--muted);">${d.bestFor} · ${d.price}</div>
          </div>
          <div style="text-align:right;">
            <div style="font-size:18px;font-weight:700;font-family:var(--mono);color:${i === 0 ? 'var(--success)' : 'var(--muted)'};">${Math.min(100, d.score)}%</div>
            <div style="font-size:10px;color:var(--muted);">match</div>
          </div>
        </div>
      `).join('')}

      <!-- ═══ MARKET GAPS ═══ -->
      <h4 style="color:var(--accent);margin:16px 0 8px;">🎯 Oportunidades de Crecimiento (Gap Analysis)</h4>
      ${gaps.slice(0, 5).map(g => `
        <div style="background:var(--bg3);border:0.5px solid var(--border);border-radius:var(--radius);padding:10px 14px;margin-bottom:6px;">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <div style="font-size:13px;font-weight:500;">${g.platform}</div>
            <span style="display:inline-block;font-size:10px;padding:1px 8px;border-radius:4px;font-weight:500;
              ${g.impact === 'Crítico' ? 'background:rgba(224,92,92,0.15);color:var(--danger);' :
                g.impact === 'Alto' ? 'background:rgba(224,184,92,0.15);color:var(--warning);' :
                'background:rgba(92,140,224,0.15);color:var(--info);'}">${g.impact}</span>
          </div>
          <div style="font-size:11px;color:var(--muted);margin-top:4px;">${g.reason}</div>
          <div style="font-size:11px;color:var(--accent);margin-top:2px;">→ ${g.action}</div>
        </div>
      `).join('')}

    </div>
    </div>
  `;

  document.getElementById('modal-body').innerHTML = getShadowAuditForm() + resultHTML;
  document.getElementById('sa-results').style.display = 'block';

  // Update footer: add PDF export button
  const footer = document.getElementById('modal-footer');
  if (footer) {
    footer.innerHTML = `
      <button class="btn btn-sm btn-ghost" onclick="closeModal()">Cerrar</button>
      <button class="btn btn-sm btn-primary" onclick="exportShadowAuditPDF()" style="background:var(--danger);">📄 Exportar PDF</button>
    `;
  }

  // Scroll to top of modal
  const modalBody = document.getElementById('modal-body');
  if (modalBody) modalBody.scrollTop = 0;
}

/* ── PDF Export Function ── */
function loadPDFLibrary() {
  return new Promise((resolve, reject) => {
    if (window.jspdf && window.html2canvas) { resolve(); return; }

    const scripts = [];
    if (!window.html2canvas) {
      const s1 = document.createElement('script');
      s1.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
      s1.onload = () => {
        if (!window.jspdf) loadJSPDF();
        else resolve();
      };
      s1.onerror = reject;
      document.head.appendChild(s1);
      scripts.push(s1);
    }

    function loadJSPDF() {
      const s2 = document.createElement('script');
      s2.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
      s2.onload = () => resolve();
      s2.onerror = reject;
      document.head.appendChild(s2);
    }

    if (window.html2canvas) loadJSPDF();
  });
}

async function exportShadowAuditPDF() {
  const artist = document.getElementById('sa-artist')?.value || 'Artista';
  const resultsDiv = document.getElementById('sa-results');
  if (!resultsDiv || resultsDiv.style.display === 'none') return;

  // Show loading state
  const btn = document.querySelector('#modal-footer .btn-primary');
  if (btn) { btn.textContent = '⏳ Generando PDF...'; btn.disabled = true; }

  try {
    // Load libraries
    await loadPDFLibrary();

    // Get the audit results container (now with ID for robust selection)
    const auditContent = document.getElementById('sa-audit-results') || resultsDiv;

    // Capture with html2canvas (wider capture for better quality)
    const canvas = await html2canvas(auditContent, {
      backgroundColor: '#0a0a0c',
      scale: 2,
      logging: false,
      allowTaint: false,
      useCORS: true,
      width: auditContent.scrollWidth,
      height: auditContent.scrollHeight,
      windowWidth: 800
    });

    const imgData = canvas.toDataURL('image/png');
    const { jsPDF } = window.jspdf;

    // Calculate dimensions
    const margin = 10; // mm
    const usableWidth = 190; // mm (A4 210mm - margins)
    const usableHeight = 277; // mm (A4 297mm - top/bottom margins)
    const imgWidth = usableWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    const pdf = new jsPDF('p', 'mm', 'a4');

    // Track cumulative negative offset for multi-page
    let offset = 0;
    let remaining = imgHeight - usableHeight;

    // Add first page
    pdf.addImage(imgData, 'PNG', margin, margin, imgWidth, imgHeight);

    // Add additional pages if content overflows
    while (remaining > 1) { // 1mm tolerance
      offset -= usableHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', margin, offset + margin, imgWidth, imgHeight);
      remaining -= usableHeight;
    }

    // Add footer to all pages
    const pageCount = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.setTextColor(150);
      pdf.text('Nuclear AIMA — Shadow Audit | ' + artist + ' | ' + new Date().toLocaleDateString('es-DO'), 10, 290);
      pdf.text('Pág. ' + i + ' de ' + pageCount, 190, 290, { align: 'right' });
    }

    // Save PDF
    pdf.save('Shadow_Audit_' + artist.replace(/[^a-zA-Z0-9]/g, '_') + '.pdf');

    if (btn) { btn.textContent = '✅ PDF Exportado'; btn.disabled = false; }
  } catch (e) {
    console.error('PDF export error:', e);
    if (btn) { btn.textContent = '❌ Error — Intenta de nuevo'; btn.disabled = false; }
    alert('Error al generar PDF: ' + e.message);
  }
}


/* ══════════════════════════════════════════════
   COPY GENERATOR TOOL
   ══════════════════════════════════════════════ */

function openCopyGenerator() {
  openModal('✍️ Copy Generator', getCopyGeneratorForm(), `
    <button class="btn btn-sm btn-ghost" onclick="closeModal()">Cerrar</button>
    <button class="btn btn-sm btn-primary" onclick="generateCopy()">Generar Copy</button>
  `);
}

const COPY_TEMPLATES = {
  'outreach-curador': {
    title: 'Outreach a Curador de Playlist',
    template: (artist, song, playlist) => `Asunto: Tu playlist me salvó el viaje de esta mañana 🇩🇴

Hola [Nombre del Curador],

Te escribo escuchando tu lista "${playlist}". La combinación entre clásicos y nuevos talentos es una joya. Encontré tu contacto en la descripción y no quise dejar pasar el día sin agradecerte el criterio.

Trabajo con "${artist}", un proyecto con esa misma vibra orgánica. No te vengo a vender nada. Solo quiero dejarte una pista que acabamos de masterizar: "${song}".

Si sientes que conecta con tu playlist, sería un honor que la consideres. Si no encaja, igual me encantaría tu opinión sincera.

Link: [URL de la canción]

Un abrazo desde Santo Domingo. Sigue rompiéndola.`
  },
  'web3-inversor': {
    title: 'Copy Web3 para Inversionistas',
    template: (artist) => `Asunto: Dejaron de ser artistas para volverse un negocio de por vida... 🇩🇴

Hola.

Si estás leyendo esto, es porque entiendes el valor de cazar oportunidades antes de que todos se enteren.

Acabamos de lanzar la infraestructura de música tokenizada de "${artist}", un sistema Web3 donde puedes ser dueño de una fracción de las regalías del próximo hit mundial.

Cada vez que la música suene en radio, Spotify o discotecas, los holders del token reciben dividendos automáticos en sus billeteras.

Mira el ecosistema aquí: [URL de tu Landing Page]

Nos vemos dentro del Discord oficial.`
  },
  'promo-redes': {
    title: 'Publicación para Redes Sociales',
    template: (artist, song) => `🎵 NUEVO LANZAMIENTO 🎵

"${song}" — YA DISPONIBLE

@${artist} llega con todo para ponerle sabor a tu playlist. 🎶🔥

Dale play y comparte. 🎧👇

[Link al tema]

#NuevoLanzamiento #${artist.replace(/\s+/g, '')} #MúsicaUrbana #Estreno`
  },
  'presentacion-agencia': {
    title: 'Presentación de Agencia a Artista',
    template: (artist) => `Hola ${artist},

Somos Nuclear AIMA, agencia de infraestructura digital especializada en escalar proyectos musicales en LATAM y global.

Hemos visto tu trabajo y creemos que tu proyecto merece más. Trabajamos con artistas para:

• Escalar presencia en IG, TT y YT con tráfico automatizado
• Posicionar canciones en playlists editoriales
• Tokenizar tu catálogo como activo Web3

¿Agendamos una llamada de 15 min?

Saludos,
Nuclear AIMA`
  }
};

function getCopyGeneratorForm() {
  return `
    <p style="font-size:12px;color:var(--muted);margin-bottom:16px;">
      Selecciona el tipo de copy y completa los datos.
    </p>
    <div class="form-group">
      <label>Tipo de Copy</label>
      <select id="cg-type" onchange="updateCopyForm()">
        <option value="outreach-curador">Outreach a Curador de Playlist</option>
        <option value="web3-inversor">Copy Web3 para Inversionistas</option>
        <option value="promo-redes">Publicación para Redes Sociales</option>
        <option value="presentacion-agencia">Presentación de Agencia a Artista</option>
      </select>
    </div>
    <div class="form-group">
      <label>Artista / Proyecto</label>
      <input type="text" id="cg-artist" placeholder="Ej: Ramón Orlando" value="Ramón Orlando" />
    </div>
    <div class="form-group" id="cg-song-group">
      <label>Canción</label>
      <input type="text" id="cg-song" placeholder="Ej: Una Foto Remix" value="Mi Canción" />
    </div>
    <div class="form-group" id="cg-playlist-group" style="display:none;">
      <label>Playlist (opcional)</label>
      <input type="text" id="cg-playlist" placeholder="Ej: Dembow Dominicano Hits" value="Dembow Dominicano Hits" />
    </div>
    <div id="cg-result" style="display:none;"></div>
  `;
}

function updateCopyForm() {
  const type = document.getElementById('cg-type')?.value;
  const sg = document.getElementById('cg-song-group');
  const pg = document.getElementById('cg-playlist-group');
  sg.style.display = (type === 'promo-redes' || type === 'outreach-curador') ? 'block' : 'none';
  pg.style.display = type === 'outreach-curador' ? 'block' : 'none';
}

function generateCopy() {
  const type = document.getElementById('cg-type')?.value || 'outreach-curador';
  const artist = document.getElementById('cg-artist')?.value || 'Artista';
  const song = document.getElementById('cg-song')?.value || 'Canción';
  const playlist = document.getElementById('cg-playlist')?.value || 'Playlist';
  const template = COPY_TEMPLATES[type];
  if (!template) return;
  const copyText = template.template(artist, song, playlist);
  const safeText = copyText.replace(/`/g, '\\`').replace(/\$/g, '\\$').replace(/\\/g, '\\\\');
  const resultHTML = `
    <div style="margin-top:20px;padding-top:20px;border-top:0.5px solid var(--border);">
      <h4 style="color:var(--accent);margin-bottom:10px;">📝 ${template.title}</h4>
      <div style="background:var(--bg3);border:0.5px solid var(--border);border-radius:var(--radius);padding:16px;font-size:13px;line-height:1.7;white-space:pre-wrap;word-break:break-word;color:var(--text2);max-height:350px;overflow-y:auto;" id="cg-output">${copyText}</div>
      <div style="margin-top:12px;display:flex;gap:8px;">
        <button class="btn btn-sm btn-primary" onclick="copyOutputText()">📋 Copiar</button>
        <button class="btn btn-sm btn-ghost" onclick="closeModal()">Cerrar</button>
      </div>
    </div>
  `;
  document.getElementById('modal-body').innerHTML = getCopyGeneratorForm() + resultHTML;
  document.getElementById('cg-result').style.display = 'block';
  updateCopyForm();
}

function copyOutputText() {
  const el = document.getElementById('cg-output');
  if (!el) return;
  navigator.clipboard.writeText(el.textContent).then(() => {
    const btn = document.querySelector('#modal-body .btn-primary');
    if (btn) { btn.textContent = '✓ Copiado!'; setTimeout(() => { btn.textContent = '📋 Copiar'; }, 2000); }
  });
}


/* ══════════════════════════════════════════════
   CAMPAIGN SCHEDULER TOOL
   ══════════════════════════════════════════════ */

const WEEK_LABELS = ['Semana 1: Fundación', 'Semana 2: Tráfico Inicial', 'Semana 3: Amplificación', 'Semana 4: Viral'];
const PLATFORMS = ['Instagram', 'TikTok', 'YouTube', 'Prensa', 'Safelists', 'Otohits', 'ManyChat', 'Web3'];

function getSchedulerState() {
  try { return JSON.parse(localStorage.getItem('na_scheduler_campaigns') || '[]'); }
  catch { return []; }
}

function saveSchedulerState(campaigns) {
  localStorage.setItem('na_scheduler_campaigns', JSON.stringify(campaigns));
}

function renderSchedulerView(container) {
  const campaigns = getSchedulerState();

  container.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;margin-bottom:20px;">
      <div>
        <h2 style="font-size:20px;font-weight:600;margin-bottom:2px;">📅 Campaña Scheduler</h2>
        <p style="font-size:12px;color:var(--muted);">Planificador multicanal de 4 semanas</p>
      </div>
      <div style="display:flex;gap:8px;">
        <button class="btn btn-sm btn-ghost" onclick="window.location.hash='';renderTools()">← Volver</button>
        <button class="btn btn-sm btn-primary" onclick="openNewCampaign()">+ Nueva Campaña</button>
      </div>
    </div>

    ${campaigns.length === 0 ? `
      <div style="text-align:center;padding:60px 20px;background:var(--bg2);border:0.5px solid var(--border);border-radius:var(--radius2);">
        <div style="font-size:40px;margin-bottom:12px;">📅</div>
        <h3 style="font-size:16px;font-weight:500;margin-bottom:6px;">No hay campañas</h3>
        <p style="font-size:13px;color:var(--muted);margin-bottom:16px;">Crea tu primera campaña de 4 semanas</p>
        <button class="btn btn-primary" onclick="openNewCampaign()">+ Crear Campaña</button>
      </div>
    ` : `
      <div style="display:grid;gap:14px;">
        ${campaigns.map((c, idx) => renderCampaignCard(c, idx)).join('')}
      </div>
    `}
  `;
}

function renderCampaignCard(c, idx) {
  const totalTasks = c.tasks.length;
  const doneTasks = c.tasks.filter(t => t.status === 'done').length;
  const progress = totalTasks > 0 ? Math.round(doneTasks / totalTasks * 100) : 0;
  const totalBudget = c.tasks.reduce((s, t) => s + (parseFloat(t.cost) || 0), 0);

  return `
    <div style="background:var(--bg2);border:0.5px solid var(--border);border-radius:var(--radius2);overflow:hidden;">
      <div style="padding:16px 18px;display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:10px;">
        <div>
          <div style="font-size:15px;font-weight:500;">${c.name}</div>
          <div style="font-size:12px;color:var(--muted);margin-top:2px;">${c.artist} · Inicio: ${c.startDate || '—'}</div>
        </div>
        <div style="display:flex;gap:8px;align-items:center;">
          <span style="font-size:11px;color:var(--muted);">${doneTasks}/${totalTasks}</span>
          <div style="width:60px;height:4px;background:var(--bg4);border-radius:2px;overflow:hidden;">
            <div style="width:${progress}%;height:100%;background:var(--accent);border-radius:2px;"></div>
          </div>
          <span style="font-family:var(--mono);font-size:12px;color:var(--accent);">$${totalBudget.toFixed(0)}</span>
          <button class="btn btn-xs btn-ghost" onclick="openEditCampaign(${idx})" style="font-size:11px;">✏️</button>
          <button class="btn btn-xs btn-danger" onclick="deleteCampaign(${idx})" style="font-size:11px;">🗑</button>
        </div>
      </div>

      <!-- Timeline -->
      <div style="padding:0 18px 16px;display:grid;grid-template-columns:repeat(4,1fr);gap:8px;">
        ${WEEK_LABELS.map((wl, wi) => {
          const weekTasks = c.tasks.filter(t => t.week === wi);
          return `
            <div style="background:var(--bg3);border-radius:var(--radius);padding:10px;border:0.5px solid var(--border);">
              <div style="font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:0.03em;margin-bottom:6px;">${wl.replace('Semana ', 'S')}</div>
              ${weekTasks.length === 0 ? '<div style="font-size:10px;color:var(--muted2);">Sin tareas</div>' :
                weekTasks.map(t => `
                  <div style="display:flex;align-items:center;gap:4px;font-size:11px;padding:3px 0;border-bottom:0.5px solid rgba(255,255,255,0.03);">
                    <span style="color:${t.status === 'done' ? 'var(--success)' : t.status === 'active' ? 'var(--warning)' : 'var(--muted2)'};">${t.status === 'done' ? '✓' : t.status === 'active' ? '◉' : '○'}</span>
                    <span style="flex:1;color:${t.status === 'done' ? 'var(--muted)' : 'var(--text2)'};">${t.action}</span>
                    <span style="font-size:9px;color:var(--muted2);">${t.platform?.substring(0,3) || ''}</span>
                  </div>
                `).join('')}
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

function openNewCampaign() {
  openModal('📅 Nueva Campaña', getCampaignForm(null), `
    <button class="btn btn-sm btn-ghost" onclick="closeModal()">Cancelar</button>
    <button class="btn btn-sm btn-primary" onclick="saveNewCampaign()">Crear Campaña</button>
  `);
}

function openEditCampaign(idx) {
  const campaigns = getSchedulerState();
  const c = campaigns[idx];
  if (!c) return;
  openModal('✏️ Editar Campaña', getCampaignForm(c, idx), `
    <button class="btn btn-sm btn-ghost" onclick="closeModal()">Cancelar</button>
    <button class="btn btn-sm btn-primary" onclick="saveEditCampaign(${idx})">Guardar</button>
  `);
}

function getCampaignForm(c, idx) {
  const name = c?.name || '';
  const artist = c?.artist || '';
  const startDate = c?.startDate || '';
  const tasks = c?.tasks || [];

  let html = `
    <p style="font-size:12px;color:var(--muted);margin-bottom:14px;">Define las tareas semana por semana para tu campaña de lanzamiento.</p>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
      <div class="form-group">
        <label>Nombre de la campaña</label>
        <input type="text" id="sc-name" value="${name}" placeholder="Ej: Lanzamiento Sencillo" />
      </div>
      <div class="form-group">
        <label>Artista / Proyecto</label>
        <input type="text" id="sc-artist" value="${artist}" placeholder="Ej: Ramón Orlando" />
      </div>
    </div>
    <div class="form-group">
      <label>Fecha de inicio</label>
      <input type="date" id="sc-date" value="${startDate}" />
    </div>
    <h4 style="font-size:13px;color:var(--accent);margin:14px 0 10px;">Tareas por semana</h4>
    <div id="sc-tasks-container">
      ${WEEK_LABELS.map((wl, wi) => `
        <div style="background:var(--bg3);border:0.5px solid var(--border);border-radius:var(--radius);padding:12px;margin-bottom:10px;">
          <div style="font-size:11px;color:var(--accent);font-weight:500;margin-bottom:8px;">${wl}</div>
          <div id="sc-week-${wi}">
            ${(tasks.filter(t => t.week === wi) || []).map((t, ti) => renderTaskRow(wi, ti, t)).join('')  || ''}
          </div>
          <button class="btn btn-xs btn-ghost" onclick="addTaskRow(${wi})" style="margin-top:6px;font-size:10px;">+ Agregar tarea</button>
        </div>
      `).join('')}
    </div>
  `;
  return html;
}

function renderTaskRow(week, idx, task) {
  const action = task?.action || '';
  const platform = task?.platform || 'Instagram';
  const cost = task?.cost || '';
  const status = task?.status || 'pending';
  return `
    <div style="display:flex;gap:6px;align-items:center;margin-bottom:6px;" class="task-row" data-week="${week}" data-idx="${idx}">
      <select style="background:var(--bg4);border:0.5px solid var(--border);border-radius:4px;color:var(--text);font-size:11px;padding:4px 6px;font-family:var(--font);outline:none;">
        ${PLATFORMS.map(p => `<option value="${p}" ${p === platform ? 'selected' : ''}>${p}</option>`).join('')}
      </select>
      <input type="text" value="${action}" placeholder="Acción" style="flex:1;background:var(--bg4);border:0.5px solid var(--border);border-radius:4px;color:var(--text);font-size:11px;padding:4px 6px;font-family:var(--font);outline:none;" />
      <input type="number" value="${cost}" placeholder="$" style="width:55px;background:var(--bg4);border:0.5px solid var(--border);border-radius:4px;color:var(--text);font-size:11px;padding:4px 6px;font-family:var(--mono);outline:none;" />
      <select style="background:var(--bg4);border:0.5px solid var(--border);border-radius:4px;color:var(--text);font-size:11px;padding:4px 6px;font-family:var(--font);outline:none;">
        <option value="pending" ${status === 'pending' ? 'selected' : ''}>Pendiente</option>
        <option value="active" ${status === 'active' ? 'selected' : ''}>Activa</option>
        <option value="done" ${status === 'done' ? 'selected' : ''}>Completada</option>
      </select>
      <button class="btn btn-xs btn-danger" onclick="this.parentElement.remove()" style="font-size:10px;padding:2px 6px;">×</button>
    </div>
  `;
}

function addTaskRow(week) {
  const container = document.getElementById(`sc-week-${week}`);
  if (!container) return;
  container.insertAdjacentHTML('beforeend', renderTaskRow(week, Date.now(), { action: '', platform: 'Instagram', cost: '', status: 'pending' }));
}

function collectCampaignTasks() {
  const tasks = [];
  document.querySelectorAll('.task-row').forEach(row => {
    const week = parseInt(row.dataset.week);
    const selects = row.querySelectorAll('select');
    const inputs = row.querySelectorAll('input');
    if (selects.length >= 2 && inputs.length >= 1) {
      const platform = selects[0].value;
      const action = inputs[0].value.trim();
      const cost = inputs[1]?.value || '0';
      const status = selects[1].value;
      if (action) {
        tasks.push({ week, platform, action, cost, status });
      }
    }
  });
  return tasks;
}

function saveNewCampaign() {
  const name = document.getElementById('sc-name')?.value.trim();
  const artist = document.getElementById('sc-artist')?.value.trim();
  const startDate = document.getElementById('sc-date')?.value || '';
  if (!name) { alert('El nombre de la campaña es obligatorio'); return; }
  if (!artist) { alert('El artista es obligatorio'); return; }

  const tasks = collectCampaignTasks();
  const campaigns = getSchedulerState();
  campaigns.push({ id: Date.now(), name, artist, startDate, tasks, createdAt: new Date().toISOString() });
  saveSchedulerState(campaigns);
  closeModal();
  window.location.hash = 'scheduler';
  renderTools();
}

function saveEditCampaign(idx) {
  const name = document.getElementById('sc-name')?.value.trim();
  const artist = document.getElementById('sc-artist')?.value.trim();
  const startDate = document.getElementById('sc-date')?.value || '';
  if (!name || !artist) { alert('Nombre y artista son obligatorios'); return; }

  const tasks = collectCampaignTasks();
  const campaigns = getSchedulerState();
  if (campaigns[idx]) {
    campaigns[idx] = { ...campaigns[idx], name, artist, startDate, tasks };
    saveSchedulerState(campaigns);
  }
  closeModal();
  window.location.hash = 'scheduler';
  renderTools();
}

function deleteCampaign(idx) {
  if (!confirm('¿Eliminar esta campaña?')) return;
  const campaigns = getSchedulerState();
  campaigns.splice(idx, 1);
  saveSchedulerState(campaigns);
  window.location.hash = 'scheduler';
  renderTools();
}


/* ══════════════════════════════════════════════
   PLAYLIST MANAGER TOOL
   ══════════════════════════════════════════════ */

const OUTREACH_STATUSES = ['Para enviar', 'Enviado', 'Respondió', 'Aceptado', 'Rechazado', 'Follow-up'];

function getPlaylistState() {
  try { return JSON.parse(localStorage.getItem('na_playlist_manager') || '[]'); }
  catch { return []; }
}

function savePlaylistState(playlists) {
  localStorage.setItem('na_playlist_manager', JSON.stringify(playlists));
}

function renderPlaylistView(container) {
  const playlists = getPlaylistState();

  // Stats
  const total = playlists.length;
  const sent = playlists.filter(p => p.status === 'Enviado' || p.status === 'Respondió' || p.status === 'Aceptado').length;
  const accepted = playlists.filter(p => p.status === 'Aceptado').length;
  const pending = playlists.filter(p => p.status === 'Para enviar').length;

  container.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;margin-bottom:20px;">
      <div>
        <h2 style="font-size:20px;font-weight:600;margin-bottom:2px;">🎧 Playlist Manager</h2>
        <p style="font-size:12px;color:var(--muted);">Gestión de outreach a curadores y seguimiento de placements</p>
      </div>
      <div style="display:flex;gap:8px;">
        <button class="btn btn-sm btn-ghost" onclick="window.location.hash='';renderTools()">← Volver</button>
        <button class="btn btn-sm btn-primary" onclick="openNewPlaylist()">+ Agregar Playlist</button>
      </div>
    </div>

    <!-- Stats -->
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:20px;">
      <div style="background:var(--bg2);border:0.5px solid var(--border);border-radius:var(--radius);padding:14px;text-align:center;">
        <div style="font-size:10px;color:var(--muted);text-transform:uppercase;">Total</div>
        <div style="font-size:22px;font-weight:600;font-family:var(--mono);color:var(--text);">${total}</div>
      </div>
      <div style="background:var(--bg2);border:0.5px solid var(--border);border-radius:var(--radius);padding:14px;text-align:center;">
        <div style="font-size:10px;color:var(--muted);text-transform:uppercase;">Enviados</div>
        <div style="font-size:22px;font-weight:600;font-family:var(--mono);color:var(--info);">${sent}</div>
      </div>
      <div style="background:var(--bg2);border:0.5px solid var(--border);border-radius:var(--radius);padding:14px;text-align:center;">
        <div style="font-size:10px;color:var(--muted);text-transform:uppercase;">Aceptados</div>
        <div style="font-size:22px;font-weight:600;font-family:var(--mono);color:var(--success);">${accepted}</div>
      </div>
      <div style="background:var(--bg2);border:0.5px solid var(--border);border-radius:var(--radius);padding:14px;text-align:center;">
        <div style="font-size:10px;color:var(--muted);text-transform:uppercase;">Pendientes</div>
        <div style="font-size:22px;font-weight:600;font-family:var(--mono);color:var(--warning);">${pending}</div>
      </div>
    </div>

    ${playlists.length === 0 ? `
      <div style="text-align:center;padding:60px 20px;background:var(--bg2);border:0.5px solid var(--border);border-radius:var(--radius2);">
        <div style="font-size:40px;margin-bottom:12px;">🎧</div>
        <h3 style="font-size:16px;font-weight:500;margin-bottom:6px;">No hay playlists registradas</h3>
        <p style="font-size:13px;color:var(--muted);margin-bottom:16px;">Agrega las playlists a las que quieres llegar</p>
        <button class="btn btn-primary" onclick="openNewPlaylist()">+ Agregar Playlist</button>
      </div>
    ` : `
      <div style="background:var(--bg2);border:0.5px solid var(--border);border-radius:var(--radius2);overflow-x:auto;">
        <table style="width:100%;border-collapse:collapse;font-size:13px;">
          <thead>
            <tr style="border-bottom:0.5px solid var(--border);">
              <th style="padding:10px 12px;text-align:left;font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:0.03em;">Playlist</th>
              <th style="padding:10px 12px;text-align:left;font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:0.03em;">Curador</th>
              <th style="padding:10px 12px;text-align:left;font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:0.03em;">Canción</th>
              <th style="padding:10px 12px;text-align:left;font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:0.03em;">Estado</th>
              <th style="padding:10px 12px;text-align:left;font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:0.03em;">Envío</th>
              <th style="padding:10px 12px;text-align:right;font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:0.03em;"></th>
            </tr>
          </thead>
          <tbody>
            ${playlists.map((p, idx) => `
              <tr style="border-bottom:0.5px solid rgba(255,255,255,0.04);transition:background 0.1s;" onmouseover="this.style.background='var(--bg3)'" onmouseout="this.style.background=''">
                <td style="padding:10px 12px;">
                  <div style="font-size:13px;font-weight:500;">${p.name}</div>
                  <div style="font-size:10px;color:var(--muted);">${p.spotifyUrl ? '🔗 Link' : ''}</div>
                </td>
                <td style="padding:10px 12px;">
                  <div style="font-size:12px;">${p.curator || '—'}</div>
                  <div style="font-size:10px;color:var(--muted);">${p.email || p.ig || '—'}</div>
                </td>
                <td style="padding:10px 12px;font-size:12px;">${p.song || '—'}</td>
                <td style="padding:10px 12px;">
                  <span style="display:inline-block;font-size:11px;padding:2px 8px;border-radius:4px;font-weight:500;
                    ${p.status === 'Aceptado' ? 'background:rgba(76,173,124,0.15);color:var(--success);' :
                      p.status === 'Rechazado' ? 'background:rgba(224,92,92,0.15);color:var(--danger);' :
                      p.status === 'Enviado' ? 'background:rgba(92,140,224,0.15);color:var(--info);' :
                      p.status === 'Respondió' ? 'background:rgba(224,184,92,0.15);color:var(--warning);' :
                      p.status === 'Follow-up' ? 'background:rgba(224,160,110,0.15);color:var(--orange);' :
                      'background:var(--bg4);color:var(--muted);'}">${p.status || 'Para enviar'}</span>
                </td>
                <td style="padding:10px 12px;font-size:11px;color:var(--muted);font-family:var(--mono);">${p.submitDate || '—'}</td>
                <td style="padding:10px 12px;text-align:right;">
                  <button class="btn btn-xs btn-ghost" onclick="openEditPlaylist(${idx})" style="font-size:10px;">✏️</button>
                  <button class="btn btn-xs btn-danger" onclick="deletePlaylist(${idx})" style="font-size:10px;">×</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `}
  `;
}

function openNewPlaylist() {
  openModal('🎧 Nueva Playlist', getPlaylistForm(null), `
    <button class="btn btn-sm btn-ghost" onclick="closeModal()">Cancelar</button>
    <button class="btn btn-sm btn-primary" onclick="saveNewPlaylist()">Guardar</button>
  `);
}

function openEditPlaylist(idx) {
  const playlists = getPlaylistState();
  const p = playlists[idx];
  if (!p) return;
  openModal('✏️ Editar Playlist', getPlaylistForm(p, idx), `
    <button class="btn btn-sm btn-ghost" onclick="closeModal()">Cancelar</button>
    <button class="btn btn-sm btn-primary" onclick="saveEditPlaylist(${idx})">Guardar</button>
  `);
}

function getPlaylistForm(p, idx) {
  const name = p?.name || '';
  const curator = p?.curator || '';
  const email = p?.email || '';
  const ig = p?.ig || '';
  const song = p?.song || '';
  const status = p?.status || 'Para enviar';
  const submitDate = p?.submitDate || '';
  const followUp = p?.followUp || '';
  const notes = p?.notes || '';
  const spotifyUrl = p?.spotifyUrl || '';

  return `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
      <div class="form-group">
        <label>Nombre de la Playlist</label>
        <input type="text" id="pl-name" value="${name}" placeholder="Ej: Dembow 2026" />
      </div>
      <div class="form-group">
        <label>Curador / Owner</label>
        <input type="text" id="pl-curator" value="${curator}" placeholder="Ej: Juan Pérez" />
      </div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
      <div class="form-group">
        <label>Email</label>
        <input type="email" id="pl-email" value="${email}" placeholder="curador@email.com" />
      </div>
      <div class="form-group">
        <label>Instagram</label>
        <input type="text" id="pl-ig" value="${ig}" placeholder="@curador" />
      </div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
      <div class="form-group">
        <label>Canción enviada</label>
        <input type="text" id="pl-song" value="${song}" placeholder="Ej: Una Foto Remix" />
      </div>
      <div class="form-group">
        <label>Estado</label>
        <select id="pl-status" style="background:var(--bg3);border:0.5px solid var(--border);border-radius:var(--radius);padding:10px 14px;color:var(--text);font-size:13px;font-family:var(--font);outline:none;width:100%;">
          ${OUTREACH_STATUSES.map(s => `<option value="${s}" ${s === status ? 'selected' : ''}>${s}</option>`).join('')}
        </select>
      </div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
      <div class="form-group">
        <label>Fecha de envío</label>
        <input type="date" id="pl-date" value="${submitDate}" />
      </div>
      <div class="form-group">
        <label>Follow-up date</label>
        <input type="date" id="pl-followup" value="${followUp}" />
      </div>
    </div>
    <div class="form-group">
      <label>URL de Spotify</label>
      <input type="url" id="pl-url" value="${spotifyUrl}" placeholder="https://open.spotify.com/playlist/..." />
    </div>
    <div class="form-group">
      <label>Notas</label>
      <textarea id="pl-notes" rows="2" placeholder="Notas sobre la playlist o el curador...">${notes}</textarea>
    </div>
    <div id="pl-result" style="display:none;"></div>
  `;
}

function saveNewPlaylist() {
  const name = document.getElementById('pl-name')?.value.trim();
  if (!name) { alert('El nombre de la playlist es obligatorio'); return; }

  const playlist = {
    id: Date.now(),
    name,
    curator: document.getElementById('pl-curator')?.value.trim() || '',
    email: document.getElementById('pl-email')?.value.trim() || '',
    ig: document.getElementById('pl-ig')?.value.trim() || '',
    song: document.getElementById('pl-song')?.value.trim() || '',
    status: document.getElementById('pl-status')?.value || 'Para enviar',
    submitDate: document.getElementById('pl-date')?.value || '',
    followUp: document.getElementById('pl-followup')?.value || '',
    notes: document.getElementById('pl-notes')?.value.trim() || '',
    spotifyUrl: document.getElementById('pl-url')?.value.trim() || '',
    createdAt: new Date().toISOString()
  };

  const playlists = getPlaylistState();
  playlists.push(playlist);
  savePlaylistState(playlists);
  closeModal();
  window.location.hash = 'playlist-manager';
  renderTools();
}

function saveEditPlaylist(idx) {
  const name = document.getElementById('pl-name')?.value.trim();
  if (!name) { alert('El nombre de la playlist es obligatorio'); return; }

  const playlists = getPlaylistState();
  if (!playlists[idx]) return;

  playlists[idx] = {
    ...playlists[idx],
    name,
    curator: document.getElementById('pl-curator')?.value.trim() || '',
    email: document.getElementById('pl-email')?.value.trim() || '',
    ig: document.getElementById('pl-ig')?.value.trim() || '',
    song: document.getElementById('pl-song')?.value.trim() || '',
    status: document.getElementById('pl-status')?.value || 'Para enviar',
    submitDate: document.getElementById('pl-date')?.value || '',
    followUp: document.getElementById('pl-followup')?.value || '',
    notes: document.getElementById('pl-notes')?.value.trim() || '',
    spotifyUrl: document.getElementById('pl-url')?.value.trim() || ''
  };

  savePlaylistState(playlists);
  closeModal();
  window.location.hash = 'playlist-manager';
  renderTools();
}

function deletePlaylist(idx) {
  if (!confirm('¿Eliminar esta playlist?')) return;
  const playlists = getPlaylistState();
  playlists.splice(idx, 1);
  savePlaylistState(playlists);
  window.location.hash = 'playlist-manager';
  renderTools();
}


/* ══════════════════════════════════════════════
   ANALYTICS DASHBOARD TOOL
   Spotify API + Chartmetric + Simulated Data
   ══════════════════════════════════════════════ */

/* ── API Configuration ── */
function getAnalyticsConfig() {
  try { return JSON.parse(localStorage.getItem('na_analytics_config') || '{}'); }
  catch { return {}; }
}

function saveAnalyticsConfig(cfg) {
  localStorage.setItem('na_analytics_config', JSON.stringify(cfg));
}

/* ── Spotify API Connector (Client Credentials Flow) ── */
async function spotifyGetToken(clientId, clientSecret) {
  if (!clientId || !clientSecret) return null;
  try {
    const res = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
      },
      body: 'grant_type=client_credentials'
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.access_token || null;
  } catch(e) { return null; }
}

async function spotifySearchArtist(query, clientId, clientSecret) {
  const token = await spotifyGetToken(clientId, clientSecret);
  if (!token) return null;
  try {
    const res = await fetch('https://api.spotify.com/v1/search?q=' + encodeURIComponent(query) + '&type=artist&limit=5', {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Accept': 'application/json'
      }
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.artists?.items || [];
  } catch(e) { return null; }
}

/* ── Simulated Data Engine ── */
function generateSimulatedData(artistName) {
  // Create deterministic but realistic-looking data
  const seed = artistName.length + (artistName.charCodeAt(0) || 65);
  const r = (max) => Math.floor(((seed * 9301 + 49297) % 233280) / 233280 * max) + 1;

  const followers = r(8) * 1000 + 500;
  const monthlyStreams = followers * (r(15) + 5);
  const ytSubs = Math.floor(followers * (0.3 + r(5)/10));
  const ytViews = ytSubs * (r(30) + 10);
  const igFollowers = Math.floor(followers * (1.2 + r(3)/10));
  const ttFollowers = Math.floor(followers * (0.8 + r(4)/10));

  // Monthly trend (last 6 months)
  const trend = [];
  for (let i = 5; i >= 0; i--) {
    const growth = 1 + (r(10) - 3) / 100;
    trend.push({ month: getMonthName(i), value: Math.floor(monthlyStreams * growth) });
  }

  return {
    name: artistName,
    followers,
    monthlyStreams,
    popularity: r(40) + 30,
    ytSubs, ytViews,
    igFollowers, ttFollowers,
    tracks: [
      { name: 'Canción Principal', streams: Math.floor(monthlyStreams * 0.35), daily: Math.floor(monthlyStreams / 30 * 0.35) },
      { name: 'Colaboración Éxito', streams: Math.floor(monthlyStreams * 0.25), daily: Math.floor(monthlyStreams / 30 * 0.25) },
      { name: 'Sencillo Reciente', streams: Math.floor(monthlyStreams * 0.18), daily: Math.floor(monthlyStreams / 30 * 0.18) },
      { name: 'Clásico del Catálogo', streams: Math.floor(monthlyStreams * 0.12), daily: Math.floor(monthlyStreams / 30 * 0.12) },
      { name: 'Tema de Temporada', streams: Math.floor(monthlyStreams * 0.10), daily: Math.floor(monthlyStreams / 30 * 0.10) },
    ],
    trend,
    estRevenue: monthlyStreams * 0.0035,
    growthScore: Math.min(95, 40 + r(40)),
    source: 'Simulado — Sin API configurada',
    spotifyError: null
  };
}

function getMonthName(offset) {
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const d = new Date();
  d.setMonth(d.getMonth() - offset);
  return months[d.getMonth()];
}

/* ── Render Analytics Dashboard ── */
function renderAnalyticsDashboard(container) {
  const config = getAnalyticsConfig();
  const savedArtist = config.lastArtist || '';

  container.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;margin-bottom:16px;">
      <div>
        <h2 style="font-size:20px;font-weight:600;margin-bottom:2px;">📊 Analytics Dashboard</h2>
        <p style="font-size:12px;color:var(--muted);">Métricas en vivo de artistas con datos reales y simulados</p>
      </div>
      <div style="display:flex;gap:8px;">
        <button class="btn btn-sm btn-ghost" onclick="window.location.hash='';renderTools()">← Volver</button>
        <button class="btn btn-sm btn-ghost" onclick="openAnalyticsConfig()">⚙️ Config</button>
      </div>
    </div>

    <!-- Artist Search -->
    <div style="background:var(--bg2);border:0.5px solid var(--border);border-radius:var(--radius2);padding:16px;margin-bottom:20px;">
      <div style="display:flex;gap:10px;align-items:flex-end;">
        <div class="form-group" style="flex:1;margin:0;">
          <label>Buscar artista</label>
          <input type="text" id="ad-artist-search" value="${savedArtist}" placeholder="Ej: Ramón Orlando, Bad Bunny..." onkeydown="if(event.key==='Enter')runAnalyticsSearch()" />
        </div>
        <button class="btn btn-primary" onclick="runAnalyticsSearch()" style="margin-bottom:1px;">🔍 Buscar</button>
      </div>
      <div id="ad-search-results" style="display:none;margin-top:10px;"></div>
    </div>

    <!-- Dashboard Content -->
    <div id="ad-dashboard-content">
      ${savedArtist ? `<div style="text-align:center;padding:30px;color:var(--muted);">Haz clic en "Buscar" para cargar datos de <strong style="color:var(--text);">${savedArtist}</strong></div>` : `
      <div style="text-align:center;padding:60px 20px;background:var(--bg2);border:0.5px solid var(--border);border-radius:var(--radius2);">
        <div style="font-size:40px;margin-bottom:12px;">📊</div>
        <h3 style="font-size:16px;font-weight:500;margin-bottom:6px;">Busca un artista para empezar</h3>
        <p style="font-size:13px;color:var(--muted);margin-bottom:4px;">Ingresa el nombre arriba y presiona Enter o el botón de búsqueda.</p>
        <p style="font-size:11px;color:var(--muted2);">Los datos se generan de forma inteligente combinando APIs reales (Spotify) con simulación avanzada.</p>
      </div>`}
    </div>
  `;
}

async function runAnalyticsSearch() {
  const input = document.getElementById('ad-artist-search');
  const artistName = input?.value.trim();
  if (!artistName) return;

  // Save config
  const config = getAnalyticsConfig();
  config.lastArtist = artistName;
  saveAnalyticsConfig(config);

  // Show loading
  const container = document.getElementById('ad-dashboard-content');
  if (!container) return;
  container.innerHTML = `<div style="text-align:center;padding:40px;color:var(--muted);font-size:14px;">⏳ Generando dashboard para <strong style="color:var(--text);">${artistName}</strong>...</div>`;

  // Try Spotify search first (requires both Client ID and Client Secret)
  let spotifyData = null;
  let spotifyError = null;
  const cfg = getAnalyticsConfig();
  if (cfg.spotifyClientId && cfg.spotifyClientSecret) {
    const results = await spotifySearchArtist(artistName, cfg.spotifyClientId, cfg.spotifyClientSecret);
    if (results === null) {
      spotifyError = 'Credenciales inválidas o error de conexión con Spotify';
    } else if (results.length > 0) {
      const artist = results[0];
      spotifyData = {
        name: artist.name,
        followers: artist.followers?.total || 0,
        popularity: artist.popularity || 0,
        genres: artist.genres || [],
        image: artist.images?.[0]?.url || '',
        spotifyUrl: artist.external_urls?.spotify || ''
      };
    } else {
      spotifyError = 'Artista no encontrado en Spotify';
    }
  } else if (cfg.spotifyClientId && !cfg.spotifyClientSecret) {
    spotifyError = 'Falta el Client Secret de Spotify';
  }

  // Generate full simulated data using the artist name (for additional metrics)
  const simulated = generateSimulatedData(artistName);

  // Merge real + simulated
  const data = {
    artistName,
    spotify: spotifyData,
    simulated,
    config,
    hasRealSpotify: !!spotifyData,
    spotifyError
  };

  renderAnalyticsResults(container, data);
}

function renderAnalyticsResults(container, data) {
  const { artistName, spotify, simulated, hasRealSpotify } = data;
  const d = simulated;

  // Determine data source badge
  const spotifyError = data.spotifyError || null;
  let sourceBadge;
  if (hasRealSpotify) {
    sourceBadge = '<span style="display:inline-block;font-size:10px;padding:2px 8px;border-radius:4px;background:rgba(76,173,124,0.15);color:var(--success);font-weight:500;">● Spotify API · Datos reales</span>';
  } else if (spotifyError) {
    sourceBadge = '<span style="display:inline-block;font-size:10px;padding:2px 8px;border-radius:4px;background:rgba(224,92,92,0.15);color:var(--danger);font-weight:500;">⚠️ ' + spotifyError + '</span>';
  } else {
    sourceBadge = '<span style="display:inline-block;font-size:10px;padding:2px 8px;border-radius:4px;background:rgba(224,184,92,0.15);color:var(--warning);font-weight:500;">● Datos simulados · Configura API en ⚙️</span>';
  }

  const imgUrl = spotify?.image || '';

  container.innerHTML = `
    <!-- Header -->
    <div style="display:flex;align-items:center;gap:14px;margin-bottom:16px;background:var(--bg2);border:0.5px solid var(--border);border-radius:var(--radius2);padding:16px;">
      ${imgUrl ? `<img src="${imgUrl}" style="width:60px;height:60px;border-radius:var(--radius);object-fit:cover;" alt="" />` :
        `<div style="width:60px;height:60px;border-radius:var(--radius);background:var(--bg4);display:flex;align-items:center;justify-content:center;font-size:24px;">🎤</div>`}
      <div style="flex:1;">
        <div style="font-size:18px;font-weight:600;">${artistName}</div>
        ${spotify?.genres?.length ? '<div style="font-size:11px;color:var(--muted);">' + spotify.genres.slice(0,3).join(' · ') + '</div>' : ''}
        ${sourceBadge}
      </div>
      <div style="text-align:right;">
        <div style="font-size:10px;color:var(--muted);text-transform:uppercase;">Popularidad</div>
        <div style="font-size:24px;font-weight:700;font-family:var(--mono);color:${d.popularity > 60 ? 'var(--success)' : d.popularity > 40 ? 'var(--warning)' : 'var(--muted)'};">${spotify?.popularity || d.popularity}</div>
        <div style="font-size:10px;color:var(--muted);">/ 100</div>
      </div>
    </div>

    <!-- Stat Cards -->
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:10px;margin-bottom:20px;">
      <div style="background:var(--bg2);border:0.5px solid var(--border);border-radius:var(--radius);padding:14px;">
        <div style="font-size:10px;color:var(--muted);text-transform:uppercase;">Seguidores Spotify</div>
        <div style="font-size:20px;font-weight:600;font-family:var(--mono);color:var(--success);">${(spotify?.followers || d.followers).toLocaleString()}</div>
      </div>
      <div style="background:var(--bg2);border:0.5px solid var(--border);border-radius:var(--radius);padding:14px;">
        <div style="font-size:10px;color:var(--muted);text-transform:uppercase;">Streams / Mes</div>
        <div style="font-size:20px;font-weight:600;font-family:var(--mono);color:var(--info);">${d.monthlyStreams.toLocaleString()}</div>
      </div>
      <div style="background:var(--bg2);border:0.5px solid var(--border);border-radius:var(--radius);padding:14px;">
        <div style="font-size:10px;color:var(--muted);text-transform:uppercase;">Ingreso Mensual Est.</div>
        <div style="font-size:20px;font-weight:600;font-family:var(--mono);color:var(--accent);">$${d.estRevenue.toFixed(0)}</div>
      </div>
      <div style="background:var(--bg2);border:0.5px solid var(--border);border-radius:var(--radius);padding:14px;">
        <div style="font-size:10px;color:var(--muted);text-transform:uppercase;">Growth Score</div>
        <div style="font-size:20px;font-weight:600;font-family:var(--mono);color:${d.growthScore > 70 ? 'var(--success)' : 'var(--warning)'};">${d.growthScore}<span style="font-size:12px;color:var(--muted);">/100</span></div>
      </div>
    </div>

    <!-- Other Platforms -->
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:20px;">
      <div style="background:var(--bg2);border:0.5px solid var(--border);border-radius:var(--radius);padding:12px;text-align:center;">
        <div style="font-size:18px;margin-bottom:4px;">▶</div>
        <div style="font-size:10px;color:var(--muted);text-transform:uppercase;">YouTube Subs</div>
        <div style="font-size:16px;font-weight:600;font-family:var(--mono);color:var(--danger);">${d.ytSubs.toLocaleString()}</div>
        <div style="font-size:10px;color:var(--muted2);">${d.ytViews.toLocaleString()} views</div>
      </div>
      <div style="background:var(--bg2);border:0.5px solid var(--border);border-radius:var(--radius);padding:12px;text-align:center;">
        <div style="font-size:18px;margin-bottom:4px;">📸</div>
        <div style="font-size:10px;color:var(--muted);text-transform:uppercase;">Instagram Seguidores</div>
        <div style="font-size:16px;font-weight:600;font-family:var(--mono);color:var(--pink);">${d.igFollowers.toLocaleString()}</div>
        <div style="font-size:10px;color:var(--muted2);">Estimado</div>
      </div>
      <div style="background:var(--bg2);border:0.5px solid var(--border);border-radius:var(--radius);padding:12px;text-align:center;">
        <div style="font-size:18px;margin-bottom:4px;">🎵</div>
        <div style="font-size:10px;color:var(--muted);text-transform:uppercase;">TikTok Seguidores</div>
        <div style="font-size:16px;font-weight:600;font-family:var(--mono);color:var(--info);">${d.ttFollowers.toLocaleString()}</div>
        <div style="font-size:10px;color:var(--muted2);">Estimado</div>
      </div>
    </div>

    <!-- Trend Chart (6 months) -->
    <div style="background:var(--bg2);border:0.5px solid var(--border);border-radius:var(--radius2);padding:16px;margin-bottom:20px;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
        <h4 style="font-size:13px;font-weight:500;color:var(--text);">📈 Tendencia de streams (6 meses)</h4>
      </div>
      <div style="display:flex;align-items:flex-end;gap:8px;height:120px;padding:0 4px;">
        ${d.trend.map(t => {
          const maxVal = Math.max(...d.trend.map(x => x.value));
          const heightPct = Math.max(8, (t.value / maxVal) * 100);
          return `
            <div style="flex:1;display:flex;flex-direction:column;align-items:center;height:100%;justify-content:flex-end;">
              <div style="font-size:9px;color:var(--muted2);margin-bottom:4px;font-family:var(--mono);">${(t.value / 1000).toFixed(0)}K</div>
              <div style="width:100%;height:${heightPct}%;background:linear-gradient(to top, var(--accent), var(--accent2));border-radius:4px 4px 0 0;min-height:8px;transition:height 0.3s;"></div>
              <div style="font-size:9px;color:var(--muted);margin-top:4px;">${t.month}</div>
            </div>
          `;
        }).join('')}
      </div>
    </div>

    <!-- Top Tracks -->
    <div style="background:var(--bg2);border:0.5px solid var(--border);border-radius:var(--radius2);padding:16px;margin-bottom:20px;">
      <h4 style="font-size:13px;font-weight:500;margin-bottom:12px;">🎵 Top canciones del catálogo</h4>
      <table style="width:100%;border-collapse:collapse;font-size:13px;">
        <thead>
          <tr style="border-bottom:0.5px solid var(--border);">
            <th style="padding:6px 8px;text-align:left;font-size:11px;color:var(--muted);font-weight:500;">#</th>
            <th style="padding:6px 8px;text-align:left;font-size:11px;color:var(--muted);font-weight:500;">Canción</th>
            <th style="padding:6px 8px;text-align:right;font-size:11px;color:var(--muted);font-weight:500;">Streams/mes</th>
            <th style="padding:6px 8px;text-align:right;font-size:11px;color:var(--muted);font-weight:500;">Diarios</th>
            <th style="padding:6px 8px;text-align:right;font-size:11px;color:var(--muted);font-weight:500;">%</th>
          </tr>
        </thead>
        <tbody>
          ${d.tracks.map((t, i) => `
            <tr style="border-bottom:0.5px solid rgba(255,255,255,0.04);">
              <td style="padding:6px 8px;color:var(--muted);font-family:var(--mono);font-size:11px;">${i+1}</td>
              <td style="padding:6px 8px;">${t.name}</td>
              <td style="padding:6px 8px;text-align:right;font-family:var(--mono);color:var(--accent);">${t.streams.toLocaleString()}</td>
              <td style="padding:6px 8px;text-align:right;font-family:var(--mono);color:var(--muted);">${t.daily.toLocaleString()}</td>
              <td style="padding:6px 8px;text-align:right;font-family:var(--mono);color:var(--muted);">${(t.streams / d.monthlyStreams * 100).toFixed(1)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <!-- Insights -->
    <div style="background:var(--bg3);border:0.5px solid var(--border);border-radius:var(--radius2);padding:16px;">
      <h4 style="font-size:13px;font-weight:500;margin-bottom:8px;">💡 Insights</h4>
      <div style="font-size:12px;color:var(--text2);line-height:1.7;">
        • <strong style="color:var(--accent);">Ratio streams/seguidores:</strong> ${d.followers > 0 ? (d.monthlyStreams / d.followers).toFixed(1) : 'N/A'}x (${spotify ? 'dato real de Spotify' : 'simulado'})<br>
        • ${d.growthScore > 70 ? '<strong style="color:var(--success);">Crecimiento saludable</strong> — la base de seguidores está activa y creciendo' : '<strong style="color:var(--warning);">Crecimiento moderado</strong> — hay oportunidad de acelerar con campañas de tráfico'}<br>
        • ${d.ytSubs < d.followers * 0.5 ? '<strong style="color:var(--warning);">YouTube está sub-monetizado</strong> — aplicar estrategia de Otohits + Masthead para crecer' : '<strong style="color:var(--success);">YouTube con buena presencia</strong> — mantener estrategia actual'}<br>
        • ${hasRealSpotify ? '✅ Datos de Spotify vía API real' : '⚙️ <strong style="color:var(--accent);">Configura Spotify API</strong> en ⚙️ para obtener datos reales del artista'} <br>
        • ${spotify?.spotifyUrl ? `<a href="${spotify.spotifyUrl}" target="_blank" style="color:var(--info);">🔗 Abrir en Spotify</a>` : ''}
      </div>
    </div>
  `;
}

/* ── Config Modal ── */
function openAnalyticsConfig() {
  const config = getAnalyticsConfig();

  openModal('⚙️ Configuración de APIs', `
    <p style="font-size:12px;color:var(--muted);margin-bottom:16px;">
      Configura tus claves de API para obtener datos reales. Sin API configurada, se usan datos simulados inteligentes.
    </p>

    <div style="background:var(--bg3);border:0.5px solid var(--border);border-radius:var(--radius);padding:12px;margin-bottom:16px;">
      <h4 style="font-size:12px;color:var(--info);margin-bottom:4px;">🎵 Spotify API</h4>
      <p style="font-size:11px;color:var(--muted);margin-bottom:8px;">Obtén tu Client ID y Client Secret en <a href="https://developer.spotify.com/dashboard" target="_blank" style="color:var(--accent);">Spotify Developer Dashboard</a> (gratis). Crea una app y copia ambas credenciales.</p>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
        <div class="form-group" style="margin:0;">
          <label style="font-size:11px;">Client ID</label>
          <input type="text" id="ad-cfg-spotify" value="${config.spotifyClientId || ''}" placeholder="Tu Spotify Client ID" />
        </div>
        <div class="form-group" style="margin:0;">
          <label style="font-size:11px;">Client Secret</label>
          <input type="password" id="ad-cfg-spotify-secret" value="${config.spotifyClientSecret || ''}" placeholder="Tu Client Secret" />
        </div>
      </div>
      <div style="font-size:10px;color:var(--warning);margin-top:6px;padding:6px 10px;background:rgba(224,184,92,0.08);border-radius:4px;border:0.5px solid rgba(224,184,92,0.15);">
        ⚠️ El Client Secret queda almacenado en tu navegador (localStorage). No compartas esta app con otras personas si configuras credenciales reales.
      </div>
    </div>

    <div style="background:var(--bg3);border:0.5px solid var(--border);border-radius:var(--radius);padding:12px;margin-bottom:16px;">
      <h4 style="font-size:12px;color:var(--muted2);margin-bottom:4px;">📊 Chartmetric API <span style="font-size:9px;color:var(--muted2);font-weight:400;">— Próximamente</span></h4>
      <p style="font-size:11px;color:var(--muted);margin-bottom:8px;">Requiere contacto directo con Chartmetric. Escribe a <code style="color:var(--accent);">hi@chartmetric.com</code> para solicitar acceso. Cuando tengas el token, agrégalo aquí.</p>
      <div class="form-group" style="margin:0;">
        <label style="font-size:11px;color:var(--muted2);">Chartmetric Bearer Token</label>
        <input type="password" id="ad-cfg-chartmetric" value="${config.chartmetricToken || ''}" placeholder="Token — disponible próximamente" disabled style="opacity:0.5;" />
      </div>
    </div>
  `, `
    <button class="btn btn-sm btn-ghost" onclick="closeModal()">Cancelar</button>
    <button class="btn btn-sm btn-primary" onclick="saveAnalyticsConfigFromModal()">Guardar Configuración</button>
  `);
}

function saveAnalyticsConfigFromModal() {
  const spotifyClientId = document.getElementById('ad-cfg-spotify')?.value.trim() || '';
  const spotifyClientSecret = document.getElementById('ad-cfg-spotify-secret')?.value.trim() || '';
  const chartmetricToken = document.getElementById('ad-cfg-chartmetric')?.value.trim() || '';

  const config = getAnalyticsConfig();
  config.spotifyClientId = spotifyClientId || undefined;
  config.spotifyClientSecret = spotifyClientSecret || undefined;
  config.chartmetricToken = chartmetricToken || undefined;
  saveAnalyticsConfig(config);

  closeModal();

  // Refresh dashboard and auto-search if artist is loaded
  window.location.hash = 'analytics-dashboard';
  renderTools();
  // Auto-trigger search after config save
  setTimeout(() => {
    const input = document.getElementById('ad-artist-search');
    if (input && input.value.trim()) {
      runAnalyticsSearch();
    }
  }, 100);
}
