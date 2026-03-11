import { Timestamp } from 'firebase/firestore';
import { pair, updatePair } from '@/utils/form-utils';

import {
  getDeckList,
  addDeck,
} from '@/api/purchases';

export default () => {
  return {
    data () {
      return {
        loadingFlags: {
          initializing: true,
          loading: true,
        },
        newDeck: false,
        deckList: [],

        // Card Details
        code: null,
        name: pair(null),
        deck: pair(null),

        // Purchase Details
        date: null,
        qtyNeeded: 0,
        qtyAcquired: 0,
        unitCost: 0,
        totalCost: 0,
      };
    },
    computed: {
      payload () {
        return {
          code: this.sanitizeCode(this.code),
          name: this.name.value,
          deck: this.deck.value,
          date: Timestamp.fromDate(new Date(this.date)),
          qtyNeeded:  this.qtyNeeded,
          qtyAcquired: this.qtyAcquired,
          amtSpent: this.totalCost,
        };
      },
    },
    methods: {
      async initialize (v) {
        await this.getDeckList();
        this.code = v?.code ?? null;
        updatePair(this.deck, v?.deck ?? null);
        updatePair(this.name, v?.name  ?? null);
        this.date = new Date();
        this.qtyNeeded = 0;
        this.qtyAcquired = 0;
        this.unitCost = 0;
        this.totalCost = 0;
      },

      async getDeckList () {
        try {
          this.deckList = await getDeckList();
        } catch (error) {
          console.log(error);
        }
      },

      async addDeck (payload) {
        try {
          await addDeck(payload);
          await this.getDeckList();
        } catch (error) {
          console.log(error);
        }
      },

      sanitizeCode (code) {
      // Hint: Code must match OPTCG card code structure (e.g. OP01-023)
        const result = code.toUpperCase();
        const regex = /^[A-Z]+(\d{2})?-\d{3}$/;
        console.log(regex);
        return result;
      },

      updateTotal () {
        this.totalCost = this.unitCost * this.qtyAcquired;
      },
    },
  };
};