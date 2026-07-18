const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const excelPath = path.join(process.cwd(), 'excels', 'product.xlsx');
const workbook = XLSX.readFile(excelPath);
const sheetName = workbook.SheetNames[0];
const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: '' });

const missingSkus = ['KC1048', 'ck0140', 'KC90241', '8182', '8313', '8014'];

const keys = Object.keys(rows[0] || {});
const skuKey = keys.find(k => k.toLowerCase().includes('codigo')) || keys.find(k => k.toLowerCase().includes('sku'));

console.log('Columna:', skuKey);
console.log('Filas en Excel actual:', rows.length);
console.log('');

// Collect all SKU values from Excel
const excelSkus = rows.map(r => String(r[skuKey] || '').trim());

for (const target of missingSkus) {
  console.log(`Buscando "${target}":`);
  
  // Exact match
  const exact = excelSkus.find(s => s === target);
  if (exact) { console.log(`  EXACT: ${exact}`); continue; }
  
  // Case-insensitive
  const ci = excelSkus.find(s => s.toLowerCase() === target.toLowerCase());
  if (ci) { console.log(`  CASE-INSENSITIVE: ${ci}`); continue; }
  
  // Contains
  const contains = excelSkus.filter(s => s.includes(target) || target.includes(s));
  if (contains.length > 0) {
    contains.forEach(s => console.log(`  PARTIAL: "${s}"`));
    continue;
  }
  
  // Numeric match (strip all non-alphanumeric)
  const targetClean = target.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  const numericMatch = excelSkus.filter(s => {
    const clean = s.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    return clean === targetClean;
  });
  if (numericMatch.length > 0) {
    numericMatch.forEach(s => console.log(`  CLEANED: "${s}"`));
    continue;
  }
  
  // Levenshtein-like: check if any SKU starts with same prefix
  const prefixLen = Math.min(4, target.length);
  const prefix = target.substring(0, prefixLen).toLowerCase();
  const prefixMatches = excelSkus.filter(s => s.toLowerCase().startsWith(prefix));
  if (prefixMatches.length > 0) {
    prefixMatches.slice(0, 5).forEach(s => console.log(`  PREFIX "${prefix}": "${s}"`));
  } else {
    console.log(`  NO ENCONTRADO`);
  }
  console.log('');
}
