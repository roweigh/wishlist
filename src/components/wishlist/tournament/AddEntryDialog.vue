<script>
import { Timestamp } from 'firebase/firestore';

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
      dates: null,
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
      const dates = this.dates.map((date) => {
        return {
          date: Timestamp.fromDate(new Date(date)),
          cost: this.totalCost,
        };
      });
      this.$emit('add', dates);
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
    <v-date-picker
      v-model="dates"
      width="450"
      class="ma-auto"
      show-adjacent-months
      multiple
      hide-title
    >
      <template #actions>
        <paired-number-input
          v-model="totalCost"
          label="Entry Cost"
          type="dollar"
        />
      </template>
    </v-date-picker>
  </base-dialog>
</template>