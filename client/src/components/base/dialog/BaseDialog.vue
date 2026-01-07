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
    <v-card :title="title">
      <template #text>
        <slot />
      </template>

      <v-card-actions class="bg-surface-light">
        <v-btn
          text="Cancel"
          variant="plain"
          @click="$emit('update:model-value', false)"
        />
        <v-spacer />
        <v-btn
          text="Save"
          @click="$emit('submit')"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>