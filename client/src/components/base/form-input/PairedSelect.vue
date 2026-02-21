<script>
export default {
  props: {
    modelValue: { type: null, required: true },
    items: { type: Array, default: () => [] },
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
    <v-select
      :model-value="modelValue"
      :label="label"
      :items="items"
      hide-details="auto"
      density="compact"
      tile
      @update:model-value="$emit('update:model-value', $event)"
    >
      <template #append>
        <slot name="append" />
      </template>
    </v-select>
  </v-col>
</template>