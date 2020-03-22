const canvas = document.getElementById('artboard');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext('2d');

const initializePen = () => {
  let hue = 0;
  let strokeWidth = 50;
  const minStrokeWidth = 20;
  const maxStrokeWidth = 60;
  const delta = 0.2;
  let direction = 'ascending';

  function getStrokeWidth() {
    if (direction === 'ascending') {
      if (strokeWidth < maxStrokeWidth) {
        strokeWidth += delta;
      } else {
        strokeWidth -= delta;
        direction = 'descending';
      }
    } else {
      if (strokeWidth > minStrokeWidth) {
        strokeWidth -= delta;
      } else {
        strokeWidth += delta;
        direction = 'ascending';
      }
    }
    return strokeWidth;
  }

  return function drawDot({ clientX: x, clientY: y }) {
    const radialGradient = ctx.createRadialGradient(
      x,
      y,
      0,
      x,
      y,
      getStrokeWidth()
    );
    radialGradient.addColorStop(0.8, `hsla(${hue}, 100%, 50%, 1)`);
    radialGradient.addColorStop(1, `hsla(${hue}, 100%, 50%, 0)`);
    ctx.fillStyle = radialGradient;

    hue = (hue + 1) % 360;

    ctx.fillRect(
      x - strokeWidth,
      y - strokeWidth,
      strokeWidth * 2,
      strokeWidth * 2
    );
  };
};

const drawDot = initializePen();

canvas.addEventListener('mousedown', () => {
  canvas.addEventListener('mousemove', drawDot);
});

canvas.addEventListener('mouseup', () => {
  canvas.removeEventListener('mousemove', drawDot);
});
