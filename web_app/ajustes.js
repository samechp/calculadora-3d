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
let empresaEditando = null;   // nombre de la empresa que se está editando

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
function pintarEmpresa(cuerpo) {
    const todas = empresas();
    const nombres = Object.keys(todas).sort((a, b) => a.localeCompare(b, 'es'));
    if (!empresaEditando || !todas[empresaEditando]) {
        empresaEditando = (state.empresaActiva && todas[state.empresaActiva]) ? state.empresaActiva : (nombres[0] || null);
    }
    const emp = empresaEditando ? todas[empresaEditando] : null;

    cuerpo.innerHTML =
        '<p class="ajustes-nota">Estos datos salen en las cotizaciones en PDF si activas ' +
        '<strong>Incluir datos de empresa</strong> en Resultados. Ninguno es obligatorio.</p>' +

        '<div class="ajustes-fila-sel">' +
        '  <select id="ajSelEmpresa">' +
             (nombres.length ? nombres.map(n =>
                '<option value="' + esc(n) + '"' + (n === empresaEditando ? ' selected' : '') + '>' + esc(n) + '</option>').join('')
              : '<option value="">-- Sin empresas guardadas --</option>') +
        '  </select>' +
        '  <button class="btn btn-outline" id="ajNuevaEmpresa"><i class="bi bi-plus-lg"></i> Nueva</button>' +
        (emp ? '  <button class="btn btn-danger" id="ajBorrarEmpresa">Eliminar</button>' : '') +
        '</div>' +

        (emp ? (
        '<div class="ajustes-logo-fila">' +
        '  <div class="ajustes-logo-caja">' +
             (emp.logo ? '<img src="' + emp.logo + '" alt="">' : '<span>Sin logo</span>') +
        '  </div>' +
        '  <div class="ajustes-logo-acciones">' +
        '    <button class="btn btn-outline" id="ajSubirLogo"><i class="bi bi-image"></i> Elegir logo</button>' +
             (emp.logo ? '<button class="btn btn-outline" id="ajQuitarLogo">Quitar</button>' : '') +
        '    <span class="ajustes-nota">PNG o JPG. Se reduce solo para que no pese.</span>' +
        '  </div>' +
        '  <input type="file" id="ajArchivoLogo" accept="image/png,image/jpeg" hidden>' +
        '</div>' +

        '<div class="input-grid ajustes-grid">' +
        CAMPOS.map(c =>
            '<div class="input-group">' +
            '  <label for="aj_' + c.id + '">' + c.etiqueta + '</label>' +
            '  <input type="text" id="aj_' + c.id + '" data-campo="' + c.id + '" placeholder="' + esc(c.ph) + '"' +
            '         value="' + esc(emp[c.id] || '') + '">' +
            '</div>').join('') +
        '</div>' +

        '<div class="input-group" style="margin-top:0.75rem;">' +
        '  <label for="aj_nota">Nota al pie de la cotización</label>' +
        '  <textarea id="aj_nota" data-campo="nota" rows="2" class="ajustes-textarea"' +
        '            placeholder="Ej: Precios válidos por 15 días. Se requiere 50% de anticipo.">' + esc(emp.nota || '') + '</textarea>' +
        '</div>'
        ) : '<p class="ajustes-nota">Crea una empresa para guardar su logo y sus datos.</p>');

    // Cambiar de empresa
    const sel = cuerpo.querySelector('#ajSelEmpresa');
    if (sel) sel.addEventListener('change', () => {
        empresaEditando = sel.value || null;
        state.empresaActiva = empresaEditando;
        guardar();
        pintarEmpresa(cuerpo);
        actualizarEtiquetaEmpresa();
    });

    const nueva = cuerpo.querySelector('#ajNuevaEmpresa');
    if (nueva) nueva.addEventListener('click', async () => {
        const nombre = (await pedirTexto('Nombre de la empresa', '', {
            titulo: 'Nueva empresa',
            icono: 'building',
            ayuda: 'Con este nombre la identificas dentro de la app. Después le agregas el logo y el resto de datos.',
            placeholder: 'Ej: PrintoVerse',
            aceptar: 'Crear'
        }) || '').trim();
        if (!nombre) return;
        empresas()[nombre] = { nombre: nombre };
        empresaEditando = nombre;
        state.empresaActiva = nombre;
        guardar();
        pintarEmpresa(cuerpo);
        actualizarEtiquetaEmpresa();
    });

    const borrar = cuerpo.querySelector('#ajBorrarEmpresa');
    if (borrar) borrar.addEventListener('click', async () => {
        if (!(await confirmar('Se eliminan sus datos y su logo.', {titulo: 'Eliminar ' + empresaEditando, aceptar: 'Eliminar', peligro: true}))) return;
        delete empresas()[empresaEditando];
        if (state.empresaActiva === empresaEditando) state.empresaActiva = null;
        empresaEditando = null;
        guardar();
        pintarEmpresa(cuerpo);
        actualizarEtiquetaEmpresa();
    });

    // Campos de texto: se guardan al salir del campo
    cuerpo.querySelectorAll('[data-campo]').forEach(inp => {
        inp.addEventListener('change', () => {
            if (!empresaEditando) return;
            empresas()[empresaEditando][inp.getAttribute('data-campo')] = inp.value.trim();
            guardar();
            actualizarEtiquetaEmpresa();
        });
    });

    // Logo
    const btnLogo = cuerpo.querySelector('#ajSubirLogo');
    const archivo = cuerpo.querySelector('#ajArchivoLogo');
    if (btnLogo && archivo) {
        btnLogo.addEventListener('click', () => archivo.click());
        archivo.addEventListener('change', () => {
            const f = archivo.files && archivo.files[0];
            if (!f) return;
            reducirImagen(f, (dataUrl) => {
                if (!dataUrl) { avisar('No se pudo leer la imagen.'); return; }
                empresas()[empresaEditando].logo = dataUrl;
                guardar();
                pintarEmpresa(cuerpo);
            });
        });
    }
    const quitar = cuerpo.querySelector('#ajQuitarLogo');
    if (quitar) quitar.addEventListener('click', () => {
        delete empresas()[empresaEditando].logo;
        guardar();
        pintarEmpresa(cuerpo);
    });
}

// Reduce el logo a 400 px de ancho como máximo para que el archivo de datos
// no se llene de una imagen enorme.
function reducirImagen(archivo, listo) {
    const lector = new FileReader();
    lector.onload = () => {
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
        img.src = lector.result;
    };
    lector.onerror = () => listo(null);
    lector.readAsDataURL(archivo);
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
