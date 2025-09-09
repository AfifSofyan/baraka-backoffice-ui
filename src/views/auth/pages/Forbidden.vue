<template>
  <v-container class="pt-10">
    <v-img height="280" src="@/assets/forbidden.jpg"/>
    <p style="font-size:10px" class="text-center"><a href="https://www.freepik.com/free-vector/403-error-forbidden-with-police-concept-illustration_7906226.htm#query=403&position=1&from_view=keyword&track=sph&uuid=3e59de12-7786-4504-82c7-5c2c81090123">Image by storyset</a> on Freepik</p>
    <h2 class="text-center text-h2 mt-6">Error 403</h2>
    <p class="text-center text-subtitle-1 mt-3">Anda tidak diizinkan untuk mengakses fitur ini</p>
    <div class="d-flex justify-center mt-6">
      <v-btn
        class="mr-2"
        variant="plain"
        @click="$router.push('/backoffice/dashboard')"
      >
      Kembali Ke Dashboard
      </v-btn>
      <v-btn
        class="ml-2"
        variant="plain"
        @click="$router.push('/login')"
      >
      Ke Halaman Login
      </v-btn>
    </div>
    <div class="d-flex justify-center">
    </div>
  </v-container>
</template>
<script>

export default {
  data: () => ({
  }),
  methods: {
  }
}
</script>
