<template>
  <v-navigation-drawer>
    <v-list>
      <v-list-item title="HR Information Systems"></v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list density="compact" nav>
      <v-list-item prepend-icon="mdi-home" title="Dashboard" value="dashboard" to="/"></v-list-item>
      <v-list-item prepend-icon="mdi-domain" title="Department" value="department" to="/department"></v-list-item>
      <v-list-item prepend-icon="mdi-chair-rolling" title="Position" value="position" to="/position"></v-list-item>
    </v-list>
    
  </v-navigation-drawer>
</template>

<script setup>

</script>