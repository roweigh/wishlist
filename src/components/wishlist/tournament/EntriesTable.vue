<script>
import {
  getEntries,
  addEntry,
  removeEntry,
} from '@/api/purchases';

import CrudMixin from '@/mixins/CrudMixin';
import BulkUploadDialog from '@/components/wishlist/dialog/BulkUploadDialog.vue';
import AddEntryDialog from './AddEntryDialog.vue';

export default {
  components: {
    BulkUploadDialog,
    AddEntryDialog,
  },
  mixins: [
    CrudMixin({
      getFn: getEntries,
      addFn: addEntry,
      removeFn: removeEntry,
    }),
  ],
  props: {
    value: { type: String, required: true },
  },
  data () {
    return {
      sortBy: [{ key: 'date', order: 'desc' }],
      csvHeaders: 'date,amtSpent', // Explicitly defined as visible headers may not necessarily be all of the data
      headers: [
        {
          key: 'date',
          title: 'Date',
        },
        {
          key: 'amtSpent',
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
    v-model="overlayFlags.edit"
    @add="add($event);"
  />

  <bulk-upload-dialog
    v-model="overlayFlags.upload"
    :csv-headers="csvHeaders"
    @upload="bulkUpload($event)"
  />

  <v-tabs-window-item value="tournament">
    <base-table
      v-model:sort-by="sortBy"
      :loading="loadingFlags.loading"
      :headers="headers"
      :items="items"
      :edit="false"
      @add="overlayFlags.edit = true"
      @upload="overlayFlags.upload = true"
      @remove="remove($event)"
      @download="download()"
    >
      <template #[`item.date`]="{ item }">
        {{ formatDate(item.date) }}
      </template>

      <template #[`item.amtSpent`]="{ item }">
        {{ formatDollar(item.amtSpent) }}
      </template>
    </base-table>
  </v-tabs-window-item>
</template>