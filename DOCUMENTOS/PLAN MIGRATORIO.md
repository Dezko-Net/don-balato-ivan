# Plan Migratorio — Cambio de Proyecto Appwrite

> Fecha: 17 mayo 2026
> Proyecto: Yaxsel Web Store

---

## 1. Estado Actual

### Cuenta Activa (NUEVA)
- **Endpoint:** `https://nyc.cloud.appwrite.io/v1`
- **Project ID:** `6a0a4e8d0032177f3f90`
- **Database ID:** `6a0a58ca001798410d86`
- **API Key:** `standard_dea4a8654ed430bf3626a6cd6506a562cbfcebb7caeb417a1e83c8228ed1de0a84d60b11cc4776d023d0c5ac8d1dcb0ba59e43fef5fb8831a7252aaf5b2f13896769e2a5af222f9853d7f7abcada2d034e1d92e3b73d8de53d1c29adde00cd723aa5612189b2ee702e798acb0dffeb9ff154714a5f7af060c78567391d49923d`

### Cuenta Anterior (CUOTA AGOTADA — NO USAR)
- **Project ID:** `698f6de50012f9df7ebd`
- **Database ID:** `67f1dc940037b3d367bb`
- Los datos siguen ahí pero la cuota está agotada, no se pueden hacer operaciones.

---

## 2. Colecciones Actuales (31 creadas ✓)

| # | Colección | Documentos | Prioridad Migración | Notas |
|---|-----------|------------|---------------------|-------|
| 1 | `products` | 0 | 🔴 Alta | Catálogo principal, vacío |
| 2 | `inventory_products` | 267 | 🔴 Alta | Inventario importado, con datos |
| 3 | `categories` | 0 | 🔴 Alta | Vacío |
| 4 | `subcategories` | 0 | 🔴 Alta | Vacío |
| 5 | `banners` | 0 | 🟡 Media | Vacío |
| 6 | `orders` | 0 | 🔴 Alta | Vacío |
| 7 | `timed_offers` | 0 | 🟡 Media | Vacío |
| 8 | `sequences` | 1 | 🔴 Alta | `order_sequence` value=0 |
| 9 | `discount_coupons` | 0 | 🟡 Media | Vacío |
| 10 | `points_store_items` | 0 | 🟢 Baja | Vacío |
| 11 | `users` | 0 | 🔴 Alta | Vacío |
| 12 | `live_streams` | 0 | 🟡 Media | Vacío |
| 13 | `banner_overlay_positions` | 0 | 🟡 Media | Vacío |
| 14 | `house_product_positions` | 0 | 🟡 Media | Vacío |
| 15 | `hotspot_panels` | 0 | 🟡 Media | Vacío |
| 16 | `product_votes` | 0 | 🟢 Baja | Vacío |
| 17 | `reviews` | 0 | 🟡 Media | Vacío |
| 18 | `clips` | 0 | 🟡 Media | Vacío |
| 19 | `favorites` | 0 | 🟡 Media | Vacío |
| 20 | `live_raffles` | 0 | 🟢 Baja | Vacío |
| 21 | `raffle_participants` | 0 | 🟢 Baja | Vacío |
| 22 | `stock_alerts` | 0 | 🟢 Baja | Vacío |
| 23 | `notifications` | 0 | 🟡 Media | Vacío |
| 24 | `theme_config` | 0 | 🟡 Media | Vacío |
| 25 | `apertura_settings` | 0 | 🟡 Media | Vacío |
| 26 | `support_tickets` | 0 | 🟡 Media | Vacío |
| 27 | `stock_movements` | 0 | 🟢 Baja | Vacío |
| 28 | `fcm_tokens` | 0 | 🟢 Baja | Vacío |
| 29 | `order_status_history` | 0 | 🟢 Baja | Vacío |
| 30 | `wholesale_requests` | 0 | 🟡 Media | Vacío |
| 31 | `addresses` | 0 | 🟡 Media | Vacío |

### Storage Buckets
| Bucket | Estado |
|--------|--------|
| `products` | ✓ Creado (50MB max) |
| `comprobantes` | ❌ Pendiente (límite plan gratuito = 2 buckets) |
| `banners` | ❌ Pendiente |
| `categories-icons` | ❌ Pendiente |
| `live-thumbnails` | ❌ Pendiente |

---

## 3. Esquemas Detallados por Colección

### 3.1 `products` (25 atributos) — actualizado Mayo 19
| Atributo | Tipo | Size | Requerido | Default | Notas |
|----------|------|------|-----------|---------|-------|
| NAME | string | 256 | ✓ | — | |
| DESCRIPTION | string | 8192 | ✗ | — | |
| PRICE | integer | — | ✓ | — | |
| CURRENTPRICE | integer | — | ✗ | — | |
| COST | integer | — | ✗ | — | |
| STOCK | integer | — | ✓ | — | |
| SOLDQUANTITY | integer | — | ✗ | — | |
| CATEGORYID | string | 256 | ✗ | — | |
| SUBCATEGORYID | string | 256 | ✗ | — | |
| IMAGEURL | string | 2048 | ✗ | — | |
| IMAGEURL2 | string | 2048 | ✗ | — | |
| IMAGEURL3 | string | 2048 | ✗ | — | |
| RATING | double | — | ✗ | — | |
| NUMREVIEWS | integer | — | ✗ | — | |
| WHOLESALEPRICE | integer | — | ✗ | — | |
| WHOLESALEMINQUANTITY | integer | — | ✗ | — | |
| ISFEATURED | boolean | — | ✗ | — | |
| ISACTIVE | boolean | — | ✗ | — | |
| PACKQTY | integer | — | ✗ | — | |
| RESTOCKTHRESHOLD | integer | — | ✗ | — | |
| jumpseller_id | string | 256 | ✗ | — | |
| section | integer | — | ✗ | — | Nuevo |
| barcode | string | 64 | ✗ | — | Nuevo |
| sku | string | 128 | ✗ | — | Nuevo |
| COMING_SOON | boolean | — | ✗ | — | Nuevo — marca "Llegan Pronto" |
| DATE_ADDED | string | 20 | ✗ | — | Nuevo — fecha ingreso (YYYY-MM-DD) |
| ~~CUSTOM_PRIMARY_COLOR~~ | ~~string~~ | ~~50~~ | ✗ | — | ❌ Eliminado Mayo 19 |
| ~~CUSTOM_SECONDARY_COLOR~~ | ~~string~~ | ~~50~~ | ✗ | — | ❌ Eliminado Mayo 19 |
| ~~CUSTOM_USE_GRADIENT~~ | ~~boolean~~ | — | ✗ | — | ❌ Eliminado Mayo 19 |

### 3.2 `inventory_products` (25 atributos) — actualizado Mayo 19
| Atributo | Tipo | Size | Requerido | Default | Notas |
|----------|------|------|-----------|---------|-------|
| sku | string | 256 | ✗ | — | |
| barcode | string | 256 | ✗ | — | |
| NAME | string | 256 | ✓ | — | |
| PRICE | integer | — | ✗ | 0 | |
| STOCK | integer | — | ✗ | 0 | |
| CATEGORYID | string | 256 | ✗ | — | |
| SUBCATEGORYID | string | 256 | ✗ | — | |
| IMAGEURL | string | 2048 | ✗ | — | |
| IMAGEURL2 | string | 2048 | ✗ | — | |
| IMAGEURL3 | string | 2048 | ✗ | — | |
| WHOLESALEPRICE | integer | — | ✗ | — | |
| WHOLESALEMINQUANTITY | integer | — | ✗ | — | |
| ISACTIVE | boolean | — | ✗ | false | |
| published_product_id | string | 256 | ✗ | — | |
| published_at | string | 64 | ✗ | — | |
| imported_at | string | 64 | ✗ | — | |
| FEATURES | string | 2048 | ✗ | — | |
| TAGS | string | 512 | ✗ | — | |
| name_cn | string | 256 | ✗ | — | |
| IMAGEURL4 | string | 1024 | ✗ | — | |
| IMAGEURL5 | string | 1024 | ✗ | — | |
| PACKQTY | integer | — | ✗ | 0 | |
| section | integer | — | ✗ | — | Nuevo |
| COMING_SOON | boolean | — | ✗ | — | Nuevo — marca "Llegan Pronto" |
| DATE_ADDED | string | 256 | ✗ | — | Nuevo — fecha ingreso |

### 3.3 `categories` (5 atributos)
| Atributo | Tipo | Size | Requerido | Default |
|----------|------|------|-----------|---------|
| name | string | 256 | ✓ | — |
| iconUrl | string | 2048 | ✗ | — |
| order | integer | — | ✗ | — |
| color | string | 50 | ✗ | — |
| BACKGROUND_IMAGE_URL | string | 2048 | ✗ | — |

### 3.4 `subcategories` (7 atributos)
| Atributo | Tipo | Size | Requerido | Default |
|----------|------|------|-----------|---------|
| name | string | 256 | ✓ | — |
| categoryId | string | 256 | ✓ | — |
| order | integer | — | ✗ | — |
| ICON_URL | string | 2048 | ✗ | — |
| BACKGROUND_IMAGE_URL | string | 2048 | ✗ | — |
| ZOOM_BACKGROUND_IMAGE_URL | string | 2048 | ✗ | — |
| COLOR | string | 50 | ✗ | — |

### 3.5 `banners` (9 atributos)
| Atributo | Tipo | Size | Requerido | Default |
|----------|------|------|-----------|---------|
| TITLE | string | 256 | ✗ | — |
| DESCRIPTION | string | 1024 | ✗ | — |
| IMAGEURL | string | 2048 | ✓ | — |
| LINKURL | string | 2048 | ✗ | — |
| DURATION | integer | — | ✗ | — |
| ISACTIVE | boolean | — | ✗ | — |
| DISPLAYORDER | integer | — | ✗ | — |
| CLICKS | integer | — | ✗ | — |
| VIEWS | integer | — | ✗ | — |

### 3.6 `orders` (25 atributos)
| Atributo | Tipo | Size | Requerido | Default |
|----------|------|------|-----------|---------|
| USERID | string | 256 | ✗ | — |
| ORDERCODE | string | 50 | ✓ | — |
| ORDERINDEX | integer | — | ✓ | — |
| CUSTOMERNAME | string | 256 | ✓ | — |
| CUSTOMEREMAIL | string | 256 | ✗ | — |
| CUSTOMERRUT | string | 50 | ✗ | — |
| CUSTOMERPHONE | string | 50 | ✗ | — |
| REGION | string | 100 | ✗ | — |
| COMUNA | string | 100 | ✗ | — |
| ADDRESS | string | 512 | ✗ | — |
| ADDITIONALINFO | string | 512 | ✗ | — |
| ADDRESSPHOTOURL | string | 2048 | ✗ | — |
| PAYMENTMETHOD | string | 50 | ✗ | — |
| SHIPPINGAGENCY | string | 100 | ✗ | — |
| SHIPPINGADDRESS | string | 2048 | ✗ | — |
| SUBTOTAL | integer | — | ✓ | — |
| SHIPPINGCOST | integer | — | ✗ | — |
| TOTAL | integer | — | ✓ | — |
| STATUS | string | 50 | ✓ | — |
| ITEMS | string | 50000 | ✗ | — |
| CREATEDAT | integer | — | ✓ | — |
| UPDATEDAT | integer | — | ✗ | — |
| EXPIRESAT | integer | — | ✗ | — |
| AUTOCANCELENABLED | boolean | — | ✗ | — |
| PAYMENTPROOFURL | string | 2048 | ✗ | — |

### 3.7 `timed_offers` (15 atributos)
| Atributo | Tipo | Size | Requerido | Default |
|----------|------|------|-----------|---------|
| title | string | 256 | ✓ | — |
| offerType | string | 50 | ✓ | — |
| targetId | string | 256 | ✓ | — |
| productName | string | 256 | ✗ | — |
| originalPrice | integer | — | ✓ | — |
| discountPrice | integer | — | ✓ | — |
| discountPercentage | integer | — | ✓ | — |
| customImagePath | string | 2048 | ✗ | — |
| timeType | string | 50 | ✓ | — |
| durationHours | integer | — | ✗ | — |
| endDateTime | string | 100 | ✗ | — |
| status | string | 50 | ✓ | — |
| activatedAt | string | 100 | ✗ | — |
| isActive | boolean | — | ✗ | — |
| createdAt | string | 100 | ✗ | — |
| updatedAt | string | 100 | ✗ | — |

### 3.8 `sequences` (2 atributos)
| Atributo | Tipo | Size | Requerido | Default |
|----------|------|------|-----------|---------|
| key | string | 256 | ✓ | — |
| value | integer | — | ✓ | — |

### 3.9 `discount_coupons` (8 atributos) — ⚠️ CORREGIDO: admin ahora envía minúsculas
| Atributo | Tipo | Size | Requerido | Default |
|----------|------|------|-----------|---------|
| code | string | 100 | ✓ | — |
| type | string | 50 | ✓ | — |
| value | integer | — | ✓ | — |
| isActive | boolean | — | ✗ | — |
| maxUses | integer | — | ✗ | — |
| usedCount | integer | — | ✗ | — |
| minPurchase | integer | — | ✗ | — |
| expiresAt | integer | — | ✗ | — |

> **⚠️ Corrección Mayo 19:** El admin de cupones enviaba atributos en UPPERCASE (`CODE`, `TYPE`, `VALUE`, `ISACTIVE`) que no existen en la nueva cuenta. Appwrite devolvía error `Unknown attribute: "CODE"`. Se corrigió `src/app/admin/(panel)/coupons/page.tsx` para enviar solo minúsculas. La normalización al leer también fue simplificada.

> **Atributos adicionales usados por el admin pero NO en el esquema de Appwrite:** `minOrderAmount`, `maxDiscount`, `userRestriction`, `description`. Estos se envían pero Appwrite los ignora si no existen en la colección. Si se necesitan, deben crearse como atributos en la colección `discount_coupons`.

### 3.10 `points_store_items` (5 atributos)
| Atributo | Tipo | Size | Requerido | Default |
|----------|------|------|-----------|---------|
| name | string | 256 | ✓ | — |
| description | string | 2048 | ✗ | — |
| pointsCost | integer | — | ✓ | — |
| imageUrl | string | 2048 | ✗ | — |
| isActive | boolean | — | ✗ | — |

### 3.11 `users` (5 atributos)
| Atributo | Tipo | Size | Requerido | Default |
|----------|------|------|-----------|---------|
| userId | string | 256 | ✓ | — |
| email | string | 256 | ✓ | — |
| name | string | 256 | ✗ | — |
| phone | string | 100 | ✗ | — |
| createdAt | string | 100 | ✓ | — |

### 3.12 `live_streams` (13 atributos)
| Atributo | Tipo | Size | Requerido | Default |
|----------|------|------|-----------|---------|
| title | string | 256 | ✓ | — |
| description | string | 2048 | ✗ | — |
| url | string | 2048 | ✓ | — |
| platform | string | 50 | ✗ | — |
| status | string | 50 | ✓ | — |
| isActive | boolean | — | ✗ | — |
| thumbnailUrl | string | 2048 | ✗ | — |
| viewerCount | integer | — | ✗ | — |
| scheduledAt | string | 100 | ✗ | — |
| startAt | string | 100 | ✗ | — |
| muted | boolean | — | ✗ | — |
| showText | boolean | — | ✗ | — |
| allowFullscreen | boolean | — | ✗ | — |

### 3.13 `banner_overlay_positions` (12 atributos)
| Atributo | Tipo | Size | Requerido | Default |
|----------|------|------|-----------|---------|
| BANNERID | string | 256 | ✓ | — |
| PRODUCTID | string | 256 | ✓ | — |
| POSITIONX | double | — | ✓ | — |
| POSITIONY | double | — | ✓ | — |
| SCALE | double | — | ✗ | 1 |
| CIRCLESCALE | double | — | ✗ | 1 |
| DISPLAYTYPE | string | 50 | ✗ | "default" |
| CUSTOMIMAGEURL | string | 2048 | ✗ | — |
| CIRCLECOLOR | string | 50 | ✗ | "#ffffff" |
| ISACTIVE | boolean | — | ✗ | true |
| DISPLAYORDER | integer | — | ✗ | 0 |
| CLICKS | integer | — | ✗ | 0 |

### 3.14 `house_product_positions` (12 atributos)
| Atributo | Tipo | Size | Requerido | Default |
|----------|------|------|-----------|---------|
| PRODUCTID | string | 256 | ✓ | — |
| CATEGORYID | string | 256 | ✗ | "" |
| POSITIONX | double | — | ✓ | — |
| POSITIONY | double | — | ✓ | — |
| ISACTIVE | boolean | — | ✗ | true |
| DISPLAYORDER | integer | — | ✗ | 0 |
| SCALE | double | — | ✗ | 1 |
| CIRCLESCALE | double | — | ✗ | 1 |
| CUSTOMIMAGEURL | string | 2048 | ✗ | — |
| DISPLAYTYPE | string | 50 | ✗ | "default" |
| CIRCLECOLOR | string | 50 | ✗ | "#3483fa" |
| BACKGROUND | string | 50 | ✗ | "house3" |

### 3.15 `hotspot_panels` (7 atributos)
| Atributo | Tipo | Size | Requerido | Default |
|----------|------|------|-----------|---------|
| IMAGEURL | string | 2048 | ✓ | — |
| TITLE | string | 256 | ✗ | — |
| LINKURL | string | 2048 | ✗ | — |
| MOSAICGROUP | string | 50 | ✗ | "main" |
| CELLINDEX | integer | — | ✗ | 0 |
| ISACTIVE | boolean | — | ✗ | true |
| DISPLAYORDER | integer | — | ✗ | 0 |

### 3.16 `product_votes` (6 atributos)
| Atributo | Tipo | Size | Requerido | Default |
|----------|------|------|-----------|---------|
| PRODUCTTITLE | string | 256 | ✓ | — |
| USERID | string | 256 | ✗ | — |
| USERNAME | string | 256 | ✗ | — |
| USEREMAIL | string | 256 | ✗ | — |
| CREATEDAT | integer | — | ✓ | — |
| IPADDRESS | string | 256 | ✗ | — |

### 3.17 `reviews` (9 atributos)
| Atributo | Tipo | Size | Requerido | Default |
|----------|------|------|-----------|---------|
| PRODUCTID | string | 256 | ✓ | — |
| USERID | string | 256 | ✓ | — |
| USERNAME | string | 256 | ✗ | — |
| USERPROFILEIMAGEURL | string | 2048 | ✗ | — |
| RATING | integer | — | ✓ | — |
| COMMENT | string | 4096 | ✗ | — |
| CREATEDAT | integer | — | ✓ | — |
| REVIEWDATE | integer | — | ✗ | — |
| ISEDITED | boolean | — | ✗ | — |

### 3.18 `clips` (14 atributos)
| Atributo | Tipo | Size | Requerido | Default |
|----------|------|------|-----------|---------|
| TITLE | string | 256 | ✓ | — |
| DESCRIPTION | string | 2048 | ✗ | — |
| VIDEOURL | string | 2048 | ✓ | — |
| THUMBNAILURL | string | 2048 | ✗ | — |
| PRODUCTID | string | 256 | ✗ | — |
| PRODUCTNAME | string | 256 | ✗ | — |
| PRODUCTPRICE | integer | — | ✗ | — |
| PRODUCTIMAGEURL | string | 2048 | ✗ | — |
| USERID | string | 256 | ✗ | — |
| USERNAME | string | 256 | ✗ | — |
| LIKES | integer | — | ✗ | — |
| VIEWS | integer | — | ✗ | — |
| ISACTIVE | boolean | — | ✗ | — |
| CREATEDAT | integer | — | ✓ | — |

### 3.19 `favorites` (3 atributos) — camelCase
| Atributo | Tipo | Size | Requerido | Default |
|----------|------|------|-----------|---------|
| userId | string | 256 | ✓ | — |
| productId | string | 256 | ✓ | — |
| createdAt | integer | — | ✓ | — |

### 3.20 `live_raffles` (13 atributos)
| Atributo | Tipo | Size | Requerido | Default |
|----------|------|------|-----------|---------|
| TITLE | string | 256 | ✓ | — |
| DESCRIPTION | string | 2048 | ✗ | — |
| PRIZE | string | 256 | ✓ | — |
| PRIZEIMAGEURL | string | 2048 | ✗ | — |
| LIVESTREAMID | string | 256 | ✗ | — |
| STATUS | string | 50 | ✓ | — |
| PARTICIPANTS | string | 50000 | ✗ | — |
| WINNERID | string | 256 | ✗ | — |
| WINNERNAME | string | 256 | ✗ | — |
| MAXPARTICIPANTS | integer | — | ✗ | — |
| STARTSAT | integer | — | ✗ | — |
| ENDSAT | integer | — | ✗ | — |
| CREATEDAT | integer | — | ✓ | — |

### 3.21 `raffle_participants` (3 atributos) — camelCase
| Atributo | Tipo | Size | Requerido | Default |
|----------|------|------|-----------|---------|
| raffleId | string | 256 | ✓ | — |
| userId | string | 256 | ✓ | — |
| participatedAt | integer | — | ✓ | — |

### 3.22 `stock_alerts` (3 atributos) — camelCase
| Atributo | Tipo | Size | Requerido | Default |
|----------|------|------|-----------|---------|
| productId | string | 256 | ✓ | — |
| userId | string | 256 | ✓ | — |
| createdAt | integer | — | ✓ | — |

### 3.23 `notifications` (5 atributos) — camelCase
| Atributo | Tipo | Size | Requerido | Default |
|----------|------|------|-----------|---------|
| title | string | 256 | ✓ | — |
| message | string | 4096 | ✓ | — |
| type | string | 50 | ✗ | — |
| userId | string | 256 | ✗ | — |
| isRead | boolean | — | ✗ | — |

### 3.24 `theme_config` (1 atributo)
| Atributo | Tipo | Size | Requerido | Default |
|----------|------|------|-----------|---------|
| config | string | 50000 | ✗ | — |

### 3.25 `apertura_settings` (5 atributos) — camelCase
| Atributo | Tipo | Size | Requerido | Default |
|----------|------|------|-----------|---------|
| isActive | boolean | — | ✗ | — |
| discountPercent | integer | — | ✗ | — |
| minPurchase | integer | — | ✗ | — |
| createdAt | string | 100 | ✗ | — |
| updatedAt | string | 100 | ✗ | — |

### 3.26 `support_tickets` (6 atributos) — camelCase
| Atributo | Tipo | Size | Requerido | Default |
|----------|------|------|-----------|---------|
| userId | string | 256 | ✓ | — |
| subject | string | 256 | ✓ | — |
| message | string | 4096 | ✓ | — |
| status | string | 50 | ✓ | — |
| priority | string | 50 | ✗ | — |
| adminNotes | string | 4096 | ✗ | — |

### 3.27 `stock_movements` (5 atributos) — camelCase
| Atributo | Tipo | Size | Requerido | Default |
|----------|------|------|-----------|---------|
| productId | string | 256 | ✓ | — |
| productName | string | 256 | ✗ | — |
| type | string | 50 | ✓ | — |
| quantity | integer | — | ✓ | — |
| reason | string | 512 | ✗ | — |

### 3.28 `fcm_tokens` (3 atributos) — camelCase
| Atributo | Tipo | Size | Requerido | Default |
|----------|------|------|-----------|---------|
| userId | string | 256 | ✗ | — |
| token | string | 512 | ✓ | — |
| createdAt | integer | — | ✓ | — |

### 3.29 `order_status_history` (4 atributos) — camelCase
| Atributo | Tipo | Size | Requerido | Default |
|----------|------|------|-----------|---------|
| orderId | string | 256 | ✓ | — |
| status | string | 50 | ✓ | — |
| createdAt | integer | — | ✓ | — |
| notes | string | 2048 | ✗ | — |

### 3.30 `wholesale_requests` (9 atributos) — camelCase
| Atributo | Tipo | Size | Requerido | Default |
|----------|------|------|-----------|---------|
| userId | string | 256 | ✗ | — |
| companyName | string | 256 | ✓ | — |
| rut | string | 50 | ✓ | — |
| email | string | 256 | ✓ | — |
| phone | string | 100 | ✓ | — |
| status | string | 50 | ✓ | — |
| adminNotes | string | 4096 | ✗ | — |
| rejectionReason | string | 1024 | ✗ | — |
| createdAt | integer | — | ✓ | — |

### 3.31 `addresses` (7 atributos) — camelCase
| Atributo | Tipo | Size | Requerido | Default |
|----------|------|------|-----------|---------|
| userId | string | 256 | ✓ | — |
| name | string | 256 | ✓ | — |
| address | string | 512 | ✓ | — |
| city | string | 256 | ✓ | — |
| region | string | 256 | ✓ | — |
| phone | string | 100 | ✓ | — |
| isDefault | boolean | — | ✗ | — |

---

## 4. Problema de Nomenclatura Inconsistente

### ⚠️ Hallazgo crítico: mezcla de UPPERCASE y camelCase

Las colecciones usan **dos convenciones distintas** para los nombres de atributos:

**UPPERCASE (colecciones legacy/original):**
- `products`, `banners`, `orders`, `banner_overlay_positions`, `house_product_positions`, `hotspot_panels`, `product_votes`, `reviews`, `clips`, `live_raffles`

**camelCase (colecciones nuevas):**
- `categories`, `subcategories`, `favorites`, `raffle_participants`, `stock_alerts`, `notifications`, `theme_config`, `apertura_settings`, `support_tickets`, `stock_movements`, `fcm_tokens`, `order_status_history`, `wholesale_requests`, `addresses`, `users`, `live_streams`, `timed_offers`, `discount_coupons`, `points_store_items`, `inventory_products`

### Recomendación para migración:
**Unificar a camelCase** en el nuevo proyecto. Esto requiere:
1. Crear colecciones con atributos en camelCase
2. Mapear datos antiguos: `NAME` → `name`, `IMAGEURL` → `imageUrl`, etc.
3. Actualizar todo el código frontend para usar camelCase

---

## 5. Plan de Migración Paso a Paso

### Fase 1: Preparación del nuevo proyecto
1. Crear nuevo proyecto Appwrite
2. Crear database
3. Crear colecciones con **nombres unificados en camelCase**
4. Crear storage buckets (mínimo 5: products, comprobantes, banners, categories-icons, live-thumbnails)
5. Configurar API keys y permisos

### Fase 2: Script de migración de esquemas
1. Crear script que:
   - Lea los esquemas de la cuenta antigua (si la cuota lo permite)
   - Genere las colecciones en el nuevo proyecto con nombres camelCase
   - Incluya todos los índices necesarios
2. Si la cuota antigua no permite lectura, usar los esquemas documentados en este plan

### Fase 3: Migración de datos
1. Exportar datos de cuenta antigua (si la cuota lo permite)
   - Si no: reconstruir desde cero (la mayoría están vacíos)
   - `inventory_products`: 267 documentos con datos de Excel importado
   - `sequences`: 1 documento (order_sequence)
2. Importar datos al nuevo proyecto con mapeo de atributos
3. Verificar integridad de datos

### Fase 4: Actualización del código
1. Actualizar `src/lib/appwrite.ts` y `src/lib/appwrite-admin.ts`:
   - Nuevos Project ID, Database ID, Endpoint
   - Nuevos nombres de colecciones si cambiaron
2. Actualizar todos los archivos que referencian atributos UPPERCASE:
   - Cambiar `NAME` → `name`, `IMAGEURL` → `imageUrl`, etc.
   - Actualizar `Query.equal('NAME', ...)` → `Query.equal('name', ...)`
   - Actualizar `doc.NAME` → `doc.name`
3. Actualizar tipos en `src/types/index.ts` y `src/types/admin.ts`
4. Actualizar `.env.local` y variables de Vercel

### Fase 5: Migración de Storage
1. Descargar archivos del bucket antiguo (si la cuota lo permite)
2. Subir archivos al nuevo bucket
3. Actualizar URLs en documentos que referencien archivos del bucket antiguo

### Fase 6: Testing y deploy
1. Probar todas las funcionalidades en el nuevo proyecto
2. Actualizar env vars en Vercel
3. Redeploy
4. Monitorear errores en producción

---

## 6. Mapeo de Atributos UPPERCASE → camelCase

### `products`
| UPPERCASE (actual) | camelCase (nuevo) |
|--------------------|-------------------|
| NAME | name |
| DESCRIPTION | description |
| PRICE | price |
| CURRENTPRICE | currentPrice |
| COST | cost |
| STOCK | stock |
| SOLDQUANTITY | soldQuantity |
| CATEGORYID | categoryId |
| SUBCATEGORYID | subcategoryId |
| SELLERID | sellerId |
| IMAGEURL | imageUrl |
| IMAGEURL2 | imageUrl2 |
| IMAGEURL3 | imageUrl3 |
| RATING | rating |
| NUMREVIEWS | numReviews |
| WHOLESALEPRICE | wholesalePrice |
| WHOLESALEMINQUANTITY | wholesaleMinQuantity |
| ISFEATURED | isFeatured |
| ISACTIVE | isActive |
| PACKQTY | packQty |
| RESTOCKTHRESHOLD | restockThreshold |
| CUSTOM_PRIMARY_COLOR | customPrimaryColor |
| CUSTOM_SECONDARY_COLOR | customSecondaryColor |
| CUSTOM_USE_GRADIENT | customUseGradient |
| jumpseller_id | jumpsellerId |

### `banners`
| UPPERCASE | camelCase |
|-----------|----------|
| TITLE | title |
| DESCRIPTION | description |
| IMAGEURL | imageUrl |
| LINKURL | linkUrl |
| DURATION | duration |
| ISACTIVE | isActive |
| DISPLAYORDER | displayOrder |
| CLICKS | clicks |
| VIEWS | views |

### `orders`
| UPPERCASE | camelCase |
|-----------|----------|
| USERID | userId |
| ORDERCODE | orderCode |
| ORDERINDEX | orderIndex |
| CUSTOMERNAME | customerName |
| CUSTOMEREMAIL | customerEmail |
| CUSTOMERRUT | customerRut |
| CUSTOMERPHONE | customerPhone |
| REGION | region |
| COMUNA | comuna |
| ADDRESS | address |
| ADDITIONALINFO | additionalInfo |
| ADDRESSPHOTOURL | addressPhotoUrl |
| PAYMENTMETHOD | paymentMethod |
| SHIPPINGAGENCY | shippingAgency |
| SHIPPINGADDRESS | shippingAddress |
| SUBTOTAL | subtotal |
| SHIPPINGCOST | shippingCost |
| TOTAL | total |
| STATUS | status |
| ITEMS | items |
| CREATEDAT | createdAt |
| UPDATEDAT | updatedAt |
| EXPIRESAT | expiresAt |
| AUTOCANCELENABLED | autoCancelEnabled |
| PAYMENTPROOFURL | paymentProofUrl |

### `banner_overlay_positions`
| UPPERCASE | camelCase |
|-----------|----------|
| BANNERID | bannerId |
| PRODUCTID | productId |
| POSITIONX | positionX |
| POSITIONY | positionY |
| SCALE | scale |
| CIRCLESCALE | circleScale |
| DISPLAYTYPE | displayType |
| CUSTOMIMAGEURL | customImageUrl |
| CIRCLECOLOR | circleColor |
| ISACTIVE | isActive |
| DISPLAYORDER | displayOrder |
| CLICKS | clicks |

### `house_product_positions`
| UPPERCASE | camelCase |
|-----------|----------|
| PRODUCTID | productId |
| CATEGORYID | categoryId |
| POSITIONX | positionX |
| POSITIONY | positionY |
| ISACTIVE | isActive |
| DISPLAYORDER | displayOrder |
| SCALE | scale |
| CIRCLESCALE | circleScale |
| CUSTOMIMAGEURL | customImageUrl |
| DISPLAYTYPE | displayType |
| CIRCLECOLOR | circleColor |
| BACKGROUND | background |

### `hotspot_panels`
| UPPERCASE | camelCase |
|-----------|----------|
| IMAGEURL | imageUrl |
| TITLE | title |
| LINKURL | linkUrl |
| MOSAICGROUP | mosaicGroup |
| CELLINDEX | cellIndex |
| ISACTIVE | isActive |
| DISPLAYORDER | displayOrder |

### `product_votes`
| UPPERCASE | camelCase |
|-----------|----------|
| PRODUCTTITLE | productTitle |
| USERID | userId |
| USERNAME | userName |
| USEREMAIL | userEmail |
| CREATEDAT | createdAt |
| IPADDRESS | ipAddress |

### `reviews`
| UPPERCASE | camelCase |
|-----------|----------|
| PRODUCTID | productId |
| USERID | userId |
| USERNAME | userName |
| USERPROFILEIMAGEURL | userProfileImageUrl |
| RATING | rating |
| COMMENT | comment |
| CREATEDAT | createdAt |
| REVIEWDATE | reviewDate |
| ISEDITED | isEdited |

### `clips`
| UPPERCASE | camelCase |
|-----------|----------|
| TITLE | title |
| DESCRIPTION | description |
| VIDEOURL | videoUrl |
| THUMBNAILURL | thumbnailUrl |
| PRODUCTID | productId |
| PRODUCTNAME | productName |
| PRODUCTPRICE | productPrice |
| PRODUCTIMAGEURL | productImageUrl |
| USERID | userId |
| USERNAME | userName |
| LIKES | likes |
| VIEWS | views |
| ISACTIVE | isActive |
| CREATEDAT | createdAt |

### `live_raffles`
| UPPERCASE | camelCase |
|-----------|----------|
| TITLE | title |
| DESCRIPTION | description |
| PRIZE | prize |
| PRIZEIMAGEURL | prizeImageUrl |
| LIVESTREAMID | liveStreamId |
| STATUS | status |
| PARTICIPANTS | participants |
| WINNERID | winnerId |
| WINNERNAME | winnerName |
| MAXPARTICIPANTS | maxParticipants |
| STARTSAT | startsAt |
| ENDSAT | endsAt |
| CREATEDAT | createdAt |

### `inventory_products` (ya mayormente camelCase, solo algunos UPPERCASE)
| Actual | Nuevo |
|--------|-------|
| NAME | name |
| PRICE | price |
| STOCK | stock |
| CATEGORYID | categoryId |
| SUBCATEGORYID | subcategoryId |
| IMAGEURL | imageUrl |
| IMAGEURL2 | imageUrl2 |
| IMAGEURL3 | imageUrl3 |
| WHOLESALEPRICE | wholesalePrice |
| WHOLESALEMINQUANTITY | wholesaleMinQuantity |
| ISACTIVE | isActive |
| FEATURES | features |
| TAGS | tags |
| IMAGEURL4 | imageUrl4 |
| IMAGEURL5 | imageUrl5 |

### `subcategories` (algunos UPPERCASE)
| Actual | Nuevo |
|--------|-------|
| ICON_URL | iconUrl |
| BACKGROUND_IMAGE_URL | backgroundImageUrl |
| ZOOM_BACKGROUND_IMAGE_URL | zoomBackgroundImageUrl |
| COLOR | color |

### `categories` (algunos UPPERCASE)
| Actual | Nuevo |
|--------|-------|
| BACKGROUND_IMAGE_URL | backgroundImageUrl |

---

## 7. Archivos del Código que Necesitan Actualización

### Archivos de configuración
- `src/lib/appwrite.ts` — Constantes de colecciones, queries, acceso a atributos
- `src/lib/appwrite-admin.ts` — Constantes de colecciones, config
- `.env.local` — Endpoint, Project ID, Database ID
- Vercel environment variables

### Archivos que usan atributos UPPERCASE (estimado)
- `src/app/inventario/page.tsx` — products, inventory_products
- `src/app/admin/**/page.tsx` — todas las páginas admin
- `src/app/product/[id]/page.tsx` — detalle producto
- `src/app/page.tsx` — homepage
- `src/context/FavoritesContext.tsx` — favorites
- `src/context/CartContext.tsx` — orders, products
- `src/hooks/useAuth.ts` — users
- `src/types/index.ts` — interfaces TypeScript
- `src/types/admin.ts` — interfaces admin
- API routes en `src/app/api/`

### Estimación de esfuerzo
- ~40-60 archivos necesitan cambios de atributos
- ~500-800 líneas de código afectadas
- Tiempo estimado: 2-3 días de trabajo

---

## 8. Riesgos y Consideraciones

### Riesgos altos
1. **Cuota agotada en cuenta antigua** — No se pueden leer datos para migrar
2. **Attribute size limits** — Appwrite tiene límites estrictos (50KB total por colección)
3. **Referencias $id** — Los document IDs cambian al migrar, rompiendo relaciones (CATEGORYID, PRODUCTID, etc.)
4. **Storage URLs** — Las URLs de archivos cambian con nuevo bucket/project

### Riesgos medios
5. **Inconsistencia de nomenclatura** — Mezcla UPPERCASE/camelCase dificulta mapeo
6. **Plan gratuito Appwrite** — Solo 2 buckets, 5 colecciones con índices, límites de documentos
7. **Datos en inventory_products** — 267 productos importados que podrían perderse

### Mitigaciones
- Si la cuenta antigua no permite lectura: reconstruir datos desde Excel original
- Crear script de migración automático con mapeo de atributos
- Hacer backup completo antes de cualquier cambio
- Migrar en paralelo: mantener cuenta actual activa hasta verificar la nueva

---

## 9. Decisión Pendiente

### Opción A: Migrar a nuevo proyecto Appwrite
- **Pros:** Limpieza total, nomenclatura unificada, sin datos basura
- **Contras:** Trabajo significativo (2-3 días), riesgo de romper relaciones, posible pérdida de datos

### Opción B: Quedarse en proyecto actual y solo limpiar
- **Pros:** Sin riesgo de migración, datos intactos
- **Contras:** Nomenclatura inconsistente, cuota limitada del plan gratuito

### Opción C: Upgrade a plan pago en Appwrite actual
- **Pros:** Más buckets, más recursos, sin migración
- **Contras:** Costo mensual

---

## 10. Atributos Faltantes Detectados y Correcciones (Mayo 19, 2026)

### ⚠️ Colecciones que alcanzaron el límite de atributos (`attribute_limit_exceeded`)
Estas colecciones **NO** pueden recibir más atributos en el plan gratuito:

| Colección | Atributos actuales | Faltan en código | Solución |
|-----------|-------------------|------------------|----------|
| `products` | 24 | `IMAGEURL4`, `IMAGEURL5`, `TAGS`, `FEATURES` | Mover TAGS/FEATURES a DESCRIPTION; imágenes 4-5 al campo DESCRIPTION o usar storage |
| `orders` | 25 | `adminNotes` | Usar `order_status_history.notes` como workaround |

### Atributos creados en esta sesión (processing → available)
| Colección | Atributo | Tipo | Default |
|-----------|----------|------|---------|
| `inventory_products` | `PACKQTY` | integer | 0 |
| `users` | `adminNotes` | string(4096) | — |
| `users` | `isWholesale` | boolean | false |
| `users` | `isBanned` | boolean | false |
| `users` | `lastAccessAt` | string(100) | — |
| `users` | `profileCreatedAt` | string(100) | — |
| `users` | `region` | string(100) | — |

### Atributos que YA EXISTÍAN pero no estaban en el plan original
| Colección | Atributo | Tipo |
|-----------|----------|------|
| `orders` | `ISGIFT` | boolean |
| `orders` | `CUSTOMERNOTE` | string |
| `orders` | `PURCHASEDFROMLIVE` | boolean |
| `orders` | `COUPONCODE` | string |
| `theme_config` | `NAME` | string |
| `theme_config` | `SECTIONS` | string |
| `products` | `jumpseller_id` | string |

### 3.1 `products` — esquema REAL actualizado (25 atributos, Mayo 19)
> ⚠️ Se eliminaron `CUSTOM_PRIMARY_COLOR`, `CUSTOM_SECONDARY_COLOR`, `CUSTOM_USE_GRADIENT`. Se agregaron `section`, `barcode`, `sku`, `COMING_SOON`, `DATE_ADDED`.

| Atributo | Tipo | Size | Requerido | Default |
|----------|------|------|-----------|---------|
| NAME | string | 256 | ✓ | — |
| DESCRIPTION | string | 8192 | ✗ | — |
| PRICE | integer | — | ✓ | — |
| CURRENTPRICE | integer | — | ✗ | — |
| COST | integer | — | ✗ | — |
| STOCK | integer | — | ✓ | — |
| SOLDQUANTITY | integer | — | ✗ | — |
| CATEGORYID | string | 256 | ✗ | — |
| SUBCATEGORYID | string | 256 | ✗ | — |
| IMAGEURL | string | 2048 | ✗ | — |
| IMAGEURL2 | string | 2048 | ✗ | — |
| IMAGEURL3 | string | 2048 | ✗ | — |
| RATING | double | — | ✗ | — |
| NUMREVIEWS | integer | — | ✗ | — |
| WHOLESALEPRICE | integer | — | ✗ | — |
| WHOLESALEMINQUANTITY | integer | — | ✗ | — |
| ISFEATURED | boolean | — | ✗ | — |
| ISACTIVE | boolean | — | ✗ | — |
| PACKQTY | integer | — | ✗ | — |
| RESTOCKTHRESHOLD | integer | — | ✗ | — |
| jumpseller_id | string | 256 | ✗ | — |
| section | integer | — | ✗ | — |
| barcode | string | 64 | ✗ | — |
| sku | string | 128 | ✗ | — |
| COMING_SOON | boolean | — | ✗ | — |
| DATE_ADDED | string | 20 | ✗ | — |

### 3.2 `inventory_products` — esquema REAL actualizado (25 atributos, Mayo 19)
| Atributo | Tipo | Size | Requerido | Default |
|----------|------|------|-----------|---------|
| sku | string | 256 | ✗ | — |
| barcode | string | 256 | ✗ | — |
| NAME | string | 256 | ✓ | — |
| PRICE | integer | — | ✗ | 0 |
| STOCK | integer | — | ✗ | 0 |
| CATEGORYID | string | 256 | ✗ | — |
| SUBCATEGORYID | string | 256 | ✗ | — |
| IMAGEURL | string | 2048 | ✗ | — |
| IMAGEURL2 | string | 2048 | ✗ | — |
| IMAGEURL3 | string | 2048 | ✗ | — |
| WHOLESALEPRICE | integer | — | ✗ | — |
| WHOLESALEMINQUANTITY | integer | — | ✗ | — |
| ISACTIVE | boolean | — | ✗ | false |
| published_product_id | string | 256 | ✗ | — |
| published_at | string | 64 | ✗ | — |
| imported_at | string | 64 | ✗ | — |
| FEATURES | string | 2048 | ✗ | — |
| TAGS | string | 512 | ✗ | — |
| name_cn | string | 256 | ✗ | — |
| IMAGEURL4 | string | 1024 | ✗ | — |
| IMAGEURL5 | string | 1024 | ✗ | — |
| PACKQTY | integer | — | ✗ | 0 |
| section | integer | — | ✗ | — |
| COMING_SOON | boolean | — | ✗ | — |
| DATE_ADDED | string | 256 | ✗ | — |

### 3.11 `users` — esquema REAL actualizado (11 atributos)
| Atributo | Tipo | Size | Requerido | Default |
|----------|------|------|-----------|---------|
| userId | string | 256 | ✓ | — |
| email | string | 256 | ✓ | — |
| name | string | 256 | ✗ | — |
| phone | string | 100 | ✗ | — |
| createdAt | string | 100 | ✓ | — |
| adminNotes | string | 4096 | ✗ | — |
| isWholesale | boolean | — | ✗ | false |
| isBanned | boolean | — | ✗ | false |
| lastAccessAt | string | 100 | ✗ | — |
| profileCreatedAt | string | 100 | ✗ | — |
| region | string | 100 | ✗ | — |

### 3.6 `orders` — esquema REAL actualizado (29 atributos)
| Atributo | Tipo | Size | Requerido | Default |
|----------|------|------|-----------|---------|
| USERID | string | 256 | ✗ | — |
| ORDERCODE | string | 50 | ✓ | — |
| ORDERINDEX | integer | — | ✓ | — |
| CUSTOMERNAME | string | 256 | ✓ | — |
| CUSTOMEREMAIL | string | 256 | ✗ | — |
| CUSTOMERRUT | string | 50 | ✗ | — |
| CUSTOMERPHONE | string | 50 | ✗ | — |
| REGION | string | 100 | ✗ | — |
| COMUNA | string | 100 | ✗ | — |
| ADDRESS | string | 512 | ✗ | — |
| ADDITIONALINFO | string | 512 | ✗ | — |
| ADDRESSPHOTOURL | string | 2048 | ✗ | — |
| PAYMENTMETHOD | string | 50 | ✗ | — |
| SHIPPINGAGENCY | string | 100 | ✗ | — |
| SHIPPINGADDRESS | string | 2048 | ✗ | — |
| SUBTOTAL | integer | — | ✓ | — |
| SHIPPINGCOST | integer | — | ✗ | — |
| TOTAL | integer | — | ✓ | — |
| STATUS | string | 50 | ✓ | — |
| ITEMS | string | 50000 | ✗ | — |
| CREATEDAT | integer | — | ✓ | — |
| UPDATEDAT | integer | — | ✗ | — |
| EXPIRESAT | integer | — | ✗ | — |
| AUTOCANCELENABLED | boolean | — | ✗ | — |
| PAYMENTPROOFURL | string | 2048 | ✗ | — |
| ISGIFT | boolean | — | ✗ | — |
| CUSTOMERNOTE | string | 2048 | ✗ | — |
| PURCHASEDFROMLIVE | boolean | — | ✗ | — |
| COUPONCODE | string | 100 | ✗ | — |

---

## 11. Recomendaciones para la IA que ejecute la migración

### 📋 Antes de empezar
1. **Verificar cuota Appwrite** — La cuenta antigua (`698f6de50012f9df7ebd`) puede tener cuota agotada. Si no se puede leer, usar los esquemas de este documento.
2. **Hacer backup del código actual** — `git checkout -b backup-pre-migration`
3. **Leer TODO este documento** antes de escribir una sola línea de código.
4. **No intentar crear atributos en `products` ni `orders`** — Ambas colecciones están en el límite (`attribute_limit_exceeded`). Cualquier intento fallará con error 400.

### 🏗️ Orden de migración recomendado
1. **Primero colecciones sin dependencias**: `sequences`, `categories`, `subcategories`, `theme_config`, `apertura_settings`
2. **Luego colecciones con referencias simples**: `products` (ref a categories), `banners`, `discount_coupons`, `users`
3. **Después colecciones que dependen de products/users**: `orders`, `reviews`, `favorites`, `inventory_products`, `timed_offers`
4. **Al final colecciones derivadas**: `order_status_history`, `stock_movements`, `support_tickets`, `wholesale_requests`, etc.

### ⚠️ Problemas críticos conocidos
1. **`products` y `orders` están en el límite de atributos** — No se pueden agregar más campos. Si necesitas más atributos, debes:
   - Eliminar atributos poco usados (ej: `CUSTOM_PRIMARY_COLOR`, `CUSTOM_SECONDARY_COLOR`, `CUSTOM_USE_GRADIENT`)
   - O hacer upgrade a plan Pro
2. **Nomenclatura inconsistente** — `products` usa UPPERCASE, `users` usa camelCase. Recomendación: **NO cambiar** en esta migración, solo documentar. Unificar requeriría tocar 40-60 archivos.
3. **`inventory_products` → `products` publish** — El payload de publicación fue ajustado para NO enviar `IMAGEURL4`, `IMAGEURL5`, `TAGS`, `FEATURES` porque no existen en `products`. Ver `src/app/inventario/page.tsx` líneas 918-934.
4. **IDs cambian al migrar** — Los `$id` de documentos cambian. Cualquier campo que referencie otro documento (CATEGORYID, PRODUCTID, USERID, etc.) debe ser mapeado con una tabla de old_id → new_id.
5. **`discount_coupons` solo acepta minúsculas** — La nueva cuenta NO tiene atributos UPPERCASE. El admin fue corregido (Mayo 19). Ver sección 3.9 arriba.
6. **Cookie banner z-index** — La navbar inferior móvil tiene `z-index: 9998`. El cookie banner fue subido a `z-index: 10000` para no quedar oculto debajo.

### 🔧 Script de migración sugerido
```typescript
// Estructura base para script de migración
const OLD = { endpoint: '...', project: '698f6de50012f9df7ebd', db: '67f1dc940037b3d367bb' };
const NEW = { endpoint: 'https://nyc.cloud.appwrite.io/v1', project: '6a0a4e8d0032177f3f90', db: '6a0a58ca001798410d86' };

// Tabla de mapeo de IDs
const idMap = new Map<string, string>(); // oldId → newId

async function migrateCollection(collId: string, transform?: (doc: any) => any) {
  // 1. Leer todos los documentos de OLD (si la cuota lo permite)
  // 2. Para cada documento:
  //    a. Transformar datos si es necesario (renombrar atributos)
  //    b. Reemplazar referencias $id usando idMap
  //    c. Crear documento en NEW
  //    d. Guardar mapeo oldId → newId en idMap
  // 3. Rate limiting: 1 request cada 200ms para no exceder cuota
}
```

### 📦 Storage buckets pendientes
El plan gratuito solo permite 2 buckets. Actualmente existen:
- `products` ✓
- `comprobantes` ✓

Faltan (requieren upgrade a plan Pro o eliminar uno existente):
- `banners`
- `categories-icons`
- `live-thumbnails`

### 🚨 No tocar estas cosas
- **No cambiar nombres de colecciones** — El código usa constantes en `src/lib/appwrite.ts`
- **No eliminar atributos existentes** — Aunque parezca que no se usan, pueden estar referenciados
- **No cambiar UPPERCASE a camelCase** — Requiere cambios en 40-60 archivos, mejor hacerlo en una fase separada
- **No modificar `inventory_products`** — Tiene 267 documentos con datos de inventario reales
- **No enviar atributos UPPERCASE a `discount_coupons`** — La nueva cuenta solo tiene minúsculas, enviar mayúsculas causa error `Unknown attribute`

---

## 12. Cambios de Sesión — Mayo 19, 2026

### ✅ Correcciones aplicadas
| Issue | Archivo | Cambio |
|-------|---------|--------|
| Error `Unknown attribute: "CODE"` al crear cupón | `src/app/admin/(panel)/coupons/page.tsx` | Payload ahora envía solo minúsculas (`code`, `type`, `value`, `isActive`). Normalización simplificada. |
| Cookie banner oculto bajo navbar móvil | `src/components/CookieConsent.tsx` | `z-index` subido de 9990 → 10000. Padding/font compactado para móvil. |
| FAQ feo en móvil | `src/templates/plantilla1/mobile-responsive.css` | Titlebox border-radius 50px→20px, accordion con sombra/color activo, texto centrado. |
| Banner con Texto: sin imagen móvil | `src/lib/section-config.ts` | Agregado `overlayMobileBgImage` al tipo `SectionSettings`. |
| Banner con Texto: sin imagen móvil | `src/templates/plantilla1/HomePage.tsx` | Lógica JS detecta `window.innerWidth <= 768` y usa imagen móvil si existe. |
| Banner con Texto: sin imagen móvil | `src/app/admin/theme-editor/ThemeEditorClient.tsx` | Campo "Imagen de fondo (Móvil)" en editor. |
| Video con Texto: sin imagen móvil | `src/lib/section-config.ts` | Agregado `vtMobilePosterImage` al tipo `SectionSettings`. |
| Video con Texto: sin imagen móvil | `src/templates/plantilla1/HomePage.tsx` | Lógica JS para poster móvil si existe. |
| Video con Texto: sin imagen móvil | `src/app/admin/theme-editor/ThemeEditorClient.tsx` | Campo "Imagen poster (Móvil)" en editor. |

### ⚠️ Atributos de `discount_coupons` que el admin envía pero NO existen en Appwrite
Estos campos se envían en el payload pero Appwrite los rechazará si no están creados como atributos:
- `minOrderAmount` (integer) — monto mínimo de compra
- `maxDiscount` (integer) — descuento máximo
- `userRestriction` (string) — restricción por usuario
- `description` (string) — descripción del cupón

**Acción pendiente:** Crear estos 4 atributos en la colección `discount_coupons` en Appwrite, o eliminarlos del payload del admin.

---

## 13. Gestión de Atributos vía API (Mayo 19, 2026)

### 🚀 Método rápido: usar `node-appwrite` SDK con API Key

Para crear/eliminar atributos en colecciones de Appwrite sin tocar la UI, se usa el SDK de servidor `node-appwrite` con la API Key del proyecto. Esto permite automatizar cambios de esquema en segundos.

#### Script disponible: `scripts/add-missing-attributes.ts`

```bash
# Desde la raíz del proyecto:
$env:APPWRITE_API_KEY="standard_dea4a8654ed430bf3626a6cd6506a562cbfcebb7caeb417a1e83c8228ed1de0a84d60b11cc4776d023d0c5ac8d1dcb0ba59e43fef5fb8831a7252aaf5b2f13896769e2a5af222f9853d7f7abcada2d034e1d92e3b73d8de53d1c29adde00cd723aa5612189b2ee702e798acb0dffeb9ff154714a5f7af060c78567391d49923d"
npx tsx scripts/add-missing-attributes.ts
```

El script recorre las colecciones `products` e `inventory_products` y crea los atributos faltantes. Si un atributo ya existe, lo salta (`⏭️`). Si la colección está en el límite, muestra error (`❌`).

#### Comandos rápidos para operaciones puntuales

```powershell
# Listar atributos de una colección
$env:APPWRITE_API_KEY="..."; npx tsx -e "const {Client,Databases}=require('node-appwrite');const c=new Client().setEndpoint('https://nyc.cloud.appwrite.io/v1').setProject('6a0a4e8d0032177f3f90').setKey(process.env.APPWRITE_API_KEY);const db=new Databases(c);db.listAttributes('6a0a58ca001798410d86','COLLECTION_ID').then(r=>{r.attributes.forEach(a=>console.log(a.key,'|',a.type,'|',a.size||''))}).catch(e=>console.error(e.message))"

# Crear atributo string
$env:APPWRITE_API_KEY="..."; npx tsx -e "const {Client,Databases}=require('node-appwrite');const c=new Client().setEndpoint('https://nyc.cloud.appwrite.io/v1').setProject('6a0a4e8d0032177f3f90').setKey(process.env.APPWRITE_API_KEY);const db=new Databases(c);db.createStringAttribute('6a0a58ca001798410d86','COLLECTION_ID','ATTR_NAME',SIZE,REQUIRED).then(()=>console.log('✅ Created')).catch(e=>console.error('❌',e.message))"

# Crear atributo boolean
db.createBooleanAttribute(databaseId, collectionId, 'ATTR_NAME', required)

# Crear atributo integer
db.createIntegerAttribute(databaseId, collectionId, 'ATTR_NAME', required)

# Eliminar atributo
db.deleteAttribute(databaseId, collectionId, 'ATTR_NAME')
```

#### ⚠️ Notas importantes
- **La API Key está hardcodeada** en `src/lib/appwrite-server.ts` como fallback del env var `APPWRITE_API_KEY`
- **Los atributos eliminados tardan ~30s** en desaparecer del límite de tamaño. No intentar crear uno nuevo inmediatamente después de eliminar.
- **El límite es por tamaño total**, no por cantidad. Un `string(8192)` consume mucho más que un `string(20)`. Si falla con `attribute_limit_exceeded`, usar un size menor o eliminar atributos grandes innecesarios.
- **Appwrite tarda ~30s** en procesar un atributo nuevo (estado `processing` → `available`). No hacer queries que usen el atributo hasta que esté `available`.

### ✅ Atributos creados en esta sesión (Mayo 19, 2026 — 19:00)

| Colección | Atributo | Tipo | Size | Método |
|-----------|----------|------|------|--------|
| `products` | `COMING_SOON` | boolean | — | `add-missing-attributes.ts` |
| `products` | `DATE_ADDED` | string | 20 | API directa (size 20 para no exceder límite) |
| `inventory_products` | `COMING_SOON` | boolean | — | `add-missing-attributes.ts` |
| `inventory_products` | `DATE_ADDED` | string | 256 | Ya existía (⏭️) |
| `products` | `section` | integer | — | Ya existía (⏭️) |
| `products` | `barcode` | string | 64 | Ya existía (⏭️) |
| `products` | `PACKQTY` | integer | — | Ya existía (⏭️) |
| `inventory_products` | `section` | integer | — | Ya existía (⏭️) |
| `inventory_products` | `barcode` | string | 64 | Ya existía (⏭️) |
| `inventory_products` | `sku` | string | 128 | Ya existía (⏭️) |
| `inventory_products` | `PACKQTY` | integer | — | Ya existía (⏭️) |

### 🗑️ Atributos eliminados en esta sesión

| Colección | Atributo | Tipo | Size | Razón |
|-----------|----------|------|------|-------|
| `products` | `CUSTOM_PRIMARY_COLOR` | string | 50 | No se usa en ningún componente, solo en type definition |
| `products` | `CUSTOM_SECONDARY_COLOR` | string | 50 | No se usa en ningún componente, solo en type definition |
| `products` | `CUSTOM_USE_GRADIENT` | boolean | — | No se usa en ningún componente, solo en type definition |

**Razón:** La colección `products` alcanzó el límite de tamaño de atributos y no se podía crear `DATE_ADDED`. Se eliminaron estos 3 atributos custom de color que solo estaban declarados en `src/types/admin.ts` pero no se usaban en ningún componente real. Esto liberó espacio suficiente para crear `DATE_ADDED` con size 20.

### 3.1 `products` — esquema REAL actualizado (Mayo 19, 2026 — 25 atributos)

> ⚠️ Se eliminaron `CUSTOM_PRIMARY_COLOR`, `CUSTOM_SECONDARY_COLOR`, `CUSTOM_USE_GRADIENT`. Se agregaron `section`, `barcode`, `sku`, `COMING_SOON`, `DATE_ADDED`.

| Atributo | Tipo | Size | Requerido | Default |
|----------|------|------|-----------|---------|
| NAME | string | 256 | ✓ | — |
| DESCRIPTION | string | 8192 | ✗ | — |
| PRICE | integer | — | ✓ | — |
| CURRENTPRICE | integer | — | ✗ | — |
| COST | integer | — | ✗ | — |
| STOCK | integer | — | ✓ | — |
| SOLDQUANTITY | integer | — | ✗ | — |
| CATEGORYID | string | 256 | ✗ | — |
| SUBCATEGORYID | string | 256 | ✗ | — |
| IMAGEURL | string | 2048 | ✗ | — |
| IMAGEURL2 | string | 2048 | ✗ | — |
| IMAGEURL3 | string | 2048 | ✗ | — |
| RATING | double | — | ✗ | — |
| NUMREVIEWS | integer | — | ✗ | — |
| WHOLESALEPRICE | integer | — | ✗ | — |
| WHOLESALEMINQUANTITY | integer | — | ✗ | — |
| ISFEATURED | boolean | — | ✗ | — |
| ISACTIVE | boolean | — | ✗ | — |
| PACKQTY | integer | — | ✗ | — |
| RESTOCKTHRESHOLD | integer | — | ✗ | — |
| jumpseller_id | string | 256 | ✗ | — |
| section | integer | — | ✗ | — |
| barcode | string | 64 | ✗ | — |
| sku | string | 128 | ✗ | — |
| COMING_SOON | boolean | — | ✗ | — |
| DATE_ADDED | string | 20 | ✗ | — |

### 3.2 `inventory_products` — esquema REAL actualizado (Mayo 19, 2026 — 25 atributos)

| Atributo | Tipo | Size | Requerido | Default |
|----------|------|------|-----------|---------|
| sku | string | 256 | ✗ | — |
| barcode | string | 256 | ✗ | — |
| NAME | string | 256 | ✓ | — |
| PRICE | integer | — | ✗ | 0 |
| STOCK | integer | — | ✗ | 0 |
| CATEGORYID | string | 256 | ✗ | — |
| SUBCATEGORYID | string | 256 | ✗ | — |
| IMAGEURL | string | 2048 | ✗ | — |
| IMAGEURL2 | string | 2048 | ✗ | — |
| IMAGEURL3 | string | 2048 | ✗ | — |
| WHOLESALEPRICE | integer | — | ✗ | — |
| WHOLESALEMINQUANTITY | integer | — | ✗ | — |
| ISACTIVE | boolean | — | ✗ | false |
| published_product_id | string | 256 | ✗ | — |
| published_at | string | 64 | ✗ | — |
| imported_at | string | 64 | ✗ | — |
| FEATURES | string | 2048 | ✗ | — |
| TAGS | string | 512 | ✗ | — |
| name_cn | string | 256 | ✗ | — |
| IMAGEURL4 | string | 1024 | ✗ | — |
| IMAGEURL5 | string | 1024 | ✗ | — |
| PACKQTY | integer | — | ✗ | 0 |
| section | integer | — | ✗ | — |
| COMING_SOON | boolean | — | ✗ | — |
| DATE_ADDED | string | 256 | ✗ | — |

### 📄 Nuevos documentos del proyecto

| Archivo | Propósito |
|---------|-----------|
| `scripts/add-missing-attributes.ts` | Script para crear atributos faltantes en `products` e `inventory_products` vía API |
| `src/app/inventario/fecha/page.tsx` | Página admin para asignar fechas de ingreso (DATE_ADDED) a productos desde Excel |
| `src/app/inventario/imagenes/page.tsx` | Página admin para asignar imágenes a productos desde Excel |
| `src/app/catalogo/page.tsx` | Página de catálogo con filtros dinámicos, diseño glass, responsive |
| `src/app/llegan-pronto/page.tsx` | Página "Llegan Pronto" con estilo full glass (blanco/rosa), filtros, responsive |
| `src/app/cuenta/consultas/page.tsx` | Página de consultas de cuenta |
| `src/app/admin/(panel)/catalog-products/page.tsx` | Admin para gestión de productos del catálogo |
| `src/app/api/admin/apertura/clear-coupons/route.ts` | API route para limpiar cupones de apertura |

---

## 14. Cambios de Sesión — Mayo 19, 2026 (19:00)

### ✅ Correcciones aplicadas
| Issue | Archivo | Cambio |
|-------|---------|--------|
| Error `Unknown attribute: "DATE_ADDED"` al guardar fechas | `src/app/inventario/fecha/page.tsx` | Detección específica del error con mensaje claro en UI. Se creó el atributo vía API. |
| `COMING_SOON` no existía en colecciones | `scripts/add-missing-attributes.ts` | Agregado `COMING_SOON` (boolean) y `DATE_ADDED` (string) al script de creación |
| `products` en límite de atributos | Ambas colecciones | Eliminados `CUSTOM_PRIMARY_COLOR`, `CUSTOM_SECONDARY_COLOR`, `CUSTOM_USE_GRADIENT` (no usados). Creado `DATE_ADDED` con size 20. |
| Error build Vercel: `INVENTORY_PRODUCTS_COLLECTION` not exported | `src/lib/appwrite.ts` | No se había hecho push del archivo. Commit con `git add -A` para incluir todos los cambios. |
| Error build Vercel: `Property 'href' does not exist on type 'Element'` | `src/templates/plantilla1/HomePage.tsx:708` | Cast a `HTMLAnchorElement` del resultado de `querySelector` |
| Página "Llegan Pronto" sin productos (0) | `src/app/llegan-pronto/page.tsx` | Fix filtro `COMING_SOON` con `(p as any).COMING_SOON` para manejar tipos variables de Appwrite |
| Página "Llegan Pronto" diseño anticuado | `src/app/llegan-pronto/page.tsx` | Rediseño completo: estilo full glass (blanco/rosa), filtros dinámicos, responsive, zoom, skeleton |
| Página "Llegan Pronto" hero con overlay azul | `src/app/llegan-pronto/page.tsx` | Overlay cambiado a blanco translúcido, texto "¡LLEGAN" en blanco, "PRONTO!" en rosa |

### 🔑 Lecciones aprendidas sobre la API de Appwrite

1. **`git add -A` antes de push** — Si solo haces `git add` de archivos específicos, los cambios en librerías compartidas (como `appwrite.ts`) no se suben y Vercel falla.
2. **El límite de atributos es por SIZE total** — No por cantidad. Un `string(8192)` consume ~8KB del límite. Si necesitas crear un atributo nuevo y falla, reduce el size o elimina atributos grandes innecesarios.
3. **Los atributos eliminados tardan ~30s en liberar espacio** — No intentes crear uno nuevo inmediatamente después de eliminar.
4. **`node-appwrite` SDK de servidor** — Permite crear/eliminar atributos programáticamente. Mucho más rápido que la UI de Appwrite Console.
5. **Appwrite procesa atributos asíncronamente** — Un atributo nuevo pasa por estado `processing` antes de estar `available`. Esperar ~30s antes de usarlo.
6. **Cast `(p as any).ATTR`** — Appwrite puede devolver tipos inesperados (string en vez de boolean). Usar `as any` para truthy checks evita errores de TypeScript.

---

## 10. Checklist de Migración

- [ ] Decidir opción (A, B o C)
- [ ] Si Opción A: crear nuevo proyecto Appwrite
- [ ] Crear database en nuevo proyecto
- [ ] Crear colecciones con camelCase unificado
- [ ] Crear storage buckets (5)
- [ ] Crear script de migración de datos
- [ ] Ejecutar migración de datos
- [ ] Actualizar código frontend (atributos camelCase)
- [ ] Actualizar tipos TypeScript
- [ ] Actualizar .env.local
- [ ] Actualizar env vars en Vercel
- [ ] Testing completo
- [ ] Redeploy en Vercel
- [ ] Verificar producción
- [ ] Desactivar proyecto antiguo
