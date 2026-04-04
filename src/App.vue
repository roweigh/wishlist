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
  computed: {
    profile () {
      return useAuthStore()?.profile;
    },
    showLogin () {
      return !this.profile?.uid;
    },
  },
  async mounted () {
    await useAuthStore().initializeAuth();
  },
  methods: {
    async loginWithGoogle () {
      await useAuthStore().login();
    },
    async logout () {
      await useAuthStore().logout();
    },
  },
};
</script>

<template>
  <v-app>
    <alert-popup />
    <v-layout>
      <navigation-header
        :profile="profile"
        @logout="logout()"
      />
      <v-main
        class="bg-grey-darken-3"
        style="max-height: 100vh; overflow: auto"
      >
        <router-view :profile="profile" />
      </v-main>
      <login-dialog
        :model-value="showLogin"
        @login="loginWithGoogle()"
      />
    </v-layout>
  </v-app>
</template>

<style>
html {
  overflow: hidden
}
</style>