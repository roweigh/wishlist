<script>
import { updatePair } from '@/utils/form-utils';
import PurchaseMixin from '@/mixins/PurchaseMixin';

export default {
  mixins: [
    PurchaseMixin({
      title: 'Item',
    }),
  ],
  props: {
    modelValue: { type: [Object, Boolean], default: false },
  },
  emits: [
    'update:model-value',
  ],
  methods: {
    // Populate required fields
    initialize (v) {
      const date = v?.date ? new Date(v?.date.seconds * 1000) : new Date();
      updatePair(this.date, date);
      updatePair(this.name, v?.name ?? null);
      updatePair(this.qty, v?.qty ?? 0);
      updatePair(this.totalCost, v?.amtSpent ?? 0);
    },

    // Extract fields into payload object
    generatePayload () {
      return {
        name: this.name.value,
        date: this.toTimestamp(this.date.value),
        amtSpent: this.totalCost.value,
      };
    },
  },
};
</script>

<template>
  <base-dialog
    :model-value="modelValue"
    :loading="loadingFlags.loading"
    :title="titleComputed"
    @submit="handleSubmit()"
    @update:model-value="$emit('update:model-value', $event)"
  >
    <v-col>
      <v-row>
        <paired-text-field
          v-model="name.value"
          :initial="name.initial"
          label="Name"
        />
        <paired-date-picker
          v-model="date.value"
          :initial="date.initial"
          label="Date"
        />
        <paired-number-input
          v-model="totalCost.value"
          :initial="totalCost.initial"
          label="Price"
          type="dollar"
        />
      </v-row>
    </v-col>
  </base-dialog>
</template>