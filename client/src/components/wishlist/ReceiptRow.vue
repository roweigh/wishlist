<script>
// Editable purchase entry
import { Timestamp } from 'firebase/firestore';
import {
  pair,
  updatePair,
} from '@/utils/form-utils';

export default {
  props: {
    modelValue: { type: null, default: false },
    item: { type: null, default: false },
  },
  emits: [
    'update:model-value',
    'remove',
  ],
  data () {
    return {
      amtSpent: pair(0),
      qtyAcquired: pair(0),
      qtyNeeded: pair(0),
      date: pair(null),
    };
  },
  computed: {
    updateTrigger () {
      const changed = (
        this.date.value !== this.date.initial ||
        this.qtyNeeded.value !== this.qtyNeeded.initial ||
        this.qtyAcquired.value !== this.qtyAcquired.initial ||
        this.amtSpent.value !== this.amtSpent.initial
      );

      return {
        changed,
        qtyAcquired: this.qtyAcquired.value,
        qtyNeeded: this.qtyNeeded.value,
        date: this.date.value,
      };
    },
  },
  watch: {
    // Track which history entry to update on submit - omit the unchanged ones
    updateTrigger: {
      deep: true,
      handler(v) {
        const result = { ...this.modelValue };

        if (v) {
          const payload = {
            ...this.item,
            date: Timestamp.fromDate(new Date(this.date.value)),
            qtyNeeded: this.qtyNeeded.value,
            qtyAcquired: this.qtyAcquired.value,
            amtSpent: this.amtSpent.value,
          };
          result[this.item.id] = payload;
        } else {
          delete result[this.item.id];
        }

        this.$emit('update:model-value', result);
      },
    },
  },

  // Initialize values
  mounted () {
    const ts = this.item.date;
    const date = new Date(ts?.seconds * 1000 + ts?.nanoseconds / 1_000_000);

    updatePair(this.date, date ?? null);
    updatePair(this.amtSpent, this.item?.amtSpent ?? 0);
    updatePair(this.qtyNeeded, this.item?.qtyNeeded ?? 0);
    updatePair(this.qtyAcquired, this.item?.qtyAcquired ?? 0);
  },
};
</script>

<template>
  <flex-row class="grow">
    <paired-date-picker
      v-model="date.value"
      label="Purchase Date"
    />
    <paired-number-input
      v-model="qtyAcquired.value"
      label="Quanty Acquired"
      padding="0"
      cols="3"
    />
    <paired-number-input
      v-model="amtSpent.value"
      type="dollar"
      label="Price"
      padding="0"
      cols="3"
    />
    <v-btn
      icon="mdi-delete"
      density="comfortable"
      class="ma-auto"
      variant="text"
      @click="$emit('remove', item.id)"
    />
  </flex-row>
</template>