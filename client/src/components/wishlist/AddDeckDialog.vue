<script>
import { getColorOptions } from '@/utils/color-utils';

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
    deckColor () {
      const colors = [...this.colors].sort((a, b) => a.id - b.id);
      return colors.map(({ code }) => code).join('');
    },
    deckName ()  {
      return `${this.deckColor} ${this.name}`;
    },
  },
  watch: {
    modelValue (v) {
      if (v) {
        this.name = null;
        this.colors = [];
      }
    },
  },
  methods: {
    submit() {
      this.$emit('add', { name: this.deckName });
    },
  },
};
</script>

<template>
  <v-col style="height: 0%">
    <gradient-chip :value="deckName">
      <v-text-field
        v-model="name"
        placeholder="Name"
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
  </v-col>
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