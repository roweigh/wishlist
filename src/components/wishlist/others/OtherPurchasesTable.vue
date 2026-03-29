<script>
import {
  addItem,
  removeItem,
} from '@/api/purchases';

import AddItemDialog from './AddItemDialog.vue';
import BulkUploadDialog from '@/components/wishlist/dialog/BulkUploadDialog.vue';

import { useAlertStore } from '@/stores/alert';
const alertStore = useAlertStore();

export default {
  components: {
    BulkUploadDialog,
    AddItemDialog,
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
        upload: false,
      },

      sortBy: [{ key: 'code', order: 'desc' }],
      csvHeaders: 'name,date,price', // Explicitly defined as visible headers may not necessarily be all of the data
      headers: [
        {
          key: 'name',
          title: 'Name',
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
          width: '5%',
        },
      ],
    };
  },
  methods: {
    async addItem (payload) {
      try {
        await addItem(payload).then(() => {
          alertStore.showMessage('success', 'Successfully Added!');
          this.overlayFlags.add = false;
          this.overlayFlags.edit = false;
        }),
        this.$emit('refresh');
      } catch {
        // handle(error)
      }
    },

    async removeItem(id) {
      try {
        await removeItem(id).then(() => {
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
  <add-item-dialog
    v-model="overlayFlags.add"
    @add="addItem($event)"
  />

  <v-tabs-window-item value="others">
    <base-table
      v-model:sort-by="sortBy"
      :headers="headers"
      :items="items"
      :loading="loading"
      :edit="false"
      @add="overlayFlags.add = true"
      @upload="overlayFlags.upload = true"
      @remove="removeItem($event)"
      @download="$emit('download')"
    >
      <template #[`item.cost`]="{ item }">
        {{ formatDollar(item.cost) }}
      </template>
    </base-table>
  </v-tabs-window-item>
</template>