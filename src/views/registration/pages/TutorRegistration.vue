<template>
    <v-toolbar>
        <div style="width:40px" class="ml-4">
          <v-img height="40" src="@/assets/logo transparent.png"/>
        </div>
        <v-toolbar-title class="font-bold">
        Baraka Education
        </v-toolbar-title>
    </v-toolbar>

    <v-container class="pa-10">
        <BrkTitle 
            title="Form Registrasi Tutor Baraka Education"
            color="primary"
            class="mb-4"
        />

        <v-form v-model="validForm" @submit.prevent>
            <v-row>
                <v-col>
                    <v-text-field
                        v-model="form.Name"
                        variant="outlined"
                        label="Nama"
                        :rules="[required, maxLength(50)]"
                    />
                    <v-text-field
                        v-model="form.Nickname"
                        variant="outlined"
                        label="Nama Panggilan"
                        :rules="[required, maxLength(50)]"
                    />
                    <BrkDatePicker 
                        mode="date"
                        label="Tanggal Lahir"
                        :defaultDate="form.Birth"
                        @handleDateChange="handleBirthDateChange"
                    />
                    <v-autocomplete 
                        v-model="form.GenderID"
                        label="Gender"
                        :items="gender_list"
                        item-title="Name"
                        item-value="ID"
                        variant="outlined"
                        :rules="[required]"    
                    />
                    <v-autocomplete
                        v-model="form.DegreeID"
                        label="Pendidikan Terakhir"
                        :items="degree_list"
                        item-title="Name"
                        item-value="ID"
                        variant="outlined"    
                        :rules="[required]"
                        persistent-hint
                    />
                    <v-text-field
                        v-model="form.Major"
                        variant="outlined"
                        label="Jurusan"
                        :rules="[required, maxLength(50)]"
                    />
                    <v-text-field
                        v-model="form.College"
                        variant="outlined"
                        label="Perguruan Tinggi"
                        :rules="[required, maxLength(50)]"
                    />
                </v-col>
                <v-col>
                    <v-text-field
                        v-model="form.Address"
                        variant="outlined"
                        label="Alamat"
                        :rules="[required, maxLength(255)]"
                    />
                    <v-autocomplete 
                        v-model="form.ProvinceID"
                        label="Provinsi"
                        :items="provinceList"
                        item-title="Name"
                        item-value="ID"
                        variant="outlined" 
                        @update:model-value="loadCityData(true)"
                    />
                    <v-autocomplete 
                        v-model="form.CityID"
                        label="Kota/Kabupaten"
                        :items="cityList"
                        item-title="Name"
                        item-value="ID"
                        variant="outlined" 
                        :readonly="cityList.length == 0 || type == 'detail'"
                        :rules="[required]"
                    />
                    <v-text-field
                        v-model="form.Phone"
                        label="Telepon (No. WhatsApp)"
                        variant="outlined" 
                        type="number"
                        :rules="[required, validPhoneNumber]"
                    />
                    <v-text-field 
                        label="Email"
                        v-model="form.Email"
                        variant="outlined"
                        type="email"
                        :rules="[validEmail, unique(emailList, 'Email Telah Digunakan')]"
                    />
                    <v-text-field 
                        label="Instagram"
                        v-model="form.Instagram"
                        variant="outlined"
                        type="email"
                    />
                    <v-autocomplete 
                        v-model="form.CourseModeID"
                        label="Mode Mengajar"
                        :items="course_mode_list"
                        item-title="Name"
                        item-value="ID"
                        variant="outlined" 
                        :rules="[required]"
                    />
                </v-col>
            </v-row>

            <div class="d-flex justify-end">
                <BrkButton
                    buttonText="Submit"
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
    </v-container>
</template>

<script>
import locationService from "@/services/location/locationService.js";
import authService from "@/services/auth/authService.js";
import tutorService from '@/services/tutor/tutorService.js';
import BrkDatePicker from "@/components/pages/BrkDatePicker.vue";
import BrkButton from "@/components/pages/BrkButton.vue";
import BrkTitle from "@/components/pages/BrkTitle.vue";
import ConfirmationDialog from "@/components/ConfirmationDialog.vue";
import { gender_list } from '@/utils/database-static-records/genders.js';
import { degree_list } from '@/utils/database-static-records/degrees.js';
import { course_mode_list } from '@/utils/database-static-records/course_mode.js';
import { role_list } from '@/utils/database-static-records/roles.js';
import { required, validEmail, validPhoneNumber, maxLength, unique, match } from '@/utils/app/validator.js';

export default{
    props:{
        type:{
            type:String
        }
    },
    components:{
        BrkDatePicker,
        BrkButton,
        BrkTitle,
        ConfirmationDialog
    },
    data(){
        return{
            form:{
                // tutors model
                Name:null,
                Nickname:null,
                Birth:null,
                GenderID:null,
                DegreeID:null,
                Major:null,
                College:null,
                CityID:null,
                Address:null,
                Phone:null,
                Instagram:null,
                CourseModeID:null,
                // tutors model
                
                // users model
                RoleID: role_list.find(role => role.Name == 'tutor').ID,
                Username:null,
                Email:null,
                Password:null,
                IsActive:1,
                // users model

                // additional
                IsAccountCreated:false,
                ProvinceID: null,
                // additional
            },

            initiallyHasAccount: false,
            validForm: false,
            confirmPassword: null,
            showConfirmationDialog: false,
            showCancelConfirmationDialog: false,
            confirmationText: '',
            usernameList: [],
            emailList: [],

            // static database records related to tutors
            gender_list: gender_list,
            degree_list: degree_list,
            course_mode_list: course_mode_list,
            // static database records related to tutors

            // non-static database records related to tutors
            provinceList: [],
            cityList: [],
            // non-static database records related to tutors
        }
    },
    computed: {
        id() {
            return this.$route.params.id;
        },
    },
    created(){
        this.loadData()
    },
    methods:{
        async loadData(){
            this.$emit('isLoading', true)
            await Promise.all([
                this.loadProvinceData(),
                this.loadCityData(),
                this.loadEmails()
            ])

            this.$emit('isLoading', false)
        },
        async loadProvinceData(){
            try{
                const data = await locationService.getProvinceList();

                this.provinceList = data.data;
            }  catch (error) {
                this.$root.showSnackbar(error.response ? error.response.data.message : error.message)
            }
        },
        async loadCityData(changeProvince = false){
            if(this.cityList.lenght > 0 || changeProvince ) this.form.CityID = null;

            this.cityList = [];

            this.$emit('isLoading', true)

            try {
                const data = await locationService.getCitiesByProvinceID(this.form.ProvinceID);
            
                this.cityList = data.data;
            } catch (error) {
                this.$root.showSnackbar(error.response ? error.response.data.message : error.message)
            }


            this.$emit('isLoading', false)
        },
        async loadUsernames(){
            this.$emit('isLoading', true)
            try {
                if(this.usernameList.length === 0){
                    const data = await authService.getUsernames();

                    this.usernameList = data.data;
                }
            } catch (error) {
                this.$root.showSnackbar(error.response ? error.response.data.message : error.message)
            } finally {
                this.$emit('isLoading', false)
            }
        },
        async loadEmails(){
            this.$emit('isLoading', true)
            try {
                if(this.emailList.length === 0){
                    const data = await authService.getEmails();

                    this.emailList = data.data;
                }
            } catch (error) {
                this.$root.showSnackbar(error.response ? error.response.data.message : error.message)
            } finally {
                this.$emit('isLoading', false)
            }
        },
        handleBirthDateChange(date){
            this.form.Birth = this.$root.formatDate(date, "inputDate")
        },
        handleSubmit(){
            if(!this.validForm){
                return
            }

            this.showConfirmationDialog = true;
            this.confirmationText = 'Anda Akan Mendaftar Sebagai Tutor di Baraka Education. Lanjutkan?'
        },
        handleCancel(){
            this.showConfirmationDialog = false
        },
        async submit(){
            this.$emit('isLoading', true)
            try {
                const data = await tutorService.registerTutor(this.form);

                this.$router.push(`/registrasi/tutor/success`);
            } catch (error) {
                console.log(error)
                this.$root.showSnackbar(error.response ? error.response.data.message : error.message);
            }
        },


        // validator functions

        required,
        validEmail,
        validPhoneNumber,
        maxLength,
        unique,
        match
    }
}
</script>