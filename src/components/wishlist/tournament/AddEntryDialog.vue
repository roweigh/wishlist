<script>
import { updatePair } from '@/utils/form-utils';
import PurchaseMixin from '@/mixins/PurchaseMixin';

export default {
  mixins: [
    PurchaseMixin({
      title: 'Entry',
    }),
  ],
  props: {
    modelValue: { type: Boolean, default: false },
  },
  emits: [
    'update:model-value',
  ],
  methods: {
    // Populate required fields
    initialize () {
      updatePair(this.date, []);
      updatePair(this.totalCost, 0);
    },
    generatePayload () {
      return this.date.value.map(dateValue => ({
        date: this.toTimestamp(dateValue),
        amtSpent: this.totalCost.value,
      }));
    },
  },
};
</script>

<template>
  <base-dialog
    :model-value="modelValue"
    :loading="loadingFlags.loading"
    title="Register Entry Fee"
    @submit="handleSubmit()"
    @update:model-value="$emit('update:model-value', $event)"
  >
    <v-date-picker
      v-model="date.value"
      class="ma-auto"
      width="450"
      show-adjacent-months
      multiple
      hide-title
    >
      <template #actions>
        <paired-number-input
          v-model="totalCost.value"
          label="Entry Fee"
          type="dollar"
        />
      </template>
    </v-date-picker>
  </base-dialog>
</template>