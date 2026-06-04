"""
Nuclear AIMA — Node Auditor Backend API
Flask REST API para raspado de YouTube con Selenium
Incluye detección de Nodos, Piratas y Shorts
"""

import os
import json
import logging
from flask import Flask, request, jsonify
from flask_cors import CORS
from youtube_scraper import YouTubeScraper

# ── Configuración ──
app = Flask(__name__)
CORS(app)  # Permitir conexiones desde el frontend

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger('nucleus-api')

# ── Endpoints ──

@app.route('/api/health', methods=['GET'])
def health():
    """Health check para verificar que el servidor está vivo."""
    return jsonify({
        'status': 'ok',
        'service': 'Nuclear AIMA - Node Auditor Backend',
        'version': '1.1.0'
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
        if include_shorts:
            result = scraper.search_song_with_shorts(query, max_nodes=max_nodes, max_shorts=max_shorts)
            nodes = result['nodes']
            shorts = result['shorts']
        else:
            nodes = scraper.search_song(query, max_results=max_nodes)
            shorts = []

        song_info = scraper.get_song_info(nodes)
        shorts_info = scraper.get_shorts_info(shorts) if shorts else {
            'totalShorts': 0, 'totalViews': 0, 'totalVPH': 0.0,
            'uniqueChannels': 0, 'topChannels': [], 'avgViewsPerShort': 0
        }

        # Enriquecer nodos
        for n in nodes:
            n['est_usd_per_hour'] = round((n['vph'] * cpm) / 1000, 6)
            n['type'] = 'pirate' if n['isPirate'] else ('official' if n['isOfficial'] else 'cover')
            n['typeLabel'] = '🏴‍☠️ Pirata' if n['isPirate'] else ('Oficial' if n['isOfficial'] else 'Cover')

        # Enriquecer Shorts
        for s in shorts:
            s['est_usd_per_hour'] = round((s['vph'] * cpm * 0.5) / 1000, 6)  # Shorts pagan ~50%
            s['type'] = 'short'
            s['typeLabel'] = '📱 Short'

        return jsonify({
            'status': 'success',
            'query': query,
            'cpm': cpm,
            'nodes': nodes,
            'shorts': shorts,
            'song_info': song_info,
            'shorts_info': shorts_info,
            'total': len(nodes),
            'total_shorts': len(shorts),
            'message': f'Extraídos {len(nodes)} nodos y {len(shorts)} Shorts para "{query}"'
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
        'uniqueSongs': len(set(s.get('songName', '') for s in all_shorts if s.get('songName'))),
        'avgViewsPerShort': sum(s.get('views', 0) for s in all_shorts) // len(all_shorts) if all_shorts else 0
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


# ── Main ──
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_DEBUG', 'false').lower() == 'true'
    logger.info(f"Iniciando Nuclear AIMA API v1.2 en puerto {port} (debug={debug})")
    logger.info(f"Endpoint Shorts mejorado: /api/audit/shorts con filtros + /api/shorts/batch")
    app.run(host='0.0.0.0', port=port, debug=debug)
