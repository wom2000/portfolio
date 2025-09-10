// paint.js - simples Paint com undo, clear, save, touch/mouse usando pointer events

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d', { willReadFrequently: true });

const colorPicker = document.getElementById('colorPicker');
const brushSize = document.getElementById('brushSize');
const pencilBtn = document.getElementById('pencilBtn');
const eraserBtn = document.getElementById('eraserBtn');
const fillBtn = document.getElementById('fillBtn');
const undoBtn = document.getElementById('undoBtn');
const clearBtn = document.getElementById('clearBtn');
const saveBtn = document.getElementById('saveBtn');

let drawing = false;
let lastX = 0;
let lastY = 0;
let mode = 'pencil'; // pencil | eraser
let history = [];
const MAX_HISTORY = 30;

// Ajusta canvas ao tamanho real do elemento (para alta-dpi)
function fitCanvas(){
  const ratio = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = Math.round(rect.width * ratio);
  canvas.height = Math.round(rect.height * ratio);
  canvas.style.width = rect.width + 'px';
  canvas.style.height = rect.height + 'px';
  ctx.scale(ratio, ratio);
  // Se não houver nada no histórico, pinta fundo branco
  if(history.length === 0){
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0,0,rect.width,rect.height);
    saveHistory(); // salva o fundo
  } else {
    restoreFromHistory(); // repõe última imagem após redimensionar
  }
}

// salva estado atual para undo (imagem em dataURL)
function saveHistory(){
  try {
    if(history.length >= MAX_HISTORY) history.shift();
    history.push(canvas.toDataURL());
    updateUndoButton();
  } catch(e){}
}

// restaura último estado
function undo(){
  if(history.length <= 1) return; // manter sempre pelo menos o estado inicial
  history.pop(); // remover estado atual
  const last = history[history.length - 1];
  const img = new Image();
  img.onload = () => {
    // desenha o image sobre o canvas
    ctx.setTransform(1,0,0,1,0,0); // reset transform
    ctx.clearRect(0,0,canvas.width,canvas.height);
    // scale handled by fitCanvas; desenhar usando dimensões CSS
    const rect = canvas.getBoundingClientRect();
    ctx.drawImage(img, 0, 0, rect.width, rect.height);
  };
  img.src = last;
  updateUndoButton();
}

// repõe imagem do último history (usado no resize)
function restoreFromHistory(){
  const last = history[history.length - 1];
  if(!last) return;
  const img = new Image();
  img.onload = () => {
    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.drawImage(img, 0, 0, rect.width, rect.height);
  };
  img.src = last;
}

function updateUndoButton(){
  undoBtn.disabled = history.length <= 1;
}

// Inicia desenho
function startDraw(x,y){
  drawing = true;
  lastX = x;
  lastY = y;
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
}

// Desenha linha até x,y
function drawTo(x,y){
  if(!drawing) return;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.lineWidth = brushSize.value;
  if(mode === 'eraser'){
    // Eraser usando compositing: apaga pixels
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
    // depois do traço, salvar estado
    saveHistory();
  }
}

// Preencher (fill) todo o canvas com a cor selecionada
function fillCanvas(){
  const rect = canvas.getBoundingClientRect();
  ctx.setTransform(1,0,0,1,0,0);
  ctx.fillStyle = colorPicker.value;
  ctx.fillRect(0,0,rect.width,rect.height);
  // restaurar transform (scale para DPR)
  fitCanvas();
  saveHistory();
}

// Salvar imagem como PNG
function saveImage(){
  const link = document.createElement('a');
  link.download = `paint_${new Date().toISOString().slice(0,19).replace(/[:T]/g,'-')}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

// Event handlers pointer (funciona para mouse + touch + stylus)
function getPointerPos(e){
  const rect = canvas.getBoundingClientRect();
  // pointer events give clientX/Y native
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
}

canvas.addEventListener('pointerdown', (e) => {
  // somente botão principal
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

// Toolbar events
pencilBtn.addEventListener('click', () => {
  mode = 'pencil';
  pencilBtn.classList.add('active');
  eraserBtn.classList.remove('active');
  fillBtn.classList.remove('active');
  canvas.style.cursor = 'crosshair';
});

eraserBtn.addEventListener('click', () => {
  mode = 'eraser';
  eraserBtn.classList.add('active');
  pencilBtn.classList.remove('active');
  fillBtn.classList.remove('active');
  canvas.style.cursor = 'cell';
});

fillBtn.addEventListener('click', () => {
  // toggle fill mode visually but we just perform fill once when clicked
  fillCanvas();
});

clearBtn.addEventListener('click', () => {
  if(!confirm('Limpar tudo? Isto não pode ser desfeito (exceto com undo se existir histórico).')) return;
  const rect = canvas.getBoundingClientRect();
  ctx.setTransform(1,0,0,1,0,0);
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0,0,rect.width,rect.height);
  fitCanvas();
  saveHistory();
});

undoBtn.addEventListener('click', () => undo());
saveBtn.addEventListener('click', () => saveImage());

// Atualizações de cor / tamanho
colorPicker.addEventListener('change', () => {
  // se estava em eraser, manter modo
});

brushSize.addEventListener('input', () => {
  // apenas atualização visual, valor utilizado no drawTo
});

// Inicialização
window.addEventListener('resize', () => {
  // Refit sem perder o histórico (restoreFromHistory lida com último estado)
  fitCanvas();
});

// ao iniciar, ajustar canvas e criar estado inicial
(function init(){
  // define tamanho inicial com base no container
  fitCanvas();
  updateUndoButton();
})();
