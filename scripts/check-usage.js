const PROJECT_ID = '6a0a4e8d0032177f3f90';
const API_KEY = 'standard_de757dd8d6cd1808ddc9a0b6694cad9a4e4ceb904a97613e4bc255cb116c0b1272ee9d865149911bab66ecb0e078d3120fbf9bd5c82cba8bc0d2ea6354cb3d24aa96e77f53d86fbf3a68a007abb0af608ee4854491b3e2b29b0d6e2fe63f907d592e8000c16c38f408e3bd1de65505897c249ecac5ecfb1e1a6de5c9b40aa655';
const ENDPOINT = 'https://nyc.cloud.appwrite.io/v1';
const DATABASE_ID = '6a0a58ca001798410d86';

async function main() {
  const headers = {
    'X-Appwrite-Project': PROJECT_ID,
    'X-Appwrite-Key': API_KEY,
  };

  // Fetch database usage for last 30 days
  const res = await fetch(`${ENDPOINT}/databases/${DATABASE_ID}/usage?range=30d`, { headers });
  if (!res.ok) {
    console.error('Failed:', res.status, await res.text());
    return;
  }
  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
}

main().catch(console.error);
