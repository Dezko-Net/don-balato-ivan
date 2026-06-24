# 📚 Documentación para IAs — Yaxsel Web Store

> 🗓️ Última actualización: 18 mayo 2026  
> 🤖 Si eres una IA perdida leyendo esto: **bienvenida al infierno**. Acá está todo lo que necesitas saber para no cagarla.

---

## 🏗️ Arquitectura General

| Componente | Stack | Ubicación |
|---|---|---|
| **Frontend tienda** | Next.js 14 App Router + TypeScript + Tailwind CSS | `C:\Proyectos\PROJECT YAXSEL\web-store\` |
| **Admin panel (nuevo)** | Next.js 16 App Router + TypeScript + Tailwind | `C:\Proyectos\PROJECT YAXSEL\web-next\` |
| **Appwrite** | Cloud (nyc.cloud.appwrite.io) | Endpoint: `https://nyc.cloud.appwrite.io/v1` |
| **Templates** | Plantilla 1 (Kevin & Coco), Plantilla 2, 3, 4 (Chinamart) | `src/templates/plantilla1/`, etc. |

### ⚠️ Appwrite Config ACTUAL (la que funciona)

```
Endpoint:    https://nyc.cloud.appwrite.io/v1
Project ID:  6a0a4e8d0032177f3f90
Database ID: 6a0a58ca001798410d86
API Key:     standard_dea4a8654ed430bf3626a6cd6506a562cbfcebb7caeb417a1e83c8228ed1de0a84d60b11cc4776d023d0c5ac8d1dcb0ba59e43fef5fb8831a7252aaf5b2f13896769e2a5af222f9853d7f7abcada2d034e1d92e3b73d8de53d1c29adde00cd723aa5612189b2ee702e798acb0dffeb9ff154714a5f7af060c78567391d49923d
```

> 🔴 **LA CUENTA ANTERIOR ESTÁ MUERTA** (cuota agotada). Project: `698f6de50012f9df7ebd`, DB: `67f1dc940037b3d367bb`. No la uses.

---

## 📂 Estructura del Proyecto (web-store)

```
src/
├── app/
│   ├── admin/              # Panel admin (theme editor, store settings, products, etc.)
│   │   ├── (panel)/         # Páginas del panel con layout compartido
│   │   │   ├── dashboard/   # KPIs, revenue charts, page views stats
│   │   │   ├── products/    # CRUD productos + import Jumpseller
│   │   │   ├── store-settings/  # Config de la tienda (nombre, dirección, etc.)
│   │   │   └── ...
│   │   └── theme-editor/   # Editor visual de plantillas
│   ├── login/               # Login + Register (con logo dinámico del theme editor)
│   ├── inventario/          # Vista inventario con mapa de secciones
│   └── layout.tsx          # Root layout (providers + PageViewTracker)
├── components/              # Componentes compartidos
│   └── PageViewTracker.tsx  # Componente invisible que trackea visitas
├── context/                 # React contexts (Auth, Cart, Favorites, etc.)
├── hooks/
│   ├── useAuth.ts           # Autenticación Appwrite
│   └── usePageViewTracker.ts # Tracking de visitas + getPageViewStats()
├── lib/
│   ├── appwrite-admin.ts    # SDK config + getServices() + collection IDs
│   ├── section-config.ts    # SectionSettings interface + SECTION_DEFAULTS
│   └── users-db.ts          # Helpers para usuarios
├── templates/
│   └── plantilla1/
│       ├── HomePage.tsx     # 🐘 EL MONSTRUO: 7000+ líneas. Todo se renderiza con DOM manipulation
│       ├── Navbar.tsx       # Navbar con logo dinámico del theme editor
│       ├── shopify-fix.css  # CSS overrides (oculta branding Shopify)
│       └── mobile-responsive.css  # Responsive styles
└── types/
    ├── admin.ts             # Tipos para el admin panel
    └── index.ts             # Tipos generales
```

---

## 🐘 HomePage.tsx — La Bestia

Este archivo es **7,000+ líneas** de puro DOM manipulation con `useEffect`. No hay JSX para el template, todo se inyecta al HTML crudo del template clonado.

### Cómo funciona:
1. Se carga un HTML crudo (clonado de un sitio Shopify) en `bodyHtml`
2. Múltiples `useEffect` buscan elementos del DOM con `document.querySelector()` y les inyectan contenido
3. Los settings vienen de `sectionCfg` (array de `SectionConfig` de Appwrite)
4. Cada sección tiene su propio `useEffect` que modifica el DOM

### ⚠️ REGLAS DE ORO para editar HomePage.tsx:
- **NUNCA** reescribas bloques de más de 80 líneas
- Usa `read_file` con `offset` y `limit` para leer secciones
- Si un `edit` falla, lee de nuevo y ajusta el `old_string`
- Los selectores CSS son frágiles — si cambias uno, rompes todo

---

## 🎨 Theme Editor

### Secciones Plantilla 1

**Header (orden fijo):**
1. `tpl1_announcement_bar` — Barra de anuncios
2. `tpl1_hero` — Hero principal (logo, título, CTA)
3. `tpl1_product_widget` — Widget de productos

**Body (orden libre):**
- `tpl1_featured_products`, `tpl1_categories`, `tpl1_marquee`, etc.

**Footer (orden fijo):**
1. `tpl1_map` — 📍 Mapa interactivo (ARRIBA del footer)
2. `tpl1_subscribe_popup` — Popup de suscripción
3. `tpl1_whatsapp_button` — Botón flotante WhatsApp
4. `tpl1_chatbot_button` — Botón flotante chatbot
5. `tpl1_footer` — Footer principal (columnas, newsletter, copyright)

### Config de secciones → `src/lib/section-config.ts`

El interface `SectionSettings` tiene ~100 campos. Los defaults están en `SECTION_DEFAULTS`.

---

## 📍 Mapa Interactivo (tpl1_map)

### Cómo funciona:
- Sección independiente en el theme editor (grupo footer)
- Se inserta **ANTES** del footer con `insertBefore(footer)`
- Settings: `showMap`, `address`, `mapEmbed`, `mapHeight`, `mapStyle`
- 3 estilos: dark (🌙), light (☀️), minimal (◻️)
- Fallback: si no hay dirección en theme editor, lee de `store_settings` en Appwrite

### Archivos involucrados:
- `src/lib/section-config.ts` — Interface + defaults
- `src/app/admin/theme-editor/ThemeEditorClient.tsx` — Editor UI
- `src/templates/plantilla1/HomePage.tsx` — Renderizado (useEffect separado)
- `src/templates/plantilla1/mobile-responsive.css` — Responsive

---

## 👁️ Page Views (Tracking de Visitas)

### Colección `page_views` en Appwrite:
| Atributo | Tipo | Descripción |
|---|---|---|
| PAGE | string | Path de la página (ej: `/`, `/productos`) |
| DATE | string | Fecha YYYY-MM-DD |
| VIEWS | integer | Contador de visitas |

### ⚠️ PERMISOS CRÍTICOS:
Las colecciones `page_views` y `store_settings` necesitan permisos `any` para client-side writes:
```
permissions: ['read("any")', 'create("any")', 'update("any")', 'delete("any")']
```
**Sin estos permisos, el client-side NO puede escribir.** Se configuraron vía REST API con PUT.

### Cómo se trackea:
1. `src/components/PageViewTracker.tsx` — Componente invisible en `layout.tsx`
2. `src/hooks/usePageViewTracker.ts` — Hook que hace upsert (busca doc PAGE+DATE, si existe incrementa VIEWS, si no crea)
3. `getPageViewStats(days)` — Función para el dashboard

### Dashboard muestra:
- KPI "Visitas hoy" + "Visitas 30d"
- Top 5 páginas más visitadas con barras de progreso

---

## 🔐 Login / Register

### Archivo: `src/app/login/page.tsx`

### Logo dinámico:
- Lee el logo del theme editor (`tpl1_hero.settings.heroStoreLogoScrollUrl` o `heroStoreLogoUrl`)
- Fallback al logo del footer (`tpl1_footer.settings.logoUrl`)
- Si no hay logo, muestra el nombre de la tienda (`heroStoreName` o `companyName`)
- **ANTES** decía "Yaxsell" hardcodeado → ahora usa el logo/nombre correcto

### Mobile responsive:
- Nombres/Apellidos: `grid-cols-1 sm:grid-cols-2` (en mobile va 1 columna)
- Teléfono/RUT: `grid-cols-1 sm:grid-cols-2`
- Fecha nacimiento: `grid-cols-2` (mes/día siempre van lado a lado)
- Selects estilados con mismo estilo que inputs (rounded-2xl, bg-slate-50, etc.)
- Padding reducido en mobile: `px-5 sm:px-8`, `m-4 sm:m-6`

---

## 🗄️ Colecciones Appwrite (33+)

### Las que más se usan:
| Colección | Uso | Permisos |
|---|---|---|
| `products` | Catálogo | any read/write |
| `orders` | Pedidos | any read/write |
| `users` | Usuarios registrados | any read/write |
| `theme_config` | Config del theme editor | any read/write |
| `store_settings` | Config de la tienda (1 doc) | any read/write |
| `page_views` | Tracking de visitas | any read/write |
| `categories` | Categorías de productos | any read/write |
| `banners` | Banners del home | any read/write |

### Formato de atributos:
**TODOS los atributos son UPPERCASE** en Appwrite. Ej: `NAME`, `PRICE`, `STOCK`, `IMAGEURL`, `CATEGORYID`.  
Excepción: `jumpseller_id` (minúscula, legacy de migración).

---

## 🚨 Problemas Conocidos y Lecciones Aprendidas

### 1. Permisos de colecciones Appwrite
**Appwrite por defecto crea colecciones SIN permisos.** Si creas una colección con el SDK server-side (API key), los usuarios anónimos del client-side NO pueden leer/escribir.  
**Solución:** Usar PUT `/v1/databases/{db}/collections/{id}` con `permissions: ['read("any")', 'create("any")', ...]`  
**Script:** `scripts/fix-perms.js`

### 2. HomePage.tsx es un monstruo
7,000+ líneas de DOM manipulation. Edits incrementales de máximo 80 líneas. Si intentas reescribir algo grande, vas a romper todo.

### 3. El template es un clon de Shopify
El HTML original viene de un sitio Shopify clonado con Puppeteer. Tiene:
- Clases CSS de Shopify (`.shopify-section`, `.musk-main-footer`, etc.)
- Scripts de tracking que se ocultan con `shopify-fix.css`
- Estructura rígida que no se puede cambiar sin romper el layout

### 4. CSS en múltiples archivos
- `shopify-fix.css` — Overrides del template clonado
- `mobile-responsive.css` — Responsive styles
- Inline styles en HomePage.tsx — Estilos dinámicos del theme editor

---

## 🛠️ Scripts Útiles

| Script | Uso |
|---|---|
| `scripts/create-collections.ts` | Crear colecciones `store_settings` y `page_views` |
| `scripts/fix-perms.js` | Arreglar permisos de colecciones para client-side writes |
| `scripts/test-page-views.js` | Test de escritura client-side en `page_views` |

---

## 📝 Convenciones

- **Atributos Appwrite:** UPPERCASE (`NAME`, `PRICE`, `STORENAME`)
- **Variables TypeScript:** camelCase (`storeName`, `logoUrl`, `mapHeight`)
- **IDs de secciones:** Prefijo `tpl1_` para plantilla 1, `cm_` para Chinamart
- **Commits:** En inglés, descriptivos
- **Branch:** `main` (no hay dev/staging)

---

*Si llegaste hasta acá, buena suerte soldado 🫡. Este proyecto es un Frankenstein de templates clonados, DOM manipulation descontrolada, y Appwrite con permisos caprichosos. Pero funciona. Más o menos.*
