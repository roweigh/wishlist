<script>
export default {
  props: {
    modelValue: { type: null, required: true },
    initial: { type: null, default: undefined },
    label: { type: String, default: undefined },
    cols: { type: null, default: 12 },
    min: { type: Number, default: undefined },
    padding: { type: [Number, String], default: 0 },
    type: { type: String, default: undefined },
    variant: { type: String, default: 'outlined' },
    density: { type: String, default: 'compact' },
  },
  emits: [
    'update:model-value',
  ],
  computed: {
    prefix () { return this.type === 'dollar' ? '$' : undefined; },
    precision () { return this.type === 'dollar' ? 2 : undefined; },
    styleComputed () { return this.padding ? `padding: ${this.padding}px` : undefined; },
    classComputed () {
      const changed = (this.initial !== undefined) && (this.modelValue !== this.initial);
      if (changed) {
        return 'changed';
      } else {
        return undefined;
      }
    },
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
      :variant="variant"
      :density="density"
      :class="classComputed"
      control-variant="stacked"
      hide-details="auto"
      tile
      @update:model-value="$emit('update:model-value', $event)"
    />
  </v-col>
</template>

<style lang="scss" scoped>
.changed {
  :deep(.v-field-label) {
    opacity: 1;
    color: #00C853; // green-accent-4
  }
  :deep(.v-field__outline) {
    --v-field-border-width: 2px;
    --v-field-border-opacity: 1;
    color: #00C853; // green-accent-4
  }
}
</style>