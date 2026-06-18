

async function getUsage() {
    const endpoint = "https://nyc.cloud.appwrite.io/v1";
    const projectId = "6a0a4e8d0032177f3f90";
    const apiKey = "standard_c476eaadc21bbecc3b6949ee4d0a932613b7a3d4ee52c80cf2c1406750ff75267becfad617da0acd444d0b903b8faea19661d48b2f8b6dc09b678e0db164ddd4b472417c3477a091188554bdd2adfad944778a2927090744ae991c9dcf48c7cebc60e437f5c8a841ffb0736da27daf197bf5716065c2ea5dda65070b07d74642";
    const dbId = "6a0a58ca001798410d86";

    const ranges = ["24h", "7d", "30d"];

    for (const range of ranges) {
        console.log(`\n--- Fetching usage for range: ${range} ---`);
        try {
            const res = await fetch(`${endpoint}/databases/${dbId}/usage?range=${range}`, {
                method: "GET",
                headers: {
                    "X-Appwrite-Project": projectId,
                    "X-Appwrite-Key": apiKey
                }
            });
            const data = await res.json();
            console.log(JSON.stringify(data, null, 2));
        } catch (e) {
            console.error(e);
        }
    }
}

getUsage();
