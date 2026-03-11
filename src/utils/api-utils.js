import { db } from '../main';
import {
  collection,
  query,
  doc,

  orderBy,
  limit,
  getDocs,
  addDoc ,
  updateDoc,
  runTransaction,
  serverTimestamp,
  increment,
  where,
  deleteDoc,
  writeBatch,
} from 'firebase/firestore';

export async function get(colName, id = undefined) {
  const transformData = (snapshot) => {
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  };

  const col = collection(db, colName);
  if (id) { // Fetch by id
    const q = query(col, where('code', '==', id));
    return await getDocs(q).then((snapshot) => transformData(snapshot));
  } else { // Fetch list
    return await getDocs(col).then((snapshot) => transformData(snapshot));
  }
}

export async function add(col, payload) {
  await addDoc(collection(db, col), payload);
}

export async function update(col, id, payload) {
  await updateDoc(doc(db, col, id), payload);
}

export async function del(colName, id) {
  await deleteDoc(doc(db, colName, id));
}

export async function delByField(colName, field, value) {
  const colRef = collection(db, colName);
  const q = query(colRef, where(field, '==', value));
  const snapshot = await getDocs(q);
  const batch = writeBatch(db);
  snapshot.docs.forEach(d => { batch.delete(d.ref); });
  await batch.commit();
}