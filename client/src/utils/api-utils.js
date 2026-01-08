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
        ...doc.data(),
        id: doc.id,
        date: doc.data().date?.toDate(),
      });
    });
  });

  return result;
}

export async function getReceiptsByCode(col, code) {
  const colRef = collection(db, col);
  const q = query(colRef, where('code', '==', code));

  const querySnapshot = await getDocs(q);
  const receipts = [];
  querySnapshot.forEach(doc => {
    receipts.push({
      ...doc.data(),
      id: doc.id,
      date: doc.data().date?.toDate(),
    });
  });

  return receipts;
}

export async function add (col, payload) {
  const item = doc(collection(db, col));

  console.log(payload);
  const itemCollection = doc(db, 'cards-total', payload.code);

  await runTransaction(db, async (tx) => {
    const snap = await tx.get(itemCollection);
    tx.set(item, {
      ...payload,
      date: serverTimestamp(),
    });

    if (snap.exists()) {
      tx.update(itemCollection, {
        qtyNeeded: increment(payload.qtyNeeded),
        qtyAcquired: increment(payload.qtyAcquired),
        updatedAt: serverTimestamp(),
      });
    } else {
      tx.set(itemCollection, {
        ...payload,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
  });
}

export async function update (col, id, payload) {
  await updateDoc(doc(db, col, id), payload);
}