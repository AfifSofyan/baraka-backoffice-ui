<template>
    <v-sheet class="pa-12" rounded>
        <v-card class="mx-auto px-2 pb-8 pt-2" max-width="344">
            <v-btn density="compact" flat size="30" class="mx-1" @click="$router.push('/login')">
                <v-icon class="color-gray">mdi-arrow-left</v-icon>
            </v-btn>
            <div class="mb-6 px-4">
                <v-img height="60" src="@/assets/logo transparent.png"/>
            </div>
            <p class="mb-6 px-4 text-h6 text-center text-gray">Lupa Password?</p>
            <v-form
                v-model="form"
                @submit.prevent="onSubmit"
                class="px-4"
            >
                <p class="mb-6 text-body-2 text-center text-slate">Masukkan alamat email untuk melanjutkan</p>
                <v-text-field
                    v-model="email"
                    :readonly="loading"
                    :rules="[required, validEmail]"
                    class="mb-2"
                    clearable
                    label="Email"
                    variant="outlined"
                ></v-text-field>

                <v-btn
                :disabled="!form"
                :loading="loading"
                block
                color="success"
                size="large"
                type="submit"
                class="mt-6"
                >
                Lanjutkan
                </v-btn>
            </v-form>
        </v-card>

        <p v-if="message" class="text-body text-grey text-center mt-6">
            {{ message }}
        </p>
    </v-sheet>
</template>
<script>
import authService from "@/services/auth/authService.js";
import { required, validEmail } from '@/utils/app/validator.js';


export default {
  data: () => ({
    form: false,
    email: null,
    message: null,
    loading: false,
  }),
  methods: {
    async onSubmit () {
      if (!this.form) return

      this.loading = true
      
      try {
        const data = await authService.forgetPassword({
          email: this.email
        })

        // this.$router.push('/backoffice/dashboard')
        this.message = data.message
        // this.$root.showSnackbar(data.message)
      } catch (error) {
        this.message = error.response ? error.response.data.message : error.message
        // this.$root.showSnackbar(error.response ? error.response.data.message : error.message)
      } finally{
        this.loading = false
      }
      
    },

    // validations part ==> deconstruct the methods from validator.js here
    required,
    validEmail
  },
}
</script>
