<script>
import { Timestamp } from 'firebase/firestore';

// Editable purchase entry
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
        this.qtyAcquired.value !== this.qtyAcquired.initial
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
            qtyNeeded:  this.qtyNeeded.value,
            qtyAcquired:  this.qtyAcquired.value,
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
    updatePair(this.date, this.item?.date ?? null);
    updatePair(this.qtyNeeded, this.item?.qtyNeeded ?? 0);
    updatePair(this.qtyAcquired, this.item?.qtyAcquired ?? 0);
  },
};
</script>

<template>
  <flex-row class="grow">
    <v-text-field
      v-model="date.value"
      density="compact"
      hide-details
      tile
    />
    <v-number-input
      v-model="qtyNeeded.value"
      density="compact"
      hide-details
      tile
    />
    <v-number-input
      v-model="qtyAcquired.value"
      density="compact"
      hide-details
      tile
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