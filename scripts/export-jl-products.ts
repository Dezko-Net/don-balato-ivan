import * as XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';

const APPWRITE_ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1';
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '6a0a4e8d0032177f3f90';
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '6a0a58ca001798410d86';
const PRODUCTS_COLLECTION = 'products';
const API_KEY = process.env.APPWRITE_API_KEY || '';

async function fetchAllProducts(): Promise<any[]> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Appwrite-Project': PROJECT_ID,
  };
  if (API_KEY) {
    headers['X-Appwrite-Key'] = API_KEY;
  }

  const allProducts: any[] = [];
  let offset = 0;
  const limit = 500;

  while (true) {
    const url = `${APPWRITE_ENDPOINT}/databases/${DATABASE_ID}/collections/${PRODUCTS_COLLECTION}/documents?queries[0]=${encodeURIComponent(JSON.stringify({ method: 'limit', values: [limit] }))}&queries[1]=${encodeURIComponent(JSON.stringify({ method: 'offset', values: [offset] }))}`;
    
    console.log(`Fetching products offset=${offset}...`);
    const res = await fetch(url, { headers });
    
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(`Appwrite error: ${(err as any).message || res.status}`);
    }
    
    const data = await res.json();
    allProducts.push(...data.documents);
    console.log(`  Got ${data.documents.length} products (total: ${allProducts.length})`);
    
    if (data.documents.length < limit) break;
    offset += limit;
  }

  return allProducts;
}

async function main() {
  console.log('=== Export JL Products ===\n');
  
  const all = await fetchAllProducts();
  console.log(`\nTotal products fetched: ${all.length}`);

  const jlProducts = all.filter((p: any) => {
    const sku = String(p.sku || p.SKU || '').trim();
    return sku.toUpperCase().startsWith('JL');
  });

  console.log(`Products with SKU starting "JL": ${jlProducts.length}\n`);

  if (jlProducts.length === 0) {
    console.log('No JL products found. Exiting.');
    return;
  }

  const rows = jlProducts.map((p: any) => ({
    'ID': p.$id,
    'SKU': p.sku || p.SKU || '',
    'Barcode': p.barcode || '',
    'Nombre': p.NAME || '',
    'Descripcion': p.DESCRIPTION || '',
    'Precio': p.PRICE || 0,
    'Precio Actual': p.CURRENTPRICE || '',
    'Costo': p.COST || '',
    'Precio Mayorista': p.WHOLESALEPRICE || '',
    'Qty Min Mayorista': p.WHOLESALEMINQUANTITY || '',
    'Stock': p.STOCK || 0,
    'Imagen 1': p.IMAGEURL || '',
    'Imagen 2': p.IMAGEURL2 || '',
    'Imagen 3': p.IMAGEURL3 || '',
    'Imagen 4': p.IMAGEURL4 || '',
    'Imagen 5': p.IMAGEURL5 || '',
    'Categoria ID': p.CATEGORYID || '',
    'Subcategoria ID': p.SUBCATEGORYID || '',
    'Activo': p.ISACTIVE ? 'Si' : 'No',
    'Vendidos': p.SOLDQUANTITY || 0,
    'Pack Qty': p.PACKQTY || '',
    'Pack Stock': p.PACK_STOCK || '',
    'Tags': Array.isArray(p.TAGS) ? p.TAGS.join(', ') : '',
    'Features': Array.isArray(p.FEATURES) ? p.FEATURES.join(', ') : '',
    'Fecha Creacion': p.$createdAt || '',
    'Fecha Actualizacion': p.$updatedAt || '',
  }));

  const ws = XLSX.utils.json_to_sheet(rows);
  
  ws['!cols'] = [
    { wch: 20 }, // ID
    { wch: 15 }, // SKU
    { wch: 15 }, // Barcode
    { wch: 40 }, // Nombre
    { wch: 50 }, // Descripcion
    { wch: 10 }, // Precio
    { wch: 12 }, // Precio Actual
    { wch: 10 }, // Costo
    { wch: 12 }, // Precio Mayorista
    { wch: 15 }, // Qty Min Mayorista
    { wch: 8 },  // Stock
    { wch: 60 }, // Imagen 1
    { wch: 60 }, // Imagen 2
    { wch: 60 }, // Imagen 3
    { wch: 60 }, // Imagen 4
    { wch: 60 }, // Imagen 5
    { wch: 20 }, // Categoria ID
    { wch: 20 }, // Subcategoria ID
    { wch: 8 },  // Activo
    { wch: 10 }, // Vendidos
    { wch: 10 }, // Pack Qty
    { wch: 10 }, // Pack Stock
    { wch: 20 }, // Tags
    { wch: 30 }, // Features
    { wch: 25 }, // Fecha Creacion
    { wch: 25 }, // Fecha Actualizacion
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Productos JL');

  const outputPath = path.join(process.cwd(), 'DOCUMENTOS', 'productos_jl.xlsx');
  XLSX.writeFile(wb, outputPath);
  console.log(`\nExcel guardado en: ${outputPath}`);
  console.log(`Total productos JL exportados: ${rows.length}`);
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
