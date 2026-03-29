<script>
import {
  getCardHistory,
  updateHistory,
  removeHistory,
} from '@/api/purchases';

import DeckInput from '../purchases/DeckInput.vue';
import PurchaseHistory from '../purchases/PurchaseHistory.vue';
import BulkDialogMixin from '@/mixins/BulkDialogMixin';

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
  computed: {
    alternateArtComputed () {
      return this.modelValue.code.endsWith('*');
    },
    codeComputed () {
      let code = this.modelValue.code;
      if (code.endsWith('*')) {
        code = code.slice(0, -1);
      }
      return code;
    },
  },
  watch: {
    modelValue: {
      deep: true,
      immediate: true,
      async handler(v) {
        if (v) {
          this.loadingFlags.initializing = true;
          await Promise.all([
            this.initialize(v),
            this.getPurchaseHistory(),
          ]);
          this.loadingFlags.initializing = false;
          this.loadingFlags.loading = false;
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
      this.loadingFlags.loading = true;
      await Promise.all([
        this.updatePurchaseHistory(),
        this.newDeck && this.addDeck({ name: this.deck.value }),
      ]);

      if (this.payload.qtyAcquired || this.payload.qtyNeeded) {
        this.$emit('add', this.payload);
      } else {
        this.$emit('update', this.payload);
        this.$emit('refresh');
        this.loadingFlags.loading = false;
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
    </v-row>
  </base-dialog>
</template>