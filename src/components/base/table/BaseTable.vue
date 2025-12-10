<script>
export default {
  props: {
    headers: { type: null, required: true },
    tableData: { type: null, required: true },
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

        <flex-row class="mx-2">
          <v-btn
            icon="mdi-download"
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
    :items="tableData"
    density="compact"
  >
    <template #item.actions="{ item }">
      <div class="d-flex ga-2 justify-end">
        <v-icon
          color="medium-emphasis"
          icon="mdi-pencil"
          size="small"
          @click="$emit('edit', item.id)"
        />

        <v-icon
          color="medium-emphasis"
          icon="mdi-delete"
          size="small"
          @click="$emit('remove', item.id)"
        />
      </div>
    </template>
  </v-data-table>
</template>