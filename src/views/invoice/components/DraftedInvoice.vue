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
            v-if="draftedInvoices.length > 0"
            density="compact"
        >
            <thead>
                <tr>
                    <th>No</th>
                    <th>Nomor Invoice</th>
                    <th class="text-center">Tanggal Invoice</th>
                    <th>Siswa</th>
                    <th class="text-right">Total Biaya</th>
                    <th style="width:130px !important"></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(invoice, index) in draftedInvoices">
                    <td class="align-top pt-2">{{ perPage * ( page - 1 ) + index + 1 }}</td>
                    <td class="align-top pt-2">{{ invoice.InvoiceCode }}</td>
                    <td class="align-top pt-2 text-center">{{ $root.formatDate(invoice.InvoiceDate) }}</td>
                    <td class="align-top pt-2">
                        <p v-for="student in invoice.InvoiceStudents" class="mb-2">
                            {{ student.StudentName }}
                        </p>
                    </td>
                    <td class="text-right align-top pt-2">{{ $root.formatRupiah(invoice.Total) }}</td>
                    <td class="text-right align-top pt-2">
                        <BrkActionButton 
                            hasEdit
                            hasSend
                            hasDelete
                            @handleEditClick="() => $router.push(`/backoffice/invoice/edit/${invoice.ID}?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`)"
                            @handleSendClick="handleSend(invoice)"
                            @handleDeleteClick="handleDelete(invoice)"
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
        title="Kirim Invoice"
        :isOpen="showSendConfirmationDialog"
        :confirmationText="sendConfirmationText"
        @handleCancel="showSendConfirmationDialog = false"
        @handleOK="sendInvoice"
    />

    <ConfirmationDialog
        title="Hapus Invoice"
        :isOpen="showDeleteConfirmationDialog"
        :confirmationText="deleteConfirmationText"
        @handleCancel="showDeleteConfirmationDialog = false"
        @handleOK="deleteInvoice"
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
    import invoiceService from '@/services/invoice/invoiceService.js';
    import { grade_list } from '@/utils/database-static-records/grades';

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
                selectedInvoice: null,
                draftedInvoices: [],
                paginationInfo: {},

                grade_list: grade_list,

                showSendConfirmationDialog: false,
                sendConfirmationText: "",
                showDeleteConfirmationDialog: false,
                deleteConfirmationText: "",
            }
        },
        watch:{
            dateRange(newVal, oldVal){
                this.page = 1
                this.fetchInvoiceData()
            }
        },
        async created(){
            this.isAuthorized = await this.$root.isAuthorizedToAccess("Invoice")
            this.loadData()
        },
        methods:{
            async loadData(){
                await this.fetchInvoiceData()
            },
            async fetchInvoiceData(){
                this.draftedInvoices = []

                this.$emit('isLoading', true)
                try {
                    const response = await invoiceService.getInvoicesDraft({
                        startDate: this.dateRange.startDate,
                        endDate: this.dateRange.endDate,
                        searchText: this.searchText,
                        page: this.page,
                        perPage: this.perPage
                    })

                    const _draftedInvoices = response.data.data

                    this.draftedInvoices = _draftedInvoices.map( invoice => {
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
            handleSend(invoice){
                this.selectedInvoice = this.draftedInvoices.find(_invoice => _invoice.InvoiceStudents[0].StudentID === invoice.InvoiceStudents[0].StudentID)
                this.selectedInvoice.IsDraft = false
                this.selectedInvoice.InvoiceDate = this.$root.formatDate(new Date(), "inputDate")

                this.showSendConfirmationDialog = true
                this.sendConfirmationText = `Anda akan mengirimkan invoice dengan nomor ${invoice.InvoiceCode}. Tanggal invoice akan disunting menjadi tanggal hari ini. Lanjutkan?`
            },
            handleDelete(invoice){
                this.selectedInvoice = this.draftedInvoices.find(_invoice => _invoice.InvoiceStudents[0].StudentID === invoice.InvoiceStudents[0].StudentID)

                this.showDeleteConfirmationDialog = true
                this.deleteConfirmationText = `Anda akan menghapus invoice dengan nomor ${invoice.InvoiceCode} dari draft. Anda masih akan menemukan data tersebut yang digenerate otomatis pada tab "BELUM DIPROSES" dan dapat menyuntingnya kembali. Lanjutkan?`
            },
            async sendInvoice(){
                try {
                    const data = await invoiceService.updateInvoice(this.selectedInvoice, this.selectedInvoice.ID)
                    
                    this.$emit('isLoading', false)
                    this.$router.push({ path: '/backoffice/invoice', query: { tab: 'sent', startDate: this.dateRange.startDate, endDate: this.dateRange.endDate } }).then(() => {
                      window.location.reload();
                    });
                } catch (error) {
                    console.log(error)
                    this.$root.showSnackbar(error.response ? error.response.data.message : error.message);
                } finally {
                    this.selectedInvoice = null;
                    this.showSendConfirmationDialog = false
                    this.$emit('isLoading', false)
                }
            },
            async deleteInvoice(){
                try {
                    const data = await invoiceService.deleteInvoice(this.selectedInvoice.ID)
                    
                    this.$emit('isLoading', false)
                    this.$router.push({ path: '/backoffice/invoice', query: { tab: 'raw', startDate: this.dateRange.startDate, endDate: this.dateRange.endDate } }).then(() => {
                      window.location.reload();
                    });
                } catch (error) {
                    console.log(error)
                    this.$root.showSnackbar(error.response ? error.response.data.message : error.message);
                } finally {
                    this.selectedInvoice = null;
                    this.showDeleteConfirmationDialog = false
                    this.$emit('isLoading', false)
                }
            },
            async handleDateChange(value){
                [this.dateRange.startDate, this.dateRange.endDate] = value
                this.dateRange.startDate = this.$root.formatDate(this.dateRange.startDate, 'inputDate')
                this.dateRange.endDate = this.$root.formatDate(this.dateRange.endDate, 'inputDate')
                this.page = 1
                this.draftedInvoices = []
                await this.fetchInvoiceData()
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