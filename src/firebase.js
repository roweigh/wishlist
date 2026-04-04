import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const config = {
  apiKey: 'AIzaSyD97hQbJMaVCWx_C4rDZFIfYqf5F4mvzSo',
  authDomain: 'wishlist-596f5.firebaseapp.com',
  projectId: 'wishlist-596f5',
  storageBucket: 'wishlist-596f5.firebasestorage.app',
  messagingSenderId: '452494338050',
  appId: '1:452494338050:web:ab32fb6a04a86928175f1b',
  measurementId: 'G-H7Z98SXCP2',
};
const firebaseApp = initializeApp(config);

export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
export const googleProvider = new GoogleAuthProvider();

export default firebaseApp;