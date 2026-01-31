<script>
export default {
  props: {
    modelValue: { type: null, required: true },
    hideSpinButtons: { type: Boolean, default: false },
    prefix: { type: String, default: undefined },
    label: { type: String, default: undefined },
    cols: { type: null, default: null },
    padding: { type: [Number, String], default: undefined },
  },
  emits: [
    'update:model-value',
  ],
  computed: {
    styleComputed () {
      return this.padding ? `padding: ${this.padding}px` : undefined;
    },
  },
};
</script>

<template>
  <v-col
    :style="styleComputed"
    :cols="cols"
  >
    <v-text-field
      :model-value="modelValue"
      :hide-spin-buttons="hideSpinButtons"
      :prefix="prefix"
      :label="label"
      hide-details="auto"
      type="number"
      density="compact"
      tile
    />
  </v-col>
</template>