<template>
    <v-container v-if="isAuthorized" :class="{ 'pa-0': $root.isMobile }">
        <BrkTitle 
            title="Daftar Responsi"
            :useBackButton="true"
            @back="back"
            color="primary"
            :class="{ 'ml-n2': $root.isMobile }"
            class="mb-4"
        />
        
        <v-container :class="{ 'pa-0': $root.isMobile }">
            <v-row class="mx-1 my-1">
                <BrkButton
                    v-if="$root.hasAccess('Tambah Responsi')"
                    buttonText="Tambah Responsi"
                    icon="mdi-plus"
                    color="primary"
                    class="mb-4"
                    @click="() => $router.push('/backoffice/laporan/responsi/create')"
                />
            </v-row>
            <v-row>
                <v-col cols="12" sm="6" md="5" class="py-0">
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
                <v-col cols="12" sm="6" md="5" class="py-0">
                    <BrkSearch
                        placeholder="Cari nama tutor atau siswa ..."
                        @isLoading="() => $emit('isLoading', true)"
                        @handleSearchChange="handleSearchChange"
                    />
                </v-col>
            </v-row>
        </v-container>

        <v-table
            v-if="responseList.length > 0"
            :class="{ 'pa-0': $root.isMobile, 'px-4': !$root.isMobile }"
            density="compact"
            
        >
            <thead>
                <tr>
                    <th>No</th>
                    <th>Hari</th>
                    <th>Tanggal</th>
                    <th>Tutor</th>
                    <th>Siswa</th>
                    <th>Pelajaran</th>
                    <th>Waktu Mulai</th>
                    <th>Waktu Selesai</th>
                    <th>Mode</th>
                    <th style="width:130px !important"></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(response, index) in responseList">
                    <td>{{ perPage * ( page - 1 ) + index + 1 }}</td>
                    <td>{{ $root.formatDay(response.Date) }}</td>
                    <td>{{ $root.formatDate(response.Date) }}</td>
                    <td>{{ response.TutorName }}</td>
                    <td>{{ response.StudentName }}</td>
                    <td>{{ response.SubjectName }}</td>
                    <td>{{ $root.formatTime(response.TimeStart) }}</td>
                    <td>{{ $root.formatTime(response.TimeEnd) }}</td>
                    <td>{{ response.ModeName }}</td>
                    <td class="text-right">
                        <BrkActionButton 
                            :hasDetail="$root.hasAccess('Detail Responsi')"
                            :hasEdit="$root.hasAccess('Edit Responsi')"
                            :hasDelete="$root.hasAccess('Hapus Responsi')"
                            :disableEdit="response.hasAcademicReportItem"
                            :disableDelete="response.hasAcademicReportItem"
                            @handleDetailClick="() => $router.push(`/backoffice/laporan/responsi/${response.ID}`)"
                            @handleEditClick="() => $router.push(`/backoffice/laporan/responsi/edit/${response.ID}`)"
                            @handleDeleteClick="handleDelete(response)"
                        />
                    </td>
                </tr>
            </tbody>
        </v-table>
        <BrkNoData v-else/>


        <BrkPagination 
            :initialPage="page"
            :initialPerPage="perPage"
            :paginationInfo="paginationInfo"
            @handlePageChange="handlePageChange"
            @handlePerPageChange="handlePerPageChange"
        />
    </v-container>

    <ConfirmationDialog
        :isOpen="showDeleteConfirmationDialog"
        :confirmationText="deleteConfirmationText"
        @handleCancel="showDeleteConfirmationDialog = false"
        @handleOK="deleteResponse"
    />
</template>

<script>
    import BrkTitle from '@/components/pages/BrkTitle.vue';
    import BrkDatePicker from '@/components/pages/BrkDatePicker.vue';
    import BrkSearch from '@/components/pages/BrkSearch.vue';
    import BrkPagination from '@/components/pages/BrkPagination.vue';
    import BrkNoData from '@/components/pages/BrkNoData.vue';
    import BrkButton from "@/components/pages/BrkButton.vue";
    import BrkActionButton from '@/components/pages/BrkActionButton.vue';
    import responseService from '@/services/response/responseService.js';
    import setter from '@/utils/app/data-setter.js';
    import ConfirmationDialog from "@/components/ConfirmationDialog.vue";

    export default {
        components:{
            BrkTitle,
            BrkDatePicker,
            BrkSearch,
            BrkPagination,
            BrkNoData,
            BrkButton,
            BrkActionButton,
            ConfirmationDialog
        },
        data(){
            return {
                isAuthorized: false,

                searchText: "",
                dateRange: setter.setDateRange({
                    mode: setter.constants.DATERANGE_MODE_MONTHLY,
                    duration: 1,
                    direction: setter.constants.DATERANGE_DIRECTION_THIS_POINT_FORWARD
                }),
                page: 1,
                perPage: 25,
                responseList: [],
                paginationInfo: {},
                responseToDelete: {},
                showDeleteConfirmationDialog: false,
                deleteConfirmationText: ''
            }
        },
        async created(){
            this.isAuthorized = await this.$root.isAuthorizedToAccess("Responsi")
            this.loadData()
        },
        methods:{
            async loadData(){
                await this.fetchResponseData()
            },
            async fetchResponseData(){
                this.$emit('isLoading', true)
                try {
                    const response = await responseService.getResponseList({
                        startDate: this.dateRange.startDate,
                        endDate: this.dateRange.endDate,
                        searchText: this.searchText,
                        page: this.page,
                        perPage: this.perPage
                    })

                    this.responseList = response.data.data
                    this.paginationInfo = response.data.paginationInfo

                    console.log(this.responseList)
                } catch (error) {
                    this.$root.showSnackbar(error.response ? error.response.data.message : error.message)
                } finally{
                    this.$emit('isLoading', false)
                }
            },
            handleDelete(response){
                this.responseToDelete = response
                
                this.deleteConfirmationText = `Anda akan menghapus responsi pada tanggal ${this.$root.formatDate(response.Date, 'longDate')} oleh tutor ${response.TutorName} dengan siswa ${response.StudentName}. Lanjutkan?`

                this.showDeleteConfirmationDialog = true;
            },
            async deleteResponse(){
                this.$emit('isLoading', true)
                try {
                    await responseService.deleteReport(this.responseToDelete.ID)
                } catch (error) {
                    this.$root.showSnackbar(error.response ? error.response.data.message : error.message)
                } finally{
                    this.$emit('isLoading', false)
                    this.showDeleteConfirmationDialog = false

                    await this.loadData()
                }
            },
            async handleDateChange(value){
                [this.dateRange.startDate, this.dateRange.endDate] = value
                this.dateRange.startDate = this.$root.formatDate(this.dateRange.startDate, 'inputDate')
                this.dateRange.endDate = this.$root.formatDate(this.dateRange.endDate, 'inputDate')
                this.page = 1
                this.responseList = []
                await this.fetchResponseData()
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
            async backOneMonth(){
                this.dateRange = setter.backOneMonth(this.dateRange)
                this.page = 1
                await this.loadData()
            },
            async forwardOneMonth(){
                this.dateRange = setter.forwardOneMonth(this.dateRange)

                this.page = 1
                await this.loadData()
            },
            back(){
                this.$router.push("/backoffice/dashboard")
            }
        }
    }
</script>