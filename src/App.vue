<script>
import { auth, googleProvider } from './main';
import { signInWithPopup } from 'firebase/auth';

import AlertPopup from '@/components/base/AlertPopup.vue';
import NavigationHeader from '@/components/base/NavigationHeader.vue';

export default {
  components: {
    AlertPopup,
    NavigationHeader,
  },
  methods: {
    async loginWithGoogle () {
      try {
        const result = await signInWithPopup(auth, googleProvider);

        // This gives you the Google Access Token if you need to call Google APIs
        // const credential = GoogleAuthProvider.credentialFromResult(result);
        // const token = credential.accessToken;

        const user = result.user;
        console.log('Successfully logged in:', user);

        // If you're moving to SQL later, this user.uid is
        // what you'll store in your SQL tables.
      } catch (error) {
        console.error('Error during Google Login:', error.message);
      }
    },
  },
};
</script>

<template>
  <v-app>
    <alert-popup />
    <v-layout>
      <navigation-header />
      <v-main
        class="bg-grey-darken-3"
        style="max-height: 100vh; overflow: auto"
      >
        <!-- <v-btn @click="loginWithGoogle">
          Sign In wiwth google
        </v-btn> -->
        <router-view />
      </v-main>
    </v-layout>
  </v-app>
</template>

<style>
html  {
  overflow: hidden
}
</style>