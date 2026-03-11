<script>
import {
  getCards,
  addCard,
  updateCard,
  removeCard,
  getPurchaseHistory,
} from '@/api/purchases';

import BulkTable from '@/components/wishlist/BulkTable.vue';
import AddBulkDialog from '@/components/wishlist/dialog/AddBulkDialog.vue';
import EditBulkDialog from '@/components/wishlist/dialog/EditBulkDialog.vue';

import BulkUploadDialog from '@/components/wishlist/BulkUploadDialog.vue';

import { useAlertStore } from '@/stores/alert';
const alertStore = useAlertStore();

export default {
  components: {
    BulkTable,
    BulkUploadDialog,
    AddBulkDialog,
    EditBulkDialog,
  },
  data () {
    return {
      loadingFlags: {
        initializing: true,
        loading: true,
      },
      overlayFlags: {
        add: false,
        edit: false,
        upload: false,
      },

      cards: [],
    };
  },
  async mounted () {
    await this.getCards();
  },
  methods: {
    async getCards () {
      this.loadingFlags.loading = true;
      try {
        this.cards = await getCards();
      } catch {
        // handle(error)
      } finally {
        this.loadingFlags.loading = false;
      }
    },

    async addCard (payload) {
      this.loadingFlags.loading = true;
      try {
        await addCard(payload),
        await this.getCards();
        alertStore.showMessage('success', 'Successfully Added!');
        this.overlayFlags.add = false;
        this.loadingFlags.loading = false;
      } catch {
        // handle(error)
      }
    },

    async updateCard (payload) {
      const id = this.overlayFlags?.edit?.id;
      this.loadingFlags.loading = true;
      try {
        await updateCard(id, payload),
        await this.getCards();
        alertStore.showMessage('success', 'Successfully Updated!');
        this.loadingFlags.loading = false;
      } catch {
        // handle(error)
      }
    },

    async removeCard(id) {
      this.loadingFlags.loading = true;
      try {
        await removeCard(id);
        await this.getCards();
        this.overlayFlags.edit = false;
        alertStore.showMessage('success', 'Successfully Removed!');
      } catch {
        // handle(error)
      }
    },

    async download () {
      const test = await getPurchaseHistory();
      const cards = test.map(({ code, name, qtyAcquired, qtyNeeded, amtSpent, date }) => {
        const ms = (date?.seconds || 0) * 1000 + (date?.nanoseconds || 0) / 1_000_000;
        const dateTransformed = ms > 0 ? new Date(ms).toISOString() : new Date().toISOString();
        return {
          code,
          name,
          qtyAcquired,
          qtyNeeded,
          amtSpent,
          date: dateTransformed,
        };
      }).sort((a, b) => {
        // 1. First, compare the codes numerically
        const codeCompare = a.code.localeCompare(b.code, undefined, {
          numeric: true,
        });

        // 2. If the codes are different, use that result
        if (codeCompare !== 0) {
          return codeCompare;
        }

        // 3. If the codes are identical, sort by qtyAcquired (ascending)
        return a.qtyAcquired - b.qtyAcquired;
      });

      function convertToCSV(objArray) {
        if (objArray.length === 0) return '';

        // 1. Extract headers
        const headers = Object.keys(objArray[0]);

        // 2. Build rows
        const rows = objArray.map(obj => {
          return headers.map(header => {
            let value = obj[header] ?? '';
            // Escape double quotes and wrap string values in quotes
            if (typeof value === 'string') {
              value = `"${value.replace(/"/g, '""')}"`;
            }
            return value;
          }).join(',');
        });

        // 3. Combine headers and rows
        return [headers.join(','), ...rows].join('\n');
      }

      const csvString = convertToCSV(cards);
      console.log(csvString);

      function downloadCSV(csvString, filename = 'purchase_history.csv') {
        // 1. Create a Blob from the CSV string
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });

        // 2. Create a hidden anchor element
        const link = document.createElement('a');

        // 3. Create a URL for the Blob and set it as the href
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);

        // 4. Append to the body, click it, and remove it
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // 5. Clean up the URL object to free up memory
        URL.revokeObjectURL(url);
      }
      downloadCSV(csvString);
    },

    bulkUpload () {

    },
  },
};
</script>

<template>
  <flex-col class="pa-5 grow">
    <bulk-table
      :loading="loadingFlags.loading"
      :items="cards"
      @add="overlayFlags.add = true"
      @edit="overlayFlags.edit = $event"
      @upload="overlayFlags.upload = true"
      @remove="removeCard($event)"
      @download="download()"
      @load="bulkUpload($event)"
    />
  </flex-col>

  <add-bulk-dialog
    v-model="overlayFlags.add"
    @add="addCard($event)"
    @refresh="getCards()"
  />

  <edit-bulk-dialog
    v-model="overlayFlags.edit"
    @update="updateCard($event)"
    @refresh="getCards()"
  />

  <bulk-upload-dialog
    v-model="overlayFlags.upload"
    @upload="bulkUpload($event)"
  />
</template>