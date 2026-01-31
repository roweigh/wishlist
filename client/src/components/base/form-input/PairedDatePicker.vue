<script>
export default {
  props: {
    modelValue: { type: null, required: true },
    cols: { type: null, default: null },
  },
  emits: [
    'update:model-value',
  ],
  computed: {
    displayValue () {
      const date = new Date(this.modelValue);
      return date.toLocaleDateString();
    },
  },
};
</script>

<template>
  <v-col
    style="padding: 0px"
    :cols="cols"
  >
    <v-text-field
      :model-value="displayValue"
      density="compact"
      hide-details
      tile
    />
  </v-col>
</template>