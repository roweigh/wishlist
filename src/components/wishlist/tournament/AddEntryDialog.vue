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
  ],
  methods: {
    generatePayload () {
      return this.date.value.map(dateValue => ({
        date: this.toTimestamp(dateValue),
        cost: this.unitCost.value,
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
    @submit="add()"
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
          v-model="unitCost.value"
          label="Entry Fee"
          type="dollar"
        />
      </template>
    </v-date-picker>
  </base-dialog>
</template>