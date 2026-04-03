// Receipt Mixin used to handle any purchases with a time entry
import { Timestamp } from 'firebase/firestore';
import { pair } from '@/utils/form-utils';

export default ({
  title,
}) => {
  return {
    emits: [
      'add',
      'update',
    ],
    data () {
      return {
        loadingFlags: {
          initializing: true,
          loading: true,
        },

        code: null,
        name: pair(null), // Item details
        date: pair(new Date()), // Purchase details
        qty: pair(0),
        unitCost: pair(0),
        totalCost: pair(0),
      };
    },
    computed: {
      id () { return this.modelValue?.id; },
      titleComputed () { return `${this.id ? 'Update' : 'Add'} ${title}`; },
    },
    watch: {
      modelValue: {
        deep: true,
        immediate: true,
        async handler (v) {
          if (v) {
            this.initialize && await this.initialize(v);
            this.loadingFlags.initializing = false;
            this.loadingFlags.loading = false;
          }
        },
      },
    },
    methods: {
      handleSubmit () {
        this.loadingFlags.loading = true;
        const payload = this.generatePayload();
        if (this.id) {
          this.$emit('update', payload);
        } else {
          this.$emit('add', payload);
        }
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