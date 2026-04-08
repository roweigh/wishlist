<script>
import { useAuthStore } from '@/stores/auth';

import AlertPopup from '@/components/base/AlertPopup.vue';
import NavigationHeader from '@/components/base/NavigationHeader.vue';
import LoginDialog from '@/components/base/LoginDialog.vue';

export default {
  components: {
    AlertPopup,
    LoginDialog,
    NavigationHeader,
  },
  data () {
    return {
      loginDialog: false,
    };
  },
  computed: {
    profile () {
      return useAuthStore()?.profile;
    },
    initializing () {
      return useAuthStore()?.initializing;
    },
  },
  async mounted () {
    await useAuthStore().initializeAuth();
  },
  methods: {
    async logout () {
      await useAuthStore().logout();
      this.loginDialog = true;
    },
  },
};
</script>

<template>
  <v-app>
    <alert-popup />

    <login-dialog v-model="profile" />

    <v-layout>
      <navigation-header
        :profile="profile"
        @logout="logout()"
      />

      <v-main
        class="bg-grey-darken-3"
        style="max-height: 100vh; overflow: auto; display: flex"
      >
        <flex-col
          v-if="initializing"
          class="grow"
        >
          <v-progress-circular
            color="teal-accent-3"
            class="ma-auto"
            size="300"
            width="6"
            indeterminate
          >
            Loading...
          </v-progress-circular>
        </flex-col>

        <router-view
          v-else
          :profile="profile"
        />
      </v-main>
    </v-layout>
  </v-app>
</template>

<style>
html {
  overflow: hidden
}
</style>