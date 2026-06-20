export interface Product {
  $id: string;
  NAME: string;
  DESCRIPTION: string;
  PRICE: number;
  CURRENTPRICE?: number;
  CATEGORYID: string;
  SUBCATEGORYID?: string;
  SUBSUBCATEGORYID?: string; // Nivel 3
  SELLERID: string;
  STOCK: number;
  IMAGEURL: string;
  IMAGEURL2?: string;
  IMAGEURL3?: string;
  IMAGEURL4?: string;
  IMAGEURL5?: string;
  RATING?: number;
  NUMREVIEWS?: number;
  WHOLESALEPRICE?: number;
  WHOLESALEMINQUANTITY?: number;
  PACKQTY?: number;
  PACK_MIN_PACKS?: number;
  PACK_DISCOUNT_PCT?: number;
  PACK_OFFER_PRICE?: number;
  PACK_OFFER_EXPIRES_AT?: number;
  PACK_OFFER_MIN_PACKS?: number;
  UNIT_OFFER_EXPIRES_AT?: number;
  PACK_STOCK?: number;
  TAGS?: string[];
  FEATURES?: string[];
  SOLDQUANTITY?: number;
  ISACTIVE?: boolean;
  SKU?: string;
  GROUPID?: string;
  COMING_SOON?: boolean;
  DATE_ADDED?: string;
  section?: number;
  $createdAt?: string;
  $updatedAt?: string;
}

export interface Review {
  $id: string;
  PRODUCTID: string;
  USERID: string;
  USERNAME: string;
  USERPROFILEIMAGEURL?: string;
  RATING: number;
  COMMENT: string;
  CREATEDAT: number;
  REVIEWDATE: number;
  ISEDITED?: boolean;
}

export interface Category {
  $id: string;
  name: string;
  iconUrl?: string;
  order?: number;
}

export interface Subcategory {
  $id: string;
  name: string;
  categoryId: string;
  parentSubcategoryId?: string; // Nivel 3 (si está definido, es hija de otra subcategoría)
  order?: number;
  ICON_URL?: string;
  BACKGROUND_IMAGE_URL?: string;
  ZOOM_BACKGROUND_IMAGE_URL?: string;
  iconName?: string;
  ORDER?: number;
  COLOR?: string;
  description?: string;
}

export interface Banner {
  $id: string;
  TITLE?: string;
  DESCRIPTION?: string;
  IMAGEURL: string;
  LINKURL?: string;
  DURATION?: number;
  ISACTIVE?: boolean;
  DISPLAYORDER?: number;
  CLICKS?: number;
  VIEWS?: number;
}

export interface TimedOffer {
  $id: string;
  title: string;
  offerType: 'product' | 'category' | 'subcategory' | 'destacado_temporal';
  targetId: string;
  productName: string;
  originalPrice: number;
  discountPrice: number;
  discountPercentage: number;
  customImagePath: string;
  timeType: 'duration' | 'endDateTime';
  durationHours?: number;
  endDateTime?: string;
  status: 'draft' | 'scheduled' | 'active' | 'paused' | 'completed';
  activatedAt?: string;
  isActive: boolean;
  $createdAt: string;
  $updatedAt: string;
}

export interface Coupon {
  $id: string;
  code: string;
  type: 'percentage' | 'percent' | 'fixed';
  value: number;
  isActive: boolean;
  maxUses?: number;
  usedCount?: number;
  minOrderAmount?: number;
  maxDiscount?: number;
  expiresAt?: number;
  description?: string;
}

export type OrderStatus = 'pending' | 'processing' | 'paid' | 'assembling' | 'negotiation' | 'preparing_shipping' | 'ready_to_ship' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  qty: number;
  img: string;
  total: number;
  wp?: number;
  wmq?: number;
  timedOfferPrice?: number;
  timedOfferExpiresAt?: string;
  sku?: string;
  missing?: boolean;
  replaced?: boolean;
  originalItem?: {
    id: string;
    name: string;
    price: number;
    img: string;
    sku: string;
  };
}

export interface Order {
  $id: string;
  USERID: string;
  ITEMS: string;
  SHIPPINGADDRESS: string;
  CUSTOMERNAME: string;
  CUSTOMERRUT: string;
  CUSTOMERPHONE: string;
  CUSTOMEREMAIL: string;
  REGION: string;
  COMUNA: string;
  ADDRESS: string;
  ADDITIONALINFO?: string;
  PAYMENTMETHOD: string;
  SHIPPINGAGENCY: string;
  SUBTOTAL: number;
  SHIPPINGCOST: number;
  TOTAL: number;
  ORDERCODE: string;
  ORDERINDEX: number;
  STATUS: OrderStatus;
  CREATEDAT: number;
  UPDATEDAT?: number;
  EXPIRESAT?: number;
  AUTOCANCELENABLED?: boolean;
  PAYMENTPROOFURL?: string;
  SHIPPINGPROOFURL?: string;
  ORDERTYPE?: string;
  EXTENSIONCOUNT?: number;
  DISCOUNT?: number;
  COUPONCODE?: string;
  AGENCYCHANGED?: boolean;
  /**
   * Cantidad de cambios hechos por el cliente (edición/cancelación) en /pedido/[id].
   * Se usa para limitar a máximo 2 cambios.
   */
  CUSTOMEREDITCOUNT?: number;
}

export interface Raffle {
  $id: string;
  TITLE: string;
  DESCRIPTION?: string;
  PRIZE: string;
  PRIZEIMAGEURL?: string;
  LIVESTREAMID?: string;
  STATUS: 'upcoming' | 'active' | 'drawing' | 'completed';
  PARTICIPANTS: string[];
  WINNERID?: string;
  WINNERNAME?: string;
  MAXPARTICIPANTS?: number;
  STARTSAT?: number;
  ENDSAT?: number;
  CREATEDAT: number;
}

export interface Clip {
  $id: string;
  TITLE: string;
  DESCRIPTION?: string;
  VIDEOURL: string;
  THUMBNAILURL?: string;
  PRODUCTID?: string;
  PRODUCTNAME?: string;
  PRODUCTPRICE?: number;
  PRODUCTIMAGEURL?: string;
  USERID?: string;
  USERNAME?: string;
  LIKES?: number;
  VIEWS?: number;
  ISACTIVE?: boolean;
  CREATEDAT: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  timedOfferPrice?: number;
  timedOfferExpiresAt?: number;
  wholesalePrice?: number;
  isPack?: boolean;
}

export interface LiveStream {
  $id: string;
  $createdAt: string;
  title: string;
  description?: string;
  url: string;
  platform: 'youtube' | 'facebook' | 'instagram' | 'tiktok' | 'twitch' | string;
  status: 'scheduled' | 'live' | 'ended' | 'cancelled' | 'error';
  isActive: boolean;
  thumbnailUrl?: string;
  bannerUrl?: string;
  viewerCount?: number;
  // Scheduling
  scheduledAt?: string;
  startAt?: string;
  endAt?: string;
  // Player config
  autoplay?: boolean;
  muted?: boolean;
  showText?: boolean;
  allowFullscreen?: boolean;
  // Live Shopping
  productIds?: string[];
  pinnedProductId?: string;
  isRotationEnabled?: boolean;
  rotationInterval?: number;
  defaultDiscount?: number;
  // Error tracking
  errorMessage?: string;
  createdBy?: string;
}

export interface HotspotPanel {
  $id: string;
  IMAGEURL: string;
  TITLE?: string;
  LINKURL?: string;
  MOSAICGROUP: string;
  CELLINDEX: number;
  ISACTIVE: boolean;
  DISPLAYORDER: number;
}

export interface BannerOverlayPosition {
  $id: string;
  BANNERID: string;
  PRODUCTID: string;
  POSITIONX: number;
  POSITIONY: number;
  SCALE: number;
  CIRCLESCALE: number;
  DISPLAYTYPE: 'default' | 'custom_image' | 'circle_only';
  CUSTOMIMAGEURL?: string;
  CIRCLECOLOR?: string;
  ISACTIVE: boolean;
  DISPLAYORDER: number;
  CLICKS: number;
}

export interface HouseProductPosition {
  $id: string;
  PRODUCTID: string;
  CATEGORYID: string;
  POSITIONX: number;
  POSITIONY: number;
  ISACTIVE: boolean;
  DISPLAYORDER: number;
  SCALE: number;
  CIRCLESCALE: number;
  CUSTOMIMAGEURL?: string;
  DISPLAYTYPE: 'default' | 'custom_image' | 'circle_only';
  CIRCLECOLOR?: string;
  BACKGROUND: string;
}

export interface ProductVote {
  $id: string;
  PRODUCTTITLE: string;
  USERID?: string;
  USERNAME?: string;
  USEREMAIL?: string;
  CREATEDAT: number;
  IPADDRESS?: string;
}

export const CHILE_REGIONES: Record<string, string[]> = {
  'Arica y Parinacota': ['Arica', 'Camarones', 'Putre', 'General Lagos'],
  'Tarapacá': ['Iquique', 'Alto Hospicio', 'Pozo Almonte', 'Camiña', 'Colchane', 'Huara', 'Pica'],
  'Antofagasta': ['Antofagasta', 'Mejillones', 'Sierra Gorda', 'Taltal', 'Calama', 'Ollagüe', 'San Pedro de Atacama', 'Tocopilla', 'María Elena'],
  'Atacama': ['Copiapó', 'Caldera', 'Tierra Amarilla', 'Chañaral', 'Diego de Almagro', 'Vallenar', 'Alto del Carmen', 'Freirina', 'Huasco'],
  'Coquimbo': ['La Serena', 'Coquimbo', 'Andacollo', 'La Higuera', 'Paiguano', 'Vicuña', 'Illapel', 'Canela', 'Los Vilos', 'Salamanca', 'Ovalle', 'Combarbalá', 'Monte Patria', 'Punitaqui', 'Río Hurtado'],
  'Valparaíso': ['Valparaíso', 'Casablanca', 'Concón', 'Juan Fernández', 'Puchuncaví', 'Quintero', 'Viña del Mar', 'Los Andes', 'Quillota', 'Calera', 'San Antonio', 'Algarrobo', 'Cartagena', 'San Felipe', 'Quilpué', 'Limache', 'Villa Alemana'],
  'Metropolitana de Santiago': ['Santiago', 'Cerrillos', 'Cerro Navia', 'Conchalí', 'El Bosque', 'Estación Central', 'Huechuraba', 'Independencia', 'La Cisterna', 'La Florida', 'La Granja', 'La Pintana', 'La Reina', 'Las Condes', 'Lo Barnechea', 'Lo Espejo', 'Macul', 'Maipú', 'Ñuñoa', 'Peñalolén', 'Providencia', 'Pudahuel', 'Quilicura', 'Recoleta', 'Renca', 'San Joaquín', 'San Miguel', 'Vitacura', 'Puente Alto', 'Colina', 'San Bernardo', 'Buin', 'Melipilla', 'Talagante'],
  'Libertador Gral. B. O\'Higgins': ['Rancagua', 'Codegua', 'Coinco', 'Coltauco', 'Doñihue', 'Graneros', 'Las Cabras', 'Machalí', 'Malloa', 'Mostazal', 'Rengo', 'San Vicente', 'Pichilemu', 'San Fernando', 'Santa Cruz'],
  'Maule': ['Talca', 'Constitución', 'Curepto', 'Empedrado', 'Maule', 'San Clemente', 'Cauquenes', 'Curicó', 'Molina', 'Linares', 'Parral', 'San Javier'],
  'Ñuble': ['Chillán', 'Bulnes', 'Coelemu', 'Coihueco', 'Chillán Viejo', 'El Carmen', 'Pemuco', 'Pinto', 'San Carlos', 'Yungay'],
  'Biobío': ['Concepción', 'Coronel', 'Chiguayante', 'Florida', 'Lota', 'Penco', 'San Pedro de la Paz', 'Talcahuano', 'Tomé', 'Hualpén', 'Los Ángeles', 'Mulchén', 'Nacimiento', 'Yumbel'],
  'La Araucanía': ['Temuco', 'Carahue', 'Freire', 'Galvarino', 'Gorbea', 'Lautaro', 'Loncoche', 'Nueva Imperial', 'Padre las Casas', 'Pitrufquén', 'Pucón', 'Villarrica', 'Angol', 'Victoria'],
  'Los Ríos': ['Valdivia', 'Corral', 'Lanco', 'Los Lagos', 'Máfil', 'Mariquina', 'Paillaco', 'Panguipulli', 'La Unión', 'Río Bueno'],
  'Los Lagos': ['Puerto Montt', 'Calbuco', 'Fresia', 'Frutillar', 'Los Muermos', 'Llanquihue', 'Maullín', 'Puerto Varas', 'Castro', 'Ancud', 'Chonchi', 'Dalcahue', 'Quellón', 'Osorno', 'Purranque', 'Puyehue', 'Río Negro'],
  'Aysén': ['Coihaique', 'Lago Verde', 'Aysén', 'Cisnes', 'Cochrane', 'Tortel', 'Chile Chico', 'Río Ibáñez'],
  'Magallanes': ['Punta Arenas', 'Laguna Blanca', 'Río Verde', 'San Gregorio', 'Porvenir', 'Natales', 'Torres del Paine'],
};

export const SHIPPING_AGENCIES = [
  'Chilexpress',
  'Starken',
  'Correos de Chile',
  'Blue Express',
  'DHL',
  'Despacho a domicilio directo',
];
