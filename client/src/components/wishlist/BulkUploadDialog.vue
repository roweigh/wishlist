<script>
import { VFileUpload } from 'vuetify/labs/VFileUpload';

export default {
  components: {
    VFileUpload,
  },
  props: {
    modelValue: { type: Boolean, required: true },
  },
  emits: [
    'update:model-value',
    'upload',
  ],
  data () {
    return {
      bulk: null,
    };
  },
  methods: {
    uploadBulk() {
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
    @update:model-value="$emit('update:model-value', $event)"
    @submit="uploadBulk()"
  >
    <v-file-upload
      filter-by-type=".csv"
      @update:model-value="handleFileChange($event)"
    />
  </base-dialog>
</template>