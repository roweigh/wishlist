<script>
export default {
  props: {
    modelValue: { type: null, required: true },
    label: { type: String, default: undefined },
    cols: { type: null, default: 12 },
    min: { type: Number, default: undefined },
    padding: { type: [Number, String], default: 0 },
    type: { type: String, default: undefined },
  },
  emits: [
    'update:model-value',
  ],
  computed: {
    styleComputed () { return this.padding ? `padding: ${this.padding}px` : undefined; },
    prefix () { return this.type === 'dollar' ? '$' : undefined; },
    precision () { return this.type === 'dollar' ? 2 : undefined; },
  },
};
</script>

<template>
  <v-col
    :style="styleComputed"
    :cols="cols"
  >
    <v-number-input
      :model-value="modelValue"
      :label="label"
      :prefix="prefix"
      :precision="precision"
      :min="min"
      control-variant="stacked"
      density="compact"
      hide-details="auto"
      tile
      @update:model-value="$emit('update:model-value', $event)"
    />
  </v-col>
</template>