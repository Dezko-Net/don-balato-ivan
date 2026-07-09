const ENDPOINT = 'https://nyc.cloud.appwrite.io/v1';
const PROJECT_ID = '6a0a4e8d0032177f3f90';
const DATABASE_ID = '6a0a58ca001798410d86';
const API_KEY = 'standard_de757dd8d6cd1808ddc9a0b6694cad9a4e4ceb904a97613e4bc255cb116c0b1272ee9d865149911bab66ecb0e078d3120fbf9bd5c82cba8bc0d2ea6354cb3d24aa96e77f53d86fbf3a68a007abb0af608ee4854491b3e2b29b0d6e2fe63f907d592e8000c16c38f408e3bd1de65505897c249ecac5ecfb1e1a6de5c9b40aa655';

async function main() {
  const url = `${ENDPOINT}/databases/${DATABASE_ID}/collections/products/documents?limit=1`;
  const res = await fetch(url, {
    headers: {
      'X-Appwrite-Project': PROJECT_ID,
      'X-Appwrite-Key': API_KEY,
    },
  });
  const data = await res.json();
  const doc = data.documents[0];
  console.log('ID:', doc.$id);
  console.log('PRICE:', doc.PRICE);
  console.log('WHOLESALEPRICE:', doc.WHOLESALEPRICE);
  console.log('WHOLESALEMINQUANTITY:', doc.WHOLESALEMINQUANTITY);
  console.log('All keys:', Object.keys(doc).join(', '));

  // Try update with just PRICE
  const updateUrl = `${ENDPOINT}/databases/${DATABASE_ID}/collections/products/documents/${doc.$id}`;
  const updateRes = await fetch(updateUrl, {
    method: 'PATCH',
    headers: {
      'X-Appwrite-Project': PROJECT_ID,
      'X-Appwrite-Key': API_KEY,
      'X-Appwrite-Response-Format': '1.6.0',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ data: { PRICE: Math.round((doc.PRICE || 0) * 1.20) } }),
  });
  console.log('Update PRICE only:', updateRes.status);
  if (!updateRes.ok) console.log(await updateRes.text());

  // Try update with WHOLESALEPRICE
  const updateRes2 = await fetch(updateUrl, {
    method: 'PATCH',
    headers: {
      'X-Appwrite-Project': PROJECT_ID,
      'X-Appwrite-Key': API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ WHOLESALEPRICE: Math.round((doc.PRICE || 0) * 1.10) }),
  });
  console.log('Update WHOLESALEPRICE only:', updateRes2.status);
  if (!updateRes2.ok) console.log(await updateRes2.text());
}

main().catch(console.error);
