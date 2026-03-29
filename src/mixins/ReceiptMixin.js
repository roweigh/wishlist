// Receipt Mixin used to handle any purchases with a time entry

import { Timestamp } from 'firebase/firestore';
import { pair, updatePair } from '@/utils/form-utils';

export default () => {
  return {
    emits: [
      'add',
    ],
    data () {
      return {
        loadingFlags: {
          initializing: true,
          loading: true,
        },
        // Item details
        name: pair(null),

        // Purchase details
        date: pair(null),
        qty: pair(0),
        unitCost: pair(0),
        totalCost: pair(0),
      };
    },
    watch: {
      modelValue: {
        deep: true,
        immediate: true,
        async handler (v) {
          if (v) {
            updatePair(this.name, v?.name ?? null);
            updatePair(this.date, v?.date ?? new Date());
            updatePair(this.qty, v?.qty ?? 0);
            updatePair(this.unitCost, v?.unitCost ?? 0);
            updatePair(this.totalCost, v?.totalCost ?? 0);

            this.initialize && await this.initialize();
            this.loadingFlags.initializing = false;
            this.loadingFlags.loading = false;
          }
        },
      },
    },
    methods: {
      add () {
        this.loadingFlags.loading = true;
        const payload = this.generatePayload();
        this.$emit('add', payload);
      },

      update () {
        this.loadingFlags.loading = true;
        const payload = this.generatePayload();
        this.$emit('update', payload);
      },

      toTimestamp (date) {
        return Timestamp.fromDate(new Date(date));
      },

      sanitizeCode (code) {
      // Hint: Code must match OPTCG card code structure (e.g. OP01-023)
        const result = code.toUpperCase();
        const regex = /^[A-Z]+(\d{2})?-\d{3}$/;
        console.log(regex);
        return result;
      },

      updateTotal () {
        this.totalCost.value = this.unitCost.value * this.qty.value;
      },
    },
  };
};