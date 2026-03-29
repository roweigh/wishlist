<script>
import {
  addEntry,
  removeEntry,
} from '@/api/purchases';

import CrudMixin from '@/mixins/CrudMixin';
import AddEntryDialog from './AddEntryDialog.vue';
import BulkUploadDialog from '@/components/wishlist/dialog/BulkUploadDialog.vue';

export default {
  components: {
    BulkUploadDialog,
    AddEntryDialog,
  },
  mixins: [
    CrudMixin({
      addFn: addEntry,
      removeFn: removeEntry,
    }),
  ],
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
      sortBy: [{ key: 'date', order: 'desc' }],
      csvHeaders: 'date,price', // Explicitly defined as visible headers may not necessarily be all of the data
      headers: [
        {
          key: 'date',
          title: 'Date',
        },
        {
          key: 'unitCost',
          title: 'Price',
          align: 'end',
          width: '5%',
        },
        {
          key: 'actions',
          align: 'end',
          sortable: false,
          width: '0%',
        },
      ],
    };
  },
};
</script>

<template>
  <add-entry-dialog
    v-model="overlayFlags.add"
    @add="add($event);"
  />

  <bulk-upload-dialog
    v-model="overlayFlags.upload"
    :csv-headers="csvHeaders"
    @upload="$emit('upload', $event)"
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
      @remove="remove($event)"
      @download="$emit('download')"
    >
      <template #[`item.date`]="{ item }">
        {{ formatDate(item.date) }}
      </template>

      <template #[`item.unitCost`]="{ item }">
        {{ formatDollar(item.unitCost) }}
      </template>
    </base-table>
  </v-tabs-window-item>
</template>