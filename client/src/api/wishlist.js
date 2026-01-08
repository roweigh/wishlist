import { get, add, update, getReceiptsByCode,
} from '../utils/api-utils';

export const getCards = async () => get('cards-total');
export const getCardHistory = async (code) => getReceiptsByCode('cards', code);

export const addCard = async (payload) => add('cards', payload);
export const updateCard = async (id, payload) => update('cards', id, payload);