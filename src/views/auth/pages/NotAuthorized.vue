<template>
  <v-container class="pt-10">
    <v-img height="280" src="@/assets/unauthorized.jpg"/>
    <p style="font-size:10px" class="text-center"><a href="https://www.freepik.com/free-vector/401-error-unauthorized-concept-illustration_7906232.htm#fromView=search&page=1&position=1&uuid=93dfe482-d711-494c-bc5c-5cb513aff329">Image by storyset</a> on Freepik</p>
    <h2 class="text-center text-h2 mt-6">Error 401</h2>
    <p class="text-center text-subtitle-1 mt-3">Anda tidak memiliki akses. Silahkan login terlebih dahulu</p>
    <div class="d-flex justify-center mt-6">
      <v-btn
        variant="plain"
        @click="$router.push('/login')"
      >
      Ke Halaman Login
      </v-btn>
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
