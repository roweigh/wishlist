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
  addDeck,
} from '@/api/purchases';

import ReceiptRow from './purchases/ReceiptRow.vue';
import AddDeckDialog from './AddDeckDialog.vue';
import PurchaseHistory from './purchases/PurchaseHistory.vue';

export default {
  components: {
    ReceiptRow,
    AddDeckDialog,
    PurchaseHistory,
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
        initializing: true,
        loading: false,
      },
      overlayFlags: {
        deck: false,
      },

      showHistory: false,
      history: [],
      changedHistory: {},

      deck: pair(null),
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
      this.deck.initial !== this.deck.value ||
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
          this.loadingFlags.initializing = true;
          this.showHistory = false;

          this.code = v?.code ?? null;
          updatePair(this.deck, v?.deck ?? null);
          updatePair(this.name, v?.name  ?? null);
          updatePair(this.qtyNeeded, 0);
          this.date = new Date();
          this.price = 0;
          v?.code && await this.getPurchaseHistory().then(() => { this.showHistory = true; });
          await this.getDeckList();
        }

        this.loadingFlags.initializing = false;
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
        deck: this.deck.value,
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

    async getDeckList () {
      try {
        this.deckList = await getDeckList();
      } catch (error) {
        //
      }
    },

    async addDeck (payload) {
      try {
        await addDeck(payload);
        await this.getDeckList();
        this.overlayFlags.deck = false;
      } catch (error) {
        //
      }
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
  <add-deck-dialog
    v-model="overlayFlags.deck"
    @add="addDeck($event)"
  />

  <base-dialog
    :model-value="modelValue"
    :initializing="loadingFlags.initializing"
    :title="title"
    width="60vw"
    @submit="submit()"
    @update:model-value="$emit('update:model-value', $event)"
  >
    <v-col :cols="6">
      <v-card
        variant="outlined"
        title="Card Details"
        class="mb-4"
      >
        <v-card-text>
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
              v-model="deck.value"
              :items="deckList"
              item-title="name"
              item-value="id"
              label="Deck"
              chips
            >
              <template #append>
                <v-btn
                  icon="mdi-plus"
                  density="compact"
                  variant="text"
                  @click="overlayFlags.deck = true"
                />
              </template>
            </paired-select>
          </v-row>
        </v-card-text>
      </v-card>

      <v-card
        variant="outlined"
        title="Purchase Details"
      >
        <v-card-text>
          <v-row>
            <paired-date-picker
              v-model="date"
              label="Purchase Date"
            />
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
              label="Unit Cost"
              type="dollar"
              cols="6"
            />
            <paired-number-input
              v-model="price"
              label="Total Cost"
              type="dollar"
              cols="6"
            />
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>

    <v-col :cols="6">
      <purchase-history
        v-model="changedHistory"
        :history="history"
        @remove="remove($event)"
      />
    </v-col>
  </base-dialog>
</template>