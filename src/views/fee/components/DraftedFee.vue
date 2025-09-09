<template>
    <v-container v-if="isAuthorized">
        <v-row>
            <v-col cols="12" sm="6" md="5" class="py-0">
                <BrkSearch
                    placeholder="Cari nama tutor ..."
                    @isLoading="() => $emit('isLoading', true)"
                    @handleSearchChange="handleSearchChange"
                />
            </v-col>
        </v-row>

        <v-table
            v-if="draftedFees.length > 0"
            density="compact"
        >
            <thead>
                <tr>
                    <th>No</th>
                    <th>Nomor Fee</th>
                    <th class="text-center">Tanggal Fee</th>
                    <th>Tutor</th>
                    <th class="text-right">Total Biaya</th>
                    <th style="width:130px !important"></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(fee, index) in draftedFees">
                    <td class="align-top pt-2">{{ perPage * ( page - 1 ) + index + 1 }}</td>
                    <td class="align-top pt-2">{{ fee.FeeCode }}</td>
                    <td class="align-top pt-2 text-center">{{ $root.formatDate(fee.FeeDate) }}</td>
                    <td class="align-top pt-2">{{ fee.TutorName }}</td>
                    <td class="text-right align-top pt-2">{{ $root.formatRupiah(fee.Total) }}</td>
                    <td class="text-right align-top pt-2">
                        <BrkActionButton 
                            hasEdit
                            hasSend
                            hasDelete
                            @handleEditClick="() => $router.push(`/backoffice/fee/edit/${fee.ID}?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`)"
                            @handleSendClick="handleSend(fee)"
                            @handleDeleteClick="handleDelete(fee)"
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
        title="Kirim Fee"
        :isOpen="showSendConfirmationDialog"
        :confirmationText="sendConfirmationText"
        @handleCancel="showSendConfirmationDialog = false"
        @handleOK="sendFee"
    />

    <ConfirmationDialog
        title="Hapus Fee"
        :isOpen="showDeleteConfirmationDialog"
        :confirmationText="deleteConfirmationText"
        @handleCancel="showDeleteConfirmationDialog = false"
        @handleOK="deleteFee"
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
    import feeService from '@/services/fee/feeService.js';

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
                selectedFee: null,
                draftedFees: [],
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
                this.fetchFeeData()
            }
        },
        async created(){
            this.isAuthorized = await this.$root.isAuthorizedToAccess("Fee Tutor")
            this.loadData()
        },
        methods:{
            async loadData(){
                await this.fetchFeeData()
            },
            async fetchFeeData(){
                this.draftedFees = []

                this.$emit('isLoading', true)
                try {
                    const response = await feeService.getFeesDraft({
                        startDate: this.dateRange.startDate,
                        endDate: this.dateRange.endDate,
                        searchText: this.searchText,
                        page: this.page,
                        perPage: this.perPage
                    })

                    const _draftedFees = response.data.data

                    this.draftedFees = _draftedFees.map( fee => {
                        return {
                            ...fee,
                            FeeDate: this.$root.formatDate(fee.FeeDate, "inputDate"),
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
            handleSend(fee){
                this.selectedFee = this.draftedFees.find(_fee => _fee.TutorID === fee.TutorID)
                this.selectedFee.IsDraft = false
                this.selectedFee.FeeDate = this.$root.formatDate(new Date(), "inputDate")

                this.showSendConfirmationDialog = true
                this.sendConfirmationText = `Anda akan mengirimkan fee dengan nomor ${fee.FeeCode}. Tanggal fee akan disunting menjadi tanggal hari ini. Lanjutkan?`
            },
            handleDelete(fee){
                this.selectedFee = this.draftedFees.find(_fee => _fee.TutorID === fee.TutorID)

                this.showDeleteConfirmationDialog = true
                this.deleteConfirmationText = `Anda akan menghapus fee dengan nomor ${fee.FeeCode} dari draft. Anda masih akan menemukan data tersebut yang digenerate otomatis pada tab "BELUM DIPROSES" dan dapat menyuntingnya kembali. Lanjutkan?`
            },
            async sendFee(){
                try {
                    const data = await feeService.updateFee(this.selectedFee, this.selectedFee.ID)
                    
                    this.$emit('isLoading', false)
                    this.$router.push({ path: '/backoffice/fee', query: { tab: 'sent', startDate: this.dateRange.startDate, endDate: this.dateRange.endDate } }).then(() => {
                      window.location.reload();
                    });
                } catch (error) {
                    console.log(error)
                    this.$root.showSnackbar(error.response ? error.response.data.message : error.message);
                } finally {
                    this.selectedFee = null;
                    this.showSendConfirmationDialog = false
                    this.$emit('isLoading', false)
                }
            },
            async deleteFee(){
                try {
                    const data = await feeService.deleteFee(this.selectedFee.ID)
                    
                    this.$emit('isLoading', false)
                    this.$router.push({ path: '/backoffice/fee', query: { tab: 'raw', startDate: this.dateRange.startDate, endDate: this.dateRange.endDate } }).then(() => {
                      window.location.reload();
                    });
                } catch (error) {
                    console.log(error)
                    this.$root.showSnackbar(error.response ? error.response.data.message : error.message);
                } finally {
                    this.selectedFee = null;
                    this.showDeleteConfirmationDialog = false
                    this.$emit('isLoading', false)
                }
            },
            async handleDateChange(value){
                [this.dateRange.startDate, this.dateRange.endDate] = value
                this.dateRange.startDate = this.$root.formatDate(this.dateRange.startDate, 'inputDate')
                this.dateRange.endDate = this.$root.formatDate(this.dateRange.endDate, 'inputDate')
                this.page = 1
                this.draftedFees = []
                await this.fetchFeeData()
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