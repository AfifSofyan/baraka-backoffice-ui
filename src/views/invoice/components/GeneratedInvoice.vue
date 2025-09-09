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
            v-if="generatedInvoices.length > 0"
            density="compact"
        >
            <thead>
                <tr>
                    <th>No</th>
                    <th>Siswa</th>
                    <th>Kelas</th>
                    <th>Sekolah</th>
                    <th>Total Biaya</th>
                    <th style="width:150px !important"></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(invoice, index) in generatedInvoices">
                    <td>{{ perPage * ( page - 1 ) + index + 1 }}</td>
                    <td>{{ invoice.InvoiceStudents[0].StudentName }}</td>
                    <td>{{ grade_list.find(grade => grade.ID === invoice.InvoiceStudents[0].GradeID).Name }}</td>
                    <td>{{ invoice.InvoiceStudents[0].School }}</td>
                    <td>{{ $root.formatRupiah(invoice.Total) }}</td>
                    <td class="text-right">
                        <BrkActionButton 
                            :hasEdit="$root.hasAccess('Edit Responsi')"
                            hasSend
                            hasSave
                            @handleEditClick="() => $router.push(`/backoffice/invoice/create?studentID=${invoice.InvoiceStudents[0].StudentID}&startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`)"
                            @handleSendClick="handleSend(invoice)"
                            @handleSaveClick="handleSave(invoice)"
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
        title="Simpan Invoice"
        :isOpen="showSaveConfirmationDialog"
        :confirmationText="saveConfirmationText"
        @handleCancel="showSaveConfirmationDialog = false"
        @handleOK="saveInvoice"
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
                generatedInvoices: [],
                paginationInfo: {},

                grade_list: grade_list,

                showSendConfirmationDialog: false,
                sendConfirmationText: "",
                showSaveConfirmationDialog: false,
                saveConfirmationText: "",
                selectedInvoice: null,
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
                this.generatedInvoices = []

                this.$emit('isLoading', true)
                try {
                    const response = await invoiceService.getGeneratedInvoiceList({
                        startDate: this.dateRange.startDate,
                        endDate: this.dateRange.endDate,
                        searchText: this.searchText,
                        page: this.page,
                        perPage: this.perPage
                    })

                    console.log(response)

                    this.generatedInvoices = response.data.data
                    this.paginationInfo = response.data.paginationInfo
                } catch (error) {
                    this.$root.showSnackbar(error.response ? error.response.data.message : error.message)
                } finally{
                    this.$emit('isLoading', false)
                }
            },
            handleSend(invoice){
                this.selectedInvoice = this.generatedInvoices.find(_invoice => _invoice.InvoiceStudents[0].StudentID === invoice.InvoiceStudents[0].StudentID)
                this.selectedInvoice.IsDraft = false

                this.showSendConfirmationDialog = true
                this.sendConfirmationText = `Anda akan mengirimkan invoice ke siswa ${invoice.InvoiceStudents[0].StudentName}. Lanjutkan?`
            },
            handleSave(invoice){
                this.selectedInvoice = this.generatedInvoices.find(_invoice => _invoice.InvoiceStudents[0].StudentID === invoice.InvoiceStudents[0].StudentID)
                this.selectedInvoice.IsDraft = true

                this.showSaveConfirmationDialog = true
                this.saveConfirmationText = `Anda akan menyimpan invoice siswa ${invoice.InvoiceStudents[0].StudentName} sebagai draft. Lanjutkan?`
            },
            async sendInvoice(){
                try {
                    const data = await invoiceService.createInvoice(this.selectedInvoice);
                    
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
            async saveInvoice(){
                try {
                    const data = await invoiceService.createInvoice(this.selectedInvoice);
                    
                    this.$emit('isLoading', false)
                    this.$router.push({ path: '/backoffice/invoice', query: { tab: 'draft', startDate: this.dateRange.startDate, endDate: this.dateRange.endDate } }).then(() => {
                      window.location.reload();
                    });
                } catch (error) {
                    console.log(error)
                    this.$root.showSnackbar(error.response ? error.response.data.message : error.message);
                } finally {
                    this.selectedInvoice = null;
                    this.showSaveConfirmationDialog = false
                    this.$emit('isLoading', false)
                }
            },
            async handleDateChange(value){
                [this.dateRange.startDate, this.dateRange.endDate] = value
                this.dateRange.startDate = this.$root.formatDate(this.dateRange.startDate, 'inputDate')
                this.dateRange.endDate = this.$root.formatDate(this.dateRange.endDate, 'inputDate')
                this.page = 1
                this.generatedInvoices = []
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