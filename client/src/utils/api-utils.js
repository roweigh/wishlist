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

export async function getReceiptsByCode(col, code) {
  const colRef = collection(db, col);
  const q = query(colRef, where('code', '==', code));

  const querySnapshot = await getDocs(q);
  const receipts = [];
  querySnapshot.forEach(doc => {
    console.log(doc.data().date)
    receipts.push({
      ...doc.data(),
      id: doc.id,
      date: doc.data().date?.toDate(),
    });
  });

  return receipts;
}

export async function deleteAggregateAndReceipts(aggregateId) {
  const batch = writeBatch(db);

  // Aggregate doc
  const aggregateRef = doc(db, 'cards-total', aggregateId);
  batch.delete(aggregateRef);

  // Receipt docs
  const q = query(
    collection(db, 'cards'),
    where('code', '==', aggregateId),
  );

  const receiptsSnap = await getDocs(q);

  receiptsSnap.forEach(d => {
    batch.delete(d.ref);
  });

  await batch.commit();
}

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

export async function add (col, payload) {
  const item = doc(collection(db, col));
  const itemCollection = doc(db, 'cards-total', payload.code);

  await runTransaction(db, async (tx) => {
    // Create item
    tx.set(item, {
      ...payload,
      date: serverTimestamp(),
    });

    tx.set(itemCollection, {
      ...payload,
      code: payload.code,
      qtyNeeded: increment(payload.qtyNeeded),
      qtyAcquired: increment(payload.qtyAcquired),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
    );
  });
}

export async function update(col, id, payload) {
  console.log('Updating path:', `${col}/${id}`);
  console.log(payload);
  const item = doc(db, col, id);
  const itemCollection = doc(db, 'cards-total', payload.code);

  await runTransaction(db, async (tx) => {
    // Read the existing item to compute deltas
    const snap = await tx.get(item);
    if (!snap.exists()) {
      throw new Error('Item does not exist');
    }

    const oldPayload = snap.data();

    const qtyNeededDelta =
      (payload.qtyNeeded ?? 0) - (oldPayload.qtyNeeded ?? 0);

    const qtyAcquiredDelta =
      (payload.qtyAcquired ?? 0) - (oldPayload.qtyAcquired ?? 0);

    // Update the individual item
    tx.update(item, {
      ...payload,
      updatedAt: serverTimestamp(),
    });

    // Apply deltas to the totals doc
    tx.set(
      itemCollection,
      {
        qtyNeeded: increment(qtyNeededDelta),
        qtyAcquired: increment(qtyAcquiredDelta),
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
  });
}

export async function del(col, id) {
  const item = doc(db, col, id);

  await runTransaction(db, async (tx) => {
    // Read the item first
    const snap = await tx.get(item);
    if (!snap.exists()) return;

    const payload = snap.data();
    const totals = doc(db, 'cards-total', payload.code);

    const qtyNeeded = payload.qtyNeeded ?? 0;
    const qtyAcquired = payload.qtyAcquired ?? 0;

    // Delete the item
    tx.delete(item);

    // Subtract from totals
    tx.set(
      totals,
      {
        qtyNeeded: increment(-qtyNeeded),
        qtyAcquired: increment(-qtyAcquired),
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
  });
}