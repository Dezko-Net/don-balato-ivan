/* ════════════════════════════════════════════════════════════════════
   Traducción ES + rebranding (moda → cosmética estilo plantilla 23)
   para public/shopify/plantilla101/body-clean.html
   - Solo toca nodos de texto y atributos visibles (alt, aria-label,
     title, placeholder). NO toca clases, estructura, JS, CSS ni países.
   - Protege bloques <script> y <style>.
   ════════════════════════════════════════════════════════════════════ */
const fs = require('fs');
const path = require('path');

const FILE = path.resolve(__dirname, '..', 'public', 'shopify', 'plantilla101', 'body-clean.html');

/* ── Mapa exacto: segmento (trim) → traducción ── */
const EXACT = {
  // Navegación / UI general
  'About Us': 'Sobre nosotros',
  'About us': 'Sobre nosotros',
  'about page': 'página sobre nosotros',
  'Contact': 'Contacto',
  'Information': 'Información',
  'Payment': 'Pago',
  'Shipping': 'Envío',
  'Service': 'Servicio',
  'Products': 'Productos',
  'Cart': 'Carrito',
  'Search': 'Buscar',
  'Menu': 'Menú',
  'Sale': 'Oferta',
  'View all': 'Ver todo',
  'Log in': 'Iniciar sesión',
  'Have an account?': '¿Tienes una cuenta?',
  'Join us': 'Únete',
  'Join Our Newsletter': 'Suscríbete a nuestro boletín',
  'Be the first to know about new collections and exclusive offers.': 'Sé el primero en conocer las nuevas colecciones y ofertas exclusivas.',
  'Follow Us': 'Síguenos',
  'Legal Area': 'Área legal',
  'Return and Refunds': 'Devoluciones y reembolsos',
  'FAQ': 'Preguntas frecuentes',
  'Free standard shipping': 'Envío estándar gratis',
  'Regular price': 'Precio habitual',
  'Sale price': 'Precio de oferta',
  'Unit price': 'Precio unitario',
  'Your cart is empty': 'Tu carrito está vacío',
  'Your cart': 'Tu carrito',
  'Continue shopping': 'Seguir comprando',
  'Check out': 'Finalizar compra',
  'Add to cart': 'Añadir al carrito',
  'Close': 'Cerrar',
  'Back': 'Atrás',
  'Skip to content': 'Saltar al contenido',
  'Toggle menu': 'Alternar menú',
  'Toggle sound': 'Activar/silenciar sonido',
  'Localization options': 'Opciones de región',
  'Choosing a selection results in a full page refresh.': 'Elegir una opción recarga la página completa.',
  'Theme Features': 'Características del tema',
  'Presets': 'Ajustes preestablecidos',
  'Credit card & PayPal': 'Tarjeta de crédito y PayPal',
  'Announcement': 'Anuncio',
  'Close announcement bar': 'Cerrar barra de anuncios',
  'Open search': 'Abrir búsqueda',
  'Close search': 'Cerrar búsqueda',
  'Search location': 'Buscar país',
  'Remove all': 'Eliminar todo',
  'Item added to your cart': 'Producto añadido al carrito',
  'Open brand link': 'Abrir enlace de marca',
  'Play/pause button': 'Botón reproducir/pausar',
  'Rewind video': 'Rebobinar video',
  'Subscribe': 'Suscribirse',
  'Email': 'Correo electrónico',
  'Find a product...': 'Buscar un producto...',
  'Search location...': 'Buscar país...',
  'Fashion Shop Video': 'Video de la tienda',
  'Logo image': 'Logotipo',
  'Women in white sweater': 'Mujer con rutina de belleza',
  'Tik Tok': 'TikTok',
  'Read more': 'Leer más',
  'New': 'Nuevo',
  'Loading...': 'Cargando...',
  'View all details': 'Ver todos los detalles',
  'Free returns within 30 days': 'Devoluciones gratis en 30 días',
  'Country/region': 'País/región',
  'Language': 'Idioma',
  'English': 'Español',
  'Journal': 'Diario',
  'Inspiration': 'Inspiración',
  'Limited': 'Edición limitada',
  'Comfort': 'Confort',
  'Glamour': 'Glamour',
  'Modern Elegant': 'Elegancia moderna',
  'campaign styles': 'novedades de temporada',
  'new bags': 'nuevas fragancias',
  'to check out faster.': 'para finalizar la compra más rápido.',
  'MOE collection': 'Colección Moe',
  'SALE up to 50% for all collections': 'OFERTA hasta 50% en todas las colecciones',
  'You are currently shipping to United States and your order will be billed in USD $.':
    'Actualmente envías a Estados Unidos y tu pedido se facturará en USD $.',
  'The blazer is a staple piece in office fashion...':
    'El cuidado facial es la base de toda buena rutina de belleza...',
  'The right skirt length can enhance your figure...':
    'La rutina de cuidado correcta puede realzar tu belleza natural...',
  'Choosing the right outfit for the office can sometimes be a challenge...':
    'Elegir los productos correctos para tu piel a veces puede ser un reto...',

  // Colores (etiquetas de swatch)
  'Black': 'Negro',
  'Blue': 'Azul',
  'Green': 'Verde',
  'Navy': 'Azul marino',
  'Pink': 'Rosa',
  'Red': 'Rojo',
  'Grey': 'Gris',
  'Caramel': 'Caramelo',
  'Powder': 'Polvo',
  'Multicolor': 'Multicolor',

  // Crédito de la demo
  'We could not have created this demo without the help of an amazing source of content and products. Visit our':
    'No habríamos podido crear esta demo sin la ayuda de una increíble fuente de contenido y productos. Visita nuestra',
  'to find out where all the products used in this demo care from.':
    'para descubrir el origen de todos los productos usados en esta demo.',

  // Categorías / colecciones (moda → cosmética)
  'Clothing': 'Cuidado de la piel',
  'Bags': 'Fragancias',
  'Chic Bags': 'Fragancias selectas',
  'Shop Bags': 'Comprar fragancias',
  'Dress': 'Maquillaje',
  'Shop Dress': 'Comprar maquillaje',
  'Shop Dress Dress': 'Comprar maquillaje',
  'Shop Bags Bags': 'Comprar fragancias',
  'Skirt': 'Cabello',
  'Trending Skirts': 'Cabello en tendencia',
  'Trousers': 'Cuerpo',
  'Blazer': 'Tratamientos',
  'Jumpers': 'Ofertas',
  'Elegant Dresses': 'Maquillaje de lujo',
  'Elegant dresses by nife': 'Maquillaje de lujo',
  'Most-loved collections': 'Colecciones favoritas',
  'Our Bestseller': 'Nuestro más vendido',
  'Bestsellers': 'Más vendidos',
  'Best Sellers': 'Más vendidos',
  'Top Sellers': 'Más vendidos',
  'View all Bestsellers': 'Ver todos los más vendidos',
  'Sale Collection': 'Colección en oferta',
  'Moe Collection': 'Colección Moe',
  'New Arrival': 'Novedades',
  'Shop New Arrivals': 'Comprar novedades',
  'Shop the Collection': 'Comprar la colección',
  'Lookbook': 'Catálogo',
  'Fashion Blog': 'Blog de belleza',

  // Marketing / titulares
  'Redefine Your Elegance': 'Redefine tu belleza',
  'Discover the best deal': 'Descubre la mejor oferta',
  'Discover Now': 'Descubrir ahora',
  'Discover': 'Descubrir',
  'Check Now': 'Ver ahora',
  'The new season is on the horizon': 'La nueva temporada está por llegar',
  'It’s time to refresh with closet staples': 'Es hora de renovar tu rutina de belleza',
  "It's time to refresh with closet staples": 'Es hora de renovar tu rutina de belleza',
  'Autumn / Winter': 'Otoño / Invierno',
  'Fall into comfort': 'Déjate consentir',
  'Special discount club card': 'Tarjeta de descuento exclusiva',
  'Wonder card': 'Tarjeta Wonder',
  'curated from the house': 'seleccionado por la casa',
  'Champagne Whisper': 'Susurro Champagne',
  'Midnight Luxe': 'Lujo de Medianoche',
  'Savanna Chic': 'Estilo Savanna',
  'Urban Muse': 'Musa Urbana',
  'Unlock the Secrets of Causal Dress': 'Descubre los secretos del maquillaje natural',
  '24h  Green delivery': 'Entrega ecológica 24h',
  '24h Green delivery': 'Entrega ecológica 24h',
  'delivery': 'envío',
  'Get ready to slay in style with our Fashion store - the ultimate destination for all things fabulous!':
    'Prepárate para brillar con nuestra tienda de belleza: ¡tu destino para todo lo fabuloso!',
  'A brand that challenges the industry. A brand that has a chance to stage a revolution. A brand whose creators see it as a step towards a better world':
    'Una marca que desafía a la industria. Una marca con la oportunidad de protagonizar una revolución. Una marca cuyos creadores la ven como un paso hacia un mundo mejor.',
  'Be the first to know about new collections and exclusive offers':
    'Sé el primero en conocer las nuevas colecciones y ofertas exclusivas',

  // Blog
  'How to Choose the Right Skirt Length?': '¿Cómo elegir tu rutina de cuidado facial?',
  'How to Dress for the Office?': '¿Cómo cuidar tu piel a diario?',
  'Blazer and Office Style': 'Rutina de cuidado facial',

  // ── Productos (moda → cosmética, estilo plantilla 23) ──
  // Maquillaje (antes vestidos)
  'Blue Fitted dress': 'Base de maquillaje fluida',
  'Detachable pleated waist dress': 'Paleta de sombras nude',
  'Detachable pleated waist': 'Paleta de sombras nude',
  'A detachable dress at the waist with pleats': 'Paleta de sombras nude',
  'Dress with a lowered waist and pleats': 'Labial mate larga duración',
  'One shoulder dress with a frill': 'Rubor en polvo compacto',
  'One shoulder dress': 'Rubor en polvo compacto',
  'Cut-off dress': 'Corrector de alta cobertura',
  'Dress Sailor Galaxia': 'Iluminador líquido',
  'Dress tied at the waist': 'Máscara de pestañas volumen',
  'Serenity dress': 'Primer matificante',
  'Elegant dress with a sash on the shoulder': 'Delineador líquido waterproof',
  // Cabello (antes faldas)
  'Black skirt with high waist': 'Shampoo nutritivo',
  'Flared skirt': 'Acondicionador reparador',
  'Midi skirt with belt': 'Mascarilla capilar',
  'Flared knee-length skirt - red & black': 'Aceite capilar de argán',
  'Flared pleated midi skirt': 'Sérum anti-frizz',
  'Flared red skirt midi': 'Tratamiento de keratina',
  'High waisted skirt': 'Shampoo en seco',
  'Midi skirt with pleats - navy blue': 'Acondicionador sin enjuague',
  'Nubuck pinky skirt': 'Spray protector térmico',
  // Cuerpo / Tratamientos (antes pantalones / blazer)
  'Caramel palazzo pants': 'Crema corporal hidratante',
  'Classic black pants with a wide leg': 'Exfoliante corporal de café',
  'Classic pants with slightly tapered legs': 'Aceite corporal nutritivo',
  'Classic black pants': 'Exfoliante corporal de café',
  'Classic checkered blazer': 'Protector solar facial SPF50',
  // Fragancias (antes bolsos)
  'Black Crossbody Bag with Snake-Effect Texture': 'Perfume floral EDP',
  'Black Leather Baguette Bag': 'Perfume amaderado EDT',
  'Chocolate Brown Horseshoe Bag': 'Perfume oriental EDP',
  'Elegant Fuchsia Small Handbag': 'Perfume frutal EDT',
  'Medium Black Crossbody Bag': 'Perfume cítrico EDT',
  'Medium Chocolate Bag': 'Perfume vainilla EDP',
  'Small Brown Suede Bowling Bag': 'Perfume almizcle EDT',
  'Small Crossbody Bag with Double Straps': 'Perfume jazmín EDP',
  'Elegant handbag with gold details': 'Estuche de fragancias de lujo',
  'Elegant leopard print handbag': 'Perfume edición limitada',
  'Platinum handbag with decorative flap': 'Perfume premium platino',
  'Elegant handbag': 'Estuche de fragancias',
};

/* ── Reglas parciales (para segmentos compuestos / restos) ──
   Orden importa: de más específico a más genérico. ── */
/* ── Frases largas: se reemplazan aunque tengan comillas u otro texto
   alrededor (replaceAll literal, sin regex). ── */
const CONTAINS = [
  ['Dresses you&#39;ll adore', 'Maquillaje que vas a adorar'],
  ['Dresses you’ll adore', 'Maquillaje que vas a adorar'],
  ["Dresses you'll adore", 'Maquillaje que vas a adorar'],
  ['Balck Friday Sale', 'Black Friday'],
  ['Black Friday Sale', 'Black Friday'],
  ['Get ready to slay in style with our Fashion store - the ultimate destination for all things fabulous!',
   'Prepárate para brillar con nuestra tienda de belleza: ¡tu destino para todo lo fabuloso!'],
  ['A brand that challenges the industry. A brand that has a chance to stage a revolution. A brand whose creators see it as a step towards a better world',
   'Una marca que desafía a la industria. Una marca con la oportunidad de protagonizar una revolución. Una marca cuyos creadores la ven como un paso hacia un mundo mejor.'],
  ['How to Choose the Right Skirt Length?', '¿Cómo elegir tu rutina de cuidado facial?'],
  ['How to Dress for the Office?', '¿Cómo cuidar tu piel a diario?'],
  ['Blazer and Office Style', 'Rutina de cuidado facial'],
  ['About us', 'Sobre nosotros'],
];

const PARTIAL = [
  [/Read more:/g, 'Leer más:'],
  [/\bDress\b/g, 'Maquillaje'],
  [/\bSale\b/g, 'Oferta'],
  [/Follow Us:/g, 'Síguenos:'],
  [/opens in new tab/g, 'se abre en una pestaña nueva'],
  [/Shop Dress Dress/g, 'Comprar maquillaje'],
  [/Discover Now Fall into comfort/g, 'Descubrir ahora'],
  [/Check Now Sale/g, 'Ver ofertas'],
  [/\bBest Sellers\b/g, 'Más vendidos'],
  [/\bBestsellers\b/g, 'Más vendidos'],
  [/\bNew Arrivals\b/g, 'Novedades'],
  [/\bNew Arrival\b/g, 'Novedades'],
  [/\bDiscover Now\b/g, 'Descubrir ahora'],
  [/\bCheck Now\b/g, 'Ver ahora'],
  [/\bShop Dress\b/g, 'Comprar maquillaje'],
  [/\bShop Bags\b/g, 'Comprar fragancias'],
  [/\bAdd to cart\b/g, 'Añadir al carrito'],
  [/\bContinue shopping\b/g, 'Seguir comprando'],
  [/\bFall into comfort\b/g, 'Déjate consentir'],
];

/* ── Aplica traducción a un segmento de texto/atributo ── */
function translateSegment(raw) {
  const m = raw.match(/^(\s*)([\s\S]*?)(\s*)$/);
  const lead = m[1], core = m[2], trail = m[3];
  if (!core) return raw;
  const collapsed = core.replace(/\s+/g, ' ').trim();
  let out;
  if (Object.prototype.hasOwnProperty.call(EXACT, core)) {
    out = EXACT[core];
  } else if (Object.prototype.hasOwnProperty.call(EXACT, collapsed)) {
    out = EXACT[collapsed];
  } else {
    out = core;
    for (const [needle, rep] of CONTAINS) out = out.split(needle).join(rep);
    for (const [pat, rep] of PARTIAL) out = out.replace(pat, rep);
  }
  return lead + out + trail;
}

function main() {
  let html = fs.readFileSync(FILE, 'utf8');

  // 1) Proteger <script> y <style>
  const vault = [];
  const protect = (re) => {
    html = html.replace(re, (m) => {
      vault.push(m);
      return ` VAULT${vault.length - 1} `;
    });
  };
  protect(/<script\b[\s\S]*?<\/script>/gi);
  protect(/<style\b[\s\S]*?<\/style>/gi);

  // 2) Atributos visibles
  html = html.replace(/(\b(?:alt|aria-label|title|placeholder)=")([^"]*)(")/gi,
    (full, pre, val, post) => pre + translateSegment(val) + post);

  // 3) Nodos de texto (entre > y <), sin tocar marcadores VAULT
  html = html.replace(/>([^<>]+)</g, (full, txt) => {
    if (txt.includes(' VAULT')) return full;
    return '>' + translateSegment(txt) + '<';
  });

  // 4) Restaurar <script>/<style>
  html = html.replace(/ VAULT(\d+) /g, (m, i) => vault[Number(i)]);

  fs.writeFileSync(FILE, html, 'utf8');
  console.log('OK - body-clean.html traducido. Tamaño:', html.length);
}

main();
