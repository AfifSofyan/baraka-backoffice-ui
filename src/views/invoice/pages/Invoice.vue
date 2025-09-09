<template>

    <!-- <UnderConstruction /> -->

    <BrkTitle 
        title="Invoice"
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
                    @click="$router.push('/backoffice/invoice/create')"
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
                <GeneratedInvoice 
                    ref="generated_invoice"
                    :date-range="dateRange"
                    @isLoading="(state) => $emit('isLoading', state)"
                />
            </v-window-item>
            <v-window-item value="draft" class="py-8">
                <DraftedInvoice 
                    ref="drafted_invoice"
                    :date-range="dateRange"
                    @isLoading="(state) => $emit('isLoading', state)"
                />
            </v-window-item>
            <v-window-item value="sent" class="py-8">
                <SentInvoice 
                    ref="sent_invoice"
                    :date-range="dateRange"
                    @isLoading="(state) => $emit('isLoading', state)"
                />
            </v-window-item>
        </v-window>
    </v-container>

    <v-container v-if="roleName == 'student'">
        <v-table
            v-if="invoiceList.length > 0"
            density="compact"
            class="px-4"
        >
            <thead>
                <tr>
                    <th>No</th>
                    <th>Nomor Invoice</th>
                    <th class="text-center">Tanggal Invoice</th>
                    <th class="text-right">Total Biaya</th>
                    <th style="width:110px !important"></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(invoice, index) in invoiceList">
                    <td class="align-top pt-2">{{ perPage * ( page - 1 ) + index + 1 }}</td>
                    <td class="align-top pt-2">{{ invoice.InvoiceCode }}</td>
                    <td class="align-top pt-2 text-center">{{ $root.formatDate(invoice.InvoiceDate) }}</td>
                    <td class="text-right align-top pt-2">{{ $root.formatRupiah(invoice.Total) }}</td>
                    <td class="text-right align-top pt-2">
                        <BrkActionButton 
                            hasDetail
                            hasDownload
                            @handleDetailClick="openInvoiceDocument(invoice.UniquePath)"
                            @handleDownloadClick="downloadInvoiceDocument(invoice.UniquePath)"
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
import GeneratedInvoice from '../components/GeneratedInvoice.vue';
import DraftedInvoice from '../components/DraftedInvoice.vue';
import SentInvoice from '../components/SentInvoice.vue';
import setter from '@/utils/app/data-setter.js';
import invoiceService from '@/services/invoice/invoiceService';

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
        GeneratedInvoice,
        DraftedInvoice,
        SentInvoice
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
            invoiceList: [],
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
        this.isAuthorized = await this.$root.isAuthorizedToAccess("Invoice")

        if(this.startDate && this.endDate){
            this.dateRange = {
                startDate: this.startDate,
                endDate: this.endDate
            }
        }

        if(this.roleName === 'superadmin'){
            this.tab = this.selectedTab ?? 'raw'
        }else if(this.roleName === 'student'){
            await this.fetchInvoiceData()
        }
    },
    methods:{
        async fetchInvoiceData(){
            this.invoiceList = []

            this.$emit('isLoading', true)
            try {
                const response = await invoiceService.getSentInvoices({
                    userID: this.userID,
                    page: this.page,
                    perPage: this.perPage
                })

                const _invoiceList = response.data.data

                this.invoiceList = _invoiceList.map( invoice => {
                    return {
                        ...invoice,
                        InvoiceDate: this.$root.formatDate(invoice.InvoiceDate, "inputDate"),
                        StartDate: this.$root.formatDate(invoice.StartDate, "inputDate"),
                        EndDate: this.$root.formatDate(invoice.EndDate, "inputDate"),
                    }
                })
                this.paginationInfo = response.data.paginationInfo
            } catch (error) {
                this.$root.showSnackbar(error.response ? error.response.data.message : error.message)
            } finally{
                this.$emit('isLoading', false)
            }
        },
        handleDateChange(value){
            this.dateRange.startDate = this.$root.formatDate(value[0], 'inputDate')
            this.dateRange.endDate = this.$root.formatDate(value[1], 'inputDate')
            this.page = 1
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
            await this.fetchInvoiceData()
        },
        async handlePageChange(page){
            this.page = page
            await this.fetchInvoiceData()
        },
        openInvoiceDocument(uniquePath) {
            const routeUrl = this.$router.resolve({ path: `/document/invoice/${uniquePath}` }).href;
            window.open(routeUrl, '_blank');
        },
        downloadInvoiceDocument(uniquePath) {
            const routeUrl = this.$router.resolve({ path: `/document/invoice/${uniquePath}`, query: { download: true} }).href;
            window.open(routeUrl, '_blank');
        }
    }
}
</script>