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
      overlayFlags: {
        add: false,
        edit: false,
        upload: false,
      },

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
  <bulk-upload-dialog
    v-model="overlayFlags.upload"
    @upload="bulkUpload($event)"
  />

  <v-tabs-window-item value="singles">
    <base-table
      v-model:sort-by="sortBy"
      :headers="headers"
      :items="items"
      :loading="loading"
      @add="$emit('add')"
      @edit="$emit('edit', $event)"
      @remove="$emit('remove', $event)"
      @upload="$emit('upload')"
      @download="$emit('download')"
    >
      <template #actions>
        <icon-button
          icon="mdi-content-copy"
          tooltip-text="Import from Clipboard"
          @click="loadFromClipboard()"
        />
      </template>

      <template #[`item.deck`]="{ item }">
        <gradient-chip
          v-if="item.deck"
          :value="item.deck"
        >
          {{ item.deck }}
        </gradient-chip>
      </template>

      <template #[`item.amtSpent`]="{ item }">
        {{ formatDollar(item.amtSpent) }}
      </template>
    </base-table>
  </v-tabs-window-item>
</template>