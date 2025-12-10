<script>
import BulkTable from '@/components/wishlist/BulkTable.vue';
import BulkUploadDialog from '../components/wishlist/BulkUploadDialog.vue';

export default {
  components: {
    BulkTable,
    BulkUploadDialog,
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
        this.tableData =  this.parseDecklist(text);
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
      @edit="overlayFlags.edit = true"
      @upload="overlayFlags.upload = true"
      @load="loadFromClipboard()"
    />

    <bulk-upload-dialog
      v-model="overlayFlags.upload"
      @upload="tableData = $event"
    />

    <v-dialog
      v-model="overlayFlags.edit"
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