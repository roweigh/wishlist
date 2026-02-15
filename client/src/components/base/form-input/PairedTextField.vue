<script>
export default {
  props: {
    modelValue: { type: null, required: true },
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
      :label="label"
      hide-details="auto"
      density="compact"
      tile
      @update:model-value="$emit('update:model-value', $event)"
    />
  </v-col>
</template>