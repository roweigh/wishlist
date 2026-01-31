<script>
export default {
  props: {
    items: { type: null, required: true },
  },
  emits: [
    'load',
    'upload',
    'add',
    'edit',
    'remove',
  ],
  data () {
    return {
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
          align: 'end',
        },
        {
          key: 'qtyAcquired',
          title: 'Quantity Acquired',
          align: 'end',
        },
        {
          key: 'amtSpent',
          title: 'Amount Spent',
          align: 'end',
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
    formatDollar(v) {
      return `$${(v).toFixed(2)}`;
    },
  },
};
</script>

<template>
  <v-toolbar
    density="compact"
    flat
  >
    <v-toolbar-title class="font-weight-bold">
      <flex-row class="align-center justify-space-between">
        <h3>Singles</h3>

        <flex-row class="mx-3">
          <v-btn
            icon="mdi-content-copy"
            density="compact"
            @click="$emit('load')"
          />
          <v-btn
            icon="mdi-upload"
            density="compact"
            class="mx-2"
            @click="$emit('upload')"
          />
          <v-btn
            icon="mdi-plus"
            density="compact"
            @click="$emit('add')"
          />
        </flex-row>
      </flex-row>
    </v-toolbar-title>
  </v-toolbar>

  <v-data-table
    :headers="headers"
    :items="items"
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
</template>