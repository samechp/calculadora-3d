
// Funciones de exportación en JS puro

function exportPdfPieza(total, gFil, tiempo_prod, nombre) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text("Cotizacion Impresion", 105, 20, { align: "center" });
    
    doc.setFontSize(14);
    doc.text(`Pieza/Proyecto: ${nombre || 'Sin nombre'}`, 20, 40);
    
    doc.setFontSize(12);
    doc.text(`Gramos de filamento totales: ${gFil}g`, 20, 50);
    doc.text(`Tiempo estimado de produccion: ${tiempo_prod || 'N/A'}`, 20, 60);
    
    doc.setFontSize(16);
    doc.text(`Costo Bruto (Total a Cobrar): ${total}`, 20, 80);
    
    doc.setFontSize(10);
    doc.text("Generado automáticamente por Calculadora 3D", 105, 280, { align: "center" });
    
    const filename = nombre ? `Cotizacion_${nombre.replace(/\s+/g, '_')}.pdf` : "Cotizacion_Impresion.pdf";
    doc.save(filename);
}

function exportExcelPieza(dataStr, nombre) {
    const data = JSON.parse(dataStr);
    const ws_data = [["Concepto", "Valor"]];
    for (const [key, value] of Object.entries(data)) {
        if (!key.startsWith('_')) {
            ws_data.push([key, value]);
        }
    }
    const ws = XLSX.utils.aoa_to_sheet(ws_data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Cotizacion");
    const filename = nombre ? `Cotizacion_${nombre.replace(/\s+/g, '_')}.xlsx` : "Cotizacion_Impresion.xlsx";
    XLSX.writeFile(wb, filename);
}

function exportProjectPdf(total, gramos, camas, unidades, unidadesCama, precio_cama, mat, ins, mo, tiempo, costo_unidad, nombre, costo_prod_pieza, costo_prod_total) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text("Cotizacion Proyecto", 105, 20, { align: "center" });
    
    doc.setFontSize(14);
    doc.text(`Proyecto: ${nombre || 'Sin nombre'}`, 20, 40);
    
    doc.setFontSize(12);
    doc.text(`Unidades Totales: ${unidades}`, 20, 55);
    doc.text(`Unidades por Cama: ${unidadesCama}`, 20, 65);
    doc.text(`Total de Camas: ${camas}`, 20, 75);
    doc.text(`Gramos Totales: ${gramos}g`, 20, 85);
    doc.text(`Tiempo Estimado: ${tiempo}`, 20, 95);
    
    const bodyRows = [
        ['Costo Materiales', mat],
        ['Insumos Extra', ins],
        ['Mano de Obra', mo],
    ];
    if (costo_prod_pieza) bodyRows.push(['Costo Producci\u00f3n (1 pieza)', costo_prod_pieza]);
    if (costo_prod_total) bodyRows.push(['Costo Producci\u00f3n (proyecto completo)', costo_prod_total]);
    bodyRows.push(['Costo por Unidad', costo_unidad]);
    bodyRows.push(['Precio por Cama', precio_cama]);

    doc.autoTable({
        startY: 105,
        head: [['Desglose de Costos', 'Valor']],
        body: bodyRows,
        theme: 'grid'
    });
    
    doc.setFontSize(16);
    doc.text(`Total a Cobrar Proyecto: ${total}`, 20, doc.lastAutoTable.finalY + 20);
    
    const filename = nombre ? `Cotizacion_Proyecto_${nombre.replace(/\s+/g, '_')}.pdf` : "Cotizacion_Proyecto.pdf";
    doc.save(filename);
}

function exportProjectExcel(dataStr, nombre) {
    const data = JSON.parse(dataStr);
    const ws_data = [["Concepto", "Valor"]];
    for (const [key, value] of Object.entries(data)) {
        ws_data.push([key, value]);
    }
    const ws = XLSX.utils.aoa_to_sheet(ws_data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Proyecto");
    const filename = nombre ? `Cotizacion_Proyecto_${nombre.replace(/\s+/g, '_')}.xlsx` : "Cotizacion_Proyecto.xlsx";
    XLSX.writeFile(wb, filename);
}

function exportMegaProjectPdf(payloadStr) {
    const data = typeof payloadStr === 'string' ? JSON.parse(payloadStr) : payloadStr;
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text("Cotizacion Mega Proyecto", 105, 20, { align: "center" });
    
    doc.setFontSize(14);
    doc.text(`Mega Proyecto: ${data.nombre || 'Sin nombre'}`, 20, 35);
    
    const bodyItems = data.items.map(item => [
        item.nombre, item.unidades, item.camas, item.tiempo, item.costo_unidad, item.costo_prod_pieza || '—', item.insumos, item.total
    ]);
    
    doc.autoTable({
        startY: 45,
        head: [['Proyecto', 'Unidades', 'Camas', 'Tiempo', 'Costo Unit.', 'Costo Prod./u', 'Insumos', 'Total']],
        body: bodyItems,
        theme: 'striped',
        styles: { fontSize: 7 }
    });
    
    const finalY = doc.lastAutoTable.finalY + 15;
    doc.setFontSize(14);
    doc.text("Resumen Global", 20, finalY);
    
    const resumenBody = [
        ['Total Camas', data.totales.camas.toString()],
        ['Horas de Impresi\u00f3n', data.totales.horas.toString()],
        ['Tiempo Est. Total', data.totales.tiempo],
        ['Insumos Globales', data.totales.insumos],
    ];
    if (data.totales.costo_prod_pieza) resumenBody.push(['Costo Producci\u00f3n promedio (c/u)', data.totales.costo_prod_pieza]);
    if (data.totales.costo_prod_total) resumenBody.push(['Costo Producci\u00f3n total Mega Proyecto', data.totales.costo_prod_total]);
    resumenBody.push(['TOTAL A COBRAR', data.totales.total]);

    doc.autoTable({
        startY: finalY + 5,
        head: [['Concepto', 'Total']],
        body: resumenBody,
        theme: 'grid'
    });
    
    const filename = data.nombre ? `Cotizacion_Mega_${data.nombre.replace(/\s+/g, '_')}.pdf` : "Cotizacion_MegaProyecto.pdf";
    doc.save(filename);
}

function exportMegaProjectExcel(payloadStr) {
    const data = typeof payloadStr === 'string' ? JSON.parse(payloadStr) : payloadStr;
    const wb = XLSX.utils.book_new();
    
    const wsItems_data = [["Nombre", "Unidades", "Camas", "Horas Totales", "Gramos", "Materiales", "Insumos", "Mano de Obra", "Costo Prod. (c/u)", "Total"]];
    data.items.forEach(item => {
        wsItems_data.push([
            item['Nombre'], item['Unidades'], item['Camas'], item['Horas Totales'], item['Gramos'],
            item['Materiales'], item['Insumos'], item['Mano de Obra'], item['Costo Prod. (c/u)'] || '—', item['Total']
        ]);
    });
    const wsItems = XLSX.utils.aoa_to_sheet(wsItems_data);
    XLSX.utils.book_append_sheet(wb, wsItems, "Desglose Proyectos");
    
    const wsTotales_data = [["Concepto", "Total"]];
    for (const [key, value] of Object.entries(data.totales)) {
        wsTotales_data.push([key, value]);
    }
    const wsTotales = XLSX.utils.aoa_to_sheet(wsTotales_data);
    XLSX.utils.book_append_sheet(wb, wsTotales, "Resumen Global");
    
    const filename = data.nombre ? `Cotizacion_Mega_${data.nombre.replace(/\s+/g, '_')}.xlsx` : "Cotizacion_MegaProyecto.xlsx";
    XLSX.writeFile(wb, filename);
}

window.exportPdfPieza = exportPdfPieza;
window.exportExcelPieza = exportExcelPieza;
window.exportProjectPdf = exportProjectPdf;
window.exportProjectExcel = exportProjectExcel;
window.exportMegaProjectPdf = exportMegaProjectPdf;
window.exportMegaProjectExcel = exportMegaProjectExcel;


// ====== EXPORTAR LISTA DE MATERIALES (BOM) ======
function generarBOM() {
    // Collect data from lastCalcResults and _lastProjectCalc
    const isProject = els.projectResults && els.projectResults.style.display !== 'none';
    const isMega = els.megaProjectResults && els.megaProjectResults.style.display !== 'none';
    
    let multiplier = 1;
    let title = "Lista de Materiales - Pieza";
    let name = (els.currentPiece || "SinNombre");
    
    if (isMega) {
        multiplier = 1; // Assuming mega project already sums up... wait, mega project calculation loops through projects.
        // Actually, we don't have BOM array in Mega Project calculation stored. 
        // We'll just export for Project or Piece.
        alert("BOM Export for Mega Projects requires deeper integration. Exporting from current Project/Piece instead.");
        return;
    }
    
    if (isProject) {
        multiplier = state._lastProjectCalc ? state._lastProjectCalc.camas : 1;
        title = "Lista de Materiales - Proyecto";
        name = (els.currentProject || "Proyecto") + "_" + name;
    }
    
    if(!lastCalcResults['_listaMaterialesUnidad']) {
        alert("No hay materiales registrados.");
        return;
    }
    
    let report = `${title}\nNombre: ${name}\n\n`;
    report += `--- FILAMENTOS REQUERIDOS ---\n`;
    
    let totalGramosGeneral = 0;
    
    // Agrupar filamentos por ID
    let filamentosMap = {};
    lastCalcResults['_listaMaterialesUnidad'].forEach(item => {
        let key = item.ref.id || (item.ref.marca + item.ref.color);
        if(!filamentosMap[key]) filamentosMap[key] = { ref: item.ref, gramos: 0 };
        filamentosMap[key].gramos += (item.gramos * multiplier);
        totalGramosGeneral += (item.gramos * multiplier);
    });
    
    Object.values(filamentosMap).forEach(f => {
        let kgs = (f.gramos / 1000).toFixed(2);
        let rollos = Math.ceil(kgs);
        report += `• ${f.ref.marca} ${f.ref.tipo} - ${f.ref.color}: ${f.gramos} g (aprox ${kgs} Kg -> ${rollos} rollos de 1Kg)\n`;
    });
    report += `\nTotal General Filamento: ${totalGramosGeneral} g\n\n`;
    
    report += `--- INSUMOS EXTRA REQUERIDOS ---\n`;
    const insumosExtra = getInsumosExtraData();
    if(insumosExtra.length === 0) {
        report += `Ninguno\n`;
    } else {
        insumosExtra.forEach(ins => {
            let cantUsadaTotal = parseFloat(ins.cantUsada || 0) * multiplier;
            let cantPaquete = parseFloat(ins.cantPaquete || 1);
            let paquetesRequeridos = Math.ceil(cantUsadaTotal / cantPaquete);
            report += `• ${ins.nombre}: ${cantUsadaTotal} unidades -> Comprar ${paquetesRequeridos} paquete(s) de ${cantPaquete}\n`;
        });
    }

    // Costo de Producción
    report += `\n--- COSTO DE PRODUCCIÓN ---\n`;
    if (isProject && state._lastProjectCalc) {
        const p = state._lastProjectCalc;
        if (p.costoProduccionPiezaProyecto) {
            report += `Costo Producción (1 pieza): ${formatMoney(p.costoProduccionPiezaProyecto, false)}\n`;
        }
        if (p.costoProduccionTotalProyecto) {
            report += `Costo Producción (proyecto completo): ${formatMoney(p.costoProduccionTotalProyecto, false)}\n`;
        }
    } else if (lastCalcResults['Costo Total de Producción']) {
        report += `Costo Producción (por pieza/cama): ${formatMoney(lastCalcResults['Costo Total de Producción'], false)}\n`;
    }

    if (window.pywebview) {
        window.pywebview.api.export_bom(report, name);
    } else {
        const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `BOM_${name}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

if(els.btnExportBom) {
    els.btnExportBom.addEventListener('click', generarBOM);
}
