import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAHY_lOo4l5vHM1ZiSaIy4o5_aBPs-0Rog",
  authDomain: "ihtkoding.firebaseapp.com",
  projectId: "ihtkoding",
  storageBucket: "ihtkoding.firebasestorage.app",
  messagingSenderId: "121468676927",
  appId: "1:121468676927:web:c4424f139d2c79945e418a",
  measurementId: "G-JNCFCKE0DS"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
