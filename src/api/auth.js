import { add, get, update, del, batchAdd, batchAddEntry } from '../utils/api-utils';
import { db } from '@/firebase';
import {
  collection,
  getDocs,
  getDoc,
  doc,
} from 'firebase/firestore';

export const getEmailWhitelist = async () => {
  const col = collection(db, 'whitelisted-emails');
  return await getDocs(col).then(snapshot => snapshot.docs.map(({ id }) => id));
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