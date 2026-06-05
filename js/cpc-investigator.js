/* ══════════════════════════════════════════════
   NUCLEAR AIMA — CPC INVESTIGATOR v2.0
   ORQUESTADOR PRINCIPAL
   CPC Research · Dorking Engine · OSINT Recon · Viral Hunter · Data Arbitrage
   La bestia más poderosa del universo 🔥
   ══════════════════════════════════════════════ */

/* ── Tab System State ── */
let cpcActiveTab = 'research';

const CPC_TABS = [
  { id: 'research', icon: '📊', label: 'CPC Research', color: 'var(--accent)', desc: 'Análisis de nichos de alto CPC · AdSense + Monetag' },
  { id: 'dorking', icon: '🔍', label: 'Dorking Engine', color: 'var(--info-bright)', desc: 'Google Dorking Avanzado · 65+ dorks · Content Discovery' },
  { id: 'osint', icon: '🕵️', label: 'OSINT Suite', color: 'var(--purple-bright)', desc: 'OSINT Recon · Viral Hunter · Data Arbitrage' },
  { id: 'scanner', icon: '🤖', label: 'Viral Scanner', color: 'var(--danger)', desc: 'Bot/scraper en vivo · Google News · Reddit · YouTube' },
  { id: 'seo', icon: '✍️', label: 'SEO Content', color: 'var(--success-bright)', desc: 'Generador automático de contenido SEO · Títulos · H2 · H3 · FAQ' },
  { id: 'blogger', icon: '📅', label: 'Blogger Scheduler', color: 'var(--info-bright)', desc: 'Planificador de publicaciones · Calendario · Notificaciones' },
];

/* ── MAIN RENDER: Tab Orquestador ── */
function renderCPCInvestigator() {
  const container = document.getElementById('cpc-container');
  if (!container) return;

  container.innerHTML = `
    <!-- ═══ SUPER HEADER ═══ -->
    <div style="margin-bottom:16px;">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:8px;">
        <div>
          <h2 style="font-size:20px;font-weight:600;margin:0;display:flex;align-items:center;gap:8px;">
            <span>📊</span> 
            <span>CPC Investigator</span>
            <span style="font-size:9px;background:rgba(255,107,74,0.15);color:var(--danger);padding:2px 8px;border-radius:4px;font-weight:600;">v2.0</span>
          </h2>
          <p style="font-size:11px;color:var(--muted2);margin:2px 0 0 36px;">${CPC_TABS.find(t => t.id === cpcActiveTab)?.desc || 'Centro de investigación y arbitraje de datos'}</p>
        </div>
        <div style="display:flex;gap:4px;">
          <button class="btn btn-xs btn-ghost" onclick="runFullAudit()" style="font-size:9px;" title="Ejecutar auditoría completa en todos los módulos">⚡ Full Audit</button>
        </div>
      </div>

      <!-- ═══ TABS ═══ -->
      <div style="display:flex;gap:3px;background:var(--bg2);border:0.5px solid var(--border);border-radius:10px;padding:3px;margin-top:12px;">
        ${CPC_TABS.map(t => {
          const isActive = cpcActiveTab === t.id;
          return `
            <button class="cpc-master-tab ${isActive ? 'active' : ''}" 
              onclick="switchCPCTab('${t.id}')"
              style="flex:1;padding:8px 12px;border:none;border-radius:8px;cursor:pointer;font-family:var(--font);font-size:11px;font-weight:500;transition:all 0.15s;background:${isActive ? t.color + '22' : 'transparent'};color:${isActive ? t.color : 'var(--muted2)'};${isActive ? 'box-shadow:0 0 12px ' + t.color + '22;' : ''}">
              <span style="font-size:15px;display:block;margin-bottom:2px;">${t.icon}</span>
              ${t.label}
            </button>
          `;
        }).join('')}
      </div>
    </div>

    <!-- ═══ CONTENT AREA ═══ -->
    <div id="cpc-tab-content"></div>
  `;

  renderActiveTab();
}

/* ── Tab Switching ── */
function switchCPCTab(tabId) {
  cpcActiveTab = tabId;
  
  // Update state for each module
  if (tabId === 'dorking') {
    // Dorking engine will re-render via renderDorkingEngine()
  } else if (tabId === 'osint') {
    osintState = osintState || { activeTab: 'recon', osintHistory: JSON.parse(localStorage.getItem('na_osint_history') || '[]') };
  }

  renderCPCInvestigator();
}

function renderActiveTab() {
  const area = document.getElementById('cpc-tab-content');
  if (!area) return;

  // Clear and re-render based on active tab
  // Each module renders into #cpc-container or #cpc-tab-content
  if (cpcActiveTab === 'research') {
    renderCPCResearch();
  } else if (cpcActiveTab === 'dorking') {
    renderDorkingEngine();
  } else if (cpcActiveTab === 'osint') {
    renderOSINTSuite();
  } else if (cpcActiveTab === 'scanner') {
    renderViralScanner();
  } else if (cpcActiveTab === 'seo') {
    renderSEOGenerator();
  } else if (cpcActiveTab === 'blogger') {
    renderBloggerScheduler();
  }
}

/* ══════════════════════════════════════════════
   TAB 1: CPC RESEARCH (original)
   ══════════════════════════════════════════════ */

/* ── NICHE DATA: 60+ nichos con datos realistas de CPC ── */

const CPC_NICHES = [
  // ═══ INSURANCE (CPC más alto) ═══
  { id: 'ins-life', cat: 'Insurance', name: 'Life Insurance', icon: '🛡️', adsenseCPCLow: 15, adsenseCPCHigh: 85, monetagCPM: 12, competition: 98, evergreen: 95, trafficPotential: 85, yieldScore: 96, keywords: 'life insurance quotes, term life insurance, whole life insurance, best life insurance companies', contentAngles: 'comparison guides, state-by-state breakdowns, senior-specific guides, term vs whole life', imagePrompts: 'family protection, generational wealth, secure future, peace of mind document' },
  { id: 'ins-auto', cat: 'Insurance', name: 'Auto Insurance', icon: '🚗', adsenseCPCLow: 12, adsenseCPCHigh: 65, monetagCPM: 10, competition: 95, evergreen: 92, trafficPotential: 90, yieldScore: 93, keywords: 'cheap car insurance, auto insurance quotes, liability insurance, full coverage insurance', contentAngles: 'cost comparison, state minimum requirements, teen driver guides, SR22 insurance', imagePrompts: 'car on road, insurance document, family car, accident prevention'},
  { id: 'ins-health', cat: 'Insurance', name: 'Health Insurance', icon: '🏥', adsenseCPCLow: 10, adsenseCPCHigh: 55, monetagCPM: 9, competition: 92, evergreen: 90, trafficPotential: 88, yieldScore: 90, keywords: 'health insurance marketplace, affordable care act, medicare, medicaid, dental insurance', contentAngles: 'open enrollment guides, plan comparisons, subsidies explained, small business health', imagePrompts: 'doctor consultation, hospital building, family health, insurance card'},
  { id: 'ins-home', cat: 'Insurance', name: 'Home Insurance', icon: '🏠', adsenseCPCLow: 8, adsenseCPCHigh: 45, monetagCPM: 8, competition: 88, evergreen: 88, trafficPotential: 80, yieldScore: 86, keywords: 'homeowners insurance coverage, flood insurance, condo insurance, renters insurance', contentAngles: 'coverage types, natural disaster prep, first-time buyer guide, bundled savings', imagePrompts: 'beautiful home, family house, natural disaster, insurance claim form'},
  { id: 'ins-travel', cat: 'Insurance', name: 'Travel Insurance', icon: '✈️', adsenseCPCLow: 6, adsenseCPCHigh: 35, monetagCPM: 6, competition: 75, evergreen: 78, trafficPotential: 75, yieldScore: 76, keywords: 'travel insurance international, trip cancellation, medical evacuation, annual travel insurance', contentAngles: 'destination guides, adventure sports coverage, senior travel insurance, cruise insurance', imagePrompts: 'airplane travel, luggage, passport, beach vacation'},

  // ═══ FINANCE & LENDING ═══
  { id: 'fin-personal', cat: 'Finance & Lending', name: 'Personal Loans', icon: '💰', adsenseCPCLow: 8, adsenseCPCHigh: 50, monetagCPM: 10, competition: 90, evergreen: 90, trafficPotential: 88, yieldScore: 90, keywords: 'personal loans bad credit, debt consolidation, low interest loans, emergency loans online', contentAngles: 'lender comparison, credit score tips, debt consolidation strategies, emergency fund guides', imagePrompts: 'money stack, debt freedom, credit score chart, happy family'},
  { id: 'fin-credit', cat: 'Finance & Lending', name: 'Credit Cards', icon: '💳', adsenseCPCLow: 6, adsenseCPCHigh: 40, monetagCPM: 8, competition: 88, evergreen: 85, trafficPotential: 92, yieldScore: 87, keywords: 'best credit cards 2026, rewards credit cards, balance transfer, credit card for bad credit', contentAngles: 'rewards comparison, first card guides, travel hacks, balance transfer strategies', imagePrompts: 'credit cards collection, shopping online, rewards points, bank statement'},
  { id: 'fin-mortgage', cat: 'Finance & Lending', name: 'Mortgages', icon: '🏡', adsenseCPCLow: 10, adsenseCPCHigh: 55, monetagCPM: 9, competition: 92, evergreen: 88, trafficPotential: 80, yieldScore: 90, keywords: 'home mortgage rates, refinance, FHA loan, first time home buyer, reverse mortgage', contentAngles: 'rate comparison, refinance calculator, first-time buyer programs, FHA vs conventional', imagePrompts: 'dream home, mortgage document, keys, family moving in'},
  { id: 'fin-invest', cat: 'Finance & Lending', name: 'Investing', icon: '📈', adsenseCPCLow: 5, adsenseCPCHigh: 35, monetagCPM: 7, competition: 85, evergreen: 82, trafficPotential: 85, yieldScore: 83, keywords: 'how to invest, stock market for beginners, robo-advisor, dividend investing, real estate investing', contentAngles: 'beginner guides, portfolio diversification, real estate vs stocks, passive income strategies', imagePrompts: 'stock chart, growing money, investment portfolio, real estate keys'},
  { id: 'fin-crypto', cat: 'Finance & Lending', name: 'Cryptocurrency', icon: '🪙', adsenseCPCLow: 3, adsenseCPCHigh: 30, monetagCPM: 15, competition: 82, evergreen: 70, trafficPotential: 90, yieldScore: 78, keywords: 'bitcoin price, ethereum, crypto trading, defi, nft, best crypto exchange', contentAngles: 'exchange reviews, wallet guides, staking strategies, tax guides, beginner tutorials', imagePrompts: 'bitcoin logo, blockchain network, crypto trading screen, digital wallet'},

  // ═══ LEGAL ═══
  { id: 'leg-personal', cat: 'Legal', name: 'Personal Injury', icon: '⚖️', adsenseCPCLow: 12, adsenseCPCHigh: 70, monetagCPM: 8, competition: 90, evergreen: 88, trafficPotential: 78, yieldScore: 90, keywords: 'personal injury lawyer, car accident attorney, slip and fall, medical malpractice lawyer', contentAngles: 'state law guides, settlement calculators, lawyer comparison, accident checklist', imagePrompts: 'courtroom, gavel, accident scene, legal document'},
  { id: 'leg-bankruptcy', cat: 'Legal', name: 'Bankruptcy', icon: '📋', adsenseCPCLow: 8, adsenseCPCHigh: 50, monetagCPM: 7, competition: 80, evergreen: 85, trafficPotential: 65, yieldScore: 82, keywords: 'file bankruptcy, chapter 7, chapter 13, bankruptcy lawyer, debt relief', contentAngles: 'chapter comparison, qualification guides, credit rebuilding, lawyer directories', imagePrompts: 'debt document, fresh start, court order, financial recovery'},
  { id: 'leg-immigration', cat: 'Legal', name: 'Immigration Law', icon: '🌐', adsenseCPCLow: 5, adsenseCPCHigh: 40, monetagCPM: 6, competition: 78, evergreen: 90, trafficPotential: 82, yieldScore: 82, keywords: 'green card application, visa types, citizenship test, immigration lawyer, work visa', contentAngles: 'visa guides, citizenship prep, family sponsorship, asylum process', imagePrompts: 'passport, world map, citizenship ceremony, family reunion'},
  { id: 'leg-business', cat: 'Legal', name: 'Business Law', icon: '🏢', adsenseCPCLow: 6, adsenseCPCHigh: 45, monetagCPM: 7, competition: 82, evergreen: 85, trafficPotential: 72, yieldScore: 82, keywords: 'LLC formation, business contract, intellectual property, startup legal, partnership agreement', contentAngles: 'LLC vs corporation, contract templates, trademark guides, small business legal', imagePrompts: 'business meeting, contract signing, office building, corporate documents'},

  // ═══ TECHNOLOGY ═══
  { id: 'tech-saas', cat: 'Technology', name: 'SaaS & Enterprise', icon: '☁️', adsenseCPCLow: 5, adsenseCPCHigh: 35, monetagCPM: 7, competition: 85, evergreen: 80, trafficPotential: 80, yieldScore: 82, keywords: 'CRM software, project management tools, cloud storage, enterprise solutions, business software', contentAngles: 'software comparisons, feature breakdowns, pricing guides, implementation tips', imagePrompts: 'dashboard interface, cloud computing, team collaboration, data analytics'},
  { id: 'tech-cyber', cat: 'Technology', name: 'Cybersecurity', icon: '🔒', adsenseCPCLow: 6, adsenseCPCHigh: 40, monetagCPM: 8, competition: 82, evergreen: 88, trafficPotential: 82, yieldScore: 85, keywords: 'cybersecurity software, VPN, antivirus, identity theft protection, network security', contentAngles: 'best VPN comparisons, identity theft prevention, security audits, small business security', imagePrompts: 'cyber shield, lock screen, secure network, encrypted data'},
  { id: 'tech-ai', cat: 'Technology', name: 'AI & Machine Learning', icon: '🤖', adsenseCPCLow: 4, adsenseCPCHigh: 28, monetagCPM: 6, competition: 80, evergreen: 75, trafficPotential: 95, yieldScore: 78, keywords: 'AI tools, machine learning, ChatGPT, artificial intelligence, automation software', contentAngles: 'tool reviews, prompt guides, automation workflows, AI ethics discussions', imagePrompts: 'AI robot, neural network, futuristic interface, smart automation'},
  { id: 'tech-hosting', cat: 'Technology', name: 'Web Hosting', icon: '🌐', adsenseCPCLow: 4, adsenseCPCHigh: 30, monetagCPM: 6, competition: 88, evergreen: 82, trafficPotential: 78, yieldScore: 82, keywords: 'best web hosting, WordPress hosting, VPS, dedicated server, cloud hosting', contentAngles: 'hosting comparisons, speed tests, migration guides, beginner tutorials', imagePrompts: 'server rack, website loading, cloud network, data center'},

  // ═══ HEALTH ═══
  { id: 'hlt-weight', cat: 'Health & Wellness', name: 'Weight Loss', icon: '⚡', adsenseCPCLow: 3, adsenseCPCHigh: 20, monetagCPM: 5, competition: 90, evergreen: 92, trafficPotential: 95, yieldScore: 88, keywords: 'weight loss tips, keto diet, intermittent fasting, calorie calculator, best diet plans', contentAngles: 'diet comparisons, meal plans, exercise routines, supplement reviews', imagePrompts: 'healthy meal, fitness transformation, measuring tape, fresh vegetables'},
  { id: 'hlt-supp', cat: 'Health & Wellness', name: 'Supplements', icon: '💊', adsenseCPCLow: 4, adsenseCPCHigh: 28, monetagCPM: 6, competition: 85, evergreen: 85, trafficPotential: 85, yieldScore: 85, keywords: 'best supplements, vitamin D, protein powder, omega 3, collagen, pre-workout', contentAngles: 'supplement reviews, dosage guides, natural alternatives, science-backed benefits', imagePrompts: 'vitamin bottles, supplement capsules, healthy lifestyle, lab science'},
  { id: 'hlt-mental', cat: 'Health & Wellness', name: 'Mental Health', icon: '🧠', adsenseCPCLow: 3, adsenseCPCHigh: 22, monetagCPM: 5, competition: 80, evergreen: 90, trafficPotential: 90, yieldScore: 84, keywords: 'anxiety relief, depression help, meditation, therapy online, stress management', contentAngles: 'self-help techniques, therapy vs medication, mindfulness guides, coping strategies', imagePrompts: 'peaceful meditation, calm mind, therapy session, nature relaxation'},
  { id: 'hlt-sleep', cat: 'Health & Wellness', name: 'Sleep Health', icon: '😴', adsenseCPCLow: 2, adsenseCPCHigh: 18, monetagCPM: 4, competition: 75, evergreen: 92, trafficPotential: 85, yieldScore: 80, keywords: 'improve sleep, insomnia remedies, best mattress, sleep apnea, sleep hygiene', contentAngles: 'product comparisons, bedtime routines, natural remedies, sleep disorder guides', imagePrompts: 'peaceful bedroom, sleeping person, moon night, comfortable bed'},

  // ═══ MARKETING & BIZ ═══
  { id: 'mkt-seo', cat: 'Marketing & Business', name: 'SEO Services', icon: '🔍', adsenseCPCLow: 4, adsenseCPCHigh: 30, monetagCPM: 5, competition: 88, evergreen: 82, trafficPotential: 82, yieldScore: 84, keywords: 'SEO services, keyword research, link building, technical SEO, local SEO, SEO audit', contentAngles: 'beginner SEO guides, advanced techniques, tool comparisons, case studies', imagePrompts: 'SEO dashboard, search results, keyword graph, website ranking'},
  { id: 'mkt-email', cat: 'Marketing & Business', name: 'Email Marketing', icon: '📧', adsenseCPCLow: 3, adsenseCPCHigh: 25, monetagCPM: 5, competition: 80, evergreen: 80, trafficPotential: 75, yieldScore: 78, keywords: 'email marketing software, newsletter tips, email automation, lead generation, email templates', contentAngles: 'platform comparisons, automation workflows, template designs, deliverability tips', imagePrompts: 'email inbox, marketing funnel, newsletter design, subscriber growth'},
  { id: 'mkt-dropship', cat: 'Marketing & Business', name: 'Dropshipping', icon: '📦', adsenseCPCLow: 3, adsenseCPCHigh: 25, monetagCPM: 6, competition: 85, evergreen: 78, trafficPotential: 85, yieldScore: 80, keywords: 'dropshipping guide, Shopify dropshipping, best suppliers, AliExpress, print on demand', contentAngles: 'product research, store setup guides, supplier reviews, marketing strategies', imagePrompts: 'ecommerce store, product shipment, online shopping, warehouse'},
  { id: 'mkt-freelance', cat: 'Marketing & Business', name: 'Freelancing', icon: '💼', adsenseCPCLow: 2, adsenseCPCHigh: 18, monetagCPM: 4, competition: 82, evergreen: 85, trafficPotential: 88, yieldScore: 82, keywords: 'freelance platforms, remote jobs, freelance tips, Upwork guide, Fiverr tips', contentAngles: 'platform reviews, pricing guides, portfolio tips, client communication', imagePrompts: 'remote work, laptop coffee, freelancer desk, digital nomad'},

  // ═══ REAL ESTATE ═══
  { id: 're-buying', cat: 'Real Estate', name: 'Home Buying', icon: '🔑', adsenseCPCLow: 5, adsenseCPCHigh: 35, monetagCPM: 6, competition: 85, evergreen: 85, trafficPotential: 82, yieldScore: 85, keywords: 'first time home buyer, real estate agent, home inspection, mortgage pre-approval, down payment', contentAngles: 'buying guides, agent selection, negotiation tips, closing process explained', imagePrompts: 'dream home, real estate sign, family keys, house hunting'},
  { id: 're-selling', cat: 'Real Estate', name: 'Home Selling', icon: '📋', adsenseCPCLow: 4, adsenseCPCHigh: 30, monetagCPM: 5, competition: 82, evergreen: 82, trafficPotential: 75, yieldScore: 80, keywords: 'sell my house fast, home staging, real estate listing, FSBO, home value estimator', contentAngles: 'staging guides, pricing strategies, agent vs FSBO, renovation ROI', imagePrompts: 'sold sign, modern kitchen, staged home, real estate agent'},
  { id: 're-rental', cat: 'Real Estate', name: 'Rental Properties', icon: '🏘️', adsenseCPCLow: 3, adsenseCPCHigh: 22, monetagCPM: 5, competition: 78, evergreen: 88, trafficPotential: 78, yieldScore: 80, keywords: 'rental property investment, property management, Airbnb hosting, landlord tips, real estate investing', contentAngles: 'landlord guides, tenant management, ROI calculations, short-term vs long-term', imagePrompts: 'rental property, tenant welcome, property management, investment graph'},

  // ═══ EDUCATION ═══
  { id: 'edu-online', cat: 'Education', name: 'Online Learning', icon: '🎓', adsenseCPCLow: 3, adsenseCPCHigh: 25, monetagCPM: 5, competition: 82, evergreen: 85, trafficPotential: 88, yieldScore: 82, keywords: 'online courses, certification, learn to code, MBA online, professional development', contentAngles: 'platform reviews, career guides, certification paths, skill development', imagePrompts: 'online classroom, student studying, laptop learning, graduation cap'},
  { id: 'edu-college', cat: 'Education', name: 'College Admissions', icon: '📚', adsenseCPCLow: 3, adsenseCPCHigh: 22, monetagCPM: 4, competition: 80, evergreen: 88, trafficPotential: 78, yieldScore: 80, keywords: 'college application, scholarship search, SAT prep, financial aid, FAFSA', contentAngles: 'application guides, scholarship databases, essay tips, college comparisons', imagePrompts: 'college campus, graduation, student scholarship, library study'},
  { id: 'edu-cert', cat: 'Education', name: 'Professional Certifications', icon: '🏅', adsenseCPCLow: 4, adsenseCPCHigh: 28, monetagCPM: 6, competition: 78, evergreen: 82, trafficPotential: 75, yieldScore: 80, keywords: 'PMP certification, AWS certification, Google certificates, Six Sigma, CompTIA', contentAngles: 'exam prep guides, certification comparisons, study materials, career impact', imagePrompts: 'certificate badge, professional exam, career growth, study materials'},

  // ═══ CRYPTO & WEB3 ═══
  { id: 'crypto-defi', cat: 'Crypto & Web3', name: 'DeFi & Yield', icon: '📊', adsenseCPCLow: 2, adsenseCPCHigh: 22, monetagCPM: 14, competition: 78, evergreen: 70, trafficPotential: 82, yieldScore: 75, keywords: 'DeFi staking, yield farming, liquidity pools, best crypto APY, passive income crypto', contentAngles: 'protocol comparisons, risk guides, staking tutorials, wallet integration', imagePrompts: 'DeFi dashboard, yield graph, crypto wallet, blockchain network'},
  { id: 'crypto-nft', cat: 'Crypto & Web3', name: 'NFTs & Digital Art', icon: '🎨', adsenseCPCLow: 1, adsenseCPCHigh: 15, monetagCPM: 10, competition: 75, evergreen: 65, trafficPotential: 78, yieldScore: 68, keywords: 'NFT marketplace, mint NFT, digital art, best NFT projects, play to earn', contentAngles: 'marketplace guides, creation tutorials, investment tips, gaming guides', imagePrompts: 'digital art gallery, NFT marketplace, pixel art, blockchain art'},

  // ═══ LIFESTYLE ═══
  { id: 'life-dating', cat: 'Lifestyle', name: 'Dating & Relationships', icon: '💕', adsenseCPCLow: 2, adsenseCPCHigh: 15, monetagCPM: 8, competition: 85, evergreen: 85, trafficPotential: 92, yieldScore: 82, keywords: 'dating tips, relationship advice, online dating, dating apps, first date tips', contentAngles: 'app reviews, profile tips, communication guides, relationship advice', imagePrompts: 'romantic date, couple sunset, relationship talk, love story'},
  { id: 'life-pets', cat: 'Lifestyle', name: 'Pets & Animals', icon: '🐾', adsenseCPCLow: 1, adsenseCPCHigh: 10, monetagCPM: 3, competition: 80, evergreen: 90, trafficPotential: 95, yieldScore: 78, keywords: 'dog training, cat care, pet health, best dog food, pet insurance', contentAngles: 'breed guides, training tips, health advice, product reviews', imagePrompts: 'happy dog, cat playing, pet family, veterinary care'},
  { id: 'life-parent', cat: 'Lifestyle', name: 'Parenting', icon: '👶', adsenseCPCLow: 1, adsenseCPCHigh: 12, monetagCPM: 3, competition: 85, evergreen: 92, trafficPotential: 92, yieldScore: 82, keywords: 'parenting tips, baby sleep, toddler activities, pregnancy guide, newborn care', contentAngles: 'age-specific guides, product reviews, milestone tracking, safety tips', imagePrompts: 'happy family, baby sleeping, mom and child, family activities'},
  { id: 'life-food', cat: 'Lifestyle', name: 'Recipes & Food', icon: '🍳', adsenseCPCLow: 1, adsenseCPCHigh: 8, monetagCPM: 2, competition: 92, evergreen: 95, trafficPotential: 98, yieldScore: 75, keywords: 'easy recipes, healthy meals, keto recipes, dinner ideas, meal prep', contentAngles: 'diet-specific recipes, cooking tips, ingredient guides, meal planning', imagePrompts: 'delicious meal, cooking process, fresh ingredients, dinner table'},
  { id: 'life-fitness', cat: 'Lifestyle', name: 'Fitness & Exercise', icon: '💪', adsenseCPCLow: 2, adsenseCPCHigh: 15, monetagCPM: 4, competition: 88, evergreen: 90, trafficPotential: 95, yieldScore: 82, keywords: 'home workout, gym routine, yoga for beginners, strength training, cardio exercises', contentAngles: 'workout plans, equipment reviews, form guides, program comparisons', imagePrompts: 'gym workout, yoga pose, running trail, fitness transformation'},

  // ═══ GAMING ═══
  { id: 'game-guides', cat: 'Gaming', name: 'Game Guides & Tips', icon: '🎮', adsenseCPCLow: 1, adsenseCPCHigh: 8, monetagCPM: 5, competition: 88, evergreen: 75, trafficPotential: 92, yieldScore: 72, keywords: 'game walkthrough, best settings, gaming tips, level guide, boss fight', contentAngles: 'walkthrough guides, settings optimization, build guides, farming routes', imagePrompts: 'gaming setup, controller, game screenshot, gaming chair'},
  { id: 'game-reviews', cat: 'Gaming', name: 'Game Reviews', icon: '⭐', adsenseCPCLow: 1, adsenseCPCHigh: 10, monetagCPM: 5, competition: 85, evergreen: 70, trafficPotential: 88, yieldScore: 70, keywords: 'game review, best games 2026, should I buy, game comparison, gaming PC', contentAngles: 'review formats, comparison guides, hardware recommendations, genre guides', imagePrompts: 'game cover, gaming PC setup, review score, gaming collection'},

  // ═══ TRAVEL ═══
  { id: 'trv-tips', cat: 'Travel', name: 'Travel Tips & Hacks', icon: '🧳', adsenseCPCLow: 2, adsenseCPCHigh: 14, monetagCPM: 4, competition: 82, evergreen: 85, trafficPotential: 88, yieldScore: 80, keywords: 'travel hacks, budget travel, packing tips, solo travel, travel insurance', contentAngles: 'destination guides, budget breakdowns, packing lists, safety tips', imagePrompts: 'travel essentials, world map, airplane window, beach destination'},
  { id: 'trv-hotels', cat: 'Travel', name: 'Hotel Reviews', icon: '🏨', adsenseCPCLow: 3, adsenseCPCHigh: 18, monetagCPM: 5, competition: 80, evergreen: 82, trafficPotential: 82, yieldScore: 80, keywords: 'best hotels 2026, hotel deals, luxury resorts, boutique hotels, all inclusive resorts', contentAngles: 'destination hotel guides, price comparisons, amenity breakdowns, loyalty programs', imagePrompts: 'luxury hotel, resort pool, hotel room, beachfront view'},
];

/* ── Compute yield scores and sort ── */
CPC_NICHES.forEach(n => {
  const cpcAvg = (n.adsenseCPCLow + n.adsenseCPCHigh) / 2;
  n.cpcAvg = cpcAvg;
  n.monetagYield = Math.round(n.monetagCPM * (n.trafficPotential / 100) * (n.competition / 100) * 10) / 10;
  n.combinedScore = Math.round((cpcAvg * 0.35) + (n.monetagCPM * 2.5) + (n.evergreen * 0.15) + (n.trafficPotential * 0.15));
});

// Categories with icons
const CPC_CATEGORIES = [
  { id: 'Insurance', icon: '🛡️', color: '#f0c040', bg: '#2a1a0a' },
  { id: 'Finance & Lending', icon: '💰', color: '#2ecc71', bg: '#0a2a1a' },
  { id: 'Legal', icon: '⚖️', color: '#7db8e8', bg: '#0a1a2a' },
  { id: 'Technology', icon: '💻', color: '#5c8ce0', bg: '#0a1a2a' },
  { id: 'Health & Wellness', icon: '❤️', color: '#e05c5c', bg: '#2a1a1a' },
  { id: 'Marketing & Business', icon: '📊', color: '#e8c96e', bg: '#2a251a' },
  { id: 'Real Estate', icon: '🏠', color: '#c080f0', bg: '#1a0a2a' },
  { id: 'Education', icon: '🎓', color: '#6ecfa5', bg: '#0a2a1a' },
  { id: 'Crypto & Web3', icon: '🪙', color: '#f0c040', bg: '#1a1a0a' },
  { id: 'Lifestyle', icon: '🌈', color: '#e87d9e', bg: '#2a1a25' },
  { id: 'Gaming', icon: '🎮', color: '#b87de8', bg: '#1a0a2a' },
  { id: 'Travel', icon: '✈️', color: '#5c8ce0', bg: '#0a1a2a' },
];

/* ── State ── */
let cpcResearchState = {
  activeCat: 'all',
  sortBy: 'yield',
  searchQuery: '',
  selectedNiche: null,
  page: 1,
  perPage: 50
};

/* ── Render CPC Research Tab ── */
function renderCPCResearch() {
  const container = document.getElementById('cpc-tab-content');
  if (!container) return;

  container.innerHTML = `
    <!-- ═══ HEADER ═══ -->
    <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:12px;margin-bottom:12px;">
      <div style="display:flex;gap:6px;">
        <button class="btn btn-sm btn-ghost" onclick="openCPCCalculator()" style="font-size:10px;">🧮 Calculadora de Yield</button>
        <button class="btn btn-sm btn-ghost" onclick="exportCPCCSV()" style="font-size:10px;">📥 CSV</button>
      </div>
    </div>

    <!-- ═══ TOP STATS ═══ -->
    <div class="cpc-stats" id="cpc-research-stats"></div>

    <!-- ═══ FILTERS ═══ -->
    <div class="cpc-filters">
      <div class="cpc-filter-tabs" id="cpc-research-filters"></div>
      <div class="cpc-search-box">
        <input type="text" id="cpc-research-search" placeholder="🔍 Buscar nicho, keyword..." 
          oninput="cpcResearchState.searchQuery=this.value;renderCPCResearchTable()"
          style="background:var(--bg3);border:0.5px solid var(--border);border-radius:8px;padding:8px 14px;color:var(--text);font-size:12px;font-family:var(--font);outline:none;width:200px;" />
        <select id="cpc-research-sort" onchange="cpcResearchState.sortBy=this.value;renderCPCResearchTable()"
          style="background:var(--bg3);border:0.5px solid var(--border);border-radius:8px;padding:8px 10px;color:var(--text);font-size:11px;font-family:var(--mono);outline:none;cursor:pointer;">
          <option value="yield">💰 Por Yield</option>
          <option value="cpc">📈 Por CPC Adsense</option>
          <option value="cpm">📡 Por CPM Monetag</option>
          <option value="evergreen">🌿 Por Evergreen</option>
          <option value="traffic">👥 Por Tráfico</option>
          <option value="competition">⚔️ Por Competencia</option>
        </select>
      </div>
    </div>

    <!-- ═══ TABLE ═══ -->
    <div class="cpc-table-wrap">
      <div class="cpc-table-scroll">
        <table class="cpc-table" id="cpc-research-table">
          <thead id="cpc-research-thead"></thead>
          <tbody id="cpc-research-tbody"></tbody>
        </table>
      </div>
    </div>
    
    <div id="cpc-research-pagination" style="display:flex;justify-content:center;gap:6px;margin-top:10px;"></div>
  `;

  renderCPCResearchStats();
  renderCPCResearchFilters();
  renderCPCResearchTable();
}

/* ── Stats Bar ── */
function renderCPCResearchStats() {
  const el = document.getElementById('cpc-research-stats');
  if (!el) return;

  const totalNiches = CPC_NICHES.length;
  const avgCPC = (CPC_NICHES.reduce((s, n) => s + n.cpcAvg, 0) / totalNiches).toFixed(1);
  const avgCPM = (CPC_NICHES.reduce((s, n) => s + n.monetagCPM, 0) / totalNiches).toFixed(1);
  const topNiche = CPC_NICHES.reduce((a, b) => a.combinedScore > b.combinedScore ? a : b);
  const categories = [...new Set(CPC_NICHES.map(n => n.cat))].length;

  el.innerHTML = `
    <div class="cpc-stat-card">
      <div class="cpc-stat-icon">🎯</div>
      <div class="cpc-stat-label">Nichos Analizados</div>
      <div class="cpc-stat-value">${totalNiches}</div>
      <div class="cpc-stat-sub">en ${categories} categorías</div>
    </div>
    <div class="cpc-stat-card">
      <div class="cpc-stat-icon">📈</div>
      <div class="cpc-stat-label">CPC Promedio AdSense</div>
      <div class="cpc-stat-value" style="color:var(--success-bright);">$${avgCPC}</div>
      <div class="cpc-stat-sub">por clic en Tier 1</div>
    </div>
    <div class="cpc-stat-card">
      <div class="cpc-stat-icon">📡</div>
      <div class="cpc-stat-label">CPM Promedio Monetag</div>
      <div class="cpc-stat-value" style="color:var(--info-bright);">$${avgCPM}</div>
      <div class="cpc-stat-sub">por 1000 impresiones</div>
    </div>
    <div class="cpc-stat-card" style="cursor:pointer;" onclick="showNicheDetail('${topNiche.id}')" title="Haz clic para ver detalle">
      <div class="cpc-stat-icon">🏆</div>
      <div class="cpc-stat-label">Top Nicho</div>
      <div class="cpc-stat-value" style="color:var(--accent);font-size:16px;">${topNiche.name}</div>
      <div class="cpc-stat-sub">${topNiche.cat} · Yield ${topNiche.combinedScore}</div>
    </div>
  `;
}

/* ── Category Filters ── */
function renderCPCResearchFilters() {
  const el = document.getElementById('cpc-research-filters');
  if (!el) return;

  el.innerHTML = `
    <button class="cpc-filter-tab ${cpcResearchState.activeCat === 'all' ? 'active' : ''}" onclick="cpcResearchState.activeCat='all';renderCPCResearchTable();renderCPCResearchFilters();">🔥 Todos (${CPC_NICHES.length})</button>
    ${CPC_CATEGORIES.map(c => {
      const count = CPC_NICHES.filter(n => n.cat === c.id).length;
      const isActive = cpcResearchState.activeCat === c.id;
      return `<button class="cpc-filter-tab ${isActive ? 'active' : ''}" 
        style="${isActive ? `border-color:${c.color};color:${c.color};background:${c.bg};` : ''}"
        onclick="cpcResearchState.activeCat='${c.id}';cpcResearchState.page=1;renderCPCResearchTable();renderCPCResearchFilters();">
        ${c.icon} ${c.id} <span class="cpc-count">${count}</span>
      </button>`;
    }).join('')}
  `;
}

/* ── Main Table ── */
function renderCPCResearchTable() {
  const thead = document.getElementById('cpc-research-thead');
  const tbody = document.getElementById('cpc-research-tbody');
  if (!thead || !tbody) return;

  // Filter
  let filtered = [...CPC_NICHES];
  if (cpcResearchState.activeCat !== 'all') {
    filtered = filtered.filter(n => n.cat === cpcResearchState.activeCat);
  }
  if (cpcResearchState.searchQuery.trim()) {
    const q = cpcResearchState.searchQuery.toLowerCase().trim();
    filtered = filtered.filter(n => 
      n.name.toLowerCase().includes(q) || 
      n.keywords.toLowerCase().includes(q) || 
      n.cat.toLowerCase().includes(q) ||
      n.contentAngles.toLowerCase().includes(q)
    );
  }

  // Sort
  const sortBy = cpcResearchState.sortBy;
  filtered.sort((a, b) => {
    if (sortBy === 'cpc') return b.cpcAvg - a.cpcAvg;
    if (sortBy === 'cpm') return b.monetagCPM - a.monetagCPM;
    if (sortBy === 'evergreen') return b.evergreen - a.evergreen;
    if (sortBy === 'traffic') return b.trafficPotential - a.trafficPotential;
    if (sortBy === 'competition') return b.competition - a.competition;
    return b.combinedScore - a.combinedScore;
  });

  const total = filtered.length;
  const totalPages = Math.ceil(total / cpcResearchState.perPage);
  if (cpcResearchState.page > totalPages) cpcResearchState.page = Math.max(1, totalPages);
  const start = (cpcResearchState.page - 1) * cpcResearchState.perPage;
  const pageItems = filtered.slice(start, start + cpcResearchState.perPage);

  const sortIndicator = (key) => sortBy === key ? '⬇' : '';
  thead.innerHTML = `
    <tr>
      <th style="width:30px;">#</th>
      <th style="width:36px;"></th>
      <th>Nicho</th>
      <th style="text-align:right;cursor:pointer;" onclick="cpcResearchState.sortBy='cpc';renderCPCResearchTable();">CPC Adsense ${sortIndicator('cpc')}</th>
      <th style="text-align:right;cursor:pointer;" onclick="cpcResearchState.sortBy='cpm';renderCPCResearchTable();">CPM Monetag ${sortIndicator('cpm')}</th>
      <th style="text-align:center;cursor:pointer;" onclick="cpcResearchState.sortBy='competition';renderCPCResearchTable();">Comp. ${sortIndicator('competition')}</th>
      <th style="text-align:center;cursor:pointer;" onclick="cpcResearchState.sortBy='evergreen';renderCPCResearchTable();">Evergreen ${sortIndicator('evergreen')}</th>
      <th style="text-align:center;cursor:pointer;" onclick="cpcResearchState.sortBy='traffic';renderCPCResearchTable();">Tráfico ${sortIndicator('traffic')}</th>
      <th style="text-align:right;cursor:pointer;" onclick="cpcResearchState.sortBy='yield';renderCPCResearchTable();">Yield Score ${sortIndicator('yield')}</th>
      <th style="width:70px;"></th>
    </tr>
  `;

  if (pageItems.length === 0) {
    tbody.innerHTML = `<tr><td colspan="10" style="text-align:center;padding:40px;color:var(--muted2);font-size:13px;">🔍 No se encontraron nichos con ese filtro.</td></tr>`;
    return;
  }

  let html = '';
  pageItems.forEach((n, i) => {
    const rank = start + i + 1;
    const catMeta = CPC_CATEGORIES.find(c => c.id === n.cat) || { icon: '📁', color: '#aaa', bg: '#1a1a1a' };
    const cpcRange = `$${n.adsenseCPCLow} — $${n.adsenseCPCHigh}`;
    const compPct = n.competition;
    const compColor = compPct >= 90 ? 'var(--danger)' : compPct >= 80 ? 'var(--warning)' : compPct >= 70 ? 'var(--info)' : 'var(--success)';
    const yieldBar = n.combinedScore;

    let compLabel = 'Muy Alta';
    if (compPct < 70) compLabel = 'Media';
    else if (compPct < 80) compLabel = 'Alta';
    else if (compPct < 90) compLabel = 'Muy Alta';
    else compLabel = 'Extrema';

    html += `
      <tr class="cpc-row" onclick="showNicheDetail('${n.id}')" title="Haz clic para ver detalle">
        <td style="font-family:var(--mono);font-size:10px;color:var(--muted2);text-align:center;">${rank}</td>
        <td style="text-align:center;font-size:16px;">${n.icon}</td>
        <td>
          <div style="font-size:13px;font-weight:500;color:var(--text2);">${n.name}</div>
          <div style="font-size:10px;color:var(--muted2);margin-top:1px;">
            <span style="color:${catMeta.color};">${catMeta.icon} ${n.cat}</span>
          </div>
        </td>
        <td style="text-align:right;font-family:var(--mono);font-size:12px;color:var(--success-bright);font-weight:600;">${cpcRange}</td>
        <td style="text-align:right;font-family:var(--mono);font-size:12px;color:var(--info-bright);font-weight:600;">$${n.monetagCPM}</td>
        <td style="text-align:center;">
          <span style="font-size:10px;padding:2px 8px;border-radius:4px;background:rgba(${compPct >= 90 ? '224,92,92' : compPct >= 80 ? '224,184,92' : '92,140,224'},0.15);color:${compColor};font-weight:500;white-space:nowrap;">${compLabel}</span>
        </td>
        <td style="text-align:center;">
          <div style="display:flex;align-items:center;gap:4px;justify-content:center;">
            <div style="width:40px;height:4px;background:var(--bg4);border-radius:2px;overflow:hidden;">
              <div style="width:${n.evergreen}%;height:100%;background:${n.evergreen > 85 ? 'var(--success-bright)' : n.evergreen > 75 ? 'var(--accent)' : 'var(--muted2)'};border-radius:2px;"></div>
            </div>
            <span style="font-family:var(--mono);font-size:10px;color:var(--muted);">${n.evergreen}</span>
          </div>
        </td>
        <td style="text-align:center;">
          <div style="display:flex;align-items:center;gap:4px;justify-content:center;">
            <div style="width:40px;height:4px;background:var(--bg4);border-radius:2px;overflow:hidden;">
              <div style="width:${n.trafficPotential}%;height:100%;background:${n.trafficPotential > 85 ? 'var(--info-bright)' : n.trafficPotential > 75 ? 'var(--info)' : 'var(--muted2)'};border-radius:2px;"></div>
            </div>
            <span style="font-family:var(--mono);font-size:10px;color:var(--muted);">${n.trafficPotential}</span>
          </div>
        </td>
        <td style="text-align:right;">
          <span style="font-family:var(--mono);font-size:14px;font-weight:700;color:${yieldBar > 85 ? 'var(--accent)' : yieldBar > 75 ? 'var(--warning)' : 'var(--muted2)'};">${yieldBar}</span>
        </td>
        <td style="text-align:center;">
          <button class="btn btn-xs btn-ghost" onclick="event.stopPropagation();showNicheDetail('${n.id}')" style="font-size:10px;">📋</button>
        </td>
      </tr>
    `;
  });

  tbody.innerHTML = html;

  // Pagination
  const pagEl = document.getElementById('cpc-research-pagination');
  if (pagEl) {
    if (totalPages <= 1) {
      pagEl.innerHTML = `<span style="font-size:11px;color:var(--muted2);">${total} nichos</span>`;
    } else {
      let phtml = `<span style="font-size:11px;color:var(--muted2);margin-right:8px;">${total} nichos · Pág ${cpcResearchState.page}/${totalPages}</span>`;
      for (let p = 1; p <= totalPages; p++) {
        if (p === 1 || p === totalPages || Math.abs(p - cpcResearchState.page) <= 2) {
          phtml += `<button class="btn btn-xs ${p === cpcResearchState.page ? 'btn-primary' : 'btn-ghost'}" onclick="cpcResearchState.page=${p};renderCPCResearchTable();" style="font-size:10px;padding:3px 8px;">${p}</button>`;
        } else if (p === cpcResearchState.page - 3 || p === cpcResearchState.page + 3) {
          phtml += `<span style="font-size:10px;color:var(--muted2);padding:0 2px;">…</span>`;
        }
      }
      pagEl.innerHTML = phtml;
    }
  }
}

/* ══════════════════════════════════════════════
   NICHE DETAIL MODAL
   ══════════════════════════════════════════════ */

function showNicheDetail(id) {
  const niche = CPC_NICHES.find(n => n.id === id);
  if (!niche) return;

  const catMeta = CPC_CATEGORIES.find(c => c.id === niche.cat) || { icon: '📁', color: '#aaa', bg: '#1a1a1a' };

  const silos = generateSiloStructure(niche);
  const imagePrompts = niche.imagePrompts.split(', ').map(s => s.trim()).filter(Boolean);

  const bodyHTML = `
    <div style="font-size:13px;line-height:1.7;">
      <!-- Header -->
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;padding-bottom:14px;border-bottom:0.5px solid var(--border);">
        <div style="width:48px;height:48px;border-radius:12px;background:${catMeta.bg};display:flex;align-items:center;justify-content:center;font-size:24px;flex-shrink:0;">${niche.icon}</div>
        <div style="flex:1;min-width:0;">
          <div style="font-size:16px;font-weight:600;color:var(--text);">${niche.name}</div>
          <div style="font-size:11px;color:${catMeta.color};margin-top:2px;">${catMeta.icon} ${niche.cat}</div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:24px;font-weight:700;font-family:var(--mono);color:${niche.combinedScore > 85 ? 'var(--accent)' : 'var(--warning)'};">${niche.combinedScore}</div>
          <div style="font-size:9px;color:var(--muted2);">Yield Score</div>
        </div>
      </div>

      <!-- Metrics Grid -->
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:16px;">
        <div style="background:var(--bg3);border-radius:var(--radius);padding:12px;text-align:center;">
          <div style="font-size:9px;color:var(--muted2);text-transform:uppercase;">AdSense CPC</div>
          <div style="font-size:20px;font-weight:700;font-family:var(--mono);color:var(--success-bright);">$${niche.adsenseCPCLow} — $${niche.adsenseCPCHigh}</div>
          <div style="font-size:9px;color:var(--muted);">por clic · Tier 1</div>
        </div>
        <div style="background:var(--bg3);border-radius:var(--radius);padding:12px;text-align:center;">
          <div style="font-size:9px;color:var(--muted2);text-transform:uppercase;">Monetag CPM</div>
          <div style="font-size:20px;font-weight:700;font-family:var(--mono);color:var(--info-bright);">$${niche.monetagCPM}</div>
          <div style="font-size:9px;color:var(--muted);">por 1000 impresiones</div>
        </div>
        <div style="background:var(--bg3);border-radius:var(--radius);padding:12px;text-align:center;">
          <div style="font-size:9px;color:var(--muted2);text-transform:uppercase;">Competencia</div>
          <div style="font-size:20px;font-weight:700;font-family:var(--mono);color:${niche.competition >= 90 ? 'var(--danger)' : niche.competition >= 80 ? 'var(--warning)' : 'var(--success)'};">${niche.competition}%</div>
          <div style="font-size:9px;color:var(--muted);">${niche.competition >= 90 ? 'Extrema' : niche.competition >= 80 ? 'Muy Alta' : 'Alta'}</div>
        </div>
      </div>

      <!-- Keywords -->
      <div style="background:var(--bg3);border:0.5px solid var(--border);border-radius:var(--radius);padding:12px;margin-bottom:12px;">
        <div style="font-size:10px;font-weight:600;color:var(--muted2);text-transform:uppercase;letter-spacing:0.03em;margin-bottom:6px;">🔑 Keywords Estratégicas</div>
        <div style="display:flex;gap:4px;flex-wrap:wrap;">
          ${niche.keywords.split(', ').map(k => `<span style="font-size:10px;padding:3px 8px;border-radius:4px;background:var(--bg4);color:var(--accent);">${k}</span>`).join('')}
        </div>
      </div>

      <!-- Content Angles -->
      <div style="background:var(--bg3);border:0.5px solid var(--border);border-radius:var(--radius);padding:12px;margin-bottom:12px;">
        <div style="font-size:10px;font-weight:600;color:var(--muted2);text-transform:uppercase;letter-spacing:0.03em;margin-bottom:6px;">📝 Ángulos de Contenido que Funcionan</div>
        <div style="font-size:12px;color:var(--text2);line-height:1.6;">${niche.contentAngles}</div>
      </div>

      <!-- Image Prompts -->
      <div style="background:var(--bg3);border:0.5px solid var(--border);border-radius:var(--radius);padding:12px;margin-bottom:12px;">
        <div style="font-size:10px;font-weight:600;color:var(--muted2);text-transform:uppercase;letter-spacing:0.03em;margin-bottom:6px;">🎨 Prompts de Imágenes (DALL·E / Midjourney)</div>
        <div style="display:flex;flex-direction:column;gap:4px;">
          ${imagePrompts.map((p, i) => `<div style="font-size:11px;color:var(--text2);padding:4px 8px;background:var(--bg4);border-radius:4px;font-family:var(--mono);">${i + 1}. "${p}" — estética limpia, iluminación natural, composición profesional, estilo editorial</div>`).join('')}
        </div>
        <button class="btn btn-xs btn-ghost" onclick="copyImagePrompts('${niche.id}')" style="font-size:10px;margin-top:6px;">📋 Copiar prompts</button>
      </div>

      <!-- SEO Silo Structure -->
      <div style="background:rgba(76,173,124,0.04);border:0.5px solid rgba(76,173,124,0.15);border-radius:var(--radius);padding:12px;margin-bottom:12px;">
        <div style="font-size:10px;font-weight:600;color:var(--success-bright);text-transform:uppercase;letter-spacing:0.03em;margin-bottom:8px;">🌿 Estructura de Silo SEO Sugerida</div>
        ${silos.map((s, i) => `
          <div style="margin-bottom:6px;padding-left:${s.level * 16}px;border-left:2px solid ${s.level === 0 ? 'var(--accent)' : s.level === 1 ? 'var(--success)' : 'var(--muted2)'};margin-left:${s.level * 8}px;padding-left:10px;">
            <div style="font-size:12px;font-weight:${s.level === 0 ? '600' : '400'};color:${s.level === 0 ? 'var(--accent)' : 'var(--text2)'};">${'─'.repeat(s.level > 0 ? 1 : 0)} ${s.name}</div>
            <div style="font-size:10px;color:var(--muted2);margin-top:1px;">${s.description}</div>
          </div>
        `).join('')}
      </div>

      <!-- Yield Projection Calculator -->
      <div style="background:var(--bg3);border:0.5px solid var(--border);border-radius:var(--radius);padding:14px;margin-bottom:12px;" id="cpc-calc-section">
        <div style="font-size:10px;font-weight:600;color:var(--accent);text-transform:uppercase;letter-spacing:0.03em;margin-bottom:10px;">🧮 Proyección de Ingresos</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px;">
          <div>
            <label style="font-size:10px;color:var(--muted);display:block;margin-bottom:4px;">Visitas diarias estimadas</label>
            <input type="number" id="cpc-calc-visits" value="1000" min="100" max="10000000"
              style="width:100%;background:var(--bg4);border:0.5px solid var(--border);border-radius:6px;padding:8px 10px;color:var(--text);font-size:12px;font-family:var(--mono);outline:none;"
              oninput="updateCPCProjection('${niche.id}')" />
          </div>
          <div>
            <label style="font-size:10px;color:var(--muted);display:block;margin-bottom:4px;">CTR AdSense estimado (%)</label>
            <input type="number" id="cpc-calc-ctr" value="2.5" min="0.1" max="20" step="0.1"
              style="width:100%;background:var(--bg4);border:0.5px solid var(--border);border-radius:6px;padding:8px 10px;color:var(--text);font-size:12px;font-family:var(--mono);outline:none;"
              oninput="updateCPCProjection('${niche.id}')" />
          </div>
        </div>
        <div id="cpc-projection-result" style="padding:12px;background:var(--bg4);border-radius:var(--radius);">
          <div style="font-size:11px;color:var(--muted2);text-align:center;">Ajusta los valores arriba para ver la proyección</div>
        </div>
      </div>

      <!-- Blogger / SEO Checklist -->
      <div style="background:rgba(92,140,224,0.04);border:0.5px solid rgba(92,140,224,0.15);border-radius:var(--radius);padding:12px;">
        <div style="font-size:10px;font-weight:600;color:var(--info-bright);text-transform:uppercase;letter-spacing:0.03em;margin-bottom:8px;">✅ Checklist Blogger — Indexación Rápida</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;font-size:11px;color:var(--text2);">
          <div>☐ Post &gt; 2000 palabras con silos internos</div>
          <div>☐ Imagen destacada con alt text optimizado</div>
          <div>☐ Keywords LSI en H2, H3 naturales</div>
          <div>☐ Internal linking a posts relacionados</div>
          <div>☐ Meta description &lt; 160 chars con keyword</div>
          <div>☐ Google Search Console - URL Inspection</div>
          <div>☐ Enlace desde red social (Pinterest/IG/TT)</div>
          <div>☐ Sitemap actualizado en Blogger</div>
          <div>☐ Velocidad de carga &lt; 2 seg (Cloudflare)</div>
          <div>☐ 1 backlink de calidad (Prensa/Foro)</div>
        </div>
      </div>
    </div>
  `;

  const footerHTML = `
    <button class="btn btn-sm btn-ghost" onclick="closeModal()">Cerrar</button>
    <button class="btn btn-sm btn-ghost" onclick="exportNichePDF('${niche.id}')" style="font-size:11px;">📄 PDF</button>
    <button class="btn btn-sm btn-primary" onclick="copyNicheReport('${niche.id}')" style="font-size:11px;">📋 Copiar Reporte</button>
  `;

  openModal('📊 ' + niche.name + ' — Análisis Completo', bodyHTML, footerHTML);
  setTimeout(() => updateCPCProjection(niche.id), 200);
}

/* ══════════════════════════════════════════════
   CONTENT SILO GENERATOR
   ══════════════════════════════════════════════ */

function generateSiloStructure(niche) {
  const pillarNames = {
    'Insurance': [`Guía Completa de ${niche.name}`, `Comparativa de ${niche.name} 2026`, `${niche.name} para Principiantes`],
    'Finance & Lending': [`Guía Definitiva de ${niche.name}`, `Mejores ${niche.name} del 2026`, `${niche.name}: Todo lo que Necesitas Saber`],
    'Legal': [`Guía Legal de ${niche.name}`, `${niche.name}: Derechos y Opciones`, `Cómo Navegar un Caso de ${niche.name}`],
    'Technology': [`Guía Completa de ${niche.name}`, `Top Herramientas de ${niche.name} 2026`, `${niche.name} para Empresas`],
    'Health & Wellness': [`Guía Completa de ${niche.name}`, `${niche.name}: Beneficios y Riesgos`, `Rutina de ${niche.name} para Empezar`],
    'Marketing & Business': [`Guía Definitiva de ${niche.name}`, `Estrategias de ${niche.name} que Funcionan`, `${niche.name} para Principiantes`],
    'Real Estate': [`Guía Completa para ${niche.name}`, `${niche.name}: Pasos Clave`, `Errores Comunes en ${niche.name}`],
    'Education': [`Guía de ${niche.name}`, `Mejores Recursos de ${niche.name}`, `${niche.name} en 2026`],
    'Crypto & Web3': [`Guía de ${niche.name}`, `Top Estrategias de ${niche.name}`, `${niche.name}: Lo que Debes Saber`],
    'Lifestyle': [`Guía de ${niche.name}`, `Consejos de ${niche.name} que Funcionan`, `${niche.name} para una Vida Mejor`],
    'Gaming': [`Guía de ${niche.name}`, `Tips de ${niche.name} para Ganar`, `${niche.name}: Lo Mejor del 2026`],
    'Travel': [`Guía de ${niche.name}`, `Consejos de ${niche.name} para Ahorrar`, `Los Mejores ${niche.name} del 2026`]
  };

  const pillar = (pillarNames[niche.cat] || [`Guía de ${niche.name}`, `Todo sobre ${niche.name}`, `${niche.name} 2026`]);

  return [
    { level: 0, name: `📌 ${pillar[0]} (Pilar)`, description: `Post principal que enlaza a todos los de abajo. 3000+ palabras.` },
    { level: 1, name: `📄 ${pillar[1]}`, description: `Análisis comparativo con datos actualizados. 2000+ palabras.` },
    { level: 1, name: `📄 ${pillar[2]}`, description: `Guía paso a paso para nuevos en el nicho. 2500+ palabras.` },
    { level: 2, name: `📄 Keywords LSI: ${niche.keywords.split(', ').slice(0, 3).join(', ')}`, description: `Post enfocado en keywords de cola larga. 1500+ palabras.` },
    { level: 2, name: `📄 Estadísticas y Datos del Nicho`, description: `Post data-driven con tablas y gráficos. 1800+ palabras.` },
    { level: 2, name: `📄 Preguntas Frecuentes (FAQ Schema)`, description: `Formato FAQ con Schema Markup para rich snippets.` },
    { level: 1, name: `📄 Guía de Monetización`, description: `Cómo ganar dinero en este nicho con AdSense + Monetag.` },
    { level: 2, name: `📄 Herramientas y Recursos`, description: `Review de herramientas útiles para el nicho. Afiliados.` },
    { level: 2, name: `📄 Casos de Éxito / Ejemplos`, description: `Ejemplos reales de personas/empresas en el nicho.` },
  ];
}

/* ══════════════════════════════════════════════
   YIELD CALCULATOR
   ══════════════════════════════════════════════ */

function updateCPCProjection(id) {
  const niche = CPC_NICHES.find(n => n.id === id);
  if (!niche) return;

  const visitsInput = document.getElementById('cpc-calc-visits');
  const ctrInput = document.getElementById('cpc-calc-ctr');
  const resultEl = document.getElementById('cpc-projection-result');
  if (!visitsInput || !ctrInput || !resultEl) return;

  const dailyVisits = parseInt(visitsInput.value) || 1000;
  const ctr = parseFloat(ctrInput.value) || 2.5;

  const dailyClicks = Math.round(dailyVisits * (ctr / 100));
  const cpcAvg = (niche.adsenseCPCLow + niche.adsenseCPCHigh) / 2;
  const dailyAdsense = dailyClicks * cpcAvg;
  const monthlyAdsense = dailyAdsense * 30;
  const yearlyAdsense = dailyAdsense * 365;

  const monetagFillRate = 0.35;
  const dailyMonetag = (dailyVisits * monetagFillRate / 1000) * niche.monetagCPM;
  const monthlyMonetag = dailyMonetag * 30;
  const yearlyMonetag = dailyMonetag * 365;

  const dailyTotal = dailyAdsense + dailyMonetag;
  const monthlyTotal = monthlyAdsense + monthlyMonetag;
  const yearlyTotal = yearlyAdsense + yearlyMonetag;

  const threeMonthTotal = monthlyTotal * 3;

  const fmt = (n) => {
    if (n >= 1000000) return '$' + (n / 1000000).toFixed(2) + 'M';
    if (n >= 1000) return '$' + (n / 1000).toFixed(1) + 'K';
    return '$' + n.toFixed(2);
  };

  resultEl.innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:8px;">
      <div style="text-align:center;">
        <div style="font-size:9px;color:var(--muted2);text-transform:uppercase;">Diario</div>
        <div style="font-size:18px;font-weight:700;font-family:var(--mono);color:var(--success-bright);">${fmt(dailyTotal)}</div>
      </div>
      <div style="text-align:center;">
        <div style="font-size:9px;color:var(--muted2);text-transform:uppercase;">Mensual</div>
        <div style="font-size:18px;font-weight:700;font-family:var(--mono);color:var(--accent);">${fmt(monthlyTotal)}</div>
        <div style="font-size:9px;color:var(--muted);">AdSense ${fmt(monthlyAdsense)} + Monetag ${fmt(monthlyMonetag)}</div>
      </div>
      <div style="text-align:center;">
        <div style="font-size:9px;color:var(--muted2);text-transform:uppercase;">3 Meses</div>
        <div style="font-size:18px;font-weight:700;font-family:var(--mono);color:${threeMonthTotal >= 1000000 ? 'var(--accent)' : 'var(--warning)'};">${fmt(threeMonthTotal)}</div>
        <div style="font-size:9px;color:var(--muted);">${dailyClicks} clics/día · ${dailyVisits.toLocaleString()} visits</div>
      </div>
    </div>
    <div style="margin-top:6px;padding:6px;background:var(--bg3);border-radius:4px;text-align:center;font-size:10px;color:var(--muted2);">
      CPC promedio: $${cpcAvg.toFixed(2)} · CTR: ${ctr}% · CPM Monetag: $${niche.monetagCPM} · Fill rate: 35%
    </div>
  `;
}

/* ══════════════════════════════════════════════
   YIELD CALCULATOR (standalone modal)
   ══════════════════════════════════════════════ */

function openCPCCalculator() {
  const topNiches = [...CPC_NICHES].sort((a, b) => b.combinedScore - a.combinedScore).slice(0, 10);

  openModal('🧮 Calculadora de Yield — Proyección', `
    <p style="font-size:12px;color:var(--muted);margin-bottom:14px;">Selecciona un nicho y ajusta el tráfico para ver tu proyección de ingresos combinados (AdSense + Monetag).</p>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px;">
      <div>
        <label style="font-size:10px;color:var(--muted);display:block;margin-bottom:4px;">Nicho</label>
        <select id="calc-niche" style="width:100%;background:var(--bg3);border:0.5px solid var(--border);border-radius:6px;padding:8px 10px;color:var(--text);font-size:12px;font-family:var(--font);outline:none;" onchange="updateCalcProjection()">
          ${topNiches.map(n => `<option value="${n.id}">${n.icon} ${n.name} (Yield ${n.combinedScore})</option>`).join('')}
        </select>
      </div>
      <div>
        <label style="font-size:10px;color:var(--muted);display:block;margin-bottom:4px;">Visitas diarias</label>
        <input type="number" id="calc-visits" value="5000" min="100" style="width:100%;background:var(--bg3);border:0.5px solid var(--border);border-radius:6px;padding:8px 10px;color:var(--text);font-size:12px;font-family:var(--mono);outline:none;" oninput="updateCalcProjection()" />
      </div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px;">
      <div>
        <label style="font-size:10px;color:var(--muted);display:block;margin-bottom:4px;">CTR AdSense (%)</label>
        <input type="number" id="calc-ctr" value="2.5" min="0.1" max="20" step="0.1" style="width:100%;background:var(--bg3);border:0.5px solid var(--border);border-radius:6px;padding:8px 10px;color:var(--text);font-size:12px;font-family:var(--mono);outline:none;" oninput="updateCalcProjection()" />
      </div>
      <div>
        <label style="font-size:10px;color:var(--muted);display:block;margin-bottom:4px;">Posts necesarios para tráfico</label>
        <input type="number" id="calc-posts" value="10" min="1" max="1000" style="width:100%;background:var(--bg3);border:0.5px solid var(--border);border-radius:6px;padding:8px 10px;color:var(--text);font-size:12px;font-family:var(--mono);outline:none;" oninput="updateCalcProjection()" />
      </div>
    </div>
    <div id="calc-result" style="padding:14px;background:var(--bg3);border-radius:var(--radius);text-align:center;">
      <div style="font-size:11px;color:var(--muted2);">Ajusta los valores para ver la proyección</div>
    </div>
    <div style="margin-top:14px;padding:10px;background:rgba(201,169,110,0.06);border:0.5px solid rgba(201,169,110,0.15);border-radius:var(--radius);font-size:11px;color:var(--muted);line-height:1.5;">
      💡 <strong>Estrategia:</strong> Con 10 posts bien optimizados (silo + keywords + imágenes) puedes alcanzar 5,000 visits/día orgánicas en 3-6 meses en nichos de competencia media-alta. En nichos de alta competencia (Insurance) necesitas +30 posts + backlinks.
    </div>
  `, `
    <button class="btn btn-sm btn-ghost" onclick="closeModal()">Cerrar</button>
  `);

  setTimeout(() => updateCalcProjection(), 200);
}

function updateCalcProjection() {
  const nicheId = document.getElementById('calc-niche')?.value;
  const visits = parseInt(document.getElementById('calc-visits')?.value) || 5000;
  const ctr = parseFloat(document.getElementById('calc-ctr')?.value) || 2.5;
  const posts = parseInt(document.getElementById('calc-posts')?.value) || 10;
  const resultEl = document.getElementById('calc-result');
  if (!nicheId || !resultEl) return;

  const niche = CPC_NICHES.find(n => n.id === nicheId);
  if (!niche) return;

  const cpcAvg = (niche.adsenseCPCLow + niche.adsenseCPCHigh) / 2;
  const dailyClicks = Math.round(visits * (ctr / 100));
  const dailyAdsense = dailyClicks * cpcAvg;
  const monthlyAdsense = dailyAdsense * 30;
  const yearlyAdsense = dailyAdsense * 365;

  const dailyMonetag = (visits * 0.35 / 1000) * niche.monetagCPM;
  const monthlyMonetag = dailyMonetag * 30;

  const monthlyTotal = monthlyAdsense + monthlyMonetag;
  const yearlyTotal = monthlyTotal * 12;
  const threeMonthTotal = monthlyTotal * 3;
  const revenuePerPost = monthlyTotal / posts;

  const fmt = (n) => {
    if (n >= 1000000) return '$' + (n / 1000000).toFixed(2) + 'M';
    if (n >= 1000) return '$' + (n / 1000).toFixed(1) + 'K';
    return '$' + n.toFixed(2);
  };

  resultEl.innerHTML = `
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:10px;">
      <div>
        <div style="font-size:9px;color:var(--muted2);text-transform:uppercase;">Mensual</div>
        <div style="font-size:22px;font-weight:700;font-family:var(--mono);color:var(--accent);">${fmt(monthlyTotal)}</div>
      </div>
      <div>
        <div style="font-size:9px;color:var(--muted2);text-transform:uppercase;">3 Meses 🎯</div>
        <div style="font-size:22px;font-weight:700;font-family:var(--mono);color:${threeMonthTotal >= 1000000 ? 'var(--accent)' : 'var(--warning)'};">${fmt(threeMonthTotal)}</div>
      </div>
      <div>
        <div style="font-size:9px;color:var(--muted2);text-transform:uppercase;">Por Post/mes</div>
        <div style="font-size:18px;font-weight:700;font-family:var(--mono);color:var(--info-bright);">${fmt(revenuePerPost)}</div>
      </div>
    </div>
    <div style="font-size:10px;color:var(--muted2);">
      ${dailyClicks} clics/día · ${visits.toLocaleString()} visits · CPC $${cpcAvg.toFixed(2)} · ${posts} posts · ${fmt(monthlyAdsense)} AdSense + ${fmt(monthlyMonetag)} Monetag
    </div>
    <div style="margin-top:8px;height:4px;background:var(--bg4);border-radius:2px;overflow:hidden;">
      <div style="height:100%;width:${Math.min(100, (threeMonthTotal / 25000000) * 100)}%;background:linear-gradient(90deg, var(--success), var(--accent));border-radius:2px;transition:width 0.4s;"></div>
    </div>
    <div style="font-size:9px;color:var(--muted2);margin-top:4px;">
      🎯 Meta $25M: ${threeMonthTotal >= 25000000 ? '✅ ¡ALCANZADO!' : 'Necesitas ' + fmt(25000000 - threeMonthTotal) + ' más — escala a ' + Math.round(25000000 / (monthlyTotal / 30) / 30) + 'K visits/día'}
    </div>
  `;
}

/* ══════════════════════════════════════════════
   EXPORT & UTILITY FUNCTIONS
   ══════════════════════════════════════════════ */

function copyImagePrompts(id) {
  const niche = CPC_NICHES.find(n => n.id === id);
  if (!niche) return;
  const prompts = niche.imagePrompts.split(', ').map(s => s.trim()).filter(Boolean);
  const text = prompts.map((p, i) => `${i + 1}. "${p}" — estética limpia, iluminación natural, composición profesional, estilo editorial`).join('\n');
  navigator.clipboard.writeText(text);
  showCPCToast('✅ Prompts copiados');
}

function copyNicheReport(id) {
  const niche = CPC_NICHES.find(n => n.id === id);
  if (!niche) return;
  const text = `📊 REPORTE DE NICHO: ${niche.name}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Categoría: ${niche.cat}
CPC AdSense: $${niche.adsenseCPCLow} — $${niche.adsenseCPCHigh}
CPM Monetag: $${niche.monetagCPM}
Competencia: ${niche.competition}%
Yield Score: ${niche.combinedScore}
Keywords: ${niche.keywords}
Ángulos de contenido: ${niche.contentAngles}
Prompts de imágenes: ${niche.imagePrompts}`;
  navigator.clipboard.writeText(text);
  showCPCToast('✅ Reporte copiado');
}

function exportNichePDF(id) {
  const niche = CPC_NICHES.find(n => n.id === id);
  if (!niche) return;

  try {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    const PAGE_W = 210;
    const PAGE_H = 297;
    const MARGIN = 18;
    const CONTENT_W = PAGE_W - MARGIN * 2;
    const FONT = 'helvetica';
    const GOLD = [201, 169, 110];
    const DARK_BG = [13, 13, 15];
    const DARK2 = [22, 22, 26];
    const DARK3 = [30, 30, 36];
    const TEXT = [240, 237, 232];
    const TEXT2 = [208, 204, 198];
    const MUTED = [122, 120, 117];
    const MUTED2 = [90, 88, 85];
    const SUCCESS = [46, 204, 113];
    const INFO = [77, 171, 247];
    const DANGER = [224, 92, 92];
    const ACCENT = [201, 169, 110];

    let y = MARGIN;

    // ── Helper: draw filled rect ──
    function rect(x, yy, w, h, color) {
      doc.setFillColor(...color);
      doc.rect(x, yy, w, h, 'F');
    }

    // ── Helper: section title ──
    function sectionTitle(text, yy) {
      rect(MARGIN, yy, 4, 12, GOLD);
      doc.setFont(FONT, 'bold');
      doc.setFontSize(11);
      doc.setTextColor(...TEXT);
      doc.text(text, MARGIN + 8, yy + 9);
      return yy + 16;
    }

    // ── Check page space ──
    function checkSpace(needed) {
      if (y + needed > PAGE_H - MARGIN - 10) {
        doc.addPage();
        y = MARGIN;
        // subtle page header
        rect(MARGIN, y, CONTENT_W, 0.5, GOLD);
        y += 6;
      }
    }

    /* ═══════════════════════════════════════════════
       PAGE 1 — HEADER & METRICS
       ═══════════════════════════════════════════════ */

    // Dark header bar
    rect(MARGIN, y, CONTENT_W, 28, DARK2);
    rect(MARGIN, y, CONTENT_W, 0.8, GOLD);

    // Logo area (gold square with NA)
    rect(MARGIN + 4, y + 4, 20, 20, GOLD);
    doc.setFont(FONT, 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...DARK_BG);
    doc.text('NA', MARGIN + 9, y + 17);

    // Title
    doc.setFont(FONT, 'bold');
    doc.setFontSize(14);
    doc.setTextColor(...TEXT);
    doc.text('Nuclear AIMA — CPC Report', MARGIN + 30, y + 12);
    doc.setFont(FONT, 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...MUTED);
    doc.text('Investigador de Nichos · Generado ' + new Date().toLocaleDateString('es-DO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }), MARGIN + 30, y + 21);

    y += 36;

    // ── Niche Header ──
    checkSpace(30);

    // Niche name + category banner
    rect(MARGIN, y, CONTENT_W, 22, DARK3);
    doc.setFont(FONT, 'bold');
    doc.setFontSize(16);
    doc.setTextColor(...GOLD);
    doc.text(niche.name, MARGIN + 10, y + 14);
    doc.setFont(FONT, 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...MUTED);
    doc.text(niche.cat, MARGIN + 10, y + 20);

    // Yield score badge (right side)
    const scoreText = 'Yield ' + niche.combinedScore;
    const scoreW = doc.getStringUnitWidth(scoreText) * 9 + 12;
    const scoreX = PAGE_W - MARGIN - scoreW - 6;
    rect(scoreX, y + 3, scoreW, 16, GOLD);
    doc.setFont(FONT, 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...DARK_BG);
    doc.text(scoreText, scoreX + scoreW / 2, y + 14, { align: 'center' });

    y += 30;

    // ── Metrics Grid (3 cols) ──
    checkSpace(50);
    y = sectionTitle('📊 Métricas Clave', y);

    const colW = (CONTENT_W - 6) / 3;
    const metrics = [
      { label: 'AdSense CPC', value: '$' + niche.adsenseCPCLow + ' — $' + niche.adsenseCPCHigh, sub: 'por clic · Tier 1', color: SUCCESS },
      { label: 'Monetag CPM', value: '$' + niche.monetagCPM + '.00', sub: 'por 1000 impresiones', color: INFO },
      { label: 'Competencia', value: niche.competition + '%', sub: niche.competition >= 90 ? 'Extrema' : niche.competition >= 80 ? 'Muy Alta' : 'Alta', color: niche.competition >= 90 ? DANGER : niche.competition >= 80 ? [224, 184, 92] : SUCCESS },
    ];

    metrics.forEach((m, i) => {
      const cx = MARGIN + i * (colW + 3);
      rect(cx, y, colW, 32, DARK2);
      doc.setFont(FONT, 'bold');
      doc.setFontSize(7);
      doc.setTextColor(...MUTED2);
      doc.text(m.label, cx + 4, y + 7);
      doc.setFont(FONT, 'bold');
      doc.setFontSize(13);
      doc.setTextColor(...m.color);
      doc.text(m.value, cx + 4, y + 20);
      doc.setFont(FONT, 'normal');
      doc.setFontSize(7);
      doc.setTextColor(...MUTED);
      doc.text(m.sub, cx + 4, y + 27);
    });

    y += 40;

    // ── Extended Metrics Row (2 cols) ──
    checkSpace(38);
    const extMetrics = [
      { label: '🌿 Evergreen Score', value: niche.evergreen + '/100' },
      { label: '👥 Potencial de Tráfico', value: niche.trafficPotential + '/100' },
    ];
    const halfW = (CONTENT_W - 3) / 2;
    extMetrics.forEach((m, i) => {
      const cx = MARGIN + i * (halfW + 3);
      rect(cx, y, halfW, 24, DARK2);
      doc.setFont(FONT, 'bold');
      doc.setFontSize(7);
      doc.setTextColor(...MUTED2);
      doc.text(m.label, cx + 4, y + 7);
      doc.setFont(FONT, 'bold');
      doc.setFontSize(12);
      doc.setTextColor(...GOLD);
      doc.text(m.value, cx + 4, y + 19);
    });
    y += 32;

    /* ═══════════════════════════════════════════════
       PAGE 2 — KEYWORDS & CONTENT
       ═══════════════════════════════════════════════ */

    checkSpace(40);
    y = sectionTitle('🔑 Keywords Estratégicas', y);
    const kwList = niche.keywords.split(', ').filter(Boolean);
    kwList.forEach((kw, i) => {
      const kx = MARGIN + (i % 2) * (CONTENT_W / 2 + 2);
      const ky = y + Math.floor(i / 2) * 6;
      if (ky + 6 > PAGE_H - MARGIN) {
        doc.addPage();
        y = MARGIN;
      }
      doc.setFont(FONT, 'normal');
      doc.setFontSize(8);
      doc.setTextColor(...ACCENT);
      doc.text('▸ ' + kw, kx + 2, ky + 4);
    });
    y += Math.ceil(kwList.length / 2) * 6 + 8;

    // ── Content Angles ──
    checkSpace(30);
    y = sectionTitle('📝 Ángulos de Contenido', y);
    const angles = niche.contentAngles.split(', ').filter(Boolean);
    angles.forEach((a, i) => {
      checkSpace(5);
      doc.setFont(FONT, 'normal');
      doc.setFontSize(9);
      doc.setTextColor(...TEXT2);
      doc.text((i + 1) + '.  ' + a, MARGIN + 4, y + 4);
      y += 5;
    });
    y += 8;

    // ── Image Prompts ──
    checkSpace(30);
    y = sectionTitle('🎨 Prompts de Imágenes (DALL·E / Midjourney)', y);
    const prompts = niche.imagePrompts.split(', ').filter(Boolean);
    prompts.forEach((p, i) => {
      checkSpace(8);
      rect(MARGIN, y, CONTENT_W, 6, DARK2);
      doc.setFont(FONT, 'normal');
      doc.setFontSize(7);
      doc.setTextColor(...TEXT2);
      const promptText = (i + 1) + '. "' + p + '" — estética limpia, iluminación natural, composición profesional, estilo editorial';
      const lines = doc.splitTextToSize(promptText, CONTENT_W - 8);
      doc.text(lines, MARGIN + 4, y + 4);
      y += Math.max(7, lines.length * 4 + 2);
    });
    y += 6;

    /* ═══════════════════════════════════════════════
       PAGE 3 — SILO STRUCTURE & PROJECTION
       ═══════════════════════════════════════════════ */

    doc.addPage();
    y = MARGIN;

    // ── Silo Structure ──
    const silos = generateSiloStructure(niche);
    y = sectionTitle('🌿 Estructura de Silo SEO', y);

    silos.forEach((s) => {
      checkSpace(10);
      const indent = MARGIN + 4 + s.level * 8;
      // colored bar on the left
      const barColor = s.level === 0 ? GOLD : s.level === 1 ? SUCCESS : MUTED2;
      rect(indent - 3, y, 2, 8, barColor);

      doc.setFont(FONT, s.level === 0 ? 'bold' : 'normal');
      doc.setFontSize(s.level === 0 ? 10 : 9);
      doc.setTextColor(s.level === 0 ? GOLD : TEXT2);
      doc.text(s.name, indent + 4, y + 6);

      doc.setFont(FONT, 'normal');
      doc.setFontSize(7);
      doc.setTextColor(...MUTED);
      doc.text(s.description, indent + 4, y + 6 + (s.level === 0 ? 6 : 5));

      y += s.level === 0 ? 14 : 11;
    });

    y += 10;

    // ── Income Projection Table ──
    checkSpace(40);
    y = sectionTitle('💰 Proyección de Ingresos', y);

    const cpcAvg = (niche.adsenseCPCLow + niche.adsenseCPCHigh) / 2;
    const dailyClicks = Math.round(1000 * 0.025);
    const dailyAdsense = dailyClicks * cpcAvg;
    const monthlyAdsense = dailyAdsense * 30;
    const dailyMonetag = (1000 * 0.35 / 1000) * niche.monetagCPM;
    const monthlyMonetag = dailyMonetag * 30;
    const monthlyTotal = monthlyAdsense + monthlyMonetag;
    const threeMonthTotal = monthlyTotal * 3;

    // Table header
    rect(MARGIN, y, CONTENT_W, 8, GOLD);
    doc.setFont(FONT, 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...DARK_BG);
    doc.text('Concepto', MARGIN + 4, y + 6);
    doc.text('Diario', MARGIN + 90, y + 6, { align: 'right' });
    doc.text('Mensual', MARGIN + 120, y + 6, { align: 'right' });
    doc.text('3 Meses', MARGIN + 150, y + 6, { align: 'right' });
    doc.text('Anual', MARGIN + 180, y + 6, { align: 'right' });

    y += 10;

    // Table rows
    const fmt = (n) => {
      if (n >= 1000000) return '$' + (n / 1000000).toFixed(2) + 'M';
      if (n >= 1000) return '$' + (n / 1000).toFixed(1) + 'K';
      return '$' + n.toFixed(2);
    };

    const rows = [
      { label: 'AdSense', daily: dailyAdsense, monthly: monthlyAdsense, three: monthlyAdsense * 3, yearly: dailyAdsense * 365, color: SUCCESS },
      { label: 'Monetag', daily: dailyMonetag, monthly: monthlyMonetag, three: monthlyMonetag * 3, yearly: dailyMonetag * 365, color: INFO },
    ];

    rows.forEach((r, ri) => {
      rect(MARGIN, y, CONTENT_W, 7, ri % 2 === 0 ? DARK2 : DARK3);
      doc.setFont(FONT, 'normal');
      doc.setFontSize(9);
      doc.setTextColor(...r.color);
      doc.text(r.label, MARGIN + 4, y + 5);
      doc.setTextColor(...TEXT2);
      doc.setFont(FONT, 'bold');
      doc.setFontSize(8);
      doc.text(fmt(r.daily), MARGIN + 90, y + 5, { align: 'right' });
      doc.text(fmt(r.monthly), MARGIN + 120, y + 5, { align: 'right' });
      doc.text(fmt(r.three), MARGIN + 150, y + 5, { align: 'right' });
      doc.text(fmt(r.yearly), MARGIN + 180, y + 5, { align: 'right' });
      y += 8;
    });

    // Total row
    rect(MARGIN, y, CONTENT_W, 8, GOLD);
    doc.setFont(FONT, 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...DARK_BG);
    doc.text('TOTAL', MARGIN + 4, y + 6);
    doc.text(fmt(dailyAdsense + dailyMonetag), MARGIN + 90, y + 6, { align: 'right' });
    doc.text(fmt(monthlyTotal), MARGIN + 120, y + 6, { align: 'right' });
    doc.text(fmt(threeMonthTotal), MARGIN + 150, y + 6, { align: 'right' });
    doc.text(fmt((dailyAdsense + dailyMonetag) * 365), MARGIN + 180, y + 6, { align: 'right' });

    y += 14;

    // ── Configuration note ──
    checkSpace(12);
    rect(MARGIN, y, CONTENT_W, 10, DARK2);
    doc.setFont(FONT, 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...MUTED);
    doc.text('Basado en 1,000 visits/día · CTR 2.5% · Monetag fill rate 35% · CPC promedio $' + cpcAvg.toFixed(2), MARGIN + 4, y + 7);
    y += 16;

    // ── Generate page numbers + top lines on all pages ──
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFont(FONT, 'normal');
      doc.setFontSize(6);
      doc.setTextColor(...MUTED2);
      doc.text('Nuclear AIMA · CPC Report · ' + niche.name, MARGIN, PAGE_H - MARGIN - 5);
      doc.text('Pág ' + i + ' de ' + totalPages, PAGE_W - MARGIN, PAGE_H - MARGIN - 5, { align: 'right' });
      // Top subtle line
      rect(MARGIN, MARGIN - 2, CONTENT_W, 0.3, MUTED2);
    }

    // ── Save ──
    doc.save('CPC-Report-' + niche.name.replace(/[^a-zA-Z0-9]/g, '_') + '-' + new Date().toISOString().split('T')[0] + '.pdf');
    showCPCToast('📄 PDF generado: ' + niche.name);

  } catch (e) {
    console.error('PDF export error:', e);
    showCPCToast('⚠️ Error generando PDF: ' + e.message);
  }
}

function exportCPCCSV() {
  const BOM = '\uFEFF';
  const headers = ['Nicho', 'Categoría', 'CPC Low', 'CPC High', 'CPC Avg', 'CPM Monetag', 'Competencia', 'Evergreen', 'Tráfico', 'Yield Score', 'Keywords'];
  const rows = CPC_NICHES.map(n => [
    `"${n.name}"`,
    `"${n.cat}"`,
    n.adsenseCPCLow,
    n.adsenseCPCHigh,
    n.cpcAvg.toFixed(2),
    n.monetagCPM,
    n.competition,
    n.evergreen,
    n.trafficPotential,
    n.combinedScore,
    `"${n.keywords}"`
  ].join(','));

  const csv = BOM + headers.join(',') + '\n' + rows.join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'cpc-niches-' + new Date().toISOString().split('T')[0] + '.csv';
  a.click();
  showCPCToast('📥 CSV exportado — ' + CPC_NICHES.length + ' nichos');
}

/* ══════════════════════════════════════════════
   FULL AUDIT — Run across all modules
   ══════════════════════════════════════════════ */

function runFullAudit() {
  const totalNiches = CPC_NICHES.length;
  const totalDorks = typeof DORKS !== 'undefined' ? DORKS.length : '—';
  const topNiche = CPC_NICHES.reduce((a, b) => a.combinedScore > b.combinedScore ? a : b);
  const avgCPC = (CPC_NICHES.reduce((s, n) => s + n.cpcAvg, 0) / totalNiches).toFixed(1);

  openModal('⚡ Full Audit — CPC Investigator', `
    <div style="font-size:13px;line-height:1.7;">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px;">
        <div style="background:var(--bg3);border-radius:var(--radius);padding:14px;text-align:center;">
          <div style="font-size:9px;color:var(--muted2);text-transform:uppercase;">Nichos Analizados</div>
          <div style="font-size:24px;font-weight:700;font-family:var(--mono);color:var(--accent);">${totalNiches}</div>
          <div style="font-size:10px;color:var(--muted);">en ${CPC_CATEGORIES.length} categorías</div>
        </div>
        <div style="background:var(--bg3);border-radius:var(--radius);padding:14px;text-align:center;">
          <div style="font-size:9px;color:var(--muted2);text-transform:uppercase;">Dorks Disponibles</div>
          <div style="font-size:24px;font-weight:700;font-family:var(--mono);color:var(--info-bright);">${totalDorks}</div>
          <div style="font-size:10px;color:var(--muted);">en ${typeof DORK_CATEGORIES !== 'undefined' ? DORK_CATEGORIES.length : '—'} categorías</div>
        </div>
      </div>

      <div style="background:var(--bg3);border:0.5px solid var(--border);border-radius:var(--radius);padding:14px;margin-bottom:12px;">
        <div style="font-size:10px;font-weight:600;color:var(--accent);text-transform:uppercase;margin-bottom:8px;">🏆 Top Oportunidades</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
          <div><span style="color:var(--muted2);font-size:11px;">Mejor Nicho:</span> <span style="color:var(--accent);font-weight:600;">${topNiche.name}</span> <span style="font-size:9px;color:var(--muted2);">(${topNiche.cat} · Yield ${topNiche.combinedScore})</span></div>
          <div><span style="color:var(--muted2);font-size:11px;">CPC Promedio:</span> <span style="color:var(--success-bright);font-weight:600;">$${avgCPC}</span></div>
          <div><span style="color:var(--muted2);font-size:11px;">CPM Promedio:</span> <span style="color:var(--info-bright);font-weight:600;">$${(CPC_NICHES.reduce((s, n) => s + n.monetagCPM, 0) / totalNiches).toFixed(1)}</span></div>
          <div><span style="color:var(--muted2);font-size:11px;">Nicho más evergreen:</span> <span style="color:var(--success-bright);font-weight:600;">${CPC_NICHES.reduce((a, b) => a.evergreen > b.evergreen ? a : b).name}</span></div>
        </div>
      </div>

      <div style="background:var(--bg3);border:0.5px solid var(--border);border-radius:var(--radius);padding:14px;">
        <div style="font-size:10px;font-weight:600;color:var(--text2);text-transform:uppercase;margin-bottom:8px;">⚡ Estrategia Recomendada</div>
        <div style="font-size:11px;color:var(--text2);line-height:1.6;">
          1. Usa el <strong style="color:var(--info-bright);">Dorking Engine</strong> para encontrar content gaps en ${topNiche.cat.toLowerCase()}<br>
          2. Analiza competidores con <strong style="color:var(--purple-bright);">OSINT Recon</strong><br>
          3. Genera contenido viral con <strong style="color:var(--danger);">Viral Hunter</strong><br>
          4. Optimiza monetización con <strong style="color:var(--orange-bright);">Data Arbitrage</strong><br>
          5. Usa la <strong style="color:var(--accent);">Calculadora de Yield</strong> para proyectar ingresos
        </div>
      </div>
    </div>
  `);
}

/* ── Toast ── */
let cpcToastTimer = null;

function showCPCToast(msg) {
  let toast = document.getElementById('cpc-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'cpc-toast';
    toast.style.cssText = 'position:fixed;bottom:20px;right:20px;background:var(--bg3);border:0.5px solid var(--border);border-radius:var(--radius);padding:10px 16px;font-size:12px;color:var(--text);z-index:9999;box-shadow:0 4px 20px rgba(0,0,0,0.4);transition:opacity 0.3s;max-width:320px;';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = '1';
  clearTimeout(cpcToastTimer);
  cpcToastTimer = setTimeout(() => { toast.style.opacity = '0'; }, 2500);
}

console.log('📊 CPC Investigator v2.0 loaded — ' + CPC_NICHES.length + ' nichos · 3 módulos integrados');
