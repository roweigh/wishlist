<script>
import GradientChip from '@/components/base/GradientChip.vue';

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
    'download',
  ],
  data () {
    return {
      sortBy: [{ key: 'deck', order: 'asc' }],
      itemsPerPage: -1,
      headers: [
        {
          key: 'code',
          title: 'Code',
          width: '8%',
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
          key: 'qtyNeeded',
          title: 'Needed',
          align: 'end',
          width: '5%',
        },
        {
          key: 'qtyAcquired',
          title: 'Stock',
          align: 'end',
          width: '5%',
        },
        {
          key: 'amtSpent',
          title: 'Amount Spent',
          align: 'end',
          width: '8%',
        },
        // {
        //   key: 'notes',
        //   title: 'Notes',
        // },
        {
          key: 'actions',
          align: 'end',
          sortable: false,
          width: '5%',
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
  <v-tabs-window-item
    key="singles"
    value="singles"
  >
    <v-toolbar
      density="compact"
      flat
    >
      <flex-row class="mx-3 justify-end grow">
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
    </v-toolbar>

    <v-data-table
      v-model:sort-by="sortBy"
      v-model:items-per-page="itemsPerPage"
      :headers="headers"
      :items="items"
      :loading="loading"
      sort-asc-icon="mdi-chevron-up"
      sort-desc-icon="mdi-chevron-down"
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
  </v-tabs-window-item>
</template>