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
            v-if="sentAcademicReports.length > 0"
            density="compact"
        >
            <thead>
                <tr>
                    <th>No</th>
                    <th class="text-center">Tanggal</th>
                    <th>Siswa</th>
                    <th class="text-center">Jumlah Pertemuan</th>
                    <th style="width:180px !important"></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(academicReport, index) in sentAcademicReports">
                    <td class="align-top pt-2">{{ perPage * ( page - 1 ) + index + 1 }}</td>
                    <td class="align-top pt-2 text-center">{{ $root.formatDate(academicReport.ReportDate) }}</td>
                    <td class="align-top pt-2">{{ academicReport.StudentName }}</td>
                    <td class="text-center align-top pt-2">{{ academicReport.AcademicReportItems.length }}</td>
                    <td class="text-right align-top pt-2">
                        <BrkActionButton 
                            hasUnsend
                            hasDownload
                            hasCopy
                            hasDelete
                            @handleUnsendClick="handleUnsend(academicReport)"
                            @handleDownloadClick="handleDownload(academicReport)"
                            @handleCopyClick="handleCopy(academicReport)"
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
        :isOpen="showUnsendConfirmationDialog"
        :confirmationText="unsendConfirmationText"
        @handleCancel="showUnsendConfirmationDialog = false"
        @handleOK="unsendAcademicReport"
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
                sentAcademicReports: [],
                paginationInfo: {},

                showUnsendConfirmationDialog: false,
                unsendConfirmationText: "",
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
                this.sentAcademicReports = []

                this.$emit('isLoading', true)
                try {
                    const response = await academicReportService.getSentAcademicReports({
                        startDate: this.dateRange.startDate,
                        endDate: this.dateRange.endDate,
                        searchText: this.searchText,
                        page: this.page,
                        perPage: this.perPage
                    })

                    const _sentAcademicReports = response.data.data

                    this.sentAcademicReports = _sentAcademicReports.map( academicReport => {
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
            handleUnsend(academicReport){
                this.selectedAcademicReport = this.sentAcademicReports.find(_academicReport => _academicReport.StudentID === academicReport.StudentID)
                this.selectedAcademicReport.IsDraft = true

                this.showUnsendConfirmationDialog = true
                this.unsendConfirmationText = `Anda akan membatalkan pengiriman laporan akademik siswa ${academicReport.StudentName}. Laporan akademik akan kembali disimpan sebagai draft. Lanjutkan?`
            },
            handleCopy(academicReport){
                const urlToCopy = `https://app.barakaeducation.com/document/laporan/akademik/${academicReport.UniquePath}`
                navigator.clipboard.writeText(urlToCopy)

                this.$root.showSnackbar(`Berhasil menyalin tautan dokumen laporan akademik ${urlToCopy}`)
            },
            handleDownload(academicReport){
                const routeUrl = this.$router.resolve({ path: `/document/laporan/akademik/${academicReport.UniquePath}` }).href;
                window.open(routeUrl, '_blank');
            },
            handleDelete(academicReport){
                this.selectedAcademicReport = this.sentAcademicReports.find(_academicReport => _academicReport.StudentID === academicReport.StudentID)

                this.showDeleteConfirmationDialog = true
                this.deleteConfirmationText = `Anda akan menghapus laporan akademik siswa ${academicReport.StudentName} dari draft. Anda masih akan menemukan data tersebut yang digenerate otomatis pada tab "BELUM DIPROSES" dan dapat menyuntingnya kembali. Lanjutkan?`
            },
            async unsendAcademicReport(){
                try {
                    const data = await academicReportService.updateAcademicReport(this.selectedAcademicReport, this.selectedAcademicReport.ID)
                    
                    this.$emit('isLoading', false)
                    this.$router.push({ path: '/backoffice/laporan/akademik', query: { tab: 'draft', startDate: this.dateRange.startDate, endDate: this.dateRange.endDate } }).then(() => {
                      window.location.reload();
                    });
                } catch (error) {
                    console.log(error)
                    this.$root.showSnackbar(error.response ? error.response.data.message : error.message);
                } finally {
                    this.selectedAcademicReport = null;
                    this.showUnsendConfirmationDialog = false
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
                this.sentAcademicReports = []
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