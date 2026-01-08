<script>
import NavigationDrawer from './components/base/NavigationDrawer.vue';

export default {
  components: {
    NavigationDrawer,
  },
};
</script>

<template>
  <v-app class="d-flex">
    <v-layout>
      <v-main>
        <navigation-drawer />
        <div
          class="d-flex grow bg-grey"
          style="height: 100vh"
        >
          <router-view />
        </div>
      </v-main>
    </v-layout>
  </v-app>
</template>