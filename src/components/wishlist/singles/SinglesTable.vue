<script>
import {
  getCards,
  addCard,
  updateCard,
  removeCard,
} from '@/api/purchases';

import CrudMixin from '@/mixins/CrudMixin';
import GradientChip from '@/components/base/GradientChip.vue';
import BulkUploadDialog from '@/components/wishlist/dialog/BulkUploadDialog.vue';
import AddSinglesDialog from './AddSinglesDialog.vue';
import EditSinglesDialog from './EditSinglesDialog.vue';

export default {
  components: {
    GradientChip,
    AddSinglesDialog,
    EditSinglesDialog,
    BulkUploadDialog,
  },
  mixins: [
    CrudMixin({
      getFn: getCards,
      addFn: addCard,
      updateFn: updateCard,
      removeFn: removeCard,
    }),
  ],
  props: {
    value: { type: String, required: true },
  },
  data () {
    return {
      sortBy: [{ key: 'deck', order: 'asc' }],
      csvHeaders: 'code,name,qtyAcquired,qtyNeeded,amtSpent,date', // Explicitly defined as visible headers may not necessarily be all of the data
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
      const parseDecklist = (text) => {
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
      };

      try {
        const text = await navigator.clipboard.readText();
        this.cards = parseDecklist(text);
      } catch (err) {
        console.error('Failed to read clipboard:', err);
      }
    },

    isAA(v) {
      return v.endsWith('*');
    },

    parseCode(v) {
      let code = v.toUpperCase().trim();
      if (this.isAA(code)) {
        code = code.slice(0, -1);
      }
      return code;
    },

    formatName(v) {
      let name = v.name;
      if (this.isAA(v.code)) {
        name += ' (Alternate Art)';
      }
      return name;
    },
  },
};
</script>

<template>
  <add-singles-dialog
    v-model="overlayFlags.add"
    @add="add($event)"
  />

  <edit-singles-dialog
    v-model="overlayFlags.edit"
    @add="add($event)"
    @update="update($event)"
    @refresh="get()"
  />

  <bulk-upload-dialog
    v-model="overlayFlags.upload"
    :csv-headers="csvHeaders"
    @upload="bulkUpload($event)"
  />

  <v-tabs-window-item value="singles">
    <base-table
      v-model:sort-by="sortBy"
      :loading="loadingFlags.loading"
      :headers="headers"
      :items="items"
      item-id="code"
      @add="overlayFlags.add = true"
      @edit="overlayFlags.edit = $event"
      @upload="overlayFlags.upload = true"
      @remove="remove($event)"
      @download="download()"
    >
      <template #actions>
        <icon-button
          icon="mdi-content-copy"
          tooltip-text="Import from Clipboard"
          @click="loadFromClipboard()"
        />
      </template>

      <template #[`item.name`]="{ item }">
        {{ formatName(item) }}
      </template>

      <template #[`item.code`]="{ item }">
        {{ parseCode(item.code) }}
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