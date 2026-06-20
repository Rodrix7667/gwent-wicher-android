# -*- coding: utf-8 -*-
import os, json, sys

www = 'C:/Users/Usuario/Desktop/gwent-wicher-android/www'
root = 'C:/Users/Usuario/Desktop/gwent-wicher-android'

# 1. Modify index.html: add calibration menu + script
html_path = www + '/index.html'
with open(html_path, 'r') as f:
    html = f.read()

menu = '''<div id="gwent-cal-overlay" style="position:fixed;top:0;left:0;width:100%;height:100%;z-index:999999;background:rgba(0,0,0,0.95);display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:Arial,sans-serif;color:#fff;padding:20px;box-sizing:border-box;">
<h2 style="color:goldenrod;margin:0 0 6px 0;font-size:22px;">Ajustar Pantalla</h2>
<p style="color:#aaa;margin:0 0 14px 0;font-size:13px;">Ajusta para que el tablero entre completo</p>
<div style="width:80%;max-width:360px;margin-bottom:10px;"><label style="display:flex;justify-content:space-between;font-size:13px;"><span>Escala: <b id="cv-escala">100</b>%</span></label><input type="range" id="cal-e" min="90" max="110" value="100" style="width:100%;height:36px;" /></div>
<div style="width:80%;max-width:360px;margin-bottom:10px;"><label style="display:flex;justify-content:space-between;font-size:13px;"><span>Mover X: <b id="cv-x">0</b>px</span></label><input type="range" id="cal-x" min="-80" max="80" value="0" style="width:100%;height:36px;" /></div>
<div style="width:80%;max-width:360px;margin-bottom:14px;"><label style="display:flex;justify-content:space-between;font-size:13px;"><span>Mover Y: <b id="cv-y">0</b>px</span></label><input type="range" id="cal-y" min="-80" max="80" value="0" style="width:100%;height:36px;" /></div>
<button id="cal-centrar" style="padding:10px 28px;font-size:15px;border-radius:8px;margin-bottom:10px;border:1px solid goldenrod;background:#3a2a0a;color:goldenrod;cursor:pointer;">Centrar</button>
<p style="color:#666;font-size:11px;margin:0;">Los ajustes se guardan automaticamente</p>
</div>'''

html = html.replace('</body>', menu + '\n<script src="calibrar.js"></script>\n</body>')
with open(html_path, 'w') as f:
    f.write(html)
print('OK: index.html')

# 2. Write calibrar.js
cal_js = '''var STORAGE_KEY = 'gwent_cal';
var wrapper = null;
var overlay = document.getElementById('gwent-cal-overlay');
function crearWrapper() {
  if (document.getElementById('viewport-wrapper')) return;
  wrapper = document.createElement('div');
  wrapper.id = 'viewport-wrapper';
  wrapper.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;overflow:hidden;transform-origin:0 0;z-index:1;';
  var children = [];
  while (document.body.firstChild) children.push(document.body.firstChild);
  for (var i = 0; i < children.length; i++) { if (children[i].id !== 'gwent-cal-overlay') wrapper.appendChild(children[i]); }
  document.body.appendChild(wrapper);
  document.body.style.cssText = 'margin:0;padding:0;background:#000;overflow:hidden;width:100%;height:100%;';
}
function aplicar() {
  if (!wrapper) wrapper = document.getElementById('viewport-wrapper');
  if (!wrapper) return;
  var saved = localStorage.getItem(STORAGE_KEY);
  if (saved) { var p = JSON.parse(saved); var s = (p.escala||100)/100; wrapper.style.transform = 'translate('+(p.x||0)+'px, '+(p.y||0)+'px) scale('+s+')'; }
}
function guardar() {
  var v = { escala:parseInt(document.getElementById('cal-e').value), x:parseInt(document.getElementById('cal-x').value), y:parseInt(document.getElementById('cal-y').value) };
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(v)); } catch(e) {}
  wrapper.style.transform = 'translate('+v.x+'px, '+v.y+'px) scale('+(v.escala/100)+')';
}
function actualizar() {
  document.getElementById('cv-escala').textContent = document.getElementById('cal-e').value;
  document.getElementById('cv-x').textContent = document.getElementById('cal-x').value;
  document.getElementById('cv-y').textContent = document.getElementById('cal-y').value;
  guardar();
}
function init() {
  if (!document.querySelector('main')) { setTimeout(init, 100); return; }
  crearWrapper(); aplicar();
  document.getElementById('cal-e').addEventListener('input', actualizar);
  document.getElementById('cal-x').addEventListener('input', actualizar);
  document.getElementById('cal-y').addEventListener('input', actualizar);
  document.getElementById('cal-centrar').addEventListener('click', function() {
    document.getElementById('cal-e').value=100; document.getElementById('cal-x').value=0; document.getElementById('cal-y').value=0; actualizar(); overlay.style.display='none';
  });
  overlay.addEventListener('click', function(e) { if(e.target===overlay) overlay.style.display='none'; });
  var saved = localStorage.getItem(STORAGE_KEY);
  if (saved) { var p = JSON.parse(saved); document.getElementById('cal-e').value=p.escala||100; document.getElementById('cal-x').value=p.x||0; document.getElementById('cal-y').value=p.y||0; document.getElementById('cv-escala').textContent=p.escala||100; document.getElementById('cv-x').textContent=p.x||0; document.getElementById('cv-y').textContent=p.y||0; }
}
window.addEventListener('load', init);'''

with open(www + '/calibrar.js', 'w') as f:
    f.write(cal_js)
print('OK: calibrar.js')

# 3. package.json
pkg = {
    "name": "gwent-wicher",
    "version": "1.0.0",
    "private": True,
    "description": "Gwent de The Witcher 3 para Android",
    "main": "index.js",
    "scripts": {
        "build": "npx cap copy && cd android && gradlew.bat assembleDebug"
    },
    "dependencies": {
        "@capacitor/android": "^6.0.0",
        "@capacitor/core": "^6.0.0",
        "@capacitor/cli": "^6.0.0"
    }
}
with open(root + '/package.json', 'w') as f:
    json.dump(pkg, f, indent=2)
print('OK: package.json')

# 4. capacitor.config.json
cap_config = {
    "appId": "com.gwent.wicher",
    "appName": "Gwent Wicher",
    "webDir": "www"
}
with open(root + '/capacitor.config.json', 'w') as f:
    json.dump(cap_config, f, indent=2)
print('OK: capacitor.config.json')

# 5. .gitignore
gitignore = """node_modules/
www/node_modules/
android/.gradle/
android/build/
android/app/build/
android/local.properties
android/captures/
.idea/
*.iml
.vscode/
.DS_Store
Thumbs.db
*.log
"""
with open(root + '/.gitignore', 'w') as f:
    f.write(gitignore)
print('OK: .gitignore')

# 6. README.md
readme = """# Gwent Wicher - Android

Versión móvil del clásico Gwent de The Witcher 3: Wild Hunt.

## Créditos
- Juego original: [asundr/gwent-classic](https://github.com/asundr/gwent-classic)
- Traducción al español + adaptación Android: OpenCode

## Compilar
```bash
npm install
npx cap sync
npx cap copy
cd android
./gradlew.bat assembleDebug
```

La APK se genera en: `android/app/build/outputs/apk/debug/app-debug.apk`

## Requisitos
- Node.js 18+
- JDK 17+
- Android SDK 34+
"""
with open(root + '/README.md', 'w') as f:
    f.write(readme)
print('OK: README.md')

print('\nTODO LISTO')
