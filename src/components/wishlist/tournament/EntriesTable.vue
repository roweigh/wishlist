<script>
import {
  addEntry,
  removeEntry,
} from '@/api/purchases';

import AddEntryDialog from './AddEntryDialog.vue';
import BulkUploadDialog from '@/components/wishlist/dialog/BulkUploadDialog.vue';

import { useAlertStore } from '@/stores/alert';
const alertStore = useAlertStore();

export default {
  components: {
    BulkUploadDialog,
    AddEntryDialog,
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
        upload: false,
      },

      sortBy: [{ key: 'date', order: 'desc' }],
      csvHeaders: 'date,price', // Explicitly defined as visible headers may not necessarily be all of the data
      headers: [
        {
          key: 'date',
          title: 'Date',
        },
        {
          key: 'cost',
          title: 'Price',
          align: 'end',
          width: '8%',
        },
        // {s
        //   key: 'notes',
        //   title: 'Notes',
        // },
        {
          key: 'actions',
          align: 'end',
          sortable: false,
          width: '0%',
        },
      ],
    };
  },
  methods: {
    async addEntry (payload) {
      try {
        await addEntry(payload).then(() => {
          alertStore.showMessage('success', 'Successfully Added!');
          this.overlayFlags.add = false;
          this.overlayFlags.edit = false;
        }),
        this.$emit('refresh');
      } catch {
        // handle(error)
      }
    },

    async removeEntry(id) {
      try {
        await removeEntry(id).then(() => {
          alertStore.showMessage('success', 'Successfully Removed!');
        });
        this.$emit('refresh');
      } catch {
        // handle(error)
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

  <add-entry-dialog
    v-model="overlayFlags.add"
    @add="addEntry($event)"
  />

  <v-tabs-window-item value="tournament">
    <base-table
      v-model:sort-by="sortBy"
      :headers="headers"
      :items="items"
      :loading="loading"
      :edit="false"
      @add="overlayFlags.add = true"
      @upload="overlayFlags.upload = true"
      @remove="removeEntry($event)"
      @download="$emit('download')"
    >
      <template #[`item.cost`]="{ item }">
        {{ formatDollar(item.cost) }}
      </template>
    </base-table>
  </v-tabs-window-item>
</template>