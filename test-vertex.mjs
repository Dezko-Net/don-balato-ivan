import { execSync } from 'child_process';

const token = execSync('gcloud auth application-default print-access-token', { encoding: 'utf8' }).trim();
const projectId = 'project-cb90807e-3c53-45c5-90b';

const models = ['gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-1.5-flash'];

for (const model of models) {
  const url = `https://aiplatform.googleapis.com/v1/projects/${projectId}/locations/global/publishers/google/models/${model}:generateContent`;
  console.log(`\nTesting: ${model}`);
  
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: 'Say OK' }] }],
    }),
  });

  const data = await res.text();
  console.log(`Status: ${res.status}`);
  if (res.ok) {
    const parsed = JSON.parse(data);
    const text = parsed?.candidates?.[0]?.content?.parts?.[0]?.text;
    console.log(`✅ SUCCESS: ${text}`);
    break;
  } else {
    console.log(`Response: ${data.substring(0, 300)}`);
  }
  
  await new Promise(r => setTimeout(r, 2000));
}
