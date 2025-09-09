<template>
    <v-form v-model="validForm" @submit.prevent>
        <v-row>
            <v-col>
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
                <BrkDatePicker 
                    mode="date"
                    label="Tanggal Lahir"
                    :defaultDate="form.Birth"
                    @handleDateChange="handleBirthDateChange"
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
                <v-autocomplete
                    v-model="form.DegreeID"
                    label="Pendidikan Terakhir"
                    :items="degree_list"
                    item-title="Name"
                    item-value="ID"
                    variant="outlined"    
                    :rules="[required]"
                    :readonly="type == 'detail'"
                    persistent-hint
                />
                <v-text-field
                    v-model="form.Major"
                    variant="outlined"
                    label="Jurusan"
                    :rules="[required, maxLength(50)]"
                    :readonly="type == 'detail'"
                />
                <v-text-field
                    v-model="form.College"
                    variant="outlined"
                    label="Perguruan Tinggi"
                    :rules="[required, maxLength(50)]"
                    :readonly="type == 'detail'"
                />
                <v-autocomplete 
                    v-model="form.IsActive"
                    label="Status Keaktifan Tutor"
                    :items="
                        [
                            {
                                Value:1,
                                Name:'Aktif'
                            },
                            {
                                Value:0,
                                Name:'Nonaktif'
                            }
                        ]
                    "
                    item-title="Name"
                    item-value="Value"
                    variant="outlined" 
                    :readonly="type == 'detail'"
                />
            </v-col>
            <v-col>
                <v-text-field
                    v-model="form.Address"
                    variant="outlined"
                    label="Alamat"
                    :rules="[required, maxLength(255)]"
                    :readonly="type == 'detail'"
                />
                <v-autocomplete 
                    v-model="form.ProvinceID"
                    label="Provinsi"
                    :items="provinceList"
                    item-title="Name"
                    item-value="ID"
                    variant="outlined" 
                    @update:model-value="loadCityData(true)"
                    :readonly="type == 'detail'"
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
                    :readonly="type == 'detail'"
                />
                <v-text-field 
                    label="Email"
                    v-model="form.Email"
                    variant="outlined"
                    type="email"
                    :rules="[validEmail, unique(emailList, 'Email Telah Digunakan')]"
                    :readonly="type == 'detail'"
                />
                <v-text-field 
                    label="Instagram"
                    v-model="form.Instagram"
                    variant="outlined"
                    type="email"
                    :readonly="type == 'detail'"
                />
                <v-autocomplete 
                    v-model="form.CourseModeID"
                    label="Mode Mengajar"
                    :items="course_mode_list"
                    item-title="Name"
                    item-value="ID"
                    variant="outlined" 
                    :rules="[required]"
                    :readonly="type == 'detail'"
                />
                <v-autocomplete 
                    v-model="form.IsDraft"
                    label="Status Penugasan Tutor"
                    :items="
                        [
                            {
                                ID:0,
                                Name:'Terjadwal'
                            },
                            {
                                ID:1,
                                Name:'Pendaftar Baru'
                            }
                        ]
                    "
                    item-title="Name"
                    item-value="ID"
                    variant="outlined" 
                    :readonly="type == 'detail'"
                />
            </v-col>
        </v-row>

        <v-row class="my-0">
            <v-col class="my-0 ml-2">
                <v-switch 
                    v-if="!initiallyHasAccount && type != 'detail'"
                    label="Buat Akun Tutor ?"
                    v-model="form.IsAccountCreated"
                    density="compact"
                    @update:model-value="loadUsernames"
                    :disabled="initiallyHasAccount && type == 'edit'"
                />
            </v-col>
        </v-row>

        <v-row v-if="form.IsAccountCreated && !initiallyHasAccount && type !='detail'" class="my-0">
            <v-col cols="12" md="6" class="my-0">
                <v-text-field 
                    label="Username"
                    v-model="form.Username"
                    variant="outlined"
                    autocomplete="new-username"
                    :rules="[required, unique(usernameList, 'Username Telah Digunakan')]"
                    :readonly="type == 'detail'"
                />
                <v-text-field 
                    label="Password"
                    v-model="form.Password"
                    variant="outlined"
                    type="password"
                    autocomplete="new-password"
                    :rules="[required]"
                    :readonly="type == 'detail'"
                />
                <v-text-field 
                    label="Konfirmasi Password"
                    v-model="confirmPassword"
                    variant="outlined"
                    type="password"
                    :rules="[required, match(form.Password, 'Password dan Konfirmasi Password Tidak Cocok')]"
                    :readonly="type == 'detail'"
                />
            </v-col>
        </v-row>

        <v-alert 
            v-if="form.IsAccountCreated && !initiallyHasAccount && type != 'detail'"
            density="compact"
            color="gray"
            variant="tonal"
            title="CRENDENTIALS"
            type="warning"
            text="Untuk alasan keamanan, data password tidak akan disimpan di database atau media penyimpanan apapun. Silahkan simpan pasangan data Username dan Password di lokal komputer anda, atau bagikan kepada pemilik akun"
            class="mb-4 font-14"
        />


        <div class="d-flex justify-end" v-if="type !='detail'">
            <BrkButton
                buttonText="Batal"
                color="danger"
                @click="showCancelConfirmationDialog = true"
                class="mr-2"
            />
            <BrkButton
                buttonText="Submit"
                color="secondary"
                type="submit"
                @click="handleSubmit()"
            />
        </div>
        <div class="d-flex justify-end" v-else>
            <BrkButton
                v-if="$root.hasAccess('Edit Tutor')"
                buttonText="Edit Data Tutor"
                color="secondary"
                @click="() => $router.push(`/backoffice/tutor/edit/${id}`)"
            />

        </div>
    </v-form>

    <ConfirmationDialog
        :isOpen="showConfirmationDialog"
        :confirmationText="confirmationText"
        @handleCancel="showConfirmationDialog = false"
        @handleOK="submit"
    />

    <ConfirmationDialog
        :isOpen="showCancelConfirmationDialog"
        confirmationText="Anda akan kembali ke halaman daftar tutor. Data yang anda masukkan tidak akan tersimpan. Lanjutkan?"
        @handleCancel="showCancelConfirmationDialog = false"
        @handleOK="() => $router.push('/backoffice/tutor')"
    />
</template>

<script>
import { EventBus } from "@/eventBus";
import locationService from "@/services/location/locationService.js";
import authService from "@/services/auth/authService.js";
import tutorService from '@/services/tutor/tutorService.js';
import BrkDatePicker from "@/components/pages/BrkDatePicker.vue";
import BrkButton from "@/components/pages/BrkButton.vue";
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
                IsDraft:0,
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
            ])

            if(this.type !== 'create'){
                await this.loadTutorDetail()
                await this.loadCityData()
            }

            if(this.type !== 'detail'){
                await this.loadEmails()
            }

            this.$emit('isLoading', false)
        },
        async loadTutorDetail(){
            try{
                const data = await tutorService.getTutorDetail(this.id);

                this.form = {
                    ...this.form,
                    ...data.data
                };
                this.initiallyHasAccount = data.data.IsAccountCreated;
            } catch (error) {
                this.$root.showSnackbar(error.response ? error.response.data.message : error.message)
            }
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
            this.confirmationText = 
                this.type == 'create' ? 
                'Anda Akan Menambahkan Data Tutor Baru. Lanjutkan?' :
                'Anda Akan Memperbaharui Data Tutor. Lanjutkan?'
        },
        handleCancel(){
            this.showConfirmationDialog = false
        },
        async submit(){
            this.$emit('isLoading', true)
            try {
                if(this.type == 'create'){
                    const data = await tutorService.createTutor(this.form);

                    this.$router.push(`/backoffice/tutor/${data.data.TutorData.TutorID}`);
                }
                if(this.type == 'edit'){
                    const data = await tutorService.updateTutor(this.form, this.id);
                    EventBus.emit('CheckTotalNewRegistrants')

                    this.$router.push(`/backoffice/tutor/${data.data.TutorID}`)
                }
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