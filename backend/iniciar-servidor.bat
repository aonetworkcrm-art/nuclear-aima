@echo off
title Nuclear AIMA - Servidor Local v1.2
color 0a
echo ============================================
echo  Nuclear AIMA v1.2 - INICIANDO SERVIDOR
echo ============================================
echo.
cd /d "%~dp0"
echo  Limpiando procesos zombies...
taskkill /F /IM python3.12.exe >nul 2>&1
taskkill /F /IM pythonw3.12.exe >nul 2>&1
taskkill /F /IM python.exe >nul 2>&1
taskkill /F /IM pythonw.exe >nul 2>&1
timeout /T 2 >nul
echo.
echo  Instalando dependencia curl-cffi (necesaria para busqueda web)...
pip install curl-cffi --quiet 2>nul
echo.
echo  Iniciando Flask en http://localhost:5555 ...
echo.
echo  NOTA: El navegador mostrara 'conectando...' unos segundos
echo  hasta que Flask termine de iniciar. Espera y recarga si es necesario.
echo.
echo  Abriendo navegador...
start http://localhost:5555
echo.
echo  ============================================
echo   MANTEN ESTA VENTANA ABIERTA
echo   Para detener: cierra esta ventana
echo  ============================================
echo.
python app.py
