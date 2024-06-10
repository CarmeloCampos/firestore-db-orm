import { initializeApp, firestore } from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import Firestore = firestore.Firestore;

initializeApp({});

export const db: Firestore = getFirestore();
