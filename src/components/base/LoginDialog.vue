<script>
export default {
  props: {
    modelValue: { type: [Object, Boolean], default: false },
  },
  emits: [
    'update:model-value',
  ],
  methods: {
  },
};
</script>

<template>
  <base-dialog
    :model-value="modelValue"
    :actions="false"
    title="Login"
    @update:model-value="$emit('update:model-value', $event)"
  >
    <v-btn @click="$emit('login')">
      Login With Google
    </v-btn>
  </base-dialog>
</template>