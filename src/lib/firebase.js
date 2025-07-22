import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
// --- NEW: Import Firestore modules ---
import {
  getFirestore,
  doc,
  setDoc,
  serverTimestamp
} from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app); // <-- NEW: Export Firestore database instance

const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = () => {
  return signInWithPopup(auth, googleProvider);
};

export const signUp = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const signIn = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

/**
 * --- NEW FUNCTION ---
 * Creates a user document in the 'users' collection in Firestore
 * after they sign up.
 * @param {object} userAuth - The user object from Firebase Authentication.
 * @param {object} additionalData - Any extra data to save.
 */
export const createUserProfileDocument = async (userAuth, additionalData = {}) => {
  if (!userAuth) return;

  // Get a reference to the document for this user
  const userDocRef = doc(db, 'users', userAuth.uid);

  // Prepare the data to be saved
  const { email } = userAuth;
  const createdAt = serverTimestamp(); // Get the server's timestamp

  try {
    // Write the data to the document.
    // setDoc will create the document if it doesn't exist.
    await setDoc(userDocRef, {
      email,
      createdAt,
      ...additionalData, // e.g., displayName
    });
  } catch (error) {
    console.error("Error creating user profile in Firestore", error.message);
    // Optionally re-throw or handle the error as needed
  }
};

export const signOut = () => {
  return firebaseSignOut(auth);
};