<template>
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
                    hint="isikan dengan pendidikan yang sedang dijalani untuk jenjang D3, D4 atau S1"
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
import locationService from "@/services/location/locationService.js";
import authService from "@/services/auth/authService.js";
import tutorService from '@/services/tutor/tutorService.js';
import BrkDatePicker from "@/components/pages/BrkDatePicker.vue";
import BrkButton from "@/components/pages/BrkButton.vue";
import ConfirmationDialog from "@/components/ConfirmationDialog.vue";
import { gender_list } from '@/utils/database-static-records/genders.js';
import { degree_list } from '@/utils/database-static-records/degrees.js';
import { course_mode_list } from '@/utils/database-static-records/course_mode.js';
import { required, validPhoneNumber, maxLength } from '@/utils/app/validator.js';

export default{
    components:{
        BrkDatePicker,
        BrkButton,
        ConfirmationDialog
    },
    data(){
        return{
            id:JSON.parse(localStorage.getItem('id')),
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
            },

            validForm: false,
            showConfirmationDialog: false,
            confirmationText: '',

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
    created(){
        this.loadData()
    },
    methods:{
        async loadData(){
            this.$emit('isLoading', true)
            await Promise.all([
                this.loadProvinceData(),
            ])

            await this.loadTutorDetail()
            await this.loadCityData()

            this.$emit('isLoading', false)
        },
        async loadTutorDetail(){
            try{
                const data = await tutorService.getTutorDetailByUserID(this.id);

                this.form = {
                    ...this.form,
                    ...data.data
                };
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
        handleBirthDateChange(date){
            this.form.Birth = this.$root.formatDate(date, "inputDate")
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
            this.$emit('isLoading', true)
            try {
                const data = await tutorService.updateTutorByUserID(this.form, this.id);
                this.$root.showSnackbar("Berhasil Memperbaharui Detail Profil");
            } catch (error) {
                console.log(error)
                this.$root.showSnackbar(error.response ? error.response.data.message : error.message);
            } finally{
                this.showConfirmationDialog = false;
            }
        },


        // validator functions

        required,
        validPhoneNumber,
        maxLength,
    }
}
</script>