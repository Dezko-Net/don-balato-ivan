const ENDPOINT = 'https://nyc.cloud.appwrite.io/v1';
const PROJECT_ID = '6a0a4e8d0032177f3f90';
const DATABASE_ID = '6a0a58ca001798410d86';
const API_KEY = 'standard_de757dd8d6cd1808ddc9a0b6694cad9a4e4ceb904a97613e4bc255cb116c0b1272ee9d865149911bab66ecb0e078d3120fbf9bd5c82cba8bc0d2ea6354cb3d24aa96e77f53d86fbf3a68a007abb0af608ee4854491b3e2b29b0d6e2fe63f907d592e8000c16c38f408e3bd1de65505897c249ecac5ecfb1e1a6de5c9b40aa655';

async function main() {
  const headers = {
    'X-Appwrite-Project': PROJECT_ID,
    'X-Appwrite-Key': API_KEY,
  };

  // Get current settings
  const r = await fetch(`${ENDPOINT}/databases/${DATABASE_ID}/collections/apertura_settings/documents?limit=1`, { headers });
  const d = await r.json();
  
  if (d.documents && d.documents.length > 0) {
    const doc = d.documents[0];
    console.log('Current settings:', JSON.stringify({ id: doc.$id, isActive: doc.isActive, discountPercent: doc.discountPercent, minPurchase: doc.minPurchase }));

    // Update to 10% active, minPurchase 0
    const body = new URLSearchParams();
    body.set('isActive', 'true');
    body.set('discountPercent', '10');
    body.set('minPurchase', '0');
    const u = await fetch(`${ENDPOINT}/databases/${DATABASE_ID}/collections/apertura_settings/documents/${doc.$id}`, {
      method: 'PATCH',
      headers: { ...headers, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });
    const ud = await u.json();
    console.log('Updated:', JSON.stringify({ isActive: ud.isActive, discountPercent: ud.discountPercent, minPurchase: ud.minPurchase }));
  } else {
    console.log('No apertura_settings document found. Creating one...');
    const c = await fetch(`${ENDPOINT}/databases/${DATABASE_ID}/collections/apertura_settings/documents`, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: true, discountPercent: 10, minPurchase: 0 }),
    });
    const cd = await c.json();
    console.log('Created:', JSON.stringify({ isActive: cd.isActive, discountPercent: cd.discountPercent, minPurchase: cd.minPurchase }));
  }
}

main().catch(console.error);
