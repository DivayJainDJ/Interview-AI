import { initializeApp, cert } from "firebase-admin/app";
import serviceAccountJson from "../serviceAccountKey.json" with { type: "json" };

const {
  FIREBASE_PROJECT_ID,
  FIREBASE_CLIENT_EMAIL,
  FIREBASE_PRIVATE_KEY,
} = process.env;

const serviceAccount =
  FIREBASE_PROJECT_ID && FIREBASE_CLIENT_EMAIL && FIREBASE_PRIVATE_KEY
    ? {
        projectId: FIREBASE_PROJECT_ID,
        clientEmail: FIREBASE_CLIENT_EMAIL,
        privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      }
    : serviceAccountJson;

export const app = initializeApp({
  credential: cert(serviceAccount),
});
