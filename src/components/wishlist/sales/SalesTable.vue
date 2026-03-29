<script>
import {
  addSale,
  updateSale,
  removeSale,
} from '@/api/purchases';

import CrudMixin from '@/mixins/CrudMixin';
import AddSaleDialog from './AddSaleDialog.vue';
import EditSaleDialog from './EditSaleDialog.vue';
import BulkUploadDialog from '@/components/wishlist/dialog/BulkUploadDialog.vue';

export default {
  components: {
    BulkUploadDialog,
    AddSaleDialog,
    EditSaleDialog,
  },
  mixins: [
    CrudMixin({
      addFn: addSale,
      updateFn: updateSale,
      removeFn: removeSale,
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
  <add-sale-dialog
    v-model="overlayFlags.add"
    @add="add($event)"
  />

  <edit-sale-dialog
    v-model="overlayFlags.edit"
    :loading="loading"
    @update="update($event)"
    @refresh="$emit('refresh')"
  />

  <bulk-upload-dialog
    v-model="overlayFlags.upload"
    :csv-headers="csvHeaders"
    @upload="$emit('upload', $event)"
  />

  <v-tabs-window-item value="sales">
    <base-table
      v-model:sort-by="sortBy"
      :headers="headers"
      :items="items"
      :loading="loading"
      @add="overlayFlags.add = true"
      @edit="overlayFlags.edit = $event"
      @upload="overlayFlags.upload = true"
      @remove="remove($event)"
      @download="$emit('download')"
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