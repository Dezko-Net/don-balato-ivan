const ENDPOINT = 'https://nyc.cloud.appwrite.io/v1';
const PROJECT_ID = '6a0a4e8d0032177f3f90';
const DATABASE_ID = '6a0a58ca001798410d86';
const API_KEY = 'standard_de757dd8d6cd1808ddc9a0b6694cad9a4e4ceb904a97613e4bc255cb116c0b1272ee9d865149911bab66ecb0e078d3120fbf9bd5c82cba8bc0d2ea6354cb3d24aa96e77f53d86fbf3a68a007abb0af608ee4854491b3e2b29b0d6e2fe63f907d592e8000c16c38f408e3bd1de65505897c249ecac5ecfb1e1a6de5c9b40aa655';
const COLLECTION = 'products';

const headers = {
  'X-Appwrite-Project': PROJECT_ID,
  'X-Appwrite-Key': API_KEY,
  'Content-Type': 'application/json',
};

async function main() {
  // Test: does offset work with limit=25?
  for (const off of [0, 25, 50, 100]) {
    const url = `${ENDPOINT}/databases/${DATABASE_ID}/collections/${COLLECTION}/documents?limit=25&offset=${off}`;
    const res = await fetch(url, { headers });
    const data = await res.json();
    const docs = data.documents || [];
    console.log(`offset=${off}: ${docs.length} docs, first=$id:${docs[0]?.$id}, PRICE=${docs[0]?.PRICE}, total=${data.total}`);
  }

  // Test cursorAfter with last doc ID from first batch
  const res1 = await fetch(`${ENDPOINT}/databases/${DATABASE_ID}/collections/${COLLECTION}/documents?limit=25`, { headers });
  const data1 = await res1.json();
  const lastId = data1.documents[data1.documents.length - 1].$id;
  console.log(`\nFirst batch last ID: ${lastId}`);

  const res2 = await fetch(`${ENDPOINT}/databases/${DATABASE_ID}/collections/${COLLECTION}/documents?limit=25&cursorAfter=${lastId}`, { headers });
  const data2 = await res2.json();
  const docs2 = data2.documents || [];
  console.log(`cursorAfter=${lastId}: ${docs2.length} docs, first=$id:${docs2[0]?.$id}, PRICE=${docs2[0]?.PRICE}`);
  
  // Check if docs2[0] is different from data1.documents[0]
  console.log(`Same as first? ${docs2[0]?.$id === data1.documents[0]?.$id}`);
}

main().catch(console.error);
