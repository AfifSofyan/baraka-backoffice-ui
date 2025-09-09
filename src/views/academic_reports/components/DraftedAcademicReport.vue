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
            v-if="draftedAcademicReports.length > 0"
            density="compact"
        >
            <thead>
                <tr>
                    <th>No</th>
                    <th class="text-center">Tanggal</th>
                    <th>Siswa</th>
                    <th class="text-center">Jumlah Pertemuan</th>
                    <th style="width:130px !important"></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(academicReport, index) in draftedAcademicReports">
                    <td class="align-top pt-2">{{ perPage * ( page - 1 ) + index + 1 }}</td>
                    <td class="align-top pt-2 text-center">{{ $root.formatDate(academicReport.ReportDate) }}</td>
                    <td class="align-top pt-2">{{ academicReport.StudentName }}</td>
                    <td class="text-center align-top pt-2">{{ academicReport.AcademicReportItems.length }}</td>
                    <td class="text-right align-top pt-2">
                        <BrkActionButton 
                            hasDetail
                            hasSend
                            hasDelete
                            @handleDetailClick="() => $router.push(`/backoffice/laporan/akademik/detail/${academicReport.ID}`)"
                            @handleSendClick="handleSend(academicReport)"
                            @handleDeleteClick="handleDelete(academicReport)"
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
        title="Hapus Laporan Akademik"
        :isOpen="showDeleteConfirmationDialog"
        :confirmationText="deleteConfirmationText"
        @handleCancel="showDeleteConfirmationDialog = false"
        @handleOK="deleteAcademicReport"
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
        emits: ['isLoading'],
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
                perPage: 25,
                selectedAcademicReport: null,
                draftedAcademicReports: [],
                paginationInfo: {},

                showSendConfirmationDialog: false,
                sendConfirmationText: "",
                showDeleteConfirmationDialog: false,
                deleteConfirmationText: "",
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
                this.draftedAcademicReports = []

                this.$emit('isLoading', true)
                try {
                    const response = await academicReportService.getAcademicReportsDraft({
                        startDate: this.dateRange.startDate,
                        endDate: this.dateRange.endDate,
                        searchText: this.searchText,
                        page: this.page,
                        perPage: this.perPage
                    })

                    const _draftedAcademicReports = response.data.data

                    this.draftedAcademicReports = _draftedAcademicReports.map( academicReport => {
                        return {
                            ...academicReport,
                            ReportDate: this.$root.formatDate(academicReport.ReportDate, "inputDate"),
                            StartDate: this.$root.formatDate(academicReport.StartDate, "inputDate"),
                            EndDate: this.$root.formatDate(academicReport.EndDate, "inputDate"),
                        }
                    })
                    this.paginationInfo = response.data.paginationInfo
                } catch (error) {
                    this.$root.showSnackbar(error.response ? error.response.data.message : error.message)
                } finally{
                    this.$emit('isLoading', false)
                }
            },
            handleSend(academicReport){
                this.selectedAcademicReport = this.draftedAcademicReports.find(_academicReport => _academicReport.StudentID === academicReport.StudentID)
                this.selectedAcademicReport.IsDraft = false
                this.selectedAcademicReport.ReportDate = this.$root.formatDate(new Date(), "inputDate")

                this.showSendConfirmationDialog = true
                this.sendConfirmationText = `Anda akan mengirimkan laporan akademik siswa ${this.selectedAcademicReport.StudentName}. Tanggal laporan akademik akan disunting menjadi tanggal hari ini. Lanjutkan?`
            },
            handleDelete(academicReport){
                this.selectedAcademicReport = this.draftedAcademicReports.find(_academicReport => _academicReport.StudentID === academicReport.StudentID)

                this.showDeleteConfirmationDialog = true
                this.deleteConfirmationText = `Anda akan menghapus laporan akademik siswa ${academicReport.StudentName} dari draft. Anda masih akan menemukan data tersebut yang digenerate otomatis pada tab "BELUM DIPROSES" dan dapat menyuntingnya kembali. Lanjutkan?`
            },
            async sendAcademicReport(){
                try {
                    const data = await academicReportService.updateAcademicReport(this.selectedAcademicReport, this.selectedAcademicReport.ID)
                    
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
            async deleteAcademicReport(){
                try {
                    const data = await academicReportService.deleteAcademicReport(this.selectedAcademicReport.ID)
                    
                    this.$emit('isLoading', false)
                    this.$router.push({ path: '/backoffice/laporan/akademik', query: { tab: 'raw', startDate: this.dateRange.startDate, endDate: this.dateRange.endDate } }).then(() => {
                      window.location.reload();
                    });
                } catch (error) {
                    console.log(error)
                    this.$root.showSnackbar(error.response ? error.response.data.message : error.message);
                } finally {
                    this.selectedAcademicReport = null;
                    this.showDeleteConfirmationDialog = false
                    this.$emit('isLoading', false)
                }
            },
            async handleDateChange(value){
                [this.dateRange.startDate, this.dateRange.endDate] = value
                this.dateRange.startDate = this.$root.formatDate(this.dateRange.startDate, 'inputDate')
                this.dateRange.endDate = this.$root.formatDate(this.dateRange.endDate, 'inputDate')
                this.page = 1
                this.draftedAcademicReports = []
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