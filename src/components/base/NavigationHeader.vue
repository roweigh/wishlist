<script>
import routes from '@/router/routes';

export default {
  computed: {
    menuItems() {
      return routes.filter(r => r.component);
    },
  },
};

</script>

<template>
  <v-app-bar
    class="bg-blue-grey d-flex px-5"
    absolute
  >
    <v-btn
      v-for="route in menuItems"
      :key="route.name"
      :to="route?.path"
    >
      {{ route?.meta?.title }}
    </v-btn>
  </v-app-bar>
</template>