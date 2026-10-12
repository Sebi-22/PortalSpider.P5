let portalSize= 0;
const portalTarget = 200;
let portalState = "cerrado";


function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  for (let y = 0; y < height; y++) {
    let r = map(y, 0, height, 15, 35);
    let g = map(y, 0, height, 8, 20);
    let b = map(y, 0, height, 35, 65);

    stroke(r, g, b);
    line(0, y, width, y);
  }

  let floorY = height * 0.85;

  stroke(10,8,15);
  strokeWeight(3);
  line(0, floorY, width, floorY);

  if (portalState === "abriendo") {
    portalSize = 0.1 * portalTarget + 0.9 * portalSize;
  }

  noStroke();
  fill(255, 0, 255);
  circle(width / 2, height * 0.55, portalSize);
}

function keyPressed() {
  if (key === ' ' && portalState === "cerrado"){
    portalState = "abriendo";
  }
}

