<script>
import { getColorOptions } from '@/utils/color-utils';
import { addDeck } from '@/api/purchases';

import GradientChip from '@/components/base/GradientChip.vue';

export default {
  components: {
    GradientChip,
  },
  props: {
    modelValue: { type: null, default: false },
  },
  emits: ['update:model-value'],
  data () {
    return {
      name: null,
      colors: [],
      colorOptions: getColorOptions(),
    };
  },
  computed: {
    colorsComputed () {
      return [...this.colors].sort((a, b) => a.id - b.id);
    },
    deckColor () {
      return this.colorsComputed.map(({ code }) => code).join('/');
    },
  },
  methods: {
    async submit() {
      try {
        const payload = { name: `${this.deckColor} ${this.name}` };
        await addDeck(payload);
        this.$emit('update:model-value', false);
      } catch (error) {
        //
      }
    },
  },
};
</script>

<template>
  <base-dialog
    :model-value="modelValue"
    title="Add New Deck"
    width="30vw"
    @submit="submit()"
    @update:model-value="$emit('update:model-value', $event)"
  >
    <gradient-chip
      :colors="colors"
      :color-options="colorOptions"
    >
      <v-text-field
        v-model="name"
        placeholder="Enter Deck Name"
        class="name-input-field"
        density="comfortable"
        bg-color="transparent"
        variant="solo"
        hide-details
        flat
      />
    </gradient-chip>
    <v-input
      :error-messages="colors.length > 2 ? 'Please select a maximum of 2 colors' : ''"
      class="mt-3"
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
  </base-dialog>
</template>

<style scoped>
.name-input-field :deep(input),
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
</style>