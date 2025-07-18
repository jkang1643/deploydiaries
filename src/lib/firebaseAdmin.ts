import { initializeApp, cert, getApps, getApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

let serviceAccount: any;
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
} else {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  serviceAccount = require('../../../secrets/deploydiaries-90c69-firebase-adminsdk-fbsvc-0eba392b0f.json');
}

const app = getApps().length === 0
  ? initializeApp({
      credential: cert(serviceAccount),
    })
  : getApp();

export const adminAuth = getAuth(app); 