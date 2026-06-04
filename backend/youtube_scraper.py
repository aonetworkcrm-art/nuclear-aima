"""
Nuclear AIMA — YouTube Scraper
Motor de raspado de YouTube con Selenium + BeautifulSoup
Extrae nodos (videos) y Shorts de una canción/artista con métricas reales
"""

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


def is_pirate_channel(channel_name):
    """Detecta si un canal es pirata por nombre."""
    name = channel_name.lower()
    return any(kw in name for kw in PIRATE_KEYWORDS)


def is_official_channel(channel_name):
    """Detecta si un canal es oficial."""
    name = channel_name.lower()
    return any(kw in name for kw in OFFICIAL_KEYWORDS)


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

    def __init__(self, headless=True, timeout=15):
        self.timeout = timeout
        self.driver = None
        self.headless = headless

    def _init_driver(self):
        """Inicializa el WebDriver de Chrome."""
        options = Options()
        if self.headless:
            options.add_argument('--headless=new')
        options.add_argument('--no-sandbox')
        options.add_argument('--disable-dev-shm-usage')
        options.add_argument('--disable-gpu')
        options.add_argument('--window-size=1280,720')
        options.add_argument('--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) '
                             'AppleWebKit/537.36 (KHTML, like Gecko) '
                             'Chrome/120.0.0.0 Safari/537.36')
        options.add_experimental_option('excludeSwitches', ['enable-logging'])

        try:
            service = Service(ChromeDriverManager().install())
            self.driver = webdriver.Chrome(service=service, options=options)
            self.driver.set_page_load_timeout(self.timeout)
        except Exception as e:
            # Fallback: intentar con Chrome local
            try:
                self.driver = webdriver.Chrome(options=options)
            except Exception as e2:
                raise RuntimeError(f"No se pudo iniciar ChromeDriver: {e}\n{e2}")

    def search_song(self, query, max_results=50):
        """
        Busca una canción en YouTube y extrae nodos.
        
        Args:
            query: Término de búsqueda (ej. "Ramón Orlando - Te Compro Tu Novia")
            max_results: Máximo de resultados a extraer
            
        Returns:
            Lista de diccionarios con datos de cada nodo
        """
        if not self.driver:
            self._init_driver()

        search_url = f"https://www.youtube.com/results?search_query={query.replace(' ', '+')}"
        nodes = []

        try:
            print(f"[YouTubeScraper] Buscando: {query}")
            self.driver.get(search_url)

            # Esperar a que carguen los resultados
            WebDriverWait(self.driver, self.timeout).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, 'ytd-video-renderer, ytd-item-section-renderer'))
            )

            # Scroll para cargar más resultados
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

            # Extraer con BeautifulSoup
            soup = BeautifulSoup(self.driver.page_source, 'html.parser')

            # Buscar elementos de video
            video_elements = soup.select('ytd-video-renderer, ytd-item-section-renderer ytd-video-renderer')
            
            for i, el in enumerate(video_elements):
                if len(nodes) >= max_results:
                    break

                try:
                    # Título
                    title_el = el.select_one('#video-title, a#video-title')
                    title = title_el.get('title') or title_el.text.strip() if title_el else ''

                    # URL
                    url = f"https://www.youtube.com{title_el['href']}" if title_el and title_el.get('href') else ''

                    # Canal
                    channel_el = el.select_one('ytd-channel-name a, #channel-name a, .ytd-channel-name a')
                    channel = channel_el.text.strip() if channel_el else 'Desconocido'

                    if not title or not url:
                        continue

                    # Vistas
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

                    # Antigüedad
                    age_text = ''
                    if metadata_lines:
                        spans = metadata_lines.select('span')
                        for span in spans:
                            txt = span.text.strip().lower()
                            if 'ago' in txt:
                                age_text = span.text.strip()
                                break

                    age_days = parse_relative_time(age_text)

                    # Duración
                    duration_el = el.select_one('span.ytd-thumbnail-overlay-time-status-renderer, '
                                                '#overlays ytd-thumbnail-overlay-time-status-renderer')
                    duration = duration_el.text.strip() if duration_el else ''

                    # VPH
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
        """Calcula información consolidada de la canción."""
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

    def search_shorts(self, query, max_results=30):
        """
        Busca YouTube Shorts relacionados con una canción.
        
        Los Shorts aparecen en un shelf especial en los resultados de búsqueda
        o se pueden buscar directamente con '#shorts' + query.
        
        Args:
            query: Término de búsqueda (ej. "Te Compro Tu Novia")
            max_results: Máximo de Shorts a extraer
            
        Returns:
            Lista de diccionarios con datos de cada Short
        """
        if not self.driver:
            self._init_driver()

        # Estrategia 1: buscar con #shorts para obtener Shorts específicos
        search_query = f"{query} #shorts"
        search_url = f"https://www.youtube.com/results?search_query={search_query.replace(' ', '+')}"
        shorts = []
        seen_urls = set()

        try:
            print(f"[YouTubeScraper] Buscando Shorts: {search_query}")
            self.driver.get(search_url)

            # Esperar a que cargue la página
            WebDriverWait(self.driver, self.timeout).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, 'ytd-item-section-renderer, ytd-video-renderer, ytd-reel-item-renderer'))
            )

            # Scroll para cargar más
            last_height = self.driver.execute_script("return document.documentElement.scrollHeight")
            scroll_attempts = 0
            while len(shorts) < max_results and scroll_attempts < 5:
                self.driver.execute_script("window.scrollTo(0, document.documentElement.scrollHeight);")
                time.sleep(1.5)
                new_height = self.driver.execute_script("return document.documentElement.scrollHeight")
                if new_height == last_height:
                    break
                last_height = new_height
                scroll_attempts += 1

            soup = BeautifulSoup(self.driver.page_source, 'html.parser')

            # ── Estrategia A: Extraer Shorts del shelf de Shorts ──
            # Buscar el contenedor de reel (Short) items
            reel_items = soup.select('ytd-reel-item-renderer, ytd-video-renderer[is-shorts], [is-shorts]')
            
            for el in reel_items:
                if len(shorts) >= max_results:
                    break
                try:
                    short = self._extract_short_from_element(el, query)
                    if short and short['url'] not in seen_urls:
                        seen_urls.add(short['url'])
                        shorts.append(short)
                except Exception:
                    continue

            # ── Estrategia B: Buscar enlaces /shorts/ en toda la página ──
            if len(shorts) < max_results:
                short_links = soup.select('a[href*="/shorts/"]')
                for link in short_links:
                    if len(shorts) >= max_results:
                        break
                    try:
                        href = link.get('href', '')
                        full_url = f"https://www.youtube.com{href}" if href.startswith('/') else href
                        if full_url in seen_urls:
                            continue
                        
                        # Intentar extraer datos del contenedor padre
                        parent = link.parent
                        title = link.get('title') or link.text.strip() or query
                        
                        # Buscar vistas en elementos cercanos
                        views_text = ''
                        for candidate in parent.find_all(['span', 'div']):
                            txt = candidate.text.strip().lower()
                            if ('view' in txt or 'reprodu' in txt) and re.search(r'\d', txt):
                                views_text = candidate.text.strip()
                                break
                        
                        views = parse_views(views_text) if views_text else 0
                        
                        # Buscar canal
                        channel_el = parent.select_one('a[href*="/@"], yt-formatted-string.ytd-channel-name')
                        channel = channel_el.text.strip() if channel_el else 'Desconocido'
                        
                        # Buscar antigüedad
                        age_text = ''
                        for candidate in parent.find_all(['span']):
                            txt = candidate.text.strip().lower()
                            if 'ago' in txt:
                                age_text = candidate.text.strip()
                                break
                        age_days = parse_relative_time(age_text) if age_text else 0
                        vph = calculate_vph(views, age_days) if age_days > 0 else 0
                        
                        if views > 0 or title:
                            seen_urls.add(full_url)
                            shorts.append({
                                'id': len(shorts) + 1,
                                'title': title or query,
                                'channel': channel,
                                'url': full_url,
                                'views': views,
                                'age_days': age_days or 30,
                                'vph': vph,
                                'duration': '0:00-1:00',
                                'isPirate': is_pirate_channel(channel),
                                'isOfficial': False
                            })
                    except Exception:
                        continue

            print(f"[YouTubeScraper] Extraídos {len(shorts)} Shorts para '{query}'")

        except TimeoutException:
            print("[YouTubeScraper] Timeout buscando Shorts")
        except Exception as e:
            print(f"[YouTubeScraper] Error buscando Shorts: {e}")
            import traceback
            traceback.print_exc()

        return shorts

    def _extract_short_from_element(self, el, query):
        """Extrae datos de un elemento Short de YouTube."""
        # Título
        title_el = el.select_one('#video-title, a#video-title, yt-formatted-string[title]')
        title = title_el.get('title') or title_el.text.strip() if title_el else ''
        
        # URL
        link = el.select_one('a[href*="/shorts/"], a#video-title')
        if not link:
            link = el.select_one('a[href]')
        href = link.get('href', '') if link else ''
        if '/shorts/' not in href:
            return None
        full_url = f"https://www.youtube.com{href}" if href.startswith('/') else href
        
        # Canal
        channel_el = el.select_one('ytd-channel-name a, a[href*="/@"], yt-formatted-string.ytd-channel-name')
        channel = channel_el.text.strip() if channel_el else 'Desconocido'
        
        # Vistas
        views_text = ''
        metadata = el.select_one('#metadata-line, .metadata-snippet')
        if metadata:
            spans = metadata.select('span')
            for span in spans:
                txt = span.text.strip().lower()
                if 'view' in txt:
                    views_text = span.text.strip()
                    break
        views = parse_views(views_text) if views_text else 0
        
        # Antigüedad
        age_text = ''
        if metadata:
            spans = metadata.select('span')
            for span in spans:
                txt = span.text.strip().lower()
                if 'ago' in txt:
                    age_text = span.text.strip()
                    break
        age_days = parse_relative_time(age_text) if age_text else 0
        vph = calculate_vph(views, age_days) if age_days > 0 else 0
        
        return {
            'id': 0,
            'title': title or query,
            'channel': channel,
            'url': full_url,
            'views': views,
            'age_days': age_days or 30,
            'vph': vph,
            'duration': '0:00-1:00',  # Shorts < 60s
            'isPirate': is_pirate_channel(channel),
            'isOfficial': False
        }

    def get_shorts_info(self, shorts):
        """Calcula información consolidada de Shorts."""
        total_views = sum(s['views'] for s in shorts)
        total_vph = sum(s['vph'] for s in shorts)
        
        # Agrupar por canal
        by_channel = {}
        for s in shorts:
            ch = s['channel']
            if ch not in by_channel:
                by_channel[ch] = {
                    'channel': ch,
                    'count': 0,
                    'totalViews': 0,
                    'totalVPH': 0
                }
            by_channel[ch]['count'] += 1
            by_channel[ch]['totalViews'] += s['views']
            by_channel[ch]['totalVPH'] += s['vph']
        
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
