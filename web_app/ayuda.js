// ===== AYUDA CONTEXTUAL =====
// Pone un ícono "i" junto a cada campo/resultado de la app. Al pasar el mouse o
// hacer clic se explica qué es y cómo entra en el cálculo.
(function() {

// --- Textos de ayuda para campos (la clave es el id del input/select) ---
const AYUDA_CAMPOS = {
    // ---------- 1. AJUSTES FIJOS ----------
    filMarca: 'Marca del filamento que vas a registrar en tu base de datos. Ej: Esun, CoLiDo, Creality.',
    filColor: 'Color de ese rollo. Sirve para diferenciar dos filamentos iguales de distinto color.',
    filTipo: 'Material del filamento (PLA, PETG, ABS, TPU, ASA). Es solo una etiqueta para identificarlo.',
    filPrecio:
        'Lo que te cuesta 1 kilo (1.000 g) de ese filamento. De aquí sale el precio del material: ' +
        'gramos usados × precio/kg ÷ 1.000. Si lo compras en dólares, cambia la moneda al lado.',

    precioKwh:
        'Lo que te cobra la empresa de energía por 1 kWh, en pesos. Míralo en tu factura de la luz. ' +
        'Se usa para calcular "Precio luz": (kWh × Watts ÷ 1.000) × horas de impresión.',
    consumoWatts:
        'Cuántos watts consume tu impresora mientras imprime. Una impresora normal de escritorio ronda ' +
        '100-150 W (más si usa cama caliente fuerte). Si no lo sabes, un valor aproximado ya sirve.',
    desgasteMaquina:
        'Cada cuántas horas de uso calculas que tendrás que cambiar repuestos (boquilla, correas, ventiladores...). ' +
        'Ej: 5000. Junto con "Precio Repuestos" reparte ese gasto entre cada impresión: ' +
        '(precio repuestos ÷ estas horas) × horas de impresión.',
    precioRepuestos:
        'Cuánto te cuesta el juego de repuestos/mantenimiento que harías al cumplir las horas de "Desgaste Máquina". ' +
        'No es un gasto por pieza: se reparte entre todas las horas de vida.',
    manoObraHora:
        'Cuánto vale una hora de tu trabajo. Se cobra sobre el tiempo de modelado/preparación y el tiempo de operario, ' +
        'NO sobre las horas que la impresora trabaja sola.',
    margenError:
        'Colchón de seguridad en %. Cubre impresiones fallidas, purga y material desperdiciado. ' +
        'Sube el costo en ese porcentaje y también infla los gramos y el tiempo estimados, para que no te quedes corto. ' +
        'Un valor típico es 5-15%.',
    precioDolar:
        'A cuántos pesos equivale 1 dólar. Solo se usa si algún precio lo pusiste en USD, para convertirlo a COP.',

    // ---------- 2. DATOS DE LA PIEZA ----------
    horasImpresion:
        'Cuánto tarda la impresora en imprimir UNA cama completa. Sácalo del laminador (Cura, Orca, PrusaSlicer...). ' +
        'Con esto se calculan la luz, el desgaste y el tiempo de producción.',
    mainFilamentoSelect:
        'Qué filamento de tu base de datos usa esta pieza y cuántos gramos gasta la CAMA COMPLETA (no una sola pieza). ' +
        'Los gramos los da el laminador. Si el filamento no aparece en la lista, agrégalo primero en ' +
        '"Base de Datos de Filamentos", dentro de Ajustes Fijos.',
    checkVariosFilamentos:
        'Actívalo si la MISMA pieza se imprime con dos o más filamentos a la vez (cambio de color, multimaterial). ' +
        'Podrás indicar los gramos de cada uno por separado.',
    horasInvertidas:
        'Tiempo tuyo, de una sola vez, en modelar/preparar el archivo. Se cobra como mano de obra y NO se multiplica ' +
        'por cada cama: es un costo fijo del trabajo.',
    minutosOperario:
        'Minutos que TÚ inviertes en cada impresión: despegar, limpiar soportes, lijar, empacar. ' +
        'Se cobra como mano de obra y se multiplica por el número de camas.',
    minutosPrepMaquina:
        'Minutos de calentamiento/nivelación de la impresora antes de cada cama. Solo suma al tiempo estimado ' +
        'de producción; no se cobra como mano de obra porque no estás trabajando ahí.',
    unidadesCama:
        'Cuántas copias de la pieza caben en UNA sola impresión. Es la clave del precio unitario: ' +
        'todos los costos de la cama se dividen entre este número. Si imprimes de a una, deja 1.',

    insumosACobrar:
        'Cuánto le cobras al cliente por los insumos extra. Si lo dejas vacío se cobra el costo real. ' +
        'Úsalo para ganarle también a los insumos o para regalarlos poniendo un valor menor.',

    // ---------- CONFIGURACIÓN DE IMPRESIÓN (solo referencia) ----------
    cfgAlturaCapa:
        'Grosor de cada capa en mm. Menos altura = más detalle pero más lento. 0.2 mm es lo normal, ' +
        '0.12 para detalle fino, 0.28 para piezas rápidas. No afecta el precio: es para recordar cómo laminaste.',
    cfgAnchoLineaExterno:
        'Ancho de la línea del contorno visible de la pieza. Suele ir igual al diámetro de la boquilla (0.4 mm).',
    cfgAnchoLineaInterno:
        'Ancho de las líneas de las paredes internas. Normalmente igual o un poco mayor que el perímetro externo.',
    cfgRellenoSolidoSuperior:
        'Espesor en mm de la "tapa" sólida de arriba. Más espesor = superficie superior más pareja y sin huecos.',
    cfgTipoAlisado:
        'Pasada extra de la boquilla sobre las superficies planas para dejarlas más lisas. Tarda más, pero mejora el acabado.',
    cfgBuclesPerimetro:
        'Cuántas paredes (contornos) tiene la pieza. Más bucles = más resistente y más material. 2-3 es lo común.',
    cfgDeteccionDelgados:
        'Hace que el laminador imprima paredes muy finas que normalmente se saltaría. Útil en piezas con detalles delgados.',
    cfgCapasCubiertaSuperior:
        'Número de capas sólidas de la cara superior. Pocas capas dejan huecos o "colchón"; 4-5 suele quedar bien.',
    cfgPatronCubiertaSuperior:
        'Dibujo con el que se rellena la cara de arriba. Monotónico deja el acabado más uniforme; concéntrico sigue la forma.',
    cfgDensidadRelleno:
        'Qué tan llena va la pieza por dentro, en %. 0% hueca, 15-20% normal, 50%+ piezas que aguantan fuerza. ' +
        'Sube el peso y el tiempo, así que impacta el costo real.',
    cfgPatronRelleno:
        'Forma del relleno interno. Rejilla/rectilíneo son rápidos; giroide y cúbico dan más resistencia pareja.',
    cfgVelocidad:
        'Cómo imprimiste: a velocidad normal o a la mitad. La mitad da mejor calidad pero duplica el tiempo.',
    cfgLlevaSoportes:
        'Marca si la pieza necesita soportes. Recuerda que los soportes gastan material extra y suman tiempo de limpieza.',
    cfgCapasInterfazSuperior:
        'Capas de contacto entre el soporte y la pieza por arriba. Más capas = superficie más limpia, pero cuesta más despegar.',
    cfgCapasInterfazInferior:
        'Capas de contacto entre la pieza y el soporte por abajo. Mismo criterio que la interfaz superior.',

    // ---------- PRECIO Y MÁRGENES ----------
    precioVentaPieza:
        'Precio fijo por unidad. Si lo llenas, manda sobre todo el cálculo y el "Total a Cobrar" pasa a ser este valor. ' +
        'Sirve cuando ya tienes un precio de lista o le prometiste un precio al cliente. Vacío = usar el precio calculado.',
    margenGanancia:
        'Multiplicador sobre el costo de impresión. 2 = cobrar el doble del costo, 2.5 = dos veces y media. ' +
        'Ojo: multiplica los materiales/luz/desgaste; la mano de obra y los insumos se suman aparte sin multiplicar.',
    redondeoMode:
        'Redondea hacia arriba el precio final para que quede "bonito". Ej: con múltiplos de 5.000, un precio de ' +
        '12.300 pasa a 15.000.',

    // ---------- 3. PROYECTO ----------
    unidadesPedido:
        'Cuántas unidades te pidieron en total. Con esto se calcula cuántas camas hay que imprimir, ' +
        'cuánto material comprar y el precio del pedido completo.',
    precioUnitarioManual:
        'Precio por unidad pactado con el cliente para este pedido. Si lo llenas, el total del proyecto usa este valor ' +
        'en vez del calculado. Útil para descuentos por cantidad.',
    margenGananciaProyecto:
        'Igual que el margen de la pieza, pero aplicado al proyecto completo. Suele bajarse en pedidos grandes.',
    redondeoModeProyecto: 'Redondea hacia arriba el precio final del proyecto.',

    // ---------- 4. MEGA PROYECTO ----------
    subProjectSelect:
        'Elige un proyecto ya guardado y añádelo a la lista para cotizar varios trabajos distintos en una sola suma.'
};

// Los campos de "Capas Distintas" son los mismos parámetros, aplicados solo a
// las capas superiores, así que reutilizan la explicación del campo equivalente.
const EQUIVALENTES_CAPAS = {
    cfgCapasAnchoLineaExterno: 'cfgAnchoLineaExterno',
    cfgCapasAnchoLineaInterno: 'cfgAnchoLineaInterno',
    cfgCapasRellenoSolidoSuperior: 'cfgRellenoSolidoSuperior',
    cfgCapasTipoAlisado: 'cfgTipoAlisado',
    cfgCapasBuclesPerimetro: 'cfgBuclesPerimetro',
    cfgCapasDeteccionDelgados: 'cfgDeteccionDelgados',
    cfgCapasDistCubiertaSuperior: 'cfgCapasCubiertaSuperior',
    cfgCapasPatronCubiertaSuperior: 'cfgPatronCubiertaSuperior',
    cfgCapasDensidadRelleno: 'cfgDensidadRelleno',
    cfgCapasPatronRelleno: 'cfgPatronRelleno',
    cfgCapasVelocidad: 'cfgVelocidad'
};
Object.keys(EQUIVALENTES_CAPAS).forEach(k => {
    AYUDA_CAMPOS[k] = AYUDA_CAMPOS[EQUIVALENTES_CAPAS[k]] + ' (Aquí aplica solo a las capas distintas de arriba.)';
});

// --- Textos para las filas de resultados (la clave es el id del valor) ---
const AYUDA_RESULTADOS = {
    resMaterial: 'Lo que cuesta el filamento gastado por unidad: gramos × precio del kilo ÷ 1.000, dividido entre las unidades por cama.',
    resLuz: 'Costo de la energía eléctrica: (precio kWh × watts ÷ 1.000) × horas de impresión, repartido entre las unidades de la cama.',
    resDesgaste: 'La parte del mantenimiento de la impresora que le toca a esta pieza: (precio repuestos ÷ horas de desgaste) × horas de impresión.',
    resError: 'El colchón por fallas: el % de margen de error aplicado sobre material + luz + desgaste.',
    resCostoTotal: 'Suma de material + luz + desgaste + margen de error. Es lo que te cuesta imprimir, SIN contar tu tiempo ni los insumos.',
    resInsumos: 'Costo real de los insumos extra (argollas, cajas, imanes, empaque...) que cargaste en la pestaña Insumos.',
    resManoObra: 'Tu trabajo cobrado: valor de tu hora × (tiempo de modelado + tiempo de operario). El tiempo que la impresora trabaja sola no cuenta aquí.',
    resTiempoProduccion: 'Cuánto te toma sacar una cama completa: impresión + calentamiento + tu tiempo de operario (con el colchón de error incluido).',
    resCostoProduccion: 'TODO lo que te cuesta la pieza: costo de impresión + insumos + mano de obra. Vender por debajo de esto es perder plata.',
    resGanancia: 'Lo que te queda limpio: precio de venta menos el costo de impresión y los insumos.',
    resTotalCobrar: 'El precio final sugerido: (costo de impresión × margen de ganancia) + mano de obra + insumos, ya redondeado.',

    // Proyecto
    resUnidadesCamaProyecto: 'Cuántas copias entran en una impresión, tal como lo configuraste en la pieza.',
    resCamas: 'Cuántas impresiones completas hay que hacer para cubrir el pedido (siempre se redondea hacia arriba).',
    resUnidadesProducidas: 'Unidades que salen realmente al llenar todas esas camas.',
    resUnidadesSobrantes: 'Piezas de más que quedan porque la última cama no se llena justo. Te sirven de repuesto o para vender sueltas.',
    resHorasTotales: 'Solo las horas de la impresora trabajando, sumando todas las camas.',
    resTiempoProduccionProyecto: 'Tiempo real del pedido completo: impresión + calentamientos + tu tiempo de operario en cada cama.',
    resGramosTotales: 'Filamento total que vas a gastar en el pedido, con el margen de error incluido.',
    resBobinas: 'Cuántos rollos de 1 kg necesitas comprar. Si se pone en amarillo es que no te alcanza con lo justo.',
    resMaterialesProyecto: 'Costo de imprimir todo el pedido (material + luz + desgaste + error), sin tu tiempo ni insumos.',
    resCostoProdPiezaProyecto: 'Lo que cuesta producir una sola unidad dentro de este pedido, ya con todo incluido.',
    resCostoProdTotalProyecto: 'Lo que cuesta producir el pedido completo. Es tu punto de equilibrio: por debajo de esto, pierdes.',
    resGananciaProyecto: 'La utilidad limpia de todo el pedido.',
    resCostoPorUnidad: 'Precio por unidad al que te queda el pedido, ya con margen aplicado.',
    resTotalProyecto: 'Lo que le cobras al cliente por el pedido completo.',

    // Mega proyecto
    resMegaCostoProdPieza: 'Promedio de lo que cuesta producir una unidad, considerando todos los proyectos del grupo.',
    resMegaCostoProdTotal: 'Costo de producir todos los proyectos agrupados. Tu punto de equilibrio global.',
    resMegaGanancia: 'Utilidad limpia sumando todos los proyectos del grupo.',
    resMegaTotal: 'Lo que le cobras al cliente por todos los proyectos juntos.'
};

// --- Textos para títulos y secciones (la clave es un selector CSS) ---
const AYUDA_SECCIONES = {
    '#ajustesHeader h2':
        'Los datos que casi nunca cambian: tu tarifa de luz, el consumo de la impresora, el mantenimiento, ' +
        'tu hora de trabajo y tus filamentos. Se llenan una vez. Un PERFIL guarda todo esto junto, así que puedes ' +
        'tener uno por impresora o por material y cambiar entre ellos sin volver a escribir nada.',
    '.piece-card .card-header h2':
        'Los datos de UNA pieza: cuánto tarda, cuánto filamento gasta, cuánto tiempo tuyo consume y cuántas caben ' +
        'en una cama. Es lo único que cambia de un trabajo a otro. Abajo puedes guardarla con nombre para reutilizarla.',
    '.results-card .card-header h2':
        'El desglose del precio de UNA unidad. Los dos números que importan: "Costo Total de Producción" es lo que ' +
        'te cuesta (nunca vendas por debajo) y "Total a Cobrar" es el precio sugerido con tu ganancia.',
    '#proyectoSection .card-header h2':
        'Escala la pieza a un pedido grande: dices cuántas unidades te pidieron y calcula camas, rollos, horas y el ' +
        'precio del pedido completo. Es opcional; si solo cotizas una pieza, ignóralo. ' +
        'Un proyecto guardado = una pieza + una cantidad + sus resultados.',
    '#megaProjectSection .card-header h2':
        'Junta varios proyectos ya guardados en una sola cotización. Sirve cuando un cliente pide cosas distintas ' +
        'a la vez y quieres un único total.',
    '.filamentos-manager-section h3':
        'Tu lista de filamentos con su precio por kilo. Regístralos una vez y luego solo los eliges en cada pieza; ' +
        'así cada pieza calcula con el precio del material que realmente usaste.',
    '#tabPartes .tab-section-header > span':
        'Para piezas que se arman con varias partes que NO caben en la misma cama (ej: cuerpo y tapa). ' +
        'Cada parte suma sus horas y gramos, y agrega otra cama, así que el tiempo de operario y de calentamiento se multiplica.',
    '#tabInsumos .tab-section-header > span':
        'Todo lo que no es filamento pero va en el producto o en el envío: argollas, imanes, cajas, bolsas, tornillos, pintura. ' +
        'Se suman al costo de producción y puedes decidir aparte cuánto cobrarlos.',
    '#printConfigToggle .print-config-title':
        'Apuntes de cómo laminaste la pieza. No cambian ningún precio: sirven para volver a imprimirla igual meses después.',
    '#topLayerConfigToggle .print-config-title':
        'Para cuando le pusiste ajustes distintos a las capas de arriba (por ejemplo más relleno o más calidad en la parte visible).'
};

// ================== MOTOR DE LA AYUDA ==================

let tooltip = null;
let botonActivo = null;
let fijado = false;      // clic = queda abierto; hover = se cierra al salir
let timerHover = null;

function crearTooltip() {
    if (tooltip) return tooltip;
    tooltip = document.createElement('div');
    tooltip.className = 'help-tip';
    tooltip.setAttribute('role', 'tooltip');
    document.body.appendChild(tooltip);
    return tooltip;
}

function mostrar(btn, pin) {
    const texto = btn.getAttribute('data-help');
    if (!texto) return;
    const t = crearTooltip();
    t.textContent = texto;
    t.style.visibility = 'hidden';
    t.classList.add('visible');

    const r = btn.getBoundingClientRect();
    const ancho = t.offsetWidth;
    const alto = t.offsetHeight;
    const margen = 8;

    // Centrado bajo el ícono, sin salirse de la ventana
    let left = r.left + r.width / 2 - ancho / 2;
    left = Math.max(margen, Math.min(left, window.innerWidth - ancho - margen));

    let top = r.bottom + 6;
    if (top + alto > window.innerHeight - margen) {
        const arriba = r.top - alto - 6;
        top = arriba > margen ? arriba : Math.max(margen, window.innerHeight - alto - margen);
    }

    t.style.left = left + 'px';
    t.style.top = top + 'px';
    t.style.visibility = 'visible';

    if (botonActivo && botonActivo !== btn) botonActivo.classList.remove('open');
    btn.classList.add('open');
    botonActivo = btn;
    fijado = !!pin;
}

function ocultar() {
    if (tooltip) tooltip.classList.remove('visible');
    if (botonActivo) botonActivo.classList.remove('open');
    botonActivo = null;
    fijado = false;
}

function nuevoBoton(texto) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'help-i';
    b.tabIndex = -1;
    b.setAttribute('aria-label', 'Qué es esto');
    b.setAttribute('data-help', texto);
    b.textContent = 'i';
    return b;
}

function yaTieneAyuda(el) {
    return !!(el && el.querySelector && el.querySelector(':scope > .help-i'));
}

// Busca la etiqueta visible de un campo: primero <label for>, si no la label
// que esté dentro del mismo .input-group.
function etiquetaDe(id) {
    const porFor = document.querySelector(`label[for="${id}"]`);
    if (porFor) return porFor;
    const campo = document.getElementById(id);
    if (!campo) return null;
    const grupo = campo.closest('.input-group');
    return grupo ? grupo.querySelector('label') : null;
}

function montar() {
    // Campos
    Object.keys(AYUDA_CAMPOS).forEach(id => {
        const label = etiquetaDe(id);
        if (!label || yaTieneAyuda(label)) return;
        label.appendChild(nuevoBoton(AYUDA_CAMPOS[id]));
    });

    // Resultados: el ícono va como hermano del texto, no dentro,
    // porque algunas de esas etiquetas se reescriben al recalcular.
    Object.keys(AYUDA_RESULTADOS).forEach(id => {
        const valor = document.getElementById(id);
        if (!valor) return;
        const fila = valor.closest('.result-item');
        if (!fila || yaTieneAyuda(fila)) return;
        const etiqueta = fila.firstElementChild;
        if (!etiqueta) return;
        etiqueta.insertAdjacentElement('afterend', nuevoBoton(AYUDA_RESULTADOS[id]));
    });

    // Títulos de sección
    Object.keys(AYUDA_SECCIONES).forEach(sel => {
        const el = document.querySelector(sel);
        if (!el || yaTieneAyuda(el)) return;
        el.appendChild(nuevoBoton(AYUDA_SECCIONES[sel]));
    });
}

// --- Interacción ---
document.addEventListener('click', (e) => {
    const btn = e.target.closest ? e.target.closest('.help-i') : null;
    if (btn) {
        // Varias etiquetas envuelven un checkbox: sin esto, el clic lo marcaría
        e.preventDefault();
        e.stopPropagation();
        if (botonActivo === btn && fijado) ocultar();
        else mostrar(btn, true);
        return;
    }
    if (fijado) ocultar();
}, true);

document.addEventListener('mouseover', (e) => {
    const btn = e.target.closest ? e.target.closest('.help-i') : null;
    if (!btn || btn === botonActivo) return;
    clearTimeout(timerHover);
    // Si había uno fijado con clic, al pasar por otro ícono se cambia a ese
    timerHover = setTimeout(() => mostrar(btn, fijado), 180);
});

document.addEventListener('mouseout', (e) => {
    const btn = e.target.closest ? e.target.closest('.help-i') : null;
    if (!btn) return;
    clearTimeout(timerHover);
    if (!fijado && botonActivo === btn) ocultar();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && botonActivo) ocultar();
});

window.addEventListener('resize', ocultar);
// Al hacer scroll el tooltip quedaría flotando lejos de su ícono
window.addEventListener('scroll', ocultar, true);

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', montar);
} else {
    montar();
}

// Por si alguna sección se dibuja después (pestañas, listas dinámicas)
window.montarAyuda = montar;

})();
// ===== FIN AYUDA CONTEXTUAL =====
