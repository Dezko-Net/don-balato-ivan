# 🚀 Plan Migratorio Ejecutable — Cambio de Cliente Appwrite

> **Objetivo:** Migrar todo el proyecto Yaxsel a un nuevo proyecto Appwrite (nuevo cliente)  
> **Fecha creación:** 20 mayo 2026  
> **Estado:** ✅ LISTO PARA EJECUTAR

---

## 1. Resumen Rápido

| Item | Valor Actual | Valor Nuevo |
|------|-------------|-------------|
| Endpoint | `https://nyc.cloud.appwrite.io/v1` | `https://NUEVO_ENDPOINT/v1` |
| Project ID | `6a0a4e8d0032177f3f90` | `NUEVO_PROJECT_ID` |
| Database ID | `6a0a58ca001798410d86` | `NUEVO_DATABASE_ID` |
| API Key | `standard_dea4a8654ed...` | `NUEVO_API_KEY` |

> ⚠️ Reemplazar todos los `NUEVO_*` con los valores reales del nuevo proyecto antes de ejecutar.

---

## 2. Archivos que Contienen Credenciales Hardcodeadas

### 🔴 CRÍTICO — Credenciales directas (DEBEN cambiarse)

| # | Archivo | Qué contiene | Línea aprox. |
|---|---------|---------------|-------------|
| 1 | `.env.local` | Endpoint, Project ID, Database ID, API Key | 1-4 |
| 2 | `src/app/api/template/route.ts` | Endpoint, Project ID, Database ID, API Key | 3-8 |
| 3 | `src/app/api/theme-config/route.ts` | Endpoint, Project ID, Database ID, API Key | 3-8 |
| 4 | `src/app/api/version/route.ts` | Endpoint, Project ID, Database ID, API Key | 3-8 |
| 5 | `src/app/api/admin/fix-schema/route.ts` | Usa `process.env.*` | 3-6 |
| 6 | `src/app/api/init-theme-config/route.ts` | ⚠️ **CUENTA ANTIGUA** — Endpoint, Project ID, Database ID, API Key | 3-6 |
| 7 | `src/lib/appwrite.ts` | Lee de `process.env.NEXT_PUBLIC_*` | 1-42 |
| 8 | `src/lib/appwrite-admin.ts` | Lee de `process.env.*` + fallback hardcodeado | 1-65 |
| 9 | `src/lib/appwrite-server.ts` | Endpoint, Project ID, Database ID, API Key hardcodeados | 1-20 |
| 10 | `scripts/add-missing-attributes.ts` | Endpoint, Project ID, API Key hardcodeados | — |
| 11 | `scripts/fix-perms.js` | Endpoint, Project ID, API Key hardcodeados | — |
| 12 | `scripts/create-collections.ts` | Endpoint, Project ID, API Key hardcodeados | — |

### 🟡 Archivos que leen de `.env.local` (cambiando .env.local basta)

| # | Archivo | Qué lee |
|---|---------|---------|
| 1 | `src/lib/appwrite.ts` | `NEXT_PUBLIC_APPWRITE_ENDPOINT`, `NEXT_PUBLIC_APPWRITE_PROJECT_ID`, `NEXT_PUBLIC_APPWRITE_DATABASE_ID` |
| 2 | `src/lib/appwrite-admin.ts` | `NEXT_PUBLIC_APPWRITE_ENDPOINT`, `NEXT_PUBLIC_APPWRITE_PROJECT_ID`, `NEXT_PUBLIC_APPWRITE_DATABASE_ID`, `APPWRITE_API_KEY` |
| 3 | `src/app/api/admin/fix-schema/route.ts` | `NEXT_PUBLIC_APPWRITE_ENDPOINT`, `NEXT_PUBLIC_APPWRITE_PROJECT_ID`, `NEXT_PUBLIC_APPWRITE_DATABASE_ID`, `APPWRITE_API_KEY` |
| 4 | `src/app/api/admin/customers/route.ts` | Usa `appwrite-server.ts` |
| 5 | `src/app/api/notifications/route.ts` | Usa `appwrite-server.ts` |
| 6 | `src/app/api/product-votes/route.ts` | Usa `appwrite-server.ts` |
| 7 | `src/app/api/admin/apertura/*.ts` | Usa `appwrite-server.ts` |

---

## 3. Paso a Paso — Ejecución de la Migración

### PASO 1: Crear nuevo proyecto Appwrite

1. Ir a https://cloud.appwrite.io → Create Project
2. Anotar: **Project ID**
3. Crear Database → Anotar **Database ID**
4. Crear API Key (scope: databases, collections, documents, attributes, storage) → Anotar **API Key**
5. Agregar Web Platform: `localhost` y dominio de producción

### PASO 2: Crear colecciones con esquemas

Ejecutar el script `scripts/migrate-create-collections.ts` (crear más abajo) que:
- Crea las 31 colecciones con todos sus atributos
- Configura permisos `any` para client-side writes
- Crea los storage buckets necesarios

### PASO 3: Migrar datos existentes

Ejecutar el script `scripts/migrate-data.ts` (crear más abajo) que:
- Lee datos de la cuenta actual
- Los copia a la nueva cuenta
- Mapea IDs (old → new) para mantener relaciones

### PASO 4: Actualizar credenciales en el código

Ejecutar el script de reemplazo:

```powershell
# 1. Actualizar .env.local
$newEndpoint = "https://NUEVO_ENDPOINT/v1"
$newProjectId = "NUEVO_PROJECT_ID"
$newDatabaseId = "NUEVO_DATABASE_ID"
$newApiKey = "NUEVO_API_KEY"

# 2. Reemplazar en archivos hardcodeados
$files = @(
  "src/app/api/template/route.ts",
  "src/app/api/theme-config/route.ts",
  "src/app/api/version/route.ts",
  "src/lib/appwrite-server.ts"
)

foreach ($f in $files) {
  (Get-Content $f) `
    -replace 'https://nyc\.cloud\.appwrite\.io/v1', $newEndpoint `
    -replace '6a0a4e8d0032177f3f90', $newProjectId `
    -replace '6a0a58ca001798410d86', $newDatabaseId `
    -replace 'standard_dea4a8654ed430bf3626a6cd6506a562cbfcebb7caeb417a1e83c8228ed1de0a84d60b11cc4776d023d0c5ac8d1dcb0ba59e43fef5fb8831a7252aaf5b2f13896769e2a5af222f9853d7f7abcada2d034e1d92e3b73d8de53d1c29adde00cd723aa5612189b2ee702e798acb0dffeb9ff154714a5f7af060c78567391d49923d', $newApiKey `
  | Set-Content $f
}

# 3. Actualizar .env.local
@"
NEXT_PUBLIC_APPWRITE_ENDPOINT=$newEndpoint
NEXT_PUBLIC_APPWRITE_PROJECT_ID=$newProjectId
NEXT_PUBLIC_APPWRITE_DATABASE_ID=$newDatabaseId
APPWRITE_API_KEY=$newApiKey
"@ | Set-Content ".env.local"

# 4. Actualizar scripts
$scripts = @(
  "scripts/add-missing-attributes.ts",
  "scripts/fix-perms.js",
  "scripts/create-collections.ts"
)
foreach ($s in $scripts) {
  if (Test-Path $s) {
    (Get-Content $s) `
      -replace 'https://nyc\.cloud\.appwrite\.io/v1', $newEndpoint `
      -replace '6a0a4e8d0032177f3f90', $newProjectId `
      -replace '6a0a58ca001798410d86', $newDatabaseId `
      -replace 'standard_dea4a8654ed430bf3626a6cd6506a562cbfcebb7caeb417a1e83c8228ed1de0a84d60b11cc4776d023d0c5ac8d1dcb0ba59e43fef5fb8831a7252aaf5b2f13896769e2a5af222f9853d7f7abcada2d034e1d92e3b73d8de53d1c29adde00cd723aa5612189b2ee702e798acb0dffeb9ff154714a5f7af060c78567391d49923d', $newApiKey `
    | Set-Content $s
  }
}
```

### PASO 5: Arreglar `init-theme-config/route.ts` (CUENTA ANTIGUA)

Este archivo apunta a la cuenta antigua muerta (`698f6de50012f9df7ebd`). Actualizarlo:

```typescript
// ANTES (cuenta muerta):
const PROJECT_ID = '698f6de50012f9df7ebd';
const DATABASE_ID = '67f1dc940037b3d367bb';

// DESPUÉS (nueva cuenta):
const PROJECT_ID = 'NUEVO_PROJECT_ID';
const DATABASE_ID = 'NUEVO_DATABASE_ID';
```

### PASO 6: Crear documento `store_template` en `sequences`

La app usa `sequences` con key `store_template` para saber qué plantilla mostrar. Crear:

```powershell
npx tsx -e "
const {Client,Databases,ID}=require('node-appwrite');
const c=new Client().setEndpoint('NUEVO_ENDPOINT/v1').setProject('NUEVO_PROJECT_ID').setKey('NUEVO_API_KEY');
const db=new Databases(c);
db.createDocument('NUEVO_DATABASE_ID','sequences','store_template',{key:'store_template',value:1}).then(()=>console.log('✅ store_template created')).catch(e=>console.error('❌',e.message));
"
```

### PASO 7: Crear documento `homepage_sections` en `theme_config`

```powershell
npx tsx -e "
const {Client,Databases,ID}=require('node-appwrite');
const c=new Client().setEndpoint('NUEVO_ENDPOINT/v1').setProject('NUEVO_PROJECT_ID').setKey('NUEVO_API_KEY');
const db=new Databases(c);
db.createDocument('NUEVO_DATABASE_ID','theme_config','homepage_sections',{config:JSON.stringify({}),NAME:'default',SECTIONS:'[]'}).then(()=>console.log('✅ homepage_sections created')).catch(e=>console.error('❌',e.message));
"
```

### PASO 8: Crear documento `store_settings`

```powershell
npx tsx -e "
const {Client,Databases,ID}=require('node-appwrite');
const c=new Client().setEndpoint('NUEVO_ENDPOINT/v1').setProject('NUEVO_PROJECT_ID').setKey('NUEVO_API_KEY');
const db=new Databases(c);
db.createDocument('NUEVO_DATABASE_ID','store_settings','store_settings_doc',{STORENAME:'Yaxsel',ADDRESS:'',PHONE:'',EMAIL:'',WHATSAPP:'',LOGOURL:'',CURRENCY:'CLP'}).then(()=>console.log('✅ store_settings created')).catch(e=>console.error('❌',e.message));
"
```

### PASO 9: Actualizar Vercel

1. Ir a Vercel → Project → Settings → Environment Variables
2. Actualizar:
   - `NEXT_PUBLIC_APPWRITE_ENDPOINT` → nuevo endpoint
   - `NEXT_PUBLIC_APPWRITE_PROJECT_ID` → nuevo project ID
   - `NEXT_PUBLIC_APPWRITE_DATABASE_ID` → nuevo database ID
   - `APPWRITE_API_KEY` → nueva API key
3. Redeploy

### PASO 10: Verificar

- [ ] Homepage carga con plantilla correcta
- [ ] Login funciona (crear cuenta nueva)
- [ ] Productos se ven (si hay datos migrados)
- [ ] Carrito funciona
- [ ] Admin panel funciona
- [ ] Theme editor funciona
- [ ] Checkout funciona
- [ ] No hay errores en consola del navegador

---

## 4. Script: Crear Colecciones (`scripts/migrate-create-collections.ts`)

```typescript
import { Client, Databases, ID, Storage } from 'node-appwrite';

// =============================================
// CONFIG — REEMPLAZAR CON VALORES DEL NUEVO PROYECTO
// =============================================
const ENDPOINT    = 'https://NUEVO_ENDPOINT/v1';
const PROJECT_ID  = 'NUEVO_PROJECT_ID';
const DATABASE_ID = 'NUEVO_DATABASE_ID';
const API_KEY     = 'NUEVO_API_KEY';

const client = new Client().setEndpoint(ENDPOINT).setProject(PROJECT_ID).setKey(API_KEY);
const db = new Databases(client);
const storage = new Storage(client);

// Esquemas de colecciones: [key, type, size, required]
type Attr = { key: string; type: 'string'|'integer'|'double'|'boolean'; size?: number; required?: boolean; default?: any };

interface CollDef {
  id: string;
  name: string;
  attrs: Attr[];
  permissions: string[]; // document-level
}

const collections: CollDef[] = [
  {
    id: 'products',
    name: 'Products',
    attrs: [
      { key: 'NAME', type: 'string', size: 256, required: true },
      { key: 'DESCRIPTION', type: 'string', size: 8192 },
      { key: 'PRICE', type: 'integer', required: true },
      { key: 'CURRENTPRICE', type: 'integer' },
      { key: 'COST', type: 'integer' },
      { key: 'STOCK', type: 'integer', required: true },
      { key: 'SOLDQUANTITY', type: 'integer' },
      { key: 'CATEGORYID', type: 'string', size: 256 },
      { key: 'SUBCATEGORYID', type: 'string', size: 256 },
      { key: 'IMAGEURL', type: 'string', size: 2048 },
      { key: 'IMAGEURL2', type: 'string', size: 2048 },
      { key: 'IMAGEURL3', type: 'string', size: 2048 },
      { key: 'RATING', type: 'double' },
      { key: 'NUMREVIEWS', type: 'integer' },
      { key: 'WHOLESALEPRICE', type: 'integer' },
      { key: 'WHOLESALEMINQUANTITY', type: 'integer' },
      { key: 'ISFEATURED', type: 'boolean' },
      { key: 'ISACTIVE', type: 'boolean' },
      { key: 'PACKQTY', type: 'integer' },
      { key: 'RESTOCKTHRESHOLD', type: 'integer' },
      { key: 'jumpseller_id', type: 'string', size: 256 },
      { key: 'section', type: 'integer' },
      { key: 'barcode', type: 'string', size: 64 },
      { key: 'sku', type: 'string', size: 128 },
      { key: 'COMING_SOON', type: 'boolean' },
      { key: 'DATE_ADDED', type: 'string', size: 20 },
    ],
    permissions: ['read("any")','create("any")','update("any")','delete("any")'],
  },
  {
    id: 'inventory_products',
    name: 'Inventory Products',
    attrs: [
      { key: 'sku', type: 'string', size: 256 },
      { key: 'barcode', type: 'string', size: 256 },
      { key: 'NAME', type: 'string', size: 256, required: true },
      { key: 'PRICE', type: 'integer' },
      { key: 'STOCK', type: 'integer' },
      { key: 'CATEGORYID', type: 'string', size: 256 },
      { key: 'SUBCATEGORYID', type: 'string', size: 256 },
      { key: 'IMAGEURL', type: 'string', size: 2048 },
      { key: 'IMAGEURL2', type: 'string', size: 2048 },
      { key: 'IMAGEURL3', type: 'string', size: 2048 },
      { key: 'WHOLESALEPRICE', type: 'integer' },
      { key: 'WHOLESALEMINQUANTITY', type: 'integer' },
      { key: 'ISACTIVE', type: 'boolean' },
      { key: 'published_product_id', type: 'string', size: 256 },
      { key: 'published_at', type: 'string', size: 64 },
      { key: 'imported_at', type: 'string', size: 64 },
      { key: 'FEATURES', type: 'string', size: 2048 },
      { key: 'TAGS', type: 'string', size: 512 },
      { key: 'name_cn', type: 'string', size: 256 },
      { key: 'IMAGEURL4', type: 'string', size: 1024 },
      { key: 'IMAGEURL5', type: 'string', size: 1024 },
      { key: 'PACKQTY', type: 'integer' },
      { key: 'section', type: 'integer' },
      { key: 'COMING_SOON', type: 'boolean' },
      { key: 'DATE_ADDED', type: 'string', size: 256 },
    ],
    permissions: ['read("any")','create("any")','update("any")','delete("any")'],
  },
  {
    id: 'categories',
    name: 'Categories',
    attrs: [
      { key: 'name', type: 'string', size: 256, required: true },
      { key: 'iconUrl', type: 'string', size: 2048 },
      { key: 'order', type: 'integer' },
      { key: 'color', type: 'string', size: 50 },
      { key: 'BACKGROUND_IMAGE_URL', type: 'string', size: 2048 },
    ],
    permissions: ['read("any")','create("any")','update("any")','delete("any")'],
  },
  {
    id: 'subcategories',
    name: 'Subcategories',
    attrs: [
      { key: 'name', type: 'string', size: 256, required: true },
      { key: 'categoryId', type: 'string', size: 256, required: true },
      { key: 'order', type: 'integer' },
      { key: 'ICON_URL', type: 'string', size: 2048 },
      { key: 'BACKGROUND_IMAGE_URL', type: 'string', size: 2048 },
      { key: 'ZOOM_BACKGROUND_IMAGE_URL', type: 'string', size: 2048 },
      { key: 'COLOR', type: 'string', size: 50 },
    ],
    permissions: ['read("any")','create("any")','update("any")','delete("any")'],
  },
  {
    id: 'banners',
    name: 'Banners',
    attrs: [
      { key: 'TITLE', type: 'string', size: 256 },
      { key: 'DESCRIPTION', type: 'string', size: 1024 },
      { key: 'IMAGEURL', type: 'string', size: 2048, required: true },
      { key: 'LINKURL', type: 'string', size: 2048 },
      { key: 'DURATION', type: 'integer' },
      { key: 'ISACTIVE', type: 'boolean' },
      { key: 'DISPLAYORDER', type: 'integer' },
      { key: 'CLICKS', type: 'integer' },
      { key: 'VIEWS', type: 'integer' },
    ],
    permissions: ['read("any")','create("any")','update("any")','delete("any")'],
  },
  {
    id: 'orders',
    name: 'Orders',
    attrs: [
      { key: 'USERID', type: 'string', size: 256 },
      { key: 'ORDERCODE', type: 'string', size: 50, required: true },
      { key: 'ORDERINDEX', type: 'integer', required: true },
      { key: 'CUSTOMERNAME', type: 'string', size: 256, required: true },
      { key: 'CUSTOMEREMAIL', type: 'string', size: 256 },
      { key: 'CUSTOMERRUT', type: 'string', size: 50 },
      { key: 'CUSTOMERPHONE', type: 'string', size: 50 },
      { key: 'REGION', type: 'string', size: 100 },
      { key: 'COMUNA', type: 'string', size: 100 },
      { key: 'ADDRESS', type: 'string', size: 512 },
      { key: 'ADDITIONALINFO', type: 'string', size: 512 },
      { key: 'ADDRESSPHOTOURL', type: 'string', size: 2048 },
      { key: 'PAYMENTMETHOD', type: 'string', size: 50 },
      { key: 'SHIPPINGAGENCY', type: 'string', size: 100 },
      { key: 'SHIPPINGADDRESS', type: 'string', size: 2048 },
      { key: 'SUBTOTAL', type: 'integer', required: true },
      { key: 'SHIPPINGCOST', type: 'integer' },
      { key: 'TOTAL', type: 'integer', required: true },
      { key: 'STATUS', type: 'string', size: 50, required: true },
      { key: 'ITEMS', type: 'string', size: 50000 },
      { key: 'CREATEDAT', type: 'integer', required: true },
      { key: 'UPDATEDAT', type: 'integer' },
      { key: 'EXPIRESAT', type: 'integer' },
      { key: 'AUTOCANCELENABLED', type: 'boolean' },
      { key: 'PAYMENTPROOFURL', type: 'string', size: 2048 },
      { key: 'ISGIFT', type: 'boolean' },
      { key: 'CUSTOMERNOTE', type: 'string', size: 2048 },
      { key: 'PURCHASEDFROMLIVE', type: 'boolean' },
      { key: 'COUPONCODE', type: 'string', size: 100 },
    ],
    permissions: ['read("any")','create("any")','update("any")','delete("any")'],
  },
  {
    id: 'timed_offers',
    name: 'Timed Offers',
    attrs: [
      { key: 'title', type: 'string', size: 256, required: true },
      { key: 'offerType', type: 'string', size: 50, required: true },
      { key: 'targetId', type: 'string', size: 256, required: true },
      { key: 'productName', type: 'string', size: 256 },
      { key: 'originalPrice', type: 'integer', required: true },
      { key: 'discountPrice', type: 'integer', required: true },
      { key: 'discountPercentage', type: 'integer', required: true },
      { key: 'customImagePath', type: 'string', size: 2048 },
      { key: 'timeType', type: 'string', size: 50, required: true },
      { key: 'durationHours', type: 'integer' },
      { key: 'endDateTime', type: 'string', size: 100 },
      { key: 'status', type: 'string', size: 50, required: true },
      { key: 'activatedAt', type: 'string', size: 100 },
      { key: 'isActive', type: 'boolean' },
      { key: 'createdAt', type: 'string', size: 100 },
      { key: 'updatedAt', type: 'string', size: 100 },
    ],
    permissions: ['read("any")','create("any")','update("any")','delete("any")'],
  },
  {
    id: 'sequences',
    name: 'Sequences',
    attrs: [
      { key: 'key', type: 'string', size: 256, required: true },
      { key: 'value', type: 'integer', required: true },
    ],
    permissions: ['read("any")','create("any")','update("any")','delete("any")'],
  },
  {
    id: 'discount_coupons',
    name: 'Discount Coupons',
    attrs: [
      { key: 'code', type: 'string', size: 100, required: true },
      { key: 'type', type: 'string', size: 50, required: true },
      { key: 'value', type: 'integer', required: true },
      { key: 'isActive', type: 'boolean' },
      { key: 'maxUses', type: 'integer' },
      { key: 'usedCount', type: 'integer' },
      { key: 'minPurchase', type: 'integer' },
      { key: 'expiresAt', type: 'integer' },
    ],
    permissions: ['read("any")','create("any")','update("any")','delete("any")'],
  },
  {
    id: 'points_store_items',
    name: 'Points Store Items',
    attrs: [
      { key: 'name', type: 'string', size: 256, required: true },
      { key: 'description', type: 'string', size: 2048 },
      { key: 'pointsCost', type: 'integer', required: true },
      { key: 'imageUrl', type: 'string', size: 2048 },
      { key: 'isActive', type: 'boolean' },
    ],
    permissions: ['read("any")','create("any")','update("any")','delete("any")'],
  },
  {
    id: 'users',
    name: 'Users',
    attrs: [
      { key: 'userId', type: 'string', size: 256, required: true },
      { key: 'email', type: 'string', size: 256, required: true },
      { key: 'name', type: 'string', size: 256 },
      { key: 'phone', type: 'string', size: 100 },
      { key: 'createdAt', type: 'string', size: 100, required: true },
      { key: 'adminNotes', type: 'string', size: 4096 },
      { key: 'isWholesale', type: 'boolean' },
      { key: 'isBanned', type: 'boolean' },
      { key: 'lastAccessAt', type: 'string', size: 100 },
      { key: 'profileCreatedAt', type: 'string', size: 100 },
      { key: 'region', type: 'string', size: 100 },
    ],
    permissions: ['read("any")','create("any")','update("any")','delete("any")'],
  },
  {
    id: 'live_streams',
    name: 'Live Streams',
    attrs: [
      { key: 'title', type: 'string', size: 256, required: true },
      { key: 'description', type: 'string', size: 2048 },
      { key: 'url', type: 'string', size: 2048, required: true },
      { key: 'platform', type: 'string', size: 50 },
      { key: 'status', type: 'string', size: 50, required: true },
      { key: 'isActive', type: 'boolean' },
      { key: 'thumbnailUrl', type: 'string', size: 2048 },
      { key: 'viewerCount', type: 'integer' },
      { key: 'scheduledAt', type: 'string', size: 100 },
      { key: 'startAt', type: 'string', size: 100 },
      { key: 'muted', type: 'boolean' },
      { key: 'showText', type: 'boolean' },
      { key: 'allowFullscreen', type: 'boolean' },
    ],
    permissions: ['read("any")','create("any")','update("any")','delete("any")'],
  },
  {
    id: 'banner_overlay_positions',
    name: 'Banner Overlay Positions',
    attrs: [
      { key: 'BANNERID', type: 'string', size: 256, required: true },
      { key: 'PRODUCTID', type: 'string', size: 256, required: true },
      { key: 'POSITIONX', type: 'double', required: true },
      { key: 'POSITIONY', type: 'double', required: true },
      { key: 'SCALE', type: 'double' },
      { key: 'CIRCLESCALE', type: 'double' },
      { key: 'DISPLAYTYPE', type: 'string', size: 50 },
      { key: 'CUSTOMIMAGEURL', type: 'string', size: 2048 },
      { key: 'CIRCLECOLOR', type: 'string', size: 50 },
      { key: 'ISACTIVE', type: 'boolean' },
      { key: 'DISPLAYORDER', type: 'integer' },
      { key: 'CLICKS', type: 'integer' },
    ],
    permissions: ['read("any")','create("any")','update("any")','delete("any")'],
  },
  {
    id: 'house_product_positions',
    name: 'House Product Positions',
    attrs: [
      { key: 'PRODUCTID', type: 'string', size: 256, required: true },
      { key: 'CATEGORYID', type: 'string', size: 256 },
      { key: 'POSITIONX', type: 'double', required: true },
      { key: 'POSITIONY', type: 'double', required: true },
      { key: 'ISACTIVE', type: 'boolean' },
      { key: 'DISPLAYORDER', type: 'integer' },
      { key: 'SCALE', type: 'double' },
      { key: 'CIRCLESCALE', type: 'double' },
      { key: 'CUSTOMIMAGEURL', type: 'string', size: 2048 },
      { key: 'DISPLAYTYPE', type: 'string', size: 50 },
      { key: 'CIRCLECOLOR', type: 'string', size: 50 },
      { key: 'BACKGROUND', type: 'string', size: 50 },
    ],
    permissions: ['read("any")','create("any")','update("any")','delete("any")'],
  },
  {
    id: 'hotspot_panels',
    name: 'Hotspot Panels',
    attrs: [
      { key: 'IMAGEURL', type: 'string', size: 2048, required: true },
      { key: 'TITLE', type: 'string', size: 256 },
      { key: 'LINKURL', type: 'string', size: 2048 },
      { key: 'MOSAICGROUP', type: 'string', size: 50 },
      { key: 'CELLINDEX', type: 'integer' },
      { key: 'ISACTIVE', type: 'boolean' },
      { key: 'DISPLAYORDER', type: 'integer' },
    ],
    permissions: ['read("any")','create("any")','update("any")','delete("any")'],
  },
  {
    id: 'product_votes',
    name: 'Product Votes',
    attrs: [
      { key: 'PRODUCTTITLE', type: 'string', size: 256, required: true },
      { key: 'USERID', type: 'string', size: 256 },
      { key: 'USERNAME', type: 'string', size: 256 },
      { key: 'USEREMAIL', type: 'string', size: 256 },
      { key: 'CREATEDAT', type: 'integer', required: true },
      { key: 'IPADDRESS', type: 'string', size: 256 },
    ],
    permissions: ['read("any")','create("any")','update("any")','delete("any")'],
  },
  {
    id: 'reviews',
    name: 'Reviews',
    attrs: [
      { key: 'PRODUCTID', type: 'string', size: 256, required: true },
      { key: 'USERID', type: 'string', size: 256, required: true },
      { key: 'USERNAME', type: 'string', size: 256 },
      { key: 'USERPROFILEIMAGEURL', type: 'string', size: 2048 },
      { key: 'RATING', type: 'integer', required: true },
      { key: 'COMMENT', type: 'string', size: 4096 },
      { key: 'CREATEDAT', type: 'integer', required: true },
      { key: 'REVIEWDATE', type: 'integer' },
      { key: 'ISEDITED', type: 'boolean' },
    ],
    permissions: ['read("any")','create("any")','update("any")','delete("any")'],
  },
  {
    id: 'clips',
    name: 'Clips',
    attrs: [
      { key: 'TITLE', type: 'string', size: 256, required: true },
      { key: 'DESCRIPTION', type: 'string', size: 2048 },
      { key: 'VIDEOURL', type: 'string', size: 2048, required: true },
      { key: 'THUMBNAILURL', type: 'string', size: 2048 },
      { key: 'PRODUCTID', type: 'string', size: 256 },
      { key: 'PRODUCTNAME', type: 'string', size: 256 },
      { key: 'PRODUCTPRICE', type: 'integer' },
      { key: 'PRODUCTIMAGEURL', type: 'string', size: 2048 },
      { key: 'USERID', type: 'string', size: 256 },
      { key: 'USERNAME', type: 'string', size: 256 },
      { key: 'LIKES', type: 'integer' },
      { key: 'VIEWS', type: 'integer' },
      { key: 'ISACTIVE', type: 'boolean' },
      { key: 'CREATEDAT', type: 'integer', required: true },
    ],
    permissions: ['read("any")','create("any")','update("any")','delete("any")'],
  },
  {
    id: 'favorites',
    name: 'Favorites',
    attrs: [
      { key: 'userId', type: 'string', size: 256, required: true },
      { key: 'productId', type: 'string', size: 256, required: true },
      { key: 'createdAt', type: 'integer', required: true },
    ],
    permissions: ['read("any")','create("any")','update("any")','delete("any")'],
  },
  {
    id: 'live_raffles',
    name: 'Live Raffles',
    attrs: [
      { key: 'TITLE', type: 'string', size: 256, required: true },
      { key: 'DESCRIPTION', type: 'string', size: 2048 },
      { key: 'PRIZE', type: 'string', size: 256, required: true },
      { key: 'PRIZEIMAGEURL', type: 'string', size: 2048 },
      { key: 'LIVESTREAMID', type: 'string', size: 256 },
      { key: 'STATUS', type: 'string', size: 50, required: true },
      { key: 'PARTICIPANTS', type: 'string', size: 50000 },
      { key: 'WINNERID', type: 'string', size: 256 },
      { key: 'WINNERNAME', type: 'string', size: 256 },
      { key: 'MAXPARTICIPANTS', type: 'integer' },
      { key: 'STARTSAT', type: 'integer' },
      { key: 'ENDSAT', type: 'integer' },
      { key: 'CREATEDAT', type: 'integer', required: true },
    ],
    permissions: ['read("any")','create("any")','update("any")','delete("any")'],
  },
  {
    id: 'raffle_participants',
    name: 'Raffle Participants',
    attrs: [
      { key: 'raffleId', type: 'string', size: 256, required: true },
      { key: 'userId', type: 'string', size: 256, required: true },
      { key: 'participatedAt', type: 'integer', required: true },
    ],
    permissions: ['read("any")','create("any")','update("any")','delete("any")'],
  },
  {
    id: 'stock_alerts',
    name: 'Stock Alerts',
    attrs: [
      { key: 'productId', type: 'string', size: 256, required: true },
      { key: 'userId', type: 'string', size: 256, required: true },
      { key: 'createdAt', type: 'integer', required: true },
    ],
    permissions: ['read("any")','create("any")','update("any")','delete("any")'],
  },
  {
    id: 'notifications',
    name: 'Notifications',
    attrs: [
      { key: 'title', type: 'string', size: 256, required: true },
      { key: 'message', type: 'string', size: 4096, required: true },
      { key: 'type', type: 'string', size: 50 },
      { key: 'userId', type: 'string', size: 256 },
      { key: 'isRead', type: 'boolean' },
    ],
    permissions: ['read("any")','create("any")','update("any")','delete("any")'],
  },
  {
    id: 'theme_config',
    name: 'Theme Config',
    attrs: [
      { key: 'config', type: 'string', size: 50000 },
      { key: 'NAME', type: 'string', size: 256 },
      { key: 'SECTIONS', type: 'string', size: 50000 },
    ],
    permissions: ['read("any")','create("any")','update("any")','delete("any")'],
  },
  {
    id: 'apertura_settings',
    name: 'Apertura Settings',
    attrs: [
      { key: 'isActive', type: 'boolean' },
      { key: 'discountPercent', type: 'integer' },
      { key: 'minPurchase', type: 'integer' },
      { key: 'createdAt', type: 'string', size: 100 },
      { key: 'updatedAt', type: 'string', size: 100 },
    ],
    permissions: ['read("any")','create("any")','update("any")','delete("any")'],
  },
  {
    id: 'support_tickets',
    name: 'Support Tickets',
    attrs: [
      { key: 'userId', type: 'string', size: 256, required: true },
      { key: 'subject', type: 'string', size: 256, required: true },
      { key: 'message', type: 'string', size: 4096, required: true },
      { key: 'status', type: 'string', size: 50, required: true },
      { key: 'priority', type: 'string', size: 50 },
      { key: 'adminNotes', type: 'string', size: 4096 },
    ],
    permissions: ['read("any")','create("any")','update("any")','delete("any")'],
  },
  {
    id: 'stock_movements',
    name: 'Stock Movements',
    attrs: [
      { key: 'productId', type: 'string', size: 256, required: true },
      { key: 'productName', type: 'string', size: 256 },
      { key: 'type', type: 'string', size: 50, required: true },
      { key: 'quantity', type: 'integer', required: true },
      { key: 'reason', type: 'string', size: 512 },
    ],
    permissions: ['read("any")','create("any")','update("any")','delete("any")'],
  },
  {
    id: 'fcm_tokens',
    name: 'FCM Tokens',
    attrs: [
      { key: 'userId', type: 'string', size: 256 },
      { key: 'token', type: 'string', size: 512, required: true },
      { key: 'createdAt', type: 'integer', required: true },
    ],
    permissions: ['read("any")','create("any")','update("any")','delete("any")'],
  },
  {
    id: 'order_status_history',
    name: 'Order Status History',
    attrs: [
      { key: 'orderId', type: 'string', size: 256, required: true },
      { key: 'status', type: 'string', size: 50, required: true },
      { key: 'createdAt', type: 'integer', required: true },
      { key: 'notes', type: 'string', size: 2048 },
    ],
    permissions: ['read("any")','create("any")','update("any")','delete("any")'],
  },
  {
    id: 'wholesale_requests',
    name: 'Wholesale Requests',
    attrs: [
      { key: 'userId', type: 'string', size: 256 },
      { key: 'companyName', type: 'string', size: 256, required: true },
      { key: 'rut', type: 'string', size: 50, required: true },
      { key: 'email', type: 'string', size: 256, required: true },
      { key: 'phone', type: 'string', size: 100, required: true },
      { key: 'status', type: 'string', size: 50, required: true },
      { key: 'adminNotes', type: 'string', size: 4096 },
      { key: 'rejectionReason', type: 'string', size: 1024 },
      { key: 'createdAt', type: 'integer', required: true },
    ],
    permissions: ['read("any")','create("any")','update("any")','delete("any")'],
  },
  {
    id: 'addresses',
    name: 'Addresses',
    attrs: [
      { key: 'userId', type: 'string', size: 256, required: true },
      { key: 'name', type: 'string', size: 256, required: true },
      { key: 'address', type: 'string', size: 512, required: true },
      { key: 'city', type: 'string', size: 256, required: true },
      { key: 'region', type: 'string', size: 256, required: true },
      { key: 'phone', type: 'string', size: 100, required: true },
      { key: 'isDefault', type: 'boolean' },
    ],
    permissions: ['read("any")','create("any")','update("any")','delete("any")'],
  },
  // Colecciones especiales que no estaban en el plan original
  {
    id: 'store_settings',
    name: 'Store Settings',
    attrs: [
      { key: 'STORENAME', type: 'string', size: 256 },
      { key: 'ADDRESS', type: 'string', size: 512 },
      { key: 'PHONE', type: 'string', size: 100 },
      { key: 'EMAIL', type: 'string', size: 256 },
      { key: 'WHATSAPP', type: 'string', size: 100 },
      { key: 'LOGOURL', type: 'string', size: 2048 },
      { key: 'CURRENCY', type: 'string', size: 10 },
    ],
    permissions: ['read("any")','create("any")','update("any")','delete("any")'],
  },
  {
    id: 'page_views',
    name: 'Page Views',
    attrs: [
      { key: 'PAGE', type: 'string', size: 256, required: true },
      { key: 'DATE', type: 'string', size: 20, required: true },
      { key: 'VIEWS', type: 'integer', required: true },
    ],
    permissions: ['read("any")','create("any")','update("any")','delete("any")'],
  },
];

async function createAll() {
  console.log('🚀 Creando colecciones en nuevo proyecto...\n');

  for (const coll of collections) {
    try {
      // Create collection
      await db.createCollection(DATABASE_ID, coll.id, coll.name, coll.permissions);
      console.log(`✅ Colección creada: ${coll.id}`);
    } catch (e: any) {
      if (e.message?.includes('already exists')) {
        console.log(`⏭️  Ya existe: ${coll.id}`);
      } else {
        console.error(`❌ Error creando ${coll.id}:`, e.message);
        continue;
      }
    }

    // Create attributes
    for (const attr of coll.attrs) {
      try {
        if (attr.type === 'string') {
          await db.createStringAttribute(DATABASE_ID, coll.id, attr.key, attr.size || 256, attr.required || false);
        } else if (attr.type === 'integer') {
          await db.createIntegerAttribute(DATABASE_ID, coll.id, attr.key, attr.required || false);
        } else if (attr.type === 'double') {
          await db.createFloatAttribute(DATABASE_ID, coll.id, attr.key, attr.required || false);
        } else if (attr.type === 'boolean') {
          await db.createBooleanAttribute(DATABASE_ID, coll.id, attr.key, attr.required || false);
        }
        console.log(`  ✅ Atributo: ${attr.key} (${attr.type})`);
      } catch (e: any) {
        if (e.message?.includes('already exists')) {
          console.log(`  ⏭️  Atributo ya existe: ${attr.key}`);
        } else {
          console.error(`  ❌ Error atributo ${attr.key}:`, e.message);
        }
      }
    }

    // Rate limit: wait 100ms between collections
    await new Promise(r => setTimeout(r, 100));
  }

  // Create storage buckets
  console.log('\n📦 Creando storage buckets...');
  const buckets = [
    { id: 'products', name: 'Products', maxFileSize: 50000000 },
    { id: 'comprobantes', name: 'Comprobantes', maxFileSize: 10000000 },
  ];

  for (const b of buckets) {
    try {
      await storage.createBucket(b.id, b.name, ['read("any")','create("any")','update("any")','delete("any")'], undefined, false, undefined, b.maxFileSize);
      console.log(`✅ Bucket creado: ${b.id}`);
    } catch (e: any) {
      if (e.message?.includes('already exists')) {
        console.log(`⏭️  Bucket ya existe: ${b.id}`);
      } else {
        console.error(`❌ Error bucket ${b.id}:`, e.message);
      }
    }
  }

  console.log('\n🎉 Migración de esquemas completada!');
  console.log('⚠️  Esperar 30+ segundos antes de crear documentos (atributos en processing)');
}

createAll().catch(console.error);
```

---

## 5. Script: Migrar Datos (`scripts/migrate-data.ts`)

```typescript
import { Client, Databases, ID, Query } from 'node-appwrite';

// =============================================
// CONFIG
// =============================================
const OLD_ENDPOINT    = 'https://nyc.cloud.appwrite.io/v1';
const OLD_PROJECT_ID  = '6a0a4e8d0032177f3f90';
const OLD_DATABASE_ID = '6a0a58ca001798410d86';
const OLD_API_KEY     = 'standard_dea4a8654ed430bf3626a6cd6506a562cbfcebb7caeb417a1e83c8228ed1de0a84d60b11cc4776d023d0c5ac8d1dcb0ba59e43fef5fb8831a7252aaf5b2f13896769e2a5af222f9853d7f7abcada2d034e1d92e3b73d8de53d1c29adde00cd723aa5612189b2ee702e798acb0dffeb9ff154714a5f7af060c78567391d49923d';

const NEW_ENDPOINT    = 'https://NUEVO_ENDPOINT/v1';
const NEW_PROJECT_ID  = 'NUEVO_PROJECT_ID';
const NEW_DATABASE_ID = 'NUEVO_DATABASE_ID';
const NEW_API_KEY     = 'NUEVO_API_KEY';

const oldClient = new Client().setEndpoint(OLD_ENDPOINT).setProject(OLD_PROJECT_ID).setKey(OLD_API_KEY);
const newClient = new Client().setEndpoint(NEW_ENDPOINT).setProject(NEW_PROJECT_ID).setKey(NEW_API_KEY);
const oldDb = new Databases(oldClient);
const newDb = new Databases(newClient);

// Mapa de IDs: old → new
const idMap = new Map<string, string>();

// Colecciones a migrar (en orden de dependencias)
const MIGRATION_ORDER = [
  'sequences',          // Sin dependencias
  'categories',         // Sin dependencias
  'subcategories',      // Depende de categories
  'theme_config',       // Sin dependencias
  'store_settings',     // Sin dependencias
  'apertura_settings',  // Sin dependencias
  'products',           // Depende de categories
  'inventory_products', // Depende de categories
  'banners',            // Sin dependencias
  'discount_coupons',   // Sin dependencias
  'users',              // Sin dependencias
  'timed_offers',       // Depende de products
  'orders',             // Depende de users, products
  'reviews',            // Depende de products, users
  'favorites',          // Depende de products, users
  'notifications',      // Depende de users
  'addresses',          // Depende de users
  'house_product_positions',  // Depende de products, categories
  'banner_overlay_positions', // Depende de banners, products
  'hotspot_panels',     // Sin dependencias
  'product_votes',      // Sin dependencias
  'clips',              // Depende de products, users
  'live_streams',       // Sin dependencias
  'live_raffles',       // Depende de live_streams
  'raffle_participants',// Depende de live_raffles, users
  'stock_alerts',       // Depende de products, users
  'stock_movements',    // Depende de products
  'support_tickets',    // Depende de users
  'fcm_tokens',         // Depende de users
  'order_status_history',// Depende de orders
  'wholesale_requests', // Depende de users
  'points_store_items', // Sin dependencias
  'page_views',         // Sin dependencias
];

// Campos que son referencias a otros documentos (necesitan mapeo de IDs)
const REFERENCE_FIELDS: Record<string, string[]> = {
  products: ['CATEGORYID', 'SUBCATEGORYID'],
  subcategories: ['categoryId'],
  inventory_products: ['CATEGORYID', 'SUBCATEGORYID', 'published_product_id'],
  orders: ['USERID'],
  reviews: ['PRODUCTID', 'USERID'],
  favorites: ['userId', 'productId'],
  notifications: ['userId'],
  addresses: ['userId'],
  house_product_positions: ['PRODUCTID', 'CATEGORYID'],
  banner_overlay_positions: ['BANNERID', 'PRODUCTID'],
  clips: ['PRODUCTID', 'USERID'],
  live_raffles: ['LIVESTREAMID'],
  raffle_participants: ['raffleId', 'userId'],
  stock_alerts: ['productId', 'userId'],
  stock_movements: ['productId'],
  support_tickets: ['userId'],
  fcm_tokens: ['userId'],
  order_status_history: ['orderId'],
  wholesale_requests: ['userId'],
  timed_offers: ['targetId'],
};

async function migrateCollection(collId: string) {
  console.log(`\n📋 Migrando: ${collId}`);

  let allDocs: any[] = [];
  let offset = 0;
  const limit = 100;

  // Leer todos los documentos de la colección antigua
  try {
    while (true) {
      const res = await oldDb.listDocuments(OLD_DATABASE_ID, collId, [
        Query.limit(limit),
        Query.offset(offset),
      ]);
      allDocs.push(...res.documents);
      if (res.documents.length < limit) break;
      offset += limit;
    }
  } catch (e: any) {
    console.error(`  ❌ Error leyendo ${collId}:`, e.message);
    return;
  }

  if (allDocs.length === 0) {
    console.log(`  ⏭️  Vacía, saltando`);
    return;
  }

  console.log(`  📦 ${allDocs.length} documentos encontrados`);

  // Mapear referencias y crear documentos nuevos
  const refFields = REFERENCE_FIELDS[collId] || [];
  let created = 0;
  let skipped = 0;

  for (const doc of allDocs) {
    const oldId = doc.$id;
    const data: Record<string, any> = {};

    // Copiar todos los campos excepto los del sistema
    for (const [key, value] of Object.entries(doc)) {
      if (key.startsWith('$')) continue; // Skip $id, $createdAt, etc.
      if (refFields.includes(key)) {
        // Mapear referencia
        data[key] = idMap.get(value) || value; // Si no está en el mapa, usar el original
      } else {
        data[key] = value;
      }
    }

    try {
      const newDoc = await newDb.createDocument(NEW_DATABASE_ID, collId, ID.unique(), data);
      idMap.set(oldId, newDoc.$id);
      created++;
    } catch (e: any) {
      if (e.message?.includes('already exists')) {
        skipped++;
      } else {
        console.error(`  ❌ Error creando doc ${oldId}:`, e.message?.substring(0, 100));
      }
    }

    // Rate limiting: 100ms entre documentos
    await new Promise(r => setTimeout(r, 100));
  }

  console.log(`  ✅ Creados: ${created}, Saltados: ${skipped}`);
}

async function migrateAll() {
  console.log('🚀 Iniciando migración de datos...\n');

  for (const collId of MIGRATION_ORDER) {
    await migrateCollection(collId);
  }

  console.log('\n🎉 Migración de datos completada!');
  console.log(`📊 Total IDs mapeados: ${idMap.size}`);
}

migrateAll().catch(console.error);
```

---

## 6. Inventario Completo de Archivos por Categoría

### 📁 Archivos que usan atributos UPPERCASE de Appwrite (73 archivos)

**Templates (los más grandes):**
- `src/templates/plantilla1/HomePage.tsx` — 38 refs a `.NAME`
- `src/templates/plantilla2/HomePage.tsx` — 50 refs
- `src/templates/plantilla1/ProductDetail.tsx` — 13 refs
- `src/templates/plantilla2/ProductDetail.tsx` — 14 refs
- `src/templates/plantilla1/Navbar.tsx` — 8 refs
- `src/templates/plantilla2/Navbar.tsx` — 19 refs
- `src/templates/plantilla3/HomePage.tsx` — 4 refs
- `src/templates/plantilla4/HomePage.tsx` — 4 refs

**Páginas públicas:**
- `src/app/page.tsx` — 4 refs
- `src/app/productos/page.tsx` — 14 refs
- `src/app/productos/ProductosInner.tsx` — 14 refs
- `src/app/checkout/page.tsx` — 13 refs
- `src/app/catalogo/page.tsx` — 11 refs
- `src/app/llegan-pronto/page.tsx` — 9 refs
- `src/app/mayorista/page.tsx` — 5 refs
- `src/app/comparar/page.tsx` — 4 refs
- `src/app/inventario/page.tsx` — 35 refs
- `src/app/inventario/fecha/page.tsx` — 3 refs
- `src/app/cuenta/perfil/page.tsx` — 3 refs
- `src/app/cuenta/direcciones/page.tsx` — 8 refs
- `src/app/pedido-confirmado/page.tsx` — 3 refs
- `src/app/lista/[id]/page.tsx` — 3 refs

**Admin panel:**
- `src/app/admin/(panel)/products/page.tsx` — 22 refs
- `src/app/admin/(panel)/product-votes/page.tsx` — 9 refs
- `src/app/admin/(panel)/users/page.tsx` — 9 refs
- `src/app/admin/(panel)/categories/page.tsx` — 6 refs
- `src/app/admin/(panel)/subcategories/page.tsx` — 8 refs
- `src/app/admin/(panel)/dashboard/page.tsx` — 6 refs
- `src/app/admin/(panel)/inventory/page.tsx` — 5 refs
- `src/app/admin/(panel)/timed-offers/page.tsx` — 4 refs
- `src/app/admin/(panel)/hotspot-banners/page.tsx` — 7 refs
- `src/app/admin/(panel)/hotspot-banners-plantilla1/page.tsx` — 8 refs
- `src/app/admin/(panel)/analytics/page.tsx` — 8 refs
- `src/app/admin/(panel)/vip/page.tsx` — 7 refs
- `src/app/admin/(panel)/agencias/page.tsx` — 6 refs
- `src/app/admin/(panel)/live/page.tsx` — 3 refs
- `src/app/admin/(panel)/wholesale-products/page.tsx` — 5 refs
- `src/app/admin/(panel)/products/import-jumpseller/page.tsx` — 10 refs
- `src/app/admin/(panel)/products/bulk-edit/page.tsx` — 3 refs
- `src/app/admin/(panel)/products/pack-qty/page.tsx` — 3 refs
- `src/app/admin/(panel)/products/stock-editor/page.tsx` — 3 refs
- `src/app/admin/(panel)/engagement/plantillas/page.tsx` — 2 refs
- `src/app/admin/(panel)/orders/page.tsx` — 2 refs
- `src/app/admin/theme-editor/ThemeEditorClient.tsx` — 23 refs
- `src/app/admin/(panel)/layout.tsx` — 4 refs

**Componentes:**
- `src/components/LoyaltyLevel.tsx` — 10 refs
- `src/components/LoyaltyPoints.tsx` — 5 refs
- `src/components/ProductLocator.tsx` — 10 refs
- `src/components/SmartCards.tsx` — 4 refs
- `src/components/inventario/ScanWizardModal.tsx` — 3 refs

**Context / Hooks / Lib:**
- `src/context/CartContext.tsx` — orders, products
- `src/context/FavoritesContext.tsx` — favorites
- `src/hooks/useAuth.ts` — users
- `src/lib/appwrite.ts` — constantes de colecciones
- `src/lib/appwrite-admin.ts` — constantes de colecciones
- `src/lib/appwrite-server.ts` — credenciales
- `src/lib/section-config.ts` — theme_config
- `src/lib/users-db.ts` — users
- `src/types/index.ts` — interfaces Product, Order, etc.
- `src/types/admin.ts` — interfaces admin

**API routes:**
- `src/app/api/template/route.ts` — sequences
- `src/app/api/theme-config/route.ts` — theme_config
- `src/app/api/version/route.ts` — theme_config
- `src/app/api/init-theme-config/route.ts` — ⚠️ CUENTA ANTIGUA
- `src/app/api/product-votes/route.ts` — product_votes
- `src/app/api/notifications/route.ts` — notifications
- `src/app/api/admin/fix-schema/route.ts` — schema management
- `src/app/api/admin/customers/route.ts` — users
- `src/app/api/admin/apertura/*.ts` — apertura_settings

---

## 7. Colecciones Especiales (No en el plan original)

| Colección | Atributos | Notas |
|-----------|-----------|-------|
| `store_settings` | STORENAME, ADDRESS, PHONE, EMAIL, WHATSAPP, LOGOURL, CURRENCY | 1 documento con ID fijo `store_settings_doc` |
| `page_views` | PAGE, DATE, VIEWS | Tracking de visitas, permisos `any` obligatorios |

---

## 8. Checklist Final

### Antes de migrar
- [ ] Crear nuevo proyecto Appwrite
- [ ] Anotar Project ID, Database ID, API Key
- [ ] Agregar Web Platform (localhost + dominio producción)
- [ ] Hacer `git checkout -b backup-pre-migration`

### Ejecutar migración
- [ ] Ejecutar `scripts/migrate-create-collections.ts`
- [ ] Esperar 30+ segundos (atributos en processing)
- [ ] Ejecutar `scripts/migrate-data.ts`
- [ ] Crear documento `store_template` en sequences
- [ ] Crear documento `homepage_sections` en theme_config
- [ ] Crear documento `store_settings_doc` en store_settings

### Actualizar código
- [ ] Actualizar `.env.local`
- [ ] Ejecutar script de reemplazo de credenciales
- [ ] Arreglar `init-theme-config/route.ts` (cuenta antigua)
- [ ] `npm run build` — verificar que compila
- [ ] `npm run dev` — verificar que funciona localmente

### Deploy
- [ ] Actualizar env vars en Vercel
- [ ] Redeploy
- [ ] Verificar homepage
- [ ] Verificar login
- [ ] Verificar productos
- [ ] Verificar carrito/checkout
- [ ] Verificar admin panel
- [ ] Verificar theme editor
- [ ] Verificar consola sin errores

### Post-migración
- [ ] Monitorear errores 24h
- [ ] Eliminar proyecto antiguo (después de confirmar todo OK)
- [ ] Actualizar `GUIA_PARA_IAS.md` con nuevas credenciales

---

## 9. Notas Importantes

1. **NO cambiar UPPERCASE a camelCase en esta migración** — Requiere tocar 73+ archivos y 500+ líneas. Hacerlo en una fase separada.
2. **`products` y `orders` están en el límite de atributos** — No intentar crear más atributos.
3. **Los IDs cambian** — El script de migración mapea old → new IDs para mantener relaciones.
4. **Storage buckets** — El plan gratuito solo permite 2 buckets. Si necesitas más, upgrade a Pro.
5. **Permisos** — Todas las colecciones necesitan permisos `any` para client-side writes.
6. **Rate limiting** — Appwrite tiene rate limits. Los scripts usan delays de 100ms entre operaciones.
7. **`init-theme-config/route.ts`** apunta a la cuenta MUERTA — DEBE actualizarse o eliminarse.
