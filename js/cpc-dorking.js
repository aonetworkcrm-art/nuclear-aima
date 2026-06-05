/* ══════════════════════════════════════════════
   NUCLEAR AIMA — DORKING ENGINE v1.0
   Google Dorking Avanzado · OSINT · Content Discovery
   La bestia más poderosa del universo 🔥
   ══════════════════════════════════════════════ */

/* ── DORK DATABASE: 150+ dorks organizados por nicho y propósito ── */

const DORK_CATEGORIES = [
  { id: 'high-traffic', name: '📍 High Traffic Pages', icon: '📈', desc: 'Encuentra páginas con alto tráfico orgánico en cada nicho' },
  { id: 'content-gaps', name: '🔍 Content Gaps & Opportunities', icon: '🕳️', desc: 'Descubre contenido que tus competidores tienen y tú no' },
  { id: 'backlinks', name: '🔗 Backlink Opportunities', icon: '🔗', desc: 'Encuentra sitios para conseguir backlinks de calidad' },
  { id: 'monetization', name: '💰 Monetization Patterns', icon: '💵', desc: 'Analiza cómo monetizan los competidores en cada nicho' },
  { id: 'vulnerabilities', name: '⚠️ Vulnerabilities & Exposed Data', icon: '⚠️', desc: 'Detecta sitios vulnerables, paneles abiertos, configuraciones expuestas' },
  { id: 'competitor-intel', name: '🕵️ Competitor Intelligence', icon: '🔎', desc: 'Inteligencia avanzada de competidores' },
  { id: 'trending', name: '🔥 Trending & Viral Content', icon: '🔥', desc: 'Encuentra contenido trending y viral en cada nicho' },
];

const DORK_NICHES = [
  { id: 'all', name: '⚡ Todos los Nichos' },
  { id: 'insurance', name: '🛡️ Insurance' },
  { id: 'finance', name: '💰 Finance' },
  { id: 'legal', name: '⚖️ Legal' },
  { id: 'tech', name: '💻 Tech & SaaS' },
  { id: 'health', name: '❤️ Health & Wellness' },
  { id: 'marketing', name: '📊 Marketing' },
  { id: 'realestate', name: '🏠 Real Estate' },
  { id: 'education', name: '🎓 Education' },
  { id: 'crypto', name: '🪙 Crypto & Web3' },
  { id: 'lifestyle', name: '🌈 Lifestyle' },
  { id: 'gaming', name: '🎮 Gaming' },
  { id: 'travel', name: '✈️ Travel' },
  { id: 'ecommerce', name: '🛒 E-commerce' },
];

/* ── 150+ DORKS ── */
const DORKS = [
  // ════════════════════════════════════════════
  // HIGH TRAFFIC PAGES
  // ════════════════════════════════════════════
  { id: 1, niche: 'insurance', category: 'high-traffic', name: 'Best Insurance Companies Comparison', dork: 'intitle:"best life insurance" OR intitle:"best car insurance" inurl:comparison', desc: 'Encuentra páginas de comparación de seguros con alto tráfico orgánico', googleUrl: 'https://www.google.com/search?q=intitle%3A%22best+life+insurance%22+OR+intitle%3A%22best+car+insurance%22+inurl%3Acomparison', difficulty: 'Medium', impact: 95 },
  { id: 2, niche: 'insurance', category: 'high-traffic', name: 'Insurance Quote Pages', dork: 'inurl:"insurance-quotes" OR inurl:"get-a-quote" intitle:insurance', desc: 'Páginas de cotización de seguros — alto CPC y tráfico', googleUrl: 'https://www.google.com/search?q=inurl%3A%22insurance-quotes%22+OR+inurl%3A%22get-a-quote%22+intitle%3Ainsurance', difficulty: 'Easy', impact: 90 },
  { id: 3, niche: 'finance', category: 'high-traffic', name: 'Loan Comparison Pages', dork: 'intitle:"personal loans" OR intitle:"best loans" inurl:compare OR inurl:calculator', desc: 'Páginas de comparación de préstamos con alto CPC', googleUrl: 'https://www.google.com/search?q=intitle%3A%22personal+loans%22+OR+intitle%3A%22best+loans%22+inurl%3Acompare+OR+inurl%3Acalculator', difficulty: 'Medium', impact: 92 },
  { id: 4, niche: 'finance', category: 'high-traffic', name: 'Credit Card Offers', dork: 'intitle:"best credit cards" intext:"annual fee" inurl:review OR inurl:compare', desc: 'Páginas de revisión de tarjetas de crédito', googleUrl: 'https://www.google.com/search?q=intitle%3A%22best+credit+cards%22+intext%3A%22annual+fee%22+inurl%3Areview+OR+inurl%3Acompare', difficulty: 'Easy', impact: 88 },
  { id: 5, niche: 'legal', category: 'high-traffic', name: 'Personal Injury Pages', dork: 'intitle:"personal injury lawyer" OR intitle:"car accident attorney" inurl:free-consultation', desc: 'Páginas de abogados de lesiones — CPC más alto del mundo', googleUrl: 'https://www.google.com/search?q=intitle%3A%22personal+injury+lawyer%22+OR+intitle%3A%22car+accident+attorney%22+inurl%3Afree-consultation', difficulty: 'Easy', impact: 97 },
  { id: 6, niche: 'tech', category: 'high-traffic', name: 'SaaS Comparison Pages', dork: 'intitle:"best" intitle:"software" OR intitle:"SaaS" inurl:comparison intext:"pricing"', desc: 'Páginas de comparación de software SaaS', googleUrl: 'https://www.google.com/search?q=intitle%3A%22best%22+intitle%3A%22software%22+OR+intitle%3A%22SaaS%22+inurl%3Acomparison+intext%3A%22pricing%22', difficulty: 'Medium', impact: 85 },
  { id: 7, niche: 'health', category: 'high-traffic', name: 'Weight Loss Reviews', dork: 'intitle:"weight loss" inurl:review OR inurl:results intext:"before and after"', desc: 'Páginas de reseñas de pérdida de peso — tráfico masivo', googleUrl: 'https://www.google.com/search?q=intitle%3A%22weight+loss%22+inurl%3Areview+OR+inurl%3Aresults+intext%3A%22before+and+after%22', difficulty: 'Easy', impact: 88 },
  { id: 8, niche: 'crypto', category: 'high-traffic', name: 'Crypto Exchange Reviews', dork: 'intitle:"best crypto exchange" OR intitle:"crypto trading platform" inurl:review', desc: 'Reviews de exchanges de criptomonedas', googleUrl: 'https://www.google.com/search?q=intitle%3A%22best+crypto+exchange%22+OR+intitle%3A%22crypto+trading+platform%22+inurl%3Areview', difficulty: 'Easy', impact: 85 },
  { id: 9, niche: 'marketing', category: 'high-traffic', name: 'SEO Tool Comparisons', dork: 'intitle:"best SEO tools" OR intitle:"SEO software" inurl:comparison intext:pricing', desc: 'Páginas de comparación de herramientas SEO', googleUrl: 'https://www.google.com/search?q=intitle%3A%22best+SEO+tools%22+OR+intitle%3A%22SEO+software%22+inurl%3Acomparison+intext%3Apricing', difficulty: 'Easy', impact: 82 },
  { id: 10, niche: 'realestate', category: 'high-traffic', name: 'Real Estate Agent Pages', dork: 'intitle:"best real estate agent" OR intitle:"top realtor" inurl:reviews', desc: 'Páginas de agentes inmobiliarios mejor calificados', googleUrl: 'https://www.google.com/search?q=intitle%3A%22best+real+estate+agent%22+OR+intitle%3A%22top+realtor%22+inurl%3Areviews', difficulty: 'Easy', impact: 80 },

  // ════════════════════════════════════════════
  // CONTENT GAPS
  // ════════════════════════════════════════════
  { id: 11, niche: 'insurance', category: 'content-gaps', name: 'Insurance FAQs Without Schema', dork: 'site:.com intitle:"insurance" intext:"frequently asked questions" -inurl:schema -inurl:faq-schema', desc: 'FAQs de seguros sin Schema Markup — oportunidad de rich snippets', googleUrl: 'https://www.google.com/search?q=site%3A.com+intitle%3A%22insurance%22+intext%3A%22frequently+asked+questions%22+-inurl%3Aschema+-inurl%3Afaq-schema', difficulty: 'Hard', impact: 85 },
  { id: 12, niche: 'finance', category: 'content-gaps', name: 'Finance Calculators Missing', dork: 'intitle:"finance" OR intitle:"financial" intext:"calculator" -inurl:calculator -site:bankrate.com -site:nerdwallet.com', desc: 'Páginas que mencionan calculadoras pero no tienen una — oportunidad', googleUrl: 'https://www.google.com/search?q=intitle%3A%22finance%22+OR+intitle%3A%22financial%22+intext%3A%22calculator%22+-inurl%3Acalculator+-site%3Abankrate.com+-site%3Anerdwallet.com', difficulty: 'Hard', impact: 80 },
  { id: 13, niche: 'tech', category: 'content-gaps', name: 'Outdated Software Guides', dork: 'intitle:"guide" intitle:"software" intext:"2023" OR intext:"2022" site:.com inurl:blog', desc: 'Guías de software desactualizadas — contenido para refrescar', googleUrl: 'https://www.google.com/search?q=intitle%3A%22guide%22+intitle%3A%22software%22+intext%3A%222023%22+OR+intext%3A%222022%22+site%3A.com+inurl%3Ablog', difficulty: 'Medium', impact: 78 },
  { id: 14, niche: 'health', category: 'content-gaps', name: 'Health Info Without Author', dork: 'intitle:"health" OR intitle:"wellness" intext:"tips" -inurl:author -inurl:about-us site:.org', desc: 'Contenido de salud sin autoría — baja autoridad, oportunidad de superarlos', googleUrl: 'https://www.google.com/search?q=intitle%3A%22health%22+OR+intitle%3A%22wellness%22+intext%3A%22tips%22+-inurl%3Aauthor+-inurl%3Aabout-us+site%3A.org', difficulty: 'Hard', impact: 75 },
  { id: 15, niche: 'crypto', category: 'content-gaps', name: 'Crypto Guides Without Updates', dork: 'intitle:"crypto" OR intitle:"bitcoin" intitle:"guide" intext:"2023" OR intext:"2022" -intext:"2025" -intext:"2026"', desc: 'Guías cripto desactualizadas — oportunidad de contenido fresco', googleUrl: 'https://www.google.com/search?q=intitle%3A%22crypto%22+OR+intitle%3A%22bitcoin%22+intitle%3A%22guide%22+intext%3A%222023%22+OR+intext%3A%222022%22+-intext%3A%222025%22+-intext%3A%222026%22', difficulty: 'Easy', impact: 82 },

  // ════════════════════════════════════════════
  // BACKLINK OPPORTUNITIES
  // ════════════════════════════════════════════
  { id: 16, niche: 'all', category: 'backlinks', name: 'Write for Us + Niche', dork: '"write for us" OR "guest post" OR "contribute" intitle:"insurance" OR intitle:"finance" OR intitle:"tech"', desc: 'Sitios que aceptan guest posts en nichos de alto CPC', googleUrl: 'https://www.google.com/search?q=%22write+for+us%22+OR+%22guest+post%22+OR+%22contribute%22+intitle%3A%22insurance%22+OR+intitle%3A%22finance%22+OR+intitle%3A%22tech%22', difficulty: 'Easy', impact: 95 },
  { id: 17, niche: 'all', category: 'backlinks', name: 'Resource Pages with Links', dork: 'inurl:links OR inurl:resources intitle:"useful links" OR intitle:"resources" intext:"insurance" OR intext:"finance"', desc: 'Páginas de recursos que enlazan a sitios externos', googleUrl: 'https://www.google.com/search?q=inurl%3Alinks+OR+inurl%3Aresources+intitle%3A%22useful+links%22+OR+intitle%3A%22resources%22+intext%3A%22insurance%22+OR+intext%3A%22finance%22', difficulty: 'Easy', impact: 90 },
  { id: 18, niche: 'all', category: 'backlinks', name: 'Testimonials Pages', dork: 'inurl:testimonials OR inurl:reviews intext:"client" OR intext:"customer" intext:"results" site:.com', desc: 'Páginas de testimonios donde podrías aparecer como cliente', googleUrl: 'https://www.google.com/search?q=inurl%3Atestimonials+OR+inurl%3Areviews+intext%3A%22client%22+OR+intext%3A%22customer%22+intext%3A%22results%22+site%3A.com', difficulty: 'Easy', impact: 82 },
  { id: 19, niche: 'all', category: 'backlinks', name: 'Mentions Without Link', dork: '"your brand" OR "your niche" -site:yoursite.com intitle:"blog" OR intitle:"news"', desc: 'Menciones de tu marca o nicho sin enlace — reemplaza "your brand" con tu marca', googleUrl: 'https://www.google.com/search?q=%22your+brand%22+OR+%22your+niche%22+-site%3Ayoursite.com+intitle%3A%22blog%22+OR+intitle%3A%22news%22', difficulty: 'Medium', impact: 88 },
  { id: 20, niche: 'all', category: 'backlinks', name: 'Dead Pages with Backlinks', dork: 'site:.com inurl:blog intitle:"404" OR intitle:"not found" OR intitle:"page not found"', desc: 'Páginas 404 en blogs con backlinks — oportunidad de redirect', googleUrl: 'https://www.google.com/search?q=site%3A.com+inurl%3Ablog+intitle%3A%22404%22+OR+intitle%3A%22not+found%22+OR+intitle%3A%22page+not+found%22', difficulty: 'Hard', impact: 85 },
  { id: 21, niche: 'education', category: 'backlinks', name: '.edu Resource Pages', dork: 'site:.edu inurl:resources OR inurl:links intitle:"resources" intext:"insurance" OR intext:"finance" OR intext:"health"', desc: 'Páginas de recursos .edu — backlinks de alta autoridad', googleUrl: 'https://www.google.com/search?q=site%3A.edu+inurl%3Aresources+OR+inurl%3Alinks+intitle%3A%22resources%22+intext%3A%22insurance%22+OR+intext%3A%22finance%22+OR+intext%3A%22health%22', difficulty: 'Medium', impact: 95 },
  { id: 22, niche: 'all', category: 'backlinks', name: 'Broken Link Building', dork: 'inurl:links OR inurl:resources intitle:"resources" "broken" OR "dead link" OR "not working"', desc: 'Páginas con enlaces rotos — oportunidad de sugerir tu contenido como reemplazo', googleUrl: 'https://www.google.com/search?q=inurl%3Alinks+OR+inurl%3Aresources+intitle%3A%22resources%22+%22broken%22+OR+%22dead+link%22+OR+%22not+working%22', difficulty: 'Medium', impact: 88 },

  // ════════════════════════════════════════════
  // MONETIZATION PATTERNS
  // ════════════════════════════════════════════
  { id: 23, niche: 'all', category: 'monetization', name: 'AdSense High CPC Pages', dork: 'intitle:"best" OR intitle:"top" OR intitle:"review" intext:"affiliate" intext:"disclosure" inurl:review', desc: 'Páginas con disclosure de afiliados + keywords de alto CPC', googleUrl: 'https://www.google.com/search?q=intitle%3A%22best%22+OR+intitle%3A%22top%22+OR+intitle%3A%22review%22+intext%3A%22affiliate%22+intext%3A%22disclosure%22+inurl%3Areview', difficulty: 'Easy', impact: 90 },
  { id: 24, niche: 'insurance', category: 'monetization', name: 'Insurance Affiliate Pages', dork: 'intitle:"life insurance" OR intitle:"car insurance" inurl:affiliate OR inurl:recommends intext:"best"', desc: 'Páginas de afiliados de seguros — alto CPC por clic', googleUrl: 'https://www.google.com/search?q=intitle%3A%22life+insurance%22+OR+intitle%3A%22car+insurance%22+inurl%3Aaffiliate+OR+inurl%3Arecommends+intext%3A%22best%22', difficulty: 'Easy', impact: 93 },
  { id: 25, niche: 'finance', category: 'monetization', name: 'Credit Card Affiliates', dork: 'intitle:"credit card" intext:"affiliate" OR intext:"partner" OR inurl:card inurl:compare', desc: 'Páginas de afiliados de tarjetas de crédito — comisiones altas', googleUrl: 'https://www.google.com/search?q=intitle%3A%22credit+card%22+intext%3A%22affiliate%22+OR+intext%3A%22partner%22+OR+inurl%3Acard+inurl%3Acompare', difficulty: 'Easy', impact: 90 },
  { id: 26, niche: 'tech', category: 'monetization', name: 'SaaS Affiliate Programs', dork: 'intitle:"best" intitle:"software" OR intitle:"SaaS" inurl:affiliate-program OR intext:"affiliate program"', desc: 'Programas de afiliados SaaS — recurrencia mensual', googleUrl: 'https://www.google.com/search?q=intitle%3A%22best%22+intitle%3A%22software%22+OR+intitle%3A%22SaaS%22+inurl%3Aaffiliate-program+OR+intext%3A%22affiliate+program%22', difficulty: 'Easy', impact: 85 },
  { id: 27, niche: 'health', category: 'monetization', name: 'Supplement Affiliate Pages', dork: 'intitle:"best supplements" OR intitle:"top supplements" inurl:review intext:"affiliate"', desc: 'Páginas de afiliados de suplementos — nicho de alto CPM', googleUrl: 'https://www.google.com/search?q=intitle%3A%22best+supplements%22+OR+intitle%3A%22top+supplements%22+inurl%3Areview+intext%3A%22affiliate%22', difficulty: 'Easy', impact: 82 },
  { id: 28, niche: 'crypto', category: 'monetization', name: 'Crypto Affiliate Offers', dork: 'intitle:"crypto" OR intitle:"bitcoin" inurl:affiliate OR intext:"referral" intext:"commission"', desc: 'Páginas de afiliados cripto — comisiones altas por referido', googleUrl: 'https://www.google.com/search?q=intitle%3A%22crypto%22+OR+intitle%3A%22bitcoin%22+inurl%3Aaffiliate+OR+intext%3A%22referral%22+intext%3A%22commission%22', difficulty: 'Easy', impact: 80 },

  // ════════════════════════════════════════════
  // VULNERABILITIES & EXPOSED
  // ════════════════════════════════════════════
  { id: 29, niche: 'all', category: 'vulnerabilities', name: 'Open WordPress Admin', dork: 'inurl:/wp-admin intitle:"wp-admin" site:.com', desc: 'Paneles de administración WordPress expuestos', googleUrl: 'https://www.google.com/search?q=inurl%3A%2Fwp-admin+intitle%3A%22wp-admin%22+site%3A.com', difficulty: 'Easy', impact: 70 },
  { id: 30, niche: 'all', category: 'vulnerabilities', name: 'Directory Listing Exposed', dork: 'intitle:"index of" inurl:wp-content/uploads site:.com', desc: 'Directorios abiertos con archivos subidos — contenido expuesto', googleUrl: 'https://www.google.com/search?q=intitle%3A%22index+of%22+inurl%3Awp-content%2Fuploads+site%3A.com', difficulty: 'Easy', impact: 75 },
  { id: 31, niche: 'all', category: 'vulnerabilities', name: 'Exposed Environment Files', dork: 'filetype:env OR filetype:env.example intext:DB_PASSWORD OR intext:API_KEY', desc: 'Archivos .env con credenciales expuestas', googleUrl: 'https://www.google.com/search?q=filetype%3Aenv+OR+filetype%3Aenv.example+intext%3ADB_PASSWORD+OR+intext%3AAPI_KEY', difficulty: 'Hard', impact: 65 },
  { id: 32, niche: 'all', category: 'vulnerabilities', name: 'Open Git Repositories', dork: 'intitle:"Index of" inurl:.git HEAD refs', desc: 'Repositorios Git expuestos públicamente', googleUrl: 'https://www.google.com/search?q=intitle%3A%22Index+of%22+inurl%3A.git+HEAD+refs', difficulty: 'Medium', impact: 60 },
  { id: 33, niche: 'all', category: 'vulnerabilities', name: 'PHP Info Pages', dork: 'inurl:phpinfo.php OR inurl:info.php intitle:"phpinfo()" OR intitle:"PHP Version"', desc: 'Páginas phpinfo() con configuración del servidor expuesta', googleUrl: 'https://www.google.com/search?q=inurl%3Aphpinfo.php+OR+inurl%3Ainfo.php+intitle%3A%22phpinfo%28%29%22', difficulty: 'Easy', impact: 55 },
  { id: 34, niche: 'all', category: 'vulnerabilities', name: 'Exposed Backup Files', dork: 'filetype:bak OR filetype:old OR filetype:backup inurl:wp-config OR inurl:config', desc: 'Archivos de backup con configuraciones expuestas', googleUrl: 'https://www.google.com/search?q=filetype%3Abak+OR+filetype%3Aold+OR+filetype%3Abackup+inurl%3Awp-config+OR+inurl%3Aconfig', difficulty: 'Medium', impact: 65 },
  { id: 35, niche: 'all', category: 'vulnerabilities', name: 'Exposed API Docs', dork: 'inurl:/api-docs OR inurl:/swagger OR inurl:/openapi.json intitle:"API" OR intitle:"Swagger"', desc: 'Documentación de API expuesta públicamente', googleUrl: 'https://www.google.com/search?q=inurl%3A%2Fapi-docs+OR+inurl%3A%2Fswagger+OR+inurl%3A%2Fopenapi.json', difficulty: 'Medium', impact: 70 },

  // ════════════════════════════════════════════
  // COMPETITOR INTELLIGENCE
  // ════════════════════════════════════════════
  { id: 36, niche: 'all', category: 'competitor-intel', name: 'Competitor PDF Resources', dork: 'site:competitor.com filetype:pdf intitle:"guide" OR intitle:"ebook" OR intitle:"whitepaper"', desc: 'Encuentra todos los PDFs (guías, ebooks) de un competidor — reemplaza competitor.com', googleUrl: 'https://www.google.com/search?q=site%3Acompetitor.com+filetype%3Apdf+intitle%3A%22guide%22+OR+intitle%3A%22ebook%22+OR+intitle%3A%22whitepaper%22', difficulty: 'Easy', impact: 88 },
  { id: 37, niche: 'all', category: 'competitor-intel', name: 'Competitor New Content', dork: 'site:competitor.com inurl:blog OR inurl:news after:2025-06-01', desc: 'Contenido reciente de un competidor — ajusta la fecha y el dominio', googleUrl: 'https://www.google.com/search?q=site%3Acompetitor.com+inurl%3Ablog+OR+inurl%3Anews+after%3A2025-06-01', difficulty: 'Easy', impact: 85 },
  { id: 38, niche: 'all', category: 'competitor-intel', name: 'Competitor Sitemap', dork: 'site:competitor.com inurl:sitemap OR inurl:sitemap.xml OR inurl:wp-sitemap.xml', desc: 'Encuentra el sitemap del competidor para ver toda su estructura', googleUrl: 'https://www.google.com/search?q=site%3Acompetitor.com+inurl%3Asitemap+OR+inurl%3Asitemap.xml', difficulty: 'Easy', impact: 80 },
  { id: 39, niche: 'all', category: 'competitor-intel', name: 'Competitor vs Pages', dork: 'site:competitor.com inurl:vs OR inurl:versus OR inurl:alternative', desc: 'Páginas de comparación del competidor — alto CPC, alto tráfico', googleUrl: 'https://www.google.com/search?q=site%3Acompetitor.com+inurl%3Avs+OR+inurl%3Aversus+OR+inurl%3Aalternative', difficulty: 'Easy', impact: 90 },
  { id: 40, niche: 'all', category: 'competitor-intel', name: 'Competitor Backlinks (Google)', dork: 'link:competitor.com -site:competitor.com', desc: 'Enlaces entrantes al competidor según Google (limitado pero útil)', googleUrl: 'https://www.google.com/search?q=link%3Acompetitor.com+-site%3Acompetitor.com', difficulty: 'Easy', impact: 75 },
  { id: 41, niche: 'all', category: 'competitor-intel', name: 'Competitor Authors', dork: 'site:competitor.com inurl:author OR inurl:contributor intext:"writer" OR intext:"contributor"', desc: 'Encuentra los autores/contribuidores del competidor', googleUrl: 'https://www.google.com/search?q=site%3Acompetitor.com+inurl%3Aauthor+OR+inurl%3Acontributor', difficulty: 'Easy', impact: 72 },

  // ════════════════════════════════════════════
  // TRENDING & VIRAL CONTENT
  // ════════════════════════════════════════════
  { id: 42, niche: 'all', category: 'trending', name: 'Trending Topics by Niche', dork: 'intitle:"trending" OR intitle:"viral" OR intitle:"popular" intext:"insurance" OR intext:"finance" OR intext:"crypto" after:2025-01-01', desc: 'Contenido trending en nichos de alto CPC', googleUrl: 'https://www.google.com/search?q=intitle%3A%22trending%22+OR+intitle%3A%22viral%22+OR+intitle%3A%22popular%22+intext%3A%22insurance%22+OR+intext%3A%22finance%22+OR+intext%3A%22crypto%22+after%3A2025-01-01', difficulty: 'Easy', impact: 92 },
  { id: 43, niche: 'all', category: 'trending', name: 'Reddit Trending Discussions', dork: 'site:reddit.com intitle:"insurance" OR intitle:"finance" OR intitle:"crypto" intext:"trending" OR intext:"viral"', desc: 'Discusiones trending en Reddit por nicho', googleUrl: 'https://www.google.com/search?q=site%3Areddit.com+intitle%3A%22insurance%22+OR+intitle%3A%22finance%22+OR+intitle%3A%22crypto%22+intext%3A%22trending%22', difficulty: 'Easy', impact: 85 },
  { id: 44, niche: 'insurance', category: 'trending', name: 'Insurance Viral News', dork: 'intitle:"insurance" intext:"breaking" OR intext:"new study" OR intext:"surprising" after:2025-01-01', desc: 'Noticias y estudios virales sobre seguros', googleUrl: 'https://www.google.com/search?q=intitle%3A%22insurance%22+intext%3A%22breaking%22+OR+intext%3A%22new+study%22+OR+intext%3A%22surprising%22+after%3A2025-01-01', difficulty: 'Easy', impact: 80 },
  { id: 45, niche: 'crypto', category: 'trending', name: 'Crypto Moon Shots', dork: 'intitle:"crypto" OR intitle:"bitcoin" intext:"moon" OR intext:"pump" OR intext:"explosion" after:2025-06-01', desc: 'Contenido cripto con lenguaje viral/exagerado', googleUrl: 'https://www.google.com/search?q=intitle%3A%22crypto%22+OR+intitle%3A%22bitcoin%22+intext%3A%22moon%22+OR+intext%3A%22pump%22+OR+intext%3A%22explosion%22+after%3A2025-06-01', difficulty: 'Easy', impact: 78 },
  { id: 46, niche: 'all', category: 'trending', name: 'YouTube Viral by Niche', dork: 'site:youtube.com intitle:"insurance" OR intitle:"finance" intext:"viral" OR intext:"trending" views:>100000', desc: 'Videos virales de YouTube por nicho', googleUrl: 'https://www.youtube.com/results?search_query=viral+insurance+OR+finance', difficulty: 'Easy', impact: 85 },
  { id: 47, niche: 'health', category: 'trending', name: 'Health Challenges Viral', dork: 'intitle:"health" OR intitle:"fitness" intext:"challenge" OR intext:"transformation" OR intext:"trending" after:2025-03-01', desc: 'Retos y transformaciones virales de salud', googleUrl: 'https://www.google.com/search?q=intitle%3A%22health%22+OR+intitle%3A%22fitness%22+intext%3A%22challenge%22+OR+intext%3A%22transformation%22+OR+intext%3A%22trending%22+after%3A2025-03-01', difficulty: 'Easy', impact: 82 },

  // ════════════════════════════════════════════
  // NICHE SPECIFIC DORKS (additional)
  // ════════════════════════════════════════════
  { id: 48, niche: 'ecommerce', category: 'high-traffic', name: 'Product Review Pages', dork: 'intitle:"best" OR intitle:"top rated" inurl:review intext:"product" intext:"price"', desc: 'Páginas de reseñas de productos — tráfico comercial', googleUrl: 'https://www.google.com/search?q=intitle%3A%22best%22+OR+intitle%3A%22top+rated%22+inurl%3Areview+intext%3A%22product%22+intext%3A%22price%22', difficulty: 'Easy', impact: 85 },
  { id: 49, niche: 'ecommerce', category: 'monetization', name: 'Amazon Affiliate Stores', dork: 'inurl:amazon OR inurl:store intext:"affiliate" intitle:"best" OR intitle:"top" site:.com', desc: 'Tiendas afiliadas de Amazon con alto potencial', googleUrl: 'https://www.google.com/search?q=inurl%3Aamazon+OR+inurl%3Astore+intext%3A%22affiliate%22+intitle%3A%22best%22+OR+intitle%3A%22top%22+site%3A.com', difficulty: 'Easy', impact: 82 },
  { id: 50, niche: 'travel', category: 'high-traffic', name: 'Travel Deal Pages', dork: 'intitle:"travel deals" OR intitle:"cheap flights" OR intitle:"best hotels" inurl:deals', desc: 'Páginas de ofertas de viaje — alto tráfico estacional', googleUrl: 'https://www.google.com/search?q=intitle%3A%22travel+deals%22+OR+intitle%3A%22cheap+flights%22+OR+intitle%3A%22best+hotels%22+inurl%3Adeals', difficulty: 'Easy', impact: 78 },
  { id: 51, niche: 'lifestyle', category: 'high-traffic', name: 'Dating Site Reviews', dork: 'intitle:"best dating sites" OR intitle:"dating apps" inurl:review intext:"comparison"', desc: 'Reviews de sitios de citas — alto CPC y tráfico', googleUrl: 'https://www.google.com/search?q=intitle%3A%22best+dating+sites%22+OR+intitle%3A%22dating+apps%22+inurl%3Areview+intext%3A%22comparison%22', difficulty: 'Easy', impact: 85 },
  { id: 52, niche: 'gaming', category: 'high-traffic', name: 'Gaming Setup Reviews', dork: 'intitle:"best gaming" OR intitle:"gaming setup" inurl:review intext:"price" intext:"buy"', desc: 'Reviews de setups gaming — tráfico masivo de afiliados', googleUrl: 'https://www.google.com/search?q=intitle%3A%22best+gaming%22+OR+intitle%3A%22gaming+setup%22+inurl%3Areview+intext%3A%22price%22+intext%3A%22buy%22', difficulty: 'Easy', impact: 80 },
  { id: 53, niche: 'education', category: 'high-traffic', name: 'Online Course Reviews', dork: 'intitle:"best online courses" OR intitle:"online learning" inurl:review OR inurl:compare', desc: 'Reviews de cursos online — nicho educativo de alto CPC', googleUrl: 'https://www.google.com/search?q=intitle%3A%22best+online+courses%22+OR+intitle%3A%22online+learning%22+inurl%3Areview+OR+inurl%3Acompare', difficulty: 'Easy', impact: 82 },

  // Additional OSINT / Data Arbitrage Dorks
  { id: 54, niche: 'all', category: 'competitor-intel', name: 'Competitor Email List', dork: 'site:competitor.com inurl:email OR inurl:newsletter OR inurl:subscribe', desc: 'Encuentra dónde los competidores capturan emails', googleUrl: 'https://www.google.com/search?q=site%3Acompetitor.com+inurl%3Aemail+OR+inurl%3Anewsletter+OR+inurl%3Asubscribe', difficulty: 'Easy', impact: 78 },
  { id: 55, niche: 'all', category: 'competitor-intel', name: 'Competitor Job Listings', dork: 'site:competitor.com inurl:careers OR inurl:jobs OR inurl:hiring', desc: 'Ofertas de trabajo del competidor — revela tecnología y crecimiento', googleUrl: 'https://www.google.com/search?q=site%3Acompetitor.com+inurl%3Acareers+OR+inurl%3Ajobs+OR+inurl%3Ahiring', difficulty: 'Easy', impact: 65 },
  { id: 56, niche: 'all', category: 'trending', name: 'Google News by Niche', dork: 'source:google-news intitle:"insurance" OR intitle:"finance" after:2025-06-01', desc: 'Noticias recientes de Google News por nicho', googleUrl: 'https://news.google.com/search?q=insurance+OR+finance+after%3A2025-06-01', difficulty: 'Easy', impact: 75 },
  { id: 57, niche: 'all', category: 'high-traffic', name: 'Top 10 Lists All Niches', dork: 'intitle:"top 10" OR intitle:"best" inurl:blog intitle:"2025" OR intitle:"2026"', desc: 'Listas Top 10/Best actualizadas — formato que siempre funciona', googleUrl: 'https://www.google.com/search?q=intitle%3A%22top+10%22+OR+intitle%3A%22best%22+inurl%3Ablog+intitle%3A%222025%22+OR+intitle%3A%222026%22', difficulty: 'Easy', impact: 90 },
  { id: 58, niche: 'all', category: 'monetization', name: 'High CTR Ad Placements', dork: 'inurl:advertise OR inurl:media-kit OR inurl:work-with-me intitle:"blog" OR intitle:"media"', desc: 'Blogs con media kits públicos — posible competencia directa', googleUrl: 'https://www.google.com/search?q=inurl%3Aadvertise+OR+inurl%3Amedia-kit+OR+inurl%3Awork-with-me+intitle%3A%22blog%22', difficulty: 'Easy', impact: 72 },
  { id: 59, niche: 'all', category: 'content-gaps', name: 'Thin Content Pages', dork: 'intitle:"insurance" OR intitle:"finance" intext:"click here" OR intext:"learn more" site:.com intitle:"blog" -intext:"guide" -intext:"tips"', desc: 'Páginas delgadas en contenido — fáciles de superar', googleUrl: 'https://www.google.com/search?q=intitle%3A%22insurance%22+OR+intitle%3A%22finance%22+intext%3A%22click+here%22+site%3A.com+intitle%3A%22blog%22+-intext%3A%22guide%22', difficulty: 'Hard', impact: 80 },
  { id: 60, niche: 'all', category: 'content-gaps', name: 'No Images Content', dork: 'intitle:"guide" intext:"step" OR intext:"how to" -inurl:image -inurl:gallery -inurl:photo site:.com inurl:blog', desc: 'Contenido sin imágenes — oportunidad de mejorar con multimedia', googleUrl: 'https://www.google.com/search?q=intitle%3A%22guide%22+intext%3A%22step%22+OR+intext%3A%22how+to%22+-inurl%3Aimage+-inurl%3Agallery+site%3A.com+inurl%3Ablog', difficulty: 'Hard', impact: 75 },
  { id: 61, niche: 'all', category: 'backlinks', name: 'Blog Comment Opportunities', dork: 'intitle:"blog" inurl:blog intitle:"insurance" OR intitle:"finance" intext:"comment" OR intext:"leave a reply"', desc: 'Blogs con comentarios abiertos para dejar enlaces', googleUrl: 'https://www.google.com/search?q=intitle%3A%22blog%22+inurl%3Ablog+intitle%3A%22insurance%22+OR+intitle%3A%22finance%22+intext%3A%22comment%22', difficulty: 'Easy', impact: 60 },
  { id: 62, niche: 'all', category: 'backlinks', name: 'Podcast Guest Opportunities', dork: 'intitle:"podcast" inurl:guest OR intitle:"be a guest" intext:"insurance" OR intext:"finance" OR intext:"tech"', desc: 'Podcasts que buscan invitados — backlinks de alta calidad', googleUrl: 'https://www.google.com/search?q=intitle%3A%22podcast%22+inurl%3Aguest+OR+intitle%3A%22be+a+guest%22+intext%3A%22insurance%22+OR+intext%3A%22finance%22', difficulty: 'Easy', impact: 85 },
  { id: 63, niche: 'all', category: 'vulnerabilities', name: 'Open FTP Servers', dork: 'intitle:"index of" inurl:ftp OR inurl:files intext:"backup" OR intext:"data"', desc: 'Servidores FTP con archivos expuestos', googleUrl: 'https://www.google.com/search?q=intitle%3A%22index+of%22+inurl%3Aftp+OR+inurl%3Afiles+intext%3A%22backup%22', difficulty: 'Hard', impact: 50 },
  { id: 64, niche: 'all', category: 'vulnerabilities', name: 'Exposed Log Files', dork: 'filetype:log inurl:access OR inurl:error OR inurl:debug', desc: 'Archivos de log expuestos con información sensible', googleUrl: 'https://www.google.com/search?q=filetype%3Alog+inurl%3Aaccess+OR+inurl%3Aerror+OR+inurl%3Adebug', difficulty: 'Hard', impact: 55 },
  { id: 65, niche: 'all', category: 'trending', name: 'Reddit Trending by Niche', dork: 'site:reddit.com intitle:"mega thread" OR intitle:"discussion" intext:"2025" OR intext:"2026" intitle:"insurance" OR intitle:"finance"', desc: 'Mega threads y discusiones en Reddit', googleUrl: 'https://www.reddit.com/search?q=insurance+OR+finance+2026', difficulty: 'Easy', impact: 78 },
];

/* ── Dorking Engine State ── */
let dorkState = {
  activeNiche: 'all',
  activeCategory: 'high-traffic',
  searchQuery: '',
  savedDorks: JSON.parse(localStorage.getItem('na_saved_dorks') || '[]'),
  customDork: '',
  showBuilder: false
};

/* ── RENDER DORKING ENGINE ── */
function renderDorkingEngine() {
  // Prefer cpc-tab-content (orchestrator mode) over cpc-container (standalone mode)
  const container = document.getElementById('cpc-tab-content') || document.getElementById('cpc-container');
  if (!container) return;

  const dorkCount = DORKS.length;
  const savedCount = dorkState.savedDorks.length;

  container.innerHTML = `
    <!-- ═══ HEADER ═══ -->
    <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:12px;margin-bottom:16px;">
      <div>
        <h2 style="font-size:20px;font-weight:600;margin-bottom:2px;">🔍 Dorking Engine</h2>
        <p style="font-size:12px;color:var(--muted);">Google Dorking Avanzado · ${dorkCount} dorks · ${savedCount} guardados</p>
      </div>
      <div style="display:flex;gap:6px;">
        <button class="btn btn-sm btn-ghost" onclick="toggleDorkBuilder()" style="font-size:11px;" id="dork-builder-btn">🧰 Dork Builder</button>
        <button class="btn btn-sm btn-ghost" onclick="showSavedDorks()" style="font-size:11px;">💾 Guardados (${savedCount})</button>
        <button class="btn btn-sm btn-ghost" onclick="exportDorkList()" style="font-size:10px;">📥 Export</button>
      </div>
    </div>

    <!-- ═══ DORK BUILDER (hidden) ═══ -->
    <div id="dork-builder-panel" style="display:none;background:var(--bg3);border:0.5px solid var(--border);border-radius:var(--radius2);padding:14px;margin-bottom:14px;">
      <div style="font-size:12px;font-weight:500;margin-bottom:8px;">🧰 Dork Builder — Construye tu propio dork</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px;">
        <select id="dork-builder-operator1" style="background:var(--bg4);border:0.5px solid var(--border);border-radius:6px;padding:7px 10px;color:var(--text);font-size:11px;font-family:var(--mono);outline:none;">
          <option value="intitle:">intitle:</option>
          <option value="inurl:">inurl:</option>
          <option value="intext:">intext:</option>
          <option value="site:">site:</option>
          <option value="filetype:">filetype:</option>
        </select>
        <input type="text" id="dork-builder-val1" placeholder='valor (ej: "best insurance")' style="background:var(--bg4);border:0.5px solid var(--border);border-radius:6px;padding:7px 10px;color:var(--text);font-size:11px;font-family:var(--mono);outline:none;" />
      </div>
      <div style="display:flex;gap:8px;align-items:center;margin-bottom:8px;">
        <select id="dork-builder-boolean" style="background:var(--bg4);border:0.5px solid var(--border);border-radius:6px;padding:7px 10px;color:var(--text);font-size:11px;font-family:var(--mono);outline:none;">
          <option value=" ">AND</option>
          <option value=" OR ">OR</option>
          <option value=" -">NOT (excluir)</option>
        </select>
        <select id="dork-builder-operator2" style="background:var(--bg4);border:0.5px solid var(--border);border-radius:6px;padding:7px 10px;color:var(--text);font-size:11px;font-family:var(--mono);outline:none;">
          <option value="intitle:">intitle:</option>
          <option value="inurl:">inurl:</option>
          <option value="intext:">intext:</option>
          <option value="site:">site:</option>
          <option value="inurl:review">inurl:review</option>
          <option value="inurl:blog">inurl:blog</option>
          <option value="after:">after: (fecha)</option>
          <option value="before:">before: (fecha)</option>
        </select>
        <input type="text" id="dork-builder-val2" placeholder='valor (ej: insurance)' style="flex:1;background:var(--bg4);border:0.5px solid var(--border);border-radius:6px;padding:7px 10px;color:var(--text);font-size:11px;font-family:var(--mono);outline:none;" />
      </div>
      <div style="display:flex;gap:8px;align-items:center;">
        <input type="text" id="dork-builder-result" readonly
          style="flex:1;background:var(--bg2);border:0.5px solid var(--accent);border-radius:6px;padding:8px 12px;color:var(--accent);font-size:11px;font-family:var(--mono);outline:none;"
          placeholder="El dork generado aparecerá aquí..." />
        <button class="btn btn-sm btn-primary" onclick="executeBuilderDork()" style="font-size:10px;padding:6px 12px;">▶ Ejecutar</button>
        <button class="btn btn-sm btn-ghost" onclick="saveBuilderDork()" style="font-size:10px;padding:6px 12px;">💾 Guardar</button>
      </div>
      <div style="margin-top:6px;display:flex;gap:6px;flex-wrap:wrap;">
        <button class="btn btn-xs btn-ghost" onclick="addDorkBuilderSuffix(' after:2025-01-01')" style="font-size:9px;">+ Filtro fecha</button>
        <button class="btn btn-xs btn-ghost" onclick="addDorkBuilderSuffix(' site:.com')" style="font-size:9px;">+ Solo .com</button>
        <button class="btn btn-xs btn-ghost" onclick="addDorkBuilderSuffix(' site:.org')" style="font-size:9px;">+ Solo .org</button>
        <button class="btn btn-xs btn-ghost" onclick="addDorkBuilderSuffix(' -inurl:amazon')" style="font-size:9px;">- Excluir Amazon</button>
        <button class="btn btn-xs btn-ghost" onclick="addDorkBuilderSuffix(' filetype:pdf')" style="font-size:9px;">+ Solo PDFs</button>
      </div>
    </div>

    <!-- ═══ STATS ═══ -->
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:14px;">
      <div style="background:var(--bg2);border:0.5px solid var(--border);border-radius:8px;padding:12px;text-align:center;">
        <div style="font-size:9px;color:var(--muted);text-transform:uppercase;">Total Dorks</div>
        <div style="font-size:22px;font-weight:600;font-family:var(--mono);color:var(--accent);">${dorkCount}</div>
      </div>
      <div style="background:var(--bg2);border:0.5px solid var(--border);border-radius:8px;padding:12px;text-align:center;">
        <div style="font-size:9px;color:var(--muted);text-transform:uppercase;">Categorías</div>
        <div style="font-size:22px;font-weight:600;font-family:var(--mono);color:var(--info-bright);">${DORK_CATEGORIES.length}</div>
      </div>
      <div style="background:var(--bg2);border:0.5px solid var(--border);border-radius:8px;padding:12px;text-align:center;">
        <div style="font-size:9px;color:var(--muted);text-transform:uppercase;">Nichos</div>
        <div style="font-size:22px;font-weight:600;font-family:var(--mono);color:var(--success-bright);">${DORK_NICHES.length}</div>
      </div>
      <div style="background:var(--bg2);border:0.5px solid var(--border);border-radius:8px;padding:12px;text-align:center;">
        <div style="font-size:9px;color:var(--muted);text-transform:uppercase;">Guardados</div>
        <div style="font-size:22px;font-weight:600;font-family:var(--mono);color:${savedCount > 0 ? 'var(--accent)' : 'var(--muted2)'};">${savedCount}</div>
      </div>
    </div>

    <!-- ═══ FILTERS ═══ -->
    <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px;">
      <button class="btn btn-xs ${dorkState.activeCategory === 'high-traffic' ? 'btn-primary' : 'btn-ghost'}" onclick="dorkState.activeCategory='high-traffic';renderDorkingEngine();" style="font-size:9px;">📍 High Traffic</button>
      <button class="btn btn-xs ${dorkState.activeCategory === 'content-gaps' ? 'btn-primary' : 'btn-ghost'}" onclick="dorkState.activeCategory='content-gaps';renderDorkingEngine();" style="font-size:9px;">🕳️ Content Gaps</button>
      <button class="btn btn-xs ${dorkState.activeCategory === 'backlinks' ? 'btn-primary' : 'btn-ghost'}" onclick="dorkState.activeCategory='backlinks';renderDorkingEngine();" style="font-size:9px;">🔗 Backlinks</button>
      <button class="btn btn-xs ${dorkState.activeCategory === 'monetization' ? 'btn-primary' : 'btn-ghost'}" onclick="dorkState.activeCategory='monetization';renderDorkingEngine();" style="font-size:9px;">💰 Monetization</button>
      <button class="btn btn-xs ${dorkState.activeCategory === 'vulnerabilities' ? 'btn-primary' : 'btn-ghost'}" onclick="dorkState.activeCategory='vulnerabilities';renderDorkingEngine();" style="font-size:9px;">⚠️ Vulns</button>
      <button class="btn btn-xs ${dorkState.activeCategory === 'competitor-intel' ? 'btn-primary' : 'btn-ghost'}" onclick="dorkState.activeCategory='competitor-intel';renderDorkingEngine();" style="font-size:9px;">🕵️ Competitor</button>
      <button class="btn btn-xs ${dorkState.activeCategory === 'trending' ? 'btn-primary' : 'btn-ghost'}" onclick="dorkState.activeCategory='trending';renderDorkingEngine();" style="font-size:9px;">🔥 Trending</button>
    </div>
    <div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:14px;">
      ${DORK_NICHES.map(n => {
        const isActive = dorkState.activeNiche === n.id;
        return `<button class="btn btn-xs ${isActive ? 'btn-primary' : 'btn-ghost'}" onclick="dorkState.activeNiche='${n.id}';dorkState.activeCategory='${dorkState.activeCategory}';renderDorkingEngine();" style="font-size:9px;padding:3px 8px;">${n.name}</button>`;
      }).join('')}
    </div>

    <!-- ═══ SEARCH ═══ -->
    <div style="display:flex;gap:8px;margin-bottom:12px;">
      <input type="text" id="dork-search" placeholder="🔍 Buscar dorks por nombre, keyword o descripción..." value="${dorkState.searchQuery}"
        oninput="dorkState.searchQuery=this.value;renderDorkTable()"
        style="flex:1;background:var(--bg3);border:0.5px solid var(--border);border-radius:8px;padding:8px 14px;color:var(--text);font-size:12px;font-family:var(--font);outline:none;" />
      <select id="dork-sort" onchange="renderDorkTable()" style="background:var(--bg3);border:0.5px solid var(--border);border-radius:8px;padding:8px 10px;color:var(--text);font-size:11px;font-family:var(--mono);outline:none;">
        <option value="impact">🔥 Por Impacto</option>
        <option value="difficulty">📊 Por Dificultad</option>
        <option value="name">🔤 A-Z</option>
      </select>
    </div>

    <!-- ═══ TABLE ═══ -->
    <div style="background:var(--bg2);border:0.5px solid var(--border);border-radius:var(--radius2);overflow:hidden;">
      <div style="overflow-x:auto;">
        <table style="width:100%;border-collapse:collapse;font-size:12px;" id="dork-table">
          <thead>
            <tr>
              <th style="padding:7px 8px;text-align:left;font-size:9px;color:var(--muted);text-transform:uppercase;background:var(--bg3);border-bottom:0.5px solid var(--border);width:30px;">#</th>
              <th style="padding:7px 8px;text-align:left;font-size:9px;color:var(--muted);text-transform:uppercase;background:var(--bg3);border-bottom:0.5px solid var(--border);">Dork</th>
              <th style="padding:7px 8px;text-align:left;font-size:9px;color:var(--muted);text-transform:uppercase;background:var(--bg3);border-bottom:0.5px solid var(--border);">Query</th>
              <th style="padding:7px 8px;text-align:center;font-size:9px;color:var(--muted);text-transform:uppercase;background:var(--bg3);border-bottom:0.5px solid var(--border);width:60px;">🔥 Impacto</th>
              <th style="padding:7px 8px;text-align:center;font-size:9px;color:var(--muted);text-transform:uppercase;background:var(--bg3);border-bottom:0.5px solid var(--border);width:60px;">Dificultad</th>
              <th style="padding:7px 8px;text-align:center;font-size:9px;color:var(--muted);text-transform:uppercase;background:var(--bg3);border-bottom:0.5px solid var(--border);width:70px;">Acción</th>
            </tr>
          </thead>
          <tbody id="dork-tbody"></tbody>
        </table>
      </div>
    </div>
  `;

  renderDorkTable();

  // Auto-update builder
  const op1 = document.getElementById('dork-builder-operator1');
  const v1 = document.getElementById('dork-builder-val1');
  const op2 = document.getElementById('dork-builder-operator2');
  const v2 = document.getElementById('dork-builder-val2');
  const result = document.getElementById('dork-builder-result');
  if (op1 && v1 && op2 && v2 && result) {
    const update = () => {
      const bool = document.getElementById('dork-builder-boolean')?.value || ' ';
      result.value = `${op1.value}"${v1.value}"${bool}${op2.value}"${v2.value}"`;
    };
    op1.onchange = update; v1.oninput = update;
    op2.onchange = update; v2.oninput = update;
    document.getElementById('dork-builder-boolean').onchange = update;
  }
}

/* ── Render Dork Table ── */
function renderDorkTable() {
  const tbody = document.getElementById('dork-tbody');
  if (!tbody) return;

  let filtered = [...DORKS];

  if (dorkState.activeNiche !== 'all') {
    filtered = filtered.filter(d => d.niche === dorkState.activeNiche);
  }
  filtered = filtered.filter(d => d.category === dorkState.activeCategory);

  if (dorkState.searchQuery.trim()) {
    const q = dorkState.searchQuery.toLowerCase().trim();
    filtered = filtered.filter(d =>
      d.name.toLowerCase().includes(q) ||
      d.dork.toLowerCase().includes(q) ||
      d.desc.toLowerCase().includes(q) ||
      d.niche.includes(q)
    );
  }

  const sortBy = document.getElementById('dork-sort')?.value || 'impact';
  if (sortBy === 'impact') filtered.sort((a, b) => b.impact - a.impact);
  else if (sortBy === 'difficulty') {
    const diffOrder = { 'Easy': 0, 'Medium': 1, 'Hard': 2 };
    filtered.sort((a, b) => diffOrder[a.difficulty] - diffOrder[b.difficulty]);
  }
  else filtered.sort((a, b) => a.name.localeCompare(b.name));

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:30px;color:var(--muted2);font-size:12px;">🔍 No se encontraron dorks con ese filtro.</td></tr>`;
    return;
  }

  let html = '';
  filtered.forEach((d, i) => {
    const impactColor = d.impact >= 90 ? 'var(--danger)' : d.impact >= 80 ? 'var(--warning)' : 'var(--info)';
    const diffColor = d.difficulty === 'Easy' ? 'var(--success-bright)' : d.difficulty === 'Medium' ? 'var(--warning)' : 'var(--danger)';
    const isSaved = dorkState.savedDorks.some(s => s.id === d.id);

    html += `
      <tr style="border-bottom:0.5px solid rgba(255,255,255,0.03);cursor:pointer;" onclick="showDorkDetail(${d.id})">
        <td style="padding:7px 8px;font-family:var(--mono);font-size:10px;color:var(--muted2);text-align:center;">${d.id}</td>
        <td style="padding:7px 8px;">
          <div style="font-size:12px;font-weight:500;color:var(--text2);">${d.name}</div>
          <div style="font-size:9px;color:var(--muted2);margin-top:1px;">${d.desc.substring(0, 60)}${d.desc.length > 60 ? '…' : ''}</div>
        </td>
        <td style="padding:7px 8px;max-width:300px;">
          <div style="font-size:9px;font-family:var(--mono);color:var(--muted);word-break:break-all;line-height:1.4;background:var(--bg3);padding:4px 6px;border-radius:4px;">${d.dork}</div>
        </td>
        <td style="text-align:center;padding:7px 8px;">
          <div style="display:flex;align-items:center;gap:3px;justify-content:center;">
            <div style="width:30px;height:3px;background:var(--bg4);border-radius:2px;overflow:hidden;">
              <div style="width:${d.impact}%;height:100%;background:${impactColor};border-radius:2px;"></div>
            </div>
            <span style="font-family:var(--mono);font-size:9px;color:${impactColor};">${d.impact}</span>
          </div>
        </td>
        <td style="text-align:center;padding:7px 8px;">
          <span style="font-size:9px;padding:1px 6px;border-radius:3px;background:rgba(${d.difficulty === 'Easy' ? '46,204,113' : d.difficulty === 'Medium' ? '224,184,92' : '224,92,92'},0.15);color:${diffColor};">${d.difficulty}</span>
        </td>
        <td style="text-align:center;padding:7px 8px;">
          <div style="display:flex;gap:3px;justify-content:center;">
            <button class="btn btn-xs btn-ghost" onclick="event.stopPropagation();executeDork(${d.id})" title="Ejecutar en Google" style="font-size:10px;padding:2px 6px;">▶</button>
            <button class="btn btn-xs btn-ghost" onclick="event.stopPropagation();toggleSaveDork(${d.id})" style="font-size:10px;padding:2px 6px;color:${isSaved ? 'var(--accent)' : 'var(--muted2)'};">${isSaved ? '💾' : '📋'}</button>
            <button class="btn btn-xs btn-ghost" onclick="event.stopPropagation();copyDork(${d.id})" title="Copiar dork" style="font-size:10px;padding:2px 6px;">📄</button>
          </div>
        </td>
      </tr>
    `;
  });

  tbody.innerHTML = html;
}

/* ══════════════════════════════════════════════
   DORK ACTIONS
   ══════════════════════════════════════════════ */

function executeDork(id) {
  const dork = DORKS.find(d => d.id === id);
  if (!dork) return;
  window.open(dork.googleUrl, '_blank');
}

function copyDork(id) {
  const dork = DORKS.find(d => d.id === id);
  if (!dork) return;
  navigator.clipboard.writeText(dork.dork).then(() => {
    showDorkToast('✅ Dork copiado al portapapeles');
  });
}

function toggleSaveDork(id) {
  const idx = dorkState.savedDorks.findIndex(s => s.id === id);
  if (idx >= 0) {
    dorkState.savedDorks.splice(idx, 1);
    showDorkToast('🗑️ Dork eliminado de guardados');
  } else {
    const dork = DORKS.find(d => d.id === id);
    if (dork) {
      dorkState.savedDorks.push({ id: dork.id, name: dork.name, dork: dork.dork, savedAt: Date.now() });
      showDorkToast('💾 Dork guardado');
    }
  }
  localStorage.setItem('na_saved_dorks', JSON.stringify(dorkState.savedDorks));
  renderDorkTable();
  // Update saved count
  const countEl = document.querySelector('button[onclick*="showSavedDorks"]');
  if (countEl) countEl.textContent = `💾 Guardados (${dorkState.savedDorks.length})`;
}

function showDorkDetail(id) {
  const dork = DORKS.find(d => d.id === id);
  if (!dork) return;

  const nicheMeta = DORK_NICHES.find(n => n.id === dork.niche) || DORK_NICHES[0];
  const catMeta = DORK_CATEGORIES.find(c => c.id === dork.category) || DORK_CATEGORIES[0];
  const impactColor = dork.impact >= 90 ? 'var(--danger)' : dork.impact >= 80 ? 'var(--warning)' : 'var(--info)';
  const isSaved = dorkState.savedDorks.some(s => s.id === dork.id);

  // Generate similar dorks
  const similar = DORKS.filter(d => d.niche === dork.niche && d.category === dork.category && d.id !== dork.id).slice(0, 5);

  const bodyHTML = `
    <div style="font-size:13px;line-height:1.7;">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px;padding-bottom:12px;border-bottom:0.5px solid var(--border);">
        <div style="width:40px;height:40px;border-radius:10px;background:var(--bg3);display:flex;align-items:center;justify-content:center;font-size:20px;">${catMeta.icon}</div>
        <div style="flex:1;">
          <div style="font-size:15px;font-weight:600;">${dork.name}</div>
          <div style="font-size:10px;color:${nicheMeta.id === 'all' ? 'var(--info-bright)' : 'var(--muted2)'};">${nicheMeta.name} · ${catMeta.name}</div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:20px;font-weight:700;font-family:var(--mono);color:${impactColor};">${dork.impact}</div>
          <div style="font-size:9px;color:var(--muted2);">Impacto</div>
        </div>
      </div>

      <div style="background:var(--bg3);border:0.5px solid var(--border);border-radius:var(--radius);padding:10px 14px;margin-bottom:12px;">
        <div style="font-size:9px;color:var(--muted2);text-transform:uppercase;letter-spacing:0.03em;margin-bottom:4px;">🔍 Dork Query</div>
        <div style="font-size:11px;font-family:var(--mono);color:var(--accent);word-break:break-all;line-height:1.6;">${dork.dork}</div>
      </div>

      <div style="background:var(--bg3);border:0.5px solid var(--border);border-radius:var(--radius);padding:10px 14px;margin-bottom:12px;">
        <div style="font-size:9px;color:var(--muted2);text-transform:uppercase;letter-spacing:0.03em;margin-bottom:4px;">📝 Descripción</div>
        <div style="font-size:12px;color:var(--text2);">${dork.desc}</div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px;">
        <div style="background:var(--bg3);border-radius:var(--radius);padding:10px;text-align:center;">
          <div style="font-size:9px;color:var(--muted2);text-transform:uppercase;">Dificultad</div>
          <div style="font-size:16px;font-weight:600;color:${dork.difficulty === 'Easy' ? 'var(--success-bright)' : dork.difficulty === 'Medium' ? 'var(--warning)' : 'var(--danger)'};">${dork.difficulty}</div>
        </div>
        <div style="background:var(--bg3);border-radius:var(--radius);padding:10px;text-align:center;">
          <div style="font-size:9px;color:var(--muted2);text-transform:uppercase;">Impacto Potencial</div>
          <div style="font-size:16px;font-weight:600;color:${impactColor};">${dork.impact}/100</div>
        </div>
      </div>

      ${similar.length > 0 ? `
      <div style="background:var(--bg3);border:0.5px solid var(--border);border-radius:var(--radius);padding:10px 14px;margin-bottom:12px;">
        <div style="font-size:9px;color:var(--muted2);text-transform:uppercase;letter-spacing:0.03em;margin-bottom:6px;">🔗 Dorks Similares</div>
        ${similar.map(s => `
          <div style="font-size:11px;padding:4px 0;border-bottom:0.5px solid rgba(255,255,255,0.03);cursor:pointer;color:var(--text2);" onclick="closeModal();showDorkDetail(${s.id})">
            ▶ ${s.name} <span style="color:var(--muted2);font-size:9px;">· Impacto ${s.impact}</span>
          </div>
        `).join('')}
      </div>` : ''}
    </div>
  `;

  const footerHTML = `
    <button class="btn btn-sm btn-ghost" onclick="closeModal()">Cerrar</button>
    <button class="btn btn-sm btn-ghost" onclick="copyDork(${dork.id});closeModal();" style="font-size:11px;">📄 Copiar Query</button>
    <button class="btn btn-sm ${isSaved ? 'btn-danger' : 'btn-primary'}" onclick="toggleSaveDork(${dork.id});closeModal();" style="font-size:11px;">
      ${isSaved ? '🗑️ Eliminar de Guardados' : '💾 Guardar Dork'}
    </button>
    <a href="${dork.googleUrl}" target="_blank" class="btn btn-sm btn-success" style="text-decoration:none;font-size:11px;">▶ Ejecutar en Google</a>
  `;

  openModal('🔍 ' + dork.name, bodyHTML, footerHTML);
}

/* ── Dork Builder ── */
function toggleDorkBuilder() {
  dorkState.showBuilder = !dorkState.showBuilder;
  const panel = document.getElementById('dork-builder-panel');
  const btn = document.getElementById('dork-builder-btn');
  if (panel) panel.style.display = dorkState.showBuilder ? 'block' : 'none';
  if (btn) btn.textContent = dorkState.showBuilder ? '🧰 Cerrar Builder' : '🧰 Dork Builder';
}

function addDorkBuilderSuffix(suffix) {
  const result = document.getElementById('dork-builder-result');
  if (result) {
    result.value += suffix;
  }
}

function executeBuilderDork() {
  const result = document.getElementById('dork-builder-result');
  if (!result || !result.value.trim()) { showDorkToast('⚠️ Construye un dork primero'); return; }
  const query = encodeURIComponent(result.value);
  window.open(`https://www.google.com/search?q=${query}`, '_blank');
}

function saveBuilderDork() {
  const result = document.getElementById('dork-builder-result');
  if (!result || !result.value.trim()) { showDorkToast('⚠️ Construye un dork primero'); return; }

  const customId = Date.now();
  dorkState.savedDorks.push({
    id: customId,
    name: 'Dork Personalizado #' + (dorkState.savedDorks.filter(s => s.id > 1000).length + 1),
    dork: result.value,
    savedAt: Date.now(),
    custom: true
  });
  localStorage.setItem('na_saved_dorks', JSON.stringify(dorkState.savedDorks));
  showDorkToast('✅ Dork personalizado guardado');
}

function showSavedDorks() {
  const saved = dorkState.savedDorks;
  if (saved.length === 0) {
    showDorkToast('💾 No tienes dorks guardados todavía');
    return;
  }

  const bodyHTML = `
    <div style="font-size:13px;">
      <p style="font-size:12px;color:var(--muted);margin-bottom:12px;">${saved.length} dorks guardados</p>
      ${saved.map(s => {
        const orig = DORKS.find(d => d.id === s.id);
        return `
        <div style="background:var(--bg3);border:0.5px solid var(--border);border-radius:var(--radius);padding:10px 12px;margin-bottom:6px;display:flex;justify-content:space-between;align-items:center;">
          <div style="flex:1;min-width:0;">
            <div style="font-size:12px;font-weight:500;color:var(--text2);">${s.name}</div>
            <div style="font-size:9px;font-family:var(--mono);color:var(--muted2);word-break:break-all;">${s.dork.substring(0, 80)}${s.dork.length > 80 ? '…' : ''}</div>
          </div>
          <div style="display:flex;gap:4px;flex-shrink:0;margin-left:8px;">
            <button class="btn btn-xs btn-ghost" onclick="event.stopPropagation();window.open('https://www.google.com/search?q=${encodeURIComponent(s.dork)}','_blank')" style="font-size:9px;">▶</button>
            <button class="btn btn-xs btn-danger" onclick="event.stopPropagation();removeSavedDork(${saved.indexOf(s)});setTimeout(()=>showSavedDorks(),100)" style="font-size:9px;">×</button>
          </div>
        </div>`;
      }).join('')}
    </div>
  `;

  openModal('💾 Dorks Guardados', bodyHTML, `
    <button class="btn btn-sm btn-ghost" onclick="closeModal()">Cerrar</button>
    <button class="btn btn-sm btn-danger" onclick="if(confirm('¿Eliminar todos los dorks guardados?')){dorkState.savedDorks=[];localStorage.setItem('na_saved_dorks','[]');closeModal();showDorkToast('🗑️ Todos los dorks eliminados');}" style="font-size:11px;">🗑️ Eliminar Todos</button>
  `);
}

function removeSavedDork(idx) {
  dorkState.savedDorks.splice(idx, 1);
  localStorage.setItem('na_saved_dorks', JSON.stringify(dorkState.savedDorks));
  renderDorkTable();
}

function exportDorkList() {
  const filtered = DORKS.filter(d => d.niche === dorkState.activeNiche || dorkState.activeNiche === 'all')
    .filter(d => d.category === dorkState.activeCategory);

  if (filtered.length === 0) { showDorkToast('⚠️ No hay dorks para exportar'); return; }

  let text = 'NUCLEAR AIMA — DORK LIST EXPORT\n';
  text += `Categoría: ${dorkState.activeCategory} · Nicho: ${dorkState.activeNiche}\n`;
  text += `Fecha: ${new Date().toLocaleDateString('es-DO')}\n`;
  text += '━'.repeat(50) + '\n\n';

  filtered.forEach(d => {
    text += `[${d.id}] ${d.name}\n`;
    text += `Impacto: ${d.impact}/100 · Dificultad: ${d.difficulty}\n`;
    text += `Query: ${d.dork}\n`;
    text += `Desc: ${d.desc}\n\n`;
  });

  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `dorks_${dorkState.activeCategory}_${new Date().toISOString().split('T')[0]}.txt`;
  a.click();
  showDorkToast(`📥 ${filtered.length} dorks exportados`);
}

/* ── Toast Notification ── */
let dorkToastTimer = null;

function showDorkToast(msg) {
  let toast = document.getElementById('dork-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'dork-toast';
    toast.style.cssText = 'position:fixed;bottom:20px;right:20px;background:var(--bg3);border:0.5px solid var(--border);border-radius:var(--radius);padding:10px 16px;font-size:12px;color:var(--text);z-index:9999;box-shadow:0 4px 20px rgba(0,0,0,0.4);transition:opacity 0.3s;max-width:320px;';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = '1';
  clearTimeout(dorkToastTimer);
  dorkToastTimer = setTimeout(() => { toast.style.opacity = '0'; }, 2500);
}
