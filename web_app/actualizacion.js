// ===== AVISO DE ACTUALIZACIÓN =====
// La parte en Python revisa GitHub al abrir la app y, si hay algo nuevo, llama
// a window.avisoActualizacion(). Aquí solo se muestra y se maneja el botón.
(function() {

let barra = null;
let timerEstado = null;

function api() {
    return (window.pywebview && window.pywebview.api) ? window.pywebview.api : null;
}

function quitarBarra() {
    clearInterval(timerEstado);
    if (barra) { barra.remove(); barra = null; }
    document.body.classList.remove('con-aviso-update');
}

// Aviso pequeño y pasajero: la interfaz ya se actualizó sola
function toastInterfaz(info) {
    const t = document.createElement('div');
    t.className = 'update-toast';
    t.innerHTML = '<strong>Interfaz actualizada</strong> a la versión ' +
                  (info.version || '') + '. Se aplica al volver a abrir la app.';
    document.body.appendChild(t);
    requestAnimationFrame(() => t.classList.add('visible'));
    setTimeout(() => {
        t.classList.remove('visible');
        setTimeout(() => t.remove(), 400);
    }, 9000);
}

// Aviso fijo arriba: hay un ejecutable nuevo y hace falta el visto bueno
function barraEjecutable(info) {
    quitarBarra();
    barra = document.createElement('div');
    barra.className = 'update-bar';

    const texto = document.createElement('div');
    texto.className = 'update-bar-text';
    texto.innerHTML = '<strong>Hay una versión nueva (' + (info.version || '') + ')</strong>' +
        (info.actual ? ' <span class="update-bar-dim">— tienes la ' + info.actual + '</span>' : '') +
        (info.notas ? '<span class="update-bar-notas">' + info.notas + '</span>' : '');

    const btn = document.createElement('button');
    btn.className = 'btn btn-primary update-bar-btn';
    btn.textContent = 'Actualizar ahora';

    const luego = document.createElement('button');
    luego.className = 'update-bar-close';
    luego.title = 'Después';
    luego.textContent = '×';
    luego.addEventListener('click', quitarBarra);

    btn.addEventListener('click', () => {
        const a = api();
        if (!a) { alert('La actualización solo funciona desde la aplicación de escritorio.'); return; }
        btn.disabled = true;
        btn.textContent = 'Descargando… 0%';
        luego.style.display = 'none';
        a.iniciar_actualizacion_exe();
        timerEstado = setInterval(async () => {
            let st;
            try { st = JSON.parse(await a.estado_actualizacion()); } catch (e) { return; }
            if (st.estado === 'descargando') {
                btn.textContent = 'Descargando… ' + (st.porcentaje || 0) + '%';
            } else if (st.estado === 'listo') {
                clearInterval(timerEstado);
                btn.textContent = 'Reiniciando…';
                a.aplicar_actualizacion_exe();
            } else if (st.estado === 'error') {
                clearInterval(timerEstado);
                btn.disabled = false;
                btn.textContent = 'Reintentar';
                luego.style.display = '';
                texto.innerHTML = '<strong>No se pudo descargar la actualización.</strong> ' +
                    '<span class="update-bar-dim">Revisa tu conexión o descárgala a mano desde GitHub.</span>';
            }
        }, 700);
    });

    barra.appendChild(texto);
    barra.appendChild(btn);
    barra.appendChild(luego);
    document.body.appendChild(barra);
    document.body.classList.add('con-aviso-update');
}

window.avisoActualizacion = function(info) {
    if (!info) return;
    if (info.tipo === 'exe') barraEjecutable(info);
    else toastInterfaz(info);
};

})();
// ===== FIN AVISO DE ACTUALIZACIÓN =====
