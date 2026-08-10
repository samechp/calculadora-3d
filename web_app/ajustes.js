// ===== AJUSTES DE LA APLICACIÓN =====
// Ventana con dos cosas: los datos de tu empresa (para las cotizaciones) y la
// información de la aplicación (versión, actualizaciones, copias de seguridad).
// Ningún dato de empresa es obligatorio.
(function() {

const CAMPOS = [
    { id: 'nombre',    etiqueta: 'Nombre de la empresa', ph: 'Ej: PrintoVerse' },
    { id: 'nit',       etiqueta: 'NIT / Documento',      ph: 'Ej: 901.234.567-8' },
    { id: 'telefono',  etiqueta: 'Teléfono',             ph: 'Ej: 300 123 4567' },
    { id: 'email',     etiqueta: 'Correo',               ph: 'Ej: hola@printoverse.com' },
    { id: 'direccion', etiqueta: 'Dirección',            ph: 'Ej: Calle 10 #20-30, Medellín' },
    { id: 'web',       etiqueta: 'Sitio web',            ph: 'Ej: printoverse.com' },
];

let modal = null;
let empresaEditando = null;   // empresa que se está editando (null si es nueva)
let borrador = null;          // copia de trabajo: no se guarda hasta pulsar Guardar
let creando = false;

function api() {
    return (window.pywebview && window.pywebview.api) ? window.pywebview.api : null;
}

function esc(s) {
    return (s || '').toString()
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// --- Datos ---
function empresas() {
    if (!state.empresas || typeof state.empresas !== 'object') state.empresas = {};
    return state.empresas;
}

function empresaActiva() {
    const todas = empresas();
    if (state.empresaActiva && todas[state.empresaActiva]) return todas[state.empresaActiva];
    return null;
}

window.empresaParaCotizacion = function() {
    // La usan los exportadores; devuelve null si no hay o si está desactivada
    if (!state.incluirEmpresa) return null;
    return empresaActiva();
};

function guardar() {
    if (window.saveAllData) window.saveAllData();
}

// --- Ventana ---
function cerrar() {
    if (modal) { modal.remove(); modal = null; }
    empresaEditando = null;
}

function abrir(seccion) {
    cerrar();
    modal = document.createElement('div');
    modal.className = 'modal active ajustes-modal';
    modal.innerHTML =
        '<div class="modal-content ajustes-content">' +
        '  <div class="version-modal-head">' +
        '    <h3>Ajustes</h3>' +
        '    <button class="update-bar-close" data-cerrar><i class="bi bi-x-lg"></i></button>' +
        '  </div>' +
        '  <div class="ajustes-tabs">' +
        '    <button class="ajustes-tab active" data-sec="empresa"><i class="bi bi-building"></i> Empresa</button>' +
        '    <button class="ajustes-tab" data-sec="app"><i class="bi bi-gear"></i> Aplicación</button>' +
        '  </div>' +
        '  <div class="ajustes-cuerpo"></div>' +
        '</div>';
    document.body.appendChild(modal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.closest('[data-cerrar]')) cerrar();
    });
    modal.querySelectorAll('.ajustes-tab').forEach(t => {
        t.addEventListener('click', () => {
            modal.querySelectorAll('.ajustes-tab').forEach(x => x.classList.remove('active'));
            t.classList.add('active');
            pintar(t.getAttribute('data-sec'));
        });
    });

    if (seccion === 'app') {
        modal.querySelector('[data-sec="empresa"]').classList.remove('active');
        modal.querySelector('[data-sec="app"]').classList.add('active');
    }
    pintar(seccion || 'empresa');
}

function pintar(seccion) {
    const cuerpo = modal.querySelector('.ajustes-cuerpo');
    if (seccion === 'app') pintarApp(cuerpo);
    else pintarEmpresa(cuerpo);
}

// --- Sección Empresa ---
// Se trabaja sobre una copia (borrador). Nada se guarda hasta pulsar Guardar,
// así que Cancelar deja las cosas como estaban.
function iniciarBorrador(nombre) {
    const todas = empresas();
    if (nombre && todas[nombre]) {
        empresaEditando = nombre;
        creando = false;
        borrador = Object.assign({}, todas[nombre]);
        if (!borrador.nombre) borrador.nombre = nombre;
    } else {
        empresaEditando = null;
        creando = true;
        borrador = {};
    }
}

function hayCambiosSinGuardar() {
    if (!borrador) return false;
    if (creando) return Object.keys(borrador).some(k => (borrador[k] || '') !== '');
    const guardada = empresas()[empresaEditando] || {};
    const claves = new Set(Object.keys(borrador).concat(Object.keys(guardada)));
    for (const k of claves) {
        if ((borrador[k] || '') !== (guardada[k] || '')) return true;
    }
    return false;
}

function pintarEmpresa(cuerpo) {
    const todas = empresas();
    const nombres = Object.keys(todas).sort((a, b) => a.localeCompare(b, 'es'));

    if (!borrador) {
        const inicial = (state.empresaActiva && todas[state.empresaActiva]) ? state.empresaActiva : nombres[0];
        if (inicial) iniciarBorrador(inicial);
    }
    const hayFormulario = !!borrador;

    cuerpo.innerHTML =
        '<p class="ajustes-nota">Estos datos salen en las cotizaciones en PDF si activas ' +
        '<strong>Incluir datos de empresa</strong> en Resultados. Solo el nombre hace falta para poder guardarla.</p>' +

        '<div class="ajustes-fila-sel">' +
        '  <select id="ajSelEmpresa"' + (creando ? ' disabled' : '') + '>' +
             (creando
                ? '<option value="">(empresa nueva)</option>'
                : (nombres.length
                    ? nombres.map(n => '<option value="' + esc(n) + '"' +
                        (n === empresaEditando ? ' selected' : '') + '>' + esc(n) + '</option>').join('')
                    : '<option value="">-- Sin empresas guardadas --</option>')) +
        '  </select>' +
        '  <button class="btn btn-outline" id="ajNuevaEmpresa"><i class="bi bi-plus-lg"></i> Nueva</button>' +
        (!creando && empresaEditando ? '  <button class="btn btn-danger" id="ajBorrarEmpresa">Eliminar</button>' : '') +
        '</div>' +

        (!hayFormulario
            ? '<p class="ajustes-nota">Pulsa <strong>Nueva</strong> para registrar tu empresa.</p>'
            : (
        '<div class="ajustes-logo-fila">' +
        '  <div class="ajustes-logo-caja">' +
             (borrador.logo ? '<img src="' + borrador.logo + '" alt="">' : '<span>Sin logo</span>') +
        '  </div>' +
        '  <div class="ajustes-logo-acciones">' +
        '    <button class="btn btn-outline" id="ajSubirLogo"><i class="bi bi-image"></i> Elegir logo</button>' +
             (borrador.logo ? '<button class="btn btn-outline" id="ajQuitarLogo">Quitar</button>' : '') +
        '    <span class="ajustes-nota">PNG o JPG. Se reduce solo para que no pese.</span>' +
        '  </div>' +
        '  <input type="file" id="ajArchivoLogo" accept="image/png,image/jpeg" hidden>' +
        '</div>' +

        '<div class="input-grid ajustes-grid">' +
        CAMPOS.map(c =>
            '<div class="input-group">' +
            '  <label for="aj_' + c.id + '">' + c.etiqueta + (c.id === 'nombre' ? ' *' : '') + '</label>' +
            '  <input type="text" id="aj_' + c.id + '" data-campo="' + c.id + '" placeholder="' + esc(c.ph) + '"' +
            '         value="' + esc(borrador[c.id] || '') + '">' +
            '</div>').join('') +
        '</div>' +

        '<div class="input-group" style="margin-top:0.75rem;">' +
        '  <label for="aj_nota">Nota al pie de la cotización</label>' +
        '  <textarea id="aj_nota" data-campo="nota" rows="2" class="ajustes-textarea"' +
        '            placeholder="Ej: Precios válidos por 15 días. Se requiere 50% de anticipo.">' +
             esc(borrador.nota || '') + '</textarea>' +
        '</div>' +

        '<div class="ajustes-acciones">' +
        '  <button class="btn btn-outline" id="ajCancelar">Cancelar</button>' +
        '  <button class="btn btn-primary" id="ajGuardar">' +
             (creando ? 'Crear empresa' : 'Guardar cambios') + '</button>' +
        '</div>'));

    // Los campos solo tocan el borrador
    cuerpo.querySelectorAll('[data-campo]').forEach(inp => {
        inp.addEventListener('input', () => { borrador[inp.getAttribute('data-campo')] = inp.value; });
    });

    const sel = cuerpo.querySelector('#ajSelEmpresa');
    if (sel) sel.addEventListener('change', async () => {
        const destino = sel.value;
        if (hayCambiosSinGuardar()) {
            const seguir = await confirmar('Hay cambios sin guardar en "' +
                (borrador.nombre || empresaEditando || '') + '". Si cambias de empresa se pierden.',
                { titulo: 'Cambios sin guardar', aceptar: 'Descartar y cambiar', peligro: true });
            if (!seguir) { sel.value = empresaEditando || ''; return; }
        }
        iniciarBorrador(destino);
        pintarEmpresa(cuerpo);
    });

    const nueva = cuerpo.querySelector('#ajNuevaEmpresa');
    if (nueva) nueva.addEventListener('click', async () => {
        if (hayCambiosSinGuardar()) {
            const seguir = await confirmar('Hay cambios sin guardar. Si creas otra empresa se pierden.',
                { titulo: 'Cambios sin guardar', aceptar: 'Descartar', peligro: true });
            if (!seguir) return;
        }
        iniciarBorrador(null);
        pintarEmpresa(cuerpo);
        const primero = cuerpo.querySelector('#aj_nombre');
        if (primero) primero.focus();
    });

    const borrar = cuerpo.querySelector('#ajBorrarEmpresa');
    if (borrar) borrar.addEventListener('click', async () => {
        if (!(await confirmar('Se eliminan sus datos y su logo.',
                { titulo: 'Eliminar ' + empresaEditando, aceptar: 'Eliminar', peligro: true }))) return;
        delete empresas()[empresaEditando];
        if (state.empresaActiva === empresaEditando) state.empresaActiva = null;
        borrador = null; empresaEditando = null; creando = false;
        guardar();
        pintarEmpresa(cuerpo);
        actualizarEtiquetaEmpresa();
    });

    const cancelar = cuerpo.querySelector('#ajCancelar');
    if (cancelar) cancelar.addEventListener('click', () => {
        const todasAhora = empresas();
        if (creando) {
            const volver = (state.empresaActiva && todasAhora[state.empresaActiva])
                ? state.empresaActiva : Object.keys(todasAhora)[0];
            if (volver) iniciarBorrador(volver);
            else { borrador = null; creando = false; empresaEditando = null; }
        } else {
            iniciarBorrador(empresaEditando);
        }
        pintarEmpresa(cuerpo);
    });

    const guardarBtn = cuerpo.querySelector('#ajGuardar');
    if (guardarBtn) guardarBtn.addEventListener('click', async () => {
        const nombre = (borrador.nombre || '').trim();
        if (!nombre) {
            await avisar('Ponle un nombre a la empresa para poder guardarla. El resto de datos son opcionales.',
                         'Falta el nombre');
            const campo = cuerpo.querySelector('#aj_nombre');
            if (campo) campo.focus();
            return;
        }
        const todasAhora = empresas();
        if (todasAhora[nombre] && nombre !== empresaEditando) {
            const reemplazar = await confirmar('Ya hay una empresa llamada "' + nombre + '". Si continúas se reemplaza.',
                { titulo: 'Nombre repetido', aceptar: 'Reemplazar', peligro: true });
            if (!reemplazar) return;
        }
        const datos = Object.assign({}, borrador, { nombre: nombre });
        if (!creando && empresaEditando && empresaEditando !== nombre) delete todasAhora[empresaEditando];
        todasAhora[nombre] = datos;
        state.empresaActiva = nombre;
        guardar();
        iniciarBorrador(nombre);
        pintarEmpresa(cuerpo);
        actualizarEtiquetaEmpresa();
        if (window.showSaveToast) window.showSaveToast('<i class="bi bi-check-circle"></i> Empresa guardada');
    });

    // El logo también se queda en el borrador hasta guardar
    const btnLogo = cuerpo.querySelector('#ajSubirLogo');
    const archivo = cuerpo.querySelector('#ajArchivoLogo');
    if (btnLogo) {
        btnLogo.addEventListener('click', async () => {
            const a = api();
            if (a && a.elegir_logo) {
                // Dentro de la aplicación se abre el diálogo de Windows: el
                // selector de archivos del HTML no llega a abrirse en su motor.
                btnLogo.disabled = true;
                let datos = '';
                try { datos = await a.elegir_logo(); } catch (e) { datos = ''; }
                btnLogo.disabled = false;
                if (!datos) return;
                if (datos.indexOf('ERROR:') === 0) {
                    avisar('No se pudo abrir la imagen. ' + datos.slice(6), 'Error con el logo');
                    return;
                }
                reducirDataUrl(datos, (peque) => {
                    borrador.logo = peque || datos;
                    pintarEmpresa(cuerpo);
                });
                return;
            }
            if (archivo) archivo.click();      // versión web en navegador
        });
    }
    if (archivo) {
        archivo.addEventListener('change', () => {
            const f = archivo.files && archivo.files[0];
            if (!f) return;
            const lector = new FileReader();
            lector.onload = () => reducirDataUrl(lector.result, (peque) => {
                if (!peque) { avisar('No se pudo leer la imagen.'); return; }
                borrador.logo = peque;
                pintarEmpresa(cuerpo);
            });
            lector.onerror = () => avisar('No se pudo leer la imagen.');
            lector.readAsDataURL(f);
        });
    }
    const quitar = cuerpo.querySelector('#ajQuitarLogo');
    if (quitar) quitar.addEventListener('click', () => {
        delete borrador.logo;
        pintarEmpresa(cuerpo);
    });
}

// Reduce el logo a 400 px de ancho como máximo, para que el archivo de datos
// no se llene con una imagen enorme.
function reducirDataUrl(dataUrl, listo) {
    const img = new Image();
    img.onload = () => {
        const maxAncho = 400;
        const escala = Math.min(1, maxAncho / img.width);
        const lienzo = document.createElement('canvas');
        lienzo.width = Math.round(img.width * escala);
        lienzo.height = Math.round(img.height * escala);
        lienzo.getContext('2d').drawImage(img, 0, 0, lienzo.width, lienzo.height);
        try { listo(lienzo.toDataURL('image/png')); } catch (e) { listo(null); }
    };
    img.onerror = () => listo(null);
    img.src = dataUrl;
}

// --- Tema claro / oscuro ---
function temaActual() {
    return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
}

function aplicarTema(tema) {
    document.documentElement.setAttribute('data-theme', tema);
    try { localStorage.setItem('calculadora3d_tema', tema); } catch (e) {}
    state.tema = tema;
    // El logo tiene una versión para cada fondo
    const claro = tema === 'light';
    document.querySelectorAll('.marca-logo, .pie-logo').forEach(img => {
        img.src = claro ? 'printoverse-logo-claro.png' : 'printoverse-logo.png';
    });
    guardar();
}

window.aplicarTemaGuardado = function() {
    // Si el archivo de datos trae un tema y el navegador aún no lo sabía
    if (state.tema && state.tema !== temaActual()) aplicarTema(state.tema);
    else aplicarTema(temaActual());
};

function bloqueTema() {
    const actual = temaActual();
    return '<div class="ajustes-bloque">' +
        '  <h4>Apariencia</h4>' +
        '  <div class="tema-opciones">' +
        '    <button class="tema-btn' + (actual === 'dark' ? ' activo' : '') + '" data-tema="dark">' +
        '      <i class="bi bi-moon-stars"></i> Oscuro</button>' +
        '    <button class="tema-btn' + (actual === 'light' ? ' activo' : '') + '" data-tema="light">' +
        '      <i class="bi bi-sun"></i> Claro</button>' +
        '  </div>' +
        '</div>';
}

// --- Sección Aplicación ---
async function pintarApp(cuerpo) {
    cuerpo.innerHTML = bloqueTema() + '<p class="ajustes-nota">Cargando…</p>';
    conectarTema(cuerpo);

    const a = api();
    if (!a) {
        cuerpo.innerHTML = bloqueTema() +
            '<p class="ajustes-nota">El resto de esta sección solo funciona en la aplicación de escritorio.</p>';
        conectarTema(cuerpo);
        return;
    }

    let info = {};
    try { info = JSON.parse(await a.info_version()); } catch (e) { info = {}; }
    let copias = [];
    try { copias = JSON.parse(await a.listar_copias()); } catch (e) { copias = []; }

    cuerpo.innerHTML = bloqueTema() +
        '<div class="ajustes-bloque">' +
        '  <h4>Versión</h4>' +
        '  <p class="ajustes-nota">Programa <strong>' + esc(info.app || '?') + '</strong> · ' +
             'interfaz <strong>' + esc(info.web || '?') + '</strong>' +
             (info.fijada ? ' · <span style="color:#fde047">fijada en la ' + esc(info.fijada) + '</span>' : '') + '</p>' +
        '  <button class="btn btn-outline" id="ajVerVersiones">Ver todas las versiones</button>' +
        '</div>' +

        '<div class="ajustes-bloque">' +
        '  <h4>Copias de seguridad</h4>' +
        '  <p class="ajustes-nota">Cada vez que guardas, la app conserva las últimas copias de tus datos ' +
             '(perfiles, piezas, proyectos y filamentos) por si algo sale mal.</p>' +
        (copias.length
            ? '<div class="copias-lista">' + copias.map(c =>
                '<div class="copia-item"><span><strong>' + esc(c.fecha) + '</strong>' +
                '<span class="ajustes-nota"> · ' + esc(c.tamano) + '</span></span>' +
                '<button class="btn btn-outline" data-restaurar="' + esc(c.archivo) + '">Restaurar</button></div>').join('') +
              '</div>'
            : '<p class="ajustes-nota">Todavía no hay copias.</p>') +
        '</div>';

    conectarTema(cuerpo);

    const ver = cuerpo.querySelector('#ajVerVersiones');
    if (ver) ver.addEventListener('click', () => { cerrar(); if (window.abrirVersiones) window.abrirVersiones(); });

    cuerpo.querySelectorAll('[data-restaurar]').forEach(b => {
        b.addEventListener('click', async () => {
            const ok0 = await confirmar(
                'Tus datos actuales se reemplazan por los de esa fecha. Antes se guarda una copia de lo de ahora, ' +
                'así que puedes volver atrás.',
                { titulo: 'Restaurar copia', aceptar: 'Restaurar', peligro: true });
            if (!ok0) return;
            b.disabled = true; b.textContent = 'Restaurando…';
            const ok = await a.restaurar_copia(b.getAttribute('data-restaurar'));
            if (ok) avisar('Listo. Vuelve a abrir la aplicación para ver los datos restaurados.');
            else { avisar('No se pudo restaurar la copia.'); b.disabled = false; b.textContent = 'Restaurar'; }
        });
    });
}

// --- Casilla "incluir empresa" en Resultados ---
function actualizarEtiquetaEmpresa() {
    const et = document.getElementById('etiquetaEmpresa');
    if (!et) return;
    const emp = empresaActiva();
    et.textContent = emp ? (emp.nombre || state.empresaActiva || '') : 'sin empresa configurada';
    const caja = document.getElementById('chkIncluirEmpresa');
    if (caja) {
        caja.disabled = !emp;
        // Los datos llegan después de montar la casilla, hay que reflejarlos
        caja.checked = !!state.incluirEmpresa && !!emp;
    }
}

function montarCasilla() {
    const zona = document.querySelector('.results-card .export-actions');
    if (!zona || document.getElementById('chkIncluirEmpresa')) return;
    const fila = document.createElement('label');
    fila.className = 'incluir-empresa';
    fila.innerHTML = '<input type="checkbox" id="chkIncluirEmpresa"> ' +
                     '<span>Incluir datos de empresa en el PDF</span> ' +
                     '<span id="etiquetaEmpresa" class="incluir-empresa-nombre"></span>';
    zona.parentNode.insertBefore(fila, zona);

    const caja = fila.querySelector('#chkIncluirEmpresa');
    caja.checked = !!state.incluirEmpresa;
    caja.addEventListener('change', () => {
        state.incluirEmpresa = caja.checked;
        guardar();
    });
    actualizarEtiquetaEmpresa();
}

function montarBoton() {
    if (document.getElementById('btnAjustes')) return;
    const cab = document.querySelector('.app-header');
    if (!cab) return;
    const b = document.createElement('button');
    b.id = 'btnAjustes';
    b.className = 'btn-ajustes';
    b.title = 'Ajustes';
    b.innerHTML = '<i class="bi bi-gear"></i>';
    b.addEventListener('click', () => abrir('empresa'));
    cab.parentNode.insertBefore(b, cab);
}

function conectarTema(cuerpo) {
    cuerpo.querySelectorAll('.tema-btn').forEach(b => {
        b.addEventListener('click', () => {
            aplicarTema(b.getAttribute('data-tema'));
            cuerpo.querySelectorAll('.tema-btn').forEach(x => x.classList.remove('activo'));
            b.classList.add('activo');
        });
    });
}

function iniciar() {
    montarBoton();
    montarCasilla();
    // El tema ya se aplicó en el <head>; aquí solo se ajusta el logo
    const claro = temaActual() === 'light';
    document.querySelectorAll('.marca-logo, .pie-logo').forEach(img => {
        img.src = claro ? 'printoverse-logo-claro.png' : 'printoverse-logo.png';
    });
    // Los datos llegan de forma asíncrona al abrir la app
    setTimeout(actualizarEtiquetaEmpresa, 1500);
}

window.abrirAjustes = abrir;

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
else iniciar();

})();
// ===== FIN AJUSTES =====
