<script>
import { useAuthStore } from '@/stores/auth';

export default {
  props: {
    modelValue: { type: null, default: false },
  },
  emits: [
    'login',
  ],
  data () {
    return {
      show: false,
      loading: false,
      message: null,
      name: null,
    };
  },
  computed: {
    whiteListed () { return useAuthStore().whiteListed;},
    accountSetup () { return useAuthStore().accountSetup;},
  },
  watch: {
    modelValue: {
      deep: true,
      immediate: true,
      handler(v) {
        if (!v?.name) {
          this.loading = false;
        }
      },
    },
  },
  methods: {
    async createUser () {
      const uid = this.modelValue.uid;
      const payload = { name: this.name };
      await useAuthStore().createUser(uid, payload);
    },
    async login () {
      this.loading = true;
      await useAuthStore().login();
      this.loading = false;
    },
    async logout () {
      await useAuthStore().logout();
    },

    setGuest () {
      useAuthStore().setGuest();
    },
  },
};
</script>

<template>
  <base-dialog
    :model-value="!modelValue?.name"
    :closable="false"
    :actions="accountSetup"
    title="Login"
    width="400"
    @submit="createUser()"
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

      <template v-else-if="accountSetup">
        <paired-text-field
          v-model="name"
          label="Name"
        />
      </template>

      <template v-else>
        <v-alert
          v-if="!whiteListed"
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
          @click="setGuest()"
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