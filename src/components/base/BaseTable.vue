<script>
export default {
  props: {
    items: { type: null, required: true },
    sortBy: { type: null, required: true },
    headers: { type: null, required: true },
    edit: { type: null, default: true },
    itemId: { type: null, default: 'id' },
    loading: { type: Boolean, default: false },
  },
  emits: [
    'update:sort-by',
    'add',
    'edit',
    'remove',
    'upload',
    'download',
  ],
  data () {
    return {
      itemsPerPage: -1,
    };
  },
};
</script>

<template>
  <v-toolbar
    density="compact"
    flat
  >
    <flex-row class="mx-3 ga-2 justify-end grow">
      <slot name="actions" />
      <icon-button
        icon="mdi-upload"
        tooltip-text="Bulk Upload"
        @click="$emit('upload')"
      />
      <icon-button
        icon="mdi-download"
        tooltip-text="Download CSV"
        @click="$emit('download')"
      />
      <icon-button
        icon="mdi-plus"
        tooltip-text="Add"
        @click="$emit('add')"
      />
    </flex-row>
  </v-toolbar>

  <v-data-table
    v-model:items-per-page="itemsPerPage"
    :loading="loading"
    :headers="headers"
    :sort-by="sortBy"
    :items="items"
    sort-asc-icon="mdi-chevron-up"
    sort-desc-icon="mdi-chevron-down"
    density="compact"
    @update:sort-by="$emit('update:sort-by', $event)"
  >
    <template
      v-for="(_, name) in $slots"
      #[name]="data"
    >
      <slot
        :name="name"
        v-bind="data"
      />
    </template>

    <template #[`item.actions`]="{ item }">
      <flex-row class="ga-2 justify-end">
        <v-icon
          v-if="edit"
          color="medium-emphasis"
          icon="mdi-pencil"
          size="small"
          @click="$emit('edit', item)"
        />

        <v-icon
          color="medium-emphasis"
          icon="mdi-delete"
          size="small"
          @click="$emit('remove', item[itemId])"
        />
      </flex-row>
    </template>
  </v-data-table>
</template>