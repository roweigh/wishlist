<script>
import DeckInput from '../purchases/DeckInput.vue';
import BulkDialogMixin from '@/mixins/BulkDialogMixin';

export default {
  components: {
    DeckInput,
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
  watch: {
    modelValue: {
      deep: true,
      immediate: true,
      async handler(v) {
        if (v) {
          this.loadingFlags.initializing = true;
          await this.initialize(v);
          this.loadingFlags.initializing = false;
        }
      },
    },
  },
  methods: {
    async submit () {
      if (this.newDeck) {
        await this.addDeck({ name: this.deck.value });
      }
      const payload = this.generatePayload();
      this.$emit('add', payload);
      this.$emit('refresh');
    },
  },
};
</script>

<template>
  <base-dialog
    :model-value="modelValue"
    :initializing="loadingFlags.initializing"
    title="Add Bulk"
    width="40vw"
    @submit="submit()"
    @update:model-value="$emit('update:model-value', $event)"
  >
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
              cols="4"
            />

            <paired-text-field
              v-model="name.value"
              label="Name"
              cols="8"
            />

            <deck-input
              v-model="deck.value"
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
  </base-dialog>
</template>