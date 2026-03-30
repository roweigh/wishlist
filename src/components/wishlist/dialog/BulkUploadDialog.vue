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
  },
};
</script>

<template>
  <base-dialog
    :model-value="modelValue"
    title="Bulk Upload"
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
        <v-textarea
          v-model="csvInput"
          class="code-input ma-3"
          variant="outlined"
          rows="20"
          max-rows="20"
          auto-grow
          hide-details
        >
          <template #prepend-inner>
            <hover-icon
              icon="mdi-information-outline"
              class="mr-1"
            >
              <template #tooltip-text>
                <flex-col style="max-width: 400px">
                  <span>Either write the CSV yourself if you are a clanker or get one to do it for you.</span>
                  <span>If you're not a clanker: just copy the contents to AI as well as whatever card purchase information you have and tell it to format it as a CSV with what you gave it as the headers and put the output here. I'm sure it'll figure it out</span>
                  <span>Make sure to ask for date in ISO 8601 format though!</span>
                </flex-col>
              </template>
            </hover-icon>
          </template>
        </v-textarea>
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