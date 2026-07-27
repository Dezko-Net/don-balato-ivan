const fs = require('fs');
const path = require('path');
const { Client, Databases, ID, Query } = require('node-appwrite');

const ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1';
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || 'donbalatoivan';
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '6a62e7440033d2278d28';
const API_KEY = process.env.APPWRITE_API_KEY || 'standard_36d66a586c5975803e1bb17c5bcd8bb4146a1ee594b31be56fd22a537043adf5cbae612072df4f25873e3d388c4f6dc494beb6a8a56fbfd0c5d878552a622a35762e78dae181636818840ba3eeb07227efbc0b2a1d08893e740e7f56941b427b81f6c675fdd90ca5fe896cd46aeb7e5027736fe5fb40c480ea2f8363ca89740a';

const rawText = `
Hervidor de huevos
Hervidor de huevos
SKU: 310 · $2.500
NUEVO
Editar
🗑️
Pantufla con chiporro x 12
Pantufla con chiporro x 12
SKU: 309 · $9.630
NUEVO
Editar
🗑️
Audifono m10
Audifono m10
SKU: 308 · $2.000
NUEVO
Editar
🗑️
Alexa parlante
Alexa parlante
SKU: 307 · $4.500
NUEVO
Editar
🗑️
Alexa parlante diseño
Alexa parlante diseño
SKU: 306 · $4.500
NUEVO
Editar
🗑️
Calefactor aire acondicionado
Calefactor aire acondicionado
SKU: 305 · $9.000
NUEVO
Editar
🗑️
Hervidor de 2 litros
Hervidor de 2 litros
SKU: 304 · $3.500
NUEVO
Editar
🗑️
Cinta para embalar 300 metros
Cinta para embalar 300 metros
SKU: Sku303 · $2.000
NUEVO
Editar
🗑️
Cotonitos 300 unidades
Cotonitos 300 unidades
SKU: Sku 302 · $500
NUEVO
Editar
🗑️
Audifono i12
Audifono i12
SKU: Sku301 · $2.000
NUEVO
Editar
🗑️
Auto con control remoto
Auto con control remoto
SKU: Sku300 · $2.500
NUEVO
Editar
🗑️
Pistola burbuja kawaii niño y niña
Pistola burbuja kawaii niño y niña
SKU: 299 · $1.500
NUEVO
Editar
🗑️
Parrilla + sarten electrica
Parrilla + sarten electrica
SKU: 298 · $12.990
NUEVO
Editar
🗑️
Sarten electrica 1500W
Sarten electrica 1500W
SKU: 297 · $11.990
NUEVO
Editar
🗑️
Hervidor electrico 2 litrosb
Hervidor electrico 2 litrosb
SKU: 296 · $5.000
NUEVO
Editar
🗑️
Batidora Electrica
Batidora Electrica
SKU: 295 · $3.500
NUEVO
Editar
🗑️
Reloj smart T500
Reloj smart T500
SKU: 294 · $3.000
NUEVO
Editar
🗑️
Sellador de bolsa al vacio
Sellador de bolsa al vacio
SKU: 293 · $3.990
NUEVO
Editar
🗑️
Pesa gramera
Pesa gramera
SKU: 292 · $2.000
NUEVO
Editar
🗑️
Linterna solar
Linterna solar
SKU: 291 · $3.333
NUEVO
EDITADO
Editar
🗑️
Linterna solar
Linterna solar
SKU: 290 · $2.500
NUEVO
EDITADO
Editar
🗑️
Linterna solar de emergencia
Linterna solar de emergencia
SKU: 289 · $2.500
NUEVO
EDITADO
Editar
🗑️
Mini linterna 3 en 1
Mini linterna 3 en 1
SKU: 287 · $990
NUEVO
EDITADO
Editar
🗑️
Radio solar con linterna
Radio solar con linterna
SKU: 286 · $5.500
NUEVO
Editar
🗑️
Radio solar con linterna
Radio solar con linterna
SKU: 285 · $6.500
NUEVO
Editar
🗑️
Toallas humedas 8 packs
Toallas humedas 8 packs
SKU: 283 · $550
NUEVO
Editar
🗑️
Paragua de bolsillo impermeable
Paragua de bolsillo impermeable
SKU: 282 · $1.000
NUEVO
Editar
🗑️
Lampara emergencia 100w 72cm
Lampara emergencia 100w 72cm
SKU: 280 · $2.500
NUEVO
Editar
🗑️
Linterna solar con power bank cod 280
Linterna solar con power bank cod 280
SKU: 275 · $3.333
NUEVO
EDITADO
Editar
🗑️
Linterna solar power bank cod 284
Linterna solar power bank cod 284
SKU: 274 · $3.333
NUEVO
Editar
🗑️
linterna solar con power bank  cod 281
linterna solar con power bank cod 281
SKU: 273 · $3.333
NUEVO
Editar
🗑️
Pastilla limpiadora de lavadora 12pcs
Pastilla limpiadora de lavadora 12pcs
SKU: 271 · $500
NUEVO
Editar
🗑️
Papel higenico panda 48 unidades
Papel higenico panda 48 unidades
SKU: 270 · $7.900
NUEVO
Editar
🗑️
Arena de gato 8 kilos
Arena de gato 8 kilos
SKU: 269 · $4.000
NUEVO
Editar
🗑️
Picadora electrica de metal
Picadora electrica de metal
SKU: 264 · $6.000
NUEVO
Editar
🗑️
PARLANTE ZQS1202
PARLANTE ZQS1202
SKU: 106 · $1.800
NUEVO
Editar
🗑️
PARLANTE G CON CARGADOR INALÁMBRICO
PARLANTE G CON CARGADOR INALÁMBRICO
SKU: 107 · $4.000
NUEVO
Editar
🗑️
PARLANTE SOPORTE LED MAGNÉTICO
PARLANTE SOPORTE LED MAGNÉTICO
SKU: 110 · $1.800
NUEVO
EDITADO
Editar
🗑️
AUDÍFONOS INALÁMBRICOS I12
AUDÍFONOS INALÁMBRICOS I12
SKU: 113 · $2.000
NUEVO
EDITADO
Editar
🗑️
OXIMETRO
OXIMETRO
SKU: 115 · $1.000
NUEVO
Editar
🗑️
LINTERNA LAVERO
LINTERNA LAVERO
SKU: 116 · $990
NUEVO
EDITADO
Editar
🗑️
MINO DONUTS 3 PCs
MINO DONUTS 3 PCs
SKU: 123 · $4.000
NUEVO
Editar
🗑️
MINI WAFLERA
MINI WAFLERA
SKU: 124 · $4.000
NUEVO
Editar
🗑️
GORRO BEBÉ
GORRO BEBÉ
SKU: 137 · $500
NUEVO
EDITADO
Editar
🗑️
Suaviazante 1 litro
Suaviazante 1 litro
SKU: 146 · $1.000
NUEVO
Editar
🗑️
Limpiador en crema 750gr
Limpiador en crema 750gr
SKU: 147 · $1.000
NUEVO
Editar
🗑️
Jabon dove recarga 450ml
Jabon dove recarga 450ml
SKU: 148 · $1.260
NUEVO
Editar
🗑️
Servilleta 300 unidades manga de 10
Servilleta 300 unidades manga de 10
SKU: 151 · $7.000
NUEVO
EDITADO
Editar
🗑️
Toalla de cocina doble hoja
Toalla de cocina doble hoja
SKU: 152 · $1.660
NUEVO
EDITADO
Editar
🗑️
CALENTAST DE OREJAS MULTICOLOR
CALENTAST DE OREJAS MULTICOLOR
SKU: 154 · $1.000
NUEVO
EDITADO
Editar
🗑️
CEPILLO ALISADOR 2 EN 1
CEPILLO ALISADOR 2 EN 1
SKU: 157 · $4.000
NUEVO
EDITADO
Editar
🗑️
Parlante + microfono
Parlante + microfono
SKU: 171 · $3.500
NUEVO
Editar
🗑️
Parlante con microfono
Parlante con microfono
SKU: 172 · $4.000
NUEVO
Editar
🗑️
Lampara de emergencia 40w
Lampara de emergencia 40w
SKU: 174 · $1.500
NUEVO
EDITADO
Editar
🗑️
Lampara de emergencia 60w
Lampara de emergencia 60w
SKU: 181 · $2.000
NUEVO
Editar
🗑️
Ampolleta 3 aspa led 45w
Ampolleta 3 aspa led 45w
SKU: 187 · $1.500
NUEVO
Editar
🗑️
Tensiometro
Tensiometro
SKU: 188 · $3.000
NUEVO
Editar
🗑️
MAQUINA DE CORTE T9
MAQUINA DE CORTE T9
SKU: 189 · $1.000
NUEVO
EDITADO
Editar
🗑️
CUCHILLO COLORES
CUCHILLO COLORES
SKU: 190 · $160
NUEVO
EDITADO
Editar
🗑️
Dispensador de agua usb
Dispensador de agua usb
SKU: 191 · $1.500
NUEVO
Editar
🗑️
CARRO DE FERIA GRANDE
CARRO DE FERIA GRANDE
SKU: 195 · $7.500
NUEVO
Editar
🗑️
Maquina de cera
Maquina de cera
SKU: 199 · $3.000
NUEVO
Editar
🗑️
PICADORA ELÉCTRICA METAL
PICADORA ELÉCTRICA METAL
SKU: 203 · $6.000
NUEVO
Editar
🗑️
CINTURON AMERICANO x12
CINTURON AMERICANO x12
SKU: 204 · $9.000
NUEVO
Editar
🗑️
Difusores de ambiente
Difusores de ambiente
SKU: 205 · $500
NUEVO
Editar
🗑️
Set de 4 Difusores
Set de 4 Difusores
SKU: 206 · $2.000
NUEVO
Editar
🗑️
AROMATIZANTE SURTIDO AUTO
AROMATIZANTE SURTIDO AUTO
SKU: 208 · $500
NUEVO
Editar
🗑️
Calceta tobilleras Pack 12 unidades
Calceta tobilleras Pack 12 unidades
SKU: 209 · $1.250
NUEVO
Editar
🗑️
BARRA DE SONIDO
BARRA DE SONIDO
SKU: 210 · $3.700
NUEVO
Editar
🗑️
ESPEJO LED
ESPEJO LED
SKU: 211 · $2.500
NUEVO
Editar
🗑️
ALARGADOR 3M 4 TOMAS
ALARGADOR 3M 4 TOMAS
SKU: 214 · $1.800
NUEVO
Editar
🗑️
Soporte rack tv 14-55"
Soporte rack tv 14-55"
SKU: 215 · $3.600
NUEVO
Editar
🗑️
ALARGADOR 5M 4 TOMAS
ALARGADOR 5M 4 TOMAS
SKU: 217 · $2.250
NUEVO
Editar
🗑️
INFLADOR DE GLOBOS
INFLADOR DE GLOBOS
SKU: 218 · $6.000
NUEVO
Editar
🗑️
Escurridor de plato
Escurridor de plato
SKU: 223 · $3.500
NUEVO
Editar
🗑️
Perfilador facial 2 en 1
Perfilador facial 2 en 1
SKU: 227 · $1.800
NUEVO
EDITADO
Editar
🗑️
ULTRAPODS  XF-06
ULTRAPODS XF-06
SKU: 255 · $2.000
NUEVO
Editar
🗑️
Toallas humedas 80pcs 3b por caja de 24 unidades
Toallas humedas 80pcs 3b por caja de 24 unidades
SKU: 258 · $500
NUEVO
Editar
🗑️
Traperos humedos 12pcs lavanda y lilom
Traperos humedos 12pcs lavanda y lilom
SKU: 259 · $750
NUEVO
EDITADO
Editar
🗑️
Kit de limpieza
Kit de limpieza
SKU: 260 · $2.500
NUEVO
Editar
🗑️
Tendedero 3 niveles 50k
Tendedero 3 niveles 50k
SKU: 261 · $7.990
NUEVO
Editar
🗑️
ORGANIZADOR DE LAVADORA
ORGANIZADOR DE LAVADORA
SKU: 262 · $7.990
NUEVO
Editar
🗑️
ORGANIZADOR DE BAÑO
ORGANIZADOR DE BAÑO
SKU: 263 · $7.990
NUEVO
Editar
🗑️
CALENTADOR DE MANOS
CALENTADOR DE MANOS
SKU: Sku 119 · $500
NUEVO
EDITADO
Editar
🗑️
CEPILLO VAPOR MASCOTA
CEPILLO VAPOR MASCOTA
SKU: Sku 120 · $850
NUEVO
EDITADO
Editar
🗑️
Picadora electrica
Picadora electrica
SKU: Sku11 · $5.500
NUEVO
Editar
🗑️
Escurridor de metal
Escurridor de metal
SKU: Sku131 · $6.000
NUEVO
EDITADO
Editar
🗑️
Maquina de palomita de maiz
Maquina de palomita de maiz
SKU: Sku133 · $6.800
NUEVO
Editar
🗑️
Set especiero 7pcs
Set especiero 7pcs
SKU: Sku135 · $7.500
NUEVO
Editar
🗑️
Jabon liquido 750ml
Jabon liquido 750ml
SKU: Sku138 · $790
NUEVO
EDITADO
Editar
🗑️
Limpiador de parabrisa magico
Limpiador de parabrisa magico
SKU: Sku139 · $990
NUEVO
EDITADO
Editar
🗑️
Licuadora + picadora 2 en 1
Licuadora + picadora 2 en 1
SKU: Sku140 · $10.000
NUEVO
EDITADO
Editar
🗑️
Ducha electrica
Ducha electrica
SKU: Sku142 · $16.000
NUEVO
Editar
🗑️
Aspiradora
Aspiradora
SKU: Sku144 · $2.000
NUEVO
EDITADO
Editar
🗑️
Set termo + taza
Set termo + taza
SKU: Sku16 · $2.500
NUEVO
EDITADO
Editar
🗑️
Vaso mug 1200ml porta celular
Vaso mug 1200ml porta celular
SKU: Sku19 · $4.000
NUEVO
EDITADO
Editar
🗑️
Freidora de aire 6L
Freidora de aire 6L
SKU: Sku40 · $16.500
NUEVO
EDITADO
Editar
🗑️
Set termo + vaso mate 1600ML
Set termo + vaso mate 1600ML
SKU: Sku42 · $8.500
NUEVO
EDITADO
Editar
🗑️
Alfombra trebol 40x60
Alfombra trebol 40x60
SKU: Sku45 · $850
NUEVO
EDITADO
Editar
🗑️
Alfombra 40x60
Alfombra 40x60
SKU: Sku46 · $500
NUEVO
EDITADO
Editar
🗑️
Set de cocina 2pcs alfombra
Set de cocina 2pcs alfombra
SKU: Sku47 · $1.500
NUEVO
EDITADO
Editar
🗑️
Faja reloj de arena mk
Faja reloj de arena mk
SKU: Sku57 · $6.500
NUEVO
EDITADO
Editar
🗑️
Faja MK
Faja MK
SKU: Sku58 · $6.500
NUEVO
EDITADO
Editar
🗑️
Corrector de postura
Corrector de postura
SKU: Sku59 · $1.000
NUEVO
EDITADO
Editar
🗑️
Toalla secado rapido
Toalla secado rapido
SKU: Sku61 · $2.000
NUEVO
EDITADO
Editar
🗑️
Toalla secado rapido niña
Toalla secado rapido niña
SKU: Sku62 · $1.800
NUEVO
EDITADO
Editar
🗑️
Detergente impeke 1.5 x 6
Detergente impeke 1.5 x 6
SKU: Sku64 · $5.340
NUEVO
Editar
🗑️
Esponja removedor 3pcs
Esponja removedor 3pcs
SKU: Sku67 · $850
NUEVO
EDITADO
Editar
🗑️
Set esponja acero inoxidable 4pcs
Set esponja acero inoxidable 4pcs
SKU: Sku69 · $350
NUEVO
EDITADO
Editar
🗑️
Paño multiuso pack 12 unidades
Paño multiuso pack 12 unidades
SKU: Sku70 · $850
NUEVO
EDITADO
Editar
🗑️
Set paño cocina microfibra 3pcs
Set paño cocina microfibra 3pcs
SKU: Sku71 · $850
NUEVO
EDITADO
Editar
🗑️
CEPILLO + JUGUETE
CEPILLO + JUGUETE
SKU: Sku72 · $500
NUEVO
EDITADO
Editar
🗑️
Guantes silicona
Guantes silicona
SKU: Sku76 · $1.690
NUEVO
EDITADO
Editar
🗑️
Set de cuchillo 6pcs
Set de cuchillo 6pcs
SKU: Sku77 · $1.000
NUEVO
EDITADO
Editar
🗑️
Set de utensilio 12pcs (Grande)
Set de utensilio 12pcs (Grande)
SKU: Sku78 · $4.500
NUEVO
EDITADO
Editar
🗑️
Especiero giratorio 12pcs
Especiero giratorio 12pcs
SKU: Sku79 · $8.000
NUEVO
Editar
🗑️
Especiero giratorio 18pcs
Especiero giratorio 18pcs
SKU: Sku80 · $8.500
NUEVO
Editar
🗑️
Especiero giratorio 12pcs
Especiero giratorio 12pcs
SKU: Sku81 · $7.500
NUEVO
Editar
🗑️
Set de cocina 19pcs
Set de cocina 19pcs
SKU: Sku82 · $9.000
NUEVO
EDITADO
Editar
🗑️
Parlante grande cn bluetooth
Parlante grande cn bluetooth
SKU: Sku83 · $9.000
NUEVO
Editar
🗑️
Parlante led oferta
Parlante led oferta
SKU: Sku84 · $2.000
NUEVO
EDITADO
Editar
🗑️
Colgador zapatero
Colgador zapatero
SKU: Sku87 · $5.500
NUEVO
Editar
🗑️
Esquinero de baño
Esquinero de baño
SKU: Sku88 · $5.000
NUEVO
EDITADO
Editar
🗑️
Baño sanitario mascota
Baño sanitario mascota
SKU: Sku89 · $4.000
NUEVO
Editar
🗑️
Removedor de callo recargable
Removedor de callo recargable
SKU: Sku90 · $2.000
NUEVO
EDITADO
Editar
🗑️
Tiral led neon 5 metros
Tiral led neon 5 metros
SKU: Sku91 · $3.000
NUEVO
EDITADO
Editar
🗑️
Audifono ultra pods
Audifono ultra pods
SKU: Sku92 · $2.000
NUEVO
EDITADO
Editar
🗑️
Audifono con pantalla
Audifono con pantalla
SKU: Sku96 · $4.500
NUEVO
Editar
🗑️
Cepillo magico 5 en 1
Cepillo magico 5 en 1
SKU: Sku97 · $2.000
NUEVO
EDITADO
Editar
🗑️
Cartuchera 3d kawaii
Cartuchera 3d kawaii
SKU: Sku98 · $500
NUEVO
EDITADO
Editar
🗑️
CHISPERO  ELÉCTRICO
CHISPERO ELÉCTRICO
SKU: 213 · $1.000
Editar
🗑️
Espejo retrovisor con camara full jd
Espejo retrovisor con camara full jd
SKU: 198 · $8.500
Editar
🗑️
Parlante con induccion
Parlante con induccion
SKU: Sku94 · $4.500
EDITADO
Editar
🗑️
`;

// Parse items from raw text
const parsedItems = [];
const lines = rawText.split('\n');

for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  if (line.startsWith('SKU:')) {
    // Format: SKU: 310 · $2.500
    const parts = line.split('·');
    const sku = parts[0].replace('SKU:', '').trim();
    const priceStr = parts[1] ? parts[1].replace(/[^0-9]/g, '') : '0';
    const price = parseInt(priceStr, 10) || 0;

    // The product name is typically 1 or 2 lines above
    let name = 'Producto';
    if (i >= 2 && lines[i - 2].trim() && !lines[i - 2].includes('SKU:') && !lines[i - 2].includes('Editar')) {
      name = lines[i - 2].trim();
    } else if (i >= 1 && lines[i - 1].trim() && !lines[i - 1].includes('SKU:') && !lines[i - 1].includes('Editar')) {
      name = lines[i - 1].trim();
    }

    parsedItems.push({ sku, name, price });
  }
}

console.log(`🔍 Parseados ${parsedItems.length} productos del texto pegado.`);

async function syncAndImport() {
  const jsonPath = path.join(__dirname, '..', 'catalogo-unificado', 'products.json');
  const existingProducts = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

  // Build map of existing products by SKU
  const existingMap = new Map();
  existingProducts.forEach(p => {
    if (p.sku) existingMap.set(p.sku.trim().toLowerCase(), p);
  });

  const client = new Client().setEndpoint(ENDPOINT).setProject(PROJECT_ID).setKey(API_KEY);
  const databases = new Databases(client);

  // Clear existing documents in Appwrite to avoid duplicates
  console.log('🧹 Limpiando colección anterior en Appwrite...');
  while (true) {
    const listRes = await databases.listDocuments(DATABASE_ID, 'products', [Query.limit(100)]);
    if (listRes.documents.length === 0) break;
    for (const doc of listRes.documents) {
      try {
        await databases.deleteDocument(DATABASE_ID, 'products', doc.$id);
      } catch(e){}
    }
  }

  // Get categories
  const catRes = await databases.listDocuments(DATABASE_ID, 'categories', [Query.limit(100)]);
  const catId = catRes.documents[0]?.$id || '';

  const finalCatalog = [];
  let importedCount = 0;

  for (const item of parsedItems) {
    const normSku = item.sku.toLowerCase();
    const existing = existingMap.get(normSku);

    const imageUrl = existing?.image || `https://storage.googleapis.com/asistoraerp.firebasestorage.app/CATALOGOEMPRENDEDOR/don-balato/${item.sku}.webp`;
    const category = existing?.category || 'General';
    const price = item.price || existing?.priceA || 0;

    const prodObj = {
      sku: item.sku,
      name: item.name,
      priceA: price,
      priceB: price,
      stock: 999,
      category: category,
      image: imageUrl
    };

    finalCatalog.push(prodObj);

    const payload = {
      NAME: item.name,
      DESCRIPTION: `SKU: ${item.sku} - ${item.name}`,
      PRICE: price,
      STOCK: 999,
      COST: 0,
      CURRENTPRICE: null,
      WHOLESALEPRICE: price,
      CATALOGPRICE: price,
      WHOLESALEMINQUANTITY: 1,
      PACKQTY: 1,
      IMAGEURL: imageUrl,
      IMAGEURL2: '',
      IMAGEURL3: '',
      CATEGORYID: catId,
      SUBCATEGORYID: '',
      ISACTIVE: true,
      jumpseller_id: item.sku
    };

    try {
      await databases.createDocument(DATABASE_ID, 'products', ID.unique(), payload);
      importedCount++;
    } catch(err) {
      console.error(`Error al crear SKU ${item.sku}:`, err.message);
    }
  }

  // Update products.json
  fs.writeFileSync(jsonPath, JSON.stringify(finalCatalog, null, 2), 'utf8');

  console.log(`\n🎉 IMPORTACIÓN DE LOS ${importedCount} PRODUCTOS REALIZADA EN APPWRITE Y CATALOGO-UNIFICADO!`);
}

syncAndImport();
