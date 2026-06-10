"""
Nuclear AIMA — Node Auditor Backend API
Flask REST API para raspado de YouTube con Selenium
Incluye detección de Nodos, Piratas y Shorts
"""

import os
import json
import logging
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from youtube_scraper import YouTubeScraper
from duckduckgo_search import DDGS
import requests
from bs4 import BeautifulSoup
import re
import time
import random
from urllib.parse import parse_qs, urlparse
from collections import Counter

# ── Configuración ──
app = Flask(__name__)
CORS(app)  # Permitir conexiones desde el frontend

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger('nucleus-api')

# ── Frontend (archivos estáticos) para desarrollo local ──
# En produccion, Netlify sirve el frontend y proxy /api/* a Render.
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

@app.route('/')
def serve_index():
    return send_from_directory(PROJECT_ROOT, 'index.html')

@app.route('/js/<path:filename>')
def serve_js(filename):
    return send_from_directory(os.path.join(PROJECT_ROOT, 'js'), filename)

@app.route('/css/<path:filename>')
def serve_css(filename):
    return send_from_directory(os.path.join(PROJECT_ROOT, 'css'), filename)

# ── Endpoints ──

@app.route('/api/health', methods=['GET'])
def health():
    """Health check para verificar que el servidor está vivo."""
    return jsonify({
        'status': 'ok',
        'service': 'Nuclear AIMA - Node Auditor Backend',
        'version': '1.2.0'
    })


@app.route('/api/audit', methods=['POST'])
def audit_node():
    """
    Auditoría de una canción/artista en YouTube (incluye Shorts).
    
    Request body:
        query (str): Nombre de la canción o artista
        max_nodes (int, opcional): Máximo de nodos a extraer (default: 50)
        include_shorts (bool, opcional): Incluir Shorts (default: true)
        max_shorts (int, opcional): Máximo de Shorts (default: 20)
        cpm (float, opcional): CPM estimado en USD (default: 1.50)
        headless (bool, opcional): Modo headless (default: true)
    
    Response:
        status: 'success' | 'error'
        nodes: Lista de nodos extraídos
        shorts: Lista de Shorts extraídos
        shorts_info: Métricas consolidadas de Shorts
        song_info: Métricas consolidadas de nodos
        message: Mensaje informativo
    """
    data = request.get_json()
    if not data or 'query' not in data:
        return jsonify({
            'status': 'error',
            'message': 'Se requiere el campo "query" con el nombre de la canción/artista.'
        }), 400

    query = data['query'].strip()
    max_nodes = min(int(data.get('max_nodes', 50)), 100)
    include_shorts = data.get('include_shorts', True)
    max_shorts = min(int(data.get('max_shorts', 20)), 50)
    cpm = float(data.get('cpm', 1.50))
    headless = data.get('headless', True)

    if not query:
        return jsonify({'status': 'error', 'message': 'El campo "query" no puede estar vacío.'}), 400

    logger.info(f"Auditando: '{query}' | max_nodes={max_nodes} | shorts={include_shorts} | cpm={cpm}")

    scraper = YouTubeScraper(headless=headless, timeout=20)
    try:
        audio_shorts = []
        if include_shorts:
            result = scraper.search_song_with_shorts(query, max_nodes=max_nodes, max_shorts=max_shorts)
            nodes = result['nodes']
            shorts = result['shorts']
            audio_shorts = result.get('audio_shorts', [])
        else:
            nodes = scraper.search_song(query, max_results=max_nodes)
            shorts = []

        song_info = scraper.get_song_info(nodes)
        shorts_info = scraper.get_shorts_info(shorts) if shorts else {
            'totalShorts': 0, 'totalViews': 0, 'totalVPH': 0.0,
            'uniqueChannels': 0, 'topChannels': [], 'avgViewsPerShort': 0
        }
        audio_shorts_info = scraper.get_shorts_info(audio_shorts) if audio_shorts else {
            'totalShorts': 0, 'totalViews': 0, 'totalVPH': 0.0,
            'uniqueChannels': 0, 'topChannels': [], 'avgViewsPerShort': 0
        }

        # Enriquecer nodos
        for n in nodes:
            n['est_usd_per_hour'] = round((n['vph'] * cpm) / 1000, 6)
            n['type'] = 'pirate' if n['isPirate'] else ('official' if n['isOfficial'] else 'cover')
            n['typeLabel'] = '🏴‍☠️ Pirata' if n['isPirate'] else ('Oficial' if n['isOfficial'] else 'Cover')

        # Enriquecer Shorts regulares
        for s in shorts:
            s['est_usd_per_hour'] = round((s['vph'] * cpm * 0.5) / 1000, 6)
            s['type'] = 'short'
            s['typeLabel'] = '📱 Short'

        # Enriquecer Shorts de audio
        for s in audio_shorts:
            s['est_usd_per_hour'] = round((s['vph'] * cpm * 0.5) / 1000, 6)
            s['type'] = 'audio-short'
            s['typeLabel'] = '🎵 Audio Short'

        return jsonify({
            'status': 'success',
            'query': query,
            'cpm': cpm,
            'nodes': nodes,
            'shorts': shorts,
            'audio_shorts': audio_shorts,
            'song_info': song_info,
            'shorts_info': shorts_info,
            'audio_shorts_info': audio_shorts_info,
            'total': len(nodes),
            'total_shorts': len(shorts),
            'total_audio_shorts': len(audio_shorts),
            'message': f'Extraídos {len(nodes)} nodos, {len(shorts)} Shorts y {len(audio_shorts)} Shorts de audio para "{query}"'
        })
    except Exception as e:
        logger.error(f"Error en auditoría: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'status': 'error', 'message': f'Error: {str(e)}'}), 500
    finally:
        scraper.close()


@app.route('/api/audit/shorts', methods=['POST'])
def audit_shorts():
    """
    Auditoría específica de YouTube Shorts para una canción.
    
    Request body:
        query (str): Nombre de la canción
        max_shorts (int, opcional): Máximo de Shorts (default: 30)
        cpm (float, opcional): CPM estimado (default: 1.50)
        sort_by (str, opcional): 'views' | 'vph' | 'date' (default: 'views')
        min_views (int, opcional): Filtro mínimo de vistas (default: 0)
    """
    data = request.get_json()
    if not data or 'query' not in data:
        return jsonify({'status': 'error', 'message': 'Se requiere el campo "query".'}), 400

    query = data['query'].strip()
    max_shorts = min(int(data.get('max_shorts', 30)), 50)
    cpm = float(data.get('cpm', 1.50))
    sort_by = data.get('sort_by', 'views')
    min_views = int(data.get('min_views', 0))

    if not query:
        return jsonify({'status': 'error', 'message': 'Query vacío'}), 400

    logger.info(f"Auditando Shorts: '{query}' | max={max_shorts} | sort={sort_by} | min_views={min_views}")

    scraper = YouTubeScraper(headless=True, timeout=20)
    try:
        shorts = scraper.search_shorts(query, max_results=max_shorts)
        
        # Filtrar por vistas mínimas
        if min_views > 0:
            shorts = [s for s in shorts if s.get('views', 0) >= min_views]
        
        # Ordenar
        if sort_by == 'views':
            shorts.sort(key=lambda s: s.get('views', 0), reverse=True)
        elif sort_by == 'vph':
            shorts.sort(key=lambda s: s.get('vph', 0), reverse=True)
        elif sort_by == 'date':
            shorts.sort(key=lambda s: s.get('age_days', 999))
        
        # Reasignar IDs
        for i, s in enumerate(shorts):
            s['id'] = i + 1
        
        info = scraper.get_shorts_info(shorts)

        for s in shorts:
            s['est_usd_per_hour'] = round((s['vph'] * cpm * 0.5) / 1000, 6)
            s['type'] = 'short'
            s['typeLabel'] = '📱 Short'

        return jsonify({
            'status': 'success',
            'query': query,
            'shorts': shorts,
            'shorts_info': info,
            'total': len(shorts),
            'filters': {'sort_by': sort_by, 'min_views': min_views},
            'message': f'Extraídos {len(shorts)} Shorts para "{query}"'
        })
    except Exception as e:
        logger.error(f"Error en auditoría de Shorts: {e}")
        return jsonify({'status': 'error', 'message': str(e)}), 500
    finally:
        scraper.close()


@app.route('/api/audit/batch', methods=['POST'])
def audit_batch():
    """
    Auditoría por lote: múltiples canciones de un artista (incluye Shorts).
    """
    data = request.get_json()
    if not data or 'songs' not in data:
        return jsonify({'status': 'error', 'message': 'Se requiere lista de canciones'}), 400

    songs = data['songs'][:20]
    max_per = min(int(data.get('max_nodes_per_song', 20)), 50)
    include_shorts = data.get('include_shorts', True)
    cpm = float(data.get('cpm', 1.50))

    all_nodes = []
    all_shorts = []
    node_id = 1
    errors = []

    scraper = YouTubeScraper(headless=True, timeout=20)
    try:
        for song in songs:
            try:
                logger.info(f"Auditando: '{song['name']}'")
                if include_shorts:
                    result = scraper.search_song_with_shorts(song['name'], max_nodes=max_per, max_shorts=10)
                    nodes = result['nodes']
                    shorts = result['shorts']
                else:
                    nodes = scraper.search_song(song['name'], max_results=max_per)
                    shorts = []

                for n in nodes:
                    n['id'] = node_id
                    n['songName'] = song['name']
                    n['est_usd_per_hour'] = round((n['vph'] * cpm) / 1000, 6)
                    n['type'] = 'pirate' if n['isPirate'] else ('official' if n['isOfficial'] else 'cover')
                    n['typeLabel'] = '🏴‍☠️ Pirata' if n['isPirate'] else ('Oficial' if n['isOfficial'] else 'Cover')
                    node_id += 1
                    all_nodes.append(n)

                for s in shorts:
                    s['songName'] = song['name']
                    s['est_usd_per_hour'] = round((s['vph'] * cpm * 0.5) / 1000, 6)
                    all_shorts.append(s)

            except Exception as e:
                errors.append({'song': song['name'], 'error': str(e)})
                continue
    finally:
        scraper.close()

    return jsonify({
        'status': 'success',
        'total_nodes': len(all_nodes),
        'total_shorts': len(all_shorts),
        'nodes': all_nodes,
        'shorts': all_shorts,
        'errors': errors,
        'message': f'Extraídos {len(all_nodes)} nodos y {len(all_shorts)} Shorts de {len(songs)} canciones'
    })


@app.route('/api/shorts/batch', methods=['POST'])
def shorts_batch():
    """
    Shorts consolidados de múltiples canciones (batch).
    
    Request body:
        songs (list): Lista de nombres de canciones [{name: str}, ...]
        max_per_song (int, opcional): Máximo de Shorts por canción (default: 10)
        cpm (float, opcional): CPM estimado (default: 1.50)
        sort_by (str, opcional): 'views' | 'vph' | 'date' (default: 'views')
        max_total (int, opcional): Máximo total de Shorts a retornar (default: 100)
    """
    data = request.get_json()
    if not data or 'songs' not in data:
        return jsonify({'status': 'error', 'message': 'Se requiere lista de canciones'}), 400

    songs = data['songs'][:20]
    max_per_song = min(int(data.get('max_per_song', 10)), 30)
    cpm = float(data.get('cpm', 1.50))
    sort_by = data.get('sort_by', 'views')
    max_total = min(int(data.get('max_total', 100)), 200)

    all_shorts = []
    errors = []
    seen_ids = set()

    scraper = YouTubeScraper(headless=True, timeout=20)
    try:
        for song in songs:
            try:
                logger.info(f"Buscando Shorts para: '{song['name']}'")
                shorts = scraper.search_shorts(song['name'], max_results=max_per_song)
                for s in shorts:
                    vid = s.get('video_id', '')
                    if vid and vid not in seen_ids:
                        seen_ids.add(vid)
                        s['songName'] = song['name']
                        s['est_usd_per_hour'] = round((s['vph'] * cpm * 0.5) / 1000, 6)
                        s['type'] = 'short'
                        s['typeLabel'] = '📱 Short'
                        all_shorts.append(s)
            except Exception as e:
                errors.append({'song': song['name'], 'error': str(e)})
                continue
    finally:
        scraper.close()

    # Ordenar y limitar
    if sort_by == 'views':
        all_shorts.sort(key=lambda s: s.get('views', 0), reverse=True)
    elif sort_by == 'vph':
        all_shorts.sort(key=lambda s: s.get('vph', 0), reverse=True)
    elif sort_by == 'date':
        all_shorts.sort(key=lambda s: s.get('age_days', 999))

    all_shorts = all_shorts[:max_total]
    for i, s in enumerate(all_shorts):
        s['id'] = i + 1

    # Consolidar por canal
    by_channel = {}
    for s in all_shorts:
        ch = s.get('channel', 'Desconocido')
        if ch not in by_channel:
            by_channel[ch] = {
                'channel': ch, 'count': 0, 'totalViews': 0,
                'totalVPH': 0, 'totalUSD': 0, 'songs': []
            }
        by_channel[ch]['count'] += 1
        by_channel[ch]['totalViews'] += s.get('views', 0)
        by_channel[ch]['totalVPH'] += s.get('vph', 0)
        by_channel[ch]['totalUSD'] += s.get('est_usd_per_hour', 0)
        if s.get('songName') and s['songName'] not in by_channel[ch]['songs']:
            by_channel[ch]['songs'].append(s['songName'])

    channels_sorted = sorted(by_channel.values(), key=lambda x: x['totalViews'], reverse=True)

    shorts_info = {
        'totalShorts': len(all_shorts),
        'totalViews': sum(s.get('views', 0) for s in all_shorts),
        'totalVPH': round(sum(s.get('vph', 0) for s in all_shorts), 2),
        'totalUSD': round(sum(s.get('est_usd_per_hour', 0) for s in all_shorts), 6),
        'uniqueChannels': len(by_channel),
        'topChannels': channels_sorted[:10],
        'uniqueSongs': len(set(s.get('songName', '') for s in all_shorts if s.get('songName'))),            'avgViewsPerShort': sum(s.get('views', 0) for s in all_shorts) // len(all_shorts) if all_shorts else 0
    }

    return jsonify({
        'status': 'success',
        'total_songs': len(songs),
        'total_shorts': len(all_shorts),
        'shorts': all_shorts,
        'shorts_info': shorts_info,
        'errors': errors,
        'message': f'Extraídos {len(all_shorts)} Shorts de {len(songs)} canciones'
    })


@app.route('/api/shorts/trending', methods=['GET'])
def shorts_trending():
    """
    Shorts más virales del momento en YouTube (sin query).
    Extrae Shorts de la página de tendencias + búsquedas genéricas.
    
    Query params:
        max_results (int, opcional): Máximo de Shorts (default: 30, max: 60)
        country (str, opcional): Código de país (default: 'US')
        cpm (float, opcional): CPM estimado (default: 1.50)
        min_views (int, opcional): Filtro mínimo de vistas (default: 0)
    
    Response:
        status: 'success' | 'error'
        shorts: Lista de Shorts trending
        shorts_info: Métricas consolidadas
        trending_source: Origen de los datos ('trending-shelf' | 'generic-search')
        total: Número de Shorts
        message: Mensaje informativo
    """
    max_results = min(int(request.args.get('max_results', 30)), 60)
    country = request.args.get('country', 'US')
    cpm = float(request.args.get('cpm', 1.50))
    min_views = int(request.args.get('min_views', 0))

    logger.info(f"Fetching trending Shorts: max={max_results} | country={country} | min_views={min_views}")

    # ── Cache de 60s para evitar abrir Chrome en cada carga de pagina ──
    TRENDING_CACHE_KEY = f'trending|{max_results}|{country}|{min_views}'
    cached_trending = get_from_cache(TRENDING_CACHE_KEY)
    if cached_trending is not None:
        logger.info("Trending shorts cache HIT")
        return jsonify(cached_trending)

    scraper = YouTubeScraper(headless=True, timeout=25)
    try:
        shorts = scraper.search_trending_shorts(max_results=max_results, country=country)

        # Filtrar por vistas mínimas
        if min_views > 0:
            shorts = [s for s in shorts if s.get('views', 0) >= min_views]

        # Reasignar IDs
        for i, s in enumerate(shorts):
            s['id'] = i + 1

        # Enriquecer con estimaciones USD
        for s in shorts:
            s['est_usd_per_hour'] = round((s.get('vph', 0) * cpm * 0.5) / 1000, 6)
            s['type'] = 'short'
            s['typeLabel'] = '📱 Short'

        # Métricas consolidadas
        info = scraper.get_shorts_info(shorts)

        # Origen predominante
        sources = set(s.get('trendingSource', 'unknown') for s in shorts)
        primary_source = 'trending-shelf' if 'trending-shelf' in sources else 'generic-search'

        response_data = {
            'status': 'success',
            'shorts': shorts,
            'shorts_info': info,
            'trending_source': primary_source,
            'country': country,
            'total': len(shorts),
            'message': f'Extraídos {len(shorts)} Shorts virales del momento'
        }
        # Cachear por 60s (TTL mas corto para contenido trending)
        set_in_cache(TRENDING_CACHE_KEY, response_data)
        return jsonify(response_data)
    except Exception as e:
        logger.error(f"Error fetching trending Shorts: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'status': 'error', 'message': str(e)}), 500
    finally:
        scraper.close()


@app.route('/api/shorts/trending/music', methods=['GET'])
def shorts_trending_music():
    """
    Shorts musicales virales del momento (con filtro de música).
    Versión especializada que busca trending shorts con contenido musical.
    
    Query params:
        max_results (int, opcional): Máximo de Shorts (default: 30, max: 60)
        genre (str, opcional): Género musical (default: 'latin', ej: 'pop', 'reggaeton', 'salsa')
        cpm (float, opcional): CPM estimado (default: 1.50)
    """
    max_results = min(int(request.args.get('max_results', 30)), 60)
    genre = request.args.get('genre', 'latin')
    cpm = float(request.args.get('cpm', 1.50))

    logger.info(f"Fetching trending music Shorts: max={max_results} | genre={genre}")

    scraper = YouTubeScraper(headless=True, timeout=25)
    try:
        # Buscar trending shorts con término musical
        trending_queries = [
            f'{genre} music #shorts',
            f'#shorts trending {genre}',
            f'viral {genre} shorts',
        ]

        all_shorts = []
        seen_ids = set()

        for query in trending_queries:
            if len(all_shorts) >= max_results:
                break
            remaining = max_results - len(all_shorts)
            try:
                shorts = scraper.search_shorts(query, max_results=min(remaining, 15))
                for s in shorts:
                    vid = s.get('video_id', '')
                    if vid and vid not in seen_ids:
                        seen_ids.add(vid)
                        s['genre'] = genre
                        s['trendingSource'] = 'music-search'
                        all_shorts.append(s)
            except Exception:
                continue

        # Ordenar por vistas
        all_shorts.sort(key=lambda s: s.get('views', 0), reverse=True)
        all_shorts = all_shorts[:max_results]

        # Enriquecer
        for i, s in enumerate(all_shorts):
            s['id'] = i + 1
            s['est_usd_per_hour'] = round((s.get('vph', 0) * cpm * 0.5) / 1000, 6)
            s['type'] = 'short'
            s['typeLabel'] = '📱 Short'

        info = scraper.get_shorts_info(all_shorts)

        return jsonify({
            'status': 'success',
            'shorts': all_shorts,
            'shorts_info': info,
            'genre': genre,
            'queries_used': len(trending_queries),
            'total': len(all_shorts),
            'message': f'Extraídos {len(all_shorts)} Shorts musicales ({genre}) del momento'
        })
    except Exception as e:
        logger.error(f"Error fetching trending music Shorts: {e}")
        return jsonify({'status': 'error', 'message': str(e)}), 500
    finally:
        scraper.close()


# ─────────────────────────────────────────────
#  LIVE WEB SEARCH — Multi-motor: DDGS + scraping HTML + demo
# ─────────────────────────────────────────────

# ── Caché simple en memoria ──
SEARCH_CACHE = {}
CACHE_TTL = 300  # 5 minutos

def get_cache_key(query, max_results, search_type):
    return f'{query}|{max_results}|{search_type}'

def get_from_cache(key):
    entry = SEARCH_CACHE.get(key)
    if entry and (time.time() - entry['ts']) < CACHE_TTL:
        logger.info(f"Cache HIT for: {key[:50]}...")
        return entry['data']
    return None

def set_in_cache(key, data):
    SEARCH_CACHE[key] = {'ts': time.time(), 'data': data}
    # Limpiar cache viejo si crece demasiado
    if len(SEARCH_CACHE) > 100:
        now = time.time()
        stale = [k for k, v in SEARCH_CACHE.items() if (now - v['ts']) > CACHE_TTL]
        for k in stale:
            del SEARCH_CACHE[k]
        logger.info(f"Cache cleaned: {len(stale)} entries removed")


USER_AGENTS = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:126.0) Gecko/20100101 Firefox/126.0',
]

REQUIRED_HEADERS = {
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
    'Accept-Encoding': 'gzip, deflate, br',
    'DNT': '1',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'none',
    'Sec-Fetch-User': '?1',
    'Cache-Control': 'max-age=0',
}

def make_search_session():
    """Crea una sesión fresca de requests con headers de navegador real."""
    session = requests.Session()
    ua = random.choice(USER_AGENTS)
    session.headers.update({'User-Agent': ua})
    session.headers.update(REQUIRED_HEADERS)
    # Cookie inicial para evitar páginas de consentimiento
    session.cookies.set('CONSENT', 'YES+cb.20240314-17-p0.es+FX+917', domain='.google.com')
    return session


# ── Enriquecimiento forense de resultados ──

def extract_keywords(text):
    """Extrae keywords relevantes de un texto."""
    if not text:
        return []
    stopwords = set([
        'el', 'la', 'los', 'las', 'de', 'del', 'en', 'un', 'una', 'y', 'e',
        'o', 'a', 'al', 'con', 'por', 'para', 'que', 'es', 'se', 'no',
        'su', 'lo', 'como', 'más', 'pero', 'sus', 'le', 'ya', 'este',
        'entre', 'porque', 'cuando', 'todo', 'también', 'fue', 'has',
        'the', 'a', 'an', 'and', 'or', 'in', 'on', 'at', 'to', 'for',
        'of', 'with', 'is', 'it', 'this', 'that', 'are', 'was', 'were',
        'para', 'con', 'por', 'como', 'pero', 'más', 'esta', 'cómo',
    ])
    words = re.findall(r'[a-záéíóúñ0-9]+', text.lower())
    words = [w for w in words if len(w) >= 4 and not w.isdigit() and w not in stopwords]
    freq = Counter(words)
    return [k for k, _ in freq.most_common(8)]


def generate_content_angles(title, snippet, query):
    """Genera ángulos de contenido sugeridos basados en el resultado."""
    angles = []
    keywords = extract_keywords(title + ' ' + snippet)[:4]
    word_count = len((title + ' ' + snippet).split())
    
    if keywords:
        kw = keywords[0]
        if word_count > 30:
            angles.append(f'📝 Artículo completo: "{kw}: Guía Completa" — desarrolla los puntos clave')
        else:
            angles.append(f'📝 Post corto: "Todo sobre {kw}" — expande este tema con más detalle')
    
    if len(keywords) >= 2:
        angles.append(f'⚖️ Comparativa: "{keywords[0]} vs {keywords[1]}" — análisis de pros y contras')
    
    if keywords:
        angles.append(f'🎯 Post SEO: "{keywords[0]} para principiantes" — guía paso a paso con imágenes')
    
    angles.append(f'🎬 Video/TikTok: Explica "{query}" en menos de 60 segundos con tips visuales')
    
    if snippet and len(snippet) > 100:
        angles.append(f'📋 Listicle: "10 datos clave sobre {query}" — extraidos del análisis')
    
    return angles[:5]  # Máximo 5 ángulos


def enrich_result(r, query):
    """Enriquece un resultado con datos forenses y contenido sugerido."""
    full_text = f"{r.get('title', '')} {r.get('snippet', '')}"
    keywords = extract_keywords(full_text)
    angles = generate_content_angles(r.get('title', ''), r.get('snippet', ''), query)
    
    r['keywords'] = keywords
    r['contentAngles'] = angles
    r['wordCount'] = len(full_text.split())
    r['hasSnippet'] = bool(r.get('snippet'))
    return r


# ── Motor 1: DuckDuckGo (fallback rapido, sin retry) ──

def search_via_duckduckgo(query, max_results=15, search_type='text'):
    """Busca usando DuckDuckGo DDGS. Sin retry porque curl_cffi es el motor principal."""
    time.sleep(random.uniform(0.5, 1.5))
    
    results = []
    with DDGS(timeout=10) as ddgs:
        if search_type == 'news':
            raw = list(ddgs.news(keywords=query, max_results=max_results, region='wt-wt'))
        else:
            raw = list(ddgs.text(keywords=query, max_results=max_results, region='wt-wt'))
        
        for item in raw:
            r = {
                'title': item.get('title', ''),
                'url': item.get('href', item.get('link', '')),
                'snippet': item.get('body', item.get('snippet', '')),
                'source': item.get('source', ''),
            }
            if search_type == 'news':
                r['date'] = item.get('date', '')
                r['source'] = item.get('source', item.get('publisher', ''))
            results.append(enrich_result(r, query))
    
    return results


# ── Motor 2: curl_cffi DuckDuckGo (chrome TLS fingerprint, evade rate limits) ──

def search_via_curl_cffi(query, max_results=15):
    """Busca usando curl_cffi para scraping de DuckDuckGo HTML.
    curl_cffi imita el fingerprint TLS de Chrome, lo que permite
    evadir rate limits que bloquean a requests/DDGS."""
    try:
        from curl_cffi import requests as curl_requests
        
        # Delay minimo (curl_cffi con TLS de Chrome no requiere delays largos)
        time.sleep(random.uniform(0.5, 1.5))
        
        resp = curl_requests.get(
            'https://html.duckduckgo.com/html/',
            params={'q': query},
            impersonate='chrome124',
            timeout=15
        )
        
        if resp.status_code != 200:
            logger.warning(f"curl_cffi DuckDuckGo returned {resp.status_code}")
            return []
        
        soup = BeautifulSoup(resp.text, 'html.parser')
        results = []
        
        # DuckDuckGo HTML backend: resultados en etiquetas <a> con clase result__a
        # o en elementos con clase result-title
        for a in soup.select('a.result__a, a.result-title, .result__title a'):
            if len(results) >= max_results:
                break
            href = a.get('href', '')
            title = a.get_text(strip=True)
            if not title or not href:
                continue
            
            # Extraer snippet del elemento hermano/padre
            snippet = ''
            parent = a.parent
            if parent:
                snippet_el = parent.select_one('.result__snippet, .result-snippet, .snippet')
                if snippet_el:
                    snippet = snippet_el.get_text(strip=True)
            
            # Si no se encontró snippet, buscar en toda la fila
            if not snippet:
                row = a.find_parent(class_=lambda c: c and 'result' in c)
                if row:
                    snippet_el = row.select_one('.result__snippet, .result-snippet, .snippet')
                    if snippet_el:
                        snippet = snippet_el.get_text(strip=True)
            
            # DuckDuckGo envuelve URLs en /l/?uddg=URL_ENCODED
            parsed_href = urlparse(href)
            if parsed_href.path.startswith('/l/'):
                qs = parse_qs(parsed_href.query)
                actual_url = qs.get('uddg', [href])[0]
                href = actual_url
            elif href.startswith('//'):
                href = 'https:' + href
            
            domain = ''
            try:
                domain = urlparse(href).netloc.replace('www.', '')
            except Exception:
                pass
            
            r = {
                'title': title,
                'url': href,
                'snippet': snippet[:400],
                'source': domain or '',
            }
            results.append(enrich_result(r, query))
        
        return results
    except ImportError:
        logger.warning("curl_cffi not installed, skipping engine")
        return []
    except Exception as e:
        logger.warning(f"curl_cffi search failed: {e}")
        return []


# ── Motor 3: Google scraping (con retry + selectores robustos) ──

GOOGLE_SELECTORS = [
    # Formatos modernos
    'div.g',
    'div[role="main"] div.g',
    'div#search div.g',
    'div#rso div.g',
    'div.sr-gp',
    # Formatos antiguos
    'div.rc',
    'div.result',
    'div.srg div.g',
    # Formatos alternativos
    'div[data-hveid]',
    'div[data-sokoban-container]',
]

def extract_google_url(href):
    """Extrae URL real de una URL envuelta de Google."""
    if not href:
        return ''
    # /url?q=https://real.url&...
    if '/url?q=' in href:
        try:
            parsed = urlparse(href)
            qs = parse_qs(parsed.query)
            return qs.get('q', [href])[0]
        except Exception:
            pass
    # /search?q=... o /interstitial?...
    if href.startswith('/') and not href.startswith('//'):
        return ''
    return href

def parse_google_result(container):
    """Parsea un contenedor de resultado de Google con multi-selectores."""
    try:
        # Link principal
        link = container.select_one('a[href]')
        if not link:
            return None
        href = extract_google_url(link.get('href', ''))
        if not href:
            return None
        
        # Título (h3 es el estándar de Google)
        title_el = (
            container.select_one('h3') or
            container.select_one('[role="heading"]') or
            container.select_one('.DKV0Md') or
            container.select_one('.LC20lb')
        )
        title = title_el.get_text(strip=True) if title_el else ''
        if not title:
            return None
        
        # Snippet (múltiples formatos de Google)
        snippet_el = container.select_one(
            'div.VwiC3b, span.aCOpRe, div[data-sncf], '
            'div.yXK7x, div.lEBKkf, span.st, '
            '.lEBKkf, .st, .IsZvec, .aXB7I'
        )
        snippet = snippet_el.get_text(strip=True) if snippet_el else ''
        
        domain = urlparse(href).netloc.replace('www.', '')
        return {'title': title, 'url': href, 'snippet': snippet[:400], 'source': domain or ''}
    except Exception:
        pass
    return None


def search_via_google(query, max_results=15):
    """Busca en Google mediante scraping HTML con retry."""
    max_attempts = 2
    last_error = None
    
    for attempt in range(1, max_attempts + 1):
        try:
            if attempt > 1:
                time.sleep(random.uniform(3.0, 5.0))
            
            session = make_search_session()
            # Añadir un referer para parecer más real
            session.headers.update({
                'Referer': 'https://www.google.com/',
            })
            
            # Delay antes de la petición
            time.sleep(random.uniform(1.5, 3.5))
            
            url = 'https://www.google.com/search'
            params = {
                'q': query,
                'hl': 'es',
                'num': min(max_results + 2, 20),
                'source': 'hp',
                'ei': 'abcdef',
            }
            
            resp = session.get(url, params=params, timeout=20)
            resp.raise_for_status()
            
            html = resp.text
            
            # Detectar CAPTCHA o bloqueo
            if 'captcha' in html.lower() or 'unusual traffic' in html.lower():
                logger.warning(f"Google CAPTCHA detected (attempt {attempt})")
                if attempt < max_attempts:
                    continue
                raise Exception('Google CAPTCHA: tráfico inusual detectado')
            
            soup = BeautifulSoup(html, 'html.parser')
            results = []
            
            # Probar múltiples selectores
            for selector in GOOGLE_SELECTORS:
                if len(results) >= max_results:
                    break
                containers = soup.select(selector)
                if not containers:
                    continue
                logger.info(f"Google selector '{selector}' found {len(containers)} containers")
                for container in containers:
                    if len(results) >= max_results:
                        break
                    r = parse_google_result(container)
                    if r:
                        results.append(r)
            
            if results:
                # Enriquecer cada resultado
                for r in results:
                    enrich_result(r, query)
                logger.info(f"Google OK: {len(results)} results via {attempt} attempts")
                return results
            
            logger.warning(f"Google attempt {attempt}: no results parsed, HTML may have changed")
            
        except requests.exceptions.HTTPError as e:
            last_error = e
            logger.warning(f"Google HTTP error (attempt {attempt}): {e}")
            if attempt < max_attempts:
                time.sleep(4.0)
        except Exception as e:
            last_error = e
            logger.warning(f"Google error (attempt {attempt}): {e}")
            if attempt < max_attempts:
                time.sleep(3.0)
    
    if last_error:
        raise last_error
    return []


# ── Motor 4: YouTube Search (opcional, se suma a los resultados web) ──

def search_via_youtube(query, max_results=8):
    """Busca en YouTube usando YouTubeScraper + Selenium.
    Es un motor lento (~15s con Chrome), solo se activa si el usuario
    solicita resultados de YouTube explicitamente."""
    try:
        scraper = YouTubeScraper(headless=True, timeout=15)
        try:
            nodes = scraper.search_song(query, max_results=max_results)
            results = []
            for n in nodes:
                r = {
                    'title': n.get('title', ''),
                    'url': n.get('url', f"https://youtube.com/watch?v={n.get('video_id', '')}"),
                    'snippet': n.get('description', '')[:300],
                    'source': 'youtube',
                    'sourceName': 'YouTube',
                    'sourceIcon': '▶️',
                    'channel': n.get('channel', ''),
                    'views': n.get('views', 0),
                    'vph': n.get('vph', 0),
                    'type': 'video'
                }
                results.append(enrich_result(r, query))
            return results
        finally:
            scraper.close()
    except Exception as e:
        logger.warning(f"YouTube search failed: {e}")
        return []


# ── Endpoint principal ──

@app.route('/api/web-search', methods=['GET'])
def web_search():
    """
    Búsqueda web en vivo con multi-motor + enriquecimiento forense.
    
    Estrategia:
    1. DuckDuckGo (DDGS) — rápido, sin API key
    2. Google scraping (requests + BS4) — headers reales de navegador
    3. Error si ambos fallan — nada de datos simulados
    
    Cada resultado incluye:
    - title, url, snippet, source
    - keywords: palabras clave extraídas del contenido
    - contentAngles: sugerencias de contenido para blog/video
    - wordCount: palabras totales del resultado
    - hasSnippet: si tiene descripción
    
    Query params:
        q (str): Término de búsqueda
        max_results (int, opcional): Máx resultados (default: 15, max: 30)
        type (str, opcional): 'text' (web) | 'news' (noticias) (default: 'text')
    """
    query = request.args.get('q', '').strip()
    max_results = min(int(request.args.get('max_results', 15)), 30)
    search_type = request.args.get('type', 'text')

    if not query:
        return jsonify({'status': 'error', 'message': 'Requiere el parámetro "q".'}), 400

    logger.info(f"Web search: '{query}' | max={max_results} | type={search_type}")

    # ── Verificar caché primero ──
    include_yt = request.args.get('include_youtube', 'false').lower() == 'true'
    cache_key = get_cache_key(query, max_results, search_type) + f'|yt={include_yt}'
    cached = get_from_cache(cache_key)
    if cached is not None:
        logger.info(f"Returning cached result for: {query}")
        return jsonify(cached)

    results = []
    source = None
    errors = []

    # ── CAPA 1: curl_cffi DuckDuckGo (mas confiable, evita rate limits con TLS de Chrome) ──
    if search_type == 'text':
        try:
            logger.info("Trying curl_cffi DuckDuckGo...")
            curl_results = search_via_curl_cffi(query, max_results)
            if curl_results:
                logger.info(f"curl_cffi DuckDuckGo OK: {len(curl_results)} results")
                results = curl_results
                source = 'duckduckgo'
        except Exception as e:
            logger.warning(f"curl_cffi failed: {e}")
            errors.append(f'curl_cffi: {str(e)[:80]}')

    # ── CAPA 2: DuckDuckGo DDGS (rápido cuando no hay rate limit) ──
    if not results:
        try:
            logger.info("Trying DuckDuckGo DDGS...")
            results = search_via_duckduckgo(query, max_results, search_type)
            if results:
                logger.info(f"DuckDuckGo DDGS OK: {len(results)} results")
                source = 'duckduckgo'
        except Exception as e:
            logger.warning(f"DuckDuckGo DDGS failed: {e}")
            errors.append(f'DDGS: {str(e)[:80]}')

    # ── CAPA 3: YouTube (opcional, solo si se solicita con &include_youtube=true) ──
    youtube_results = []
    if results and include_yt:
        try:
            logger.info("Trying YouTube bonus search...")
            yt = search_via_youtube(query, max_results=6)
            if yt:
                youtube_results = yt
                logger.info(f"YouTube OK: {len(yt)} results")
        except Exception as e:
            logger.warning(f"YouTube bonus search failed: {e}")
    
    # ── CAPA 4: Google scraping ──
    if not results and search_type == 'text':
        try:
            logger.info("Trying Google scraping...")
            results = search_via_google(query, max_results)
            if results:
                logger.info(f"Google OK: {len(results)} results")
                source = 'google'
        except Exception as e:
            logger.warning(f"Google failed: {e}")
            errors.append(f'Google: {str(e)[:80]}')

    # ── Sin resultados: error informativo ──
    if not results:
        logger.warning("All search engines failed")
        error_detail = '; '.join(errors) if errors else 'Los buscadores externos no están disponibles temporalmente'
        
        # Si curl_cffi no está instalado, mensaje claro
        if any('curl_cffi' in e.lower() for e in errors):
            final_msg = ('El motor de búsqueda requiere una dependencia extra. '
                         'Abre CMD como administrador en la carpeta backend y ejecuta:\n'
                         'pip install curl-cffi\nLuego reinicia el servidor.')
        else:
            suggestion = ''
            if 'Ratelimit' in error_detail or '202' in error_detail:
                suggestion = ' Espera unos segundos e intenta de nuevo.'
            elif 'CAPTCHA' in error_detail:
                suggestion = ' Google detectó tráfico automatizado. Intenta más tarde.'
            elif 'Timeout' in error_detail:
                suggestion = ' La búsqueda tardó demasiado. Intenta de nuevo.'
            final_msg = error_detail + '.' + suggestion
        
        response_data = {
            'status': 'error',
            'query': query,
            'results': [],
            'total': 0,
            'source': 'none',
            'message': final_msg
        }
        # NO cachear errores
        return jsonify(response_data), 503

    # ── Éxito: devolver y cachear ──
    response_data = {
        'status': 'success',
        'query': query,
        'results': results,
        'youtube_results': youtube_results if youtube_results else [],
        'total': len(results),
        'total_youtube': len(youtube_results),
        'source': source,
        'message': f'Encontrados {len(results)} resultados para "{query}" via {source}'
        + (f' + {len(youtube_results)} videos de YouTube' if youtube_results else '')
    }
    set_in_cache(cache_key, response_data)
    return jsonify(response_data)

# ── Main ──
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5555))
    debug = os.environ.get('FLASK_DEBUG', 'false').lower() == 'true'
    logger.info(f"Iniciando Nuclear AIMA API v1.2 en puerto {port} (debug={debug})")
    if debug:
        app.run(host='0.0.0.0', port=port, debug=True, threaded=True)
    else:
        from waitress import serve
        logger.info("Usando servidor Waitress (produccion)")
        serve(app, host='0.0.0.0', port=port, threads=8)
