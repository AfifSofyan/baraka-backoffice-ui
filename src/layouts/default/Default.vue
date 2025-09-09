<template>
  <v-app>
    <v-layout class="rounded rounded-md">
      <default-bar @toggleDrawer="drawer = !drawer" :useToggle="smAndDown"/>
      
      <v-navigation-drawer v-if="smAndDown" v-model="drawer" width="200" style="position:fixed">
        <default-nav-bar/>
      </v-navigation-drawer>
      <v-navigation-drawer v-else width="220" style="position:fixed" :permanent="true">
        <default-nav-bar/>
      </v-navigation-drawer>

      <default-view />
    </v-layout>
  </v-app>
</template>

<script setup>
  import DefaultBar from './AppBar.vue'
  import DefaultNavBar from './NavBar.vue'
  import DefaultView from './View.vue'
  import { useDisplay } from 'vuetify'

  const { smAndDown } = useDisplay()

  const drawer = ref(false);

</script>
