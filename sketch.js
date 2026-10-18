// constantes de matematica 
const medio_pi = Math.PI / 2;
const dos_pi = Math.PI * 2;

// variables del portal
let portalTamano = 0;
let portalObjetivo = 260;
let portalEstado = "cerrado";
let portalX = 0;
let portalY = 0;
let portalNumero = 0;
let portalTemporizador = 0;


let visitantes = [
  { portalX: 0.3, lugar: "callejon", pies: 0.78, traje: [200, 30, 40], detalle: [30, 60, 160] },
  { portalX: 0.7, lugar: "terraza", pies: 0.85, traje: [170, 25, 35], detalle: [20, 30, 90] }
];

// tamano del personaje
const personajeEscala = 0.6;

let chispas = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  strokeWeight(1);
  for (let y = 0; y < height; y++) {
    //map funcion que toma un valor y lo mapea a un rango de colores
    let rojo = map(y, 0, height, 15, 35);
    let verde = map(y, 0, height, 8, 20);
    let azul = map(y, 0, height, 35, 65);

    stroke(rojo, verde, azul);
    line(0, y, width, y);
  }

  let pisoY = height * 0.85;
  stroke(10, 8, 15);
  strokeWeight(3);
  line(0, pisoY, width, pisoY);

  // estados del portal
  if (portalEstado === "abriendo") {
    portalTamano = 0.06 * portalObjetivo + 0.94 * portalTamano;
    if (portalTamano >= portalObjetivo - 2) {
      portalTamano = portalObjetivo;
      portalEstado = "abierto";
      portalTemporizador = 0;
    }
  } else if (portalEstado === "abierto") {
    portalTemporizador++;
    if (portalTemporizador === 220) {
      portalEstado = "cerrando";
    }
  } else if (portalEstado === "cerrando") {
    portalTamano = 0.85 * portalTamano;
    if (portalTamano < 2) {
      portalTamano = 0;
      if (portalNumero === visitantes.length) {
        portalEstado = "fin";
      } else {
        portalEstado = "cerrado";
      }
    }
  }

  let progreso = portalTamano / portalObjetivo;

if (portalTamano > 1) {
  let visitante = visitantes[portalNumero - 1];
  push();
  noStroke();
  beginClip();
  circle(portalX, portalY, portalTamano);
  endClip();
  dibujarLugar(visitante.lugar);
  dibujarPersonaje(portalX, portalY - portalObjetivo / 2 + portalObjetivo * visitante.pies, personajeEscala, visitante.traje, visitante.detalle);
  pop();
}

  if (portalTamano > 1) {
    dibujarAro(progreso);
  }

  dibujarChispas();

  noStroke();
  fill(255);
  textSize(12);
  if (portalEstado === "cerrado") {
    text("espacio: abrir el portal " + (portalNumero + 1) + " de " + visitantes.length, 20, 30);
  } else if (portalEstado === "fin") {
    text("espacio: empezar de nuevo", 20, 30);
  } else {
    text("portal " + portalNumero + ": " + portalEstado, 20, 30);
  }
}

function abrirPortal(x, y) {
  portalNumero++;
  portalTamano = 0;
  portalX = x;
  portalY = y;
  portalEstado = "abriendo";
}

function dibujarPersonaje(x, piesY, escala, traje, detalle) {
  push();
  translate(x, piesY - 90 * escala);
  scale(escala);
  noStroke();

  fill(traje[0], traje[1], traje[2]);
  rect(-18, -10, 36, 60);
  circle(0, -28, 34);

  fill(detalle[0], detalle[1], detalle[2]);
  rect(-34, -8, 14, 40);
  rect(20, -8, 14, 40);
  rect(-16, 50, 14, 40);
  rect(2, 50, 14, 40);
  pop();
}

function dibujarLugar(lugar) {
  let tam = portalObjetivo;
  let izq = portalX - tam / 2;
  let arriba = portalY - tam / 2;

  if (lugar === "callejon") {
    for (let i = 0; i < tam; i++) {
      let rojo = map(i, 0, tam, 8, 34);
      let verde = map(i, 0, tam, 12, 30);
      let azul = map(i, 0, tam, 18, 26);
      stroke(rojo, verde, azul);
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
      let rojo = map(i, 0, tam, 6, 24);
      let verde = map(i, 0, tam, 8, 30);
      let azul = map(i, 0, tam, 18, 52);
      stroke(rojo, verde, azul);
      line(izq, arriba + i, izq + tam, arriba + i);
    }
    noStroke();

   
    fill(14, 18, 32);
    for (let i = 0; i < 8; i++) {
      let alto = tam * 0.12 + ((i * 53) % 40);
      rect(izq + i * tam * 0.14, arriba + tam * 0.62 - alto, tam * 0.13, alto);
    }

    let centroX = izq + tam * 0.2;
    fill(32, 38, 62);
    rect(centroX - tam * 0.05, arriba + tam * 0.42, tam * 0.1, tam * 0.22);
    rect(centroX - tam * 0.035, arriba + tam * 0.32, tam * 0.07, tam * 0.1);
    fill(220, 235, 255);
    rect(centroX - tam * 0.022, arriba + tam * 0.24, tam * 0.044, tam * 0.08);
    rect(centroX - tam * 0.008, arriba + tam * 0.15, tam * 0.016, tam * 0.09);
    fill(200, 225, 255, 40);
    circle(centroX, arriba + tam * 0.24, tam * 0.16);

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
  let inicio = -medio_pi;
  let fin = inicio + dos_pi * progreso;
  let radio = portalObjetivo / 2;

  noStroke();
  fill(255, 140, 20, 40 * progreso);
  circle(portalX, portalY, portalObjetivo * progreso);

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

  if (progreso < 0.99 && portalEstado === "abriendo") {
    for (let i = 0; i < 4; i++) {
      crearChispa(portalX + cos(fin) * radio, portalY + sin(fin) * radio);
    }
  }
}

function trazoAro(fin) {
  if (fin - -medio_pi >= dos_pi - 0.001) {
    circle(portalX, portalY, portalObjetivo);
  } else {
    arc(portalX, portalY, portalObjetivo, portalObjetivo, -medio_pi, fin);
  }
}

// crear una chispa nueva y guardarla en el array
function crearChispa(x, y) {
  chispas.push({
    x: x,
    y: y,
    vx: random(-1.5, 1.5),
    vy: random(-1.5, 1.5),
    vida: 255,
    tamano: random(2, 6),
  });
}

function dibujarChispas() {
  noStroke();
  for (let i = chispas.length - 1; i >= 0; i--) {
    let chispa = chispas[i];
    chispa.x += chispa.vx;
    chispa.y += chispa.vy;
    chispa.vy += 0.03;
    chispa.vida -= 5;
    fill(255, random(120, 200), 30, chispa.vida);
    circle(chispa.x, chispa.y, chispa.tamano);
    // splice elimina un elemento del array
    if (chispa.vida <= 0) {
      chispas.splice(i, 1);
    }
  }
}

function keyPressed() {
  if (key === " ") {
    if (portalEstado === "cerrado") {
      let visitante = visitantes[portalNumero];
      abrirPortal(width * visitante.portalX, height * 0.45);
    } else if (portalEstado === "fin") {
      portalNumero = 0;
      chispas = [];
      portalEstado = "cerrado";
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}