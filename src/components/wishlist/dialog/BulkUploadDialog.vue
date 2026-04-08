<script>
import { VFileUpload } from 'vuetify/labs/VFileUpload';

export default {
  components: {
    VFileUpload,
  },
  props: {
    modelValue: { type: Boolean, required: true },
    csvHeaders: { type: String, default: null },
  },
  emits: [
    'update:model-value',
    'upload',
  ],
  data () {
    return {
      uploadMode: 'file',
      csvInput: null,
      bulk: null,
    };
  },
  watch: {
    modelValue (v) {
      if (v) {
        this.csvInput = this.csvHeaders;
      }
    },
  },
  methods: {
    uploadBulk() {
      if (this.uploadMode === 'csv') {
        this.bulk = this.csvToArray(this.csvInput);
      }
      this.$emit('upload', this.bulk);
      this.$emit('update:model-value', false);
    },

    csvToArray(csvText) {
      const lines = csvText.trim().split('\n');

      // 1. Get the headers from the first line
      const headers = lines[0].split(',');

      // 2. Map the rest of the lines into objects
      return lines.slice(1).map(line => {
        // This regex handles the commas inside the quotes correctly
        const values = line.match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g);

        const obj = {};
        headers.forEach((header, index) => {
          let value = values[index] ? values[index].replace(/^"|"$/g, '') : '';

          // 3. Optional: Convert numbers back to numbers
          if (!isNaN(value) && value !== '') {
            obj[header] = Number(value);
          } else {
            obj[header] = value;
          }
        });
        return obj;
      });
    },

    handleFileChange(file) {
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const csv = e.target.result;
        this.bulk = this.csvToArray(csv);
      };

      reader.readAsText(file);
    },

    async getPrompt(){
      try {
        const regex = /^[A-Z]+(\d{2})?-\d{3}$/;
        const text = `
          I will send some card purchase data that I want converted to CSV. 
          The headers are ${this.csvHeaders}. 
          Dates must be in ISO 8601 dateTime format.
          Anything that matches the regex ${regex} is the code, add a '*' to the end if the card is an alternate art
          Unless specified otherwise, the qtyNeeded and qtyAcquired can be the same value.
          Each cell value needs to be wrapped in double quotes except for the headers
          Give the output in text for me to copy.
          `;
        await navigator.clipboard.writeText(text);

        console.log('Text copied to clipboard successfully!');
      } catch (err) {
        console.error('Failed to copy: ', err);
      }
    },
  },
};
</script>

<template>
  <base-dialog
    :model-value="modelValue"
    title="Bulk Upload"
    width="40vw"
    @update:model-value="$emit('update:model-value', $event)"
    @submit="uploadBulk()"
  >
    <v-tabs
      v-model="uploadMode"
      group
      grow
    >
      <v-tab value="file">
        File Upload
      </v-tab>

      <v-tab value="csv">
        Raw CSV
      </v-tab>
    </v-tabs>

    <v-tabs-window v-model="uploadMode">
      <v-tabs-window-item value="file">
        <v-file-upload
          class="ma-3"
          filter-by-type=".csv"
          @update:model-value="handleFileChange($event)"
        />
      </v-tabs-window-item>

      <v-tabs-window-item value="csv">
        <v-alert
          color="info"
          variant="tonal"
          class="text-pre-line ma-3"
        >
          Either write the CSV yourself if you are a clanker or get one to do it for you. <br>
          Make sure the date is in ISO 8601 format. <br>
          <br>
          If you're going the clanker route, here's a prompt that worked for me:
          <v-btn
            icon="mdi-content-copy"
            density="compact"
            variant="text"
            @click="getPrompt()"
          />
        </v-alert>
        <v-textarea
          v-model="csvInput"
          class="code-input mx-3"
          variant="outlined"
          rows="15"
          max-rows="15"
          auto-grow
          hide-details
        />
      </v-tabs-window-item>
    </v-tabs-window>
  </base-dialog>
</template>

<style scoped>
.code-input :deep(textarea) {
  font-family: 'Fira Code', 'Roboto Mono', monospace !important;
  font-size: 14px !important;
  line-height: 1.5 !important;
  /* color: #d4d4d4 !important; VS Code light grey text */
  letter-spacing: 0.5px;
}
/* Optional: Style the border to look more like an editor */
.code-input :deep(.v-field__outline) {
  --v-field-border-opacity: 0.5;
  color: #3e3e3e;
}
</style>