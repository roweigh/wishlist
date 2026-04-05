
import { db } from '@/firebase';
import {
  collection,
  getDocs,
} from 'firebase/firestore';

export const getEmailWhitelist = async () => {
  const col = collection(db, 'whitelisted-emails');
  return await getDocs(col).then(snapshot => snapshot.docs.map(({ id }) => id));
};
