import dotenv from "dotenv";
dotenv.config();

import { initializeApp, cert } from "firebase-admin/app";

const {
  FIREBASE_PROJECT_ID,
  FIREBASE_CLIENT_EMAIL,
  FIREBASE_PRIVATE_KEY,
  FIREBASE_SERVICE_ACCOUNT_JSON,
} = process.env;

let serviceAccount;

if (FIREBASE_SERVICE_ACCOUNT_JSON) {
  serviceAccount = JSON.parse(FIREBASE_SERVICE_ACCOUNT_JSON);
} else {
  serviceAccount = {
    projectId: FIREBASE_PROJECT_ID,
    clientEmail: FIREBASE_CLIENT_EMAIL,
    privateKey: FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  };
}

if (
  !serviceAccount?.projectId ||
  !serviceAccount?.clientEmail ||
  !serviceAccount?.privateKey
) {
  throw new Error(
    "Missing Firebase admin credentials. Set FIREBASE_SERVICE_ACCOUNT_JSON or FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY."
  );
}

export const app = initializeApp({
  credential: cert(serviceAccount),
});
