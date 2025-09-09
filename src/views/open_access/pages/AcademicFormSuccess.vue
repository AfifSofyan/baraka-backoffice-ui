<template>
  <v-container class="pt-10">
    <v-img height="130" src="@/assets/logo transparent.png"/>
    <!-- <p style="font-size:10px" class="text-center"><a href="https://www.freepik.com/free-vector/401-error-unauthorized-concept-illustration_7906232.htm#fromView=search&page=1&position=1&uuid=93dfe482-d711-494c-bc5c-5cb513aff329">Image by storyset</a> on Freepik</p> -->
    <h2 class="text-center text-h4 mt-10">Input Data Akademik Berhasil</h2>
    <p class="text-center text-subtitle-1 mt-3">Harap segera login ke aplikasi Backoffice Baraka untuk memeriksa data-data akademik anda!</p>
    <div class="d-flex justify-center mt-6">
      <v-btn
        variant="plain"
      >
      <a style="text-decoration: none;" href="https://app.barakaeducation.com/login">Login</a>
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
