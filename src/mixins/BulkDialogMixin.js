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
          loading: false,
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
      changed () {
        return (
          this.qtyNeeded.initial !== this.qtyNeeded.value ||
          this.qtyAcquired.initial !== this.qtyAcquired.value ||
          this.deck.initial !== this.deck.value ||
          this.name.initial !== this.name.value
        );
      },
    },
    methods: {
      async initialize (v) {
        await this.getDeckList();
        this.code = v?.code ?? null;
        updatePair(this.deck, v?.deck ?? null);
        updatePair(this.name, v?.name  ?? null);
        this.date = new Date();
        this.unitCost = 0;
        this.totalCost = 0;
        this.qtyNeeded = 0;
        this.qtyAcquired = 0;
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

      generatePayload () {
        return {
          code: this.sanitizeCode(this.code),
          amtSpent: this.totalCost,
          name: this.name.value,
          deck: this.deck.value,
          qtyAcquired: this.qtyAcquired,
          qtyNeeded:  this.qtyNeeded,
          date: Timestamp.fromDate(new Date(this.date)),
        };
      },

      sanitizeCode (code) {
      // Hint: Code must match OPTCG card code structure (e.g. OP01-023)
        const result = code.toUpperCase();
        const regex = /^[A-Z]+(\d{2})?-\d{3}$/;
        console.log(regex);
        return result;
      },

      updateTotal () {
        this.totalCost = this.unitCost * this.qtyAcquired.value;
      },
    },
  };
};