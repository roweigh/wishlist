<script>
export default {
  props: {
    icon: { type: String, required: true },
    tooltipText: { type: String, default: undefined },
    color: { type: String, default: undefined },
  },
  emits: [
    'click',
  ],
};
</script>

<template>
  <v-tooltip
    :text="tooltipText"
    location="top"
  >
    <template #activator="{props}">
      <v-btn
        v-bind="props"
        :icon="icon"
        :color="color"
        density="compact"
        @click="$emit('click')"
      />
    </template>
  </v-tooltip>
</template>

<style lang="scss" scoped>
.static.v-btn--variant-plain {
  opacity: 1;
 }
</style>