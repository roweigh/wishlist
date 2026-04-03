<script>
export default {
  props: {
    modelValue: { type: null, required: true },
    initial: { type: null, default: undefined },
    label: { type: String, default: undefined },
    readonly: { type: Boolean, default: false },
    cols: { type: null, default: 12 },
    padding: { type: [Number, String], default: undefined },
    variant: { type: String, default: 'outlined' },
  },
  emits: [
    'update:model-value',
  ],
  computed: {
    styleComputed () {
      return this.padding ? `padding: ${this.padding}px` : undefined;
    },
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
    <v-text-field
      :model-value="modelValue"
      :label="label"
      :variant="variant"
      :readonly="readonly"
      :class="classComputed"
      hide-details="auto"
      density="compact"
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