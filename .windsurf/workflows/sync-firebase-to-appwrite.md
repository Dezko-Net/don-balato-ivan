---
description: Sincronizar productos del catálogo Firebase a Appwrite (Yaxsel)
---

# Sincronizar catálogo Firebase → Appwrite

## Cuándo usar
Cuando se agregan productos al catálogo de Firebase (admin del catálogo) y no se han subido a Appwrite (admin de la página web Yaxsel).

## Pasos

1. **Entrar al admin del catálogo Firebase**
   - URL: `http://localhost:8080/#admin` (local) o la URL de producción del catálogo
   - Contraseña: `Flavia273@`

2. **Ir a la pestaña "Ajustes"**
   - Buscar la sección "Datos y respaldo"
   - Click en el botón naranja "🔄 Sincronizar a Appwrite"

3. **Esperar el resultado**
   - El botón envía todos los productos del catálogo a `https://www.yaxsel.cl/api/admin/sync-firebase-products`
   - El endpoint compara los SKUs y solo sube los que no existen en Appwrite
   - Muestra un toast con el resultado: "X productos importados, Y ya existían, Z errores"

4. **Si se usa localmente (para probar)**
   - Cambiar la URL en `app.js` línea ~2106 de `https://www.yaxsel.cl/...` a `http://localhost:3000/...`
   - El servidor Next.js debe estar corriendo con `npm run dev`

## Notas
- El endpoint crea categorías automáticamente si no existen en Appwrite
- Los productos se suben con: NAME, PRICE, STOCK, IMAGEURL, CATEGORYID, FEATURES (con SKU)
- No se duplican productos: el endpoint verifica los SKUs existentes antes de subir
- Después de subir, se invalida el caché automáticamente (revalidateTag)
