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
  Timestamp,
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

export async function batchAdd(col, arr) {
  const batch = writeBatch(db);

  arr.forEach((item) => {
    // Everything goes into one top-level collection
    const historyColRef = collection(db, `${col}-history`);
    const newDocRef = doc(historyColRef);

    batch.set(newDocRef, {
      code: item.code, // We store the code as a field instead of a parent
      name: item.name,
      // deck: item.deck, // oops lost it
      qtyAcquired: Number(item.qtyAcquired) || 0,
      qtyNeeded: Number(item.qtyNeeded) || 0,
      amtSpent: Number(item.amtSpent) || 0,
      date: Timestamp.fromDate(new Date(item.date)),
    });
  });

  await batch.commit();
}

export async function batchAddEntry(col, arr) {
  const batch = writeBatch(db);
  console.log(arr);
  arr.forEach((item) => {
    // Everything goes into one top-level collection
    const historyColRef = collection(db, `${col}-history`);
    const newDocRef = doc(historyColRef);

    batch.set(newDocRef, {
      date: item.date, // We store the code as a field instead of a parent
      unitCost: item.unitCost,
    });
  });

  await batch.commit();
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