const ENDPOINT = 'https://nyc.cloud.appwrite.io/v1';
const PROJECT_ID = '6a0a4e8d0032177f3f90';
const DATABASE_ID = '6a0a58ca001798410d86';
const API_KEY = 'standard_de757dd8d6cd1808ddc9a0b6694cad9a4e4ceb904a97613e4bc255cb116c0b1272ee9d865149911bab66ecb0e078d3120fbf9bd5c82cba8bc0d2ea6354cb3d24aa96e77f53d86fbf3a68a007abb0af608ee4854491b3e2b29b0d6e2fe63f907d592e8000c16c38f408e3bd1de65505897c249ecac5ecfb1e1a6de5c9b40aa655';
const COLLECTION = 'products';

async function main() {
  let cursor = null;
  const limit = 25;
  let total = 0;
  let updated = 0;
  let skipped = 0;

  while (true) {
    let url = `${ENDPOINT}/databases/${DATABASE_ID}/collections/${COLLECTION}/documents?limit=${limit}`;
    if (cursor) url += `&cursorAfter=${cursor}`;
    const res = await fetch(url, {
      headers: {
        'X-Appwrite-Project': PROJECT_ID,
        'X-Appwrite-Key': API_KEY,
        'Content-Type': 'application/json',
      },
    });
    if (!res.ok) {
      console.error('Error listing:', res.status, await res.text());
      break;
    }
    const data = await res.json();
    const docs = data.documents || [];
    if (docs.length === 0) break;
    total += docs.length;

    for (const doc of docs) {
      const currentPrice = doc.PRICE || 0;
      if (currentPrice <= 0) { skipped++; continue; }

      // Skip if already updated (PRICE/WHOLESALEPRICE ratio ~1.0909 = 120/110)
      const ratio = doc.WHOLESALEPRICE > 0 ? doc.PRICE / doc.WHOLESALEPRICE : 0;
      if (ratio > 1.08 && ratio < 1.11) {
        skipped++;
        continue;
      }

      const newPrice = Math.round(currentPrice * 1.20);
      const newWholesale = Math.round(currentPrice * 1.10);

      try {
        const updateUrl = `${ENDPOINT}/databases/${DATABASE_ID}/collections/${COLLECTION}/documents/${doc.$id}`;
        const updateRes = await fetch(updateUrl, {
          method: 'PATCH',
          headers: {
            'X-Appwrite-Project': PROJECT_ID,
            'X-Appwrite-Key': API_KEY,
            'X-Appwrite-Response-Format': '1.6.0',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            data: {
              PRICE: newPrice,
              WHOLESALEPRICE: newWholesale,
            },
          }),
        });
        if (updateRes.ok) {
          updated++;
          if (updated % 50 === 0) console.log(`Actualizados: ${updated}...`);
        } else {
          console.error(`Error en ${doc.$id}:`, updateRes.status);
        }
      } catch (e) {
        console.error(`Error updating ${doc.$id}:`, e.message);
      }
    }

    if (docs.length < limit) break;
    cursor = docs[docs.length - 1].$id;
  }

  console.log(`\nTotal productos: ${total} / 804`);
  console.log(`Actualizados: ${updated}`);
  console.log(`Skipped (ya actualizados o sin precio): ${skipped}`);
}

main().catch(console.error);
