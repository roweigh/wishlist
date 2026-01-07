<script>
</script>

<template>
  <v-app class="d-flex">
    <v-layout>
      <v-main>
        <v-navigation-drawer class="bg-blue-grey" />
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