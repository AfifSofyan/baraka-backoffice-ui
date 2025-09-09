<template>
    <v-container v-if="isAuthorized" :class="{ 'pa-0': $root.isMobile }">
        <BrkTitle 
            title="Log Perubahan Data Akademik"
            :useBackButton="true"
            @back="back"
            color="primary"
            :class="{ 'ml-n2': $root.isMobile }"
            class="mb-4"
        />
        
        <v-container :class="{ 'pa-0': $root.isMobile }">
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
                        placeholder="Cari nama tutor ..."
                        @isLoading="() => $emit('isLoading', true)"
                        @handleSearchChange="handleSearchChange"
                    />
                </v-col>
            </v-row>
        </v-container>

        <v-data-table 
            v-if="dataList.length > 0"
            :headers="[
                {title:'#ID', value:'ReportID'},
                {title:'Tutor', value:'TutorName'},
                {title:'Tanggal Submit', value:'Date'},
            ]"
            :items="dataList"
            item-key="ReportID"
            hide-default-footer
            
        >

        </v-data-table>

        <!-- <v-table
            v-if="dataList.length > 0"
            :class="{ 'pa-0': $root.isMobile, 'px-4': !$root.isMobile }"
            density="compact"
            
        >
            <thead>
                <tr>
                    <th>No</th>
                    <th>Tanggal Responsi</th>
                    <th>Tutor</th>
                    <th>Perubahan Data</th>
                    <th style="width:130px !important"></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(data, index) in dataList">
                    <td>{{ perPage * ( page - 1 ) + index + 1 }}</td>
                    <td>{{ $root.formatDate(data.Date) }}</td>
                    <td>{{ data.TutorName }}</td>
                    <td>{{  }}</td>
                    <td class="text-right">
                        <BrkActionButton 
                            hasDetail
                            @handleDetailClick="() => $router.push(`/backoffice/laporan/changelogs/${data.ID}`)"
                        />
                    </td>
                </tr>
            </tbody>
        </v-table> -->
        <BrkNoData v-else/>


        <BrkPagination 
            :initialPage="page"
            :initialPerPage="perPage"
            :paginationInfo="paginationInfo"
            @handlePageChange="handlePageChange"
            @handlePerPageChange="handlePerPageChange"
        />
    </v-container>

    <!-- <ConfirmationDialog
        :isOpen="showDeleteConfirmationDialog"
        :confirmationText="deleteConfirmationText"
        @handleCancel="showDeleteConfirmationDialog = false"
        @handleOK="deleteResponse"
    /> -->
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
    import reportChangeLogService from '@/services/report_change_log/reportChangeLogService.js';
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
                dataList: [],
                paginationInfo: {},
                responseToDelete: {},
                showDeleteConfirmationDialog: false,
                deleteConfirmationText: ''
            }
        },
        async created(){
            this.isAuthorized = await this.$root.isAuthorizedToAccess("Log Perubahan")
            this.loadData()
        },
        methods:{
            async loadData(){
                await this.fetchReportChangeLogsData()
            },
            async fetchReportChangeLogsData(){
                this.$emit('isLoading', true)
                try {
                    const changeLogs = await reportChangeLogService.getReportChangeLogList({
                        startDate: this.dateRange.startDate,
                        endDate: this.dateRange.endDate,
                        searchText: this.searchText,
                        page: this.page,
                        perPage: this.perPage
                    })

                    this.dataList = changeLogs.data.data
                    this.paginationInfo = changeLogs.data.paginationInfo

                    console.log(this.dataList)
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