<script>
import {
  addCard,
  updateCard,
  removeCard,
} from '@/api/purchases';

import AddSinglesDialog from './AddSinglesDialog.vue';
import EditSinglesDialog from './EditSinglesDialog.vue';
import BulkUploadDialog from '@/components/wishlist/dialog/BulkUploadDialog.vue';
import GradientChip from '@/components/base/GradientChip.vue';

import { useAlertStore } from '@/stores/alert';
const alertStore = useAlertStore();

export default {
  components: {
    AddSinglesDialog,
    EditSinglesDialog,
    BulkUploadDialog,
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
    'refresh',
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
    async addCard (payload) {
      try {
        await addCard(payload).then(() => {
          alertStore.showMessage('success', 'Successfully Added!');
          this.overlayFlags.add = false;
          this.overlayFlags.edit = false;
        }),
        this.$emit('refresh');
      } catch {
        // handle(error)
      }
    },

    async updateCard (payload) {
      try {
        const id = this.overlayFlags?.edit?.id;
        await updateCard(id, payload).then(() => {
          alertStore.showMessage('success', 'Successfully Updated!');
        }),
        this.$emit('refresh');
      } catch {
        // handle(error)
      }
    },

    async removeCard(id) {
      try {
        await removeCard(id).then(() => {
          alertStore.showMessage('success', 'Successfully Removed!');
        });
        this.$emit('refresh');
      } catch {
        // handle(error)
      }
    },

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

    formatDollar(v) {
      return `$${(v).toFixed(2)}`;
    },
  },
};
</script>

<template>
  <bulk-upload-dialog
    v-model="overlayFlags.upload"
    :csv-headers="csvHeaders"
    @upload="$emit('upload', $event)"
  />

  <add-singles-dialog
    v-model="overlayFlags.add"
    @add="addCard($event)"
  />

  <edit-singles-dialog
    v-model="overlayFlags.edit"
    @update="updateCard($event)"
    @refresh="getCards()"
  />

  <v-tabs-window-item value="singles">
    <base-table
      v-model:sort-by="sortBy"
      :headers="headers"
      :items="items"
      :loading="loading"
      @add="overlayFlags.add = true"
      @edit="overlayFlags.edit = $event"
      @upload="overlayFlags.upload = true"
      @remove="removeCard($event)"
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