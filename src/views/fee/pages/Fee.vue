<template>

    <!-- <UnderConstruction /> -->

    <BrkTitle 
        title="Fee Tutor"
        color="primary"
        class="mb-2"
    />
    <v-container v-if="roleName == 'superadmin'">
        <v-row class="mt-6 mb-4">
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
            <v-col cols="12" sm="5" md="4" class="py-0">
                <BrkButton
                    buttonText="Tambah Baru"
                    prepend-icon="mdi-plus"
                    color="primary"
                    @click="$router.push('/backoffice/fee/create')"
                    class="mr-2"
                />
            </v-col>
        </v-row>
        <v-tabs
            v-model="tab"
            color="secondary"
            align-tabs="start"
        >
            <v-tab value="raw">Belum Diproses</v-tab>
            <v-tab value="draft">Tersimpan</v-tab>
            <v-tab value="sent">Terkirim</v-tab>
        </v-tabs>
        <v-window v-model="tab">
            <v-window-item value="raw" class="py-8">
                <GeneratedFee 
                    ref="generated_fee"
                    :date-range="dateRange"
                    @isLoading="(state) => $emit('isLoading', state)"
                />
            </v-window-item>
            <v-window-item value="draft" class="py-8">
                <DraftedFee
                    ref="drafted_fee"
                    :date-range="dateRange"
                    @isLoading="(state) => $emit('isLoading', state)"
                />
            </v-window-item>
            <v-window-item value="sent" class="py-8">
                <SentFee 
                    ref="sent_fee"
                    :date-range="dateRange"
                    @isLoading="(state) => $emit('isLoading', state)"
                />
            </v-window-item>
        </v-window>
    </v-container>

    <v-container v-if="roleName == 'tutor'">
        <v-table
            v-if="feeList.length > 0"
            density="compact"
            class="px-4"
        >
            <thead>
                <tr>
                    <th>No</th>
                    <th>Nomor Fee</th>
                    <th class="text-center">Tanggal Fee</th>
                    <th class="text-right">Total Biaya</th>
                    <th style="width:110px !important"></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(fee, index) in feeList">
                    <td class="align-top pt-2">{{ perPage * ( page - 1 ) + index + 1 }}</td>
                    <td class="align-top pt-2">{{ fee.FeeCode }}</td>
                    <td class="align-top pt-2 text-center">{{ $root.formatDate(fee.FeeDate) }}</td>
                    <td class="text-right align-top pt-2">{{ $root.formatRupiah(fee.Total) }}</td>
                    <td class="text-right align-top pt-2">
                        <BrkActionButton 
                            hasDetail
                            @handleDetailClick="openFeeDocument(fee.UniquePath)"
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
</template>

<script>
import BrkTitle from '@/components/pages/BrkTitle.vue';
import BrkDatePicker from '@/components/pages/BrkDatePicker.vue';
import BrkPagination from '@/components/pages/BrkPagination.vue';
import BrkActionButton from '@/components/pages/BrkActionButton.vue';
import BrkNoData from '@/components/pages/BrkNoData.vue';
import BrkButton from '@/components/pages/BrkButton.vue';
import UnderConstruction from '@/components/UnderConstruction.vue'
import { role_list } from '@/utils/database-static-records/roles';
import GeneratedFee from '../components/GeneratedFee.vue';
import DraftedFee from '../components/DraftedFee.vue';
import SentFee from '../components/SentFee.vue';
import setter from '@/utils/app/data-setter.js';
import feeService from '@/services/fee/feeService';

export default{
    emits: ['isLoading'],
    components:{
        BrkTitle,
        BrkDatePicker,
        BrkPagination,
        BrkActionButton,
        BrkNoData,
        BrkButton,
        UnderConstruction,
        GeneratedFee,
        DraftedFee,
        SentFee
    },
    data(){
        return {
            isAuthorized: false,
            roleID: JSON.parse(localStorage.getItem('roleID')),
            roleName: JSON.parse(localStorage.getItem('roleName')),
            roleList: role_list,
            tab: null,

            page: 1,
            perPage: 10,
            dateRange: setter.setDateRange({
                mode: setter.constants.DATERANGE_MODE_MONTHLY,
                duration: 1,
                direction: setter.constants.DATERANGE_DIRECTION_THIS_POINT_FORWARD
            }),

            // to use when roleName is student
            userID: JSON.parse(localStorage.getItem('id')),
            feeList: [],
            paginationInfo: {},
            // to use when roleName is student
        }
    },
    computed:{
        selectedTab() {
            return this.$route.query.tab;
        },
        startDate() {
            return this.$route.query.startDate;
        },
        endDate() {
            return this.$route.query.endDate;
        }
    },
    async created(){
        this.isAuthorized = await this.$root.isAuthorizedToAccess("Fee Tutor")

        if(this.startDate && this.endDate){
            this.dateRange = {
                startDate: this.startDate,
                endDate: this.endDate
            }
        }

        if(this.roleName === 'superadmin'){
            this.tab = this.selectedTab ?? 'raw'
        }else if(this.roleName === 'tutor'){
            await this.fetchFeeData()
        }
    },
    methods:{
        async fetchFeeData(){
            this.feeList = []

            this.$emit('isLoading', true)
            try {
                const response = await feeService.getSentFees({
                    userID: this.userID,
                    page: this.page,
                    perPage: this.perPage
                })

                console.log(response)

                const _feeList = response.data.data

                this.feeList = _feeList.map( fee => {
                    return {
                        ...fee,
                        InvoiceDate: this.$root.formatDate(fee.InvoiceDate, "inputDate"),
                        StartDate: this.$root.formatDate(fee.StartDate, "inputDate"),
                        EndDate: this.$root.formatDate(fee.EndDate, "inputDate"),
                    }
                })
                this.paginationInfo = response.data.paginationInfo
            } catch (error) {
                this.$root.showSnackbar(error.response ? error.response.data.message : error.message)
            } finally{
                this.$emit('isLoading', false)
            }
        },
        async handleDateChange(value){
            this.dateRange.startDate = this.$root.formatDate(value[0], 'inputDate')
            this.dateRange.endDate = this.$root.formatDate(value[1], 'inputDate')
            this.page = 1

            if(this.roleName === 'student'){
                await this.fetchFeeData()
            }
        },
        async backOneMonth(){
            this.dateRange = setter.backOneMonth(this.dateRange)
        },
        async forwardOneMonth(){
            this.dateRange = setter.forwardOneMonth(this.dateRange)
        },
        async handlePerPageChange(perPage){
            this.perPage = perPage
            this.page = 1
            await this.fetchFeeData()
        },
        async handlePageChange(page){
            this.page = page
            await this.fetchFeeData()
        },
        openFeeDocument(uniquePath) {
            const routeUrl = this.$router.resolve({ path: `/document/fee/${uniquePath}` }).href;
            window.open(routeUrl, '_blank');
        }
    }
}
</script>