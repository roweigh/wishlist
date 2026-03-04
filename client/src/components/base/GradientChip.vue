<script>
import { getColor } from '@/utils/color-utils';
export default {
  props: {
    value: { type: null, default: null },
  },
  data () {
    return {
      getColor,
    };
  },
  computed: {
    gradientStyle() {
      if (!this.value) { return null; }

      const colorCode = this.value.trim().split(' ')[0];
      const selectedHexes = (colorCode.match(/[A-Z]/g) || []).map(code => getColor(code));

      // Default state
      if (selectedHexes.length === 0) {
        return { backgroundColor: '#757575' }; // grey-darken-2
      }

      // Single color state
      if (selectedHexes.length === 1) {
        return { backgroundColor: selectedHexes[0]  };
      }

      return {
        background: `linear-gradient(90deg, 
          ${selectedHexes[0]} 0%, 
          ${selectedHexes[0]} 15%, 
          ${selectedHexes[1]} 85%, 
          ${selectedHexes[1]} 100%
        )`,
      };
    },
  },
};
</script>

<template>
  <v-chip
    :style="gradientStyle"
    density="compact"
  >
    <slot />
  </v-chip>
</template>

<style scoped>
:deep(.v-chip__content) {
  color: white;
  font-weight: semi-bold;
}
</style>
