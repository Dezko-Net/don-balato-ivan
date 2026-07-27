// @ts-nocheck
const GEMINI_SCOPE = 'https://www.googleapis.com/auth/cloud-platform';
const GCP_PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT_ID || process.env.GCP_PROJECT_ID || '';
const GCP_REGION = process.env.GOOGLE_CLOUD_REGION || 'global';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

/** @type {any} */
let _auth = null;
/** @type {{ token: string, expiry: number } | null} */
let _cachedToken = null;
const TOKEN_REFRESH_BUFFER_MS = 60_000;

async function getAuth() {
  if (!_auth) {
    const { GoogleAuth } = await import(/* webpackIgnore: true */ 'google-auth-library');
    const credentialsJson = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
    if (credentialsJson) {
      const credentials = JSON.parse(credentialsJson);
      _auth = new GoogleAuth({ scopes: [GEMINI_SCOPE], credentials });
    } else {
      _auth = new GoogleAuth({ scopes: [GEMINI_SCOPE] });
    }
  }
  return _auth;
}

export async function getGeminiAccessToken(forceOAuth = false) {
  if (GEMINI_API_KEY && !forceOAuth) return ''; // Bypassed by API key
  
  if (_cachedToken && Date.now() < _cachedToken.expiry - TOKEN_REFRESH_BUFFER_MS) {
    return _cachedToken.token;
  }

  const auth = await getAuth();
  const client = await auth.getClient();
  const tokenRes = await client.getAccessToken();

  const token = tokenRes.token || '';
  if (!token) {
    throw new Error('No se pudo obtener el access token de Google Cloud ADC');
  }

  const expiry = Date.now() + 55 * 60 * 1000;

  _cachedToken = { token, expiry };
  return token;
}

export async function getGeminiAuthHeaders() {
  const headers = {
    'Content-Type': 'application/json'
  };
  
  if (GEMINI_API_KEY) {
    return headers; // API key is passed in URL
  }
  
  const token = await getGeminiAccessToken();
  headers['Authorization'] = `Bearer ${token}`;
  
  if (GCP_PROJECT_ID) {
    headers['x-goog-user-project'] = GCP_PROJECT_ID;
  }
  return headers;
}

export function buildGeminiUrl(model, method = 'generateContent') {
  // If we have an API Key, use AI Studio URL always
  if (GEMINI_API_KEY) {
    // Strip models/ prefix if passed, as AI Studio sometimes prefers bare name, but we append it
    const cleanModel = model.replace('models/', '');
    return `https://generativelanguage.googleapis.com/v1beta/models/${cleanModel}:${method}?key=${GEMINI_API_KEY}`;
  }
  
  // Otherwise use Vertex AI
  if (GCP_PROJECT_ID) {
    const base = GCP_REGION === 'global'
      ? 'https://aiplatform.googleapis.com'
      : `https://${GCP_REGION}-aiplatform.googleapis.com`;
    return `${base}/v1/projects/${GCP_PROJECT_ID}/locations/${GCP_REGION}/publishers/google/models/${model}:${method}`;
  }
  
  throw new Error("Missing GEMINI_API_KEY or GCP_PROJECT_ID credentials.");
}
