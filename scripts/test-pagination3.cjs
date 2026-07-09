const ENDPOINT = 'https://nyc.cloud.appwrite.io/v1';
const PROJECT_ID = '6a0a4e8d0032177f3f90';
const DATABASE_ID = '6a0a58ca001798410d86';
const API_KEY = 'standard_de757dd8d6cd1808ddc9a0b6694cad9a4e4ceb904a97613e4bc255cb116c0b1272ee9d865149911bab66ecb0e078d3120fbf9bd5c82cba8bc0d2ea6354cb3d24aa96e77f53d86fbf3a68a007abb0af608ee4854491b3e2b29b0d6e2fe63f907d592e8000c16c38f408e3bd1de65505897c249ecac5ecfb1e1a6de5c9b40aa655';
const COLLECTION = 'products';

const headers = {
  'X-Appwrite-Project': PROJECT_ID,
  'X-Appwrite-Key': API_KEY,
  'X-Appwrite-Response-Format': '1.6.0',
  'Content-Type': 'application/json',
};

async function main() {
  // Get first batch
  const res1 = await fetch(`${ENDPOINT}/databases/${DATABASE_ID}/collections/${COLLECTION}/documents?limit=25`, { headers });
  const data1 = await res1.json();
  const docs1 = data1.documents || [];
  const lastId = docs1[docs1.length - 1].$id;
  console.log(`Batch 1: ${docs1.length} docs, lastId=${lastId}`);

  // Try cursorAfter with response format header
  const res2 = await fetch(`${ENDPOINT}/databases/${DATABASE_ID}/collections/${COLLECTION}/documents?limit=25&cursorAfter=${lastId}`, { headers });
  const data2 = await res2.json();
  const docs2 = data2.documents || [];
  console.log(`Batch 2 (cursorAfter): ${docs2.length} docs, firstId=${docs2[0]?.$id}, sameAsFirst=${docs2[0]?.$id === docs1[0]?.$id}`);

  // Try with queries param for cursorAfter
  const url3 = `${ENDPOINT}/databases/${DATABASE_ID}/collections/${COLLECTION}/documents?queries[0]=${encodeURIComponent(`cursorAfter("${lastId}")`)}&queries[1]=${encodeURIComponent('limit(25)')}`;
  const res3 = await fetch(url3, { headers });
  const data3 = await res3.json();
  const docs3 = data3.documents || [];
  console.log(`Batch 3 (query cursorAfter): ${docs3.length} docs, firstId=${docs3[0]?.$id}, sameAsFirst=${docs3[0]?.$id === docs1[0]?.$id}`);

  // Try offset with response format
  const res4 = await fetch(`${ENDPOINT}/databases/${DATABASE_ID}/collections/${COLLECTION}/documents?limit=25&offset=25`, { headers });
  const data4 = await res4.json();
  const docs4 = data4.documents || [];
  console.log(`Batch 4 (offset=25): ${docs4.length} docs, firstId=${docs4[0]?.$id}, sameAsFirst=${docs4[0]?.$id === docs1[0]?.$id}`);
}

main().catch(console.error);
