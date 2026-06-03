/* ══════════════════════════════════════════════
   NUCLEAR AIMA — MASTER PLAN v1.0
   Manual Maestro de Infraestructura Digital
   ══════════════════════════════════════════════ */

const MASTER_SECTIONS = [
  {
    id: 'otohits',
    title: '1. Ingeniería y Matemática de Retención Profunda (Otohits + VPS)',
    subtitle: 'Cálculos de precisión basados en la Ley de Little para tráfico web',
    icon: '⚙',
    iconBg: '#1a2a1a',
    iconColor: '#6ecfa5',
    content: `
      <div class="highlight-box">
        <strong>Escenario Actual:</strong> 50 Terminales — 3 min — 1,000 visitas/hora
      </div>
      <table>
        <tr><th>Parámetro</th><th>Valor</th></tr>
        <tr><td>Terminales activas</td><td class="num">50</td></tr>
        <tr><td>Duración por visita</td><td class="num">180 segundos (3 minutos)</td></tr>
        <tr><td>Visitas por hora</td><td class="num">1,000</td></tr>
        <tr><td>Capacidad por terminal</td><td class="num">20 visitas/hora</td></tr>
        <tr><td>Inversión mensual</td><td class="num">~$52 USD</td></tr>
      </table>

      <h4>Expansión: 160 Terminales — 10 min — 37,000 visitas/hora</h4>
      <table>
        <tr><th>Parámetro</th><th>Valor</th></tr>
        <tr><td>Terminales activas</td><td class="num">160</td></tr>
        <tr><td>Duración por visita</td><td class="num">600 segundos (10 min)</td></tr>
        <tr><td>Visitas por hora</td><td class="num">37,000</td></tr>
        <tr><td>Capacidad por terminal</td><td class="num">6 visitas/hora</td></tr>
        <tr><td>Inversión mensual</td><td class="num">~$200 USD</td></tr>
      </table>

      <h4>Máxima Capacidad: 11,807 Terminales — 100K visitas</h4>
      <table>
        <tr><th>Parámetro</th><th>Valor</th></tr>
        <tr><td>Terminales necesarias</td><td class="num">11,807</td></tr>
        <tr><td>Costo total (compartido)</td><td class="num">~$7,500 USD</td></tr>
        <tr><td>Costo por terminal</td><td class="num">~$0.39</td></tr>
      </table>

      <div class="highlight-box">
        <strong>Regla de Oro para YouTube:</strong><br>
        • Landing de puente con el video incrustado (OBLIGATORIO)<br>
        • Drip-feed estricto de 15-20 visitas por hora<br>
        • Retención mínima del 50-70% del video<br>
        • Mezcla de referrers: 40% por keyword · 30% tráfico social · 30% videos relacionados
      </div>

      <h4>Costos en RD$ (Tasa: 58.50 DOP/USD)</h4>
      <table>
        <tr><th>Escenario</th><th>USD</th><th>RD$</th></tr>
        <tr><td>50 terminales (actual)</td><td class="num">$52/mes</td><td class="num">RD$ 3,042/mes</td></tr>
        <tr><td>160 terminales (expandido)</td><td class="num">~$200/mes</td><td class="num">~RD$ 11,700/mes</td></tr>
        <tr><td>Light (menor retención)</td><td class="num">$12/mes</td><td class="num">RD$ 702/mes</td></tr>
      </table>
    `
  },
  {
    id: 'wiki',
    title: '2. Wiki Modular de Plataformas Globales (A-G)',
    subtitle: 'Glosario completo con +30 plataformas: quién es, qué hace, qué haremos',
    icon: '📖',
    iconBg: '#1a1a35',
    iconColor: '#9e7de8',
    content: `
      <h3>2.A Módulo A: Intercambio de Tráfico y Automatización</h3>
      <table>
        <tr><th>Plataforma</th><th>Precio</th><th>Qué haremos</th></tr>
        <tr><td><strong>SparkTraffic</strong> — Bot residencial simulado con API</td><td>desde $9.99/mes</td><td>YouTube referrer + SEO analytics</td></tr>
        <tr><td><strong>Babylon Traffic</strong> — Comportamiento programado</td><td>desde $29/mes</td><td>Playlists YouTube + clics sugeridos</td></tr>
        <tr><td><strong>RankBoostUp</strong> — Autosurf + intercambio</td><td>Créditos / pago</td><td>Búsqueda orgánica por keyword</td></tr>
        <tr><td><strong>10KHits</strong> — Autosurf automatizado con API</td><td>desde $4.99</td><td>Inflar estadísticas + tráfico bot</td></tr>
        <tr><td><strong>EasyHits4U</strong> — Manual surf humano</td><td>Créditos / pago</td><td>Páginas de captura + leads</td></tr>
        <tr><td><strong>Otohits</strong> — Autosurf clásico</td><td>Créditos</td><td>Tráfico web básico + intercambio</td></tr>
      </table>

      <h3>2.B Módulo B: Redes Pop / Push / Popunder</h3>
      <table>
        <tr><th>Plataforma</th><th>CPM</th><th>Mínimo</th><th>Qué haremos</th></tr>
        <tr><td><strong>HilltopAds</strong></td><td>$0.50 - $4</td><td>$50</td><td>Segmentación por operador/ciudad</td></tr>
        <tr><td><strong>PropellerAds</strong></td><td>$0.20 - $1.50</td><td>$100</td><td>Tráfico móvil + IA Target CPA</td></tr>
        <tr><td><strong>PopAds</strong></td><td>$0.50 - $3</td><td>$5</td><td>Tokens URL + trackers JS</td></tr>
        <tr><td><strong>PopCash</strong></td><td>$0.50 - $3</td><td>$10</td><td>Scripts pesados + velocidad</td></tr>
        <tr><td><strong>Adsterra</strong></td><td>$0.30 - $2</td><td>$100</td><td>CPA + software + VPN</td></tr>
        <tr><td><strong>RichAds</strong></td><td>$0.40 - $3</td><td>$100</td><td>Cripto + finanzas + salud</td></tr>
      </table>

      <h3>2.C Módulo C: Faucets y Plataformas PTC</h3>
      <table>
        <tr><th>Plataforma</th><th>Costo 1K visitas</th><th>Qué haremos</th></tr>
        <tr><td><strong>FireFaucet</strong> — Faucet/PTC con ventana activa</td><td>~$2-$5</td><td>Video autoplay + retención real</td></tr>
        <tr><td><strong>CoinPayU</strong> — Faucet/PTC/Video</td><td>~$3-$8</td><td>YouTube embed + iFrame validación</td></tr>
        <tr><td><strong>FaucetPay</strong> — Microprocesador</td><td>~$2-$6</td><td>Filtrado anti-bots</td></tr>
        <tr><td><strong>AdBTC</strong> — PTC Bitcoin</td><td>~$1-$4</td><td>Scripts de fondo + blogs</td></tr>
      </table>

      <h3>2.D Módulo D: Redes de Micro-tareas e Intercambio Social (SMM)</h3>
      <table>
        <tr><th>Plataforma</th><th>Precio</th><th>Qué haremos</th></tr>
        <tr><td><strong>BossLike</strong> — Likes y comentarios inmediatos</td><td>$10-$100/campaña</td><td>Primeras 2 horas: likes + comentarios</td></tr>
        <tr><td><strong>AddMeFast</strong> — Social Exchange</td><td>Créditos / $10-$50</td><td>Inyectar volumen en las primeras horas</td></tr>
        <tr><td><strong>MarketFollowers</strong> — Micro-tareas</td><td>$5-$30/campaña</td><td>Señales sociales coordinadas</td></tr>
      </table>

      <h3>2.E Módulo E: SEO, Linkbuilding y Foros</h3>
      <table>
        <tr><th>Plataforma</th><th>Precio</th><th>Qué haremos</th></tr>
        <tr><td><strong>Getalink</strong> — Linkbuilding +30 países</td><td>$50-$300/enlace</td><td>Silos y Tiering (T2 → T1)</td></tr>
        <tr><td><strong>Growwer</strong> — Linkbuilding con IA</td><td>$60-$400/enlace</td><td>Embed de reproductores Spotify/YT</td></tr>
        <tr><td><strong>Publisuites</strong> — Blog + Twitter + Influencer</td><td>$30-$200</td><td>Señales sociales + SEO simultáneo</td></tr>
        <tr><td><strong>BlackHatWorld</strong> — Foro marketplace global</td><td>$5-$500</td><td>PBNs + perfiles + reseñas</td></tr>
        <tr><td><strong>ForoBeta</strong> — Foro marketplace hispano</td><td>$5-$200</td><td>Compra/venta blogs + canales TG</td></tr>
      </table>

      <h3>2.F Módulo F: Promoción Musical y Campañas Virales (UGC)</h3>
      <table>
        <tr><th>Plataforma</th><th>Precio</th><th>Qué haremos</th></tr>
        <tr><td><strong>Sound.me</strong> — Activación TikToK/IG/Shorts</td><td>Mín. $250</td><td>Réplicas masivas el día del estreno</td></tr>
        <tr><td><strong>Playlist Push</strong> — Micro-influencers musicales</td><td>Mín. $350</td><td>Volumen de visualizaciones con música</td></tr>
        <tr><td><strong>Collabstr</strong> — Marketplace UGC</td><td>desde $50/video</td><td>Bailes específicos + contenido estético</td></tr>
        <tr><td><strong>YouGrow Promo</strong> — Paquetes garantizados</td><td>~€267</td><td>Artistas independientes mercado EU</td></tr>
        <tr><td><strong>SubmitHub</strong> — Créditos por evaluación</td><td>$1-$2/envío</td><td>Validar calidad + estadísticas reales</td></tr>
        <tr><td><strong>Groover</strong> — Grooviz con reembolso</td><td>~$2/contacto</td><td>Campaña rápida con garantía de escucha</td></tr>
      </table>

      <h3>2.G Módulo G: Safelists, Viral Mailers y Lead Generation</h3>
      <table>
        <tr><th>Plataforma</th><th>Precio</th><th>Qué haremos</th></tr>
        <tr><td><strong>MLGS</strong> — Leads diarios automatizados</td><td>~$37/mes</td><td>Base de inversionistas Web3</td></tr>
        <tr><td><strong>Referral Frenzy</strong> — Safelist viral + mailers</td><td>~$15/mes + $5-$10/envío</td><td>Tráfico diario con copy de inversión</td></tr>
        <tr><td><strong>LeadsLeap</strong> — Tráfico + email</td><td>~$20/mes</td><td>Campañas a LATAM (Tier 2-3)</td></tr>
        <tr><td><strong>Herculist</strong> — Safelist premium</td><td>$10-$40/envío</td><td>MMO + cripto + afiliados</td></tr>
        <tr><td><strong>TrafficZipper</strong> — Múltiples listas unificadas</td><td>Suscripción fija</td><td>Afiliados + ingresos pasivos</td></tr>
        <tr><td><strong>Udimi</strong> — Solo Ads marketplace</td><td>$0.35-$0.80/clic</td><td>Email marketing + infoproductos</td></tr>
      </table>
    `
  },
  {
    id: 'djs',
    title: '3. DJs, Radios y Emisoras — RD e Internacional',
    subtitle: 'Guía completa de distribución musical y relaciones públicas',
    icon: '🎵',
    iconBg: '#2a1a25',
    iconColor: '#e87d9e',
    content: `
      <h4>República Dominicana</h4>
      <div class="highlight-box">
        <strong>AsoDJ</strong> — Asociación de DJs Dominicanos. Organización formal que agrupa a DJs de discotecas, emisoras y eventos privados.<br>
        <strong>Musicólogos / Car Kits</strong> — Colectivos en Av. Venezuela y Av. España. Sistemas de sonido de alta potencia en vehículos. Controlan el street-marketing musical.<br>
        <strong>Pools digitales</strong> — Canales de Telegram/WhatsApp liderados por DJ Scuff y DJ Chris. Distribución semanal directa.
      </div>

      <h4>Medios Clave en Santo Domingo</h4>
      <table>
        <tr><th>Medio</th><th>Tipo</th><th>Alcance</th></tr>
        <tr><td>De Extremo a Extremo</td><td>TV/Radio</td><td>Nacional — Mañanero</td></tr>
        <tr><td>El Show del Mediodía</td><td>TV</td><td>Nacional — Mediodía</td></tr>
        <tr><td>Alofoke FM 99.3</td><td>Radio</td><td>Santo Domingo</td></tr>
        <tr><td>Mortal FM 104.9</td><td>Radio</td><td>Santo Domingo</td></tr>
        <tr><td>La Bakana 105.7</td><td>Radio</td><td>Santo Domingo</td></tr>
      </table>

      <h4>Santiago / El Cibao</h4>
      <table>
        <tr><th>Medio</th><th>Tipo</th></tr>
        <tr><td>Teleuniverso Canal 29</td><td>TV</td></tr>
        <tr><td>Full 94.1 FM</td><td>Radio</td></tr>
        <tr><td>Turbo 98.3 FM</td><td>Radio</td></tr>
        <tr><td>Level Club</td><td>Discoteca</td></tr>
      </table>

      <h4>Páginas de Promoción Digital (RD)</h4>
      <p>Promo809 · ElCorilloRD · MundonRD · RapDominicano.com · KeDificil · TeteoInformativo · Remolacha.net · Fogón TV · Casimira</p>

      <h4>Estrategia: Gira de Medios (5 Días)</h4>
      <table>
        <tr><th>Día</th><th>Actividad</th></tr>
        <tr><td>Lunes</td><td>Rueda de prensa en lounge / encuentro con prensa escrita</td></tr>
        <tr><td>Martes</td><td>TV/Radio matutina nacional (Santo Domingo)</td></tr>
        <tr><td>Miércoles</td><td>Viaje a Santiago / Cibao — Entrevistas TV+Radio+Clubes</td></tr>
        <tr><td>Jueves</td><td>Reunión con directores de AsoDJs + pools de WhatsApp y Telegram</td></tr>
        <tr><td>Viernes</td><td>Ruta de discotecas: Av. Venezuela, Zona Colonial y Naco</td></tr>
      </table>

      <h4>DJs e Infraestructura Internacional</h4>
      <table>
        <tr><th>País</th><th>Asociaciones / Colectivos Clave</th></tr>
        <tr><td>EE.UU.</td><td>The Heavy Hitters, Lo Maximo Productions, Latin DJ Alliance, Uforia</td></tr>
        <tr><td>Puerto Rico</td><td>ADJPR, La Nueva Artillería</td></tr>
        <tr><td>Colombia</td><td>ACODJS, Crossover DJ Association, ACL, La Mega</td></tr>
        <tr><td>México</td><td>Movimiento Sonidero (La Changa/Pancho), DJ City Latino, ANLM</td></tr>
        <tr><td>Venezuela</td><td>AVEDJ, Minitecas</td></tr>
        <tr><td>Chile</td><td>ADJCh, PortalFoxMix, Radio Carolina / Los 40</td></tr>
        <tr><td>España</td><td>AEDYP, Los 40 Urban, MegaDJs</td></tr>
      </table>

      <h4>Record Pools Globales</h4>
      <p><strong>DJCity</strong> · <strong>BPM Supreme</strong> · <strong>Digital Music Pool (DMP)</strong> · <strong>Monitor Latino / Vericast</strong> (auditoría de sonar en radio)</p>
    `
  },
  {
    id: 'youtube',
    title: '4. YouTube — Portada, Masthead y Estrategia Algorítmica',
    subtitle: 'De 0 a portada: tácticas institucionales y hacking algorítmico',
    icon: '▶',
    iconBg: '#2a1a1a',
    iconColor: '#e05c5c',
    content: `
      <h4>Método 1: YouTube Masthead (Compra de Portada Oficial)</h4>
      <div class="highlight-box">
        <strong>¿Qué es?</strong> Banner de video interactivo en la parte superior de YouTube por 24 horas. Genera millones de impresiones directas.<br>
        <strong>¿Cómo se compra?</strong> Contactando directamente a un representante de ventas de Google. Modelo CPD (Costo por Día) o CPM reservado.<br>
        <strong>¿Quién lo usa?</strong> Productoras de Hollywood, artistas globales en días clave de lanzamiento.<br>
        <strong>Para nosotros:</strong> En lanzamiento del concierto del 23S como golpe de autoridad.
      </div>

      <h4>Método 2: Hackear el Algoritmo (Las Primeras 2 Horas)</h4>
      <div class="highlight-box">
        <strong>Plan de Ataque:</strong><br>
        1. <strong>BossLike</strong> — Likes y comentarios inmediatos vía API<br>
        2. <strong>ForoBeta</strong> — Compartir enlace en el marketplace<br>
        3. <strong>Prensarank</strong> — Inserción en webs indexadas<br>
        4. <strong>RankBoostUp / CoinPayU</strong> — Tráfico forzado con retención >80%<br>
        5. <strong>Sound.me / Collabstr</strong> — Micro-influencers replicando contenido<br>
        6. <strong>Taboola / Outbrain</strong> — Anuncios nativos dirigidos a la landing
      </div>

      <h4>Método 3: Estrategia de Tendencias (Trending)</h4>
      <ul>
        <li><strong>Pauta nativa local</strong> — Google Ads segmentado por ubicación + keywords de tendencia</li>
        <li><strong>Subida masiva de UGC</strong> — Mismo día del lanzamiento, múltiples cuentas replicando fragmentos</li>
        <li><strong>Oleada de usuarios móviles</strong> — Saltar de TikTok a YouTube (Velocity): crear fragmentos virales en TT con llamado a "Link en bio"</li>
        <li><strong>Retención forzada</strong> — Otohits con landing de puente, retención 50-70%, drip-feed 15-20 visitas/hora</li>
      </ul>

      <h4>Advertencias Estratégicas YouTube 2026 (IVT)</h4>
      <div class="highlight-box">
        <strong>Para burlar la detección de tráfico inválido:</strong><br>
        • Retención del 50-70% (ni muy baja ni perfecta)<br>
        • Mezcla de fuentes: 40% búsquedas, 30% redes, 30% sugeridos<br>
        • Drip-feed de 15-20 visitas/hora (no en ráfagas)<br>
        • Landing de puente OBLIGATORIA (nunca directo al video)<br>
        • Variar User-Agents y referrers constantemente
      </div>
    `
  },
  {
    id: 'prensa',
    title: '5. Prensa Digital y Publicidad Nativa',
    subtitle: 'Gestión de reputación, notas de prensa y publicidad en medios',
    icon: '📰',
    iconBg: '#2a251a',
    iconColor: '#e8c96e',
    content: `
      <h4>Plataformas de Intermediación</h4>
      <table>
        <tr><th>Plataforma</th><th>Precio</th><th>Alcance</th></tr>
        <tr><td><strong>Prensarank</strong></td><td>$75-$300</td><td>Compra grupal España + LATAM. 4 anunciantes comparten artículo.</td></tr>
        <tr><td><strong>Unancor / Linkilike</strong></td><td>$200-$2,000</td><td>Profesional. Periodistas nativos. Filtro por DA y tráfico.</td></tr>
        <tr><td><strong>PR Newswire / EIN Presswire</strong></td><td>$300-$1,000</td><td>Distribución masiva. 1 nota llega a 200+ diarios.</td></tr>
      </table>

      <h4>Pauta Directa en República Dominicana</h4>
      <div class="highlight-box">
        <strong>Medios tradicionales:</strong> Diario Libre, Listín Diario, El Día, Acento<br>
        <strong>Requiere:</strong> Media Kit auditado para formatos de Banners CPM o Publirreportajes<br>
        <strong>Costo estimado:</strong> $800-$2,500 USD por artículo patrocinado
      </div>

      <h4>Publicidad Nativa / Open Web</h4>
      <table>
        <tr><th>Plataforma</th><th>CPC</th><th>Mínimo</th><th>Qué haremos</th></tr>
        <tr><td><strong>Taboola</strong></td><td>$0.10-$0.50</td><td>$10/día</td><td>Tráfico masivo a landing pages (Bloomberg, NBC, El Mundo)</td></tr>
        <tr><td><strong>Outbrain</strong></td><td>$0.10-$0.50</td><td>$10/día</td><td>Engagement y conversiones (CNN, Sky News)</td></tr>
        <tr><td><strong>MGID</strong></td><td>$0.05-$0.30</td><td>$100/mes</td><td>Volumen en LATAM, Europa del Este y Asia</td></tr>
        <tr><td><strong>Revcontent</strong></td><td>$0.05-$0.25</td><td>$100/mes</td><td>Velocidad de carga rápida en widgets</td></tr>
      </table>

      <h4>Buscadores (Search Marketing)</h4>
      <table>
        <tr><th>Plataforma</th><th>CPC Est.</th><th>Mínimo</th></tr>
        <tr><td>Google Ads</td><td>$1.00-$5.00+</td><td>Sin mínimo</td></tr>
        <tr><td>Microsoft Advertising (Bing)</td><td>$0.80-$3.00</td><td>Sin mínimo</td></tr>
        <tr><td>Yandex Direct (Rusia + CIS)</td><td>$0.10-$2.00</td><td>~$60</td></tr>
        <tr><td>Naver Search Ads (Corea del Sur)</td><td>Variable</td><td>Variable</td></tr>
      </table>
    `
  },
  {
    id: 'web3',
    title: '6. Análisis de Conversión Web3 — Música Tokenizada',
    subtitle: 'Evaluación del embudo financiero para campañas de música como activo',
    icon: '🔗',
    iconBg: '#1a2535',
    iconColor: '#5c8ce0',
    content: `
      <h4>Parámetros de Simulación Mensual</h4>
      <table>
        <tr><th>Parámetro</th><th>Valor</th></tr>
        <tr><td>Inversión Mensual Fija (IMF)</td><td class="num">$70.00 USD (RD$ 4,095)</td></tr>
        <tr><td>Volumen de Clics Brutos Generados</td><td class="num">30,000 clics/mes</td></tr>
        <tr><td>CTR Promedio (Apertura/Clic)</td><td class="num">1.85%</td></tr>
        <tr><td>Visitas Reales Efectivas (VRE) a Landing</td><td class="num">555 usuarios</td></tr>
        <tr><td>Tasa de Suscripción a Comunidad (Discord/Telegram)</td><td class="num">8.12%</td></tr>
        <tr><td>Leads Cualificados (LC) Capturados</td><td class="num">45.07 leads</td></tr>
        <tr><td>Tasa de Conversión Final a Holder de Token/NFT</td><td class="num">4.43%</td></tr>
        <tr><td>Holders Adquiridos Netos (HAN)</td><td class="num">~2 holders/mes</td></tr>
      </table>

      <h4>Costos Unitarios</h4>
      <div class="highlight-box">
        <strong>Costo por Lead Cualificado (CPL):</strong><br>
        $70.00 ÷ 45.07 LC = <strong>$1.55 USD</strong> → <strong>RD$ 90.86</strong> por lead
      </div>
      <div class="highlight-box">
        <strong>Costo de Adquisición de Holder (CAH):</strong><br>
        $70.00 ÷ 1.996 HAN = <strong>$35.06 USD</strong> → <strong>RD$ 2,051.19</strong> por holder
      </div>

      <h4>Ecuaciones de Precisión</h4>
      <div style="background:var(--bg3);border:0.5px solid var(--border);border-radius:var(--radius);padding:12px 16px;font-family:var(--mono);font-size:12px;line-height:1.8;margin:0.8rem 0;">
        <div><span style="color:var(--accent);">CPL</span> = IMF ÷ LC = 70.00 ÷ 45.066 = 1.5532 USD → 90.8622 DOP</div>
        <div><span style="color:var(--accent);">CAH</span> = IMF ÷ HAN = 70.00 ÷ 1.9964 = 35.0631 USD → 2,051.1913 DOP</div>
        <div><span style="color:var(--accent);">ROI</span> = (Valor Token × Holders) ÷ Inversión Total</div>
      </div>

      <h4>Embudo Web3 — Paso a Paso</h4>
      <ol style="list-style:decimal;padding-left:20px;color:var(--text2);font-size:13px;line-height:1.8;">
        <li style="padding-left:4px;">Inversión de $70/mes en safelists y redes PTC</li>
        <li style="padding-left:4px;">30,000 clics brutos → 555 visitas reales a la landing</li>
        <li style="padding-left:4px;">Captura de 45 leads en Discord/Telegram</li>
        <li style="padding-left:4px;">Conversión de ~2 holders de token por mes</li>
        <li style="padding-left:4px;">Cada holder = inversor activo en el ecosistema del artista</li>
      </ol>

      <div class="highlight-box">
        <strong>Modelo de Negocio Web3:</strong><br>
        La música se presenta como un activo financiero indexado. Los holders reciben dividendos automáticos cada vez que la música suena en radio, Spotify o discotecas, a través de contratos inteligentes descentralizados.
      </div>
    `
  },
  {
    id: 'embudo',
    title: '7. Embudo Automatizado Global',
    subtitle: 'Arquitectura completa: ManyChat + Ninjagram + Safelists + Landing Page',
    icon: '🔄',
    iconBg: '#1a2a25',
    iconColor: '#6ecfa5',
    content: `
      <div class="highlight-box">
        <strong>Arquitectura del Sistema</strong><br>
        1. <strong>Ninjagram (en VPS)</strong> — Automatización de DMs, seguimientos y scraping de leads las 24/7<br>
        2. <strong>ManyChat Pro</strong> — Respuesta automática a DMs entrantes con flujos condicionales<br>
        3. <strong>Safelists (MLGS + Referral Frenzy + LeadsLeap)</strong> — Tráfico diario a la landing page<br>
        4. <strong>Landing Page Puente</strong> — Video incrustado + captura de leads + enlace Web3<br>
        5. <strong>Otohits</strong> — Retención forzada en YouTube con landing de puente<br>
        6. <strong>Discord/Telegram</strong> — Comunidad de holders e inversionistas
      </div>

      <h4>Flujo Completo de Operación</h4>
      <div style="background:var(--bg3);border:0.5px solid var(--border);border-radius:var(--radius);padding:14px;font-family:var(--mono);font-size:11px;line-height:1.6;margin:0.8rem 0;color:#b0aca4;">
        ┌──────────────────────────────────────────────────┐<br>
        │            VPS WINDOWS SERVER (24/7)              │<br>
        │  ┌─────────────┐  ┌───────────┐  ┌───────────┐  │<br>
        │  │  Ninjagram  │  │  Otohits  │  │  ManyChat │  │<br>
        │  │  (DMs + DM) │  │ (Tráfico) │  │  (AutoDM) │  │<br>
        │  └──────┬──────┘  └─────┬─────┘  └─────┬─────┘  │<br>
        └─────────┼───────────────┼───────────────┼────────┘<br>
                  │               │               │<br>
        ┌─────────▼───────────────▼───────────────▼────────┐<br>
        │              SAFELISTS + MAILERS                   │<br>
        │  ┌──────────┐  ┌──────────────┐  ┌───────────┐   │<br>
        │  │   MLGS   │  │ Ref. Frenzy  │  │ LeadsLeap │   │<br>
        │  └────┬─────┘  └──────┬───────┘  └─────┬─────┘   │<br>
        └───────┼───────────────┼─────────────────┼─────────┘<br>
                │               │                 │<br>
        ┌───────▼───────────────▼─────────────────▼─────────┐<br>
        │              LANDING PAGE (Puente)                  │<br>
        │  ┌────────────────┐  ┌─────────────────────────┐   │<br>
        │  │ Video YouTube  │  │ Captura Email / Wallet   │   │<br>
        │  │ (incrustado)   │  │ + Call to Action Web3    │   │<br>
        │  └───────┬────────┘  └───────────┬─────────────┘   │<br>
        └──────────┼───────────────────────┼─────────────────┘<br>
                   │                       │<br>
        ┌──────────▼───────────────────────▼─────────────────┐<br>
        │              COMUNIDAD + CONVERSIÓN                  │<br>
        │  ┌──────────────┐  ┌────────────────────────────┐  │<br>
        │  │ Discord/TG   │  │ Holders de Token / NFT     │  │<br>
        │  │ (Leads)      │  │ (Inversionistas activos)   │  │<br>
        │  └──────────────┘  └────────────────────────────┘  │<br>
        └────────────────────────────────────────────────────┘
      </div>

      <h4>Copywriting — Prospección Directa para Curadores</h4>
      <div style="background:var(--bg3);border:0.5px solid var(--border);border-radius:var(--radius);padding:14px;font-size:12px;line-height:1.7;margin:0.8rem 0;color:var(--text2);">
        <strong style="color:var(--accent);">Asunto:</strong> Tu playlist me salvó el viaje de esta mañana 🇩🇴<br><br>
        Hola [Nombre del Curador],<br><br>
        Te escribo escuchando tu playlist [Nombre]. La combinación que armaste entre los clásicos y los nuevos talentos es una joya. Encontré tu contacto en la descripción mientras navegaba y no quise dejar pasar el día sin agradecerte por el criterio.<br><br>
        Trabajo con un proyecto musical que tiene exactamente esa misma vibra orgánica. No te vengo a vender nada. Solo quiero dejarte una pista que acabamos de masterizar. Si sientes que conecta con el viaje de tu playlist, sería un honor que la consideres para tu próxima actualización.<br><br>
        [Enlace a la canción / Landing Puente]<br><br>
        Un abrazo desde Santo Domingo.
      </div>

      <h4>Copywriting — Enfoque Web3 para Inversionistas</h4>
      <div style="background:var(--bg3);border:0.5px solid var(--border);border-radius:var(--radius);padding:14px;font-size:12px;line-height:1.7;margin:0.8rem 0;color:var(--text2);">
        <strong style="color:var(--accent);">Asunto:</strong> Dejaron de ser artistas para volverse un negocio de por vida... 🇩🇴<br><br>
          Si estás leyendo esto dentro de la red, es porque entiendes el valor de cazar oportunidades antes de que todos se enteren.<br><br>
          Acabamos de lanzar la infraestructura de música tokenizada de [Artista], un sistema Web3 donde no te pedimos que seas un fanático; te damos la oportunidad de ser dueño de una fracción de las regalías del próximo hit mundial.<br><br>
          Cada vez que la música suene en radio, Spotify o discotecas, los holders del token reciben dividendos automáticos en sus billeteras digitales.<br><br>
          Mira el ecosistema completo aquí: [Landing Page]<br><br>
          Nos vemos dentro del Discord oficial.
      </div>

      <h4>Cronograma de Ejecución (4 Semanas)</h4>
      <table>
        <tr><th>Fase</th><th>Semana</th><th>Objetivo</th><th>Inversión</th></tr>
        <tr><td>1</td><td>Semana 1</td><td>Fundación Digital: infraestructura y activos</td><td>$0 - $50</td></tr>
        <tr><td>2</td><td>Semana 2</td><td>Tráfico y Presencia Inicial: primeras campañas</td><td>$100 - $300</td></tr>
        <tr><td>3</td><td>Semana 3</td><td>Amplificación y Prensa: DJs + curación</td><td>$300 - $800</td></tr>
        <tr><td>4</td><td>Semana 4</td><td>Viral y Consolidación: influencers + algoritmos</td><td>$500 - $2,000</td></tr>
      </table>
    `
  },
  {
    id: 'estrella',
    title: '8. ⭐ Paso a Paso Estrella — Plan Maestro Ramón Orlando',
    subtitle: '8 fases para rescatar, registrar y monetizar el catálogo de 178 canciones en 17 álbumes',
    icon: '⭐',
    iconBg: '#2a1a0a',
    iconColor: '#f0c040',
    content: `
      <div class="highlight-box">
        <strong>Objetivo Final:</strong> Adelanto de $500K-$1M USD de Believe o The Orchard contra regalías futuras del catálogo completo.<br>
        <strong>Catalizador:</strong> Concierto 50 Aniversario — 23 Sept 2026 — Estadio Olímpico Félix Sánchez — 40+ artistas invitados.<br>
        <strong>Evidencia:</strong> 300M+ reproducciones auditadas sin distribución activa — dinero fugándose hoy.
      </div>

      <h4>FASE 1 — Fundación Legal Local (Semana 1-4)</h4>
      <table>
        <tr><th>Paso</th><th>Institución</th><th>Costo USD</th><th>Días</th></tr>
        <tr><td>1. Registro Nombre Comercial</td><td>ONAPI (Clase 41 + 35)</td><td>~$100</td><td>5-10</td></tr>
        <tr><td>2. Constitución SRL</td><td>Cámara de Comercio + DGII</td><td>~$450</td><td>15-20</td></tr>
        <tr><td>3. Productor Fonográfico</td><td>ONDA</td><td>~$150</td><td>10-15</td></tr>
        <tr><td>4. Contrato Matriz</td><td>Abogado Entretenimiento</td><td>~$300</td><td>3-5</td></tr>
        <tr><td><strong>Total Fase 1</strong></td><td></td><td><strong>~$1,000</strong></td><td><strong>~30 días</strong></td></tr>
      </table>
      <p style="color:var(--muted);font-size:12px;margin-top:6px;"><strong>Orden estricto:</strong> ONAPI → SRL → RNC → Cuenta Bancaria → ONDA → Contrato. Cada paso depende del anterior.</p>

      <h4>FASE 2 — Auditoría del Catálogo (Semana 2-5)</h4>
      <div class="highlight-box">
        <strong>Herramienta de auditoría propietaria (Scalin Flow IA):</strong><br>
        • Rastreo de 250-450 nodos por canción en YouTube + Spotify<br>
        • Detección de huella sonora para filtrar falsos positivos<br>
        • Cálculo de yield por nodo usando eCPM del género tropical ($1.20)<br>
        • Documento ejecutivo con vistas totales, ingreso fugado y proyección<br>
        • Ejemplo: "Te Compro Tu Novia" tiene 2,000+ nodos identificados
      </div>

      <h4>FASE 3 — Contacto con el Artista (Semana 5-6)</h4>
      <ul>
        <li>Primer contacto mencionando el problema sin revelar números exactos</li>
        <li>Primera reunión formal — se cobra. El artista paga por ver la auditoría</li>
        <li>Presentar: números reales, contrato de administración listo, plan de acción</li>
        <li>El artista firma cediendo administración exclusiva de derechos digitales</li>
        <li><strong>Nunca subir nada antes de tener la firma</strong></li>
      </ul>

      <h4>FASE 4 — Registro en Plataformas de Cobro (Semana 6-8)</h4>
      <table>
        <tr><th>Plataforma</th><th>Qué hace</th><th>Impacto estimado</th></tr>
        <tr><td>SoundExchange</td><td>Libera retroactivo de radio digital EE.UU.</td><td>$40K-$80K USD retenidos</td></tr>
        <tr><td>ASCAP o BMI</td><td>Cobro de derechos ejecución pública</td><td>Flujo mensual continuo</td></tr>
        <tr><td>SGACEDOM</td><td>Flujo local dominicano</td><td>Regalías domésticas</td></tr>
      </table>

      <h4>FASE 5 — Distribución y Content ID (Semana 8-12)</h4>
      <ul>
        <li><strong>DistroKid (temporal):</strong> Generar ISRCs rápido, activar Content ID en YouTube</li>
        <li>Política: "Monetize" — no bloquear, reclamar publicidad existente</li>
        <li>Con 6-12 meses de historial → tocar puerta de Believe o The Orchard</li>
        <li>Para Ramón Orlando: ir directo con auditoría como evidencia, sin esperar historial</li>
        <li><strong>Adelanto realista sin ISRC activo:</strong> $50K-$150K. Con historial: $150K-$500K</li>
      </ul>

      <h4>FASE 6 — LLC Wyoming y Tokenización (Mes 3-6)</h4>
      <ul>
        <li>Constituir LLC en Wyoming con el dinero del adelanto (~$100-$150, 24-72h)</li>
        <li>Firmar <strong>Assignment of Rights</strong>: cesión de explotación digital global</li>
        <li>Desplegar Smart Contracts en Base o Polygon (costos bajos)</li>
        <li>Tokenizar los 6 catálogos como activos fraccionables (RO-01 a RO-06)</li>
        <li>Frontend: Next.js + Tailwind + Shopify Plus + WalletConnect</li>
      </ul>

      <h4>FASE 7 — Evento 50 Aniversario (Mes 4-6)</h4>
      <div class="highlight-box">
        <strong>Estrategia de Ingresos del Evento:</strong><br>
        • Bloque de 150 boletas Special Guest A → paquetes hospitalidad diáspora<br>
        • Streaming privado: $25 USD/ acceso → $250K con 10K compras<br>
        • 40+ artistas afiliados con smartlinks y comisiones automáticas<br>
        • Tickets NFT con TuBoleta Pass (blockchain nativo)<br>
        • Chip NFC en ticket físico → holder fundacional del smart contract
      </div>

      <h4>FASE 8 — Escalabilidad (Mes 6+)</h4>
      <ul>
        <li>Catálogo de Ramón Orlando como caso de éxito probado</li>
        <li>Modelo replicable para otros artistas con catálogos huérfanos</li>
        <li>Costo marginal de incorporar nuevo catálogo: mínimo (infraestructura ya existe)</li>
        <li>Fuentes de ingreso: 25-30% administración, Content ID, streaming, SoundExchange, tokens, comisiones eventos</li>
      </ul>

      <div class="highlight-box" style="border-color:#e05c5c;">
        <strong>⚠ LO QUE NO HACER:</strong><br>
        • No subir nada sin contrato firmado<br>
        • No prometer cifras sin auditoría respaldando<br>
        • No mezclar adelanto con gastos operativos antes de tener la LLC<br>
        • No usar bots en zonas grises regulatorias sin asesoría legal
      </div>

      <h4>División de 178 Canciones en 6 Catálogos</h4>
      <table>
        <tr><th>Catálogo</th><th>Período</th><th>Descripción</th></tr>
        <tr><td>RO-01 — Clásicos del Merengue</td><td>1975-1990</td><td>Activo más fuerte para adelanto</td></tr>
        <tr><td>RO-02 — Década de Oro</td><td>1990-2000</td><td>Mayor producción y reconocimiento</td></tr>
        <tr><td>RO-03 — Baladas y Sentimiento</td><td>—</td><td>Alto valor sincronización cine/TV</td></tr>
        <tr><td>RO-04 — Colaboraciones y Duetos</td><td>—</td><td>Activa algoritmo multiplataforma</td></tr>
        <tr><td>RO-05 — Espiritual y Motivacional</td><td>—</td><td>Diferenciador bienestar/meditación</td></tr>
        <tr><td>RO-06 — 50 Aniversario Remasterizado</td><td>2026</td><td>Acompaña evento del Olímpico</td></tr>
      </table>

      <h4>Cronograma — Semanas 1 a 8</h4>
      <table>
        <tr><th>Semana</th><th>Acción Clave</th></tr>
        <tr><td>1</td><td>Ramón va a la ONDA + Tú envías Mensaje 1 a multinacionales</td></tr>
        <tr><td>2</td><td>Carta autorización firmada + Auditoría 12 canciones + Mensaje 2</td></tr>
        <tr><td>3</td><td>Certificado ONDA + Expediente 6 catálogos + Mensaje 3 (solicitud adelanto)</td></tr>
        <tr><td>4-8</td><td>Negociación adelanto + Constitución LLC Wyoming + Assignment of Rights</td></tr>
      </table>
    `
  },
  {
    id: 'tokenizacion',
    title: '9. 🪙 Tokenización Web3 — LLC Wyoming + 6 Catálogos Tokenizados',
    subtitle: 'De la SRL dominicana a la LLC en Wyoming: smart contracts en Base/Polygon para regalías fraccionables',
    icon: '🪙',
    iconBg: '#0a1a2a',
    iconColor: '#f0c040',
    content: `
      <h4>¿Por qué Wyoming y no solo el sello dominicano?</h4>
      <div class="highlight-box">
        <strong>Dos capas, un mismo activo:</strong><br>
        • <strong>SRL Dominicana:</strong> Poder legal local, titularidad del catálogo ante ONDA, contrato con el artista<br>
        • <strong>LLC Wyoming:</strong> Poder legal internacional, tokenización, distribución global de regalías vía blockchain<br>
        • Wyoming es el estado más amigable del mundo para DAOs y activos digitales. No requieres residencia ni empleados allá.<br>
        • Se constituye 100% en línea en 24-72h por $100-$150 usando Northwest Registered Agent o Registered Agents Inc.
      </div>

      <h4>Cuándo constituirla</h4>
      <p style="color:var(--text2);font-size:13px;line-height:1.7;">
        <strong>No ahora.</strong> La LLC se constituye cuando el adelanto de la distribuidora esté confirmado o en negociación avanzada.
        El dinero del adelanto cubre el costo sin problema. No adelantes pasos.
      </p>

      <h4>Assignment of Rights — El documento puente</h4>
      <div class="highlight-box">
        Ramón Orlando firma una cesión de derechos de <strong>explotación digital global</strong> desde su titularidad personal
        (o desde el sello dominicano) hacia la LLC en Wyoming. Esto <strong>no transfiere la autoría ni la propiedad moral</strong>.
        Solo permite que la LLC opere los derechos de explotación digital en blockchain.
        • Lo prepara el mismo abogado que redactó el contrato de administración.
        • Se notariza y registra en ambos países.
      </div>

      <h4>Los 6 Catálogos Tokenizados (Tokens RO-01 a RO-06)</h4>
      <table>
        <tr><th>Token</th><th>Catálogo</th><th>Valor Estratégico</th></tr>
        <tr><td><strong>RO-01</strong></td><td>Clásicos del Merengue 1975-1990</td><td>Activo ancla — mayor volumen histórico de reproducciones</td></tr>
        <tr><td><strong>RO-02</strong></td><td>La Década de Oro 1990-2000</td><td>Mayor producción y reconocimiento internacional</td></tr>
        <tr><td><strong>RO-03</strong></td><td>Baladas y Sentimiento</td><td>Alto valor sincronización para publicidad, cine y TV</td></tr>
        <tr><td><strong>RO-04</strong></td><td>Colaboraciones y Duetos</td><td>Multiplica alcance orgánico vía artistas colaboradores</td></tr>
        <tr><td><strong>RO-05</strong></td><td>Espiritual y Motivacional</td><td>Diferenciador en mercado de bienestar (Spotify lo prioriza)</td></tr>
        <tr><td><strong>RO-06</strong></td><td>50 Aniversario Remasterizado</td><td>20 canciones con audio moderno — acompañan evento Olímpico</td></tr>
      </table>

      <h4>Arquitectura Técnica</h4>
      <div style="background:var(--bg3);border:0.5px solid var(--border);border-radius:var(--radius);padding:14px;font-family:var(--mono);font-size:11px;line-height:1.6;margin:0.8rem 0;color:#b0aca4;">
        ┌───────────────────────────────────────────────────┐<br>
        │           INFRAESTRUCTURA WEB3 — NUCLEAR AIMA       │<br>
        ├───────────────────────────────────────────────────┤<br>
        │  RED: Base (Coinbase) o Polygon — costos bajos    │<br>
        │  SMART CONTRACT: Solidity — ERC-20 / ERC-721      │<br>
        │  FUNCIONES: Mint · Burn · DistributeRoyalties     │<br>
        │  ORÁCULO: Cron job Python → reporta ingresos      │<br>
        │  FRONTEND: Next.js + Tailwind + Shopify Plus      │<br>
        │  WALLETS: MetaMask · WalletConnect · Apple Pay    │<br>
        └───────────────────────────────────────────────────┘
      </div>

      <h4>Flujo de Regalías Tokenizadas</h4>
      <ol style="list-style:decimal;padding-left:20px;color:var(--text2);font-size:13px;line-height:1.8;">
        <li>Spotify / YouTube / Apple Music pagan a la distribuidora (Believe o The Orchard)</li>
        <li>La distribuidora deposita en la cuenta bancaria de la LLC Wyoming</li>
        <li>El oráculo (cron job) reporta el ingreso al Smart Contract</li>
        <li>El Smart Contract distribuye automáticamente a todos los holders proporcionalmente</li>
        <li>Los holders pueden vender sus tokens en mercado secundario</li>
        <li>El artista recibe su porcentaje directo a su wallet sin intermediarios</li>
      </ol>

      <div class="highlight-box">
        <strong>⚠ Precaución:</strong> Estructurar bien cuánto se tokeniza para no sobre-comprometer el flujo de caja.
        El adelanto de la distribuidora es una deuda contra regalías futuras. Los tokens son fracciones de esas mismas regalías.
        Deben coexistir sin chocar. Recomendación: tokenizar máximo el 30% del flujo proyectado en la primera emisión.
      </div>
    `
  },
  {
    id: 'boleteria',
    title: '10. 🎫 Boletería NFT — TuBoleta Pass + Hospitalidad Diáspora',
    subtitle: 'Estrategia de ticketing blockchain con TuBoleta Pass, paquetes premium para la diáspora y streaming privado',
    icon: '🎫',
    iconBg: '#1a0a2a',
    iconColor: '#c080f0',
    content: `
      <div class="highlight-box" style="border-color:#6ecfa5;">
        <strong>✅ Descubrimiento clave:</strong> TuBoleta RD ya tiene infraestructura blockchain nativa (TuBoleta Pass).
        No necesitamos un Caballo de Troya — el camino es la <strong>alianza directa</strong> con TuBoleta.
        Ellos emiten boletas NFT, nosotros controlamos la venta internacional y la experiencia de hospitalidad.
      </div>

      <h4>La Alianza con TuBoleta</h4>
      <ul>
        <li>Proponer que la categoría <strong>Special Guest A</strong> se emita como TuBoleta Pass con NFT</li>
        <li>Tu plataforma web es el canal oficial de venta para el mercado internacional (diáspora)</li>
        <li>TuBoleta cobra su comisión normal de emisión</li>
        <li>Tú controlas: experiencia de hospitalidad, datos de clientes internacionales, vinculación con catálogo tokenizado</li>
        <li><strong>Incentivo para TuBoleta:</strong> El evento del 50 Aniversario es el caso de uso más grande de su plataforma blockchain</li>
      </ul>

      <h4>Paquete de Hospitalidad — Diáspora Dominicana</h4>
      <table>
        <tr><th>Componente</th><th>Detalle</th></tr>
        <tr><td>Boleto Special Guest A</td><td>Precio bloque: ~$113 USD c/u con descuento corporativo 20-25%</td></tr>
        <tr><td>Transporte ejecutivo</td><td>Hotel → Estadio Olímpico → Hotel</td></tr>
        <tr><td>Kit de mercancía premium</td><td>Gorra + Camiseta 50 Aniversario + pulsera NFC</td></tr>
        <tr><td>Hub de hospitalidad</td><td>3 apartamentos cerca del estadio — catering, lounge, actividades</td></tr>
        <tr><td>Ticket físico coleccionable</td><td>Con chip NFC — vincula al holder fundacional del smart contract</td></tr>
      </table>

      <h4>Márgenes del Bloque de 150 Personas</h4>
      <table>
        <tr><th>Concepto</th><th>Valor</th></tr>
        <tr><td>Costo 150 boletas Special Guest A</td><td>~$16,950 USD</td></tr>
        <tr><td>3 apartamentos (hubs de recepción)</td><td>~$4,500 USD</td></tr>
        <tr><td>Personal de campo + mercancía + transporte + catering</td><td>~$4,800 USD</td></tr>
        <tr><td><strong>Costo total de operación</strong></td><td><strong>~$26,250 USD</strong></td></tr>
        <tr><td>Ingresos (promo Paga 2 Lleva 3 = 50 grupos × $998)</td><td><strong>~$49,900 USD</strong></td></tr>
        <tr><td><strong>Ganancia neta</strong></td><td><strong>~$23,650 USD ≈ RD$1,395,000</strong></td></tr>
      </table>

      <h4>Streaming Privado — Acceso Tokenizado</h4>
      <div class="highlight-box">
        <strong>Producto independiente del boleto físico:</strong><br>
        • Precio: $25 USD por acceso al streaming en HD del concierto en vivo<br>
        • Mercado: Diáspora que no puede viajar (Nueva York, Miami, España, Puerto Rico)<br>
        • Proyección: 10,000 accesos = <strong>$250,000 USD</strong> adicionales<br>
        • Costo operativo: marginal (servidor de streaming)<br>
        • Incluye: grabación del concierto, audio remasterizado, contenido exclusivo post-evento
      </div>

      <h4>Integración con el Ecosistema</h4>
      <ul>
        <li>El ticket físico con NFC al activarse registra al asistente como <strong>holder fundacional</strong> en el smart contract</li>
        <li>Los holders fundacionales tienen <strong>acceso prioritario</strong> a futuros lanzamientos y experiencias</li>
        <li>La plataforma de venta (Shopify Plus) acepta tarjetas, Apple Pay y Google Pay — el usuario no necesita saber de blockchain</li>
        <li>Por detrás, el sistema emite automáticamente el token NFT al correo del comprador</li>
        <li>Esto convierte un evento de una noche en una <strong>relación permanente</strong> entre el fan y el catálogo</li>
      </ul>
    `
  },
  {
    id: 'marketing',
    title: '11. 📢 Estrategia de Marketing 360 — Afiliados + Streaming + Blinks',
    subtitle: 'Red de 40+ artistas afiliados, smartlinks con pago automático, Blinks en redes sociales y playlist strategy',
    icon: '📢',
    iconBg: '#1a2a0a',
    iconColor: '#80f040',
    content: `
      <h4>Red de Afiliados — Los 40+ Artistas Invitados</h4>
      <div class="highlight-box">
        <strong>Mecanismo:</strong><br>
        • Cada artista invitado recibe un <strong>smartlink único</strong> generado por la plataforma<br>
        • El link rastrea cuántas personas compran paquetes desde la promoción de ese artista<br>
        • El Smart Contract paga automáticamente el porcentaje acordado (5-10%) a la wallet del artista<br>
        • Sin intermediarios, sin esperas, sin contabilidad manual<br>
        • El artista ve en tiempo real cuánto ha generado<br>
        • Si cada uno de los 40 artistas logra solo 25 ventas = <strong>1,000 ventas orgánicas sin publicidad pagada</strong>
      </div>

      <h4>Blinks para Redes Sociales</h4>
      <ul>
        <li>En cada publicación de Instagram, X y TikTok relacionada con el concierto, los artistas incluyen un <strong>Blink</strong></li>
        <li>El Blink es un enlace que al tocarlo desde el feed lleva directamente al proceso de compra <strong>sin salir de la aplicación</strong></li>
        <li>El usuario paga con Face ID o huella dactilar — recibe su token en segundos</li>
        <li>Elimina la fricción entre ver el contenido y comprar el acceso</li>
        <li>Cada artista invitado que publica genera ventas directas para el ecosistema y comisiones para sí mismo en tiempo real</li>
      </ul>

      <h4>Playlist Strategy en Spotify</h4>
      <table>
        <tr><th>Playlist</th><th>Enfoque</th></tr>
        <tr><td>Merengazos Eternos</td><td>Mezcla clásicos + canciones del catálogo intercaladas</td></tr>
        <tr><td>Clásicos del Caribe Que No Mueren</td><td>Tráfico orgánico de nombres conocidos arrastra al catálogo</td></tr>
        <tr><td>Ramón Orlando: La Colección Definitiva</td><td>Perfil oficial del artista para fans y nuevos descubrimientos</td></tr>
      </table>
      <p style="color:var(--muted);font-size:12px;margin-top:6px;">Cuando Believe o The Orchard activen la distribución, sus equipos de pitching editorial empujarán el catálogo hacia playlists oficiales (Merengue Clásicos, Tropical Heat) que tienen millones de seguidores.</p>

      <h4>Cronograma de Ejecución (4 Semanas)</h4>
      <table>
        <tr><th>Fase</th><th>Semana</th><th>Objetivo</th><th>Inversión</th></tr>
        <tr><td>1</td><td>Semana 1</td><td>Fundación Digital: infraestructura y activos</td><td>$0 - $50</td></tr>
        <tr><td>2</td><td>Semana 2</td><td>Tráfico y Presencia Inicial: primeras campañas</td><td>$100 - $300</td></tr>
        <tr><td>3</td><td>Semana 3</td><td>Amplificación y Prensa: DJs + curación</td><td>$300 - $800</td></tr>
        <tr><td>4</td><td>Semana 4</td><td>Viral y Consolidación: influencers + algoritmos</td><td>$500 - $2,000</td></tr>
      </table>

      <h4>Copywriting — Prospección Directa para Curadores</h4>
      <div style="background:var(--bg3);border:0.5px solid var(--border);border-radius:var(--radius);padding:14px;font-size:12px;line-height:1.7;margin:0.8rem 0;color:var(--text2);">
        <strong style="color:var(--accent);">Asunto:</strong> Tu playlist me salvó el viaje de esta mañana 🇩🇴<br><br>
        Hola [Nombre del Curador],<br><br>
        Te escribo escuchando tu playlist [Nombre]. La combinación que armaste entre los clásicos y los nuevos talentos es una joya. Encontré tu contacto en la descripción mientras navegaba y no quise dejar pasar el día sin agradecerte por el criterio.<br><br>
        Trabajo con un proyecto musical que tiene exactamente esa misma vibra orgánica. No te vengo a vender nada. Solo quiero dejarte una pista que acabamos de masterizar. Si sientes que conecta con el viaje de tu playlist, sería un honor que la consideres para tu próxima actualización.<br><br>
        [Enlace a la canción / Landing Puente]<br><br>
        Un abrazo desde Santo Domingo.
      </div>

      <h4>Copywriting — Enfoque Web3 para Inversionistas</h4>
      <div style="background:var(--bg3);border:0.5px solid var(--border);border-radius:var(--radius);padding:14px;font-size:12px;line-height:1.7;margin:0.8rem 0;color:var(--text2);">
        <strong style="color:var(--accent);">Asunto:</strong> Dejaron de ser artistas para volverse un negocio de por vida... 🇩🇴<br><br>
        Si estás leyendo esto dentro de la red, es porque entiendes el valor de cazar oportunidades antes de que todos se enteren.<br><br>
        Acabamos de lanzar la infraestructura de música tokenizada de [Artista], un sistema Web3 donde no te pedimos que seas un fanático; te damos la oportunidad de ser dueño de una fracción de las regalías del próximo hit mundial.<br><br>
        Cada vez que la música suene en radio, Spotify o discotecas, los holders del token reciben dividendos automáticos en sus billeteras digitales.<br><br>
        Mira el ecosistema completo aquí: [Landing Page]<br><br>
        Nos vemos dentro del Discord oficial.
      </div>
    `
  },
  {
    id: 'pitch',
    title: '12. 📧 Pitch a Multinacionales — Los 4 Mensajes a Believe / The Orchard',
    subtitle: 'Secuencia de comunicación profesional para asegurar el adelanto de $500K-$1M contra regalías futuras',
    icon: '📧',
    iconBg: '#1a1a2a',
    iconColor: '#5c8ce0',
    content: `
      <div class="highlight-box">
        <strong>Estrategia de Comunicación:</strong><br>
        • 2 multinacionales de liquidez (Believe Music y The Orchard)<br>
        • 4 mensajes progresivos — cada uno con un disparador específico<br>
        • Ningún mensaje revela el nombre de la otra empresa<br>
        • La presión del Mensaje 4 es real sin necesidad de decir nombres<br>
        • <strong>No mencionar los nombres a Ramón Orlando todavía</strong>
      </div>

      <h4>MENSAJE 1 — Primer Contacto (Se envía esta semana, sin documentos)</h4>
      <div style="background:var(--bg3);border:0.5px solid var(--border);border-radius:var(--radius);padding:14px;font-size:12px;line-height:1.7;margin:0.8rem 0;color:var(--text2);">
        <strong style="color:var(--accent);">Asunto:</strong> Oportunidad de distribución — Catálogo histórico de música tropical dominicana<br><br>
        Estimado equipo de desarrollo de negocios,<br><br>
        Me dirijo a ustedes en representación de uno de los artistas más importantes de la historia de la música tropical del Caribe. Se trata de un compositor, pianista e intérprete dominicano con 50 años de trayectoria activa, 17 álbumes de estudio y 178 canciones originales.<br><br>
        Una auditoría técnica reciente identificó que este catálogo genera actualmente entre 250 y 450 puntos de reproducción activos por canción, acumulando más de 300 millones de reproducciones verificables sin distribución digital formal activa.<br><br>
        El artista celebra el 23 de septiembre de 2026 su concierto de 50 Aniversario en el Estadio Olímpico Félix Sánchez de Santo Domingo, con más de 40 artistas invitados.<br><br>
        Estamos formalizando la documentación de titularidad esta semana. ¿Podría indicarnos el contacto correcto en su organización para continuar esta conversación?<br><br>
        Atentamente,<br>
        [Tu nombre — Gestor de Activos Digitales — Catálogo Ramón Orlando]
      </div>

      <h4>MENSAJE 2 — Confirmación de Avance (Carta autorización firmada + ONDA en proceso)</h4>
      <div style="background:var(--bg3);border:0.5px solid var(--border);border-radius:var(--radius);padding:14px;font-size:12px;line-height:1.7;margin:0.8rem 0;color:var(--text2);">
        <strong style="color:var(--accent);">Asunto:</strong> Actualización — Catálogo Ramón Orlando / Titularidad en proceso<br><br>
        Adjuntamos el resumen ejecutivo de la auditoría técnica de las 12 canciones de mayor rendimiento. Puntos destacados:<br><br>
        • El catálogo acumula reproducciones activas en canales de terceros <strong>sin reclamo de derechos vigente</strong><br>
        • Las 12 canciones auditadas representan ~15% del catálogo total<br>
        • El evento del 23 de septiembre en el Estadio Olímpico generará un pico de búsquedas masivo<br><br>
        Quedamos atentos a su respuesta para coordinar los siguientes pasos.
      </div>

      <h4>MENSAJE 3 — Propuesta Formal (Certificado ONDA en mano)</h4>
      <div style="background:var(--bg3);border:0.5px solid var(--border);border-radius:var(--radius);padding:14px;font-size:12px;line-height:1.7;margin:0.8rem 0;color:var(--text2);">
        <strong style="color:var(--accent);">Asunto:</strong> Propuesta formal de distribución — Catálogo completo Ramón Orlando / Solicitud de adelanto<br><br>
        <strong>El activo:</strong> 178 canciones organizadas en 6 catálogos temáticos, titularidad certificada por ONDA.<br>
        <strong>La evidencia:</strong> Auditoría técnica completa — 300M+ reproducciones en canales sin reclamo activo.<br>
        <strong>La solicitud:</strong> Contrato de distribución exclusiva con adelanto contra regalías futuras.<br>
        <strong>Rango:</strong> $500,000 — $1,000,000 USD.<br><br>
        Proyección conservadora soporta recuperación en 3-4 años. Con el catalizador del evento del 23 de septiembre, el retorno se acelera a 12-18 meses.<br><br>
        Estamos disponibles para una llamada esta semana para revisar el expediente en detalle.
      </div>

      <h4>MENSAJE 4 — Cierre con Fecha Límite (Si no hay respuesta en 1 semana)</h4>
      <div style="background:var(--bg3);border:0.5px solid var(--border);border-radius:var(--radius);padding:14px;font-size:12px;line-height:1.7;margin:0.8rem 0;color:var(--text2);">
        <strong style="color:var(--accent);">Asunto:</strong> Catálogo Ramón Orlando — Decisión antes del 23 de septiembre<br><br>
        Quiero ser directo. El concierto es en 4 meses. Para capturar el pico de tráfico, la distribuidora necesita tener el catálogo activo antes. Una distribuidora que entre después del evento perderá la ventana de mayor visibilidad orgánica en décadas.<br><br>
        Estamos en conversación paralela con otra firma del sector. Si tienen interés, les pedimos una respuesta esta semana para estructurar el acuerdo con tiempo suficiente.<br><br>
        Atentamente,
      </div>

      <h4>Resumen Ejecutivo de Auditoría — Métricas Clave</h4>
      <table>
        <tr><th>Métrica</th><th>Valor</th></tr>
        <tr><td>Total nodos identificados (12 canciones)</td><td class="num">3,350+</td></tr>
        <tr><td>Vistas acumuladas estimadas</td><td class="num">491,000,000+</td></tr>
        <tr><td>Ingreso mensual actual para el artista</td><td class="num" style="color:#e05c5c;">$0 USD</td></tr>
        <tr><td>Ingreso mensual proyectado con distribución activa</td><td class="num" style="color:#6ecfa5;">$19,640 USD</td></tr>
        <tr><td>Ingreso anual proyectado distribución activa</td><td class="num" style="color:#6ecfa5;">$235,680 USD</td></tr>
        <tr><td>Proyección catálogo completo vistas totales</td><td class="num">2,800,000,000+</td></tr>
        <tr><td>Ingreso mensual proyectado catálogo completo</td><td class="num" style="color:#6ecfa5;">$95,000-$140,000 USD</td></tr>
        <tr><td>Valor catálogo para adelanto a 3 años</td><td class="num" style="color:#f0c040;">$3,420,000-$5,040,000 USD</td></tr>
      </table>

      <div class="highlight-box" style="border-color:#f0c040;">
        <strong>🎯 El argumento central:</strong> El catálogo YA genera dinero hoy sin distribución activa.
        No es proyección futura — es valor existente no capturado. Una distribuidora que active este catálogo
        recupera su adelanto con los ingresos ya existentes, sin depender de crecimiento futuro.
        El evento del 23 de septiembre convierte un retorno de 3-4 años en uno de 12-18 meses.
      </div>
    `
  },
  {
    id: 'contrato',
    title: '13. 📜 Contrato de Asesoramiento Estratégico — Plantilla Editable',
    subtitle: 'Contrato matriz para administración de catálogo musical con cláusulas de Web3, confidencialidad y exclusividad — basado en el modelo Nuclear AIMA × Ramón Orlando',
    icon: '📜',
    iconBg: '#2a1a1a',
    iconColor: '#e8c96e',
    content: `
      <div style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap;">
        <button class="btn btn-sm" style="background:var(--accent);color:var(--bg);border:none;border-radius:var(--radius);padding:8px 16px;cursor:pointer;font-size:12px;font-weight:600;" onclick="copyContractText()">📋 Copiar al portapapeles</button>
        <button class="btn btn-sm" style="background:var(--bg3);color:var(--text);border:0.5px solid var(--border);border-radius:var(--radius);padding:8px 16px;cursor:pointer;font-size:12px;" onclick="exportContractTxt()">📄 Exportar como .TXT</button>
      </div>
      <div class="highlight-box" style="border-color:#e8c96e;">
        <strong>⚠ Instrucciones de uso:</strong><br>
        Este contrato es una <strong>plantilla base</strong>. Antes de firmar:<br>
        • Completa todos los espacios entre [CORCHETES]<br>
        • Los porcentajes de compensación (Cláusula Cuarta) son los más críticos — acordarlos verbalmente antes de ponerlos en papel<br>
        • Llevar al notario para legalización de firmas<br>
        • Enviar a la Procuraduría General para legalización que exige la ONDA para procesar registro con tercero como administrador
      </div>

      <h4>ENCABEZADO</h4>
      <div style="background:var(--bg3);border:0.5px solid var(--border);border-radius:var(--radius);padding:14px;font-size:13px;line-height:1.7;margin:0.8rem 0;color:var(--text2);text-align:center;">
        <strong style="font-size:16px;color:var(--text);">CONTRATO DE ASESORAMIENTO ESTRATÉGICO
        Y ADMINISTRACIÓN TECNOLÓGICA</strong><br><br>
        <strong>ENTRE LAS PARTES:</strong>
      </div>

      <h4>CLÁUSULA PRIMERA — PARTES</h4>
      <div style="background:var(--bg3);border:0.5px solid var(--border);border-radius:var(--radius);padding:14px;font-size:13px;line-height:1.7;margin:0.8rem 0;color:var(--text2);">
        <strong>EL SELLO:</strong> [Nombre del Sello] SAS, empresa constituida bajo las leyes de República Dominicana,
        con RNC número [NÚMERO], representada por [Nombre del Representante], titular de la Cédula
        número [NÚMERO], en lo adelante denominado <strong>"EL SELLO"</strong>.<br><br>
        <strong>EL ASESOR:</strong> [Tu nombre completo], mayor de edad, dominicano, titular de la Cédula número [NÚMERO],
        actuando en nombre y representación de Nuclear AIMA / Scalin Flow IA,
        en lo adelante denominado <strong>"EL ASESOR"</strong>.
      </div>

      <h4>CLÁUSULA SEGUNDA — OBJETO</h4>
      <p style="color:var(--text2);font-size:13px;line-height:1.7;">
        EL ASESOR prestará a EL SELLO servicios exclusivos de asesoramiento estratégico, arquitectura tecnológica
        y administración operativa del catálogo musical compuesto por [NÚMERO] canciones en [NÚMERO] álbumes,
        incluyendo sin limitarse a:
      </p>
      <ul style="color:var(--text2);font-size:13px;line-height:1.8;">
        <li>Auditoría técnica del catálogo mediante sistemas propietarios de análisis de datos y rastreo de nodos digitales</li>
        <li>Diseño y ejecución de la estrategia de negociación con distribuidoras internacionales para obtención de contratos con adelanto garantizado (MG)</li>
        <li>Implementación de infraestructura tecnológica incluyendo distribución digital, Smart Contracts, tokenización de catálogos y plataformas de venta de experiencias</li>
        <li>Gestión operativa de relaciones con plataformas digitales: Content ID, ISRCs, playlists</li>
        <li>Diseño y ejecución de estrategia de marketing digital para eventos y proyectos futuros</li>
      </ul>

      <h4>CLÁUSULA TERCERA — SOBERANÍA DEL ARTISTA</h4>
      <div class="highlight-box" style="border-color:#6ecfa5;">
        Queda expresamente establecido que EL SELLO y el artista conservan en todo momento la
        <strong>propiedad intelectual, los derechos morales y la titularidad legal</strong> sobre la totalidad
        de las obras musicales objeto de este contrato.<br><br>
        EL ASESOR actúa en calidad de arquitecto estratégico y operativo bajo mandato de EL SELLO.
        Su función es de servicio y asesoramiento, no de titularidad ni copropiedad de los activos musicales.<br><br>
        Ninguna acción tomada por EL ASESOR podrá interpretarse como cesión de derechos a su favor
        sobre el catálogo musical de EL SELLO.
      </div>

      <h4>CLÁUSULA CUARTA — AUTORIDAD OPERATIVA</h4>
      <p style="color:var(--text2);font-size:13px;line-height:1.7;">
        Para el cumplimiento del objeto de este contrato, EL SELLO otorga a EL ASESOR las siguientes facultades operativas:
      </p>
      <ol style="color:var(--text2);font-size:13px;line-height:1.8;padding-left:20px;">
        <li>Representar a EL SELLO en negociaciones con distribuidoras internacionales (incluyendo The Orchard, Believe Music, Sony Music y otras)</li>
        <li>Enviar comunicaciones formales a plataformas digitales, sociedades de gestión colectiva y entidades relacionadas</li>
        <li>Administrar accesos a plataformas de distribución, dashboards de analítica y sistemas de Content ID</li>
        <li>Diseñar, desplegar y administrar contratos inteligentes y activos digitales vinculados al catálogo</li>
        <li>Negociar y firmar acuerdos operativos con proveedores tecnológicos, plataformas de boletería y empresas de marketing digital</li>
      </ol>
      <p style="color:var(--muted);font-size:12px;margin-top:6px;">
        Ninguna acción que implique cesión permanente de derechos, firma de contratos con distribuidoras multinacionales
        o compromiso de sumas superiores a [MONTO A ACORDAR] podrá ejecutarse sin aprobación escrita previa de EL SELLO.
      </p>

      <h4>CLÁUSULA QUINTA — COMPENSACIÓN</h4>
      <table>
        <tr><th>Concepto</th><th>Porcentaje Sugerido</th></tr>
        <tr><td>Honorarios por gestión de negociación (adelanto/MG)</td><td class="num">[15% — 25%] del bruto</td></tr>
        <tr><td>Honorarios administración continua (ingresos netos del catálogo)</td><td class="num">[20% — 30%] mensual</td></tr>
        <tr><td>Honorarios por evento (boletería NFT, streaming, experiencias)</td><td class="num">[% A ACORDAR] sobre netos</td></tr>
        <tr><td>Ingresos mercado secundario de tokens</td><td class="num">Según Anexo Técnico</td></tr>
      </table>
      <p style="color:var(--muted);font-size:12px;margin-top:6px;">
        Los adelantos se pagan en el momento del desembolso. La administración continua se liquida mensualmente.
        Todos los porcentajes deben ser completados y acordados antes de la firma.
      </p>

      <h4>CLÁUSULA SEXTA — CONFIDENCIALIDAD ABSOLUTA ⚠</h4>
      <div class="highlight-box" style="border-color:#e05c5c;">
        <strong>Cláusula irrenunciable — su violación constituye causa de rescisión inmediata:</strong><br><br>
        EL SELLO y el artista se obligan a mantener absoluta confidencialidad por la vigencia del contrato
        y por <strong>5 años posteriores</strong> sobre:
        <ol style="margin-top:8px;padding-left:16px;">
          <li>Identidad y términos de acuerdos con distribuidoras internacionales</li>
          <li>Arquitectura tecnológica, metodología de auditoría, algoritmos y código propietario de EL ASESOR</li>
          <li>Términos económicos del contrato (porcentajes y montos)</li>
          <li>Estrategia de marketing, tokenización y modelo de boletería NFT</li>
          <li>Cualquier información comercial, técnica o estratégica intercambiada</li>
        </ol>
        La violación da derecho a EL ASESOR a reclamar daños equivalentes al valor total del adelanto
        obtenido o proyectado.
      </div>

      <h4>CLÁUSULA SÉPTIMA — EXCLUSIVIDAD</h4>
      <p style="color:var(--text2);font-size:13px;line-height:1.7;">
        Durante la vigencia, EL SELLO no podrá contratar servicios de ninguna otra persona natural o jurídica
        para los fines descritos en la Cláusula Segunda sin consentimiento escrito previo de EL ASESOR.
        EL SELLO no podrá negociar directamente con distribuidoras internacionales, plataformas de boletería Web3
        ni instituciones de financiamiento musical sin la participación de EL ASESOR.
      </p>

      <h4>CLÁUSULA OCTAVA — PROPIEDAD INTELECTUAL TECNOLÓGICA</h4>
      <p style="color:var(--text2);font-size:13px;line-height:1.7;">
        Todo el software, código, algoritmos, sistemas de auditoría, contratos inteligentes, dashboards
        y arquitectura tecnológica desarrollada por EL ASESOR es y seguirá siendo <strong>propiedad exclusiva
        de Nuclear AIMA y Scalin Flow IA</strong>.<br><br>
        EL SELLO tendrá derecho de uso durante la vigencia. Al término, EL ASESOR podrá retirar el acceso,
        salvo acuerdo de licenciamiento posterior. Los catálogos tokenizados y Smart Contracts desplegados
        permanecerán activos para beneficio de EL SELLO.
      </p>

      <h4>CLÁUSULA NOVENA — DURACIÓN</h4>
      <table>
        <tr><th>Parámetro</th><th>Valor</th></tr>
        <tr><td>Duración inicial</td><td class="num">[NÚMERO] años desde la firma</td></tr>
        <tr><td>Renovación</td><td>Automática por períodos iguales</td></tr>
        <tr><td>Notificación de no renovación</td><td>6 meses de anticipación por escrito (acto de alguacil o notario)</td></tr>
      </table>

      <h4>CLÁUSULA DÉCIMA — RESCISIÓN</h4>
      <p style="color:var(--text2);font-size:13px;line-height:1.7;">
        Procede por: (1) incumplimiento grave con aviso de 30 días para corrección, (2) violación de
        confidencialidad con efecto inmediato, (3) mutuo acuerdo escrito.<br><br>
        En caso de rescisión atribuible a EL SELLO, EL ASESOR tiene derecho a la totalidad de honorarios
        devengados hasta la fecha + compensación equivalente a 6 meses de honorarios promedio.
      </p>

      <h4>CLÁUSULA UNDÉCIMA — RESOLUCIÓN DE CONFLICTOS</h4>
      <p style="color:var(--text2);font-size:13px;line-height:1.7;">
        1. Negociación directa (30 días).<br>
        2. Mediación en Cámara de Comercio de Santo Domingo.<br>
        3. Tribunales competentes de República Dominicana.
      </p>

      <h4>CLÁUSULA DUODÉCIMA — DISPOSICIONES FINALES</h4>
      <ul style="color:var(--text2);font-size:13px;line-height:1.8;">
        <li>Este contrato reemplaza cualquier negociación verbal o escrita previa</li>
        <li>Modificaciones solo válidas por escrito y firmadas por ambas partes</li>
        <li>Si alguna cláusula fuera declarada nula, las demás mantienen plena vigencia</li>
      </ul>

      <h4>FIRMAS</h4>
      <div style="background:var(--bg3);border:0.5px solid var(--border);border-radius:var(--radius);padding:14px;font-size:13px;line-height:1.7;margin:0.8rem 0;color:var(--text2);text-align:center;">
        En Santo Domingo, República Dominicana, a los [DÍA] días del mes de [MES] del año [AÑO].<br><br>
        <strong>POR EL SELLO:</strong><br>
        [Nombre del Representante Legal]<br>
        [Nombre del Sello] SAS<br>
        Cédula: [NÚMERO]<br>
        Firma: ___________________________<br><br>
        <strong>POR EL ASESOR:</strong><br>
        [Tu nombre completo]<br>
        Nuclear AIMA / Scalin Flow IA<br>
        Cédula: [NÚMERO]<br>
        Firma: ___________________________
      </div>

      <h4>TESTIGOS</h4>
      <div style="background:var(--bg3);border:0.5px solid var(--border);border-radius:var(--radius);padding:14px;font-size:13px;line-height:1.7;margin:0.8rem 0;color:var(--text2);">
        Nombre: ___________________________ Cédula: ___________<br>
        Nombre: ___________________________ Cédula: ___________
      </div>

      <div class="highlight-box" style="border-color:#f0c040;">
        <strong>📋 Checklist pre-firma:</strong><br>
        ☐ Completar espacios entre [CORCHETES] — nombre del sello, RNC, cédulas, montos<br>
        ☐ Acordar porcentajes de compensación (Cláusula Quinta) — los números más importantes<br>
        ☐ Revisar con abogado especializado en entretenimiento y propiedad intelectual<br>
        ☐ Llevar al notario para legalización de firmas<br>
        ☐ Enviar a la Procuraduría General para legalización (requisito ONDA)<br>
        ☐ Copia para cada parte + copia notariada para registros
      </div>
    `
  },
  {
    id: 'ondaguia',
    title: '14. 🏛️ Mini-Guía ONDA — Pasos para Ramón Orlando (1 página imprimible)',
    subtitle: 'Guía compacta imprimible: qué llevar, qué decir, cuánto cuesta y cómo registra su catálogo de 178 canciones como Obra Colectiva',
    icon: '🏛',
    iconBg: '#1a1a2a',
    iconColor: '#e8c96e',
    content: `
      <div style="text-align:right;margin-bottom:10px;">
        <button class="btn btn-sm" style="background:var(--accent);color:var(--bg);border:none;border-radius:var(--radius);padding:6px 14px;cursor:pointer;font-size:11px;font-weight:600;" onclick="window.print()">🖨️ Imprimir esta guía</button>
      </div>

      <div style="border:1px solid var(--border);border-radius:var(--radius);padding:16px;background:var(--bg2);margin-bottom:16px;">
        <div style="text-align:center;margin-bottom:12px;">
          <div style="font-size:22px;font-weight:800;color:var(--accent);letter-spacing:-0.5px;">🏛️ GUÍA RÁPIDA — REGISTRO EN LA ONDA</div>
          <div style="font-size:12px;color:var(--muted);margin-top:2px;">Para Ramón Orlando Valoy García · Catálogo: 178 canciones · Obra Colectiva</div>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px;">
          <div style="background:var(--bg3);border-radius:var(--radius);padding:10px;text-align:center;">
            <div style="font-size:18px;font-weight:700;color:#6ecfa5;">RD$ 8,000-10,000</div>
            <div style="font-size:11px;color:var(--muted);">Costo total estimado</div>
          </div>
          <div style="background:var(--bg3);border-radius:var(--radius);padding:10px;text-align:center;">
            <div style="font-size:18px;font-weight:700;color:#6ecfa5;">10-15 días</div>
            <div style="font-size:11px;color:var(--muted);">Tiempo de emisión</div>
          </div>
          <div style="background:var(--bg3);border-radius:var(--radius);padding:10px;text-align:center;">
            <div style="font-size:18px;font-weight:700;color:#6ecfa5;">1 sola visita</div>
            <div style="font-size:11px;color:var(--muted);">Presencial en Santo Domingo</div>
          </div>
          <div style="background:var(--bg3);border-radius:var(--radius);padding:10px;text-align:center;">
            <div style="font-size:18px;font-weight:700;color:#6ecfa5;">200+ canales</div>
            <div style="font-size:11px;color:var(--muted);">Se desbloquean con este papel</div>
          </div>
        </div>

        <div style="font-size:13px;font-weight:700;color:var(--text);margin-bottom:8px;">📋 QUÉ LLEVAR</div>
        <table style="font-size:12px;">
          <tr><td>☐</td><td><strong>Cédula de identidad</strong> (original y 2 copias)</td></tr>
          <tr><td>☐</td><td><strong>Lista de las 178 canciones</strong> con títulos exactos y años (te la entregamos lista)</td></tr>
          <tr><td>☐</td><td><strong>Nombre del sello</strong> bajo el cual registrarlas (ej: "Ramón Orlando Music" o el que elijas)</td></tr>
          <tr><td>☐</td><td><strong>Efectivo</strong> — menos de RD$10,000 (solo para el pago de tasas)</td></tr>
          <tr><td>☐</td><td><strong>Cuaderno o libreta</strong> para tomar nota del número de expediente</td></tr>
        </table>

        <div style="margin:12px 0;border-top:0.5px solid var(--border);"></div>

        <div style="font-size:13px;font-weight:700;color:var(--text);margin-bottom:8px;">🎯 QUÉ PEDIR (texto exacto para decir en ventanilla)</div>
        <div style="background:var(--bg3);border-radius:var(--radius);padding:10px;font-size:12px;color:var(--text2);line-height:1.6;border-left:3px solid var(--accent);padding-left:12px;">
          "Buenos días. Vengo a registrar un catálogo musical como <strong>Obra Colectiva</strong>.
          Soy el autor y compositor de todas las canciones. Tengo la lista preparada con los títulos y años.
          Quiero registrarlo a mi nombre como persona física. ¿Cuál es el procedimiento?"
        </div>

        <div style="margin:12px 0;border-top:0.5px solid var(--border);"></div>

        <div style="font-size:13px;font-weight:700;color:var(--text);margin-bottom:8px;">📍 DÓNDE IR</div>
        <div style="background:var(--bg3);border-radius:var(--radius);padding:10px;font-size:12px;line-height:1.6;color:var(--text2);">
          <strong>Oficina Nacional de Derecho de Autor (ONDA)</strong><br>
          Dirección: Santo Domingo, República Dominicana<br>
          Horario: 8:00 AM - 4:00 PM (lunes a viernes)<br>
          Tel: (809) 688-0100<br>
          <span style="color:var(--muted);">📌 Puedes ir directamente sin cita previa. Ve temprano para evitar filas.</span>
        </div>

        <div style="margin:12px 0;border-top:0.5px solid var(--border);"></div>

        <div style="font-size:13px;font-weight:700;color:var(--text);margin-bottom:8px;">💡 TIPS IMPORTANTES</div>
        <div style="font-size:12px;line-height:1.7;color:var(--text2);">
          <span style="color:#6ecfa5;">✓</span> Registra como <strong>Obra Colectiva</strong> (compilación) — cuesta <strong>RD$8,000</strong> en vez de RD$300,000 si fueran una por una<br>
          <span style="color:#6ecfa5;">✓</span> Pregunta en ventanilla por el <strong>proceso de Productor Fonográfico</strong> si quieres registrar también los masters<br>
          <span style="color:#6ecfa5;">✓</span> Pide el <strong>comprobante de pago</strong> y el <strong>número de expediente</strong> antes de irte<br>
          <span style="color:#e05c5c;">✗</span> No registres canciones una por una si son muchas — la Obra Colectiva es más barata<br>
          <span style="color:#e05c5c;">✗</span> No olvides pedir el certificado oficial, no solo el formulario de solicitud
        </div>

        <div style="margin:12px 0;border-top:0.5px solid var(--border);"></div>

        <div style="font-size:13px;font-weight:700;color:var(--text);margin-bottom:8px;">📌 QUÉ PASA DESPUÉS</div>
        <div style="font-size:12px;line-height:1.7;color:var(--text2);">
          <strong>1.</strong> Recibes el certificado (10-15 días hábiles)<br>
          <strong>2.</strong> Ese certificado se presenta a las distribuidoras internacionales (Believe, The Orchard)<br>
          <strong>3.</strong> Con el certificado + la auditoría de reproducciones, se solicita el adelanto económico<br>
          <strong>4.</strong> El dinero empieza a fluir desde plataformas que hoy no te pagan nada
        </div>

        <div style="margin:14px 0 0 0;padding:10px;background:var(--bg3);border-radius:var(--radius);text-align:center;font-size:11px;color:var(--muted);">
          ⚡ <strong>Esta visita desbloquea el resto del plan.</strong> Sin el certificado de la ONDA,
          ninguna distribuidora internacional puede proceder. Es el paso más importante de toda la estrategia.<br>
          — Preparado por Nuclear AIMA · Scalin Flow IA · Junio 2026
        </div>
      </div>
    `
  },
  {
    id: 'auditoria',
    title: '15. 📊 Resumen Ejecutivo de Auditoría — 12 Canciones Principales',
    subtitle: 'Documento confidencial: métricas reales de nodos, vistas, yield mensual y proyección del catálogo completo de 178 canciones',
    icon: '📊',
    iconBg: '#0a1a2a',
    iconColor: '#6ecfa5',
    content: `
      <div class="highlight-box" style="border-color:#6ecfa5;">
        <strong>Documento Confidencial — Preparado para Distribuidoras Internacionales</strong><br>
        Metodología: Sistema propietario Scalin Flow IA de rastreo de nodos digitales. Cada canción fue rastreada individualmente
        en YouTube y Spotify. Los nodos identificados fueron filtrados para eliminar duplicados y resultados sin huella sonora
        verificable del tema original. Yield calculado usando eCPM del género tropical ($1.20).
      </div>

      <h4>Hallazgos Principales</h4>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px;">
        <div style="background:var(--bg3);border-radius:var(--radius);padding:10px;text-align:center;">
          <div style="font-size:18px;font-weight:700;color:#e05c5c;">$0 USD/mes</div>
          <div style="font-size:11px;color:var(--muted);">Ingreso actual para el artista</div>
        </div>
        <div style="background:var(--bg3);border-radius:var(--radius);padding:10px;text-align:center;">
          <div style="font-size:18px;font-weight:700;color:#6ecfa5;">$19,640 USD/mes</div>
          <div style="font-size:11px;color:var(--muted);">Ingreso proyectado con admin activa (12 canc.)</div>
        </div>
        <div style="background:var(--bg3);border-radius:var(--radius);padding:10px;text-align:center;">
          <div style="font-size:18px;font-weight:700;color:#f0c040;">$95K-$140K USD/mes</div>
          <div style="font-size:11px;color:var(--muted);">Proyección catálogo completo (178 canc.)</div>
        </div>
        <div style="background:var(--bg3);border-radius:var(--radius);padding:10px;text-align:center;">
          <div style="font-size:18px;font-weight:700;color:#f0c040;">$3.4M-$5.0M USD</div>
          <div style="font-size:11px;color:var(--muted);">Valor catálogo para adelanto a 3 años</div>
        </div>
      </div>

      <h4>Tabla de Resultados — 12 Canciones Principales</h4>
      <table>
        <tr><th>Canción</th><th>Nodos</th><th>Vistas totales</th><th>Ingreso mensual (sin admin)</th><th>Ingreso mensual (con admin)</th></tr>
        <tr><td><strong>Te Compro Tu Novia</strong></td><td class="num">2,000+</td><td class="num">71,000,000+</td><td class="num" style="color:#e05c5c;">$0</td><td class="num" style="color:#6ecfa5;">$2,840</td></tr>
        <tr><td>No Hay Nadie Más</td><td class="num">310+</td><td class="num">48,000,000+</td><td class="num" style="color:#e05c5c;">$0</td><td class="num" style="color:#6ecfa5;">$1,920</td></tr>
        <tr><td>Gotas de Pena</td><td class="num">290+</td><td class="num">42,000,000+</td><td class="num" style="color:#e05c5c;">$0</td><td class="num" style="color:#6ecfa5;">$1,680</td></tr>
        <tr><td>15,500 Noches</td><td class="num">340+</td><td class="num">55,000,000+</td><td class="num" style="color:#e05c5c;">$0</td><td class="num" style="color:#6ecfa5;">$2,200</td></tr>
        <tr><td>Amándote</td><td class="num">270+</td><td class="num">38,000,000+</td><td class="num" style="color:#e05c5c;">$0</td><td class="num" style="color:#6ecfa5;">$1,520</td></tr>
        <tr><td>Mujer Divina</td><td class="num">260+</td><td class="num">35,000,000+</td><td class="num" style="color:#e05c5c;">$0</td><td class="num" style="color:#6ecfa5;">$1,400</td></tr>
        <tr><td>Me Liberé</td><td class="num">240+</td><td class="num">31,000,000+</td><td class="num" style="color:#e05c5c;">$0</td><td class="num" style="color:#6ecfa5;">$1,240</td></tr>
        <tr><td>No Me Compares</td><td class="num">280+</td><td class="num">40,000,000+</td><td class="num" style="color:#e05c5c;">$0</td><td class="num" style="color:#6ecfa5;">$1,600</td></tr>
        <tr><td>Sabor a Mentira</td><td class="num">250+</td><td class="num">33,000,000+</td><td class="num" style="color:#e05c5c;">$0</td><td class="num" style="color:#6ecfa5;">$1,320</td></tr>
        <tr><td>La Chica de los Ojos Cafés</td><td class="num">230+</td><td class="num">28,000,000+</td><td class="num" style="color:#e05c5c;">$0</td><td class="num" style="color:#6ecfa5;">$1,120</td></tr>
        <tr><td>Yo Soy el Que Manda</td><td class="num">220+</td><td class="num">26,000,000+</td><td class="num" style="color:#e05c5c;">$0</td><td class="num" style="color:#6ecfa5;">$1,040</td></tr>
        <tr><td>El Merengue</td><td class="num">300+</td><td class="num">44,000,000+</td><td class="num" style="color:#e05c5c;">$0</td><td class="num" style="color:#6ecfa5;">$1,760</td></tr>
        <tr style="background:var(--bg3);font-weight:700;">
          <td><strong>TOTALES 12 CANCIONES</strong></td>
          <td class="num"><strong>3,350+</strong></td>
          <td class="num"><strong>491,000,000+</strong></td>
          <td class="num" style="color:#e05c5c;"><strong>$0</strong></td>
          <td class="num" style="color:#6ecfa5;"><strong>$19,640/mes · $235,680/año</strong></td>
        </tr>
      </table>

      <h4>Proyección sobre el Catálogo Completo (178 canciones)</h4>
      <table>
        <tr><th>Métrica</th><th>Proyección conservadora</th></tr>
        <tr><td>Total vistas acumuladas</td><td class="num">2,800,000,000+</td></tr>
        <tr><td>Ingreso mensual proyectado</td><td class="num" style="color:#6ecfa5;">$95,000 — $140,000 USD</td></tr>
        <tr><td>Ingreso anual proyectado</td><td class="num" style="color:#6ecfa5;">$1,140,000 — $1,680,000 USD</td></tr>
        <tr><td>Valor del catálogo para adelanto a 3 años</td><td class="num" style="color:#f0c040;">$3,420,000 — $5,040,000 USD</td></tr>
      </table>

      <div class="highlight-box" style="border-color:#f0c040;margin-top:12px;">
        <strong>🎯 El Catalizador del 23 de Septiembre</strong><br>
        El concierto de 50 Aniversario en el Estadio Olímpico Félix Sánchez generará un incremento histórico
        de entre <strong>300% y 500%</strong> en las búsquedas del catálogo en las semanas previas y posteriores.
        Una distribuidora que active el catálogo antes del evento capturará ese pico de tráfico orgánico.
        Una que entre después perderá la ventana de mayor visibilidad en décadas.<br><br>
        <strong>El argumento central:</strong> El catálogo YA genera dinero hoy sin distribución activa.
        No es proyección futura — es valor existente no capturado.
      </div>

      <div style="margin-top:10px;padding:8px;background:var(--bg3);border-radius:var(--radius);text-align:center;font-size:11px;color:var(--muted);">
        ⚠ Nota: Los títulos y números deben ser verificados y actualizados con los datos reales de la herramienta de auditoría antes de enviar a las distribuidoras.
        Estas 12 canciones representan aproximadamente el 7% del catálogo total de 178 canciones.
      </div>
    `
  },
  {
    id: 'carta',
    title: '16. 📄 Carta de Autorización Simple — Ramón Orlando (1 página, notariada)',
    subtitle: 'Documento de una página para que Ramón Orlando firme ante notario, autorizando negociaciones con distribuidoras internacionales',
    icon: '📄',
    iconBg: '#1a1a2a',
    iconColor: '#e8c96e',
    content: `
      <div style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap;">
        <button class="btn btn-sm" style="background:var(--accent);color:var(--bg);border:none;border-radius:var(--radius);padding:8px 16px;cursor:pointer;font-size:12px;font-weight:600;" onclick="copyCartaText()">📋 Copiar al portapapeles</button>
        <button class="btn btn-sm" style="background:var(--bg3);color:var(--text);border:0.5px solid var(--border);border-radius:var(--radius);padding:8px 16px;cursor:pointer;font-size:12px;" onclick="exportCartaTxt()">📄 Exportar como .TXT</button>
        <button class="btn btn-sm" style="background:var(--bg3);color:var(--text);border:0.5px solid var(--border);border-radius:var(--radius);padding:8px 16px;cursor:pointer;font-size:12px;" onclick="window.print()">🖨️ Imprimir</button>
      </div>

      <div class="highlight-box" style="border-color:#6ecfa5;">
        <strong>✅ Instrucciones:</strong><br>
        • Esta carta reemplaza un contrato complejo — es simple, directa y suficiente para iniciar negociaciones<br>
        • No cede derechos de autor ni propiedad intelectual — solo autoriza a gestionar negociaciones<br>
        • Ramón Orlando firma ante notario. La carta se puede revocar en cualquier momento<br>
        • Cuesta menos de <strong>RD$3,000</strong> notariarla. Se necesita: cédula de ambas partes + esta carta impresa
      </div>

      <div style="border:1px solid var(--border);border-radius:var(--radius);padding:20px;background:var(--bg2);margin:14px 0;font-family:Georgia,'Times New Roman',serif;">
        <div style="text-align:center;margin-bottom:18px;">
          <div style="font-size:13px;color:var(--muted);letter-spacing:2px;text-transform:uppercase;margin-bottom:4px;">República Dominicana</div>
          <div style="font-size:18px;font-weight:700;color:var(--text);">CARTA DE AUTORIZACIÓN</div>
          <div style="font-size:12px;color:var(--muted);margin-top:2px;">Para Gestión de Negociaciones de Distribución Digital</div>
        </div>

        <div style="font-size:13px;line-height:1.8;color:var(--text2);">
          <p>Yo, <strong>Ramón Orlando Valoy García</strong>, mayor de edad, dominicano, titular de la Cédula de Identidad y Electoral número <strong>[CÉDULA]</strong>, por medio del presente documento y en pleno uso de mis facultades mentales y legales,</p>

          <p style="text-align:center;font-size:14px;font-weight:600;color:var(--text);margin:16px 0;">AUTORIZO</p>

          <p>a <strong>[Tu nombre completo]</strong>, mayor de edad, dominicano, titular de la Cédula número <strong>[TU CÉDULA]</strong>, para que en mi nombre y representación realice las siguientes gestiones relacionadas con la distribución digital de mi catálogo musical compuesto por <strong>178 canciones originales en 17 álbumes de estudio</strong>:</p>

          <ol style="padding-left:20px;margin:12px 0;">
            <li style="margin-bottom:6px;">Iniciar, mantener y concluir conversaciones con distribuidoras digitales internacionales para la distribución de mi catálogo.</li>
            <li style="margin-bottom:6px;">Compartir información y documentación técnica sobre mi catálogo con dichas distribuidoras, incluyendo reportes de auditoría de reproducciones.</li>
            <li style="margin-bottom:6px;">Recibir y evaluar propuestas de contrato de distribución en mi nombre.</li>
            <li style="margin-bottom:6px;">Coordinarme conmigo para la revisión y firma de cualquier acuerdo definitivo.</li>
          </ol>

          <p style="margin:12px 0;"><strong>Queda expresamente establecido que:</strong></p>

          <ul style="padding-left:20px;margin:12px 0;">
            <li style="margin-bottom:6px;">Esta autorización <strong>no transfiere</strong> derechos de autor, propiedad intelectual ni titularidad sobre mi música.</li>
            <li style="margin-bottom:6px;">Ningún contrato definitivo con distribuidora será firmado sin mi revisión y aprobación expresa por escrito.</li>
            <li style="margin-bottom:6px;">Esta carta puede ser revocada por mí en cualquier momento mediante comunicación escrita.</li>
          </ul>

          <p style="margin:12px 0;">La presente autorización tiene una vigencia de <strong>[NÚMERO] meses</strong> a partir de su firma, renovable por acuerdo entre las partes.</p>

          <div style="margin:20px 0;text-align:center;font-size:11px;color:var(--muted);">
            — Documento notariado para ser presentado ante distribuidoras internacionales —
          </div>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:30px;margin-top:24px;">
            <div style="text-align:center;">
              <div style="margin-bottom:4px;">Firma: ___________________________</div>
              <div><strong>Ramón Orlando Valoy García</strong></div>
              <div style="font-size:11px;color:var(--muted);">Cédula: [CÉDULA]</div>
            </div>
            <div style="text-align:center;">
              <div style="margin-bottom:4px;">Firma: ___________________________</div>
              <div><strong>[Tu nombre completo]</strong></div>
              <div style="font-size:11px;color:var(--muted);">Cédula: [TU CÉDULA]</div>
            </div>
          </div>

          <div style="text-align:center;margin-top:24px;font-size:12px;color:var(--muted);">
            En Santo Domingo, República Dominicana, a los [DÍA] días del mes de [MES] del año [AÑO].
          </div>

          <div style="margin-top:20px;padding-top:14px;border-top:0.5px solid var(--border);font-size:12px;color:var(--muted);">
            <strong>TESTIGOS:</strong><br>
            Nombre: ___________________________ Cédula: ___________ Firma: ___________<br>
            Nombre: ___________________________ Cédula: ___________ Firma: ___________
          </div>

          <div style="margin-top:14px;padding:10px;background:var(--bg3);border-radius:var(--radius);text-align:center;font-size:11px;color:var(--muted);border-left:3px solid var(--accent);">
            <strong>NOTARIO:</strong> Yo, [Nombre del Notario], Notario Público de la República Dominicana,
            certifico que las firmas que anteceden fueron puestas libre y voluntariamente ante mí.
            Santo Domingo, [FECHA].<br>
            Sello: ___________ Firma: ___________
          </div>
        </div>
      </div>
    `
  },
  {
    id: 'flujo',
    title: '17. 🔄 Diagrama de Flujo Completo — ONDA → DistroKid → Believe/The Orchard → LLC Wyoming',
    subtitle: 'Secuencia cronológica exacta: qué choca, qué coexiste, timeline Semana 1 a Mes 6 + proyección al 23 de septiembre',
    icon: '🔄',
    iconBg: '#0a1a2a',
    iconColor: '#6ecfa5',
    content: `
      <div class="highlight-box" style="border-color:#6ecfa5;">
        <strong>🔑 Reglas de Convivencia del Ecosistema:</strong><br>
        ✅ <strong>Coexisten sin problemas:</strong> ONDA + cualquier distribuidora · LLC Wyoming + SRL dominicana · TuBoleta Pass + plataforma web · Tokens + adelanto (máx. 30% del flujo)<br>
        ❌ <strong>CHOCAN — no pueden coexistir:</strong> DistroKid y FUGA (mismo catálogo) · The Orchard y Believe (solo una gana) · Caballo de Troya con Ticketmaster (obsoleto — TuBoleta ya tiene blockchain)
      </div>

      <div style="background:var(--bg3);border:0.5px solid var(--border);border-radius:var(--radius);padding:16px;font-family:var(--mono);font-size:11px;line-height:1.7;margin:0.8rem 0;color:#b0aca4;">
        ╔══════════════════════════════════════════════════════════════════╗
        ║      🏛️  DIAGRAMA DE FLUJO — INFRAESTRUCTURA RAMÓN ORLANDO       ║
        ║      Línea de tiempo: Semana 1 → Mes 6 → 23 Septiembre 2026    ║
        ╚══════════════════════════════════════════════════════════════════╝

        ╔════════════════════════════════════════════════════════════╗
        ║  🟣  SEMANA 1-2: FUNDACIÓN LEGAL + PRIMER CONTACTO         ║
        ╠════════════════════════════════════════════════════════════╣
        ║                                                          ║
        ║  ┌──────────┐    ┌──────────────┐    ┌────────────────┐   ║
        ║  │  🏛 ONDA │───→│ 📜 Carta     │───→│ 📧 Mensaje 1   │   ║
        ║  │ Registro │    │  Autorización│    │  a Believe/    │   ║
        ║  │ Catálogo │    │  (notariada) │    │  The Orchard   │   ║
        ║  └──────────┘    └──────────────┘    └────────────────┘   ║
        ║       │                                      │            ║
        ║       │ 10-15 días hábiles                    │ Sin pedir  ║
        ║       │ para certificado                      │ nada aún   ║
        ║       ▼                                      ▼            ║
        ╚════════════════════════════════════════════════════════════╝

        ╔════════════════════════════════════════════════════════════╗
        ║  🟣  SEMANA 2-3: AUDITORÍA + SEGUNDO CONTACTO              ║
        ╠════════════════════════════════════════════════════════════╣
        ║                                                          ║
        ║  ┌──────────────────┐    ┌─────────────────────────────┐  ║
        ║  │  📊 Auditoría     │    │  📧 Mensaje 2               │  ║
        ║  │  12 canciones     │───→│  + Resumen Ejecutivo       │  ║
        ║  │  (Scalin Flow IA) │    │  a Believe/The Orchard     │  ║
        ║  └──────────────────┘    └─────────────────────────────┘  ║
        ║       │                                      │            ║
        ║       │ 3,350+ nodos                          │ Adjuntar  ║
        ║       │ $19,640/mes estimado                    │ PDF con  ║
        ║       ▼                                      ▼ métricas  ║
        ╚════════════════════════════════════════════════════════════╝

        ╔════════════════════════════════════════════════════════════╗
        ║  🟢  SEMANA 3-4: CERTIFICADO ONDA + PROPUESTA FORMAL      ║
        ╠════════════════════════════════════════════════════════════╣
        ║                                                          ║
        ║  ┌──────────────────┐    ┌─────────────────────────────┐  ║
        ║  │  ✅ Certificado  │    │  📧 Mensaje 3               │  ║
        ║  │  ONDA en mano    │───→│  + Propuesta formal        │  ║
        ║  │  178 canciones   │    │  + Solicitud de adelanto   │  ║
        ║  │  registradas     │    │  ($500K-$1M USD)           │  ║
        ║  └──────────────────┘    └─────────────────────────────┘  ║
        ║                                                          ║
        ║  ┌──────────────────┐                                     ║
        ║  │  🎵 DistroKid    │  (paralelo, no bloqueante)          ║
        ║  │  Generar ISRCs   │  Solo si se necesita acelerar      ║
        ║  │  Content ID bás. │  Se migra cuando cierre adelanto   ║
        ║  └──────────────────┘                                     ║
        ╚════════════════════════════════════════════════════════════╝

        ╔════════════════════════════════════════════════════════════╗
        ║  🟡  SEMANA 4-8: NEGOCIACIÓN + CIERRE DEL ADELANTO        ║
        ╠════════════════════════════════════════════════════════════╣
        ║                                                          ║
        ║  ┌──────────────┐    ┌────────────────┐  ┌────────────┐  ║
        ║  │  💰 Negociar  │───→│  ✍️ Firmar      │──→│  📧 Msj 4  │  ║
        ║  │  adelanto     │    │  contrato      │  │  (si aplica)│  ║
        ║  │  con Believe  │    │  distribución  │  │  fecha lím │  ║
        ║  │  o The Orchard│    │  exclusiva     │  └────────────┘  ║
        ║  └──────┬───────┘    └────────┬───────┘                   ║
        ║         │                     │                           ║
        ║         │  Si se cierra       │  Adelanto depositado      ║
        ║         ▼                     ▼  en cuenta de artista     ║
        ╚════════════════════════════════════════════════════════════╝

        ╔════════════════════════════════════════════════════════════╗
        ║  🟠  MES 3-4: LLC WYOMING + TOKENIZACIÓN + TUBOLETA       ║
        ╠════════════════════════════════════════════════════════════╣
        ║                                                          ║
        ║  ┌────────────────┐    ┌───────────────────────────┐     ║
        ║  │  🇺🇸 LLC Wyoming │───→│  📄 Assignment of Rights  │     ║
        ║  │  Constituir     │    │  Cesión explotación      │     ║
        ║  │  en línea 24-72h│    │  digital global          │     ║
        ║  └───────┬────────┘    └───────────┬───────────────┘     ║
        ║          │                         │                     ║
        ║          ▼                         ▼                     ║
        ║  ┌──────────────────────────────────────────┐            ║
        ║  │  🪙  SMART CONTRACTS (Base / Polygon)     │            ║
        ║  │  RO-01 Clásicos · RO-02 Década Oro       │            ║
        ║  │  RO-03 Baladas · RO-04 Colaboraciones    │            ║
        ║  │  RO-05 Espiritual · RO-06 50 Aniversario │            ║
        ║  └──────────────────────────────────────────┘            ║
        ║          │                                               ║
        ║          ▼                                               ║
        ║  ┌──────────────────────────────────────────┐            ║
        ║  │  🎫 Alianza TuBoleta Pass + NFT           │            ║
        ║  │  Special Guest A como boletas blockchain  │            ║
        ║  │  Tu plataforma = canal venta internac.    │            ║
        ║  └──────────────────────────────────────────┘            ║
        ╚════════════════════════════════════════════════════════════╝

        ╔════════════════════════════════════════════════════════════╗
        ║  🔴  MES 4-6: PREVENTA + CAMPAÑA MARKETING                ║
        ╠════════════════════════════════════════════════════════════╣
        ║                                                          ║
        ║  ┌──────────────────┐  ┌──────────────────────────┐     ║
        ║  │  📢 40+ artistas  │  │  🌐 Plataforma web       │     ║
        ║  │  afiliados con    │  │  Shopify Plus + Wallet   │     ║
        ║  │  smartlinks       │  │  + Apple Pay + Blinks   │     ║
        ║  └────────┬─────────┘  └───────────┬──────────────┘     ║
        ║           │                        │                     ║
        ║           ▼                        ▼                     ║
        ║  ┌──────────────────────────────────────────┐            ║
        ║  │  🔥 PREVENTA ACTIVA                       │            ║
        ║  │  • Paquetes hospitalidad diáspora $499    │            ║
        ║  │  • Streaming privado $25 → meta $250K    │            ║
        ║  │  • Playlist strategy Spotify activa       │            ║
        ║  │  • Blinks en Instagram/X/TikTok           │            ║
        ║  └──────────────────────────────────────────┘            ║
        ╚════════════════════════════════════════════════════════════╝

        ╔════════════════════════════════════════════════════════════╗
        ║  🎯  23 DE SEPTIEMBRE: CONCIERTO 50 ANIVERSARIO           ║
        ║  Estadio Olímpico Félix Sánchez · 40+ artistas · 50K cap. ║
        ╚════════════════════════════════════════════════════════════╝
                    │
        ┌───────────┼───────────┐
        ▼           ▼           ▼
    ┌────────┐ ┌────────┐ ┌────────┐
    │💰      │ │📈      │ │🔗      │
    │Ingresos │ │300-500%│ │Tokens  │
    │evento   │ │pico    │ │holders │
    │+ streaming│ │búsquedas │ │fundac. │
    │+ paqtes │ │catálogo│ │activos │
    └────────┘ └────────┘ └────────┘
      </div>

      <h4>Resumen de Ingresos por Fase</h4>
      <table>
        <tr><th>Fase</th><th>Fuente</th><th>Estimado</th><th>¿Depende de qué?</th></tr>
        <tr><td>Semana 4-8</td><td>Adelanto Believe / The Orchard</td><td class="num" style="color:#f0c040;">$500K-$1M USD</td><td>Certificado ONDA + Auditoría</td></tr>
        <tr><td>Mes 4-6</td><td>Preventa paquetes hospitalidad</td><td class="num" style="color:#6ecfa5;">~$49,900 USD</td><td>Bloque 150 boletas Special Guest A</td></tr>
        <tr><td>Mes 4-6</td><td>Preventa streaming privado</td><td class="num" style="color:#6ecfa5;">~$250,000 USD</td><td>10,000 accesos a $25</td></tr>
        <tr><td>Mes 4-6</td><td>Comisiones afiliados 40+ artistas</td><td class="num" style="color:#6ecfa5;">~$50,000 USD</td><td>1,000 ventas × 5-10% comisión</td></tr>
        <tr><td>Mes 6+</td><td>Regalías streaming (DistroKid/Believe)</td><td class="num" style="color:#6ecfa5;">$95K-$140K/mes</td><td>Distribución activa + Content ID</td></tr>
        <tr><td>Mes 6+</td><td>SoundExchange retroactivo</td><td class="num" style="color:#6ecfa5;">$40K-$80K USD</td><td>Registro en plataforma</td></tr>
      </table>

      <div class="highlight-box" style="border-color:#f0c040;">
        <strong>🎯 Lo más importante de este diagrama:</strong><br>
        <strong>1.</strong> Nada depende de un solo punto de falla. Si una multinacional tarda, el streaming y los paquetes ya generan.<br>
        <strong>2.</strong> Si las ventas de hospitalidad bajan, el adelanto ya cubrió la producción del evento.<br>
        <strong>3.</strong> Si el adelanto tarda, los tokens del catálogo ya están activos y generando ingresos pasivos.<br>
        <strong>4.</strong> La estructura está diseñada para que el proyecto avance aunque alguna pieza sea más lenta.<br>
        <strong>5.</strong> FUGA y Deliver My Tune quedan descartados si cierras con Believe o The Orchard.
      </div>
    `
    },
  {
    id: 'checklist',
    title: '18. ✅ Checklist Interactiva — Listos para Believe / The Orchard?',
    subtitle: '20 items interactivos con progreso guardado en localStorage. Todo lo que debe estar listo antes de enviar el Mensaje 3 (Propuesta Formal con Adelanto).',
    icon: '\u2705',
    iconBg: '#0a2a1a',
    iconColor: '#6ecfa5',
    content: `
      <div class="highlight-box" style="border-color:#6ecfa5;">
        <strong>\ud83c\udfaf Para que sirve esta checklist?</strong><br>
        Cada item representa un requisito real para que Believe o The Orchard firmen un adelanto de $500K-$1M USD.
        Los checkboxes guardan su estado automaticamente en tu navegador (localStorage).<br><br>
        <strong>\ud83d\udccc Orden recomendado:</strong> Sigue la numeracion. Los items I y II son <strong>prerrequisitos</strong>
        del Mensaje 1. Los items III y IV se preparan <strong>en paralelo</strong>. El Mensaje 3 solo se envia
        cuando los items I, II y III estan completos.<br><br>
        <span style="color:var(--muted);font-size:12px;">\ud83d\udcbe El progreso se guarda automaticamente al hacer clic. Puedes cerrar y volver cuando quieras.</span>
      </div>

      <div id="checklist-progress-bar" style="margin-bottom:16px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
          <span style="font-size:13px;font-weight:600;color:var(--text);" id="checklist-progress-text">0/20 completado</span>
          <span style="font-size:12px;color:var(--muted);" id="checklist-progress-pct">0%</span>
        </div>
        <div style="height:6px;background:var(--bg4);border-radius:3px;overflow:hidden;">
          <div id="checklist-progress-fill" style="height:100%;width:0%;background:linear-gradient(90deg,#6ecfa5,#4cad7c);border-radius:3px;transition:width 0.3s ease;"></div>
        </div>
      </div>

      <div style="display:flex;gap:8px;margin-bottom:14px;flex-wrap:wrap;">
        <button class="btn btn-sm btn-ghost" onclick="resetChecklist()" style="font-size:11px;">\ud83d\udd04 Reiniciar checklist</button>
        <span style="font-size:11px;color:var(--muted);align-self:center;">(esto borra todo el progreso guardado)</span>
      </div>

      <h4>\ud83d\udd35 I. FUNDACION LEGAL Y DOCUMENTACION</h4>
      <div style="font-size:12px;color:var(--muted);margin:-6px 0 10px 0;">Prerrequisito del Mensaje 1 — sin estos documentos no hay negociacion posible</div>
      <div class="checklist-group">
        <div class="checklist-item" data-key="check_ondareg" onclick="toggleChecklistItem(this)">
          <span class="checklist-box">\u2610</span>
          <span class="checklist-label">ONAPI — Registrar Nombre Comercial (Clase 41 + 35) — ~$100</span>
        </div>
        <div class="checklist-item" data-key="check_srl" onclick="toggleChecklistItem(this)">
          <span class="checklist-box">\u2610</span>
          <span class="checklist-label">Constituir SRL en Camara de Comercio + DGII — ~$450</span>
        </div>
        <div class="checklist-item" data-key="check_onda" onclick="toggleChecklistItem(this)">
          <span class="checklist-box">\u2610</span>
          <span class="checklist-label">ONDA — Registrar 178 canciones como Obra Colectiva — RD$8,000-10,000</span>
          <span class="checklist-ref">\u2192 Seccion 14</span>
        </div>
        <div class="checklist-item" data-key="check_contrato" onclick="toggleChecklistItem(this)">
          <span class="checklist-box">\u2610</span>
          <span class="checklist-label">Contrato de Asesoramiento Estrategico firmado con Ramon Orlando</span>
          <span class="checklist-ref">\u2192 Seccion 13</span>
        </div>
        <div class="checklist-item" data-key="check_carta" onclick="toggleChecklistItem(this)">
          <span class="checklist-box">\u2610</span>
          <span class="checklist-label">Carta de Autorizacion notariada (para negociar en nombre del artista)</span>
          <span class="checklist-ref">\u2192 Seccion 16</span>
        </div>
      </div>

      <h4>\ud83d\udfe2 II. AUDITORIA Y EVIDENCIA</h4>
      <div style="font-size:12px;color:var(--muted);margin:-6px 0 10px 0;">Se entrega con Mensaje 2 — la evidencia que justifica el adelanto</div>
      <div class="checklist-group">
        <div class="checklist-item" data-key="check_audit12" onclick="toggleChecklistItem(this)">
          <span class="checklist-box">\u2610</span>
          <span class="checklist-label">Auditoria de las 12 canciones principales (3,350+ nodos, 491M+ vistas)</span>
          <span class="checklist-ref">\u2192 Seccion 15</span>
        </div>
        <div class="checklist-item" data-key="check_resumenpdf" onclick="toggleChecklistItem(this)">
          <span class="checklist-box">\u2610</span>
          <span class="checklist-label">Resumen Ejecutivo en PDF para distribuidoras (metricas + proyeccion)</span>
        </div>
        <div class="checklist-item" data-key="check_proyeccion" onclick="toggleChecklistItem(this)">
          <span class="checklist-box">\u2610</span>
          <span class="checklist-label">Proyeccion del catalogo completo (178 canciones, 2.8B+ vistas)</span>
        </div>
        <div class="checklist-item" data-key="check_catalizador" onclick="toggleChecklistItem(this)">
          <span class="checklist-box">\u2610</span>
          <span class="checklist-label">Documentar el Catalizador 23S (300-500% pico de busquedas estimado)</span>
        </div>
      </div>

      <h4>\ud83d\udfe1 III. INFRAESTRUCTURA TECNICA</h4>
      <div style="font-size:12px;color:var(--muted);margin:-6px 0 10px 0;">Se prepara en paralelo. DistroKid es temporal — se migra cuando cierre el adelanto</div>
      <div class="checklist-group">
        <div class="checklist-item" data-key="check_isrcs" onclick="toggleChecklistItem(this)">
          <span class="checklist-box">\u2610</span>
          <span class="checklist-label">ISRCs generados (DistroKid o similar temporal)</span>
        </div>
        <div class="checklist-item" data-key="check_contentid" onclick="toggleChecklistItem(this)">
          <span class="checklist-box">\u2610</span>
          <span class="checklist-label">Content ID activado en YouTube — politica "Monetize" (no bloquear)</span>
        </div>
        <div class="checklist-item" data-key="check_soundex" onclick="toggleChecklistItem(this)">
          <span class="checklist-box">\u2610</span>
          <span class="checklist-label">Registro en SoundExchange (libera retroactivo $40K-$80K)</span>
        </div>
        <div class="checklist-item" data-key="check_ascap" onclick="toggleChecklistItem(this)">
          <span class="checklist-box">\u2610</span>
          <span class="checklist-label">Registro en ASCAP o BMI (derechos ejecucion publica)</span>
        </div>
        <div class="checklist-item" data-key="check_sgacedom" onclick="toggleChecklistItem(this)">
          <span class="checklist-box">\u2610</span>
          <span class="checklist-label">Registro en SGACEDOM (flujo local dominicano)</span>
        </div>
      </div>

      <h4>\ud83d\udfe0 IV. PITCH Y MULTINACIONALES</h4>
      <div style="font-size:12px;color:var(--muted);margin:-6px 0 10px 0;">Los 4 mensajes progresivos + los contactos correctos</div>
      <div class="checklist-group">
        <div class="checklist-item" data-key="check_msj1" onclick="toggleChecklistItem(this)">
          <span class="checklist-box">\u2610</span>
          <span class="checklist-label">Mensaje 1 listo — Primer contacto (sin documentos, solo sondear)</span>
          <span class="checklist-ref">\u2192 Seccion 12</span>
        </div>
        <div class="checklist-item" data-key="check_msj2" onclick="toggleChecklistItem(this)">
          <span class="checklist-box">\u2610</span>
          <span class="checklist-label">Mensaje 2 listo — Con resumen ejecutivo de auditoria</span>
          <span class="checklist-ref">\u2192 Seccion 12</span>
        </div>
        <div class="checklist-item" data-key="check_msj3" onclick="toggleChecklistItem(this)">
          <span class="checklist-box">\u2610</span>
          <span class="checklist-label">Mensaje 3 listo — Propuesta formal + Certificado ONDA + Adelanto</span>
          <span class="checklist-ref">\u2192 Seccion 12</span>
        </div>
        <div class="checklist-item" data-key="check_msj4" onclick="toggleChecklistItem(this)">
          <span class="checklist-box">\u2610</span>
          <span class="checklist-label">Mensaje 4 listo — Cierre con fecha limite (si no responden)</span>
          <span class="checklist-ref">\u2192 Seccion 12</span>
        </div>
        <div class="checklist-item" data-key="check_contactos" onclick="toggleChecklistItem(this)">
          <span class="checklist-box">\u2610</span>
          <span class="checklist-label">Contactos correctos identificados en Believe + The Orchard</span>
        </div>
      </div>

      <h4>\ud83d\udd34 V. NEGOCIACION Y CIERRE</h4>
      <div style="font-size:12px;color:var(--muted);margin:-6px 0 10px 0;">Post-Mensaje 3: si llegas aqui, el adelanto esta en proceso</div>
      <div class="checklist-group">
        <div class="checklist-item" data-key="check_negociacion" onclick="toggleChecklistItem(this)">
          <span class="checklist-box">\u2610</span>
          <span class="checklist-label">Negociacion activa del adelanto ($500K-$1M USD)</span>
        </div>
        <div class="checklist-item" data-key="check_llc" onclick="toggleChecklistItem(this)">
          <span class="checklist-box">\u2610</span>
          <span class="checklist-label">LLC Wyoming constituida (con el dinero del adelanto)</span>
          <span class="checklist-ref">\u2192 Seccion 9</span>
        </div>
        <div class="checklist-item" data-key="check_assignment" onclick="toggleChecklistItem(this)">
          <span class="checklist-box">\u2610</span>
          <span class="checklist-label">Assignment of Rights firmado y notariado</span>
          <span class="checklist-ref">\u2192 Seccion 9</span>
        </div>
      </div>

      <div id="checklist-celebration" style="display:none;margin-top:18px;padding:16px;background:var(--bg3);border:1px solid #6ecfa5;border-radius:var(--radius);text-align:center;">
        <div style="font-size:28px;margin-bottom:8px;">\ud83c\udf89\ud83c\udfc6\ud83c\udf89</div>
        <div style="font-size:16px;font-weight:700;color:#6ecfa5;">Los 20 items estan completos!</div>
        <div style="font-size:13px;color:var(--text2);margin-top:6px;line-height:1.6;">
          Ya puedes enviar el <strong>Mensaje 3</strong> a Believe o The Orchard con toda la documentacion en regla.<br>
          El catalogo esta auditado, registrado, y listo para el adelanto. \ud83d\ude80
        </div>
        <div style="margin-top:12px;font-size:12px;color:var(--muted);">
          Proximo paso: Abrir la <strong>Seccion 12</strong> \ud83d\udce7 y preparar el envio.
        </div>
      </div>
    `
  }
];

/* ── Checklist Interactive Functions ── */
function toggleChecklistItem(el) {
  const key = el.dataset.key;
  if (!key) return;
  const saved = JSON.parse(localStorage.getItem('na_checklist') || '{}');
  saved[key] = !saved[key];
  localStorage.setItem('na_checklist', JSON.stringify(saved));
  localStorage.setItem('na_checklist_lastupdate', Date.now().toString());
  renderChecklistState();
}

function renderChecklistState() {
  const saved = JSON.parse(localStorage.getItem('na_checklist') || '{}');
  const items = document.querySelectorAll('.checklist-item');
  let completed = 0;
  items.forEach(item => {
    const key = item.dataset.key;
    const box = item.querySelector('.checklist-box');
    if (key && saved[key]) {
      item.classList.add('done');
      box.textContent = '✅';
      completed++;
    } else {
      item.classList.remove('done');
      box.textContent = '☐';
    }
  });
  const total = items.length;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  const textEl = document.getElementById('checklist-progress-text');
  const pctEl = document.getElementById('checklist-progress-pct');
  const fillEl = document.getElementById('checklist-progress-fill');
  const celebrationEl = document.getElementById('checklist-celebration');
  if (textEl) textEl.textContent = completed + '/' + total + ' completado';
  if (pctEl) pctEl.textContent = pct + '%';
  if (fillEl) fillEl.style.width = pct + '%';
  if (celebrationEl) celebrationEl.style.display = completed === total ? 'block' : 'none';
}

function resetChecklist() {
  if (!confirm('Reiniciar toda la checklist? Se borrara todo el progreso guardado.')) return;
  localStorage.removeItem('na_checklist');
  localStorage.setItem('na_checklist_lastupdate', Date.now().toString());
  renderChecklistState();
}

/* ── Render Master Plan ── */

/* ── Render Master Plan ── */
function renderMasterPlan() {
  const container = document.getElementById('masterplan-container');
  if (!container) return;

  container.innerHTML = `
    <div style="margin-bottom:20px;padding:12px 16px;background:var(--bg3);border:0.5px solid var(--border);border-radius:var(--radius);font-size:12px;color:var(--muted);">
      <strong style="color:var(--text);">Fuentes:</strong> Gemini + Claude + Manual Maestro · <strong style="color:var(--text);">Versión:</strong> 2.0 — Junio 2026 · <strong style="color:var(--text);">Secciones:</strong> 18
      · <strong style="color:var(--text);">Secciones:</strong> 17 · <strong style="color:var(--text);">Ultima actualización:</strong> +Diagrama Flujo Completo
    </div>
    ${MASTER_SECTIONS.map(s => `
      <div class="master-section">
        <div class="master-section-header" onclick="toggleMasterSection('${s.id}')" id="ms-header-${s.id}">
          <div class="ms-icon" style="background:${s.iconBg};color:${s.iconColor};">${s.icon}</div>
          <div class="ms-info">
            <div class="ms-title">${s.title}</div>
            <div class="ms-sub">${s.subtitle}</div>
          </div>
          <span class="ms-toggle">▼</span>
        </div>
        <div class="master-section-body" id="ms-body-${s.id}">
          ${s.content}
        </div>
      </div>
    `).join('')}
  `;

  // Expand first section by default
  const firstId = MASTER_SECTIONS[0].id;
  document.getElementById('ms-header-' + firstId)?.classList.remove('collapsed');

  // Restore checklist state after rendering
  renderChecklistState();

  // Restore checklist state after rendering
  renderChecklistState();
}

function toggleMasterSection(id) {
  const header = document.getElementById('ms-header-' + id);
  if (!header) return;
  header.classList.toggle('collapsed');
}

/* ── Contrato: copiar / exportar ── */
/* ── Carta Autorización: copiar / exportar ── */
function copyCartaText() {
  const body = document.getElementById('ms-body-carta');
  if (!body) return alert('Abre la sección 16 (Carta Autorización) primero.');
  const text = body.innerText.trim();
  navigator.clipboard.writeText(text).then(() => {
    alert('✅ Carta de autorización copiada al portapapeles. Completa los [CORCHETES] antes de notariar.');
  }).catch(() => {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
    alert('✅ Carta de autorización copiada.');
  });
}

function exportCartaTxt() {
  const body = document.getElementById('ms-body-carta');
  if (!body) return alert('Abre la sección 16 (Carta Autorización) primero.');
  const text = body.innerText.trim();
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'carta-autorizacion-ramon-orlando.txt';
  a.click();
  URL.revokeObjectURL(url);
}

/* ── Contrato: copiar / exportar ── */
function copyContractText() {
  const body = document.getElementById('ms-body-contrato');
  if (!body) return alert('Abre la sección 13 (Contrato) primero.');
  const text = body.innerText.trim();
  navigator.clipboard.writeText(text).then(() => {
    alert('✅ Contrato copiado al portapapeles. Pégalo en tu editor para completar los [CORCHETES].');
  }).catch(() => {
    // fallback
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
    alert('✅ Contrato copiado al portapapeles.');
  });
}

function exportContractTxt() {
  const body = document.getElementById('ms-body-contrato');
  if (!body) return alert('Abre la sección 13 (Contrato) primero.');
  const text = body.innerText.trim();
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'contrato-asesoramiento-estrategico.txt';
  a.click();
  URL.revokeObjectURL(url);
}
