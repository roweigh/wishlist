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
  runTransaction,
  serverTimestamp,
  increment,
  where,
  deleteDoc,
  writeBatch,
} from 'firebase/firestore';

// Aggregated at client-side to simulate SQL GROUP BY function
export async function getAll(colName) {
  const col = collection(db, colName);
  const snapshot = await getDocs(col);

  const summaryMap = {};
  snapshot.forEach((doc) => {
    const data = doc.data();
    const code = data.code;
    const name = data.name;
    const date = data.date;
    const qtyAcquired = data.qtyAcquired || 0;
    const qtyNeeded = data.qtyNeeded || 0;
    const amtSpent = data.amtSpent || 0;

    if (!summaryMap[code]) {
      summaryMap[code] = {
        id: doc.id,
        code: code,
        name: name,
        qtyAcquired: 0,
        qtyNeeded: 0,
        amtSpent: 0,
        date: new Date(date?.seconds * 1000 + date?.nanoseconds / 1_000_000),
      };
    }

    summaryMap[code].qtyAcquired += qtyAcquired;
    summaryMap[code].qtyNeeded += qtyNeeded;
    summaryMap[code].amtSpent += amtSpent;
  });

  // convert map → array for UI tables
  return Object.values(summaryMap);
}

export async function getUnconditional(colName, code) {
  const col = collection(db, colName);
  const q = query(col);
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
}

export async function get(colName, code) {
  const col = collection(db, colName);
  const q = query(col, where('code', '==', code));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
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