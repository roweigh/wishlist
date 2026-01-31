<script>
import { Timestamp } from 'firebase/firestore';
import { pair, updatePair } from '@/utils/form-utils';

import {
  getCardHistory,
  updateHistory,
  removeHistory,
} from '@/api/wishlist';

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
      name: null,
      price: 0,
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
      this.qtyAcquired.initial !== this.qtyAcquired.value
    );},
  },
  watch: {
    modelValue: {
      deep: true,
      immediate: true,
      async handler(v) {
        if (v) {
          this.title = this.newEntry ? 'Add Bulk' : 'Update Bulk';
          this.code = v?.code ?? null;
          this.name = v?.name ?? null;
          updatePair(this.qtyNeeded, v?.qtyNeeded ?? 1);
          updatePair(this.qtyAcquired, v?.qtyAcquired ?? 0);

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
      const date = Timestamp.fromDate(new Date());
      const qtyNeeded = this.newEntry ? this.qtyNeeded.value : this.qtyNeeded.value - this.qtyNeeded.initial;

      const payload = {
        code: this.code,
        name: this.name,
        amtSpent: this.price,
        qtyAcquired: this.qtyAcquired.value - this.qtyAcquired.initial, // TODO This one should be BE's job
        qtyNeeded,
        date,
      };

      await this.updatePurchaseHistory();
      (this.changed || this.price) && this.$emit('add', payload);
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
      <v-col cols="6">
        <v-text-field
          v-model="code"
          label="Code"
          density="compact"
          hide-details="auto"
          tile
        />
      </v-col>

      <v-col cols="6">
        <v-text-field
          v-model="name"
          label="Name"
          density="compact"
          hide-details="auto"
          tile
        />
      </v-col>

      <v-col cols="4">
        <v-number-input
          v-model="qtyNeeded.value"
          :min="1"
          label="Quantity Needed"
          density="compact"
          hide-details="auto"
          tile
        />
      </v-col>

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