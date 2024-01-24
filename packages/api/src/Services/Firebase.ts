import * as admin from 'firebase-admin';
import {FIREBASE_SERVICE_ACCOUNT} from '../Utils/Env';

export const serverTimestamp = () => {
  return admin.firestore.FieldValue.serverTimestamp();
};

export const Firebase = admin.initializeApp({
  credential: admin.credential.cert(FIREBASE_SERVICE_ACCOUNT),
});

export const Firestore = Firebase.firestore();

export const FirestoreCollections = {
  emails: Firestore.collection('emails'),
};
