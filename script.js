document.addEventListener('DOMContentLoaded', function () {
  const canvas = document.querySelector('.canvas');
  const colorPicker = document.getElementById('colorPicker');
  const clearCanvas = document.getElementById('clearCanvas');
  const fillCanvas = document.getElementById('fillCanvas');
  const eraser = document.getElementById('eraser');
  const gridSize = document.getElementById('gridSize');
  let currentColor = colorPicker.value;
  let isEraser = false;

  colorPicker.addEventListener('change', () => {
    if (!isEraser) currentColor = colorPicker.value;
  });

  eraser.addEventListener('click', () => {
    isEraser = !isEraser;
    eraser.textContent = isEraser ? 'Draw' : 'Eraser';
    currentColor = isEraser ? '#fff' : colorPicker.value;
  });

  fillCanvas.addEventListener('click', () => {
    document.querySelectorAll('.pixel').forEach((pixel) => {
      pixel.style.backgroundColor = currentColor;
    });
  });

  clearCanvas.addEventListener('click', () => {
    document.querySelectorAll('.pixel').forEach((pixel) => {
      pixel.style.backgroundColor = '#fff';
    });
  });

  gridSize.addEventListener('change', (event) => {
    createCanvas(parseInt(event.target.value), parseInt(event.target.value));
  });

  function createCanvas(rows, cols) {
    canvas.innerHTML = '';
    canvas.style.gridTemplateRows = `repeat(${rows}, 20px)`;
    canvas.style.gridTemplateColumns = `repeat(${cols}, 20px)`;

    for (let i = 0; i < rows * cols; i++) {
      const pixel = document.createElement('div');
      pixel.classList.add('pixel');
      pixel.addEventListener('mousedown', paintPixel);
      pixel.addEventListener('mouseover', paintPixel);
      canvas.appendChild(pixel);
    }
  }

  function paintPixel(event) {
    if (event.buttons === 1 || event.type === 'mousedown') {
      event.target.style.backgroundColor = currentColor;
    }
  }

  createCanvas(30, 30);
});
