# 🚨 REGLAS ESTRICTAS DE CACHÉ Y APPWRITE (LEER ANTES DE MODIFICAR) 🚨

Este proyecto (Yaxsell / Kevin&Coco) tiene una arquitectura altamente optimizada diseñada específicamente por el DUEÑO para reducir las lecturas a Appwrite y mantener el consumo debajo de **6,000 lecturas diarias**.

**BAJO NINGÚN CONCEPTO DEBES ROMPER ESTAS REGLAS A MENOS QUE EL USUARIO LO ORDENE EXPLÍCITAMENTE.**

## 1. Reglas de Caché (unstable_cache)
- El caché de la página principal (`/api/public-data/home/route.ts`) debe mantenerse siempre en **86400 segundos** (24 horas). NO lo reduzcas a 60 segundos bajo el argumento de "datos en tiempo real". El catálogo está diseñado para operar offline y solo gastar recursos durante la compra final.
- El proxy de Appwrite (`/api/appwrite-proxy-v1/[[...path]]/route.ts` y `/api/appwrite-proxy/route.ts`) está diseñado para ser el ÚNICO PUNTO DE ACCESO público para el catálogo.

## 2. Reglas de Consultas a Base de Datos (Appwrite)
- **NUNCA** uses llamadas directas del SDK (`databases.listDocuments` o `serverListDocuments`) para obtener productos, usuarios o pedidos en rutas altamente traficadas sin estar envueltas en un caché agresivo.
- **Webhooks (WhatsApp, etc.):** Está ESTRICTAMENTE PROHIBIDO ejecutar `serverListDocuments` sin caché dentro de los loops de webhooks (ej. `src/app/api/whatsapp/webhook/route.ts`). Si necesitas validar si un usuario está registrado, debes usar la memoria temporal (`KeniaUsage`) para almacenar el estado del cliente y consultar la BD **solamente una vez**.

## 3. Límites de Peticiones
- Los límites en el home de productos genéricos no deben sobrepasar `Query.limit(80)`.
- Evita añadir intervalos de recarga automáticos (`setInterval`, SWR polling) a las páginas públicas o paneles de IA que invoquen silenciosamente a la API.

## CONTEXTO HISTÓRICO
El 23 de junio de 2026, una IA sin contexto modificó el caché a 60s e introdujo consultas no cacheadas en el webhook de WhatsApp, lo que disparó el consumo de 6K a 480K lecturas diarias. **Tu trabajo es garantizar que esto nunca vuelva a suceder.**
