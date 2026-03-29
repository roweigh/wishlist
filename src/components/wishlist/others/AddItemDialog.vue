<script>
export default {
  props: {
    modelValue: { type: null, default: false },
  },
  emits: [
    'update:model-value',
    'add',
    'update',
    'refresh',
  ],
  data () {
    return {
      loading: true,
      totalCost: 0,
      name: null,
    };
  },
  watch: {
    modelValue: {
      deep: true,
      immediate: true,
      handler(v) {
        if (v) {
          this.loading = false;
        }
      },
    },
  },
  methods: {
    async submit () {
      this.loading = true;
      this.$emit('add', {
        name: this.name,
        cost: this.totalCost,
      });
    },
  },
};
</script>

<template>
  <base-dialog
    :model-value="modelValue"
    :loading="loading"
    title="Add Entry Fees"
    width="500px"
    @submit="submit()"
    @update:model-value="$emit('update:model-value', $event)"
  >
    <v-col>
      <v-row>
        <paired-text-field
          v-model="name"
          label="Name"
        />
        <paired-number-input
          v-model="totalCost"
          label="Total Price"
          type="dollar"
        />
      </v-row>
    </v-col>
  </base-dialog>
</template>