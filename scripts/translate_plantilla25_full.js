const fs = require('fs');
const path = require('path');

const TRANSLATIONS = [
  // Textos explicativos largos y pies de página
  ['It’s not actually free we just price it into the products.', 'Envío gratis y despacho rápido a todo Chile.'],
  ['Get free shipping on orders of $150 or more', 'Obtén envío gratis en tus compras por mayor.'],
  ['Refer a friend and get 15% off each other.', 'Recomienda nuestra tienda y obtén descuentos especiales.'],
  ['Your payment information is processed securely', 'Tu información de pago se procesa de forma rápida y segura.'],
  ['Stay in the loop with our weekly newsletter', 'Entérate de nuestras promociones y lanzamientos exclusivos.'],
  ['Choosing a selection results in a full page refresh.', 'Al seleccionar una opción se actualizará la vista.'],
  ['Opens in a new window.', 'Se abre en una nueva ventana.'],
  ['Powered by Shopify', 'Don Balato Iván'],
  ['Concept Theme Tech', 'Don Balato Iván'],
  ['Harmony Sound', 'Don Balato Iván'],
  ['@Harmony', '@donbalatoivan'],

  // Frases promocionales del banner y colecciones
  ['Save up to 60% with code BLACKFRIDAY', 'Ahorra hasta un 60% en tus compras por mayor'],
  ['A question? Visit our contact page', '¿Dudas o consultas? Visita nuestra página de contacto'],
  ['EXPERIENCE UNPARALLELED AUDIO ELEGANCE', 'DESCUBRE LA MEJOR CALIDAD Y PRECIOS AL POR MAYOR'],
  ['Shop Headphones', 'Ver Catálogo'],
  ['UNIQUELY CRAFTED EARPHONES FOR YOUR STYLE', 'PRODUCTOS EXCLUSIVOS CON DISEÑO Y CALIDAD'],
  ['Shop Earphones', 'Ver Ofertas'],
  ['DUST AND WATERPROOF', 'RESISTENTES AL AGUA Y MÁXIMA DURABILIDAD'],
  ['Shop Speakers', 'Ver Productos'],
  ['We believe in the  power of', 'Creemos en la mejor calidad de'],
  ['sound', 'tecnología y hogar'],
  ['is more than just an audio equipment retailer. We represent the grandeur of sound in its finest manifestations. Our mission is to cater to audiophiles and those who simply appreciate quality sound. We offer audio devices that combine unparalleled sound with elegant design. Every product in our catalog promises a full immersion into the world of music for those unwilling to compromise on quality.', 'es tu distribuidor mayorista de confianza. Nos especializamos en traer los mejores productos de tecnología, hogar, moda y limpieza con los precios más competitivos de Chile.'],
  ['We offer everything from the warm sound of vinyl records to the clarity and crispness of modern wireless headphones, ensuring every note sounds impeccable.', 'Ofrecemos atención personalizada, envíos rápidos y garantía en todos nuestros productos.'],
  ['All products', 'Todos los productos'],
  ['Check out all our products', 'Explora todo nuestro catálogo'],
  ['Surround yourself in sound', 'Tecnología y productos de vanguardia'],
  ['Small design, great sound', 'Diseño compacto y alta eficiencia'],
  ['The world’s most immersive sound', 'La mejor experiencia de compra'],
  ['Optimal condition for years', 'Calidad y durabilidad garantizadas'],
  ['Wireless', 'Inalámbricos y Gadgets'],
  ['Headphones to enchant instead of entangle', 'Productos modernos diseñados para tu comodidad'],
  ['Gaming', 'Gamer y Computación'],
  ['Dive into the game with every sound', 'Equípate con lo mejor para tu espacio'],
  ['Limited', 'Edición Limitada'],
  ['Collection for the exceptional', 'Colección seleccionada para ti'],
  ['Sound. Sculpted.', 'Innovación y Calidad'],
  ['A speaker that excites the eye and ear from every angle.', 'Productos con diseño espectacular al mejor precio.'],
  ['Shop Echo Elegance', 'Ver Colección'],
  ['Product highlights', 'Características destacadas'],
  ['Driver size', 'Especificaciones'],
  ['Product weight', 'Peso del paquete'],
  ['Battery life', 'Autonomía de batería'],

  // Bundle / Combos
  ['Build your', 'Arma tu'],
  ['Bundle', 'Combo Mayorista'],
  ['The choice is yours. With our bundle builder, you can select any combination from our range of products. The easiest way to keep everyone happy.', 'La elección es tuya. Con nuestro armador de combos puedes seleccionar cualquier combinación de productos al mejor precio mayorista.'],
  ['Add at least 3 products to proceed and Save 30%', 'Agrega al menos 3 productos para continuar y obtener un 30% de descuento extra'],
  ['Add to bundle', 'Agregar al combo'],
  ['Your bundle', 'Tu combo mayorista'],
  ['Sound in Spectrum', 'Variedad y Tecnología'],
  ['Vibrant Headphone Choices', 'Variedad de Opciones'],

  // Testimonios / Reseñas / Feed
  ['Discover premium audio from our Instagram and shop now.', 'Descubre nuestras últimas publicaciones y productos en Instagram.'],
  ['Shop the Look', 'Comprar el Estilo'],
  ['Get up to 50% off', 'Obtén hasta 50% de descuento'],
  ['on waterproof speakers', 'en productos seleccionados'],
  ['Discover sales', 'Ver Ofertas Destacadas'],
  ['Premium Speakers', 'Productos Destacados'],
  ['Bring Quality Sound into', 'Lleva la Mejor Calidad a'],
  ['Your Home', 'Tu Hogar'],
  ['Choose options', 'Elegir opciones'],
  ['Latest Stories', 'Últimas Noticias y Consejos'],
  ['Read more', 'Leer más'],
  ['0 comments', '0 comentarios'],
  ['Customer service', 'Atención al cliente'],

  // Carrito / Mensajes
  ['Hurry, only 5 items left in stock!', '¡Aprovecha, quedan pocas unidades disponibles!'],
  ['Sold Out - Notify me when it’s available', 'Agotado - Notificarme cuando esté disponible'],
  ['Couldn&#39;t load pickup availability', 'No se pudo cargar la disponibilidad de retiro'],
  ['Pickup currently unavailable at German Warehouse', 'Retiro no disponible en esta sucursal'],
  ['Check availability at other stores', 'Consultar disponibilidad en otras sucursales'],
  ['Share:', 'Compartir:'],
  ['Need help?', '¿Necesitas ayuda?'],
  ['Ships within 1-2 business days.', 'Despacho dentro de 1 a 2 días hábiles.'],
  ['90-day risk-free trial', 'Garantía oficial y soporte directo'],
  ['2-Year Warranty', 'Garantía de Satisfacción'],
  ['View full details', 'Ver detalles del producto'],
  ['Skip to content', 'Saltar al contenido'],
  ['Site navigation', 'Navegación del sitio'],
  ['Our Story', 'Nuestra Historia'],
  ['Our Journal', 'Nuestro Blog'],
  ["FAQ's", 'Preguntas Frecuentes'],
  ['Contact with Map', 'Contacto y Ubicación'],
  ['Store locations', 'Nuestras Tiendas'],
  ['Build Your Bundle', 'Arma tu Combo'],
  ['Recently viewed', 'Vistos Recientemente'],
  ['Your cart is currently empty.', 'Tu carrito está actualmente vacío.'],
  ['Not sure where to start?', '¿No sabes por dónde comenzar?'],
  ['Try these collections:', 'Explora estas categorías destacadas:'],
  ['Headphones', 'Audífonos'],
  ['Earphones', 'In-Ear'],
  ['Speakers', 'Parlantes'],
  ['Accessories', 'Accesorios'],
  ['Spend', 'Agrega'],
  ['more to reach free shipping!', 'más para obtener envío gratis!'],
  ['Gift wrapping:', 'Empaque de regalo:'],
  ['Please check that your gift settings are correct.', 'Por favor verifica que tus opciones de regalo sean correctas.'],
  ['To remove wrapping, please change the "Gift wrapping" above to "None."', 'Para quitar el empaque, cambia "Empaque de regalo" a "Ninguno".'],

  // Botones y Enlaces Comunes
  ['Subscribe to our newsletter', 'Suscríbete a nuestro boletín'],
  ['SUBSCRIBE TO OUR NEWSLETTER', 'SUSCRÍBETE A NUESTRO BOLETÍN'],
  ['Taxes and shipping calculated at checkout', 'Impuestos y costo de envío calculados al finalizar compra'],
  ['Taxes and shipping included', 'Impuestos y envío incluidos'],
  ['Free shipping on all orders', 'Envío gratis en pedidos sobre el mínimo'],
  ['FREE SHIPPING ON ALL ORDERS', 'ENVÍO GRATIS EN TODOS TUS PEDIDOS'],
  ['Free shipping', 'Envío Gratis'],
  ['FREE SHIPPING', 'ENVÍO GRATIS'],
  ['Fast Free Shipping', 'Envío Rápido y Seguro'],
  ['Refer a friend', 'Refiere a un Amigo'],
  ['Secure payment', 'Pago 100% Seguro'],
  ['Money back guarantee', 'Garantía de Devolución'],
  ['24/7 Customer Support', 'Soporte 24/7'],
  ['Your cart is empty', 'Tu carrito está vacío'],
  ['Continue shopping', 'Continuar Comprando'],
  ['CONTINUE SHOPPING', 'CONTINUAR COMPRANDO'],

  // Secciones básicas
  ['Featured Collection', 'Colección Destacada'],
  ['FEATURED COLLECTION', 'COLECCIÓN DESTACADA'],
  ['Featured Products', 'Productos Destacados'],
  ['FEATURED PRODUCTS', 'PRODUCTOS DESTACADOS'],
  ['New Arrivals', 'Nuevas Llegadas'],
  ['NEW ARRIVALS', 'NUEVAS LLEGADAS'],
  ['Best Sellers', 'Los Más Vendidos'],
  ['BEST SELLERS', 'LOS MÁS VENDIDOS'],
  ['Popular Categories', 'Categorías Populares'],
  ['POPULAR CATEGORIES', 'CATEGORÍAS POPULARES'],
  ['Popular categories', 'Categorías populares'],
  ['Customer Reviews', 'Opiniones de Clientes'],
  ['CUSTOMER REVIEWS', 'OPINIONES DE CLIENTES'],
  ['Quick Links', 'Enlaces Rápidos'],
  ['QUICK LINKS', 'ENLACES RÁPIDOS'],
  ['Customer Support', 'Atención al Cliente'],
  ['Follow Us', 'Síguenos'],
  ['FOLLOW US', 'SÍGUENOS'],
  ['About Us', 'Sobre Nosotros'],
  ['Contact Us', 'Contáctanos'],

  // Acciones y Botones Principales
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
  ['Search products', 'Buscar productos'],
  ['Search our store', 'Buscar productos'],
  ['SEARCH OUR STORE', 'BUSCAR EN LA TIENDA'],
  ['Search', 'Buscar'],
  ['SEARCH', 'BUSCAR'],
  ['Subscribe', 'Suscribirse'],
  ['SUBSCRIBE', 'SUSCRIBIRSE'],
  ['Checkout', 'Finalizar Compra'],
  ['CHECKOUT', 'FINALIZAR COMPRA'],
  ['Check out', 'Finalizar Compra'],
  ['Clear all', 'Limpiar todo'],
  ['Clear', 'Limpiar'],
  ['Filter and sort', 'Filtrar y ordenar'],
  ['Filter', 'Filtrar'],
  ['FILTER', 'FILTRAR'],
  ['Sort by', 'Ordenar por'],
  ['SORT BY', 'ORDENAR POR'],

  // Tiempos / Fecha
  ['Days', 'Días'],
  ['Hours', 'Horas'],
  ['Mins', 'Min'],
  ['Secs', 'Seg'],
  ['Days', 'Días'],

  // Formularios
  ['Order note', 'Nota del pedido'],
  ['Order special instructions', 'Instrucciones del pedido'],
  ['Estimate shipping', 'Calcular envío'],
  ['Discount code', 'Código de descuento'],
  ['Information', 'Información'],
  ['FAQs', 'Preguntas Frecuentes'],
  ['FIRST TIMER?', '¿NUEVO CLIENTE?'],
  ['Get 20% Off', 'Obtén 20% de Descuento'],
  ['My Account', 'Mi Cuenta'],
  ['Log in', 'Iniciar Sesión'],
  ['LOG IN', 'INICIAR SESIÓN'],
  ['Sign up', 'Registrarse'],
  ['SIGN UP', 'REGISTRARSE'],
];

function translateFile(filePath) {
  if (!fs.existsSync(filePath)) return;

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
  console.log(`✅ Traducido ${filePath}: ${replacementsCount} frases traducidas al español.`);
}

function run() {
  console.log('🚀 Traduciendo completamente todo el contenido visible de Plantilla 25 al español...');

  const files = [
    path.join(__dirname, '../public/shopify/plantilla25/body-clean.html'),
    path.join(__dirname, '../public/shopify/plantilla25/header-clean.html'),
    path.join(__dirname, '../public/shopify/plantilla25/index.html'),
    path.join(__dirname, '../src/templates/plantilla25/HomePage.tsx'),
    path.join(__dirname, '../src/templates/plantilla25/enhanceConceptHeader.ts'),
  ];

  files.forEach(translateFile);

  console.log('\n🎉 PLANTILLA 25 TRADUCIDA AL ESPAÑOL AL 100%.');
}

run();
