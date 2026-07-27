const { Client, Databases, Query } = require('node-appwrite');

const client = new Client()
  .setEndpoint('https://nyc.cloud.appwrite.io/v1')
  .setProject('donbalatoivan')
  .setKey('standard_36d66a586c5975803e1bb17c5bcd8bb4146a1ee594b31be56fd22a537043adf5cbae612072df4f25873e3d388c4f6dc494beb6a8a56fbfd0c5d878552a622a35762e78dae181636818840ba3eeb07227efbc0b2a1d08893e740e7f56941b427b81f6c675fdd90ca5fe896cd46aeb7e5027736fe5fb40c480ea2f8363ca89740a');

const databases = new Databases(client);

async function main() {
  try {
    const res = await databases.listDocuments('6a62e7440033d2278d28', 'products', [Query.limit(200)]);
    res.documents.forEach(p => {
      const name = (p.NAME || '').toLowerCase();
      if (name.includes('sosten') || name.includes('soporte') || name.includes('parlante') || name.includes('speaker') || name.includes('cargador') || name.includes('audifono') || name.includes('audífono')) {
        console.log(p.$id, '|', p.NAME, '|', p.IMAGEURL ? 'img' : 'no-img');
      }
    });
  } catch (e) {
    console.error('Error:', e.message);
  }
}

main();
