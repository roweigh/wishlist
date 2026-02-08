<script>
import BulkTable from '@/components/wishlist/BulkTable.vue';
import BulkUploadDialog from '../components/wishlist/BulkUploadDialog.vue';
import EditBulkDialog from '../components/wishlist/EditBulkDialog.vue';

import {
  getCards,
  addCard,
  delAll,
} from '../api/wishlist';

export default {
  components: {
    BulkTable,
    BulkUploadDialog,
    EditBulkDialog,
  },
  data () {
    return {
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
    async get () {
      this.tableData = await getCards();
      console.log(this.tableData);
    },
    async add (payload) {
      console.log('add', payload);
      await addCard(payload),
      await this.get();
      this.overlayFlags.edit = null;
    },
    async remove(id) {
      await delAll(id);
      await this.get();
    },
    async update (payload) {
      console.log('edit', payload);
      // console.log(this.overlayFlags.edit);
      // await updateCard(payload, payload.code),
      await this.get();
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
      @remove="remove($event)"
      @load="loadFromClipboard()"
    />

    <edit-bulk-dialog
      v-model="overlayFlags.edit"
      @add="add($event)"
      @edit="update($event);"
      @refresh="get()"
    />

    <bulk-upload-dialog
      v-model="overlayFlags.upload"
      @upload="upload($event)"
    />
  </flex-col>
</template>