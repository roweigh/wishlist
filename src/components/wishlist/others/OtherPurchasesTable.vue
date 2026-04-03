<script>
import {
  getItems,
  addItem,
  updateItem,
  removeItem,
} from '@/api/purchases';

import CrudMixin from '@/mixins/CrudMixin';
import BulkUploadDialog from '@/components/wishlist/dialog/BulkUploadDialog.vue';
import EditItemDialog from './EditItemDialog.vue';

export default {
  components: {
    BulkUploadDialog,
    EditItemDialog,
  },
  mixins: [
    CrudMixin({
      getFn: getItems,
      addFn: addItem,
      updateFn: updateItem,
      removeFn: removeItem,
    }),
  ],
  props: {
    value: { type: String, required: true },
  },
  data () {
    return {
      sortBy: [{ key: 'code', order: 'desc' }],
      csvHeaders: 'name,date,amtSpent', // Explicitly defined as visible headers may not necessarily be all of the data
      headers: [
        {
          key: 'name',
          title: 'Name',
        },
        {
          key: 'date',
          title: 'Date',
          width: '5%',
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
  <edit-item-dialog
    v-model="overlayFlags.edit"
    @add="add($event);"
    @update="update($event)"
  />

  <bulk-upload-dialog
    v-model="overlayFlags.upload"
    :csv-headers="csvHeaders"
    @upload="bulkUpload($event)"
  />

  <v-tabs-window-item value="others">
    <base-table
      v-model:sort-by="sortBy"
      :loading="loadingFlags.loading"
      :headers="headers"
      :items="items"
      @add="overlayFlags.edit = true"
      @edit="overlayFlags.edit = $event"
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