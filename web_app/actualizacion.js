// ===== ACTUALIZACIONES =====
// La parte en Python revisa GitHub al abrir la app y, si hay algo nuevo, llama
// a window.avisoActualizacion(). Aquí se muestra el aviso y se maneja todo lo
// que el usuario puede hacer: actualizar, omitir esa versión o volver a una
// versión anterior.
(function() {

let barra = null;
let timerEstado = null;
let modal = null;

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

// Sigue el avance de una descarga y reinicia la app cuando termina
function seguirDescarga(btn, alFallar) {
    const a = api();
    clearInterval(timerEstado);
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
            if (alFallar) alFallar(st);
        }
    }, 700);
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

    const omitir = document.createElement('button');
    omitir.className = 'btn btn-outline update-bar-btn2';
    omitir.textContent = 'Omitir esta versión';
    omitir.title = 'No volver a avisar de la ' + (info.version || '');

    const luego = document.createElement('button');
    luego.className = 'update-bar-close';
    luego.title = 'Recordármelo la próxima vez';
    luego.innerHTML = '<i class="bi bi-x-lg"></i>';
    luego.addEventListener('click', quitarBarra);

    omitir.addEventListener('click', () => {
        const a = api();
        if (a) a.omitir_version(info.version);
        quitarBarra();
    });

    btn.addEventListener('click', () => {
        const a = api();
        if (!a) { alert('La actualización solo funciona desde la aplicación de escritorio.'); return; }
        btn.disabled = true;
        btn.textContent = 'Descargando… 0%';
        omitir.style.display = 'none';
        luego.style.display = 'none';
        a.iniciar_actualizacion_exe();
        seguirDescarga(btn, () => {
            btn.disabled = false;
            btn.textContent = 'Reintentar';
            omitir.style.display = '';
            luego.style.display = '';
            texto.innerHTML = '<strong>No se pudo descargar la actualización.</strong> ' +
                '<span class="update-bar-dim">Revisa tu conexión o descárgala a mano desde GitHub.</span>';
        });
    });

    barra.appendChild(texto);
    barra.appendChild(btn);
    barra.appendChild(omitir);
    barra.appendChild(luego);
    document.body.appendChild(barra);
    document.body.classList.add('con-aviso-update');
}

window.avisoActualizacion = function(info) {
    if (!info) return;
    if (info.tipo === 'exe') barraEjecutable(info);
    else toastInterfaz(info);
};

// ---------- Ventana de versiones ----------
function cerrarModal() {
    if (modal) { modal.remove(); modal = null; }
}

async function abrirVersiones() {
    const a = api();
    cerrarModal();
    modal = document.createElement('div');
    modal.className = 'modal active version-modal';
    modal.innerHTML =
        '<div class="modal-content version-modal-content">' +
        '  <div class="version-modal-head">' +
        '    <h3>Versiones de la aplicación</h3>' +
        '    <button class="update-bar-close" data-cerrar><i class="bi bi-x-lg"></i></button>' +
        '  </div>' +
        '  <div class="version-lista"><p class="version-cargando">Consultando GitHub…</p></div>' +
        '</div>';
    document.body.appendChild(modal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.closest('[data-cerrar]')) cerrarModal();
    });

    const cont = modal.querySelector('.version-lista');
    if (!a) {
        cont.innerHTML = '<p class="version-cargando">Solo disponible en la aplicación de escritorio.</p>';
        return;
    }

    let datos;
    try { datos = JSON.parse(await a.listar_versiones()); } catch (e) { datos = { error: 'Error inesperado.' }; }
    if (datos.error || !datos.versiones || !datos.versiones.length) {
        cont.innerHTML = '<p class="version-cargando">' + (datos.error || 'No hay versiones publicadas.') + '</p>';
        return;
    }

    let html = '';
    if (datos.fijada) {
        html += '<div class="version-fijada">' +
                '<span>Estás en la versión <strong>' + datos.fijada + '</strong> por decisión propia, ' +
                'así que la app no se actualiza sola.</span>' +
                '<button class="btn btn-outline" data-reactivar>Reactivar actualizaciones</button></div>';
    }
    html += datos.versiones.map(v => {
        const esActual = v.version === datos.actual;
        return '<div class="version-item' + (esActual ? ' actual' : '') + '">' +
            '<div class="version-item-info">' +
                '<span class="version-num">' + v.version +
                    (esActual ? ' <span class="version-chip">instalada</span>' : '') + '</span>' +
                (v.fecha ? '<span class="version-fecha">' + v.fecha + '</span>' : '') +
                (v.notas ? '<span class="version-notas">' + v.notas + '</span>' : '') +
            '</div>' +
            (esActual ? '' : '<button class="btn btn-outline version-btn" data-instalar="' + v.version + '">Instalar</button>') +
        '</div>';
    }).join('');
    cont.innerHTML = html;

    const reactivar = cont.querySelector('[data-reactivar]');
    if (reactivar) {
        reactivar.addEventListener('click', async () => {
            await a.reactivar_actualizaciones();
            abrirVersiones();
        });
    }

    cont.querySelectorAll('[data-instalar]').forEach(btn => {
        btn.addEventListener('click', () => {
            const v = btn.getAttribute('data-instalar');
            if (!confirm('¿Instalar la versión ' + v + '?\n\nLa app se reiniciará sola y se quedará en esa ' +
                         'versión hasta que reactives las actualizaciones. Tus datos no se tocan.')) return;
            cont.querySelectorAll('.version-btn').forEach(b => { b.disabled = true; });
            btn.textContent = 'Descargando… 0%';
            a.instalar_version(v);
            seguirDescarga(btn, () => {
                cont.querySelectorAll('.version-btn').forEach(b => { b.disabled = false; });
                btn.textContent = 'Reintentar';
            });
        });
    });
}

// Enlace en el pie con la versión instalada
async function ponerEnlaceVersion() {
    const pie = document.querySelector('.app-footer');
    if (!pie || pie.querySelector('.version-enlace')) return;
    const a = api();
    let etiqueta = 'Versiones';
    if (a) {
        try {
            const info = JSON.parse(await a.info_version());
            etiqueta = 'v' + info.app + (info.fijada ? ' (fijada)' : '');
        } catch (e) { /* sin datos: se deja el texto genérico */ }
    }
    const enlace = document.createElement('button');
    enlace.className = 'version-enlace';
    enlace.textContent = etiqueta;
    enlace.title = 'Ver versiones e instalar otra';
    enlace.addEventListener('click', abrirVersiones);
    pie.appendChild(document.createTextNode(' · '));
    pie.appendChild(enlace);
}

window.abrirVersiones = abrirVersiones;

// pywebview avisa cuando su API ya está lista; en el navegador ese evento no llega
window.addEventListener('pywebviewready', ponerEnlaceVersion);
document.addEventListener('DOMContentLoaded', () => setTimeout(ponerEnlaceVersion, 1200));

})();
// ===== FIN ACTUALIZACIONES =====
