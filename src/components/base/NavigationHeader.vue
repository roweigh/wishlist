<script>
import routes from '@/router/routes';

export default {
  props: {
    profile: { type: null, required: true },
  },
  emits: [
    'logout',
  ],
  data () {
    return {
      drawer: true,
      rail: false,
      wider: false,
    };
  },
  computed: {
    photoURL () {
      return this.profile?.photoURL;
    },
    uid () {
      return this.profile?.uid;
    },
    menuItems() {
      return routes.filter(r => r.component);
    },
  },
};

</script>

<template>
  <v-navigation-drawer
    v-model="drawer"
    :rail="rail"
    color="teal"
    permanent
    @click="rail = false"
  >
    <div style="height: 56px" />
    <v-list>
      <v-list-item
        v-for="route in menuItems"
        :key="route.name"
        :prepend-icon="route?.icon"
        :title="route?.meta?.title"
        :value="route?.value"
        :to="route?.path"
      />
    </v-list>

    <template #append>
      <v-divider />
      <v-list>
        <v-list-item
          prepend-avatar="https://randomuser.me/api/portraits/men/85.jpg"
          :title="profile?.name"
        >
          <template #append>
            <v-btn
              :inert="rail"
              icon="mdi-chevron-left"
              variant="text"
              @click.stop="rail = !rail"
            />
          </template>
        </v-list-item>

        <v-list-item
          title="Logout"
          prepend-icon="mdi-logout"
          @click="$emit('logout')"
        />
      </v-list>
    </template>
  </v-navigation-drawer>
</template>