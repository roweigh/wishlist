<script>
import { useAuthStore } from '@/stores/auth';

export default {
  props: {
    modelValue: { type: Boolean, default: false },
  },
  emits: [
    'login',
  ],
  data () {
    return {
      loading: false,
      message: null,
    };
  },
  methods: {
    async login () {
      this.loading = true;
      const user = await useAuthStore().login();
      if (user) {
        this.$emit('update:model-value');
      }
      else {
        this.loading = false;
        this.message = true;
      }
    },
  },
};
</script>

<template>
  <base-dialog
    :model-value="modelValue"
    :closable="false"
    :actions="false"
    title="Login"
    width="400"
  >
    <flex-col
      class="py-5 ga-3 justify-center"
      style="min-height: 300px"
    >
      <flex-row
        v-if="loading"
        class="justify-center align-center grow"
      >
        <v-progress-circular
          color="teal-accent-3"
          size="200"
          indeterminate
        />
      </flex-row>

      <template v-else>
        <v-alert
          v-if="message"
          color="info"
          variant="tonal"
          class="text-pre-line"
          style="max-width: 376px;"
        >
          The app is invite-only for now.
          <br>
          Send me a message and I’ll get you set up.
        </v-alert>

        <v-btn
          v-else
          variant="tonal"
          color="red"
          prepend-icon="mdi-google"
          @click="login()"
        >
          Sign In With Google
        </v-btn>
        <v-btn
          variant="tonal"
          @click="$emit('update:model-value', false)"
        >
          Continue as Guest
        </v-btn>
      </template>
    </flex-col>
  </base-dialog>
</template>

<style scoped lang="scss">
:deep(.v-list-item__prepend) {
  width: 0px
}

:deep(.v-list-item__content) {
  justify-self: center;
}
</style>