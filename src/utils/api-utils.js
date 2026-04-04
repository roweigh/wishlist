import { useAuthStore } from '@/stores/auth';
import { db } from '@/firebase';
import {
  collection,
  query,
  doc,
  getDocs,
  addDoc ,
  updateDoc,
  where,
  deleteDoc,
  writeBatch,
  Timestamp,
} from 'firebase/firestore';

// Helper to get the user-specific collection path
const getColRef = (colName) => {
  const authStore = useAuthStore();
  const uid = authStore.profile?.uid; // Use the property name from your store

  if (!uid) throw new Error('User must be logged in to access data.');

  // This creates a path: users/12345/singles
  return collection(db, 'users', uid, colName);
};

export async function get(colName, id = undefined) {
  const transformData = (snapshot) => {
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  };

  const col = getColRef(colName);
  if (id) { // Fetch by id
    const q = query(col, where('code', '==', id));
    return await getDocs(q).then((snapshot) => transformData(snapshot));
  } else { // Fetch list
    return await getDocs(col).then((snapshot) => transformData(snapshot));
  }
}

export async function add(colName, payload) {
  const col = getColRef(colName);
  await addDoc(col, payload);
}
export async function batchAdd(colName, arr) {
  const batch = writeBatch(db);

  arr.forEach((item) => {
    const historyColRef = getColRef(`${colName}-history`);
    const newDocRef = doc(historyColRef);

    batch.set(newDocRef, {
      code: item.code, // We store the code as a field instead of a parent
      name: item.name,
      deck: item.deck, // oops lost it
      qtyAcquired: Number(item.qtyAcquired) || 0,
      qtyNeeded: Number(item.qtyNeeded) || 0,
      amtSpent: Number(item.amtSpent) || 0,
      date: Timestamp.fromDate(new Date(item.date)),
    });
  });

  await batch.commit();
}
export async function batchAddEntry(colName, arr) {
  const batch = writeBatch(db);
  arr.forEach((item) => {
    // Everything goes into one top-level collection
    const historyColRef = getColRef(`${colName}-history`);
    const newDocRef = doc(historyColRef);

    batch.set(newDocRef, {
      date: item.date, // We store the code as a field instead of a parent
      amtSpent: item.amtSpent,
    });
  });

  await batch.commit();
}

export async function update(col, id, payload) {
  const authStore = useAuthStore();
  const uid = authStore.profile?.uid;

  // Path: users/UID/collection/docID
  const docRef = doc(db, 'users', uid, col, id);
  await updateDoc(docRef, payload);
}
export async function del(colName, id, field = undefined) {
  if (field) {
    const col = getColRef(colName);
    const q = query(col, where(field, '==', id));
    const snapshot = await getDocs(q);
    const batch = writeBatch(db);
    snapshot.docs.forEach(d => { batch.delete(d.ref); });
    await batch.commit();
  } else {
    await deleteDoc(doc(db, colName, id));
  }
}