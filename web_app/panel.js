/* =========================================================================
   panel.js — la regleta de estado del tablero
   -------------------------------------------------------------------------
   No calcula nada: mira los resultados que ya escribe app.js y los repite
   arriba, donde se ven sin bajar. Hace tres cosas:

   1. Sube el costo de producción y el total a cobrar a la cabecera.
   2. Enciende el piloto: verde si el precio cubre el costo con holgura,
      ámbar si va raspando y rojo si por debajo se está trabajando gratis.
   3. Dibuja las camas y las bobinas como unidades encendidas, para que 14
      camas se vean como 14 cosas y no como un "14" suelto.

   Si algo de esto falla, la app sigue funcionando igual: son adornos que
   leen, nunca escriben en el cálculo.
   ========================================================================= */
(function () {
    'use strict';

    var MAX_TIRAS = 24;

    function $(id) { return document.getElementById(id); }

    /* Los números llegan ya formateados ("$ 12.345" en COP, "$12,345.67" en
       USD). Se vuelven a número para poder compararlos: el separador de
       decimales es el último punto o coma que deje una o dos cifras detrás. */
    function aNumero(txt) {
        var t = String(txt == null ? '' : txt).replace(/[^0-9.,-]/g, '');
        if (!t) return NaN;
        var corte = Math.max(t.lastIndexOf('.'), t.lastIndexOf(','));
        var dec = '';
        if (corte > -1) {
            var cola = t.slice(corte + 1);
            if (cola.length > 0 && cola.length <= 2 && /^[0-9]+$/.test(cola)) {
                dec = cola;
                t = t.slice(0, corte);
            }
        }
        t = t.replace(/[.,]/g, '');
        var v = parseFloat(t + (dec ? '.' + dec : ''));
        return isNaN(v) ? NaN : v;
    }

    /* Un destello corto al cambiar: es lo que hace ver que el número se
       recalcula solo mientras se escribe, sin botón de calcular. */
    function destellar(caja) {
        if (!caja) return;
        caja.classList.remove('cambio');
        void caja.offsetWidth;
        caja.classList.add('cambio');
    }

    var ultimoCosto = null;
    var ultimoPrecio = null;

    function sincronizarRegleta() {
        var origenCosto = $('resCostoProduccion');
        var origenPrecio = $('resTotalCobrar');
        var destCosto = $('railCosto');
        var destPrecio = $('railPrecio');
        var estado = $('railEstado');
        var estadoTexto = $('railEstadoTexto');
        if (!origenCosto || !origenPrecio || !destCosto || !destPrecio) return;

        var txtCosto = origenCosto.innerText.trim();
        var txtPrecio = origenPrecio.innerText.trim();
        var costo = aNumero(txtCosto);
        var precio = aNumero(txtPrecio);
        var hayDatos = !isNaN(costo) && costo > 0;

        /* Sin datos la lectura no se vacía: se muestra apagada, como un
           display al que todavía no le llega señal. */
        destCosto.textContent = txtCosto || '—';
        destPrecio.textContent = txtPrecio || '—';
        destCosto.classList.toggle('apagado', !hayDatos);
        destPrecio.classList.toggle('apagado', !hayDatos);

        if (txtCosto !== ultimoCosto) { destellar($('regletaCosto')); ultimoCosto = txtCosto; }
        if (txtPrecio !== ultimoPrecio) { destellar($('regletaPrecio')); ultimoPrecio = txtPrecio; }

        var clave = 'vacio';
        var leyenda = 'Sin datos';
        if (hayDatos && !isNaN(precio)) {
            if (precio < costo) {
                clave = 'perdida';
                leyenda = 'Por debajo del costo';
            } else if (precio < costo * 1.15) {
                clave = 'justo';
                leyenda = 'Margen ajustado';
            } else {
                clave = 'ok';
                leyenda = 'Cubre el costo';
            }
        }
        if (estado) estado.setAttribute('data-estado', clave);
        if (estadoTexto) estadoTexto.textContent = leyenda;

        /* Trabajar por debajo del costo se dice, no se insinúa: la ventana
           del total también se marca. */
        var ventana = origenPrecio.closest ? origenPrecio.closest('.final-price') : null;
        if (ventana) ventana.classList.toggle('en-perdida', clave === 'perdida');
        var lecturaPrecio = $('regletaPrecio');
        if (lecturaPrecio) lecturaPrecio.classList.toggle('en-perdida', clave === 'perdida');
    }

    /* Cantidades como unidades encendidas. La tira va antes del número, que
       se queda: sirve para el vistazo, no lo reemplaza. */
    function pintarTiras(valor, cantidad) {
        if (!valor || !valor.parentNode) return;
        var fila = valor.parentNode;
        var tiras = fila.querySelector(':scope > .tiras');
        /* Pasadas dos docenas la tira deja de contarse de un vistazo y solo
           ensucia: ahí manda el número solo. */
        if (!(cantidad > 0) || cantidad > MAX_TIRAS) {
            if (tiras) tiras.remove();
            return;
        }
        if (!tiras) {
            tiras = document.createElement('span');
            tiras.className = 'tiras';
            fila.insertBefore(tiras, valor);
        }
        var html = '';
        for (var i = 0; i < cantidad; i++) html += '<span class="tira"></span>';
        tiras.innerHTML = html;
    }

    function sincronizarTiras() {
        var camas = $('resCamas');
        if (camas) pintarTiras(camas, aNumero(camas.innerText));
        var bobinas = $('resBobinas');
        if (bobinas) pintarTiras(bobinas, aNumero(bobinas.innerText));
    }

    /* Proyecto y Mega Proyecto ocupaban una columna de 400 px que estaba
       vacía hasta que hubiera resultados. Mientras no los haya, el panel de
       entrada se queda con todo el ancho. */
    function ajustarColumnas() {
        var filas = document.querySelectorAll('.paired-row');
        for (var i = 0; i < filas.length; i++) {
            var panel = filas[i].querySelector('.results-panel');
            if (!panel) continue;
            var tarjetas = panel.querySelectorAll('.card');
            var algunaVisible = false;
            for (var j = 0; j < tarjetas.length; j++) {
                if (tarjetas[j].style.display !== 'none') { algunaVisible = true; break; }
            }
            filas[i].classList.toggle('sin-resultados', !algunaVisible);
        }
    }

    var pendiente = false;
    function alCambiar() {
        if (pendiente) return;
        pendiente = true;
        requestAnimationFrame(function () {
            pendiente = false;
            try {
                sincronizarRegleta();
                sincronizarTiras();
                ajustarColumnas();
            } catch (e) { /* nunca romper el cálculo por un adorno */ }
        });
    }

    function vigilar(el, atributos) {
        if (!el || typeof MutationObserver === 'undefined') return;
        new MutationObserver(alCambiar).observe(el, {
            childList: true,
            characterData: true,
            subtree: true,
            attributes: !!atributos,
            attributeFilter: atributos ? ['style'] : undefined
        });
    }

    function arrancar() {
        ['resCostoProduccion', 'resTotalCobrar', 'resCamas', 'resBobinas'].forEach(function (id) {
            vigilar($(id));
        });
        // Estos aparecen y desaparecen: hay que mirarles el atributo style
        ['projectResults', 'megaProjectResults'].forEach(function (id) {
            vigilar($(id), true);
        });
        alCambiar();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', arrancar);
    } else {
        arrancar();
    }
})();
