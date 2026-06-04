# ═══════════════════════════════════════════════
# Nuclear AIMA — Backend API Dockerfile
# Flask + Selenium + Chrome + ChromeDriver
# Desplegado en Render como servicio web
# ═══════════════════════════════════════════════

FROM python:3.12-slim

# ── Evita prompts durante instalación de paquetes ──
ENV DEBIAN_FRONTEND=noninteractive
ENV PYTHONUNBUFFERED=1

# ── Instala dependencias del sistema necesarias para Chrome ──
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    unzip \
    curl \
    ca-certificates \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdrm2 \
    libgbm1 \
    libgdk-pixbuf2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libu2f-udev \
    libvulkan1 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxkbcommon0 \
    libxrandr2 \
    xdg-utils \
    && rm -rf /var/lib/apt/lists/*

# ── Instala Google Chrome (stable) ──
RUN wget -q -O /tmp/chrome.deb https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb \
    && apt-get install -y /tmp/chrome.deb \
    && rm /tmp/chrome.deb \
    && google-chrome --version

# ── Variables de entorno para Chrome ──
ENV CHROME_BIN=/usr/bin/google-chrome
ENV CHROME_DRIVER=/usr/local/bin/chromedriver

# ── Directorio de trabajo ──
WORKDIR /app

# ── Copia dependencias Python e instala ──
COPY backend/requirements.txt /app/backend/requirements.txt
RUN pip install --no-cache-dir -r /app/backend/requirements.txt

# ── Copia los archivos del proyecto ──
COPY backend/ /app/backend/
COPY index.html /app/index.html
COPY js/ /app/js/
COPY css/ /app/css/

# ── Puerto que expone Render ──
EXPOSE 10000

# ── Comando de inicio ──
# Gunicorn sirve la app Flask desde backend/app.py
# timeout=120 para operaciones largas de Selenium (scrolling, esperas)
# workers=1 para evitar conflictos con Chrome en memoria limitada
CMD cd backend && gunicorn app:app \
    --bind 0.0.0.0:$PORT \
    --timeout 120 \
    --workers 1 \
    --access-logfile - \
    --error-logfile -
