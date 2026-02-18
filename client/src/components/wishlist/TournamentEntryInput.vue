<script>
export default {
  props: {
    modelValue: { type: Array, required: true },
  },
  data () {
    return {
      menu: false,
      selectedDates: [],
    };
  },
};
</script>

<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    transition="scale-transition"
  >
    <template #activator="{ props }">
      <v-btn
        v-bind="props"
      >
        Tournament Entry
      </v-btn>
    </template>

    <v-date-picker
      :model-value="modelValue"
      multiple
      @update:model-value="$emit('update:model-value', $event)"
    >
      <template #actions>
        <v-spacer /> <v-btn
          variant="text"
          color="error"
          @click="cancelSelection"
        >
          Cancel
        </v-btn>

        <v-btn
          variant="elevated"
          color="success"
          @click="$emit('save')"
        >
          Save
        </v-btn>
      </template>
    </v-date-picker>
  </v-menu>
</template>