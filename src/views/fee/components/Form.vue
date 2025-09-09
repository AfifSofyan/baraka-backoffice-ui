<template>
    <v-form v-model="validForm" @submit.prevent="handleSubmit">
        <v-row>
            <v-col cols="12" md="6">
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
        </v-row>

        <v-row>
            <v-col cols="12" md="6">
                <v-autocomplete
                    v-model="form.TutorID"
                    label="Tutor"
                    :items="tutorList"
                    item-title="Name"
                    item-value="ID"
                    variant="outlined"
                    :rules="[required]"
                    :readonly="!tutorID"
                    @update:model-value="generateFee"
                />
            </v-col>
        </v-row>

        <v-card 
            v-if="form.FeeItems.length > 0 || noInitialFeeItems"
            class="mb-6 pa-4"
        >
            <p class="mb-4">Komponen Fee</p>
            <v-table
                density="compact"
                class="mb-4" 
            >
                <thead>
                    <th></th>
                    <th>No</th>
                    <th class="text-left pl-4">Komponen Fee</th>
                    <th class="text-center">Qty</th>
                    <th class="text-left pl-4 w-25">Fee</th>
                    <th class="text-right pr-4">Subtotal</th>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in form.FeeItems">
                        <td class="text-right">
                            <BrkActionButton 
                                hasDelete
                                @handleDeleteClick="deleteFeeItem(index)"
                            />
                        </td>
                        <td class="text-center">{{ index + 1 }}</td>
                        <td>
                            <div v-if="item.FeeComponentID">
                                {{ item.Name }}
                            </div>
                            <v-text-field
                                v-else
                                variant="outlined"
                                density="compact"
                                class="mt-2 mb-n4 text-center"
                                width="70"
                                :model-value="item.Name"
                                @input="(event) => updateComponentName(index, event.target.value)"
                            />
                        </td>
                        <td class="text-center">
                            <div style="width:80px">
                                <v-text-field
                                    variant="outlined"
                                    density="compact"
                                    class="mt-2 mb-n4 text-center"
                                    type="number"
                                    reverse
                                    :model-value="item.Qty"
                                    :rules="[required]"
                                    @input="(event) => updateItemQty(index, parseInt(event.target.value))"
                                />
                            </div>
                        </td>
                        <td>
                            <div style="width:130px">
                                <v-text-field
                                    variant="outlined"
                                    density="compact"
                                    class="mt-2 mb-n4 text-center"
                                    type="number"
                                    hide-spin-buttons
                                    prefix="Rp"
                                    :model-value="item.Price"
                                    :rules="[required]"
                                    @input="(event) => updateItemPrice(index, parseInt(event.target.value))"
                                />
                            </div>                            
                        </td>
                        <td class="text-right">
                            <div v-if="item.FeeComponentID">
                                {{ $root.formatRupiah(item.Subtotal) }}
                            </div>
                            <div style="width:130px" v-else>
                                <v-text-field
                                    variant="outlined"
                                    density="compact"
                                    class="mt-2 mb-n4 mr-n6 ml-6 text-center"
                                    type="number"
                                    hide-spin-buttons
                                    prefix="Rp"
                                    :model-value="item.Subtotal"
                                    :rules="[required]"
                                    @input="(event) => updateItemSubtotal(index, parseInt(event.target.value))"
                                />
                            </div>    
                        </td>
                    </tr>
                </tbody>
            </v-table>

            <ModalFeeComponent
                v-if="type == 'create'"
                :fee_component_list="feeComponentsList"
                :selected_fee_components_id="form.FeeItems.map(obj => parseInt(obj.FeeComponentID))"
                @onSubmitData="onAddFeeComponent"
                @isLoading="(state) => $emit('isLoading', state)"
            />

            <div class="d-flex justify-end mb-2">
                <div style="width:130px">
                    <v-text-field
                        label="Potongan Fee"
                        variant="outlined"
                        density="compact"
                        class="mt-2 mb-n4 text-center"
                        type="number"
                        hide-spin-buttons
                        prefix="Rp"
                        v-model="form.Paycut"
                        @update:model-value="calculateTotal()"
                    />
                </div>
            </div>
            <div class="d-flex justify-end mb-2">
                <p class="font-weight-medium mr-4">Total:</p>
                <p class="font-weight-medium">{{ $root.formatRupiah(form.Total) }}</p>
            </div>
        </v-card>

        <div class="d-flex justify-end">
            <BrkButton
                buttonText="Batal"
                color="danger"
                @click="showCancelConfirmationDialog = true"
                class="mr-2"
            />
            <BrkButton
                v-if="type == 'create'"
                buttonText="Reset"
                color="danger"
                @click="showResetConfirmationDialog = true"
                class="mr-2"
            />
            <BrkButton
                :buttonText="type == 'create' ? 'Submit' : 'Edit Data'"
                color="secondary"
                type="submit"
            />
        </div>
        
    </v-form>

    <OptionDialog
        :isOpen="showOptionDialog"
        optionText="Silahkan pilih apakah anda ingin langsung mengirimkan fee kepada tutor atau menyimpannya sebagai draf"
        opt1="Simpan Sebagai Draf"
        opt2="Kirim"
        @handleCancel="showOptionDialog = false"
        @handleOpt1="saveFee"
        @handleOpt2="sendFee"
    />

    <ConfirmationDialog
        :isOpen="showConfirmationDialog"
        :confirmationText="confirmationText"
        @handleCancel="showConfirmationDialog = false"
        @handleOK="submit"
    />

    <ConfirmationDialog
        :isOpen="showResetConfirmationDialog"
        confirmationText="Anda akan melakukan reset form dan semua data yang telah anda input akan dihapus. Lanjutkan?"
        @handleCancel="showResetConfirmationDialog = false"
        @handleOK="resetForm"
    />

    <ConfirmationDialog
        :isOpen="showCancelConfirmationDialog"
        confirmationText="Anda akan kembali ke halaman fee. Data yang anda masukkan tidak akan tersimpan. Lanjutkan?"
        @handleCancel="showCancelConfirmationDialog = false"
        @handleOK="() => $router.push('/backoffice/fee')"
    />
</template>

<script>
import feeService from "@/services/fee/feeService";
import tutorService from "@/services/tutor/tutorService.js";
import BrkDatePicker from "@/components/pages/BrkDatePicker.vue";
import BrkActionButton from "@/components/pages/BrkActionButton.vue";
import BrkTimePicker from "@/components/pages/BrkTimePicker.vue";
import BrkNoData from '@/components/pages/BrkNoData.vue';
import BrkButton from "@/components/pages/BrkButton.vue";
import ConfirmationDialog from "@/components/ConfirmationDialog.vue";
import OptionDialog from "@/components/OptionDialog.vue";
import { required } from '@/utils/app/validator.js';
import ModalFeeComponent from '@/views/fee/components/ModalFeeComponent.vue';
import setter from '@/utils/app/data-setter.js';

import moment from "moment";

export default{
    props:{
        type:{
            type:String
        }
    },
    emits: ['isLoading'],
    components:{
        BrkDatePicker,
        BrkTimePicker,
        BrkActionButton,
        BrkButton,
        BrkNoData,
        ConfirmationDialog,
        OptionDialog,
        ModalFeeComponent
    },
    data(){
        return{
            validForm:false,
            form:{
                // fee model
                TutorID: null,
                FeeCode: null,
                IsDraft: null,
                FeeDate: null,
                StartDate: null,
                EndDate: null,
                Paycut: 0,
                Total: 0,
                // fee model

                // additional fee data
                FeeItems: [],
                CreatedByName: null,
                UpdatedByName: null
                // additional fee data
                
            },

            dateRange: setter.setDateRange({
                mode: setter.constants.DATERANGE_MODE_MONTHLY,
                duration: 1,
                direction: setter.constants.DATERANGE_DIRECTION_THIS_POINT_FORWARD
            }),

            // non-static database records related to students
            tutorList: [],
            feeComponentsList: [],
            // non-static database records related to students


            // other variables related to form
            userID: JSON.parse(localStorage.getItem('id')),

            showOptionDialog: false,
            showConfirmationDialog: false,
            showCancelConfirmationDialog: false,
            showResetConfirmationDialog: false,
            confirmationText: "",
            noInitialFeeItems:false,

            // other variables related to form
        }
    },
    computed: {
        tutorID() {
            return this.$route.query.tutorID;
        },
        id() {
            return this.$route.params.id;
        },
        startDate() {
            return this.$route.query.startDate;
        },
        endDate() {
            return this.$route.query.endDate;
        }
    },
    created(){
        if(this.startDate && this.endDate){
            this.dateRange = {
                startDate: this.startDate,
                endDate: this.endDate
            }
        }

        this.loadData()
    },
    methods:{
        async loadData(){
            this.$emit('isLoading', true)

            await Promise.all([
                this.loadTutorData(),
                this.loadFeeComponents()
            ])

            if(this.type !== 'create'){
                await this.loadFeeDetail()
            }

            if(this.tutorID){
                await this.initateTutorData()        
            }
            
            this.$emit('isLoading', false)
        },
        async loadFeeDetail(){
            try {
                const data = await feeService.getFeeDetail(this.id)

                console.log(data)

                this.form = {
                    ...this.form,
                    ...data,
                    FeeDate: this.$root.formatDate(data.FeeDate, "inputDate"),
                    StartDate: this.$root.formatDate(data.StartDate, "inputDate"),
                    EndDate: this.$root.formatDate(data.EndDate, "inputDate")
                }

                this.tutorList.push({
                    ID: data.TutorID,
                    Name: data.TutorName
                })

                this.dateRange = {
                    startDate: this.form.StartDate,
                    endDate: this.form.EndDate
                }
            } catch (error) {
                this.$root.showSnackbar(error.response ? error.response.data.message : error.message)
            }
        },
        async loadTutorData(){
            try{
                const result = await tutorService.getTutorIDAndNameWithoutFee({
                    startDate: this.dateRange.startDate,
                    endDate: this.dateRange.endDate
                });

                this.tutorList = result.data.data;
            }  catch (error) {
                this.$root.showSnackbar(error.response ? error.response.data.message : error.message)
            }
        },
        async loadFeeComponents(){
            try{
                const result = await feeService.getFeeComponents({isActive: true});

                this.feeComponentsList = result.data;
                this.feeComponentsList.push({
                    ID: -1,
                    Name: "Komponen Suaian",
                    Price: 0,
                })
            }  catch (error) {
                this.$root.showSnackbar(error.response ? error.response.data.message : error.message)
            }
        },
        async initateTutorData(){
            this.form.TutorID = this.tutorID
            await this.generateFee()
        },
        async generateFee(){
            this.form.FeeItems = []

            if(this.form.TutorID){
                this.$emit('isLoading', true)
                try {
                    const response = await feeService.getGeneratedFeeList({
                        startDate: this.dateRange.startDate,
                        endDate: this.dateRange.endDate,
                        tutorID: this.form.TutorID,
                    })

                    const _data = response.data.data[0]

                    if(_data){
                        this.form = {
                            ...this.form,
                            ..._data,
                            TutorID: JSON.parse(_data.TutorID)
                        }
                    }else{
                        this.noInitialFeeItems = true
                    }

                    console.log(this.tutorList)
                } catch (error) {
                    this.$root.showSnackbar(error.response ? error.response.data.message : error.message)
                } finally{
                    this.$emit('isLoading', false)
                }
            }
        },
        handleDateChange(value){
            this.dateRange.startDate = this.$root.formatDate(value[0], 'inputDate')
            this.dateRange.endDate = this.$root.formatDate(value[1], 'inputDate')

            if(this.type == 'create'){
                this.resetForm()
                this.loadData()
            }
        },
        async backOneMonth(){
            this.dateRange = setter.backOneMonth(this.dateRange)

            if(this.type == 'create'){
                this.resetForm()
                this.loadData()
            }
        },
        async forwardOneMonth(){
            this.dateRange = setter.forwardOneMonth(this.dateRange)

            if(this.type == 'create'){
                this.resetForm()
                this.loadData()
            }
        },
        updateItemPrice(index, value){
            const { Qty } = this.form.FeeItems[index]
            if(Qty){
                this.form.FeeItems[index].Price = value
                this.form.FeeItems[index].Subtotal = Qty * value
            }else{
                this.form.FeeItems[index].Price = value
                this.form.FeeItems[index].Subtotal = value
            }

            this.calculateTotal()

        },
        updateItemQty(index, value){
            const { Qty } = this.form.FeeItems[index]
            
            this.form.FeeItems[index].Qty = value
            this.form.FeeItems[index].Subtotal = Qty * value

            this.calculateTotal()
        },
        updateItemSubtotal(index, value){
            this.form.FeeItems[index].Subtotal = value

            this.calculateTotal()
        },
        updateComponentName(index, value){
            this.form.FeeItems[index].Name = value
        },
        calculateTotal(){
            const subTotal = this.form.FeeItems.reduce((acc, curr) => {
                return acc + curr.Subtotal
            }, 0)

            this.form.Total = subTotal - this.form.Paycut
        },
        handleSubmit(){
            if(!this.validForm){
                return
            }

            this.form = {
                ...this.form,
                FeeDate: this.type === 'edit' ? this.form.FeeDate : this.$root.formatDate(moment(), "inputDate"),
                StartDate: this.dateRange.startDate,
                EndDate: this.dateRange.endDate
            }

            this.showOptionDialog = true;
        },
        handleCancel(){
            this.showConfirmationDialog = false
        },
        async saveFee(){
            this.form = {
                ...this.form,
                IsDraft: true,
            }

            this.confirmationText = 'Anda akan menyimpan fee berikut sebagai draf. Lanjutkan?'
            this.showConfirmationDialog = true
        },
        async sendFee(){
            this.form = {
                ...this.form,
                IsDraft: false,
            }

            this.confirmationText = 'Anda akan mengirimkan fee baru. Lanjutkan?'
            this.showConfirmationDialog = true
        },
        async submit(){
            this.$emit('isLoading', true)

            try {
                if(this.type === 'create'){
                    await feeService.createFee(this.form);
                }else{
                    await feeService.updateFee(this.form, this.id);
                }
                
                this.$emit('isLoading', false)
                if(this.form.IsDraft){
                    this.$router.push({ path: '/backoffice/fee', query: { tab: 'draft', startDate: this.dateRange.startDate, endDate: this.dateRange.endDate } }).then(() => {
                      window.location.reload();
                    });
                }else{
                    this.$router.push({ path: '/backoffice/fee', query: { tab: 'sent', startDate: this.dateRange.startDate, endDate: this.dateRange.endDate } }).then(() => {
                      window.location.reload();
                    });
                }
            } catch (error) {
                console.log(error)
                this.$root.showSnackbar(error.response ? error.response.data.message : error.message);
            } finally {
                this.showConfirmationDialog = false
                this.showOptionDialog = false
                this.$emit('isLoading', false)
            }
        },
        deleteFeeItem(index){
            console.log(this.form.FeeItems[index])

            this.form.FeeItems = this.form.FeeItems.filter((item, _index) => index != _index)
            this.calculateTotal()
        },
        onAddFeeComponent(feeComponentData){
            const componentExists = this.form.FeeItems.length > 0 ? this.form.FeeItems.find(data => data.FeeComponentID == feeComponentData.ID) : false
            if(!componentExists){
                if(feeComponentData.ID == -1 ){
                    this.form.FeeItems.push({
                        FeeComponentID: null,
                        Name: feeComponentData.Name,
                        Qty: null,
                        Price: null,
                        Subtotal: 0,
                        IsAdditional: true,
                    })
                }else{
                    this.form.FeeItems.push({
                        FeeComponentID: feeComponentData.ID,
                        Name: feeComponentData.Name,
                        Qty: 0,
                        Price: feeComponentData.Price,
                        Subtotal: 0,
                        IsAdditional: true,
                    })
                }
            }

            this.calculateTotal()
        },
        resetForm(){
            this.form = {
                TutorID: null,
                IsDraft: null,
                FeeDate: null,
                StartDate: null,
                EndDate: null,
                Paycut: 0,
                Total: 0,
                FeeItems: [],
                CreatedByName: null,
                UpdatedByName: null
            },

            this.noInitialFeeItems = false

            this.showResetConfirmationDialog = false
        },

        // validator functions

        required
    }
}
</script>

<style lang="scss" scoped>

</style>