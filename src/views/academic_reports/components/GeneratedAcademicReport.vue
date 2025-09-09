<template>
    <v-container v-if="isAuthorized">
        <v-row>
            <v-col cols="12" sm="6" md="5" class="py-0">
                <BrkSearch
                    placeholder="Cari nama siswa ..."
                    @isLoading="() => $emit('isLoading', true)"
                    @handleSearchChange="handleSearchChange"
                />
            </v-col>
        </v-row>

        <v-table
            v-if="generatedAcademicReports.length > 0"
            density="compact"
        >
            <thead>
                <tr>
                    <th>No</th>
                    <th>Siswa</th>
                    <th class="text-center">Jumlah Kelas</th>
                    <th style="width:150px !important"></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(academicReport, index) in generatedAcademicReports">
                    <td>{{ perPage * ( page - 1 ) + index + 1 }}</td>
                    <td>{{ academicReport.StudentName }}</td>
                    <td class="text-center">{{ academicReport.AcademicReportItems.length }}</td>
                    <td class="text-right">
                        <BrkActionButton 
                            :hasEdit="$root.hasAccess('Edit Responsi')"
                            hasSend
                            hasSave
                            @handleEditClick="() => $router.push(`/backoffice/laporan/akademik/create?studentID=${academicReport.StudentID}&startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`)"
                            @handleSendClick="handleSend(academicReport)"
                            @handleSaveClick="handleSave(academicReport)"
                        />
                    </td>
                </tr>
            </tbody>
        </v-table>
        <BrkNoData v-else/>

        <BrkPagination 
            class="ml-n2"
            :initialPage="page"
            :initialPerPage="perPage"
            :paginationInfo="paginationInfo"
            @handlePageChange="handlePageChange"
            @handlePerPageChange="handlePerPageChange"
        />
    </v-container>

    <ConfirmationDialog
        title="Kirim Laporan Akademik"
        :isOpen="showSendConfirmationDialog"
        :confirmationText="sendConfirmationText"
        @handleCancel="showSendConfirmationDialog = false"
        @handleOK="sendAcademicReport"
    />

    <ConfirmationDialog
        title="Simpan Laporan Akademik"
        :isOpen="showSaveConfirmationDialog"
        :confirmationText="saveConfirmationText"
        @handleCancel="showSaveConfirmationDialog = false"
        @handleOK="saveAcademicReport"
    />
</template>

<script>
    import BrkTitle from '@/components/pages/BrkTitle.vue';
    import BrkSearch from '@/components/pages/BrkSearch.vue';
    import BrkPagination from '@/components/pages/BrkPagination.vue';
    import BrkNoData from '@/components/pages/BrkNoData.vue';
    import BrkButton from "@/components/pages/BrkButton.vue";
    import BrkActionButton from '@/components/pages/BrkActionButton.vue';
    import ConfirmationDialog from '@/components/ConfirmationDialog.vue';
    import academicReportService from '@/services/academic_report/academicReportService.js';

    export default {
        emits:['isLoading'],
        components:{
            BrkTitle,
            BrkSearch,
            BrkPagination,
            BrkNoData,
            BrkButton,
            BrkActionButton,
            ConfirmationDialog
        },
        props:{
            dateRange:{
                type:Object
            }
        },
        data(){
            return {
                isAuthorized: false,

                searchText: "",
                page: 1,
                perPage:25,
                generatedAcademicReports: [],
                paginationInfo: {},

                showSendConfirmationDialog: false,
                sendConfirmationText: "",
                showSaveConfirmationDialog: false,
                saveConfirmationText: "",
                selectedAcademicReport: null,
            }
        },
        watch:{
            dateRange(newVal, oldVal){
                this.page = 1
                this.fetchAcademicReportData()
            }
        },
        async created(){
            this.isAuthorized = await this.$root.isAuthorizedToAccess("Laporan Akademik")
            this.loadData()
        },
        methods:{
            async loadData(){
                await this.fetchAcademicReportData()
            },
            async fetchAcademicReportData(){
                this.generatedAcademicReports = []

                this.$emit('isLoading', true)
                try {
                    const response = await academicReportService.getGeneratedAcademicReportList({
                        startDate: this.dateRange.startDate,
                        endDate: this.dateRange.endDate,
                        searchText: this.searchText,
                        page: this.page,
                        perPage: this.perPage
                    })

                    this.generatedAcademicReports = response.data.data
                    this.paginationInfo = response.data.paginationInfo
                } catch (error) {
                    this.$root.showSnackbar(error.response ? error.response.data.message : error.message)
                } finally{
                    this.$emit('isLoading', false)
                }
            },
            handleSend(academicReport){
                this.selectedAcademicReport = this.generatedAcademicReports.find(_academicReport => _academicReport.TutorID === academicReport.TutorID)
                this.selectedAcademicReport.IsDraft = false

                this.showSendConfirmationDialog = true
                this.sendConfirmationText = `Anda akan mengirimkan laporan akademik ke siswa ${academicReport.StudentName}. Lanjutkan?`
            },
            handleSave(academicReport){
                this.selectedAcademicReport = this.generatedAcademicReports.find(_academicReport => _academicReport.TutorID === academicReport.TutorID)
                this.selectedAcademicReport.IsDraft = true

                this.showSaveConfirmationDialog = true
                this.saveConfirmationText = `Anda akan menyimpan laporan akademik siswa ${academicReport.StudentName} sebagai draft. Lanjutkan?`
            },
            async sendAcademicReport(){
                try {
                    const data = await academicReportService.createAcademicReport(this.selectedAcademicReport);
                    
                    this.$emit('isLoading', false)
                    this.$router.push({ path: '/backoffice/laporan/akademik', query: { tab: 'sent', startDate: this.dateRange.startDate, endDate: this.dateRange.endDate } }).then(() => {
                      window.location.reload();
                    });
                } catch (error) {
                    console.log(error)
                    this.$root.showSnackbar(error.response ? error.response.data.message : error.message);
                } finally {
                    this.selectedAcademicReport = null;
                    this.showSendConfirmationDialog = false
                    this.$emit('isLoading', false)
                }
            },
            async saveAcademicReport(){
                try {
                    const data = await academicReportService.createAcademicReport(this.selectedAcademicReport);
                    
                    this.$emit('isLoading', false)
                    this.$router.push({ path: '/backoffice/laporan/akademik', query: { tab: 'draft', startDate: this.dateRange.startDate, endDate: this.dateRange.endDate } }).then(() => {
                      window.location.reload();
                    });
                } catch (error) {
                    console.log(error)
                    this.$root.showSnackbar(error.response ? error.response.data.message : error.message);
                } finally {
                    this.selectedAcademicReport = null;
                    this.showSaveConfirmationDialog = false
                    this.$emit('isLoading', false)
                }
            },
            async handleDateChange(value){
                [this.dateRange.startDate, this.dateRange.endDate] = value
                this.dateRange.startDate = this.$root.formatDate(this.dateRange.startDate, 'inputDate')
                this.dateRange.endDate = this.$root.formatDate(this.dateRange.endDate, 'inputDate')
                this.page = 1
                this.generatedAcademicReports = []
                await this.fetchAcademicReportData()
            },
            async handleSearchChange(searchText){
                this.page = 1
                this.searchText = searchText
                await this.loadData()
            },
            async handlePerPageChange(perPage){
                this.perPage = perPage
                this.page = 1
                await this.loadData()
            },
            async handlePageChange(page){
                this.page = page
                await this.loadData()
            },
            back(){
                this.$router.push("/backoffice/dashboard")
            }
        }
    }
</script>