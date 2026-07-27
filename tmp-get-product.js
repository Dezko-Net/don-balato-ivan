const { Client, Databases } = require('node-appwrite');

const client = new Client()
  .setEndpoint('https://nyc.cloud.appwrite.io/v1')
  .setProject('donbalatoivan')
  .setKey('standard_36d66a586c5975803e1bb17c5bcd8bb4146a1ee594b31be56fd22a537043adf5cbae612072df4f25873e3d388c4f6dc494beb6a8a56fbfd0c5d878552a622a35762e78dae181636818840ba3eeb07227efbc0b2a1d08893e740e7f56941b427b81f6c675fdd90ca5fe896cd46aeb7e5027736fe5fb40c480ea2f8363ca89740a');

const databases = new Databases(client);

async function main() {
  const ids = process.argv.slice(2);
  for (const id of ids) {
    try {
      const p = await databases.getDocument('6a62e7440033d2278d28', 'products', id);
      console.log('===', id, p.NAME, '===');
      for (let i = 1; i <= 5; i++) {
        const key = i === 1 ? 'IMAGEURL' : `IMAGEURL${i}`;
        console.log(key, ':', p[key] || '-');
      }
      console.log('PRICE:', p.PRICE, 'STOCK:', p.STOCK);
      console.log('DESC:', (p.DESCRIPTION || '').slice(0, 200));
    } catch (e) {
      console.error('Error', id, e.message);
    }
  }
}

main();
