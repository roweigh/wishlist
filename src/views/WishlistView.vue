<script>
import {
  getCards,
  getEntries,
  bulkImport,
} from '@/api/purchases';

import SinglesTable from '@/components/wishlist/singles/SinglesTable.vue';
import SalesTable from '@/components/wishlist/sales/SalesTable.vue';
import EntriesTable from '@/components/wishlist/tournament/EntriesTable.vue';
import OtherPurchasesTable from '@/components/wishlist/others/OtherPurchasesTable.vue';

import { useAlertStore } from '@/stores/alert';
const alertStore = useAlertStore();

export default {
  components: {
    SinglesTable,
    SalesTable,
    EntriesTable,
    OtherPurchasesTable,
  },
  data () {
    return {
      loadingFlags: {
        initializing: true,
        singles: true,
        sales: true,
        tournament: true,
        others: true,
      },

      tab: 'others',
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
    await this.getSingles();
    await this.getSales();
    await this.getEntryFees();
    await this.getOthers();
  },

  methods: {
    async getSingles () {
      this.loadingFlags.singles = true;
      try {
        this.singles = await getCards('singles');
      } catch {
        // handle(error)
      } finally {
        this.loadingFlags.singles = false;
      }
    },

    async getSales () {
      this.loadingFlags.sales = true;
      try {
        this.sales = await getCards('sales');
      } catch {
        // handle(error)
      } finally {
        this.loadingFlags.sales = false;
      }
    },

    async getEntryFees () {
      this.loadingFlags.tournament = true;
      try {
        this.tournament = await getEntries('tournament');
      } catch {
        // handle(error)
      } finally {
        this.loadingFlags.tournament = false;
      }
    },

    async getOthers () {
      this.loadingFlags.others = true;
      try {
        this.others = await getEntries('others');
      } catch {
        // handle(error)
      } finally {
        this.loadingFlags.others = false;
      }
    },

    async bulkUpload (arr) {
      await bulkImport(this.tab, arr).then(() => {
        alertStore.showMessage('success', `Successfully imported ${arr.length} items!`);
      });
      this[this.tab] = await getCards(this.tab);
    },

    async download () {
      const test = this.singles;
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
          icon
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
          :loading="loadingFlags.singles"
          @upload="bulkUpload($event)"
          @download="download()"
          @refresh="getSingles()"
        />

        <sales-table
          :items="sales"
          :loading="loadingFlags.sales"
          @upload="bulkUpload($event)"
          @download="download()"
          @refresh="getSales()"
        />

        <entries-table
          :items="tournament"
          :loading="loadingFlags.tournament"
          @upload="bulkUpload($event)"
          @download="download()"
          @refresh="getEntryFees()"
        />

        <other-purchases-table
          :items="others"
          :loading="loadingFlags.others"
          @upload="bulkUpload($event)"
          @download="download()"
          @refresh="getOthers()"
        />
      </v-tabs-window>
    </v-card>
  </flex-col>
</template>