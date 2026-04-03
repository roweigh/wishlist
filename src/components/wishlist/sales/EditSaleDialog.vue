<script>
import { updatePair } from '@/utils/form-utils';
import PurchaseMixin from '@/mixins/PurchaseMixin';

export default {
  mixins: [
    PurchaseMixin({
      title: 'Receipt',
    }),
  ],
  props: {
    modelValue: { type: null, default: false },
  },
  emits: [
    'update:model-value',
  ],
  data () {
    return {
      alternateArt: false,
    };
  },
  computed: {
    alternateArtComputed () {
      return this.modelValue?.code?.endsWith('*');
    },
  },
  methods: {
    // Populate required fields
    initialize (v) {
      const date = v?.date ? new Date(v?.date.seconds * 1000) : new Date();
      const totalCost = v?.amtSpent * -1;
      const code = v.code ?? null;
      if (code?.endsWith('*')) {
        this.code = code.slice(0, -1);
        this.alternateArt = true;
      } else {
        this.code = code;
        this.alternateArt = false;
      }

      updatePair(this.date, date);
      updatePair(this.name, v?.name ?? null);
      updatePair(this.qty, v?.qty ?? 1);
      updatePair(this.totalCost, isNaN(totalCost) ? 0 : totalCost);
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
    :title="titleComputed"
    width="40vw"
    @submit="handleSubmit()"
    @update:model-value="$emit('update:model-value', $event)"
  >
    <v-col>
      <v-row>
        <paired-text-field
          v-model="code"
          label="Code"
          cols="3"
        />

        <paired-text-field
          v-model="name.value"
          :initial="name.initial"
          label="Name"
          cols="7"
        />

        <v-checkbox
          :model-value="alternateArtComputed"
          label="Alternate Art"
          density="compact"
          cols="2"
          hide-details
        />

        <paired-date-picker
          v-model="date.value"
          label="Date"
        />
        <paired-number-input
          v-model="qty.value"
          :initial="qty.initial"
          label="Quantity"
          cols="6"
        />
        <paired-number-input
          v-model="totalCost.value"
          :initial="totalCost.initial"
          label="Total Price"
          type="dollar"
          cols="6"
          @update:model-value="unitCost.value = 0"
        />
      </v-row>
    </v-col>
  </base-dialog>
</template>