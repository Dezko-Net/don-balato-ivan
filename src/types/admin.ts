export type OrderStatus = 'pending' | 'processing' | 'paid' | 'assembling' | 'confirming_stock' | 'stock_confirmed' | 'packing' | 'negotiation' | 'preparing_shipping' | 'ready_to_ship' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  imageUrl?: string;
}

export interface Order {
  $id: string;
  USERID: string;
  ORDERCODE: string;
  CUSTOMERNAME: string;
  CUSTOMEREMAIL?: string;
  CUSTOMERRUT?: string;
  CUSTOMERPHONE?: string;
  REGION?: string;
  COMUNA?: string;
  ADDRESS?: string;
  ADDITIONALINFO?: string;
  ADDRESSPHOTOURL?: string;
  PAYMENTMETHOD?: string;
  SHIPPINGAGENCY?: string;
  SHIPPINGADDRESS?: string;
  SUBTOTAL: number;
  SHIPPINGCOST: number;
  TOTAL: number;
  STATUS: OrderStatus;
  ITEMS: string;
  CREATEDAT: number;
  UPDATEDAT?: number;
  EXPIRESAT?: number;
  PAYMENTPROOFURL?: string;
  SHIPPINGPROOFURL?: string;
  ORDERTYPE?: string;
  PURCHASEDFROMLIVE?: boolean;
  COUPONCODE?: string;
  DISCOUNTAMOUNT?: number;
  AGENCYCHANGED?: boolean;
  TRACKINGNUMBER?: string;
  BOXPHOTOS?: string; // JSON array de URLs de fotos de las cajas antes de despachar
  adminNotes?: string;
  $createdAt: string;
  $updatedAt: string;
}

export interface Product {
  $id: string;
  NAME: string;
  DESCRIPTION?: string;
  PRICE: number;
  CURRENTPRICE?: number;
  COST?: number;
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
  STOCK: number;
  CATEGORYID?: string;
  SUBCATEGORYID?: string;
  SUBSUBCATEGORYID?: string;
  SELLERID?: string;
  IMAGEURL?: string;
  IMAGEURL2?: string;
  IMAGEURL3?: string;
  IMAGEURL4?: string;
  IMAGEURL5?: string;
  VIDEOURL?: string;
  PRODUCT_VIDEO_URL?: string;
  RATING?: number;
  NUMREVIEWS?: number;
  SOLDQUANTITY?: number;
  TAGS?: string;
  FEATURES?: string;
  ISFEATURED?: boolean;
  ISACTIVE?: boolean;
  GROUPID?: string;
  RESTOCKTHRESHOLD?: number;
  CUSTOM_PRIMARY_COLOR?: string;
  CUSTOM_SECONDARY_COLOR?: string;
  CUSTOM_USE_GRADIENT?: boolean;
  CUSTOM_COVER_URL?: string;
  jumpseller_id?: string;
  barcode?: string;
  sku?: string;
  COMING_SOON?: boolean;
  DATE_ADDED?: string;
  section?: number;
  $createdAt: string;
  $updatedAt: string;
}

export interface Category {
  $id: string;
  name: string;
  iconUrl?: string;
  order?: number;
  color?: string;
  BACKGROUND_IMAGE_URL?: string;
  $createdAt: string;
  $updatedAt: string;
}

export interface Subcategory {
  $id: string;
  name: string;
  categoryId: string;
  parentSubcategoryId?: string;
  order?: number;
  ICON_URL?: string;
  BACKGROUND_IMAGE_URL?: string;
  ZOOM_BACKGROUND_IMAGE_URL?: string;
  COLOR?: string;
  description?: string;
  ORDER?: number;
  $createdAt: string;
  $updatedAt: string;
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
  $createdAt: string;
  $updatedAt: string;
}

export interface AdminNotification {
  $id: string;
  title: string;
  message: string;
  type?: string;
  userId?: string;
  isRead?: boolean;
  $createdAt: string;
  $updatedAt: string;
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
  createdAt?: string;
  updatedAt?: string;
  $createdAt: string;
  $updatedAt: string;
}

export interface SupportTicket {
  $id: string;
  userId: string;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'closed';
  priority?: 'low' | 'medium' | 'high';
  adminNotes?: string;
  $createdAt: string;
  $updatedAt: string;
}

export interface StockMovement {
  $id: string;
  productId: string;
  productName?: string;
  type: 'in' | 'out' | 'adjustment';
  quantity: number;
  reason?: string;
  $createdAt: string;
}

export interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  lowStockCount: number;
  todayOrders: number;
  avgTicket: number;
  avgDailyRevenue: number;
}
