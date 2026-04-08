import { db } from '@/firebase';
import {
  collection,
  getDocs,
  getDoc,
  doc,
  setDoc,
} from 'firebase/firestore';

export const getEmailWhitelist = async () => {
  const col = collection(db, 'whitelisted-emails');
  return await getDocs(col).then(snapshot => snapshot.docs.map(({ id }) => id));
};

export const addUser = async (uid, payload) => {
  const userDocRef = doc(db, 'users', uid);
  await setDoc(userDocRef, payload);
  return { success: true };
};

export const getUser = async (uid) => {
  const userDocRef = doc(db, 'users', uid);
  const res = await getDoc(userDocRef);
  return res.data()?.name;
};

export const getUsers = async () => {
  const colRef = collection(db, 'users');
  return await getDocs(colRef).then(snapshot => snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
};

export const getUserPurchase = async (id, colName) => {
  const transformData = (snapshot) => {
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  };

  const col = collection(db, 'users', id, colName);
  return await getDocs(col).then((snapshot) => transformData(snapshot));
};