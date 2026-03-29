<script>
import {
  addSale,
  updateSale,
  removeSale,
} from '@/api/purchases';

import BulkUploadDialog from '@/components/wishlist/dialog/BulkUploadDialog.vue';
import AddSaleDialog from './AddSaleDialog.vue';
import EditSaleDialog from './EditSaleDialog.vue';

import { useAlertStore } from '@/stores/alert';
const alertStore = useAlertStore();

export default {
  components: {
    BulkUploadDialog,
    AddSaleDialog,
    EditSaleDialog,
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
          width: '10%',
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
    async addSale (payload) {
      try {
        await addSale(payload).then(() => {
          alertStore.showMessage('success', 'Successfully Added!');
          this.overlayFlags.add = false;
          this.overlayFlags.edit = false;
        }),
        this.$emit('refresh');
      } catch {
        // handle(error)
      }
    },

    async updateSale (payload) {
      try {
        const id = this.overlayFlags?.edit?.id;
        await updateSale(id, payload).then(() => {
          alertStore.showMessage('success', 'Successfully Updated!');
        }),
        this.$emit('refresh');
      } catch {
        // handle(error)
      }
    },

    async removeSale(id) {
      try {
        await removeSale(id).then(() => {
          alertStore.showMessage('success', 'Successfully Removed!');
        });
        this.$emit('refresh');
      } catch {
        // handle(error)
      }
    },

    formatDate (v) {
      const ms = (v?.seconds || 0) * 1000 + (v?.nanoseconds || 0) / 1_000_000;
      return new Date(ms).toDateString();
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

  <add-sale-dialog
    v-model="overlayFlags.add"
    @add="addSale($event)"
  />

  <edit-sale-dialog
    v-model="overlayFlags.edit"
    :loading="loading"
    @update="updateSale($event)"
    @refresh="$emit('refresh')"
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
      @remove="removeSale($event)"
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