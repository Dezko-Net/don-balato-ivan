const fs = require('fs');
const path = require('path');

const TRANSLATIONS = [
  // Frases largas primero (para evitar reemplazos parciales)
  ['Subscribe to our newsletter', 'Suscríbete a nuestro boletín'],
  ['SUBSCRIBE TO OUR NEWSLETTER', 'SUSCRÍBETE A NUESTRO BOLETÍN'],
  ['Taxes and shipping calculated at checkout', 'Impuestos y envío calculados al finalizar compra'],
  ['Taxes and shipping calculated at checkout.', 'Impuestos y envío calculados al finalizar compra.'],
  ['Taxes and shipping included', 'Impuestos y envío incluidos'],
  ['Shipping, taxes, and discounts calculated at checkout', 'Costo de envío e impuestos calculados en el pago'],
  ['Free shipping on all orders', 'Envío gratis en todos tus pedidos'],
  ['FREE SHIPPING ON ALL ORDERS', 'ENVÍO GRATIS EN TODOS TUS PEDIDOS'],
  ['Free shipping', 'Envío Gratis'],
  ['FREE SHIPPING', 'ENVÍO GRATIS'],
  ['Money back guarantee', 'Garantía de Devolución'],
  ['24/7 Customer Support', 'Soporte al Cliente 24/7'],
  ['Secure Online Payment', 'Pago Seguro En Línea'],
  ['Your cart is empty', 'Tu carrito está vacío'],
  ['YOUR CART IS EMPTY', 'TU CARRITO ESTÁ VACÍO'],
  ['Continue shopping', 'Continuar Comprando'],
  ['CONTINUE SHOPPING', 'CONTINUAR COMPRANDO'],

  // Secciones
  ['Featured Collection', 'Colección Destacada'],
  ['FEATURED COLLECTION', 'COLECCIÓN DESTACADA'],
  ['Featured collection', 'Colección destacada'],
  ['Featured Products', 'Productos Destacados'],
  ['FEATURED PRODUCTS', 'PRODUCTOS DESTACADOS'],
  ['Featured products', 'Productos destacados'],
  ['New Arrivals', 'Nuevas Llegadas'],
  ['NEW ARRIVALS', 'NUEVAS LLEGADAS'],
  ['Best Sellers', 'Los Más Vendidos'],
  ['BEST SELLERS', 'LOS MÁS VENDIDOS'],
  ['Popular Categories', 'Categorías Populares'],
  ['POPULAR CATEGORIES', 'CATEGORÍAS POPULARES'],
  ['Customer Reviews', 'Opiniones de Clientes'],
  ['CUSTOMER REVIEWS', 'OPINIONES DE CLIENTES'],
  ['Quick Links', 'Enlaces Rápidos'],
  ['QUICK LINKS', 'ENLACES RÁPIDOS'],
  ['Customer Support', 'Atención al Cliente'],
  ['Follow Us', 'Síguenos'],
  ['FOLLOW US', 'SÍGUENOS'],
  ['About Us', 'Sobre Nosotros'],
  ['Contact Us', 'Contáctanos'],

  // Acciones y Botones
  ['Add to Cart', 'Añadir al Carrito'],
  ['ADD TO CART', 'AÑADIR AL CARRITO'],
  ['Add to cart', 'Añadir al carrito'],
  ['Buy it now', 'Comprar Ahora'],
  ['BUY IT NOW', 'COMPRAR AHORA'],
  ['Buy It Now', 'Comprar Ahora'],
  ['Quick View', 'Vista Rápida'],
  ['QUICK VIEW', 'VISTA RÁPIDA'],
  ['Quick view', 'Vista rápida'],
  ['View All', 'Ver Todo'],
  ['VIEW ALL', 'VER TODO'],
  ['View all', 'Ver todo'],
  ['Shop Now', 'Ver Catálogo'],
  ['SHOP NOW', 'VER CATÁLOGO'],
  ['Shop now', 'Ver catálogo'],
  ['Explore More', 'Explorar Más'],
  ['Search products', 'Buscar productos'],
  ['Search our store', 'Buscar en la tienda'],
  ['SEARCH OUR STORE', 'BUSCAR EN LA TIENDA'],
  ['Search', 'Buscar'],
  ['SEARCH', 'BUSCAR'],
  ['Subscribe', 'Suscribirse'],
  ['SUBSCRIBE', 'SUSCRIBIRSE'],
  ['Checkout', 'Finalizar Compra'],
  ['CHECKOUT', 'FINALIZAR COMPRA'],
  ['Clear all', 'Limpiar todo'],
  ['Filter and sort', 'Filtrar y ordenar'],
  ['Filter', 'Filtrar'],
  ['FILTER', 'FILTRAR'],
  ['Sort by', 'Ordenar por'],
  ['SORT BY', 'ORDENAR POR'],

  // Etiquetas de Productos
  ['In stock', 'Disponible'],
  ['IN STOCK', 'DISPONIBLE'],
  ['Out of stock', 'Agotado'],
  ['OUT OF STOCK', 'AGOTADO'],
  ['Sold out', 'Agotado'],
  ['SOLD OUT', 'AGOTADO'],
  ['Sale', 'Oferta'],
  ['SALE', 'OFERTA'],
  ['New', 'Nuevo'],
  ['Unit price', 'Precio unitario'],
  ['Regular price', 'Precio normal'],
  ['Sale price', 'Precio de oferta'],

  // Textos Generales
  ['Shopping Cart', 'Carrito de Compras'],
  ['SHOPPING CART', 'CARRITO DE COMPRAS'],
  ['Subtotal', 'Subtotal'],
  ['Total', 'Total'],
  ['Quantity', 'Cantidad'],
  ['Email address', 'Correo electrónico'],
  ['Enter your email', 'Ingresa tu correo'],
  ['Enter email', 'Ingresa tu correo'],
  ['My Account', 'Mi Cuenta'],
  ['Log in', 'Iniciar Sesión'],
  ['LOG IN', 'INICIAR SESIÓN'],
  ['Sign up', 'Registrarse'],
  ['SIGN UP', 'REGISTRARSE'],
];

function translateFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️ Archivo no encontrado: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let replacementsCount = 0;

  for (const [en, es] of TRANSLATIONS) {
    if (content.includes(en)) {
      const parts = content.split(en);
      replacementsCount += parts.length - 1;
      content = parts.join(es);
    }
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Traducido ${filePath}: ${replacementsCount} reemplazos de texto realizados.`);
}

function run() {
  console.log('🚀 Iniciando traducción completa de Plantilla 25 al español...');

  const files = [
    path.join(__dirname, '../public/shopify/plantilla25/body-clean.html'),
    path.join(__dirname, '../public/shopify/plantilla25/header-clean.html'),
    path.join(__dirname, '../public/shopify/plantilla25/index.html'),
    path.join(__dirname, '../src/templates/plantilla25/HomePage.tsx'),
    path.join(__dirname, '../src/templates/plantilla25/enhanceConceptHeader.ts'),
  ];

  files.forEach(translateFile);

  console.log('\n🎉 TRADUCCIÓN DE PLANTILLA 25 FINALIZADA AL 100%.');
}

run();
