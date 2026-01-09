<script>
import { Timestamp } from 'firebase/firestore';
import { getCardHistory, updateHistory } from '../../api/wishlist';
import ReceiptRow from './ReceiptRow.vue';

export default {
  components: {
    ReceiptRow,
  },
  props: {
    modelValue: { type: null, default: false },
  },
  emits: [
    'update:model-value',
  ],
  data () {
    return {
      history: [],
      changedHistory: {},
      code: null,
      name: null,
      qtyNeeded: { initial: 0, value: null },
      qtyAcquired: { initial: 0, value: null },
    };
  },
  watch: {
    modelValue: {
      deep: true,
      immediate: true,
      async handler(v) {
        if (v?.code) {
          this.history = await getCardHistory(v.code).then(result => result.sort((a,b) => b.date - a.date));
          console.log(this.history);
          this.code = v?.code ?? null;
          this.name = v?.name ?? null;

          this.qtyNeeded.initial = v?.qtyNeeded ?? 1;
          this.qtyNeeded.value = v?.qtyNeeded ?? 1;
          this.qtyAcquired.initial = v?.qtyAcquired ?? 0;
          this.qtyAcquired.value = v?.qtyAcquired ?? 0;
        }
      },
    },
  },
  methods: {
    async submit() {
      const timeStamp = Timestamp.fromDate(new Date());
      const payload = {
        code: this.code,
        name: this.name,
        qtyNeeded: this.qtyNeeded.value - this.qtyNeeded.initial,
        qtyAcquired: this.qtyAcquired.value - this.qtyAcquired.initial,
        date: timeStamp,
      };

      const promises = Object.entries(this.changedHistory).map(([id, payload]) => {
        updateHistory(id, payload);
      });
      await Promise.all(promises);

      if (!this.modelValue.id) {
        this.$emit('add', payload);
      }
    },
  },
};
</script>

<template>
  <base-dialog
    :model-value="modelValue"
    title="Update Bulk"
    @submit="submit()"
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
          v-model="qtyNeeded.value"
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
          v-model="qtyAcquired.value"
          :min="0"
          label="Quantity Acquired"
          density="compact"
          hide-details="auto"
          tile
        />
      </v-col>
    </v-row>

    <v-row>
      <v-card-title>
        History
      </v-card-title>
    </v-row>


    <template
      v-for="item in history"
      :key="item.id"
    >
      <receipt-row
        v-model="changedHistory"
        :item="item"
      />
    </template>

    {{ changedHistory }}
  </base-dialog>
</template>