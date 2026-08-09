const { Client, Storage, Permission, Role } = require('node-appwrite');

const key = process.env.APPWRITE_API_KEY;
if (!key) {
  throw new Error('Define APPWRITE_API_KEY antes de ejecutar este script');
}

const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1')
  .setProject(process.env.APPWRITE_PROJECT_ID || 'donbalatoivan')
  .setKey(key);

const storage = new Storage(client);
const bucketId = 'order_box_photos';
const bucketConfig = {
  bucketId,
  name: 'Fotos de bultos',
  permissions: [Permission.read(Role.any())],
  fileSecurity: false,
  enabled: true,
  maximumFileSize: 15 * 1024 * 1024,
  allowedFileExtensions: ['jpg', 'jpeg', 'png', 'webp', 'heic'],
  encryption: true,
  antivirus: true,
  transformations: true,
};

(async () => {
  try {
    await storage.getBucket({ bucketId });
    const bucket = await storage.updateBucket(bucketConfig);
    console.log(`Bucket actualizado: ${bucket.$id}`);
  } catch (error) {
    if (error?.code !== 404) throw error;
    const bucket = await storage.createBucket(bucketConfig);
    console.log(`Bucket creado: ${bucket.$id}`);
  }
})();
