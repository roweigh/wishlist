<script>
import {
  getSales,
  addSale,
  updateSale,
  removeSale,
} from '@/api/purchases';

import CrudMixin from '@/mixins/CrudMixin';
import BulkUploadDialog from '@/components/wishlist/dialog/BulkUploadDialog.vue';
import EditSaleDialog from './EditSaleDialog.vue';

export default {
  components: {
    BulkUploadDialog,
    EditSaleDialog,
  },
  mixins: [
    CrudMixin({
      getFn: getSales,
      addFn: addSale,
      updateFn: updateSale,
      removeFn: removeSale,
    }),
  ],
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
      csvHeaders: 'code,name,qty,amtSold,date', // Explicitly defined as visible headers may not necessarily be all of the data
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
          key: 'date',
          title: 'Date',
          width: '5%',
        },
        {
          key: 'qty',
          title: 'Quantity',
          align: 'end',
          width: '5%',
        },
        {
          key: 'amtSpent',
          title: 'Amount Sold',
          align: 'end',
          width: '8%',
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
  <edit-sale-dialog
    v-model="overlayFlags.edit"
    @add="add($event)"
    @update="update($event)"
  />

  <bulk-upload-dialog
    v-model="overlayFlags.upload"
    :csv-headers="csvHeaders"
    @upload="bulkUpload($event)"
  />

  <v-tabs-window-item value="sales">
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
        {{ formatDollar(item.amtSpent * -1) }}
      </template>
    </base-table>
  </v-tabs-window-item>
</template>