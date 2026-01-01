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
      // Split rows on \n and filter out blank lines
      // TODO clean this up so it makes sense to me lol
      const rows = csvText.split(/\r?\n/).filter(row => row.trim() !== '');
      const headers = rows[0].split(',').map(h => h.trim().replace(/\r$/, ''));

      return rows.slice(1).map(row => {
        const cols = row.split(',').map(col => col.trim().replace(/\r$/, ''));

        return headers.reduce((obj, header, i) => {
          obj[header] = cols[i] ?? '';
          return obj;
        }, {});
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