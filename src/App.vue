<script>
import AlertPopup from '@/components/base/AlertPopup.vue';
import NavigationHeader from '@/components/base/NavigationHeader.vue';

export default {
  components: {
    AlertPopup,
    NavigationHeader,
  },
};
</script>

<template>
  <v-app>
    <alert-popup />
    <v-layout>
      <navigation-header />
      <v-main class="d-flex grow bg-grey-darken-3">
        <router-view />
      </v-main>
    </v-layout>
  </v-app>
</template>