import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getAuth } from 'firebase-admin/auth';

let serviceAccount;
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
} else {
  throw new Error("FIREBASE_SERVICE_ACCOUNT env variable is not set");
}

const app = getApps().length === 0
  ? initializeApp({
      credential: cert(serviceAccount),
    })
  : getApps()[0];

export { app };

export const adminAuth = getAuth(app); 