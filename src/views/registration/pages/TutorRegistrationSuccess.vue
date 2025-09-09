<template>
  <v-container class="pt-10">
    <v-img height="130" src="@/assets/logo transparent.png"/>
    <h2 class="text-center text-h4 mt-10">Form Registrasi Tutor Berhasil Disubmit.</h2>
    <p class="text-center text-subtitle-1 mt-3">Harap segera menyelesaikan proses registrasi anda dengan mengirimkan soft copy <span class="font-italic font-weight-medium">CV</span>, <span class="font-italic font-weight-medium">ijazah terakhir (keterangan kuliah untuk mahasiswa D3/D4/S1)</span>, serta dokumen lain yang dianggap perlu ke alamat email rekrutmen@barakaeducation.com</p>
    <p class="text-center text-subtitle-1 mt-2">Terima Kasih!</p>
    <div class="d-flex justify-center mt-6">
      <v-btn
        variant="plain"
      >
      <a style="text-decoration: none;" href="https://barakaeducation.com">Kembali Ke Website</a>
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
