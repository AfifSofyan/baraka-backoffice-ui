<template>
    <v-row v-if="!isEmailVerified" class="mb-8 bg-gray">
        <v-col cols="12">
            <p class="text-center" style="font-size:14px">Alamat email anda belum terverifikasi. Silahkan melakukan verifikasi email terlebih dahulu</p>
            <div class="d-flex justify-center mt-2">
                <BrkButton
                    buttonText="Verifikasi Email"
                    color="primary"
                    @click="sendEmailVerification()"
                    class="bg-white"
                />
            </div>
        </v-col>
    </v-row>
    <v-form v-model="validForm" @submit.prevent>
        <v-row>
            <v-col cols="12" md="4">
                <v-text-field
                    label="Username"
                    v-model="form.Username"
                    variant="outlined"
                    :rules="[required, unique(usernameList, 'Username Telah Digunakan')]"
                />
                <v-text-field
                    label="Email"
                    v-model="form.Email"
                    variant="outlined"
                    :rules="[validEmail, unique(emailList, 'Email Telah Digunakan')]"
                />
                <v-text-field
                    label="Tipe Akun"
                    v-model="form.RoleName"
                    variant="outlined"
                    readonly
                />
            </v-col>
        </v-row>

        <v-row>
            <v-col class="ml-2">
                <v-switch 
                    label="Ubah Password ?"
                    v-model="form.PasswordChanged"
                    density="compact"                
                />
            </v-col>
        </v-row>

        <v-row v-if="form.PasswordChanged">
            <v-col cols="12" md="4">
                <v-text-field 
                    label="Password Lama"
                    v-model="form.Password"
                    variant="outlined"
                    :type="passwordType"
                    autocomplete="old-password"
                    :append-inner-icon="passwordIcon"
                    @click:append-inner="handlePasswordVisibility"
                    :rules="[required, correctValue(oldPasswordCorrect, 'Password Yang dimasukkan Salah')]"
                    validate-on="blur"
                    @update:model-value="checkPassword"
                />
                <v-text-field 
                    label="Password Baru"
                    v-model="form.NewPassword"
                    variant="outlined"
                    :type="newPasswordType"
                    autocomplete="new-password"
                    :append-inner-icon="newPasswordIcon"
                    @click:append-inner="handleNewPasswordVisibility"
                    :rules="[required]"
                />
                <v-text-field 
                    label="Konfirmasi Password"
                    v-model="confirmPassword"
                    variant="outlined"
                    :append-inner-icon="confirmPasswordIcon"
                    @click:append-inner="handleConfirmPasswordVisibility"
                    :type="confirmPasswordType"
                    :rules="[required, match(form.NewPassword, 'Password dan Konfirmasi Password Tidak Cocok')]"
                />
            </v-col>
        </v-row>

        <v-alert 
            v-if="form.PasswordChanged"
            density="compact"
            color="gray"
            variant="tonal"
            title="CRENDENTIALS"
            type="warning"
            text="Untuk alasan keamanan, data password tidak akan disimpan di database atau media penyimpanan apapun. Silahkan simpan pasangan data Username dan Password di lokal komputer anda"
            class="mb-4 font-14"
        />

        <div class="d-flex justify-end">
            <BrkButton
                buttonText="Kembali"
                color="danger"
                @click="() => $router.push(`/backoffice/dashboard`)"
                class="mr-2"
            />
            <BrkButton
                buttonText="Simpan Perubahan"
                color="secondary"
                type="submit"
                @click="handleSubmit()"
            />
        </div>

        <ConfirmationDialog
            :isOpen="showConfirmationDialog"
            :confirmationText="confirmationText"
            @handleCancel="showConfirmationDialog = false"
            @handleOK="submit"
        />

    </v-form>

</template>

<script>
import BrkButton from '@/components/pages/BrkButton.vue';
import ConfirmationDialog from "@/components/ConfirmationDialog.vue";
import authService from "@/services/auth/authService.js";
import { required, validEmail, match, unique, maxSize, correctValue } from '@/utils/app/validator';

export default{
    components:{
        BrkButton,
        ConfirmationDialog
    },
    data(){
        return {
            form:{
                // users model
                ID: JSON.parse(localStorage.getItem('id')),
                Username: JSON.parse(localStorage.getItem('username')),
                Email: JSON.parse(localStorage.getItem('email')),
                RoleID: JSON.parse(localStorage.getItem('roleID')),
                Password: null,
                // users model

                //additional
                RoleName: JSON.parse(localStorage.getItem('roleName')),
                NewPassword:null,
                PasswordChanged:false,
                //
            },

            isEmailVerified: true,
            validForm:false,
            oldPasswordCorrect: true,
            confirmPassword: null,
            passwordType: 'password',
            newPasswordType: 'password',
            confirmPasswordType: 'password',
            passwordIcon: 'mdi-eye',
            confirmPasswordIcon: 'mdi-eye',
            newPasswordIcon: 'mdi-eye',
            showConfirmationDialog: false,
            confirmationText:'',
            usernameList: [],
            emailList: [],

            //validators
            required: required,
            validEmail: validEmail,
            match: match,
            unique: unique,
            maxSize: maxSize,
            correctValue: correctValue
            //validators
        }
    },
    created(){
        this.loadData()
    },
    methods: {
        async loadData(){
            this.$emit('isLoading', true)
            await Promise.all([
                this.loadEmails(),
                this.loadUsernames(),
                this.checkEmailVerification()
            ])

            this.$emit('isLoading', false)
        },
        async loadUsernames(){
            this.$emit('isLoading', true)
            try {                
                const data = await authService.getUsernames();

                const username = JSON.parse(localStorage.getItem('username'))

                this.usernameList = data.data.filter(item => item != username);
            
            } catch (error) {
                this.$root.showSnackbar(error.response ? error.response.data.message : error.message)
            } finally {
                this.$emit('isLoading', false)
            }
        },
        async loadEmails(){
            this.$emit('isLoading', true)
            try {                
                const data = await authService.getEmails();

                const email = JSON.parse(localStorage.getItem('email'))

                this.emailList = data.data.filter(item => item != email);
            } catch (error) {
                this.$root.showSnackbar(error.response ? error.response.data.message : error.message)
            } finally {
                this.$emit('isLoading', false)
            }
        },
        async checkEmailVerification(){
            this.$emit('isLoading', true)
            try {                
                const data = await authService.checkEmailVerification();
                console.log(data)
                if(!data.EmailVerifiedAt){
                    this.isEmailVerified = false;
                }
            } catch (error) {
                this.$root.showSnackbar(error.response ? error.response.data.message : error.message)
            } finally {
                this.$emit('isLoading', false)
            }
        },
        async checkPassword(){
            this.$emit('isLoading', true)
            try{
                const password = this.form.Password
                const username = JSON.parse(localStorage.getItem('username'))

                const response = await authService.checkPassword({
                    username: username,
                    password: password
                })

                if(response && response.message == 'Correct Password' ){
                    this.oldPasswordCorrect = true
                }

            }catch(error){
                this.oldPasswordCorrect = false
            }finally{
                this.$emit('isLoading', false)
            }
        
        },
        handlePasswordVisibility(){
            if(this.passwordType === 'password'){
                this.passwordType = 'text'
                this.passwordIcon = 'mdi-eye-off'
            }else{
                this.passwordType = 'password'
                this.passwordIcon = 'mdi-eye'
            }
        },
        handleNewPasswordVisibility(){
            if(this.newPasswordType === 'password'){
                this.newPasswordType = 'text'
                this.newPasswordIcon = 'mdi-eye-off'
            }else{
                this.newPasswordType = 'password'
                this.newPasswordIcon = 'mdi-eye'
            }
        },
        handleConfirmPasswordVisibility(){
            if(this.confirmPasswordType === 'password'){
                this.confirmPasswordType = 'text'
                this.confirmPasswordIcon = 'mdi-eye-off'
            }else{
                this.confirmPasswordType = 'password'
                this.confirmPasswordIcon = 'mdi-eye'
            }
        },

        handleSubmit(){
            if(!this.validForm){
                return
            }

            this.showConfirmationDialog = true;
            this.confirmationText = 'Anda Akan Memperbaharui Data Akun. Lanjutkan?'
        },

        async sendEmailVerification(){
            this.$emit('isLoading', true)

            try{
                const response = await authService.sendEmailVerification()

                this.$root.showSnackbar(response.data.message);
            }catch (error) {
                console.log(error)
                this.$root.showSnackbar(error.response ? error.response.data.message : error.message);
            } finally{
                this.$emit('isLoading', false)
            }
        },

        async submit(){
            this.$emit('isLoading', true)
            try {
            
                const data = await authService.updateUser(this.form, this.form.ID);

                console.log(data)

                this.$root.showSnackbar("Berhasil Memperbaharui Data");
            
            } catch (error) {
                console.log(error)
                this.$root.showSnackbar(error.response ? error.response.data.message : error.message);
            } finally{
                this.$emit('isLoading', false)
                this.showConfirmationDialog = false;
            }
        }
    }
}
</script>