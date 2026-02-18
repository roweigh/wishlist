<script>
import { mapState } from 'pinia';
import { useAlertStore } from '@/stores/alert';

export default {
  computed: {
    ...mapState(useAlertStore, ['shown', 'message', 'alertType']),
    alertIcon () {
      console.log(this.alertType);
      switch(this.alertType) {
        case 'success':
          return 'mdi-check-circle';
        case 'error':
          return 'mdi-close-circle';
        default:
          return 'mdi-information';
      }
    },
  },
};
</script>

<template>
  <v-snackbar
    v-model="shown"
    :color="alertType"
    class="mt-10 mx-auto"
    location="top"
  >
    <flex-row>
      <v-icon
        :icon="alertIcon"
        size="x-large"
      />
      <span class="my-auto mx-3 text-body-1">{{ message }}</span>
    </flex-row>
  </v-snackbar>
</template>