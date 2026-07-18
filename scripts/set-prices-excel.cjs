const XLSX = require('xlsx');
const path = require('path');

const excelPath = path.join(process.cwd(), 'excels', 'product.xlsx');
const wb = XLSX.readFile(excelPath);
const sheetName = wb.SheetNames[0];
const rows = XLSX.utils.sheet_to_json(wb.Sheets[sheetName], { defval: '' });

console.log(`Procesando ${rows.length} filas...`);

let count = 0;
for (const row of rows) {
  const unit = Number(row['Precio Unitario']) || 0;
  const paq = Number(row['precio por paquete']) || 0;
  const caja = Number(row['precio por caja']) || 0;

  // Precio Detalle (1-5 pcs) = Precio Unitario x 2
  const detalle = Math.round(unit * 2);

  // Precio Intermedio (6-11 pcs) = mayor + (detalle - mayor) * 0.6
  const intermedio = Math.round(paq + (detalle - paq) * 0.6);

  // Precio Mayor (12-23 pcs) = precio por paquete
  const mayor = paq;

  // Precio Caja (24+ pcs) = precio por caja
  const precioCaja = caja;

  row['Precio Detalle (1-5pcs)'] = detalle;
  row['Precio Intermedio (6-11pcs)'] = intermedio;
  row['Precio Mayor (12-23pcs)'] = mayor;
  row['Precio Caja (24+pcs)'] = precioCaja;

  count++;
}

console.log(`${count} filas procesadas.`);

// Show some examples
console.log('\nEjemplos:');
rows.slice(0, 5).forEach((r, i) => {
  console.log(`  ${r['Codigo']}: Detalle=${r['Precio Detalle (1-5pcs)']} | Intermedio=${r['Precio Intermedio (6-11pcs)']} | Mayor=${r['Precio Mayor (12-23pcs)']} | Caja=${r['Precio Caja (24+pcs)']}`);
});

const newWorksheet = XLSX.utils.json_to_sheet(rows);
const newWorkbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, sheetName);
XLSX.writeFile(newWorkbook, excelPath);
console.log(`\nExcel guardado: ${excelPath}`);
