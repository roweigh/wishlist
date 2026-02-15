<script>
export default {
  props: {
    modelValue: { type: null, required: true },
    label: { type: String, default: undefined },
    cols: { type: null, default: null },
  },
  emits: [
    'update:model-value',
  ],
  data () {
    return {
      menu: false,
    };
  },
  computed: {
    displayValue () {
      const date = new Date(this.modelValue);
      return date.toLocaleDateString();
    },
  },
  methods: {
    updateDate(rawDate) {
      const value = new Date(rawDate).toISOString();
      this.$emit('update:model-value', value);
      this.menu = false;
    },
  },
};
</script>

<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    min-width="auto"
  >
    <template #activator="{ props }">
      <v-col
        style="padding: 0px"
        :cols="cols"
      >
        <v-text-field
          v-bind="props"
          :model-value="displayValue"
          :label="label"
          density="compact"
          hide-details
          tile
          readonly
        />
      </v-col>
    </template>

    <v-date-picker
      :model-value="modelValue"
      hide-header
      show-adjacent-months
      @update:model-value="updateDate($event)"
    />
  </v-menu>
</template>