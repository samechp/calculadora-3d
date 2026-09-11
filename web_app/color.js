// ===== SELECTOR DE COLOR =====
// Un cuadrito de color que se puede pulsar. Al abrirlo salen los colores de
// filamento más comunes, la paleta de Windows y una casilla para escribir el
// código HEX. Sirve para no tener que ir leyendo el nombre del color uno por
// uno: se ve y se elige de un vistazo.
//
// El color vive en el campo "hex" de cada filamento y vale "#rrggbb" o la
// palabra "transparente". Los filamentos guardados antes de que esto existiera
// no lo tienen, así que se adivina a partir del nombre del color.
(function () {

const TRANSPARENTE = 'transparente';
// "Este filamento no lleva color y es a propósito". Hace falta distinguirlo de
// no haber elegido nunca: sin esto, quitarle el color a uno llamado "Rojo" lo
// volvería a pintar de rojo al deducirlo del nombre.
const NINGUNO = 'ninguno';

// Los colores de bobina que se ven a diario. No es una paleta de diseño: son
// los tonos con los que la gente rotula sus filamentos.
const PREDETERMINADOS = [
    { nombre: 'Negro',        hex: '#1b1b1b' },
    { nombre: 'Gris',         hex: '#8a8f93' },
    { nombre: 'Plata',        hex: '#c3c7ca' },
    { nombre: 'Blanco',       hex: '#f2f2ef' },
    { nombre: 'Beige',        hex: '#d8c9ae' },
    { nombre: 'Marrón',       hex: '#6d4c41' },
    { nombre: 'Rojo',         hex: '#c62828' },
    { nombre: 'Vino',         hex: '#7f1d2e' },
    { nombre: 'Naranja',      hex: '#ef6c00' },
    { nombre: 'Amarillo',     hex: '#f2c200' },
    { nombre: 'Verde lima',   hex: '#8bc34a' },
    { nombre: 'Verde',        hex: '#2e7d32' },
    { nombre: 'Turquesa',     hex: '#009688' },
    { nombre: 'Celeste',      hex: '#4fc3f7' },
    { nombre: 'Azul',         hex: '#1565c0' },
    { nombre: 'Azul marino',  hex: '#1a237e' },
    { nombre: 'Morado',       hex: '#7b1fa2' },
    { nombre: 'Lila',         hex: '#9575cd' },
    { nombre: 'Rosa',         hex: '#ec407a' },
    { nombre: 'Dorado',       hex: '#c9a227' },
    { nombre: 'Cobre',        hex: '#b87333' },
    { nombre: 'Transparente', hex: TRANSPARENTE }
];

// Para adivinar el color de los filamentos que solo tienen el nombre escrito.
// Va en español y en inglés porque la gente rotula de las dos formas.
const POR_NOMBRE = {
    'negro': '#1b1b1b', 'black': '#1b1b1b',
    'gris': '#8a8f93', 'grey': '#8a8f93', 'gray': '#8a8f93',
    'plata': '#c3c7ca', 'plateado': '#c3c7ca', 'silver': '#c3c7ca',
    'blanco': '#f2f2ef', 'white': '#f2f2ef',
    'hueso': '#ece5d8', 'marfil': '#ece5d8',
    'beige': '#d8c9ae',
    'marron': '#6d4c41', 'cafe': '#6d4c41', 'brown': '#6d4c41', 'chocolate': '#5d4037',
    'rojo': '#c62828', 'red': '#c62828',
    'vino': '#7f1d2e', 'burdeos': '#7f1d2e', 'granate': '#7f1d2e',
    'naranja': '#ef6c00', 'orange': '#ef6c00',
    'amarillo': '#f2c200', 'yellow': '#f2c200',
    'verde lima': '#8bc34a', 'lima': '#8bc34a', 'lime': '#8bc34a',
    'verde': '#2e7d32', 'green': '#2e7d32',
    'turquesa': '#009688', 'turquoise': '#009688', 'teal': '#009688',
    'celeste': '#4fc3f7', 'cian': '#4fc3f7', 'cyan': '#4fc3f7', 'azul claro': '#4fc3f7',
    'azul': '#1565c0', 'blue': '#1565c0',
    'marino': '#1a237e', 'navy': '#1a237e',
    'morado': '#7b1fa2', 'violeta': '#7b1fa2', 'purple': '#7b1fa2', 'violet': '#7b1fa2',
    'lila': '#9575cd', 'lavanda': '#9575cd',
    'rosa': '#ec407a', 'rosado': '#ec407a', 'pink': '#ec407a',
    'dorado': '#c9a227', 'oro': '#c9a227', 'gold': '#c9a227',
    'cobre': '#b87333', 'copper': '#b87333', 'bronce': '#a97142',
    'transparente': TRANSPARENTE, 'transparent': TRANSPARENTE,
    'natural': TRANSPARENTE, 'clear': TRANSPARENTE, 'cristal': TRANSPARENTE
};

// De más largo a más corto, para que "azul marino" no se quede en "azul".
const CLAVES = Object.keys(POR_NOMBRE).sort((a, b) => b.length - a.length);

const RE_DIACRITICOS = new RegExp('[\\u0300-\\u036f]', 'g');

function normalizar(s) {
    return (s || '').toString().toLowerCase().normalize('NFD').replace(RE_DIACRITICOS, '').trim();
}

function esc(s) {
    return (s || '').toString()
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Deja el valor en "#rrggbb", en "transparente", o en vacío si no se entiende.
function normalizarHex(valor) {
    const v = normalizar(valor);
    if (!v) return '';
    if (v === TRANSPARENTE) return TRANSPARENTE;
    let h = v.replace(/^#/, '');
    if (/^[0-9a-f]{3}$/.test(h)) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    return /^[0-9a-f]{6}$/.test(h) ? '#' + h : '';
}

function hexDeNombre(nombre) {
    const n = normalizar(nombre);
    if (!n) return '';
    for (let i = 0; i < CLAVES.length; i++) {
        const clave = CLAVES[i];
        // Palabra entera: "rojo" casa con "Rojo Sangre" pero no con "rojoscuro".
        const re = new RegExp('(^|[^a-z0-9])' + clave.replace(/ /g, '\\s+') + '($|[^a-z0-9])');
        if (re.test(n)) return POR_NOMBRE[clave];
    }
    return '';
}

// El color de un filamento: el que eligió el usuario o, si nunca eligió
// ninguno, el que se deduce del nombre que le puso.
function hexDeFilamento(f) {
    if (!f) return '';
    if (f.hex === NINGUNO) return '';
    return normalizarHex(f.hex) || hexDeNombre(f.color);
}

function clasesMuestra(hex) {
    if (hex === TRANSPARENTE) return 'muestra-color es-transparente';
    return hex ? 'muestra-color' : 'muestra-color sin-color';
}

function tituloMuestra(hex) {
    if (hex === TRANSPARENTE) return 'Transparente';
    return hex ? hex.toUpperCase() : 'Sin color asignado';
}

// Para las listas que salen en texto plano, donde no cabe un cuadrito: el
// código va escrito al lado del nombre.
function textoColor(f) {
    const h = hexDeFilamento(f);
    if (!h) return '';
    return h === TRANSPARENTE ? ' (transparente)' : ' (' + h.toUpperCase() + ')';
}

// El cuadrito suelto, para listas que se pintan como texto HTML.
function muestraHTML(hex) {
    const h = normalizarHex(hex);
    const estilo = (h && h !== TRANSPARENTE) ? ' style="background:' + h + '"' : '';
    return '<span class="' + clasesMuestra(h) + '" title="' + esc(tituloMuestra(h)) + '"' + estilo + '></span>';
}

function pintarMuestra(el, hex) {
    const h = normalizarHex(hex);
    el.className = clasesMuestra(h);
    el.style.background = (h && h !== TRANSPARENTE) ? h : '';
    el.title = tituloMuestra(h);
}

// ---- El panel que se abre al pulsar el cuadrito ----

let panelAbierto = null;

function cerrarPanel() {
    if (!panelAbierto) return;
    document.removeEventListener('mousedown', alPulsarFuera, true);
    document.removeEventListener('keydown', alTeclear, true);
    window.removeEventListener('resize', cerrarPanel);
    panelAbierto.remove();
    panelAbierto = null;
}

function alPulsarFuera(e) {
    if (!panelAbierto) return;
    if (panelAbierto.contains(e.target) || e.target === panelAbierto._boton) return;
    cerrarPanel();
}

function alTeclear(e) {
    if (e.key === 'Escape' && panelAbierto) { e.preventDefault(); cerrarPanel(); }
}

function colocar(panel, boton) {
    const r = boton.getBoundingClientRect();
    const ancho = panel.offsetWidth, alto = panel.offsetHeight;
    let izq = r.left;
    let arriba = r.bottom + 6;
    if (izq + ancho > window.innerWidth - 8) izq = window.innerWidth - ancho - 8;
    if (izq < 8) izq = 8;
    if (arriba + alto > window.innerHeight - 8) arriba = Math.max(8, r.top - alto - 6);
    panel.style.left = izq + 'px';
    panel.style.top = arriba + 'px';
}

function abrirPanel(boton, opciones) {
    const yaEstaba = panelAbierto && panelAbierto._boton === boton;
    cerrarPanel();
    if (yaEstaba) return;

    const actual = normalizarHex(opciones.leerHex ? opciones.leerHex() : '');
    const panel = document.createElement('div');
    panel._boton = boton;
    panel.className = 'panel-color';
    panel.innerHTML =
        '<div class="panel-color-rejilla">' +
        PREDETERMINADOS.map(c => {
            const h = normalizarHex(c.hex);
            return '<button type="button" class="panel-color-ficha' +
                   (h === TRANSPARENTE ? ' es-transparente' : '') +
                   (h === actual ? ' elegida' : '') +
                   '" data-hex="' + esc(c.hex) + '" data-nombre="' + esc(c.nombre) + '"' +
                   ' title="' + esc(c.nombre) + '"' +
                   (h && h !== TRANSPARENTE ? ' style="background:' + h + '"' : '') + '></button>';
        }).join('') +
        '</div>' +
        '<div class="panel-color-manual">' +
        '  <label class="panel-color-paleta">' +
        '    <i class="bi bi-palette"></i><span>Elegir de la paleta</span>' +
        '    <input type="color" value="' + (actual && actual !== TRANSPARENTE ? actual : '#cccccc') + '">' +
        '  </label>' +
        '  <div class="panel-color-hex">' +
        '    <span>#</span>' +
        '    <input type="text" maxlength="7" spellcheck="false" placeholder="rrggbb" value="' +
             (actual && actual !== TRANSPARENTE ? actual.slice(1) : '') + '">' +
        '  </div>' +
        '</div>' +
        '<button type="button" class="panel-color-quitar">Quitarle el color</button>';

    document.body.appendChild(panel);
    panelAbierto = panel;
    colocar(panel, boton);

    function aplicar(hex, nombre, cerrar) {
        if (opciones.alElegir) opciones.alElegir(hex, nombre || '');
        if (boton.refrescar) boton.refrescar();
        if (cerrar) cerrarPanel();
        else {
            panel.querySelectorAll('.panel-color-ficha').forEach(f => {
                f.classList.toggle('elegida', normalizarHex(f.getAttribute('data-hex')) === normalizarHex(hex));
            });
        }
    }

    panel.querySelectorAll('.panel-color-ficha').forEach(ficha => {
        ficha.addEventListener('click', () => {
            aplicar(normalizarHex(ficha.getAttribute('data-hex')), ficha.getAttribute('data-nombre'), true);
        });
    });

    // El diálogo de color de Windows. Avisa al cerrarse, no mientras se arrastra.
    const paleta = panel.querySelector('.panel-color-paleta input');
    paleta.addEventListener('change', () => {
        const h = normalizarHex(paleta.value);
        panel.querySelector('.panel-color-hex input').value = h ? h.slice(1) : '';
        aplicar(h, '', false);
    });

    const casillaHex = panel.querySelector('.panel-color-hex input');
    casillaHex.addEventListener('input', () => {
        const h = normalizarHex(casillaHex.value);
        if (h && h !== TRANSPARENTE) { paleta.value = h; aplicar(h, '', false); }
    });
    casillaHex.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter') return;
        e.preventDefault();
        const h = normalizarHex(casillaHex.value);
        if (h) aplicar(h, '', true); else cerrarPanel();
    });

    panel.querySelector('.panel-color-quitar').addEventListener('click', () => aplicar(NINGUNO, '', true));

    document.addEventListener('mousedown', alPulsarFuera, true);
    document.addEventListener('keydown', alTeclear, true);
    window.addEventListener('resize', cerrarPanel);
}

// El cuadrito pulsable. Se le dice de dónde leer el color y qué hacer cuando
// el usuario elige otro; el resto lo lleva él.
//   opciones = { leerHex(), alElegir(hex, nombre) }
// "nombre" solo llega con valor cuando se eligió uno de los predeterminados.
function crearSelectorColor(opciones) {
    const boton = document.createElement('button');
    boton.type = 'button';
    boton.setAttribute('aria-label', 'Elegir color');
    boton.refrescar = function () { pintarMuestra(boton, opciones.leerHex ? opciones.leerHex() : ''); };
    boton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        abrirPanel(boton, opciones);
    });
    boton.refrescar();
    return boton;
}

window.Color = {
    TRANSPARENTE: TRANSPARENTE,
    NINGUNO: NINGUNO,
    PREDETERMINADOS: PREDETERMINADOS,
    normalizarHex: normalizarHex,
    hexDeNombre: hexDeNombre,
    hexDeFilamento: hexDeFilamento,
    muestraHTML: muestraHTML,
    textoColor: textoColor,
    crearSelectorColor: crearSelectorColor,
    cerrarPanel: cerrarPanel
};

})();
// ===== FIN SELECTOR DE COLOR =====
