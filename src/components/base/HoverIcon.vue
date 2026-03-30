<script>
export default {
  props: {
    text: { type: String, required: true },
    icon: { type: String, required: true },
    color: { type: String, default: undefined },
  },
};
</script>

<template>
  <v-tooltip
    :text="text"
    location="top"
  >
    <template #activator="{props}">
      <v-icon
        v-bind="props"
        :icon="icon"
        :color="color"
      />
    </template>

    <template
      v-if="$slots['tooltip-text']"
      #default
    >
      <slot name="tooltip-text" />
    </template>
  </v-tooltip>
</template>