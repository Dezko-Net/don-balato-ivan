/* Genera theme-scoped.css: el theme.css del tema Concept con TODOS los
   selectores prefijados bajo `.tpl25nav`, para poder usar el header real en
   páginas de la app (producto, carrito…) SIN que su CSS global (body, button,
   a, *, :root) contamine el resto de la página.

   Uso: node scripts/scope-concept-theme.js
*/
const fs = require('fs');
const path = require('path');
const postcss = require('postcss');

const SCOPE = '.tpl25nav';
const BASE = path.join(
  process.cwd(),
  'public/shopify/plantilla25/assets/css/concept-theme-tech.myshopify.com/cdn/shop/t/188/assets/theme.css'
);
const JIT = path.join(process.cwd(), 'public/shopify/plantilla25/body-clean.html');
const INLINE = path.join(process.cwd(), 'public/shopify/plantilla25/assets/css/inline/index-inline-1.css');
const OUT = path.join(process.cwd(), 'public/shopify/plantilla25/theme-scoped.css');

// Variables base del tema (--color-base-*, --sp-*, --text-*, --rounded-button…)
// que theme.css referencia. Sin esto, el header sale sin colores/tamaños.
const inlineCss = fs.readFileSync(INLINE, 'utf8');

// Utilidades tailwind-jit (dentro de un <style id="tailwind-jit-patch"> en el body)
const bodyHtml = fs.readFileSync(JIT, 'utf8');
const jitMatch = bodyHtml.match(/<style id="tailwind-jit-patch">([\s\S]*?)<\/style>/);
const jitCss = jitMatch ? jitMatch[1] : '';

const themeCss = fs.readFileSync(BASE, 'utf8');
// index-inline PRIMERO (define las variables base), luego theme.css, luego utilidades.
const inputCss = inlineCss + '\n' + themeCss + '\n' + jitCss;

/** Prefija UN selector con el scope. */
function scopeSelector(sel) {
  const s = sel.trim();
  if (!s) return s;
  // :root / html / body (a secas) → el propio contenedor
  if (s === ':root' || s === 'html' || s === 'body') return SCOPE;
  // * a secas → el contenedor y todo lo de adentro
  if (s === '*') return `${SCOPE}, ${SCOPE} *`;
  // Selectores que EMPIEZAN por html/body/:root con más cosas pegadas
  //   body.foo / body[data-x] / html:is(...) → .tpl25nav.foo / .tpl25nav[data-x]
  let m = s.match(/^(?::root|html|body)([.\[:].*)?$/);
  if (m) return SCOPE + (m[1] || '');
  // Selectores que empiezan por atributo (asumidos sobre body en el tema):
  //   [data-rounded-block=round] .x → .tpl25nav[data-rounded-block=round] .x
  if (s.startsWith('[')) return SCOPE + s;
  // Resto → descendiente del scope
  return `${SCOPE} ${s}`;
}

const scoper = postcss.plugin('scoper', () => (root) => {
  root.walkRules((rule) => {
    // No tocar reglas dentro de @keyframes / @font-face
    const parent = rule.parent;
    if (
      parent &&
      parent.type === 'atrule' &&
      /(-)?keyframes|font-face/i.test(parent.name)
    ) {
      return;
    }
    rule.selectors = rule.selectors.map(scopeSelector);
  });
});

postcss([scoper])
  .process(inputCss, { from: undefined })
  .then((result) => {
    fs.writeFileSync(OUT, result.css, 'utf8');
    console.log('OK →', OUT);
    console.log('input:', inputCss.length, 'chars | output:', result.css.length, 'chars');
  })
  .catch((err) => {
    console.error('FALLÓ:', err.message);
    process.exit(1);
  });
