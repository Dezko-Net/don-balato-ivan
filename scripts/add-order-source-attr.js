// Add vendor order metadata attributes to Appwrite
const apiKey = process.env.APPWRITE_API_KEY;
const endpoint = 'https://nyc.cloud.appwrite.io/v1';
const projectId = 'donbalatoivan';
const dbId = '6a62e7440033d2278d28';

const attributes = [
  { collection: 'vendor_orders', key: 'ORDER_SOURCE', size: 20, default: 'web' },
  { collection: 'vendors', key: 'ORDER_PREFIX', size: 12, default: '' },
  { collection: 'vendors', key: 'VISIBLE_AGENCIES', size: 4000, default: '' },
];

(async () => {
  for (const attr of attributes) {
    try {
      const res = await fetch(`${endpoint}/databases/${dbId}/collections/${attr.collection}/attributes/string`, {
        method: 'POST',
        headers: {
          'X-Appwrite-Project': projectId,
          'X-Appwrite-Key': apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ key: attr.key, size: attr.size, required: false, default: attr.default })
      });
      console.log(`${attr.collection}.${attr.key}:`, JSON.stringify(await res.json()));
    } catch (e) {
      console.error(`${attr.collection}.${attr.key}:`, e.message);
    }
  }
})();
