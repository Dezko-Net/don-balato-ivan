// Marcas conocidas de la tienda. Muchos productos no tienen el atributo BRAND
// poblado en Appwrite, asÃ­ que se infiere desde el nombre como fallback.
// Compartido entre cliente (ProductosInner, plantillas) y servidor (route de products).
export const extractBrand = (name?: string): string => {
  if (!name) return '';
  const n = name.toLowerCase();
  if (n.includes('sadoer')) return 'SADOER';
  if (n.includes('kevin&coco') || n.includes('Don Balato Iván') || n.includes('kevincoco') || n.includes('Don Balato Iván')) return 'Don Balato Iván';
  if (n.includes('3q') || n.includes('3 q')) return '3Q Beauty';
  if (n.includes('billion') || n.includes('billion beauty')) return 'Billion Beauty';
  if (n.includes('karite') || n.includes('karitÃ©')) return 'Karite';
  if (n.includes('kiss beauty')) return 'Kiss Beauty';
  if (n.includes('ushas')) return 'Ushas';
  if (n.includes('ruby rose')) return 'Ruby Rose';
  if (n.includes('pink 21') || n.includes('pink21')) return 'Pink 21';
  if (n.includes('hengfang')) return 'HengFang';
  if (n.includes('peiliee')) return 'Peiliee';
  if (n.includes('huda')) return 'Huda Beauty';
  return '';
};

// Marca de la casa: la tienda ES Don Balato IvÃ¡n
export const HOUSE_BRAND = 'Don Balato IvÃ¡n';

export const productMatchesBrand = (
  p: { BRAND?: string; NAME?: string },
  brand: string
): boolean => {
  const b = ((p.BRAND || extractBrand(p.NAME)) || '').toLowerCase().trim();
  const target = brand.toLowerCase().trim();
  if (b) return b === target;
  return target === HOUSE_BRAND.toLowerCase();
};

