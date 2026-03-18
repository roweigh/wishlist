import { add, get, update, del, delByField } from '../utils/api-utils';
import { Timestamp } from 'firebase/firestore';

export const addDeck = async (payload) => await add('deck', payload);
export const getDeckList = async () => await get('deck');

// Cards CRUD
export const getCards = async () => {
  const response = await get('purchases');

  /**
   * Aggregated at client-side to simulate SQL GROUP BY function
   * Generate map to keep track of processed cards
   */
  const result = {};
  response.forEach((item) => {
    const code = item.code;
    const qtyAcquired = item.qtyAcquired || 0;
    const qtyNeeded = item.qtyNeeded || 0;
    const amtSpent = item.amtSpent || 0;

    if (!result[code]) {
      result[code] = {
        code,
        name: item.name,
        deck: item.deck,
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
export const addCard = async (payload) => await add('purchases', payload);
export const updateCard = async (id, payload) => await update('purchases', id, payload);
export const removeCard = async (id) => {
  await delByField('purchases', 'code', id);
  await del('purchases', id);
};

// Card receipts CRUD
export const getCardHistory = async (code) => {
  const response = await get('purchases', code);
  // return response.filter(({ qtyAcquired }) => qtyAcquired > 0);
  return response;
};
export const updateHistory = async (id, payload) => await update('purchases', id, payload); // ??
export const removeHistory = async (id) => {}; // ??

// Tournament entry
export const getTournamentEntry = async () => await get('tournament-entry');
export const updateTournamentEntry = async (payload) => {
  payload.dates = payload.dates.map((v) => Timestamp.fromDate(new Date(v)));
  return await update('tournament-entry', 'DMfW4KQ8rOKPCwNABqHs', payload);
};

