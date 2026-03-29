<script>
import SaleDialogMixin from '@/mixins/SaleDialogMixin';

export default {
  mixins: [
    SaleDialogMixin(),
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
  watch: {
    modelValue: {
      deep: true,
      immediate: true,
      handler(v) {
        if (v) {
          this.initialize(v);
          this.loadingFlags.initializing = false;
          this.loadingFlags.loading = false;
        }
      },
    },
  },
  methods: {
    async submit () {
      this.loadingFlags.loading = true;
      this.$emit('add', this.payload);
    },
  },
};
</script>

<template>
  <base-dialog
    :model-value="modelValue"
    :loading="loadingFlags.loading"
    title="Add Sale"
    @submit="submit()"
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
          v-model="date"
          label="Date"
          cols="6"
        />
        <paired-number-input
          v-model="qtySold"
          label="Quantity"
          cols="6"
          @update:model-value="updateTotal()"
        />
        <paired-number-input
          v-model="unitCost"
          label="Unit Price"
          type="dollar"
          cols="6"
          @update:model-value="updateTotal()"
        />
        <paired-number-input
          v-model="totalCost"
          label="Total Price"
          type="dollar"
          cols="6"
          @update:model-value="unitCost = 0"
        />
      </v-row>
    </v-col>
  </base-dialog>
</template>