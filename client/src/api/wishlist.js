import { get, add, update } from '../utils/api-utils';

export const getCards = async () => get('cards-total');
// export const getCardsTotal = async () => get('cards-tital');
export const addCard = async (payload) => add('cards', payload);
export const updateCard = async (id, payload) => update('cards', id, payload);