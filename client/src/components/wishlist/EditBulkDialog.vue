<script>
import { pair, updatePair } from '@/utils/form-utils';
import {
  Timestamp,
} from 'firebase/firestore';
import {
  getCardHistory,
  updateHistory,
  removeHistory,
} from '@/api/purchases';

import ReceiptRow from './ReceiptRow.vue';

export default {
  components: {
    ReceiptRow,
  },
  props: {
    modelValue: { type: null, default: false },
  },
  emits: [
    'update:model-value',
  ],
  data () {
    return {
      title: 'Add Bulk',

      // Form inputs
      code: null,
      price: 0,
      date: null,
      name: pair(null),
      qtyNeeded: pair(0),
      qtyAcquired: pair(0),

      history: [],
      changedHistory: {},
    };
  },
  computed: {
    newEntry () { return !this.modelValue?.code; },
    changed () { return (
      this.qtyNeeded.initial !== this.qtyNeeded.value ||
      this.qtyAcquired.initial !== this.qtyAcquired.value ||
      this.name.initial !== this.name.value
    );},
  },
  watch: {
    modelValue: {
      deep: true,
      immediate: true,
      async handler(v) {
        updatePair(this.qtyAcquired, this.qtyAcquired.initial);
        if (v) {
          this.title = this.newEntry ? 'Add Bulk' : 'Update Bulk';
          this.code = v?.code ?? null;
          updatePair(this.name, v?.name  ?? null);
          updatePair(this.qtyNeeded, 0);
          this.date = new Date();
          this.price = 0;
          v?.code && await this.getPurchaseHistory();
        }
      },
    },
  },
  methods: {
    async getPurchaseHistory () {
      this.history = await getCardHistory(this.modelValue.code).then(result => result.sort((a,b) => b.date - a.date));
    },

    async remove (id) {
      await removeHistory(id);
      await this.getPurchaseHistory();
    },

    // Update each changed row entry
    async updatePurchaseHistory () {
      const promises = Object.entries(this.changedHistory).map(([id, payload]) => {
        updateHistory(id, payload);
      });
      await Promise.all(promises);
    },

    /**
     * TODO Explain better
     * Update any purchase history rows that have changed, then submit single card payload information
     * Send difference in qty as we are logging history - so it can do math in the BE
     */
    async submit () {
      const payload = {
        code: this.sanitizeCode(this.code),
        amtSpent: this.price,
        name: this.name.value,
        qtyAcquired: this.qtyAcquired.value,
        qtyNeeded:  this.qtyNeeded.value,
        date: Timestamp.fromDate(new Date(this.date)),
      };
      await this.updatePurchaseHistory();
      if (this.changed) {
        if (this.qtyAcquired) {
          this.$emit('add', payload);
        } else {
          this.$emit('update', payload);
        }
      }

      this.$emit('refresh');
    },

    sanitizeCode (code) {
      // Hint: Code must match OPTCG card code structure (e.g. OP01-023)
      const result = code.toUpperCase();
      const regex = /^[A-Z]+(\d{2})?-\d{3}$/;
      return result;
    },
  },
};
</script>

<template>
  <base-dialog
    :model-value="modelValue"
    :title="title"
    @submit="submit()"
    @update:model-value="$emit('update:model-value', $event)"
  >
    <v-row>
      <paired-text-field
        v-model="code"
        label="Code"
        cols="4"
      />

      <paired-text-field
        v-model="name.value"
        label="Name"
        cols="8"
      />

      <paired-number-input
        v-model="qtyNeeded.value"
        :min="0"
        label="Quantity Needed"
        cols="4"
      />

      <paired-number-input
        v-model="qtyAcquired.value"
        :min="0"
        label="Quantity Acquired"
        cols="4"
      />

      <paired-number-input
        v-model="price"
        type="dollar"
        label="Price"
        cols="4"
      />
    </v-row>

    <v-row>
      <paired-date-picker
        v-model="date"
        label="Purchase Date"
      />
    </v-row>

    <template v-if="!newEntry">
      <v-row>
        <v-card-title class="mb-3">
          History
        </v-card-title>
      </v-row>

      <template
        v-for="item in history"
        :key="item.id"
      >
        <receipt-row
          v-model="changedHistory"
          :item="item"
          @remove="remove($event)"
        />
      </template>
    </template>
  </base-dialog>
</template>