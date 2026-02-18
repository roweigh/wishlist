<script>
import AlertPopup from '@/components/base/AlertPopup.vue';
import NavigationDrawer from '@/components/base/NavigationDrawer.vue';

export default {
  components: {
    AlertPopup,
    NavigationDrawer,
  },
};
</script>

<template>
  <v-app class="d-flex">
    <alert-popup />
    <v-layout>
      <v-main>
        <navigation-drawer />
        <div
          class="d-flex grow bg-grey"
          style="height: 100vh; overflow: auto"
        >
          <router-view />
        </div>
      </v-main>
    </v-layout>
  </v-app>
</template>

<style>
html {
  overflow: hidden
}
</style>