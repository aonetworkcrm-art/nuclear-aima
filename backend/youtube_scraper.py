"""
Nuclear AIMA — YouTube Scraper v1.3
Motor de raspado de YouTube con Selenium + BeautifulSoup
Extrae nodos (videos), Shorts del shelf, y datos vía ytInitialData JSON
"""

import os
import re
import time
import math
import json
from datetime import datetime, timezone
from dateutil import parser as dateparser
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, WebDriverException
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service
from bs4 import BeautifulSoup


# ── Canales Piratas Conocidos ──
PIRATE_KEYWORDS = [
    'karin records', 'karin music', 'música sin fronteras',
    'latin music pirate', 'merengue full hd', 'exitos del ayer',
    'música sin copyright', 'sabor latino hd', 'el bombazo musical',
    'ritmo y sabor', 'tropical hits', 'merengue manía',
    'pura musica latina', 'latinos por el mundo', 'música sin dueño',
    'exitos latinos', 'el merengue no muere', 'bailando con todo',
    'fiesta latina total', 'sin copyright', 'sin dueño',
    'full hd music', 'music pirate'
]

OFFICIAL_KEYWORDS = [
    'vevo', 'official', 'topic', 'oficial',
    'ramón orlando', 'ramon orlando'
]

# ── Shorts-specific patterns ──
SHORTS_LABEL_PATTERNS = [
    'short', 'shorts', '#shorts', 'youtube short', 'reel'
]

def is_pirate_channel(channel_name):
    """Detecta si un canal es pirata por nombre."""
    name = channel_name.lower()
    return any(kw in name for kw in PIRATE_KEYWORDS)


def is_official_channel(channel_name):
    """Detecta si un canal es oficial."""
    name = channel_name.lower()
    return any(kw in name for kw in OFFICIAL_KEYWORDS)


def is_shorts_title(title):
    """Detecta si un título sugiere que es un Short."""
    if not title:
        return False
    t = title.lower()
    return any(p in t for p in SHORTS_LABEL_PATTERNS)


def parse_relative_time(text):
    """Convierte texto relativo de YouTube a días."""
    text = text.lower().strip()
    if 'ago' not in text:
        return 0

    if 'second' in text:
        return 0
    elif 'minute' in text:
        nums = re.findall(r'\d+', text)
        return 0 if not nums else max(1, int(nums[0]) // 1440)
    elif 'hour' in text:
        nums = re.findall(r'\d+', text)
        return 0 if not nums else max(1, int(nums[0]) // 24)
    elif 'day' in text:
        nums = re.findall(r'\d+', text)
        return int(nums[0]) if nums else 0
    elif 'week' in text:
        nums = re.findall(r'\d+', text)
        return int(nums[0]) * 7 if nums else 0
    elif 'month' in text:
        nums = re.findall(r'\d+', text)
        return int(nums[0]) * 30 if nums else 0
    elif 'year' in text:
        nums = re.findall(r'\d+', text)
        return int(nums[0]) * 365 if nums else 0
    return 0


def parse_views(text):
    """Convierte texto de vistas de YouTube a número entero."""
    if not text:
        return 0
    text = text.lower().strip()
    num_match = re.search(r'([\d.]+)\s*([kmb]?)', text)
    if not num_match:
        return 0
    num = float(num_match.group(1))
    suffix = num_match.group(2)
    if suffix == 'k':
        return int(num * 1000)
    elif suffix == 'm':
        return int(num * 1000000)
    elif suffix == 'b':
        return int(num * 1000000000)
    return int(num)


def calculate_vph(views, age_days):
    """Calcula Views Per Hour."""
    hours = age_days * 24
    return round(views / hours, 2) if hours > 0 else 0


class YouTubeScraper:
    """Motor de raspado de YouTube con Selenium."""

    def __init__(self, headless=True, timeout=20):
        self.timeout = timeout
        self.driver = None
        self.headless = headless

    def _init_driver(self):
        """Inicializa el WebDriver de Chrome optimizado para baja memoria."""
        options = Options()
        if self.headless:
            options.add_argument('--headless=new')
        options.add_argument('--no-sandbox')
        options.add_argument('--disable-dev-shm-usage')
        options.add_argument('--disable-gpu')
        options.add_argument('--disable-extensions')
        options.add_argument('--disable-background-networking')
        options.add_argument('--disable-sync')
        options.add_argument('--disable-translate')
        options.add_argument('--disable-default-apps')
        options.add_argument('--mute-audio')
        options.add_argument('--no-first-run')
        options.add_argument('--js-flags=--max-old-space-size=256')
        options.add_argument('--window-size=1280,720')
        options.add_argument('--lang=es')
        options.add_argument('--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) '
                             'AppleWebKit/537.36 (KHTML, like Gecko) '
                             'Chrome/120.0.0.0 Safari/537.36')
        options.add_experimental_option('excludeSwitches', ['enable-logging'])

        # Usar CHROME_BIN del entorno (útil en Docker)
        chrome_bin = os.environ.get('CHROME_BIN', '/usr/bin/google-chrome')
        if os.path.exists(chrome_bin):
            options.binary_location = chrome_bin

        try:
            service = Service(ChromeDriverManager().install())
            self.driver = webdriver.Chrome(service=service, options=options)
            self.driver.set_page_load_timeout(self.timeout)
        except Exception as e:
            print(f"[Chrome] Error con ChromeDriverManager: {e}")
            try:
                self.driver = webdriver.Chrome(options=options)
            except Exception as e2:
                # Último intento: buscar chromedriver en PATH
                try:
                    from selenium.webdriver.chrome.service import Service as BaseService
                    self.driver = webdriver.Chrome(service=BaseService(), options=options)
                except Exception as e3:
                    raise RuntimeError(f"No se pudo iniciar ChromeDriver: {e2}\n{e3}")

    # ─────────────────────────────────────────────
    #  EXTRACCIÓN DESDE ytInitialData (JSON)
    #  Método principal: parsea el JSON que YouTube
    #  incrusta en cada página, mucho más confiable
    #  que parsear el DOM renderizado.
    # ─────────────────────────────────────────────

    def _extract_yt_initial_data(self, timeout=10, poll_interval=0.5):
        """Extrae el objeto ytInitialData del DOM vía JavaScript.
        Usa XPath para encontrar el script tag que contiene ytInitialData,
        mucho más confiable que el querySelector con :contains() (XPath puro).
        
        Incluye reintentos automáticos con timeout configurable para
        manejar páginas que tardan en cargar.
        
        Args:
            timeout: Tiempo máximo en segundos para esperar (default: 10)
            poll_interval: Intervalo entre reintentos en segundos (default: 0.5)
        
        Returns:
            dict or None
        """
        max_attempts = max(1, int(timeout / poll_interval))
        
        for attempt in range(1, max_attempts + 1):
            try:
                data = self.driver.execute_script(
                    'try {'
                    '  if (window.ytInitialData) return window.ytInitialData;'
                    '  var xpathResult = document.evaluate(\'//script[contains(text(),"ytInitialData")]\', '
                    '    document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);'
                    '  var scriptTag = xpathResult.singleNodeValue;'
                    '  if (!scriptTag) return null;'
                    '  var raw = scriptTag.textContent || scriptTag.innerText || \'\';'
                    '  var cleaned = raw.replace(\'window.ytInitialData = \', \'\').trim();'
                    '  if (cleaned.charAt(cleaned.length - 1) === \';\') cleaned = cleaned.slice(0, -1);'
                    '  return JSON.parse(cleaned);'
                    '} catch(e) { return null; }'
                )
                
                if data is not None:
                    if attempt > 1:
                        print(f"[YouTubeScraper] ytInitialData obtenido en intento #{attempt}")
                    return data
                    
            except Exception as e:
                if attempt == max_attempts:
                    print(f"[YouTubeScraper] Error en intento #{attempt}: {e}")
                    return None
            
            if attempt < max_attempts:
                time.sleep(poll_interval)
        
        print(f"[YouTubeScraper] No se pudo extraer ytInitialData tras {max_attempts} intentos")
        return None

    def _extract_shorts_from_initial_data(self, data, query, max_results=30):
        """
        Extrae Shorts del objeto ytInitialData.
        Los Shorts aparecen en 'contents.twoColumnSearchResultsRenderer
        .primaryContents.sectionListRenderer.contents[].
        itemSectionRenderer.contents[].reelShelfRenderer'
        
        También pueden aparecer como 'richItemRenderer' con enlaces /shorts/.
        """
        shorts = []
        seen_ids = set()

        try:
            # Navegar por la estructura de ytInitialData
            contents = (data.get('contents', {})
                        .get('twoColumnSearchResultsRenderer', {})
                        .get('primaryContents', {})
                        .get('sectionListRenderer', {})
                        .get('contents', []))
        except AttributeError:
            contents = []

        for section in contents:
            if len(shorts) >= max_results:
                break

            # ── Buscar reelShelfRenderer (el shelf de Shorts) ──
            try:
                item_section = section.get('itemSectionRenderer', {}) or \
                               section.get('richSectionRenderer', {})
                if not item_section:
                    continue

                contents_list = (item_section.get('contents', []) if 'itemSectionRenderer' in section
                                 else item_section.get('content', {}).get('richShelfRenderer', {}).get('contents', []))

                # También buscar directo en contents si no hay itemSection
                if not contents_list:
                    content_block = (section.get('itemSectionRenderer', {})
                                     .get('contents', []))
                    for block in content_block:
                        # Buscar reelShelfRenderer
                        reel_shelf = (block.get('reelShelfRenderer', {}) or
                                      block.get('richShelfRenderer', {}))
                        if reel_shelf:
                            items = reel_shelf.get('items', [])
                            for item in items:
                                if len(shorts) >= max_results:
                                    break
                                short = self._parse_reel_item(item, query)
                                if short and short['video_id'] not in seen_ids:
                                    seen_ids.add(short['video_id'])
                                    shorts.append(short)
            except Exception:
                continue

            # ── También buscar en richItemRenderer (resultados mezclados) ──
            try:
                rich_items = (section.get('itemSectionRenderer', {})
                              .get('contents', []))
                for item in rich_items:
                    if len(shorts) >= max_results:
                        break
                    try:
                        video_renderer = (item.get('videoRenderer', {}) or
                                          item.get('richItemRenderer', {}).get('content', {}).get('videoRenderer', {}))
                        if video_renderer:
                            # Verificar si es Short por duración o navegación
                            length = video_renderer.get('lengthText', {}).get('simpleText', '')
                            nav = video_renderer.get('navigationEndpoint', {}).get('commandMetadata', {}).get('webCommandMetadata', {}).get('url', '')
                            if '/shorts/' in nav or (length and self._is_short_duration(length)):
                                short = self._parse_video_renderer_as_short(video_renderer, query)
                                if short and short['video_id'] not in seen_ids:
                                    seen_ids.add(short['video_id'])
                                    shorts.append(short)
                    except Exception:
                        continue
            except Exception:
                continue

        print(f"[YouTubeScraper] Extraídos {len(shorts)} Shorts de ytInitialData para '{query}'")
        return shorts

    def _is_short_duration(self, duration_text):
        """Determina si una duración corresponde a un Short (< 60 seg)."""
        if not duration_text or duration_text == 'SHORTS':
            return True
        parts = duration_text.split(':')
        if len(parts) == 1:  # solo segundos
            try:
                return int(parts[0]) < 60
            except:
                return False
        elif len(parts) == 2:  # mm:ss
            try:
                return int(parts[0]) == 0 and int(parts[1]) < 60
            except:
                return False
        return False

    def _parse_reel_item(self, item, query):
        """Parsea un reelItemRenderer del JSON de YouTube."""
        try:
            reel = item.get('reelItemRenderer', {}) or item.get('richItemRenderer', {}).get('content', {}).get('reelItemRenderer', {})
            if not reel:
                return None

            video_id = reel.get('videoId', '')
            if not video_id:
                return None

            title_runs = reel.get('headline', {}).get('runs', [])
            title = ''.join(r.get('text', '') for r in title_runs) or query

            # Canal
            channel_runs = (reel.get('channelNavigationEndpoint', {})
                           .get('commandMetadata', {}).get('webCommandMetadata', {}).get('url', ''))
            # Alternative: buscar en los botones de interacción
            channel_name = reel.get('channelName', '') or ''
            if not channel_name:
                # Intentar extraer de presenter del reel
                presenter = reel.get('presenter', {}) or {}
                channel_name = presenter.get('displayName', '') or ''
            if not channel_name:
                channel_name = 'Desconocido'

            # Vistas (los Shorts muestran "X views" en el headline o accessibleLabel)
            views_text = ''
            accessible_label = reel.get('accessibleLabel', '')
            if accessible_label:
                view_match = re.search(r'([\d.]+[kmb]?)\s*view', accessible_label.lower())
                if view_match:
                    views_text = view_match.group(0)
            views = parse_views(views_text)

            # Si no hay vistas en el label, calcular del headline
            if views == 0 and title_runs:
                full_text = ''.join(r.get('text', '') for r in title_runs)
                view_match = re.search(r'([\d.]+[kmb]?)\s*view', full_text.lower())
                if view_match:
                    views = parse_views(view_match.group(1))

            # Antigüedad (Shorts no siempre muestran fecha exacta)
            age_days = 30  # default

            # Navegación URL
            nav_url = (reel.get('navigationEndpoint', {})
                       .get('commandMetadata', {}).get('webCommandMetadata', {}).get('url', '')) or f'/shorts/{video_id}'
            full_url = f'https://www.youtube.com{nav_url}' if nav_url.startswith('/') else nav_url

            vph = calculate_vph(views, age_days) if age_days > 0 else 0

            return {
                'id': 0,
                'title': title[:120],
                'channel': channel_name[:60],
                'url': full_url,
                'video_id': video_id,
                'views': views,
                'age_days': age_days,
                'vph': vph,
                'duration': '0:00-1:00',
                'isPirate': is_pirate_channel(channel_name),
                'isOfficial': False,
                'source': 'ytInitialData'
            }
        except Exception as e:
            print(f"[YouTubeScraper] Error parseando reel: {e}")
            return None

    def _parse_video_renderer_as_short(self, video_renderer, query):
        """Parsea un videoRenderer como Short si tiene navegación /shorts/."""
        try:
            video_id = video_renderer.get('videoId', '')
            if not video_id:
                return None

            title_runs = video_renderer.get('title', {}).get('runs', [])
            title = ''.join(r.get('text', '') for r in title_runs) or query

            # Canal
            owner = video_renderer.get('ownerText', {}).get('runs', [])
            channel = owner[0].get('text', 'Desconocido') if owner else 'Desconocido'

            # Vistas
            view_count = video_renderer.get('viewCountText', {}).get('simpleText', '')
            short_view_count = video_renderer.get('shortViewCountText', {}).get('simpleText', '')
            views = parse_views(short_view_count or view_count)

            # Antigüedad
            date_text = video_renderer.get('publishedTimeText', {}).get('simpleText', '')
            age_days = parse_relative_time(date_text) if date_text else 30

            # URL
            nav_url = f'/shorts/{video_id}'
            full_url = f'https://www.youtube.com/navigate?next={nav_url}'

            vph = calculate_vph(views, age_days) if age_days > 0 else 0

            return {
                'id': 0,
                'title': title[:120],
                'channel': channel[:60],
                'url': full_url,
                'video_id': video_id,
                'views': views,
                'age_days': age_days,
                'vph': vph,
                'duration': '0:00-1:00',
                'isPirate': is_pirate_channel(channel),
                'isOfficial': False,
                'source': 'ytInitialData-video'
            }
        except Exception as e:
            print(f"[YouTubeScraper] Error parseando video como short: {e}")
            return None

    # ─────────────────────────────────────────────
    #  BÚSQUEDA DE SHORTS (navegación + JSON)
    # ─────────────────────────────────────────────

    def search_shorts(self, query, max_results=30):
        """
        Busca YouTube Shorts relacionados con una canción.
        Usa 3 estrategias en cascada:
        1. ytInitialData JSON (más preciso)
        2. DOM shelf de Shorts + enlaces /shorts/
        3. Navegación directa a Shorts individuales
        
        Args:
            query: Término de búsqueda (ej. "Te Compro Tu Novia")
            max_results: Máximo de Shorts a extraer
            
        Returns:
            Lista de diccionarios con datos de cada Short
        """
        if not self.driver:
            self._init_driver()

        all_shorts = []
        seen_ids = set()
        search_query = f"{query} #shorts"
        search_url = f"https://www.youtube.com/results?search_query={search_query.replace(' ', '+')}"

        try:
            print(f"[YouTubeScraper] Buscando Shorts: {search_query}")
            self.driver.get(search_url)

            # Esperar a que cargue
            WebDriverWait(self.driver, self.timeout).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, 'ytd-item-section-renderer, ytd-video-renderer, ytd-reel-item-renderer, #contents'))
            )
            time.sleep(2)  # dejar que JS termine de renderizar

            # ── ESTRATEGIA 1: ytInitialData JSON ──
            initial_data = self._extract_yt_initial_data()
            if initial_data:
                json_shorts = self._extract_shorts_from_initial_data(initial_data, query, max_results)
                for s in json_shorts:
                    if s['video_id'] not in seen_ids:
                        seen_ids.add(s['video_id'])
                        s['id'] = len(all_shorts) + 1
                        all_shorts.append(s)
                print(f"[YouTubeScraper] Estrategia JSON: {len(json_shorts)} Shorts")

            # ── ESTRATEGIA 2: DOM — Shelf de Shorts + enlaces /shorts/ ──
            if len(all_shorts) < max_results:
                dom_shorts = self._extract_shorts_from_dom(query, max_results - len(all_shorts), seen_ids)
                for s in dom_shorts:
                    if s.get('video_id', '') not in seen_ids:
                        seen_ids.add(s.get('video_id', str(hash(s['url']))))
                        s['id'] = len(all_shorts) + 1
                        all_shorts.append(s)
                print(f"[YouTubeScraper] Estrategia DOM: {len(dom_shorts)} Shorts")

            # ── ESTRATEGIA 3: Navegar a Shorts individuales para datos exactos ──
            if len(all_shorts) < max_results:
                # Tomar los primeros shorts no visitados y navegar a sus páginas
                to_enrich = [s for s in all_shorts[:max_results] if s.get('views', 0) == 0 or s.get('age_days', 0) == 30]
                for short in to_enrich[:5]:  # máximo 5 para no saturar
                    try:
                        detail = self._get_short_page_details(short.get('url', ''))
                        if detail:
                            if detail.get('views', 0) > 0:
                                short['views'] = detail['views']
                                short['age_days'] = detail.get('age_days', short['age_days'])
                                short['vph'] = calculate_vph(short['views'], short['age_days'])
                    except Exception:
                        continue

            print(f"[YouTubeScraper] Total: {len(all_shorts)} Shorts para '{query}'")

        except TimeoutException:
            print("[YouTubeScraper] Timeout buscando Shorts")
        except Exception as e:
            print(f"[YouTubeScraper] Error: {e}")
            import traceback
            traceback.print_exc()

        return all_shorts

    def _extract_shorts_from_dom(self, query, max_results, seen_ids):
        """Extrae Shorts del DOM usando BeautifulSoup."""
        shorts = []
        try:
            soup = BeautifulSoup(self.driver.page_source, 'html.parser')

            # Primero: buscar en el shelf de reels
            reel_items = soup.select('ytd-reel-item-renderer')
            for el in reel_items:
                if len(shorts) >= max_results:
                    break
                try:
                    # Buscar el título y enlace
                    link = el.select_one('a[href*="/shorts/"]')
                    if not link:
                        continue
                    href = link.get('href', '')
                    full_url = f"https://www.youtube.com{href}" if href.startswith('/') else href
                    video_id = href.split('/shorts/')[-1].split('?')[0].split('&')[0] if '/shorts/' in href else ''
                    
                    if video_id in seen_ids or full_url in seen_ids:
                        continue

                    title = link.get('title') or link.text.strip() or query
                    
                    # Canal
                    channel_el = el.select_one('ytd-channel-name a, a[href*="/@"], yt-formatted-string.ytd-channel-name')
                    channel = channel_el.text.strip() if channel_el else 'Desconocido'
                    
                    # Vistas (formato típico de Shorts: "1.2M views")
                    views = 0
                    metadata = el.select_one('#metadata-line, .metadata-snippet')
                    if metadata:
                        spans = metadata.select('span')
                        for span in spans:
                            txt = span.text.strip().lower()
                            if 'view' in txt:
                                views = parse_views(span.text.strip())
                                break
                    
                    # Si no encuentra en metadata, buscar en aria-label del contenedor
                    if views == 0:
                        aria = el.get('aria-label', '')
                        if aria:
                            vm = re.search(r'([\d.]+[kmb]?)\s*view', aria.lower())
                            if vm:
                                views = parse_views(vm.group(1))

                    age_days = 30
                    vph = calculate_vph(views, age_days) if age_days > 0 else 0

                    shorts.append({
                        'id': 0,
                        'title': title[:120] or query,
                        'channel': channel[:60],
                        'url': full_url,
                        'video_id': video_id,
                        'views': views,
                        'age_days': age_days,
                        'vph': vph,
                        'duration': '0:00-1:00',
                        'isPirate': is_pirate_channel(channel),
                        'isOfficial': False,
                        'source': 'DOM-reel'
                    })
                except Exception:
                    continue

            # Segundo: buscar TODOS los enlaces /shorts/ en la página
            if len(shorts) < max_results:
                short_links = soup.select('a[href*="/shorts/"]')
                for link in short_links:
                    if len(shorts) >= max_results:
                        break
                    try:
                        href = link.get('href', '')
                        full_url = f"https://www.youtube.com{href}" if href.startswith('/') else href
                        video_id = href.split('/shorts/')[-1].split('?')[0].split('&')[0] if '/shorts/' in href else ''
                        
                        if video_id in seen_ids or full_url in seen_ids:
                            continue

                        title = link.get('title') or link.text.strip() or query
                        parent = link.parent

                        # Intentar extraer vistas del contexto
                        views = 0
                        aria = link.get('aria-label', '')
                        if aria:
                            vm = re.search(r'([\d.]+[kmb]?)\s*view', aria.lower())
                            if vm:
                                views = parse_views(vm.group(1))

                        # Canal desde el contexto
                        channel = 'Desconocido'
                        channel_el = parent.find_previous('a', href=lambda x: x and '/@' in x) if parent else None
                        if not channel_el:
                            channel_el = link.find_previous('yt-formatted-string')
                        if channel_el:
                            channel = channel_el.text.strip()[:60]

                        shorts.append({
                            'id': 0,
                            'title': title[:120],
                            'channel': channel,
                            'url': full_url,
                            'video_id': video_id,
                            'views': views or 1000,
                            'age_days': 30,
                            'vph': calculate_vph(views or 1000, 30),
                            'duration': '0:00-1:00',
                            'isPirate': is_pirate_channel(channel),
                            'isOfficial': False,
                            'source': 'DOM-link'
                        })
                    except Exception:
                        continue

        except Exception as e:
            print(f"[YouTubeScraper] Error DOM extraction: {e}")

        return shorts

    def _get_short_page_details(self, url):
        """
        Navega a una página individual de Short (/shorts/ID) y
        extrae datos exactos (vistas, likes, canal, fecha).
        """
        if not url:
            return None
        try:
            self.driver.get(url)
            time.sleep(2)

            # Intentar con ytInitialData primero
            data = self._extract_yt_initial_data()
            if data:
                try:
                    # Los datos del Short están en engagementPanels o playerOverlays
                    overlay = (data.get('playerOverlays', {})
                               .get('playerOverlayRenderer', {}))
                    
                    # También puede estar en contents
                    contents = (data.get('contents', {})
                                .get('twoColumnWatchNextResults', {})
                                .get('results', {})
                                .get('results', {})
                                .get('contents', []))
                    
                    # Intentar extraer del microformat (metadata del video)
                    microformat = (data.get('microformat', {})
                                   .get('playerMicroformatRenderer', {}))
                    
                    view_count = microformat.get('viewCount', '')
                    publish_date = microformat.get('publishDate', '')
                    channel = (microformat.get('ownerChannelName', '') or
                               microformat.get('externalChannelId', ''))
                    
                    result = {}
                    if view_count:
                        result['views'] = int(view_count)
                    if publish_date:
                        try:
                            from datetime import datetime
                            pub = datetime.fromisoformat(publish_date)
                            result['age_days'] = (datetime.now() - pub).days
                        except:
                            pass
                    
                    return result if result else None
                except Exception:
                    pass

            # Fallback: parsear el DOM
            soup = BeautifulSoup(self.driver.page_source, 'html.parser')
            
            # Buscar el contenedor de metadatos del Short
            result = {}
            
            # Título
            title_el = soup.select_one('title')
            if title_el:
                title_text = title_el.text.strip()
                # YouTube formatea: "TITLE - YouTube"
                if ' - YouTube' in title_text:
                    result['title'] = title_text.replace(' - YouTube', '').strip()

            # Intentar extraer vistas del texto visible
            body_text = soup.get_text()
            view_patterns = [
                r'(\d[\d,.]*(?:\s*[kmb])?)\s*(?:vistas?|views?|reproducciones?)',
                r'(?:vistas?|views?|reproducciones?)\s*(\d[\d,.]*(?:\s*[kmb])?)'
            ]
            for pattern in view_patterns:
                match = re.search(pattern, body_text, re.IGNORECASE)
                if match:
                    result['views'] = parse_views(match.group(1))
                    break

            return result if result else None

        except Exception as e:
            print(f"[YouTubeScraper] Error getting short page: {e}")
            return None

    # ─────────────────────────────────────────────
    #  SHORTS TENDENCIA / TRENDING (sin query)
    # ─────────────────────────────────────────────

    def search_trending_shorts(self, max_results=30, country='US', language='en'):
        """
        Busca los Shorts más virales del momento en YouTube.
        No requiere query de búsqueda — navega directamente a
        la página de tendencias y extrae Shorts del shelf.
        
        Estrategias:
        1. YouTube Trending page → reel shelves (ytInitialData)
        2. YouTube Shorts página principal → DOM
        3. Búsqueda genérica 'viral shorts music' → fallback
        
        Args:
            max_results: Máximo de Shorts a extraer
            country: Código de país (default: 'US')
            language: Código de idioma (default: 'en')
            
        Returns:
            Lista de diccionarios con datos de cada Short
        """
        if not self.driver:
            self._init_driver()

        all_shorts = []
        seen_ids = set()

        # ── ESTRATEGIA 1: Trending page → reel shelves ──
        try:
            print('[YouTubeScraper] Estrategia 1: Trending page')
            trending_url = f'https://www.youtube.com/feed/trending?hl={language}&gl={country}'
            self.driver.get(trending_url)

            WebDriverWait(self.driver, self.timeout).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, 'ytd-video-renderer, ytd-section-list-renderer, #contents'))
            )
            time.sleep(2)

            # Intentar con ytInitialData
            initial_data = self._extract_yt_initial_data()
            if initial_data:
                try:
                    # Navegar por la estructura del trending
                    contents = (initial_data.get('contents', {})
                                .get('twoColumnBrowseResultsRenderer', {})
                                .get('tabs', [{}])[0]
                                .get('tabRenderer', {})
                                .get('content', {})
                                .get('sectionListRenderer', {})
                                .get('contents', []))

                    for section in contents:
                        if len(all_shorts) >= max_results:
                            break

                        # Buscar reelShelfRenderer (el shelf de Shorts en trending)
                        try:
                            # Puede estar en itemSection o directo
                            item_section = section.get('itemSectionRenderer', {}) or {}
                            sub_contents = item_section.get('contents', [])

                            # También buscar shelfRenderer con etiqueta "Shorts" o "Trending Shorts"
                            shelf = section.get('shelfRenderer', {}) or {}
                            if shelf:
                                title_runs = shelf.get('title', {}).get('runs', [])
                                shelf_title = ' '.join(r.get('text', '') for r in title_runs).lower()
                                if 'short' in shelf_title:
                                    shelf_contents = (shelf.get('content', {})
                                                      .get('horizontalListRenderer', {})
                                                      .get('items', []))
                                    for item in shelf_contents:
                                        if len(all_shorts) >= max_results:
                                            break
                                        short = self._parse_reel_item(item, 'Trending')
                                        if short and short['video_id'] not in seen_ids:
                                            seen_ids.add(short['video_id'])
                                            short['id'] = len(all_shorts) + 1
                                            short['isTrending'] = True
                                            short['trendingSource'] = 'trending-shelf'
                                            all_shorts.append(short)

                            # También buscar reelShelfRenderer en sub_contents
                            for sub in sub_contents:
                                if len(all_shorts) >= max_results:
                                    break
                                reel_shelf = sub.get('reelShelfRenderer', {}) or \
                                             sub.get('richShelfRenderer', {}) or \
                                             sub.get('shelfRenderer', {}).get('content', {}).get('horizontalListRenderer', {})
                                if reel_shelf:
                                    items = reel_shelf.get('items', [])
                                    for item in items:
                                        if len(all_shorts) >= max_results:
                                            break
                                        short = self._parse_reel_item(item, 'Trending')
                                        if short and short['video_id'] not in seen_ids:
                                            seen_ids.add(short['video_id'])
                                            short['id'] = len(all_shorts) + 1
                                            short['isTrending'] = True
                                            short['trendingSource'] = 'trending-reel'
                                            all_shorts.append(short)
                        except Exception:
                            continue
                except Exception:
                    pass

            print(f'[YouTubeScraper] Estrategia 1: {len(all_shorts)} Shorts de trending')
        except Exception as e:
            print(f'[YouTubeScraper] Error trending page: {e}')

        # ── ESTRATEGIA 2: Shorts trending via búsqueda genérica ──
        if len(all_shorts) < max_results:
            try:
                print('[YouTubeScraper] Estrategia 2: Búsqueda genérica trending shorts')
                # Buscar términos virales genéricos
                trending_queries = [
                    '#shorts viral',
                    'trending shorts music',
                    'viral shorts',
                ]
                for query in trending_queries:
                    if len(all_shorts) >= max_results:
                        break
                    remaining = max_results - len(all_shorts)
                    shorts = self.search_shorts(query, max_results=min(remaining, 15))
                    for s in shorts:
                        if s.get('video_id') and s['video_id'] not in seen_ids:
                            seen_ids.add(s['video_id'])
                            s['isTrending'] = True
                            s['trendingSource'] = 'generic-search'
                            if s['id'] == 0:
                                s['id'] = len(all_shorts) + 1
                            all_shorts.append(s)
            except Exception as e:
                print(f'[YouTubeScraper] Error generic search: {e}')

        print(f'[YouTubeScraper] Total trending Shorts: {len(all_shorts)}')

        # Reasignar IDs y ordenar por vistas
        for i, s in enumerate(all_shorts):
            s['id'] = i + 1
        all_shorts.sort(key=lambda x: x.get('views', 0), reverse=True)

        return all_shorts[:max_results]

    # ─────────────────────────────────────────────
    #  BÚSQUEDA DE NODOS REGULARES
    # ─────────────────────────────────────────────

    def search_song(self, query, max_results=50):
        """
        Busca una canción en YouTube y extrae nodos.
        """
        if not self.driver:
            self._init_driver()

        search_url = f"https://www.youtube.com/results?search_query={query.replace(' ', '+')}"
        nodes = []

        try:
            print(f"[YouTubeScraper] Buscando: {query}")
            self.driver.get(search_url)

            WebDriverWait(self.driver, self.timeout).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, 'ytd-video-renderer, ytd-item-section-renderer'))
            )

            last_height = self.driver.execute_script("return document.documentElement.scrollHeight")
            scroll_attempts = 0
            while len(nodes) < max_results and scroll_attempts < 5:
                self.driver.execute_script("window.scrollTo(0, document.documentElement.scrollHeight);")
                time.sleep(1.5)
                new_height = self.driver.execute_script("return document.documentElement.scrollHeight")
                if new_height == last_height:
                    break
                last_height = new_height
                scroll_attempts += 1

            soup = BeautifulSoup(self.driver.page_source, 'html.parser')
            video_elements = soup.select('ytd-video-renderer, ytd-item-section-renderer ytd-video-renderer')
            
            for i, el in enumerate(video_elements):
                if len(nodes) >= max_results:
                    break
                try:
                    title_el = el.select_one('#video-title, a#video-title')
                    title = title_el.get('title') or title_el.text.strip() if title_el else ''
                    url = f"https://www.youtube.com{title_el['href']}" if title_el and title_el.get('href') else ''
                    channel_el = el.select_one('ytd-channel-name a, #channel-name a, .ytd-channel-name a')
                    channel = channel_el.text.strip() if channel_el else 'Desconocido'

                    if not title or not url:
                        continue

                    views_text = ''
                    metadata_lines = el.select_one('#metadata-line, .metadata-snippet')
                    if metadata_lines:
                        spans = metadata_lines.select('span')
                        for span in spans:
                            txt = span.text.strip().lower()
                            if 'view' in txt:
                                views_text = span.text.strip()
                                break
                    views = parse_views(views_text)

                    age_text = ''
                    if metadata_lines:
                        spans = metadata_lines.select('span')
                        for span in spans:
                            txt = span.text.strip().lower()
                            if 'ago' in txt:
                                age_text = span.text.strip()
                                break
                    age_days = parse_relative_time(age_text)

                    duration_el = el.select_one('span.ytd-thumbnail-overlay-time-status-renderer, '
                                                '#overlays ytd-thumbnail-overlay-time-status-renderer')
                    duration = duration_el.text.strip() if duration_el else ''
                    vph = calculate_vph(views, age_days) if age_days > 0 else 0

                    nodes.append({
                        'id': i + 1,
                        'title': title,
                        'channel': channel,
                        'url': url,
                        'views': views,
                        'age_days': age_days,
                        'vph': vph,
                        'duration': duration,
                        'isPirate': is_pirate_channel(channel),
                        'isOfficial': is_official_channel(channel)
                    })
                except Exception as e:
                    print(f"[YouTubeScraper] Error extrayendo nodo {i}: {e}")
                    continue

            print(f"[YouTubeScraper] Extraídos {len(nodes)} nodos de {len(video_elements)} resultados")

        except TimeoutException:
            print("[YouTubeScraper] Timeout esperando resultados")
        except Exception as e:
            print(f"[YouTubeScraper] Error: {e}")
            import traceback
            traceback.print_exc()

        return nodes

    def get_song_info(self, nodes):
        total_views = sum(n['views'] for n in nodes)
        total_vph = sum(n['vph'] for n in nodes)
        pirates = [n for n in nodes if n['isPirate']]
        official = [n for n in nodes if n['isOfficial']]
        return {
            'totalNodes': len(nodes),
            'totalViews': total_views,
            'totalVPH': round(total_vph, 2),
            'pirateNodes': len(pirates),
            'pirateChannels': len(set(n['channel'] for n in pirates)),
            'officialNodes': len(official),
        }

    def get_shorts_info(self, shorts):
        """Calcula información consolidada de Shorts."""
        if not shorts:
            return {
                'totalShorts': 0, 'totalViews': 0, 'totalVPH': 0.0,
                'uniqueChannels': 0, 'topChannels': [], 'avgViewsPerShort': 0
            }
        total_views = sum(s['views'] for s in shorts)
        total_vph = sum(s['vph'] for s in shorts)
        
        by_channel = {}
        for s in shorts:
            ch = s.get('channel', 'Desconocido')
            if ch not in by_channel:
                by_channel[ch] = {
                    'channel': ch,
                    'count': 0,
                    'totalViews': 0,
                    'totalVPH': 0
                }
            by_channel[ch]['count'] += 1
            by_channel[ch]['totalViews'] += s.get('views', 0)
            by_channel[ch]['totalVPH'] += s.get('vph', 0)
        
        channels_sorted = sorted(by_channel.values(), key=lambda x: x['totalViews'], reverse=True)
        
        return {
            'totalShorts': len(shorts),
            'totalViews': total_views,
            'totalVPH': round(total_vph, 2),
            'uniqueChannels': len(by_channel),
            'topChannels': channels_sorted[:5],
            'avgViewsPerShort': total_views // len(shorts) if shorts else 0
        }

    def search_song_with_shorts(self, query, max_nodes=50, max_shorts=20):
        """
        Búsqueda completa: nodos regulares + Shorts en una sola llamada.
        
        Args:
            query: Término de búsqueda
            max_nodes: Máximo de nodos regulares
            max_shorts: Máximo de Shorts
            
        Returns:
            Dict con 'nodes' y 'shorts'
        """
        nodes = self.search_song(query, max_results=max_nodes)
        shorts = self.search_shorts(query, max_results=max_shorts)
        
        return {
            'nodes': nodes,
            'shorts': shorts
        }

    def close(self):
        """Cierra el WebDriver."""
        if self.driver:
            try:
                self.driver.quit()
            except:
                pass
            self.driver = None


# ── Uso directo ──
if __name__ == '__main__':
    scraper = YouTubeScraper(headless=True)
    try:
        import sys
        query = sys.argv[1] if len(sys.argv) > 1 else 'Ramón Orlando - Te Compro Tu Novia'
        
        # Shorts test
        shorts = scraper.search_shorts(query, max_results=15)
        info = scraper.get_shorts_info(shorts)
        print(json.dumps({'shorts': shorts, 'info': info}, indent=2, ensure_ascii=False))
        
        # Full test
        # result = scraper.search_song_with_shorts(query, max_nodes=20, max_shorts=10)
        # print(json.dumps(result, indent=2, ensure_ascii=False))
    finally:
        scraper.close()
