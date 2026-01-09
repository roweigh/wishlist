<script>
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
  emits: ['update:model-value'],
  data () {
    return {
      qtyAcquired: pair(0),
      qtyNeeded: pair(0),
      date: pair(null),
    };
  },
  computed: {
    changed () {
      return (
        this.date.value !== this.date.initial ||
        this.qtyNeeded.value !== this.qtyNeeded.initial ||
        this.qtyAcquired.value !== this.qtyAcquired.initial
      );
    },
  },
  watch: {
    // Track which history entry to update
    changed (v) {
      const result = { ...this.modelValue };
      const payload = {
        qtyAcquired:  this.qtyAcquired.value,
        qtyNeeded:  this.qtyNeeded.value,
        date: this.date.value,
        id: this.item.id,
      };

      if (v) {
        result[this.item.id] = payload;
      } else {
        delete result[this.item.id];
      }

      this.$emit('update:model-value', result);
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
  </flex-row>
</template>