import { add, get, update, del, delByField, batchAdd, batchAddEntry } from '../utils/api-utils';
import { Timestamp } from 'firebase/firestore';

export const addDeck = async (payload) => await add('deck', payload);
export const getDeckList = async () => await get('deck');

// Cards CRUD
export const getCards = async (col) => {
  /**
   * Aggregated at client-side to simulate SQL GROUP BY function
   * Generate map to keep track of processed cards
  */
  const result = {};

  const response = await get(`${col}-history`);
  response.forEach((item) => {
    const code = item.code;
    const qtyAcquired = item.qtyAcquired || 0;
    const qtyNeeded = item.qtyNeeded || 0;
    const amtSpent = item.amtSpent || 0;

    if (!result[code]) {
      result[code] = {
        code,
        id: item.id,
        name: item.name,
        deck: item.deck,
        date: item.date,
        cost: item.cost,
        qtyAcquired: 0,
        qtyNeeded: 0,
        amtSpent: 0,
      };
    }

    result[code].qtyAcquired += qtyAcquired;
    result[code].qtyNeeded += qtyNeeded;
    result[code].amtSpent += amtSpent;
  });

  // Turn map back into array of objects
  return Object.values(result);
};

export const getPurchaseHistory = async () => await get('purchases');



export const addCard = async (payload) => await add('singles-history', payload);
export const updateCard = async (id, payload) => await update('singles-history', id, payload);
export const removeCard = async (id) => {
  await delByField('singles-history', 'code', id);
  // await del('singles-history', id);
};

export const addSale = async (payload) => await add('sales-history', payload);
export const updateSale = async (id, payload) => await update('sales-history', id, payload);
export const removeSale = async (id) => {
  await delByField('sales-history', 'code', id);
  // await del('singles-history', id);
};

export const getEntries = async (col) => {
  /**
   * Aggregated at client-side to simulate SQL GROUP BY function
   * Generate map to keep track of processed cards
  */

  const response = await get(`${col}-history`);
  console.log(col, Object.values(response));
  // Turn map back into array of objects
  return Object.values(response);
};

export const addEntry = async (payload) => await batchAddEntry('tournament', payload);
export const removeEntry = async (id) => {
  // await delByField('tournament-history', 'code', id);
  await del('tournament-history', id);
};

export const addItem = async (payload) => await add('others-history', payload);
export const removeItem = async (id) => {
  // await delByField('tournament-history', 'code', id);
  await del('others-history', id);
};


// Card receipts CRUD
export const getCardHistory = async (code) => {
  const response = await get('purchases', code);
  // return response.filter(({ qtyAcquired }) => qtyAcquired > 0);
  return response;
};

export const bulkImport = async (path, payload) => await batchAdd(path, payload);

export const addHistory = async (path, payload) =>  await add(`${path}/history`, payload);
export const updateHistory = async (id, payload) => await update('purchases', id, payload); // ??
export const removeHistory = async (id) => {}; // ??

// Tournament entry
export const getTournamentEntry = async () => await get('tournament-entry');
export const updateTournamentEntry = async (payload) => {
  payload.dates = payload.dates.map((v) => Timestamp.fromDate(new Date(v)));
  return await update('tournament-entry', 'DMfW4KQ8rOKPCwNABqHs', payload);
};

