const { Client, Storage } = require('node-appwrite');

const c = new Client()
  .setEndpoint('https://nyc.cloud.appwrite.io/v1')
  .setProject('donbalatoivan')
  .setKey('standard_36d66a586c5975803e1bb17c5bcd8bb4146a1ee594b31be56fd22a537043adf5cbae612072df4f25873e3d388c4f6dc494beb6a8a56fbfd0c5d878552a622a35762e78dae181636818840ba3eeb07227efbc0b2a1d08893e740e7f56941b427b81f6c675fdd90ca5fe896cd46aeb7e5027736fe5fb40c480ea2f8363ca89740a');

const s = new Storage(c);

(async () => {
  // Verificar si el bucket ya existe
  try {
    const b = await s.getBucket('order_box_photos');
    console.log('Bucket ya existe:', JSON.stringify(b, null, 2));
  } catch (e) {
    console.log('Bucket no existe, creando...');
    try {
      const nb = await s.createBucket(
        'order_box_photos',
        'Fotos de bultos de pedidos',
        null, // sin permissions (público lectura/escritura via API key)
        ['create', 'read', 'update', 'delete'],
        10000000, // 10MB max
        false, // encrypted
        false, // antivirus
        3000000 // 3MB max file size
      );
      console.log('Bucket creado:', JSON.stringify(nb, null, 2));
    } catch (e2) {
      console.log('Error creando bucket:', e2.message);
    }
  }
})();
