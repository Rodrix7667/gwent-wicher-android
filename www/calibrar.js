var STORAGE_KEY = 'gwent_cal_v2';
var overlay = document.getElementById('gwent-cal-overlay');

function aplicar() {
  var main = document.querySelector('main');
  var deck = document.getElementById('deck-customization');
  if (!main) return;
  
  var saved = localStorage.getItem(STORAGE_KEY);
  if (saved) { 
    var p = JSON.parse(saved); 
    var s = (p.escala||100)/100; 
    var sw = (p.w||100)/100;
    // Aplicamos escala general y escala de ancho independiente
    var transform = 'translate('+(p.x||0)+'px, '+(p.y||0)+'px) scale('+(s*sw)+', '+s+')';
    main.style.transform = transform;
    if(deck) deck.style.transform = transform;
  }
}

function guardar() {
  var v = { 
    escala: parseInt(document.getElementById('cal-e').value), 
    w: parseInt(document.getElementById('cal-w').value),
    x: parseInt(document.getElementById('cal-x').value), 
    y: parseInt(document.getElementById('cal-y').value) 
  };
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(v)); } catch(e) {}
  
  var s = v.escala/100;
  var sw = v.w/100;
  var transform = 'translate('+v.x+'px, '+v.y+'px) scale('+(s*sw)+', '+s+')';
  var main = document.querySelector('main');
  var deck = document.getElementById('deck-customization');
  if(main) main.style.transform = transform;
  if(deck) deck.style.transform = transform;
}

function actualizar() {
  document.getElementById('cv-escala').textContent = document.getElementById('cal-e').value;
  document.getElementById('cv-w').textContent = document.getElementById('cal-w').value;
  document.getElementById('cv-x').textContent = document.getElementById('cal-x').value;
  document.getElementById('cv-y').textContent = document.getElementById('cal-y').value;
  guardar();
}

function init() {
  var main = document.querySelector('main');
  if (!main) { setTimeout(init, 100); return; }
  
  document.body.style.backgroundColor = '#000';
  document.body.style.display = 'flex';
  document.body.style.alignItems = 'center';
  document.body.style.justifyContent = 'center';
  document.body.style.minHeight = '100vh';
  document.body.style.margin = '0';
  document.body.style.overflow = 'hidden';

  aplicar();
  
  document.getElementById('cal-e').addEventListener('input', actualizar);
  document.getElementById('cal-w').addEventListener('input', actualizar);
  document.getElementById('cal-x').addEventListener('input', actualizar);
  document.getElementById('cal-y').addEventListener('input', actualizar);
  
  document.getElementById('cal-centrar').addEventListener('click', function() {
    if (document.getElementById('cal-e').value == 100 && document.getElementById('cal-w').value == 100 && document.getElementById('cal-x').value == 0 && document.getElementById('cal-y').value == 0) {
        overlay.style.display='none';
    } else {
        document.getElementById('cal-e').value=100; 
        document.getElementById('cal-w').value=100;
        document.getElementById('cal-x').value=0; 
        document.getElementById('cal-y').value=0; 
        actualizar(); 
    }
  });
  
  var openBtn = document.getElementById('open-calibration');
  if(openBtn) {
      openBtn.style.display = 'flex';
      openBtn.addEventListener('click', function() {
          overlay.style.display = 'flex';
      });
  }

  overlay.addEventListener('click', function(e) { 
    if(e.target===overlay) overlay.style.display='none'; 
  });
  
  var saved = localStorage.getItem(STORAGE_KEY);
  if (saved) { 
    var p = JSON.parse(saved); 
    document.getElementById('cal-e').value = p.escala||100; 
    document.getElementById('cal-w').value = p.w||100;
    document.getElementById('cal-x').value = p.x||0; 
    document.getElementById('cal-y').value = p.y||0; 
    document.getElementById('cv-escala').textContent = p.escala||100; 
    document.getElementById('cv-w').textContent = p.w||100;
    document.getElementById('cv-x').textContent = p.x||0; 
    document.getElementById('cv-y').textContent = p.y||0; 
  }
}

window.addEventListener('load', init);
