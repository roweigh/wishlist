<script>
export default {
  props: {
    value: { type: null, default: null },
    colors: { type: null, required: true },
  },
  data () {
    return {
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
    chipBackgroundStyle() {
      if (!this.value) {return null;}
      const colors = this.value.match(/[A-Z](?=[/ ]|(?<=\/)[A-Z])/g);
      const selectedHexes = colors.map(code => {
        const match = this.colorOptions.find(opt => opt.code === code);
        return match ? match.hex : null; // Returns hex or null if not found
      }).filter(hex => hex); // Remove any nulls just in case

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
          ${selectedHexes[0]} 25%, 
          ${selectedHexes[1]} 75%, 
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
  <v-chip
    :style="chipBackgroundStyle"
  >
    <slot />
  </v-chip>
</template>

<style scoped>
:deep(.v-chip__content) {
  width: 100%;
  color: white;
}
</style>
