<script>
import {
  getDeckList,
  addDeck,
} from '@/api/purchases';

import PurchaseMixin from '@/mixins/PurchaseMixin';
import DeckInput from '../purchases/DeckInput.vue';

export default {
  components: {
    DeckInput,
  },
  mixins: [
    PurchaseMixin({
      title: 'Card',
    }),
  ],
  props: {
    modelValue: { type: Boolean, default: false },
  },
  emits: [
    'update:model-value',
    'add',
    'update',
    'refresh',
  ],
  data () {
    return {
      alternateArt: false,
      newDeck: false,
      deckList: [],

      deck: null,
      qtyNeeded: 0,
    };
  },
  methods: {
    async initialize () {
      await this.getDeckList();
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

    generatePayload () {
      let code = this.sanitizeCode(this.code);
      if (this.alternateArt) {
        code +='*';
      }

      return {
        code,
        qtyNeeded:  this.qtyNeeded,
        deck: this.deck,
        name: this.name.value,
        date: this.toTimestamp(this.date.value),
        qtyAcquired: this.qty.value,
        amtSpent: this.totalCost.value,
      };
    },

    async submit () {
      this.loadingFlags.loading = true;
      const payload = this.generatePayload();
      this.newDeck && await this.addDeck({ name: this.deck.value });
      this.$emit('add', payload);
    },
  },
};
</script>

<template>
  <base-dialog
    :model-value="modelValue"
    :initializing="loadingFlags.initializing"
    :loading="loadingFlags.loading"
    title="Add Bulk"
    width="50vw"
    @submit="submit()"
    @update:model-value="$emit('update:model-value', $event)"
  >
    <v-row>
      <v-col>
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

              <deck-input
                v-model="deck"
                v-model:add-deck="newDeck"
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
                v-model="qtyNeeded"
                :min="0"
                label="Quantity Needed"
                cols="6"
              />
              <paired-number-input
                v-model="qty.value"
                label="Quantity Acquired"
                cols="6"
                @update:model-value="updateTotal()"
              />
              <paired-number-input
                v-model="unitCost.value"
                label="Unit Cost"
                type="dollar"
                cols="6"
                @update:model-value="updateTotal()"
              />
              <paired-number-input
                v-model="totalCost.value"
                label="Total Cost"
                type="dollar"
                cols="6"
                @update:model-value="unitCost.value = 0"
              />
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </base-dialog>
</template>