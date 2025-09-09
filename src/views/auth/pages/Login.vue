<template>
    <v-sheet class="pa-12" rounded>
        <v-card class="mx-auto px-6 py-8" max-width="344">
            <div class="mb-10">
                <v-img height="60" src="@/assets/logo transparent.png"/>
                <h2 class="text-h5 font-weight-medium text-center mt-4"> <span class="color-secondary">BAKCOFFICE</span> <span class="color-primary">BARAKA</span></h2>
            </div>
            <v-form
                v-model="form"
                @submit.prevent="onSubmit"
            >
                <v-text-field
                    v-model="usernameOrEmail"
                    :readonly="loading"
                    :rules="[required]"
                    class="mb-2"
                    clearable
                    label="Username/Email"
                    variant="outlined"
                ></v-text-field>

                <v-text-field
                    v-model="password"
                    :readonly="loading"
                    :rules="[required]"
                    clearable
                    :type="showPassword ? 'text' : 'password'"
                    :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                    @click:append-inner="showPassword = !showPassword"
                    label="Password"
                    variant="outlined"
                ></v-text-field>
                <v-btn
                    variant="plain"
                    @click="$router.push('/forgetpassword')"
                >
                Lupa Password ?
                </v-btn>

                <v-btn
                :disabled="!form"
                :loading="loading"
                block
                color="success"
                size="large"
                type="submit"
                class="mt-6"
                >
                Login
                </v-btn>
            </v-form>

            <br />
            <br />

            <p class="text-center" style="font-size:12px; color:dimgrey">© Copyright {{ new Date().getFullYear() }}</p>
            <p class="text-center" style="font-size:12px; color:dimgrey">Baraka Education</p>
        </v-card>
    </v-sheet>
</template>
<script>
import authService from "@/services/auth/authService.js";
import { required } from '@/utils/app/validator.js';

export default {
  data: () => ({
    form: false,
    usernameOrEmail: null,
    password: null,
    showPassword: false,
    loading: false,
    validations:{
      required: required
    }
  }),
  methods: {
    async onSubmit () {
      if (!this.form) return

      this.loading = true
      
      try {
        const loginData = await authService.login({
          usernameOrEmail : this.usernameOrEmail,
          password : this.password
        })

        this.$router.push('/backoffice/dashboard')
        this.$root.showSnackbar(loginData.message)
      } catch (error) {
        this.$root.showSnackbar(error.response ? error.response.data.message : error.message)
      } finally{
        this.loading = false
      }
      
    },

    // validations part ==> deconstruct the methods from validator.js here
    required,
  },
}
</script>
