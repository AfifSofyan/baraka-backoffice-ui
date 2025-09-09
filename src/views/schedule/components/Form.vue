<template>
    <v-form v-model="validForm" @submit.prevent>
        <v-row>
            <v-col cols="12" md="6">
                <v-autocomplete 
                    v-model="form.TutorID"
                    label="Tutor"
                    :items="tutorList"
                    item-title="Name"
                    item-value="ID"
                    variant="outlined"
                    :rules="[required]"  
                    :readonly="type == 'detail'"
                />
                <v-autocomplete 
                    v-model="form.StudentID"
                    label="Siswa"
                    :items="studentList"
                    item-title="Name"
                    item-value="ID"
                    variant="outlined"
                    :rules="[required]"    
                    :readonly="type == 'detail'"
                />
                <v-autocomplete 
                    v-model="form.SubjectID"
                    label="Mata Pelajaran"
                    :items="subjectList"
                    item-title="Subject"
                    item-value="ID"
                    variant="outlined"
                    :rules="[required]"    
                    :readonly="type == 'detail'"
                />
                <v-autocomplete 
                    v-model="form.DayID"
                    label="Hari"
                    :items="days_list"
                    item-title="Name"
                    item-value="ID"
                    variant="outlined"
                    :rules="[required]"    
                    :readonly="type == 'detail'"
                />
                <BrkTimePicker 
                    :defaultTime="form.Time"
                    :readonly="type == 'detail'"
                    @handleTimeChange="handleTimeChange"
                />
                <v-autocomplete 
                    v-model="form.ModeID"
                    label="Mode"
                    :items="mode_list"
                    item-title="Name"
                    item-value="ID"
                    variant="outlined"
                    :rules="[required]"    
                    :readonly="type == 'detail'"
                />
                <BrkDatePicker 
                    mode="date"
                    label="Tanggal Mulai"
                    :defaultDate="form.StartDate"
                    @handleDateChange="handleStartDateChange"
                    :readonly="type == 'detail'"
                />
                <v-textarea
                    v-model="form.Note"
                    label="Catatan"
                    variant="outlined" 
                    autogrow
                    :rules="[maxLength(255)]"
                    :readonly="type == 'detail'"
                />
            </v-col>
        </v-row>

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
                v-if="$root.hasAccess('Hapus Jadwal')"
                buttonText="Hapus Jadwal"
                color="danger"
                @click="handleDelete()"
                class="mr-2"
            />
            <BrkButton
                v-if="$root.hasAccess('Edit Jadwal')"
                buttonText="Edit Jadwal"
                color="secondary"
                @click="() => $router.push(`/backoffice/jadwal/edit/${id}`)"
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
        confirmationText="Anda akan kembali ke halaman daftar jadwal. Data yang anda masukkan tidak akan tersimpan. Lanjutkan?"
        @handleCancel="showCancelConfirmationDialog = false"
        @handleOK="() => $router.push('/backoffice/jadwal')"
    />
</template>

<script>
import tutorService from "@/services/tutor/tutorService.js";
import studentService from '@/services/student/studentService.js';
import subjectService from "@/services/subject/subjectService.js";
import scheduleService from "@/services/schedule/scheduleService.js";
import BrkDatePicker from "@/components/pages/BrkDatePicker.vue";
import BrkTimePicker from "@/components/pages/BrkTimePicker.vue";
import BrkButton from "@/components/pages/BrkButton.vue";
import ConfirmationDialog from "@/components/ConfirmationDialog.vue";
import { days_list } from "@/utils/database-static-records/days.js";
import { mode_list } from "@/utils/database-static-records/mode.js";
import { required, validEmail, validPhoneNumber, maxLength, unique, match } from '@/utils/app/validator.js';

export default{
    props:{
        type:{
            type:String
        }
    },
    components:{
        BrkDatePicker,
        BrkTimePicker,
        BrkButton,
        ConfirmationDialog
    },
    data(){
        return{
            form:{
                // schedules model
                StudentID:null,
                TutorID:null,
                SubjectID:null,
                Time:null,
                DayID:null,
                ModeID:null,
                Note:null,
                StartDate:null,
                // schedules model
            },

            validForm: false,
            confirmPassword: null,
            showConfirmationDialog: false,
            showCancelConfirmationDialog: false,
            confirmationText: '',

            // static database records related to schedules
            days_list: days_list,
            mode_list: mode_list,
            // static database records related to schedules

            // non-static database records related to schedules
            studentList: [],
            tutorList: [],
            subjectList: [],
            // non-static database records related to schedules
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
                this.loadTutorData(),
                this.loadStudentData(),
                this.loadSubjectData()
            ])

            if(this.type !== 'create'){
                await this.loadScheduleDetail()
            }

            this.$emit('isLoading', false)
        },
        async loadScheduleDetail(){
            try{
                const data = await scheduleService.getScheduleDetail(this.id);

                this.form = {
                    ...this.form,
                    ...data.data
                };
            } catch (error) {
                this.$root.showSnackbar(error.response ? error.response.data.message : error.message)
            }
        },
        async loadTutorData(){
            try{
                const result = await tutorService.getTutorIDAndName();

                this.tutorList = result.data.data;
            } catch (error) {
                this.$root.showSnackbar(error.response ? error.response.data.message : error.message)
            }
        },
        async loadStudentData(){
            try{
                const result = await studentService.getStudentIDAndName();

                this.studentList = result.data.data;
            }  catch (error) {
                this.$root.showSnackbar(error.response ? error.response.data.message : error.message)
            }
        },
        async loadSubjectData(){
            try{
                const result = await subjectService.getSubjectList();

                this.subjectList = result.data;
            }  catch (error) {
                this.$root.showSnackbar(error.response ? error.response.data.message : error.message)
            }
        },
        handleStartDateChange(date){
            this.form.StartDate = this.$root.formatDate(date, 'inputDate')
        },
        handleTimeChange(time){
            this.form.Time = time
        },
        handleSubmit(){
            if(!this.validForm){
                return
            }

            this.showConfirmationDialog = true;
            this.confirmationText = 
                this.type == 'create' ? 
                'Anda Akan Menambahkan Jadwal Baru. Lanjutkan?' :
                'Anda Akan Memperbaharui Jadwal. Lanjutkan?'
        },
        handleDelete(){
            this.showConfirmationDialog = true;
            this.confirmationText = 'Anda Akan Menghapus Jadwal dan Seluruh Catatan Presensi Terkait. Lanjutkan?'
        },
        handleCancel(){
            this.showConfirmationDialog = false
        },
        async submit(){
            this.$emit('isLoading', true)
            try {
                if(this.type == 'create'){
                    const data = await scheduleService.createSchedule(this.form);

                    this.$router.push(`/backoffice/jadwal/${data.ScheduleID}`);
                }
                if(this.type == 'edit'){
                    const data = await scheduleService.updateSchedule(this.form, this.id);

                    this.$router.push(`/backoffice/jadwal/${data.data.ScheduleID}`)
                }
                if(this.type == 'detail'){
                    const data = await scheduleService.deleteSchedule(this.id);

                    this.$router.push(`/backoffice/jadwal`)
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