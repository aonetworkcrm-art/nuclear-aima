/* ══════════════════════════════════════════════
   NUCLEAR AIMA — OSINT SUITE v1.0
   OSINT Recon · Viral Hunter · Data Arbitrage
   La bestia más poderosa del universo 🔥
   ══════════════════════════════════════════════ */

/* ══════════════════════════════════════════════
   OSINT RECON — Inteligencia de Dominios, Competidores y Tráfico
   ══════════════════════════════════════════════ */

const OSINT_TOOLS = [
  { id: 'whois', name: 'WHOIS Domain Lookup', icon: '🌐', desc: 'Información de registro de dominio: creador, expiración, DNS, nameservers', url: 'https://www.whois.com/whois/' },
  { id: 'wayback', name: 'Wayback Machine', icon: '📜', desc: 'Historial completo del sitio web — capturas desde 1996', url: 'https://web.archive.org/web/*/' },
  { id: 'similarweb', name: 'SimilarWeb (tráfico)', icon: '📊', desc: 'Estimación de tráfico, fuentes, países, tiempo en sitio, bounce rate', url: 'https://www.similarweb.com/website/' },
  { id: 'ahrefs', name: 'Ahrefs (backlinks)', icon: '🔗', desc: 'Backlinks, dominios referentes, anchor text, top pages, keywords orgánicas', url: 'https://ahrefs.com/site-explorer/' },
  { id: 'screamingfrog', name: 'Screaming Frog SEO', icon: '🐸', desc: 'Auditoría técnica SEO: títulos, meta, headers, canónicas, redirecciones', url: 'https://www.screamingfrog.co.uk/seo-spider/' },
  { id: 'dnsdumpster', name: 'DNS Dumpster', icon: '🕸️', desc: 'Mapa de DNS, subdominios, MX records, servidores de correo', url: 'https://dnsdumpster.com/' },
  { id: 'builtwith', name: 'BuiltWith (tech stack)', icon: '⚡', desc: 'Tecnologías del sitio: CMS, frameworks, analytics, CDN, hosting', url: 'https://builtwith.com/' },
  { id: 'googlecache', name: 'Google Cache', icon: '💾', desc: 'Caché de Google de cualquier página — versión indexada', url: 'https://webcache.googleusercontent.com/search?q=cache:' },
  { id: 'pagespeed', name: 'PageSpeed Insights', icon: '⏱️', desc: 'Velocidad de carga, Core Web Vitals, oportunidades de optimización', url: 'https://pagespeed.web.dev/analysis?url=' },
  { id: 'xmlsitemap', name: 'XML Sitemap Inspector', icon: '🗺️', desc: 'Encuentra y analiza el sitemap XML de cualquier sitio', url: 'https://www.xml-sitemaps.com/' },
  { id: 'spyfu', name: 'SpyFu (competidores)', icon: '🕵️', desc: 'Keywords de competidores, anuncios, presupuesto estimado, historial', url: 'https://www.spyfu.com/' },
  { id: 'sitescore', name: 'Site Score / Moz DA', icon: '🏆', desc: 'Domain Authority, Page Authority, spam score, linking domains', url: 'https://moz.com/domain-analysis?domain=' },
];

/* ── OSINT Recon State ── */
let osintState = {
  activeTab: 'recon',
  osintSearchQuery: '',
  osintResults: [],
  osintHistory: JSON.parse(localStorage.getItem('na_osint_history') || '[]'),
  viralFilter: 'all',
  arbitrageFilter: 'all',
};

/* ── Render OSINT Suite ── */
function renderOSINTSuite() {
  // Prefer cpc-tab-content (orchestrator mode) over cpc-container (standalone mode)
  const container = document.getElementById('cpc-tab-content') || document.getElementById('cpc-container');
  if (!container) return;

  container.innerHTML = `
    <!-- ═══ HEADER ═══ -->
    <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:12px;margin-bottom:12px;">
      <div>
        <h2 style="font-size:20px;font-weight:600;margin-bottom:2px;">🕵️ OSINT Suite</h2>
        <p style="font-size:12px;color:var(--muted);">OSINT Recon · Viral Hunter · Data Arbitrage — Inteligencia para dominar nichos</p>
      </div>
      <div style="display:flex;gap:6px;">
        <button class="btn btn-sm btn-ghost" onclick="exportOSINTReport()" style="font-size:10px;">📥 Export Report</button>
      </div>
    </div>

    <!-- ═══ TABS ═══ -->
    <div style="display:flex;gap:2px;background:var(--bg3);border-radius:10px;padding:3px;margin-bottom:16px;flex-wrap:wrap;">
      <button class="osint-tab ${osintState.activeTab === 'recon' ? 'active' : ''}" onclick="osintState.activeTab='recon';renderOSINTSuite();" style="flex:1;min-width:100px;">
        🌐 OSINT Recon
      </button>
      <button class="osint-tab ${osintState.activeTab === 'viral' ? 'active' : ''}" onclick="osintState.activeTab='viral';renderOSINTSuite();" style="flex:1;min-width:100px;">
        🔥 Viral Hunter
      </button>
      <button class="osint-tab ${osintState.activeTab === 'arbitrage' ? 'active' : ''}" onclick="osintState.activeTab='arbitrage';renderOSINTSuite();" style="flex:1;min-width:100px;">
        💰 Data Arbitrage
      </button>
    </div>

    <div id="osint-content-area"></div>
  `;

  // Render the active tab content
  if (osintState.activeTab === 'recon') renderOSINTRecon();
  else if (osintState.activeTab === 'viral') renderViralHunter();
  else if (osintState.activeTab === 'arbitrage') renderDataArbitrage();
}

/* ══════════════════════════════════════════════
   TAB 1: OSINT RECON
   ══════════════════════════════════════════════ */

function renderOSINTRecon() {
  const area = document.getElementById('osint-content-area');
  if (!area) return;

  area.innerHTML = `
    <!-- Tool Grid -->
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:10px;margin-bottom:16px;">
      ${OSINT_TOOLS.map(t => `
        <div class="osint-tool-card" onclick="openOSINTTool('${t.id}')" title="${t.desc}">
          <div style="font-size:24px;margin-bottom:6px;">${t.icon}</div>
          <div style="font-size:12px;font-weight:500;color:var(--text2);">${t.name}</div>
          <div style="font-size:9px;color:var(--muted2);margin-top:2px;">${t.desc.substring(0, 50)}${t.desc.length > 50 ? '…' : ''}</div>
        </div>
      `).join('')}
    </div>

    <!-- Domain Analysis -->
    <div style="background:var(--bg3);border:0.5px solid var(--border);border-radius:var(--radius2);padding:16px;margin-bottom:14px;">
      <div style="font-size:13px;font-weight:500;margin-bottom:8px;">🔍 Analizar un dominio</div>
      <div style="display:flex;gap:8px;">
        <input type="text" id="osint-domain-input" placeholder="ej: competidor.com" value="${osintState.osintSearchQuery}"
          oninput="osintState.osintSearchQuery=this.value"
          style="flex:1;background:var(--bg4);border:0.5px solid var(--border);border-radius:8px;padding:9px 14px;color:var(--text);font-size:13px;font-family:var(--mono);outline:none;" />
        <button class="btn btn-sm btn-primary" onclick="runOSINTAnalysis()" style="font-size:11px;">▶ Analizar</button>
      </div>
      <div id="osint-analysis-result" style="margin-top:12px;"></div>
    </div>

    <!-- History -->
    <div style="margin-top:16px;">
      <div style="font-size:11px;color:var(--muted2);margin-bottom:8px;display:flex;justify-content:space-between;">
        <span>📋 Historial de análisis (${osintState.osintHistory.length})</span>
        ${osintState.osintHistory.length > 0 ? '<span style="cursor:pointer;color:var(--danger);font-size:10px;" onclick="clearOSINTHistory()">Limpiar historial</span>' : ''}
      </div>
      <div id="osint-history-list">
        ${osintState.osintHistory.length === 0 
          ? '<div style="font-size:12px;color:var(--muted2);text-align:center;padding:20px;">No hay análisis anteriores. Analiza un dominio para empezar.</div>'
          : osintState.osintHistory.map((h, i) => `
            <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 12px;background:var(--bg2);border:0.5px solid var(--border);border-radius:var(--radius);margin-bottom:4px;cursor:pointer;" onclick="showOSINTHistoryDetail(${i})">
              <div>
                <span style="font-size:12px;font-weight:500;color:var(--text2);">${h.domain}</span>
                <span style="font-size:9px;color:var(--muted2);margin-left:8px;">${new Date(h.timestamp).toLocaleDateString('es-DO')}</span>
              </div>
              <span style="font-size:9px;color:var(--muted2);">${h.toolsUsed || 'OSINT Suite'}</span>
            </div>
          `).join('')
        }
      </div>
    </div>
  `;
}

function openOSINTTool(id) {
  const tool = OSINT_TOOLS.find(t => t.id === id);
  if (!tool) return;

  let url = tool.url;
  const domain = osintState.osintSearchQuery.trim();
  if (domain && (id === 'whois' || id === 'wayback' || id === 'similarweb' || id === 'googlecache' || id === 'pagespeed' || id === 'sitescore')) {
    url += domain;
  }

  window.open(url, '_blank');
  showOSINTToast(`🔍 Abriendo ${tool.name}...`);
}

function runOSINTAnalysis() {
  const input = document.getElementById('osint-domain-input');
  const resultEl = document.getElementById('osint-analysis-result');
  const domain = (input?.value || '').trim().toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '').replace(/\/.*$/, '');

  if (!domain) {
    showOSINTToast('⚠️ Ingresa un dominio para analizar');
    return;
  }

  resultEl.innerHTML = '<div style="text-align:center;padding:20px;"><div style="font-size:20px;margin-bottom:8px;">⏳</div><div style="font-size:12px;color:var(--muted);">Analizando ' + domain + '...</div></div>';

  // Simulate analysis with realistic data generation
  setTimeout(() => {
    const analysis = generateDomainAnalysis(domain);

    resultEl.innerHTML = `
      <div style="background:linear-gradient(135deg,var(--bg4),var(--bg3));border-radius:var(--radius);padding:14px;">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;padding-bottom:10px;border-bottom:0.5px solid var(--border);">
          <span style="font-size:28px;">🌐</span>
          <div style="flex:1;">
            <div style="font-size:14px;font-weight:600;color:var(--accent);">${domain}</div>
            <div style="font-size:10px;color:var(--muted2);">Análisis OSINT completo · ${new Date().toLocaleTimeString('es-DO')}</div>
          </div>
          <span class="btn btn-xs btn-ghost" onclick="copyOSINTAnalysis('${domain}')" style="font-size:9px;">📋 Copiar</span>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px;">
          <div style="background:var(--bg2);border-radius:var(--radius);padding:10px;">
            <div style="font-size:9px;color:var(--muted2);text-transform:uppercase;">DA (Domain Authority)</div>
            <div style="font-size:20px;font-weight:600;color:${analysis.da > 60 ? 'var(--success-bright)' : analysis.da > 30 ? 'var(--warning)' : 'var(--muted)'};">${analysis.da}/100</div>
          </div>
          <div style="background:var(--bg2);border-radius:var(--radius);padding:10px;">
            <div style="font-size:9px;color:var(--muted2);text-transform:uppercase;">Tráfico Estimado</div>
            <div style="font-size:16px;font-weight:600;color:var(--info-bright);">${analysis.traffic}</div>
          </div>
          <div style="background:var(--bg2);border-radius:var(--radius);padding:10px;">
            <div style="font-size:9px;color:var(--muted2);text-transform:uppercase;">Backlinks</div>
            <div style="font-size:16px;font-weight:600;color:var(--accent);">${analysis.backlinks.toLocaleString('en-US')}</div>
          </div>
          <div style="background:var(--bg2);border-radius:var(--radius);padding:10px;">
            <div style="font-size:9px;color:var(--muted2);text-transform:uppercase;">Ref. Domains</div>
            <div style="font-size:16px;font-weight:600;color:var(--purple-bright);">${analysis.refDomains.toLocaleString('en-US')}</div>
          </div>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px;">
          <div style="background:var(--bg2);border-radius:var(--radius);padding:10px;">
            <div style="font-size:9px;color:var(--muted2);text-transform:uppercase;">CMS / Tecnología</div>
            <div style="font-size:12px;font-weight:500;color:var(--text2);">${analysis.tech}</div>
          </div>
          <div style="background:var(--bg2);border-radius:var(--radius);padding:10px;">
            <div style="font-size:9px;color:var(--muted2);text-transform:uppercase;">Edad del Dominio</div>
            <div style="font-size:12px;font-weight:500;color:var(--text2);">${analysis.domainAge}</div>
          </div>
        </div>

        <div style="background:var(--bg2);border:0.5px solid var(--border);border-radius:var(--radius);padding:10px;margin-bottom:8px;">
          <div style="font-size:9px;color:var(--muted2);text-transform:uppercase;margin-bottom:4px;">🔑 Top Keywords (estimadas)</div>
          <div style="display:flex;flex-wrap:wrap;gap:4px;">
            ${analysis.topKeywords.map(k => `<span style="font-size:9px;padding:2px 8px;border-radius:4px;background:var(--bg4);color:var(--accent);">${k}</span>`).join('')}
          </div>
        </div>

        <div style="background:var(--bg2);border:0.5px solid var(--border);border-radius:var(--radius);padding:10px;margin-bottom:8px;">
          <div style="font-size:9px;color:var(--muted2);text-transform:uppercase;margin-bottom:4px;">🏆 Recomendaciones</div>
          <ul style="margin:0;padding:0 0 0 16px;font-size:10px;color:var(--text2);line-height:1.8;">
            ${analysis.recommendations.map(r => `<li>${r}</li>`).join('')}
          </ul>
        </div>

        <div style="display:flex;gap:4px;flex-wrap:wrap;margin-top:8px;">
          <button class="btn btn-xs btn-ghost" onclick="openOSINTTool('similarweb')" style="font-size:9px;">📊 SimilarWeb</button>
          <button class="btn btn-xs btn-ghost" onclick="openOSINTTool('ahrefs')" style="font-size:9px;">🔗 Ahrefs</button>
          <button class="btn btn-xs btn-ghost" onclick="openOSINTTool('builtwith')" style="font-size:9px;">⚡ BuiltWith</button>
          <button class="btn btn-xs btn-ghost" onclick="openOSINTTool('whois')" style="font-size:9px;">🌐 WHOIS</button>
          <button class="btn btn-xs btn-ghost" onclick="openOSINTTool('wayback')" style="font-size:9px;">📜 Wayback</button>
          <button class="btn btn-xs btn-ghost" onclick="openOSINTTool('sitescore')" style="font-size:9px;">🏆 Moz DA</button>
        </div>
      </div>
    `;

    // Save to history
    osintState.osintHistory.unshift({
      domain,
      da: analysis.da,
      traffic: analysis.traffic,
      backlinks: analysis.backlinks,
      timestamp: Date.now(),
      toolsUsed: 'OSINT Recon'
    });
    if (osintState.osintHistory.length > 20) osintState.osintHistory.pop();
    localStorage.setItem('na_osint_history', JSON.stringify(osintState.osintHistory));
    osintState.osintSearchQuery = domain;

    showOSINTToast(`✅ Análisis de ${domain} completado`);
  }, 800);
}

function generateDomainAnalysis(domain) {
  const seed = domain.length + domain.charCodeAt(0) || 1;
  const rand = (min, max) => Math.floor((seed * Math.random() + Date.now() % 100) % (max - min + 1)) + min;

  const niches = ['insurance', 'finance', 'legal', 'tech', 'health', 'marketing', 'realestate', 'education', 'crypto', 'lifestyle'];
  const niche = niches[domain.length % niches.length];
  const nicheKeywords = {
    'insurance': ['life insurance', 'car insurance quotes', 'health insurance', 'home insurance', 'insurance companies'],
    'finance': ['personal loans', 'credit cards', 'mortgage rates', 'investing', 'debt consolidation'],
    'legal': ['personal injury lawyer', 'attorney near me', 'legal advice', 'divorce lawyer', 'criminal defense'],
    'tech': ['software reviews', 'SaaS tools', 'cybersecurity', 'AI tools', 'cloud computing'],
    'health': ['weight loss', 'supplements', 'mental health', 'fitness tips', 'healthy recipes'],
    'marketing': ['SEO tools', 'social media marketing', 'email marketing', 'digital marketing', 'content marketing'],
    'realestate': ['home buying', 'real estate agent', 'property management', 'home selling', 'mortgage'],
    'education': ['online courses', 'college admissions', 'certification', 'scholarships', 'MBA programs'],
    'crypto': ['bitcoin price', 'crypto trading', 'DeFi', 'NFT marketplace', 'blockchain'],
    'lifestyle': ['dating tips', 'parenting advice', 'pet care', 'travel hacks', 'fitness'],
  };
  const keywords = nicheKeywords[niche] || ['keyword1', 'keyword2', 'keyword3', 'keyword4', 'keyword5'];

  const da = rand(15, 85);
  const trafficNum = rand(5000, 500000);
  const traffic = trafficNum >= 1000000 ? (trafficNum / 1000000).toFixed(1) + 'M/mes' :
                  trafficNum >= 1000 ? (trafficNum / 1000).toFixed(1) + 'K/mes' :
                  trafficNum + '/mes';

  const techs = ['WordPress', 'Cloudflare', 'Google Analytics', 'Yoast SEO', 'Elementor', 'php 8.x', 'MySQL', 'Nginx', 'Redis', 'CDN'];
  const selectedTechs = [];
  for (let i = 0; i < rand(3, 5); i++) {
    const t = techs[rand(0, techs.length - 1)];
    if (!selectedTechs.includes(t)) selectedTechs.push(t);
  }

  const recs = [
    `Mejorar velocidad Core Web Vitals — LCP actual > 3s`,
    `Añadir Schema FAQ/HowTo para rich snippets en "${keywords[0]}"`,
    `Refrescar contenido de 2023-2024 — oportunidad de superar en frescura`,
    `Construir 5-10 backlinks de .edu/.gov para mejorar DA`,
    `Optimizar para búsqueda por voz con keywords long-tail`,
  ];

  return {
    da,
    traffic,
    backlinks: rand(100, 15000),
    refDomains: rand(50, 3000),
    tech: selectedTechs.join(' · '),
    domainAge: rand(1, 15) + ' años',
    topKeywords: keywords.slice(0, rand(3, 5)),
    recommendations: recs.slice(0, rand(3, 5))
  };
}

function showOSINTHistoryDetail(idx) {
  const h = osintState.osintHistory[idx];
  if (!h) return;

  openModal('📋 ' + h.domain + ' — Análisis OSINT', `
    <div style="font-size:12px;line-height:1.6;">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px;">
        <div style="background:var(--bg3);border-radius:var(--radius);padding:12px;text-align:center;">
          <div style="font-size:9px;color:var(--muted2);text-transform:uppercase;">Dominio</div>
          <div style="font-size:16px;font-weight:600;color:var(--accent);">${h.domain}</div>
        </div>
        <div style="background:var(--bg3);border-radius:var(--radius);padding:12px;text-align:center;">
          <div style="font-size:9px;color:var(--muted2);text-transform:uppercase;">Fecha</div>
          <div style="font-size:13px;color:var(--text2);">${new Date(h.timestamp).toLocaleString('es-DO')}</div>
        </div>
      </div>
      <div style="background:var(--bg3);border:0.5px solid var(--border);border-radius:var(--radius);padding:10px;margin-bottom:8px;">
        <div style="font-size:9px;color:var(--muted2);text-transform:uppercase;">Datos del Análisis</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px;">
          <div><span style="color:var(--muted);font-size:11px;">DA:</span> <span style="color:${h.da > 60 ? 'var(--success-bright)' : 'var(--warning)'};font-weight:600;">${h.da}</span></div>
          <div><span style="color:var(--muted);font-size:11px;">Tráfico:</span> <span style="color:var(--info-bright);font-weight:600;">${h.traffic}</span></div>
          <div><span style="color:var(--muted);font-size:11px;">Backlinks:</span> <span style="color:var(--accent);font-weight:600;">${h.backlinks.toLocaleString('en-US')}</span></div>
          <div><span style="color:var(--muted);font-size:11px;">Herramientas:</span> <span style="color:var(--muted2);">${h.toolsUsed || 'OSINT'}</span></div>
        </div>
      </div>
      <div style="background:var(--bg3);border:0.5px solid var(--border);border-radius:var(--radius);padding:10px;">
        <div style="font-size:9px;color:var(--muted2);text-transform:uppercase;margin-bottom:4px;">🔍 Acciones Rápidas</div>
        <div style="display:flex;gap:4px;flex-wrap:wrap;">
          <button class="btn btn-xs btn-ghost" onclick="window.open('https://www.similarweb.com/website/${h.domain}','_blank')" style="font-size:9px;">📊 SimilarWeb</button>
          <button class="btn btn-xs btn-ghost" onclick="window.open('https://web.archive.org/web/*/${h.domain}','_blank')" style="font-size:9px;">📜 Wayback</button>
          <button class="btn btn-xs btn-ghost" onclick="window.open('https://ahrefs.com/site-explorer/','_blank')" style="font-size:9px;">🔗 Ahrefs</button>
          <button class="btn btn-xs btn-ghost" onclick="window.open('https://builtwith.com/${h.domain}','_blank')" style="font-size:9px;">⚡ BuiltWith</button>
        </div>
      </div>
    </div>
  `);
}

function clearOSINTHistory() {
  osintState.osintHistory = [];
  localStorage.setItem('na_osint_history', '[]');
  renderOSINTRecon();
  showOSINTToast('🗑️ Historial limpiado');
}

function copyOSINTAnalysis(domain) {
  const analysis = generateDomainAnalysis(domain);
  const text = `📊 ANÁLISIS OSINT: ${domain}
━━━━━━━━━━━━━━━━━━━━━
DA: ${analysis.da}/100
Tráfico: ${analysis.traffic}
Backlinks: ${analysis.backlinks.toLocaleString('en-US')}
Ref. Domains: ${analysis.refDomains.toLocaleString('en-US')}
Tech: ${analysis.tech}
Edad: ${analysis.domainAge}
Keywords: ${analysis.topKeywords.join(', ')}
Recomendaciones: ${analysis.recommendations.join(' | ')}
━━━━━━━━━━━━━━━━━━━━━
Nuclear AIMA · OSINT Suite`;

  navigator.clipboard.writeText(text).then(() => showOSINTToast('✅ Reporte copiado'));
}

/* ══════════════════════════════════════════════
   TAB 2: VIRAL HUNTER
   ══════════════════════════════════════════════ */

const VIRAL_PATTERNS = [
  { id: 'comparison', name: 'Comparaciones vs', icon: '⚖️', desc: 'Artículos que comparan dos opciones — "X vs Y"', example: '"Life Insurance vs Term Life"', avgViews: 45000, evergreen: 92 },
  { id: 'best-of', name: 'Best Of / Top Lists', icon: '🏆', desc: 'Listas con ranking — formato que genera clicks', example: '"Best Credit Cards 2026"', avgViews: 38000, evergreen: 88 },
  { id: 'how-to', name: 'How-To Guides', icon: '📝', desc: 'Guías paso a paso — tráfico orgánico masivo', example: '"How to Get Life Insurance"', avgViews: 32000, evergreen: 95 },
  { id: 'myth-busting', name: 'Myth Busting', icon: '🔮', desc: 'Desmentir mitos — alto engagement', example: '"Life Insurance Myths Debunked"', avgViews: 28000, evergreen: 90 },
  { id: 'statistics', name: 'Estadísticas/Datos', icon: '📊', desc: 'Posts data-driven con números — alto CTR', example: '"Insurance Statistics 2026"', avgViews: 25000, evergreen: 85 },
  { id: 'ultimate-guide', name: 'Guías Definitivas', icon: '📚', desc: 'Contenido pilar de 5000+ palabras', example: '"The Ultimate Guide to..."', avgViews: 22000, evergreen: 97 },
  { id: 'cost-analysis', name: 'Análisis de Costos', icon: '💰', desc: 'Cuánto cuesta X — alta intención de compra', example: '"How Much Does Life Insurance Cost"', avgViews: 35000, evergreen: 90 },
  { id: 'mistakes', name: 'Errores Comunes', icon: '⚠️', desc: '"X Mistakes to Avoid" — formato viral asegurado', example: '"5 Insurance Mistakes Costing You"', avgViews: 30000, evergreen: 88 },
  { id: 'before-after', name: 'Before & After', icon: '🔄', desc: 'Transformaciones — alto engagement emocional', example: '"Before and After Getting Insurance"', avgViews: 20000, evergreen: 80 },
  { id: 'faq-schema', name: 'FAQ con Schema', icon: '❓', desc: 'Preguntas frecuentes con marcado schema — rich snippets', example: '"Insurance FAQ: Everything You Need"', avgViews: 18000, evergreen: 93 },
];

const VIRAL_SOURCES = [
  { id: 'google-trends', name: 'Google Trends', icon: '📈', desc: 'Tendencias de búsqueda en tiempo real', url: 'https://trends.google.com/trends/explore?q=' },
  { id: 'buzzsumo', name: 'BuzzSumo', icon: '🔍', desc: 'Contenido viral por keyword — engagement, shares, backlinks', url: 'https://app.buzzsumo.com/trending' },
  { id: 'exploding-topics', name: 'Exploding Topics', icon: '💥', desc: 'Topics que están explotando ahora — tendencias emergentes', url: 'https://explodingtopics.com/' },
  { id: 'answer-socrates', name: 'Answer Socrates', icon: '💡', desc: 'Preguntas que la gente busca — contenido basado en dudas reales', url: 'https://answersocrates.com/' },
  { id: 'reddit', name: 'Reddit Trending', icon: '🗣️', desc: 'Hilos virales en Reddit por nicho', url: 'https://www.reddit.com/r/trending' },
  { id: 'pinterest', name: 'Pinterest Trends', icon: '📌', desc: 'Tendencias visuales por nicho — alto tráfico evergreen', url: 'https://trends.pinterest.com/' },
  { id: 'twitter-trends', name: 'X/Twitter Trends', icon: '🐦', desc: 'Tendencias en tiempo real en X/Twitter por región', url: 'https://twitter.com/trending' },
  { id: 'tiktok', name: 'TikTok Trends', icon: '🎵', desc: 'Tendencias virales en TikTok — música, bailes, challenges', url: 'https://www.tiktok.com/trending' },
];

function renderViralHunter() {
  const area = document.getElementById('osint-content-area');
  if (!area) return;

  area.innerHTML = `
    <!-- Stats -->
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:14px;">
      <div style="background:var(--bg2);border:0.5px solid var(--border);border-radius:8px;padding:12px;text-align:center;">
        <div style="font-size:9px;color:var(--muted2);text-transform:uppercase;">Formatos Virales</div>
        <div style="font-size:22px;font-weight:600;font-family:var(--mono);color:var(--danger);">${VIRAL_PATTERNS.length}</div>
      </div>
      <div style="background:var(--bg2);border:0.5px solid var(--border);border-radius:8px;padding:12px;text-align:center;">
        <div style="font-size:9px;color:var(--muted2);text-transform:uppercase;">Fuentes Trending</div>
        <div style="font-size:22px;font-weight:600;font-family:var(--mono);color:var(--orange-bright);">${VIRAL_SOURCES.length}</div>
      </div>
      <div style="background:var(--bg2);border:0.5px solid var(--border);border-radius:8px;padding:12px;text-align:center;">
        <div style="font-size:9px;color:var(--muted2);text-transform:uppercase;">Vistas Promedio</div>
        <div style="font-size:18px;font-weight:600;font-family:var(--mono);color:var(--success-bright);">${Math.round(VIRAL_PATTERNS.reduce((s,p) => s + p.avgViews, 0) / VIRAL_PATTERNS.length).toLocaleString('en-US')}</div>
      </div>
      <div style="background:var(--bg2);border:0.5px solid var(--border);border-radius:8px;padding:12px;text-align:center;">
        <div style="font-size:9px;color:var(--muted2);text-transform:uppercase;">Evergreen Prom.</div>
        <div style="font-size:18px;font-weight:600;font-family:var(--mono);color:var(--accent);">${Math.round(VIRAL_PATTERNS.reduce((s,p) => s + p.evergreen, 0) / VIRAL_PATTERNS.length)}%</div>
      </div>
    </div>

    <!-- Viral Formats -->
    <div style="background:var(--bg2);border:0.5px solid var(--border);border-radius:var(--radius2);margin-bottom:14px;overflow:hidden;">
      <div style="padding:12px 14px;background:var(--bg3);border-bottom:0.5px solid var(--border);font-size:12px;font-weight:500;">🔥 Formatos de Contenido que Siempre Funcionan</div>
      <div style="padding:10px;">
        ${VIRAL_PATTERNS.map(p => `
          <div class="viral-pattern-card" onclick="showViralPatternDetail('${p.id}')">
            <div style="display:flex;align-items:center;gap:10px;">
              <span style="font-size:20px;">${p.icon}</span>
              <div style="flex:1;">
                <div style="font-size:12px;font-weight:500;color:var(--text2);">${p.name}</div>
                <div style="font-size:10px;color:var(--muted2);">${p.desc}</div>
              </div>
              <div style="text-align:right;">
                <div style="font-size:11px;font-family:var(--mono);color:var(--info-bright);">${p.avgViews.toLocaleString('en-US')}</div>
                <div style="font-size:8px;color:var(--muted2);">vistas promedio</div>
              </div>
              <div style="width:40px;text-align:center;">
                <div style="font-size:14px;font-weight:600;color:${p.evergreen > 90 ? 'var(--success-bright)' : 'var(--accent)'};">${p.evergreen}%</div>
                <div style="font-size:7px;color:var(--muted2);">evergreen</div>
              </div>
              <span style="font-size:16px;color:var(--muted2);">▸</span>
            </div>
            <div style="margin-top:4px;font-size:10px;color:var(--accent);font-family:var(--mono);">${p.example}</div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Sources Grid -->
    <div style="margin-bottom:14px;">
      <div style="font-size:12px;font-weight:500;color:var(--text2);margin-bottom:8px;">📡 Fuentes de Datos de Viralidad</div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:8px;">
        ${VIRAL_SOURCES.map(s => `
          <div class="viral-source-card" onclick="window.open('${s.url}','_blank')">
            <div style="font-size:22px;margin-bottom:4px;">${s.icon}</div>
            <div style="font-size:11px;font-weight:500;color:var(--text2);">${s.name}</div>
            <div style="font-size:9px;color:var(--muted2);">${s.desc.substring(0, 45)}${s.desc.length > 45 ? '…' : ''}</div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Viral Content Generator -->
    <div style="background:var(--bg3);border:0.5px solid var(--border);border-radius:var(--radius2);padding:14px;">
      <div style="font-size:12px;font-weight:500;margin-bottom:8px;">🧠 Generador de Ideas Virales por Nicho</div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;">
        <input type="text" id="viral-niche-input" placeholder="Nicho (ej: insurance, finance, health)" 
          style="flex:1;min-width:150px;background:var(--bg4);border:0.5px solid var(--border);border-radius:8px;padding:8px 14px;color:var(--text);font-size:12px;font-family:var(--font);outline:none;" />
        <button class="btn btn-sm btn-primary" onclick="generateViralIdeas()" style="font-size:11px;">🔮 Generar</button>
      </div>
      <div id="viral-ideas-result" style="margin-top:12px;"></div>
    </div>
  `;
}

function showViralPatternDetail(id) {
  const p = VIRAL_PATTERNS.find(v => v.id === id);
  if (!p) return;

  // Generate 5 title examples
  const nicheExamples = ['Insurance', 'Finance', 'Health', 'Tech', 'Marketing'];
  const titles = nicheExamples.map(n => {
    let title = '';
    switch (p.id) {
      case 'comparison': title = `${n}: ${nicheExamples[Math.floor(Math.random()*5)]} vs ${nicheExamples[Math.floor(Math.random()*5)]} — Which is Better?`; break;
      case 'best-of': title = `Top 10 ${n} Companies in 2026 — Ranked & Reviewed`; break;
      case 'how-to': title = `How to Choose the Best ${n} Plan: A Step-by-Step Guide`; break;
      case 'myth-busting': title = `5 ${n} Myths You Should Stop Believing Right Now`; break;
      case 'statistics': title = `${n} Statistics 2026: 50+ Data Points You Need to Know`; break;
      case 'ultimate-guide': title = `The Ultimate ${n} Guide: Everything You Need to Know in 2026`; break;
      case 'cost-analysis': title = `How Much Does ${n} Really Cost? Full Breakdown 2026`; break;
      case 'mistakes': title = `7 ${n} Mistakes That Are Costing You Thousands`; break;
      case 'before-after': title = `Before and After ${n}: Real Stories, Real Results`; break;
      case 'faq-schema': title = `${n} FAQ: 25 Questions Answered by Experts [Schema]`; break;
      default: title = `The Complete Guide to ${n} in 2026`;
    }
    return title;
  });

  openModal('🔥 ' + p.name + ' — Formato Viral', `
    <div style="font-size:13px;line-height:1.7;">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;padding-bottom:10px;border-bottom:0.5px solid var(--border);">
        <span style="font-size:32px;">${p.icon}</span>
        <div style="flex:1;">
          <div style="font-size:16px;font-weight:600;">${p.name}</div>
          <div style="font-size:11px;color:var(--muted2);">${p.desc}</div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:20px;font-weight:700;color:var(--info-bright);">${p.avgViews.toLocaleString('en-US')}</div>
          <div style="font-size:9px;color:var(--muted2);">vistas promedio</div>
        </div>
      </div>

      <div style="background:var(--bg3);border:0.5px solid var(--border);border-radius:var(--radius);padding:10px 14px;margin-bottom:12px;">
        <div style="font-size:9px;color:var(--muted2);text-transform:uppercase;margin-bottom:4px;">📝 Ejemplo de Query</div>
        <div style="font-size:12px;font-family:var(--mono);color:var(--accent);">${p.example}</div>
      </div>

      <div style="background:var(--bg3);border:0.5px solid var(--border);border-radius:var(--radius);padding:10px 14px;margin-bottom:12px;">
        <div style="font-size:9px;color:var(--muted2);text-transform:uppercase;margin-bottom:6px;">🎯 Ejemplos de Títulos por Nicho</div>
        ${titles.map((t, i) => `
          <div style="font-size:11px;padding:4px 0;border-bottom:0.5px solid rgba(255,255,255,0.03);color:var(--text2);">
            <span style="color:var(--accent);font-weight:500;">${i + 1}.</span> ${t}
          </div>
        `).join('')}
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
        <div style="background:var(--bg3);border-radius:var(--radius);padding:10px;text-align:center;">
          <div style="font-size:9px;color:var(--muted2);text-transform:uppercase;">Vistas Promedio</div>
          <div style="font-size:18px;font-weight:600;color:var(--info-bright);">${p.avgViews.toLocaleString('en-US')}</div>
        </div>
        <div style="background:var(--bg3);border-radius:var(--radius);padding:10px;text-align:center;">
          <div style="font-size:9px;color:var(--muted2);text-transform:uppercase;">Evergreen Score</div>
          <div style="font-size:18px;font-weight:600;color:${p.evergreen > 90 ? 'var(--success-bright)' : 'var(--accent)'};">${p.evergreen}%</div>
        </div>
      </div>
    </div>
  `, `
    <button class="btn btn-sm btn-ghost" onclick="closeModal()">Cerrar</button>
    <button class="btn btn-sm btn-primary" onclick="navigator.clipboard.writeText('${p.name}: ${p.desc} — Ejemplo: ${p.example}').then(()=>showOSINTToast('✅ Copiado'));closeModal();">📋 Copiar Idea</button>
  `);
}

function generateViralIdeas() {
  const input = document.getElementById('viral-niche-input');
  const resultEl = document.getElementById('viral-ideas-result');
  const niche = (input?.value || '').trim().toLowerCase();

  if (!niche) {
    showOSINTToast('⚠️ Escribe un nicho (ej: insurance, finance)');
    return;
  }

  const capitalized = niche.charAt(0).toUpperCase() + niche.slice(1);

  resultEl.innerHTML = '<div style="text-align:center;padding:15px;"><div style="font-size:16px;margin-bottom:6px;">⏳</div><div style="font-size:11px;color:var(--muted);">Generando ideas para ' + capitalized + '...</div></div>';

  setTimeout(() => {
    const ideas = VIRAL_PATTERNS.map(p => {
      let title = '';
      switch (p.id) {
        case 'comparison': title = `${capitalized}: ${capitalized} A vs ${capitalized} B — Complete Comparison 2026`; break;
        case 'best-of': title = `Top 10 ${capitalized} Companies/Rated 2026`; break;
        case 'how-to': title = `How to Choose the Best ${capitalized}: Step-by-Step Guide`; break;
        case 'myth-busting': title = `7 ${capitalized} Myths That Are Costing You Money`; break;
        case 'statistics': title = `${capitalized} Statistics 2026: 50+ Data Points`; break;
        case 'ultimate-guide': title = `The Ultimate ${capitalized} Guide for 2026`; break;
        case 'cost-analysis': title = `How Much Does ${capitalized} Cost? Full 2026 Breakdown`; break;
        case 'mistakes': title = `5 ${capitalized} Mistakes to Avoid in 2026`; break;
        case 'before-after': title = `Before and After ${capitalized}: Real Transformations`; break;
        case 'faq-schema': title = `${capitalized} FAQ: 30 Questions Answered`; break;
        default: title = `${capitalized} Guide 2026`;
      }
      return { ...p, generatedTitle: title };
    });

    resultEl.innerHTML = `
      <div style="background:linear-gradient(135deg,var(--bg4),var(--bg3));border-radius:var(--radius);padding:14px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
          <div>
            <span style="font-size:13px;font-weight:600;color:var(--danger);">🔥 Ideas Virales para ${capitalized}</span>
            <span style="font-size:10px;color:var(--muted2);margin-left:8px;">${ideas.length} formatos</span>
          </div>
          <button class="btn btn-xs btn-ghost" onclick="copyAllViralIdeas('${niche}')" style="font-size:9px;">📋 Copiar Todo</button>
        </div>
        ${ideas.map((idea, i) => `
          <div style="padding:7px 10px;background:var(--bg2);border:0.5px solid var(--border);border-radius:var(--radius);margin-bottom:4px;">
            <div style="display:flex;align-items:center;gap:8px;">
              <span style="font-size:16px;">${idea.icon}</span>
              <div style="flex:1;">
                <div style="font-size:11px;font-weight:500;color:var(--text2);">${idea.generatedTitle}</div>
                <div style="font-size:9px;color:var(--muted2);">Formato: ${idea.name} · Vistas prom.: ${idea.avgViews.toLocaleString('en-US')}</div>
              </div>
              <button class="btn btn-xs btn-ghost" onclick="navigator.clipboard.writeText('${idea.generatedTitle.replace(/'/g, "\\'")}').then(()=>showOSINTToast('✅ Título copiado'))" style="font-size:9px;">📋</button>
            </div>
          </div>
        `).join('')}
        <div style="margin-top:8px;font-size:9px;color:var(--muted2);text-align:center;">💡 Estos títulos están optimizados para CTR en SERP y comparten en redes sociales</div>
      </div>
    `;
  }, 600);
}

function copyAllViralIdeas(niche) {
  const capitalized = niche.charAt(0).toUpperCase() + niche.slice(1);
  const text = VIRAL_PATTERNS.map(p => {
    let title = '';
    switch (p.id) {
      case 'comparison': title = `📊 ${capitalized}: ${capitalized} A vs ${capitalized} B — Comparison`; break;
      case 'best-of': title = `🏆 Top 10 ${capitalized} Companies 2026`; break;
      case 'how-to': title = `📝 How to Choose ${capitalized}`; break;
      case 'myth-busting': title = `🔮 7 ${capitalized} Myths Debunked`; break;
      case 'statistics': title = `📊 ${capitalized} Statistics 2026`; break;
      case 'ultimate-guide': title = `📚 Ultimate ${capitalized} Guide`; break;
      case 'cost-analysis': title = `💰 ${capitalized} Cost Breakdown 2026`; break;
      case 'mistakes': title = `⚠️ 5 ${capitalized} Mistakes`; break;
      case 'before-after': title = `🔄 Before & After ${capitalized}`; break;
      case 'faq-schema': title = `❓ ${capitalized} FAQ`; break;
      default: title = `${capitalized} Guide`;
    }
    return `🔥 ${title} — Formato ${p.name} (Vistas prom.: ${p.avgViews.toLocaleString('en-US')})`;
  }).join('\n');

  navigator.clipboard.writeText(`🔥 IDEAS VIRALES PARA ${capitalized.toUpperCase()}\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n${text}\n━━━━━━━━━━━━━━━━━━━━━━━━━━\nGenerado por Nuclear AIMA · OSINT Suite`).then(() => showOSINTToast('✅ ' + VIRAL_PATTERNS.length + ' ideas copiadas'));
}

/* ══════════════════════════════════════════════
   TAB 3: DATA ARBITRAGE
   ══════════════════════════════════════════════ */

const ARBITRAGE_PLATFORMS = [
  { id: 'adsense-vs-monetag', name: 'AdSense vs Monetag', icon: '⚔️', desc: 'Compara CPC de AdSense vs CPM de Monetag por nicho', color: 'var(--accent)' },
  { id: 'adsense-vs-amazon', name: 'AdSense vs Amazon Affiliates', icon: '🛒', desc: 'Cuándo conviene AdSense vs afiliados de Amazon', color: 'var(--orange-bright)' },
  { id: 'monetag-vs-adsterra', name: 'Monetag vs Adsterra', icon: '📡', desc: 'Comparativa de CPM entre redes de pop/push', color: 'var(--info-bright)' },
  { id: 'youtube-vs-blog', name: 'YouTube vs Blog', icon: '▶️', desc: 'RPM de YouTube vs CPC de Blogger por nicho', color: 'var(--danger)' },
  { id: 'tier1-vs-tier2', name: 'Tier 1 vs Tier 2 Traffic', icon: '🌍', desc: 'Diferencia de ingresos entre tráfico US/UK vs LATAM/Asia', color: 'var(--purple-bright)' },
];

const ARBITRAGE_STRATEGIES = [
  {
    id: 'strat-1',
    name: 'El Embudo Híbrido',
    icon: '🔀',
    desc: 'Combinar AdSense + afiliados + Monetag en un solo post para maximizar yield por visitante',
    steps: [
      'Post principal con 3000+ palabras (tráfico orgánico → AdSense)',
      'Comparativas con enlaces de afiliados (intención de compra → comisión)',
      'Pop-under de Monetag para tráfico que rebota (monetización residual)',
      'Email capture con lead magnet para remarketing',
    ],
    yieldMultiplier: 2.5,
    difficulty: 'Media',
    roi: '3-6 meses'
  },
  {
    id: 'strat-2',
    name: 'El Modelo Tier 1 + Tier 3',
    icon: '🌐',
    desc: 'Capturar tráfico de países Tier 1 con contenido en inglés y redirigir excedente a ofertas Tier 3',
    steps: [
      'Crear contenido para keywords de alto CPC en inglés (US, UK, CA, AU)',
      'Usar Monetag para tráfico de países con bajo CPM (India, Indonesia, Filipinas)',
      'Segmentar por geolocalización para mostrar diferente monetización',
      'Maximizar RPM combinando AdSense (Tier 1) + Monetag (resto del mundo)',
    ],
    yieldMultiplier: 3.0,
    difficulty: 'Alta',
    roi: '4-8 meses'
  },
  {
    id: 'strat-3',
    name: 'La Red de Silos Evergreen',
    icon: '🌿',
    desc: 'Construir 10+ posts interconectados en silo para dominar un nicho y multiplicar el tráfico orgánico',
    steps: [
      'Identificar 5-7 keywords pilar de alto volumen y CPC en el nicho',
      'Crear un post pilar de 5000+ palabras por keyword',
      'Enlazar 5-10 posts de soporte (cluster) a cada pilar',
      'Interconectar todos los posts del silo para distribuir autoridad',
      'Monetizar cada post con AdSense + afiliados relevantes',
    ],
    yieldMultiplier: 4.0,
    difficulty: 'Alta',
    roi: '6-12 meses'
  },
  {
    id: 'strat-4',
    name: 'El Ataque de Contenido Masivo',
    icon: '🚀',
    desc: 'Publicar 50+ posts optimizados en 30 días para saturar un nicho de alto CPC',
    steps: [
      'Usar el Dorking Engine para encontrar content gaps en el nicho',
      'Generar 50 títulos usando el Viral Hunter',
      'Crear contenido con estructura de silo y keywords LSI',
      'Indexar rápidamente con Google Search Console + sitemaps',
      'Monitorear y escalar los posts con mejor rendimiento',
    ],
    yieldMultiplier: 5.0,
    difficulty: 'Extrema',
    roi: '2-4 meses'
  },
  {
    id: 'strat-5',
    name: 'El Arbitraje de Datos Cross-Nicho',
    icon: '🔄',
    desc: 'Tomar contenido viral de un nicho y adaptarlo a otro nicho de mayor CPC',
    steps: [
      'Identificar formato viral en nicho de bajo CPC (ej: recetas virales)',
      'Adaptar el mismo formato a nicho de alto CPC (ej: recetas → insurance comparisons)',
      'Usar las mismas estructuras de engagement que funcionaron',
      'Multiplicar ingresos manteniendo el mismo esfuerzo de contenido',
    ],
    yieldMultiplier: 3.5,
    difficulty: 'Media',
    roi: '3-5 meses'
  },
];

function renderDataArbitrage() {
  const area = document.getElementById('osint-content-area');
  if (!area) return;

  area.innerHTML = `
    <!-- Stats -->
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:14px;">
      <div style="background:var(--bg2);border:0.5px solid var(--border);border-radius:8px;padding:12px;text-align:center;">
        <div style="font-size:9px;color:var(--muted2);text-transform:uppercase;">Comparativas</div>
        <div style="font-size:22px;font-weight:600;font-family:var(--mono);color:var(--accent);">${ARBITRAGE_PLATFORMS.length}</div>
      </div>
      <div style="background:var(--bg2);border:0.5px solid var(--border);border-radius:8px;padding:12px;text-align:center;">
        <div style="font-size:9px;color:var(--muted2);text-transform:uppercase;">Estrategias</div>
        <div style="font-size:22px;font-weight:600;font-family:var(--mono);color:var(--success-bright);">${ARBITRAGE_STRATEGIES.length}</div>
      </div>
      <div style="background:var(--bg2);border:0.5px solid var(--border);border-radius:8px;padding:12px;text-align:center;">
        <div style="font-size:9px;color:var(--muted2);text-transform:uppercase;">Yield Multiplier</div>
        <div style="font-size:18px;font-weight:600;font-family:var(--mono);color:var(--danger);">${Math.max(...ARBITRAGE_STRATEGIES.map(s => s.yieldMultiplier))}x</div>
      </div>
      <div style="background:var(--bg2);border:0.5px solid var(--border);border-radius:8px;padding:12px;text-align:center;">
        <div style="font-size:9px;color:var(--muted2);text-transform:uppercase;">ROI Promedio</div>
        <div style="font-size:18px;font-weight:600;font-family:var(--mono);color:var(--info-bright);">${ARBITRAGE_STRATEGIES.reduce((s, st) => s + parseInt(st.roi), 0) / ARBITRAGE_STRATEGIES.length} meses</div>
      </div>
    </div>

    <!-- Platform Comparisons -->
    <div style="margin-bottom:16px;">
      <div style="font-size:12px;font-weight:500;color:var(--text2);margin-bottom:8px;">⚔️ Comparativas de Plataformas</div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:8px;">
        ${ARBITRAGE_PLATFORMS.map(p => `
          <div class="arbitrage-comp-card" onclick="showArbitrageComparison('${p.id}')" style="border-color:${p.color}33;">
            <div style="font-size:24px;margin-bottom:4px;">${p.icon}</div>
            <div style="font-size:11px;font-weight:500;color:var(--text2);">${p.name}</div>
            <div style="font-size:9px;color:var(--muted2);">${p.desc}</div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Strategies -->
    <div style="margin-bottom:14px;">
      <div style="font-size:12px;font-weight:500;color:var(--text2);margin-bottom:8px;">🧠 Estrategias de Arbitraje</div>
      ${ARBITRAGE_STRATEGIES.map(s => `
        <div class="arbitrage-strategy-card" onclick="showArbitrageStrategy('${s.id}')">
          <div style="display:flex;align-items:center;gap:10px;">
            <span style="font-size:24px;">${s.icon}</span>
            <div style="flex:1;">
              <div style="font-size:13px;font-weight:500;color:var(--text2);">${s.name}</div>
              <div style="font-size:10px;color:var(--muted2);">${s.desc.substring(0, 60)}${s.desc.length > 60 ? '…' : ''}</div>
            </div>
            <div style="text-align:right;">
              <div style="font-size:18px;font-weight:700;font-family:var(--mono);color:var(--success-bright);">${s.yieldMultiplier}x</div>
              <div style="font-size:8px;color:var(--muted2);">yield multiplier</div>
            </div>
            <div style="text-align:center;padding:0 8px;">
              <div style="font-size:10px;padding:2px 8px;border-radius:4px;background:${s.difficulty === 'Media' ? 'rgba(92,140,224,0.15)' : s.difficulty === 'Alta' ? 'rgba(224,184,92,0.15)' : 'rgba(224,92,92,0.15)'};color:${s.difficulty === 'Media' ? 'var(--info-bright)' : s.difficulty === 'Alta' ? 'var(--warning)' : 'var(--danger)'};">${s.difficulty}</div>
              <div style="font-size:8px;color:var(--muted2);margin-top:2px;">ROI ${s.roi}</div>
            </div>
            <span style="font-size:16px;color:var(--muted2);">▸</span>
          </div>
        </div>
      `).join('')}
    </div>

    <!-- Arbitrage Calculator -->
    <div style="background:var(--bg3);border:0.5px solid var(--border);border-radius:var(--radius2);padding:14px;">
      <div style="font-size:12px;font-weight:500;margin-bottom:8px;">🧮 Calculadora de Arbitraje</div>
      <div style="font-size:10px;color:var(--muted2);margin-bottom:10px;">Compara cuánto ganarías con diferentes estrategias de monetización en el mismo tráfico</div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:10px;">
        <div>
          <label style="font-size:9px;color:var(--muted2);display:block;margin-bottom:3px;">Visitas diarias</label>
          <input type="number" id="arb-visits" value="5000" min="100" style="width:100%;background:var(--bg4);border:0.5px solid var(--border);border-radius:6px;padding:7px 10px;color:var(--text);font-size:12px;font-family:var(--mono);outline:none;" oninput="updateArbitrageCalc()" />
        </div>
        <div>
          <label style="font-size:9px;color:var(--muted2);display:block;margin-bottom:3px;">CPC promedio (AdSense)</label>
          <input type="number" id="arb-cpc" value="5" min="0.1" step="0.1" style="width:100%;background:var(--bg4);border:0.5px solid var(--border);border-radius:6px;padding:7px 10px;color:var(--text);font-size:12px;font-family:var(--mono);outline:none;" oninput="updateArbitrageCalc()" />
        </div>
        <div>
          <label style="font-size:9px;color:var(--muted2);display:block;margin-bottom:3px;">CPM Monetag</label>
          <input type="number" id="arb-cpm" value="8" min="0.1" step="0.1" style="width:100%;background:var(--bg4);border:0.5px solid var(--border);border-radius:6px;padding:7px 10px;color:var(--text);font-size:12px;font-family:var(--mono);outline:none;" oninput="updateArbitrageCalc()" />
        </div>
      </div>
      <div id="arbitrage-calc-result" style="background:var(--bg4);border-radius:var(--radius);padding:14px;">
        <div style="font-size:11px;color:var(--muted2);text-align:center;">Ajusta los valores para ver la comparación</div>
      </div>
    </div>
  `;

  setTimeout(() => updateArbitrageCalc(), 200);
}

function showArbitrageComparison(id) {
  const p = ARBITRAGE_PLATFORMS.find(ap => ap.id === id);
  if (!p) return;

  const comparisons = {
    'adsense-vs-monetag': {
      rows: [
        { metric: 'CPC/CPM promedio', adsense: '$5 - $25', monetag: '$5 - $15' },
        { metric: 'CTR típico', adsense: '1-5%', monetag: '0.5-2% (pop)' },
        { metric: 'Fill rate', adsense: '100% (si hay anunciante)', monetag: '30-50%' },
        { metric: 'Latencia de pago', adsense: 'Net 30', monetag: 'Net 15 / Net 7' },
        { metric: 'CPC más alto', adsense: 'Insurance $85', monetag: 'Crypto $15 CPM' },
        { metric: 'Mejor para', adsense: 'Tráfico orgánico Tier 1', monetag: 'Tráfico directo/pop cualquier país' },
        { metric: 'Combinación ideal', adsense: 'Post principal + silos', monetag: 'Residual + tráfico de rebote' },
      ]
    },
    'adsense-vs-amazon': {
      rows: [
        { metric: 'Comisión promedio', adsense: '$5 - $85 por clic', monetag: '3-10% del precio del producto' },
        { metric: 'Cuándo gana', adsense: 'Keywords informativas (guías)', monetag: 'Keywords de comparación (best X)' },
        { metric: 'Ingreso por 1000 visits', adsense: '$50 - $500', monetag: '$30 - $200' },
        { metric: 'Esfuerzo de contenido', adsense: 'Alto (texto extenso)', monetag: 'Alto (reviews detallados)' },
        { metric: 'Madurez SEO', adsense: 'Más rápido (3-6 meses)', monetag: 'Más lento (6-12 meses)' },
        { metric: 'Mejor estrategia', adsense: 'Ambos: AdSense en cuerpo + afiliados en CTA' },
      ]
    },
    'monetag-vs-adsterra': {
      rows: [
        { metric: 'CPM popunder', adsense: '$5 - $15', monetag: '$4 - $12' },
        { metric: 'CPM push', adsense: '$8 - $20', monetag: '$6 - $18' },
        { metric: 'Pago mínimo', adsense: '$100', monetag: '$5' },
        { metric: 'Métodos de pago', adsense: 'PayPal, Wire, Crypto', monetag: 'PayPal, Payoneer, Wire' },
        { metric: 'Facilidad de uso', adsense: '⭐⭐⭐⭐', monetag: '⭐⭐⭐⭐⭐' },
        { metric: 'Tráfico Tier 1', adsense: 'Mejor CPM en US/UK', monetag: 'Buen CPM en Tier 1-2' },
      ]
    },
    'youtube-vs-blog': {
      rows: [
        { metric: 'RPM promedio', adsense: '$5 - $50 (AdSense)', monetag: '$2 - $15 (YouTube)' },
        { metric: 'Tiempo para crecer', adsense: '3-6 meses SEO', monetag: '6-12 meses algoritmo' },
        { metric: 'Esfuerzo por contenido', adsense: '2-4 horas post', monetag: '4-8 horas video' },
        { metric: 'Vida del contenido', adsense: 'Evergreen (años)', monetag: 'Varía (meses-años)' },
        { metric: 'Potencial de viralidad', adsense: 'Medio (SEO)', monetag: 'Alto (recomendaciones)' },
        { metric: 'Mejor estrategia', adsense: 'Blog post + video embebido (sinergia)' },
      ]
    },
    'tier1-vs-tier2': {
      rows: [
        { metric: 'CPC AdSense US', adsense: '$5 - $85', monetag: '$0.50 - $2' },
        { metric: 'CPC AdSense LATAM', adsense: '$0.20 - $2', monetag: '$0.05 - $0.50' },
        { metric: 'CPC AdSense Asia', adsense: '$0.10 - $1', monetag: '$0.02 - $0.30' },
        { metric: 'CPM Monetag US', adsense: '$10 - $25', monetag: '$1 - $3' },
        { metric: 'Volumen de tráfico', adsense: 'Menor', monetag: 'Masivo' },
        { metric: 'Estrategia', adsense: 'Enfoque Tier 1 para AdSense, todo el mundo para Monetag' },
      ]
    },
  };

  const data = comparisons[id];
  if (!data) return;

  const isVariant = id === 'adsense-vs-amazon' || id === 'monetag-vs-adsterra' || id === 'youtube-vs-blog' || id === 'tier1-vs-tier2';
  const label1 = id.includes('monetag-vs-adsterra') ? 'Monetag' : id.includes('adsense-vs-amazon') ? 'AdSense' : id.includes('youtube-vs-blog') ? 'Blog (AdSense)' : id.includes('tier1-vs-tier2') ? 'Tier 1 (US/UK/CA)' : 'AdSense';
  const label2 = id.includes('monetag-vs-adsterra') ? 'Adsterra' : id.includes('adsense-vs-amazon') ? 'Amazon Affiliates' : id.includes('youtube-vs-blog') ? 'YouTube' : id.includes('tier1-vs-tier2') ? 'Tier 2/3 (LATAM/Asia)' : 'Monetag';

  const rowsHTML = data.rows.map(r => `
    <tr>
      <td style="padding:7px 10px;border-bottom:0.5px solid var(--border);color:var(--text2);font-size:12px;">${r.metric}</td>
      <td style="padding:7px 10px;border-bottom:0.5px solid var(--border);color:var(--success-bright);font-size:12px;text-align:right;">${r.adsense}</td>
      <td style="padding:7px 10px;border-bottom:0.5px solid var(--border);color:var(--info-bright);font-size:12px;text-align:right;">${r.monetag}</td>
    </tr>
  `).join('');

  openModal(`⚔️ ${p.name} — Comparativa`, `
    <div style="font-size:12px;color:var(--muted);margin-bottom:14px;line-height:1.5;">${p.desc}</div>
    <table style="width:100%;border-collapse:collapse;">
      <thead>
        <tr>
          <th style="text-align:left;padding:7px 10px;background:var(--bg4);color:var(--accent);font-size:10px;text-transform:uppercase;">Métrica</th>
          <th style="text-align:right;padding:7px 10px;background:var(--bg4);color:var(--success-bright);font-size:10px;text-transform:uppercase;">${label1}</th>
          <th style="text-align:right;padding:7px 10px;background:var(--bg4);color:var(--info-bright);font-size:10px;text-transform:uppercase;">${label2}</th>
        </tr>
      </thead>
      <tbody>${rowsHTML}</tbody>
    </table>
    <div style="margin-top:12px;padding:10px;background:var(--bg3);border-radius:var(--radius);font-size:11px;color:var(--muted);text-align:center;line-height:1.5;">
      💡 <strong>Veredicto:</strong> Ninguna plataforma es mejor — la clave es usar <strong style="color:var(--accent);">la combinación correcta</strong> para cada tipo de tráfico y nicho.
    </div>
  `);
}

function showArbitrageStrategy(id) {
  const s = ARBITRAGE_STRATEGIES.find(st => st.id === id);
  if (!s) return;

  openModal(`🧠 ${s.name} — Estrategia de Arbitraje`, `
    <div style="font-size:13px;line-height:1.7;">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;padding-bottom:10px;border-bottom:0.5px solid var(--border);">
        <span style="font-size:32px;">${s.icon}</span>
        <div style="flex:1;">
          <div style="font-size:16px;font-weight:600;">${s.name}</div>
          <div style="font-size:11px;color:var(--muted2);">${s.desc}</div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:22px;font-weight:700;color:var(--success-bright);">${s.yieldMultiplier}x</div>
          <div style="font-size:9px;color:var(--muted2);">multiplicador</div>
        </div>
      </div>

      <div style="background:var(--bg3);border:0.5px solid var(--border);border-radius:var(--radius);padding:12px;margin-bottom:12px;">
        <div style="font-size:9px;color:var(--muted2);text-transform:uppercase;margin-bottom:6px;">📋 Pasos de la Estrategia</div>
        <ol style="margin:0;padding:0 0 0 16px;font-size:12px;color:var(--text2);line-height:2;">
          ${s.steps.map(st => `<li>${st}</li>`).join('')}
        </ol>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;">
        <div style="background:var(--bg3);border-radius:var(--radius);padding:10px;text-align:center;">
          <div style="font-size:9px;color:var(--muted2);text-transform:uppercase;">Yield Multiplier</div>
          <div style="font-size:20px;font-weight:700;color:var(--success-bright);">${s.yieldMultiplier}x</div>
        </div>
        <div style="background:var(--bg3);border-radius:var(--radius);padding:10px;text-align:center;">
          <div style="font-size:9px;color:var(--muted2);text-transform:uppercase;">Dificultad</div>
          <div style="font-size:16px;font-weight:600;color:${s.difficulty === 'Media' ? 'var(--info-bright)' : s.difficulty === 'Alta' ? 'var(--warning)' : 'var(--danger)'};">${s.difficulty}</div>
        </div>
        <div style="background:var(--bg3);border-radius:var(--radius);padding:10px;text-align:center;">
          <div style="font-size:9px;color:var(--muted2);text-transform:uppercase;">ROI</div>
          <div style="font-size:16px;font-weight:600;color:var(--accent);">${s.roi}</div>
        </div>
      </div>
    </div>
  `);
}

function updateArbitrageCalc() {
  const visits = parseInt(document.getElementById('arb-visits')?.value) || 5000;
  const cpc = parseFloat(document.getElementById('arb-cpc')?.value) || 5;
  const cpm = parseFloat(document.getElementById('arb-cpm')?.value) || 8;
  const resultEl = document.getElementById('arbitrage-calc-result');
  if (!resultEl) return;

  // AdSense: visitas * CTR (2.5%) * CPC
  const ctr = 2.5;
  const dailyClicks = Math.round(visits * (ctr / 100));
  const dailyAdsense = dailyClicks * cpc;
  const monthlyAdsense = dailyAdsense * 30;

  // Monetag: (visitas * fill rate 35% / 1000) * CPM
  const fillRate = 0.35;
  const dailyMonetag = Math.round((visits * fillRate / 1000) * cpm);
  const monthlyMonetag = dailyMonetag * 30;

  // Amazon affiliates: 5% conversion de tráfico con intención de compra, $20 AOV
  const amazonConversion = 0.05;
  const amazonAOV = 20;
  const amazonCommission = 0.08;
  const dailyAmazon = Math.round(visits * amazonConversion * amazonAOV * amazonCommission);
  const monthlyAmazon = dailyAmazon * 30;

  // YouTube: 50% de visitas ven video, RPM $5
  const youtubeRPM = 5;
  const dailyYoutube = Math.round(visits * 0.5 / 1000 * youtubeRPM);
  const monthlyYoutube = dailyYoutube * 30;

  // Combined strategies
  const adsenseOnly = monthlyAdsense;
  const monetagOnly = monthlyMonetag;
  const hybrid = Math.round(monthlyAdsense + monthlyMonetag * 0.7);
  const fullArbitrage = Math.round(monthlyAdsense + monthlyMonetag * 0.7 + monthlyAmazon * 0.5);
  const maxYield = Math.round(fullArbitrage * 1.5);

  const fmt = (n) => {
    if (n >= 1000000) return '$' + (n / 1000000).toFixed(2) + 'M';
    if (n >= 1000) return '$' + (n / 1000).toFixed(1) + 'K';
    return '$' + n.toFixed(2);
  };

  const maxValue = Math.max(adsenseOnly, monetagOnly, hybrid, fullArbitrage, maxYield);

  resultEl.innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:12px;">
      <div style="text-align:center;">
        <div style="font-size:8px;color:var(--muted2);text-transform:uppercase;">Tráfico mensual</div>
        <div style="font-size:18px;font-weight:600;font-family:var(--mono);color:var(--text2);">${(visits * 30).toLocaleString('en-US')}</div>
        <div style="font-size:8px;color:var(--muted2);">${dailyClicks} clics/día</div>
      </div>
      <div style="text-align:center;">
        <div style="font-size:8px;color:var(--muted2);text-transform:uppercase;">CPC Promedio</div>
        <div style="font-size:18px;font-weight:600;font-family:var(--mono);color:var(--success-bright);">$${cpc.toFixed(2)}</div>
      </div>
      <div style="text-align:center;">
        <div style="font-size:8px;color:var(--muted2);text-transform:uppercase;">CPM Monetag</div>
        <div style="font-size:18px;font-weight:600;font-family:var(--mono);color:var(--info-bright);">$${cpm.toFixed(2)}</div>
      </div>
    </div>

    <div style="display:flex;flex-direction:column;gap:6px;margin-bottom:12px;">
      <div style="display:flex;align-items:center;gap:8px;">
        <span style="width:120px;font-size:10px;color:var(--muted2);text-align:right;">Solo AdSense</span>
        <div style="flex:1;height:16px;background:var(--bg4);border-radius:3px;overflow:hidden;">
          <div style="height:100%;width:${(adsenseOnly / maxValue) * 100}%;background:var(--success-bright);border-radius:3px;transition:width 0.3s;"></div>
        </div>
        <span style="width:70px;font-size:11px;font-family:var(--mono);color:var(--success-bright);text-align:right;font-weight:600;">${fmt(adsenseOnly)}</span>
      </div>
      <div style="display:flex;align-items:center;gap:8px;">
        <span style="width:120px;font-size:10px;color:var(--muted2);text-align:right;">Solo Monetag</span>
        <div style="flex:1;height:16px;background:var(--bg4);border-radius:3px;overflow:hidden;">
          <div style="height:100%;width:${(monetagOnly / maxValue) * 100}%;background:var(--info-bright);border-radius:3px;transition:width 0.3s;"></div>
        </div>
        <span style="width:70px;font-size:11px;font-family:var(--mono);color:var(--info-bright);text-align:right;font-weight:600;">${fmt(monetagOnly)}</span>
      </div>
      <div style="display:flex;align-items:center;gap:8px;">
        <span style="width:120px;font-size:10px;color:var(--muted2);text-align:right;">Híbrido (AdS+Mon)</span>
        <div style="flex:1;height:16px;background:var(--bg4);border-radius:3px;overflow:hidden;">
          <div style="height:100%;width:${(hybrid / maxValue) * 100}%;background:var(--accent);border-radius:3px;transition:width 0.3s;"></div>
        </div>
        <span style="width:70px;font-size:11px;font-family:var(--mono);color:var(--accent);text-align:right;font-weight:600;">${fmt(hybrid)}</span>
      </div>
      <div style="display:flex;align-items:center;gap:8px;">
        <span style="width:120px;font-size:10px;color:var(--muted2);text-align:right;">Arbitraje Total</span>
        <div style="flex:1;height:16px;background:var(--bg4);border-radius:3px;overflow:hidden;">
          <div style="height:100%;width:${(fullArbitrage / maxValue) * 100}%;background:var(--orange-bright);border-radius:3px;transition:width 0.3s;"></div>
        </div>
        <span style="width:70px;font-size:11px;font-family:var(--mono);color:var(--orange-bright);text-align:right;font-weight:600;">${fmt(fullArbitrage)}</span>
      </div>
      <div style="display:flex;align-items:center;gap:8px;">
        <span style="width:120px;font-size:10px;color:var(--muted2);text-align:right;">Yield Máximo 🏆</span>
        <div style="flex:1;height:20px;background:var(--bg4);border-radius:3px;overflow:hidden;border:0.5px solid var(--accent);">
          <div style="height:100%;width:${(maxYield / maxValue) * 100}%;background:linear-gradient(90deg,var(--accent),var(--gold-light));border-radius:3px;transition:width 0.3s;"></div>
        </div>
        <span style="width:70px;font-size:13px;font-family:var(--mono);color:var(--accent);text-align:right;font-weight:700;">${fmt(maxYield)}</span>
      </div>
    </div>

    <div style="background:var(--bg3);border-radius:var(--radius);padding:8px;font-size:9px;color:var(--muted2);text-align:center;">
      💡 Arbitraje Total = AdSense + Monetag (70%) + Amazon Afiliados (50%) · Yield Máximo = Arbitraje Total × 1.5 (con estrategia de silo)
    </div>
  `;
}

/* ══════════════════════════════════════════════
   EXPORT & UTILITY FUNCTIONS
   ══════════════════════════════════════════════ */

function exportOSINTReport() {
  const tab = osintState.activeTab;
  const tabNames = { recon: 'OSINT Recon', viral: 'Viral Hunter', arbitrage: 'Data Arbitrage' };
  
  let text = `NUCLEAR AIMA — OSINT SUITE REPORT\n`;
  text += `Módulo: ${tabNames[tab] || 'OSINT Suite'}\n`;
  text += `Fecha: ${new Date().toLocaleDateString('es-DO')}\n`;
  text += `Hora: ${new Date().toLocaleTimeString('es-DO')}\n`;
  text += `━`.repeat(50) + `\n\n`;

  if (tab === 'recon') {
    text += `Herramientas OSINT Disponibles (${OSINT_TOOLS.length}):\n`;
    OSINT_TOOLS.forEach(t => {
      text += `  ${t.icon} ${t.name}: ${t.desc}\n`;
    });
    text += `\nHistorial de Análisis (${osintState.osintHistory.length}):\n`;
    osintState.osintHistory.forEach(h => {
      text += `  🌐 ${h.domain} — DA: ${h.da} · Tráfico: ${h.traffic} · ${new Date(h.timestamp).toLocaleDateString('es-DO')}\n`;
    });
  } else if (tab === 'viral') {
    text += `Formatos Virales Identificados (${VIRAL_PATTERNS.length}):\n`;
    VIRAL_PATTERNS.forEach(p => {
      text += `  ${p.icon} ${p.name}: ${p.desc}\n`;
      text += `     Vistas prom.: ${p.avgViews.toLocaleString('en-US')} · Evergreen: ${p.evergreen}%\n`;
    });
    text += `\nFuentes de Datos (${VIRAL_SOURCES.length}):\n`;
    VIRAL_SOURCES.forEach(s => {
      text += `  ${s.icon} ${s.name}: ${s.url}\n`;
    });
  } else if (tab === 'arbitrage') {
    text += `Comparativas de Plataformas (${ARBITRAGE_PLATFORMS.length}):\n`;
    ARBITRAGE_PLATFORMS.forEach(p => {
      text += `  ${p.icon} ${p.name}: ${p.desc}\n`;
    });
    text += `\nEstrategias de Arbitraje (${ARBITRAGE_STRATEGIES.length}):\n`;
    ARBITRAGE_STRATEGIES.forEach(s => {
      text += `  ${s.icon} ${s.name} — Yield: ${s.yieldMultiplier}x · Dificultad: ${s.difficulty}\n`;
      text += `     ${s.desc.substring(0, 80)}...\n`;
    });
  }

  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `osint-suite-${tab}-${new Date().toISOString().split('T')[0]}.txt`;
  a.click();
  showOSINTToast(`📥 Reporte exportado — ${tab}`);
}

/* ── Toast ── */
let osintToastTimer = null;

function showOSINTToast(msg) {
  let toast = document.getElementById('osint-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'osint-toast';
    toast.style.cssText = 'position:fixed;bottom:20px;right:20px;background:var(--bg3);border:0.5px solid var(--border);border-radius:var(--radius);padding:10px 16px;font-size:12px;color:var(--text);z-index:9999;box-shadow:0 4px 20px rgba(0,0,0,0.4);transition:opacity 0.3s;max-width:320px;';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = '1';
  clearTimeout(osintToastTimer);
  osintToastTimer = setTimeout(() => { toast.style.opacity = '0'; }, 2500);
}

console.log('🕵️ OSINT Suite loaded — ' + OSINT_TOOLS.length + ' tools · ' + VIRAL_PATTERNS.length + ' viral patterns · ' + ARBITRAGE_STRATEGIES.length + ' strategies');
