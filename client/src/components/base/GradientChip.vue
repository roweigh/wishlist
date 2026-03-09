<script>
import { getColor } from '@/utils/color-utils';

export default {
  props: {
    value: { type: String, default: null },
  },
  data () {
    return {
      getColor,
    };
  },
  computed: {
    gradientStyle() {
      if (!this.value) { return undefined; }

      const style = {};
      const colorCode = this.value.trim().split(' ')[0];
      const colorsArr = (colorCode.match(/[A-Z]/g) || []).map(code => getColor(code));

      if (colorsArr.length < 2) {
        style.backgroundColor = colorsArr[0] ?? '#757575'; //grey-darken-2
      } else {
        style.background = `
          linear-gradient(90deg, 
            ${colorsArr[0]} 0%, 
            ${colorsArr[0]} 15%, 
            ${colorsArr[1]} 85%, 
            ${colorsArr[1]} 100%
          )`;
      }
      return style;
    },
  },
};
</script>

<template>
  <v-chip :style="gradientStyle">
    <slot />
  </v-chip>
</template>

<style scoped>
:deep(.v-chip__content) {
  color: white;
  font-weight: semi-bold;
}
</style>
