<script>
import GradientChip from '@/components/base/GradientChip.vue';
import { useDataIteratorItems } from 'vuetify/lib/components/VDataIterator/composables/items.mjs';
export default {
  components: {
    GradientChip,
  },
  props: {
    loading: { type: Boolean, default: false },
    items: { type: null, required: true },
  },
  emits: [
    'load',
    'upload',
    'add',
    'edit',
    'remove',
  ],
  data () {
    return {
      headers: [
        {
          key: 'code',
          title: 'Code',
        },
        {
          key: 'name',
          title: 'Name',
        },
        {
          key: 'deck',
          title: 'Deck',
        },
        {
          key: 'category',
          title: 'Category',
        },
        {
          key: 'qtyNeeded',
          title: 'Needed',
          align: 'end',
        },
        {
          key: 'qtyAcquired',
          title: 'Stock',
          align: 'end',
        },
        {
          key: 'amtSpent',
          title: 'Amount Spent',
          align: 'end',
        },
        {
          key: 'notes',
          title: 'Notes',
        },
        {
          key: 'actions',
          align: 'end',
          sortable: false,
        },
      ],
    };
  },
  methods: {
    async loadFromClipboard () {
      try {
        const text = await navigator.clipboard.readText();
        this.cards = this.parseDecklist(text);
      } catch (err) {
        console.error('Failed to read clipboard:', err);
      }
    },

    parseDecklist (text) {
      return text.split(/\r?\n/).map(line => {
        const cardQty = line.trim().match(/^(\d+)x(.+)$/);
        const qtyNeeded = Number(cardQty?.[1]);
        const code = cardQty?.[2].trim();

        if (!cardQty) {
          return null;
        } else {
          return {
            code,
            qtyNeeded,
            qtyAcquired: 0,
            cost: 0,
          };
        }
      });
    },

    formatDollar(v) {
      return `$${(v).toFixed(2)}`;
    },
  },
};
</script>

<template>
  <v-toolbar
    density="compact"
    flat
  >
    <v-toolbar-title class="font-weight-bold">
      <flex-row class="align-center justify-space-between">
        <h3>Singles</h3>

        <flex-row class="mx-3">
          <v-btn
            icon="mdi-content-copy"
            density="compact"
            @click="loadFromClipboard()"
          />
          <v-btn
            icon="mdi-upload"
            density="compact"
            class="mx-2"
            @click="$emit('upload')"
          />
          <v-btn
            icon="mdi-download"
            density="compact"
            class="mx-2"
            @click="$emit('download')"
          />
          <v-btn
            icon="mdi-plus"
            density="compact"
            @click="$emit('add')"
          />
        </flex-row>
      </flex-row>
    </v-toolbar-title>
  </v-toolbar>

  <v-data-table
    :headers="headers"
    :items="items"
    :loading="loading"
    :items-per-page="-1"
    density="compact"
  >
    <template #item.deck="{ item }">
      <gradient-chip
        v-if="item.deck"
        :value="item.deck"
      >
        {{ item.deck }}
      </gradient-chip>
    </template>

    <template #item.amtSpent="{ item }">
      {{ formatDollar(item.amtSpent) }}
    </template>

    <template #item.actions="{ item }">
      <div class="d-flex ga-2 justify-end">
        <v-icon
          color="medium-emphasis"
          icon="mdi-pencil"
          size="small"
          @click="$emit('edit', item)"
        />

        <v-icon
          color="medium-emphasis"
          icon="mdi-delete"
          size="small"
          @click="$emit('remove', item.code)"
        />
      </div>
    </template>
  </v-data-table>
</template>