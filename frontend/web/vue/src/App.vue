<script setup>
import { RouterView } from 'vue-router'
import NavigationDrawer from './components/layouts/NavigationDrawer.vue';
</script>

<template>
  <v-app>
    <NavigationDrawer />

    <v-main class="d-flex justify-center" style="min-height: 300px;">
      <v-container>
        <RouterView />
      </v-container>
    </v-main>
  </v-app>
</template>