<script>
import BulkTable from '@/components/wishlist/BulkTable.vue';
import BulkUploadDialog from '../components/wishlist/BulkUploadDialog.vue';
import EditBulkDialog from '../components/wishlist/EditBulkDialog.vue';

import {
  getCards,
  addCard,
  updateCard,
  delAll,
  getPurchaseHistory,

  getTournamentEntry,
  updateTournamentEntry,
} from '../api/wishlist';
import TournamentEntryInput from '../components/wishlist/TournamentEntryInput.vue';

export default {
  components: {
    BulkTable,
    BulkUploadDialog,
    EditBulkDialog,
    TournamentEntryInput,
  },
  data () {
    return {
      selectedDates: [],
      tableData: [],
      overlayFlags: {
        edit: false,
        upload: false,
      },
    };
  },
  async mounted () {
    await this.get();
  },
  methods: {
    async loadFromClipboard () {
      try {
        const text = await navigator.clipboard.readText();
        this.tableData = this.parseDecklist(text);
      } catch (err) {
        console.error('Failed to read clipboard:', err);
      }
    },

    async get () {
      this.tableData = await getCards();
      this.selectedDates = await getTournamentEntry().then(response => {
        return response[0].dates.map(v => {
          return new Date(v?.seconds * 1000 + v?.nanoseconds / 1_000_000);
        });
      });
    },

    async add (payload) {
      await addCard(payload),
      await this.get();
      this.overlayFlags.edit = null;
    },

    async update (payload) {
      const id = this.overlayFlags.edit.id;
      await updateCard(id, payload),
      await this.get();
      this.overlayFlags.edit = null;
    },

    async remove(id) {
      await delAll(id);
      await this.get();
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
      console.log(cards);

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

    async saveTournamentEntry() {
      await updateTournamentEntry({
        dates: this.selectedDates,
      });
    },

    upload (payload) {
      this.tableData = this.tableData.concat(payload);
    },

    parseDecklist (text) {
      return text.split(/\r?\n/).map(line => {
        const cardQty = line.trim().match(/^(\d+)x(.+)$/);
        const qtyNeeded = Number(cardQty?.[1]);
        const code = cardQty?.[2].trim();

        if (!cardQty) {
          return null;
        } else {
          return {
            code,
            qtyNeeded,
            qtyAcquired: 0,
            cost: '',
            notes: '',
          };
        }
      });
    },

  },
};
</script>

<template>
  <flex-col class="pa-5 grow">
    <flex-row>
      <v-text-field
        label="Boosters"
        density="compact"
      />
      <v-text-field
        label="Accessories"
        density="compact"
        class="ml-5"
      />
    </flex-row>

    <flex-row class="justify-end">
      <tournament-entry-input
        v-model="selectedDates"
        @save="saveTournamentEntry()"
      />
    </flex-row>

    <bulk-table
      :items="tableData"
      @add="overlayFlags.edit = true"
      @edit="overlayFlags.edit = $event"
      @upload="overlayFlags.upload = true"
      @download="download()"
      @remove="remove($event)"
      @load="loadFromClipboard()"
    />

    <edit-bulk-dialog
      v-model="overlayFlags.edit"
      @add="add($event)"
      @update="update($event)"
      @refresh="get()"
    />

    <bulk-upload-dialog
      v-model="overlayFlags.upload"
      @upload="upload($event)"
    />
  </flex-col>
</template>