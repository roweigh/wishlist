<script>
export default {
  props: {
    modelValue: { type: null, required: true },
    initializing: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
    title: { type: String, default: '' },
    width: { type: String, default: '50vw' },
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
    :width="width"
    @update:model-value="$emit('update:model-value', $event)"
  >
    <v-card>
      <!-- Title -->
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

      <!-- Content -->
      <v-card-text class="pt-6">
        <v-row>
          <flex-col class="grow">
            <v-progress-circular
              v-if="initializing"
              class="mx-auto my-12"
              size="200"
              indeterminate
            />
            <slot v-else />
          </flex-col>
        </v-row>
      </v-card-text>

      <!-- Confirm Action -->
      <v-btn
        :disabled="loading"
        text="Save"
        color="success"
        rounded="0"
        size="large"
        @click="$emit('submit')"
      />
    </v-card>
  </v-dialog>
</template>