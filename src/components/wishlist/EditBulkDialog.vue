<script>
export default {
  props: {
    modelValue: { type: null, default: false },
  },
  emits: [
    'update:model-value',
  ],
  data () {
    return {
      code: null,
      name: null,
      qtyNeeded: null,
      qtyAcquired: null,
    };
  },
  watch: {
    modelValue: {
      deep: true,
      immediate: true,
      handler(v) {
        this.code = v?.code ?? null;
        this.name = v?.name ?? null;
        this.qtyNeeded = v?.qtyNeeded ?? 0;
        this.qtyAcquired = v?.qtyAcquired ?? 0;
      },
    },
  },
};
</script>

<template>
  <base-dialog
    :model-value="modelValue"
    title="Update Bulk"
    @update:model-value="$emit('update:model-value', $event)"
  >
    <v-row>
      <v-col
        cols="12"
        md="6"
      >
        <v-text-field
          v-model="code"
          label="Code"
          density="compact"
          hide-details="auto"
          tile
        />
      </v-col>

      <v-col
        cols="12"
        md="6"
      >
        <v-text-field
          v-model="name"
          label="Name"
          density="compact"
          hide-details="auto"
          tile
        />
      </v-col>

      <v-col
        cols="12"
        md="6"
      >
        <v-number-input
          v-model="qtyNeeded"
          :min="1"
          label="Quantity Needed"
          density="compact"
          hide-details="auto"
          tile
        />
      </v-col>

      <v-col
        cols="12"
        md="6"
      >
        <v-number-input
          v-model="qtyAcquired"
          :min="0"
          label="Quantity Acquired"
          density="compact"
          hide-details="auto"
          tile
        />
      </v-col>
    </v-row>
  </base-dialog>
</template>