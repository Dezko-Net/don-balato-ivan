# Solución: botones que responden varios segundos tarde en clones de Shopify

## Síntoma

Después de refrescar la página:

- El usuario toca un botón, pero la acción ocurre entre 3 y 5 segundos después.
- El problema afecta el botón "Volver arriba", botones de producto, drawers y otros controles.
- Cambiar `scroll-behavior` solo modifica la animación del scroll; no elimina la espera previa.
- Una vez terminada la inicialización, todos los botones responden normalmente.

Este comportamiento indica un problema de **Interaction to Next Paint (INP)** o un control todavía no conectado, no un problema visual del botón.

## Causas identificadas

### 1. Ejecución de scripts en una sola ráfaga

Insertar simultáneamente `vendor.js`, `theme.js`, scripts de carrito, búsqueda, sliders y parches hace que el navegador los ejecute casi sin pausas.

Durante esa ráfaga:

- El hilo principal no puede procesar `click`, `touchend` o `pointerup`.
- Los taps quedan encolados.
- La acción se ejecuta varios segundos después.
- En teléfonos lentos el bloqueo es mucho más visible que en escritorio.

Los `preload` pueden descargar scripts en paralelo, pero la **ejecución** debe distribuirse.

### 2. Custom Elements que se actualizan todos al definir `theme.js`

Un `theme.js` de Shopify puede registrar decenas de elementos mediante `customElements.define()`.

Si el HTML ya contiene cientos de elementos como estos:

```html
<product-card-info>
<variant-picker>
<scroll-shadow>
<magnet-element>
<product-bundle>
```

al registrar cada clase, el navegador actualiza sincrónicamente todas las instancias existentes. Sus constructores y `connectedCallback()` pueden consultar el DOM, medir layouts y registrar listeners. Esto genera tareas largas.

### 3. Procesamiento pesado del DOM ejecutado varias veces

Funciones de adaptación del clon suelen:

- Ejecutar muchos `querySelectorAll()`.
- Reemplazar `innerHTML`.
- Clonar o reemplazar formularios.
- Cambiar imágenes y textos de cientos de nodos.
- Registrar listeners individualmente.
- Ejecutarse nuevamente con `setTimeout()` para combatir cambios de `theme.js`.

Si una función pesada se ejecuta inmediatamente y luego vuelve a ejecutarse a los 600 ms, el navegador puede quedar ocupado durante toda la ventana inicial.

### 4. Botones sin comportamiento nativo

Este botón no tiene una acción propia:

```html
<button type="button" class="product-form__submit button button--primary">
  <span class="btn-text">Ver detalle</span>
</button>
```

`type="button"` no navega ni abre nada. Depende completamente de que JavaScript conecte un handler.

En el pack de combos, el comportamiento se agrega posteriormente mediante código equivalente a:

```ts
button.onclick = event => {
  event.preventDefault();
  event.stopImmediatePropagation();
  openProductDetailDrawer(product);
};
```

Antes de que ese código se ejecute, el botón está visible pero es inerte. Si además `theme.js` reemplaza el formulario o intercepta el evento, el handler debe volver a conectarse.

Por eso existen dos problemas que pueden parecer iguales:

1. **El evento está conectado, pero el hilo principal está bloqueado.**
2. **El botón aparece antes de que su evento sea conectado.**

## Solución aplicada al bloqueo global

### Cargar los scripts secuencialmente

Usar un `Promise` por script y esperar su finalización:

```ts
type JsFile = { src: string; module?: boolean };

const loadOne = (file: JsFile) => new Promise<void>(resolve => {
  if (document.querySelector(`script[data-theme-script="${file.src}"]`)) {
    resolve();
    return;
  }

  const script = document.createElement('script');
  script.src = file.src;
  if (file.module) script.type = 'module';
  else script.async = false;
  script.setAttribute('data-theme-script', file.src);
  script.onload = () => resolve();
  script.onerror = () => resolve();
  document.body.appendChild(script);
});
```

Ejecutarlos en orden y ceder el hilo entre archivos:

```ts
void (async () => {
  for (const file of JS_FILES) {
    await loadOne(file);
    await new Promise<void>(resolve => setTimeout(resolve, 0));
  }

  runPostInit();
})();
```

El `setTimeout(..., 0)` no introduce una demora perceptible. Crea una nueva tarea y permite que el navegador procese interacción, renderizado y eventos pendientes antes del siguiente script.

### Mantener descarga y ejecución como conceptos separados

Es válido precargar los archivos:

```ts
const preload = document.createElement('link');
preload.rel = 'preload';
preload.as = 'script';
preload.href = file.src;
document.head.appendChild(preload);
```

Esto descarga en paralelo. Posteriormente, `loadOne()` conserva la ejecución secuencial usando los recursos ya almacenados por el navegador.

### Diferir transformaciones pesadas

Una adaptación pesada del DOM debe esperar un momento libre:

```ts
const scheduleHeavyEnhancement = (callback: () => void) => {
  if ('requestIdleCallback' in window) {
    return window.requestIdleCallback(callback, { timeout: 1500 });
  }

  return window.setTimeout(callback, 16);
};
```

No debe ejecutarse inmediatamente y repetirse con otro `setTimeout()` salvo que exista una razón verificada.

### No usar retries como mecanismo de inicialización visual

Un retry de API como `5 intentos × 600 ms` puede mantener partes de la interfaz sin conectar durante aproximadamente 3 segundos.

Recomendaciones:

- Mostrar un estado deshabilitado explícito mientras falta información.
- Conectar la interacción básica inmediatamente.
- Actualizar datos cuando la API responda.
- Reducir retries y aplicar backoff solamente a la solicitud, no al montaje de eventos.

## Solución específica para `Ver detalle` en `product-card-info`

### Opción recomendada: delegación de eventos

Registrar un único listener apenas se inyecta el HTML:

```ts
const onProductDetailClick = (event: Event) => {
  const target = event.target as HTMLElement;
  const button = target.closest<HTMLButtonElement>('[data-action="view-product-detail"]');
  if (!button) return;

  const card = button.closest<HTMLElement>('product-card-info');
  const productId = card?.dataset.productId;
  if (!productId) return;

  event.preventDefault();
  event.stopPropagation();
  openProductDetailById(productId);
};

root.addEventListener('click', onProductDetailClick);
```

Marcar el botón al construir o adaptar la tarjeta:

```ts
button.type = 'button';
button.dataset.action = 'view-product-detail';
```

Ventajas:

- Funciona con tarjetas agregadas posteriormente.
- No requiere recorrer todos los botones para registrar handlers.
- No se pierde si cambia el contenido interno del botón.
- Reduce trabajo durante el arranque.

### Evitar reemplazos repetidos del formulario

Patrones como estos son costosos y eliminan listeners:

```ts
replacement.innerHTML = form.innerHTML;
form.parentNode?.replaceChild(replacement, form);
```

Si es indispensable reemplazar el formulario:

1. Hacerlo una sola vez.
2. Marcarlo con `data-enhanced="true"`.
3. Usar delegación desde un ancestro estable.
4. No volver a recorrer y conectar todos los botones a los 600 y 1200 ms.

### Proporcionar fallback nativo

Cuando sea posible, usar un enlace real:

```html
<a href="/producto/ID_REAL" data-action="view-product-detail">
  Ver detalle
</a>
```

JavaScript puede interceptarlo para abrir un drawer. Si el script todavía no cargó, el usuario navega a la ficha del producto en lugar de tocar un control inerte.

Si debe ser un `<button>`, mantenerlo deshabilitado hasta disponer de la acción:

```html
<button type="button" disabled aria-busy="true">
  Cargando…
</button>
```

Después se habilita explícitamente. No conviene mostrar un botón aparentemente funcional antes de conectar su comportamiento.

## Orden recomendado de inicialización

1. Renderizar el shell React y los controles globales.
2. Inyectar el HTML capturado.
3. Registrar inmediatamente listeners delegados críticos.
4. Precargar scripts del tema.
5. Ejecutar `vendor.js`.
6. Ceder el hilo principal.
7. Ejecutar `theme.js`.
8. Ceder el hilo principal.
9. Ejecutar scripts secundarios uno por uno.
10. Ejecutar un único `postInit`.
11. Diferir mejoras visuales pesadas con `requestIdleCallback`.
12. Actualizar contenido cuando lleguen las APIs sin reconstruir toda la sección.

## Lo que no resuelve el problema

### Cambiar únicamente `scroll-behavior`

```css
html {
  scroll-behavior: auto;
}
```

Esto cambia la animación, pero no libera el hilo principal ni conecta botones.

### Añadir más `setTimeout()` para reconectar eventos

```ts
setTimeout(wireButtons, 600);
setTimeout(wireButtons, 1200);
setTimeout(wireButtons, 2000);
```

Puede ocultar una carrera ocasional, pero aumenta el trabajo y deja períodos donde el botón continúa inerte.

### Registrar listeners en cada botón durante cada render

La cantidad de listeners y búsquedas crece rápidamente. Es preferible un listener delegado en un contenedor estable.

### Ejecutar todos los scripts dinámicos al mismo tiempo

Aunque `async = false` preserve parte del orden, insertar todos los elementos `<script>` en el mismo ciclo puede concentrar su ejecución y las actualizaciones de Custom Elements.

## Diagnóstico para otros sitios

### Medir eventos y tareas largas

```js
new PerformanceObserver(list => {
  for (const entry of list.getEntries()) {
    console.log('Long task:', entry.startTime, entry.duration);
  }
}).observe({ type: 'longtask', buffered: true });
```

Registrar temporalmente el momento de la interacción:

```js
document.addEventListener('pointerdown', () => {
  console.log('pointerdown', performance.now());
}, true);

document.addEventListener('click', () => {
  console.log('click', performance.now());
}, true);
```

Interpretación:

- `pointerdown` y `click` aparecen varios segundos tarde: el hilo principal estaba bloqueado.
- Los eventos aparecen a tiempo, pero no ocurre la acción: falta el handler o existe una interceptación.
- El handler corre a tiempo, pero el drawer aparece tarde: la propia función ejecuta trabajo pesado o espera datos.

### Revisar el HTML del control

Comprobar:

- Si es `<button type="button">`, necesita JavaScript.
- Si tiene un `href` real, posee fallback nativo.
- Si está dentro de un Custom Element, el tema puede interceptarlo.
- Si el DOM se reemplaza con `innerHTML`, los listeners directos se pierden.
- Si hay `preventDefault()` o `stopImmediatePropagation()` en capture, puede bloquear otros handlers.

### Probar en CPU lenta

En Chrome DevTools:

1. Abrir **Performance**.
2. Activar CPU throttling de 4× o 6×.
3. Refrescar la página.
4. Tocar el botón durante la inicialización.
5. Buscar tareas largas y medir el INP.

Una solución aceptable debe mantener la respuesta del control por debajo de aproximadamente 500 ms incluso con CPU ralentizada.

## Validación realizada en plantilla25

- TypeScript compiló sin errores con `npx tsc --noEmit`.
- Se probó con viewport móvil y soporte táctil.
- Se aplicó throttling de CPU 6×.
- El botón respondió y comenzó la acción en aproximadamente 517 ms.
- El scroll suave se conservó; el arreglo no depende de convertirlo en un salto instantáneo.

## Archivos de referencia en este proyecto

- `src/templates/plantilla25/HomePage.tsx`: carga secuencial y post-inicialización.
- `src/templates/plantilla25/enhanceConceptHeader.ts`: adaptación de tarjetas, combos y drawers.
- `src/components/BackToTop.tsx`: botón global de retorno.
- `src/templates/plantilla666/HomePage.tsx`: patrón estable usado como referencia.

## Resumen reutilizable

Cuando un botón responde varios segundos después del tap:

1. No asumir que el problema es CSS o animación.
2. Comprobar si el botón tiene comportamiento nativo.
3. Medir si el evento llega tarde o si falta su handler.
4. Separar descarga paralela de ejecución secuencial.
5. Ceder el hilo entre scripts.
6. Registrar acciones críticas antes de las mejoras visuales.
7. Usar delegación de eventos para contenido dinámico.
8. Ejecutar transformaciones pesadas una sola vez y durante tiempo libre.
9. Evitar reconexiones repetidas mediante timers.
10. Validar bajo throttling de CPU móvil.
