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
                    v-model="form.GradeID"
                    label="Kelas"
                    :items="grade_list"
                    item-title="Name"
                    item-value="ID"
                    variant="outlined"    
                    :rules="[required]"
                />
                <v-text-field
                    v-model="form.School"
                    variant="outlined"
                    label="Sekolah"
                    :rules="[maxLength(50)]"
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
                <v-autocomplete 
                    v-model="form.ProgramID"
                    label="Program Kursus"
                    :items="programList"
                    item-title="Name"
                    item-value="ID"
                    variant="outlined" 
                    :rules="[required]"
                />
                <v-autocomplete 
                    v-model="form.StatusID"
                    label="Status Keaktifan Siswa"
                    :items="student_status_list"
                    item-title="Name"
                    item-value="ID"
                    variant="outlined" 
                    :rules="[required]"
                />
            </v-col>
        </v-row>
        <v-row class="my-0">
            <v-col class="my-0">
                <v-textarea
                    v-model="form.Note"
                    label="Catatan"
                    variant="outlined" 
                    autogrow
                    hint="Berisi target capaian, request tutor, dll"
                    persistent-hint
                    :rules="[maxLength(255)]"
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
import programService from "@/services/program/programService.js";
import locationService from "@/services/location/locationService.js";
import authService from "@/services/auth/authService.js";
import studentService from '@/services/student/studentService.js';
import BrkDatePicker from "@/components/pages/BrkDatePicker.vue";
import BrkButton from "@/components/pages/BrkButton.vue";
import ConfirmationDialog from "@/components/ConfirmationDialog.vue";
import { gender_list } from '@/utils/database-static-records/genders.js';
import { grade_list } from '@/utils/database-static-records/grades.js';
import { student_status_list } from '@/utils/database-static-records/student_status.js';
import { required, validEmail, validPhoneNumber, maxLength } from '@/utils/app/validator.js';

export default{
    components:{
        BrkDatePicker,
        BrkButton,
        ConfirmationDialog
    },
    data(){
        return{
            id: JSON.parse(localStorage.getItem('id')),
            form:{
                // students model
                Name:null,
                Nickname:null,
                Birth:null,
                GenderID:null,
                GradeID:null,
                School:null,
                CityID:null,
                Address:null,
                Phone:null,
                ProgramID:null,
                StatusID:null,
                Note:null,
                // students model

            },

            validForm: false,
            showConfirmationDialog: false,
            confirmationText: '',

            // static database records related to students
            gender_list: gender_list,
            grade_list: grade_list,
            student_status_list: student_status_list.filter(status => status.ID != null),
            // static database records related to students

            // non-static database records related to students
            provinceList: [],
            cityList: [],
            programList: [],
            // non-static database records related to students
        }
    },
    created(){
        this.loadData()
    },
    methods:{
        async loadData(){
            this.$emit('isLoading', true)
            await Promise.all([
                this.loadProgramData(),
                this.loadProvinceData(),
            ])

            await this.loadStudentDetail()
            await this.loadCityData()

            this.$emit('isLoading', false)
        },
        async loadStudentDetail(){
            try{
                const data = await studentService.getStudentDetailByUserID(this.id);

                this.form = {
                    ...this.form,
                    ...data.data
                };

                console.log(this.form)
            } catch (error) {
                this.$root.showSnackbar(error.response ? error.response.data.message : error.message)
            }
        },
        async loadProgramData(){
            try{
                const data = await programService.getProgramList();

                this.programList = data.data;
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
                const data = await studentService.updateStudentByUserID(this.form, this.id);
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