// constantes de matematica
const medio_pi = Math.PI / 2;
const dos_pi = Math.PI * 2;

// variables del portal
let portalTamano = 0;
let portalObjetivo = 210;
let portalEstado = "cerrado";
let portalX = 0;
let portalY = 0;
let portalNumero = 0;
let portalTemporizador = 0;

let visitantes = [
  {
    portalX: 0.3,
    lugar: "callejon",
    pies: 0.92,
    destino: 0.42,
    piel: [205, 165, 140],
    traje: [175, 35, 40],
    detalle: [28, 38, 95],
  },
  {
    portalX: 0.7,
    lugar: "sala",
    pies: 0.92,
    destino: 0.58,
    piel: [205, 165, 140],
    traje: [85, 72, 52],
    detalle: [38, 38, 46],
    camisa: [110, 125, 118],
  },
];

const personajeEscala = 1.05;
const personajeEscalaFinal = 1.25;

let chispas = [];
let personajes = [];

let pisoY = 0;

let trazo = [];
let dibujando = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  pisoY = height * 0.78;
}

function draw() {
  pisoY = height * 0.78;
  dibujarSala();

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
    if (portalTemporizador === 50) {
      personajes[personajes.length - 1].saliendo = true;
    }
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
    noStroke();
    fill(255, 120, 20, 45 * progreso);
    rect(0, 0, width, height);
  }

  if (portalTamano > 1) {
    let visitante = visitantes[portalNumero - 1];
    push();
    noStroke();
    beginClip();
    circle(portalX, portalY, portalTamano);
    endClip();
    dibujarLugar(visitante.lugar);
    let actual = personajes[personajes.length - 1];
    if (!actual.saliendo) {
      dibujarPersonaje(actual);
    }
    pop();
  }
  for (let personaje of personajes) {
    if (personaje.saliendo) {
      moverPersonaje(personaje);
      dibujarPersonaje(personaje);
    }
  }

  if (portalTamano > 1) {
    dibujarAro(progreso);
  }

  dibujarChispas();

  if (dibujando && trazo.length > 1) {
    noFill();
    stroke(255, 235, 160, 200);
    strokeWeight(3);
    beginShape();
    for (let p of trazo) {
      // Vertex (x de pantalla y y de pantalla son los vertices)
      vertex(p.x, p.y);
    }
    endShape();
  }

  noStroke();
  fill(255);
  textSize(12);
  if (portalEstado === "cerrado") {
    text(
      "dibujá un círculo con el mouse (portal " +
        (portalNumero + 1) +
        " de " +
        visitantes.length +
        ")",
      20,
      30,
    );
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

  let visitante = visitantes[portalNumero - 1];
  personajes.push({
    x: x,
    y: y - portalObjetivo / 2 + portalObjetivo * visitante.pies,
    escala: personajeEscala,
    piel: visitante.piel,
    traje: visitante.traje,
    detalle: visitante.detalle,
    camisa: visitante.camisa,
    destinoX: width * visitante.destino,
    destinoY: pisoY + 30,
    saliendo: false,
  });
}

function dibujarSala() {
  strokeWeight(1);
  for (let y = 0; y < pisoY; y++) {
    // map (valor, valorMinimo, valorMaximo, nuevoMinimo, nuevoMaximo)
    let rojo = map(y, 0, pisoY, 55, 125);
    let verde = map(y, 0, pisoY, 34, 78);
    let azul = map(y, 0, pisoY, 20, 42);
    stroke(rojo, verde, azul);
    line(0, y, width, y);
  }

  for (let y = pisoY; y < height; y++) {
    let rojo = map(y, pisoY, height, 78, 38);
    let verde = map(y, pisoY, height, 50, 24);
    let azul = map(y, pisoY, height, 30, 15);
    stroke(rojo, verde, azul);
    line(0, y, width, y);
  }
  noStroke();

  fill(40, 55, 85);
  rect(width * 0.05, height * 0.14, width * 0.09, pisoY - height * 0.24);
  fill(100, 45, 35);
  rect(width * 0.03, height * 0.1, width * 0.025, pisoY - height * 0.12);
  rect(width * 0.135, height * 0.1, width * 0.025, pisoY - height * 0.12);

  fill(45, 28, 18);
  rect(0, pisoY - 6, width, 6);

  let lamparaX = width * 0.5;
  fill(70, 45, 30);
  rect(lamparaX - 45, pisoY - 70, 90, 70);
  fill(255, 200, 110, 28);
  circle(lamparaX, pisoY - 125, 240);
  fill(255, 200, 110, 55);
  circle(lamparaX, pisoY - 125, 140);
  fill(60, 40, 25);
  rect(lamparaX - 3, pisoY - 100, 6, 30);
  fill(238, 178, 92);
  quad(
    lamparaX - 22,
    pisoY - 100,
    lamparaX + 22,
    pisoY - 100,
    lamparaX + 34,
    pisoY - 148,
    lamparaX - 34,
    pisoY - 148,
  );

  let estanteX = width * 0.88;
  let estanteAncho = width * 0.09;
  let estanteAlto = pisoY - height * 0.18;
  fill(110, 66, 34);
  rect(estanteX, height * 0.18, estanteAncho, estanteAlto);
  fill(70, 42, 22);
  for (let i = 1; i < 4; i++) {
    rect(estanteX, height * 0.18 + (i * estanteAlto) / 4 - 3, estanteAncho, 6);
  }
  fill(228, 130, 40);
  circle(
    estanteX + estanteAncho * 0.3,
    height * 0.18 + estanteAlto / 4 - 14,
    22,
  );
  circle(
    estanteX + estanteAncho * 0.7,
    height * 0.18 + estanteAlto / 2 - 12,
    18,
  );
  circle(
    estanteX + estanteAncho * 0.4,
    height * 0.18 + (estanteAlto * 3) / 4 - 14,
    20,
  );
}

function dibujarPersonaje(personaje) {
  push();
  translate(personaje.x, personaje.y - 90 * personaje.escala);
  scale(personaje.escala);
  noStroke();

  fill(personaje.traje[0], personaje.traje[1], personaje.traje[2]);
  rect(-18, -10, 36, 60);
  rect(-34, -8, 14, 40);
  rect(20, -8, 14, 40);

  if (personaje.camisa) {
    fill(personaje.camisa[0], personaje.camisa[1], personaje.camisa[2]);
    rect(-7, -10, 14, 60);
  }

  fill(personaje.detalle[0], personaje.detalle[1], personaje.detalle[2]);
  rect(-16, 50, 14, 40);
  rect(2, 50, 14, 40);

  fill(personaje.piel[0], personaje.piel[1], personaje.piel[2]);
  circle(0, -28, 34);
  pop();
}

function moverPersonaje(personaje) {
  personaje.x = 0.04 * personaje.destinoX + 0.96 * personaje.x;
  personaje.y = 0.04 * personaje.destinoY + 0.96 * personaje.y;
  personaje.escala = 0.04 * personajeEscalaFinal + 0.96 * personaje.escala;
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
  } else if (lugar === "sala") {
    for (let i = 0; i < tam; i++) {
      let rojo = map(i, 0, tam, 10, 26);
      let verde = map(i, 0, tam, 10, 20);
      let azul = map(i, 0, tam, 18, 18);
      stroke(rojo, verde, azul);
      line(izq, arriba + i, izq + tam, arriba + i);
    }
    noStroke();

    fill(22, 32, 58);
    rect(izq + tam * 0.1, arriba + tam * 0.2, tam * 0.32, tam * 0.45);

    fill(14, 18, 34);
    for (let i = 0; i < 4; i++) {
      let alto = tam * 0.08 + ((i * 53) % 25);
      rect(
        izq + tam * 0.1 + i * tam * 0.08,
        arriba + tam * 0.65 - alto,
        tam * 0.07,
        alto,
      );
    }

    let centroX = izq + tam * 0.2;
    fill(32, 38, 62);
    rect(centroX - tam * 0.04, arriba + tam * 0.45, tam * 0.08, tam * 0.2);
    rect(centroX - tam * 0.03, arriba + tam * 0.37, tam * 0.06, tam * 0.08);
    fill(220, 235, 255);
    rect(centroX - tam * 0.02, arriba + tam * 0.29, tam * 0.04, tam * 0.08);
    rect(centroX - tam * 0.007, arriba + tam * 0.22, tam * 0.014, tam * 0.07);
    fill(200, 225, 255, 40);
    circle(centroX, arriba + tam * 0.3, tam * 0.16);

    stroke(10, 10, 14);
    strokeWeight(3);
    line(
      izq + tam * 0.26,
      arriba + tam * 0.2,
      izq + tam * 0.26,
      arriba + tam * 0.65,
    );
    line(
      izq + tam * 0.1,
      arriba + tam * 0.42,
      izq + tam * 0.42,
      arriba + tam * 0.42,
    );
    noStroke();

    fill(26, 20, 18);
    rect(izq, arriba + tam * 0.72, tam, tam);
    fill(30, 22, 18);
    rect(izq + tam * 0.62, arriba + tam * 0.5, tam * 0.3, tam * 0.3);

    fill(255, 200, 120, 200);
    circle(izq + tam * 0.5, arriba + tam * 0.05, tam * 0.03);
    circle(izq + tam * 0.56, arriba + tam * 0.07, tam * 0.025);
    circle(izq + tam * 0.44, arriba + tam * 0.07, tam * 0.025);
  }
}

function dibujarAro(progreso) {
  let inicio = -medio_pi;
  let fin = inicio + dos_pi * progreso;
  let radio = portalTamano / 2;

  noStroke();
  fill(255, 140, 20, 40 * progreso);
  circle(portalX, portalY, portalTamano);

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
    circle(portalX, portalY, portalTamano);
  } else {
    // (x, y, ancho, alto, anguloInicio, anguloFin) (dibuja solo una parte del círculo)
    arc(portalX, portalY, portalTamano, portalTamano, -medio_pi, fin);
  }
}

// crear una chispa nueva
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

// espacio: abre el siguiente portal, o reinicia la escena al terminar
function keyPressed() {
  if (key === " ") {
    if (portalEstado === "cerrado") {
      let visitante = visitantes[portalNumero];
      abrirPortal(width * visitante.portalX, pisoY - portalObjetivo / 2 + 8);
    } else if (portalEstado === "fin") {
      portalNumero = 0;
      chispas = [];
      personajes = [];
      portalEstado = "cerrado";
    }
  }
}

function mousePressed() {
  if (portalEstado === "cerrado") {
    trazo = [{ x: mouseX, y: mouseY }];
    dibujando = true;
  }
}

function mouseDragged() {
  if (dibujando) {
    trazo.push({ x: mouseX, y: mouseY });
    crearChispa(mouseX, mouseY);
  }
}

function mouseReleased() {
  if (!dibujando) return;
  dibujando = false;

  let centro = esCirculo(trazo);
  if (centro && portalEstado === "cerrado") {
    let radio = portalObjetivo / 2;
    let x = centro.x;
    if (x < radio) x = radio;
    if (x > width - radio) x = width - radio;

    abrirPortal(x, pisoY - portalObjetivo / 2 + 8);
  }
  trazo = [];
}

// devuelve el centro {x, y} si el recorrido es un círculo, o null si no
function esCirculo(puntos) {
  if (puntos.length < 20) return null;

  // 1. la caja que rodea el trazo
  let izq = puntos[0].x;
  let der = puntos[0].x;
  let arriba = puntos[0].y;
  let abajo = puntos[0].y;
  for (let p of puntos) {
    if (p.x < izq) izq = p.x;
    if (p.x > der) der = p.x;
    if (p.y < arriba) arriba = p.y;
    if (p.y > abajo) abajo = p.y;
  }
  let ancho = der - izq;
  let alto = abajo - arriba;

  // 2. tiene que ser grande y más o menos cuadrada
  if (ancho < 60 || alto < 60) return null;
  if (ancho > alto * 1.5 || alto > ancho * 1.5) return null;

  // 3. centro y radio
  let cx = (izq + der) / 2;
  let cy = (arriba + abajo) / 2;
  let radio = (ancho + alto) / 4;

  // 4. empezó y terminó cerca: cerró el círculo
  let primero = puntos[0];
  let ultimo = puntos[puntos.length - 1];
  let margen = radio * 0.7;
  if (
    ultimo.x < primero.x - margen ||
    ultimo.x > primero.x + margen ||
    ultimo.y < primero.y - margen ||
    ultimo.y > primero.y + margen
  ) {
    return null;
  }

  // 5. ningún punto pasa por el medio
  for (let p of puntos) {
    if (
      p.x > cx - radio * 0.5 &&
      p.x < cx + radio * 0.5 &&
      p.y > cy - radio * 0.5 &&
      p.y < cy + radio * 0.5
    ) {
      return null;
    }
  }

  return { x: cx, y: cy };
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
