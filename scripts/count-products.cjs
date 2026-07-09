const ENDPOINT = 'https://nyc.cloud.appwrite.io/v1';
const PROJECT_ID = '6a0a4e8d0032177f3f90';
const DATABASE_ID = '6a0a58ca001798410d86';
const API_KEY = 'standard_de757dd8d6cd1808ddc9a0b6694cad9a4e4ceb904a97613e4bc255cb116c0b1272ee9d865149911bab66ecb0e078d3120fbf9bd5c82cba8bc0d2ea6354cb3d24aa96e77f53d86fbf3a68a007abb0af608ee4854491b3e2b29b0d6e2fe63f907d592e8000c16c38f408e3bd1de65505897c249ecac5ecfb1e1a6de5c9b40aa655';

async function main() {
  // Try different limits to see total
  for (const limit of [25, 50, 100, 500]) {
    const url = `${ENDPOINT}/databases/${DATABASE_ID}/collections/products/documents?limit=${limit}`;
    const res = await fetch(url, {
      headers: {
        'X-Appwrite-Project': PROJECT_ID,
        'X-Appwrite-Key': API_KEY,
      },
    });
    const data = await res.json();
    console.log(`limit=${limit}: got ${data.documents?.length || 0} docs, total=${data.total || '?'}`);
  }

  // Try with offset to get more
  let offset = 0;
  let totalFound = 0;
  while (true) {
    const url = `${ENDPOINT}/databases/${DATABASE_ID}/collections/products/documents?limit=100&offset=${offset}`;
    const res = await fetch(url, {
      headers: {
        'X-Appwrite-Project': PROJECT_ID,
        'X-Appwrite-Key': API_KEY,
      },
    });
    const data = await res.json();
    const docs = data.documents || [];
    if (docs.length === 0) break;
    totalFound += docs.length;
    console.log(`offset=${offset}: got ${docs.length} docs (total so far: ${totalFound}, API total: ${data.total})`);
    if (docs.length < 100) break;
    offset += 100;
  }
  console.log(`\nTotal productos encontrados: ${totalFound}`);
}
main().catch(console.error);
