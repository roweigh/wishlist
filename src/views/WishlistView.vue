<script>
import BaseTable from '@/components/base/table/BaseTable.vue';
import BulkUploadDialog from '../components/wishlist/BulkUploadDialog.vue';

export default {
  components: {
    BaseTable,
    BulkUploadDialog,
  },
  data () {
    return {
      dialog: false,
      uploadDialog: false,
      tableData: [
        {
          code: 'OP13-120',
          name: 'Sabo',
          qtyNeeded: 4,

        },
      ],
      headers: [
        {
          key: 'code',
          title: 'Code',
        },
        {
          key: 'name',
          title: 'Name',
        },
        {
          key: 'deck',
          title: 'Deck',
        },
        {
          key: 'category',
          title: 'Category',
        },
        {
          key: 'qtyNeeded',
          title: 'Quantity Needed',
        },
        {
          key: 'qtyAcquired',
          title: 'Quantity Acquired',
        },
        {
          key: 'cost',
          title: 'Cost',
        },
        {
          key: 'notes',
          title: 'Notes',
        },
        {
          key: 'actions',
          align: 'end',
          sortable: false,
        },
      ],
    };
  },
  methods: {
    async loadFromClipboard()  {
      try {
        const text = await navigator.clipboard.readText();
        this.tableData =  this.parseNeededList(text);
      } catch (err) {
        console.error('Failed to read clipboard:', err);
      }
    },

    parseNeededList(text) {
      return text
        .split(/\r?\n/)                // split into lines
        .map(line => line.trim())
        .filter(line => line !== '')   // ignore empty lines
        .map(line => {
          const match = line.match(/^(\d+)x(.+)$/);
          if (!match) return null;

          const qtyNeeded = Number(match[1]);
          const code = match[2].trim();

          return {
            code,
            qtyNeeded,
            qtyAcquired: '',
            cost: '',
            notes: '',
          };
        });
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

    <base-table
      :headers="headers"
      :table-data="tableData"
      @add="dialog = true"
      @edit="dialog = true"
      @upload="uploadDialog = true"
      @load="loadFromClipboard()"
    />

    <bulk-upload-dialog
      v-model="uploadDialog"
      @upload="tableData = $event"
    />


    <v-dialog
      v-model="dialog"
      max-width="500"
    >
      <v-card
        :subtitle="`${isEditing ? 'Update' : 'Create'} your favorite book`"
        :title="`${isEditing ? 'Edit' : 'Add'} a Book`"
      >
        <template #text>
          <v-row>
            <v-col cols="12">
              <v-text-field
                label="Title"
              />
            </v-col>

            <v-col
              cols="12"
              md="6"
            >
              <v-text-field
                label="Author"
              />
            </v-col>

            <v-col
              cols="12"
              md="6"
            >
              <v-select
                :items="['Fiction', 'Dystopian', 'Non-Fiction', 'Sci-Fi']"
                label="Genre"
              />
            </v-col>

            <v-col
              cols="12"
              md="6"
            >
              <v-number-input
                :max="currentYear"
                :min="1"
                label="Year"
              />
            </v-col>

            <v-col
              cols="12"
              md="6"
            >
              <v-number-input
                :min="1"
                label="Pages"
              />
            </v-col>
          </v-row>
        </template>

        <v-divider />

        <v-card-actions class="bg-surface-light">
          <v-btn
            text="Cancel"
            variant="plain"
            @click="dialog = false"
          />

          <v-spacer />

          <v-btn
            text="Save"
            @click="save"
          />
        </v-card-actions>
      </v-card>
    </v-dialog>
  </flex-col>
</template>