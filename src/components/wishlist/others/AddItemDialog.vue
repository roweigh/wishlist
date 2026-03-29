<script>
import ReceiptMixin from '@/mixins/ReceiptMixin';

export default {
  mixins: [
    ReceiptMixin(),
  ],
  props: {
    modelValue: { type: null, default: false },
  },
  emits: [
    'update:model-value',
    'add',
    'update',
    'refresh',
  ],
  methods: {
    generatePayload () {
      return {
        name: this.name.value,
        date: this.toTimestamp(this.date.value),
        unitCost: this.unitCost.value,
      };
    },
  },
};
</script>

<template>
  <base-dialog
    :model-value="modelValue"
    :loading="loadingFlags.loading"
    title="Add Item"
    @submit="add()"
    @update:model-value="$emit('update:model-value', $event)"
  >
    <v-col>
      <v-row>
        <paired-text-field
          v-model="name.value"
          label="Name"
        />
        <paired-date-picker
          v-model="date.value"
          label="Date"
        />
        <paired-number-input
          v-model="unitCost.value"
          label="Price"
          type="dollar"
        />
      </v-row>
    </v-col>
  </base-dialog>
</template>