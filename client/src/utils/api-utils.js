import { db } from '../main';
import {
  doc,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  addDoc ,
  updateDoc,
} from 'firebase/firestore';

export async function get (col) {
  const result = [];
  await getDocs(query(
    collection(db, col),
    // orderBy('rating', 'desc'),
    // limit(10),
  )).then(({ docs }) => {
    docs.forEach(doc => {
      result.push({
        id: doc.id,
        ...doc.data(),
      });
    });
  });

  return result;
}

export async function add (col, payload) {
  await addDoc(collection(db, col), payload);
}

export async function update (col, id, payload) {
  await updateDoc(doc(db, col, id), payload);
}