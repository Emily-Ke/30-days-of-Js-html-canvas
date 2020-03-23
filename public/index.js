const canvas = document.getElementById('artboard');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const context = canvas.getContext('2d');

const init = ctx => {
  ctx.font = '14px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(
    'Click and drag to start drawing',
    canvas.width / 2,
    canvas.height / 2
  );
  ctx.lineCap = 'round';
};

const getHue = (() => {
  let hue = 0;
  return () => {
    hue += 1;
    if (hue > 360) {
      hue = 0;
    }
    return hue;
  };
})();

const getStrokeWidth = (() => {
  let strokeWidth = 1;
  const minStrokeWidth = 1;
  const maxStrokeWidth = 60;
  const delta = 0.5;
  let direction = 'ascending';
  return () => {
    if (direction === 'ascending') {
      if (strokeWidth < maxStrokeWidth) {
        strokeWidth += delta;
      } else {
        strokeWidth -= delta;
        direction = 'descending';
      }
    } else if (strokeWidth > minStrokeWidth) {
      strokeWidth -= delta;
    } else {
      strokeWidth += delta;
      direction = 'ascending';
    }
    return strokeWidth;
  };
})();

let firstClick = true;
let isDrawing = false;
let [prevX, prevY] = [];
let [currentX, currentY] = [];

const draw = (ctx => ({ clientX: x, clientY: y }) => {
  if (!isDrawing) return;
  ctx.strokeStyle = `hsla(${getHue()}, 100%, 50%)`;
  ctx.lineWidth = getStrokeWidth();

  // create line segment
  [currentX, currentY] = [x, y];
  ctx.beginPath();
  ctx.moveTo(prevX, prevY);
  ctx.lineTo(currentX, currentY);
  ctx.stroke();
  [prevX, prevY] = [currentX, currentY];
})(context);

const initializeLine = (ctx => ({ clientX: x, clientY: y }) => {
  if (firstClick) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    firstClick = false;
  }
  [prevX, prevY] = [x, y];
  isDrawing = true;
})(context);

init(context);

canvas.addEventListener('mousedown', initializeLine);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', () => {
  isDrawing = false;
});
canvas.addEventListener('mouseout', () => {
  isDrawing = false;
});
