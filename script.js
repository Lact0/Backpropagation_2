window.onresize = changeWindow;
let points = [];
let types = ['yellow', 'blue'];
let net = new NeuralNetwork(1, [5, 5, 1], []);
let f = (x) => 90 * Math.cos(15 * x) + height / 2;

function load() {
  canvas = document.querySelector('.canvas');
  ctx = canvas.getContext('2d');
  canvas.width = width;
  canvas.height = height;
  document.onkeydown = keyPress;
  for(let i = 0; i < 1000; i++) {
    const point = {x: rand(0, width - 1),
                   y: rand(0, height - 1),
                   type: rand(0, 1)};
    points.push(point);
  }
  //drawPoints();
  //net.draw(0, 0, width, height);
  for(let i = 0; i < width; i++) {
    const j = f(i / width);
    const netJ = net.pass([i / width])[0] * height;
    ctx.strokeStyle = 'white'
    ctx.strokeRect(i, j, 1, 1);
    ctx.strokeRect(i, netJ, 1, 1);
  }
  console.log(net.getGradient([0], [1]));
}

function drawPoints() {
  for(let point of points) {
    ctx.strokeStyle = types[point.type];
    ctx.beginPath();
    ctx.arc(point.x, point.y, 2, 0, Math.PI * 2);
    ctx.stroke();
  }
}

function runFrame() {
  //DO ALL DRAWING HERE

  requestAnimationFrame(runFrame);
}

function changeWindow() {
  width = window.innerWidth;
  height = window.innerHeight;
  //REDRAW SCREEN
}

function keyPress(key) {
  if(key.keyCode == 32) {
  }
}

function leftClick() {
  const x = event.clientX;
  const y = event.clientY;
}