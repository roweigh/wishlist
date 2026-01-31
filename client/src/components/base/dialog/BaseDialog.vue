<script>
export default {
  props: {
    title: { type: String, default: null },
    modelValue: { type: null, required: true },
  },
  emits: [
    'update:model-value',
    'submit',
  ],
};
</script>

<template>
  <v-dialog
    :model-value="!!modelValue"
    max-width="50vw"
    @update:model-value="$emit('update:model-value', $event)"
  >
    <v-card>
      <v-card-item class="bg-blue-grey">
        <v-card-title class="d-flex">
          <span>{{ title }}</span>
          <v-btn
            icon="mdi-close"
            class="ml-auto"
            variant="text"
            density="compact"
            @click="$emit('update:model-value', false)"
          />
        </v-card-title>
      </v-card-item>

      <v-card-text class="pt-6">
        <slot />
      </v-card-text>

      <v-btn
        text="Save"
        color="success"
        rounded="0"
        size="large"
        @click="$emit('submit')"
      />
    </v-card>
  </v-dialog>
</template>