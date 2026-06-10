/* ══════════════════════════════════════════════
   NUCLEAR AIMA — CPC CONTENT ENGINE v1.0
   Generador de Contenido desde Nodos de Live Search
   SEO Titles · Article Prompts · Thumbnails · Images · Audience · Ads
   ══════════════════════════════════════════════ */

/* ── DOMAIN / YIELD ANALYZER ── */

function analyzeDomainNode(index) {
  const results = liveSearchState.results;
  if (!results || index < 0 || index >= results.length) {
    showCPCToast('⚠️ Resultado no encontrado');
    return;
  }

  const r = results[index];
  const domain = extractDomain(r.url);
  if (!domain) {
    showCPCToast('⚠️ No se pudo extraer el dominio');
    return;
  }

  // ── Check cache ──
  if (liveSearchState.analyzedDomains[domain]) {
    showDomainAnalysisModal(domain, liveSearchState.analyzedDomains[domain], r, index);
    return;
  }

  showCPCToast('⏳ Analizando dominio...');

  // ── Compute yield analysis ──
  const analysis = computeDomainAnalysis(domain, r);
  liveSearchState.analyzedDomains[domain] = analysis;
  showDomainAnalysisModal(domain, analysis, r, index);
}

function computeDomainAnalysis(domain, result) {
  const fullText = (result.title + ' ' + (result.snippet || '') + ' ' + (result.keywords || []).join(' ')).toLowerCase();
  
  // ── Match against CPC_NICHES ──
  let matchedNiche = null;
  let maxScore = 0;
  
  if (typeof CPC_NICHES !== 'undefined') {
    CPC_NICHES.forEach(n => {
      let score = 0;
      const kws = n.keywords.split(', ').filter(Boolean);
      kws.forEach(kw => {
        if (fullText.includes(kw.toLowerCase())) score += 10;
      });
      const angles = n.contentAngles.split(', ').filter(Boolean);
      angles.forEach(a => {
        if (fullText.includes(a.toLowerCase())) score += 5;
      });
      if (n.cat && fullText.includes(n.cat.toLowerCase())) score += 8;
      if (n.name && fullText.includes(n.name.toLowerCase())) score += 12;
      if (score > maxScore) {
        maxScore = score;
        matchedNiche = n;
      }
    });
  }

  // ── Traffic estimation ──
  // Based on keyword competitiveness and niche traffic potential
  const trafficMultiplier = matchedNiche ? (matchedNiche.trafficPotential / 100) : 0.5;
  const snippetLength = (result.snippet || '').length;
  
  // Estimated monthly search volume (rough heuristic)
  const estMonthlySearchVolume = Math.round(
    (snippetLength > 150 ? 8000 : snippetLength > 80 ? 4000 : snippetLength > 30 ? 1500 : 500) *
    (0.5 + trafficMultiplier * 0.5) *
    (1 + Math.random() * 0.3)  // Small variance
  );

  // ── CPC estimation ──
  const nicheCPCAvg = matchedNiche ? (matchedNiche.adsenseCPCLow + matchedNiche.adsenseCPCHigh) / 2 : 0.50;
  const estCPC = matchedNiche ? nicheCPCAvg : 
    (result.keywords && result.keywords.length > 0 ? estimateCPCFromKeywords(result.keywords) : 0.50);
  
  // ── Traffic estimation (organic visitors/month) ──
  // If the domain ranks well, it gets a share of search volume
  const domainAgeBonus = domain.endsWith('.com') ? 1.2 : 1.0;
  const estMonthlyVisitors = Math.round(estMonthlySearchVolume * 0.35 * domainAgeBonus);
  
  // ── Yield score ──
  const adsensePotential = estMonthlyVisitors * 0.025 * estCPC;  // CTR 2.5%
  const monetagCPM = matchedNiche ? matchedNiche.monetagCPM : 3.0;
  const monetagPotential = (estMonthlyVisitors * 0.35 / 1000) * monetagCPM;
  const monthlyYield = Math.round(adsensePotential + monetagPotential);
  
  // ── Competitor strength ──
  const competitorStrength = matchedNiche ? matchedNiche.competition : 
    Math.min(95, 40 + Math.round(Math.random() * 40));

  // ── Yield score (0-100) ──
  const trafficScore = Math.min(50, Math.round((estMonthlyVisitors / 50000) * 50));
  const cpcScore = Math.min(30, Math.round((estCPC / 50) * 30));
  const nicheScore = matchedNiche ? Math.round(matchedNiche.combinedScore * 0.2) : 5;
  const yieldScore = Math.min(100, trafficScore + cpcScore + nicheScore);

  // ── Content opportunities ──
  const contentOpportunities = [];
  if (result.keywords && result.keywords.length > 0) {
    result.keywords.slice(0, 3).forEach(kw => {
      contentOpportunities.push(`Post sobre "${kw}" — keyword con potencial de tráfico`);
    });
  }
  if (matchedNiche) {
    contentOpportunities.push(`Guía completa de "${matchedNiche.name}" — nicho con CPC $${matchedNiche.adsenseCPCLow}-$${matchedNiche.adsenseCPCHigh}`);
    contentOpportunities.push(`Comparativa de ${matchedNiche.name} — contenido de alto valor para el nicho`);
  }
  if (!contentOpportunities.length) {
    contentOpportunities.push(`Artículo informativo sobre "${result.title}" para captar tráfico de cola larga`);
    contentOpportunities.push(`Guía paso a paso basada en "${domain}" — contenido práctico y útil`);
  }

  return {
    domain,
    title: result.title,
    matchedNiche: matchedNiche ? { name: matchedNiche.name, cat: matchedNiche.cat, icon: matchedNiche.icon } : null,
    estMonthlySearchVolume,
    estMonthlyVisitors,
    estCPC: parseFloat(estCPC.toFixed(2)),
    monthlyYield,
    adsensePotential: parseFloat(adsensePotential.toFixed(2)),
    monetagPotential: parseFloat(monetagPotential.toFixed(2)),
    competitorStrength,
    yieldScore,
    trafficScore: Math.round(trafficScore / 50 * 100),
    cpcScore: Math.round(cpcScore / 30 * 100),
    nicheScore: Math.round(nicheScore / 20 * 100),
    contentOpportunities,
    timestamp: Date.now()
  };
}

function estimateCPCFromKeywords(keywords) {
  // Heuristic CPC estimation from keywords
  const highCPC = ['insurance', 'loan', 'mortgage', 'credit', 'lawyer', 'attorney', 'invest', 'crypto', 'saas', 'software', 'hosting', 'seo', 'marketing', 'cyber', 'security', 'vpn', 'degree', 'certification', 'course', 'mba'];
  const midCPC = ['health', 'fitness', 'weight', 'diet', 'supplement', 'travel', 'hotel', 'flight', 'real estate', 'home', 'car', 'auto', 'business', 'startup', 'email', 'webinar'];
  
  let maxCPC = 0.50;
  keywords.forEach(kw => {
    const lk = kw.toLowerCase();
    highCPC.forEach(h => { if (lk.includes(h)) maxCPC = Math.max(maxCPC, 15 + Math.random() * 30); });
    midCPC.forEach(m => { if (lk.includes(m)) maxCPC = Math.max(maxCPC, 3 + Math.random() * 8); });
  });
  return maxCPC;
}

function showDomainAnalysisModal(domain, analysis, result, index) {
  const fmt = (n) => {
    if (n >= 1000000) return '$' + (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return '$' + (n / 1000).toFixed(1) + 'K';
    return '$' + n.toFixed(2);
  };

  const yieldColor = analysis.yieldScore >= 70 ? 'var(--success-bright)' : 
                     analysis.yieldScore >= 40 ? 'var(--accent)' : 'var(--muted2)';

  const bodyHTML = `
    <div style="font-size:13px;line-height:1.7;">
      <!-- Domain Header -->
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;padding-bottom:14px;border-bottom:0.5px solid var(--border);">
        <div style="width:48px;height:48px;border-radius:12px;background:var(--bg3);display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;">🌐</div>
        <div style="flex:1;min-width:0;">
          <div style="font-size:16px;font-weight:600;color:var(--text);">${analysis.domain}</div>
          <div style="font-size:11px;color:var(--muted2);margin-top:2px;">${analysis.matchedNiche ? analysis.matchedNiche.icon + ' ' + analysis.matchedNiche.name + ' · ' + analysis.matchedNiche.cat : 'Nichos mixtos / sin clasificar'}</div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:28px;font-weight:700;font-family:var(--mono);color:${yieldColor};">${analysis.yieldScore}</div>
          <div style="font-size:9px;color:var(--muted2);">Yield Score</div>
        </div>
      </div>

      <!-- Metrics Grid -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px;">
        <div style="background:var(--bg3);border-radius:var(--radius);padding:12px;text-align:center;">
          <div style="font-size:9px;color:var(--muted2);text-transform:uppercase;">CPC Estimado</div>
          <div style="font-size:20px;font-weight:700;font-family:var(--mono);color:var(--success-bright);">$${analysis.estCPC.toFixed(2)}</div>
        </div>
        <div style="background:var(--bg3);border-radius:var(--radius);padding:12px;text-align:center;">
          <div style="font-size:9px;color:var(--muted2);text-transform:uppercase;">Tráfico Est.</div>
          <div style="font-size:20px;font-weight:700;font-family:var(--mono);color:var(--info-bright);">${analysis.estMonthlyVisitors.toLocaleString('en-US')}/mo</div>
        </div>
      </div>

      <!-- Yield Breakdown -->
      <div style="background:var(--bg3);border:0.5px solid var(--border);border-radius:var(--radius);padding:14px;margin-bottom:14px;">
        <div style="font-size:10px;font-weight:600;color:var(--accent);text-transform:uppercase;letter-spacing:0.03em;margin-bottom:10px;">💰 Proyección de Ingresos</div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:10px;">
          <div style="text-align:center;">
            <div style="font-size:9px;color:var(--muted2);text-transform:uppercase;">AdSense</div>
            <div style="font-size:16px;font-weight:700;font-family:var(--mono);color:var(--success-bright);">${fmt(analysis.adsensePotential)}/mo</div>
          </div>
          <div style="text-align:center;">
            <div style="font-size:9px;color:var(--muted2);text-transform:uppercase;">Monetag</div>
            <div style="font-size:16px;font-weight:700;font-family:var(--mono);color:var(--info-bright);">${fmt(analysis.monetagPotential)}/mo</div>
          </div>
          <div style="text-align:center;">
            <div style="font-size:9px;color:var(--muted2);text-transform:uppercase;">Total Est.</div>
            <div style="font-size:18px;font-weight:700;font-family:var(--mono);color:var(--accent);">${fmt(analysis.monthlyYield)}/mo</div>
          </div>
        </div>
        <!-- Yield bar -->
        <div style="display:flex;align-items:center;gap:8px;">
          <span style="font-size:9px;color:var(--muted2);white-space:nowrap;">Yield</span>
          <div style="flex:1;height:6px;background:var(--bg4);border-radius:3px;overflow:hidden;">
            <div style="width:${analysis.yieldScore}%;height:100%;background:linear-gradient(90deg,var(--success),var(--accent));border-radius:3px;transition:width 1s;"></div>
          </div>
          <span style="font-size:10px;font-weight:600;font-family:var(--mono);color:${yieldColor};">${analysis.yieldScore}/100</span>
        </div>
      </div>

      <!-- Competitor Strength -->
      <div style="background:var(--bg3);border:0.5px solid var(--border);border-radius:var(--radius);padding:12px;margin-bottom:14px;">
        <div style="font-size:9px;color:var(--muted2);text-transform:uppercase;margin-bottom:6px;">⚔️ Competencia en el Nicho</div>
        <div style="display:flex;align-items:center;gap:10px;">
          <div style="flex:1;height:8px;background:var(--bg4);border-radius:4px;overflow:hidden;">
            <div style="width:${analysis.competitorStrength}%;height:100%;background:${analysis.competitorStrength >= 80 ? 'var(--danger)' : analysis.competitorStrength >= 60 ? 'var(--warning)' : 'var(--success)'};border-radius:4px;"></div>
          </div>
          <span style="font-size:11px;font-weight:600;font-family:var(--mono);color:${analysis.competitorStrength >= 80 ? 'var(--danger)' : analysis.competitorStrength >= 60 ? 'var(--warning)' : 'var(--success)'};">${analysis.competitorStrength}%</span>
        </div>
      </div>

      <!-- Content Opportunities -->
      <div style="background:rgba(76,173,124,0.04);border:0.5px solid rgba(76,173,124,0.15);border-radius:var(--radius);padding:12px;">
        <div style="font-size:10px;font-weight:600;color:var(--success-bright);text-transform:uppercase;letter-spacing:0.03em;margin-bottom:8px;">📝 Oportunidades de Contenido</div>
        ${analysis.contentOpportunities.map((o, i) => `
          <div style="display:flex;align-items:flex-start;gap:6px;padding:4px 0;font-size:12px;color:var(--text2);">
            <span style="color:var(--accent);flex-shrink:0;">${i + 1}.</span>
            <span>${o}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  const footerHTML = `
    <button class="btn btn-sm btn-ghost" onclick="closeModal()">Cerrar</button>
    <button class="btn btn-sm btn-primary" onclick="closeModal();generateContentFromNode(${index})" style="font-size:11px;">✍️ Generar Contenido</button>
  `;

  openModal('⚡ Análisis de Dominio: ' + analysis.domain, bodyHTML, footerHTML);
}


/* ══════════════════════════════════════════════
   CONTENT GENERATION FROM NODE
   ══════════════════════════════════════════════ */

function generateContentFromNode(index) {
  const results = liveSearchState.results;
  if (!results || index < 0 || index >= results.length) {
    showCPCToast('⚠️ Resultado no encontrado');
    return;
  }

  const r = results[index];
  const domain = extractDomain(r.url);
  const fullText = (r.title + ' ' + (r.snippet || '') + ' ' + (r.keywords || []).join(' ')).toLowerCase();

  // ── Find matching niche ──
  let matchedNiche = null;
  let maxScore = 0;
  if (typeof CPC_NICHES !== 'undefined') {
    CPC_NICHES.forEach(n => {
      let score = 0;
      n.keywords.split(', ').filter(Boolean).forEach(kw => {
        if (fullText.includes(kw.toLowerCase())) score += 10;
      });
      n.contentAngles.split(', ').filter(Boolean).forEach(a => {
        if (fullText.includes(a.toLowerCase())) score += 5;
      });
      if (n.cat && fullText.includes(n.cat.toLowerCase())) score += 8;
      if (n.name && fullText.includes(n.name.toLowerCase())) score += 12;
      if (score > maxScore) {
        maxScore = score;
        matchedNiche = n;
      }
    });
  }

  const niche = matchedNiche;
  const year = new Date().getFullYear();
  const query = liveSearchState.query || '';

  // ── 1. SEO Title ──
  const seoTitles = generateSEOTitles(r, niche, query, domain);
  
  // ── 2. Full Article Prompt ──
  const articlePrompt = generateArticlePrompt(r, niche, query, domain, seoTitles);

  // ── 3. Thumbnail Prompt ──
  const thumbnailPrompt = generateThumbnailPrompt(r, niche, query);

  // ── 4. Three Image Prompts ──
  const imagePrompts = generateImagePrompts(r, niche, query);

  // ── 5. Target Audience ──
  const targetAudience = generateTargetAudience(r, niche, query);

  // ── 6. Three Ad Asset Sets ──
  const adSets = generateAdSets(r, niche, query, seoTitles);

  // ── Render modal ──
  showContentFromNodeModal(r, domain, niche, { seoTitles, articlePrompt, thumbnailPrompt, imagePrompts, targetAudience, adSets });
}


/* ── SEO Title Generator ── */

function generateSEOTitles(result, niche, query, domain) {
  const kw = (result.keywords && result.keywords.length > 0) ? result.keywords[0] : query;
  const nicheName = niche ? niche.name : '';
  const nicheCat = niche ? niche.cat : '';
  
  const titles = [
    {
      title: `${result.title}: ${nicheName ? 'La Guía Completa para ' + year : 'Todo lo que Necesitas Saber'}`,
      angle: 'Guía completa / artículo pilar',
      reason: 'Posiciona para la keyword principal + variaciones semánticas. Ideal para tráfico orgánico de cola larga.'
    },
    {
      title: `${kw} — ${nicheName ? 'Beneficios, Precios y Opiniones ' + year : 'Guía Actualizada ' + year}`,
      angle: 'Comparativa / review + SEO',
      reason: 'Captura intención de compra. Alta tasa de clics en SERP por el formato "Beneficios, Precios y Opiniones".'
    },
    {
      title: `¿${kw}? ${nicheName ? 'Los Expertos Responden — Guía ' + year : 'Respuestas y Guía Práctica ' + year}`,
      angle: 'Pregunta + autoridad',
      reason: 'Formato pregunta activa featured snippets. Alto CTR en mobile y búsqueda por voz.'
    },
    {
      title: `Top 10 ${nicheName || kw} que Debes Conocer en ${year} — Comparativa y Análisis`,
      angle: 'Listicle / top ranking',
      reason: 'Los listicles generan 3x más clics que los artículos estándar. Ideal para captar tráfico de comparación.'
    },
    {
      title: `${nicheName || kw} para Principiantes: Guía Paso a Paso ${year} (Actualizado)`,
      angle: 'Guía para principiantes',
      reason: 'Baja competencia de cola larga. Capta usuarios en etapa de investigación temprana.'
    }
  ];

  return titles;
}


/* ── Article Prompt Generator ── */

function generateArticlePrompt(result, niche, query, domain, seoTitles) {
  const kwList = (result.keywords && result.keywords.length > 0) ? result.keywords.slice(0, 5).join(', ') : query;
  const angles = (result.contentAngles && result.contentAngles.length > 0) ? 
    result.contentAngles.slice(0, 3).map(a => '- ' + a).join('\n') : 
    '- Análisis profundo del tema\n- Guía práctica paso a paso\n- Comparativa de opciones';
  const bestTitle = seoTitles[0].title;
  
  // Generate silo suggestions based on niche
  let siloSuggestions = '';
  if (niche) {
    const cat = niche.cat;
    const name = niche.name;
    siloSuggestions = `
  📌 **Silos satélite recomendados para interlinking:**
  - Artículo pilar: "${bestTitle}" (3000+ palabras con enlaces internos)
  - Silo 1: "${name} vs Alternativas — Comparativa ${year}" 
  - Silo 2: "Guía de ${name} para Principiantes — Paso a Paso"
  - Silo 3: "Estadísticas y Datos de ${name} en ${year} (Actualizado)"
  - Silo 4: "Preguntas Frecuentes sobre ${name} — FAQ con Schema"
  - Silo 5: "Casos de Éxito en ${cat}: Ejemplos y Lecciones Aprendidas"

  **Estructura de interlinking:**
  - Desde el artículo pilar, enlaza a cada silo satélite con anchor text optimizado
  - Desde cada silo, enlaza de vuelta al pilar y a 1-2 silos relacionados
  - Usa 3-5 enlaces internos por cada 1000 palabras`;
  } else {
    siloSuggestions = `
  📌 **Silos satélite sugeridos:**
  - Crea 3-5 artículos satélite que enlacen a este post principal
  - Usa variaciones de keywords de cola larga como títulos de los satélites
  - Interlinking bidireccional entre todos los artículos del clúster`;
  }

  const prompt = `## 📝 PROMPT PARA GENERAR ARTÍCULO SEO OPTIMIZADO

### Título SEO:
${bestTitle}

### Keyword principal:
${query}

### Keywords secundarias (LSI):
${kwList}

### Fuente / Referencia:
${result.url}
${result.snippet ? 'Snippet de referencia: ' + result.snippet.substring(0, 300) : ''}

### Nicho:
${niche ? niche.icon + ' ' + niche.name + ' (' + niche.cat + ')' : 'General / Sin clasificar'}
${niche ? 'CPC estimado: $' + niche.adsenseCPCLow + ' — $' + niche.adsenseCPCHigh + ' | CPM Monetag: $' + niche.monetagCPM : ''}

### Extensión recomendada:
2500-3500 palabras

### Estructura del artículo:

**H1:** ${bestTitle}

**Meta Description:** [Escribir meta description de 150-160 caracteres que incluya la keyword principal y genere curiosidad]

**H2: Introducción**
- Hook que conecte con el dolor/necesidad del lector
- Explicar qué aprenderán en el artículo
- Incluir keyword principal en los primeros 100 caracteres

**H2: ¿Qué es ${query} y Por Qué es Importante?**
- Definición clara y contextualizada para ${year}
- Datos y estadísticas recientes que respalden la relevancia
- Beneficios clave para el lector

**H2: Beneficios Clave de ${query}**
${angles}

**H2: Cómo Empezar con ${query} — Guía Paso a Paso**
- 5-7 pasos accionables
- Screenshots o descripciones visuales
- Errores comunes a evitar

**H2: ${query} vs Alternativas — Comparativa ${year}**
- Tabla comparativa con pros y contras
- Cuándo elegir cada opción
- Precios y relación calidad-precio

**H2: Preguntas Frecuentes sobre ${query} (FAQ con Schema)**
- 5-8 preguntas con respuestas detalladas
- Marcar con Schema FAQPage para rich snippets

**H2: Conclusión**
- Resumen de puntos clave
- Llamada a la acción clara
- Pregunta para engagement en comentarios

### Interlinking:
${siloSuggestions}

### Formato:
- Párrafos cortos (2-4 oraciones)
- Listas con viñetas para escaneabilidad
- Negritas para frases clave (máximo 2 por párrafo)
- Una imagen cada 300-400 palabras
- Tabla comparativa en la sección de comparación

### Tono:
${niche && niche.cat === 'Insurance' ? 'Serio, profesional, con autoridad. Citas de fuentes oficiales.' :
  niche && (niche.cat === 'Lifestyle' || niche.cat === 'Health & Wellness') ? 'Cercano, conversacional, empático. Ejemplos de la vida real.' :
  niche && niche.cat === 'Finance & Lending' ? 'Profesional pero accesible. Explicaciones claras sin jerga innecesaria.' :
  niche && niche.cat === 'Technology' ? 'Informativo y actualizado. Datos técnicos precisos.' :
  'Informativo, útil y fácil de leer. Balance entre autoridad y cercanía.'}`;

  return prompt;
}


/* ── Thumbnail Prompt Generator ── */

function generateThumbnailPrompt(result, niche, query) {
  const nicheCat = niche ? niche.cat : 'General';
  const nicheIcon = niche ? niche.icon : '📄';
  
  const styleGuides = {
    'Insurance': 'minimalista profesional, icono de escudo/documento, colores azul marino y dorado, tipografía sans-serif bold, textura limpia, fondo degradado oscuro',
    'Finance & Lending': 'estilo corporativo moderno, gráfico de crecimiento/flecha ascendente, colores verde oscuro y dorado, efecto vidrio, iluminación dramática',
    'Legal': 'serio y profesional, textura de mármol/madera, colores burdeos y dorado, icono de balanza/gavel, composición simétrica',
    'Technology': 'futurista y limpio, tonos azul eléctrico y negro, efecto neón/glow, icono de interfaz/código, partículas digitales',
    'Health & Wellness': 'natural y orgánico, colores verde hoja y blanco, luz natural, composición con espacio negativo, estilo editorial',
    'Marketing & Business': 'moderno y dinámico, colores naranja corporativo y azul, gráfico de crecimiento, tipografía bold',
    'Real Estate': 'elegante y aspiracional, colores gris piedra y dorado, perspectiva amplia, luz natural cálida',
    'Education': 'académico y limpio, colores azul y blanco, icono de graduación/libro, composición clara y ordenada',
    'Crypto & Web3': 'tech-forward con elementos blockchain, colores morado y dorado, efecto digital, iconos de cadena/bloques',
    'Lifestyle': 'vibrante y aspiracional, colores cálidos, composición lifestyle, luz natural, estilo Instagram',
    'Gaming': 'dinámico y energético, colores neón, acción, movimiento, estilo esports',
    'Travel': 'inspirador y aventurero, colores cielo azul y arena, perspectiva de viaje, luz dorada del atardecer'
  };

  const style = styleGuides[nicheCat] || 'limpio y profesional, colores contrastantes, tipografía bold, composición equilibrada';

  return `"${result.title}" — Miniatura para YouTube/redes sociales

  🎨 **Estilo visual:** ${style}
  
  📐 **Composición:**
  - Primer plano llamativo con el concepto principal
  - Elemento sorpresa o curiosidad visual
  - Texto grande y legible (máximo 4-5 palabras) superpuesto
  - Flecha o círculo de atención si aplica
  
  🎯 **Psicología:**
  - Generar curiosidad (no revelar todo)
  - Cara humana con expresión de sorpresa/emoción si aplica
  - Contraste de color fuerte para destacar en el feed
  
  📏 **Dimensiones:** 1280×720px (16:9) para YouTube / 1080×1920px (9:16) para Shorts/Reels`;
}


/* ── Image Prompt Generator ── */

function generateImagePrompts(result, niche, query) {
  const nicheName = niche ? niche.name : (result.keywords && result.keywords[0]) || 'este tema';
  const nicheCat = niche ? niche.cat : 'General';

  const prompts = [
    {
      position: '🔝 Imagen de apertura (Header)',
      placement: 'Después del H2 de introducción',
      prompt: `Fotografía profesional de ${query}, con iluminación natural tipo estudio, composición minimalista, colores suaves y profesionales, fondo desenfocado (bokeh), estilo editorial de alta calidad, 8K, luz natural, profundidad de campo reducida, aspecto premium y aspiracional — para artículo informativo sobre ${nicheName}`,
      alt: `Imagen principal del artículo sobre ${query} — concepto visual profesional`
    },
    {
      position: '📊 Imagen de datos / infografía',
      placement: 'En la sección de beneficios o comparativa',
      prompt: `Infografía moderna y elegante sobre ${query}, con gráficos de barras minimalistas, iconos planos en color dorado sobre fondo oscuro, tipografía sans-serif limpia, estilo de presentación ejecutiva, datos visuales claros, composición ordenada con espacio negativo, aspecto premium — para ilustrar datos y estadísticas del artículo`,
      alt: `Infografía comparativa de ${query} — datos y beneficios visuales`
    },
    {
      position: '🎯 Imagen de cierre / acción',
      placement: 'Antes de la conclusión o CTA',
      prompt: `Escena lifestyle aspiracional relacionada con ${query}, persona feliz y exitosa disfrutando los beneficios, entorno moderno y limpio, luz cálida de atardecer, composición cinematográfica, colores armónicos, estilo fotografía editorial de revista de alta gama, sonrisa genuina, aspecto auténtico y aspiracional — imagen de cierre para artículo motivacional`,
      alt: `Estilo de vida aspiracional relacionado con ${query} — imagen de cierre del artículo`
    }
  ];

  return prompts;
}


/* ── Target Audience Generator ── */

function generateTargetAudience(result, niche, query) {
  const nicheCat = niche ? niche.cat : 'General';

  const audienceProfiles = {
    'Insurance': [
      { persona: 'Jóvenes profesionales 25-40', interest: 'Seguros de vida, salud, auto', painPoint: 'Proteger su patrimonio y familia sin pagar de más' },
      { persona: 'Familias con hijos 30-50', interest: 'Seguros de vida, salud familiar, hogar', painPoint: 'Encontrar cobertura completa a precio accesible' },
      { persona: 'Jubilados 60+', interest: 'Seguros de salud, medicare, vida', painPoint: 'Cobertura médica asequible en la tercera edad' }
    ],
    'Finance & Lending': [
      { persona: 'Profesionales 28-45', interest: 'Préstamos personales, consolidación de deudas', painPoint: 'Deudas con intereses altos que quieren consolidar' },
      { persona: 'Emprendedores 25-40', interest: 'Capital de trabajo, líneas de crédito', painPoint: 'Acceso a financiamiento rápido sin burocrencia' },
      { persona: 'Compradores de vivienda 30-50', interest: 'Hipotecas, refinanciamiento', painPoint: 'Tasas de interés altas y proceso confuso de aprobación' }
    ],
    'Technology': [
      { persona: 'Profesionales IT 25-45', interest: 'SaaS, ciberseguridad, cloud', painPoint: 'Mantenerse actualizado con herramientas que realmente funcionan' },
      { persona: 'Dueños de PYME 35-55', interest: 'Software empresarial, automatización', painPoint: 'Soluciones tecnológicas accesibles para su negocio' },
      { persona: 'Freelancers digitales 22-38', interest: 'Herramientas de productividad, hosting', painPoint: 'Encontrar herramientas confiables a buen precio' }
    ],
    'Health & Wellness': [
      { persona: 'Personas saludables 25-45', interest: 'Nutrición, ejercicio, bienestar', painPoint: 'Información confiable en medio de tanta desinformación' },
      { persona: 'Personas con metas de salud 30-55', interest: 'Pérdida de peso, suplementos', painPoint: 'Resultados reales sin soluciones milagrosas' },
      { persona: 'Padres ocupados 30-45', interest: 'Salud familiar, alimentación', painPoint: 'Equilibrar salud familiar con estilo de vida ocupado' }
    ],
    'Marketing & Business': [
      { persona: 'Emprendedores digitales 22-38', interest: 'SEO, marketing de contenidos', painPoint: 'Generar tráfico y leads sin presupuesto enorme' },
      { persona: 'Dueños de PYME 35-55', interest: 'Marketing digital, email', painPoint: 'Resultados medibles de su inversión en marketing' },
      { persona: 'Freelancers y consultores 25-40', interest: 'Marca personal, captación de clientes', painPoint: 'Conseguir clientes consistentemente' }
    ],
    'Real Estate': [
      { persona: 'Compradores primerizos 25-38', interest: 'Guías de compra, financiamiento', painPoint: 'Navegar el proceso de compra sin ser estafado' },
      { persona: 'Inversionistas 30-55', interest: 'Propiedades de renta, ROI', painPoint: 'Encontrar propiedades con alto potencial de retorno' },
      { persona: 'Vendedores 40-65', interest: 'Home staging, precio de venta', painPoint: 'Vender rápido al mejor precio posible' }
    ],
    'Education': [
      { persona: 'Estudiantes 18-28', interest: 'Cursos online, certificaciones', painPoint: 'Habilidades que mejoren su empleabilidad' },
      { persona: 'Profesionales en transición 28-45', interest: 'Cambio de carrera, upskilling', painPoint: 'Adquirir nuevas habilidades sin dejar de trabajar' },
      { persona: 'Autodidactas 22-60', interest: 'Aprendizaje continuo, MOOCs', painPoint: 'Contenido de calidad que se adapte a su ritmo' }
    ],
    'Lifestyle': [
      { persona: 'Millennials 25-38', interest: 'Recetas, fitness, viajes', painPoint: 'Contenido inspirador y práctico para su estilo de vida' },
      { persona: 'Padres jóvenes 28-40', interest: 'Parenting, recetas familiares', painPoint: 'Ideas rápidas y saludables para toda la familia' },
      { persona: 'Personas health-conscious 22-50', interest: 'Recetas saludables, ejercicio', painPoint: 'Alternativas saludables que sepan bien' }
    ],
    'Travel': [
      { persona: 'Viajeros frecuentes 25-45', interest: 'Hoteles, tips de viaje', painPoint: 'Experiencias auténticas que valgan la pena' },
      { persona: 'Viajeros de presupuesto 20-35', interest: 'Viajes baratos, mochileros', painPoint: 'Viajar más gastando menos' },
      { persona: 'Familias viajeras 30-50', interest: 'Vacaciones familiares, resorts', painPoint: 'Destinos que disfruten todos los miembros de la familia' }
    ]
  };

  const profiles = audienceProfiles[nicheCat] || [
    { persona: 'Lectores interesados 25-55', interest: query, painPoint: 'Información confiable y actualizada sobre ' + query },
    { persona: 'Profesionales del sector 25-50', interest: query + ', tendencias', painPoint: 'Mantenerse al día con las últimas novedades' },
    { persona: 'Principiantes en el tema 18-35', interest: 'Guías y tutoriales de ' + query, painPoint: 'Aprender desde cero sin sentirse abrumado' }
  ];

  const audienceHTML = `
    <div style="font-size:10px;font-weight:600;color:var(--info-bright);text-transform:uppercase;letter-spacing:0.03em;margin-bottom:10px;">🎯 Audiencia Objetivo</div>
    <div style="display:grid;gap:8px;">
      ${profiles.map((p, i) => `
        <div style="background:var(--bg3);border:0.5px solid var(--border);border-radius:var(--radius);padding:10px;">
          <div style="font-size:12px;font-weight:600;color:var(--text2);margin-bottom:2px;">👤 ${p.persona}</div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:4px;">
            <span style="font-size:10px;padding:2px 6px;border-radius:4px;background:rgba(77,171,247,0.1);color:var(--info-bright);">🎯 ${p.interest}</span>
            <span style="font-size:10px;padding:2px 6px;border-radius:4px;background:rgba(224,92,92,0.1);color:var(--danger);">💔 ${p.painPoint}</span>
          </div>
        </div>
      `).join('')}
    </div>
  `;

  return audienceHTML;
}


/* ── Ad Sets Generator ── */

function generateAdSets(result, niche, query, seoTitles) {
  const nicheName = niche ? niche.name : query;
  const nicheCat = niche ? niche.cat : 'General';
  const bestTitle = seoTitles[0].title;

  const adSets = [
    {
      platform: 'Google Ads (Search + Display)',
      icon: '🔍',
      campaigns: [
        {
          name: `Campaña Search: ${query}`,
          objective: 'Tráfico orgánico + leads calificados',
          budget: '$500-2000/mes',
          targeting: `Keywords: "${query}", "${query} guía", "${query} beneficios", "${query} {year}", "mejor ${query}"`,
          adCopy: [
            `📖 ${bestTitle.substring(0, 40)}... → Haz clic aquí`,
            `✅ ${query}: Guía completa ${year}. ¡Entra ahora!`,
            `Descubre todo sobre ${query}. Guía actualizada ${year} →`
          ],
          landingPage: result.url
        },
        {
          name: `Campaña Display: ${nicheCat} Audience`,
          objective: 'Remarketing + awareness',
          budget: '$300-1000/mes',
          targeting: `Audiencias: interesados en ${nicheCat}, competidores, keywords relacionadas`,
          adCopy: [
            `🧠 Aprende sobre ${query} en 5 minutos`,
            `La guía definitiva de ${query} está aquí`,
            `No sabes esto sobre ${query} y deberías`
          ]
        },
        {
          name: `Campaña YouTube: ${query} Video`,
          objective: 'Views + suscriptores',
          budget: '$500-2000/mes',
          targeting: `Audiencias similares a canales de ${nicheCat}, keywords de video`,
          adCopy: [
            `📺 Video completo: ${query} explicado`,
            `La verdad sobre ${query} que nadie te cuenta`
          ]
        }
      ]
    },
    {
      platform: 'Redes Sociales (Meta + TikTok)',
      icon: '📱',
      campaigns: [
        {
          name: `Facebook/IG: ${query} Content`,
          objective: 'Engagement + tráfico al artículo',
          budget: '$300-1500/mes',
          targeting: `Intereses: ${nicheCat}, estilo de vida, educación, lectura`,
          adCopy: [
            `📖 "${bestTitle.substring(0, 35)}..." Lee el artículo completo →`,
            `🔥 ¿Conoces ${query}? Esto te interesa →`,
            `La guía más completa de ${query} en ${year}. Enlace aquí ↓`
          ],
          creativeFormats: 'Carrusel (3-5 slides con tips), Video corto (15-30s), Imagen estática con texto'
        },
        {
          name: `TikTok: ${query} Viral`,
          objective: 'Vistas virales + tráfico',
          budget: '$200-800/mes',
          targeting: `Hashtags: #${query.replace(/[^a-zA-Z0-9]/g, '')} #${nicheCat.replace(/[^a-zA-Z0-9]/g, '')} #tips #${year}`,
          contentIdeas: [
            'Video de 15-30s con el dato más impactante del artículo',
            'Comparativa rápida visual usando split screen',
            'Historia personal conectada con el tema'
          ]
        }
      ]
    },
    {
      platform: 'Content Syndication + Email',
      icon: '📧',
      campaigns: [
        {
          name: `Email Marketing: ${query} Newsletter`,
          objective: 'Lead nurturing + tráfico recurrente',
          budget: '$100-500/mes (herramienta de email)',
          targeting: `Lista de suscriptores segmentada por intereses en ${nicheCat}`,
          emailSequence: [
            'Email 1 — Día 1: "Lo que necesitas saber sobre ${query}" (intro + enlace al artículo)',
            'Email 2 — Día 3: "3 datos clave de ${query}" (data + tabla comparativa)',
            'Email 3 — Día 7: "Guía completa de ${query}" (artículo pilar + silos satélites)'
          ]
        },
        {
          name: `Medium / LinkedIn: ${query} Article`,
          objective: 'Backlinks + autoridad de dominio',
          budget: '$0-200/mes (boost opcional)',
          targeting: `Profesionales y entusiastas de ${nicheCat}`,
          contentIdeas: [
            'Republicar versión resumida del artículo en Medium con enlace al original',
            'Versión profesional en LinkedIn Articles con llamado a la acción',
            'Distribuir en grupos de Facebook/Reddit relevantes al nicho'
          ]
        }
      ]
    }
  ];

  return adSets;
}


/* ── Render Content Modal ── */

function showContentFromNodeModal(result, domain, niche, content) {
  const { seoTitles, articlePrompt, thumbnailPrompt, imagePrompts, targetAudience, adSets } = content;

  const bodyHTML = `
    <div style="font-size:13px;line-height:1.7;">
      <!-- Header -->
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px;padding-bottom:10px;border-bottom:0.5px solid var(--border);">
        <span style="font-size:18px;">${niche ? niche.icon : '📄'}</span>
        <div>
          <span style="font-size:14px;font-weight:600;color:var(--text);">${domain}</span>
          <span style="font-size:11px;color:var(--muted2);margin-left:8px;">${result.title.substring(0, 60)}${result.title.length > 60 ? '…' : ''}</span>
        </div>
      </div>

      <!-- ═══ 1. SEO TITLES ═══ -->
      <div style="background:var(--bg3);border:0.5px solid var(--border);border-radius:var(--radius);padding:12px;margin-bottom:12px;">
        <div style="font-size:10px;font-weight:600;color:var(--accent);text-transform:uppercase;letter-spacing:0.03em;margin-bottom:8px;">🔍 1. Títulos SEO Optimizados (H1)</div>
        ${seoTitles.map((t, i) => `
          <div style="margin-bottom:6px;padding:6px 8px;background:var(--bg2);border-radius:var(--radius);border:0.5px solid var(--border);">
            <div style="font-size:13px;font-weight:600;color:var(--info-bright);">${t.title}</div>
            <div style="display:flex;gap:6px;margin-top:4px;flex-wrap:wrap;">
              <span style="font-size:9px;padding:2px 6px;border-radius:4px;background:rgba(201,169,110,0.1);color:var(--accent);">📐 ${t.angle}</span>
              <span style="font-size:9px;padding:2px 6px;border-radius:4px;background:rgba(76,173,124,0.1);color:var(--success);">💡 ${t.reason}</span>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- ═══ 2. ARTICLE PROMPT ═══ -->
      <div style="background:var(--bg3);border:0.5px solid var(--border);border-radius:var(--radius);padding:12px;margin-bottom:12px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
          <div style="font-size:10px;font-weight:600;color:var(--success-bright);text-transform:uppercase;letter-spacing:0.03em;">📝 2. Prompt para Artículo Completo</div>
          <button class="btn btn-xs btn-ghost" onclick="copyToClipboard(\`${articlePrompt.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`)" style="font-size:9px;">📋 Copiar</button>
        </div>
        <pre style="font-size:11px;font-family:var(--mono);color:var(--text2);background:var(--bg4);padding:10px;border-radius:var(--radius);overflow-x:auto;line-height:1.6;white-space:pre-wrap;max-height:300px;overflow-y:auto;">${articlePrompt.substring(0, 2000)}${articlePrompt.length > 2000 ? '\n\n... (prompt completo en Copilot/Claude)' : ''}</pre>
      </div>

      <!-- ═══ 3. THUMBNAIL ═══ -->
      <div style="background:var(--bg3);border:0.5px solid var(--border);border-radius:var(--radius);padding:12px;margin-bottom:12px;">
        <div style="font-size:10px;font-weight:600;color:var(--danger);text-transform:uppercase;letter-spacing:0.03em;margin-bottom:8px;">🖼️ 3. Prompt de Miniatura (Thumbnail)</div>
        <pre style="font-size:11px;font-family:var(--mono);color:var(--text2);background:var(--bg4);padding:10px;border-radius:var(--radius);line-height:1.6;white-space:pre-wrap;">${thumbnailPrompt}</pre>
        <button class="btn btn-xs btn-ghost" onclick="copyToClipboard(\`${thumbnailPrompt.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`)" style="font-size:9px;margin-top:6px;">📋 Copiar prompt de thumbnail</button>
      </div>

      <!-- ═══ 4. IMAGE PROMPTS ═══ -->
      <div style="background:var(--bg3);border:0.5px solid var(--border);border-radius:var(--radius);padding:12px;margin-bottom:12px;">
        <div style="font-size:10px;font-weight:600;color:var(--purple-bright);text-transform:uppercase;letter-spacing:0.03em;margin-bottom:8px;">🎨 4. Prompts de Imágenes (DALL·E / Midjourney)</div>
        ${imagePrompts.map((img, i) => `
          <div style="margin-bottom:8px;padding:8px 10px;background:var(--bg2);border:0.5px solid var(--border);border-radius:var(--radius);">
            <div style="font-size:11px;font-weight:600;color:var(--text2);margin-bottom:2px;">${img.position}</div>
            <div style="font-size:10px;color:var(--muted2);margin-bottom:4px;">📐 Colocación: ${img.placement}</div>
            <pre style="font-size:10px;font-family:var(--mono);color:var(--muted);background:var(--bg4);padding:6px 8px;border-radius:4px;line-height:1.5;white-space:pre-wrap;">"${img.prompt}"</pre>
            <div style="font-size:9px;color:var(--muted2);margin-top:2px;">🔖 Alt text: ${img.alt}</div>
          </div>
        `).join('')}
      </div>

      <!-- ═══ 5. TARGET AUDIENCE ═══ -->
      <div style="background:var(--bg3);border:0.5px solid var(--border);border-radius:var(--radius);padding:12px;margin-bottom:12px;">
        ${targetAudience}
      </div>

      <!-- ═══ 6. AD SETS ═══ -->
      <div style="background:var(--bg3);border:0.5px solid var(--border);border-radius:var(--radius);padding:12px;margin-bottom:12px;">
        <div style="font-size:10px;font-weight:600;color:var(--accent);text-transform:uppercase;letter-spacing:0.03em;margin-bottom:10px;">📢 6. Sets de Anuncios para Campañas</div>
        ${adSets.map((platform, pi) => `
          <div style="margin-bottom:10px;">
            <div style="font-size:12px;font-weight:600;color:var(--info-bright);margin-bottom:6px;">${platform.icon} ${platform.platform}</div>
            ${platform.campaigns.map(c => `
              <div style="margin-bottom:6px;padding:8px 10px;background:var(--bg2);border:0.5px solid var(--border);border-radius:var(--radius);">
                <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:4px;margin-bottom:4px;">
                  <span style="font-size:11px;font-weight:600;color:var(--text2);">${c.name}</span>
                  <span style="font-size:9px;padding:2px 6px;border-radius:4px;background:rgba(201,169,110,0.1);color:var(--accent);">💰 ${c.budget}</span>
                </div>
                <div style="font-size:10px;color:var(--muted2);margin-bottom:4px;">🎯 ${c.targeting}</div>
                <div style="font-size:10px;color:var(--text2);">
                  <span style="color:var(--muted);">📝 Ads:</span>
                  ${c.adCopy ? c.adCopy.map(a => `<span style="display:block;padding:1px 0;">• "${a}"</span>`).join('') : c.emailSequence ? c.emailSequence.map(e => `<span style="display:block;padding:1px 0;">📧 ${e}</span>`).join('') : c.contentIdeas ? c.contentIdeas.map(ci => `<span style="display:block;padding:1px 0;">🎬 ${ci}</span>`).join('') : ''}
                </div>
              </div>
            `).join('')}
          </div>
        `).join('')}
      </div>
    </div>
  `;

  const footerHTML = `
    <button class="btn btn-sm btn-ghost" onclick="closeModal()">Cerrar</button>
    <button class="btn btn-sm btn-primary" onclick="copyFullContentPackage('${domain.replace(/'/g, "\\'")}')" style="font-size:11px;">📋 Copiar Todo</button>
  `;

  openModal('✍️ Paquete de Contenido: ' + domain, bodyHTML, footerHTML);
}


/* ── Copy Helpers ── */

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showCPCToast('✅ Copiado al portapapeles');
  }).catch(() => {
    showCPCToast('⚠️ No se pudo copiar');
  });
}

function copyFullContentPackage(domain) {
  const results = liveSearchState.results;
  const index = results.findIndex(r => extractDomain(r.url) === domain);
  if (index === -1) {
    showCPCToast('⚠️ No se encontró el nodo');
    return;
  }
  // Build the full content text from the result
  const r = results[index];
  let text = '✏️ PAQUETE DE CONTENIDO: ' + r.title + '\n';
  text += '═'.repeat(60) + '\n\n';
  text += 'Fuente: ' + r.url + '\n';
  text += 'Dominio: ' + domain + '\n';
  text += 'Búsqueda original: ' + (liveSearchState.query || '') + '\n\n';
  
  // SEO Titles
  text += '🔍 1. TÍTULOS SEO (5 opciones)\n';
  const niche = typeof CPC_NICHES !== 'undefined' ? CPC_NICHES.find(n => r.keywords && r.keywords.some(k => k.toLowerCase().includes(n.name.toLowerCase()))) : null;
  const seoTitles = generateSEOTitles(r, niche, liveSearchState.query || '', domain);
  seoTitles.forEach((t, i) => {
    text += '\nOpción ' + (i+1) + ': ' + t.title;
    text += '\n   📐 Ángulo: ' + t.angle;
    text += '\n   💡 Razón: ' + t.reason;
  });
  text += '\n\n';
  
  // Article Prompt
  text += '📝 2. PROMPT DE ARTÍCULO COMPLETO\n';
  text += generateArticlePrompt(r, niche, liveSearchState.query || '', domain, seoTitles);
  text += '\n\n';
  
  // Thumbnail
  text += '🖼️ 3. PROMPT DE THUMBNAIL\n';
  text += generateThumbnailPrompt(r, niche, liveSearchState.query || '');
  text += '\n\n';
  
  // Image Prompts
  text += '🎨 4. PROMPTS DE IMÁGENES (3)\n\n';
  const imagePrompts = generateImagePrompts(r, niche, liveSearchState.query || '');
  imagePrompts.forEach((img, i) => {
    text += 'Imagen ' + (i+1) + ': ' + img.position + '\n';
    text += 'Colocación: ' + img.placement + '\n';
    text += 'Prompt: \"' + img.prompt + '\"\n';
    text += 'Alt text: ' + img.alt + '\n\n';
  });
  
  navigator.clipboard.writeText(text).then(() => {
    showCPCToast('✅ Paquete completo copiado al portapapeles (' + (text.length/1000).toFixed(0) + 'K caracteres)');
  }).catch(() => {
    showCPCToast('⚠️ No se pudo copiar el contenido');
  });
}


/* ══════════════════════════════════════════════
   GUARDAR / HISTORIAL
   ══════════════════════════════════════════════ */

function saveSearchResult(index) {
  const results = liveSearchState.results;
  if (!results || index < 0 || index >= results.length) {
    showCPCToast('⚠️ Resultado no encontrado');
    return;
  }

  const r = results[index];
  const saved = liveSearchState.savedResults;
  
  // Check for duplicates
  const isDuplicate = saved.some(s => s.url === r.url);
  if (isDuplicate) {
    showCPCToast('📚 Este resultado ya está guardado');
    return;
  }

  const domain = extractDomain(r.url);
  const savedItem = {
    id: Date.now(),
    title: r.title,
    url: r.url,
    snippet: r.snippet || '',
    source: r.source || domain,
    domain: domain,
    keywords: r.keywords || [],
    contentAngles: r.contentAngles || [],
    searchQuery: liveSearchState.query,
    savedAt: new Date().toISOString(),
    savedAtLocale: new Date().toLocaleDateString('es-DO', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  };

  saved.unshift(savedItem);
  if (saved.length > 200) saved.pop(); // Max 200
  liveSearchState.savedResults = saved;
  localStorage.setItem('na_live_search_saved', JSON.stringify(saved));

  showCPCToast('✅ Resultado guardado');
}


function showSearchHistory() {
  const saved = liveSearchState.savedResults;
  if (!saved || saved.length === 0) {
    showCPCToast('📚 No hay resultados guardados');
    return;
  }

  // Group by search query
  const groups = {};
  saved.forEach(s => {
    const key = s.searchQuery || 'Sin consulta';
    if (!groups[key]) groups[key] = [];
    groups[key].push(s);
  });

  const groupKeys = Object.keys(groups);
  const total = saved.length;

  const bodyHTML = `
    <div style="font-size:13px;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
        <span style="font-size:11px;color:var(--muted2);">${total} resultados guardados</span>
        <button class="btn btn-xs btn-danger" onclick="if(confirm('¿Borrar todo el historial?')){liveSearchState.savedResults=[];localStorage.setItem('na_live_search_saved','[]');closeModal();showCPCToast('🗑️ Historial limpiado');}" style="font-size:9px;">🗑️ Limpiar todo</button>
      </div>
      ${groupKeys.map(gkey => `
        <div style="margin-bottom:10px;">
          <div style="font-size:10px;font-weight:600;color:var(--accent);text-transform:uppercase;letter-spacing:0.03em;padding:4px 0;margin-bottom:4px;">
            🔍 "${gkey}" (${groups[gkey].length})
          </div>
          ${groups[gkey].map((s, i) => {
            const kwTags = (s.keywords || []).slice(0, 3).map(k => `<span style="font-size:8px;padding:1px 4px;border-radius:3px;background:rgba(201,169,110,0.08);color:var(--accent);">${k}</span>`).join('');
            return `
              <div style="background:var(--bg3);border:0.5px solid var(--border);border-radius:var(--radius);padding:8px 10px;margin-bottom:4px;"
                onclick="closeModal();document.getElementById('ls-input').value='${s.searchQuery || ''}';runLiveSearch();setTimeout(()=>{showCPCToast('📂 Cargando: ${s.title.replace(/'/g, '')}');},300)">
                <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;">
                  <div style="flex:1;min-width:0;">
                    <div style="font-size:12px;font-weight:500;color:var(--info-bright);cursor:pointer;">${s.title}</div>
                    <div style="font-size:10px;color:var(--muted2);">🔗 ${s.domain || s.source}</div>
                    <div style="font-size:10px;color:var(--muted2);margin-top:2px;">${(s.snippet || '').substring(0, 120)}${s.snippet && s.snippet.length > 120 ? '…' : ''}</div>
                    <div style="margin-top:3px;display:flex;gap:3px;flex-wrap:wrap;">${kwTags}</div>
                  </div>
                  <div style="font-size:9px;color:var(--muted2);white-space:nowrap;flex-shrink:0;">
                    <div>${s.savedAtLocale || ''}</div>
                    <button class="btn btn-xs btn-ghost" onclick="event.stopPropagation();removeSavedResult(${s.id})" style="font-size:9px;color:var(--danger);padding:1px 4px;margin-top:4px;" title="Eliminar">✕</button>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `).join('')}
    </div>
  `;

  openModal('📚 Historial de Búsquedas Guardadas', bodyHTML, `
    <button class="btn btn-sm btn-ghost" onclick="closeModal()">Cerrar</button>
  `);
}

function removeSavedResult(id) {
  liveSearchState.savedResults = liveSearchState.savedResults.filter(s => s.id !== id);
  localStorage.setItem('na_live_search_saved', JSON.stringify(liveSearchState.savedResults));
  showSearchHistory(); // Re-render
}


console.log('✍️ CPC Content Engine v1.0 loaded');
