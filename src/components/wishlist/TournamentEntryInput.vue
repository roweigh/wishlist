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
    offset="8px"
    :close-on-content-click="false"
  >
    <template #activator="{ props }">
      <v-btn
        v-bind="props"
      >
        Other purchases
      </v-btn>
    </template>

    <v-date-picker
      :model-value="modelValue"
      width="450"
      show-adjacent-months
      multiple
      hide-title
      @update:model-value="$emit('update:model-value', $event)"
    >
      <template #header>
        <v-date-picker-header>Select Hobby Attendance</v-date-picker-header>
      </template>

      <template #actions>
        <v-col>
          <v-row>
            <v-date-picker-header style="padding: 12px">
              Others
            </v-date-picker-header>
          </v-row>
          <v-row>
            <paired-number-input
              label="Boosters"
            />
          </v-row>
          <v-row>
            <paired-number-input
              label="Accessories"
            />
          </v-row>

          <v-row>
            <v-btn
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
          </v-row>
        </v-col>
      </template>
    </v-date-picker>
  </v-menu>
</template>