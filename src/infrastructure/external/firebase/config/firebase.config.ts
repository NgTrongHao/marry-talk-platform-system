import * as admin from 'firebase-admin';
import * as serviceAccount from '../../../../../service-account.json';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
});

export const firebaseAdmin = admin;
export const firebaseStorage = process.env.FIREBASE_STORAGE_BUCKET
  ? admin.storage().bucket()
  : null;
