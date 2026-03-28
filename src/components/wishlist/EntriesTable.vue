<script>
export default {
  props: {
    loading: { type: Boolean, default: false },
    items: { type: null, required: true },
  },
  emits: [
    'load',
    'upload',
    'add',
    'edit',
    'remove',
    'download',
  ],
  data () {
    return {
      sortBy: [{ key: 'code', order: 'desc' }],
      itemsPerPage: -1,
      headers: [
        {
          key: 'date',
          title: 'Date',
        },
        {
          key: 'amtSpent',
          title: 'Price',
          align: 'end',
          width: '8%',
        },
        // {s
        //   key: 'notes',
        //   title: 'Notes',
        // },
        {
          key: 'actions',
          align: 'end',
          sortable: false,
          width: '5%',
        },
      ],
    };
  },
  methods: {
    formatDollar(v) {
      return `$${(v).toFixed(2)}`;
    },
  },
};
</script>

<template>
  <v-tabs-window-item value="tournament">
    <v-toolbar
      density="compact"
      flat
    >
      <flex-row class="mx-3 justify-end grow">
        <v-btn
          icon="mdi-upload"
          density="compact"
          class="mx-2"
          @click="$emit('upload')"
        />
        <v-btn
          icon="mdi-download"
          density="compact"
          class="mx-2"
          @click="$emit('download')"
        />
        <v-btn
          icon="mdi-plus"
          density="compact"
          @click="$emit('add')"
        />
      </flex-row>
    </v-toolbar>

    <v-data-table
      v-model:sort-by="sortBy"
      v-model:items-per-page="itemsPerPage"
      :headers="headers"
      :items="items"
      :loading="loading"
      sort-asc-icon="mdi-chevron-up"
      sort-desc-icon="mdi-chevron-down"
      density="compact"
    >
      <template #item.amtSpent="{ item }">
        {{ formatDollar(item.amtSpent) }}
      </template>

      <template #item.actions="{ item }">
        <div class="d-flex ga-2 justify-end">
          <v-icon
            color="medium-emphasis"
            icon="mdi-pencil"
            size="small"
            @click="$emit('edit', item)"
          />

          <v-icon
            color="medium-emphasis"
            icon="mdi-delete"
            size="small"
            @click="$emit('remove', item.code)"
          />
        </div>
      </template>
    </v-data-table>
  </v-tabs-window-item>
</template>