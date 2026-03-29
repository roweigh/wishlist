import { Timestamp } from 'firebase/firestore';
import { pair, updatePair } from '@/utils/form-utils';

export default () => {
  return {
    data () {
      return {
        loadingFlags: {
          initializing: true,
          loading: true,
        },

        // Card Details
        alternateArt: false,
        code: null,
        name: pair(null),
        date: null,
        qtySold: 0,
        unitCost: 0,
        totalCost: 0,
      };
    },
    computed: {
      payload () {
        let code = this.sanitizeCode(this.code);
        if (this.alternateArt) {
          code +='*';
        }

        return {
          code,
          name: this.name.value,
          date: Timestamp.fromDate(new Date(this.date)),
          qtySold: this.qtySold,
          amtSpent: this.totalCost * -1,
        };
      },
    },
    methods: {
      async initialize (v) {
        this.code = v?.code ?? null;
        updatePair(this.name, v?.name  ?? null);
        this.date = new Date();
        this.qtySold = 0;
        this.unitCost = 0;
        this.totalCost = 0;
      },

      sanitizeCode (code) {
      // Hint: Code must match OPTCG card code structure (e.g. OP01-023)
        const result = code.toUpperCase();
        const regex = /^[A-Z]+(\d{2})?-\d{3}$/;
        console.log(regex);
        return result;
      },

      updateTotal () {
        this.totalCost = this.unitCost * this.qtySold;
      },
    },
  };
};