<script>
export default {
  props: {
    modelValue: { type: null, default: false },
  },
  emits: ['update:model-value'],
  data () {
    return {
      name: null,
      colors: [],
      colorOptions: [
        { id: 0, name: 'Red', value: 'red-darken-3', hex: '#C62828' },
        { id: 1, name: 'Green', value: 'green-darken-3', hex: '#2E7D32' },
        { id: 2, name: 'Blue', value: 'blue-darken-3', hex: '#1565C0' },
        { id: 3, name: 'Purple', value: 'purple-darken-3', hex: '#6A1B9A' },
        { id: 4, name: 'Black', value: 'gray-darken-4', hex: '#212121' },
        { id: 5, name: 'Yellow', value: 'yellow-darken-3', hex: '#F9A825' },
      ],
    };
  },
  computed: {
    chipBackgroundStyle() {
      const selectedHexes = [...this.colors];
      selectedHexes.sort((a, b) => {
        const colorA = this.colorOptions.find(opt => opt.hex === a);
        const colorB = this.colorOptions.find(opt => opt.hex === b);
        return (colorA?.id || 0) - (colorB?.id || 0);
      });

      // Default state
      if (selectedHexes.length === 0) {
        return {
          backgroundColor: '#757575', // grey-darken-2
          height: '56px',
          overflow: 'hidden',
          width: '100%',
        };
      }

      // Single color state
      if (selectedHexes.length === 1) {
        return {
          backgroundColor: selectedHexes[0],
          height: '56px',
          overflow: 'hidden',
          width: '100%',
        };
      }

      return {
        background: `linear-gradient(90deg, 
          ${selectedHexes[0]} 0%, 
          ${selectedHexes[0]} 35%, 
          ${selectedHexes[1]} 65%, 
          ${selectedHexes[1]} 100%
        )`,
        height: '56px',
        overflow: 'hidden',
        border: 'none',
        width: '100%',
      };
    },
  },
};
</script>

<template>
  <base-dialog
    :model-value="modelValue"
    title="Add New Deck"
    width="30vw"
    @update:model-value="$emit('update:model-value', $event)"
  >
    <v-chip :style="chipBackgroundStyle">
      <v-text-field
        v-model="name"
        placeholder="Enter Deck Name"
        variant="solo"
        density="comfortable"
        bg-color="transparent"
        class="name-input-field"
        flat
        hide-details
      />
    </v-chip>

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
            :value="color.hex"
            density="compact"
            hide-details
          />
        </v-col>
      </v-row>
    </v-input>
  </base-dialog>
</template>

<style scoped>
:deep(.v-chip__content) {
  width: 100%
}


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