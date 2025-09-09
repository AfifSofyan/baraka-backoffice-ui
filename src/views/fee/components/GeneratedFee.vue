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
            v-if="generatedFees.length > 0"
            density="compact"
        >
            <thead>
                <tr>
                    <th>No</th>
                    <th>Tutor</th>
                    <th>Total Biaya</th>
                    <th style="width:150px !important"></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(fee, index) in generatedFees">
                    <td>{{ perPage * ( page - 1 ) + index + 1 }}</td>
                    <td>{{ fee.TutorName }}</td>
                    <td>{{ $root.formatRupiah(fee.Total) }}</td>
                    <td class="text-right">
                        <BrkActionButton 
                            :hasEdit="$root.hasAccess('Edit Responsi')"
                            hasSend
                            hasSave
                            @handleEditClick="() => $router.push(`/backoffice/fee/create?tutorID=${fee.TutorID}&startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`)"
                            @handleSendClick="handleSend(fee)"
                            @handleSaveClick="handleSave(fee)"
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
        title="Simpan Fee"
        :isOpen="showSaveConfirmationDialog"
        :confirmationText="saveConfirmationText"
        @handleCancel="showSaveConfirmationDialog = false"
        @handleOK="saveFee"
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
                generatedFees: [],
                paginationInfo: {},

                showSendConfirmationDialog: false,
                sendConfirmationText: "",
                showSaveConfirmationDialog: false,
                saveConfirmationText: "",
                selectedFee: null,
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
                this.generatedFees = []

                this.$emit('isLoading', true)
                try {
                    const response = await feeService.getGeneratedFeeList({
                        startDate: this.dateRange.startDate,
                        endDate: this.dateRange.endDate,
                        searchText: this.searchText,
                        page: this.page,
                        perPage: this.perPage
                    })

                    this.generatedFees = response.data.data
                    this.paginationInfo = response.data.paginationInfo
                } catch (error) {
                    this.$root.showSnackbar(error.response ? error.response.data.message : error.message)
                } finally{
                    this.$emit('isLoading', false)
                }
            },
            handleSend(fee){
                this.selectedFee = this.generatedFees.find(_fee => _fee.TutorID === fee.TutorID)
                this.selectedFee.IsDraft = false

                this.showSendConfirmationDialog = true
                this.sendConfirmationText = `Anda akan mengirimkan fee ke tutor ${fee.TutorName}. Lanjutkan?`
            },
            handleSave(fee){
                this.selectedFee = this.generatedFees.find(_fee => _fee.TutorID === fee.TutorID)
                this.selectedFee.IsDraft = true

                this.showSaveConfirmationDialog = true
                this.saveConfirmationText = `Anda akan menyimpan fee tutor ${fee.TutorName} sebagai draft. Lanjutkan?`
            },
            async sendFee(){
                try {
                    const data = await feeService.createFee(this.selectedFee);
                    
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
            async saveFee(){
                try {
                    const data = await feeService.createFee(this.selectedFee);
                    
                    this.$emit('isLoading', false)
                    this.$router.push({ path: '/backoffice/fee', query: { tab: 'draft', startDate: this.dateRange.startDate, endDate: this.dateRange.endDate } }).then(() => {
                      window.location.reload();
                    });
                } catch (error) {
                    console.log(error)
                    this.$root.showSnackbar(error.response ? error.response.data.message : error.message);
                } finally {
                    this.selectedFee = null;
                    this.showSaveConfirmationDialog = false
                    this.$emit('isLoading', false)
                }
            },
            async handleDateChange(value){
                [this.dateRange.startDate, this.dateRange.endDate] = value
                this.dateRange.startDate = this.$root.formatDate(this.dateRange.startDate, 'inputDate')
                this.dateRange.endDate = this.$root.formatDate(this.dateRange.endDate, 'inputDate')
                this.page = 1
                this.generatedFees = []
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