
const state = {
    profiles: {},
    pieces: {},
    projects: {},
    megaProjects: {},
    currentProfile: null,
    currentPiece: null,
    currentProject: null,
    currentMegaProject: null,
    megaProjectItems: [],
    precioDolar: 3600,
    resultadosEnUSD: false,
    filamentosGuardados: []
};

// Elementos UI
const els = {
    // Inputs Fijos
    precioKg: document.getElementById('precioKg'),
    // Multi-Filamento
    filMarca: document.getElementById('filMarca'),
    filColor: document.getElementById('filColor'),
    filTipo: document.getElementById('filTipo'),
    filPrecio: document.getElementById('filPrecio'),
    filMoneda: document.getElementById('filMoneda'),
    btnSaveFilamento: document.getElementById('btnSaveFilamento'),
    filamentosList: document.getElementById('filamentosList'),
    mainFilamentoSelect: document.getElementById('mainFilamentoSelect'),
    checkVariosFilamentos: document.getElementById('checkVariosFilamentos'),
    variosFilamentosSection: document.getElementById('variosFilamentosSection'),
    filamentosExtraContainer: document.getElementById('filamentosExtraContainer'),
    btnAñadirFilamentoExtra: document.getElementById('btnAñadirFilamentoExtra'),
    btnExportBom: document.getElementById('btnExportBom'),
    monedaFilamento: document.getElementById('monedaFilamento'),
    precioKwh: document.getElementById('precioKwh'),
    consumoWatts: document.getElementById('consumoWatts'),
    desgasteMaquina: document.getElementById('desgasteMaquina'),
    precioRepuestos: document.getElementById('precioRepuestos'),
    monedaRepuestos: document.getElementById('monedaRepuestos'),
    manoObraHora: document.getElementById('manoObraHora'),
    margenError: document.getElementById('margenError'),
    
    // Inputs Pieza
    horasImpresion: document.getElementById('horasImpresion'),
    minutosImpresion: document.getElementById('minutosImpresion'),
    gramosFilamento: document.getElementById('gramosFilamento'),
    colorPrincipal: document.getElementById('colorPrincipal'),
    btnAddParte: document.getElementById('btnAddParte'),
    partesExtraContainer: document.getElementById('partesExtraContainer'),
    horasInvertidas: document.getElementById('horasInvertidas'),
    minutosInvertidas: document.getElementById('minutosInvertidas'),
    minutosOperario: document.getElementById('minutosOperario'),
    minutosPrepMaquina: document.getElementById('minutosPrepMaquina'),
    insumosACobrar: document.getElementById('insumosACobrar'),
    monedaInsumosACobrar: document.getElementById('monedaInsumosACobrar'),
    insumosExtraContainerPieza: document.getElementById('insumosExtraContainerPieza'),
    insumosResumenPieza: document.getElementById('insumosResumenPieza'),
    insumoCostoTotalPieza: document.getElementById('insumoCostoTotalPieza'),
    btnAddInsumoPieza: document.getElementById('btnAddInsumoPieza'),

    // Ajustes Dinámicos
    margenGanancia: document.getElementById('margenGanancia'),
    margenGananciaSlider: document.getElementById('margenGananciaSlider'),
    redondeoMode: document.getElementById('redondeoMode'),
    
    // Dólar
    dolarSection: document.getElementById('dolarSection'),
    precioDolar: document.getElementById('precioDolar'),
    
    // Toggle y Botones Export
    toggleMonedaResultados: document.getElementById('toggleMonedaResultados'),
    labelCOP: document.getElementById('labelCOP'),
    labelUSD: document.getElementById('labelUSD'),
    btnExportPdf: document.getElementById('btnExportPdf'),
    btnExportExcel: document.getElementById('btnExportExcel'),
    btnExportProjectPdf: document.getElementById('btnExportProjectPdf'),
    btnExportProjectExcel: document.getElementById('btnExportProjectExcel'),

    // Perfiles de Máquina
    profileSelect: document.getElementById('profileSelect'),
    btnSaveProfile: document.getElementById('btnSaveProfile'),
    btnNewProfile: document.getElementById('btnNewProfile'),
    btnDeleteProfile: document.getElementById('btnDeleteProfile'),
    modal: document.getElementById('profileModal'),
    profileNameInput: document.getElementById('profileNameInput'),
    btnConfirmSave: document.getElementById('btnConfirmSave'),
    btnCancelSave: document.getElementById('btnCancelSave'),

    // Compartir Perfiles
    btnExportProfiles: document.getElementById('btnExportProfiles'),
    btnImportProfiles: document.getElementById('btnImportProfiles'),

    // Piezas
    pieceSelect: document.getElementById('pieceSelect'),
    btnSavePiece: document.getElementById('btnSavePiece'),
    btnDeletePiece: document.getElementById('btnDeletePiece'),
    pieceModal: document.getElementById('pieceModal'),
    pieceNameInput: document.getElementById('pieceNameInput'),
    btnConfirmPiece: document.getElementById('btnConfirmPiece'),
    btnCancelPiece: document.getElementById('btnCancelPiece'),

    // Proyecto / Escalado
    unidadesPedido: document.getElementById('unidadesPedido'),
    unidadesCama: document.getElementById('unidadesCama'),
    precioUnitarioManual: document.getElementById('precioUnitarioManual'),
    projectResults: document.getElementById('projectResults'),
    resCamas: document.getElementById('resCamas'),
    resUnidadesCamaProyecto: document.getElementById('resUnidadesCamaProyecto'),
    resUnidadesProducidas: document.getElementById('resUnidadesProducidas'),
    containerUnidadesSobrantes: document.getElementById('containerUnidadesSobrantes'),
    resUnidadesSobrantes: document.getElementById('resUnidadesSobrantes'),
    resHorasTotales: document.getElementById('resHorasTotales'),
    resTiempoProduccionProyecto: document.getElementById('resTiempoProduccionProyecto'),
    resGramosTotales: document.getElementById('resGramosTotales'),
    resFilamentoProyecto: document.getElementById('resFilamentoProyecto'),
    resLuzProyecto: document.getElementById('resLuzProyecto'),
    resDesgasteProyecto: document.getElementById('resDesgasteProyecto'),
    resMargenErrorProyecto: document.getElementById('resMargenErrorProyecto'),
    resMaterialesProyecto: document.getElementById('resMaterialesProyecto'),
    containerInsumosProyecto: document.getElementById('containerInsumosProyecto'),
    resInsumosProyecto: document.getElementById('resInsumosProyecto'),
    resManoObraProyecto: document.getElementById('resManoObraProyecto'),
    resGananciaProyecto: document.getElementById('resGananciaProyecto'),
    resCostoPorUnidad: document.getElementById('resCostoPorUnidad'),
    resTotalProyecto: document.getElementById('resTotalProyecto'),

    // Margen Proyecto
    margenGananciaProyecto: document.getElementById('margenGananciaProyecto'),
    margenGananciaProyectoSlider: document.getElementById('margenGananciaProyectoSlider'),
    redondeoModeProyecto: document.getElementById('redondeoModeProyecto'),
    // Costos de Producción (Proyecto)
    resCostoProdPiezaProyecto: document.getElementById('resCostoProdPiezaProyecto'),
    resCostoProdTotalProyecto: document.getElementById('resCostoProdTotalProyecto'),

    // Guardar Proyecto
    projectSelect: document.getElementById('projectSelect'),
    btnSaveProject: document.getElementById('btnSaveProject'),
    btnDeleteProject: document.getElementById('btnDeleteProject'),
    projectModal: document.getElementById('projectModal'),
    projectNameInput: document.getElementById('projectNameInput'),
    btnConfirmProject: document.getElementById('btnConfirmProject'),
    btnCancelProject: document.getElementById('btnCancelProject'),
    
    // Mega Proyecto
    subProjectSelect: document.getElementById('subProjectSelect'),
    btnAddSubProject: document.getElementById('btnAddSubProject'),
    megaProjectList: document.getElementById('megaProjectList'),
    megaProjectResults: document.getElementById('megaProjectResults'),
    resMegaCamas: document.getElementById('resMegaCamas'),
    resMegaHoras: document.getElementById('resMegaHoras'),
    resMegaTiempo: document.getElementById('resMegaTiempo'),
    resMegaGramos: document.getElementById('resMegaGramos'),
    resMegaFilamento: document.getElementById('resMegaFilamento'),
    resMegaLuz: document.getElementById('resMegaLuz'),
    resMegaDesgaste: document.getElementById('resMegaDesgaste'),
    resMegaMargenError: document.getElementById('resMegaMargenError'),
    resMegaMateriales: document.getElementById('resMegaMateriales'),
    containerMegaInsumos: document.getElementById('containerMegaInsumos'),
    resMegaInsumos: document.getElementById('resMegaInsumos'),
    resMegaManoObra: document.getElementById('resMegaManoObra'),
    resMegaGanancia: document.getElementById('resMegaGanancia'),
    resMegaTotal: document.getElementById('resMegaTotal'),
    resMegaCostoProdPieza: document.getElementById('resMegaCostoProdPieza'),
    resMegaCostoProdTotal: document.getElementById('resMegaCostoProdTotal'),
    btnExportMegaPdf: document.getElementById('btnExportMegaPdf'),
    btnExportMegaExcel: document.getElementById('btnExportMegaExcel'),
    megaProjectSelect: document.getElementById('megaProjectSelect'),
    btnSaveMegaProject: document.getElementById('btnSaveMegaProject'),
    btnDeleteMegaProject: document.getElementById('btnDeleteMegaProject'),
    megaProjectModal: document.getElementById('megaProjectModal'),
    megaProjectNameInput: document.getElementById('megaProjectNameInput'),
    btnConfirmMegaProject: document.getElementById('btnConfirmMegaProject'),
    btnCancelMegaProject: document.getElementById('btnCancelMegaProject'),

    // Resultados
    resMaterial: document.getElementById('resMaterial'),
    resLuz: document.getElementById('resLuz'),
    resDesgaste: document.getElementById('resDesgaste'),
    resError: document.getElementById('resError'),
    resInsumos: document.getElementById('resInsumos'),
    resManoObra: document.getElementById('resManoObra'),
    resCostoTotal: document.getElementById('resCostoTotal'),
    resTiempoProduccion: document.getElementById('resTiempoProduccion'),
    resCostoProduccion: document.getElementById('resCostoProduccion'),
    labelCostoProduccion: document.getElementById('labelCostoProduccion'),
    containerCostoProduccionCama: document.getElementById('containerCostoProduccionCama'),
    resCostoProduccionCama: document.getElementById('resCostoProduccionCama'),
    resGanancia: document.getElementById('resGanancia'),
    labelGanancia: document.getElementById('labelGanancia'),
    containerGananciaCama: document.getElementById('containerGananciaCama'),
    resGananciaCama: document.getElementById('resGananciaCama'),
    resTotalCobrar: document.getElementById('resTotalCobrar'),
    labelTotalCobrar: document.getElementById('labelTotalCobrar'),
    containerTotalCobrarCama: document.getElementById('containerTotalCobrarCama'),
    resTotalCobrarCama: document.getElementById('resTotalCobrarCama'),
    precioVentaPieza: document.getElementById('precioVentaPieza')
};

// Formato
function formatMoney(value, isUSD) {
    if (isNaN(value)) value = 0;
    return new Intl.NumberFormat(isUSD ? 'en-US' : 'es-CO', {
        style: 'currency',
        currency: isUSD ? 'USD' : 'COP',
        minimumFractionDigits: isUSD ? 2 : 0,
        maximumFractionDigits: isUSD ? 2 : 0
    }).format(value);
}

// Redondeo hacia ARRIBA en múltiplos de 500, 1000 o 5000
function applyRedondeo(value, mode) {
    if (mode === 'none') return value;
    const factor = parseInt(mode);
    // El valor siempre viaja en pesos, pero si los resultados se están viendo en
    // dólares hay que redondear sobre el número que el usuario ve; si no, el
    // precio queda "redondo" en COP y con decimales sueltos en USD.
    if (state.resultadosEnUSD && state.precioDolar > 0) {
        const paso = factor / 1000;            // 500 -> 0,5   1.000 -> 1   5.000 -> 5
        const enUSD = value / state.precioDolar;
        return Math.ceil(enUSD / paso) * paso * state.precioDolar;
    }
    return Math.ceil(value / factor) * factor;
}

// Las opciones del desplegable de redondeo cambian según la moneda mostrada
function actualizarOpcionesRedondeo() {
    const usd = !!state.resultadosEnUSD;
    const textos = usd
        ? { none: 'Sin redondeo', '500': 'Múltiplos de 0,50', '1000': 'Múltiplos de 1', '5000': 'Múltiplos de 5' }
        : { none: 'Sin redondeo', '500': 'Múltiplos de 500', '1000': 'Múltiplos de 1.000', '5000': 'Múltiplos de 5.000' };
    ['redondeoMode', 'redondeoModeProyecto'].forEach(id => {
        const sel = document.getElementById(id);
        if (!sel) return;
        Array.from(sel.options).forEach(o => { if (textos[o.value]) o.textContent = textos[o.value]; });
        const etiqueta = document.querySelector('label[for="' + id + '"]');
        if (etiqueta) {
            const icono = etiqueta.querySelector('.help-i');
            etiqueta.textContent = 'Redondear Final a (en ' + (usd ? 'USD' : 'COP') + '):';
            if (icono) etiqueta.appendChild(icono);
        }
    });
}

// ===== AVISO DE DATOS QUE FALTAN =====
// Solo avisa. Nunca impide calcular ni exportar: un campo vacío vale 0 y el
// precio saldría más barato sin que nadie lo note, que es lo que se evita.
function revisarDatosFaltantes() {
    const vacio = (id) => {
        const el = document.getElementById(id);
        if (!el) return false;
        const n = parseFloat(el.value);
        return isNaN(n) || n <= 0;
    };

    const faltan = [];
    if (vacio('gramosFilamento')) faltan.push('gramos de filamento');
    if (!els.mainFilamentoSelect || !els.mainFilamentoSelect.value) faltan.push('filamento del material principal');
    if (vacio('horasImpresion') && vacio('minutosImpresion')) faltan.push('tiempo de impresión');
    if (vacio('precioKwh')) faltan.push('precio del kWh');
    if (vacio('consumoWatts')) faltan.push('consumo en watts');
    if (vacio('manoObraHora')) faltan.push('mano de obra por hora');
    if (vacio('desgasteMaquina') || vacio('precioRepuestos')) faltan.push('desgaste de máquina');

    let aviso = document.getElementById('avisoDatosFaltantes');
    if (!faltan.length) {
        if (aviso) aviso.style.display = 'none';
        return;
    }
    if (!aviso) {
        const lista = document.querySelector('.results-card .results-list');
        if (!lista) return;
        aviso = document.createElement('div');
        aviso.id = 'avisoDatosFaltantes';
        aviso.className = 'aviso-faltantes';
        lista.parentNode.insertBefore(aviso, lista);
    }
    aviso.style.display = '';
    aviso.innerHTML = '<i class="bi bi-exclamation-triangle"></i>' +
        '<div><strong>Faltan datos y el precio sale más bajo de lo real.</strong>' +
        '<span>Sin llenar: ' + faltan.join(', ') + '.</span></div>';
}
// ===== FIN AVISO DE DATOS QUE FALTAN =====

function formatTime(totalHours) {
    const totalH = Math.floor(totalHours);
    const m = Math.round((totalHours - totalH) * 60);
    const d = Math.floor(totalH / 24);
    const h = totalH % 24;
    
    let baseStr = "";
    if (totalH === 0) baseStr = `${m} min`;
    else if (m === 0) baseStr = `${totalH} h`;
    else baseStr = `${totalH} h ${m} min`;
    
    if (d > 0) {
        let dayStr = d === 1 ? "1 día" : `${d} días`;
        let remainStr = "";
        if (h > 0 && m > 0) remainStr = `${h}h ${m}min`;
        else if (h > 0) remainStr = `${h}h`;
        else if (m > 0) remainStr = `${m}min`;
        
        if (remainStr) {
            return `${baseStr} (${dayStr} y ${remainStr})`;
        } else {
            return `${baseStr} (${dayStr})`;
        }
    }
    return baseStr;
}

function checkDolarVisibility() {
    let usesDolar = (els.monedaFilamento.value === 'USD') || 
                      (els.monedaRepuestos.value === 'USD') ||
                      (els.monedaInsumosACobrar.value === 'USD');
    // Check dynamic insumo currency selectors
    document.querySelectorAll('.insumo-moneda-select').forEach(sel => {
        if (sel.value === 'USD') usesDolar = true;
    });
    els.dolarSection.style.display = usesDolar ? 'block' : 'none';
}

function normalizeToCOP(value, monedaSelector) {
    if (monedaSelector.value === 'USD') {
        return value * state.precioDolar;
    }
    return value;
}

function normalizeToCOPByValue(value, moneda) {
    if (moneda === 'USD') return value * state.precioDolar;
    return value;
}

// ====== INSUMOS EXTRA DINÁMICOS ======
let insumoCounter = 0;

function createInsumoCard(container, data) {
    insumoCounter++;
    const idx = insumoCounter;
    const card = document.createElement('div');
    card.className = 'insumo-extra-card';
    card.dataset.insumoIdx = idx;
    card.innerHTML = `
        <div class="insumo-card-header">
            <span>Insumo #${idx}</span>
            <button type="button" class="btn-remove-insumo" title="Eliminar"><i class="bi bi-x-lg"></i></button>
        </div>
        <div class="insumo-inputs-grid">
            <div class="input-group" style="grid-column: 1 / -1;">
                <label>Nombre del insumo</label>
                <input type="text" class="insumo-nombre" placeholder="Ej: Pintura acrílica" value="${data.nombre || ''}">
            </div>
            <div class="input-group">
                <label>Precio paquete/presentación</label>
                <div class="input-with-select">
                    <input type="number" class="insumo-precio-paquete" min="0" step="0.01" value="${data.precioPaquete || ''}">
                    <select class="insumo-moneda-select currency-selector">
                        <option value="COP" ${(data.moneda||'COP')==='COP'?'selected':''}>COP</option>
                        <option value="USD" ${data.moneda==='USD'?'selected':''}>USD</option>
                    </select>
                </div>
            </div>
            <div class="input-group">
                <label>Cantidad en paquete</label>
                <input type="number" class="insumo-cant-paquete" min="0.01" step="0.01" value="${data.cantPaquete || ''}">
            </div>
            <div class="input-group">
                <label>Cantidad utilizada</label>
                <input type="number" class="insumo-cant-usada" min="0" step="0.01" value="${data.cantUsada || ''}">
            </div>
        </div>
        <div class="insumo-computed">
            <div class="insumo-computed-item">
                <span class="ic-label">Costo unitario</span>
                <span class="ic-val insumo-costo-unit">—</span>
            </div>
            <div class="insumo-computed-item">
                <span class="ic-label">Costo total usado</span>
                <span class="ic-val insumo-costo-total">—</span>
            </div>
            <div class="insumo-computed-item">
                <span class="ic-label">Paquetes necesarios</span>
                <span class="ic-val insumo-paquetes-info">—</span>
            </div>
        </div>
    `;
    container.appendChild(card);

    // Remove button
    card.querySelector('.btn-remove-insumo').addEventListener('click', () => {
        card.remove();
        recalcInsumosTotal();
        updateTabBadges();
        calculate();
    });

    // Auto-compute on input
    card.querySelectorAll('input, select').forEach(el => {
        el.addEventListener('input', () => { computeInsumoCard(card); recalcInsumosTotal(); calculate(); });
        el.addEventListener('change', () => { computeInsumoCard(card); recalcInsumosTotal(); calculate(); });
    });

    computeInsumoCard(card);
    return card;
}

function computeInsumoCard(card) {
    const precioPaq = parseFloat(card.querySelector('.insumo-precio-paquete').value) || 0;
    const moneda = card.querySelector('.insumo-moneda-select').value;
    const cantPaq = parseFloat(card.querySelector('.insumo-cant-paquete').value) || 0;
    const cantUsada = parseFloat(card.querySelector('.insumo-cant-usada').value) || 0;

    const precioPaqCOP = normalizeToCOPByValue(precioPaq, moneda);
    const costoUnit = cantPaq > 0 ? precioPaqCOP / cantPaq : 0;
    const costoTotal = costoUnit * cantUsada;
    const paqNecesarios = cantPaq > 0 ? cantUsada / cantPaq : 0;
    const paqComprar = Math.ceil(paqNecesarios);

    card.querySelector('.insumo-costo-unit').innerText = formatMoney(costoUnit, false);
    card.querySelector('.insumo-costo-total').innerText = formatMoney(costoTotal, false);
    card.querySelector('.insumo-paquetes-info').innerText = paqNecesarios > 0 
        ? `${paqNecesarios.toFixed(2)} → ${paqComprar} paq.` 
        : '—';
    
    card.dataset.costoTotalCOP = costoTotal;
}

function recalcInsumosTotal() {
    let total = 0;
    els.insumosExtraContainerPieza.querySelectorAll('.insumo-extra-card').forEach(card => {
        total += parseFloat(card.dataset.costoTotalCOP) || 0;
    });
    const hasInsumos = els.insumosExtraContainerPieza.children.length > 0;
    els.insumosResumenPieza.style.display = hasInsumos ? 'block' : 'none';
    els.insumoCostoTotalPieza.innerText = formatMoney(total, false);
    checkDolarVisibility();
}

function getInsumosExtraData() {
    const items = [];
    els.insumosExtraContainerPieza.querySelectorAll('.insumo-extra-card').forEach(card => {
        items.push({
            nombre: card.querySelector('.insumo-nombre').value,
            precioPaquete: card.querySelector('.insumo-precio-paquete').value,
            moneda: card.querySelector('.insumo-moneda-select').value,
            cantPaquete: card.querySelector('.insumo-cant-paquete').value,
            cantUsada: card.querySelector('.insumo-cant-usada').value
        });
    });
    return items;
}

function loadInsumosExtraData(items) {
    els.insumosExtraContainerPieza.innerHTML = '';
    if (!items || !Array.isArray(items) || items.length === 0) {
        els.insumosResumenPieza.style.display = 'none';
        return;
    }
    items.forEach(data => createInsumoCard(els.insumosExtraContainerPieza, data));
    recalcInsumosTotal();
}

function getInsumosTotalCOP() {
    let total = 0;
    els.insumosExtraContainerPieza.querySelectorAll('.insumo-extra-card').forEach(card => {
        total += parseFloat(card.dataset.costoTotalCOP) || 0;
    });
    return total;
}

// Add insumo button
els.btnAddInsumoPieza.addEventListener('click', () => {
    createInsumoCard(els.insumosExtraContainerPieza, {});
    recalcInsumosTotal();
    updateTabBadges();
});

let lastCalcResults = {};


// ====== PARTES EXTRA DINÁMICAS ======
let parteCounter = 0;

function createParteCard(container, data) {
    parteCounter++;
    const idx = parteCounter;
    const card = document.createElement('div');
    card.className = 'parte-extra-card';
    card.dataset.parteIdx = idx;
    card.style.marginBottom = '1rem';
    card.style.padding = '1rem';
    card.style.border = '1px dashed var(--border)';
    card.style.borderRadius = '0.375rem';
    card.innerHTML = `
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-weight: bold; color: var(--text-main);">
            <span>Parte #${idx}</span>
            <button type="button" class="btn-remove-parte" style="background: none; border: none; color: var(--danger); cursor: pointer;" title="Eliminar"><i class="bi bi-x-lg"></i></button>
        </div>
        <div class="input-grid">
            <div class="input-group">
                <label>Tiempo (Hrs / Min)</label>
                <div style="display: flex; gap: 0.5rem;">
                    <input type="number" class="parte-hrs" min="0" step="1" placeholder="Hrs" value="${data.horas || ''}" style="flex: 1; border-radius: 0.375rem;">
                    <input type="number" class="parte-min" min="0" max="59" step="1" placeholder="Min" value="${data.minutos || ''}" style="flex: 1; border-radius: 0.375rem;">
                </div>
            </div>
            <div class="input-group">
                <label>Gramos</label>
                <input type="number" class="parte-gramos" min="0" step="1" value="${data.gramos || ''}">
            </div>
            <div class="input-group">
                <label>Filamento</label>
                <select class="parte-filamento">
                    <option value="">-- Seleccionar --</option>
                </select>
            </div>
        </div>
    `;
    container.appendChild(card);

    // Populate select with filamentosGuardados
    const select = card.querySelector('.parte-filamento');
    if (state.filamentosGuardados) {
        state.filamentosGuardados.forEach(f => {
            const opt = document.createElement('option');
            opt.value = f.id;
            opt.text = `${f.marca} ${f.tipo} - ${f.color} ($${f.precio})`;
            select.appendChild(opt);
        });
    }
    if (data.filamentoId) {
        select.value = data.filamentoId;
    }

    card.querySelector('.btn-remove-parte').addEventListener('click', () => {
        card.remove();
        updateTabBadges();
        calculate();
    });

    card.querySelectorAll('input, select').forEach(el => {
        el.addEventListener('input', calculate);
        el.addEventListener('change', calculate);
    });

    return card;
}

function getPartesExtraData() {
    const items = [];
    els.partesExtraContainer.querySelectorAll('.parte-extra-card').forEach(card => {
        items.push({
            horas: card.querySelector('.parte-hrs').value,
            minutos: card.querySelector('.parte-min').value,
            gramos: card.querySelector('.parte-gramos').value,
            filamentoId: card.querySelector('.parte-filamento').value
        });
    });
    return items;
}

function loadPartesExtraData(items) {
    els.partesExtraContainer.innerHTML = '';
    parteCounter = 0;
    if (!items || !Array.isArray(items)) return;
    items.forEach(data => createParteCard(els.partesExtraContainer, data));
}

if (els.btnAddParte) {
    els.btnAddParte.addEventListener('click', () => {
        createParteCard(els.partesExtraContainer, {});
        calculate();
    });
}



// ===== BADGE EN TABS =====
function updateTabBadges() {
    const nPartes  = els.partesExtraContainer
        ? els.partesExtraContainer.querySelectorAll('.parte-extra-card').length : 0;
    const nInsumos = els.insumosExtraContainerPieza
        ? els.insumosExtraContainerPieza.querySelectorAll('.insumo-extra-card').length : 0;
    const bp = document.getElementById('badgePartes');
    const bi = document.getElementById('badgeInsumos');
    if (bp) { bp.style.display = nPartes  > 0 ? 'inline-flex' : 'none'; bp.textContent = nPartes; }
    if (bi) { bi.style.display = nInsumos > 0 ? 'inline-flex' : 'none'; bi.textContent = nInsumos; }
}
// ===== FIN BADGE EN TABS =====

// ===== RESUMEN PIEZA ACTIVA =====
function updatePieceActiveSummary() {
    const summaryEl = document.getElementById('pieceActiveSummary');
    if (!summaryEl) return;
    if (!state.currentPiece) { summaryEl.style.display = 'none'; return; }
    const nameEl  = document.getElementById('pieceActiveName');
    const gramsEl = document.getElementById('pieceActiveGrams');
    const timeEl  = document.getElementById('pieceActiveTime');
    const priceEl = document.getElementById('pieceActivePrice');
    if (nameEl)  nameEl.textContent  = state.currentPiece;
    if (gramsEl) gramsEl.textContent = (lastCalcResults['_gramos_input_real'] || 0).toFixed(0) + ' g';
    if (timeEl)  timeEl.textContent  = formatTime(lastCalcResults['_horas_impresion_real'] || 0);
    if (priceEl) priceEl.textContent = formatMoney(lastCalcResults['Total a Cobrar'] || 0, false) + ' c/u';
    summaryEl.style.display = 'flex';
}
// ===== FIN RESUMEN PIEZA ACTIVA =====

// Cálculo Principal (una pieza / una cama)
function calculate() {
    state.resultadosEnUSD = els.toggleMonedaResultados.checked;
    if (state.resultadosEnUSD) {
        els.labelUSD.classList.add('active');
        els.labelCOP.classList.remove('active');
    } else {
        els.labelCOP.classList.add('active');
        els.labelUSD.classList.remove('active');
    }

    checkDolarVisibility();
    actualizarOpcionesRedondeo();
    revisarDatosFaltantes();

    let vDolar = parseFloat(els.precioDolar.value);
    if(isNaN(vDolar) || vDolar <= 0) vDolar = 3600;
    state.precioDolar = vDolar;

    const val = (el) => parseFloat(el.value) || 0;
    
    const pKgCOP = normalizeToCOP(val(els.precioKg), els.monedaFilamento);
    const pRepCOP = normalizeToCOP(val(els.precioRepuestos), els.monedaRepuestos);
    const insExCOP = getInsumosTotalCOP();
    
    let rawInsumosCobrar = parseFloat(els.insumosACobrar.value);
    const insExACobrarCOP = (isNaN(rawInsumosCobrar) || rawInsumosCobrar <= 0) 
                            ? insExCOP 
                            : normalizeToCOP(rawInsumosCobrar, els.monedaInsumosACobrar);

    const pKwh = val(els.precioKwh);
    const cWatts = val(els.consumoWatts);
    const dMaq = val(els.desgasteMaquina) || 1; 
    const moH = val(els.manoObraHora);
    const mErr = val(els.margenError);
    
    let hImpVal = val(els.horasImpresion);
    let mImpVal = val(els.minutosImpresion);
    let gFil = val(els.gramosFilamento);
    let numCamasPorUnidad = 1;

    els.partesExtraContainer.querySelectorAll('.parte-extra-card').forEach(card => {
        const p_hrs = parseFloat(card.querySelector('.parte-hrs').value) || 0;
        const p_min = parseFloat(card.querySelector('.parte-min').value) || 0;
        const p_g = parseFloat(card.querySelector('.parte-gramos').value) || 0;
        hImpVal += p_hrs;
        mImpVal += p_min;
        gFil += p_g;
        numCamasPorUnidad += 1;
    });

    const hImp = hImpVal + (mImpVal / 60);

    const hInvVal = val(els.horasInvertidas);
    const mInvVal = val(els.minutosInvertidas);
    const hInv = hInvVal + (mInvVal / 60);

    const mOpVal = val(els.minutosOperario);
    const hOp = (mOpVal * numCamasPorUnidad) / 60;

    const mPrepVal = val(els.minutosPrepMaquina);
    const hPrep = (mPrepVal * numCamasPorUnidad) / 60;
    const mGan = val(els.margenGanancia);
    const unidadesCama = parseFloat(els.unidadesCama.value) || 1;

    // --- Costos POR CAMA (todos los datos de la pieza son por 1 cama/impresión) ---
    // --- Lógica Multi-Filamento ---
    let cMaterialCamaCOP = 0;
    let _listaMaterialesUnidad = []; // Para BOM
    
    const getFilamentoData = (id) => {
        const f = state.filamentosGuardados.find(x => x.id === id);
        if(f) return { pCOP: normalizeToCOPByValue(f.precio, f.moneda || 'COP'), ref: f };
        return { pCOP: pKgCOP, ref: {marca:"Genérico", tipo:"-", color:"Desconocido"} }; 
    };

    let mainGramos = val(els.gramosFilamento);
    if(mainGramos > 0) {
        let fData = getFilamentoData(els.mainFilamentoSelect ? els.mainFilamentoSelect.value : null);
        cMaterialCamaCOP += (mainGramos * fData.pCOP) / 1000;
        _listaMaterialesUnidad.push({ ref: fData.ref, gramos: mainGramos });
    }

    if(els.checkVariosFilamentos && els.checkVariosFilamentos.checked && els.filamentosExtraContainer) {
        els.filamentosExtraContainer.querySelectorAll('.fil-extra-row').forEach(row => {
            let g = parseFloat(row.querySelector('.fil-extra-gramos').value) || 0;
            let sel = row.querySelector('.fil-extra-select').value;
            let fData = getFilamentoData(sel);
            cMaterialCamaCOP += (g * fData.pCOP) / 1000;
            if(g > 0) _listaMaterialesUnidad.push({ ref: fData.ref, gramos: g });
        });
    }
    
    // Sumar costos de filamento de Partes Extra
    els.partesExtraContainer.querySelectorAll('.parte-extra-card').forEach(card => {
        const p_g = parseFloat(card.querySelector('.parte-gramos').value) || 0;
        const p_fId = card.querySelector('.parte-filamento').value;
        if(p_g > 0) {
            let fData = getFilamentoData(p_fId);
            cMaterialCamaCOP += (p_g * fData.pCOP) / 1000;
            _listaMaterialesUnidad.push({ ref: fData.ref, gramos: p_g });
        }
    });

    // Recalcular gFil total por si acaso (sumatoria total)
    gFil = _listaMaterialesUnidad.reduce((sum, item) => sum + item.gramos, 0);
    const cLuzCamaCOP = ((pKwh * cWatts) / 1000) * hImp;
    const cDesgasteCamaCOP = (pRepCOP / dMaq) * hImp;
    const cErrorCamaCOP = (cMaterialCamaCOP + cLuzCamaCOP + cDesgasteCamaCOP) * (mErr / 100);
    // Buffer de peor escenario: aplicar margen de error a tiempo y gramos
    const errorFactor = 1 + (mErr / 100);
    const gFilConBuffer = gFil * errorFactor;
    const hImpConBuffer = hImp * errorFactor;
    const tiempoProdCamaConBuffer_h = hImpConBuffer + hPrep + hOp;
    const tiempoTotalPiezaConBuffer_h = tiempoProdCamaConBuffer_h + hInv;
    
    // Separamos Mano de Obra Fija (Preparacion) y Variable (Operario x cama)
    const cManoObraPrepCOP = moH * hInv;
    const cManoObraOpCOP = moH * hOp;
    const cManoObraCamaCOP = cManoObraPrepCOP + cManoObraOpCOP;
    
    // Tiempos
    const tiempoProdCama_h = hImp + hPrep + hOp;
    const tiempoTotalPieza_h = tiempoProdCama_h + hInv;
    
    // Costo Total Bruto POR CAMA = solo costos de impresión 3D
    const costoTotalCamaCOP = cMaterialCamaCOP + cLuzCamaCOP + cDesgasteCamaCOP + cErrorCamaCOP;
    const costoBaseCamaCOP = costoTotalCamaCOP;
    // Costo Total de Producción POR CAMA
    const costoProduccionCamaCOP = costoTotalCamaCOP + insExCOP + cManoObraCamaCOP;
    // Total a Cobrar POR CAMA = margen sobre base 3D + precio cobrado por insumos + mano de obra
    let totalCobrarRawCamaCOP = (costoBaseCamaCOP * mGan) + cManoObraCamaCOP + insExACobrarCOP;

    // --- Costos POR UNIDAD (dividir costos de cama entre unidades por cama) ---
    const cMaterialCOP = cMaterialCamaCOP / unidadesCama;
    const cLuzCOP = cLuzCamaCOP / unidadesCama;
    const cDesgasteCOP = cDesgasteCamaCOP / unidadesCama;
    const cErrorCOP = cErrorCamaCOP / unidadesCama;
    const cManoObraCOP = cManoObraCamaCOP / unidadesCama;
    const costoTotalCOP = costoTotalCamaCOP / unidadesCama;
    const costoBaseCOP = costoBaseCamaCOP / unidadesCama;
    const insExCOPUnit = insExCOP / unidadesCama;
    const insExACobrarCOPUnit = insExACobrarCOP / unidadesCama;
    const costoProduccionCOP = costoProduccionCamaCOP / unidadesCama;
    let totalCobrarRawCOP = totalCobrarRawCamaCOP / unidadesCama;
    let totalCobrarCOP = applyRedondeo(totalCobrarRawCOP, els.redondeoMode.value);
    // Override: Precio de Venta manual de la pieza
    const _precioVentaPiezaRaw = parseFloat(els.precioVentaPieza ? els.precioVentaPieza.value : '');
    if (!isNaN(_precioVentaPiezaRaw) && _precioVentaPiezaRaw > 0 && els.precioVentaPieza && els.precioVentaPieza.value.trim() !== '') {
        const _pvpAbs = state.resultadosEnUSD ? (_precioVentaPiezaRaw * state.precioDolar) : _precioVentaPiezaRaw;
        totalCobrarCOP = _pvpAbs;
    }
    // Ganancia neta por unidad
    const gananciaCOP = totalCobrarCOP - costoTotalCOP - insExCOPUnit;

    // Guardar para exportar y para escalar proyecto
    lastCalcResults = {
        'Precio Material': cMaterialCOP,
        'Precio Luz': cLuzCOP,
        'Desgaste Máquina': cDesgasteCOP,
        'Margen de Error': cErrorCOP,
        'Costo Total Bruto (Materiales)': costoTotalCOP,
        'Costo real Insumos Extra': insExCOPUnit,
        'Precio cobrado por Insumos Extra': insExACobrarCOPUnit,
        'Mano de Obra': cManoObraCOP,
        'Costo Total de Producción': costoProduccionCOP,
        'Ganancia Neta': gananciaCOP,
        'Total a Cobrar': totalCobrarCOP,
        '_gramos_input': gFilConBuffer,
        '_gramos_input_real': gFil,
        '_listaMaterialesUnidad': _listaMaterialesUnidad,
        '_horas_impresion': hImpConBuffer,
        '_horas_impresion_real': hImp,
        '_unidades_cama': unidadesCama,
        '_costo_produccion_raw': costoProduccionCOP,
        '_total_cobrar_raw': totalCobrarRawCOP,
        '_total_cobrar_raw_cama': totalCobrarRawCamaCOP,
        '_costo_base_cop': costoBaseCOP,
        '_costo_base_cama_cop': costoBaseCamaCOP,
        '_c_mano_obra_prep': cManoObraPrepCOP,
        '_c_mano_obra_op': cManoObraOpCOP,
        '_mGan': mGan,
        '_insumos_extra_cop': insExCOPUnit,
        '_insumos_extra_cama_cop': insExCOP,
        '_insumos_extra_cobrar': insExACobrarCOPUnit,
        '_insumos_extra_cobrar_cama': insExACobrarCOP,
        '_matCOP': cMaterialCOP,
        '_matCamaCOP': cMaterialCamaCOP,
        '_luzCOP': cLuzCOP,
        '_luzCamaCOP': cLuzCamaCOP,
        '_despCOP': cDesgasteCOP,
        '_despCamaCOP': cDesgasteCamaCOP,
        '_mErrCOP': cErrorCOP,
        '_mErrCamaCOP': cErrorCamaCOP,
        '_tiempo_prod_cama_h': tiempoProdCamaConBuffer_h,
        '_tiempo_prod_cama_h_real': tiempoProdCama_h,
        '_hInv': hInv,
        'Tiempo Est. Producción': formatTime(tiempoTotalPieza_h)
    };

    const render = (valCOP) => {
        if(state.resultadosEnUSD) return formatMoney(valCOP / state.precioDolar, true);
        return formatMoney(valCOP, false);
    };

    els.resMaterial.innerText = render(cMaterialCOP);
    els.resLuz.innerText = render(cLuzCOP);
    els.resDesgaste.innerText = render(cDesgasteCOP);
    els.resError.innerText = render(cErrorCOP);
    els.resCostoTotal.innerText = render(costoTotalCOP);
    els.resInsumos.innerText = render(insExCOPUnit);
    els.resManoObra.innerText = render(cManoObraCOP);
    els.resTiempoProduccion.innerHTML = formatTime(tiempoTotalPiezaConBuffer_h) + (mErr > 0 ? ' <i class="bi bi-exclamation-triangle"></i>' : '');
    els.resCostoProduccion.innerText = render(costoProduccionCOP);
    els.resGanancia.innerText = render(gananciaCOP);
    els.resTotalCobrar.innerText = render(totalCobrarCOP);

    // Mostrar desglose por cama cuando hay más de 1 unidad por cama
    if (unidadesCama > 1) {
        // Ganancia por cama = totalCobrar por cama - costoBase cama - insumos cama
        const totalCobrarCamaCOP = totalCobrarCOP * unidadesCama;
        const gananciaCamaCOP = gananciaCOP * unidadesCama;

        els.labelCostoProduccion.innerText = 'Costo Producción (1 pieza):';
        els.containerCostoProduccionCama.style.display = 'flex';
        els.resCostoProduccionCama.innerText = render(costoProduccionCamaCOP);

        els.labelGanancia.innerText = 'Ganancia neta (1 pieza):';
        els.containerGananciaCama.style.display = 'flex';
        els.resGananciaCama.innerText = render(gananciaCamaCOP);

        els.labelTotalCobrar.innerText = 'Total a Cobrar (c/u):';
        els.containerTotalCobrarCama.style.display = 'flex';
        els.resTotalCobrarCama.innerText = render(totalCobrarCamaCOP);
    } else {
        els.labelCostoProduccion.innerText = 'Costo Total de Producción:';
        els.containerCostoProduccionCama.style.display = 'none';

        els.labelGanancia.innerText = 'Ganancia neta:';
        els.containerGananciaCama.style.display = 'none';

        els.labelTotalCobrar.innerText = 'Total a Cobrar:';
        els.containerTotalCobrarCama.style.display = 'none';
    }

    calculateProject();
    updatePieceActiveSummary();
    updateTabBadges();
    if(typeof autoSaveCurrentState === 'function') autoSaveCurrentState();
}

// ====== ESCALADO DE PROYECTO ======
function calculateProject() {
    const unidades = parseFloat(els.unidadesPedido.value) || 0;
    const unidadesCama = lastCalcResults['_unidades_cama'] || 1;

    if (unidades <= 0 || !lastCalcResults['_horas_impresion']) {
        els.projectResults.style.display = 'none';
        return;
    }

    const camas = Math.ceil(unidades / unidadesCama);
    const horasTotales = camas * (lastCalcResults['_horas_impresion'] || 0);
    const gramosTotales = camas * (lastCalcResults['_gramos_input'] || 0);
    
    const tiempoEstProyecto = (camas * (lastCalcResults['_tiempo_prod_cama_h'] || 0)) + (lastCalcResults['_hInv'] || 0);
    
    // Escalar costos POR CAMA (no por unidad)
    const matProyecto = (lastCalcResults['_matCamaCOP'] || 0) * camas;
    const luzProyecto = (lastCalcResults['_luzCamaCOP'] || 0) * camas;
    const despProyecto = (lastCalcResults['_despCamaCOP'] || 0) * camas;
    const mErrProyecto = (lastCalcResults['_mErrCamaCOP'] || 0) * camas;
    
    const costoMaterialesProyecto = (lastCalcResults['_costo_base_cama_cop'] || 0) * camas;
    const insumosExtraProyecto = (lastCalcResults['_insumos_extra_cama_cop'] || 0) * camas;
    const manoObraProyecto = ((lastCalcResults['_c_mano_obra_op'] || 0) * camas) + (lastCalcResults['_c_mano_obra_prep'] || 0);

    const mGanProyecto = parseFloat(els.margenGananciaProyecto.value) || 1;
    const cobrarVariable = ((lastCalcResults['_costo_base_cama_cop'] || 0) * mGanProyecto) + (lastCalcResults['_c_mano_obra_op'] || 0) + (lastCalcResults['_insumos_extra_cobrar_cama'] || 0);
    const totalCobrarRawTotal = (cobrarVariable * camas) + (lastCalcResults['_c_mano_obra_prep'] || 0);
    
    let totalCobrarTotal = applyRedondeo(totalCobrarRawTotal, els.redondeoModeProyecto.value);
    
    const precioUnitarioManual = parseFloat(els.precioUnitarioManual.value);
    if (!isNaN(precioUnitarioManual) && precioUnitarioManual >= 0 && els.precioUnitarioManual.value.trim() !== '') {
        const pManualAbs = state.resultadosEnUSD ? (precioUnitarioManual * state.precioDolar) : precioUnitarioManual;
        totalCobrarTotal = pManualAbs * unidades;
    }
    
    const costoPorUnidad = totalCobrarTotal / unidades;
    const gananciaProyecto = totalCobrarTotal - costoMaterialesProyecto - insumosExtraProyecto;

    // Producción por cama
    const unidadesProducidas = camas * unidadesCama;
    const unidadesSobrantes = unidadesProducidas - unidades;

    els.resUnidadesCamaProyecto.innerText = unidadesCama.toLocaleString('es-CO');
    els.resCamas.innerText = camas.toLocaleString('es-CO');
    els.resUnidadesProducidas.innerText = unidadesProducidas.toLocaleString('es-CO');
    if (unidadesSobrantes > 0) {
        els.containerUnidadesSobrantes.style.display = 'flex';
        els.resUnidadesSobrantes.innerText = unidadesSobrantes.toLocaleString('es-CO');
    } else {
        els.containerUnidadesSobrantes.style.display = 'none';
    }
    els.resHorasTotales.innerText = horasTotales.toLocaleString('es-CO', { maximumFractionDigits: 1 }) + ' h';
    els.resTiempoProduccionProyecto.innerText = formatTime(tiempoEstProyecto);
    els.resGramosTotales.innerText = gramosTotales.toLocaleString('es-CO', { maximumFractionDigits: 0 }) + ' g';
    // Bobinas necesarias
    const GRAMOS_BOBINA = 1000;
    const bobinasNecesarias = Math.ceil(gramosTotales / GRAMOS_BOBINA);
    const resBobinas = document.getElementById('resBobinas');
    if (resBobinas) {
        resBobinas.textContent = bobinasNecesarias + (bobinasNecesarias === 1 ? ' bobina' : ' bobinas');
        resBobinas.className = 'val ' + (bobinasNecesarias > 1 ? 'bobina-warn' : 'bobina-ok');
    }

    const renderProj = (valCOP) => {
        if(state.resultadosEnUSD) return formatMoney(valCOP / state.precioDolar, true);
        return formatMoney(valCOP, false);
    };
    
    // Costo de Producción total (Materiales + Insumos reales + Mano de Obra), por pieza y por proyecto
    const costoProduccionPiezaProyecto = (costoMaterialesProyecto + insumosExtraProyecto + manoObraProyecto) / unidades;
    const costoProduccionTotalProyecto = costoMaterialesProyecto + insumosExtraProyecto + manoObraProyecto;

    els.resFilamentoProyecto.innerText = renderProj(matProyecto);
    els.resLuzProyecto.innerText = renderProj(luzProyecto);
    els.resDesgasteProyecto.innerText = renderProj(despProyecto);
    els.resMargenErrorProyecto.innerText = renderProj(mErrProyecto);
    els.resMaterialesProyecto.innerText = renderProj(costoMaterialesProyecto);
    
    if (insumosExtraProyecto > 0) {
        els.containerInsumosProyecto.style.display = 'flex';
        els.resInsumosProyecto.innerText = renderProj(insumosExtraProyecto);
    } else {
        els.containerInsumosProyecto.style.display = 'none';
        els.resInsumosProyecto.innerText = '0';
    }
    els.resManoObraProyecto.innerText = renderProj(manoObraProyecto);
    if (els.resCostoProdPiezaProyecto) els.resCostoProdPiezaProyecto.innerText = renderProj(costoProduccionPiezaProyecto);
    if (els.resCostoProdTotalProyecto) els.resCostoProdTotalProyecto.innerText = renderProj(costoProduccionTotalProyecto);
    els.resGananciaProyecto.innerText = renderProj(gananciaProyecto);
    els.resCostoPorUnidad.innerText = renderProj(costoPorUnidad);
    els.resTotalProyecto.innerText = renderProj(totalCobrarTotal);

    // Guardar datos calculados del proyecto para guardar/exportar
    state._lastProjectCalc = {
        camas, horasTotales, gramosTotales, 
        matProyecto, luzProyecto, despProyecto, mErrProyecto,
        costoMaterialesProyecto, insumosExtraProyecto, manoObraProyecto,
        gananciaProyecto, costoPorUnidad,
        totalCobrarTotal,
        unidades, unidadesCama,
        tiempoEstProyecto,
        costoProduccionPiezaProyecto,
        costoProduccionTotalProyecto
    };

    els.projectResults.style.display = 'block';
}

// ====== PIEZAS GUARDADAS ======
function getPieceData() {
    return {
        // La nota descriptiva vive en la pieza guardada (se edita desde el ícono ⓘ);
        // se conserva aquí para que "Guardar Pieza" no la borre.
        nota: (state.currentPiece && state.pieces[state.currentPiece] && state.pieces[state.currentPiece].nota) || '',
        horasImpresion: els.horasImpresion.value,
        minutosImpresion: els.minutosImpresion.value,
        gramosFilamento: els.gramosFilamento.value,
        filamentoPrincipalId: els.mainFilamentoSelect ? els.mainFilamentoSelect.value : '',
        filamentoPrincipalLabel: (function(){
            const id = els.mainFilamentoSelect ? els.mainFilamentoSelect.value : '';
            const f = state.filamentosGuardados.find(x => x.id === id);
            return f ? `${f.marca} ${f.tipo} - ${f.color}` : '';
        })(),
        variosFilamentos: els.checkVariosFilamentos ? els.checkVariosFilamentos.checked : false,
        filamentosExtraItems: (function(){
            if(!els.checkVariosFilamentos || !els.checkVariosFilamentos.checked) return [];
            let arr = [];
            els.filamentosExtraContainer.querySelectorAll('.fil-extra-row').forEach(row => {
                const id = row.querySelector('.fil-extra-select').value;
                const f = state.filamentosGuardados.find(x => x.id === id);
                arr.push({
                    idFilamento: id,
                    label: f ? `${f.marca} ${f.tipo} - ${f.color}` : '',
                    gramos: row.querySelector('.fil-extra-gramos').value
                });
            });
            return arr;
        })(),
        horasInvertidas: els.horasInvertidas.value,
        minutosInvertidas: els.minutosInvertidas.value,
        minutosOperario: els.minutosOperario.value,
        minutosPrepMaquina: els.minutosPrepMaquina.value,
        colorPrincipal: els.colorPrincipal.value,
        partesExtraItems: getPartesExtraData(),
        insumosExtraItems: getInsumosExtraData(),
        insumosACobrar: els.insumosACobrar.value,
        monedaInsumosACobrar: els.monedaInsumosACobrar.value,
        unidadesCama: els.unidadesCama.value,
        margenGanancia: els.margenGanancia.value,
        redondeoMode: els.redondeoMode.value,
        precioVentaPieza: els.precioVentaPieza ? els.precioVentaPieza.value : '',
        // Configuración de Impresión (opcional)
        printConfig: {
            alturaCapa: document.getElementById('cfgAlturaCapa').value,
            anchoLineaExterno: document.getElementById('cfgAnchoLineaExterno').value,
            anchoLineaInterno: document.getElementById('cfgAnchoLineaInterno').value,
            rellenoSolidoSuperior: document.getElementById('cfgRellenoSolidoSuperior').value,
            tipoAlisado: document.getElementById('cfgTipoAlisado').value,
            buclesPerimetro: document.getElementById('cfgBuclesPerimetro').value,
            deteccionDelgados: document.getElementById('cfgDeteccionDelgados').checked,
            capasCubiertaSuperior: document.getElementById('cfgCapasCubiertaSuperior').value,
            patronCubiertaSuperior: document.getElementById('cfgPatronCubiertaSuperior').value,
            densidadRelleno: document.getElementById('cfgDensidadRelleno').value,
            patronRelleno: document.getElementById('cfgPatronRelleno').value,
            velocidad: document.getElementById('cfgVelocidad').value,
            llevaSoportes: document.getElementById('cfgLlevaSoportes').checked,
            capasInterfazSuperior: document.getElementById('cfgCapasInterfazSuperior').value,
            capasInterfazInferior: document.getElementById('cfgCapasInterfazInferior').value
        },
        // Configuración de Capas Distintas (opcional)
        topLayerConfig: {
            anchoLineaExterno: document.getElementById('cfgCapasAnchoLineaExterno').value,
            anchoLineaInterno: document.getElementById('cfgCapasAnchoLineaInterno').value,
            rellenoSolidoSuperior: document.getElementById('cfgCapasRellenoSolidoSuperior').value,
            tipoAlisado: document.getElementById('cfgCapasTipoAlisado').value,
            buclesPerimetro: document.getElementById('cfgCapasBuclesPerimetro').value,
            deteccionDelgados: document.getElementById('cfgCapasDeteccionDelgados').checked,
            capasCubiertaSuperior: document.getElementById('cfgCapasDistCubiertaSuperior').value,
            patronCubiertaSuperior: document.getElementById('cfgCapasPatronCubiertaSuperior').value,
            densidadRelleno: document.getElementById('cfgCapasDensidadRelleno').value,
            patronRelleno: document.getElementById('cfgCapasPatronRelleno').value,
            velocidad: document.getElementById('cfgCapasVelocidad').value
        }
    };
}

function loadPieceData(data) {
    if (!data) return;
    els.horasImpresion.value = data.horasImpresion || '';
    els.minutosImpresion.value = data.minutosImpresion || '';
    els.gramosFilamento.value = data.gramosFilamento || '';
    els.horasInvertidas.value = data.horasInvertidas || '';
    els.minutosInvertidas.value = data.minutosInvertidas || '';
    els.minutosOperario.value = data.minutosOperario || '';
    els.minutosPrepMaquina.value = data.minutosPrepMaquina || '';
    els.colorPrincipal.value = data.colorPrincipal || '';
    loadPartesExtraData(data.partesExtraItems || []);
    // Cargar insumos extra (nuevo formato array, con fallback para formato viejo)
    if (data.insumosExtraItems && Array.isArray(data.insumosExtraItems)) {
        loadInsumosExtraData(data.insumosExtraItems);
    } else if (data.insumosExtra) {
        // Fallback: formato viejo con valor directo
        loadInsumosExtraData([{ nombre: 'Insumo (migrado)', precioPaquete: data.insumosExtra, moneda: data.monedaInsumos || 'COP', cantPaquete: '1', cantUsada: '1' }]);
    } else {
        loadInsumosExtraData([]);
    }
    els.insumosACobrar.value = data.insumosACobrar || '';
    if (data.monedaInsumosACobrar) els.monedaInsumosACobrar.value = data.monedaInsumosACobrar;
    els.unidadesCama.value = data.unidadesCama || '';
    if (data.margenGanancia) { els.margenGanancia.value = data.margenGanancia; els.margenGananciaSlider.value = data.margenGanancia; }
    if (data.redondeoMode) els.redondeoMode.value = data.redondeoMode;
    if (els.precioVentaPieza) els.precioVentaPieza.value = data.precioVentaPieza || '';

    // ── Cargar selección de filamentos ────────────────────────────────────────
    // Filamento principal
    if (els.mainFilamentoSelect && data.filamentoPrincipalId !== undefined) {
        const resolvedId = window.resolveFilamentoId ? window.resolveFilamentoId(data.filamentoPrincipalId) : data.filamentoPrincipalId;
        els.mainFilamentoSelect.value = resolvedId;
    }
    // Toggle "Varios Filamentos"
    if (els.checkVariosFilamentos) {
        els.checkVariosFilamentos.checked = !!data.variosFilamentos;
        if (els.variosFilamentosSection) {
            els.variosFilamentosSection.style.display = data.variosFilamentos ? 'block' : 'none';
        }
    }
    // Filamentos extra — limpiar los existentes y recrear desde datos guardados
    if (els.filamentosExtraContainer) {
        els.filamentosExtraContainer.innerHTML = '';
        if (data.variosFilamentos && Array.isArray(data.filamentosExtraItems)) {
            data.filamentosExtraItems.forEach(item => {
                if (window.addFilamentoExtraRow) {
                    window.addFilamentoExtraRow(item.idFilamento, item.gramos);
                }
            });
        }
    }
    // ─────────────────────────────────────────────────────────────────────────

    // Cargar Configuración de Impresión
    loadPrintConfig(data.printConfig || {});
    // Cargar Configuración de Capas Distintas
    loadTopLayerConfig(data.topLayerConfig || {});
    calculate();
}

function loadPrintConfig(cfg) {
    document.getElementById('cfgAlturaCapa').value = cfg.alturaCapa || '';
    // Perímetros (con fallback a anchoLinea viejo)
    document.getElementById('cfgAnchoLineaExterno').value = cfg.anchoLineaExterno || cfg.anchoLinea || '';
    document.getElementById('cfgAnchoLineaInterno').value = cfg.anchoLineaInterno || cfg.anchoLinea || '';
    document.getElementById('cfgRellenoSolidoSuperior').value = cfg.rellenoSolidoSuperior || '';
    document.getElementById('cfgTipoAlisado').value = cfg.tipoAlisado || '';
    document.getElementById('cfgBuclesPerimetro').value = cfg.buclesPerimetro || '';
    document.getElementById('cfgDeteccionDelgados').checked = !!cfg.deteccionDelgados;
    document.getElementById('cfgCapasCubiertaSuperior').value = cfg.capasCubiertaSuperior || '';
    document.getElementById('cfgPatronCubiertaSuperior').value = cfg.patronCubiertaSuperior || '';
    document.getElementById('cfgDensidadRelleno').value = cfg.densidadRelleno || '';
    document.getElementById('cfgPatronRelleno').value = cfg.patronRelleno || '';
    document.getElementById('cfgVelocidad').value = cfg.velocidad || '';
    document.getElementById('cfgLlevaSoportes').checked = !!cfg.llevaSoportes;
    document.getElementById('cfgCapasInterfazSuperior').value = cfg.capasInterfazSuperior || '';
    document.getElementById('cfgCapasInterfazInferior').value = cfg.capasInterfazInferior || '';
    // Mostrar/ocultar detalles de soportes según el checkbox
    toggleSoportesDetail();
}

function loadTopLayerConfig(cfg) {
    // Perímetros (con fallback a anchoLinea viejo)
    document.getElementById('cfgCapasAnchoLineaExterno').value = cfg.anchoLineaExterno || cfg.anchoLinea || '';
    document.getElementById('cfgCapasAnchoLineaInterno').value = cfg.anchoLineaInterno || cfg.anchoLinea || '';
    document.getElementById('cfgCapasRellenoSolidoSuperior').value = cfg.rellenoSolidoSuperior || '';
    document.getElementById('cfgCapasTipoAlisado').value = cfg.tipoAlisado || '';
    document.getElementById('cfgCapasBuclesPerimetro').value = cfg.buclesPerimetro || '';
    document.getElementById('cfgCapasDeteccionDelgados').checked = !!cfg.deteccionDelgados;
    document.getElementById('cfgCapasDistCubiertaSuperior').value = cfg.capasCubiertaSuperior || '';
    document.getElementById('cfgCapasPatronCubiertaSuperior').value = cfg.patronCubiertaSuperior || '';
    document.getElementById('cfgCapasDensidadRelleno').value = cfg.densidadRelleno || '';
    document.getElementById('cfgCapasPatronRelleno').value = cfg.patronRelleno || '';
    document.getElementById('cfgCapasVelocidad').value = cfg.velocidad || '';
}

function updatePieceSelect() {
    // El <select> queda oculto pero se mantiene como fuente de verdad del valor
    // seleccionado (el resto del código lo lee/escribe). La UI visible es el combobox.
    els.pieceSelect.innerHTML = '<option value="">-- Cargar Pieza Guardada --</option>';
    const allNames = Object.keys(state.pieces).sort((a, b) => a.localeCompare(b, 'es'));
    allNames.forEach(name => {
        const opt = document.createElement('option');
        opt.value = name; opt.innerText = name;
        els.pieceSelect.appendChild(opt);
    });
    els.pieceSelect.value = state.currentPiece || '';
    if (window.refreshPieceCombo) window.refreshPieceCombo();
}

els.pieceSelect.addEventListener('change', (e) => {
    const name = e.target.value;
    if (name && state.pieces[name]) {
        state.currentPiece = name;
        loadPieceData(state.pieces[name]);
        // updatePieceActiveSummary() is called inside calculate() which loadPieceData triggers
    } else {
        state.currentPiece = null;
        updatePieceActiveSummary();
    }
});

els.btnSavePiece.addEventListener('click', () => {
    if (state.currentPiece) {
        state.pieces[state.currentPiece] = getPieceData();
        savePieces();
    } else {
        els.pieceNameInput.value = '';
        els.pieceModal.classList.add('active');
    }
});

els.btnDeletePiece.addEventListener('click', () => {
    if (state.currentPiece && confirm(`¿Eliminar pieza "${state.currentPiece}"?`)) {
        const delPiece = state.currentPiece; delete state.pieces[state.currentPiece];
        state.currentPiece = null;
        savePieces();
    }
});

els.btnCancelPiece.addEventListener('click', () => els.pieceModal.classList.remove('active'));
els.btnConfirmPiece.addEventListener('click', () => {
    const name = els.pieceNameInput.value.trim();
    if (name) {
        // Se toman los datos antes de cambiar currentPiece para heredar la nota al duplicar
        const data = getPieceData();
        state.currentPiece = name;
        state.pieces[name] = data;
        savePieces();
        els.pieceModal.classList.remove('active');
    }
});

// ====== PROYECTOS GUARDADOS ======
function getProjectData() {
    return {
        pieza: state.currentPiece || null,
        pieceData: getPieceData(),
        unidadesPedido: els.unidadesPedido.value,
        precioUnitarioManual: els.precioUnitarioManual.value,
        margenGananciaProyecto: els.margenGananciaProyecto.value,
        redondeoModeProyecto: els.redondeoModeProyecto.value,
        resultados: state._lastProjectCalc || {}
    };
}

function updateProjectSelect() {
    els.projectSelect.innerHTML = '<option value="">-- Cargar Proyecto Guardado --</option>';
    for (const name in state.projects) {
        const opt = document.createElement('option');
        opt.value = name; opt.innerText = name;
        els.projectSelect.appendChild(opt);
    }
    if (state.currentProject) els.projectSelect.value = state.currentProject;
    refreshSubProjectSelect();
}

function refreshSubProjectSelect() {
    const addedNames = new Set(state.megaProjectItems.map(item => item._nombre));
    els.subProjectSelect.innerHTML = '<option value="">-- Proyectos Guardados --</option>';
    for (const name in state.projects) {
        if (addedNames.has(name)) continue;
        const opt = document.createElement('option');
        opt.value = name; opt.innerText = name;
        els.subProjectSelect.appendChild(opt);
    }
}

els.projectSelect.addEventListener('change', (e) => {
    const name = e.target.value;
    if (name && state.projects[name]) {
        state.currentProject = name;
        const proj = state.projects[name];
        // Cargar datos de pieza del proyecto
        if (proj.pieceData) loadPieceData(proj.pieceData);
        els.unidadesPedido.value = proj.unidadesPedido || '';
        els.precioUnitarioManual.value = proj.precioUnitarioManual || '';
        if (proj.margenGananciaProyecto) { els.margenGananciaProyecto.value = proj.margenGananciaProyecto; els.margenGananciaProyectoSlider.value = proj.margenGananciaProyecto; }
        if (proj.redondeoModeProyecto) els.redondeoModeProyecto.value = proj.redondeoModeProyecto;
        calculate();
    } else {
        state.currentProject = null;
    }
});

els.btnSaveProject.addEventListener('click', () => {
    if (!state._lastProjectCalc) {
        alert('Primero completa las unidades necesitadas y unidades por cama para ver resultados del proyecto.');
        return;
    }
    if (state.currentProject) {
        state.projects[state.currentProject] = getProjectData();
        saveProjects();
    } else {
        els.projectNameInput.value = state.currentPiece ? `${state.currentPiece} - ${els.unidadesPedido.value} unidades` : '';
        els.projectModal.classList.add('active');
    }
});

els.btnDeleteProject.addEventListener('click', () => {
    if (state.currentProject && confirm(`¿Eliminar proyecto "${state.currentProject}"?`)) {
        const delProj = state.currentProject; delete state.projects[state.currentProject];
        state.currentProject = null;
        saveProjects();
    }
});

els.btnCancelProject.addEventListener('click', () => els.projectModal.classList.remove('active'));
els.btnConfirmProject.addEventListener('click', () => {
    const name = els.projectNameInput.value.trim();
    if (name) {
        state.currentProject = name;
        state.projects[name] = getProjectData();
        saveProjects();
        els.projectModal.classList.remove('active');
    }
});

// ====== MEGA PROYECTOS ======
function renderMegaProjectItems() {
    els.megaProjectList.innerHTML = '';
    if (state.megaProjectItems.length === 0) {
        els.megaProjectList.innerHTML = '<li style="color: var(--text-muted); text-align: center; font-size: 0.9rem;">Lista vacía</li>';
    } else {
        state.megaProjectItems.forEach((item, index) => {
            const li = document.createElement('li');
            li.style.display = 'flex'; li.style.justifyContent = 'space-between'; li.style.alignItems = 'center';
            li.style.padding = '0.5rem 0'; li.style.borderBottom = '1px solid var(--border)';
            const nameSpan = document.createElement('span');
            nameSpan.innerText = `${item._nombre} (${item.unidadesPedido} u)`;
            const btnRemove = document.createElement('button');
            btnRemove.innerText = 'X'; btnRemove.style.color = '#ff4d4f'; btnRemove.style.background = 'none';
            btnRemove.style.border = 'none'; btnRemove.style.cursor = 'pointer';
            btnRemove.onclick = () => { state.megaProjectItems.splice(index, 1); renderMegaProjectItems(); refreshSubProjectSelect(); calculateMegaProject(); };
            li.appendChild(nameSpan); li.appendChild(btnRemove);
            els.megaProjectList.appendChild(li);
        });
    }
}

function calculateMegaProject() {
    if (state.megaProjectItems.length === 0) {
        els.megaProjectResults.style.display = 'none';
        return;
    }
    
    let totalCamas = 0, totalHoras = 0, totalTiempo_h = 0, totalGramos = 0;
    let totalMat = 0, totalLuz = 0, totalDesp = 0, totalErr = 0;
    let totalMateriales = 0, totalInsumos = 0, totalManoObra = 0, totalGanancia = 0, totalCobrar = 0;
    
    state.megaProjectItems.forEach(item => {
        const p = item.resultados;
        if (!p) return;
        totalCamas += p.camas || 0;
        totalHoras += p.horasTotales || 0;
        totalTiempo_h += p.tiempoEstProyecto || 0; 
        totalGramos += p.gramosTotales || 0;
        totalMat += p.matProyecto || 0;
        totalLuz += p.luzProyecto || 0;
        totalDesp += p.despProyecto || 0;
        totalErr += p.mErrProyecto || 0;
        totalMateriales += p.costoMaterialesProyecto || 0;
        totalInsumos += p.insumosExtraProyecto || 0;
        totalManoObra += p.manoObraProyecto || 0;
        totalGanancia += p.gananciaProyecto || 0;
        totalCobrar += p.totalCobrarTotal || 0;
    });
    
    // Calcular costo de producción promedio ponderado por pieza
    // Fórmula: para cada sub-proyecto, costoProd = (materiales + insumos + manoObra). Promedio = totalCostoProd / totalUnidades
    let totalUnidades = 0;
    let totalCostoProdMega = 0;
    state.megaProjectItems.forEach(item => {
        const p = item.resultados;
        if (!p) return;
        const unidadesItem = p.unidades || 0;
        const costoProdItem = (p.costoMaterialesProyecto || 0) + (p.insumosExtraProyecto || 0) + (p.manoObraProyecto || 0);
        totalUnidades += unidadesItem;
        totalCostoProdMega += costoProdItem;
    });
    const costoProdPiezaMegaPromedio = totalUnidades > 0 ? totalCostoProdMega / totalUnidades : 0;

    els.resMegaCamas.innerText = totalCamas.toLocaleString('es-CO');
    els.resMegaHoras.innerText = totalHoras.toLocaleString('es-CO', { maximumFractionDigits: 1 }) + ' h';
    els.resMegaTiempo.innerText = formatTime(totalTiempo_h);
    els.resMegaGramos.innerText = totalGramos.toLocaleString('es-CO', { maximumFractionDigits: 0 }) + ' g';
    
    const renderProj = (valCOP) => state.resultadosEnUSD ? formatMoney(valCOP / state.precioDolar, true) : formatMoney(valCOP, false);
    
    els.resMegaFilamento.innerText = renderProj(totalMat);
    els.resMegaLuz.innerText = renderProj(totalLuz);
    els.resMegaDesgaste.innerText = renderProj(totalDesp);
    els.resMegaMargenError.innerText = renderProj(totalErr);
    els.resMegaMateriales.innerText = renderProj(totalMateriales);
    if (totalInsumos > 0) {
        els.containerMegaInsumos.style.display = 'flex'; els.resMegaInsumos.innerText = renderProj(totalInsumos);
    } else {
        els.containerMegaInsumos.style.display = 'none'; els.resMegaInsumos.innerText = '0';
    }
    els.resMegaManoObra.innerText = renderProj(totalManoObra);
    if (els.resMegaCostoProdPieza) els.resMegaCostoProdPieza.innerText = renderProj(costoProdPiezaMegaPromedio);
    if (els.resMegaCostoProdTotal) els.resMegaCostoProdTotal.innerText = renderProj(totalCostoProdMega);
    els.resMegaGanancia.innerText = renderProj(totalGanancia);
    els.resMegaTotal.innerText = renderProj(totalCobrar);
    
    state._lastMegaProjectCalc = { 
        totalCamas, totalHoras, totalTiempo_h, totalGramos, 
        totalMat, totalLuz, totalDesp, totalErr,
        totalMateriales, totalInsumos, totalManoObra, totalGanancia, totalCobrar,
        costoProdPiezaMegaPromedio, totalCostoProdMega
    };
    els.megaProjectResults.style.display = 'block';
}

els.btnAddSubProject.addEventListener('click', () => {
    const name = els.subProjectSelect.value;
    if (!name || !state.projects[name]) { alert("Selecciona un proyecto válido de la lista."); return; }
    const cloned = JSON.parse(JSON.stringify(state.projects[name]));
    cloned._nombre = name;
    state.megaProjectItems.push(cloned);
    renderMegaProjectItems(); refreshSubProjectSelect(); calculateMegaProject();
});

function getMegaProjectData() {
    return { items: state.megaProjectItems, resultadosTotales: state._lastMegaProjectCalc || {} };
}

function updateMegaProjectSelect() {
    els.megaProjectSelect.innerHTML = '<option value="">-- Cargar Mega Proyecto --</option>';
    for (const name in state.megaProjects) {
        const opt = document.createElement('option'); opt.value = name; opt.innerText = name;
        els.megaProjectSelect.appendChild(opt);
    }
    if (state.currentMegaProject) els.megaProjectSelect.value = state.currentMegaProject;
}

els.megaProjectSelect.addEventListener('change', (e) => {
    const name = e.target.value;
    if (name && state.megaProjects[name]) {
        state.currentMegaProject = name;
        state.megaProjectItems = state.megaProjects[name].items || [];
    } else {
        state.currentMegaProject = null; state.megaProjectItems = [];
    }
    renderMegaProjectItems(); refreshSubProjectSelect(); calculateMegaProject();
});

els.btnSaveMegaProject.addEventListener('click', () => {
    if (state.megaProjectItems.length === 0) { alert("Agrega al menos un proyecto al Mega Proyecto."); return; }
    if (state.currentMegaProject) { state.megaProjects[state.currentMegaProject] = getMegaProjectData(); saveMegaProjects(); }
    else { els.megaProjectNameInput.value = ''; els.megaProjectModal.classList.add('active'); }
});

els.btnDeleteMegaProject.addEventListener('click', () => {
    if (state.currentMegaProject && confirm(`¿Eliminar Mega Proyecto "${state.currentMegaProject}"?`)) {
        const delMega = state.currentMegaProject; delete state.megaProjects[state.currentMegaProject];
        state.currentMegaProject = null;
        state.megaProjectItems = [];
        renderMegaProjectItems(); calculateMegaProject(); saveMegaProjects();
    }
});

els.btnCancelMegaProject.addEventListener('click', () => els.megaProjectModal.classList.remove('active'));
els.btnConfirmMegaProject.addEventListener('click', () => {
    const name = els.megaProjectNameInput.value.trim();
    if (name) { state.currentMegaProject = name; state.megaProjects[name] = getMegaProjectData(); saveMegaProjects(); els.megaProjectModal.classList.remove('active'); }
});

// ----- PERSISTENCIA DE DATOS ------
// Flag que bloquea cualquier guardado hasta que la carga inicial esté completa
state._appReady = false;

function showSaveToast(msg) {
    let toast = document.getElementById('_saveToast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = '_saveToast';
        toast.style.cssText = 'position:fixed;bottom:24px;right:24px;background:var(--success,#43a047);color:#fff;padding:8px 18px;border-radius:8px;font-size:0.9rem;z-index:9999;opacity:0;transition:opacity 0.3s;pointer-events:none;';
        document.body.appendChild(toast);
    }
    toast.innerHTML = msg || '<i class="bi bi-check-circle"></i> Guardado';
    toast.style.opacity = '1';
    clearTimeout(toast._t);
    toast._t = setTimeout(() => { toast.style.opacity = '0'; }, 2000);
}
window.showSaveToast = showSaveToast;


async function saveAllData() {
    // Nunca guardar durante la carga inicial (evita sobreescribir con estado vacío)
    if (!state._appReady) return;
    try {
        const payload = JSON.stringify({
            profiles: state.profiles,
            pieces: state.pieces,
            projects: state.projects,
            megaProjects: state.megaProjects,
            filamentos: state.filamentosGuardados || [],
            empresas: state.empresas || {},
            empresaActiva: state.empresaActiva || null,
            incluirEmpresa: !!state.incluirEmpresa,
            tema: state.tema || null
        });
        if (window.pywebview) {
            await window.pywebview.api.save_profiles(payload);
        } else {
            // Fallback web app: guardar todo en localStorage
            localStorage.setItem('calculadora3d_alldata', payload);
        }
        showSaveToast('<i class="bi bi-check-circle"></i> Guardado');
    } catch(e) {
        console.error('Error al guardar:', e);
        showSaveToast('<i class="bi bi-exclamation-triangle"></i> Error al guardar');
    }
}

window.saveAllData = saveAllData;

async function loadProfiles() {
    try {
        let saved = null;
        if (window.pywebview) {
            saved = await window.pywebview.api.load_profiles();
        } else {
            // Fallback web app: cargar desde localStorage unificado
            saved = localStorage.getItem('calculadora3d_alldata');
        }
        if (saved && saved !== '{}') {
            const parsed = JSON.parse(saved);
            state.profiles = parsed.profiles || (typeof parsed === 'object' && !parsed.pieces ? parsed : {});
            state.pieces = parsed.pieces || {};
            state.projects = parsed.projects || {};
            state.megaProjects = parsed.megaProjects || {};
            if (parsed.filamentos && parsed.filamentos.length > 0) {
                state.filamentosGuardados = parsed.filamentos;
            }
            state.empresas = parsed.empresas || {};
            state.empresaActiva = parsed.empresaActiva || null;
            state.incluirEmpresa = !!parsed.incluirEmpresa;
            state.tema = parsed.tema || null;
            if (window.aplicarTemaGuardado) window.aplicarTemaGuardado();
            if (window.renderFilamentosGuardados) window.renderFilamentosGuardados();
            updateProfileSelect();
            updatePieceSelect();
            updateProjectSelect();
            updateMegaProjectSelect();
        }
    } catch(e) { console.error('Error al cargar datos:', e); }
    // Marcar la app como lista DESPUÉS de cargar todo
    state._appReady = true;
}

async function saveProfiles() { await saveAllData(); updateProfileSelect(); }
async function savePieces() { await saveAllData(); updatePieceSelect(); }
async function saveProjects() { await saveAllData(); updateProjectSelect(); }
async function saveMegaProjects() { await saveAllData(); updateMegaProjectSelect(); }

// Datos de la empresa para las cotizaciones, o cadena vacía si no se quieren
function empresaJSON() {
    const emp = window.empresaParaCotizacion ? window.empresaParaCotizacion() : null;
    return emp ? JSON.stringify(emp) : '';
}

els.btnExportPdf.addEventListener('click', async () => {
    const total = formatMoney(lastCalcResults['Total a Cobrar'], false);
    const gFil = lastCalcResults['_gramos_input'];
    const tiempo_prod = lastCalcResults['Tiempo Est. Producción'] || '';
    const nombre = state.currentPiece || '';
    if(window.pywebview) {
        await window.pywebview.api.export_pdf(total, gFil, tiempo_prod, nombre, empresaJSON());
    } else if (window.exportPdfPieza) {
        window.exportPdfPieza(total, gFil, tiempo_prod, nombre);
    }
});

els.btnExportExcel.addEventListener('click', async () => {
    const d = {...lastCalcResults};
    delete d['_gramos_input'];
    delete d['_horas_impresion'];
    delete d['_costo_produccion_raw'];
    delete d['_despCOP'];
    delete d['_mErrCOP'];
    delete d['_tiempo_prod_cama_h'];
    delete d['_hInv'];
    delete d['_listaMaterialesUnidad']; // Remove array to prevent Excel export crash
    for(let k in d) d[k] = isNaN(d[k]) && typeof d[k] === 'string' && (d[k].includes('min') || d[k].includes('h')) ? d[k] : formatMoney(d[k], false);
    const nombre = state.currentPiece || '';
    if(window.pywebview) {
        await window.pywebview.api.export_excel(JSON.stringify(d), nombre);
    } else if (window.exportExcelPieza) {
        window.exportExcelPieza(JSON.stringify(d), nombre);
    }
});

els.btnExportProjectPdf.addEventListener('click', async () => {
    if(state._lastProjectCalc) {
        const p = state._lastProjectCalc;
        const total = formatMoney(p.totalCobrarTotal, false);
        const precio_cama = formatMoney(applyRedondeo(lastCalcResults['_total_cobrar_raw'], els.redondeoMode.value), false);
        const matPdf = formatMoney(p.costoMaterialesProyecto, false);
        const insPdf = p.insumosExtraProyecto > 0 ? formatMoney(p.insumosExtraProyecto, false) : "0";
        const moPdf = formatMoney(p.manoObraProyecto, false);
        const tiempo_proy = formatTime(p.tiempoEstProyecto);
        const costo_unidad_pdf = formatMoney(p.costoPorUnidad, false);
        const costo_prod_pieza_pdf = p.costoProduccionPiezaProyecto ? formatMoney(p.costoProduccionPiezaProyecto, false) : null;
        const costo_prod_total_pdf = p.costoProduccionTotalProyecto ? formatMoney(p.costoProduccionTotalProyecto, false) : null;
        const nombre = state.currentProject || '';
        
        if (window.exportPdfProyecto) {
            window.exportPdfProyecto(total, p.gramosTotales, p.camas, p.unidades, p.unidadesCama, precio_cama, matPdf, insPdf, moPdf, tiempo_proy, costo_unidad_pdf, nombre, costo_prod_pieza_pdf, costo_prod_total_pdf);
        } else if (window.pywebview) {
            await window.pywebview.api.export_project_pdf(total, p.gramosTotales, p.camas, p.unidades, p.unidadesCama, precio_cama, matPdf, insPdf, moPdf, tiempo_proy, costo_unidad_pdf, nombre, costo_prod_pieza_pdf, costo_prod_total_pdf, empresaJSON());
        }
    }
});

els.btnExportProjectExcel.addEventListener('click', async () => {
    if(state._lastProjectCalc) {
        const p = state._lastProjectCalc;
        const precio_cama = applyRedondeo(lastCalcResults['_total_cobrar_raw'], els.redondeoMode.value);
        const d = {
            'Unidades de Pedido': p.unidades,
            'Unidades por Cama': p.unidadesCama,
            'Total de Camas': p.camas,
            'Tiempo Estimado de Producción': formatTime(p.tiempoEstProyecto),
            'Horas de Impresión': p.horasTotales,
            'Gramos Totales': p.gramosTotales,
            'Costo Total Materiales': formatMoney(p.costoMaterialesProyecto, false)
        };
        if (p.insumosExtraProyecto > 0) {
            d['Insumos Extra'] = formatMoney(p.insumosExtraProyecto, false);
        }
        d['Mano de Obra'] = formatMoney(p.manoObraProyecto, false);
        if (p.costoProduccionPiezaProyecto) d['Costo Producción (1 pieza)'] = formatMoney(p.costoProduccionPiezaProyecto, false);
        if (p.costoProduccionTotalProyecto) d['Costo Producción (proyecto completo)'] = formatMoney(p.costoProduccionTotalProyecto, false);
        d['Total a Cobrar por Proyecto'] = formatMoney(p.totalCobrarTotal, false);
        d['Costo por Unidad'] = formatMoney(p.costoPorUnidad, false);
        d['Precio a cobrar (1 cama)'] = formatMoney(precio_cama, false);
        const nombre = state.currentProject || '';
        
        if (window.pywebview) {
            await window.pywebview.api.export_project_excel(JSON.stringify(d), nombre);
        } else if (window.exportExcelProyecto) {
            window.exportExcelProyecto(JSON.stringify(d), nombre);
        }
    }
});

els.btnExportMegaPdf.addEventListener('click', async () => {
    if(state._lastMegaProjectCalc && state.megaProjectItems.length > 0) {
        const payloadObj = {
            nombre: state.currentMegaProject || "Mega Proyecto",
            items: state.megaProjectItems.map(p => ({
                nombre: p._nombre,
                unidades: p.unidadesPedido,
                camas: p.resultados.camas,
                costo_unidad: formatMoney(p.resultados.costoPorUnidad, false),
                costo_prod_pieza: p.resultados.costoProduccionPiezaProyecto ? formatMoney(p.resultados.costoProduccionPiezaProyecto, false) : null,
                insumos: formatMoney(p.resultados.insumosExtraProyecto, false),
                tiempo: formatTime(p.resultados.tiempoEstProyecto || 0),
                total: formatMoney(p.resultados.totalCobrarTotal, false)
            })),
            totales: {
                camas: state._lastMegaProjectCalc.totalCamas,
                horas: Math.ceil(state._lastMegaProjectCalc.totalHoras),
                tiempo: formatTime(state._lastMegaProjectCalc.totalTiempo_h),
                insumos: formatMoney(state._lastMegaProjectCalc.totalInsumos, false),
                costo_prod_pieza: state._lastMegaProjectCalc.costoProdPiezaMegaPromedio ? formatMoney(state._lastMegaProjectCalc.costoProdPiezaMegaPromedio, false) : null,
                costo_prod_total: state._lastMegaProjectCalc.totalCostoProdMega ? formatMoney(state._lastMegaProjectCalc.totalCostoProdMega, false) : null,
                total: formatMoney(state._lastMegaProjectCalc.totalCobrar, false)
            }
        };
        
        if (window.pywebview) {
            await window.pywebview.api.export_megaproject_pdf(JSON.stringify(payloadObj), empresaJSON());
        } else if (window.exportPdfMegaProyecto) {
            window.exportPdfMegaProyecto(payloadObj);
        }
    }
});

els.btnExportMegaExcel.addEventListener('click', async () => {
    if(state._lastMegaProjectCalc && state.megaProjectItems.length > 0) {
        const payloadObj = {
            nombre: state.currentMegaProject || "Mega Proyecto",
            items: state.megaProjectItems.map(p => ({
                'Nombre': p._nombre,
                'Unidades': p.unidadesPedido,
                'Camas': p.resultados.camas,
                'Horas Totales': p.resultados.horasTotales,
                'Gramos': p.resultados.gramosTotales,
                'Materiales': formatMoney(p.resultados.costoMaterialesProyecto, false),
                'Insumos': formatMoney(p.resultados.insumosExtraProyecto, false),
                'Mano de Obra': formatMoney(p.resultados.manoObraProyecto, false),
                'Costo Prod. (c/u)': p.resultados.costoProduccionPiezaProyecto ? formatMoney(p.resultados.costoProduccionPiezaProyecto, false) : '—',
                'Total': formatMoney(p.resultados.totalCobrarTotal, false)
            })),
            totales: {
                'Total Camas': state._lastMegaProjectCalc.totalCamas,
                'Total Horas': state._lastMegaProjectCalc.totalHoras,
                'Tiempo Est. Total': formatTime(state._lastMegaProjectCalc.totalTiempo_h),
                'Gramos Totales': state._lastMegaProjectCalc.totalGramos,
                'Costo Materiales Global': formatMoney(state._lastMegaProjectCalc.totalMateriales, false),
                'Insumos Globales': formatMoney(state._lastMegaProjectCalc.totalInsumos, false),
                'Mano de Obra Global': formatMoney(state._lastMegaProjectCalc.totalManoObra, false),
                'Costo Producción promedio (c/u)': state._lastMegaProjectCalc.costoProdPiezaMegaPromedio ? formatMoney(state._lastMegaProjectCalc.costoProdPiezaMegaPromedio, false) : '—',
                'Costo Producción total Mega Proyecto': state._lastMegaProjectCalc.totalCostoProdMega ? formatMoney(state._lastMegaProjectCalc.totalCostoProdMega, false) : '—',
                'TOTAL A COBRAR MEGA PROYECTO': formatMoney(state._lastMegaProjectCalc.totalCobrar, false)
            }
        };
        if (window.pywebview) {
            await window.pywebview.api.export_megaproject_excel(JSON.stringify(payloadObj));
        } else if (window.exportExcelMegaProyecto) {
            window.exportExcelMegaProyecto(JSON.stringify(payloadObj));
        }
    }
});

// Importar/Exportar Perfiles
els.btnExportProfiles.addEventListener('click', async () => {
    if(Object.keys(state.profiles).length > 0) {
        if(window.pywebview) {
            await window.pywebview.api.export_profiles_file(JSON.stringify(state.profiles, null, 2));
        } else {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state.profiles, null, 2));
            const dlAnchorElem = document.createElement('a');
            dlAnchorElem.setAttribute("href", dataStr);
            dlAnchorElem.setAttribute("download", "perfiles_3d.json");
            dlAnchorElem.click();
        }
    } else {
        alert("No hay perfiles para exportar.");
    }
});

els.btnImportProfiles.addEventListener('click', async () => {
    if(window.pywebview) {
        const imported = await window.pywebview.api.import_profiles_file();
        if(imported && imported !== "{}") {
            try {
                const newData = JSON.parse(imported);
                state.profiles = { ...state.profiles, ...newData };
                saveProfiles();
                alert("Perfiles importados con éxito.");
            } catch(e) { alert("El archivo no es válido."); }
        }
    } else {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json';
        input.onchange = e => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = event => {
                try {
                    const newData = JSON.parse(event.target.result);
                    state.profiles = { ...state.profiles, ...newData };
                    saveProfiles();
                    alert("Perfiles importados con éxito.");
                } catch(e) { alert("El archivo no es válido."); }
            };
            reader.readAsText(file);
        };
        input.click();
    }
});
// ------------------------------------------

function updateProfileSelect() {
    els.profileSelect.innerHTML = '<option value="">-- Seleccionar Perfil --</option>';
    for (const name in state.profiles) {
        const opt = document.createElement('option');
        opt.value = name;
        opt.innerText = name;
        els.profileSelect.appendChild(opt);
    }
    if (state.currentProfile) {
        els.profileSelect.value = state.currentProfile;
    }
}

function getFormData() {
    return {
        precioKg: els.precioKg.value, monedaFilamento: els.monedaFilamento.value,
        precioKwh: els.precioKwh.value, consumoWatts: els.consumoWatts.value,
        desgasteMaquina: els.desgasteMaquina.value, precioRepuestos: els.precioRepuestos.value,
        monedaRepuestos: els.monedaRepuestos.value, manoObraHora: els.manoObraHora.value,
        margenError: els.margenError.value, precioDolar: els.precioDolar.value
    };
}

function loadFormData(data) {
    if(!data) return;
    els.precioKg.value = data.precioKg || ''; if(data.monedaFilamento) els.monedaFilamento.value = data.monedaFilamento;
    els.precioKwh.value = data.precioKwh || ''; els.consumoWatts.value = data.consumoWatts || '';
    els.desgasteMaquina.value = data.desgasteMaquina || ''; els.precioRepuestos.value = data.precioRepuestos || '';
    if(data.monedaRepuestos) els.monedaRepuestos.value = data.monedaRepuestos;
    els.manoObraHora.value = data.manoObraHora || ''; els.margenError.value = data.margenError || '';
    els.precioDolar.value = data.precioDolar || '';
    calculate();
}

function clearFormData() {
    els.precioKg.value = ''; els.monedaFilamento.value = 'COP';
    els.precioKwh.value = ''; els.consumoWatts.value = '';
    els.desgasteMaquina.value = ''; els.precioRepuestos.value = ''; els.monedaRepuestos.value = 'COP';
    els.manoObraHora.value = ''; els.margenError.value = '';
    els.profileSelect.value = ''; state.currentProfile = null;
    calculate();
}

els.profileSelect.addEventListener('change', (e) => {
    const name = e.target.value;
    if (name && state.profiles[name]) {
        state.currentProfile = name;
        loadFormData(state.profiles[name]);
    } else {
        clearFormData();
    }
});

els.btnNewProfile.addEventListener('click', () => {
    els.profileNameInput.value = ''; state.currentProfile = null; els.modal.classList.add('active');
});

els.btnSaveProfile.addEventListener('click', () => {
    if (state.currentProfile) {
        state.profiles[state.currentProfile] = getFormData();
        saveProfiles();
    } else {
        els.modal.classList.add('active');
    }
});

els.btnDeleteProfile.addEventListener('click', () => {
    if (state.currentProfile && confirm(`¿Eliminar perfil "${state.currentProfile}"?`)) {
        const delName = state.currentProfile; delete state.profiles[state.currentProfile];
        clearFormData(); saveProfiles();
    }
});

els.btnCancelSave.addEventListener('click', () => els.modal.classList.remove('active'));
els.btnConfirmSave.addEventListener('click', () => {
    const name = els.profileNameInput.value.trim();
    if (name) {
        state.currentProfile = name; state.profiles[name] = getFormData();
        saveProfiles();
        els.modal.classList.remove('active');
    }
});

if (els.precioVentaPieza) els.precioVentaPieza.addEventListener('input', calculate);
els.margenGananciaSlider.addEventListener('input', (e) => { els.margenGanancia.value = e.target.value; calculate(); });
els.margenGanancia.addEventListener('input', (e) => { els.margenGananciaSlider.value = e.target.value; calculate(); });
els.margenGananciaProyectoSlider.addEventListener('input', (e) => { els.margenGananciaProyecto.value = e.target.value; calculateProject(); MegaProjectSync(); });
els.margenGananciaProyecto.addEventListener('input', (e) => { els.margenGananciaProyectoSlider.value = e.target.value; calculateProject(); MegaProjectSync(); });
els.redondeoModeProyecto.addEventListener('change', () => { calculateProject(); MegaProjectSync(); });

function MegaProjectSync() {
    if (state.currentProject && state.megaProjectItems.length > 0) {
        state.megaProjectItems.forEach(item => {
            if (item._nombre === state.currentProject) {
                Object.assign(item, getProjectData());
                item._nombre = state.currentProject;
            }
        });
        calculateMegaProject();
    }
}
els.toggleMonedaResultados.addEventListener('change', () => { calculate(); calculateMegaProject(); });
els.monedaFilamento.addEventListener('change', calculate);
els.monedaRepuestos.addEventListener('change', calculate);
els.monedaInsumosACobrar.addEventListener('change', calculate);
els.unidadesPedido.addEventListener('input', calculateProject);
els.precioUnitarioManual.addEventListener('input', calculateProject);

document.querySelectorAll('input:not([type="range"]):not(#margenGanancia):not(#toggleMonedaResultados):not(#unidadesPedido):not(#precioUnitarioManual), select').forEach(el => {
    el.addEventListener('input', calculate);
});


// ====== LISTENER BOM PIEZA ======
if (els.btnExportBom) {
    els.btnExportBom.addEventListener('click', async () => {
        const lista = lastCalcResults['_listaMaterialesUnidad'] || [];
        const nombre = state.currentPiece || 'pieza';
        if (lista.length === 0) { alert('No hay materiales calculados. Completa los datos de la pieza primero.'); return; }
        
        // Agrupar por filamento
        const grupos = {};
        lista.forEach(item => {
            const key = `${item.ref.marca} ${item.ref.tipo} - ${item.ref.color}`;
            grupos[key] = (grupos[key] || 0) + item.gramos;
        });
        
        let report = `=== LISTA DE MATERIALES - ${nombre.toUpperCase()} ===\n`;
        report += `Fecha: ${new Date().toLocaleDateString('es-CO')}\n\n`;
        report += `MATERIALES (por cama):\n`;
        Object.entries(grupos).forEach(([mat, g]) => {
            report += `  - ${mat}: ${g.toFixed(1)} g\n`;
        });
        report += `\nTotal gramos: ${(lastCalcResults['_gramos_input'] || 0).toFixed(1)} g\n`;
        
        if (window.pywebview) {
            await window.pywebview.api.export_bom(report, nombre);
        } else if (window.exportBomPieza) {
            window.exportBomPieza(report, nombre);
        } else {
            // Fallback: descarga como .txt en web
            const blob = new Blob([report], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url; a.download = `BOM_${nombre}.txt`; a.click();
            URL.revokeObjectURL(url);
        }
    });
}

// Helper: resolver nombre de filamento por ID, con fallback al label guardado
function resolveFilamentoLabel(id, storedLabel) {
    const f = state.filamentosGuardados.find(x => x.id === id);
    if (f) return `${f.marca} ${f.tipo} - ${f.color}`;
    return storedLabel || 'Desconocido';
}

// Helper: construir mapa de materiales desde pieceData (independiente del dropdown)
function buildMaterialesFromPieceData(pieceData, camas) {
    const grupos = {};
    if (!pieceData) return grupos;
    const mainG = parseFloat(pieceData.gramosFilamento) || 0;
    if (mainG > 0) {
        const label = resolveFilamentoLabel(pieceData.filamentoPrincipalId, pieceData.filamentoPrincipalLabel);
        grupos[label] = (grupos[label] || 0) + mainG * camas;
    }
    if (pieceData.variosFilamentos && Array.isArray(pieceData.filamentosExtraItems)) {
        pieceData.filamentosExtraItems.forEach(item => {
            const g = parseFloat(item.gramos) || 0;
            if (g > 0) {
                const label = resolveFilamentoLabel(item.idFilamento, item.label);
                grupos[label] = (grupos[label] || 0) + g * camas;
            }
        });
    }
    // Partes extra
    if (Array.isArray(pieceData.partesExtraItems)) {
        pieceData.partesExtraItems.forEach(parte => {
            const g = parseFloat(parte.gramos) || 0;
            if (g > 0) {
                const label = resolveFilamentoLabel(parte.idFilamento, parte.label || parte.color || 'Extra');
                grupos[label] = (grupos[label] || 0) + g * camas;
            }
        });
    }
    return grupos;
}

// ====== LISTENER BOM PROYECTO ======
const btnExportProjectBom = document.getElementById('btnExportProjectBom');
if (btnExportProjectBom) {
    btnExportProjectBom.addEventListener('click', async () => {
        if (!state._lastProjectCalc) { alert('Primero calcula el proyecto.'); return; }
        const p = state._lastProjectCalc;
        const nombre = state.currentProject || state.currentPiece || 'proyecto';
        // Leer desde pieceData guardada (no depende del dropdown actual)
        const pieceData = state.currentPiece ? state.pieces[state.currentPiece] : null;
        const grupos = buildMaterialesFromPieceData(pieceData, p.camas);

        let report = `=== LISTA DE MATERIALES - PROYECTO: ${nombre.toUpperCase()} ===\n`;
        report += `Fecha: ${new Date().toLocaleDateString('es-CO')}\n`;
        report += `Unidades: ${p.unidades} | Camas: ${p.camas}\n\n`;
        report += `MATERIALES TOTALES (${p.camas} camas):\n`;
        Object.entries(grupos).forEach(([mat, g]) => {
            report += `  - ${mat}: ${g.toFixed(1)} g\n`;
        });
        report += `\nTotal gramos proyecto: ${(p.gramosTotales || 0).toFixed(1)} g\n`;

        if (window.pywebview) {
            await window.pywebview.api.export_bom(report, `Proyecto_${nombre}`);
        } else if (window.exportBomPieza) {
            window.exportBomPieza(report, `Proyecto_${nombre}`);
        } else {
            const blob = new Blob([report], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url; a.download = `BOM_Proyecto_${nombre}.txt`; a.click();
            URL.revokeObjectURL(url);
        }
    });
}

// ====== LISTENER BOM MEGA PROYECTO ======
const btnExportMegaBom = document.getElementById('btnExportMegaBom');
if (btnExportMegaBom) {
    btnExportMegaBom.addEventListener('click', async () => {
        if (!state._lastMegaProjectCalc || state.megaProjectItems.length === 0) { alert('Primero agrega proyectos al Mega Proyecto.'); return; }
        const nombre = state.currentMegaProject || 'mega_proyecto';
        const gruposGlobal = {};

        let report = `=== LISTA DE MATERIALES - MEGA PROYECTO: ${nombre.toUpperCase()} ===\n`;
        report += `Fecha: ${new Date().toLocaleDateString('es-CO')}\n\n`;

        state.megaProjectItems.forEach(item => {
            const pieceData = item.pieceData;
            const camas = item.resultados ? item.resultados.camas : 0;
            if (!pieceData) return;
            report += `--- ${item._nombre} (${item.unidadesPedido} u, ${camas} camas) ---\n`;
            const grupos = buildMaterialesFromPieceData(pieceData, camas);
            Object.entries(grupos).forEach(([mat, g]) => {
                report += `  - ${mat}: ${g.toFixed(1)} g\n`;
                gruposGlobal[mat] = (gruposGlobal[mat] || 0) + g;
            });
            report += `\n`;
        });

        report += `TOTALES DEL MEGA PROYECTO:\n`;
        report += `  Total de camas: ${state._lastMegaProjectCalc.totalCamas}\n`;
        Object.entries(gruposGlobal).forEach(([mat, g]) => {
            report += `  - ${mat}: ${g.toFixed(1)} g\n`;
        });
        report += `  Total gramos: ${(state._lastMegaProjectCalc.totalGramos || 0).toFixed(1)} g\n`;

        if (window.pywebview) {
            await window.pywebview.api.export_bom(report, `MegaProyecto_${nombre}`);
        } else {
            const blob = new Blob([report], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url; a.download = `BOM_MegaProyecto_${nombre}.txt`; a.click();
            URL.revokeObjectURL(url);
        }
    });
}

// Init cuando la API de Python esté lista
window.addEventListener('pywebviewready', function() {
    loadProfiles().then(calculate);
});
// Fallback para web app (sin pywebview): también cargar datos antes de calcular
setTimeout(() => { if(!window.pywebview) loadProfiles().then(calculate); }, 500);


// ====== CONFIGURACIÓN DE IMPRESIÓN - TOGGLES ======
// Toggle principal
document.getElementById('printConfigToggle').addEventListener('click', () => {
    const body = document.getElementById('printConfigBody');
    const arrow = document.getElementById('printConfigArrow');
    const isOpen = body.style.display !== 'none';
    body.style.display = isOpen ? 'none' : 'flex';
    arrow.classList.toggle('open', !isOpen);
});

// Sub-secciones toggle
document.querySelectorAll('.print-subsection-header').forEach(header => {
    header.addEventListener('click', () => {
        const targetId = header.getAttribute('data-target');
        const body = document.getElementById(targetId);
        const arrow = header.querySelector('.print-subsection-arrow');
        const isOpen = body.style.display !== 'none';
        body.style.display = isOpen ? 'none' : 'block';
        arrow.classList.toggle('open', !isOpen);
    });
});

// Soportes checkbox -> mostrar/ocultar detalles
function toggleSoportesDetail() {
    const checked = document.getElementById('cfgLlevaSoportes').checked;
    document.querySelectorAll('.cfg-soportes-detail').forEach(el => {
        el.style.display = checked ? '' : 'none';
    });
}
document.getElementById('cfgLlevaSoportes').addEventListener('change', toggleSoportesDetail);

// Toggle Configuración Capas Distintas
document.getElementById('topLayerConfigToggle').addEventListener('click', () => {
    const body = document.getElementById('topLayerConfigBody');
    const arrow = document.getElementById('topLayerConfigArrow');
    const isOpen = body.style.display !== 'none';
    body.style.display = isOpen ? 'none' : 'flex';
    arrow.classList.toggle('open', !isOpen);
});

let debounceSaveTimeout;
function autoSaveCurrentState() {
    // No guardar si la carga inicial aún no terminó
    if (!state._appReady) return;
    clearTimeout(debounceSaveTimeout);
    debounceSaveTimeout = setTimeout(() => {
        let changed = false;
        if (state.currentProfile) {
            state.profiles[state.currentProfile] = getFormData();
            changed = true;
        }
        if (state.currentPiece) {
            state.pieces[state.currentPiece] = getPieceData();
            changed = true;
        }
        if (state.currentProject) {
            state.projects[state.currentProject] = getProjectData();
            changed = true;
        }
        if (changed) saveAllData();
    }, 1500);
}

// ===== PIECE TABS LOGIC =====
(function() {
    const tabNav = document.getElementById('pieceTabs');
    if (!tabNav) return;
    tabNav.addEventListener('click', function(e) {
        const btn = e.target.closest('.piece-tab-btn');
        if (!btn) return;
        const targetId = btn.dataset.tab;
        // Desactivar todos
        tabNav.querySelectorAll('.piece-tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.piece-tab-content').forEach(p => p.classList.remove('active'));
        // Activar el clickeado
        btn.classList.add('active');
        const panel = document.getElementById(targetId);
        if (panel) panel.classList.add('active');
    });
})();
// ===== END PIECE TABS LOGIC =====

// ===== DUPLICAR PIEZA =====
(function() {
    const btn = document.getElementById('btnDuplicatePiece');
    if (!btn) return;
    btn.addEventListener('click', () => {
        if (!state.currentPiece) { alert('Carga una pieza primero para duplicarla.'); return; }
        els.pieceNameInput.value = 'Copia de ' + state.currentPiece;
        window._isDuplicating = true;
        els.pieceModal.classList.add('active');
        els.pieceNameInput.focus();
        els.pieceNameInput.select();
    });
})();
// ===== FIN DUPLICAR PIEZA =====

// ===== COMBOBOX DE PIEZAS (buscar dentro del propio desplegable) =====
(function() {
    const combo   = document.getElementById('pieceCombo');
    const input   = document.getElementById('pieceComboInput');
    const list    = document.getElementById('pieceComboList');
    const countEl = document.getElementById('pieceSearchCount');
    const btnClear = document.getElementById('pieceComboClear');
    const btnArrow = document.getElementById('pieceComboArrow');
    if (!combo || !input || !list) return;

    let open = false;
    let query = '';          // texto tecleado para filtrar
    let filtered = [];       // nombres visibles
    let activeIdx = -1;      // opción resaltada con teclado
    let openInfo = null;     // nombre de la pieza con el panel ⓘ desplegado

    const RE_DIACRITICOS = new RegExp('[\\u0300-\\u036f]', 'g');
    const norm = (s) => (s || '').toString().toLowerCase()
        .normalize('NFD').replace(RE_DIACRITICOS, '');
    const esc = (s) => (s || '').toString()
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');

    function highlight(name) {
        if (!query) return esc(name);
        // Solo se resalta si coincide literalmente; el filtro sí ignora tildes
        const i = name.toLowerCase().indexOf(query.toLowerCase());
        if (i < 0) return esc(name);
        return esc(name.slice(0, i)) + '<mark>' + esc(name.slice(i, i + query.length)) + '</mark>' + esc(name.slice(i + query.length));
    }

    function allNames() {
        return Object.keys(state.pieces).sort((a, b) => a.localeCompare(b, 'es'));
    }

    // --- Resumen mostrado por el ícono de información ---
    function pieceInfoRows(d) {
        const rows = [];
        const num = (v) => { const n = parseFloat(v); return isNaN(n) ? 0 : n; };

        const h = num(d.horasImpresion), m = num(d.minutosImpresion);
        if (h || m) rows.push(['Impresión', `${h}h ${m}min`]);

        let gramos = num(d.gramosFilamento);
        (d.filamentosExtraItems || []).forEach(f => gramos += num(f.gramos));
        if (gramos) rows.push(['Filamento', `${gramos} g`]);

        if (d.filamentoPrincipalLabel) rows.push(['Material', d.filamentoPrincipalLabel]);
        (d.filamentosExtraItems || []).forEach(f => {
            if (f.label) rows.push(['+ Material', `${f.label} (${num(f.gramos)} g)`]);
        });

        if (d.colorPrincipal) rows.push(['Color', d.colorPrincipal]);

        const partes = (d.partesExtraItems || []).length;
        if (partes) rows.push(['Partes extra', String(partes)]);
        const insumos = (d.insumosExtraItems || []).length;
        if (insumos) rows.push(['Insumos', String(insumos)]);

        if (num(d.unidadesCama) > 1) rows.push(['Por cama', `${num(d.unidadesCama)} u`]);
        if (num(d.margenGanancia)) rows.push(['Margen', `${num(d.margenGanancia)}%`]);
        if (num(d.precioVentaPieza)) rows.push(['Precio fijo', formatMoney(num(d.precioVentaPieza), false)]);

        const pc = d.printConfig || {};
        if (pc.alturaCapa) rows.push(['Altura capa', `${pc.alturaCapa} mm`]);
        if (pc.densidadRelleno) rows.push(['Relleno', `${pc.densidadRelleno}%`]);
        if (pc.llevaSoportes) rows.push(['Soportes', 'Sí']);

        return rows;
    }

    function detailsHTML(name) {
        const d = state.pieces[name] || {};
        const rows = pieceInfoRows(d);
        const grid = rows.length
            ? '<dl class="piece-combo-details-grid">' +
              rows.map(r => `<dt>${esc(r[0])}</dt><dd>${esc(r[1])}</dd>`).join('') +
              '</dl>'
            : '<div style="color:var(--text-muted);margin-bottom:0.55rem;">Sin datos guardados.</div>';
        return `<div class="piece-combo-details" data-details="${esc(name)}">
            ${grid}
            <label class="piece-combo-note-label">Nota / descripción (para acordarte qué es)</label>
            <textarea class="piece-combo-note" data-note="${esc(name)}"
                      placeholder="Ej: llavero perro caricatura, versión con anilla grande">${esc(d.nota || '')}</textarea>
        </div>`;
    }

    // --- Render de la lista filtrada ---
    function render() {
        const names = allNames();
        filtered = query ? names.filter(n => norm(n).includes(norm(query))) : names;

        if (countEl) countEl.textContent = query ? `${filtered.length}/${names.length}` : `${names.length}`;
        combo.classList.toggle('has-value', !!state.currentPiece);

        if (!names.length) {
            list.innerHTML = '<div class="piece-combo-empty">No hay piezas guardadas todavía.</div>';
            return;
        }
        if (!filtered.length) {
            list.innerHTML = `<div class="piece-combo-empty">Sin coincidencias para "${esc(query)}"</div>`;
            return;
        }
        if (activeIdx >= filtered.length) activeIdx = filtered.length - 1;

        list.innerHTML = filtered.map((name, i) => {
            const cls = ['piece-combo-option'];
            if (i === activeIdx) cls.push('active');
            if (name === state.currentPiece) cls.push('selected');
            const nota = ((state.pieces[name] || {}).nota || '').trim();
            const infoCls = 'piece-combo-info'
                + (openInfo === name ? ' open' : '')
                + (nota ? ' has-note' : '');
            const title = nota ? esc(nota) : 'Ver detalles de la pieza';
            return `<div class="${cls.join(' ')}" role="option" data-name="${esc(name)}" aria-selected="${name === state.currentPiece}">
                        <span class="piece-combo-option-name">${highlight(name)}</span>
                        <button type="button" class="${infoCls}" data-info="${esc(name)}" title="${title}" tabindex="-1"><i class="bi bi-info-circle"></i></button>
                    </div>` + (openInfo === name ? detailsHTML(name) : '');
        }).join('');

        const act = list.querySelector('.piece-combo-option.active');
        if (act) act.scrollIntoView({ block: 'nearest' });
    }

    function syncInput() {
        combo.classList.toggle('has-value', !!state.currentPiece);
        if (!open) input.value = state.currentPiece || '';
    }

    function openList() {
        open = true;
        query = '';
        openInfo = null;
        activeIdx = -1;
        combo.classList.add('open');
        list.hidden = false;
        input.setAttribute('aria-expanded', 'true');
        input.value = '';
        input.placeholder = state.currentPiece || 'Escribe para filtrar...';
        render();
        // Resalta la pieza cargada actualmente, si sigue en la lista
        const sel = filtered.indexOf(state.currentPiece);
        if (sel >= 0) { activeIdx = sel; render(); }
    }

    function closeList() {
        open = false;
        query = '';
        activeIdx = -1;
        openInfo = null;
        combo.classList.remove('open');
        list.hidden = true;
        input.setAttribute('aria-expanded', 'false');
        input.placeholder = '-- Cargar Pieza Guardada --';
        syncInput();
    }

    function selectPiece(name) {
        els.pieceSelect.value = name || '';
        els.pieceSelect.dispatchEvent(new Event('change'));
        closeList();
    }

    // --- Eventos ---
    input.addEventListener('focus', () => { if (!open) openList(); });
    input.addEventListener('mousedown', () => { if (!open) setTimeout(() => openList(), 0); });

    input.addEventListener('input', () => {
        if (!open) openList();
        query = input.value;
        activeIdx = query ? 0 : -1;
        openInfo = null;
        render();
    });

    input.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            if (!open) { openList(); return; }
            if (!filtered.length) return;
            const dir = e.key === 'ArrowDown' ? 1 : -1;
            activeIdx = (activeIdx + dir + filtered.length) % filtered.length;
            render();
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (open && activeIdx >= 0 && filtered[activeIdx]) selectPiece(filtered[activeIdx]);
            else if (open && filtered.length === 1) selectPiece(filtered[0]);
        } else if (e.key === 'Escape') {
            if (open) { e.preventDefault(); closeList(); }
        } else if (e.key === 'Tab') {
            if (open) closeList();
        }
    });

    // Clicks dentro de la lista (opción, ícono ⓘ, nota)
    list.addEventListener('mousedown', (e) => {
        // Evita que el input pierda el foco antes de procesar el click
        if (!e.target.closest('.piece-combo-details')) e.preventDefault();
    });
    list.addEventListener('click', (e) => {
        const info = e.target.closest('.piece-combo-info');
        if (info) {
            const name = info.getAttribute('data-info');
            openInfo = (openInfo === name) ? null : name;
            render();
            return;
        }
        if (e.target.closest('.piece-combo-details')) return; // no seleccionar al editar la nota
        const opt = e.target.closest('.piece-combo-option');
        if (opt) selectPiece(opt.getAttribute('data-name'));
    });

    // Nota: se guarda en memoria al escribir y se persiste con un pequeño retardo,
    // así no se pierde aunque la lista se vuelva a renderizar.
    let notaTimer = null;
    list.addEventListener('input', (e) => {
        const ta = e.target.closest('.piece-combo-note');
        if (!ta) return;
        const name = ta.getAttribute('data-note');
        if (!state.pieces[name]) return;
        state.pieces[name].nota = ta.value;
        clearTimeout(notaTimer);
        notaTimer = setTimeout(() => saveAllData(), 700);
    });

    btnArrow.addEventListener('mousedown', (e) => e.preventDefault());
    btnArrow.addEventListener('click', () => {
        if (open) closeList();
        else { input.focus(); openList(); }
    });

    btnClear.addEventListener('mousedown', (e) => e.preventDefault());
    btnClear.addEventListener('click', () => selectPiece(''));

    document.addEventListener('mousedown', (e) => {
        if (open && !combo.contains(e.target)) closeList();
    });

    // Llamado desde updatePieceSelect() cada vez que cambian las piezas guardadas
    window.refreshPieceCombo = () => {
        if (open) render();
        syncInput();
    };
    syncInput();
})();
// ===== FIN COMBOBOX DE PIEZAS =====


// ===== RENOMBRAR PIEZAS / PROYECTOS / MEGA PROYECTOS =====
(function() {
    const modal  = document.getElementById('renameModal');
    const titulo = document.getElementById('renameTitle');
    const pista  = document.getElementById('renameHint');
    const input  = document.getElementById('renameInput');
    const btnOk  = document.getElementById('btnConfirmRename');
    const btnNo  = document.getElementById('btnCancelRename');
    if (!modal) return;

    const TIPOS = {
        pieza: {
            etiqueta: 'pieza',
            actual:  () => state.currentPiece,
            mapa:    () => state.pieces,
            marcar:  (v) => { state.currentPiece = v; },
            guardar: savePieces
        },
        proyecto: {
            etiqueta: 'proyecto',
            actual:  () => state.currentProject,
            mapa:    () => state.projects,
            marcar:  (v) => { state.currentProject = v; },
            guardar: saveProjects
        },
        mega: {
            etiqueta: 'mega proyecto',
            actual:  () => state.currentMegaProject,
            mapa:    () => state.megaProjects,
            marcar:  (v) => { state.currentMegaProject = v; },
            guardar: saveMegaProjects
        }
    };

    let tipoActivo = null;

    function abrir(tipo) {
        const cfg = TIPOS[tipo];
        const viejo = cfg.actual();
        if (!viejo) {
            alert('Primero carga un ' + cfg.etiqueta + ' para poder renombrarlo.');
            return;
        }
        tipoActivo = tipo;
        titulo.textContent = 'Renombrar ' + cfg.etiqueta;
        pista.textContent = 'Se llama "' + viejo + '". Se conserva todo lo guardado, solo cambia el nombre.';
        input.value = viejo;
        modal.classList.add('active');
        input.focus();
        input.select();
    }

    function cerrar() {
        modal.classList.remove('active');
        tipoActivo = null;
    }

    // Un proyecto puede estar dentro de mega proyectos: hay que actualizar
    // esas referencias o quedarían apuntando a un nombre que ya no existe.
    function actualizarReferencias(viejo, nuevo) {
        (state.megaProjectItems || []).forEach(item => {
            if (item._nombre === viejo) item._nombre = nuevo;
        });
        for (const nombreMega in state.megaProjects) {
            const items = (state.megaProjects[nombreMega] || {}).items || [];
            items.forEach(item => {
                if (item._nombre === viejo) item._nombre = nuevo;
            });
        }
        if (window.renderMegaProjectList) window.renderMegaProjectList();
    }

    function confirmar() {
        if (!tipoActivo) return;
        const cfg = TIPOS[tipoActivo];
        const viejo = cfg.actual();
        const nuevo = input.value.trim();
        if (!nuevo || nuevo === viejo) { cerrar(); return; }

        const mapa = cfg.mapa();
        if (mapa[nuevo] && !confirm('Ya existe un ' + cfg.etiqueta + ' llamado "' + nuevo + '". ¿Reemplazarlo?')) return;

        mapa[nuevo] = mapa[viejo];
        delete mapa[viejo];
        cfg.marcar(nuevo);
        if (tipoActivo === 'proyecto') actualizarReferencias(viejo, nuevo);
        cfg.guardar();
        if (tipoActivo === 'pieza' && window.updatePieceActiveSummary) window.updatePieceActiveSummary();
        cerrar();
    }

    btnOk.addEventListener('click', confirmar);
    btnNo.addEventListener('click', cerrar);
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') { e.preventDefault(); confirmar(); }
        if (e.key === 'Escape') { e.preventDefault(); cerrar(); }
    });
    modal.addEventListener('click', (e) => { if (e.target === modal) cerrar(); });

    const enlaces = {
        btnRenamePiece: 'pieza',
        btnRenameProject: 'proyecto',
        btnRenameMegaProject: 'mega'
    };
    Object.keys(enlaces).forEach(id => {
        const b = document.getElementById(id);
        if (b) b.addEventListener('click', () => abrir(enlaces[id]));
    });
})();
// ===== FIN RENOMBRAR =====

// ===== ALTURA ESTABLE DE LA TARJETA DE PIEZA =====
// Cada pestaña tiene distinto contenido, así que la tarjeta cambiaba de tamaño
// al moverse entre ellas. Se mide la más alta y se usa como mínimo para todas;
// solo se vuelve a calcular si cambia el tamaño de la ventana.
(function() {
    const paneles = Array.from(document.querySelectorAll('.piece-tab-content'));
    if (!paneles.length) return;

    function medir() {
        const contenedor = paneles[0].parentElement;
        const est = getComputedStyle(contenedor);
        // Ancho real disponible: si se mide en posición absoluta sin fijarlo,
        // el panel se estira a la ventana y devuelve una altura falsa.
        const anchoUtil = contenedor.clientWidth
            - parseFloat(est.paddingLeft || 0) - parseFloat(est.paddingRight || 0);
        if (anchoUtil <= 0) return;

        let alto = 0;
        paneles.forEach(p => {
            p.style.minHeight = '';
            const oculto = !p.classList.contains('active');
            if (oculto) {
                p.style.display = 'block';
                p.style.position = 'absolute';
                p.style.visibility = 'hidden';
                p.style.left = '-10000px';
                p.style.top = '0';
                p.style.width = anchoUtil + 'px';
            }
            alto = Math.max(alto, p.offsetHeight);
            if (oculto) {
                p.style.display = '';
                p.style.position = '';
                p.style.visibility = '';
                p.style.left = '';
                p.style.top = '';
                p.style.width = '';
            }
        });
        if (alto > 0) paneles.forEach(p => { p.style.minHeight = alto + 'px'; });
    }

    let temporizador = null;
    function medirConCalma() {
        clearTimeout(temporizador);
        temporizador = setTimeout(medir, 150);
    }

    window.addEventListener('load', medirConCalma);
    window.addEventListener('resize', medirConCalma);
    // Abrir o cerrar la configuración de impresión cambia el alto real
    document.addEventListener('click', (e) => {
        if (e.target.closest && e.target.closest('.print-config-toggle, .print-subsection-header')) medirConCalma();
    });
    window.recalcularAltoPieza = medirConCalma;
})();
// ===== FIN ALTURA ESTABLE =====
