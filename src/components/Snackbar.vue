<template>
    <v-snackbar v-model="snackbar" color="lightgray" :timeout="timeout">
        {{ text }}
        <template v-slot:actions>
            <v-btn
                color="secondary"
                variant="plain"
                @click="close"
            >
                Close
            </v-btn>
        </template>
    </v-snackbar>
  </template>
  
  <script>
  export default {
    data() {
      return {
        snackbar: false,
        text: '',
        timeout: 5000
      };
    },
    methods:{
      close(){
        this.snackbar = false
      }
    }
  };
  </script>
  