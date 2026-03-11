<script>
import BulkDialogMixin from '@/mixins/BulkDialogMixin';

import {
  getCardHistory,
  updateHistory,
  removeHistory,
} from '@/api/purchases';

import PurchaseHistory from '../purchases/PurchaseHistory.vue';
import DeckInput from '../purchases/DeckInput.vue';

export default {
  components: {
    DeckInput,
    PurchaseHistory,
  },
  mixins: [
    BulkDialogMixin(),
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
    };
  },
  watch: {
    modelValue: {
      deep: true,
      immediate: true,
      async handler(v) {
        if (v) {
          this.loadingFlags.initializing = true;
          this.history = [];
          await this.initialize(v);
          await this.getPurchaseHistory();
          this.loadingFlags.initializing = false;
        }
      },
    },
  },
  methods: {
    async getPurchaseHistory () {
      this.history = await getCardHistory(this.modelValue.code).then(result => result.sort((a,b) => b.date - a.date));
    },

    // Update each changed row entry
    async updatePurchaseHistory () {
      const promises = Object.entries(this.changedHistory).map(([id, payload]) => {
        updateHistory(id, payload);
      });
      await Promise.all(promises);
    },

    async remove (id) {
      await removeHistory(id);
      await this.getPurchaseHistory();
    },

    /**
     * TODO Explain better
     * Update any purchase history rows that have changed, then submit single card payload information
     * Send difference in qty as we are logging history - so it can do math in the BE
     */
    async submit () {
      await this.updatePurchaseHistory();
      if (this.newDeck) {
        await this.addDeck({ name: this.deck.value });
      }

      const payload = this.generatePayload();
      if (this.changed) {
        if (this.qtyAcquired) {
          this.$emit('add', payload);
        } else {
          this.$emit('update', payload);
        }
      }

      this.$emit('refresh');
    },
  },
};
</script>

<template>
  <base-dialog
    :model-value="modelValue"
    :initializing="loadingFlags.initializing"
    title="Update Bulk"
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
              readonly
            />

            <paired-text-field
              v-model="name.value"
              :initial="name.initial"
              label="Name"
              cols="8"
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
              v-model="date"
              label="Purchase Date"
            />
            <paired-number-input
              v-model="qtyNeeded"
              :min="0"
              label="Quantity Needed"
              cols="6"
            />
            <paired-number-input
              v-model="qtyAcquired"
              :min="0"
              label="Quantity Acquired"
              cols="6"
              @update:model-value="updateTotal()"
            />
            <paired-number-input
              v-model="unitCost"
              label="Unit Cost"
              type="dollar"
              cols="6"
              @update:model-value="updateTotal()"
            />
            <paired-number-input
              v-model="totalCost"
              label="Total Cost"
              type="dollar"
              cols="6"
              @update:model-value="unitCost = 0"
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