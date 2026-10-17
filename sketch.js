// constantes de matematica 
const half_pi = Math.PI / 2;
const two_pi = Math.PI * 2;

// variables del portal
let portalSize = 0;
let portalTarget = 260;
let portalState = "cerrado";
let portalX = 0;
let portalY = 0;
let portalNumero = 0;
let portalTimer = 0;

let visitantes = [
  { portalX: 0.3, fondo: [10, 15, 40], luz: [255, 210, 120] },
  { portalX: 0.7, fondo: [30, 12, 22], luz: [150, 220, 255] }
];

let sparks = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  strokeWeight(1);
  for (let y = 0; y < height; y++) {
    //map funcion que toma un valor y lo mapea a un rango de colores
    let r = map(y, 0, height, 15, 35);
    let g = map(y, 0, height, 8, 20);
    let b = map(y, 0, height, 35, 65);

    stroke(r, g, b);
    line(0, y, width, y);
  }

  let floorY = height * 0.85;
  stroke(10, 8, 15);
  strokeWeight(3);
  line(0, floorY, width, floorY);

  // estados del portal
  if (portalState === "abriendo") {
    portalSize = 0.06 * portalTarget + 0.94 * portalSize;
    if (portalSize >= portalTarget - 2) {
      portalSize = portalTarget;
      portalState = "abierto";
      portalTimer = 0;
    }
  } else if (portalState === "abierto") {
    portalTimer++;
    if (portalTimer === 220) {
      portalState = "cerrando";
    }
  } else if (portalState === "cerrando") {
    portalSize = 0.85 * portalSize;
    if (portalSize < 2) {
      portalSize = 0;
      if (portalNumero === visitantes.length) {
        portalState = "fin";
      } else {
        portalState = "cerrado";
      }
    }
  }

  let progreso = portalSize / portalTarget;

  if (portalSize > 1) {
    let v = visitantes[portalNumero - 1];
    noStroke();
    fill(v.fondo[0], v.fondo[1], v.fondo[2]);
    circle(portalX, portalY, portalTarget * progreso);
    fill(v.luz[0], v.luz[1], v.luz[2], 120);
    circle(portalX + 40 * progreso, portalY - 30 * progreso, 30 * progreso);
  }

  if (portalSize > 1) {
    dibujarAro(progreso);
  }

  dibujarChispas();

  noStroke();
  fill(255);
  textSize(12);
  if (portalState === "cerrado") {
    text("espacio: abrir el portal " + (portalNumero + 1) + " de " + visitantes.length, 20, 30);
  } else if (portalState === "fin") {
    text("espacio: empezar de nuevo", 20, 30);
  } else {
    text("portal " + portalNumero + ": " + portalState, 20, 30);
  }
}

function abrirPortal(x, y) {
  portalNumero++;
  portalSize = 0;
  portalX = x;
  portalY = y;
  portalState = "abriendo";
}

function dibujarAro(progreso) {
  let inicio = -half_pi;
  let fin = inicio + two_pi * progreso;
  let radio = portalTarget / 2;

  noStroke();
  fill(255, 140, 20, 40 * progreso);
  circle(portalX, portalY, portalTarget * progreso);

  noFill();
  stroke(255, 100, 0, 45);
  strokeWeight(26);
  trazoAro(fin);
  stroke(255, 150, 30, 130);
  strokeWeight(12);
  trazoAro(fin);
  stroke(255, 235, 160);
  strokeWeight(4);
  trazoAro(fin);

  // chispas repartidas por la parte del aro que ya esta formada
  for (let i = 0; i < 8; i++) {
    let angulo = random(inicio, fin);
    crearChispa(portalX + cos(angulo) * radio, portalY + sin(angulo) * radio);
  }

  // mas chispas en la punta mientras el aro se esta cerrando
  if (progreso < 0.99 && portalState === "abriendo") {
    for (let i = 0; i < 4; i++) {
      crearChispa(portalX + cos(fin) * radio, portalY + sin(fin) * radio);
    }
  }
}

function trazoAro(fin) {
  if (fin - -half_pi >= two_pi - 0.001) {
    circle(portalX, portalY, portalTarget);
  } else {
    arc(portalX, portalY, portalTarget, portalTarget, -half_pi, fin);
  }
}

// crear una chispa nueva y guardarla en el array
function crearChispa(x, y) {
  sparks.push({
    x: x,
    y: y,
    vx: random(-1.5, 1.5),
    vy: random(-1.5, 1.5),
    life: 255,
    size: random(2, 6),
  });
}

function dibujarChispas() {
  noStroke();
  for (let i = sparks.length - 1; i >= 0; i--) {
    let s = sparks[i];
    s.x += s.vx;
    s.y += s.vy;
    s.vy += 0.03;
    s.life -= 5;
    fill(255, random(120, 200), 30, s.life);
    circle(s.x, s.y, s.size);
    // splice elimina un elemento del array
    if (s.life <= 0) {
      sparks.splice(i, 1);
    }
  }
}

// espacio: abre el siguiente portal, o reinicia la escena al terminar
function keyPressed() {
  if (key === " ") {
    if (portalState === "cerrado") {
      let v = visitantes[portalNumero];
      abrirPortal(width * v.portalX, height * 0.45);
    } else if (portalState === "fin") {
      portalNumero = 0;
      sparks = [];
      portalState = "cerrado";
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}