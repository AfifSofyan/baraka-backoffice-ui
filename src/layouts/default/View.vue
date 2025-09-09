<template>
  <v-main class="bg-blue-lighten-5">
    <v-card :class="smAndDown ? 'ma-2 pa-6' : 'ma-6 pa-6'">
      <router-view @isLoading="setLoadingState"/>
    </v-card>
    <brk-loading v-if="loading"/>
  </v-main>
</template>

<script setup>
  import { useDisplay } from 'vuetify';
  import BrkLoading from '@/components/pages/BrkLoading.vue';

  const { smAndDown } = useDisplay();

  const loading = ref(false);

  const setLoadingState = (state) => {
    loading.value = state
  }
</script>
