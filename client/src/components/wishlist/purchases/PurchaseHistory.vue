<script>
import ReceiptRow from './ReceiptRow.vue';

export default {
  components: {
    ReceiptRow,
  },
  props: {
    modelValue: { type: null, required: true },
    history: { type: null, required: true },
  },
  emits:[
    'update:model-value',
    'remove',
  ],
};
</script>

<template>
  <v-card
    variant="outlined"
    title="Receipts"
    class="mb-4"
    style="height: 100%"
  >
    <v-card-text style="height: 100%">
      <receipt-row
        v-for="item in history"
        :key="item.id"
        :model-value="changedHistory"
        :item="item"
        @update:model-value="$emit('update:model-value', $event)"
        @remove="$emit('remove', $event)"
      />
    </v-card-text>
  </v-card>
</template>