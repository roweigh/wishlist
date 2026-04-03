import { bulkImport } from '@/api/purchases';

import { useAlertStore } from '@/stores/alert';
const alertStore = useAlertStore();

export default ({
  getFn,
  addFn,
  updateFn,
  removeFn,
}) => {
  return {
    data () {
      return {
        overlayFlags: {
          add: false,
          edit: false,
          upload: false,
        },
        loadingFlags: {
          loading: true,
        },
        items: [],
      };
    },
    async mounted () {
      await this.get();
    },
    methods: {
      async get () {
        this.overlayFlags.add = false;
        this.overlayFlags.edit = false;
        this.loadingFlags.loading = true;
        try {
          this.items = await getFn();
          this.loadingFlags.loading = false;
        } catch(error) {
          console.error(error);
        }
      },

      async add (payload) {
        try {
          await addFn(payload).then(() => {
            alertStore.showMessage('success', 'Successfully Added!');
          }),
          await this.get();
        } catch(error) {
          console.error(error);
        }
      },

      async update (payload) {
        try {
          const id = this.overlayFlags?.edit?.id;
          await updateFn(id, payload).then(() => {
            alertStore.showMessage('success', 'Successfully Updated!');
          }),
          await this.get();
        } catch(error) {
          console.error(error);
        }
      },

      async remove (id) {
        try {
          await removeFn(id).then(() => {
            alertStore.showMessage('success', 'Successfully Removed!');
          });
          await this.get();
        } catch(error) {
          console.error(error);
        }
      },

      async bulkUpload (arr) {
        await bulkImport(this.value, arr).then(() => {
          alertStore.showMessage('success', `Successfully imported ${arr.length} items!`);
        });
        await this.get();
      },

      async download () {
        const cards = this.items.map(({ code, name, qtyAcquired, qtyNeeded, amtSpent, deck, date }) => {
          const ms = (date?.seconds || 0) * 1000 + (date?.nanoseconds || 0) / 1_000_000;
          const dateTransformed = ms > 0 ? new Date(ms).toISOString() : new Date().toISOString();
          return {
            code,
            name,
            qtyAcquired,
            qtyNeeded,
            deck,
            date: dateTransformed,
            amtSpent,
          };
        });
        // .sort((a, b) => {
        //   // 1. First, compare the codes numerically
        //   const codeCompare = a.code.localeCompare(b.code, undefined, {
        //     numeric: true,
        //   });

        //   // 2. If the codes are different, use that result
        //   if (codeCompare !== 0) {
        //     return codeCompare;
        //   }

        //   // 3. If the codes are identical, sort by qtyAcquired (ascending)
        //   return a.qtyAcquired - b.qtyAcquired;
        // });

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

      formatDate (v) {
        const date = new Date(v.seconds * 1000);
        return date.toLocaleDateString('en-NZ', {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric',
        });
      },

      formatDollar (v) {
        return `$${(v).toFixed(2)}`;
      },
    },
  };
};