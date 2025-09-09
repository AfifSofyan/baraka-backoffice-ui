<template>
  <v-container class="pt-10">
    <v-img height="130" src="@/assets/logo transparent.png"/>
    <!-- <p style="font-size:10px" class="text-center"><a href="https://www.freepik.com/free-vector/401-error-unauthorized-concept-illustration_7906232.htm#fromView=search&page=1&position=1&uuid=93dfe482-d711-494c-bc5c-5cb513aff329">Image by storyset</a> on Freepik</p> -->
    <h2 class="text-center text-h4 mt-10">Registrasi Siswa Berhasil</h2>
    <p class="text-center text-subtitle-1 mt-3">Harap menunggu sementara admin kami memproses registrasi anda. Terima Kasih!</p>
    <div class="d-flex justify-center mt-6">
      <v-btn
        variant="plain"
      >
      <a style="text-decoration: none;" href="https://barakaeducation.com">Kembali</a>
      </v-btn>
    </div>
  </v-container>
</template>
<script>

export default {
  data: () => ({
  }),
  methods: {
    backToWebsite(){
      window.location.href == 'https://barakaeducation.com'
    }
  }
}
</script>
