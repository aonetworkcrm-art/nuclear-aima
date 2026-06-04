"""
Nuclear AIMA — Node Auditor Backend API
Flask REST API para raspado de YouTube con Selenium
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
        'version': '1.0.0'
    })


@app.route('/api/audit', methods=['POST'])
def audit_node():
    """
    Auditoría de una canción/artista en YouTube.
    
    Request body:
        query (str): Nombre de la canción o artista
        max_nodes (int, opcional): Máximo de nodos a extraer (default: 50)
        cpm (float, opcional): CPM estimado en USD (default: 1.50)
        headless (bool, opcional): Modo headless (default: true)
    
    Response:
        status: 'success' | 'error'
        nodes: Lista de nodos extraídos
        song_info: Métricas consolidadas
        message: Mensaje informativo
    """
    data = request.get_json()
    if not data or 'query' not in data:
        return jsonify({
            'status': 'error',
            'message': 'Se requiere el campo "query" con el nombre de la canción/artista.'
        }), 400

    query = data['query'].strip()
    max_nodes = min(int(data.get('max_nodes', 50)), 100)  # Máx 100 para no saturar
    cpm = float(data.get('cpm', 1.50))
    headless = data.get('headless', True)

    if not query:
        return jsonify({
            'status': 'error',
            'message': 'El campo "query" no puede estar vacío.'
        }), 400

    logger.info(f"Auditando: '{query}' | max_nodes={max_nodes} | cpm={cpm}")

    scraper = YouTubeScraper(headless=headless, timeout=20)
    try:
        nodes = scraper.search_song(query, max_results=max_nodes)
        song_info = scraper.get_song_info(nodes)

        for n in nodes:
            n['est_usd_per_hour'] = round((n['vph'] * cpm) / 1000, 6)
            n['type'] = 'pirate' if n['isPirate'] else ('official' if n['isOfficial'] else 'cover')
            n['typeLabel'] = '🏴‍☠️ Pirata' if n['isPirate'] else ('Oficial' if n['isOfficial'] else 'Cover')

        return jsonify({
            'status': 'success',
            'query': query,
            'cpm': cpm,
            'nodes': nodes,
            'song_info': song_info,
            'total': len(nodes),
            'message': f'Extraídos {len(nodes)} nodos para "{query}"'
        })
    except Exception as e:
        logger.error(f"Error en auditoría: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'status': 'error', 'message': f'Error: {str(e)}'}), 500
    finally:
        scraper.close()


@app.route('/api/audit/batch', methods=['POST'])
def audit_batch():
    """
    Auditoría por lote: múltiples canciones de un artista.
    
    Request body:
        songs (list): Lista de canciones [{name, views?, nodes?}]
        max_nodes_per_song (int): Máx nodos por canción (default: 20)
        cpm (float): CPM estimado
    """
    data = request.get_json()
    if not data or 'songs' not in data:
        return jsonify({'status': 'error', 'message': 'Se requiere lista de canciones'}), 400

    songs = data['songs'][:20]  # Máx 20 canciones
    max_per = min(int(data.get('max_nodes_per_song', 20)), 50)
    cpm = float(data.get('cpm', 1.50))

    all_nodes = []
    node_id = 1
    errors = []

    scraper = YouTubeScraper(headless=True, timeout=20)
    try:
        for song in songs:
            try:
                logger.info(f"Auditando canción: '{song['name']}'")
                nodes = scraper.search_song(song['name'], max_results=max_per)

                for n in nodes:
                    n['id'] = node_id
                    n['songName'] = song['name']
                    n['est_usd_per_hour'] = round((n['vph'] * cpm) / 1000, 6)
                    n['type'] = 'pirate' if n['isPirate'] else ('official' if n['isOfficial'] else 'cover')
                    n['typeLabel'] = '🏴‍☠️ Pirata' if n['isPirate'] else ('Oficial' if n['isOfficial'] else 'Cover')
                    node_id += 1
                    all_nodes.append(n)

            except Exception as e:
                errors.append({'song': song['name'], 'error': str(e)})
                continue
    finally:
        scraper.close()

    return jsonify({
        'status': 'success',
        'total_nodes': len(all_nodes),
        'nodes': all_nodes,
        'errors': errors,
        'message': f'Extraídos {len(all_nodes)} nodos de {len(songs)} canciones'
    })


# ── Main ──
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_DEBUG', 'false').lower() == 'true'
    logger.info(f"Iniciando Nuclear AIMA API en puerto {port} (debug={debug})")
    app.run(host='0.0.0.0', port=port, debug=debug)
