<script>
import GradientChip from '@/components/base/GradientChip.vue';
export default {
  components: {
    GradientChip,
  },
  props: {
    modelValue: { type: null, required: true },
    items: { type: Array, default: () => [] },
    label: { type: String, default: undefined },
    cols: { type: null, default: null },
    chips: { type: Boolean, default: false },
    itemTitle: { type: String, default: undefined },
    itemValaue: { type: String, default: undefined },
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
      :item-title="itemTitle"
      :item-value="itemValue"
      :chips="chips"
      hide-details="auto"
      density="compact"
      tile
      @update:model-value="$emit('update:model-value', $event)"
    >
      <template #append>
        <slot name="append" />
      </template>

      <template #chip="{item}">
        <gradient-chip :value="item.title">
          {{ item.title }}
        </gradient-chip>
      </template>
    </v-select>
  </v-col>
</template>