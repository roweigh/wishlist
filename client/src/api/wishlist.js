import { get, add, update, getReceiptsByCode, del,
} from '../utils/api-utils';

export const getCards = async () => get('cards-total');
export const getCardHistory = async (code) => getReceiptsByCode('cards', code);
export const addCard = async (payload) => add('cards', payload);
export const updateHistory = async (id, payload) => update('cards', id, payload);
export const removeHistory = async (id) => del('cards', id);
