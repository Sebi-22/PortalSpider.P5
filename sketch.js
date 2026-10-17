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
  { portalX: 0.3, lugar: "callejon" },
  { portalX: 0.7, lugar: "terraza" }
];

let sparks = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  strokeWeight(1);
  for (let y = 0; y < height; y++) {
    //map funcion (valor, valorMinimo, valorMaximo, nuevoValorMinimo, nuevoValorMaximo)
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
  push();
  noStroke();
  beginClip();
  circle(portalX, portalY, portalSize);
  endClip();
  dibujarLugar(v.lugar);
  pop();
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

function dibujarLugar(lugar) {
  let tam = portalTarget;
  let izq = portalX - tam / 2;
  let arriba = portalY - tam / 2;

  if (lugar === "callejon") {
    for (let i = 0; i < tam; i++) {
      let r = map(i, 0, tam, 8, 34);
      let g = map(i, 0, tam, 12, 30);
      let b = map(i, 0, tam, 18, 26);
      stroke(r, g, b);
      line(izq, arriba + i, izq + tam, arriba + i);
    }
    noStroke();

    fill(12, 14, 20);
    rect(izq + tam * 0.2, arriba + tam * 0.18, tam * 0.22, tam * 0.5);
    rect(izq + tam * 0.55, arriba + tam * 0.25, tam * 0.2, tam * 0.43);

    fill(16, 17, 22);
    rect(izq, arriba, tam * 0.15, tam);
    rect(izq + tam * 0.85, arriba, tam * 0.15, tam);

    fill(90, 65, 30, 160);
    rect(izq + tam * 0.04, arriba + tam * 0.5, tam * 0.07, tam * 0.2);

    fill(24, 26, 32);
    rect(izq, arriba + tam * 0.66, tam, tam);
    fill(255, 225, 170, 35);
    ellipse(izq + tam * 0.45, arriba + tam * 0.82, tam * 0.1, tam * 0.3);

    fill(225, 230, 235, 35);
    circle(izq + tam * 0.25, arriba + tam * 0.68, tam * 0.25);
    circle(izq + tam * 0.33, arriba + tam * 0.6, tam * 0.18);
    circle(izq + tam * 0.65, arriba + tam * 0.64, tam * 0.28);
    circle(izq + tam * 0.72, arriba + tam * 0.55, tam * 0.18);

    fill(255, 235, 190, 25);
    circle(izq + tam * 0.45, arriba + tam * 0.1, tam * 0.4);
    fill(255, 235, 190, 60);
    circle(izq + tam * 0.45, arriba + tam * 0.1, tam * 0.22);
    fill(255, 245, 210);
    circle(izq + tam * 0.45, arriba + tam * 0.1, tam * 0.035);
  } else if (lugar === "terraza") {
    for (let i = 0; i < tam; i++) {
      let r = map(i, 0, tam, 6, 24);
      let g = map(i, 0, tam, 8, 30);
      let b = map(i, 0, tam, 18, 52);
      stroke(r, g, b);
      line(izq, arriba + i, izq + tam, arriba + i);
    }
    noStroke();


    fill(14, 18, 32);
    for (let i = 0; i < 8; i++) {
      let alto = tam * 0.12 + ((i * 53) % 40);
      rect(izq + i * tam * 0.14, arriba + tam * 0.62 - alto, tam * 0.13, alto);
    }

    let cx = izq + tam * 0.2;
    fill(32, 38, 62);
    rect(cx - tam * 0.05, arriba + tam * 0.42, tam * 0.1, tam * 0.22);
    rect(cx - tam * 0.035, arriba + tam * 0.32, tam * 0.07, tam * 0.1);
    fill(220, 235, 255);
    rect(cx - tam * 0.022, arriba + tam * 0.24, tam * 0.044, tam * 0.08);
    rect(cx - tam * 0.008, arriba + tam * 0.15, tam * 0.016, tam * 0.09);
    fill(200, 225, 255, 40);
    circle(cx, arriba + tam * 0.24, tam * 0.16);

    fill(28, 26, 34);
    rect(izq, arriba + tam * 0.72, tam, tam);

    stroke(12, 14, 22);
    strokeWeight(3);
    line(izq, arriba + tam * 0.62, izq + tam, arriba + tam * 0.62);
    strokeWeight(2);
    for (let x = 0; x <= tam; x += 20) {
      line(izq + x, arriba + tam * 0.62, izq + x, arriba + tam * 0.72);
    }
    noStroke();

    fill(255, 200, 120, 200);
    circle(izq + tam * 0.5, arriba + tam * 0.05, tam * 0.03);
    circle(izq + tam * 0.56, arriba + tam * 0.07, tam * 0.025);
    circle(izq + tam * 0.44, arriba + tam * 0.07, tam * 0.025);
  }
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

  for (let i = 0; i < 8; i++) {
    let angulo = random(inicio, fin);
    crearChispa(portalX + cos(angulo) * radio, portalY + sin(angulo) * radio);
  }

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