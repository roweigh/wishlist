<script>
import GradientChip from '@/components/base/GradientChip.vue';
import { addDeck } from '@/api/purchases';

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
      colorOptions: [
        { id: 0, code: 'R', name: 'Red', value: 'red-darken-3', hex: '#C62828' },
        { id: 1, code: 'G', name: 'Green', value: 'green-darken-3', hex: '#2E7D32' },
        { id: 2, code: 'U', name: 'Blue', value: 'blue-darken-3', hex: '#1565C0' },
        { id: 3, code: 'P', name: 'Purple', value: 'purple-darken-3', hex: '#6A1B9A' },
        { id: 4, code: 'B', name: 'Black', value: 'gray-darken-4', hex: '#212121' },
        { id: 5, code: 'Y', name: 'Yellow', value: 'yellow-darken-3', hex: '#F9A825' },
      ],
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