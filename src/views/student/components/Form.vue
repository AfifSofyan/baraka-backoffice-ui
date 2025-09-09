<template>
    <v-form v-model="validForm" @submit.prevent>
        <v-row class="d-none d-sm-flex">
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
                    v-model="form.GradeID"
                    label="Kelas"
                    :items="grade_list"
                    item-title="Name"
                    item-value="ID"
                    variant="outlined"    
                    :rules="[required]"
                    :readonly="type == 'detail'"            
                />
                <v-text-field
                    v-if="grades_with_major.includes(form.GradeID)"
                    v-model="form.Major"
                    variant="outlined"
                    label="Jurusan"
                    :rules="[maxLength(50)]"
                    :readonly="type == 'detail'"
                />
                <v-text-field
                    v-if="form.GradeID !== grade_for_general"
                    v-model="form.School"
                    variant="outlined"
                    :label="form.GradeID !== grade_for_college ? 'Sekolah' : 'Perguruan Tinggi'"
                    :rules="[maxLength(50)]"
                    :readonly="type == 'detail'"
                />
                <v-autocomplete 
                    v-model="form.ReligionID"
                    label="Agama"
                    :items="religion_list"
                    item-title="Name"
                    item-value="ID"
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
                    v-model="form.StudentPhone"
                    label="No Telp Siswa"
                    variant="outlined" 
                    type="number"
                    :rules="[validPhoneNumber]"
                    :readonly="type == 'detail'"
                />
                <v-text-field
                    v-model="form.ParentPhone"
                    label="No Telp Orang Tua Siswa"
                    variant="outlined" 
                    type="number"
                    :rules="[validPhoneNumber]"
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
                <v-autocomplete 
                    v-model="form.ProgramID"
                    label="Program Kursus"
                    :items="programList"
                    item-title="Name"
                    item-value="ID"
                    variant="outlined" 
                    :rules="[required]"
                    :readonly="type == 'detail'"
                />
                <v-autocomplete 
                    v-model="form.StatusID"
                    label="Status Keaktifan Siswa"
                    :items="form.StatusID != 4 ? student_status_list.filter(obj => obj.Name != 'Pendaftar Baru') : student_status_list"
                    item-title="Name"
                    item-value="ID"
                    variant="outlined" 
                    :rules="[required]"
                    :readonly="type == 'detail'"
                />
            </v-col>
        </v-row>

        <!-- mobile view -->
        <v-row class="d-flex d-sm-none">
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
                    v-model="form.GradeID"
                    label="Kelas"
                    :items="grade_list"
                    item-title="Name"
                    item-value="ID"
                    variant="outlined"    
                    :rules="[required]"
                    :readonly="type == 'detail'"
                  />
                <v-text-field
                    v-if="grades_with_major.includes(form.GradeID)"
                    v-model="form.Major"
                    variant="outlined"
                    label="Jurusan"
                    :rules="[maxLength(50)]"
                    :readonly="type == 'detail'"
                />
                <v-text-field
                    v-if="form.GradeID !== grade_for_general"
                    v-model="form.School"
                    variant="outlined"
                    :label="form.GradeID !== grade_for_college ? 'Sekolah' : 'Perguruan Tinggi'"
                    :rules="[maxLength(50)]"
                    :readonly="type == 'detail'"
                />
                <v-autocomplete 
                    v-model="form.ReligionID"
                    label="Agama"
                    :items="religion_list"
                    item-title="Name"
                    item-value="ID"
                    variant="outlined" 
                    :readonly="type == 'detail'"
                />
                <v-textarea
                    v-model="form.Address"
                    label="Alamat"
                    variant="outlined" 
                    autogrow
                    :rules="[maxLength(255)]"
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
                    v-model="form.StudentPhone"
                    label="No Telp Siswa"
                    variant="outlined" 
                    type="number"
                    :rules="[validPhoneNumber]"
                    :readonly="type == 'detail'"
                />
                <v-text-field
                    v-model="form.ParentPhone"
                    label="No Telp Orang Tua Siswa"
                    variant="outlined" 
                    type="number"
                    :rules="[validPhoneNumber]"
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
                <v-autocomplete 
                    v-model="form.ProgramID"
                    label="Program Kursus"
                    :items="programList"
                    item-title="Name"
                    item-value="ID"
                    variant="outlined" 
                    :rules="[required]"
                    :readonly="type == 'detail'"
                />
                <v-autocomplete 
                    v-model="form.StatusID"
                    label="Status Keaktifan Siswa"
                    :items="form.StatusID != 4 ? student_status_list.filter(obj => obj.Name != 'Pendaftar Baru') : student_status_list"
                    item-title="Name"
                    item-value="ID"
                    variant="outlined" 
                    :rules="[required]"
                    :readonly="type == 'detail'"
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
                    :readonly="type == 'detail'"
                />
            </v-col>
        </v-row>

        <v-row class="my-0">
            <v-col class="my-0 ml-2">
                <v-switch 
                    v-if="!initiallyHasAccount && type != 'detail'"
                    label="Buat Akun Siswa ?"
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
                v-if="$root.hasAccess('Edit Siswa')"
                buttonText="Edit Data Siswa"
                color="secondary"
                @click="() => $router.push(`/backoffice/siswa/edit/${id}`)"
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
        confirmationText="Anda akan kembali ke halaman daftar siswa. Data yang anda masukkan tidak akan tersimpan. Lanjutkan?"
        @handleCancel="showCancelConfirmationDialog = false"
        @handleOK="() => $router.push('/backoffice/siswa')"
    />
</template>

<script>
import { EventBus } from "@/eventBus";
import programService from "@/services/program/programService.js";
import locationService from "@/services/location/locationService.js";
import authService from "@/services/auth/authService.js";
import studentService from '@/services/student/studentService.js';
import BrkDatePicker from "@/components/pages/BrkDatePicker.vue";
import BrkButton from "@/components/pages/BrkButton.vue";
import ConfirmationDialog from "@/components/ConfirmationDialog.vue";
import { gender_list } from '@/utils/database-static-records/genders.js';
import { grade_list } from '@/utils/database-static-records/grades.js';
import { religion_list } from '@/utils/database-static-records/religions.js';
import { student_status_list } from '@/utils/database-static-records/student_status.js';
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
                // students model
                Name:null,
                Nickname:null,
                Birth:null,
                GenderID:null,
                GradeID:null,
                Major: null,
                School:null,
                CityID:null,
                Address:null,
                Phone:null,
                ProgramID:null,
                StatusID:null,
                Note:null,
                // students model
                
                // users model
                RoleID: role_list.find(role => role.Name == 'student').ID,
                Username:null,
                Email:null,
                Password:null,
                IsActive:true,
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

            // static database records related to students
            gender_list: gender_list,
            grade_list: grade_list,
            religion_list: religion_list,
            student_status_list: student_status_list.filter(status => status.ID != null),
            grades_with_major: grade_list
                .filter(grade => ["X", "XI", "XII", "Mahasiswa"].includes(grade.Name))
                .map(grade => grade.ID),
            grade_for_college: grade_list
                .find(grade => grade.Name == 'Mahasiswa')
                .ID,
            grade_for_general: grade_list
                .find(grade => grade.Name == 'Umum')
                .ID,
            // static database records related to students

            // non-static database records related to students
            provinceList: [],
            cityList: [],
            programList: [],
            // non-static database records related to students
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
                this.loadProgramData(),
                this.loadProvinceData(),
            ])

            if(this.type !== 'create'){
                await this.loadStudentDetail()
                await this.loadCityData()
            }

            if(this.type !== 'detail'){
                await this.loadEmails()

                if(this.type == 'edit'){
                    this.emailList = this.emailList.filter(email => email != this.form.Email)
                }
            }

            this.$emit('isLoading', false)
        },
        async loadStudentDetail(){
            try{
                const data = await studentService.getStudentDetail(this.id);

                this.form = {
                    ...this.form,
                    ...data.data
                };

                this.initiallyHasAccount = data.data.IsAccountCreated;
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

            if(!this.form.ParentPhone && !this.form.StudentPhone){
                this.$emit('isLoading', false)
                this.$root.showSnackbar("Harus menyertakan setidaknya satu nomor telepon");
                return
            }

            this.showConfirmationDialog = true;
            this.confirmationText = 
                this.type == 'create' ? 
                'Anda Akan Menambahkan Data Siswa Baru. Lanjutkan?' :
                'Anda Akan Memperbaharui Data Siswa. Lanjutkan?'
        },
        handleCancel(){
            this.showConfirmationDialog = false
        },
        async submit(){
            this.$emit('isLoading', true)

            try {
                if(this.type == 'create'){
                    const data = await studentService.createStudent(this.form);

                    this.$router.push(`/backoffice/siswa/${data.data.studentData.StudentID}`);
                }
                if(this.type == 'edit'){
                    const data = await studentService.updateStudent(this.form, this.id)
                    EventBus.emit('CheckTotalNewRegistrants')

                    this.$router.push(`/backoffice/siswa/${data.data.StudentID}`)
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