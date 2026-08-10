// ===== COMBOBOX GENÉRICO =====
// Convierte un <select> normal en un desplegable con buscador, igual que el de
// piezas. El <select> original sigue existiendo (oculto) y se le sigue leyendo
// y escribiendo el valor, así que ningún código que ya funcionaba se entera.
(function() {

const RE_DIACRITICOS = new RegExp('[\\u0300-\\u036f]', 'g');
const norm = (s) => (s || '').toString().toLowerCase().normalize('NFD').replace(RE_DIACRITICOS, '');
const esc = (s) => (s || '').toString()
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function crear(select, textoVacio) {
    if (!select || select._comboListo) return;
    select._comboListo = true;

    const combo = document.createElement('div');
    combo.className = 'piece-combo';
    combo.innerHTML =
        '<div class="piece-combo-control">' +
        '  <input type="text" class="piece-combo-input" role="combobox" autocomplete="off"' +
        '         aria-expanded="false" aria-autocomplete="list" placeholder="' + esc(textoVacio) + '">' +
        '  <span class="piece-combo-count"></span>' +
        '  <button type="button" class="piece-combo-btn combo-limpiar" tabindex="-1"><i class="bi bi-x-lg"></i></button>' +
        '  <button type="button" class="piece-combo-btn piece-combo-arrow" tabindex="-1"><i class="bi bi-chevron-down"></i></button>' +
        '</div>' +
        '<div class="piece-combo-list" role="listbox" hidden></div>';

    select.parentNode.insertBefore(combo, select);
    select.classList.add('piece-select-hidden');
    select.setAttribute('tabindex', '-1');
    select.setAttribute('aria-hidden', 'true');

    const input   = combo.querySelector('.piece-combo-input');
    const lista   = combo.querySelector('.piece-combo-list');
    const cuenta  = combo.querySelector('.piece-combo-count');
    const limpiar = combo.querySelector('.combo-limpiar');
    const flecha  = combo.querySelector('.piece-combo-arrow');

    let abierto = false, consulta = '', filtradas = [], activo = -1;

    // Las opciones vivas del <select>, saltando la primera ("-- Cargar ... --")
    function opciones() {
        return Array.from(select.options)
            .filter(o => o.value !== '')
            .map(o => ({ valor: o.value, texto: o.textContent }));
    }

    function seleccionada() {
        const o = select.options[select.selectedIndex];
        return (o && o.value) ? o.textContent : '';
    }

    function resaltar(texto) {
        if (!consulta) return esc(texto);
        const i = texto.toLowerCase().indexOf(consulta.toLowerCase());
        if (i < 0) return esc(texto);
        return esc(texto.slice(0, i)) + '<mark>' + esc(texto.slice(i, i + consulta.length)) + '</mark>' +
               esc(texto.slice(i + consulta.length));
    }

    function pintar() {
        const todas = opciones();
        filtradas = consulta ? todas.filter(o => norm(o.texto).includes(norm(consulta))) : todas;
        cuenta.textContent = consulta ? filtradas.length + '/' + todas.length : String(todas.length);
        combo.classList.toggle('has-value', !!select.value);

        if (!todas.length) {
            lista.innerHTML = '<div class="piece-combo-empty">Todavía no hay nada guardado.</div>';
            return;
        }
        if (!filtradas.length) {
            lista.innerHTML = '<div class="piece-combo-empty">Sin coincidencias para "' + esc(consulta) + '"</div>';
            return;
        }
        if (activo >= filtradas.length) activo = filtradas.length - 1;

        lista.innerHTML = filtradas.map((o, i) => {
            const clases = ['piece-combo-option'];
            if (i === activo) clases.push('active');
            if (o.valor === select.value) clases.push('selected');
            return '<div class="' + clases.join(' ') + '" role="option" data-valor="' + esc(o.valor) + '">' +
                   '<span class="piece-combo-option-name">' + resaltar(o.texto) + '</span></div>';
        }).join('');

        const act = lista.querySelector('.piece-combo-option.active');
        if (act) act.scrollIntoView({ block: 'nearest' });
    }

    function sincronizar() {
        combo.classList.toggle('has-value', !!select.value);
        if (!abierto) input.value = seleccionada();
    }

    function abrir() {
        abierto = true; consulta = ''; activo = -1;
        combo.classList.add('open');
        lista.hidden = false;
        input.setAttribute('aria-expanded', 'true');
        input.value = '';
        input.placeholder = seleccionada() || 'Escribe para filtrar...';
        pintar();
        const i = filtradas.findIndex(o => o.valor === select.value);
        if (i >= 0) { activo = i; pintar(); }
    }

    function cerrar() {
        abierto = false; consulta = ''; activo = -1;
        combo.classList.remove('open');
        lista.hidden = true;
        input.setAttribute('aria-expanded', 'false');
        input.placeholder = textoVacio;
        sincronizar();
    }

    function elegir(valor) {
        select.value = valor || '';
        select.dispatchEvent(new Event('change', { bubbles: true }));
        cerrar();
    }

    input.addEventListener('focus', () => { if (!abierto) abrir(); });
    input.addEventListener('mousedown', () => { if (!abierto) setTimeout(abrir, 0); });
    input.addEventListener('input', () => {
        if (!abierto) abrir();
        consulta = input.value;
        activo = consulta ? 0 : -1;
        pintar();
    });
    input.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            if (!abierto) { abrir(); return; }
            if (!filtradas.length) return;
            activo = (activo + (e.key === 'ArrowDown' ? 1 : -1) + filtradas.length) % filtradas.length;
            pintar();
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (abierto && activo >= 0 && filtradas[activo]) elegir(filtradas[activo].valor);
            else if (abierto && filtradas.length === 1) elegir(filtradas[0].valor);
        } else if (e.key === 'Escape') {
            if (abierto) { e.preventDefault(); cerrar(); }
        } else if (e.key === 'Tab') {
            if (abierto) cerrar();
        }
    });

    lista.addEventListener('mousedown', (e) => e.preventDefault());
    lista.addEventListener('click', (e) => {
        const op = e.target.closest('.piece-combo-option');
        if (op) elegir(op.getAttribute('data-valor'));
    });

    flecha.addEventListener('mousedown', (e) => e.preventDefault());
    flecha.addEventListener('click', () => { if (abierto) cerrar(); else { input.focus(); abrir(); } });
    limpiar.addEventListener('mousedown', (e) => e.preventDefault());
    limpiar.addEventListener('click', () => elegir(''));

    document.addEventListener('mousedown', (e) => {
        if (abierto && !combo.contains(e.target)) cerrar();
    });

    // Cuando el resto del código rellena el <select> otra vez, el combo se entera
    new MutationObserver(() => { if (abierto) pintar(); sincronizar(); })
        .observe(select, { childList: true });
    select.addEventListener('change', sincronizar);

    sincronizar();
}

function iniciar() {
    crear(document.getElementById('projectSelect'), '-- Cargar Proyecto Guardado --');
    crear(document.getElementById('megaProjectSelect'), '-- Cargar Mega Proyecto --');
    crear(document.getElementById('subProjectSelect'), '-- Proyectos Guardados --');
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
else iniciar();

window.crearCombobox = crear;

})();
// ===== FIN COMBOBOX GENÉRICO =====
