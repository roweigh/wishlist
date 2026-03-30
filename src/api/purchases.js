import { add, get, update, del, batchAdd, batchAddEntry } from '../utils/api-utils';

export const getPurchaseHistory = async () => await get('purchases');

export const addDeck = async (payload) => await add('deck', payload);
export const getDeckList = async () => await get('deck');

// Cards CRUD
export const getCards = async () => {
  /**
   * Aggregated at client-side to simulate SQL GROUP BY function
   * Generate map to keep track of processed cards
  */
  const result = {};
  const response = await get('singles-history');
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
        qty: item.qty,
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
export const addCard = async (payload) => await add('singles-history', payload);
export const updateCard = async (id, payload) => await update('singles-history', id, payload);
export const removeCard = async (id) => await del('singles-history', id, 'code');

export const getSales = async () => await get('sales-history');
export const addSale = async (payload) => await add('sales-history', payload);
export const updateSale = async (id, payload) => await update('sales-history', id, payload);
export const removeSale = async (id) => await del('sales-history', id);

export const getEntries = async () => await get('tournament-history').then((response) => Object.values(response));
export const addEntry = async (payload) => await batchAddEntry('tournament', payload);
export const removeEntry = async (id) => await del('tournament-history', id);

export const getItems = async () => await get('others-history');
export const addItem = async (payload) => await add('others-history', payload);
export const updateItem = async (id, payload) => await update('others-history', id, payload);
export const removeItem = async (id) => await del('others-history', id);

export const bulkImport = async (path, payload) => await batchAdd(path, payload);

// Card receipts CRUD
export const getCardHistory = async (code) => {
  const response = await get('purchases', code);
  // return response.filter(({ qtyAcquired }) => qtyAcquired > 0);
  return response;
};

export const addHistory = async (path, payload) =>  await add(`${path}/history`, payload);
export const updateHistory = async (id, payload) => await update('purchases', id, payload); // ??
export const removeHistory = async (id) => {}; // ??