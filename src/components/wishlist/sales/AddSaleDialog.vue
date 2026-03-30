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
  data () {
    return {
      code: null,
      alternateArt: false,
    };
  },
  methods: {
    initialize () {
      this.code = null;
      this.alternateArt = false;
    },
    generatePayload () {
      let code = this.sanitizeCode(this.code);
      if (this.alternateArt) {
        code +='*';
      }

      return {
        code,
        name: this.name.value,
        date: this.toTimestamp(this.date.value),
        qty:  this.qty.value,
        amtSpent: this.totalCost.value * -1,
      };
    },
  },
};
</script>

<template>
  <base-dialog
    :model-value="modelValue"
    :loading="loadingFlags.loading"
    title="Add Receipt"
    width="50vw"
    @submit="add()"
    @update:model-value="$emit('update:model-value', $event)"
  >
    <v-col>
      <v-row>
        <paired-text-field
          v-model="code"
          label="Code"
          cols="2"
        />

        <paired-text-field
          v-model="name.value"
          label="Name"
          cols="8"
        />

        <v-checkbox
          v-model="alternateArt"
          label="Alternate Art"
          density="compact"
          cols="2"
          hide-details
        />

        <paired-date-picker
          v-model="date.value"
          label="Date"
          cols="6"
        />
        <paired-number-input
          v-model="qty.value"
          label="Quantity"
          cols="6"
          @update:model-value="updateTotal()"
        />
        <paired-number-input
          v-model="unitCost.value"
          label="Unit Price"
          type="dollar"
          cols="6"
          @update:model-value="updateTotal()"
        />
        <paired-number-input
          v-model="totalCost.value"
          label="Total Price"
          type="dollar"
          cols="6"
          @update:model-value="unitCost.value = 0"
        />
      </v-row>
    </v-col>
  </base-dialog>
</template>