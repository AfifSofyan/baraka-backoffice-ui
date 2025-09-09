<template>
    <v-form v-model="validForm" @submit.prevent>
        <v-row>
            <v-col cols="12" md="4">
                <v-text-field
                    v-model="form.Name"
                    variant="outlined"
                    label="Nama"
                    :rules="[required, maxLength(50)]"
                    :readonly="type == 'detail'"
                />
                <v-text-field
                    v-model="form.Nickname"
                    variant="outlined"
                    label="Nama Panggilan"
                    :rules="[required, maxLength(50)]"
                    :readonly="type == 'detail'"
                />
                <v-autocomplete 
                    v-model="form.GenderID"
                    label="Gender"
                    :items="gender_list"
                    item-title="Name"
                    item-value="ID"
                    variant="outlined"
                    :rules="[required]"    
                    :readonly="type == 'detail'"
                />
            </v-col>
        </v-row>

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
    </v-form>

    <ConfirmationDialog
        :isOpen="showConfirmationDialog"
        :confirmationText="confirmationText"
        @handleCancel="showConfirmationDialog = false"
        @handleOK="submit"
    />
</template>

<script>
import adminService from '@/services/admin/adminService.js';
import BrkButton from "@/components/pages/BrkButton.vue";
import ConfirmationDialog from "@/components/ConfirmationDialog.vue";
import { gender_list } from '@/utils/database-static-records/genders.js';
import { required, maxLength } from '@/utils/app/validator.js';

export default{
    components:{
        BrkButton,
        ConfirmationDialog
    },
    data(){
        return{
            form:{
                // admins model
                Name:null,
                Nickname:null,
                GenderID:null,
                // admins model
            },

            id: JSON.parse(localStorage.getItem('id')),
            validForm: false,
            showConfirmationDialog: false,
            confirmationText: '',

            // static database records related to tutors
            gender_list: gender_list,
            // static database records related to tutors
        }
    },
    created(){
        this.loadData()
    },
    methods:{
        async loadData(){
            this.$emit('isLoading', true)
            await Promise.all([
                this.loadAdminDetail(),
            ])

            this.$emit('isLoading', false)
        },
        async loadAdminDetail(){
            try{
                const data = await adminService.getAdminDetailByUserID(this.id);

                this.form = {
                    ...this.form,
                    ...data.data
                };
            } catch (error) {
                this.$root.showSnackbar(error.response ? error.response.data.message : error.message)
            }
        },
        handleSubmit(){
            if(!this.validForm){
                return
            }

            this.showConfirmationDialog = true;
            this.confirmationText = 'Anda Akan Memperbaharui Detail Profil. Lanjutkan?'
        },
        handleCancel(){
            this.showConfirmationDialog = false
        },
        async submit(){
            this.showConfirmationDialog = false

            this.$emit('isLoading', true)
            try {
                const data = await adminService.updateAdmin(this.form, this.id);

                this.$root.showSnackbar("Berhasil Memperbaharui Detail Profil");
            } catch (error) {
                console.log(error)
                this.$root.showSnackbar(error.response ? error.response.data.message : error.message);
            } finally{
                this.$emit('isLoading', false)
            }
        },


        // validator functions

        required,
        maxLength
    }
}
</script>