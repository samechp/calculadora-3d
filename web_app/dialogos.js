// ===== DIÁLOGOS DE LA APP =====
// Sustituyen a alert/confirm/prompt del navegador, que en la app de escritorio
// salen con el marco feo de "Esta página dice" y no siguen el tema.
//   avisar('texto')                        -> aviso simple
//   confirmar('texto')                     -> devuelve una promesa: true / false
//   pedirTexto('etiqueta', 'valor actual') -> devuelve el texto o null
(function() {

let abierto = null;   // cierra el anterior si se abren dos seguidos

function esc(s) {
    return (s || '').toString()
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;').replace(/\n/g, '<br>');
}

function crear(html) {
    if (abierto) abierto.remove();
    const capa = document.createElement('div');
    capa.className = 'modal active dialogo';
    capa.innerHTML = '<div class="modal-content dialogo-caja">' + html + '</div>';
    document.body.appendChild(capa);
    abierto = capa;
    return capa;
}

function cerrar(capa) {
    if (capa && capa.parentNode) capa.remove();
    if (abierto === capa) abierto = null;
}

function encabezado(titulo, icono, clase) {
    if (!titulo) return '';
    return '<h3 class="dialogo-titulo ' + (clase || '') + '">' +
           (icono ? '<i class="bi bi-' + icono + '"></i> ' : '') + esc(titulo) + '</h3>';
}

function avisar(mensaje, titulo) {
    return new Promise(resolve => {
        const capa = crear(
            encabezado(titulo || 'Aviso', 'info-circle') +
            '<p class="dialogo-texto">' + esc(mensaje) + '</p>' +
            '<div class="modal-btn-group">' +
            '  <button class="btn btn-primary" data-ok>Entendido</button>' +
            '</div>');

        const terminar = () => { cerrar(capa); resolve(); };
        capa.querySelector('[data-ok]').addEventListener('click', terminar);
        capa.addEventListener('click', (e) => { if (e.target === capa) terminar(); });
        capa.addEventListener('keydown', (e) => { if (e.key === 'Escape' || e.key === 'Enter') terminar(); });
        capa.querySelector('[data-ok]').focus();
    });
}

function confirmar(mensaje, opciones) {
    opciones = opciones || {};
    return new Promise(resolve => {
        const peligro = !!opciones.peligro;
        const capa = crear(
            encabezado(opciones.titulo || '¿Seguro?', peligro ? 'exclamation-triangle' : 'question-circle',
                       peligro ? 'dialogo-peligro' : '') +
            '<p class="dialogo-texto">' + esc(mensaje) + '</p>' +
            '<div class="modal-btn-group">' +
            '  <button class="btn btn-outline" data-no>' + esc(opciones.cancelar || 'Cancelar') + '</button>' +
            '  <button class="btn ' + (peligro ? 'btn-danger' : 'btn-primary') + '" data-si>' +
                 esc(opciones.aceptar || 'Aceptar') + '</button>' +
            '</div>');

        const responder = (valor) => { cerrar(capa); resolve(valor); };
        capa.querySelector('[data-si]').addEventListener('click', () => responder(true));
        capa.querySelector('[data-no]').addEventListener('click', () => responder(false));
        capa.addEventListener('click', (e) => { if (e.target === capa) responder(false); });
        capa.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') responder(false);
            if (e.key === 'Enter') responder(true);
        });
        capa.querySelector('[data-si]').focus();
    });
}

function pedirTexto(etiqueta, valor, opciones) {
    opciones = opciones || {};
    return new Promise(resolve => {
        const capa = crear(
            encabezado(opciones.titulo || etiqueta, opciones.icono || 'pencil') +
            (opciones.ayuda ? '<p class="dialogo-texto dialogo-ayuda">' + esc(opciones.ayuda) + '</p>' : '') +
            '<input type="text" data-campo placeholder="' + esc(opciones.placeholder || '') + '"' +
            '       value="' + esc(valor || '') + '">' +
            '<div class="modal-btn-group">' +
            '  <button class="btn btn-outline" data-no>Cancelar</button>' +
            '  <button class="btn btn-primary" data-si>' + esc(opciones.aceptar || 'Guardar') + '</button>' +
            '</div>');

        const campo = capa.querySelector('[data-campo]');
        const responder = (texto) => { cerrar(capa); resolve(texto); };
        capa.querySelector('[data-si]').addEventListener('click', () => responder(campo.value.trim() || null));
        capa.querySelector('[data-no]').addEventListener('click', () => responder(null));
        capa.addEventListener('click', (e) => { if (e.target === capa) responder(null); });
        campo.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') { e.preventDefault(); responder(campo.value.trim() || null); }
            if (e.key === 'Escape') { e.preventDefault(); responder(null); }
        });
        campo.focus();
        campo.select();
    });
}

// Qué se incluye en la cotización en PDF. Recibe lo que hay para enseñar:
//   { gramos: número o null, horas: número o null, nombre: texto, etiquetaNombre: 'Nombre de la pieza' }
// Devuelve { gramos, tiempo, enDias, diasExtra, nombre } o null si se cancela.
// Recuerda la última elección en state.opcionesCotizacion.
function opcionesCotizacion(datos) {
    datos = datos || {};
    const previas = Object.assign(
        { gramos: true, tiempo: true, enDias: true, diasExtra: 1, nombre: true },
        (typeof state !== 'undefined' && state.opcionesCotizacion) || {});
    const hayGramos = datos.gramos != null;
    const hayTiempo = datos.horas != null;
    const hayNombre = !!datos.nombre;

    return new Promise(resolve => {
        const casilla = (campo, texto, extra) =>
            '<label class="cotiz-opcion"><input type="checkbox" data-op="' + campo + '"' +
            (previas[campo] ? ' checked' : '') + '> <span>' + texto + '</span>' +
            (extra ? ' <span class="cotiz-valor">' + extra + '</span>' : '') + '</label>';

        const capa = crear(
            encabezado('Qué poner en la cotización', 'file-earmark-pdf') +
            '<div class="cotiz-opciones">' +
            (hayGramos ? casilla('gramos', 'Gramos de filamento', esc(window.formatGramos(datos.gramos))) : '') +
            (hayTiempo ?
                casilla('tiempo', 'Tiempo de producción') +
                '<div class="cotiz-sub" data-sub-tiempo>' +
                '  <label>Mostrarlo' +
                '    <select data-op="enDias">' +
                '      <option value="1"' + (previas.enDias ? ' selected' : '') + '>en días</option>' +
                '      <option value="0"' + (previas.enDias ? '' : ' selected') + '>en horas</option>' +
                '    </select></label>' +
                '  <label data-sub-dias>Días de más' +
                '    <input type="number" min="0" step="1" data-op="diasExtra" value="' + esc(previas.diasExtra) + '"></label>' +
                '  <p class="cotiz-previa" data-previa></p>' +
                '</div>' : '') +
            (hayNombre ? casilla('nombre', esc(datos.etiquetaNombre || 'Nombre'), esc(datos.nombre)) : '') +
            '</div>' +
            '<div class="modal-btn-group">' +
            '  <button class="btn btn-outline" data-no>Cancelar</button>' +
            '  <button class="btn btn-primary" data-si><i class="bi bi-file-earmark-pdf"></i> Generar PDF</button>' +
            '</div>');

        const campo = (n) => capa.querySelector('[data-op="' + n + '"]');
        const leer = () => ({
            gramos:    hayGramos ? campo('gramos').checked : previas.gramos,
            tiempo:    hayTiempo ? campo('tiempo').checked : previas.tiempo,
            enDias:    hayTiempo ? campo('enDias').value === '1' : previas.enDias,
            diasExtra: hayTiempo ? Math.max(0, Math.floor(parseFloat(campo('diasExtra').value) || 0)) : previas.diasExtra,
            nombre:    hayNombre ? campo('nombre').checked : previas.nombre,
        });

        const refrescar = () => {
            if (!hayTiempo) return;
            const op = leer();
            capa.querySelector('[data-sub-tiempo]').classList.toggle('apagado', !op.tiempo);
            capa.querySelector('[data-sub-dias]').style.display = op.enDias ? '' : 'none';
            capa.querySelector('[data-previa]').textContent = op.enDias
                ? window.formatTime(datos.horas) + '  →  ' + window.tiempoParaCotizacion(datos.horas, op)
                : 'Saldrá: ' + window.formatTime(datos.horas);
        };
        capa.querySelectorAll('[data-op]').forEach(c => {
            c.addEventListener('input', refrescar);
            c.addEventListener('change', refrescar);
        });
        refrescar();

        const responder = (valor) => {
            if (valor && typeof state !== 'undefined') {
                state.opcionesCotizacion = valor;
                if (window.saveAllData) window.saveAllData();
            }
            cerrar(capa);
            resolve(valor);
        };
        capa.querySelector('[data-si]').addEventListener('click', () => responder(leer()));
        capa.querySelector('[data-no]').addEventListener('click', () => responder(null));
        capa.addEventListener('click', (e) => { if (e.target === capa) responder(null); });
        capa.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') responder(null);
            if (e.key === 'Enter') { e.preventDefault(); responder(leer()); }
        });
        capa.querySelector('[data-si]').focus();
    });
}

window.avisar = avisar;
window.confirmar = confirmar;
window.pedirTexto = pedirTexto;
window.opcionesCotizacion = opcionesCotizacion;

})();
// ===== FIN DIÁLOGOS =====
