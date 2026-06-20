var STORAGE_KEY = 'gwent_cal';
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
window.addEventListener('load', init);