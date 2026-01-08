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
  <v-navigation-drawer
    :rail="rail"
    drawer
    floating
    permanent
    class="bg-blue-grey"
  >
    <v-list nav>
      <v-list-item
        v-for="route in menuItems"
        :key="route.name"
        :title="route?.meta?.title"
        :to="route?.path"
      />
    </v-list>
  </v-navigation-drawer>
</template>