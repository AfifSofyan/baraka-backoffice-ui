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
            title="Form Akademik Baraka Education"
            color="primary"
            class="mb-4"
        />

        <v-form v-model="validForm" @submit.prevent="handleSubmit">
            <v-row class="my-0">
                <v-col class="my-0 ml-2">
                    <v-switch 
                        label="Mengajar Lebih Dari Satu Siswa ?"
                        v-model="form.IsJoin"
                        density="compact"
                        @update:model-value="generateJoinCode"
                    />
                </v-col>
            </v-row>

            <v-row>
                <v-col cols="12" md="6">
                    <BrkDatePicker 
                        mode="date"
                        label="Tanggal Les"
                        :max="maxDate"
                        :min="minDate"
                        :defaultDate="form.Date"
                        @handleDateChange="handleDateChange"
                        :rules="[required]"
                    />
                    <BrkTimePicker 
                        label="Waktu Mulai"
                        :defaultTime="form.TimeStart"
                        @handleTimeChange="handleTimeStartChange"
                        :rules="[required]"
                    />
                    <BrkTimePicker 
                        ref="endTimePicker"
                        label="Waktu Selesai"
                        :defaultTime="form.TimeEnd"
                        @handleTimeChange="handleTimeEndChange"
                        :rules="[required]"
                    />
                    <v-autocomplete 
                        v-model="form.TutorID"
                        label="Tutor"
                        :items="tutorList"
                        item-title="Name"
                        item-value="ID"
                        variant="outlined"
                        :rules="[required]"    
                        @update:model-value="generateJoinCode"
                    />
                    <v-autocomplete 
                        v-model="form.ModeID"
                        label="Mode"
                        :items="mode_list"
                        item-title="Name"
                        item-value="ID"
                        variant="outlined"
                        :rules="[required]"    
                    />
                    <v-autocomplete 
                        v-model="form.SubjectID"
                        label="Mata Pelajaran"
                        :items="subjectList"
                        item-title="Subject"
                        item-value="ID"
                        variant="outlined"
                        :rules="[required]"    
                    />
                </v-col>
            </v-row>
            
            <div v-if="!form.IsJoin">
                <v-row>
                    <v-col cols="12" md="6" class="my-0">
                        <v-autocomplete 
                            v-model="form.StudentID"
                            label="Siswa"
                            :items="studentList"
                            item-title="Name"
                            item-value="ID"
                            variant="outlined"
                            :rules="[required]"    
                        />
                        <v-text-field 
                            label="Topik"
                            v-model="form.Topic"
                            variant="outlined"
                            :rules="[required]"

                        />
                        <v-autocomplete 
                            v-model="form.AffectiveID"
                            label="Penilaian Afektif"
                            :items="affective_list"
                            item-title="Name"
                            item-value="ID"
                            variant="outlined"
                            :rules="[required]"    

                        />                
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12" class="my-0 px-3">
                        <v-label class="pb-4 px-4">Skor Kuis</v-label>
                        <v-slider
                            v-model="form.Score"
                            :step="1"
                            max="10"
                            min="0"
                            show-ticks="always"
                            thumb-label="always"
                            tick-size="4"
                            @update:model-value="() => {console.log(form.Score)}"

                        />
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12" class="my-0">
                        <div class="mb-4 font-12 font-italic font-weight-light text-justify">
                            <p>Catatan Hasil Pembelajaran harus mencakup:</p>
                            <p>1. Capaian pemahaman siswa terkait setiap teori/prinsip/persamaan/rumus/dll.</p>
                            <p>2. Kemampuan siswa dalam menyelesakan soal (jika melakukan latihan soal) untuk setiap tingkatan yang berbeda.</p>
                            <p>3. Materi apa yang belum/kurang dipahami siswa dan strategi pembelajaran berikutnya.</p>
                            <p>CONTOH:</p>
                            <p>Alhamdulillah ananda sudah mampu memahami materi tentang hukum ohm dan daya listrik dengan baik dan dapat menyelesaikan soal-soal sederhana tentang materi ini dengan tepat. Akan tetapi ananda terkadang masih belum mampu menyelesaikan soal-soal pengembangan tentang materi ini (seperti mengonversi rumus daya untuk besaran I,R dan besaran V,R) dengan cukup baik. Perlu memperbanyak latihan untuk menyelesaikan soal-soal daya tersebut dengan berbagai variasi rumus.</p>
                        </div>
                        <v-textarea
                            v-model="form.Note"
                            variant="outlined"
                            label="Catatan Hasil Pembelajaran"
                            :rules="[required, minLength(150)]"

                            :counter="150"
                        />
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12" md="6" class="my-0">
                        <v-text-field 
                            label="Materi Selanjutnya"
                            v-model="form.NextTopic"
                            variant="outlined"
                            :rules="[required]"

                        />
                    </v-col>
                </v-row>
            </div>

            <div v-else>
                <v-card
                    class="pa-4 mb-6"
                >
                    <ModalStudentData 
                        :subject_list="subjectList"
                        :student_list="studentList"
                        :selected_students_id="form.MultipleStudentsData.map(obj => obj.StudentID)"
                        @onSubmitData="onAddStudent"
                        @onCancelData="onDeleteStudent"
                    />
                    <div class="mb-6"></div>    
                    <v-card 
                        class="pa-4 my-2 bg-blue-grey-lighten-5"
                        v-for="(student, index) in form.MultipleStudentsData"
                    >
                        <v-row class="font-14">
                            <v-col cols="12" md="3">
                                <p class="font-weight-bold">Nama</p>
                            </v-col>
                            <v-col>
                                {{ studentList.find( _student => _student.ID == student.StudentID).Name }}
                            </v-col>
                        </v-row>
                        <v-row class="font-14">
                            <v-col cols="12" md="3">
                                <p class="font-weight-bold">Topik</p>
                            </v-col>
                            <v-col>
                                {{ student.Topic }}
                            </v-col>
                        </v-row>
                        <v-row class="font-14">
                            <v-col cols="12" md="3">
                                <p class="font-weight-bold">Afektif</p>
                            </v-col>
                            <v-col>
                                {{ affective_list.find(affective => affective.ID == student.AffectiveID).Name }}
                            </v-col>
                        </v-row>
                        <v-row class="font-14">
                            <v-col cols="12" md="3">
                                <p class="font-weight-bold">Skor Kuis</p>
                            </v-col>
                            <v-col>
                                {{ student.Score }}
                            </v-col>
                        </v-row>
                        <v-row class="font-14">
                            <v-col cols="12" md="3">
                                <p class="font-weight-bold">Catatan</p>
                            </v-col>
                            <v-col>
                                <p class="text-justify">{{ student.Note }}</p>
                            </v-col>
                        </v-row>
                        <v-row class="font-14">
                            <v-col cols="12" md="3">
                                <p class="font-weight-bold">Materi Selanjutnya</p>
                            </v-col>
                            <v-col>
                                <p class="text-justify">{{ student.NextTopic }}</p>
                            </v-col>
                        </v-row>

                        <v-card-actions>
                            <div class="d-flex justify-end" style="width:100%">
                                <v-btn
                                    text="Hapus Data Siswa"
                                    prepend-icon="mdi-trash-can-outline"
                                    color="danger"
                                    class="justify-self-end"
                                    @click="onDeleteStudent(student.StudentID)"
                                />
                            </div>
                        </v-card-actions>
                    </v-card>
                </v-card>
            </div>


            <div class="d-flex justify-end">
                <BrkButton
                    buttonText="Batal"
                    color="danger"
                    @click="showCancelConfirmationDialog = true"
                    class="mr-2"
                />
                <BrkButton
                    :disabled="form.IsJoin && form.MultipleStudentsData.length <= 1"
                    buttonText="Submit"
                    color="secondary"
                    type="submit"
                />
            </div>
            
        </v-form>

        <v-dialog v-model="showConfirmationDialog" width="550" persistent>
            <v-card>
                <v-card-title class="pl-6 pt-4 color-secondary">Input Data Akademik</v-card-title>

                <v-card-text>
                    <p class="text-justify font-16 mb-8">Anda akan menambahkan data akademik sebagaimana rangkuman di bawah ini. Centang apabila data yang dimaksud telah sesuai</p>
                    
                    <div 
                        v-for="(item, itemIdx) in listToConfirm"
                        :key="itemIdx"
                        class="py-0 my-n8"
                    >
                        <v-checkbox 
                            v-model="item.isChecked"
                            :label="item.text"
                        />
                    </div>

                </v-card-text>

                <v-card-actions>
                    <v-spacer/>
                    <v-btn
                        
                        color="danger"
                        @click="showConfirmationDialog = false"
                    >
                    BATAL
                    </v-btn>
                    <v-btn
                        
                        color="primary"
                        :disabled="!listToConfirm.every(item => item.isChecked) || formIsSubmitted"
                        @click="submit"
                    >
                    OK
                    </v-btn>
                    <v-spacer/>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <ConfirmationDialog
            :isOpen="showCancelConfirmationDialog"
            confirmationText="Anda akan kembali ke halaman daftar responsi. Data yang anda masukkan tidak akan tersimpan. Lanjutkan?"
            @handleCancel="showCancelConfirmationDialog = false"
            @handleOK="() => $router.push('/backoffice/laporan/responsi')"
        />
    </v-container>
</template>

<script>
import studentService from "@/services/student/studentService.js";
import tutorService from "@/services/tutor/tutorService.js";
import subjectService from "@/services/subject/subjectService.js";
import responseService from "@/services/response/responseService.js";
import BrkDatePicker from "@/components/pages/BrkDatePicker.vue";
import BrkActionButton from "@/components/pages/BrkActionButton.vue";
import BrkTimePicker from "@/components/pages/BrkTimePicker.vue";
import BrkNoData from '@/components/pages/BrkNoData.vue';
import BrkButton from "@/components/pages/BrkButton.vue";
import BrkTitle from "@/components/pages/BrkTitle.vue";
import ModalStudentData from "./ModalStudentData.vue";
import ConfirmationDialog from "@/components/ConfirmationDialog.vue";
import { mode_list } from "@/utils/database-static-records/mode.js";
import { affective_list } from "@/utils/database-static-records/affective.js";
import { required, minLength } from '@/utils/app/validator.js';

import moment from "moment";

export default{
    emits: ['isLoading'],
    components:{
        BrkDatePicker,
        BrkTimePicker,
        BrkActionButton,
        BrkButton,
        BrkNoData,
        BrkTitle,
        ConfirmationDialog,
        ModalStudentData
    },
    data(){
        return{
            validForm: false,
            formIsSubmitted: false,
            form:{
                // reports model
                TutorID: null,
                StudentID: null,
                Date: null,
                TimeStart: null,
                TimeEnd: null,
                Duration: 0,
                IsJoin: false,
                JoinCode: null,
                SubjectID: null,
                Topic: null,
                ModeID: null,
                Score: 5,
                AffectiveID: 1,
                Note: null,
                NextTopic: null,
                CreatedDate: null,
                CreatedBy: null,
                UpdatedDate: null,
                UpdatedBy: null,
                // reports model

                // additional reports data
                MultipleStudentsData: [],
                CreatedByName: null,
                UpdatedByName: null
                //
                
            },

            // static database records related to reports
            mode_list: mode_list,
            affective_list: affective_list,
            // static database records related to students

            // non-static database records related to students
            tutorList: [],
            studentList: [],
            subjectList: [],
            // non-static database records related to students


            // other variables related to form
            maxDate: moment().format('YYYY-MM-DD'),
            minDate: moment().subtract(1, 'day').format('YYYY-MM-DD'),
            affective_ticks_labels:  affective_list.reduce((acc, obj) => {
                acc[obj.ID] = obj.Name;
                return acc;
            }, {}),

            listToConfirm: [],

            showConfirmationDialog: false,
            showCancelConfirmationDialog: false,

            // other variables related to form
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
                this.loadStudentData(),
                this.loadTutorData(),
                this.loadSubjectData()
            ])

            this.$emit('isLoading', false)
        },
        async loadSubjectData(){
            try{
                const result = await subjectService.getSubjectList();

                this.subjectList = result.data;


            }  catch (error) {
                this.$root.showSnackbar(error.response ? error.response.data.message : error.message)
            }
        },
        async loadStudentData(){
            try{
                const result = await studentService.getStudentIDAndName()

                this.studentList = result.data.data.sort((a, b) => {
                    if (a.Name < b.Name) {
                        return -1;
                    }
                    if (a.Name > b.Name) {
                        return 1;
                    }
                    return 0;
                })

            }  catch (error) {
                this.$root.showSnackbar(error.response ? error.response.data.message : error.message)
            }
        },
        async loadTutorData(){
            try{
                const result = await tutorService.getTutorIDAndName();

                this.tutorList = result.data.data.sort((a, b) => {
                    if (a.Name < b.Name) {
                        return -1;
                    }
                    if (a.Name > b.Name) {
                        return 1;
                    }
                    return 0;
                })
            }  catch (error) {
                this.$root.showSnackbar(error.response ? error.response.data.message : error.message)
            }
        },
        handleDateChange(date){
            this.form.Date = this.$root.formatDate(date, "inputDate")
        },
        handleTimeStartChange(time){
            this.form.TimeStart = time
            this.calculateDuration()
        },
        handleTimeEndChange(time){
            this.form.TimeEnd = time
            this.calculateDuration()
        },
        calculateDuration(){
            if(this.form.TimeStart && this.form.TimeEnd){
                const startTime = moment(this.form.TimeStart, "HH:mm:ss")
                const endTime = moment(this.form.TimeEnd, "HH:mm:ss")

                if(endTime.isAfter(startTime)){
                    this.form.Duration = endTime.diff(startTime, 'minutes')
                    console.log(this.form.Duration)
                }else{
                    this.$root.showSnackbar("Waktu Selesai tidak boleh lebih dulu dari Waktu Mulai")
                    this.form.TimeEnd = null
                    this.form.Duration = null
                    this.$refs.endTimePicker.resetTime()
                }
            }
        },
        generateJoinCode(){
            if(!this.form.IsJoin){
                this.form.JoinCode = null
            }else{
                this.form.JoinCode = `${this.form.TutorID}-${moment().format('hhmmDDMMYY')}`
            }
        },
        async handleSubmit(){
            if(!this.validForm){
                return
            }

            await this.constructListToConfirm()

            this.showConfirmationDialog = true;
        },
        handleCancel(){
            this.showConfirmationDialog = false
        },
        async constructListToConfirm(){
            this.$emit('isLoading', true)

            const studentIDs = this.form.MultipleStudentsData.map(data => data.StudentID)
            const multipleStudentNames = this.studentList.filter(_student => studentIDs.includes(_student.ID)).map(_student => _student.Name)

            const studentNameToConfirm = 
                !this.form.IsJoin ? 
                this.studentList.find(_student => _student.ID == this.form.StudentID).Name :
                multipleStudentNames.join(", ")

            const singleStudentDetail = this.form.StudentID ? (await studentService.getStudentDetail(this.form.StudentID)).data : {}
            
            const studentDetails = await this.getMultipleStudentDetails(studentIDs)

            const multipleStudentGrades = []

            multipleStudentNames.forEach(_studentName => {
                multipleStudentGrades.push(
                    studentDetails.find(_student => _student.Name == _studentName).GradeName
                )
            })

            const studentGradeToConfirm = 
                !this.form.IsJoin ?
                singleStudentDetail.GradeName :
                multipleStudentGrades.join(', ')

            const multipleStudentSchools = []

            multipleStudentNames.forEach(_studentName => {
                multipleStudentSchools.push(
                    studentDetails.find(_student => _student.Name == _studentName).School
                )
            })

            const studentSchoolToConfirm = 
                !this.form.IsJoin ?
                singleStudentDetail.School :
                multipleStudentSchools.join(', ')

            this.listToConfirm = [
                {
                    title: 'Date',
                    text: `Tanggal Les: ${this.$root.formatDate(this.form.Date)}`,
                    isChecked: false,
                },
                {
                    title: 'Tutor',
                    text: `Nama Tutor: ${this.tutorList.find(_tutor => _tutor.ID == this.form.TutorID).Name}`,
                    isChecked: false,
                },
                {
                    title: 'Student',
                    text: `Nama Siswa: ${studentNameToConfirm}`,
                    isChecked: false,
                },
                {
                    title: 'Grade',
                    text: `Kelas: ${studentGradeToConfirm}`,
                    isChecked: false,
                },
                {
                    title: 'School',
                    text: `Sekolah: ${studentSchoolToConfirm}`,
                    isChecked: false,
                },
                {
                    title: 'Subject',
                    text: `Mata Pelajaran: ${this.subjectList.find(_subject => _subject.ID == this.form.SubjectID).Subject}`,
                    isChecked: false,
                },
                {
                    title: 'Duration',
                    text: `Durasi Les: ${this.form.Duration} Menit`,
                    isChecked: false,
                },
                {
                    title: 'Mode',
                    text: `Mode: ${this.mode_list.find(_mode => _mode.ID == this.form.ModeID).Name}`,
                    isChecked: false,
                },
            ]

            this.$emit('isLoading', false)

        },
        async getMultipleStudentDetails(studentIDs) {
            const promises = studentIDs.map(studentID => {
                return studentService.getStudentDetail(studentID).then(response => {
                    console.log(response)
                    return response.data
                }).catch(error => {
                    console.error(`Error fetching details for student ID ${studentID}:`, error)
                    return null // or handle the error as needed
                })
            })

            return Promise.all(promises).then(studentDetails => {
                return studentDetails.filter(detail => detail !== null) // Remove any null values in case of errors
            })
        },
        async submit(){
            this.$emit('isLoading', true)
            try {
                const data = await responseService.createReport(this.form);
                this.formIsSubmitted = true
                if(data.message == "Create Report Succesfully"){
                    this.$router.push('/form_akademik/success');
                }else{
                    this.$root.showSnackbar("Gagal melakukan submit data, silahkan coba beberapa saat lagi");    
                }
            
            } catch (error) {
                console.log(error)
                this.formIsSubmitted = false
                this.$root.showSnackbar(error.response ? error.response.data.message : error.message);
            }
        },
        score(val){
            return this.scores[val - 1]
        },
        onAddStudent(studentData){
            const studentExists = this.form.MultipleStudentsData.find(student => student.StudentID == studentData.StudentID)
            if(!studentExists){
                this.form.MultipleStudentsData.push(studentData)
            }
        },
        onDeleteStudent(studentID){
            this.form.MultipleStudentsData = this.form.MultipleStudentsData.filter(student => student.StudentID != studentID)
        },

        // validator functions

        required,
        minLength,
    }
}
</script>

<style scoped>
    .custom-slider{
        font-size: 12px;
    }
</style>