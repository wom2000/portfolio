const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d', { willReadFrequently: true });

const colorPicker = document.getElementById('colorPicker');
const brushSize = document.getElementById('brushSize');
const pencilBtn = document.getElementById('pencilBtn');
const eraserBtn = document.getElementById('eraserBtn');
const clearBtn = document.getElementById('clearBtn');
const saveBtn = document.getElementById('saveBtn');
const undoBtn = document.getElementById('undoBtn');

let drawing = false;
let lastX = 0;
let lastY = 0;
let mode = 'pencil';
let history = [];
const MAX_HISTORY = 30;

function fitCanvas(){
  const ratio = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();


  canvas.width = Math.round(rect.width * ratio);
  canvas.height = Math.round(rect.height * ratio);


  canvas.style.width = rect.width + 'px';
  canvas.style.height = rect.height + 'px';

  ctx.setTransform(1,0,0,1,0,0);
  ctx.scale(ratio, ratio);

  if(history.length === 0){
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0,0,rect.width,rect.height);
    saveHistory();
  } else {
    restoreFromHistory();
  }
}


function saveHistory(){
  try {
    if(history.length >= MAX_HISTORY) history.shift();
    history.push(canvas.toDataURL());
    updateUndoButton();
  } catch(e){}
}


function undo(){
  if(history.length <= 1) return;
  history.pop();
  const last = history[history.length - 1];
  const img = new Image();
  img.onload = () => {
    ctx.setTransform(1,0,0,1,0,0);
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const ratio = window.devicePixelRatio || 1;
    ctx.scale(ratio, ratio);
  };
  img.src = last;
  updateUndoButton();
}


function restoreFromHistory(){
  const last = history[history.length - 1];
  if(!last) return;
  const img = new Image();
  img.onload = () => {
    ctx.setTransform(1,0,0,1,0,0);
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const ratio = window.devicePixelRatio || 1;
    ctx.scale(ratio, ratio);
  };
  img.src = last;
}

function updateUndoButton(){
  undoBtn.disabled = history.length <= 1;
}

function startDraw(x,y){
  drawing = true;
  lastX = x;
  lastY = y;
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
}

function drawTo(x,y){
  if(!drawing) return;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.lineWidth = brushSize.value;
  if(mode === 'eraser'){
    ctx.globalCompositeOperation = 'destination-out';
    ctx.strokeStyle = 'rgba(0,0,0,1)';
  } else {
    ctx.globalCompositeOperation = 'source-over';
    ctx.strokeStyle = colorPicker.value;
  }
  ctx.lineTo(x, y);
  ctx.stroke();
  lastX = x;
  lastY = y;
}

function endDraw(){
  if(drawing){
    drawing = false;
    ctx.closePath();
    saveHistory();
  }
}

function saveImage(){
  const link = document.createElement('a');
  link.download = `paint_${new Date().toISOString().slice(0,19).replace(/[:T]/g,'-')}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}


function getPointerPos(e){
  const rect = canvas.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
}


canvas.addEventListener('pointerdown', (e) => {
  if(e.button && e.button !== 0) return;
  canvas.setPointerCapture(e.pointerId);
  const p = getPointerPos(e);
  startDraw(p.x, p.y);
});
canvas.addEventListener('pointermove', (e) => {
  if(!drawing) return;
  const p = getPointerPos(e);
  drawTo(p.x, p.y);
});
canvas.addEventListener('pointerup', (e) => {
  canvas.releasePointerCapture(e.pointerId);
  endDraw();
});
canvas.addEventListener('pointercancel', (e) => {
  canvas.releasePointerCapture(e.pointerId);
  endDraw();
});


pencilBtn.addEventListener('click', () => {
  mode = 'pencil';
  pencilBtn.classList.add('active');
  eraserBtn.classList.remove('active');
  canvas.style.cursor = 'crosshair';
});
eraserBtn.addEventListener('click', () => {
  mode = 'eraser';
  eraserBtn.classList.add('active');
  pencilBtn.classList.remove('active');
  canvas.style.cursor = 'cell';
});
clearBtn.addEventListener('click', () => {
  if(!confirm('Limpar tudo? Isto não pode ser desfeito (exceto com undo se existir histórico).')) return;
  ctx.setTransform(1,0,0,1,0,0);
  ctx.clearRect(0,0,canvas.width,canvas.height);
  const rect = canvas.getBoundingClientRect();
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0,0,rect.width,rect.height);
  fitCanvas();
  saveHistory();
});
undoBtn.addEventListener('click', () => undo());
saveBtn.addEventListener('click', () => saveImage());


window.addEventListener('resize', () => fitCanvas());
(function init(){
  fitCanvas();
  updateUndoButton();
})();
