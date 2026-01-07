<script>
import BulkTable from '@/components/wishlist/BulkTable.vue';
import BulkUploadDialog from '../components/wishlist/BulkUploadDialog.vue';
import EditBulkDialog from '../components/wishlist/EditBulkDialog.vue';

export default {
  components: {
    BulkTable,
    BulkUploadDialog,
    EditBulkDialog,
  },
  data () {
    return {
      overlayFlags: {
        edit: false,
        upload: false,
      },
      tableData: [
        {
          code: 'OP13-120',
          name: 'Sabo',
          qtyNeeded: 4,
        },
      ],
    };
  },
  methods: {
    async loadFromClipboard () {
      try {
        const text = await navigator.clipboard.readText();
        console.log(this.parseDecklist(text));
        this.tableData = this.parseDecklist(text);
      } catch (err) {
        console.error('Failed to read clipboard:', err);
      }
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


    // Temp functions
    add (payload) {
      console.log(payload);

      this.tableData.push(payload);
      this.overlayFlags.edit = null;
    },

    update (payload) {
      console.log(payload);

      this.overlayFlags.edit.code = payload.code;
      this.overlayFlags.edit.name = payload.name;
      this.overlayFlags.edit.qtyNeeded = payload.qtyNeeded;
      this.overlayFlags.edit.qtyAcquired = payload.qtyAcquired;

      this.overlayFlags.edit = null;
    },

    upload (payload) {
      console.log(payload);

      this.tableData = this.tableData.concat(payload);
    },
  },
};
</script>

<template>
  <flex-col class="pa-5 grow">
    <flex-row>
      <v-text-field
        label="Tournament Entry"
        density="compact"
        class="mr-5"
      />
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

    <bulk-table
      :items="tableData"
      @add="overlayFlags.edit = true"
      @edit="overlayFlags.edit = $event"
      @upload="overlayFlags.upload = true"
      @load="loadFromClipboard()"
    />

    <edit-bulk-dialog
      v-model="overlayFlags.edit"
      @add="add($event)"
      @edit="update($event);"
    />

    <bulk-upload-dialog
      v-model="overlayFlags.upload"
      @upload="upload($event)"
    />
  </flex-col>
</template>