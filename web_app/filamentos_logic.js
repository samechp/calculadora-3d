
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
                sel.appendChild(opt);
            });
            sel.value = currentVal; // restaurar si existe
        });

        if(state.filamentosGuardados.length === 0) {
            els.filamentosList.innerHTML = '<span style="color:var(--text-muted); font-size:0.9rem;">No hay filamentos guardados.</span>';
            return;
        }

        state.filamentosGuardados.forEach(f => {
            const item = document.createElement('div');
            item.style.display = 'flex';
            item.style.justifyContent = 'space-between';
            item.style.alignItems = 'center';
            item.style.padding = '0.5rem';
            item.style.background = 'rgba(255,255,255,0.05)';
            item.style.borderRadius = '0.375rem';
            item.innerHTML = `
                <div>
                    <strong>${f.marca} ${f.tipo}</strong> - ${f.color} 
                    <br><small style="color:var(--text-muted);">$${f.precio} ${f.moneda}/kg</small>
                </div>
                <button class="btn-remove-filamento" data-id="${f.id}" style="background:none; border:none; color:var(--danger); cursor:pointer;">✕</button>
            `;
            els.filamentosList.appendChild(item);
        });

        document.querySelectorAll('.btn-remove-filamento').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                if(confirm('¿Estás seguro de eliminar este filamento? (Las piezas guardadas mantendrán su costo histórico)')) {
                    state.filamentosGuardados = state.filamentosGuardados.filter(x => x.id !== id);
                    saveFilamentosLocal();
                    renderFilamentosGuardados();
                    if(typeof calculate === 'function') calculate();
                }
            });
        });
    }

    function saveFilamentosLocal() {
        localStorage.setItem('calculadora3d_filamentos', JSON.stringify(state.filamentosGuardados));
        // Guardar directamente sin depender del flag _appReady
        // (los filamentos son guardados por acción explícita del usuario)
        const payload = JSON.stringify({
            profiles: state.profiles || {},
            pieces: state.pieces || {},
            projects: state.projects || {},
            megaProjects: state.megaProjects || {},
            filamentos: state.filamentosGuardados || []
        });
        if (window.pywebview) {
            window.pywebview.api.save_profiles(payload).then(() => {
                if (typeof window.showSaveToast === 'function') window.showSaveToast('✓ Filamento guardado');
            }).catch(e => console.error('Error guardando filamento:', e));
        } else {
            localStorage.setItem('calculadora3d_alldata', payload);
            if (typeof window.showSaveToast === 'function') window.showSaveToast('✓ Filamento guardado');
        }
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

    if(els.btnSaveFilamento) {
        els.btnSaveFilamento.addEventListener('click', () => {
            const marca = els.filMarca.value.trim();
            const color = els.filColor.value.trim();
            const tipo = els.filTipo.value;
            const precio = parseFloat(els.filPrecio.value);
            const moneda = els.filMoneda.value;

            if(!marca || !color || isNaN(precio) || precio <= 0) {
                alert('Por favor completa todos los campos del filamento correctamente.');
                return;
            }

            const id = 'fil_' + Date.now();
            state.filamentosGuardados.push({ id, marca, color, tipo, precio, moneda });
            
            // Limpiar
            els.filMarca.value = '';
            els.filColor.value = '';
            els.filPrecio.value = '';
            
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
                <button class="btn-remove-extra-row" style="background:none; border:none; color:var(--danger); cursor:pointer;">✕</button>
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
            <button class="btn-remove-extra-row" style="background:none; border:none; color:var(--danger); cursor:pointer;">✕</button>
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

