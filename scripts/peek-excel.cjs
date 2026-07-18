const XLSX = require('xlsx');
const path = require('path');

const excelPath = path.join(process.cwd(), 'excels', 'product.xlsx');
const wb = XLSX.readFile(excelPath);
const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { defval: '' });

console.log('Columnas:', Object.keys(rows[0]).join(' | '));
console.log('\nPrimeras 10 filas completas:\n');
rows.slice(0, 10).forEach((r, i) => {
  console.log(`${i}: Codigo=${r['Codigo']} | Unit=${r['Precio Unitario']} | cant/paquete=${r['cantidad por paquete']} | paquete=${r['precio por paquete']} | caja=${r['precio por caja']}`);
});

const cants = [...new Set(rows.map(r => r['cantidad por paquete']))];
console.log('\nValores unicos de "cantidad por paquete":', cants.join(', '));
