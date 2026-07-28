import { NextRequest, NextResponse } from 'next/server';
import { getServices, getAppwriteConfig, PRODUCTS_COLLECTION, ID } from '@/lib/appwrite';

export async function POST(request: NextRequest) {
  try {
    const { databases } = getServices();
    const { databaseId } = getAppwriteConfig();

    // Datos del Mega Pack Favoritos
    const megaPackData = {
      NAME: 'Mega Pack Favoritos (10 Productos Â· 15 Unidades)',
      DESCRIPTION: 'Pack especial con 10 productos favoritos de Don Balato Iván. Incluye base de maquillaje, iluminadores, polvo suelto, paleta de rubores, corrector, paleta de sombras, toallitas, brocha, brillos labiales y delineador. Total 15 unidades. Â¡El mejor precio!',
      PRICE: 15990,
      STOCK: 50,
      COST: 8000,
      CURRENTPRICE: null,
      WHOLESALEPRICE: 0,
      WHOLESALEMINQUANTITY: 0,
      PACKQTY: 0,
      IMAGEURL: 'https://storage.googleapis.com/asistoraerp.firebasestorage.app/IADESIGN/2026/07/1783012128460-pegada-1783012124985.png',
      IMAGEURL2: '',
      IMAGEURL3: '',
      CATEGORYID: '',
      SUBCATEGORYID: '',
      SUBSUBCATEGORYID: '',
      FEATURES: 'DisableDiscounts: true\nBundlePack: true\nBundleProducts: 10\nBundleUnits: 15',
      TAGS: ['mega-pack', 'favoritos', 'bundle'],
      sku: 'MEGA-PACK-FAV-10',
    };

    const result = await databases.createDocument(
      databaseId,
      PRODUCTS_COLLECTION,
      ID.unique(),
      megaPackData
    );

    return NextResponse.json({
      success: true,
      product: result,
      message: 'Mega Pack Favoritos creado exitosamente'
    });
  } catch (error: any) {
    console.error('Error creando Mega Pack:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Error al crear el producto'
    }, { status: 500 });
  }
}

