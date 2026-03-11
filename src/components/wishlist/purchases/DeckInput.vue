<script>
import { getColorOptions } from '@/utils/color-utils';
import GradientChip from '@/components/base/GradientChip.vue';

export default {
  components: {
    GradientChip,
  },
  props: {
    modelValue: { type: null, default: false },
    addDeck: { type: null, default: false },
    deckList: { type: null, default: () => [] },
  },
  emits: [
    'update:model-value',
    'update:add-deck',
  ],
  data () {
    return {
      colorOptions: getColorOptions(),
      colors: [],
      value: null,
    };
  },
  computed: {
    expandIcon () {
      return this.addDeck ? 'mdi-chevron-up' : 'mdi-plus';
    },

    deckColor () {
      return [...this.colors]
        .sort((a, b) => a.id - b.id)
        .slice(0, 2)
        .map(({ code }) => code)
        .join('');
    },

    deckName ()  {
      if (this.deckColor || this.value) {
        return `${this.deckColor} ${this.value ?? ''}`;
      } else {
        return '';
      }
    },

    selectedDeck () {
      return this.deckName || this.modelValue;
    },

    errorMessage () {
      return this.colors.length > 2 ? 'Please select a maximum of 2 colors' : '';
    },
  },
  watch: {
    /**
     * Selecting an existing deck should collapse the 'Add Deck' section
     * Otherwise, repeated decks may be entered if the UI detects the 'Add Deck' section is open
     */
    modelValue: {
      immediate: true,
      handler (v) {
        if (v && !this.deckName) {
          this.$emit('update:add-deck', false);
        }
      },
    },

    /**
     * Reset the 'Add Deck' section inputs if collapsed
     */
    addDeck (v) {
      if (!v) {
        this.colors = [];
        this.value = '';
      }
    },

    selectedDeck (v) {
      v && this.$emit('update:model-value', v);
    },
  },
};
</script>

<template>
  <paired-select
    :model-value="selectedDeck"
    :items="deckList"
    label="Deck"
    item-title="name"
    chips
    @update:model-value="$emit('update:model-value', $event)"
  >
    <template #append>
      <v-btn
        :icon="expandIcon"
        density="compact"
        variant="text"
        @click="$emit('update:add-deck', !addDeck)"
      />
    </template>
  </paired-select>

  <v-expand-transition>
    <div
      v-show="addDeck"
      class="mx-auto"
    >
      <v-col style="height: 0%">
        <v-row>
          <gradient-chip
            :value="deckName"
            class="ma-auto"
          >
            <v-text-field
              v-model="value"
              placeholder="Enter Name"
              class="name-input-field"
              bg-color="transparent"
              variant="solo"
              hide-details
              flat
            >
              <template
                v-if="deckColor"
                #prepend-inner
              >
                <span>{{ deckColor }}</span>
              </template>
            </v-text-field>
          </gradient-chip>
        </v-row>

        <!-- Color Checkboxes -->
        <v-input
          :error-messages="errorMessage"
          class="mt-4"
          hide-details="auto"
        >
          <v-row no-gutters>
            <v-col
              v-for="color in colorOptions"
              :key="color.value"
              cols="4"
              class="d-flex justfy-center"
            >
              <v-checkbox
                v-model="colors"
                :color="color.hex"
                :label="color.name"
                :value="color"
                density="compact"
                hide-details
              />
            </v-col>
          </v-row>
        </v-input>
      </v-col>
    </div>
  </v-expand-transition>
</template>

<style scoped>
.name-input-field :deep(input::placeholder) {
  color: white !important;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.2); /* Helps text pop against gradients */
}
/* Removes the default Vuetify padding so the input reaches the chip edges */
.name-input-field :deep(.v-field) {
  border-radius: inherit; /* Matches the chip's roundness */
}

/* Ensures the transparent background doesn't pick up the chip's stroke color */
.name-input-field :deep(.v-field__overlay) {
  display: none;
}

.name-input-field :deep(input) {
  /* This is the magic line */
  field-sizing: content;

  /* Ensure it doesn't get too small to click or too wide for the screen */
  min-width: 50px;
  max-width: 300px;

  color: white !important;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.2);
}

/* You may need to remove the flex-grow behavior from the Vuetify wrapper */
.name-input-field :deep(.v-field__field) {
  flex: 0 1 auto !important;
}
</style>