var STORAGE_KEY = 'gwent_cal';
var wrapper = null;
var overlay = document.getElementById('gwent-cal-overlay');

function crearWrapper() {
  if (document.getElementById('viewport-wrapper')) return;
  wrapper = document.createElement('div');
  wrapper.id = 'viewport-wrapper';
  // Cambiamos el wrapper para que sea un contenedor flexible que centre el contenido
  wrapper.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;overflow:hidden;display:flex;align-items:center;justify-content:center;background:#000;z-index:1;';
  
  var children = [];
  // Movemos todos los elementos al wrapper excepto el overlay de calibración
  var nodes = Array.from(document.body.childNodes);
  nodes.forEach(node => {
    if (node.id !== 'gwent-cal-overlay' && node !== document.currentScript) {
      wrapper.appendChild(node);
    }
  });
  
  document.body.appendChild(wrapper);
  document.body.style.cssText = 'margin:0;padding:0;background:#000;overflow:hidden;width:100%;height:100%;';
}

function aplicar() {
  if (!wrapper) wrapper = document.getElementById('viewport-wrapper');
  if (!wrapper) return;
  var saved = localStorage.getItem(STORAGE_KEY);
  if (saved) { 
    var p = JSON.parse(saved); 
    var s = (p.escala||100)/100; 
    // Aplicamos la transformación a los elementos hijos directos del wrapper (como main)
    Array.from(wrapper.children).forEach(child => {
        if (child.tagName === 'MAIN' || child.id === 'deck-customization') {
            child.style.transform = 'translate('+(p.x||0)+'px, '+(p.y||0)+'px) scale('+s+')';
            child.style.transformOrigin = 'center center';
        }
    });
  }
}

function guardar() {
  var v = { 
    escala: parseInt(document.getElementById('cal-e').value), 
    x: parseInt(document.getElementById('cal-x').value), 
    y: parseInt(document.getElementById('cal-y').value) 
  };
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(v)); } catch(e) {}
  
  var s = v.escala/100;
  Array.from(wrapper.children).forEach(child => {
    if (child.tagName === 'MAIN' || child.id === 'deck-customization') {
        child.style.transform = 'translate('+v.x+'px, '+v.y+'px) scale('+s+')';
    }
  });
}

function actualizar() {
  document.getElementById('cv-escala').textContent = document.getElementById('cal-e').value;
  document.getElementById('cv-x').textContent = document.getElementById('cal-x').value;
  document.getElementById('cv-y').textContent = document.getElementById('cal-y').value;
  guardar();
}

function init() {
  if (!document.querySelector('main')) { setTimeout(init, 100); return; }
  crearWrapper(); 
  aplicar();
  
  document.getElementById('cal-e').addEventListener('input', actualizar);
  document.getElementById('cal-x').addEventListener('input', actualizar);
  document.getElementById('cal-y').addEventListener('input', actualizar);
  
  document.getElementById('cal-centrar').addEventListener('click', function() {
    document.getElementById('cal-e').value=100; 
    document.getElementById('cal-x').value=0; 
    document.getElementById('cal-y').value=0; 
    actualizar(); 
    overlay.style.display='none';
  });
  
  overlay.addEventListener('click', function(e) { 
    if(e.target===overlay) overlay.style.display='none'; 
  });
  
  var saved = localStorage.getItem(STORAGE_KEY);
  if (saved) { 
    var p = JSON.parse(saved); 
    document.getElementById('cal-e').value = p.escala||100; 
    document.getElementById('cal-x').value = p.x||0; 
    document.getElementById('cal-y').value = p.y||0; 
    document.getElementById('cv-escala').textContent = p.escala||100; 
    document.getElementById('cv-x').textContent = p.x||0; 
    document.getElementById('cv-y').textContent = p.y||0; 
  }
}

window.addEventListener('load', init);

document.addEventListener('DOMContentLoaded', function() {
    var btn = document.getElementById('open-calibration');
    if (btn) {
        btn.addEventListener('click', function() {
            var ov = document.getElementById('gwent-cal-overlay');
            if (ov) ov.style.display = 'flex';
        });
    }
});
