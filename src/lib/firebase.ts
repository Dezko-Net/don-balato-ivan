import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyCIEgaE6Smuyz1YxfoKNXIgq76crN_Me7A",
  authDomain: "geminai-449212.firebaseapp.com",
  projectId: "geminai-449212",
  storageBucket: "geminai-449212.firebasestorage.app",
  messagingSenderId: "786029583380",
  appId: "1:786029583380:web:c515391c5b673f4305db01"
};

const app = !getApps().length ? initializeApp(FIREBASE_CONFIG) : getApp();
export const db = getFirestore(app);
export const auth = getAuth(app);

export const authReady = new Promise<void>((resolve) => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      resolve();
    } else {
      signInAnonymously(auth).then(() => resolve()).catch(() => resolve());
    }
  });
});
