/* ══════════════════════════════════════════════
   NUCLEAR AIMA — SEO CONTENT GENERATOR v1.0
   Generador Automático de Contenido SEO
   Títulos · H2 · H3 · Párrafos · FAQ · Meta · Imágenes
   La bestia más poderosa del universo 🔥
   ══════════════════════════════════════════════ */

/* ══════════════════════════════════════════════
   STATE
   ══════════════════════════════════════════════ */

let seoGenState = {
  activeNiche: null,
  generatedContent: null,
  contentLength: 'standard', // 'quick' | 'standard' | 'comprehensive'
  tone: 'professional',      // 'professional' | 'conversational' | 'authoritative'
  includeSchema: true,
  includeImages: true,
  includeInternalLinks: true,
  includeFAQs: true,
  generatedHistory: JSON.parse(localStorage.getItem('na_seo_history') || '[]'),
};

/* ── Content Templates ── */

const CONTENT_TEMPLATES = {
  intro: [
    'When it comes to {nicheName}, making the right choice can feel overwhelming. With so many options available, it\'s crucial to understand what really matters before you decide. In this comprehensive guide, we\'ll walk you through everything you need to know about {nicheName} in {year}.',
    'Are you looking for the best {nicheName} options in {year}? You\'ve come to the right place. Whether you\'re a complete beginner or looking to optimize your current strategy, this guide covers {keywords} and everything in between.',
    'Navigating the world of {nicheName} doesn\'t have to be complicated. In fact, with the right information at your fingertips, you can make confident decisions that save you time, money, and stress. Let\'s dive into what {nicheName} really means for you.',
    'The {nicheName} landscape has changed dramatically in recent years. New options, evolving regulations, and shifting consumer expectations mean that what worked before might not work today. This updated guide for {year} reflects the latest trends and data.',
    'If you\'re searching for reliable information about {nicheName}, you\'re not alone. Thousands of people research {keywords} every month. This guide consolidates expert insights, data, and practical tips to help you navigate your options with confidence.',
  ],
  section1: [
    'Understanding the Basics of {nicheName}',
    'Why {nicheName} Matters More Than Ever in {year}',
    'What Is {nicheName} and Why Should You Care?',
    'The Evolution of {nicheName}: A {year} Perspective',
    'Key Factors That Define {nicheName} Today',
  ],
  section2: [
    'Top {nicheName} Strategies That Actually Work',
    'How to Choose the Right {nicheName} for Your Needs',
    'The Complete {nicheName} Checklist for Beginners',
    'Expert Tips for Maximizing Your {nicheName} Results',
    'Common {nicheName} Mistakes and How to Avoid Them',
  ],
  section3: [
    'Comparing {nicheName} Options: What Sets Them Apart',
    '{nicheName} Pricing: What to Expect and How to Budget',
    'The Pros and Cons of Different {nicheName} Approaches',
    '{nicheName} Trends to Watch in {year} and Beyond',
    'Real {nicheName} Success Stories: Lessons Learned',
  ],
  section4: [
    'Advanced {nicheName} Techniques for Experienced Users',
    '{nicheName} Optimization: Getting the Best Possible Results',
    'The Science Behind Effective {nicheName} Strategies',
    'How to Combine {nicheName} with Other Approaches for Maximum Impact',
    '{nicheName} Case Studies: What the Data Shows',
  ],
  conclusion: [
    'Ready to take the next step with {nicheName}? The key is to start with a clear understanding of your goals, research your options thoroughly, and make informed decisions based on your unique situation. Remember, the best {nicheName} choice is the one that aligns with your specific needs and circumstances.',
    'Whether you\'re just starting out or looking to refine your approach, the principles outlined in this guide will help you navigate {nicheName} with confidence. Take action today and see the difference that informed decision-making can make.',
    'The world of {nicheName} is full of opportunities for those who take the time to understand it. With the strategies and insights shared in this guide, you\'re now equipped to make smarter choices and achieve better outcomes.',
    'Don\'t let analysis paralysis hold you back. Use the information in this guide as your roadmap, take measured steps, and adjust as you go. The journey to mastering {nicheName} starts with that first informed decision.',
  ],
  faqs: [
    { q: 'What is the best {nicheName} option for beginners?', a: 'For beginners, the best approach to {nicheName} typically involves starting with a clear understanding of your goals and budget. Research top-rated options, read reviews from verified users, and consider starting with a trial or basic plan before committing to a premium solution. Most experts recommend comparing at least 3-5 options before making a decision.' },
    { q: 'How much does {nicheName} typically cost in {year}?', a: 'The cost of {nicheName} varies widely depending on your specific needs and the provider you choose. Based on current market data, you can expect to invest anywhere from {cpcLow} to {cpcHigh} per unit for quality options. Factors that influence pricing include features, level of support, customization options, and contract length. Always request detailed quotes from multiple providers.' },
    { q: 'How long does it take to see results with {nicheName}?', a: 'Results with {nicheName} depend on several factors including your specific goals, the strategy you implement, and your level of commitment. Many users report seeing initial results within 3-6 months, while more significant outcomes typically materialize within 6-12 months. Consistency and ongoing optimization are key to maximizing your results.' },
    { q: 'What are the most common {nicheName} mistakes to avoid?', a: 'The most common mistakes in {nicheName} include: not doing enough research, choosing based solely on price, ignoring fine print and terms, failing to compare multiple options, and not reassessing your choice periodically. Taking the time to thoroughly evaluate your options upfront can save you significant time and money in the long run.' },
    { q: 'Can I combine different {nicheName} strategies?', a: 'Absolutely! In fact, combining different {nicheName} strategies often produces the best results. A hybrid approach allows you to leverage the strengths of multiple options while mitigating their individual weaknesses. Just make sure the strategies you combine are compatible and aligned with your overall goals. Consult with an expert if you\'re unsure about compatibility.' },
    { q: 'Is {nicheName} worth the investment in {year}?', a: 'For most people and businesses, {nicheName} offers a strong return on investment when implemented correctly. The key is to choose the right option for your specific needs, implement it properly, and monitor your results to optimize over time. Based on current market analysis, the potential benefits of {nicheName} far outweigh the costs for those who approach it strategically.' },
    { q: 'How do I find the best {nicheName} provider?', a: 'To find the best {nicheName} provider, start by clearly defining your needs and budget. Research providers thoroughly by reading independent reviews, checking their reputation, and comparing features and pricing. Request demos or trials when available, and don\'t hesitate to ask for references. The right provider will be transparent about their offerings and align with your specific goals.' },
    { q: 'What should I look for in a {nicheName} review?', a: 'When reading {nicheName} reviews, look for detailed, specific feedback rather than general praise or complaints. Pay attention to comments about customer support, reliability, ease of use, and value for money. Verified reviews from users with similar needs to yours are particularly valuable. Be wary of reviews that seem overly promotional or lack specifics.' },
    { q: 'Can {nicheName} help me save money in the long run?', a: 'Yes, when chosen and implemented correctly, {nicheName} can lead to significant long-term savings. By optimizing your approach and avoiding common pitfalls, you can reduce waste, improve efficiency, and achieve better outcomes. The initial investment in quality {nicheName} often pays for itself multiple times over through improved results and reduced costs.' },
    { q: 'What are the latest {nicheName} trends for {year}?', a: 'Current trends in {nicheName} include increased personalization, AI-powered solutions, greater transparency in pricing, and a shift toward more flexible, customer-centric models. Staying informed about these trends can help you make more strategic decisions and take advantage of new opportunities as they emerge.' },
  ],
};

/* ══════════════════════════════════════════════
   MAIN RENDER FUNCTION
   ══════════════════════════════════════════════ */

function renderSEOGenerator() {
  const container = document.getElementById('cpc-tab-content') || document.getElementById('cpc-container');
  if (!container) return;

  const niches = typeof CPC_NICHES !== 'undefined' ? CPC_NICHES : [];
  const hasContent = seoGenState.generatedContent !== null;
  const historyCount = seoGenState.generatedHistory.length;

  container.innerHTML = `
    <!-- ═══ HEADER ═══ -->
    <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:12px;margin-bottom:14px;">
      <div>
        <h2 style="font-size:20px;font-weight:600;margin-bottom:2px;">✍️ SEO Content Generator</h2>
        <p style="font-size:12px;color:var(--muted);">
          Generador automático de contenido SEO · Títulos · H2 · H3 · Párrafos · FAQ · Meta
          ${historyCount > 0 ? `· 📋 ${historyCount} generados` : ''}
        </p>
      </div>
      <div style="display:flex;gap:6px;flex-wrap:wrap;">
        <button class="btn btn-sm btn-ghost" onclick="showSEOHistory()" style="font-size:10px;">📋 Historial (${historyCount})</button>
        <button class="btn btn-sm btn-ghost" onclick="exportSEOCurrent()" style="font-size:10px;">📥 Export</button>
      </div>
    </div>

    <!-- ═══ CONTROLS ═══ -->
    <div style="background:var(--bg2);border:0.5px solid var(--border);border-radius:var(--radius2);padding:14px;margin-bottom:14px;">
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr auto;gap:10px;align-items:end;flex-wrap:wrap;">
        <!-- Niche Selector -->
        <div>
          <label style="font-size:9px;color:var(--muted2);text-transform:uppercase;display:block;margin-bottom:4px;">🎯 Nicho</label>
          <select id="seo-niche-select" onchange="seoGenState.activeNiche=this.value"
            style="width:100%;background:var(--bg3);border:0.5px solid var(--border);border-radius:8px;padding:8px 10px;color:var(--text);font-size:12px;font-family:var(--font);outline:none;cursor:pointer;">
            <option value="">Selecciona un nicho...</option>
            ${niches.map(n => `
              <option value="${n.id}" ${seoGenState.activeNiche === n.id ? 'selected' : ''}>${n.icon || '📁'} ${n.name} (${n.cat})</option>
            `).join('')}
          </select>
        </div>
        <!-- Length -->
        <div>
          <label style="font-size:9px;color:var(--muted2);text-transform:uppercase;display:block;margin-bottom:4px;">📏 Extensión</label>
          <select id="seo-length-select" onchange="seoGenState.contentLength=this.value"
            style="width:100%;background:var(--bg3);border:0.5px solid var(--border);border-radius:8px;padding:8px 10px;color:var(--text);font-size:12px;font-family:var(--font);outline:none;cursor:pointer;">
            <option value="quick" ${seoGenState.contentLength === 'quick' ? 'selected' : ''}>⚡ Rápido (800-1000w)</option>
            <option value="standard" ${seoGenState.contentLength === 'standard' ? 'selected' : ''}>📄 Estándar (1500-2000w)</option>
            <option value="comprehensive" ${seoGenState.contentLength === 'comprehensive' ? 'selected' : ''}>📚 Completo (2500-3500w)</option>
          </select>
        </div>
        <!-- Tone -->
        <div>
          <label style="font-size:9px;color:var(--muted2);text-transform:uppercase;display:block;margin-bottom:4px;">🎭 Tono</label>
          <select id="seo-tone-select" onchange="seoGenState.tone=this.value"
            style="width:100%;background:var(--bg3);border:0.5px solid var(--border);border-radius:8px;padding:8px 10px;color:var(--text);font-size:12px;font-family:var(--font);outline:none;cursor:pointer;">
            <option value="professional" ${seoGenState.tone === 'professional' ? 'selected' : ''}>💼 Profesional</option>
            <option value="conversational" ${seoGenState.tone === 'conversational' ? 'selected' : ''}>🗣️ Conversacional</option>
            <option value="authoritative" ${seoGenState.tone === 'authoritative' ? 'selected' : ''}>📢 Autoritario</option>
          </select>
        </div>
        <!-- Schema toggle -->
        <div>
          <label style="font-size:9px;color:var(--muted2);text-transform:uppercase;display:block;margin-bottom:4px;">⚙️ Opciones</label>
          <div style="display:flex;gap:6px;align-items:center;">
            <label style="font-size:10px;color:var(--muted);cursor:pointer;display:flex;align-items:center;gap:4px;">
              <input type="checkbox" id="seo-schema-toggle" ${seoGenState.includeSchema ? 'checked' : ''} onchange="seoGenState.includeSchema=this.checked" style="accent-color:var(--accent);"> Schema
            </label>
            <label style="font-size:10px;color:var(--muted);cursor:pointer;display:flex;align-items:center;gap:4px;">
              <input type="checkbox" id="seo-faq-toggle" ${seoGenState.includeFAQs ? 'checked' : ''} onchange="seoGenState.includeFAQs=this.checked" style="accent-color:var(--accent);"> FAQ
            </label>
          </div>
        </div>
        <!-- Generate Button -->
        <div style="align-self:flex-end;">
          <button class="btn btn-primary" onclick="generateSEOContent()" id="seo-generate-btn" style="font-size:13px;padding:9px 20px;white-space:nowrap;">
            ✨ Generar Contenido
          </button>
        </div>
      </div>
    </div>

    <!-- ═══ CONTENT OUTPUT ═══ -->
    <div id="seo-content-output">
      ${hasContent ? '<div id="seo-content-render"></div>' : `
        <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:60px 20px;text-align:center;">
          <div style="font-size:48px;margin-bottom:16px;">✍️</div>
          <div style="font-size:16px;font-weight:500;color:var(--text2);margin-bottom:8px;">Generador de Contenido SEO Listo</div>
          <div style="font-size:12px;color:var(--muted2);max-width:400px;line-height:1.6;">
            Selecciona un nicho, ajusta las opciones y haz clic en <strong style="color:var(--accent);">✨ Generar Contenido</strong> para crear un artículo SEO optimizado con títulos, H2, H3, párrafos, meta description, FAQ Schema y más.
          </div>
        </div>
      `}
    </div>
  `;

  if (hasContent) {
    renderSEOContent();
  }
}

/* ══════════════════════════════════════════════
   CONTENT GENERATION ENGINE
   ══════════════════════════════════════════════ */

function generateSEOContent() {
  const nicheId = document.getElementById('seo-niche-select')?.value || seoGenState.activeNiche;
  if (!nicheId) {
    showSEOToast('⚠️ Selecciona un nicho primero');
    return;
  }

  const niches = typeof CPC_NICHES !== 'undefined' ? CPC_NICHES : [];
  const niche = niches.find(n => n.id === nicheId);
  if (!niche) {
    showSEOToast('⚠️ Nicho no encontrado');
    return;
  }

  seoGenState.activeNiche = nicheId;

  const btn = document.getElementById('seo-generate-btn');
  if (btn) { btn.textContent = '⏳ Generando...'; btn.disabled = true; }

  const output = document.getElementById('seo-content-output');
  if (output) {
    output.innerHTML = `<div style="text-align:center;padding:40px;">
      <div style="font-size:24px;margin-bottom:10px;">⏳</div>
      <div style="font-size:13px;color:var(--muted);">Generando contenido SEO optimizado para <strong style="color:var(--accent);">${niche.name}</strong>...</div>
      <div style="margin:16px auto;width:200px;height:4px;background:var(--bg4);border-radius:2px;overflow:hidden;">
        <div id="seo-progress-bar" style="height:100%;width:0%;background:linear-gradient(90deg,var(--accent),var(--info-bright));border-radius:2px;transition:width 0.5s;"></div>
      </div>
    </div>`;
  }

  // Simulate progressive generation
  setTimeout(() => {
    const bar = document.getElementById('seo-progress-bar');
    if (bar) bar.style.width = '30%';
  }, 200);

  setTimeout(() => {
    const bar = document.getElementById('seo-progress-bar');
    if (bar) bar.style.width = '60%';
  }, 500);

  setTimeout(() => {
    const bar = document.getElementById('seo-progress-bar');
    if (bar) bar.style.width = '85%';
  }, 800);

  setTimeout(() => {
    const content = buildSEOContent(niche);
    seoGenState.generatedContent = content;

    // Save to history
    seoGenState.generatedHistory.unshift({
      id: Date.now(),
      nicheId: niche.id,
      nicheName: niche.name,
      nicheIcon: niche.icon || '📁',
      title: content.title,
      length: seoGenState.contentLength,
      tone: seoGenState.tone,
      timestamp: Date.now(),
      wordCount: content.wordCount,
    });
    if (seoGenState.generatedHistory.length > 20) seoGenState.generatedHistory.pop();
    localStorage.setItem('na_seo_history', JSON.stringify(seoGenState.generatedHistory));

    if (output) {
      output.innerHTML = '<div id="seo-content-render"></div>';
    }
    renderSEOContent();

    if (btn) { btn.textContent = '✨ Generar Contenido'; btn.disabled = false; }
    showSEOToast(`✅ Artículo generado para ${niche.name} (${content.wordCount} palabras)`);
  }, 1200);
}

/* ══════════════════════════════════════════════
   CONTENT BUILDER
   ══════════════════════════════════════════════ */

function buildSEOContent(niche) {
  const year = new Date().getFullYear();
  const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const pick = (arr, count) => {
    const shuffled = [...arr].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  };

  const keywordList = niche.keywords.split(', ').filter(Boolean);
  const angleList = niche.contentAngles.split(', ').filter(Boolean);
  const cpcAvg = ((niche.adsenseCPCLow || 0) + (niche.adsenseCPCHigh || 0)) / 2;

  const templates = CONTENT_TEMPLATES;
  const vars = {
    nicheName: niche.name,
    year,
    keywords: keywordList.slice(0, 3).join(', '),
    cpcLow: niche.adsenseCPCLow || 0,
    cpcHigh: niche.adsenseCPCHigh || 0,
  };

  const fill = (text) => {
    return text.replace(/\{nicheName\}/g, vars.nicheName)
      .replace(/\{year\}/g, vars.year)
      .replace(/\{keywords\}/g, vars.keywords)
      .replace(/\{cpcLow\}/g, vars.cpcLow)
      .replace(/\{cpcHigh\}/g, vars.cpcHigh);
  };

  const lengthConfig = {
    quick: { sections: 2, paragraphsPerSection: 2, faqCount: 3, imageCount: 2 },
    standard: { sections: 3, paragraphsPerSection: 3, faqCount: 5, imageCount: 3 },
    comprehensive: { sections: 4, paragraphsPerSection: 4, faqCount: 7, imageCount: 4 },
  };

  const config = lengthConfig[seoGenState.contentLength] || lengthConfig.standard;

  // ── SEO Title ──
  const titlePatterns = [
    `The Ultimate Guide to ${niche.name} in ${year}`,
    `${niche.name}: Everything You Need to Know in ${year}`,
    `Best ${niche.name} Options for ${year} — Complete Comparison Guide`,
    `${niche.name} for Beginners: A Step-by-Step Guide to Getting Started`,
    `Top ${niche.name} Strategies That Actually Work in ${year}`,
    `${niche.name} ${year}: Expert Tips, Costs & Best Practices`,
    `How to Choose the Right ${niche.name} for Your Needs in ${year}`,
    `${niche.name} ${year}: The Complete Resource Guide`,
  ];
  const title = fill(rand(titlePatterns));

  // ── Meta Description ──
  const metaPatterns = [
    `Looking for the best ${niche.name} options in ${year}? Our comprehensive guide covers ${keywordList.slice(0, 2).join(', ')}, expert tips, costs, and everything you need to make an informed decision.`,
    `Discover everything about ${niche.name} in ${year}. From ${keywordList[0] || 'basics'} to advanced strategies, this guide has you covered with expert insights and practical advice.`,
    `Complete guide to ${niche.name} ${year}. Learn about ${keywordList.slice(0, 3).join(', ')}, compare options, avoid common mistakes, and find the perfect solution for your needs.`,
    `Your ${niche.name} resource for ${year}. Expert tips, cost breakdowns, pros and cons, and step-by-step guidance to help you navigate ${niche.name} with confidence.`,
  ];
  const metaDescription = fill(rand(metaPatterns));

  // ── Sections ──
  const sectionHeadings = [
    fill(rand(templates.section1)),
    fill(rand(templates.section2)),
    fill(rand(templates.section3)),
    fill(rand(templates.section4)),
  ];

  const subHeadingTemplates = [
    ['What You Need to Know Before Getting Started', 'Key Benefits of {nicheName}', 'How {nicheName} Has Changed in {year}'],
    ['Step 1: Assess Your Needs', 'Step 2: Research Your Options', 'Step 3: Make Your Decision'],
    ['Option A vs Option B: Which Is Better?', 'Budget-Friendly {nicheName} Solutions', 'Premium {nicheName} Features Worth Paying For'],
    ['Expert-Level {nicheName} Strategies', 'Measuring Your {nicheName} Success', 'Taking Your {nicheName} to the Next Level'],
  ];

  const paragraphGenerators = [
    [
      `When evaluating ${niche.name}, there are several critical factors to consider. First, think about your specific needs and goals — what works for one person may not work for another. ${niche.cat || 'This niche'} requires careful consideration of ${keywordList.slice(0, 2).join(' and ')} to find the optimal solution. Take the time to research thoroughly before making a commitment.`,
      `The ${niche.name} industry has seen significant evolution in recent years. New technologies, changing consumer expectations, and innovative business models have transformed the landscape. In ${year}, staying informed about these changes is more important than ever for making smart decisions.`,
      `One of the most important aspects of ${niche.name} is understanding how it fits into your broader strategy. Whether you're an individual looking for personal solutions or a business seeking to optimize operations, the right approach can make a substantial difference in outcomes.`,
      `Industry data shows that ${niche.name} continues to grow in importance. With ${keywordList[0] || 'key metrics'} driving demand, now is an excellent time to evaluate your options and ensure you're making the most of what's available in ${year}.`,
    ],
    [
      `Getting started with ${niche.name} doesn't have to be complicated. The key is to break down the process into manageable steps and focus on what matters most for your specific situation. Begin by clearly defining what you want to achieve, then work backward to identify the best path forward.`,
      `When comparing different ${niche.name} options, look beyond just the price tag. Consider factors like customer support quality, ease of implementation, scalability, and long-term value. A slightly higher upfront investment often pays dividends in the form of better results and fewer headaches down the line.`,
      `Common mistakes in ${niche.name} include rushing into decisions without proper research, focusing too much on price at the expense of quality, and failing to reassess choices periodically. By being aware of these pitfalls, you can avoid them and make more informed decisions.`,
      `Successful ${niche.name} strategies share several common elements: thorough research, clear goal-setting, ongoing monitoring, and willingness to adapt. By incorporating these elements into your approach, you can dramatically improve your chances of achieving your desired outcomes.`,
    ],
    [
      `When it comes to cost, ${niche.name} options range from budget-friendly to premium. The right choice depends on your specific needs, budget, and long-term goals. Generally, investing in quality ${niche.name} solutions pays for itself through better results and reduced issues over time.`,
      `Comparing ${niche.name} providers requires looking at multiple dimensions: features, pricing, customer support, reputation, and track record. Create a weighted scorecard based on what matters most to you, and evaluate each option against these criteria for an objective comparison.`,
      `The ${niche.name} market in ${year} offers more choices than ever before. This abundance of options is great for consumers but can also lead to decision paralysis. The key is to narrow down your options based on your must-have criteria before diving into detailed comparisons.`,
      `Real-world examples and case studies can provide valuable insights into what works in ${niche.name}. Look for examples that match your specific situation and goals, as these will be most relevant to your decision-making process.`,
    ],
    [
      `For those already familiar with ${niche.name} basics, advanced techniques can unlock even better results. These might include optimizing your approach based on data analytics, leveraging automation tools, or combining multiple strategies for synergistic effects.`,
      `Measuring success in ${niche.name} requires tracking the right metrics. What gets measured gets managed, so establish clear KPIs from the start and monitor them regularly. Use data to guide your decisions and make adjustments as needed.`,
      `The future of ${niche.name} looks promising, with continued innovation and improvement expected. Staying ahead of the curve means keeping up with industry trends, being willing to adapt, and continuously learning from both successes and failures.`,
      `${niche.name} experts recommend taking a long-term view rather than looking for quick fixes. Sustainable success comes from consistent effort, ongoing optimization, and a willingness to invest in quality solutions that deliver lasting value.`,
    ],
  ];

  const toneModifiers = {
    professional: { prefix: '', suffix: '' },
    conversational: { prefix: 'Here\'s the thing: ', suffix: ' And honestly, that\'s what makes all the difference.' },
    authoritative: { prefix: 'Industry experts agree: ', suffix: ' This is non-negotiable for optimal results.' },
  };

  const tone = toneModifiers[seoGenState.tone] || toneModifiers.professional;

  const sections = [];
  const usedHeadings = new Set();

  for (let i = 0; i < config.sections; i++) {
    const h2 = sectionHeadings[i];
    usedHeadings.add(h2);

    const subHeadings = subHeadingTemplates[i] || [];
    const paragraphs = paragraphGenerators[i] || [];
    const subItems = [];

    const subCount = Math.min(config.paragraphsPerSection, subHeadings.length);
    for (let j = 0; j < subCount; j++) {
      const sh = fill(subHeadings[j] || subHeadings[0]);
      if (!usedHeadings.has(sh)) {
        usedHeadings.add(sh);
        const paraCount = Math.min(2, paragraphs.length);
        const selectedParas = pick(paragraphs, paraCount);
        subItems.push({
          h3: sh,
          paragraphs: selectedParas.map(p => tone.prefix + fill(p) + tone.suffix),
        });
      }
    }

    sections.push({ h2, subItems });
  }

  // ── Conclusion ──
  const conclusion = fill(rand(templates.conclusion));

  // ── FAQ Schema ──
  const allFaqs = templates.faqs.map(f => ({
    q: fill(f.q),
    a: fill(f.a),
  }));
  const selectedFaqs = pick(allFaqs, config.faqCount);

  // ── Image prompts ──
  const imagePromptsList = niche.imagePrompts ? niche.imagePrompts.split(', ').map(s => s.trim()).filter(Boolean) : [];
  const imageAltTexts = [
    `${niche.name} overview diagram showing key components and relationships`,
    `Comparison chart of top ${niche.name} options and features in ${year}`,
    `Step-by-step infographic for navigating ${niche.name} decisions`,
    `${niche.name} statistics and data visualization for ${year}`,
    `${niche.name} expert guide featured image with key insights`,
  ];
  const selectedImages = pick(imageAltTexts, config.imageCount);

  // ── Internal links ──
  const internalLinks = [
    { text: `Complete Guide to ${niche.cat || niche.name}`, href: `/${niche.id}-guide` },
    { text: `Best ${niche.name} Options Compared`, href: `/${niche.id}-comparison` },
    { text: `${niche.name} FAQ: Common Questions Answered`, href: `/${niche.id}-faq` },
    { text: `Latest ${niche.name} Trends in ${year}`, href: `/${niche.id}-trends` },
  ];
  const selectedLinks = pick(internalLinks, config.sections);

  // ── Word count estimate ──
  let wordCount = 50; // title + meta
  sections.forEach(s => {
    wordCount += s.h2.split(' ').length + 5;
    s.subItems.forEach(si => {
      wordCount += si.h3.split(' ').length + 5;
      si.paragraphs.forEach(p => wordCount += p.split(' ').length);
    });
  });
  wordCount += conclusion.split(' ').length;
  wordCount += selectedFaqs.length * 50;
  wordCount += selectedImages.length * 5;

  // ── Related keywords (LSI) ──
  const lsiKeywords = generateLSIKeywords(niche);

  return {
    nicheId: niche.id,
    nicheName: niche.name,
    nicheIcon: niche.icon || '📁',
    cat: niche.cat || '',
    title,
    metaDescription,
    sections,
    conclusion,
    faqs: selectedFaqs,
    images: selectedImages,
    internalLinks: selectedLinks,
    keywords: keywordList,
    lsiKeywords,
    wordCount,
    tone: seoGenState.tone,
    length: seoGenState.contentLength,
    hasSchema: seoGenState.includeSchema,
    hasFAQ: seoGenState.includeFAQs,
    cpcAvg,
    generatedAt: new Date().toISOString(),
  };
}

/* ══════════════════════════════════════════════
   LSI KEYWORD GENERATOR
   ══════════════════════════════════════════════ */

function generateLSIKeywords(niche) {
  const angleWords = (niche.contentAngles || '').split(', ').map(s => s.trim()).filter(Boolean);
  const keywordWords = (niche.keywords || '').split(', ').map(s => s.trim()).filter(Boolean);

  const lsiBases = [
    `${niche.name} tips`,
    `${niche.name} guide`,
    `${niche.name} benefits`,
    `${niche.name} review`,
    `best ${niche.name}`,
    `${niche.name} cost`,
    `${niche.name} comparison`,
    `${niche.name} for beginners`,
    `${niche.name} expert advice`,
    `${niche.name} 2026`,
    `how to choose ${niche.name}`,
    `${niche.name} FAQ`,
  ];

  const angleLSI = angleWords.map(a => `${niche.name} ${a.split(' ').slice(0, 2).join(' ')}`).filter(Boolean);
  const kwLSI = keywordWords.map(k => `${k} ${niche.name}`);
  const categoryLSI = niche.cat ? [`${niche.cat.toLowerCase()} ${niche.name.toLowerCase()}`, `${niche.name} in ${niche.cat}`] : [];

  const allLSI = [...new Set([...lsiBases, ...angleLSI, ...kwLSI, ...categoryLSI])].filter(Boolean);
  return allLSI.slice(0, 15);
}

/* ══════════════════════════════════════════════
   RENDER GENERATED CONTENT
   ══════════════════════════════════════════════ */

function renderSEOContent() {
  const container = document.getElementById('seo-content-render');
  if (!container || !seoGenState.generatedContent) return;

  const c = seoGenState.generatedContent;
  const toneColors = { professional: 'var(--info-bright)', conversational: 'var(--accent)', authoritative: 'var(--danger)' };
  const lengthLabels = { quick: '⚡ Rápido', standard: '📄 Estándar', comprehensive: '📚 Completo' };

  container.innerHTML = `
    <!-- ═══ ARTICLE PREVIEW HEADER ═══ -->
    <div style="background:linear-gradient(135deg,var(--bg3),var(--bg2));border:0.5px solid var(--border);border-radius:var(--radius2);padding:18px;margin-bottom:16px;">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:10px;margin-bottom:12px;">
        <div>
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
            <span style="font-size:18px;">${c.nicheIcon}</span>
            <span style="font-size:11px;color:var(--muted2);">${c.cat}</span>
            <span style="font-size:9px;padding:2px 8px;border-radius:4px;background:rgba(201,169,110,0.1);color:var(--accent);">${lengthLabels[c.length] || '📄 Estándar'}</span>
            <span style="font-size:9px;padding:2px 8px;border-radius:4px;background:rgba(${c.tone === 'professional' ? '77,171,247' : c.tone === 'conversational' ? '201,169,110' : '224,92,92'},0.1);color:${toneColors[c.tone] || 'var(--info-bright)'};">${c.tone}</span>
          </div>
          <div style="font-size:10px;color:var(--muted2);">${c.wordCount} palabras estimadas · ${c.sections.length} secciones · ${c.faqs.length} FAQs</div>
        </div>
        <div style="display:flex;gap:6px;">
          <button class="btn btn-xs btn-ghost" onclick="copySEOContent()" style="font-size:9px;">📋 Copiar Todo</button>
          <button class="btn btn-xs btn-ghost" onclick="copySEOHTML()" style="font-size:9px;">🔣 Copiar HTML</button>
          <button class="btn btn-xs btn-primary" onclick="showSEOPreview()" style="font-size:9px;">👁️ Vista Previa</button>
        </div>
      </div>

      <!-- Word count bar -->
      <div style="display:flex;align-items:center;gap:10px;">
        <div style="flex:1;height:4px;background:var(--bg4);border-radius:2px;overflow:hidden;">
          <div style="height:100%;width:${Math.min(100, (c.wordCount / 3500) * 100)}%;background:linear-gradient(90deg,var(--success),var(--accent));border-radius:2px;"></div>
        </div>
        <span style="font-size:10px;font-family:var(--mono);color:var(--muted);">${c.wordCount} / 3500 palabras</span>
      </div>
    </div>

    <!-- ═══ SEO TITLE & META ═══ -->
    <div style="background:var(--bg3);border:0.5px solid var(--border);border-radius:var(--radius);padding:14px;margin-bottom:14px;">
      <div style="font-size:9px;color:var(--muted2);text-transform:uppercase;letter-spacing:0.03em;margin-bottom:6px;">🔍 SEO Title (H1)</div>
      <div style="font-size:18px;font-weight:600;color:var(--text);line-height:1.3;margin-bottom:10px;">${c.title}</div>
      <div style="font-size:9px;color:var(--muted2);text-transform:uppercase;letter-spacing:0.03em;margin-bottom:4px;">📝 Meta Description</div>
      <div style="font-size:13px;color:var(--text2);line-height:1.5;background:var(--bg4);padding:8px 12px;border-radius:var(--radius);">${c.metaDescription}</div>
      <div style="font-size:9px;color:var(--muted2);margin-top:4px;">${c.metaDescription.length} caracteres · ${Math.round(c.metaDescription.length / 1.5)} caracteres aprox. en SERP</div>
    </div>

    <!-- ═══ KEYWORD GRID ═══ -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px;">
      <div style="background:var(--bg3);border:0.5px solid var(--border);border-radius:var(--radius);padding:10px;">
        <div style="font-size:9px;color:var(--muted2);text-transform:uppercase;margin-bottom:4px;">🎯 Keywords Principales</div>
        <div style="display:flex;flex-wrap:wrap;gap:3px;">
          ${c.keywords.map(k => `<span style="font-size:9px;padding:2px 6px;border-radius:3px;background:rgba(201,169,110,0.08);color:var(--accent);">${k}</span>`).join('')}
        </div>
      </div>
      <div style="background:var(--bg3);border:0.5px solid var(--border);border-radius:var(--radius);padding:10px;">
        <div style="font-size:9px;color:var(--muted2);text-transform:uppercase;margin-bottom:4px;">🌿 LSI Keywords (15)</div>
        <div style="display:flex;flex-wrap:wrap;gap:3px;">
          ${c.lsiKeywords.map(k => `<span style="font-size:8px;padding:1px 5px;border-radius:3px;background:var(--bg4);color:var(--muted);">${k}</span>`).join('')}
        </div>
      </div>
    </div>

    <!-- ═══ CONTENT SECTIONS ═══ -->
    <div style="margin-bottom:14px;">
      <div style="font-size:10px;color:var(--muted2);text-transform:uppercase;letter-spacing:0.03em;margin-bottom:8px;">📄 Estructura del Artículo</div>
      ${c.sections.map((s, si) => `
        <div style="background:var(--bg2);border:0.5px solid var(--border);border-radius:var(--radius);margin-bottom:8px;overflow:hidden;">
          <div style="padding:10px 14px;background:var(--bg3);border-bottom:0.5px solid var(--border);display:flex;align-items:center;gap:8px;">
            <span style="font-size:14px;font-weight:600;color:var(--accent);font-family:var(--mono);">H2</span>
            <span style="font-size:13px;font-weight:500;color:var(--text2);">${s.h2}</span>
          </div>
          ${s.subItems.map(si => `
            <div style="padding:8px 14px 8px 28px;border-top:0.5px solid rgba(255,255,255,0.03);">
              <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;">
                <span style="font-size:12px;font-weight:600;color:var(--info-bright);font-family:var(--mono);">H3</span>
                <span style="font-size:12px;font-weight:500;color:var(--text2);">${si.h3}</span>
              </div>
              ${si.paragraphs.map(p => `
                <p style="font-size:12px;color:var(--text2);line-height:1.7;margin:4px 0;padding-left:20px;">${p}</p>
              `).join('')}
            </div>
          `).join('')}
        </div>
      `).join('')}
    </div>

    <!-- ═══ CONCLUSION ═══ -->
    <div style="background:linear-gradient(135deg,var(--bg3),rgba(201,169,110,0.03));border:0.5px solid rgba(201,169,110,0.15);border-radius:var(--radius);padding:14px;margin-bottom:14px;">
      <div style="font-size:9px;color:var(--accent);text-transform:uppercase;letter-spacing:0.03em;margin-bottom:6px;">🎯 Conclusión</div>
      <p style="font-size:13px;color:var(--text2);line-height:1.7;">${c.conclusion}</p>
    </div>

    <!-- ═══ FAQ SECTION ═══ -->
    ${c.hasFAQ ? `
    <div style="background:var(--bg3);border:0.5px solid var(--border);border-radius:var(--radius);padding:14px;margin-bottom:14px;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
        <div style="font-size:10px;color:var(--muted2);text-transform:uppercase;letter-spacing:0.03em;">❓ FAQ — Preguntas Frecuentes con Schema</div>
        ${c.hasSchema ? `<span style="font-size:8px;padding:2px 6px;border-radius:3px;background:rgba(46,204,113,0.1);color:var(--success-bright);">✅ Schema Markup</span>` : ''}
      </div>
      ${c.faqs.map((f, i) => `
        <div style="margin-bottom:6px;padding:8px 10px;background:var(--bg2);border:0.5px solid var(--border);border-radius:var(--radius);">
          <div style="font-size:12px;font-weight:500;color:var(--text2);margin-bottom:4px;">${i + 1}. ${f.q}</div>
          <div style="font-size:11px;color:var(--muted);line-height:1.5;padding-left:20px;">${f.a}</div>
        </div>
      `).join('')}
    </div>` : ''}

    <!-- ═══ INTERNAL LINKS ═══ -->
    ${seoGenState.includeInternalLinks && c.internalLinks.length > 0 ? `
    <div style="background:var(--bg3);border:0.5px solid var(--border);border-radius:var(--radius);padding:12px;margin-bottom:14px;">
      <div style="font-size:9px;color:var(--muted2);text-transform:uppercase;letter-spacing:0.03em;margin-bottom:6px;">🔗 Internal Linking Sugerido</div>
      <div style="display:flex;flex-wrap:wrap;gap:6px;">
        ${c.internalLinks.map(link => `
          <span style="font-size:10px;padding:4px 10px;border-radius:6px;background:var(--bg4);color:var(--info-bright);border:0.5px solid rgba(77,171,247,0.15);">
            ${link.text}
          </span>
        `).join('')}
      </div>
    </div>` : ''}

    <!-- ═══ IMAGE ALT TEXTS ═══ -->
    ${seoGenState.includeImages && c.images.length > 0 ? `
    <div style="background:var(--bg3);border:0.5px solid var(--border);border-radius:var(--radius);padding:12px;margin-bottom:14px;">
      <div style="font-size:9px;color:var(--muted2);text-transform:uppercase;letter-spacing:0.03em;margin-bottom:6px;">🖼️ Alt Text para Imágenes Sugeridas</div>
      <div style="display:flex;flex-direction:column;gap:4px;">
        ${c.images.map((img, i) => `
          <div style="font-size:11px;color:var(--text2);padding:4px 8px;background:var(--bg4);border-radius:4px;font-family:var(--mono);">
            ${i + 1}. "${img}"
          </div>
        `).join('')}
      </div>
    </div>` : ''}

    <!-- ═══ SCHEMA MARKUP PREVIEW ═══ -->
    ${c.hasSchema ? `
    <div style="background:var(--bg3);border:0.5px solid var(--border);border-radius:var(--radius);padding:12px;margin-bottom:14px;">
      <div style="font-size:9px;color:var(--muted2);text-transform:uppercase;letter-spacing:0.03em;margin-bottom:6px;">🔣 Schema Markup (JSON-LD)</div>
      <pre style="font-size:9px;font-family:var(--mono);color:var(--muted);background:var(--bg4);padding:10px;border-radius:var(--radius);overflow-x:auto;line-height:1.6;white-space:pre-wrap;">${generateSchemaJSON(c)}</pre>
      <button class="btn btn-xs btn-ghost" onclick="copySEOSchema()" style="font-size:9px;margin-top:6px;">📋 Copiar Schema</button>
    </div>` : ''}

    <!-- ═══ TONE & LENGTH INFO ═══ -->
    <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:4px;">
      <div style="display:flex;gap:6px;flex-wrap:wrap;">
        <span style="font-size:9px;padding:3px 8px;border-radius:4px;background:var(--bg3);color:var(--muted2);">Tono: ${c.tone}</span>
        <span style="font-size:9px;padding:3px 8px;border-radius:4px;background:var(--bg3);color:var(--muted2);">Extensión: ${c.length}</span>
        <span style="font-size:9px;padding:3px 8px;border-radius:4px;background:var(--bg3);color:var(--muted2);">Secciones: ${c.sections.length}</span>
        <span style="font-size:9px;padding:3px 8px;border-radius:4px;background:var(--bg3);color:var(--muted2);">FAQs: ${c.faqs.length}</span>
        <span style="font-size:9px;padding:3px 8px;border-radius:4px;background:var(--bg3);color:var(--muted2);">CPC Promedio: $${c.cpcAvg.toFixed(2)}</span>
      </div>
    </div>
  `;
}

/* ══════════════════════════════════════════════
   SCHEMA GENERATOR
   ══════════════════════════════════════════════ */

function generateSchemaJSON(content) {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: content.title,
        description: content.metaDescription,
        about: {
          '@type': 'Thing',
          name: content.nicheName,
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `https://example.com/${content.nicheId}-guide`,
        },
        datePublished: content.generatedAt,
        dateModified: content.generatedAt,
      },
      ...(content.hasFAQ ? [{
        '@type': 'FAQPage',
        mainEntity: content.faqs.map(f => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: f.a,
          },
        })),
      }] : []),
    ],
  };

  return JSON.stringify(schema, null, 2);
}

/* ══════════════════════════════════════════════
   EXPORT & COPY FUNCTIONS
   ══════════════════════════════════════════════ */

function copySEOContent() {
  const c = seoGenState.generatedContent;
  if (!c) { showSEOToast('⚠️ No hay contenido generado'); return; }

  let text = `${c.title}\n`;
  text += `${'═'.repeat(60)}\n\n`;

  c.sections.forEach(s => {
    text += `## ${s.h2}\n\n`;
    s.subItems.forEach(si => {
      text += `### ${si.h3}\n\n`;
      si.paragraphs.forEach(p => {
        text += `${p}\n\n`;
      });
    });
  });

  text += `## Conclusión\n\n${c.conclusion}\n\n`;

  if (c.hasFAQ && c.faqs.length > 0) {
    text += `## FAQ — Preguntas Frecuentes\n\n`;
    c.faqs.forEach(f => {
      text += `${f.q}\n${f.a}\n\n`;
    });
  }

  navigator.clipboard.writeText(text).then(() => showSEOToast('✅ Contenido copiado al portapapeles'));
}

function copySEOHTML() {
  const c = seoGenState.generatedContent;
  if (!c) { showSEOToast('⚠️ No hay contenido generado'); return; }

  let html = `<article>\n`;
  html += `  <h1>${c.title}</h1>\n`;
  html += `  <meta name="description" content="${c.metaDescription}">\n\n`;

  c.sections.forEach(s => {
    html += `  <section>\n`;
    html += `    <h2>${s.h2}</h2>\n`;
    s.subItems.forEach(si => {
      html += `    <h3>${si.h3}</h3>\n`;
      si.paragraphs.forEach(p => {
        html += `    <p>${p}</p>\n`;
      });
    });
    html += `  </section>\n\n`;
  });

  html += `  <section>\n`;
  html += `    <h2>Conclusión</h2>\n`;
  html += `    <p>${c.conclusion}</p>\n`;
  html += `  </section>\n\n`;

  if (c.hasFAQ && c.faqs.length > 0) {
    html += `  <section>\n`;
    html += `    <h2>FAQ — Preguntas Frecuentes</h2>\n`;
    c.faqs.forEach(f => {
      html += `    <div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">\n`;
      html += `      <h3 itemprop="name">${f.q}</h3>\n`;
      html += `      <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">\n`;
      html += `        <p itemprop="text">${f.a}</p>\n`;
      html += `      </div>\n`;
      html += `    </div>\n`;
    });
    html += `  </section>\n`;
  }

  if (c.hasSchema) {
    html += `  <script type="application/ld+json">\n${generateSchemaJSON(c)}\n  </script>\n`;
  }

  html += `</article>`;

  navigator.clipboard.writeText(html).then(() => showSEOToast('✅ HTML copiado al portapapeles'));
}

function copySEOSchema() {
  const c = seoGenState.generatedContent;
  if (!c) { showSEOToast('⚠️ No hay contenido generado'); return; }
  navigator.clipboard.writeText(generateSchemaJSON(c)).then(() => showSEOToast('✅ Schema copiado'));
}

function showSEOPreview() {
  const c = seoGenState.generatedContent;
  if (!c) { showSEOToast('⚠️ No hay contenido generado'); return; }

  const sectionsHTML = c.sections.map(s => `
    <div style="margin-bottom:18px;">
      <h2 style="font-size:20px;font-weight:600;color:var(--text);margin-bottom:10px;">${s.h2}</h2>
      ${s.subItems.map(si => `
        <h3 style="font-size:16px;font-weight:500;color:var(--text2);margin:12px 0 6px;">${si.h3}</h3>
        ${si.paragraphs.map(p => `<p style="font-size:14px;color:var(--text2);line-height:1.7;margin-bottom:8px;">${p}</p>`).join('')}
      `).join('')}
    </div>
  `).join('');

  const faqHTML = c.hasFAQ ? `
    <div style="margin-top:24px;padding-top:16px;border-top:0.5px solid var(--border);">
      <h2 style="font-size:18px;font-weight:600;color:var(--text);margin-bottom:12px;">❓ Preguntas Frecuentes</h2>
      ${c.faqs.map(f => `
        <div style="margin-bottom:10px;">
          <div style="font-size:14px;font-weight:500;color:var(--text2);margin-bottom:4px;">${f.q}</div>
          <div style="font-size:13px;color:var(--muted);line-height:1.6;padding-left:16px;">${f.a}</div>
        </div>
      `).join('')}
    </div>
  ` : '';

  openModal(`👁️ Vista Previa — ${c.nicheName}`, `
    <div style="max-width:700px;margin:0 auto;">
      <h1 style="font-size:28px;font-weight:700;color:var(--text);margin-bottom:16px;line-height:1.3;">${c.title}</h1>
      <p style="font-size:13px;color:var(--muted2);margin-bottom:24px;padding-bottom:16px;border-bottom:0.5px solid var(--border);">
        ${c.metaDescription}
      </p>
      ${sectionsHTML}
      <div style="margin-top:24px;padding:16px;background:var(--bg3);border-radius:var(--radius);border:0.5px solid rgba(201,169,110,0.15);">
        <p style="font-size:14px;color:var(--text2);line-height:1.7;">${c.conclusion}</p>
      </div>
      ${faqHTML}
    </div>
  `, `<button class="btn btn-sm btn-ghost" onclick="closeModal()">Cerrar</button>`);
}

function exportSEOCurrent() {
  const c = seoGenState.generatedContent;
  if (!c) { showSEOToast('⚠️ No hay contenido generado'); return; }

  let text = `✍️ SEO CONTENT — ${c.nicheName}\n`;
  text += `${'═'.repeat(50)}\n`;
  text += `Título: ${c.title}\n`;
  text += `Meta Description: ${c.metaDescription}\n`;
  text += `Tono: ${c.tone} · Extensión: ${c.length} · Palabras: ${c.wordCount}\n`;
  text += `Generado: ${new Date(c.generatedAt).toLocaleDateString('es-DO')}\n`;
  text += `${'═'.repeat(50)}\n\n`;

  c.sections.forEach((s, i) => {
    text += `\n## SECCIÓN ${i + 1}: ${s.h2}\n\n`;
    s.subItems.forEach(si => {
      text += `### ${si.h3}\n\n`;
      si.paragraphs.forEach(p => text += `${p}\n\n`);
    });
  });

  text += `\n## CONCLUSIÓN\n\n${c.conclusion}\n\n`;

  if (c.hasFAQ && c.faqs.length > 0) {
    text += `\n## FAQ\n\n`;
    c.faqs.forEach(f => text += `${f.q}\n${f.a}\n\n`);
  }

  text += `\n${'═'.repeat(50)}\n`;
  text += `Keywords: ${c.keywords.join(', ')}\n`;
  text += `LSI Keywords: ${c.lsiKeywords.join(', ')}\n`;
  if (c.hasSchema) text += `\n${'═'.repeat(50)}\nSchema JSON-LD:\n${generateSchemaJSON(c)}\n`;
  text += `\nGenerado por Nuclear AIMA · SEO Content Generator`;

  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `seo-content-${c.nicheId}-${new Date().toISOString().split('T')[0]}.txt`;
  a.click();
  showSEOToast(`📥 Contenido exportado — ${c.nicheName}`);
}

/* ══════════════════════════════════════════════
   HISTORY
   ══════════════════════════════════════════════ */

function showSEOHistory() {
  const history = seoGenState.generatedHistory;
  if (history.length === 0) {
    showSEOToast('📋 No hay contenido generado anteriormente');
    return;
  }

  const bodyHTML = `
    <div style="font-size:13px;">
      <p style="font-size:12px;color:var(--muted);margin-bottom:12px;">${history.length} artículos generados</p>
      ${history.map((h, i) => `
        <div style="background:var(--bg3);border:0.5px solid var(--border);border-radius:var(--radius);padding:10px 12px;margin-bottom:6px;cursor:pointer;display:flex;justify-content:space-between;align-items:center;"
          onclick="restoreSEOContent(${i})">
          <div style="flex:1;min-width:0;">
            <div style="display:flex;align-items:center;gap:6px;">
              <span style="font-size:12px;">${h.nicheIcon}</span>
              <span style="font-size:12px;font-weight:500;color:var(--text2);">${h.nicheName}</span>
              <span style="font-size:9px;color:var(--muted2);font-weight:400;font-family:var(--font);">${h.title.substring(0, 50)}${h.title.length > 50 ? '…' : ''}</span>
            </div>
            <div style="font-size:10px;color:var(--muted2);margin-top:2px;">
              ${h.wordCount} palabras · ${h.tone} · ${h.length} · ${new Date(h.timestamp).toLocaleString('es-DO')}
            </div>
          </div>
          <button class="btn btn-xs btn-ghost" onclick="event.stopPropagation();deleteSEOContent(${i})" style="font-size:9px;color:var(--danger);flex-shrink:0;">✕</button>
        </div>
      `).join('')}
    </div>
  `;

  openModal('📋 Historial de Contenido Generado', bodyHTML, `
    <button class="btn btn-sm btn-ghost" onclick="closeModal()">Cerrar</button>
    <button class="btn btn-sm btn-danger" onclick="clearSEOHistory()">🗑️ Limpiar Todo</button>
  `);
}

function restoreSEOContent(idx) {
  closeModal();
  const h = seoGenState.generatedHistory[idx];
  if (!h) return;

  // We need to regenerate - but we can show a generation that matches this entry
  const select = document.getElementById('seo-niche-select');
  if (select) select.value = h.nicheId;
  seoGenState.activeNiche = h.nicheId;
  seoGenState.contentLength = h.length || 'standard';
  seoGenState.tone = h.tone || 'professional';

  const lengthSelect = document.getElementById('seo-length-select');
  const toneSelect = document.getElementById('seo-tone-select');
  if (lengthSelect) lengthSelect.value = h.length || 'standard';
  if (toneSelect) toneSelect.value = h.tone || 'professional';

  generateSEOContent();
}

function deleteSEOContent(idx) {
  seoGenState.generatedHistory.splice(idx, 1);
  localStorage.setItem('na_seo_history', JSON.stringify(seoGenState.generatedHistory));
  showSEOHistory();
}

function clearSEOHistory() {
  seoGenState.generatedHistory = [];
  localStorage.setItem('na_seo_history', '[]');
  closeModal();
  showSEOToast('🗑️ Historial limpiado');
}

/* ══════════════════════════════════════════════
   TOAST
   ══════════════════════════════════════════════ */

let seoToastTimer = null;

function showSEOToast(msg) {
  let toast = document.getElementById('seo-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'seo-toast';
    toast.style.cssText = 'position:fixed;bottom:20px;right:20px;background:var(--bg3);border:0.5px solid var(--border);border-radius:var(--radius);padding:10px 16px;font-size:12px;color:var(--text);z-index:9999;box-shadow:0 4px 20px rgba(0,0,0,0.4);transition:opacity 0.3s;max-width:320px;';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = '1';
  clearTimeout(seoToastTimer);
  seoToastTimer = setTimeout(() => { toast.style.opacity = '0'; }, 3000);
}

console.log('✍️ SEO Content Generator v1.0 loaded');
