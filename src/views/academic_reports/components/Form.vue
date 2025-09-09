<template>
    <v-form v-model="validForm" @submit.prevent="handleSubmit">
        <v-row>
            <v-col cols="12" md="6">
                <BrkDatePicker
                    mode="range"
                    :defaultDateRange="dateRange"
                    hasOneMonthBack
                    hasOneMonthForward
                    @handleDateChange="handleDateChange"
                    @backOneMonth="backOneMonth"
                    @forwardOneMonth="forwardOneMonth"
                />
            </v-col>
        </v-row>

        <v-row>
            <v-col cols="12" md="6">
                <v-autocomplete
                    v-model="form.StudentID"
                    label="Siswa"
                    :items="studentList"
                    item-title="Name"
                    item-value="ID"
                    variant="outlined"
                    :rules="[required]"
                    :readonly="type == 'detail'"
                    @update:model-value="generateAcademicReport"
                />
            </v-col>
        </v-row>

        <v-card 
            v-if="form.AcademicReportItems.length > 0"
            class="mb-6 pa-4"
        >
            <v-table
                density="compact"
                class="mb-4" 
            >
                <thead>
                    <th style="width:30px"><p class="font-12">No</p></th>
                    <th style="width:60px"><p class="font-12">Hari</p></th>
                    <th style="width:70px"><p class="font-12">Tanggal</p></th>
                    <th style="width:50px"><p class="font-12">Jam Mulai</p></th>
                    <th style="width:50px"><p class="font-12">Jam Selesai</p></th>
                    <th style="width:50px"><p class="font-12">Mode</p></th>
                    <th style="width:80px"><p class="font-12">Tutor</p></th>
                    <th style="width:80px"><p class="font-12">Mata Pelajaran</p></th>
                    <th style="width:120px"><p class="font-12">Topik</p></th>
                    <th><p class="font-12">Catatan Hasil Pembelajaran</p></th>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in form.AcademicReportItems">
                        <td class="px-0 align-top py-2"><p class="font-12 text-center">{{ index + 1 }}</p></td>
                        <td class="px-0 align-top py-2"><p class="font-12 text-center">{{ days_list.find(day => day.DayOfTheWeek == moment(item.Date).day()).Name }}</p></td>
                        <td class="px-0 align-top py-2"><p class="font-12 text-center">{{ $root.formatDate(item.Date) }}</p></td>
                        <td class="px-0 align-top py-2"><p class="font-12 text-center">{{ $root.formatTime(item.TimeStart) }}</p></td>
                        <td class="px-0 align-top py-2"><p class="font-12 text-center">{{ $root.formatTime(item.TimeEnd) }}</p></td>
                        <td class="px-0 align-top py-2"><p class="font-12 text-center">{{ item.ModeName }}</p></td>
                        <td class="px-0 align-top py-2"><p class="font-12 text-center">{{ item.TutorName }}</p></td>
                        <td class="px-0 align-top py-2"><p class="font-12 text-center">{{ item.SubjectName }}</p></td>
                        <td class="px-0 align-top py-2"><p class="font-12 text-center">{{ item.Topic }}</p></td>
                        <td class="px-1 align-top py-2"><p class="font-12 text-justify">{{ item.Note }}</p></td>
                    </tr>
                </tbody>
            </v-table>
        </v-card>

        <div class="d-flex justify-end">
            <BrkButton
                v-if="type == 'create'"
                buttonText="Batal"
                color="danger"
                @click="showCancelConfirmationDialog = true"
                class="mr-2"
            />
            <BrkButton
                v-if="type == 'detail'"
                buttonText="Kembali"
                color="danger"
                @click="() => $router.push(`/backoffice/laporan/akademik`)"
                class="mr-2"
            />
            <BrkButton
                v-if="type == 'create'"
                buttonText="Submit"
                color="secondary"
                type="submit"
            />
        </div>
        
    </v-form>

    <OptionDialog
        :isOpen="showOptionDialog"
        optionText="Silahkan pilih apakah anda ingin langsung mengirimkan laporan akademik kepada siswa atau menyimpannya sebagai draf"
        opt1="Simpan Sebagai Draf"
        opt2="Kirim"
        @handleCancel="showOptionDialog = false"
        @handleOpt1="saveAcademicReport"
        @handleOpt2="sendAcademicReport"
    />

    <ConfirmationDialog
        :isOpen="showConfirmationDialog"
        :confirmationText="confirmationText"
        @handleCancel="showConfirmationDialog = false"
        @handleOK="submit"
    />

    <ConfirmationDialog
        :isOpen="showCancelConfirmationDialog"
        confirmationText="Anda akan kembali ke halaman laporan akademik. Data tidak akan tersimpan. Lanjutkan?"
        @handleCancel="showCancelConfirmationDialog = false"
        @handleOK="() => $router.push('/backoffice/laporan/akademik')"
    />
</template>

<script>
import academicReportService from "@/services/academic_report/academicReportService.js";
import studentService from "@/services/student/studentService.js";
import BrkDatePicker from "@/components/pages/BrkDatePicker.vue";
import BrkActionButton from "@/components/pages/BrkActionButton.vue";
import BrkTimePicker from "@/components/pages/BrkTimePicker.vue";
import BrkNoData from '@/components/pages/BrkNoData.vue';
import BrkButton from "@/components/pages/BrkButton.vue";
import ConfirmationDialog from "@/components/ConfirmationDialog.vue";
import OptionDialog from "@/components/OptionDialog.vue";
import { required } from '@/utils/app/validator.js';
import setter from '@/utils/app/data-setter.js';
import { days_list } from '@/utils/database-static-records/days.js'

import moment from "moment";

export default{
    props:{
        type:{
            type:String
        }
    },
    emits: ['isLoading'],
    components:{
        BrkDatePicker,
        BrkTimePicker,
        BrkActionButton,
        BrkButton,
        BrkNoData,
        ConfirmationDialog,
        OptionDialog
    },
    data(){
        return{
            validForm:false,
            form:{
                // academic reports model
                StudentID: null,
                GradeID: null,
                School: '',
                ReportDate: null,
                StartDate: null,
                EndDate: null,
                IsDraft: true,
                // academic reports model

                // additional academic report data
                AcademicReportItems: [],
                CreatedByName: null,
                UpdatedByName: null
                // additional academic report data
                
            },

            dateRange: setter.setDateRange({
                mode: setter.constants.DATERANGE_MODE_MONTHLY,
                duration: 1,
                direction: setter.constants.DATERANGE_DIRECTION_THIS_POINT_FORWARD
            }),

            studentList: [],
            

            // static database records related to academic reports
            days_list: days_list,
            // static database records related to academic reports


            // other variables related to form
            userID: JSON.parse(localStorage.getItem('id')),

            showOptionDialog: false,
            showConfirmationDialog: false,
            showCancelConfirmationDialog: false,
            showResetConfirmationDialog: false,
            confirmationText: "",
            moment: moment

            // other variables related to form
        }
    },
    computed: {
        studentID() {
            return this.$route.query.studentID;
        },
        id() {
            return this.$route.params.id;
        },
        startDate() {
            return this.$route.query.startDate;
        },
        endDate() {
            return this.$route.query.endDate;
        }
    },
    created(){
        this.loadData()
    },
    methods:{
        async loadData(){
            this.$emit('isLoading', true)

            if(this.startDate && this.endDate){
                this.dateRange = {
                    startDate: this.startDate,
                    endDate: this.endDate
                }
            }

            await this.loadStudentData()

            if(this.type !== 'create'){
                await this.loadAcademicReportDetail()
            }else{
                await this.generateAcademicReport()
            }
            
            this.$emit('isLoading', false)
        },
        async loadStudentData(){
            try{
                const result = await studentService.getStudentIDAndNameWithoutAcademicReport({
                    startDate: this.dateRange.startDate,
                    endDate: this.dateRange.endDate
                });

                this.studentList = result.data.data;

            }  catch (error) {
                this.$root.showSnackbar(error.response ? error.response.data.message : error.message)
            }
        },
        async loadAcademicReportDetail(){
            try {
                const data = await academicReportService.getAcademicReportDetail(this.id)

                console.log(data)

                if(data.AcademicReportItems.length > 0){
                    this.form = {
                        ...this.form,
                        ...data,
                        ReportDate: this.$root.formatDate(data.ReportDate, "inputDate"),
                        StartDate: this.$root.formatDate(data.StartDate, "inputDate"),
                        EndDate: this.$root.formatDate(data.EndDate, "inputDate")
                    }

                    this.dateRange = {
                        startDate: this.form.StartDate,
                        endDate: this.form.EndDate
                    }
                }

            } catch (error) {
                this.$root.showSnackbar(error.response ? error.response.data.message : error.message)
            }
        },
        async generateAcademicReport(){
            this.form.AcademicReportItems = []

            if(this.studentID){
                this.form.StudentID = JSON.parse(this.studentID)
            }

            if(this.form.StudentID){
                this.$emit('isLoading', true)
                try {
                    const response = await academicReportService.getGeneratedAcademicReportList({
                        startDate: this.dateRange.startDate,
                        endDate: this.dateRange.endDate,
                        studentID: this.form.StudentID,
                    })

                    const _data = response.data.data[0]

                    if(_data){
                        this.form = {
                            ...this.form,
                            ..._data,
                            StudentID: JSON.parse(_data.StudentID)
                        }
                    }

                    console.log(_data)
                    console.log(this.form)

                } catch (error) {
                    this.$root.showSnackbar(error.response ? error.response.data.message : error.message)
                } finally{
                    this.$emit('isLoading', false)
                }
            }
        },
        handleDateChange(value){
            this.dateRange.startDate = this.$root.formatDate(value[0], 'inputDate')
            this.dateRange.endDate = this.$root.formatDate(value[1], 'inputDate')

            if(this.type == 'create'){
                this.resetForm()
                this.loadData()
            }
        },
        async backOneMonth(){
            this.dateRange = setter.backOneMonth(this.dateRange)

            await this.generateAcademicReport()
        },
        async forwardOneMonth(){
            this.dateRange = setter.forwardOneMonth(this.dateRange)

            await this.generateAcademicReport()
        },
        handleSubmit(){
            if(!this.validForm){
                return
            }

            this.form = {
                ...this.form,
                ReportDate: this.type === 'edit' ? this.form.ReportDate : this.$root.formatDate(moment(), "inputDate"),
                StartDate: this.dateRange.startDate,
                EndDate: this.dateRange.endDate
            }

            this.showOptionDialog = true;
        },
        handleCancel(){
            this.showConfirmationDialog = false
        },
        async saveAcademicReport(){
            this.form = {
                ...this.form,
                IsDraft: true,
            }

            this.confirmationText = 'Anda akan menyimpan laporan akademik berikut sebagai draf. Lanjutkan?'
            this.showConfirmationDialog = true
        },
        async sendAcademicReport(){
            this.form = {
                ...this.form,
                IsDraft: false,
            }

            this.confirmationText = 'Anda akan mengirimkan laporan akademik baru. Lanjutkan?'
            this.showConfirmationDialog = true
        },
        async submit(){
            this.$emit('isLoading', true)

            try {
                if(this.type === 'create'){
                    await academicReportService.createAcademicReport(this.form);
                }else{
                    await academicReportService.updateAcademicReport(this.form, this.id);
                }
                
                this.$emit('isLoading', false)
                if(this.form.IsDraft){
                    this.$router.push({ path: '/backoffice/laporan/akademik', query: { tab: 'draft', startDate: this.dateRange.startDate, endDate: this.dateRange.endDate } }).then(() => {
                      window.location.reload();
                    });
                }else{
                    this.$router.push({ path: '/backoffice/laporan/akademik', query: { tab: 'sent', startDate: this.dateRange.startDate, endDate: this.dateRange.endDate } }).then(() => {
                      window.location.reload();
                    });
                }
            } catch (error) {
                console.log(error)
                this.$root.showSnackbar(error.response ? error.response.data.message : error.message);
            } finally {
                this.showConfirmationDialog = false
                this.showOptionDialog = false
                this.$emit('isLoading', false)
            }
        },
        resetForm(){
            this.form = {
                // academic reports model
                StudentID: null,
                GradeID: null,
                School: '',
                ReportDate: null,
                StartDate: null,
                EndDate: null,
                IsDraft: true,
                // academic reports model

                // additional academic report data
                AcademicReportItems: [],
                CreatedByName: null,
                UpdatedByName: null
                // additional academic report data
                
            },

            this.showResetConfirmationDialog = false
        },

        // validator functions

        required
    }
}
</script>

<style lang="scss" scoped>

</style>