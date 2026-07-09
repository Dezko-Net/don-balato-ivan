const ENDPOINT = 'https://nyc.cloud.appwrite.io/v1';
const PROJECT_ID = '6a0a4e8d0032177f3f90';
const DATABASE_ID = '6a0a58ca001798410d86';
const API_KEY = 'standard_de757dd8d6cd1808ddc9a0b6694cad9a4e4ceb904a97613e4bc255cb116c0b1272ee9d865149911bab66ecb0e078d3120fbf9bd5c82cba8bc0d2ea6354cb3d24aa96e77f53d86fbf3a68a007abb0af608ee4854491b3e2b29b0d6e2fe63f907d592e8000c16c38f408e3bd1de65505897c249ecac5ecfb1e1a6de5c9b40aa655';

async function main() {
  const docId = '6a4f0548e68a4fc3dd07';
  // Original PRICE was 1100, should be 1100*1.20=1320, WHOLESALEPRICE=1100*1.10=1210
  const url = `${ENDPOINT}/databases/${DATABASE_ID}/collections/products/documents/${docId}`;
  const res = await fetch(url, {
    method: 'PATCH',
    headers: {
      'X-Appwrite-Project': PROJECT_ID,
      'X-Appwrite-Key': API_KEY,
      'X-Appwrite-Response-Format': '1.6.0',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ data: { PRICE: 1320, WHOLESALEPRICE: 1210 } }),
  });
  console.log('Fix result:', res.status);
  if (res.ok) {
    const d = await res.json();
    console.log('PRICE:', d.PRICE, 'WHOLESALEPRICE:', d.WHOLESALEPRICE);
  } else {
    console.log(await res.text());
  }
}
main().catch(console.error);
