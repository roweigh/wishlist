import { add, get, getAll, update, del, delByField } from '../utils/api-utils';

import { serverTimestamp, increment } from 'firebase/firestore';

export const getCards = async () => await getAll('purchases');
export const addCard = async (payload) => await add('purchases', payload);
export const updateCard = async (id, payload) => await update('purchases', id, payload);

export const getCardHistory = async (code) => {
  const result = await get('purchases', code);
  return result.filter(({ qtyAcquired }) => qtyAcquired > 0);
};


// export const getCardHistory = async (code) => {};
export const updateHistory = async (id, payload) => {
  await update('purchases', id, payload); };
export const removeHistory = async (id) => {};
export const delAll = async (id) => {
  await delByField('purchases', 'code', id);
  await del('purchases', id);
};
