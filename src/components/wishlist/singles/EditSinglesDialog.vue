<script>
import { pair, updatePair } from '@/utils/form-utils';
import {
  getDeckList,
  addDeck,
  getCardHistory,
  updateCard,
  removeHistory,
} from '@/api/purchases';

import DeckInput from '../purchases/DeckInput.vue';
import PurchaseHistory from '../purchases/PurchaseHistory.vue';
import PurchaseMixin from '@/mixins/PurchaseMixin';

export default {
  components: {
    DeckInput,
    PurchaseHistory,
  },
  mixins: [
    PurchaseMixin({
      title: 'Card',
    }),
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
      history: [],
      changedHistory: {},

      alternateArt: null,
      newDeck: false,
      deckList: [],

      code: null,
      deck: pair(null),
      qtyNeeded: pair(0),
    };
  },
  computed: {
    alternateArtComputed () {
      let code = this.modelValue.code;
      return code && this.modelValue.code.endsWith('*');
    },
    codeComputed () {
      let code = this.modelValue.code;
      if (code && code.endsWith('*')) {
        code = code.slice(0, -1);
      }
      return code;
    },
  },
  methods: {
    async initialize (v) {
      const date = v?.date ? new Date(v?.date.seconds * 1000) : new Date();
      const code = v.code ?? null;
      if (code?.endsWith('*')) {
        this.code = code.slice(0, -1);
        this.alternateArt = true;
      } else {
        this.code = code;
        this.alternateArt = false;
      }

      this.items = [];
      updatePair(this.date, date);
      updatePair(this.deck, v?.deck);
      updatePair(this.name, v?.name ?? null);
      updatePair(this.qtyNeeded, 0);
      updatePair(this.qty, 0);
      updatePair(this.totalCost, 0);
      await this.getDeckList();
      await this.getReceipts(v.code);
    },

    async getDeckList () {
      try {
        this.deckList = await getDeckList();
      } catch (error) {
        console.log(error);
      }
    },

    async addDeck (payload) {
      try {
        await addDeck(payload);
        await this.getDeckList();
      } catch (error) {
        console.log(error);
      }
    },

    async getReceipts (id) {
      this.history = await getCardHistory(id).then(result => result.sort((a,b) => b.date - a.date));
    },

    // Update each changed row entry
    async updateReceipts () {
      const promises = Object.entries(this.changedHistory).map(([id, payload]) => {
        updateCard(id, payload);
      });
      await Promise.all(promises);
    },

    async removeReceipt (id) {
      await removeHistory(id);
      await this.getReceipts(this.modelValue.code);
      this.$emit('refresh');
    },

    generatePayload () {
      let code = this.sanitizeCode(this.codeComputed);
      if (this.alternateArt) {
        code +='*';
      }

      return {
        code,
        name: this.name.value,
        deck: this.deck.value,
        date: this.toTimestamp(this.date.value),
        qtyNeeded:  this.qtyNeeded.value,
        qtyAcquired: this.qty.value,
        amtSpent: this.totalCost.value,
      };
    },

    /**
     * TODO Explain better
     * Update any purchase history rows that have changed, then submit single card payload information
     * Send difference in qty as we are logging history - so it can do math in the BE
     */
    async submit () {
      this.loadingFlags.loading = true;
      await Promise.all([
        this.updateReceipts(),
        this.newDeck && this.addDeck({ name: this.deck.value }),
      ]);

      const payload = this.generatePayload();
      if (payload.qtyAcquired || payload.qtyNeeded) {
        this.$emit('add', payload);
      } else {
        payload.qtyNeeded = this.qtyNeeded = 0;
        payload.qtyAcquired = this.qty.initial;
        this.$emit('update', payload);
        this.$emit('refresh');
      }
    },
  },
};
</script>

<template>
  <base-dialog
    :model-value="modelValue"
    :initializing="loadingFlags.initializing"
    :loading="loadingFlags.loading"
    title="Update Bulk"
    width="60vw"
    @submit="submit()"
    @update:model-value="$emit('update:model-value', $event)"
  >
    <v-row>
      <v-col :cols="6">
        <v-card
          variant="outlined"
          title="Card Details"
          class="mb-4"
        >
          <v-card-text>
            <v-row>
              <paired-text-field
                v-model="codeComputed"
                label="Code"
                cols="4"
                readonly
              />

              <paired-text-field
                v-model="name.value"
                :initial="name.initial"
                label="Name"
                cols="8"
              />

              <v-checkbox
                :model-value="alternateArtComputed"
                label="Alternate Art"
                density="compact"
                class="mx-3"
                hide-details
                readonly
              />

              <deck-input
                v-model="deck.value"
                v-model:add-deck="newDeck"
                :initial="deck.initial"
                :deck-list="deckList"
              />
            </v-row>
          </v-card-text>
        </v-card>

        <v-card
          variant="outlined"
          title="Order Details"
        >
          <v-card-text>
            <v-row>
              <paired-date-picker
                v-model="date.value"
                label="Purchase Date"
              />
              <paired-number-input
                v-model="qtyNeeded.value"
                :initial="qtyNeeded.initial"
                :min="0"
                label="Quantity Needed"
                cols="6"
              />
              <paired-number-input
                v-model="qty.value"
                :initial="qty.initial"
                label="Quantity Acquired"
                cols="6"
                @update:model-value="updateTotal()"
              />
              <paired-number-input
                v-model="unitCost.value"
                :initial="unitCost.initial"
                label="Unit Cost"
                type="dollar"
                cols="6"
                @update:model-value="updateTotal()"
              />
              <paired-number-input
                v-model="totalCost.value"
                :initial="totalCost.initial"
                label="Total Cost"
                type="dollar"
                cols="6"
                @update:model-value="unitCost.value = 0"
              />
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col :cols="6">
        <purchase-history
          v-model="changedHistory"
          :history="history"
          @remove="removeReceipt($event)"
        />
      </v-col>
    </v-row>
  </base-dialog>
</template>