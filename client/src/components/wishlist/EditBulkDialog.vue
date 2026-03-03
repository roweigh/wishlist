<script>
import { Timestamp } from 'firebase/firestore';
import {
  pair,
  updatePair,
} from '@/utils/form-utils';

import {
  getCardHistory,
  updateHistory,
  removeHistory,
  getDeckList,
} from '@/api/purchases';

import ReceiptRow from './ReceiptRow.vue';
import AddDeckDialog from './AddDeckDialog.vue';

export default {
  components: {
    ReceiptRow,
    AddDeckDialog,
  },
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
      title: 'Add Bulk',
      loadingFlags: {
        initialising: true,
        loading: false,
      },
      overlayFlags: {
        types: false,
      },

      showHistory: false,
      history: [],
      changedHistory: {},

      deck: null,
      deckList: [],

      // Form inputs
      code: null,
      price: 0,
      date: null,
      name: pair(null),
      qtyNeeded: pair(0),
      qtyAcquired: pair(0),
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
          this.loadingFlags.initialising = true;
          this.showHistory = false;

          this.code = v?.code ?? null;
          updatePair(this.name, v?.name  ?? null);
          updatePair(this.qtyNeeded, 0);
          this.date = new Date();
          this.price = 0;
          v?.code && await this.getPurchaseHistory().then(() => { this.showHistory = true; });
          await getDeckList().then((response) => this.deckList = response);
        }

        this.loadingFlags.initialising = false;
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
        deck: this.deck,
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
  <add-deck-dialog v-model="overlayFlags.types" />

  <base-dialog
    :model-value="modelValue"
    :title="title"
    @submit="submit()"
    @update:model-value="$emit('update:model-value', $event)"
  >
    <v-row v-if="loadingFlags.initialising">
      <v-progress-circular
        class="mx-auto my-12"
        size="200"
        indeterminate
      />
    </v-row>

    <template v-else>
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
        <paired-select
          v-model="deck"
          :items="deckList"
          item-title="name"
          item-value="id"
          label="Deck"
          cols="12"
          chips
        >
          <template #append>
            <v-btn
              icon="mdi-plus"
              density="compact"
              variant="text"
              @click="overlayFlags.types = true"
            />
          </template>
        </paired-select>

        <paired-number-input
          v-model="qtyNeeded.value"
          :min="0"
          label="Quantity Needed"
          cols="6"
        />

        <paired-number-input
          v-model="qtyAcquired.value"
          :min="0"
          label="Quantity Acquired"
          cols="6"
        />
        <paired-number-input
          v-model="price"
          type="dollar"
          label="Price"
          cols="6"
        />
        <paired-date-picker
          v-model="date"
          label="Purchase Date"
          cols="6"
        />
      </v-row>

      <v-row />

      <template v-if="showHistory">
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
    </template>
  </base-dialog>
</template>