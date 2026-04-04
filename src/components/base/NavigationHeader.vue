<script>
import routes from '@/router/routes';

export default {
  props: {
    profile: { type: null, required: true },
  },
  data () {
    return {
      drawer: true,
      rail: true,
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
    <v-list
      density="compact"
      nav
    >
      <v-list-item
        v-for="route in menuItems"
        :key="route.name"
        :class="{ 'pl-5': wider }"
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
          :title="uid"
        >
          <template #prepend>
            <v-avatar
              :class="{ 'mx-1': wider }"
              :size="(wider && rail) ? 40 : undefined"
            />
          </template>
          <template #append>
            <v-btn
              :inert="rail"
              icon="mdi-chevron-left"
              variant="text"
              @click.stop="rail = !rail"
            />
          </template>
        </v-list-item>
        <v-list-item @click="$emit('logout')">
          {{ uid }}
        </v-list-item>
      </v-list>
    </template>
  </v-navigation-drawer>
</template>