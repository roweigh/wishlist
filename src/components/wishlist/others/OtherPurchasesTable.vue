<script>
import {
  addItem,
  updateItem,
  removeItem,
} from '@/api/purchases';

import CrudMixin from '@/mixins/CrudMixin';
import AddItemDialog from './AddItemDialog.vue';
import EditItemDialog from './EditItemDialog.vue';
import BulkUploadDialog from '@/components/wishlist/dialog/BulkUploadDialog.vue';

export default {
  components: {
    BulkUploadDialog,
    AddItemDialog,
    EditItemDialog,
  },
  mixins: [
    CrudMixin({
      addFn: addItem,
      updateFn: updateItem,
      removeFn: removeItem,
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
  ],
  data () {
    return {
      sortBy: [{ key: 'code', order: 'desc' }],
      csvHeaders: 'name,date,price', // Explicitly defined as visible headers may not necessarily be all of the data
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
  <add-item-dialog
    v-model="overlayFlags.add"
    @add="add($event)"
  />

  <edit-item-dialog
    v-model="overlayFlags.edit"
    @update="update($event)"
  />

  <bulk-upload-dialog
    v-model="overlayFlags.upload"
    :csv-headers="csvHeaders"
    @upload="$emit('upload', $event)"
  />

  <v-tabs-window-item value="others">
    <base-table
      v-model:sort-by="sortBy"
      :loading="loading"
      :headers="headers"
      :items="items"
      @add="overlayFlags.add = true"
      @edit="overlayFlags.edit = $event"
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