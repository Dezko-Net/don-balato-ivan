// === CATÁLOGO EMPRENDEDOR - BASE TEMPLATE ===
// ============================================
// CONFIGURACIÓN DEL CLIENTE (SaaS dinámico por URL)
let CLIENT_ID = 'donbalatoivan'; // Fallback por defecto

const pathSegments = window.location.pathname.split('/').filter(Boolean);
if (pathSegments.length > 0 && pathSegments[0] !== 'index.html' && !pathSegments[0].includes('.')) {
  CLIENT_ID = pathSegments[0].toLowerCase().trim();
}

let WHATSAPP_CONTACTS = [
  { name: 'Lissy', number: '56962293893' },
  { name: 'Fernanda', number: '56967294975' }
];
const BALATIN_CONTACT = { name: 'Balatin', number: '56936599658' };
const PASSWORDS = { admin: 'Flavia273@' }; // TODO: Move to firebase
const STORAGE_KEYS = { cart: `db_cart_${CLIENT_ID}`, adminAuth: `db_admin_auth_${CLIENT_ID}` };

// === Firebase Firestore (DonBalatoIvan) ===
const firebaseConfig = {
  apiKey: "AIzaSyCIEgaE6Smuyz1YxfoKNXIgq76crN_Me7A",
  authDomain: "donbalatoivanchile.firebaseapp.com",
  projectId: "donbalatoivanchile",
  storageBucket: "donbalatoivanchile.firebasestorage.app",
  messagingSenderId: "786029583380",
  appId: "1:786029583380:web:c515391c5b673f4305db01"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// === Storage separado (geminai) ===
const geminaiConfig = {
  projectId: "geminai-449212",
  appId: "1:786029583380:web:d46a7d85aef100ce05db01",
  databaseURL: "https://geminai-449212-default-rtdb.firebaseio.com",
  storageBucket: "geminai-449212.firebasestorage.app",
  apiKey: "AIzaSyA4GeWM_SyPK9VQiZSFfDIULw2jlVXx4rI",
  authDomain: "geminai-449212.firebaseapp.com",
  messagingSenderId: "786029583380"
};
const geminaiApp = firebase.initializeApp(geminaiConfig, "geminai");
const geminaiStorage = geminaiApp.storage();

// Colecciones dinámicas
const COL_PRODUCTS = `${CLIENT_ID}_products`;
const COL_ORDERS = `${CLIENT_ID}_orders`;
const DOC_OVERRIDES = `${CLIENT_ID}_config/overrides`;
const DOC_DELETED = `${CLIENT_ID}_config/deleted`;
const DOC_CATEGORIES = `${CLIENT_ID}_config/categories`;
const DOC_SETTINGS = `${CLIENT_ID}_config/settings`;
const DOC_GLOBAL = `catalogs_config/${CLIENT_ID}`; // Config del Dashboard

// In-memory caches (populated from Firestore)
let _customProducts = [];
let _overrides = {};
let _deletedSkus = [];
let _customCategories = {};
let _settings = { minPurchase: 50000 };
let _orders = [];
let _firestoreReady = false;
let _globalConfig = {};
let _appwriteCategories = []; // categorias desde Appwrite (con imagenes)
let _appwriteSubcategories = []; // subcategorias desde Appwrite (con imagenes)

async function loadFirestoreData() {
  try {
    // 1. Cargar configuración maestra del dashboard
    const globalSnap = await db.doc(DOC_GLOBAL).get();
    if (globalSnap.exists) {
      _globalConfig = globalSnap.data();
      // TEMP: No sobrescribir contactos de Firestore para usar el número de test
      // if (_globalConfig.contacts && Array.isArray(_globalConfig.contacts) && _globalConfig.contacts.length > 0) WHATSAPP_CONTACTS = _globalConfig.contacts;
      if (_globalConfig.minPurchase) _settings.minPurchase = _globalConfig.minPurchase;
      
      // Actualizar UI con la configuración global
      if (_globalConfig.name) {
        document.title = _globalConfig.name;
        const brandTitle = document.querySelector('.brand-title');
        if (brandTitle) brandTitle.innerHTML = _globalConfig.name;
      }
      
      const minDisplay = document.getElementById('minPurchaseDisplay');
      if (minDisplay) minDisplay.innerText = `Compra mínima · $${_settings.minPurchase.toLocaleString('es-CL')}`;
      
    }

    const [productsSnap, ovDoc, delDoc, catDoc, settingsDoc, ordersSnap] = await Promise.all([
      db.collection(COL_PRODUCTS).get(),
      db.doc(DOC_OVERRIDES).get(),
      db.doc(DOC_DELETED).get(),
      db.doc(DOC_CATEGORIES).get(),
      db.doc(DOC_SETTINGS).get(),
      db.collection(COL_ORDERS).orderBy('date', 'desc').get()
    ]);
    _customProducts = productsSnap.docs.map(d => d.data());
    // Deduplicar customProducts por SKU por si acaso
    const _seenCp = new Set();
    _customProducts = _customProducts.filter(p => {
      if (!p || !p.sku || _seenCp.has(p.sku)) return false;
      _seenCp.add(p.sku);
      return true;
    });
    _overrides = ovDoc.exists ? ovDoc.data().map || {} : {};
    _deletedSkus = delDoc.exists ? (delDoc.data().skus || []) : [];
    
    const rawCat = catDoc.exists ? (catDoc.data().map || {}) : {};
    _customCategories = {};
    for (const k in rawCat) _customCategories[k.replace(/\|\|/g, '/')] = rawCat[k];
    
    _settings = settingsDoc.exists ? (settingsDoc.data() || { minPurchase: 50000 }) : { minPurchase: 50000 };
    _orders = ordersSnap.docs.map(d => ({ id: d.id, ...d.data() }));
    _firestoreReady = true;
  } catch (err) {
    console.warn('Firestore no disponible, usando localStorage fallback:', err);
    _customProducts = JSON.parse(localStorage.getItem('db_custom_products') || '[]');
    _overrides = JSON.parse(localStorage.getItem('db_overrides') || '{}');
    _deletedSkus = JSON.parse(localStorage.getItem('db_deleted') || '[]');
    _customCategories = JSON.parse(localStorage.getItem('db_categories') || '{}');
    _settings = JSON.parse(localStorage.getItem('db_settings') || '{"minPurchase": 50000}');
    _orders = JSON.parse(localStorage.getItem('db_orders') || '[]');
  }

}


// === Orders ===
function getOrders() { return _orders; }
async function saveOrders(o) { _orders = o; }
async function saveOrderFromCart() {
  const order = {
    date: new Date().toISOString(),
    items: cart.map(i => ({ sku: i.sku, name: i.name, qty: i.qty, price: i.price, mode: i.mode })),
    total: cartTotal(),
    paid: false,
    stockApplied: false
  };
  try {
    const ref = await db.collection(COL_ORDERS).add(order);
    order.id = ref.id;
    _orders.unshift(order);
  } catch (err) { console.error('Error saving order:', err); }
}
async function markOrderPaid(orderId) {
  const order = _orders.find(o => o.id === orderId);
  if (!order) return;
  if (!order.stockApplied) {
    const overrides = getOverrides();
    order.items.forEach(item => {
      const p = getProducts().find(x => x.sku === item.sku);
      if (!p) return;
      const ov = overrides[item.sku] || {};
      const currentStock = ov.stock !== undefined ? ov.stock : p.stock;
      ov.stock = Math.max(0, currentStock - item.qty);
      overrides[item.sku] = ov;
    });
    await saveOverrides(overrides);
    order.stockApplied = true;
  }
  order.paid = true;
  try { await db.collection(COL_ORDERS).doc(orderId).update({ paid: true, stockApplied: order.stockApplied }); } catch(e) {}
  showToast('Pedido marcado como pagado, stock actualizado');
  renderAdmin();
}
async function deleteOrder(orderId) {
  if (!confirm('¿Eliminar este pedido del registro?')) return;
  _orders = _orders.filter(o => o.id !== orderId);
  try { await db.collection(COL_ORDERS).doc(orderId).delete(); } catch(e) {}
  renderAdmin();
}
async function unmarkOrderPaid(orderId) {
  const order = _orders.find(o => o.id === orderId);
  if (!order) return;
  if (order.stockApplied) {
    const overrides = getOverrides();
    order.items.forEach(item => {
      const p = getProducts().find(x => x.sku === item.sku);
      if (!p) return;
      const ov = overrides[item.sku] || {};
      const currentStock = ov.stock !== undefined ? ov.stock : p.stock;
      ov.stock = currentStock + item.qty;
      overrides[item.sku] = ov;
    });
    await saveOverrides(overrides);
    order.stockApplied = false;
  }
  order.paid = false;
  try { await db.collection(COL_ORDERS).doc(orderId).update({ paid: false, stockApplied: false }); } catch(e) {}
  renderAdmin();
}

// State
let allProducts = [];
let cart = JSON.parse(localStorage.getItem(STORAGE_KEYS.cart) || '[]');
let currentMode = 'public'; // 'public' | 'admin'
let searchQuery = '';
let _adminSearchDebounce = null;

// Helpers
const $ = (sel) => document.querySelector(sel);
const formatPrice = (n) => '$' + Math.round(n).toLocaleString('es-CL');
const escapeHtml = (s) => String(s||'').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);

const CATEGORY_ICONS = {
  // Top categories
  'Nuevos': 'https://cdn-icons-png.flaticon.com/512/2665/2665051.png',
  'Hogar': 'https://cdn-icons-png.flaticon.com/512/619/619153.png',
  'Electronica': 'https://cdn-icons-png.flaticon.com/512/3556/3556550.png',
  'Ropa': 'https://cdn-icons-png.flaticon.com/512/5853/5853911.png',
  'Jardin y Exterior': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8RfsdbSc49NqsJkqtr6_UiwW66j2kmUR8BA&s',
  'Regalos': 'https://cdn-icons-png.flaticon.com/512/4213/4213958.png',
  'Escolar': 'https://cdn-icons-png.flaticon.com/512/747/747062.png',
  // Subcategories (Hogar)
  'Cocina': 'https://cdn-icons-png.flaticon.com/512/1830/1830839.png',
  'Limpieza': 'https://cdn-icons-png.flaticon.com/512/995/995053.png',
  'Decoracion': 'https://cdn-icons-png.flaticon.com/512/2620/2620910.png',
  'Organizacion': 'https://cdn-icons-png.flaticon.com/512/2702/2702069.png',
  'Salud y Bienestar': 'https://cdn-icons-png.flaticon.com/512/2966/2966327.png',
  'Mascotas': 'https://cdn-icons-png.flaticon.com/512/616/616430.png',
  'Manualidades': 'https://cdn-icons-png.flaticon.com/512/2784/2784065.png',
  'Belleza': 'https://cdn-icons-png.flaticon.com/512/6075/6075201.png',
  'Bano': 'https://cdn-icons-png.flaticon.com/512/4151/4151196.png',
  'Juguetes y Bebes': 'https://cdn-icons-png.flaticon.com/512/3082/3082040.png',
  'Auto': 'https://cdn-icons-png.flaticon.com/512/3097/3097180.png',
  // Subcategories (Electronica)
  'Audio': 'https://cdn-icons-png.flaticon.com/512/727/727269.png',
  'Camaras': 'https://cdn-icons-png.flaticon.com/512/685/685655.png',
  'Iluminacion': 'https://cdn-icons-png.flaticon.com/512/702/702797.png',
  'Cocina Electrica': 'https://cdn-icons-png.flaticon.com/512/3082/3082031.png',
  'Cuidado Personal': 'https://cdn-icons-png.flaticon.com/512/2933/2933116.png',
  'Accesorios Tech': 'https://cdn-icons-png.flaticon.com/512/2659/2659980.png',
  // Subcategories (Ropa)
  'Invierno': 'https://cdn-icons-png.flaticon.com/512/2942/2942466.png',
  'Hombre': 'https://cdn-icons-png.flaticon.com/512/2257/2257295.png',
  'Mujer': 'https://cdn-icons-png.flaticon.com/512/4140/4140037.png',
  'Ninos': 'https://cdn-icons-png.flaticon.com/512/3043/3043798.png',
  'Accesorios': 'https://cdn-icons-png.flaticon.com/512/892/892458.png',
  // Other subcategories
  'Exterior': 'https://cdn-icons-png.flaticon.com/512/2924/2924779.png',
  'Ramos y Decoracion': 'https://cdn-icons-png.flaticon.com/512/3081/3081860.png',
  'Materiales': 'https://cdn-icons-png.flaticon.com/512/3534/3534033.png',
  'Otros': 'https://cdn-icons-png.flaticon.com/512/1377/1377194.png'
};

function getCustomCategories() { return _customCategories; }
function getKnownCategories() {
  const bad = ['0', 's', 'sin categoria', '?'];
  const customObj = getCustomCategories();
  const deletedCats = Object.keys(customObj).filter(k => customObj[k] === '__DELETED__');
  
  const base = allProducts.map(x => x.category).filter(c => !deletedCats.includes(c));
  const custom = Object.keys(customObj).filter(k => !k.includes('/') && customObj[k] !== '__DELETED__');
  const current = getProducts().map(x => x.category);
  
  return [...new Set([...base, ...custom, ...current])]
    .filter(Boolean)
    .filter(c => !bad.includes(c.toLowerCase().trim()))
    .sort();
}

function getKnownSubcategories(category) {
  const bad = ['0', 's', 'sin categoria', '?'];
  const customObj = getCustomCategories();
  const deletedSubs = Object.keys(customObj).filter(k => customObj[k] === '__DELETED__');
  
  const base = allProducts.filter(p => p.category === category && !deletedSubs.includes(category + '/' + p.subcategory)).map(p => p.subcategory);
  const custom = Object.keys(customObj)
    .filter(k => k.startsWith(category + '/') && k.split('/').length === 2 && customObj[k] !== '__DELETED__')
    .map(k => k.split('/')[1]);
  const current = getProducts().filter(p => p.category === category).map(p => p.subcategory);
  
  return [...new Set([...base, ...custom, ...current])]
    .filter(Boolean)
    .filter(s => !bad.includes(s.toLowerCase().trim()))
    .sort();
}
async function saveCustomCategories(cats) {
  _customCategories = cats;
  localStorage.setItem('db_categories', JSON.stringify(cats));
  const encoded = {};
  for (const k in cats) encoded[k.replace(/\//g, '||')] = cats[k];
  try { await db.doc(DOC_CATEGORIES).set({ map: encoded }); } catch(e) { console.error('Error saving categories:', e); }
}

function getMinPurchase() { return _settings.minPurchase || 50000; }

// Extract leading emoji from a string (handles surrogate pairs + variation selectors)
function extractEmoji(name) {
  if (!name) return '';
  // Regex: emoji ranges including surrogate pairs, ZWJ sequences, variation selectors, skin tones
  const emojiRegex = /^(\p{Extended_Pictographic}(?:\u200d\p{Extended_Pictographic})*[\uFE0E\uFE0F]?)/u;
  const m = name.match(emojiRegex);
  return m ? m[1] : '';
}

// Remove leading emoji + trailing whitespace from a name
function stripEmoji(name) {
  if (!name) return '';
  const emoji = extractEmoji(name);
  return emoji ? name.slice(emoji.length).trim() : name.trim();
}

// Generic SVG icon for categories/subcategories without emoji or image
const FALLBACK_CAT_SVG = '<svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M21 7l-1-1m0 0l-3-3m3 3l-3-3m3 3v10a2 2 0 01-2 2H7a2 2 0 01-2-2V4m0 0l3-3m-3 3l3-3m0 0h7a2 2 0 012 2v0M7 10h10M7 14h6"/></svg>';
async function saveSettings(newSettings) {
  _settings = { ..._settings, ...newSettings };
  localStorage.setItem('db_settings', JSON.stringify(_settings));
  try { await db.doc(DOC_SETTINGS).set(_settings); } catch(e) { console.error('Error saving settings:', e); }
}

window.updateMinPurchase = async function() {
  const val = parseInt(document.getElementById('admin_min_purchase').value);
  if (isNaN(val) || val < 0) return showToast('Monto inválido');
  await saveSettings({ minPurchase: val });
  
  const minPurchEl = document.getElementById('minPurchaseDisplay');
  if (minPurchEl) minPurchEl.textContent = `Compra mínima • $${getMinPurchase().toLocaleString('es-CL')}`;
  
  showToast('Compra mínima actualizada');
};

function getCategoryIcon(cat, fullPathArray) {
  // 1. Custom categories (Firestore admin del catalogo)
  if (fullPathArray && fullPathArray.length > 0) {
    const pathStr = fullPathArray.join('/');
    if (_customCategories[pathStr] && _customCategories[pathStr].image) {
      return _customCategories[pathStr].image;
    }
  }
  if (_customCategories[cat] && _customCategories[cat].image) {
    return _customCategories[cat].image;
  }
  // 2. Appwrite categories: buscar por nombre en _appwriteCategories
  if (_appwriteCategories && _appwriteCategories.length > 0) {
    var apiBase = window.location.origin.indexOf('localhost') >= 0
      ? 'http://localhost:3000'
      : window.location.origin;
    // Top-level category: match by name
    var catMatch = _appwriteCategories.find(function(c) { return c.name === cat; });
    if (catMatch) {
      var icon = catMatch.iconUrl || catMatch.BACKGROUND_IMAGE_URL || '';
      if (icon) return resolveAppwriteImage(icon, apiBase);
    }
    // Subcategory: match by name in _appwriteSubcategories
    if (fullPathArray && fullPathArray.length > 1) {
      var subMatch = _appwriteSubcategories.find(function(s) { return s.name === cat; });
      if (subMatch) {
        var subIcon = subMatch.iconUrl || subMatch.BACKGROUND_IMAGE_URL || '';
        if (subIcon) return resolveAppwriteImage(subIcon, apiBase);
      }
    }
  }
  // 3. Hardcoded fallback icons
  return CATEGORY_ICONS[cat] || null;
}

function showToast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.remove('hidden');
  setTimeout(() => t.classList.add('hidden'), 1800);
}

function getPrice(p) {
  return Math.max(p.priceA || 0, p.priceB || 0);
}

function getOverrides() { return _overrides; }
async function saveOverrides(ovs) {
  _overrides = ovs;
  try { await db.doc(DOC_OVERRIDES).set({ map: ovs }); } catch(e) { console.error('Error saving overrides:', e); }
}
function setOverride(sku, patch) {
  const ovs = getOverrides();
  ovs[sku] = { ...(ovs[sku] || {}), ...patch };
  _overrides = ovs;
  db.doc(DOC_OVERRIDES).set({ map: ovs }).catch(e => console.error('Error saving override:', e));
}
function clearOverride(sku) {
  const ovs = getOverrides();
  delete ovs[sku];
  _overrides = ovs;
  db.doc(DOC_OVERRIDES).set({ map: ovs }).catch(e => console.error('Error clearing override:', e));
}
function getDeleted() { return _deletedSkus; }
function setDeleted(skus) {
  _deletedSkus = skus;
  db.doc(DOC_DELETED).set({ skus }).catch(e => console.error('Error saving deleted:', e));
}
function getProducts() {
  const overrides = getOverrides();
  const deleted = new Set(getDeleted());
  const seen = new Set();
  return [..._customProducts, ...allProducts]
    .filter(p => {
      if (!p || !p.sku || String(p.sku).trim() === '' || deleted.has(p.sku)) return false;
      if (seen.has(p.sku)) return false;
      seen.add(p.sku);
      return true;
    })
    .map(p => overrides[p.sku] ? { ...p, ...overrides[p.sku] } : p);
}

// Image fallback HTML
function imgEl(src, alt, sizeClass='w-full h-full') {
  const initials = (alt || '?').split(' ').filter(Boolean).slice(0, 2).map(w => w[0] || '').join('').toUpperCase() || 'DB';
  if (!src) {
    return `<div class="${sizeClass} img-placeholder rounded-2xl text-xl font-bold font-display">${escapeHtml(initials)}</div>`;
  }
  return `<img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" class="${sizeClass} object-cover rounded-2xl" loading="lazy" onerror="this.onerror=null; this.outerHTML='<div class=\\'${sizeClass} img-placeholder rounded-2xl text-xl font-bold font-display\\'>${escapeHtml(initials)}</div>'">`;
}

// === Cart ===
function saveCart() {
  localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(cart));
  updateCartCount();
}
function updateCartCount() {
  const total = cart.reduce((s, i) => s + i.qty, 0);
  const el = $('#cartCount');
  const navEl = $('#navCartBadge');
  if (total > 0) {
    el.textContent = total;
    el.classList.remove('hidden');
    el.classList.add('pop');
    setTimeout(() => el.classList.remove('pop'), 300);
    if (navEl) { navEl.textContent = total; navEl.classList.remove('hidden'); }
  } else {
    el.classList.add('hidden');
    if (navEl) navEl.classList.add('hidden');
  }
}

function updateBottomNav() {
  const hash = location.hash || '#/';
  let active = 'home';
  if (hash.startsWith('#/all')) active = 'all';
  else if (hash.startsWith('#/my-orders')) active = 'orders';
  else if (hash.startsWith('#/search')) active = 'search';
  else if (hash !== '#/' && hash !== '') active = 'all';
  document.querySelectorAll('#bottomNav .nav-item').forEach(el => {
    el.classList.toggle('active', el.dataset.nav === active);
  });
}
function addToCart(sku, qty = 1) {
  const p = getProducts().find(x => x.sku === sku);
  if (!p) return;
  qty = Math.max(1, parseInt(qty) || 1);
  const existing = cart.find(i => i.sku === sku && i.mode === currentMode);
  const inCart = existing ? existing.qty : 0;
  const room = Math.max(0, (p.stock || 0) - inCart);
  if (room <= 0) { showToast('Sin más stock disponible'); return; }
  const add = Math.min(qty, room);
  if (existing) existing.qty += add;
  else cart.push({ sku, id: p.id || '', image: p.image || '', qty: add, mode: currentMode, price: getPrice(p), name: p.name });
  saveCart();
  showToast(add > 1 ? `${add} agregados al carrito` : 'Agregado al carrito');
  flyToCart(sku);
  trackUserAddToCart(sku, add);
  if (add < qty) showToast(`Solo quedaban ${add} unidades`);
}

// Fly product image to the cart icon
function flyToCart(sku) {
  try {
    const btn = document.querySelector(`button[onclick*="'${sku}'"]`);
    const card = btn && btn.closest('.product-card');
    const srcImg = (card && card.querySelector('img')) || document.querySelector(`#modal-content img`);
    const cartBtn = document.getElementById('cartBtn');
    if (!srcImg || !cartBtn) return;
    const s = srcImg.getBoundingClientRect();
    const c = cartBtn.getBoundingClientRect();
    if (s.width === 0 || s.height === 0) {  // source not visible: just bump the cart
      cartBtn.classList.add('cart-thump');
      setTimeout(() => cartBtn.classList.remove('cart-thump'), 450);
      return;
    }
    const fly = document.createElement('img');
    fly.src = srcImg.src;
    fly.className = 'fly-img';
    fly.style.left = s.left + 'px'; fly.style.top = s.top + 'px';
    fly.style.width = s.width + 'px'; fly.style.height = s.height + 'px';
    document.body.appendChild(fly);
    requestAnimationFrame(() => {
      fly.style.left = (c.left + c.width / 2 - 12) + 'px';
      fly.style.top = (c.top + c.height / 2 - 12) + 'px';
      fly.style.width = '24px'; fly.style.height = '24px';
      fly.style.opacity = '0.3'; fly.style.transform = 'rotate(25deg)';
    });
    setTimeout(() => {
      fly.remove();
      cartBtn.classList.add('cart-thump');
      setTimeout(() => cartBtn.classList.remove('cart-thump'), 450);
    }, 700);
  } catch (e) { /* animation is non-critical */ }
}
function removeFromCart(sku, mode) {
  cart = cart.filter(i => !(i.sku === sku && i.mode === mode));
  saveCart();
  renderCart();
}
function changeQty(sku, mode, delta) {
  const idx = cart.findIndex(i => i.sku === sku && i.mode === mode);
  if (idx === -1) return;
  cart[idx].qty += delta;
  if (cart[idx].qty <= 0) {
    cart.splice(idx, 1);
  }
  saveCart();
  renderCart();
}
function setQty(sku, mode, value) {
  const qty = parseInt(value);
  if (isNaN(qty) || qty < 1) return;
  const idx = cart.findIndex(i => i.sku === sku && i.mode === mode);
  if (idx === -1) return;
  cart[idx].qty = qty;
  saveCart();
  renderCart();
}
function cartTotal() {
  return cart.reduce((s, i) => s + i.qty * i.price, 0);
}
function openCart() {
  $('#cartDrawer').classList.remove('hidden');
  $('#bottomNav').style.display = 'none';
  document.body.style.overflow = 'hidden';
  renderCart();
}
function closeCart() {
  $('#cartDrawer').classList.add('hidden');
  $('#bottomNav').style.display = '';
  document.body.style.overflow = '';
}
function renderCart() {
  const wrap = $('#cartItems');
  if (cart.length === 0) {
    wrap.innerHTML = `
      <div class="text-center py-16 px-4">
        <div class="w-16 h-16 mx-auto rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-3xl mb-3 shadow-xs">
          🛒
        </div>
        <h3 class="font-display font-extrabold text-blue-950 text-base mb-1">Tu carrito está vacío</h3>
        <p class="text-xs text-blue-400 font-medium max-w-[200px] mx-auto">Explora nuestro catálogo mayorista y añade tus productos favoritos.</p>
      </div>`;
    $('#cartTotal').textContent = '$0';
    let warnEmpty = $('#minWarn');
    if (warnEmpty) warnEmpty.remove();
    return;
  }
  let timerHeader = `
    <div class="rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-400/15 to-yellow-500/10 border border-amber-300/80 p-3 mb-3 flex items-center justify-between shadow-xs">
      <div class="flex items-center gap-2">
        <span class="relative flex h-2.5 w-2.5">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
        </span>
        <span class="text-xs font-extrabold text-amber-950">⚠️ Reserva de stock activa</span>
      </div>
      <div class="font-mono font-extrabold text-xs text-blue-950 bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-300 px-3 py-1 rounded-full border border-amber-400/80 shadow-xs flex items-center gap-1">
        ⏱️ <span id="cartTimerDisplay" class="text-blue-950 font-mono font-extrabold">09:59</span> min
      </div>
    </div>`;

  wrap.innerHTML = timerHeader + cart.map(i => {
    const p = getProducts().find(x => x.sku === i.sku);
    const displaySubOrSku = (p?.code && p.code.length <= 12) ? `SKU: ${p.code}` : (p?.subcategory || p?.category || `COD: #${String(i.sku).slice(-6).toUpperCase()}`);
    return `
    <div class="flex gap-3 bg-gradient-to-br from-white to-blue-50/40 rounded-2xl p-3.5 border border-blue-100/90 shadow-sm hover:border-blue-300/80 transition-all duration-200">
      <div class="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-blue-50 border border-blue-100/80 relative shadow-xs">
        ${imgEl(p?.image, i.name, 'w-full h-full object-cover')}
      </div>
      <div class="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <div class="font-extrabold text-blue-950 text-xs sm:text-sm leading-tight line-clamp-2">${escapeHtml(i.name)}</div>
          <div class="text-[10px] text-blue-500/90 mt-0.5 uppercase tracking-wider font-semibold">${escapeHtml(displaySubOrSku)}</div>
        </div>
        <div class="flex items-center justify-between gap-2 mt-2">
          <div class="text-blue-950 font-extrabold text-base">${formatPrice(i.price * i.qty)}</div>
          <div class="flex items-center gap-1 bg-blue-50/90 rounded-xl border border-blue-200/80 p-0.5 shadow-xs">
            <button onclick="changeQty('${i.sku}','${i.mode}',-1)" class="w-7 h-7 rounded-lg bg-white hover:bg-blue-100 text-blue-900 font-extrabold active:scale-90 flex items-center justify-center transition shadow-xs" aria-label="Restar">−</button>
            <input type="number" value="${i.qty}" min="1" onchange="setQty('${i.sku}','${i.mode}',this.value)" class="w-9 text-center font-extrabold text-blue-950 text-xs sm:text-sm bg-transparent focus:outline-none">
            <button onclick="changeQty('${i.sku}','${i.mode}',1)" class="w-7 h-7 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-extrabold active:scale-90 flex items-center justify-center transition shadow-xs" aria-label="Sumar">+</button>
          </div>
        </div>
        <div class="flex justify-end mt-1.5">
          <button onclick="removeFromCart('${i.sku}','${i.mode}')" class="text-[10px] text-rose-500 hover:text-rose-700 font-extrabold active:scale-95 transition flex items-center gap-1">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
            Eliminar
          </button>
        </div>
      </div>
    </div>
  `;
  }).join('');

  $('#cartTotal').textContent = formatPrice(cartTotal());
  initCartReservationTimer();

  // Show min purchase warning
  const total = cartTotal();
  let warn = $('#minWarn');
  if (!warn) {
    warn = document.createElement('div');
    warn.id = 'minWarn';
    warn.className = 'text-xs text-center mb-3 px-3.5 py-2 rounded-xl font-extrabold flex items-center justify-center gap-1.5 shadow-xs transition-all';
    const totalEl = $('#cartTotal').closest('.flex');
    if (totalEl) totalEl.parentNode.insertBefore(warn, totalEl);
  }
  if (total < getMinPurchase()) {
    const missing = getMinPurchase() - total;
    warn.innerHTML = `<span>⚠️ Faltan <strong class="underline">${formatPrice(missing)}</strong> para la compra mínima ($50K)</span>`;
    warn.className = 'text-xs text-center mb-3 px-3.5 py-2 rounded-xl font-extrabold bg-amber-50 text-amber-900 border border-amber-300/80 shadow-xs flex items-center justify-center gap-1.5';
  } else {
    warn.innerHTML = `<span>✓ Compra mínima alcanzada</span>`;
    warn.className = 'text-xs text-center mb-3 px-3.5 py-2 rounded-xl font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200/90 shadow-xs flex items-center justify-center gap-1.5';
  }
}
let selectedAttendant = null;
function sendWhatsApp() {
  if (cart.length === 0) { showToast('Carrito vacio'); return; }
  if (cartTotal() < getMinPurchase()) {
    showToast(`Compra minima: $${getMinPurchase().toLocaleString('es-CL')}`);
    return;
  }
  // Render attendant options (step 1) — 3 circular selectors
  selectedAttendant = null;
  var container = document.getElementById('attendantOptions');
  if (container) {
    var attendantMeta = [
      {
        emoji: null,
        img: 'https://storage.googleapis.com/asistoraerp.firebasestorage.app/IADESIGN/2026/08/1785997439696-pegada-1785997429956.png',
        label: 'Lissy',
        sub: 'Personalizado',
        border: 'border-red-400',
        hover: 'hover:border-red-500',
        text: 'text-red-500',
        floatingEmojis: ['❤️', '💖', '💕']
      },
      {
        emoji: null,
        img: 'https://storage.googleapis.com/asistoraerp.firebasestorage.app/IADESIGN/2026/08/1785998075009-pegada-1785998072451.png',
        label: 'Fernanda',
        sub: 'Personalizado',
        border: 'border-gray-500',
        hover: 'hover:border-gray-600',
        text: 'text-gray-600',
        floatingEmojis: ['🖤', '🖤', '🖤']
      },
    ];
    var humanButtons = attendantMeta.map(function(meta, idx) {
      var emojisMarkup = (meta.floatingEmojis || []).map(function(em, eIdx) {
        var posClass = eIdx === 0 ? 'bottom-1.5 left-2' : (eIdx === 1 ? 'top-2 right-2' : 'bottom-2 right-2');
        var animName = eIdx % 2 === 0 ? 'gentleEmojiFloat' : 'gentleEmojiPulse';
        var delay = (eIdx * 0.6).toFixed(1) + 's';
        var dur = (3.4 + eIdx * 0.4).toFixed(1) + 's';
        return '<span class="attendant-emoji absolute text-[12px] ' + posClass + ' pointer-events-none select-none z-20" style="animation: ' + animName + ' ' + dur + ' ease-in-out ' + delay + ' infinite alternate;">' + em + '</span>';
      }).join('');

      var avatarContent = meta.img
        ? '<div class="relative w-full h-full rounded-full overflow-hidden"><img src="' + meta.img + '" alt="' + meta.label + '" class="w-full h-full object-cover rounded-full">' + emojisMarkup + '</div>'
        : meta.emoji;
      return '<button type="button" data-idx="' + idx + '" onclick="selectAttendant(' + idx + ')" class="attendant-btn group flex flex-col items-center gap-3 transition-all duration-200 active:scale-90">' +
        '<div class="w-24 h-24 rounded-full border-4 ' + meta.border + ' ' + meta.hover + ' bg-transparent flex items-center justify-center text-5xl transition-all duration-200 group-hover:scale-110 group-hover:shadow-lg overflow-hidden relative">' +
          avatarContent +
        '</div>' +
        '<div class="text-center">' +
          '<div class="font-bold text-gray-800 text-sm">' + meta.label + '</div>' +
          '<div class="text-[10px] text-gray-400 font-medium mt-0.5">' + meta.sub + '</div>' +
        '</div>' +
      '</button>';
    }).join('');

    var balatinEmojis = '<span class="attendant-emoji absolute text-[12px] bottom-1.5 left-2 pointer-events-none select-none z-20" style="animation: gentleEmojiFloat 3.4s ease-in-out 0s infinite alternate;">⚡</span>' +
      '<span class="attendant-emoji absolute text-[11px] top-2 right-2 pointer-events-none select-none z-20" style="animation: gentleEmojiPulse 3.8s ease-in-out 0.6s infinite alternate;">✨</span>' +
      '<span class="attendant-emoji absolute text-[10px] bottom-2 right-2 pointer-events-none select-none z-20" style="animation: gentleEmojiFloat 3.6s ease-in-out 1.2s infinite alternate;">⭐</span>';

    var balatinButton = '<button type="button" onclick="sendToBalatin()" class="attendant-btn group flex flex-col items-center gap-3 transition-all duration-200 active:scale-90">' +
      '<div class="w-24 h-24 rounded-full border-4 border-blue-400 hover:border-blue-500 bg-transparent flex items-center justify-center text-5xl transition-all duration-200 group-hover:scale-110 group-hover:shadow-lg overflow-hidden relative">' +
        '<div class="relative w-full h-full rounded-full overflow-hidden"><img src="https://storage.googleapis.com/asistoraerp.firebasestorage.app/IADESIGN/2026/08/1786020188976-pegada-1786020186663.png" alt="Balatin" class="w-full h-full object-contain rounded-full">' + balatinEmojis + '</div>' +
      '</div>' +
      '<div class="text-center">' +
        '<div class="font-bold text-gray-800 text-sm flex items-center gap-1 justify-center">Balatin <span class="text-[8px] font-bold bg-blue-400 text-white px-1.5 py-0.5 rounded-full">IA</span></div>' +
        '<div class="text-[10px] text-blue-500 font-medium mt-0.5">Al instante</div>' +
      '</div>' +
    '</button>';
    container.innerHTML = '<div class="flex justify-center items-start gap-8 py-2">' + humanButtons + balatinButton + '</div>';
  }
  // Show step 1 (attendant selection), hide step 2 (name/phone)
  var step1 = document.getElementById('modalStep1');
  var step2 = document.getElementById('modalStep2');
  if (step1) step1.classList.remove('hidden');
  if (step2) step2.classList.add('hidden');
  // Show modal
  const modal = document.getElementById('customerFormModal');
  if (modal) { modal.classList.remove('hidden'); return; }
}
function selectAttendant(idx) {
  selectedAttendant = idx;
  var buttons = document.querySelectorAll('.attendant-btn');
  buttons.forEach(function(btn) {
    var circle = btn.querySelector('div');
    if (String(btn.getAttribute('data-idx')) === String(idx)) {
      if (circle) {
        circle.style.transform = 'scale(1.1)';
        circle.style.borderWidth = '5px';
        circle.style.boxShadow = '0 0 0 4px rgba(0,0,0,0.05)';
      }
    } else if (btn.getAttribute('data-idx')) {
      if (circle) {
        circle.style.transform = '';
        circle.style.borderWidth = '';
        circle.style.boxShadow = '';
      }
    }
  });
  // Show step 2 (name + phone) after selecting a human attendant
  var step2 = document.getElementById('modalStep2');
  if (step2) step2.classList.remove('hidden');
  // Focus name input
  setTimeout(function() {
    var nameInput = document.getElementById('custName');
    if (nameInput) nameInput.focus();
  }, 100);
}
function closeCustomerFormModal() {
  const modal = document.getElementById('customerFormModal');
  if (modal) modal.classList.add('hidden');
}
// Normaliza cualquier formato de telefono chileno a 56 + 9 + 8 digitos
function normalizeChileanPhone(raw) {
  if (!raw) return '';
  // Quitar todo lo que no sea digito
  var digits = raw.replace(/\D/g, '');
  // Si esta vacio
  if (!digits) return '';
  // Si empieza con 56, quitarlo para trabajar limpio
  if (digits.indexOf('56') === 0) {
    digits = digits.substring(2);
  }
  // Si empieza con 0, quitarlo
  if (digits.indexOf('0') === 0) {
    digits = digits.substring(1);
  }
  // Si tiene 8 digitos (sin el 9), agregar el 9 adelante
  if (digits.length === 8) {
    digits = '9' + digits;
  }
  // Si tiene 9 digitos y no empieza con 9, agregar 9
  if (digits.length === 9 && digits.charAt(0) !== '9') {
    digits = '9' + digits;
  }
  // Si tiene mas de 9 digitos, tomar los ultimos 9
  if (digits.length > 9) {
    digits = digits.substring(digits.length - 9);
  }
  // Si tiene menos de 9, no se puede usar
  if (digits.length < 9) return '';
  // Retornar con 56 adelante
  return '56' + digits;
}
// Balatin: sin formulario, sin pedido pre-creado. El cliente le escribe directo con su lista
// y Balatin arma el pedido conversando (nombre, stock, direccion y comprobante por chat).
function sendToBalatin() {
  if (cart.length === 0) { showToast('Carrito vacio'); return; }
  if (cartTotal() < getMinPurchase()) {
    showToast(`Compra minima: $${getMinPurchase().toLocaleString('es-CL')}`);
    return;
  }

  var apiBase = window.location.origin.indexOf('localhost') >= 0
    ? 'http://localhost:3000'
    : 'https://www.donbalatomayorista.cl';

  var orderItems = cart.map(function(i) {
    return { id: i.id || '', sku: i.sku, name: i.name, qty: i.qty, price: i.price, image: i.image || '' };
  });
  var total = cartTotal();

  // Crear pedido en Appwrite (sin nombre ni telefono — Balatin los pedira por chat)
  var orderCode = '';
  var orderId = '';
  var saveError = false;
  var self = this;

  (async function() {
    try {
      var res = await fetch(apiBase + '/api/catalogo/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: '',
          customerPhone: '',
          items: orderItems,
          total: total,
          assignedCashier: 'Balatin'
        })
      });
      var data = await res.json();
      if (data.success) {
        orderCode = data.orderCode || '';
        orderId = data.orderId || '';
      } else {
        saveError = true;
      }
    } catch (e) {
      console.error('Error guardando pedido Balatin en Appwrite:', e);
      saveError = true;
    }

    // Construir mensaje de WhatsApp para Balatin con el codigo del pedido
    var waMsg = '*Hola Balatin!*\n\n';
    waMsg += 'Quiero hacer este pedido:\n\n';
    waMsg += '----------------------------------------\n';
    cart.forEach(function(i) {
      waMsg += '\n- ' + i.name + '\n';
      waMsg += '  ' + i.qty + ' x ' + formatPrice(i.price) + ' = ' + formatPrice(i.price * i.qty) + '\n';
    });
    waMsg += '\n----------------------------------------\n';
    waMsg += '*Total: ' + formatPrice(total) + '*\n';
    waMsg += '*Codigo: ' + orderCode + '*';

    var waUrl = 'https://wa.me/' + BALATIN_CONTACT.number + '?text=' + encodeURIComponent(waMsg);

    // Guardar pedido en localStorage
    if (orderCode) saveLocalOrder(orderCode, orderId, cart.slice(), total, 'Balatin');

    // Limpiar carrito y cerrar modal
    cart = [];
    saveCart();
    updateCartCount();
    closeCustomerFormModal();

    // Mostrar confirmacion y abrir WhatsApp
    showOrderConfirmation(orderCode, '', saveError, waUrl);
  })();
}

async function submitCustomerOrder() {
  if (selectedAttendant === null) { showToast('Selecciona quien te atiende'); return; }
  var rawName = (document.getElementById('custName') || {}).value || '';
  var customerName = rawName.trim();
  if (!customerName) { showToast('Por favor ingresa tu nombre'); return; }
  var rawPhone = (document.getElementById('custPhone') || {}).value || '';
  var normalizedPhone = normalizeChileanPhone(rawPhone);
  if (!normalizedPhone) { showToast('Numero de telefono invalido. Ej: 9 1234 5678 o 56912345678'); return; }

  var attendant = WHATSAPP_CONTACTS[selectedAttendant];

  var apiBase = window.location.origin.indexOf('localhost') >= 0
    ? 'http://localhost:3000'
    : window.location.origin;

  var orderItems = cart.map(function(i) {
    return { id: i.id || '', sku: i.sku, name: i.name, qty: i.qty, price: i.price, image: i.image || '' };
  });
  var total = cartTotal();

  var orderCode = '';
  var orderId = '';
  var saveError = false;

  // Guardar en Appwrite (orders con STATUS pending_stock)
  try {
    var res = await fetch(apiBase + '/api/catalogo/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: customerName,
        customerPhone: normalizedPhone,
        items: orderItems,
        total: total,
        assignedCashier: attendant.name
      })
    });
    var data = await res.json();
    if (data.success) {
      orderCode = data.orderCode || '';
      orderId = data.orderId || '';
    } else {
      saveError = true;
    }
  } catch (e) {
    console.error('Error guardando pedido en Appwrite:', e);
    saveError = true;
  }

  // Construir mensaje de WhatsApp para la cajera con link de verificar stock
  var siteUrl = window.location.origin.indexOf('localhost') >= 0
    ? 'http://localhost:3000'
    : 'https://www.donbalatomayorista.cl';
  var waMsg = '*Hola, soy ' + customerName + '*\n\n';
  waMsg += 'Mira, tengo un pedido del catalogo.\n\n';
  waMsg += '_Ignora el enlace del final, es solo para uso interno._\n\n';
  waMsg += '----------------------------------------\n';
  waMsg += '*Cliente:* ' + customerName + '\n';
  waMsg += '*Telefono:* ' + normalizedPhone + '\n';
  waMsg += '*Codigo:* ' + (orderCode ? orderCode : '') + '\n\n';
  waMsg += '*Productos:*\n';
  cart.forEach(function(i) {
    waMsg += '\n- ' + i.name + '\n';
    waMsg += '  ' + i.qty + ' x ' + formatPrice(i.price) + ' = ' + formatPrice(i.price * i.qty) + '\n';
  });
  waMsg += '\n----------------------------------------\n';
  waMsg += '*Total: ' + formatPrice(total) + '*\n\n';
  waMsg += siteUrl + '/verificar-stock?code=' + orderCode;

  var waUrl = 'https://wa.me/' + attendant.number + '?text=' + encodeURIComponent(waMsg);

  // Guardar pedido y teléfono en localStorage
  if (orderCode) saveLocalOrder(orderCode, orderId, cart.slice(), total, attendant.name);
  saveCustomerPhone(normalizedPhone);

  // Limpiar carrito
  cart = [];
  saveCart();
  updateCartCount();

  // Mostrar modal de confirmación
  showOrderConfirmation(orderCode, customerName, saveError, waUrl);
}

function showOrderConfirmation(orderCode, customerName, hasError, waUrl) {
  var modal = document.getElementById('orderConfirmModal');
  var titleEl = document.getElementById('ocTitle');
  var msgEl = document.getElementById('ocMessage');
  var codeEl = document.getElementById('ocCode');
  var waBtn = document.getElementById('ocWhatsAppBtn');

  if (hasError) {
    if (titleEl) titleEl.textContent = 'Hubo un problema';
    if (msgEl) msgEl.innerHTML = 'No pudimos registrar tu pedido. Intenta nuevamente.';
    if (codeEl) codeEl.textContent = '';
    if (waBtn) waBtn.classList.add('hidden');
  } else {
    if (titleEl) titleEl.textContent = '¡Pedido enviado!';
    if (msgEl) msgEl.innerHTML = 'Gracias <strong>' + escapeHtml(customerName) + '</strong>.<br>Tu pedido fue registrado. Envíanos el mensaje de WhatsApp para que la cajera verifique el stock.';
    if (codeEl) codeEl.textContent = orderCode ? 'Código: ' + orderCode : '';
    if (waBtn && waUrl) {
      waBtn.href = waUrl;
      waBtn.classList.remove('hidden');
    }
  }

  if (modal) modal.classList.remove('hidden');
}

function closeOrderConfirmModal() {
  var modal = document.getElementById('orderConfirmModal');
  if (modal) modal.classList.add('hidden');
}

// === Local orders (localStorage) ===
function saveLocalOrder(orderCode, orderId, items, total, cashier) {
  try {
    var orders = JSON.parse(localStorage.getItem('myOrders') || '[]');
    orders.unshift({
      orderCode: orderCode,
      orderId: orderId || '',
      items: items.map(function(i) { return { name: i.name, qty: i.qty, price: i.price, image: i.image || '' }; }),
      total: total,
      cashier: cashier || '',
      status: 'pending_stock',
      createdAt: new Date().toISOString()
    });
    localStorage.setItem('myOrders', JSON.stringify(orders.slice(0, 50)));
  } catch (e) { console.error('Error saving local order:', e); }
}
function getLocalOrders() {
  try { return JSON.parse(localStorage.getItem('myOrders') || '[]'); } catch { return []; }
}
function saveCustomerPhone(phone) {
  try { localStorage.setItem('customerPhone', phone); } catch {}
}
function getCustomerPhone() {
  try { return localStorage.getItem('customerPhone') || ''; } catch { return ''; }
}

// === My Orders view ===
var ORDER_STATUS_LABELS = {
  'pending': 'Pendiente',
  'pending_stock': 'Verificando stock',
  'payment_review': 'Pago en revisión',
  'paid': 'Pagado',
  'payment_confirmed': 'Pago confirmado',
  'processing': 'Procesando',
  'shipped': 'Entregado a agencia',
  'delivered': 'Entregado',
  'negotiation': 'Negociando',
  'cancelled': 'Cancelado'
};
var ORDER_STATUS_COLORS = {
  'pending': '#f59e0b',
  'pending_stock': '#f59e0b',
  'payment_review': '#8b5cf6',
  'paid': '#3b82f6',
  'payment_confirmed': '#22c55e',
  'processing': '#3b82f6',
  'shipped': '#06b6d4',
  'delivered': '#22c55e',
  'negotiation': '#f97316',
  'cancelled': '#ef4444'
};
var ORDER_STATUS_ICONS = {
  'pending': '⏳',
  'pending_stock': '🔍',
  'payment_review': '🔍',
  'paid': '💳',
  'payment_confirmed': '✅',
  'processing': '📦',
  'shipped': '🚚',
  'delivered': '🎉',
  'negotiation': '🤝',
  'cancelled': '❌'
};

function renderMyOrders() {
  var app = $('#app');
  var localOrders = getLocalOrders();
  var savedPhone = getCustomerPhone();

  app.innerHTML = '<div class="min-h-screen pb-24 space-y-4">' +
    '<!-- Header Banner (Cristal Blanco Luxe Theme) -->' +
    '<div class="relative overflow-hidden rounded-[26px] p-5 sm:p-6 bg-gradient-to-r from-blue-50/90 via-white to-blue-50/90 border border-blue-200/80 shadow-sm mb-4">' +
      '<div class="flex items-center gap-3 relative z-10">' +
        '<div class="w-12 h-12 rounded-2xl bg-blue-100/80 border border-blue-200/80 flex items-center justify-center text-2xl flex-shrink-0 shadow-xs">' +
          '📦' +
        '</div>' +
        '<div>' +
          '<h1 class="font-display font-extrabold text-xl sm:text-2xl text-blue-950 leading-tight">Mis Pedidos</h1>' +
          '<p class="text-xs text-blue-500/90 font-semibold">Sigue en tiempo real el estado de tus compras</p>' +
        '</div>' +
      '</div>' +
    '</div>' +

    '<div class="max-w-2xl mx-auto space-y-4">' +
      '<div id="myOrdersList" class="space-y-3"></div>' +

      '<div class="rounded-[24px] p-5 bg-white/95 backdrop-blur-xl border border-blue-100/90 shadow-sm">' +
        '<div class="flex items-center gap-2 mb-1.5">' +
          '<div class="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">' +
            '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>' +
          '</div>' +
          '<p class="text-sm font-extrabold text-blue-950">Sincronizar pedidos</p>' +
        '</div>' +
        '<p class="text-xs text-blue-400 font-medium mb-3">Ingresa tu número de teléfono para vincular y buscar todas tus compras automáticamente.</p>' +
        '<div class="flex gap-2">' +
          '<input id="syncPhoneInput" type="tel" placeholder="Ej: 9 1234 5678" value="' + escapeHtml(savedPhone) + '" class="flex-1 px-4 py-2.5 text-sm font-semibold text-blue-950 bg-blue-50/50 border border-blue-200/80 rounded-2xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all">' +
          '<button onclick="syncMyOrders()" class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm rounded-2xl active:scale-95 transition shadow-sm flex items-center gap-1.5 whitespace-nowrap">' +
            '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>' +
            'Sincronizar</button>' +
        '</div>' +
      '</div>' +
    '</div>' +
  '</div>';

  renderMyOrdersList(localOrders);
  if (savedPhone) {
    syncMyOrders(true);
  }
}

function renderMyOrdersList(orders) {
  var list = document.getElementById('myOrdersList');
  if (!list) return;
  if (!orders || orders.length === 0) {
    list.innerHTML = '<div class="text-center py-14 px-4 bg-white/90 backdrop-blur-xl rounded-[28px] border border-blue-100/90 shadow-sm">' +
      '<div class="w-20 h-20 mx-auto rounded-3xl bg-blue-50 border border-blue-100 flex items-center justify-center text-4xl mb-4 shadow-xs">📦</div>' +
      '<h3 class="font-display font-extrabold text-blue-950 text-lg mb-1">No tienes pedidos aún</h3>' +
      '<p class="text-xs text-blue-400 font-medium max-w-[240px] mx-auto mb-6">Cuando hagas un pedido en nuestro catálogo mayorista aparecerá aquí.</p>' +
      '<a href="#/" class="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-300 text-blue-950 font-extrabold text-sm shadow-md shadow-amber-300/30 active:scale-95 transition-all"><span>🛍️ Explorar Catálogo</span></a>' +
    '</div>';
    return;
  }
  list.innerHTML = orders.map(function(o) {
    var status = o.status || 'pending_stock';
    var label = ORDER_STATUS_LABELS[status] || status;
    var color = ORDER_STATUS_COLORS[status] || '#6b7280';
    var icon = ORDER_STATUS_ICONS[status] || '📦';
    var date = o.createdAt ? new Date(o.createdAt).toLocaleDateString('es-CL', { day: 'numeric', month: 'short', year: 'numeric' }) : '';
    var itemCount = (o.items || []).reduce(function(s, i) { return s + (i.qty || 1); }, 0);
    var items = o.items || [];
    var firstItems = items.slice(0, 2);
    var remainingCount = items.length - firstItems.length;

    return '<div class="bg-white rounded-[24px] border border-blue-100 shadow-sm overflow-hidden transition-all hover:shadow-md hover:border-blue-200">' +
      '<div class="px-5 py-3.5 flex items-center justify-between border-b border-blue-100/60 bg-blue-50/40">' +
        '<div class="flex items-center gap-2.5">' +
          '<span class="text-xl">' + icon + '</span>' +
          '<div>' +
            '<p class="font-mono font-extrabold text-sm text-blue-950">' + escapeHtml(o.orderCode || 'Sin código') + '</p>' +
            '<p class="text-[10px] text-blue-400 font-semibold">' + date + '</p>' +
          '</div>' +
        '</div>' +
        '<span class="text-xs font-extrabold px-3 py-1 rounded-full border border-current shadow-xs" style="background:' + color + '15;color:' + color + ';border-color:' + color + '30;">' + escapeHtml(label) + '</span>' +
      '</div>' +
      '<div class="p-5">' +
        '<div class="space-y-2.5 mb-4">' +
          firstItems.map(function(it) {
            return '<div class="flex items-center gap-3">' +
              '<div class="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center overflow-hidden flex-shrink-0 border border-blue-100/80">' +
                (it.image ? '<img src="' + escapeHtml(it.image) + '" class="w-full h-full object-cover">' : '<span class="text-blue-300 text-sm">📦</span>') +
              '</div>' +
              '<div class="flex-1 min-w-0">' +
                '<p class="text-xs font-extrabold text-blue-950 truncate">' + escapeHtml(it.name || '') + '</p>' +
                '<p class="text-[10px] text-blue-400 font-semibold mt-0.5">' + (it.qty || 1) + ' x ' + formatPrice(it.price || 0) + '</p>' +
              '</div>' +
            '</div>';
          }).join('') +
          (remainingCount > 0 ? '<p class="text-[11px] text-blue-500 font-extrabold pl-1">+' + remainingCount + ' producto' + (remainingCount > 1 ? 's' : '') + ' más</p>' : '') +
        '</div>' +
        '<div class="flex items-center justify-between pt-3 border-t border-blue-100/60">' +
          '<div class="flex items-center gap-2 text-xs text-blue-500 font-semibold">' +
            '<span>' + itemCount + ' producto' + (itemCount !== 1 ? 's' : '') + '</span>' +
            (o.cashier ? '<span>·</span><span class="text-blue-600 font-bold">' + escapeHtml(o.cashier) + '</span>' : '') +
          '</div>' +
          '<span class="font-display font-extrabold text-base text-blue-950">' + formatPrice(o.total || 0) + '</span>' +
        '</div>' +
        (o.trackingNumber ? '<div class="mt-3 p-3 rounded-2xl flex items-center gap-2.5 bg-cyan-50/80 border border-cyan-200/80 shadow-xs">' +
          '<svg class="w-5 h-5 text-cyan-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>' +
          '<div><p class="text-[10px] text-cyan-600 font-extrabold uppercase tracking-wider">Seguimiento de envío</p><p class="text-xs text-cyan-900 font-mono font-extrabold">' + escapeHtml(o.trackingNumber) + '</p></div>' +
        '</div>' : '') +
        '<details class="mt-3">' +
          '<summary class="text-xs font-extrabold text-blue-600 hover:text-blue-800 cursor-pointer transition select-none">Ver resumen de productos ▾</summary>' +
          '<div class="mt-2 space-y-2 pt-2 border-t border-blue-50">' +
            items.map(function(it) {
              return '<div class="flex items-center gap-2.5 text-xs py-1">' +
                '<div class="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center overflow-hidden flex-shrink-0 border border-blue-100">' +
                  (it.image ? '<img src="' + escapeHtml(it.image) + '" class="w-full h-full object-cover">' : '<span class="text-blue-300 text-[10px]">📦</span>') +
                '</div>' +
                '<span class="flex-1 text-blue-900 font-semibold truncate">' + escapeHtml(it.name || '') + '</span>' +
                '<span class="text-blue-400 font-bold">x' + (it.qty || 1) + '</span>' +
                '<span class="font-extrabold text-blue-950">' + formatPrice((it.price || 0) * (it.qty || 1)) + '</span>' +
              '</div>';
            }).join('') +
          '</div>' +
        '</details>' +
      '</div>' +
    '</div>';
  }).join('');
}

async function syncMyOrders(silent) {
  var phoneInput = document.getElementById('syncPhoneInput');
  var phone = phoneInput ? phoneInput.value.trim() : '';
  if (!phone) { if (!silent) showToast('Ingresa tu número de teléfono'); return; }
  var normalized = normalizeChileanPhone(phone);
  if (!normalized) { if (!silent) showToast('Teléfono inválido. Ej: 9 1234 5678'); return; }
  saveCustomerPhone(normalized);

  var list = document.getElementById('myOrdersList');
  if (list && !silent) {
    list.innerHTML = '<div class="text-center py-12"><div class="animate-spin w-8 h-8 border-3 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-3"></div><p class="text-sm text-gray-400">Sincronizando...</p></div>';
  }

  try {
    var apiBase = window.location.origin.indexOf('localhost') >= 0 ? 'http://localhost:3000' : window.location.origin;
    var res = await fetch(apiBase + '/api/catalogo/my-orders?phone=' + encodeURIComponent(normalized));
    var data = await res.json();
    if (data.success && data.orders) {
      // Merge: combine local + server orders, dedup by orderCode
      var localOrders = getLocalOrders();
      var seen = {};
      var merged = [];
      // Server orders first (they have real status)
      data.orders.forEach(function(o) { if (o.orderCode && !seen[o.orderCode]) { seen[o.orderCode] = true; merged.push(o); } });
      // Local orders that aren't on server yet
      localOrders.forEach(function(o) { if (o.orderCode && !seen[o.orderCode]) { seen[o.orderCode] = true; merged.push(o); } });
      // Save merged to localStorage
      try { localStorage.setItem('myOrders', JSON.stringify(merged.slice(0, 50))); } catch {}

      renderMyOrdersList(merged);
      if (!silent) showToast('Pedidos sincronizados (' + merged.length + ')');
    } else {
      if (!silent) showToast('No se encontraron pedidos');
      renderMyOrdersList(getLocalOrders());
    }
  } catch (e) {
    console.error('Error syncing orders:', e);
    if (!silent) showToast('Error al sincronizar');
    renderMyOrdersList(getLocalOrders());
  }
}

// === Routing ===
function parseHash() {
  const h = location.hash.slice(1) || '/';
  const parts = h.split('/').filter(Boolean);
  return parts;
}
function navigate(path) {
  location.hash = path;
}
window.addEventListener('hashchange', render);

// === Render ===
function render() {
  initPersistentHeroTimer();
  initAnnouncementBarEngine();
  initLiveUsersEngine();
  const parts = parseHash();
  const route = parts[0] || '';

  // Detect mode based on route
  const modeTag = $('#modeTag');
  if (modeTag) {
    if (route === 'admin') {
      currentMode = 'admin';
      modeTag.classList.remove('hidden');
      modeTag.textContent = 'Admin';
    } else {
      currentMode = 'public';
      modeTag.classList.add('hidden');
    }
  } else {
    currentMode = route === 'admin' ? 'admin' : 'public';
  }

  // Show back button if not home
  const backBtn = $('#backBtn');
  if (backBtn) {
    backBtn.classList.toggle('hidden', parts.length === 0);
  }

  // Show bottom nav on home and my-orders pages, hide on other screens
  const isHome = parts.length === 0;
  const isMyOrders = route === 'my-orders';
  const bottomNav = document.getElementById('bottomNav');
  if (bottomNav) bottomNav.classList.toggle('hidden', !isHome && !isMyOrders);

  // Routes
  if (route === 'admin') return renderAdmin(parts.slice(1));
  if (route === 'category') return renderCategory(parts.slice(1));
  if (route === 'all') return renderAllProducts();
  if (route === 'my-orders') return renderMyOrders();
  if (route === 'search' || searchQuery) return renderSearch();
  renderHome();
  // Defer particle init hasta después del primer paint del DOM
  // (en producción/Vercel el canvas lee offsetWidth=0 si se llama síncronamente)
  requestAnimationFrame(function() {
    requestAnimationFrame(function() {
      initHeroParticles();
    });
  });
  initLiveUsersCounter();
  initFomoSalesEngine();
  return;
}

function scrollToCategoriesSection() {
  if (location.hash !== '#/' && location.hash !== '') {
    location.hash = '#/';
    setTimeout(function() {
      var el = document.getElementById('categoriesSection');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 200);
  } else {
    var el = document.getElementById('categoriesSection');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }
}
window.scrollToCategoriesSection = scrollToCategoriesSection;

var _heroParticleRAF = null;

function initHeroParticles(catName, containerId) {
  var container = document.getElementById(containerId || 'heroParticles');
  if (!container) return;
  container.innerHTML = '';
  if (_heroParticleRAF) { cancelAnimationFrame(_heroParticleRAF); _heroParticleRAF = null; }

  var canvas = document.createElement('canvas');
  container.appendChild(canvas);
  var ctx = canvas.getContext('2d');

  var W, H;
  function resize() {
    W = canvas.width = container.offsetWidth || 480;
    H = canvas.height = container.offsetHeight || 220;
  }
  resize();
  window.addEventListener('resize', resize);

  var T = 0; // global tick

  // ─── PALETA DE COLORES ───────────────────────────────────────────────────────
  var COLORS = {
    gold:   [255, 210, 60],
    amber:  [255, 170, 30],
    white:  [240, 248, 255],
    sky:    [96,  195, 255],
    rose:   [255, 180, 150],
  };
  var PALETTE = ['gold','gold','gold','amber','white','white','sky'];

  function rgba(c, a) { return 'rgba('+c[0]+','+c[1]+','+c[2]+','+a.toFixed(3)+')'; }
  function pickColor() { return COLORS[PALETTE[Math.floor(Math.random() * PALETTE.length)]]; }

  // ─── CAPA 1: BOKEH ATMOSFÉRICO (grandes esferas borrosas en fondo) ────────────
  var bokeh = [];
  for (var i = 0; i < 5; i++) {
    bokeh.push({
      x: Math.random() * W, y: Math.random() * H,
      r: 14 + Math.random() * 28,          // 14-42 px (antes 28-83)
      col: pickColor(),
      ox: Math.random() * Math.PI * 2,
      oy: Math.random() * Math.PI * 2,
      fx: 0.00015 + Math.random() * 0.0002,
      fy: 0.00012 + Math.random() * 0.00018,
      amp: 12 + Math.random() * 18,
      baseAlpha: 0.022 + Math.random() * 0.03, // antes 0.04-0.11
      pulsePhase: Math.random() * Math.PI * 2,
      pulseFreq: 0.0004 + Math.random() * 0.0006,
    });
  }

  // ─── CAPA 2: POLVO DORADO ASCENDENTE (partículas que nacen abajo y mueren arriba) ─
  var DUST_COUNT = 18;
  function mkDust() {
    return {
      x: Math.random() * W,
      y: H + Math.random() * 20,
      r: 0.5 + Math.random() * 1.5,         // antes 0.8-3.6
      col: pickColor(),
      vy: -(0.08 + Math.random() * 0.22),   // más lento
      vx: (Math.random() - 0.5) * 0.1,
      wobbleAmp: 0.3 + Math.random() * 1.2,
      wobbleFreq: 0.005 + Math.random() * 0.012,
      wobblePhase: Math.random() * Math.PI * 2,
      life: 0,
      maxLife: 260 + Math.floor(Math.random() * 320),
      baseAlpha: 0.18 + Math.random() * 0.25, // antes 0.4-0.9
    };
  }
  var dust = [];
  for (var i = 0; i < DUST_COUNT; i++) {
    var d = mkDust();
    d.y = Math.random() * H;   // al inicio distribuir por toda la altura
    d.life = Math.floor(Math.random() * d.maxLife);
    dust.push(d);
  }

  // ─── CAPA 3: DESTELLOS DIAMANTE con halo pulsante ────────────────────────────
  var SPARK_COUNT = 12;
  function mkSpark() {
    return {
      x: 0.05 * W + Math.random() * 0.9 * W,
      y: 0.05 * H + Math.random() * 0.9 * H,
      r: 1.2 + Math.random() * 2.2,         // antes 2.5-7.5
      col: pickColor(),
      rot: Math.random() * Math.PI,
      rotSpeed: (Math.random() - 0.5) * 0.018,
      ox: Math.random() * Math.PI * 2,
      oy: Math.random() * Math.PI * 2,
      fx: 0.0003 + Math.random() * 0.0005,
      fy: 0.00025 + Math.random() * 0.0004,
      driftAmp: 4 + Math.random() * 8,
      life: 0,
      maxLife: 180 + Math.floor(Math.random() * 220),
      baseAlpha: 0.22 + Math.random() * 0.28, // antes 0.5-1.0
      haloScale: 0.8 + Math.random() * 1.2,   // antes 1-3.5
      haloPhase: Math.random() * Math.PI * 2,
    };
  }
  var sparks = [];
  for (var i = 0; i < SPARK_COUNT; i++) {
    var s = mkSpark();
    s.life = Math.floor(Math.random() * s.maxLife);
    sparks.push(s);
  }

  // ─── DRAW HELPERS ─────────────────────────────────────────────────────────────


  function drawBokeh(b, elapsed) {
    var dx = Math.sin(elapsed * b.fx + b.ox) * b.amp;
    var dy = Math.cos(elapsed * b.fy + b.oy) * b.amp * 0.6;
    var pulse = 0.5 + 0.5 * Math.sin(elapsed * b.pulseFreq + b.pulsePhase);
    var a = b.baseAlpha * (0.7 + 0.3 * pulse);
    ctx.save();
    ctx.filter = 'blur(' + Math.round(b.r * 0.55) + 'px)';
    var g = ctx.createRadialGradient(b.x + dx, b.y + dy, 0, b.x + dx, b.y + dy, b.r);
    g.addColorStop(0,   rgba(b.col, Math.min(1, a * 2.2)));
    g.addColorStop(0.5, rgba(b.col, a * 0.5));
    g.addColorStop(1,   rgba(b.col, 0));
    ctx.beginPath();
    ctx.arc(b.x + dx, b.y + dy, b.r, 0, Math.PI * 2);
    ctx.fillStyle = g;
    ctx.fill();
    ctx.restore();
  }

  function drawDust(d) {
    var progress = d.life / d.maxLife;
    // Fade in rápido, fade out lento
    var a = d.baseAlpha * (progress < 0.12 ? progress / 0.12 : progress > 0.8 ? (1 - progress) / 0.2 : 1);
    var wx = d.x + Math.sin(d.life * d.wobbleFreq + d.wobblePhase) * d.wobbleAmp;

    // Glow halo
    var g = ctx.createRadialGradient(wx, d.y, 0, wx, d.y, d.r * 3.5);
    g.addColorStop(0,   rgba(d.col, Math.min(1, a * 1.6)));
    g.addColorStop(0.5, rgba(d.col, a * 0.4));
    g.addColorStop(1,   rgba(d.col, 0));
    ctx.beginPath();
    ctx.arc(wx, d.y, d.r * 3.5, 0, Math.PI * 2);
    ctx.fillStyle = g;
    ctx.fill();

    // Core bright dot
    ctx.beginPath();
    ctx.arc(wx, d.y, d.r, 0, Math.PI * 2);
    ctx.fillStyle = rgba(d.col, Math.min(1, a * 2));
    ctx.fill();
  }

  function drawStar4(cx, cy, r, rot, col, a) {
    // 4-punta estrella alargada (clásico destello de diamante)
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rot);
    // Rayo horizontal
    var gx = ctx.createLinearGradient(-r * 3.5, 0, r * 3.5, 0);
    gx.addColorStop(0,   rgba(col, 0));
    gx.addColorStop(0.5, rgba(col, a));
    gx.addColorStop(1,   rgba(col, 0));
    ctx.beginPath();
    ctx.moveTo(-r * 3.5, 0); ctx.lineTo(0, r * 0.35); ctx.lineTo(r * 3.5, 0); ctx.lineTo(0, -r * 0.35);
    ctx.closePath();
    ctx.fillStyle = gx;
    ctx.fill();
    // Rayo vertical
    var gy = ctx.createLinearGradient(0, -r * 3.5, 0, r * 3.5);
    gy.addColorStop(0,   rgba(col, 0));
    gy.addColorStop(0.5, rgba(col, a));
    gy.addColorStop(1,   rgba(col, 0));
    ctx.beginPath();
    ctx.moveTo(0, -r * 3.5); ctx.lineTo(r * 0.35, 0); ctx.lineTo(0, r * 3.5); ctx.lineTo(-r * 0.35, 0);
    ctx.closePath();
    ctx.fillStyle = gy;
    ctx.fill();
    // Core glow
    var gc = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 1.2);
    gc.addColorStop(0,   rgba([255,255,255], Math.min(1, a * 1.4)));
    gc.addColorStop(0.5, rgba(col, a * 0.7));
    gc.addColorStop(1,   rgba(col, 0));
    ctx.beginPath();
    ctx.arc(0, 0, r * 1.2, 0, Math.PI * 2);
    ctx.fillStyle = gc;
    ctx.fill();
    ctx.restore();
  }

  function drawSparkParticle(s, elapsed) {
    var progress = s.life / s.maxLife;
    var a = s.baseAlpha * (progress < 0.15 ? progress / 0.15 : progress > 0.75 ? (1 - progress) / 0.25 : 1);

    var dx = Math.sin(elapsed * s.fx + s.ox) * s.driftAmp;
    var dy = Math.cos(elapsed * s.fy + s.oy) * s.driftAmp * 0.5;

    // Halo externo pulsante
    var hPulse = 0.5 + 0.5 * Math.sin(elapsed * 0.002 + s.haloPhase);
    var hR = s.r * (s.haloScale + 0.5 * hPulse);
    var hg = ctx.createRadialGradient(s.x + dx, s.y + dy, 0, s.x + dx, s.y + dy, hR);
    hg.addColorStop(0,   rgba(s.col, a * 0.35));
    hg.addColorStop(0.6, rgba(s.col, a * 0.08));
    hg.addColorStop(1,   rgba(s.col, 0));
    ctx.beginPath();
    ctx.arc(s.x + dx, s.y + dy, hR, 0, Math.PI * 2);
    ctx.fillStyle = hg;
    ctx.fill();

    drawStar4(s.x + dx, s.y + dy, s.r, s.rot, s.col, a);
    s.rot += s.rotSpeed;
  }


  // ─── ANIMATION LOOP ──────────────────────────────────────────────────────────
  var startTime = performance.now();

  function frame(now) {
    W = canvas.width = container.offsetWidth || W;
    H = canvas.height = container.offsetHeight || H;
    ctx.clearRect(0, 0, W, H);

    var elapsed = now - startTime;
    T++;

    // 1. Bokeh fondo
    for (var i = 0; i < bokeh.length; i++) drawBokeh(bokeh[i], elapsed);

    // 2. Polvo ascendente
    for (var i = 0; i < dust.length; i++) {
      var d = dust[i];
      d.life++;
      d.y += d.vy;
      d.x += d.vx;
      drawDust(d);
      if (d.life >= d.maxLife || d.y < -10) { dust[i] = mkDust(); }
    }

    // 3. Destellos diamante
    for (var i = 0; i < sparks.length; i++) {
      var s = sparks[i];
      s.life++;
      drawSparkParticle(s, elapsed);
      if (s.life >= s.maxLife) { sparks[i] = mkSpark(); }
    }
    _heroParticleRAF = requestAnimationFrame(frame);
  }

  _heroParticleRAF = requestAnimationFrame(frame);
}

function getCategoryBgEmojis(catName) {
  var n = (catName || '').toLowerCase();
  if (n.includes('aseo') || n.includes('limpieza') || n.includes('baño')) return '🫧 🧼 🧽';
  if (n.includes('electrónica') || n.includes('tecnología') || n.includes('audio') || n.includes('celular')) return '⚡ 🎧 📱';
  if (n.includes('hogar') || n.includes('cocina') || n.includes('decoración')) return '🏡 🍳 ☕';
  if (n.includes('juguet') || n.includes('niño') || n.includes('bebé')) return '🎈 🧸 🚀';
  if (n.includes('mascota')) return '🐾 🐶 🐱';
  if (n.includes('moda') || n.includes('calzado') || n.includes('ropa')) return '👟 🕶️ 🎒';
  return '📦 🏡 ⚡';
}

function getCategorySparkleColor(catName) {
  var n = (catName || '').toLowerCase();
  if (n.includes('aseo') || n.includes('limpieza')) return 'bg-cyan-400';
  if (n.includes('electrónica') || n.includes('tecnología')) return 'bg-purple-400';
  if (n.includes('hogar') || n.includes('cocina')) return 'bg-amber-400';
  if (n.includes('juguet') || n.includes('niño')) return 'bg-emerald-400';
  if (n.includes('belleza')) return 'bg-rose-400';
  return 'bg-blue-400';
}
  // === Live Connected Users Simulator Engine (Organic Step Walk 29..120) ===
var _liveUsersCount = 64;
var _liveUsersTarget = 78;
var _liveUsersTimeout = null;

function initLiveUsersEngine() {
  var el = document.getElementById('liveUsersCount');
  if (!el) return;

  if (_liveUsersTimeout) clearTimeout(_liveUsersTimeout);

  function tick() {
    // Pick new target if close to current target
    if (Math.abs(_liveUsersCount - _liveUsersTarget) <= 2 || Math.random() < 0.22) {
      var r = Math.random();
      if (r < 0.65) {
        // Normal range: 59 to 118
        _liveUsersTarget = Math.floor(Math.random() * (118 - 59 + 1)) + 59;
      } else if (r < 0.85) {
        // Dip range: 32 to 58
        _liveUsersTarget = Math.floor(Math.random() * (58 - 32 + 1)) + 32;
      } else {
        // Low dip floor: 29 to 31
        _liveUsersTarget = Math.floor(Math.random() * (31 - 29 + 1)) + 29;
      }
    }

    // Step towards target smoothly (+1, +2, +3 or -1, -2, -3)
    var dir = _liveUsersTarget > _liveUsersCount ? 1 : -1;
    var stepSize = Math.floor(Math.random() * 3) + 1;
    _liveUsersCount += dir * stepSize;

    // Strict Boundaries: NEVER below 29, NEVER above 120
    _liveUsersCount = Math.max(29, Math.min(120, _liveUsersCount));

    var currentEl = document.getElementById('liveUsersCount');
    if (currentEl) {
      currentEl.textContent = _liveUsersCount;
    }

    var nextDelay = Math.floor(Math.random() * 1000) + 2000;
    _liveUsersTimeout = setTimeout(tick, nextDelay);
  }

  el.textContent = _liveUsersCount;
  _liveUsersTimeout = setTimeout(tick, 2200);
}

// === Persistent Urgency Countdown Timers (per customer in localStorage) ===
var _heroTimerInterval = null;
var _cartTimerInterval = null;

function initPersistentHeroTimer() {
  var display = document.getElementById('persistentTimer');
  if (!display) return;

  var endTs = localStorage.getItem('db_fomo_hero_timer_end');
  var now = Date.now();

  if (!endTs || Number(endTs) <= now) {
    endTs = now + (24 * 60 + 35) * 1000;
    localStorage.setItem('db_fomo_hero_timer_end', endTs);
  } else {
    endTs = Number(endTs);
  }

  if (_heroTimerInterval) clearInterval(_heroTimerInterval);
  _heroTimerInterval = setInterval(function() {
    var rem = Math.max(0, Math.floor((endTs - Date.now()) / 1000));
    if (rem <= 0) {
      endTs = Date.now() + (24 * 60 + 35) * 1000;
      localStorage.setItem('db_fomo_hero_timer_end', endTs);
      rem = 24 * 60 + 35;
    }
    var m = Math.floor(rem / 60);
    var s = rem % 60;
    var el = document.getElementById('persistentTimer');
    if (el) el.textContent = (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s);
  }, 1000);
}

// === Smart Personalized Subcategory Promo Engine ===
var _announcementTimerInterval = null;
var _lastScrollY = window.scrollY;

function getActivePromoSubcategoryPath() {
  var products = typeof getProducts === 'function' ? getProducts() : [];
  if (products.length === 0) return ['Aseo y Limpieza'];

  // 1. Personalization Trick: Check if customer has cart history or orders!
  try {
    var userCart = typeof cart !== 'undefined' && cart.length > 0 ? cart : JSON.parse(localStorage.getItem('db_cart') || '[]');
    if (userCart && userCart.length > 0) {
      var lastCartItem = userCart[userCart.length - 1];
      var matchP = products.find(p => p.sku === lastCartItem.sku);
      if (matchP) {
        var path = getProductPath(matchP);
        if (path && path.length > 0) return path;
      }
    }
  } catch (e) {}

  // 2. Personalization Trick: Check previous orders history
  try {
    var orders = JSON.parse(localStorage.getItem('db_my_orders') || '[]');
    if (orders && orders.length > 0 && orders[0].items && orders[0].items.length > 0) {
      var lastOrderItem = orders[0].items[0];
      var matchOrderP = products.find(p => p.sku === lastOrderItem.sku);
      if (matchOrderP) {
        var oPath = getProductPath(matchOrderP);
        if (oPath && oPath.length > 0) return oPath;
      }
    }
  } catch (e) {}

  // 3. Persistent stored real subcategory path for this customer
  try {
    var storedPath = localStorage.getItem('db_fomo_user_promo_path');
    if (storedPath) {
      var parsed = JSON.parse(storedPath);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}

  // 4. Fallback: Pick a random real product path from actual products database!
  var validProductsWithCat = products.filter(p => (p.category || p.subcategory) && p.stock > 0);
  if (validProductsWithCat.length > 0) {
    var randomP = validProductsWithCat[Math.floor(Math.random() * validProductsWithCat.length)];
    var rPath = getProductPath(randomP);
    try { localStorage.setItem('db_fomo_user_promo_path', JSON.stringify(rPath)); } catch(e){}
    return rPath;
  }

  return ['Aseo y Limpieza'];
}

function getActivePromoSubcategoryName() {
  var path = getActivePromoSubcategoryPath();
  return path[path.length - 1] || path[0] || 'Aseo y Limpieza';
}

function getActivePromoSubcategory() {
  return getActivePromoSubcategoryName();
}

function initAnnouncementBarEngine() {
  var promoTitleEl = document.getElementById('promoSubcatTitle');
  var promoSubcat = getActivePromoSubcategoryName();
  if (promoTitleEl) promoTitleEl.textContent = promoSubcat;

  var timerEl = document.getElementById('announcementTimer');
  if (!timerEl) return;

  var endTs = localStorage.getItem('db_fomo_promo_timer_end');
  var now = Date.now();

  if (!endTs || Number(endTs) <= now) {
    endTs = now + (4 * 3600 + 18 * 60 + 22) * 1000;
    localStorage.setItem('db_fomo_promo_timer_end', endTs);
  } else {
    endTs = Number(endTs);
  }

  if (_announcementTimerInterval) clearInterval(_announcementTimerInterval);
  _announcementTimerInterval = setInterval(function() {
    var rem = Math.max(0, Math.floor((endTs - Date.now()) / 1000));
    if (rem <= 0) {
      endTs = Date.now() + (4 * 3600 + 18 * 60 + 22) * 1000;
      localStorage.setItem('db_fomo_promo_timer_end', endTs);
      rem = 4 * 3600 + 18 * 60 + 22;
    }
    var h = Math.floor(rem / 3600);
    var m = Math.floor((rem % 3600) / 60);
    var s = rem % 60;
    var el = document.getElementById('announcementTimer');
    if (el) el.textContent = (h < 10 ? '0' + h : h) + ':' + (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s);
  }, 1000);
}

// Native CSS sticky flow for announcement bar and header

function scrollToPromoSubcategory() {
  var path = getActivePromoSubcategoryPath();
  location.hash = categoryUrl(path);
}
window.scrollToPromoSubcategory = scrollToPromoSubcategory;

function initCartReservationTimer() {
  var display = document.getElementById('cartTimerDisplay');
  if (!display) return;

  var endTs = localStorage.getItem('db_fomo_cart_timer_end');
  var now = Date.now();

  if (!endTs || Number(endTs) <= now) {
    endTs = now + 10 * 60 * 1000; // 10 minutes
    localStorage.setItem('db_fomo_cart_timer_end', endTs);
  } else {
    endTs = Number(endTs);
  }

  if (_cartTimerInterval) clearInterval(_cartTimerInterval);
  _cartTimerInterval = setInterval(function() {
    var rem = Math.max(0, Math.floor((endTs - Date.now()) / 1000));
    if (rem <= 0) {
      endTs = Date.now() + 10 * 60 * 1000;
      localStorage.setItem('db_fomo_cart_timer_end', endTs);
      rem = 10 * 60;
    }
    var m = Math.floor(rem / 60);
    var s = rem % 60;
    var el = document.getElementById('cartTimerDisplay');
    if (el) el.textContent = (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s);
  }, 1000);
}

// === Hero FOMO Urgency Spotlight Engine ===
var _heroFomoTimer = null;
var _heroFomoCurrentSku = null;

function initHeroFomoBannerEngine() {
  if (_heroFomoTimer) clearInterval(_heroFomoTimer);
  updateHeroFomoBannerData();
  
  _heroFomoTimer = setInterval(function() {
    updateHeroFomoBannerData();
  }, 10000);
}

function updateHeroFomoBannerData() {
  var banner = document.getElementById('heroFomoBanner');
  if (!banner) return;
  
  var products = typeof getProducts === 'function' ? getProducts() : [];
  var withImg = products.filter(function(p) { return p.image && p.image.trim(); });
  if (withImg.length === 0) return;

  var p = withImg[Math.floor(Math.random() * withImg.length)];
  if (!p) return;

  _heroFomoCurrentSku = p.sku;

  var tags = [
    '🔥 ÚLTIMAS UNIDADES EN BODEGA',
    '⚡ ALTA DEMANDA MAYORISTA',
    '📦 ÚLTIMO LOTE DISPONIBLE',
    '🚨 MÁS VENDIDO DE LA SEMANA',
    '💥 SE ACABA HOY MISMO'
  ];

  var claims = [
    'Ayer se vendieron +140 unidades por mayor. ¡Quedan pocas unidades en bodega, asegura las tuyas!',
    '¡38 comerciantes tienen este producto en su carrito ahora mismo! No garantizamos stock para mañana.',
    'Último lote disponible a precio directo de fábrica. ¡Agrega tus unidades antes que el camión cierre!',
    '¡Alta demanda a nivel nacional! Los clientes están llevando este producto por bultos cerrados.',
    '¡Producto estrella en tendencia! Se han despachado 95 cajas este fin de semana. Consigue tu stock.'
  ];

  var randomTag = tags[Math.floor(Math.random() * tags.length)];
  var randomClaim = claims[Math.floor(Math.random() * claims.length)];

  // Preload image before changing DOM to eliminate flicker
  var img = new Image();
  img.onload = function() {
    var imgEl = document.getElementById('heroFomoImg');
    var tagEl = document.getElementById('heroFomoTag');
    var titleEl = document.getElementById('heroFomoTitle');
    var claimEl = document.getElementById('heroFomoClaim');
    var priceEl = document.getElementById('heroFomoPrice');

    if (imgEl) imgEl.src = p.image;
    if (tagEl) tagEl.textContent = randomTag;
    if (titleEl) titleEl.textContent = p.name;
    if (claimEl) claimEl.textContent = randomClaim;
    if (priceEl) priceEl.textContent = formatPrice(getPrice(p));
  };
  img.src = p.image;
}

function showFomoBannerProductModal() {
  if (_heroFomoCurrentSku) {
    showProductModal(_heroFomoCurrentSku);
  }
}
window.showFomoBannerProductModal = showFomoBannerProductModal;

// === Live Fake Online Users Counter ===
var _liveUsersInterval = null;
function initLiveUsersCounter() {
  var el = document.getElementById('liveUsersCount');
  if (!el || _liveUsersInterval) return;

  // Initial count between 15 and 25
  var currentUsers = Math.floor(Math.random() * 11) + 15;
  el.textContent = currentUsers;

  _liveUsersInterval = setInterval(function() {
    // Fluctuate between -3 and +3
    var delta = Math.floor(Math.random() * 7) - 3;
    currentUsers += delta;

    // Strict limits: min 10, max 48
    if (currentUsers < 10) currentUsers = 10 + Math.floor(Math.random() * 4);
    if (currentUsers > 48) currentUsers = 48 - Math.floor(Math.random() * 5);

    el.textContent = currentUsers;
    el.style.transform = 'scale(1.25)';
    setTimeout(function() {
      if (el) el.style.transform = 'scale(1)';
    }, 250);
  }, 5000 + Math.floor(Math.random() * 4000));
}

// === FOMO Sales & Real User Cart Toast Engine ===
var _fomoTimer = null;
var _fomoHideTimer = null;
var _fomoCurrentSku = null;

// Real user cart accumulator buffer
var _userCartDebounceTimer = null;
var _userCartBuffer = {};
var _userCartLastSku = null;

function trackUserAddToCart(sku, qtyAdded) {
  if (!_userCartBuffer[sku]) _userCartBuffer[sku] = 0;
  _userCartBuffer[sku] += qtyAdded;
  _userCartLastSku = sku;

  // Reset/extend 5s debounce timer
  if (_userCartDebounceTimer) clearTimeout(_userCartDebounceTimer);
  
  _userCartDebounceTimer = setTimeout(function() {
    triggerUserAddToCartToast();
  }, 5000);
}

function triggerUserAddToCartToast() {
  if (!_userCartLastSku || !_userCartBuffer[_userCartLastSku]) return;
  var sku = _userCartLastSku;
  var totalQty = _userCartBuffer[sku];
  
  // Reset buffer
  _userCartBuffer = {};
  _userCartLastSku = null;

  var productList = typeof getProducts === 'function' ? getProducts() : (typeof _customProducts !== 'undefined' ? _customProducts : []);
  var p = productList.find(x => x.sku === sku);
  if (!p) return;

  var userText = '🟢 ¡Tú!';
  var actionText = 'Has reservado x' + totalQty + ' ' + (totalQty > 1 ? 'unidades' : 'unidad') + ' de ' + p.name;
  var timeText = 'Hace unos segundos · Toca para ver';

  showFomoToastData({
    sku: p.sku,
    image: p.image,
    badge: '🛒 TU COMPRA',
    user: userText,
    action: actionText,
    time: timeText
  });
}

// === Mute / Unmute Notifications ===
var _fomoMuted = localStorage.getItem('db_fomo_muted') === 'true';

function updateFomoBellUI() {
  var activeSvg = document.getElementById('fomoBellActive');
  var mutedSvg = document.getElementById('fomoBellMuted');
  var textSpan = document.getElementById('fomoBellText');
  var btn = document.getElementById('toggleFomoBtn');
  if (activeSvg && mutedSvg) {
    if (_fomoMuted) {
      activeSvg.classList.add('hidden');
      mutedSvg.classList.remove('hidden');
      if (textSpan) textSpan.textContent = 'Activar notificaciones';
      if (btn) btn.classList.add('opacity-60', 'bg-gray-100');
    } else {
      activeSvg.classList.remove('hidden');
      mutedSvg.classList.add('hidden');
      if (textSpan) textSpan.textContent = 'Desactivar notificaciones';
      if (btn) btn.classList.remove('opacity-60', 'bg-gray-100');
    }
  }
}

function toggleFomoNotifications() {
  _fomoMuted = !_fomoMuted;
  localStorage.setItem('db_fomo_muted', _fomoMuted ? 'true' : 'false');
  updateFomoBellUI();

  if (_fomoMuted) {
    closeFomoToast();
    showToast('Notificaciones silenciadas 🔕');
  } else {
    showToast('Notificaciones activadas 🔔');
  }
}

window.toggleFomoNotifications = toggleFomoNotifications;

function initFomoSalesEngine() {
  updateFomoBellUI();
  if (_fomoTimer) return;
  scheduleNextFomoToast(1200);
}

function scheduleNextFomoToast(delayMs) {
  if (_fomoTimer) clearTimeout(_fomoTimer);
  _fomoTimer = setTimeout(function() {
    triggerFomoToast();
    var nextDelay = 14000 + Math.floor(Math.random() * 20000);
    scheduleNextFomoToast(nextDelay);
  }, delayMs);
}

function triggerFomoToast() {
  if (_fomoMuted) return;
  var productList = typeof getProducts === 'function' ? getProducts() : (typeof _customProducts !== 'undefined' ? _customProducts : []);
  if (!productList || productList.length === 0) return;

  var randomProduct = productList[Math.floor(Math.random() * productList.length)];
  if (!randomProduct) return;

  var prefixes = ['99551', '98681', '97412', '93120', '95589', '94201', '98112', '96341', '92088', '99120', '98432', '97745', '96109'];
  var randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  var phoneText = '+56 9 ' + randomPrefix.substring(0, 4) + ' ****';

  var qty = Math.floor(Math.random() * 5) + 1;
  var actions = [
    'ha comprado ' + qty + 'x ' + randomProduct.name,
    'ha agregado ' + qty + 'x ' + randomProduct.name + ' al carrito',
    'compró ' + randomProduct.name + ' por mayor',
    'ha reservado ' + qty + ' unidades de ' + randomProduct.name
  ];
  var randomAction = actions[Math.floor(Math.random() * actions.length)];
  var times = ['Hace 1 min', 'Hace 2 min', 'Hace unos segundos', 'Hace 3 min'];
  var randomTime = times[Math.floor(Math.random() * times.length)] + ' · Toca para ver';

  showFomoToastData({
    sku: randomProduct.sku,
    image: randomProduct.image,
    badge: '🔥 SALE',
    user: phoneText,
    action: randomAction,
    time: randomTime
  });
}

function showFomoToastData(data) {
  if (_fomoMuted) return;
  var toast = document.getElementById('fomoToast');
  if (!toast) return;

  var imgEl = document.getElementById('fomoImg');
  var userEl = document.getElementById('fomoUser');
  var actionEl = document.getElementById('fomoAction');
  var timeEl = document.getElementById('fomoTime');
  var badgeEl = document.getElementById('fomoBadge');

  _fomoCurrentSku = data.sku;

  // Preload image before sliding down toast to prevent flicker bug!
  var tempImg = new Image();
  var renderAndShow = function() {
    if (imgEl) imgEl.src = tempImg.src;
    if (userEl) userEl.textContent = data.user;
    if (actionEl) actionEl.textContent = data.action;
    if (timeEl) timeEl.textContent = data.time;
    if (badgeEl) badgeEl.textContent = data.badge || '🔥 SALE';

    toast.onclick = function() {
      if (_fomoCurrentSku && typeof window.showProductModal === 'function') {
        window.showProductModal(_fomoCurrentSku);
      }
      closeFomoToast();
    };

    toast.classList.remove('-translate-y-6', 'opacity-0', 'pointer-events-none');
    toast.classList.add('translate-y-0', 'opacity-100', 'pointer-events-auto');

    if (_fomoHideTimer) clearTimeout(_fomoHideTimer);
    _fomoHideTimer = setTimeout(function() {
      closeFomoToast();
    }, 10000);
  };

  if (data.image && data.image.trim()) {
    tempImg.onload = renderAndShow;
    tempImg.onerror = function() {
      tempImg.src = 'https://via.placeholder.com/100';
      renderAndShow();
    };
    tempImg.src = data.image;
  } else {
    tempImg.src = 'https://via.placeholder.com/100';
    renderAndShow();
  }
}

function closeFomoToast() {
  var toast = document.getElementById('fomoToast');
  if (!toast) return;
  toast.classList.add('-translate-y-6', 'opacity-0', 'pointer-events-none');
  toast.classList.remove('translate-y-0', 'opacity-100', 'pointer-events-auto');
}

window.closeFomoToast = closeFomoToast;

// === Hierarchy helpers ===
// Get product path as array (uses path field, falls back to category/subcategory)
function getProductPath(p) {
  if (Array.isArray(p.path) && p.path.length > 0) return p.path;
  const arr = [];
  if (p.category) arr.push(p.category);
  if (p.subcategory) arr.push(p.subcategory);
  if (p.subsubcategory) arr.push(p.subsubcategory);
  return arr.length ? arr : ['Sin Categoria'];
}
// Returns true if product belongs to the given path prefix
function matchesPath(p, prefix) {
  const path = getProductPath(p);
  if (prefix.length > path.length) return false;
  for (let i = 0; i < prefix.length; i++) {
    if (path[i] !== prefix[i]) return false;
  }
  return true;
}
// Get child category names at a given prefix level
function getChildren(prefix) {
  const children = new Set();
  
  // Custom categories that are NOT deleted
  const customObj = getCustomCategories();
  const deletedCats = Object.keys(customObj).filter(k => customObj[k] === '__DELETED__');
  
  getProducts().forEach(p => {
    const path = getProductPath(p);
    // Don't include it if it's marked as deleted
    let isDeleted = false;
    let curr = '';
    for (const part of path) {
      curr = curr ? curr + '/' + part : part;
      if (deletedCats.includes(curr)) {
        isDeleted = true; break;
      }
    }
    
    if (!isDeleted && matchesPath(p, prefix) && path.length > prefix.length) {
      children.add(path[prefix.length]);
    }
  });
  
  Object.keys(customObj).forEach(pathStr => {
    if (customObj[pathStr] === '__DELETED__') return;
    
    const path = pathStr.split('/');
    if (path.length > prefix.length) {
      let match = true;
      for (let i = 0; i < prefix.length; i++) {
        if (path[i] !== prefix[i]) { match = false; break; }
      }
      if (match) children.add(path[prefix.length]);
    }
  });
  return [...children].sort();
}
function categoryUrl(prefix) {
  return '#/category/' + prefix.map(encodeURIComponent).join('/');
}

// === Home ===
function renderHome() {
  const products = getProducts();
  const topCats = getChildren([]);
  const counts = {};
  topCats.forEach(c => counts[c] = products.filter(p => matchesPath(p, [c])).length);

  const withImg = products.filter(p => p.image && p.image.trim());
  // Deals: ultimos productos añadidos (newest first by $createdAt)
  const deals = [...withImg].sort((a,b) => {
    const ta = a._createdAt || a.createdAt || 0;
    const tb = b._createdAt || b.createdAt || 0;
    return (Number(tb) || 0) - (Number(ta) || 0);
  }).slice(0, 8);
  // Featured grid: a different slice for visual variety
  const featured = [...withImg].sort((a,b) => (b.stock||0) - (a.stock||0)).slice(0, 6);
  // Recently added: custom products that are new to the base catalog first
  let recentSkus = [];
  try { recentSkus = JSON.parse(localStorage.getItem('db_recent_product_skus') || '[]'); } catch (e) {}
  const baseSkus = new Set(allProducts.map(p => String(p.sku)));
  const recentMap = new Map(_customProducts.map(p => [String(p.sku), p]));
  const uniqueCustom = _customProducts
    .filter(p => !baseSkus.has(String(p.sku)))
    .sort((a, b) => (Number(b.createdAt) || 0) - (Number(a.createdAt) || 0));
  const orderedCustom = [
    ...recentSkus.map(sku => recentMap.get(String(sku))).filter(Boolean),
    ...uniqueCustom,
    ..._customProducts
      .filter(p => !recentSkus.includes(String(p.sku)) && baseSkus.has(String(p.sku)))
      .sort((a, b) => (Number(b.createdAt) || 0) - (Number(a.createdAt) || 0))
  ];
  const recent = [...new Map(orderedCustom.map(p => [String(p.sku), p])).values()].slice(0, 8);
  const minK = getMinPurchase() >= 1000 ? `$${Math.floor(getMinPurchase()/1000)}K` : formatPrice(getMinPurchase());

  // Cheap products carousel (sorted ascending by price)
  const cheapProducts = [...withImg].sort((a,b) => getPrice(a) - getPrice(b)).slice(0, 8);

  const html = `
    <div class="fade-in space-y-6">
      <!-- Hero banner ultra-functional & luxury -->
      <div class="relative overflow-hidden rounded-[28px] p-6 sm:p-8 card-shadow border border-white/40"
           style="background: linear-gradient(135deg, #4b8bd6 0%, #3a78c2 45%, #2a5d9e 100%);">
        <!-- Particles -->
        <div class="hero-particles" id="heroParticles"></div>
        <div class="absolute -top-20 -right-12 w-64 h-64 rounded-full pointer-events-none" style="background: radial-gradient(circle, rgba(255,232,128,.35), transparent 60%); animation: floaty 6s ease-in-out infinite;"></div>
        <div class="absolute -bottom-24 -left-16 w-56 h-56 rounded-full pointer-events-none" style="background: radial-gradient(circle, rgba(255,255,255,.3), transparent 65%);"></div>
        
        <!-- Header row inside hero: Badge -->
        <div class="relative z-10 flex items-center justify-between gap-2.5 mb-3">
          <div class="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-[10px] sm:text-xs font-extrabold tracking-wider uppercase text-white shadow-sm border border-white/35">
            <span class="w-2 h-2 rounded-full bg-amber-300 animate-pulse shadow-sm"></span>PROVEEDOR DIRECTO MAYORISTA · CHILE
          </div>
        </div>

        <!-- Main text content -->
        <div class="relative z-20 max-w-full">
          <h1 class="font-display font-extrabold text-2xl sm:text-4xl leading-[1.15] text-white" style="text-shadow: 0 2px 12px rgba(15,32,67,.35);">
            Impulsa tu negocio con los mejores precios<span class="text-amber-300">.</span>
          </h1>
          <p class="text-white/95 text-xs sm:text-sm mt-2.5 font-medium leading-relaxed max-w-xl">
            Accede a <strong class="text-amber-200 font-extrabold">${products.length} productos</strong> con stock real garantizado, atención directa por WhatsApp y envíos a todo Chile.
          </p>
        </div>

        <!-- Functional Action Grid & Stats -->
        <div class="relative z-20 grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-5">
          <a href="#/all" class="sm:col-span-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl btn-accent font-extrabold text-sm shadow-lg active:scale-95 transition-transform">
            Ver catálogo
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M9 5l7 7-7 7"/></svg>
          </a>
          <div class="flex items-center justify-between px-4 py-2.5 rounded-2xl bg-white/20 backdrop-blur-md border border-white/35 text-white">
            <span class="text-xs font-semibold opacity-90">Compra Mínima</span>
            <span class="font-display font-extrabold text-sm sm:text-base text-amber-300">${minK}</span>
          </div>
          <div class="flex items-center justify-between px-4 py-2.5 rounded-2xl bg-white/20 backdrop-blur-md border border-white/35 text-white">
            <span class="text-xs font-semibold opacity-90">Productos</span>
            <span class="font-display font-extrabold text-sm sm:text-base">${products.length}</span>
          </div>
        </div>
      </div>

      <!-- Hero FOMO Urgency Spotlight Carousel Banner (Theme Matched White Luxe) -->
      <div id="heroFomoBanner" class="relative overflow-hidden rounded-[26px] bg-white/95 backdrop-blur-xl p-4 sm:p-5 text-blue-950 shadow-lg border-2 border-blue-200/90 cursor-pointer hover:border-blue-400/80 transition-all duration-300 group" onclick="showFomoBannerProductModal()">
        <div class="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <!-- Left: BIG product image (clean without badges) + urgency text -->
          <div class="flex items-center gap-4 w-full sm:w-auto">
            <!-- Large Product Thumbnail Container -->
            <div class="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-blue-50/80 overflow-hidden flex-shrink-0 border border-blue-200/80 shadow-inner group-hover:scale-105 transition-transform duration-300">
              <img id="heroFomoImg" src="" alt="Producto" class="w-full h-full object-cover">
            </div>

            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1.5">
                <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-600 text-[10px] sm:text-xs font-extrabold uppercase tracking-wider shadow-sm">
                  <span class="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                  <span id="heroFomoTag">🔥 ÚLTIMAS UNIDADES EN BODEGA</span>
                </span>
              </div>
              <h3 id="heroFomoTitle" class="font-display font-extrabold text-sm sm:text-base text-blue-950 line-clamp-1 leading-snug">Cargando producto estrella...</h3>
              <p id="heroFomoClaim" class="text-xs sm:text-sm text-blue-800/90 font-semibold line-clamp-2 leading-relaxed mt-1">Ayer se vendieron +140 unidades por mayor. ¡Asegura las tuyas antes del cierre de bodega!</p>
            </div>
          </div>

          <!-- Right: Price + Quick Reserve Action Button -->
          <div class="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-blue-100">
            <div class="flex flex-col text-left sm:text-right">
              <span class="text-[10px] text-blue-500 uppercase font-extrabold tracking-wider">Precio Mayorista</span>
              <span id="heroFomoPrice" class="font-display font-extrabold text-xl sm:text-2xl text-emerald-600">$0</span>
            </div>
            <button onclick="event.stopPropagation(); showFomoBannerProductModal()" class="px-5 py-3 rounded-2xl btn-accent font-extrabold text-xs sm:text-sm shadow-md active:scale-95 transition-all flex items-center gap-1.5 whitespace-nowrap">
              <span>⚡ Asegurar Mi Stock</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 4v16m8-8H4"/></svg>
            </button>
          </div>

        </div>
      </div>

      ${products.length === 0 ? `
      <div class="bg-white rounded-3xl p-6 card-shadow text-center">
        <div class="w-16 h-16 mx-auto rounded-full mb-3 flex items-center justify-center" style="background: linear-gradient(135deg,#e3f2ff,#f5fbff);">
          <svg class="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
        </div>
        <h3 class="font-display font-extrabold text-blue-800 text-lg">Catálogo vacío</h3>
        <p class="text-blue-500 text-sm mt-1 mb-4">Aún no se han cargado productos. Ingresa al panel para crear tus categorías y productos.</p>
        <a href="#/admin" class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full btn-primary text-white font-bold text-sm shadow-lg active:scale-95">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
          Ir al panel admin
        </a>
      </div>` : ''}

      <!-- Category chips (quick access) -->
      ${topCats.length > 0 ? `<div class="chip-row scrollbar-hide -mx-4 px-4">
        <a href="#/all" class="chip active">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>Todo
        </a>
        ${topCats.map(cat => `<a href="${categoryUrl([cat])}" class="chip">${escapeHtml(cat)}<span class="text-blue-300 font-semibold">${counts[cat]}</span></a>`).join('')}
      </div>` : ''}

      ${deals.length > 0 ? `
      <!-- Deals carousel -->
      <div>
        <div class="flex flex-col mb-3">
          <div class="flex items-center justify-between">
            <h2 class="section-title">🔥 <span class="hidden sm:inline">Lo último añadido · </span>¡Apúrate que se acaban!</h2>
            <a href="#/all" class="text-xs text-blue-500 font-bold hover:text-blue-700 flex-none ml-2">Ver más →</a>
          </div>
          <p class="text-xs text-blue-900/90 font-medium mt-0.5"><span class="hidden sm:inline">Nuestros productos no duran más de 1 día en stock. ¡Apresúrate y consigue el tuyo!</span><span class="inline sm:hidden">¡Poco stock! No se los pierdas 🔥</span></p>
        </div>
        <div class="flex gap-3 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-1 snap-x">
          ${deals.map(p => `
            <div onclick="showProductModal('${escapeHtml(p.sku)}')" class="product-card card-shadow flex-none w-40 snap-start cursor-pointer">
              <div class="relative aspect-square bg-blue-50/60 overflow-hidden">
                <span class="absolute top-2 left-2 z-10 text-[10px] font-extrabold px-2 py-0.5 rounded-full deal-badge">🔥 ¡VOLANDO!</span>
                <div class="pc-img w-full h-full">${imgEl(p.image, p.name)}</div>
              </div>
              <div class="p-3">
                <div class="text-xs text-blue-700 font-semibold leading-tight line-clamp-1 mb-1.5">${escapeHtml(p.name)}</div>
                <div class="flex items-center justify-between">
                  <span class="price-chip text-base">${formatPrice(getPrice(p))}</span>
                  <button onclick="event.stopPropagation(); addToCart('${escapeHtml(p.sku)}')" class="fab-add w-8 h-8 rounded-full flex items-center justify-center flex-none" aria-label="Agregar">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 4v16m8-8H4"/></svg>
                  </button>
                </div>
              </div>
            </div>`).join('')}
        </div>
      </div>` : ''}

      ${cheapProducts.length > 0 ? `
      <!-- Productos desde $175 carousel -->
      <div>
        <div class="flex flex-col mb-3">
          <div class="flex items-center justify-between">
            <h2 class="section-title">🏷️ <span class="hidden sm:inline">Productos </span>Desde $175</h2>
            <a href="#/all" class="text-xs text-blue-500 font-bold hover:text-blue-700 flex-none ml-2">Ver todos →</a>
          </div>
          <p class="text-xs text-blue-900/90 font-medium mt-0.5"><span class="hidden sm:inline">¡Lo mismo que te costaría un chicle! Margen imbatible para tu negocio.</span><span class="inline sm:hidden">Margen imbatible 💰</span></p>
        </div>
        <div class="flex gap-3 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-1 snap-x">
          ${cheapProducts.map(p => `
            <div onclick="showProductModal('${escapeHtml(p.sku)}')" class="product-card card-shadow flex-none w-40 snap-start cursor-pointer border border-amber-200/60">
              <div class="relative aspect-square bg-blue-50/60 overflow-hidden">
                <div class="pc-img w-full h-full">${imgEl(p.image, p.name)}</div>
              </div>
              <div class="p-3">
                <div class="text-xs text-blue-700 font-semibold leading-tight line-clamp-1 mb-1.5">${escapeHtml(p.name)}</div>
                <div class="flex items-center justify-between">
                  <span class="price-chip text-base text-emerald-600 font-extrabold">${formatPrice(getPrice(p))}</span>
                  <button onclick="event.stopPropagation(); addToCart('${escapeHtml(p.sku)}')" class="fab-add w-8 h-8 rounded-full flex items-center justify-center flex-none" aria-label="Agregar">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 4v16m8-8H4"/></svg>
                  </button>
                </div>
              </div>
            </div>`).join('')}
        </div>
      </div>` : ''}

      ${recent.length > 0 ? `
      <!-- Lo último añadido carousel -->
      <div>
        <div class="flex items-center justify-between mb-3">
          <h2 class="section-title">✨ Lo último añadido</h2>
        </div>
        <div class="flex gap-3 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-1 snap-x">
          ${recent.map(p => `
            <div onclick="showProductModal('${escapeHtml(p.sku)}')" class="product-card card-shadow flex-none w-40 snap-start cursor-pointer">
              <div class="relative aspect-square bg-blue-50/60 overflow-hidden">
                <span class="absolute top-2 left-2 z-10 text-[10px] font-extrabold px-2 py-0.5 rounded-full" style="background:linear-gradient(135deg,#43e97b,#38f9d7);color:#fff;">NUEVO</span>
                <div class="pc-img w-full h-full">${imgEl(p.image, p.name)}</div>
              </div>
              <div class="p-3">
                <div class="text-xs text-blue-700 font-semibold leading-tight line-clamp-2 mb-1.5 min-h-[2rem]">${escapeHtml(p.name)}</div>
                <div class="flex items-center justify-between">
                  <span class="price-chip text-base">${formatPrice(getPrice(p))}</span>
                  <button onclick="event.stopPropagation(); addToCart('${escapeHtml(p.sku)}')" class="fab-add w-8 h-8 rounded-full flex items-center justify-center flex-none" aria-label="Agregar">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 4v16m8-8H4"/></svg>
                  </button>
                </div>
              </div>
            </div>`).join('')}
        </div>
      </div>` : ''}

      <!-- Categories grid -->
      ${topCats.length > 0 ? `<div id="categoriesSection">
        <div class="flex items-center justify-between mb-3">
          <h2 class="section-title">Explora por categoría</h2>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 stagger">
          ${topCats.map((cat, idx) => {
            const icon = getCategoryIcon(cat, [cat]);
            return `
            <a href="${categoryUrl([cat])}" class="cat-card cat-g${idx % 4} group relative overflow-hidden">
              <div class="absolute -right-2 -bottom-1 text-2xl sm:text-3xl opacity-20 group-hover:opacity-40 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 pointer-events-none select-none z-0">
                ${getCategoryBgEmojis(cat)}
              </div>
              <div class="cat-icon-wrap relative z-10">
                ${icon ? `<img src="${escapeHtml(icon)}" alt="${escapeHtml(stripEmoji(cat))}">` : (() => { const em = extractEmoji(cat); return em ? `<span class="text-2xl">${em}</span>` : `<span class="text-blue-500">${FALLBACK_CAT_SVG}</span>`; })()}
              </div>
              <div class="font-display font-extrabold text-blue-950 text-sm sm:text-base leading-tight relative z-10">${escapeHtml(stripEmoji(cat))}</div>
              <div class="inline-flex items-center gap-1 text-[10px] sm:text-[11px] text-blue-600/90 mt-1.5 font-extrabold px-2.5 py-0.5 rounded-full bg-white/70 backdrop-blur-md border border-white/60 relative z-10">
                <span>${counts[cat]} productos</span>
                <svg class="w-3 h-3 text-blue-500 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/></svg>
              </div>
            </a>`;
          }).join('')}
        </div>
      </div>` : ''}

      ${featured.length > 0 ? `
      <!-- Featured products -->
      <div>
        <div class="flex items-center justify-between mb-3">
          <h2 class="section-title">Destacados</h2>
          <a href="#/all" class="text-xs text-blue-500 font-bold hover:text-blue-700">Ver todo →</a>
        </div>
        ${renderProductGrid(featured)}
      </div>` : ''}
    </div>
  `;
  $('#app').innerHTML = html;
  // Defer para que el DOM se pinte antes de leer offsetWidth (fix producción)
  requestAnimationFrame(function() {
    requestAnimationFrame(function() {
      initHeroParticles();
    });
  });
  initHeroFomoBannerEngine();
  initPersistentHeroTimer();
  initAnnouncementBarEngine();
}

// === Category page (hierarchical, supports any depth) ===
function renderCategory(prefixEncoded) {
  const prefix = (prefixEncoded || []).map(decodeURIComponent);
  if (prefix.length === 0) return renderHome();

  const products = getProducts().filter(p => matchesPath(p, prefix));
  const children = getChildren(prefix);

  // Breadcrumb
  let breadcrumb = '<div class="flex items-center gap-1 text-xs text-blue-400 mb-1 flex-wrap">';
  breadcrumb += `<a href="#/" class="hover:text-blue-600">Inicio</a>`;
  for (let i = 0; i < prefix.length; i++) {
    breadcrumb += `<span class="mx-1">›</span>`;
    if (i === prefix.length - 1) {
      breadcrumb += `<span class="text-blue-600 font-semibold">${escapeHtml(prefix[i])}</span>`;
    } else {
      breadcrumb += `<a href="${categoryUrl(prefix.slice(0, i+1))}" class="hover:text-blue-600">${escapeHtml(prefix[i])}</a>`;
    }
  }
  breadcrumb += '</div>';

  const catTitle = prefix[prefix.length - 1];
  const catIcon = typeof getCategoryBgEmojis === 'function' ? (getCategoryBgEmojis(catTitle).split(' ')[0] || '📦') : '📦';

  let html = `<div class="fade-in space-y-4">
    ${breadcrumb}
    <!-- Category Header Banner (Cristal Blanco Luxe Theme) -->
    <div class="relative overflow-hidden rounded-[26px] p-5 sm:p-6 bg-gradient-to-r from-blue-50/90 via-white to-blue-50/90 border border-blue-200/80 shadow-sm mb-4">
      <div class="flex items-center justify-between gap-3 relative z-10">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-2xl bg-blue-100/80 border border-blue-200/80 flex items-center justify-center text-2xl flex-shrink-0 shadow-xs">
            ${catIcon}
          </div>
          <div>
            <h1 class="font-display font-extrabold text-xl sm:text-2xl text-blue-950 leading-tight">${escapeHtml(catTitle)}</h1>
            <span class="text-xs text-blue-500/90 font-semibold">Categoría Mayorista</span>
          </div>
        </div>
        <span class="text-xs text-blue-900 font-extrabold px-3 py-1 rounded-full bg-blue-100/90 border border-blue-200/80 flex-shrink-0">${products.length} prod.</span>
      </div>
    </div>`;

  // Subcategory chips (if there are children)
  if (children.length > 0) {
    html += `<div class="mb-6">
      <div class="section-title mb-3 !text-sm">Subcategorías</div>
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 stagger">
        ${children.map((c, idx) => {
          const subCount = getProducts().filter(p => matchesPath(p, [...prefix, c])).length;
          const icon = getCategoryIcon(c, [...prefix, c]);
          return `
            <a href="${categoryUrl([...prefix, c])}" class="cat-card cat-g${idx % 4} card-shadow card-shadow-hover">
              <div class="cat-icon-wrap">
                ${icon ? `<img src="${escapeHtml(icon)}" alt="${escapeHtml(stripEmoji(c))}">` : (() => { const em = extractEmoji(c); return em ? `<span class="text-2xl">${em}</span>` : `<span class="text-blue-500">${FALLBACK_CAT_SVG}</span>`; })()}
              </div>
              <div class="font-display font-extrabold text-blue-800 text-sm leading-tight relative">${escapeHtml(stripEmoji(c))}</div>
              <div class="text-[11px] text-blue-500/80 mt-0.5 font-semibold relative">${subCount} productos</div>
            </a>`;
        }).join('')}
      </div>
    </div>`;
  }

  // Products at this level or below — with shared filter/sort bar
  if (products.length > 0) {
    html += productListSection(products);
  }
  html += '</div>';
  $('#app').innerHTML = html;
  initHeroParticles(catTitle, 'catParticles');
}

// === Catalog filters & sorting (shared across catalog / category / search) ===
const SORT_OPTIONS = [
  { v: 'reco',       label: 'Recomendado',  sub: 'Lo mejor primero' },
  { v: 'price_asc',  label: 'Menor precio',  sub: 'Más barato primero' },
  { v: 'price_desc', label: 'Mayor precio',  sub: 'Más caro primero' },
  { v: 'name',       label: 'Nombre A–Z',    sub: 'Alfabético' }
];
let _catSort = 'reco';      // one of SORT_OPTIONS.v
let _catInStock = false;    // only show products with stock
let _catPrice = { min: null, max: null }; // active price filter (null = unbounded)

function sortLabel() { return (SORT_OPTIONS.find(o => o.v === _catSort) || SORT_OPTIONS[0]).label; }
function priceActive() { return _catPrice.min !== null || _catPrice.max !== null; }
function priceLabel() {
  if (!priceActive()) return 'Precio';
  if (_catPrice.min !== null && _catPrice.max !== null) return `${formatPrice(_catPrice.min)}–${formatPrice(_catPrice.max)}`;
  if (_catPrice.min !== null) return `≥ ${formatPrice(_catPrice.min)}`;
  return `≤ ${formatPrice(_catPrice.max)}`;
}

// Price bounds (rounded to 100s) across the whole catalog
function priceBounds() {
  const prices = getProducts().map(getPrice).filter(n => n > 0);
  if (!prices.length) return { min: 0, max: 0 };
  return { min: Math.floor(Math.min(...prices) / 100) * 100, max: Math.ceil(Math.max(...prices) / 100) * 100 };
}

function applyCatFilters(list) {
  let out = [...list];
  if (_catInStock) out = out.filter(p => (p.stock || 0) > 0);
  if (_catPrice.min !== null) out = out.filter(p => getPrice(p) >= _catPrice.min);
  if (_catPrice.max !== null) out = out.filter(p => getPrice(p) <= _catPrice.max);
  switch (_catSort) {
    case 'price_asc': out.sort((a, b) => getPrice(a) - getPrice(b)); break;
    case 'price_desc': out.sort((a, b) => getPrice(b) - getPrice(a)); break;
    case 'name': out.sort((a, b) => (a.name || '').localeCompare(b.name || '', 'es')); break;
    default: break; // reco => keep renderProductGrid's default ordering
  }
  return out;
}

// Filter bar: Ordenar (sheet) + Precio (sheet) + Con stock toggle + count
function renderFilterBar(shown, total) {
  const hiddenCount = total - shown;
  return `<div class="filter-bar scrollbar-hide">
    <button onclick="openSortSheet()" class="pill">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M3 7h13M3 12h9M3 17h5M17 17V7m0 0l-3 3m3-3l3 3"/></svg>
      <span>${sortLabel()}</span>
    </button>
    <button onclick="openPriceSheet()" class="pill ${priceActive() ? 'on' : ''}">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M3 6h18M6 12h12M10 18h4"/></svg>
      <span>${priceLabel()}</span>
    </button>
    <button onclick="toggleCatInStock()" class="pill ${_catInStock ? 'on' : ''}">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
      Con stock
    </button>
    <span class="ml-auto text-xs font-bold text-blue-400 whitespace-nowrap flex-shrink-0 pl-2">${shown}${hiddenCount > 0 ? `<span class="text-blue-300">/${total}</span>` : ''} prod.</span>
  </div>`;
}

// Reusable section: filter bar + grid (or empty state) for any product list
function productListSection(products) {
  const list = applyCatFilters(products);
  if (list.length === 0) {
    return renderFilterBar(0, products.length) + `<div class="text-center text-blue-400 py-14">
      <svg class="w-12 h-12 mx-auto mb-3 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
      <p class="font-semibold">No hay productos con estos filtros</p>
      ${(_catInStock || priceActive()) ? '<button onclick="clearAllFilters()" class="mt-3 text-sm font-bold text-blue-600 underline">Quitar filtros</button>' : ''}
    </div>`;
  }
  return renderFilterBar(list.length, products.length) + renderProductGrid(list, _catSort !== 'reco');
}

// Sort bottom sheet
function openSortSheet() {
  const wrap = document.getElementById('sortOptions');
  wrap.innerHTML = SORT_OPTIONS.map(o => `
    <button class="sort-opt ${o.v === _catSort ? 'sel' : ''}" onclick="pickSort('${o.v}')">
      <span class="flex flex-col items-start">
        <span>${o.label}</span>
        <span class="text-[11px] font-semibold text-blue-300">${o.sub}</span>
      </span>
      ${o.v === _catSort ? `<svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>` : ''}
    </button>`).join('');
  document.getElementById('sortSheet').classList.remove('hidden');
}
function closeSortSheet() { document.getElementById('sortSheet').classList.add('hidden'); }
function pickSort(v) { _catSort = v; closeSortSheet(); render(); }
function toggleCatInStock() { _catInStock = !_catInStock; render(); }
function clearAllFilters() { _catInStock = false; _catPrice = { min: null, max: null }; render(); }

// === Price range bottom sheet ===
function pricePresets(b) {
  // Sensible buckets clamped to the catalog's real bounds
  return [
    { label: 'Todos', min: null, max: null },
    { label: '≤ $1.000', min: null, max: 1000 },
    { label: '$1.000–$5.000', min: 1000, max: 5000 },
    { label: '$5.000–$10.000', min: 5000, max: 10000 },
    { label: '≥ $10.000', min: 10000, max: null }
  ].filter(p => (p.min === null || p.min < b.max) && (p.max === null || p.max > b.min));
}
function _presetSelected(p) {
  return (_catPrice.min ?? null) === (p.min ?? null) && (_catPrice.max ?? null) === (p.max ?? null);
}
function openPriceSheet() {
  const b = priceBounds();
  const lo = document.getElementById('rangeMin');
  const hi = document.getElementById('rangeMax');
  const step = Math.max(50, Math.round((b.max - b.min) / 100 / 50) * 50) || 50;
  [lo, hi].forEach(el => { el.min = b.min; el.max = b.max; el.step = step; });
  lo.value = _catPrice.min !== null ? Math.max(b.min, _catPrice.min) : b.min;
  hi.value = _catPrice.max !== null ? Math.min(b.max, _catPrice.max) : b.max;
  document.getElementById('pricePresets').innerHTML = pricePresets(b).map((p, i) =>
    `<button class="price-preset ${_presetSelected(p) ? 'sel' : ''}" onclick='applyPreset(${JSON.stringify(p)})'>${p.label}</button>`).join('');
  _updatePriceUI();
  document.getElementById('priceSheet').classList.remove('hidden');
}
function _updatePriceUI() {
  const lo = document.getElementById('rangeMin');
  const hi = document.getElementById('rangeMax');
  let a = +lo.value, z = +hi.value;
  if (a > z) { [a, z] = [z, a]; }   // keep thumbs ordered visually
  document.getElementById('priceMinLabel').textContent = formatPrice(a);
  document.getElementById('priceMaxLabel').textContent = formatPrice(z);
  const min = +lo.min, max = +lo.max, span = (max - min) || 1;
  const fill = document.getElementById('rangeFill');
  fill.style.left = ((a - min) / span * 100) + '%';
  fill.style.right = (100 - (z - min) / span * 100) + '%';
}
function onPriceInput() { _updatePriceUI(); }
function applyPrice() {
  const lo = document.getElementById('rangeMin');
  const hi = document.getElementById('rangeMax');
  let a = +lo.value, z = +hi.value;
  if (a > z) [a, z] = [z, a];
  const b = priceBounds();
  _catPrice = { min: a <= b.min ? null : a, max: z >= b.max ? null : z };
  closePriceSheet();
  render();
}
function applyPreset(p) {
  _catPrice = { min: p.min, max: p.max };
  closePriceSheet();
  render();
}
function clearPrice() { _catPrice = { min: null, max: null }; closePriceSheet(); render(); }
function closePriceSheet() { document.getElementById('priceSheet').classList.add('hidden'); }

// === All products ===
function renderAllProducts() {
  const all = getProducts();
  const html = `<div class="fade-in">
    <div class="flex items-baseline justify-between mb-3">
      <h1 class="font-display font-extrabold text-2xl text-blue-800">Catálogo</h1>
      <span class="text-sm text-blue-400 font-semibold">${all.length} en total</span>
    </div>
    ${productListSection(all)}
  </div>`;
  $('#app').innerHTML = html;
}

// === Search ===
function renderSearch() {
  const q = searchQuery.toLowerCase().trim();
  const products = q
    ? getProducts().filter(p =>
        (p.name || '').toLowerCase().includes(q) ||
        (p.sku || '').toLowerCase().includes(q) ||
        (p.category || '').toLowerCase().includes(q) ||
        (p.subcategory || '').toLowerCase().includes(q))
    : getProducts();
  const html = `<div class="fade-in">
    <h1 class="font-display font-extrabold text-2xl text-blue-800 mb-1">Buscar</h1>
    <div class="text-blue-400 mb-4 text-sm">${q ? `Resultados para "${escapeHtml(q)}"` : 'Mostrando todo el catálogo'}</div>
    ${products.length === 0 ? `<div class="text-center text-blue-400 py-16">
      <svg class="w-12 h-12 mx-auto mb-3 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
      <p class="font-semibold">Sin resultados</p>
      <p class="text-sm text-blue-300 mt-1">Prueba con otra palabra</p>
    </div>` : productListSection(products)}
  </div>`;
  $('#app').innerHTML = html;
}

// === Product grid ===
function renderProductGrid(products, preSorted = false) {
  if (products.length === 0) {
    return '<div class="text-center text-blue-400 py-12">No hay productos</div>';
  }
  // Default ordering: cheapest with image first, then without image.
  // When preSorted is true, the caller already applied an explicit sort.
  const sorted = preSorted ? products : [...products].sort((a, b) => {
    const priceA = getPrice(a);
    const priceB = getPrice(b);
    const aHasImg = !!(a.image && a.image.trim());
    const bHasImg = !!(b.image && b.image.trim());
    if (aHasImg !== bHasImg) return bHasImg ? 1 : -1;
    return priceA - priceB;
  });
  return `<div class="grid grid-cols-2 gap-3 stagger">
    ${sorted.map(p => {
      const price = getPrice(p);
      const outOfStock = p.stock <= 0;
      const lowStock = !outOfStock && p.stock > 0 && p.stock <= 5;
      const activeSubcat = typeof getActivePromoSubcategory === 'function' ? getActivePromoSubcategory() : '';
      const isPromo = activeSubcat && ((p.subcategory && p.subcategory.toLowerCase().includes(activeSubcat.toLowerCase())) || (p.category && p.category.toLowerCase().includes(activeSubcat.toLowerCase())));
      const oldPrice = isPromo ? Math.round(price / 0.7) : 0;
      return `<div class="product-card card-shadow flex flex-col" onclick="showProductModal('${escapeHtml(p.sku)}')">
        <div class="aspect-square bg-blue-50/60 relative overflow-hidden">
          <div class="pc-img w-full h-full">${imgEl(p.image, p.name)}</div>
          ${isPromo ? `<span class="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-extrabold shadow-sm animate-pulse">🔥 30% OFF</span>` : outOfStock ? `<div class="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center">
            <span class="px-3 py-1 rounded-full bg-blue-900/85 text-white text-[11px] font-bold tracking-wide">Sin stock</span>
          </div>` : lowStock ? `<span class="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-full bg-amber-300 text-blue-950 text-[10px] font-extrabold shadow-sm">¡Pocas unidades!</span>` : ''}
          ${p.image ? `<button onclick="event.stopPropagation(); openLightbox('${escapeHtml(p.image)}')" class="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-white/85 backdrop-blur shadow flex items-center justify-center text-blue-500 active:scale-90">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"/></svg>
          </button>` : ''}
        </div>
        <div class="p-3 flex-1 flex flex-col">
          <div class="font-semibold text-blue-800 text-sm leading-tight line-clamp-2 min-h-[2.25rem]">${escapeHtml(p.name)}</div>
          ${p.subcategory ? `<div class="text-[10px] text-blue-400 mt-1 uppercase tracking-wide font-semibold">${escapeHtml(p.subcategory)}</div>` : '<div class="mt-1"></div>'}
          <div class="mt-2 flex items-end justify-between gap-1">
            <div>
              <div class="text-[9px] text-blue-300 font-bold uppercase tracking-wider leading-none mb-0.5">${isPromo ? '<span class="line-through text-blue-400/80 mr-1">' + formatPrice(oldPrice) + '</span><span class="text-rose-600 font-extrabold">-30%</span>' : 'desde'}</div>
              <div class="price-chip text-lg leading-none ${isPromo ? '!text-rose-600 font-extrabold' : ''}">${formatPrice(price)}</div>
            </div>
            <button ${outOfStock?'disabled':''} onclick="event.stopPropagation(); addToCart('${escapeHtml(p.sku)}')" class="${outOfStock?'bg-blue-100 text-blue-300 cursor-not-allowed':'fab-add active:scale-90'} w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0" aria-label="Agregar al carrito">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/></svg>
            </button>
          </div>
        </div>
      </div>`;
    }).join('')}
  </div>`;
}

// === Admin ===
function renderAdminProductList() {
  const customs = _customProducts;
  const overrides = getOverrides();
  const deleted = getDeleted();
  const editFilter = (window._adminFilter || '').toLowerCase().trim();
  let allList = getProducts();
  const filtered = editFilter
    ? allList.filter(p =>
        (p.name||'').toLowerCase().includes(editFilter) ||
        (p.sku||'').toLowerCase().includes(editFilter) ||
        (p.category||'').toLowerCase().includes(editFilter))
    : allList;
  // Sort: custom products first (newest by createdAt), then no image, then by name
  filtered.sort((a, b) => {
    const aCustom = _customProducts.find(c => c.sku === a.sku);
    const bCustom = _customProducts.find(c => c.sku === b.sku);
    if (aCustom && bCustom) return (Number(bCustom.createdAt) || 0) - (Number(aCustom.createdAt) || 0);
    if (aCustom !== bCustom) return aCustom ? -1 : 1;
    const aHasImg = !!(a.image && a.image.trim());
    const bHasImg = !!(b.image && b.image.trim());
    if (aHasImg !== bHasImg) return aHasImg ? 1 : -1;
    return (a.name||'').localeCompare(b.name||'', 'es');
  });
  const visible = filtered;
  
  const listEl = $('#adminProductList');
  const countEl = $('#adminProductCount');
  if (listEl && countEl) {
    countEl.textContent = `Productos (${filtered.length})`;
    listEl.innerHTML = visible.map(p => {
      const isCustom = customs.find(c => c.sku === p.sku);
      const isEdited = !!overrides[p.sku];
      return `<div class="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-white rounded-2xl p-2 border border-blue-100">
        <div class="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">${imgEl(p.image, p.name)}</div>
        <div class="flex-1 min-w-0">
          <div class="font-semibold text-blue-700 text-sm truncate">${escapeHtml(p.name)}</div>
          <div class="text-[11px] text-blue-400 truncate">SKU: ${escapeHtml(p.sku)} · ${formatPrice(p.priceA)}</div>
          <div class="flex gap-1 mt-0.5 flex-wrap">
            ${isCustom ? '<span class="text-[10px] bg-blue-200 text-blue-700 px-1.5 py-0.5 rounded font-bold">NUEVO</span>' : ''}
            ${isEdited ? '<span class="text-[10px] bg-yellow-200 text-yellow-800 px-1.5 py-0.5 rounded font-bold">EDITADO</span>' : ''}
            ${!p.image ? '<span class="text-[10px] bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded font-bold">SIN FOTO</span>' : ''}
          </div>
        </div>
        <div class="flex flex-col gap-1 flex-shrink-0">
          <a href="#/admin/edit/${encodeURIComponent(p.sku)}" class="bg-blue-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold active:scale-95 text-center">Editar</a>
          <button onclick="quickDeleteProduct('${escapeHtml(p.sku)}')" class="bg-red-50 text-red-500 px-3 py-1.5 rounded-full text-xs font-semibold active:scale-95 border border-red-200">🗑️</button>
        </div>
      </div>`;
    }).join('');
    
  }
}

// === Category Admin Logic ===
window.saveCustomCat = async function(pathStr) {
  const inputId = 'cat_img_' + btoa(pathStr).replace(/=/g, '');
  const input = document.getElementById(inputId);
  if (!input) return;
  const cats = getCustomCategories();
  cats[pathStr] = cats[pathStr] || {};
  cats[pathStr].image = input.value;
  cats[pathStr].path = pathStr.split('/');
  cats[pathStr].name = pathStr.split('/').pop();
  await saveCustomCategories(cats);
  showToast('Categoría guardada');
  renderAdmin();
};
window.deleteCustomCat = async function(pathStr) {
  const productsInCat = getProducts().filter(p => matchesPath(p, pathStr.split('/')));
  
  if (productsInCat.length > 0) {
    if (!confirm(`⚠️ ¡ATENCIÓN! Esta categoría contiene ${productsInCat.length} producto(s).\n\nSi eliminas la categoría, TAMBIÉN SE ELIMINARÁN ESTOS PRODUCTOS.\n\n¿Estás absolutamente seguro de querer borrar la categoría y todos sus productos?`)) return;
    
    const deleted = new Set(getDeleted());
    productsInCat.forEach(p => deleted.add(p.sku));
    await setDeleted(Array.from(deleted));
  } else {
    if (!confirm('¿Eliminar esta categoría?')) return;
  }
  
  const cats = { ...getCustomCategories() };
  cats[pathStr] = '__DELETED__';
  await saveCustomCategories(cats);
  
  showToast('Categoría eliminada');
  renderAdmin();
};
window.addNewCustomCat = async function() {
  const inputPath = document.getElementById('new_cat_path').value.trim();
  const inputImg = document.getElementById('new_cat_img').value.trim();
  if (!inputPath) return showToast('Escribe un nombre de categoría');
  const pathStr = inputPath.replace(/\\/g, '/'); // normalize
  const cats = getCustomCategories();
  cats[pathStr] = cats[pathStr] || {};
  if (inputImg) cats[pathStr].image = inputImg;
  cats[pathStr].path = pathStr.split('/');
  cats[pathStr].name = pathStr.split('/').pop();
  await saveCustomCategories(cats);
  showToast('Categoría creada');
  renderAdmin();
};

function renderAdmin(rest) {
  const authed = sessionStorage.getItem(STORAGE_KEYS.adminAuth) === '1';
  if (!authed) {
    $('#app').innerHTML = `<div class="fade-in max-w-sm mx-auto mt-8 bg-white rounded-3xl p-6 card-shadow text-center">
      <div class="w-16 h-16 rounded-full bg-rose-100 mx-auto flex items-center justify-center mb-3">
        <svg class="w-8 h-8 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/></svg>
      </div>
      <h2 class="font-bold text-xl text-rose-600 mb-1">Panel Admin</h2>
      <input id="apwd" type="password" placeholder="Contraseña" class="w-full px-4 py-3 border-2 border-rose-100 rounded-full focus:border-rose-300 focus:outline-none text-center font-semibold mt-3">
      <button onclick="checkAdmin()" class="mt-3 w-full btn-primary text-white font-bold py-3 rounded-full active:scale-95">Ingresar</button>
      <a href="#/" class="block mt-3 text-rose-400 text-sm">Volver</a>
    </div>`;
    setTimeout(() => {
      const inp = $('#apwd');
      if (inp) inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') checkAdmin(); });
    }, 50);
    return;
  }
  // Sub-route: editor for a specific SKU
  if (rest && rest[0] === 'edit' && rest[1]) {
    return renderAdminEdit(decodeURIComponent(rest[1]));
  }

  const customs = _customProducts;
  const overrides = getOverrides();
  const deleted = getDeleted();
  const orders = getOrders();
  const editFilter = (window._adminFilter || '').toLowerCase().trim();
  if (window._adminTab === undefined) window._adminTab = 'products';
  let allList = getProducts();
  const filtered = editFilter
    ? allList.filter(p =>
        (p.name||'').toLowerCase().includes(editFilter) ||
        (p.sku||'').toLowerCase().includes(editFilter) ||
        (p.category||'').toLowerCase().includes(editFilter))
    : allList;
  // Sort: custom products first (newest by createdAt), then no image, then by name
  filtered.sort((a, b) => {
    const aCustom = _customProducts.find(c => c.sku === a.sku);
    const bCustom = _customProducts.find(c => c.sku === b.sku);
    if (aCustom && bCustom) return (Number(bCustom.createdAt) || 0) - (Number(aCustom.createdAt) || 0);
    if (aCustom !== bCustom) return aCustom ? -1 : 1;
    const aHasImg = !!(a.image && a.image.trim());
    const bHasImg = !!(b.image && b.image.trim());
    if (aHasImg !== bHasImg) return aHasImg ? 1 : -1;
    return (a.name||'').localeCompare(b.name||'', 'es');
  });
  const visible = filtered;
  const pendingOrders = orders.filter(o => !o.paid).length;
  const tab = window._adminTab;

  const revenue = orders.filter(o => o.paid).reduce((s, o) => s + (o.total || 0), 0);
  const lowStockCount = allList.filter(p => (p.stock || 0) > 0 && (p.stock || 0) <= 5).length;
  const noImgCount = allList.filter(p => !(p.image && p.image.trim())).length;
  const adminTabs = [
    { id: 'products',   label: 'Productos', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
    { id: 'categories', label: 'Categorías', icon: 'M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2V7z' },
    { id: 'orders',     label: 'Pedidos', icon: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z', badge: pendingOrders },
    { id: 'settings',   label: 'Ajustes', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' }
  ];

  let html = `<div class="fade-in space-y-4 pb-8">
    <!-- Premium admin header -->
    <div class="relative overflow-hidden rounded-[26px] p-5 text-white shadow-lg"
         style="background: linear-gradient(135deg,#5a96d8 0%,#7eb1e6 50%,#9fc7f0 100%);">
      <div class="absolute -top-12 -right-10 w-44 h-44 rounded-full" style="background:radial-gradient(circle,rgba(255,232,128,.4),transparent 60%);"></div>
      <div class="absolute -bottom-16 -left-8 w-40 h-40 rounded-full" style="background:radial-gradient(circle,rgba(255,255,255,.3),transparent 65%);"></div>
      <div class="relative flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center border-2 border-white/40 overflow-hidden">
            ${_settings.logoUrl ? `<img src="${escapeHtml(_settings.logoUrl)}" class="w-full h-full object-cover">` : `<span class="font-display font-extrabold text-lg">DB</span>`}
          </div>
          <div>
            <div class="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-[0.18em] uppercase text-yellow-300"><span class="w-1.5 h-1.5 rounded-full bg-yellow-300 animate-pulse"></span>Panel de control</div>
            <h1 class="font-display font-extrabold text-xl leading-tight">Don Balato Ivan</h1>
          </div>
        </div>
        <button onclick="adminLogout()" class="bg-white/15 hover:bg-white/25 px-3.5 py-2 rounded-full text-xs font-bold backdrop-blur border border-white/20 active:scale-95 flex items-center gap-1.5">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
          Salir
        </button>
      </div>
      <div class="relative grid grid-cols-4 gap-2 mt-5">
        ${[
          { n: allList.length, l: 'Productos' },
          { n: Object.keys(overrides).length, l: 'Editados' },
          { n: orders.length, l: 'Pedidos' },
          { n: formatPrice(revenue).replace('$',''), l: 'Vendido $', small: true }
        ].map(s => `<div class="bg-white/12 rounded-2xl p-2.5 backdrop-blur border border-white/15 text-center">
          <div class="font-display font-extrabold ${s.small ? 'text-sm' : 'text-xl'} leading-none">${s.n}</div>
          <div class="text-[9px] opacity-75 font-bold uppercase tracking-wide mt-1">${s.l}</div>
        </div>`).join('')}
      </div>
      ${(pendingOrders > 0 || lowStockCount > 0 || noImgCount > 0) ? `
      <div class="relative flex flex-wrap gap-1.5 mt-3">
        ${pendingOrders > 0 ? `<button onclick="window._adminTab='orders'; renderAdmin()" class="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-300 text-amber-900 active:scale-95">⏳ ${pendingOrders} pedido${pendingOrders>1?'s':''} pendiente${pendingOrders>1?'s':''}</button>` : ''}
        ${lowStockCount > 0 ? `<span class="text-[11px] font-bold px-2.5 py-1 rounded-full bg-white/15 border border-white/20">📉 ${lowStockCount} bajo stock</span>` : ''}
        ${noImgCount > 0 ? `<span class="text-[11px] font-bold px-2.5 py-1 rounded-full bg-white/15 border border-white/20">🖼️ ${noImgCount} sin foto</span>` : ''}
      </div>` : ''}
    </div>

    <!-- Tab bar (segmented) -->
    <div class="grid grid-cols-4 gap-1.5 bg-white/90 backdrop-blur rounded-2xl p-1.5 card-shadow sticky z-30" style="top: var(--hdr-h, 110px);">
      ${adminTabs.map(t => `
        <button onclick="window._adminTab='${t.id}'; renderAdmin()" class="relative flex flex-col items-center gap-1 py-2 rounded-xl text-[11px] font-bold transition ${tab===t.id?'bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow':'text-blue-400 hover:bg-blue-50'}">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.9" d="${t.icon}"/></svg>
          ${t.label}
          ${t.badge > 0 ? `<span class="absolute top-0.5 right-1 bg-amber-400 text-amber-900 text-[9px] rounded-full min-w-4 h-4 px-1 inline-flex items-center justify-center font-extrabold">${t.badge}</span>` : ''}
        </button>`).join('')}
    </div>

    ${tab === 'products' ? `
    <details class="bg-white rounded-3xl p-5 card-shadow">
      <summary class="font-bold text-lg cursor-pointer text-blue-600 flex items-center gap-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
        Agregar producto nuevo
      </summary>
      <div class="space-y-4 mt-4 bg-gray-50/50 p-4 rounded-3xl border border-blue-50">
        <div>
          <h4 class="font-bold text-xs text-blue-800 mb-2 ml-1 uppercase tracking-wider">1. Info Básica</h4>
          <div class="space-y-2">
            <input id="f_sku" placeholder="SKU *" class="w-full px-4 py-3 border-2 border-blue-100 rounded-2xl focus:border-blue-300 focus:outline-none bg-white shadow-sm">
            <input id="f_name" placeholder="Nombre del producto *" class="w-full px-4 py-3 border-2 border-blue-100 rounded-2xl focus:border-blue-300 focus:outline-none bg-white shadow-sm">
          </div>
        </div>
        <div>
          <h4 class="font-bold text-xs text-blue-800 mb-2 ml-1 mt-4 uppercase tracking-wider">2. Precio y Stock</h4>
          <div class="grid grid-cols-2 gap-2">
            <input id="f_priceA" type="number" placeholder="Precio *" class="w-full px-4 py-3 border-2 border-blue-100 rounded-2xl focus:border-blue-300 focus:outline-none bg-white shadow-sm">
            <input id="f_stock" type="number" placeholder="Stock" class="w-full px-4 py-3 border-2 border-blue-100 rounded-2xl focus:border-blue-300 focus:outline-none bg-white shadow-sm">
          </div>
        </div>
        <div>
          <h4 class="font-bold text-xs text-blue-800 mb-2 ml-1 mt-4 uppercase tracking-wider">3. Fotos del Producto</h4>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <div class="img-upload-box" id="f_img1_box" onclick="document.getElementById('f_img1_file').click()">
                <div class="upload-placeholder">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                  <span>Foto 1<br>(principal)</span>
                </div>
              </div>
              <input type="file" id="f_img1_file" accept="image/*" class="hidden" onchange="uploadImageBox(event, 'f_image', 'f_img1_box', 'f_img1_remove')">
              <input type="hidden" id="f_image">
              <button type="button" id="f_img1_remove" class="hidden mt-1 w-full text-[10px] font-bold text-rose-500 py-1" onclick="clearImgBox('f_image','f_img1_box','f_img1_remove','f_img1_file')">Quitar foto</button>
            </div>
            <div>
              <div class="img-upload-box" id="f_img2_box" onclick="document.getElementById('f_img2_file').click()">
                <div class="upload-placeholder">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                  <span>Foto 2<br>(opcional)</span>
                </div>
              </div>
              <input type="file" id="f_img2_file" accept="image/*" class="hidden" onchange="uploadImageBox(event, 'f_image2', 'f_img2_box', 'f_img2_remove')">
              <input type="hidden" id="f_image2">
              <button type="button" id="f_img2_remove" class="hidden mt-1 w-full text-[10px] font-bold text-rose-500 py-1" onclick="clearImgBox('f_image2','f_img2_box','f_img2_remove','f_img2_file')">Quitar foto</button>
            </div>
          </div>
        </div>
        <div>
          <h4 class="font-bold text-xs text-blue-800 mb-2 ml-1 mt-4 uppercase tracking-wider">4. Categorización</h4>
          <div class="space-y-3">
            <div class="space-y-2">
              <select id="f_category" class="w-full px-4 py-3 border-2 border-blue-100 rounded-2xl focus:border-blue-300 focus:outline-none bg-white shadow-sm font-semibold text-blue-900" onchange="handleCategoryChange()">
                <option value="">Seleccionar categoría *</option>
                ${getKnownCategories().map(c=>`<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join('')}
                <option value="Nueva categoría...">+ Nueva categoría...</option>
              </select>
              <div id="f_new_category_wrapper" class="hidden p-3 bg-blue-100/50 border border-blue-200 rounded-2xl space-y-2 shadow-inner">
                <input id="f_new_category" placeholder="Nombre de la nueva categoría *" class="w-full px-4 py-3 text-sm border-2 border-white rounded-xl focus:border-blue-400 focus:outline-none bg-white shadow-sm">
                <div class="relative">
                  <input id="f_new_category_img" placeholder="URL foto de categoría" class="w-full px-4 py-3 text-xs border-2 border-white rounded-xl focus:border-blue-400 focus:outline-none bg-white shadow-sm pr-24">
                  <label class="absolute right-1 top-1 bottom-1 bg-blue-200 hover:bg-blue-300 text-blue-800 px-3 rounded-lg flex items-center justify-center cursor-pointer text-[10px] font-bold uppercase tracking-wider transition-colors">
                    Subir <input type="file" accept="image/*" onchange="uploadImage(event, 'f_new_category_img')" class="hidden">
                  </label>
                </div>
              </div>
            </div>
            
            <div class="space-y-2">
              <select id="f_subcategory" class="w-full px-4 py-3 border-2 border-blue-100 rounded-2xl focus:border-blue-300 focus:outline-none bg-white shadow-sm text-sm" onchange="handleSubcategoryChange()">
                <option value="">Subcategoría (opcional)</option>
              </select>
              <div id="f_new_subcategory_wrapper" class="hidden p-3 bg-blue-100/50 border border-blue-200 rounded-2xl space-y-2 shadow-inner">
                <input id="f_new_subcategory" placeholder="Nombre de la nueva subcategoría *" class="w-full px-4 py-3 text-sm border-2 border-white rounded-xl focus:border-blue-400 focus:outline-none bg-white shadow-sm">
                <div class="relative">
                  <input id="f_new_subcategory_img" placeholder="URL foto de subcategoría" class="w-full px-4 py-3 text-xs border-2 border-white rounded-xl focus:border-blue-400 focus:outline-none bg-white shadow-sm pr-24">
                  <label class="absolute right-1 top-1 bottom-1 bg-blue-200 hover:bg-blue-300 text-blue-800 px-3 rounded-lg flex items-center justify-center cursor-pointer text-[10px] font-bold uppercase tracking-wider transition-colors">
                    Subir <input type="file" accept="image/*" onchange="uploadImage(event, 'f_new_subcategory_img')" class="hidden">
                  </label>
                </div>
              </div>
            </div>
            
            <input id="f_subsubcategory" placeholder="Tercer nivel / Sub-subcategoría (opcional)" class="w-full px-4 py-3 border-2 border-blue-100 rounded-2xl focus:border-blue-300 focus:outline-none bg-white shadow-sm text-sm">
          </div>
        </div>
        <button onclick="addCustomProduct()" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg active:scale-95 transition-all mt-6 text-base">Guardar Producto</button>
      </div>
    </details>

    <div class="bg-white rounded-3xl p-5 card-shadow">
      <h2 id="adminProductCount" class="font-bold text-lg mb-3 text-blue-600">Productos (${filtered.length})</h2>
      <input id="adminSearchInput" value="${escapeHtml(editFilter)}" oninput="window._adminFilter = this.value; renderAdminProductList()" placeholder="Buscar por SKU, nombre o categoría..." class="w-full px-4 py-3 border-2 border-blue-100 rounded-2xl focus:border-blue-300 focus:outline-none mb-3">
      <div id="adminProductList" class="space-y-2">
        ${visible.map(p => {
          const isCustom = customs.find(c => c.sku === p.sku);
          const isEdited = !!overrides[p.sku];
          return `<div class="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-white rounded-2xl p-2 border border-blue-100">
            <div class="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">${imgEl(p.image, p.name)}</div>
            <div class="flex-1 min-w-0">
              <div class="font-semibold text-blue-700 text-sm truncate">${escapeHtml(p.name)}</div>
              <div class="text-[11px] text-blue-400 truncate">SKU: ${escapeHtml(p.sku)} · ${formatPrice(p.priceA)}</div>
              <div class="flex gap-1 mt-0.5 flex-wrap">
                ${isCustom ? '<span class="text-[10px] bg-blue-200 text-blue-700 px-1.5 py-0.5 rounded font-bold">NUEVO</span>' : ''}
                ${isEdited ? '<span class="text-[10px] bg-yellow-200 text-yellow-800 px-1.5 py-0.5 rounded font-bold">EDITADO</span>' : ''}
                ${!p.image ? '<span class="text-[10px] bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded font-bold">SIN FOTO</span>' : ''}
              </div>
            </div>
            <div class="flex flex-col gap-1 flex-shrink-0">
              <a href="#/admin/edit/${encodeURIComponent(p.sku)}" class="bg-blue-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold active:scale-95 text-center">Editar</a>
              <button onclick="quickDeleteProduct('${escapeHtml(p.sku)}')" class="bg-red-50 text-red-500 px-3 py-1.5 rounded-full text-xs font-semibold active:scale-95 border border-red-200">🗑️</button>
            </div>
          </div>`;
        }).join('')}
      </div>
    </div>
    ` : ''}

    ${tab === 'orders' ? `
    <div class="bg-white rounded-3xl p-5 card-shadow">
      <h2 class="font-bold text-lg mb-3 text-blue-600">Pedidos (${orders.length})</h2>
      ${orders.length === 0 ? '<div class="text-center text-blue-400 py-8">No hay pedidos registrados aún</div>' : `
      <div class="space-y-3">
        ${orders.map(o => {
          const d = new Date(o.date);
          const dateStr = d.toLocaleString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
          return `<div class="rounded-2xl border-2 ${o.paid?'border-green-200 bg-green-50':'border-amber-200 bg-amber-50'} p-3">
            <div class="flex items-center justify-between mb-2">
              <div>
                <div class="font-bold text-sm ${o.paid?'text-green-700':'text-amber-700'}">${o.paid?'✓ PAGADO':'⏳ PENDIENTE'}</div>
                <div class="text-[11px] text-blue-400">${dateStr} · ${o.id}</div>
              </div>
              <div class="text-right">
                <div class="font-bold text-blue-700 text-lg">${formatPrice(o.total)}</div>
                <div class="text-[11px] text-blue-400">${o.items.reduce((a,i)=>a+i.qty,0)} items</div>
              </div>
            </div>
            <details class="mt-1">
              <summary class="text-xs text-blue-500 cursor-pointer font-semibold">Ver productos</summary>
              <div class="mt-2 space-y-1 text-xs text-blue-700">
                ${o.items.map(i => {
                  const p = getProducts().find(prod => prod.sku === i.sku);
                  const img = p && p.image ? `<img src="${escapeHtml(p.image)}" onclick="openLightbox('${escapeHtml(p.image)}')" class="w-10 h-10 object-cover rounded-md flex-shrink-0 border border-blue-100 cursor-pointer hover:scale-110 transition-transform card-shadow">` : `<div class="w-10 h-10 bg-blue-50 rounded-md flex-shrink-0 border border-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-300">?</div>`;
                  return `<div class="flex items-center gap-3 py-2 border-b border-blue-50/50 last:border-0 hover:bg-blue-50/30 rounded-lg px-2 transition-colors"><div class="flex-shrink-0">${img}</div><div class="flex-1 truncate"><div class="font-bold text-blue-800 text-xs truncate">${escapeHtml(i.name)}</div><div class="text-[10px] text-blue-400 font-semibold mt-0.5">Cant: <span class="text-blue-600">${i.qty}</span></div></div><div class="font-bold text-sm flex-shrink-0 text-blue-800">${formatPrice(i.price*i.qty)}</div></div>`;
                }).join('')}
              </div>
            </details>
            <div class="flex gap-2 mt-3">
              ${o.paid 
                ? `<button onclick="unmarkOrderPaid('${o.id}')" class="flex-1 bg-white border-2 border-green-300 text-green-700 font-semibold py-2 rounded-full text-xs active:scale-95">Desmarcar pagado</button>`
                : `<button onclick="markOrderPaid('${o.id}')" class="flex-1 bg-green-500 text-white font-semibold py-2 rounded-full text-xs active:scale-95">✓ Marcar pagado</button>`
              }
              <button onclick="deleteOrder('${o.id}')" class="bg-red-50 border border-red-200 text-red-500 font-semibold px-3 py-2 rounded-full text-xs active:scale-95">🗑️</button>
            </div>
          </div>`;
        }).join('')}
      </div>`}
    </div>
    ` : ''}

    ${tab === 'categories' ? (() => {
      const allCategoryPaths = new Set();
      const customObj = getCustomCategories();
      allList.forEach(p => {
        const pPath = getProductPath(p);
        let curr = '';
        pPath.forEach(part => {
          curr = curr ? curr + '/' + part : part;
          if (customObj[curr] !== '__DELETED__') {
            allCategoryPaths.add(curr);
          }
        });
      });
      Object.keys(customObj).forEach(pathStr => {
        if (customObj[pathStr] !== '__DELETED__') {
          allCategoryPaths.add(pathStr);
        }
      });
      const sortedCats = [...allCategoryPaths].sort();
      
      return `
      <div class="bg-white rounded-3xl p-5 card-shadow">
        <h2 class="font-bold text-lg mb-4 text-blue-600">Crear o Editar Categorías</h2>
        
        <div class="bg-blue-50 p-4 rounded-2xl mb-6">
          <h3 class="font-semibold text-sm text-blue-800 mb-2">Añadir Nueva Categoría/Subcategoría</h3>
          <p class="text-[10px] text-blue-500 mb-3">Usa barras "/" para crear subcategorías (Ej: Ropa/Mujer/Verano)</p>
          <input id="new_cat_path" placeholder="Nombre (Ej: Zapatillas)" class="w-full px-3 py-2 text-sm border border-blue-200 rounded-xl mb-2 focus:outline-none focus:border-blue-400">
          <label class="block text-xs text-blue-500 mb-1">Imagen (URL o subir archivo):</label>
          <input id="new_cat_img" placeholder="https://..." class="w-full px-3 py-2 text-sm border border-blue-200 rounded-xl mb-2 focus:outline-none focus:border-blue-400">
          <label class="block mb-2">
            <span class="block w-full bg-white text-blue-500 border border-blue-200 font-semibold py-1.5 rounded-xl text-center cursor-pointer text-xs active:bg-blue-100">📷 Subir desde dispositivo</span>
            <input type="file" accept="image/*" onchange="uploadImage(event, 'new_cat_img')" class="hidden">
          </label>
          <button onclick="addNewCustomCat()" class="w-full bg-blue-500 text-white font-bold py-2 rounded-xl text-sm active:scale-95">Guardar Nueva Categoría</button>
        </div>

        <h3 class="font-bold text-sm text-blue-600 mb-3">Categorías Existentes (${sortedCats.length})</h3>
        <div class="space-y-4">
          ${sortedCats.map(pathStr => {
            const pathArr = pathStr.split('/');
            const name = pathArr[pathArr.length - 1];
            const iconUrl = getCategoryIcon(name, pathArr);
            const isCustom = !!_customCategories[pathStr];
            const inputId = 'cat_img_' + btoa(pathStr).replace(/=/g, '');
            const level = pathArr.length - 1;
            const paddingLeft = level * 1.5;
            
            const isRoot = level === 0;
            const titleColor = isRoot ? 'text-blue-900 text-base' : 'text-gray-600 text-sm';
            const bgColor = isRoot ? 'bg-white shadow-sm border border-blue-100 rounded-2xl' : 'bg-gray-50 border-l-4 border-blue-400 rounded-r-2xl rounded-l-md';
            const prefixArrow = isRoot ? '' : '<span class="text-blue-400 font-bold mr-1">↳</span>';
            const pClass = isRoot ? 'p-4 mb-5' : 'p-3 mb-3 relative';
            const connector = !isRoot ? `<div class="absolute -left-[1.5rem] top-6 w-6 h-px bg-blue-200"></div>` : '';
            
            return `
            <div class="${bgColor} ${pClass}" style="margin-left: ${paddingLeft}rem">
              ${connector}
              <div class="flex items-center gap-3 mb-3 relative z-10">
                <div class="${isRoot ? 'w-12 h-12' : 'w-10 h-10'} rounded-xl overflow-hidden bg-blue-50 flex-shrink-0 relative shadow-inner border border-blue-100/50">
                  ${iconUrl ? `<img src="${escapeHtml(iconUrl)}" class="w-full h-full object-cover">` : `<span class="absolute inset-0 flex items-center justify-center text-blue-300 text-xs font-bold">${name[0]}</span>`}
                </div>
                <div class="flex-1">
                  <div class="font-bold ${titleColor}">${prefixArrow}${escapeHtml(name)}</div>
                  <div class="text-[10px] text-blue-400 opacity-80">${escapeHtml(pathStr)} ${isCustom ? '<span class="text-yellow-600 font-bold bg-yellow-100 px-1.5 rounded ml-1 border border-yellow-200">Personalizada</span>' : ''}</div>
                </div>
              </div>
              <div class="flex flex-col sm:flex-row gap-2 relative z-10">
                <div class="flex-1 relative">
                  <input id="${inputId}" value="${isCustom && _customCategories[pathStr].image ? escapeHtml(_customCategories[pathStr].image) : ''}" placeholder="URL de la imagen o subir..." class="w-full px-3 py-2 text-xs border border-blue-200 rounded-xl focus:outline-none focus:border-blue-400 bg-white">
                  <label class="absolute right-1 top-1 bottom-1 bg-blue-50 hover:bg-blue-100 border border-blue-100 text-blue-600 px-3 rounded-lg flex items-center justify-center cursor-pointer text-[10px] font-bold uppercase tracking-wider transition-colors">
                    Subir <input type="file" accept="image/*" onchange="uploadImage(event, '${inputId}')" class="hidden">
                  </label>
                </div>
                <button onclick="saveCustomCat('${escapeHtml(pathStr)}')" class="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold active:scale-95 whitespace-nowrap shadow-sm hover:bg-blue-700 transition-colors">Guardar</button>
                <button onclick="deleteCustomCat('${escapeHtml(pathStr)}')" class="bg-red-50 text-red-500 border border-red-200 px-4 py-2 rounded-xl text-xs font-bold active:scale-95 whitespace-nowrap hover:bg-red-100 transition-colors">🗑️ Borrar</button>
              </div>
            </div>
            `;
          }).join('')}
        </div>
      </div>`;
    })() : ''}

    ${tab === 'settings' ? `
    <!-- Logo de la tienda -->
    <div class="bg-white rounded-3xl p-5 card-shadow">
      <div class="section-title mb-1 !text-base">Logo de la tienda</div>
      <p class="text-xs text-blue-400 mb-4">Sube un PNG con fondo transparente. Aparecerá en el banner principal y en este panel.</p>
      <div class="flex items-center gap-4">
        <div id="logoPreview" class="w-24 h-24 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden border-2 border-dashed border-blue-200"
             style="background:linear-gradient(135deg,#5a96d8,#7eb1e6);">
          ${_settings.logoUrl
            ? `<img src="${escapeHtml(_settings.logoUrl)}" class="w-full h-full object-cover">`
            : `<span class="text-white/60 text-[11px] font-bold text-center px-2">Sin logo</span>`}
        </div>
        <div class="flex-1 space-y-2">
          <input id="admin_logo_url" value="${escapeHtml(_settings.logoUrl || '')}" oninput="updateLogoPreview()" placeholder="URL del logo o subir..." class="w-full px-3 py-2.5 text-sm border-2 border-blue-100 rounded-xl focus:border-blue-300 focus:outline-none">
          <label class="block">
            <span class="block w-full btn-primary text-white font-bold py-2.5 rounded-xl text-center cursor-pointer text-sm active:scale-95">📷 Subir PNG</span>
            <input type="file" accept="image/png,image/*" onchange="uploadLogo(event)" class="hidden">
          </label>
          <div class="flex gap-2">
            <button onclick="saveLogo()" class="flex-1 bg-blue-600 text-white font-bold py-2.5 rounded-xl text-sm active:scale-95">Guardar logo</button>
            <button onclick="removeLogo()" class="bg-red-50 text-red-500 border border-red-200 font-bold px-4 py-2.5 rounded-xl text-sm active:scale-95">Quitar</button>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-3xl p-5 card-shadow space-y-4">
      <div class="section-title !text-base">Configuración global</div>
      <div>
        <label class="block text-xs font-bold text-blue-500 mb-1 uppercase tracking-wide">Compra mínima ($)</label>
        <div class="flex gap-2">
          <input type="number" id="admin_min_purchase" value="${getMinPurchase()}" class="flex-1 px-4 py-2.5 border-2 border-blue-100 rounded-xl focus:border-blue-300 focus:outline-none font-semibold">
          <button onclick="updateMinPurchase()" class="btn-primary text-white font-bold px-5 py-2.5 rounded-xl active:scale-95">Guardar</button>
        </div>
      </div>
    </div>

    ${deleted.length > 0 ? `<div class="bg-white rounded-3xl p-5 card-shadow">
      <div class="section-title mb-3 !text-base">Eliminados (${deleted.length})</div>
      <button onclick="restoreAllDeleted()" class="w-full bg-blue-100 text-blue-600 font-bold py-2.5 rounded-xl active:scale-95">Restaurar todos</button>
    </div>` : ''}

    <div class="bg-white rounded-3xl p-5 card-shadow">
      <div class="section-title mb-3 !text-base">Datos y respaldo</div>
      <button onclick="migrateLocalToFirebase()" class="w-full bg-yellow-100 text-yellow-700 font-bold py-3 rounded-xl active:scale-95 mb-3 border border-yellow-300">⚠️ Rescatar datos locales a la nube</button>
      <div class="grid grid-cols-2 gap-2">
        <button onclick="exportAdminData()" class="bg-blue-100 text-blue-600 font-bold py-3 rounded-xl active:scale-95">📥 Exportar JSON</button>
        <button onclick="exportCatalogExcel()" class="bg-green-100 text-green-700 font-bold py-3 rounded-xl active:scale-95">📊 Exportar Excel</button>
      </div>
      <label class="block mt-2">
        <span class="block w-full bg-blue-100 text-blue-600 font-bold py-3 rounded-xl active:scale-95 text-center cursor-pointer">📤 Importar</span>
        <input type="file" accept=".json" onchange="importAdminData(event)" class="hidden">
      </label>
      <div class="text-xs text-blue-400 mt-2">Exporta tus cambios para respaldarlos o moverlos a otro dispositivo.</div>
    </div>
    ` : ''}
  </div>`;
  $('#app').innerHTML = html;
  // Initial render of product list
  renderAdminProductList();
}

// Edit individual product
function renderAdminEdit(sku) {
  const p = getProducts().find(x => x.sku === sku);
  if (!p) {
    $('#app').innerHTML = '<div class="text-center text-rose-400 py-12">Producto no encontrado <a href="#/admin" class="text-rose-600 underline">Volver</a></div>';
    return;
  }
  const isCustom = !!_customProducts.find(c => c.sku === sku);
  const cats = getKnownCategories();

  $('#app').innerHTML = `<div class="fade-in space-y-4 max-w-md mx-auto pb-12">
    <a href="#/admin" class="text-rose-500 text-sm font-semibold inline-flex items-center gap-1">← Volver al panel</a>
    <h1 class="font-bold text-2xl text-rose-700">Editar producto</h1>

    <div class="bg-white rounded-3xl p-5 card-shadow space-y-4 border border-rose-50">
      <div class="flex justify-center mb-6">
        <div id="prevImg" class="w-32 h-32 rounded-3xl overflow-hidden shadow-md border-4 border-rose-50">${imgEl(p.image, p.name)}</div>
      </div>

      <div class="bg-rose-50/50 p-4 rounded-3xl border border-rose-100/50 space-y-4">
        <div>
          <h4 class="font-bold text-xs text-rose-800 mb-2 ml-1 uppercase tracking-wider">1. Info Básica</h4>
          <div class="space-y-2">
            <input id="e_sku" value="${escapeHtml(p.sku)}" disabled class="w-full px-4 py-3 border-2 border-rose-100 rounded-2xl bg-rose-50/80 text-rose-400 font-mono shadow-sm cursor-not-allowed">
            <input id="e_name" value="${escapeHtml(p.name)}" placeholder="Nombre del producto *" class="w-full px-4 py-3 border-2 border-rose-100 rounded-2xl focus:border-rose-400 focus:outline-none bg-white shadow-sm">
          </div>
        </div>
        
        <div>
          <h4 class="font-bold text-xs text-rose-800 mb-2 ml-1 mt-4 uppercase tracking-wider">2. Precio y Stock</h4>
          <div class="grid grid-cols-2 gap-2">
            <input id="e_priceA" type="number" value="${p.priceA||0}" placeholder="Precio *" class="w-full px-4 py-3 border-2 border-rose-100 rounded-2xl focus:border-rose-400 focus:outline-none bg-white shadow-sm">
            <input id="e_stock" type="number" value="${p.stock||0}" placeholder="Stock" class="w-full px-4 py-3 border-2 border-rose-100 rounded-2xl focus:border-rose-400 focus:outline-none bg-white shadow-sm">
          </div>
        </div>
        
        <div>
          <h4 class="font-bold text-xs text-rose-800 mb-2 ml-1 mt-4 uppercase tracking-wider">3. Fotos del Producto</h4>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <div class="img-upload-box ${p.image ? 'has-img' : ''}" id="e_img1_box" onclick="document.getElementById('e_img1_file').click()">
                ${p.image ? `<img src="${escapeHtml(p.image)}" alt="Foto 1"><div class="img-label">Foto 1 (principal)</div>` : `<div class="upload-placeholder"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg><span>Foto 1<br>(principal)</span></div>`}
              </div>
              <input type="file" id="e_img1_file" accept="image/*" class="hidden" onchange="uploadImageBox(event, 'e_image', 'e_img1_box', 'e_img1_remove')">
              <input type="hidden" id="e_image" value="${escapeHtml(p.image||'')}">
              <button type="button" id="e_img1_remove" class="${p.image ? '' : 'hidden'} mt-1 w-full text-[10px] font-bold text-rose-500 py-1" onclick="clearImgBox('e_image','e_img1_box','e_img1_remove','e_img1_file')">Quitar foto</button>
            </div>
            <div>
              <div class="img-upload-box ${p.image2 ? 'has-img' : ''}" id="e_img2_box" onclick="document.getElementById('e_img2_file').click()">
                ${p.image2 ? `<img src="${escapeHtml(p.image2)}" alt="Foto 2"><div class="img-label">Foto 2</div>` : `<div class="upload-placeholder"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg><span>Foto 2<br>(opcional)</span></div>`}
              </div>
              <input type="file" id="e_img2_file" accept="image/*" class="hidden" onchange="uploadImageBox(event, 'e_image2', 'e_img2_box', 'e_img2_remove')">
              <input type="hidden" id="e_image2" value="${escapeHtml(p.image2||'')}">
              <button type="button" id="e_img2_remove" class="${p.image2 ? '' : 'hidden'} mt-1 w-full text-[10px] font-bold text-rose-500 py-1" onclick="clearImgBox('e_image2','e_img2_box','e_img2_remove','e_img2_file')">Quitar foto</button>
            </div>
          </div>
        </div>
        
        <div>
          <h4 class="font-bold text-xs text-rose-800 mb-2 ml-1 mt-4 uppercase tracking-wider">4. Categorización</h4>
          <div class="space-y-3">
            <div class="space-y-2">
              <select id="e_category" class="w-full px-4 py-3 border-2 border-rose-100 rounded-2xl focus:border-rose-400 focus:outline-none bg-white shadow-sm font-semibold text-rose-900" onchange="handleEditCategoryChange()">
                <option value="">Seleccionar categoría *</option>
                ${cats.map(c=>`<option value="${escapeHtml(c)}" ${p.category === c ? 'selected' : ''}>${escapeHtml(c)}</option>`).join('')}
                <option value="Nueva categoría...">+ Nueva categoría...</option>
              </select>
              <div id="e_new_category_wrapper" class="hidden p-3 bg-rose-100/50 border border-rose-200 rounded-2xl space-y-2 shadow-inner">
                <input id="e_new_category" placeholder="Nombre de la nueva categoría *" class="w-full px-4 py-3 text-sm border-2 border-white rounded-xl focus:border-rose-400 focus:outline-none bg-white shadow-sm">
                <div class="relative">
                  <input id="e_new_category_img" placeholder="URL foto de categoría" class="w-full px-4 py-3 text-xs border-2 border-white rounded-xl focus:border-rose-400 focus:outline-none bg-white shadow-sm pr-24">
                  <label class="absolute right-1 top-1 bottom-1 bg-rose-200 hover:bg-rose-300 text-rose-800 px-3 rounded-lg flex items-center justify-center cursor-pointer text-[10px] font-bold uppercase tracking-wider transition-colors">
                    Subir <input type="file" accept="image/*" onchange="uploadImage(event, 'e_new_category_img')" class="hidden">
                  </label>
                </div>
              </div>
            </div>
            
            <div class="space-y-2">
              <select id="e_subcategory" class="w-full px-4 py-3 border-2 border-rose-100 rounded-2xl focus:border-rose-400 focus:outline-none bg-white shadow-sm text-sm" onchange="handleEditSubcategoryChange()">
                <option value="">Subcategoría (opcional)</option>
                ${getKnownSubcategories(p.category).map(s=>`<option value="${escapeHtml(s)}" ${p.subcategory === s ? 'selected' : ''}>${escapeHtml(s)}</option>`).join('')}
                <option value="Nueva subcategoría...">+ Nueva subcategoría...</option>
              </select>
              <div id="e_new_subcategory_wrapper" class="hidden p-3 bg-rose-100/50 border border-rose-200 rounded-2xl space-y-2 shadow-inner">
                <input id="e_new_subcategory" placeholder="Nombre de la nueva subcategoría *" class="w-full px-4 py-3 text-sm border-2 border-white rounded-xl focus:border-rose-400 focus:outline-none bg-white shadow-sm">
                <div class="relative">
                  <input id="e_new_subcategory_img" placeholder="URL foto de subcategoría" class="w-full px-4 py-3 text-xs border-2 border-white rounded-xl focus:border-rose-400 focus:outline-none bg-white shadow-sm pr-24">
                  <label class="absolute right-1 top-1 bottom-1 bg-rose-200 hover:bg-rose-300 text-rose-800 px-3 rounded-lg flex items-center justify-center cursor-pointer text-[10px] font-bold uppercase tracking-wider transition-colors">
                    Subir <input type="file" accept="image/*" onchange="uploadImage(event, 'e_new_subcategory_img')" class="hidden">
                  </label>
                </div>
              </div>
            </div>
            
            <input id="e_subsubcategory" value="${escapeHtml(p.subsubcategory||'')}" placeholder="Tercer nivel / Sub-subcategoría (opcional)" class="w-full px-4 py-3 border-2 border-rose-100 rounded-2xl focus:border-rose-400 focus:outline-none bg-white shadow-sm text-sm">
          </div>
        </div>
      </div>
    </div>

    <div class="space-y-2 pt-2">
      <button onclick="saveProductEdit('${escapeHtml(sku)}')" class="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-4 rounded-2xl shadow-lg active:scale-95 transition-all text-base">Guardar cambios</button>
      <button onclick="resetProductEdit('${escapeHtml(sku)}')" class="w-full bg-white border-2 border-rose-200 text-rose-600 font-bold py-3 rounded-2xl active:scale-95 transition-all text-sm">Restaurar valores originales</button>
      <button onclick="deleteProductFull('${escapeHtml(sku)}', ${isCustom})" class="w-full bg-red-50 text-red-600 font-bold py-3 rounded-2xl active:scale-95 transition-all text-sm mt-4 border border-red-100 hover:bg-red-100">🗑️ Eliminar producto</button>
    </div>
  </div>`;
}

function updateImgPreview() {
  const url = $('#e_image').value.trim();
  const name = $('#e_name').value.trim() || '?';
  $('#prevImg').innerHTML = imgEl(url, name);
}

function saveProductEdit(sku) {
  const path = [];
  const categorySelect = $('#e_category');
  let cat = categorySelect.value.trim();
  const newCat = $('#e_new_category').value.trim();
  const newCatImg = $('#e_new_category_img') ? $('#e_new_category_img').value.trim() : '';

  if (cat === 'Nueva categoría...' && newCat) {
    cat = newCat;
    if (newCatImg) {
      const cats = { ...getCustomCategories() };
      cats[cat] = { image: newCatImg };
      saveCustomCategories(cats);
    }
  }

  let sub = $('#e_subcategory').value.trim();
  const newSub = $('#e_new_subcategory').value.trim();
  const newSubImg = $('#e_new_subcategory_img') ? $('#e_new_subcategory_img').value.trim() : '';

  if (sub === 'Nueva subcategoría...' && newSub) {
    sub = newSub;
    if (newSubImg) {
      const cats = { ...getCustomCategories() };
      cats[cat + '/' + sub] = { image: newSubImg };
      saveCustomCategories(cats);
    }
  }

  const subsub = $('#e_subsubcategory').value.trim();
  if (cat) path.push(cat);
  if (sub) path.push(sub);
  if (subsub) path.push(subsub);
  const patch = {
    name: $('#e_name').value.trim(),
    priceA: parseInt($('#e_priceA').value) || 0,
    priceB: parseInt($('#e_priceA').value) || 0,
    stock: parseInt($('#e_stock').value) || 0,
    image: $('#e_image').value.trim(),
    image2: $('#e_image2') ? $('#e_image2').value.trim() : '',
    category: cat,
    subcategory: sub,
    subsubcategory: subsub,
    path: path.length ? path : ['Sin Categoria']
  };
  const isCustom = !!_customProducts.find(c => c.sku === sku);
  const oldImage = isCustom
    ? (_customProducts.find(c => c.sku === sku) || {}).image
    : (allProducts.find(p => p.sku === sku) || {}).image;
  const newImage = patch.image;
  if (oldImage && newImage && oldImage !== newImage && oldImage.includes('firebasestorage')) {
    deleteImageFromStorage(oldImage);
  }
  if (isCustom) {
    const idx = _customProducts.findIndex(c => c.sku === sku);
    _customProducts[idx] = { ..._customProducts[idx], ...patch };
    try { localStorage.setItem('db_custom_products', JSON.stringify(_customProducts)); } catch(e) { console.warn('localStorage full', e); }
    db.collection(COL_PRODUCTS).doc(sku).set(_customProducts[idx]).catch(e => {});
  } else {
    setOverride(sku, patch);
  }
  showToast('Cambios guardados');
  navigate('/admin');
}

function resetProductEdit(sku) {
  if (!confirm('¿Restaurar valores originales? Se perderán tus ediciones.')) return;
  clearOverride(sku);
  showToast('Restaurado');
  render();
}

async function deleteImageFromStorage(imageUrl) {
  if (!imageUrl || !imageUrl.includes('firebasestorage')) return;
  try {
    const ref = geminaiStorage.refFromURL(imageUrl);
    await ref.delete();
  } catch(e) {
    console.warn('No se pudo borrar imagen del Storage:', e);
  }
}

function deleteProductFull(sku, isCustom) {
  if (!confirm('¿Eliminar este producto del catálogo?')) return;
  const product = getProducts().find(p => p.sku === sku);
  if (isCustom) {
    _customProducts = _customProducts.filter(c => c.sku !== sku);
    db.collection(COL_PRODUCTS).doc(sku).delete().catch(e => {});
  } else {
    const deleted = getDeleted();
    if (!deleted.includes(sku)) deleted.push(sku);
    setDeleted(deleted);
  }
  if (product && product.image) deleteImageFromStorage(product.image);
  clearOverride(sku);
  showToast('Producto eliminado');
  navigate('/admin');
}

function restoreAllDeleted() {
  if (!confirm('¿Restaurar todos los productos eliminados?')) return;
  setDeleted([]);
  render();
}

function uploadImage(ev, targetId) {
  const file = ev.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = e => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let w = img.width;
      let h = img.height;
      
      const MAX = 500;
      if (w > h && w > MAX) {
        h *= MAX / w;
        w = MAX;
      } else if (h > MAX) {
        w *= MAX / h;
        h = MAX;
      }
      
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, w, h);
      
      canvas.toBlob(async (blob) => {
        if (!blob) return showToast('Error al procesar imagen');
        showToast('Subiendo imagen a Storage...');
        try {
          const filename = 'CATALOGOEMPRENDEDOR/don-balato/' + Date.now() + '_' + Math.random().toString(36).substr(2, 9) + '.webp';
          const ref = geminaiStorage.ref(filename);
          await ref.put(blob);
          const url = await ref.getDownloadURL();
          $('#' + targetId).value = url;
          if (targetId === 'e_image') updateImgPreview();
          showToast('Imagen cargada con éxito');
        } catch(e) {
          console.error(e);
          showToast('Error al subir imagen');
        }
      }, 'image/webp', 0.6);
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function uploadImageBox(ev, hiddenId, boxId, removeBtnId) {
  const file = ev.target.files[0];
  if (!file) return;
  const box = $('#' + boxId);
  const placeholder = box.querySelector('.upload-placeholder');
  if (placeholder) placeholder.style.display = 'none';
  const oldImg = box.querySelector('img');
  if (oldImg) oldImg.remove();
  const oldLabel = box.querySelector('.img-label');
  if (oldLabel) oldLabel.remove();
  const tempImg = document.createElement('img');
  tempImg.style.opacity = '0.5';
  tempImg.src = URL.createObjectURL(file);
  box.appendChild(tempImg);
  box.classList.add('has-img');

  const reader = new FileReader();
  reader.onload = e => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let w = img.width, h = img.height;
      const MAX = 500;
      if (w > h && w > MAX) { h *= MAX / w; w = MAX; }
      else if (h > MAX) { w *= MAX / h; h = MAX; }
      canvas.width = w; canvas.height = h;
      canvas.getContext('2d').drawImage(img, 0, 0, w, h);
      canvas.toBlob(async (blob) => {
        if (!blob) { showToast('Error al procesar imagen'); return; }
        showToast('Subiendo imagen...');
        try {
          const filename = 'CATALOGOEMPRENDEDOR/don-balato/' + Date.now() + '_' + Math.random().toString(36).substr(2, 9) + '.webp';
          const ref = geminaiStorage.ref(filename);
          await ref.put(blob);
          const url = await ref.getDownloadURL();
          $('#' + hiddenId).value = url;
          tempImg.src = url;
          tempImg.style.opacity = '1';
          const label = document.createElement('div');
          label.className = 'img-label';
          label.textContent = hiddenId.includes('image2') ? 'Foto 2' : 'Foto 1 (principal)';
          box.appendChild(label);
          $('#' + removeBtnId).classList.remove('hidden');
          showToast('Imagen cargada');
        } catch (err) {
          console.error(err);
          showToast('Error al subir imagen');
          tempImg.remove();
          box.classList.remove('has-img');
          if (placeholder) placeholder.style.display = '';
        }
      }, 'image/webp', 0.6);
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function clearImgBox(hiddenId, boxId, removeBtnId, fileId) {
  $('#' + hiddenId).value = '';
  const box = $('#' + boxId);
  box.classList.remove('has-img');
  const img = box.querySelector('img');
  if (img) img.remove();
  const label = box.querySelector('.img-label');
  if (label) label.remove();
  const placeholder = box.querySelector('.upload-placeholder');
  if (placeholder) placeholder.style.display = '';
  $('#' + removeBtnId).classList.add('hidden');
  $('#' + fileId).value = '';
}

// === Store logo (PNG, keeps transparency) ===
function updateLogoPreview() {
  const url = (document.getElementById('admin_logo_url') || {}).value || '';
  const prev = document.getElementById('logoPreview');
  if (!prev) return;
  prev.innerHTML = url
    ? `<img src="${escapeHtml(url)}" class="w-full h-full object-cover">`
    : `<span class="text-white/60 text-[11px] font-bold text-center px-2">Sin logo</span>`;
}
function uploadLogo(ev) {
  const file = ev.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    const img = new Image();
    img.onload = () => {
      // Downscale but keep PNG transparency intact
      const MAX = 600;
      let w = img.width, h = img.height;
      if (w > h && w > MAX) { h *= MAX / w; w = MAX; }
      else if (h > MAX) { w *= MAX / h; h = MAX; }
      const canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      canvas.getContext('2d').drawImage(img, 0, 0, w, h);
      canvas.toBlob(async (blob) => {
        if (!blob) return showToast('Error al procesar el logo');
        showToast('Subiendo logo...');
        try {
          const ref = geminaiStorage.ref('logos/' + Date.now() + '_logo.png');
          await ref.put(blob);
          const url = await ref.getDownloadURL();
          const input = document.getElementById('admin_logo_url');
          if (input) input.value = url;
          updateLogoPreview();
          showToast('Logo cargado · pulsa "Guardar logo"');
        } catch (err) { console.error(err); showToast('Error al subir el logo'); }
      }, 'image/png');
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}
async function saveLogo() {
  const url = (document.getElementById('admin_logo_url') || {}).value || '';
  await saveSettings({ logoUrl: url.trim() || null });
  showToast('Logo guardado');
  renderAdmin();
}
async function removeLogo() {
  await saveSettings({ logoUrl: null });
  const input = document.getElementById('admin_logo_url');
  if (input) input.value = '';
  showToast('Logo quitado');
  renderAdmin();
}

window.migrateLocalToFirebase = async function() {
  if (!confirm('¿Subir a la nube tus productos y categorías locales que no se guardaron por el error de ayer?')) return;
  try {
    const localProducts = JSON.parse(localStorage.getItem('db_custom_products') || '[]');
    const localCategories = JSON.parse(localStorage.getItem('db_categories') || '{}');
    const localOverrides = JSON.parse(localStorage.getItem('db_overrides') || '{}');
    
    if (localProducts.length > 0) {
      const batch = db.batch();
      localProducts.forEach(p => {
        batch.set(db.collection(COL_PRODUCTS).doc(p.sku), p);
      });
      await batch.commit();
    }
    
    if (Object.keys(localCategories).length > 0) {
      const mergedCats = { ...getCustomCategories(), ...localCategories };
      const encodedCats = {};
      for (const k in mergedCats) encodedCats[k.replace(/\//g, '||')] = mergedCats[k];
      await db.doc(DOC_CATEGORIES).set({ map: encodedCats });
    }
    
    const localSettings = JSON.parse(localStorage.getItem('db_settings') || '{}');
    if (localSettings.minPurchase) {
      await saveSettings(localSettings);
    }
    
    if (Object.keys(localOverrides).length > 0) {
      const mergedOvs = { ...getOverrides(), ...localOverrides };
      await db.doc(DOC_OVERRIDES).set({ map: mergedOvs });
    }
    
    alert('¡Datos rescatados y subidos a la nube con éxito! Recargando...');
    location.reload();
  } catch (err) {
    alert('Error al subir: ' + err.message);
  }
};

function exportAdminData() {
  const data = {
    customProducts: _customProducts,
    overrides: getOverrides(),
    deleted: getDeleted(),
    exportedAt: new Date().toISOString()
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `yesbella-admin-${new Date().toISOString().slice(0,10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function exportCatalogExcel() {
  const products = getProducts();
  const headers = ['SKU', 'Nombre', 'Precio A', 'Precio B', 'Precio Final', 'Stock', 'Categoria', 'Subcategoria', 'Imagen'];
  let csv = headers.join(';') + '\n';
  products.forEach(p => {
    const row = [
      p.sku || '',
      (p.name || '').replace(/;/g, ',').replace(/\n/g, ' '),
      p.priceA || 0,
      p.priceB || 0,
      getPrice(p),
      p.stock || 0,
      (p.category || '').replace(/;/g, ','),
      (p.subcategory || '').replace(/;/g, ','),
      (p.image || '').replace(/;/g, ',')
    ];
    csv += row.join(';') + '\n';
  });
  // BOM for Excel UTF-8
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `catalogo-web-${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('Excel exportado: ' + products.length + ' productos');
}

function importAdminData(ev) {
  const f = ev.target.files[0];
  if (!f) return;
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const data = JSON.parse(e.target.result);
      if (Array.isArray(data)) {
        data.forEach(p => {
          _customProducts.push(p);
          db.collection(COL_PRODUCTS).doc(p.sku).set(p).catch(e => {});
        });
      } else {
        if (data.customProducts) data.customProducts.forEach(p => {
          _customProducts.push(p);
          db.collection(COL_PRODUCTS).doc(p.sku).set(p).catch(e => {});
        });
        if (data.overrides) saveOverrides(data.overrides);
        if (data.deleted) setDeleted(data.deleted);
      }
      showToast('Datos importados');
      render();
    } catch {
      showToast('Archivo inválido');
    }
  };
  reader.readAsText(f);
}
function checkAdmin() {
  const v = $('#apwd').value;
  if (v === PASSWORDS.admin) {
    sessionStorage.setItem(STORAGE_KEYS.adminAuth, '1');
    render();
  } else {
    showToast('Contraseña incorrecta');
  }
}
function adminLogout() {
  sessionStorage.removeItem(STORAGE_KEYS.adminAuth);
  navigate('/');
}
function quickDeleteProduct(sku) {
  if (!confirm('¿Eliminar este producto del catálogo?')) return;
  const product = getProducts().find(p => p.sku === sku);
  const deleted = getDeleted();
  if (!deleted.includes(sku)) deleted.push(sku);
  setDeleted(deleted);
  // Also delete from custom products if it's there
  const idx = _customProducts.findIndex(c => c.sku === sku);
  if (idx !== -1) {
    _customProducts.splice(idx, 1);
    db.collection(COL_PRODUCTS).doc(sku).delete().catch(e => {});
  }
  if (product && product.image) deleteImageFromStorage(product.image);
  showToast('Producto eliminado');
  renderAdmin();
}
function addCustomProduct() {
  let sku = $('#f_sku').value.trim().replace(/\//g, '-');
  const name = $('#f_name').value.trim();
  const priceA = parseInt($('#f_priceA').value) || 0;
  const priceB = priceA;
  const stock = parseInt($('#f_stock').value) || 999;
  const image = $('#f_image').value.trim();
  const image2 = $('#f_image2') ? $('#f_image2').value.trim() : '';
  
  const categorySelect = $('#f_category');
  let category = categorySelect.value.trim();
  const newCategory = $('#f_new_category').value.trim();
  const newCatImg = $('#f_new_category_img') ? $('#f_new_category_img').value.trim() : '';
  
  if (category === 'Nueva categoría...' && newCategory) {
    category = newCategory;
    if (newCatImg) {
      const cats = { ...getCustomCategories() };
      cats[category] = { image: newCatImg };
      saveCustomCategories(cats);
    }
  }
  
  let subcategory = $('#f_subcategory').value.trim();
  const newSubcategory = $('#f_new_subcategory') ? $('#f_new_subcategory').value.trim() : '';
  const newSubImg = $('#f_new_subcategory_img') ? $('#f_new_subcategory_img').value.trim() : '';
  
  if (subcategory === 'Nueva subcategoría...' && newSubcategory) {
    subcategory = newSubcategory;
    if (newSubImg) {
      const cats = { ...getCustomCategories() };
      cats[category + '/' + subcategory] = { image: newSubImg };
      saveCustomCategories(cats);
    }
  }
  
  const subsubcategory = $('#f_subsubcategory') ? $('#f_subsubcategory').value.trim() : '';
  if (!sku || !name || !priceA || !category) { showToast('Faltan campos requeridos'); return; }
  if (getProducts().some(p => p.sku === sku)) { showToast('SKU ya existe'); return; }
  const path = [category];
  if (subcategory) path.push(subcategory);
  if (subsubcategory) path.push(subsubcategory);
  const product = { sku, name, priceA, priceB, stock, image, image2, category, subcategory, subsubcategory, path, barcode: '', createdAt: Date.now() };
  _customProducts.push(product);
  try {
    const recentSkus = JSON.parse(localStorage.getItem('db_recent_product_skus') || '[]');
    localStorage.setItem('db_recent_product_skus', JSON.stringify([sku, ...recentSkus.filter(s => s !== sku)].slice(0, 20)));
  } catch (e) {}
  try { localStorage.setItem('db_custom_products', JSON.stringify(_customProducts)); } catch(e) { console.warn('localStorage full', e); }
  db.collection(COL_PRODUCTS).doc(sku).set(product).catch(e => console.error('Error adding product:', e));
  showToast('Producto agregado');
  renderAdmin();
}

// Manejar cambio de categoría para mostrar campo de nueva categoría
window.handleCategoryChange = function() {
  const categorySelect = $('#f_category');
  const wrapper = $('#f_new_category_wrapper');
  if (categorySelect && wrapper) {
    if (categorySelect.value === 'Nueva categoría...') {
      wrapper.classList.remove('hidden');
      $('#f_new_category').focus();
      $('#f_subcategory').innerHTML = '<option value="">Subcategoría (opcional)</option><option value="Nueva subcategoría...">+ Nueva subcategoría...</option>';
    } else {
      wrapper.classList.add('hidden');
      updateSubcategories(categorySelect.value);
    }
  }
};

window.handleSubcategoryChange = function() {
  const subSelect = $('#f_subcategory');
  const wrapper = $('#f_new_subcategory_wrapper');
  if (subSelect && wrapper) {
    if (subSelect.value === 'Nueva subcategoría...') {
      wrapper.classList.remove('hidden');
      $('#f_new_subcategory').focus();
    } else {
      wrapper.classList.add('hidden');
    }
  }
};

window.handleEditCategoryChange = function() {
  const categorySelect = $('#e_category');
  const wrapper = $('#e_new_category_wrapper');
  if (categorySelect && wrapper) {
    if (categorySelect.value === 'Nueva categoría...') {
      wrapper.classList.remove('hidden');
      $('#e_new_category').focus();
      $('#e_subcategory').innerHTML = '<option value="">Subcategoría (opcional)</option><option value="Nueva subcategoría...">+ Nueva subcategoría...</option>';
    } else {
      wrapper.classList.add('hidden');
      updateSubcategoriesEdit(categorySelect.value);
    }
  }
};

window.handleEditSubcategoryChange = function() {
  const subSelect = $('#e_subcategory');
  const wrapper = $('#e_new_subcategory_wrapper');
  if (subSelect && wrapper) {
    if (subSelect.value === 'Nueva subcategoría...') {
      wrapper.classList.remove('hidden');
      $('#e_new_subcategory').focus();
    } else {
      wrapper.classList.add('hidden');
    }
  }
};

// Actualizar subcategorías basado en la categoría seleccionada
function updateSubcategories(category) {
  const subcategorySelect = $('#f_subcategory');
  if (!subcategorySelect || !category) return;
  const subcats = getKnownSubcategories(category);
  subcategorySelect.innerHTML = '<option value="">Subcategoría (opcional)</option>' +
    subcats.map(s => `<option value="${escapeHtml(s)}">${escapeHtml(s)}</option>`).join('') +
    '<option value="Nueva subcategoría...">+ Nueva subcategoría...</option>';
  
  const wrapper = $('#f_new_subcategory_wrapper');
  if (wrapper) wrapper.classList.add('hidden');
}

function updateSubcategoriesEdit(category) {
  const subcategorySelect = $('#e_subcategory');
  if (!subcategorySelect || !category) return;
  const subcats = getKnownSubcategories(category);
  subcategorySelect.innerHTML = '<option value="">Subcategoría (opcional)</option>' +
    subcats.map(s => `<option value="${escapeHtml(s)}">${escapeHtml(s)}</option>`).join('') +
    '<option value="Nueva subcategoría...">+ Nueva subcategoría...</option>';
  
  const wrapper = $('#e_new_subcategory_wrapper');
  if (wrapper) wrapper.classList.add('hidden');
};

window.handleEditCategoryChange = function() {
  const cat = $('#e_category').value;
  const sub = $('#e_subcategory');
  const newCat = $('#e_new_category');
  const newSub = $('#e_new_subcategory');
  
  if (cat === 'Nueva categoría...') {
    if(newCat) {
      newCat.classList.remove('hidden');
      newCat.focus();
    }
    if(sub) sub.innerHTML = '<option value="">Subcategoría (opcional)</option><option value="Nueva subcategoría...">+ Nueva subcategoría</option>';
  } else {
    if(newCat) newCat.classList.add('hidden');
    if(sub) {
      const subcats = getKnownSubcategories(cat);
      sub.innerHTML = '<option value="">Subcategoría (opcional)</option>' + 
                      subcats.map(s => `<option value="${escapeHtml(s)}">${escapeHtml(s)}</option>`).join('') + 
                      '<option value="Nueva subcategoría...">+ Nueva subcategoría</option>';
    }
  }
  if(newSub) newSub.classList.add('hidden');
};

window.handleEditSubcategoryChange = function() {
  const sub = $('#e_subcategory').value;
  const newSub = $('#e_new_subcategory');
  if (sub === 'Nueva subcategoría...') {
    if(newSub) {
      newSub.classList.remove('hidden');
      newSub.focus();
    }
  } else {
    if(newSub) newSub.classList.add('hidden');
  }
};

// Agregar event listeners después de renderizar
setTimeout(() => {
  const categorySelect = $('#f_category');
  if (categorySelect) {
    categorySelect.addEventListener('change', handleCategoryChange);
  }
}, 100);

// === Lightbox ===
function openLightbox(src) {
  $('#lightbox-img').src = src;
  $('#lightbox').classList.add('active');
}
$('#lightbox-close').onclick = () => { $('#lightbox').classList.remove('active'); };
$('#lightbox').onclick = (e) => { if (e.target.id === 'lightbox') $('#lightbox').classList.remove('active'); };

// === Product detail modal ===
function showProductModal(sku) {
  const p = getProducts().find(x => x.sku === sku);
  if (!p) return;
  const nav = document.getElementById('bottomNav');
  if (nav) nav.style.display = 'none';
  const price = getPrice(p);
  const path = getProductPath(p);
  const outOfStock = p.stock <= 0;
  const hasImg2 = !!(p.image2 && p.image2.trim());
  const img1 = p.image || '';
  const img2 = p.image2 || '';
  $('#modal-content').innerHTML = `
    <div class="flex gap-4 mb-4">
      <div class="modal-gallery">
        <div class="main-img ${img1 ? 'cursor-zoom-in' : ''}" id="modalMainImg" ${img1 ? `onclick="openLightbox('${escapeHtml(img1)}')"` : ''}>
          ${img1 ? `<img src="${escapeHtml(img1)}" alt="${escapeHtml(p.name)}" id="modalMainImgEl">` : imgEl('', p.name)}
        </div>
        ${hasImg2 ? `
        <div class="thumbs">
          <div class="thumb active" id="modalThumb1" onclick="switchModalImg(1,'${escapeHtml(img1)}','${escapeHtml(img2)}')"><img src="${escapeHtml(img1)}" alt="Foto 1"></div>
          <div class="thumb" id="modalThumb2" onclick="switchModalImg(2,'${escapeHtml(img1)}','${escapeHtml(img2)}')"><img src="${escapeHtml(img2)}" alt="Foto 2"></div>
        </div>` : ''}
      </div>
      <div class="flex-1">
        <h2 class="font-display font-bold text-lg text-blue-800 leading-tight mb-1">${escapeHtml(p.name)}</h2>
        <div class="text-xs text-blue-400 mb-2">SKU: ${escapeHtml(p.sku)}</div>
        <div class="flex items-baseline gap-1.5">
          <span class="text-2xl font-extrabold text-blue-700 price-chip">${formatPrice(price)}</span>
          <span class="text-[11px] text-blue-400 font-bold uppercase tracking-wide">/ unidad</span>
        </div>
        <div class="mt-1.5">
          ${outOfStock
            ? '<span class="inline-block text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-500">Sin stock</span>'
            : '<span class="inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">✓ Stock disponible</span>'}
        </div>
      </div>
    </div>
    ${path.length > 0 ? `<div class="text-sm text-blue-500 mb-3">${path.map(escapeHtml).join(' › ')}</div>` : ''}
    ${p.subcategory ? `<div class="text-xs text-blue-300 uppercase tracking-wide mb-3">${escapeHtml(p.subcategory)}</div>` : ''}
    <div class="text-sm text-blue-600 leading-relaxed mb-4">
      ${p.description ? escapeHtml(p.description) : 'Sin descripción disponible.'}
    </div>
    <!-- Live FOMO Urgency Strip -->
    <div class="rounded-2xl bg-amber-50/90 border border-amber-200/80 p-3 mb-4 flex items-center gap-2.5">
      <span class="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping flex-shrink-0"></span>
      <div class="text-xs text-amber-950 font-bold leading-snug">
        🔥 <strong>${Math.floor(Math.random() * 18) + 12} personas</strong> están viendo este producto ahora. <span class="text-amber-800 font-semibold block sm:inline">¡Reserva de stock activa!</span>
      </div>
    </div>
    ${outOfStock ? '' : `
    <div class="flex items-center justify-between bg-blue-50/70 rounded-2xl p-2.5 mb-3">
      <span class="text-sm font-bold text-blue-700 ml-2">Cantidad</span>
      <div class="flex items-center gap-3">
        <button class="qty-step" onclick="modalQtyChange('${escapeHtml(p.sku)}',-1)">−</button>
        <input id="modalQty" type="number" min="1" max="${p.stock}" value="1" oninput="modalQtyUpdate('${escapeHtml(p.sku)}')" class="w-12 text-center font-extrabold text-blue-800 text-lg bg-transparent focus:outline-none">
        <button class="qty-step" onclick="modalQtyChange('${escapeHtml(p.sku)}',1)">+</button>
      </div>
    </div>`}
    <button ${outOfStock ? 'disabled' : ''} onclick="modalAddToCart('${escapeHtml(p.sku)}')" class="w-full ${outOfStock ? 'bg-blue-100 text-blue-300 cursor-not-allowed' : 'btn-primary text-white active:scale-95'} font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2">
      ${outOfStock ? 'Sin stock' : `<span>Agregar</span><span id="modalSubtotal" class="opacity-90">· ${formatPrice(price)}</span>`}
    </button>
  `;
  $('#productModal').classList.remove('hidden');
}

function switchModalImg(idx, img1, img2) {
  const mainImg = document.getElementById('modalMainImg');
  const mainEl = document.getElementById('modalMainImgEl');
  if (!mainImg) return;
  const url = idx === 1 ? img1 : img2;
  if (mainEl) {
    mainEl.src = url;
  } else {
    mainImg.innerHTML = `<img src="${escapeHtml(url)}" alt="" id="modalMainImgEl">`;
  }
  mainImg.setAttribute('onclick', `openLightbox('${escapeHtml(url)}')`);
  const t1 = document.getElementById('modalThumb1');
  const t2 = document.getElementById('modalThumb2');
  if (t1) t1.classList.toggle('active', idx === 1);
  if (t2) t2.classList.toggle('active', idx === 2);
}

function _modalClampQty(sku) {
  const p = getProducts().find(x => x.sku === sku);
  const input = document.getElementById('modalQty');
  if (!p || !input) return 1;
  let q = parseInt(input.value) || 1;
  q = Math.max(1, Math.min(q, p.stock || 1));
  input.value = q;
  const sub = document.getElementById('modalSubtotal');
  if (sub) sub.textContent = '· ' + formatPrice(getPrice(p) * q);
  return q;
}
function modalQtyChange(sku, delta) {
  const input = document.getElementById('modalQty');
  if (input) input.value = (parseInt(input.value) || 1) + delta;
  _modalClampQty(sku);
}
function modalQtyUpdate(sku) { _modalClampQty(sku); }
function modalAddToCart(sku) {
  const q = _modalClampQty(sku);
  closeProductModal();
  addToCart(sku, q);
}
function closeProductModal() {
  $('#productModal').classList.add('hidden');
  const nav = document.getElementById('bottomNav');
  if (nav) nav.style.display = '';
}

// === Init ===
function renderSkeleton() {
  const card = `<div class="rounded-2xl bg-white card-shadow overflow-hidden">
    <div class="aspect-square skeleton"></div>
    <div class="p-3 space-y-2">
      <div class="h-3 rounded skeleton w-5/6"></div>
      <div class="h-3 rounded skeleton w-2/3"></div>
      <div class="h-5 rounded skeleton w-1/2 mt-3"></div>
    </div>
  </div>`;
  $('#app').innerHTML = `<div class="fade-in space-y-5">
    <div class="h-40 rounded-3xl skeleton"></div>
    <div class="grid grid-cols-3 gap-2">
      ${'<div class="h-16 rounded-2xl skeleton"></div>'.repeat(3)}
    </div>
    <div class="grid grid-cols-2 gap-3">${card.repeat(4)}</div>
  </div>`;
}

function resolveAppwriteImage(url, apiBase) {
  if (!url) return '';
  if (url.indexOf('http') === 0 && url.indexOf('donbalatoivan') >= 0) {
    return apiBase + '/api/image?url=' + encodeURIComponent(url);
  }
  return url;
}

async function fetchAppwriteProducts() {
  var apiBase = window.location.origin.indexOf('localhost') >= 0
    ? 'http://localhost:3000'
    : window.location.origin;
  // Fetch products and catalog (categories/subcategories) in parallel
  var [prodRes, catRes] = await Promise.all([
    fetch(apiBase + '/api/public-data/products?limit=1000', { cache: 'no-store' }),
    fetch(apiBase + '/api/public-data/catalog', { cache: 'no-store' })
  ]);
  var prodData = await prodRes.json();
  var raw = Array.isArray(prodData) ? prodData : (prodData.products || []);
  var catData = await catRes.json();
  // Build lookup maps: id -> name, and store category/subcategory data with images
  var catMap = {};
  var subMap = {};
  _appwriteCategories = [];
  _appwriteSubcategories = [];
  if (catData && Array.isArray(catData.categories)) {
    _appwriteCategories = catData.categories;
    catData.categories.forEach(function(c) {
      catMap[c.$id] = c.name || '';
    });
  }
  if (catData && Array.isArray(catData.subcategories)) {
    _appwriteSubcategories = catData.subcategories;
    catData.subcategories.forEach(function(s) {
      subMap[s.$id] = s.name || '';
    });
  }
  return raw.map(function(p) {
    var img = resolveAppwriteImage(p.IMAGEURL || p.image || '', apiBase);
    // Resolve SKU same way as web: SKU field > FEATURES > TAGS > jumpseller_id > $id
    var resolvedSku = p.SKU || '';
    if (!resolvedSku) {
      var feats = Array.isArray(p.FEATURES) ? p.FEATURES.join('\n') : (p.FEATURES || '');
      var m = feats.match(/SKU:\s*(.+)/i);
      if (m) resolvedSku = m[1].trim().split('\n')[0];
    }
    if (!resolvedSku && p.TAGS) {
      var tags = typeof p.TAGS === 'string' ? p.TAGS.split(',') : p.TAGS;
      for (var t = 0; t < tags.length; t++) {
        var tag = tags[t].trim();
        if (/^[A-Z0-9]{4,}$/i.test(tag)) { resolvedSku = tag; break; }
      }
    }
    if (!resolvedSku) resolvedSku = p.jumpseller_id || p.$id || '';
    return {
      id: p.$id || '',
      sku: resolvedSku,
      name: p.NAME || '',
      priceA: p.PRICE || 0,
      priceB: p.WHOLESALEPRICE || p.PRICE || 0,
      stock: (p.STOCK == null) ? 999 : p.STOCK,
      category: catMap[p.CATEGORYID] || p.category || 'Sin Categoria',
      image: img,
      CATEGORYID: p.CATEGORYID || '',
      subcategoryId: p.SUBCATEGORYID || '',
      subcategory: subMap[p.SUBCATEGORYID] || p.subcategory || '',
      BRAND: p.BRAND || '',
      DESCRIPTION: p.DESCRIPTION || '',
      PACKQTY: p.PACKQTY || null,
      _createdAt: p.$createdAt || 0
    };
  });
}

async function init() {
  renderSkeleton();
  try {
    allProducts = await fetchAppwriteProducts();
  } catch (e) {
    allProducts = [];
    console.error('No se pudieron cargar productos desde Appwrite', e);
  }
  await loadFirestoreData();
  
  // Migrate cart items: fill id and image from allProducts if missing
  var productsById = {};
  allProducts.forEach(function(p) { productsById[p.sku] = p; });
  cart.forEach(function(i) {
    if (!i.id || !i.image) {
      var p = productsById[i.sku];
      if (p) {
        if (!i.id) i.id = p.id || '';
        if (!i.image) i.image = p.image || '';
      }
    }
  });
  saveCart();

  const minPurchEl = document.getElementById('minPurchaseDisplay');
  if (minPurchEl) minPurchEl.textContent = `Compra mínima • $${getMinPurchase().toLocaleString('es-CL')}`;

  updateCartCount();

  const searchEl = $('#searchInput');
  if (searchEl) {
    searchEl.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      if (searchQuery && !location.hash.startsWith('#/search')) {
        renderSearch();
      } else if (!searchQuery) {
        render();
      } else {
        renderSearch();
      }
    });
    initSearchTypingAnimation(searchEl);
  }
  // Cart open
  $('#cartBtn').addEventListener('click', openCart);
  // WhatsApp send
  $('#whatsappBtn').addEventListener('click', sendWhatsApp);
  // Back button
  $('#backBtn').addEventListener('click', () => { history.back(); });

  // Keep the sticky filter bar pinned just under the header
  syncHeaderHeight();
  window.addEventListener('resize', syncHeaderHeight);

  // Mobile gestures
  setupPullToRefresh();
  makeDismissable(document.querySelector('#productModal .absolute.bottom-0'), closeProductModal);
  makeDismissable(document.querySelector('#sortSheet .sheet-panel'), closeSortSheet);
  makeDismissable(document.querySelector('#priceSheet .sheet-panel'), closePriceSheet);
  makeDismissable(document.querySelector('#customerFormModal .absolute.bottom-0'), closeCustomerFormModal);
  makeDismissable(document.querySelector('#orderConfirmModal .absolute.bottom-0'), closeOrderConfirmModal);

  render();
}

function syncHeaderHeight() {
  const h = document.querySelector('header');
  if (h) document.documentElement.style.setProperty('--hdr-h', h.offsetHeight + 'px');
}

// Re-fetch live data (products + Firestore overrides/stock/prices)
async function refreshData() {
  try {
    allProducts = await fetchAppwriteProducts();
  } catch (e) { /* keep current data on failure */ }
  await loadFirestoreData();
  updateCartCount();
  render();
}

// === Search Input Typing Animation (Cycling Placeholder) ===
var _searchTypingTimeout = null;
var _searchTypingRunning = false;

function initSearchTypingAnimation(input) {
  if (!input) return;
  // Reset siempre para que funcione tras re-render o navegación
  _searchTypingRunning = false;
  if (_searchTypingTimeout) { clearTimeout(_searchTypingTimeout); _searchTypingTimeout = null; }
  _searchTypingRunning = true;

  var phrases = [
    'Buscar producto...',
    'Funda para mesa...',
    'Lámpara LED...',
    'Aseo y limpieza...',
    'Juguetes para niños...',
    'Cocina y hogar...',
    'Parlantes Bluetooth...',
    'Toallas y baño...',
    'Artículos de mascota...',
    'Electrónica y celulares...',
  ];

  var phraseIdx = 0;
  var charIdx = 0;
  var deleting = false;
  var pauseFrames = 0;

  function tick() {
    if (document.activeElement === input) {
      // Pause animation while user is typing
      _searchTypingTimeout = setTimeout(tick, 300);
      return;
    }

    var phrase = phrases[phraseIdx];

    if (pauseFrames > 0) {
      pauseFrames--;
      _searchTypingTimeout = setTimeout(tick, 80);
      return;
    }

    if (!deleting) {
      charIdx++;
      input.placeholder = phrase.slice(0, charIdx);
      if (charIdx === phrase.length) {
        deleting = true;
        pauseFrames = 20; // pause at full phrase
      }
      _searchTypingTimeout = setTimeout(tick, 65);
    } else {
      charIdx--;
      input.placeholder = phrase.slice(0, charIdx);
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        pauseFrames = 5;
      }
      _searchTypingTimeout = setTimeout(tick, 35);
    }
  }

  // Start after 1s delay
  _searchTypingTimeout = setTimeout(tick, 1000);
}

function anySheetOpen() {
  const open = ['productModal', 'sortSheet', 'priceSheet', 'customerFormModal', 'orderConfirmModal', 'cartDrawer']
    .some(id => { const el = document.getElementById(id); return el && !el.classList.contains('hidden'); });
  const lb = document.getElementById('lightbox');
  return open || (lb && lb.classList.contains('active'));
}

// Pull down at the top of the page to refresh
function setupPullToRefresh() {
  const ptr = document.getElementById('ptr');
  if (!ptr) return;
  const THRESH = 70;
  let startY = 0, pulling = false, dist = 0, busy = false;
  window.addEventListener('touchstart', e => {
    if (busy || window.scrollY > 0 || anySheetOpen()) { pulling = false; return; }
    startY = e.touches[0].clientY; pulling = true; dist = 0;
  }, { passive: true });
  window.addEventListener('touchmove', e => {
    if (!pulling || busy) return;
    dist = e.touches[0].clientY - startY;
    if (dist > 0 && window.scrollY <= 0) {
      const d = Math.min(dist * 0.5, 90);
      ptr.style.transition = 'none';
      ptr.style.transform = `translateY(${d - 8}px)`;
      ptr.style.opacity = Math.min(1, d / THRESH);
      ptr.classList.toggle('ready', d >= THRESH);
    } else { pulling = false; ptr.style.transition = ''; ptr.style.transform = ''; ptr.style.opacity = ''; }
  }, { passive: true });
  window.addEventListener('touchend', async () => {
    if (!pulling || busy) return;
    pulling = false;
    ptr.style.transition = '';
    const go = ptr.classList.contains('ready');
    ptr.classList.remove('ready');
    if (go) {
      busy = true;
      ptr.classList.add('spinning');
      ptr.style.transform = 'translateY(52px)'; ptr.style.opacity = '1';
      await refreshData();
      showToast('Catálogo actualizado');
      ptr.classList.remove('spinning');
      busy = false;
    }
    ptr.style.transform = ''; ptr.style.opacity = '';
  });
}

// Swipe a bottom sheet / modal downward to dismiss it
function makeDismissable(panel, closeFn) {
  if (!panel) return;
  let sy = 0, dragging = false, dy = 0;
  panel.addEventListener('touchstart', e => {
    if (e.target.closest('input,button,select,a,textarea')) return; // don't hijack controls
    const rect = panel.getBoundingClientRect();
    if (e.touches[0].clientY - rect.top > 80) return;  // only the top handle zone
    if ((panel.scrollTop || 0) > 0) return;            // let scrollable content scroll
    sy = e.touches[0].clientY; dragging = true; dy = 0;
    panel.style.transition = 'none';
  }, { passive: true });
  panel.addEventListener('touchmove', e => {
    if (!dragging) return;
    dy = e.touches[0].clientY - sy;
    if (dy > 0) panel.style.transform = `translateY(${dy}px)`;
  }, { passive: true });
  panel.addEventListener('touchend', () => {
    if (!dragging) return;
    dragging = false;
    panel.style.transition = '';
    panel.style.transform = '';
    if (dy > 100) closeFn();
  });
}

init();
initLiveUsersCounter();
initFomoSalesEngine();

// Expose for inline handlers
window.addToCart = addToCart;
window.changeQty = changeQty;
window.setQty = setQty;
window.removeFromCart = removeFromCart;
window.closeCart = closeCart;
window.checkAdmin = checkAdmin;
window.addCustomProduct = addCustomProduct;
window.adminLogout = adminLogout;
window.renderAdmin = renderAdmin;
window.renderAdminProductList = renderAdminProductList;
window.saveProductEdit = saveProductEdit;
window.resetProductEdit = resetProductEdit;
window.deleteProductFull = deleteProductFull;
window.restoreAllDeleted = restoreAllDeleted;
window.uploadImage = uploadImage;
window.uploadImageBox = uploadImageBox;
window.clearImgBox = clearImgBox;
window.switchModalImg = switchModalImg;
window.updateImgPreview = updateImgPreview;
window.exportAdminData = exportAdminData;
window.exportCatalogExcel = exportCatalogExcel;
window.importAdminData = importAdminData;
window.openLightbox = openLightbox;
window.showProductModal = showProductModal;
window.closeProductModal = closeProductModal;
window.markOrderPaid = markOrderPaid;
window.unmarkOrderPaid = unmarkOrderPaid;
window.deleteOrder = deleteOrder;
window.quickDeleteProduct = quickDeleteProduct;
window.openSortSheet = openSortSheet;
window.closeSortSheet = closeSortSheet;
window.pickSort = pickSort;
window.toggleCatInStock = toggleCatInStock;
window.clearAllFilters = clearAllFilters;
window.openPriceSheet = openPriceSheet;
window.closePriceSheet = closePriceSheet;
window.onPriceInput = onPriceInput;
window.applyPrice = applyPrice;
window.applyPreset = applyPreset;
window.clearPrice = clearPrice;
window.uploadLogo = uploadLogo;
window.updateLogoPreview = updateLogoPreview;
window.saveLogo = saveLogo;
window.removeLogo = removeLogo;
window.modalQtyChange = modalQtyChange;
window.modalQtyUpdate = modalQtyUpdate;
window.modalAddToCart = modalAddToCart;
window.flyToCart = flyToCart;
window.selectAttendant = selectAttendant;

// Script cleanup complete
