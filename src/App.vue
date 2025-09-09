<template>
  <router-view/>
  <Snackbar ref="snackbar" />

</template>

<script>
  import Snackbar from './components/Snackbar.vue';
  import { useRoute, useRouter } from 'vue-router';
  import formatter from './utils/app/formatter.js';
  import authService from "@/services/auth/authService.js";

  export default {
  components: {
    Snackbar,
  },
  head() {
    return {
      script: [
        {
          src: 'https://cdnjs.cloudflare.com/ajax/libs/iframe-resizer/4.3.9/iframeResizer.contentWindow.min.js',
          async: true,
          defer: true
        }
      ]
    }
  },
  data(){
    return {
      isMobile: false,
    }
  },
  mounted(){
    this.isMobile = window.innerWidth <= 600;

    window.addEventListener('resize', this.updateIsMobile);
  },
  created(){
    this.$router = useRouter();
    this.$route = useRoute();
  },
  methods: {
    showSnackbar(text) {
      this.$refs.snackbar.snackbar = true;
      this.$refs.snackbar.text = text;
    },
    formatDate(date, type = null){
      return formatter.formatDate(date, type);
    },
    formatTime(time){
      return formatter.formatTime(time);
    },
    formatDay(date){
      return formatter.formatDay(date);
    },
    formatRupiah(amount) {
      const strAmount = amount.toString();

      const chars = strAmount.split('');

      const formattedChars = [];

      for (let i = chars.length - 1, j = 0; i >= 0; i--, j++) {
          formattedChars.unshift(chars[i]);
          if (j % 3 === 2 && i !== 0) {
              formattedChars.unshift('.');
          }
      }

      return 'Rp ' + formattedChars.join('');
    },
    async isAuthorizedToAccess(menu){
      return await authService.isAuthorizedToAccess(menu)
    },
    hasAccess(menu){
      const menuAccess = JSON.parse(localStorage.getItem('menuAccess'))
      
      const hasAccessTo = menuAccess.some(access => access.name == menu)

      return hasAccessTo
    },
    updateIsMobile() {
      this.isMobile = window.innerWidth <= 600;
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.updateIsMobile);
  }
};
</script>
