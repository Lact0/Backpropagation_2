window.onresize = changeWindow;
let net = new NeuralNetwork(1, [5, 5, 1], []);
let f = (x) => .25 * Math.cos(20 * x) + .5;
//Math.pow(x, 2);
let inp = [];
let ans = [];
let run = false;

function load() {
  canvas = document.querySelector('.canvas');
  ctx = canvas.getContext('2d');
  canvas.width = width;
  canvas.height = height;
  document.onkeydown = keyPress;
  for(let i = 0; i < width; i++) {
    const j = f(i / width);
    const netJ = net.pass([i / width])[0];
    ctx.strokeStyle = 'green'
    ctx.strokeRect(i, j * height, 1, 1);
    ctx.strokeStyle = 'white';
    ctx.strokeRect(i, netJ * height, 1, 1);
    if(i % 5 == 0) {
      inp.push([i / width]);
      ans.push([j]);
    }
  }
}

function train() {
  //net.trainBatch(inp, ans, .5);
  for(let i = 0; i < inp.length; i++) {
    net.trainBatch([inp[i]], [ans[i]], .1);
  }
  drawNet();
  if(!run) {
    return;
  }
  requestAnimationFrame(train);
}

function drawNet() {
  ctx.clearRect(0, 0, width, height);
  for(let i = 0; i < width; i++) {
    const j = f(i / width);
    const netJ = net.pass([i / width])[0];
    ctx.strokeStyle = 'green'
    ctx.strokeRect(i, j * height, 1, 1);
    ctx.strokeStyle = 'white';
    ctx.strokeRect(i, netJ * height, 1, 1);
  }
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
    run = !run;
    if(run) {
      train();
    }
  }
}

function leftClick() {
  const x = event.clientX;
  const y = event.clientY;
}