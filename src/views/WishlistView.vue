<script>
import {
  getCards,
  addCard,
  updateCard,
  removeCard,
  getPurchaseHistory,

  bulkImport,
} from '@/api/purchases';

import SinglesTable from '@/components/wishlist/SinglesTable.vue';
import SalesTable from '@/components/wishlist/SalesTable.vue';
import EntriesTable from '@/components/wishlist/EntriesTable.vue';
import OtherPurchasesTable from '@/components/wishlist/OtherPurchasesTable.vue';
import BulkUploadDialog from '@/components/wishlist/BulkUploadDialog.vue';

import AddBulkDialog from '@/components/wishlist/dialog/AddBulkDialog.vue';
import EditBulkDialog from '@/components/wishlist/dialog/EditBulkDialog.vue';

import { useAlertStore } from '@/stores/alert';
const alertStore = useAlertStore();

export default {
  components: {
    SinglesTable,
    SalesTable,
    EntriesTable,
    OtherPurchasesTable,

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

      tab: 'singles',
      tabs: [
        { value: 'singles', title: 'Singles', icon: 'mdi-cards-outline' },
        { value: 'sales', title: 'Sales', icon: 'mdi-finance' },
        { value: 'tournament', title: 'Entry Fees', icon: 'mdi-trophy-outline'  },
        { value: 'others', title: 'Other Purchases', icon: 'mdi-view-grid-outline'  },
      ],
      singles: [],
      sales: [],
      tournament: [],
      others: [],
    };
  },

  async mounted () {
    this.singles = await this.get('singles');
    this.sales = await this.get('sales');
    this.tournament = await this.get('tournament');
    this.others = await this.get('others');
  },

  methods: {
    async get (col) {
      this.loadingFlags.loading = true;
      try {
        return await getCards(col);
      } catch {
        // handle(error)
      } finally {
        this.loadingFlags.loading = false;
      }
    },

    async addCard (payload) {
      try {
        await addCard(payload).then(() => {
          alertStore.showMessage('success', 'Successfully Added!');
          this.overlayFlags.add = false;
          this.overlayFlags.edit = false;
        }),
        await this.getCards();
      } catch {
        // handle(error)
      }
    },

    async updateCard (payload) {
      try {
        const id = this.overlayFlags?.edit?.id;
        await updateCard(id, payload).then(() => {
          alertStore.showMessage('success', 'Successfully Updated!');
        }),
        await this.getCards();
      } catch {
        // handle(error)
      }
    },

    async removeCard(id) {
      try {
        await removeCard(id).then(() => {
          alertStore.showMessage('success', 'Successfully Removed!');
        });
        await this.getCards();
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

    async bulkUpload (arr) {
      await bulkImport(this.tab, arr);
      console.log('done');
      // console.log(path);
      // console.log(arr);
    },
  },
};
</script>

<template>
  <flex-col class="pa-5 grow">
    <flex-row>
      <v-tabs
        v-model="tab"
        color="teal-accent-3"
        grow
      >
        <v-tab
          v-for="{value, title, icon} in tabs"
          :key="value"
          :value="value"
          icon="mdi-finance"
        >
          <v-icon
            :icon="icon"
            class="mx-2"
          />
          {{ title }}
        </v-tab>
      </v-tabs>
    </flex-row>

    <v-card class="mt-5">
      <v-tabs-window v-model="tab">
        <singles-table
          :items="singles"
          :loading="loadingFlags.loading"
          @add="overlayFlags.add = true"
          @edit="overlayFlags.edit = $event"
          @upload="overlayFlags.upload = true"
          @remove="removeCard($event)"
          @download="download()"
          @load="bulkUpload($event)"
        />

        <sales-table
          :items="sales"
          :loading="loadingFlags.loading"
          @add="overlayFlags.add = true"
          @edit="overlayFlags.edit = $event"
          @upload="overlayFlags.upload = true"
          @remove="removeCard($event)"
          @download="download()"
          @load="bulkUpload($event)"
        />

        <entries-table
          :items="tournament"
          :loading="loadingFlags.loading"
          @add="overlayFlags.add = true"
          @edit="overlayFlags.edit = $event"
          @upload="overlayFlags.upload = true"
          @remove="removeCard($event)"
          @download="download()"
          @load="bulkUpload($event)"
        />

        <other-purchases-table
          :items="others"
          :loading="loadingFlags.loading"
          @add="overlayFlags.add = true"
          @edit="overlayFlags.edit = $event"
          @upload="overlayFlags.upload = true"
          @remove="removeCard($event)"
          @download="download()"
          @load="bulkUpload($event)"
        />
      </v-tabs-window>
    </v-card>
  </flex-col>

  <bulk-upload-dialog
    v-model="overlayFlags.upload"
    @upload="bulkUpload($event)"
  />

  <add-bulk-dialog
    v-model="overlayFlags.add"
    @add="addCard($event)"
    @refresh="getCards()"
  />

  <edit-bulk-dialog
    v-model="overlayFlags.edit"
    @add="addCard($event)"
    @update="updateCard($event)"
    @refresh="getCards()"
  />
</template>