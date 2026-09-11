
// Lógica de Gestión de Filamentos

function initFilamentos() {
    if (typeof els === 'undefined') {
        setTimeout(initFilamentos, 100);
        return;
    }

    if (typeof state.filamentosGuardados === 'undefined') {
        state.filamentosGuardados = [];
    }

    function renderFilamentosGuardados() {
        if(!els.filamentosList) return;
        els.filamentosList.innerHTML = '';
        
        // Refrescar selects
        const selects = [];
        if (els.mainFilamentoSelect) selects.push(els.mainFilamentoSelect);
        document.querySelectorAll('.fil-extra-select').forEach(el => selects.push(el));
        
        selects.forEach(sel => {
            if(!sel) return;
            const currentVal = sel.value;
            sel.innerHTML = '<option value="">-- Seleccione un filamento --</option>';
            state.filamentosGuardados.forEach(f => {
                const opt = document.createElement('option');
                opt.value = f.id;
                opt.text = `${f.marca} ${f.tipo} - ${f.color} ($${f.precio} ${f.moneda})`;
                // De aquí saca el cuadrito el desplegable con buscador
                opt.setAttribute('data-hex', window.Color.hexDeFilamento(f));
                sel.appendChild(opt);
            });
            sel.value = currentVal; // restaurar si existe
        });

        // La lista se ve en una tabla aparte; aquí solo queda el acceso
        const n = state.filamentosGuardados.length;
        els.filamentosList.innerHTML = '';
        const boton = document.createElement('button');
        boton.type = 'button';
        boton.className = 'btn btn-outline ver-filamentos';
        boton.innerHTML = n
            ? '<i class="bi bi-table"></i> Ver filamentos guardados <span class="ver-filamentos-num">' + n + '</span>'
            : '<i class="bi bi-table"></i> Todavía no hay filamentos guardados';
        boton.disabled = !n;
        boton.addEventListener('click', abrirTablaFilamentos);
        els.filamentosList.appendChild(boton);
    }

    // ---- Tabla editable de filamentos ----
    const TIPOS = ['PLA', 'PETG', 'ABS', 'TPU', 'ASA', 'Otro'];
    let modalTabla = null;

    function escapar(s) {
        return (s || '').toString()
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    function cerrarTabla() {
        if (modalTabla) { modalTabla.remove(); modalTabla = null; }
    }

    function abrirTablaFilamentos() {
        cerrarTabla();
        modalTabla = document.createElement('div');
        modalTabla.className = 'modal active filamentos-modal';
        modalTabla.innerHTML =
            '<div class="modal-content filamentos-content">' +
            '  <div class="version-modal-head">' +
            '    <h3>Filamentos guardados</h3>' +
            '    <button class="update-bar-close" data-cerrar><i class="bi bi-x-lg"></i></button>' +
            '  </div>' +
            '  <p class="ajustes-nota">Edita cualquier casilla y se guarda sola. Los precios se aplican ' +
            '     de inmediato a las piezas que usen ese filamento.</p>' +
            '  <div class="tabla-scroll"><table class="tabla-filamentos"><thead><tr>' +
            '    <th>Marca</th><th>Tipo</th><th>Color</th><th>Precio por kg</th><th>Moneda</th><th></th>' +
            '  </tr></thead><tbody></tbody></table></div>' +
            '</div>';
        document.body.appendChild(modalTabla);
        modalTabla.addEventListener('click', (e) => {
            if (e.target === modalTabla || e.target.closest('[data-cerrar]')) cerrarTabla();
        });
        pintarTabla();
    }

    function pintarTabla() {
        if (!modalTabla) return;
        const cuerpo = modalTabla.querySelector('tbody');
        const lista = state.filamentosGuardados
            .slice()
            .sort((a, b) => (a.marca + a.tipo + a.color).localeCompare(b.marca + b.tipo + b.color, 'es'));

        cuerpo.innerHTML = lista.map(f => (
            '<tr data-id="' + escapar(f.id) + '">' +
            '  <td><div class="celda"><input type="text" data-campo="marca" value="' + escapar(f.marca) + '"></div></td>' +
            '  <td><div class="celda"><select data-campo="tipo">' +
                 TIPOS.map(t => '<option' + (t === f.tipo ? ' selected' : '') + '>' + t + '</option>').join('') +
            '  </select></div></td>' +
            '  <td><div class="celda celda-color"><input type="text" data-campo="color" value="' + escapar(f.color) + '"></div></td>' +
            '  <td><div class="celda"><input type="number" min="0" step="0.01" data-campo="precio" value="' + escapar(f.precio) + '"></div></td>' +
            '  <td><div class="celda"><select data-campo="moneda">' +
                 ['COP', 'USD'].map(m => '<option' + (m === (f.moneda || 'COP') ? ' selected' : '') + '>' + m + '</option>').join('') +
            '  </select></div></td>' +
            '  <td><button class="tabla-borrar" title="Eliminar"><i class="bi bi-trash"></i></button></td>' +
            '</tr>'
        )).join('');

        // El cuadrito de color de cada fila, delante del nombre
        cuerpo.querySelectorAll('tr').forEach(fila => {
            const id = fila.getAttribute('data-id');
            const celda = fila.querySelector('.celda-color');
            const selector = window.Color.crearSelectorColor({
                leerHex: () => {
                    const fil = state.filamentosGuardados.find(x => x.id === id);
                    if (!fil) return '';
                    // Mientras se reescribe el nombre, el cuadrito hace caso a lo
                    // que hay en la casilla, que aún no ha llegado a los datos.
                    if (fil.hex) return window.Color.hexDeFilamento(fil);
                    return window.Color.hexDeNombre(celda.querySelector('input').value);
                },
                alElegir: (hex, nombre) => {
                    const fil = state.filamentosGuardados.find(x => x.id === id);
                    if (!fil) return;
                    fil.hex = hex;
                    if (nombre) {
                        fil.color = nombre;
                        celda.querySelector('input').value = nombre;
                    }
                    saveFilamentosLocal();
                    renderFilamentosGuardados();
                }
            });
            celda.insertBefore(selector, celda.firstChild);
            // Si reescribe el nombre a mano, el cuadrito lo sigue
            celda.querySelector('input').addEventListener('input', () => selector.refrescar());
        });

        cuerpo.querySelectorAll('[data-campo]').forEach(campo => {
            campo.addEventListener('change', () => {
                const id = campo.closest('tr').getAttribute('data-id');
                const fil = state.filamentosGuardados.find(x => x.id === id);
                if (!fil) return;
                const nombre = campo.getAttribute('data-campo');
                let valor = campo.value;
                if (nombre === 'precio') {
                    const n = parseFloat(valor);
                    if (isNaN(n) || n < 0) { campo.value = fil.precio; return; }
                    valor = n;
                } else if (nombre === 'marca' || nombre === 'color') {
                    valor = valor.trim();
                    if (!valor) { campo.value = fil[nombre]; return; }   // no se deja vacío
                }
                fil[nombre] = valor;
                saveFilamentosLocal();
                renderFilamentosGuardados();
                if (typeof calculate === 'function') calculate();
            });
        });

        cuerpo.querySelectorAll('.tabla-borrar').forEach(b => {
            b.addEventListener('click', async () => {
                const fila = b.closest('tr');
                const id = fila.getAttribute('data-id');
                const fil = state.filamentosGuardados.find(x => x.id === id);
                const ok = await confirmar(
                    'Se elimina "' + (fil ? fil.marca + ' ' + fil.tipo + ' - ' + fil.color : '') + '". ' +
                    'Las piezas ya guardadas mantendrán el costo con el que se calcularon.',
                    { titulo: 'Eliminar filamento', aceptar: 'Eliminar', peligro: true });
                if (!ok) return;
                state.filamentosGuardados = state.filamentosGuardados.filter(x => x.id !== id);
                saveFilamentosLocal();
                renderFilamentosGuardados();
                pintarTabla();
                if (typeof calculate === 'function') calculate();
            });
        });
    }

    function saveFilamentosLocal() {
        localStorage.setItem('calculadora3d_filamentos', JSON.stringify(state.filamentosGuardados));
        // Se guarda por la vía normal para no dejar fuera datos nuevos (empresa,
        // tema...). El "true" salta la espera de carga inicial, porque guardar un
        // filamento es siempre una acción explícita del usuario.
        if (window.saveAllData) window.saveAllData(true);
    }

    function loadFilamentosLocal() {
        // Si ya hay filamentos en state (cargados desde perfiles.json vía Python),
        // no los sobreescribimos con localStorage. Solo usamos localStorage como
        // fallback para la web app sin backend.
        if (!state.filamentosGuardados || state.filamentosGuardados.length === 0) {
            const stored = localStorage.getItem('calculadora3d_filamentos');
            if(stored) {
                try {
                    state.filamentosGuardados = JSON.parse(stored);
                } catch(e){}
            }
        }
        renderFilamentosGuardados();
    }

    // El cuadrito del formulario de alta. Mientras no se elija nada, enseña el
    // color que se deduce de lo que se vaya escribiendo en el nombre.
    let hexNuevo = '';
    let selectorNuevo = null;
    const campoColor = document.getElementById('filColorCampo');
    if (campoColor && els.filColor) {
        selectorNuevo = window.Color.crearSelectorColor({
            leerHex: () => hexNuevo || window.Color.hexDeNombre(els.filColor.value),
            alElegir: (hex, nombre) => {
                hexNuevo = hex;
                if (nombre) els.filColor.value = nombre;
            }
        });
        campoColor.insertBefore(selectorNuevo, els.filColor);
        els.filColor.addEventListener('input', () => selectorNuevo.refrescar());
    }

    if(els.btnSaveFilamento) {
        els.btnSaveFilamento.addEventListener('click', () => {
            const marca = els.filMarca.value.trim();
            const color = els.filColor.value.trim();
            const tipo = els.filTipo.value;
            const precio = parseFloat(els.filPrecio.value);
            const moneda = els.filMoneda.value;

            if(!marca || !color || isNaN(precio) || precio <= 0) {
                avisar('Por favor completa todos los campos del filamento correctamente.');
                return;
            }

            const id = 'fil_' + Date.now();
            // Se guarda el color que se veía en el cuadrito, lo hubiera elegido
            // a mano o deducido del nombre, para que no cambie después.
            const hex = hexNuevo || window.Color.hexDeNombre(color);
            state.filamentosGuardados.push({ id, marca, color, hex, tipo, precio, moneda });
            
            // Limpiar
            els.filMarca.value = '';
            els.filColor.value = '';
            els.filPrecio.value = '';
            hexNuevo = '';
            if (selectorNuevo) selectorNuevo.refrescar();
            
            saveFilamentosLocal();
            renderFilamentosGuardados();
        });
    }

    if(els.checkVariosFilamentos) {
        els.checkVariosFilamentos.addEventListener('change', (e) => {
            els.variosFilamentosSection.style.display = e.target.checked ? 'block' : 'none';
            if(typeof calculate === 'function') calculate();
        });
    }

    if(els.btnAñadirFilamentoExtra) {
        els.btnAñadirFilamentoExtra.addEventListener('click', () => {
            const row = document.createElement('div');
            row.className = 'fil-extra-row';
            row.style.display = 'flex';
            row.style.gap = '0.5rem';
            row.style.marginBottom = '0.5rem';
            row.innerHTML = `
                <select class="fil-extra-select" style="flex: 2; min-width: 150px;"></select>
                <input type="number" class="fil-extra-gramos" min="0" step="1" placeholder="Gramos" style="flex: 1; min-width: 80px;">
                <button class="btn-remove-extra-row" style="background:none; border:none; color:var(--danger); cursor:pointer;"><i class="bi bi-x-lg"></i></button>
            `;
            els.filamentosExtraContainer.appendChild(row);
            
            row.querySelector('.btn-remove-extra-row').addEventListener('click', () => {
                row.remove();
                if(typeof calculate === 'function') calculate();
            });
            
            row.querySelectorAll('input, select').forEach(el => {
                el.addEventListener('input', () => { if(typeof calculate === 'function') calculate(); });
                el.addEventListener('change', () => { if(typeof calculate === 'function') calculate(); });
            });

            window.crearCombobox(row.querySelector('.fil-extra-select'), '-- Seleccione un filamento --', true);
            renderFilamentosGuardados(); // poblates the new select
        });
    }

    // Bind calculate to main filament and grams
    if(els.mainFilamentoSelect) {
        els.mainFilamentoSelect.addEventListener('change', () => { if(typeof calculate === 'function') calculate(); });
    }
    if(els.gramosFilamento) {
        els.gramosFilamento.addEventListener('input', () => { if(typeof calculate === 'function') calculate(); });
    }

    // Inicializar
    loadFilamentosLocal();
    // Expose for Supabase sync
    window.renderFilamentosGuardados = renderFilamentosGuardados;

    // Exponer función para agregar filas de filamento extra programáticamente
    // (usada por loadPieceData al restaurar una pieza guardada)
    window.addFilamentoExtraRow = function(idFilamento, gramos) {
        const row = document.createElement('div');
        row.className = 'fil-extra-row';
        row.style.display = 'flex';
        row.style.gap = '0.5rem';
        row.style.marginBottom = '0.5rem';
        row.innerHTML = `
            <select class="fil-extra-select" style="flex: 2; min-width: 150px;"></select>
            <input type="number" class="fil-extra-gramos" min="0" step="1" placeholder="Gramos" style="flex: 1; min-width: 80px;">
            <button class="btn-remove-extra-row" style="background:none; border:none; color:var(--danger); cursor:pointer;"><i class="bi bi-x-lg"></i></button>
        `;
        els.filamentosExtraContainer.appendChild(row);
        row.querySelector('.btn-remove-extra-row').addEventListener('click', () => {
            row.remove();
            if(typeof calculate === 'function') calculate();
        });
        row.querySelectorAll('input, select').forEach(el => {
            el.addEventListener('input', () => { if(typeof calculate === 'function') calculate(); });
            el.addEventListener('change', () => { if(typeof calculate === 'function') calculate(); });
        });
        window.crearCombobox(row.querySelector('.fil-extra-select'), '-- Seleccione un filamento --', true);
        renderFilamentosGuardados(); // puebla el select con los filamentos disponibles
        // Establecer valores después de que el select esté poblado
        const resolvedId = window.resolveFilamentoId(idFilamento);
        row.querySelector('.fil-extra-select').value = resolvedId;
        row.querySelector('.fil-extra-gramos').value = gramos || '';
    };

    // Resolver un ID de filamento guardado: si existe localmente, úsalo;
    // si no, intenta buscar por nombre similar (fallback para IDs viejos de Supabase)
    window.resolveFilamentoId = function(savedId) {
        if (!savedId) return '';
        // ID existe localmente → usar directamente
        if (state.filamentosGuardados.find(f => f.id === savedId)) return savedId;
        // No existe → retornar vacío (el dropdown mostrará "-- Seleccione --")
        return '';
    };
}

window.addEventListener('DOMContentLoaded', initFilamentos);

