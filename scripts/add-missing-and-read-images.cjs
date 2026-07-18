const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const excelPath = path.join(process.cwd(), 'excels', 'product.xlsx');
const workbook = XLSX.readFile(excelPath);
const sheetName = workbook.SheetNames[0];
const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: '' });

const keys = Object.keys(rows[0] || {});
console.log('Columnas:', keys.join(', '));
console.log('Filas actuales:', rows.length);

// The 6 missing products
const missing = [
  { Codigo: 'KC1048', 'Producto nombre 2': 'Toallitas Desmaquillantes', 'Precio Unitario': 948, stock: 96 },
  { Codigo: 'ck0140', 'Producto nombre 2': 'Delineadores de Ojos', 'Precio Unitario': 1440, stock: 96 },
  { Codigo: 'KC90241', 'Producto nombre 2': 'MASCARA DE PESTAÑAS + DELINEADOR DE OJOS 2 EN 1', 'Precio Unitario': 1620, stock: 96 },
  { Codigo: '8182', 'Producto nombre 2': 'ILUMINADOR', 'Precio Unitario': 1700, stock: 96 },
  { Codigo: '8313', 'Producto nombre 2': 'PALETA DE SOMBRAS DE 10 COLORES ALYSSA', 'Precio Unitario': 2800, stock: 96 },
  { Codigo: '8014', 'Producto nombre 2': 'DELINEADOR DOBLE DE OJO', 'Precio Unitario': 1100, stock: 96 },
];

// Build new rows matching existing column structure
for (const m of missing) {
  const newRow = {};
  for (const k of keys) {
    if (k === 'Codigo') newRow[k] = m.Codigo;
    else if (k === 'Producto nombre 2') newRow[k] = m['Producto nombre 2'];
    else if (k === 'Precio Unitario') newRow[k] = m['Precio Unitario'];
    else newRow[k] = '';
  }
  rows.push(newRow);
}

console.log('Filas despues de agregar:', rows.length);

const newWorksheet = XLSX.utils.json_to_sheet(rows);
const newWorkbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, sheetName);
XLSX.writeFile(newWorkbook, excelPath);
console.log('Excel actualizado con 6 productos faltantes.');

// Now read imagenes.xlsx
console.log('\n--- imagenes.xlsx ---');
const imgPath = path.join(process.cwd(), 'excels', 'imagenes.xlsx');
const imgWb = XLSX.readFile(imgPath);
const imgSheet = imgWb.SheetNames[0];
const imgRows = XLSX.utils.sheet_to_json(imgWb.Sheets[imgSheet], { defval: '' });
console.log('Filas:', imgRows.length);
console.log('Columnas:', Object.keys(imgRows[0] || {}).join(', '));
console.log('Primeras 3 filas:');
imgRows.slice(0, 3).forEach((r, i) => console.log(`  ${i}:`, JSON.stringify(r)));
