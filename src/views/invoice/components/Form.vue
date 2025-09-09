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

        <v-card class="mt-2 mb-4 pa-4">
            <ModalStudent
                v-if="type == 'create'"
                ref="modalStudent"
                :student_list="studentList"
                :selected_students_id="form.InvoiceStudents.map(obj => parseInt(obj.StudentID))"
                :date_range="dateRange"
                @onSubmitData="onAddData"
                @isLoading="(state) => $emit('isLoading', state)"
            />

            <v-table 
                v-if="form.InvoiceStudents.length > 0"
                class="mt-4" 
                density="compact"
            >
                <thead>
                    <th>No</th>
                    <th class="text-left pl-4">Nama Siswa</th>
                </thead>
                <tbody>
                    <tr v-for="(student, index) in form.InvoiceStudents" style="height:20px">
                        <td class="text-center">{{ index + 1 }}</td>
                        <td>{{ student.StudentName }}</td>
                    </tr>
                </tbody>
            </v-table>
        </v-card>

        <v-card 
            class="mb-6 pa-4"
        >
            <p class="mb-4">Komponen Biaya</p>
            <v-table
                density="compact"
                class="mb-4" 
                v-if="form.InvoiceItems.length > 0 || noInitialInvoiceItems"
            >
                <thead>
                    <th></th>
                    <th>No</th>
                    <th class="text-left pl-4">Komponen Invoice</th>
                    <th class="text-center">Durasi(Menit)</th>
                    <th class="text-center">Total Pertemuan</th>
                    <th class="text-left pl-4">Biaya per Pertemuan</th>
                    <th class="text-right pr-4">Subtotal</th>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in form.InvoiceItems">
                        <td class="text-right">
                            <BrkActionButton 
                                hasDelete
                                @handleDeleteClick="deleteInvoiceItem(index)"
                            />
                        </td>
                        <td class="text-center">{{ index + 1 }}</td>
                        <td>
                            <div v-if="item.InvoiceComponentID">
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
                                    :model-value="item.Duration"
                                    :rules="item.InvoiceComponentID ? [required] : []"
                                    @input="(event) => updateItemDuration(index, parseInt(event.target.value))"
                                />
                            </div>
                        </td>
                        <td>
                            <div style="width:80px">
                                <v-text-field
                                    variant="outlined"
                                    density="compact"
                                    class="mt-2 mb-n4 text-center"
                                    type="number"
                                    hide-spin-buttons
                                    :model-value="item.Quantity"
                                    :rules="item.InvoiceComponentID ? [required] : []"
                                    @input="(event) => updateItemQuantity(index, parseFloat(event.target.value))"
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
                                    :model-value="item.Cost"
                                    :rules="item.InvoiceComponentID ? [required] : []"
                                    @input="(event) => updateItemCost(index, parseInt(event.target.value))"
                                />
                            </div>                            
                        </td>
                        <td class="text-right">
                            <div v-if="item.InvoiceComponentID">
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

            <ModalInvoiceComponent
                v-if="type == 'create'"
                :invoice_component_list="invoiceComponentsList"
                :selected_invoice_components_id="form.InvoiceItems.map(obj => parseInt(obj.InvoiceComponentID))"
                @onSubmitData="onAddInvoiceComponent"
                @isLoading="(state) => $emit('isLoading', state)"
            />

            <div class="d-flex justify-end mb-2" v-if="form.InvoiceItems.length > 0">
                <div style="width:130px">
                    <v-text-field
                        label="Diskon"
                        variant="outlined"
                        density="compact"
                        class="mt-2 mb-n4 text-center"
                        type="number"
                        hide-spin-buttons
                        prefix="Rp"
                        v-model="form.Discount"
                        @update:model-value="calculateTotal()"
                    />
                </div>
            </div>
            <div class="d-flex justify-end mb-2" v-if="form.InvoiceItems.length > 0">
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
        optionText="Silahkan pilih apakah anda ingin langsung mengirimkan invoice kepada siswa atau menyimpannya sebagai draf"
        opt1="Simpan Sebagai Draf"
        opt2="Kirim"
        @handleCancel="showOptionDialog = false"
        @handleOpt1="saveInvoice"
        @handleOpt2="sendInvoice"
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
        confirmationText="Anda akan kembali ke halaman invoice. Data yang anda masukkan tidak akan tersimpan. Lanjutkan?"
        @handleCancel="showCancelConfirmationDialog = false"
        @handleOK="() => $router.push('/backoffice/invoice')"
    />
</template>

<script>
import studentService from "@/services/student/studentService.js";
import invoiceService from "@/services/invoice/invoiceService";
import BrkDatePicker from "@/components/pages/BrkDatePicker.vue";
import BrkActionButton from "@/components/pages/BrkActionButton.vue";
import BrkTimePicker from "@/components/pages/BrkTimePicker.vue";
import BrkNoData from '@/components/pages/BrkNoData.vue';
import BrkButton from "@/components/pages/BrkButton.vue";
import ConfirmationDialog from "@/components/ConfirmationDialog.vue";
import OptionDialog from "@/components/OptionDialog.vue";
import { required } from '@/utils/app/validator.js';
import ModalStudent from '@/views/invoice/components/ModalStudent.vue';
import ModalInvoiceComponent from '@/views/invoice/components/ModalInvoiceComponent.vue';
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
        ModalStudent,
        ModalInvoiceComponent
    },
    data(){
        return{
            validForm:false,
            form:{
                // invoice model
                InvoiceCode: null,
                IsDraft: null,
                InvoiceDate: null,
                StartDate: null,
                EndDate: null,
                Discount: 0,
                Total: 0,
                // invoice model

                // additional invoice data
                InvoiceStudents: [],
                InvoiceItems: [],
                CreatedByName: null,
                UpdatedByName: null
                // additional invoice data
                
            },

            dateRange: setter.setDateRange({
                mode: setter.constants.DATERANGE_MODE_MONTHLY,
                duration: 1,
                direction: setter.constants.DATERANGE_DIRECTION_THIS_POINT_FORWARD
            }),

            _invoiceItems: [],  // used to store directly generated invoice items without paying attention to duplicated InvoiceComponentID

            // non-static database records related to students
            studentList: [],
            invoiceComponentsList: [],
            // non-static database records related to students


            // other variables related to form
            userID: JSON.parse(localStorage.getItem('id')),

            showOptionDialog: false,
            showConfirmationDialog: false,
            showCancelConfirmationDialog: false,
            showResetConfirmationDialog: false,
            confirmationText: "",
            noInitialInvoiceItems:false,

            // other variables related to form
        }
    },
    computed: {
        studentID() {
            return this.$route.query.studentID;
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
                this.loadStudentData(),
                this.loadInvoiceComponents()
            ])

            if(this.type !== 'create'){
                await this.loadInvoiceDetail()
            }

            if(this.studentID){
                await this.initateStudentData()        
            }
            
            this.$emit('isLoading', false)
        },
        async loadInvoiceDetail(){
            try {
                const data = await invoiceService.getInvoiceDetail(this.id)

                console.log(data)

                this.form = {
                    ...this.form,
                    ...data,
                    InvoiceDate: this.$root.formatDate(data.InvoiceDate, "inputDate"),
                    StartDate: this.$root.formatDate(data.StartDate, "inputDate"),
                    EndDate: this.$root.formatDate(data.EndDate, "inputDate")
                }

                this.dateRange = {
                    startDate: this.form.StartDate,
                    endDate: this.form.EndDate
                }
            } catch (error) {
                this.$root.showSnackbar(error.response ? error.response.data.message : error.message)
            }
        },
        async loadStudentData(){
            try{
                const result = await studentService.getStudentIDAndNameWithoutInvoice({
                    startDate: this.dateRange.startDate,
                    endDate: this.dateRange.endDate
                });

                this.studentList = result.data.data;

            }  catch (error) {
                this.$root.showSnackbar(error.response ? error.response.data.message : error.message)
            }
        },
        async loadInvoiceComponents(){
            try{
                const result = await invoiceService.getInvoiceComponents({isActive: true});

                this.invoiceComponentsList = result.data.data;
                this.invoiceComponentsList.push({
                    ID: -1,
                    Name: "Komponen Suaian",
                    Quantity: 0,
                    Cost: 0,
                })
            }  catch (error) {
                this.$root.showSnackbar(error.response ? error.response.data.message : error.message)
            }
        },
        async initateStudentData(){
            this.$refs.modalStudent.refFired = true
            this.$refs.modalStudent.studentID = this.studentID
            this.$refs.modalStudent.validForm = true
            await this.$refs.modalStudent.generateInvoice()
            this.$refs.modalStudent.closeModal()
            console.log(this.$refs.modalStudent.invoiceData)
            this.onAddData(this.$refs.modalStudent.invoiceData)
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
        reformInvoice(){
            this.form.InvoiceItems = this.form.InvoiceItems.filter( item => item.InvoiceComponentID == null)

            if(this._invoiceItems.length === 0){
                this.noInitialInvoiceItems = true
            }

            this._invoiceItems.forEach(item => {    

                const existingItem = this.form.InvoiceItems.find(_item => _item.InvoiceComponentID == item.InvoiceComponentID && _item.SixtyMinutesDuration == item.SixtyMinutesDuration)
                
                if(existingItem){
                    existingItem.Duration += item.Duration
                    existingItem.Quantity += item.Quantity
                    existingItem.Subtotal += item.Subtotal
                }else{
                    this.form.InvoiceItems.push(item)
                }
            })
        
        },
        updateItemCost(index, value){
            const { Quantity } = this.form.InvoiceItems[index]
            if(Quantity){
                this.form.InvoiceItems[index].Cost = value
                this.form.InvoiceItems[index].Subtotal = Math.round((Quantity * value) / 100) * 100
            }else{
                this.form.InvoiceItems[index].Cost = value
                this.form.InvoiceItems[index].Subtotal = value
            }

            this.calculateTotal()

        },
        updateItemQuantity(index, value){
            console.log(value)
            const { Cost } = this.form.InvoiceItems[index]
            
            this.form.InvoiceItems[index].Quantity = value
            this.form.InvoiceItems[index].Subtotal = Math.round((Cost * value) / 100) * 100

            this.calculateTotal()
        },
        updateItemDuration(index, value){
            const { Cost } = this.form.InvoiceItems[index]
            
            this.form.InvoiceItems[index].Duration = value
            this.form.InvoiceItems[index].Quantity = Math.round(value / 90 * 100) / 100
            this.form.InvoiceItems[index].Subtotal = Math.round((Cost * value / 90) / 100) * 100

            this.calculateTotal()
        },
        updateItemSubtotal(index, value){
            this.form.InvoiceItems[index].Subtotal = value

            this.calculateTotal()
        },
        updateComponentName(index, value){
            this.form.InvoiceItems[index].Name = value
        },
        calculateTotal(){
            const subTotal = this.form.InvoiceItems.reduce((acc, curr) => {
                return acc + curr.Subtotal
            }, 0)

            this.form.Total = subTotal - this.form.Discount
        },
        deleteInvoiceItem(index){
            console.log(this.form.InvoiceItems[index])

            this.form.InvoiceItems = this.form.InvoiceItems.filter((item, _index) => index != _index)
            this.calculateTotal()
        },
        handleSubmit(){
            if(!this.validForm){
                return
            }

            this.form = {
                ...this.form,
                InvoiceDate: this.type === 'edit' ? this.form.InvoiceDate : this.$root.formatDate(moment(), "inputDate"),
                StartDate: this.dateRange.startDate,
                EndDate: this.dateRange.endDate
            }

            this.showOptionDialog = true;
        },
        handleCancel(){
            this.showConfirmationDialog = false
        },
        async saveInvoice(){
            this.form = {
                ...this.form,
                IsDraft: true,
            }

            this.confirmationText = 'Anda akan menyimpan invoice berikut sebagai draf. Lanjutkan?'
            this.showConfirmationDialog = true
        },
        async sendInvoice(){
            this.form = {
                ...this.form,
                IsDraft: false,
            }

            this.confirmationText = 'Anda akan mengirimkan invoice baru. Lanjutkan?'
            this.showConfirmationDialog = true
        },
        async submit(){
            this.$emit('isLoading', true)

            try {
                if(this.type === 'create'){
                    await invoiceService.createInvoice(this.form);
                }else{
                    await invoiceService.updateInvoice(this.form, this.id);
                }
                
                this.$emit('isLoading', false)
                if(this.form.IsDraft){
                    this.$router.push({ path: '/backoffice/invoice', query: { tab: 'draft', startDate: this.dateRange.startDate, endDate: this.dateRange.endDate } }).then(() => {
                      window.location.reload();
                    });
                }else{
                    this.$router.push({ path: '/backoffice/invoice', query: { tab: 'sent', startDate: this.dateRange.startDate, endDate: this.dateRange.endDate } }).then(() => {
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
        onAddData(invoiceData){
            const studentExists = this.form.InvoiceStudents.length > 0 ? this.form.InvoiceStudents.find(data => data.StudentID == invoiceData.InvoiceStudents[0].StudentID) : false
            if(!studentExists || this.studentID ){
                this.form.InvoiceStudents.push(invoiceData.InvoiceStudents[0])
            }
            
            if(invoiceData.InvoiceItems && invoiceData.InvoiceItems.length > 0){
                this._invoiceItems = [
                    ...this._invoiceItems,
                    ...invoiceData.InvoiceItems
                ]
            }

            this.reformInvoice()
            this.calculateTotal()
        },
        onAddInvoiceComponent(invoiceComponentData){
            const componentExists = this.form.InvoiceItems.length > 0 ? this.form.InvoiceItems.find(data => data.InvoiceComponentID == invoiceComponentData.ID) : false
            if(!componentExists){
                if(invoiceComponentData.ID == -1 ){
                    this.form.InvoiceItems.push({
                        InvoiceComponentID: null,
                        Name: invoiceComponentData.Name,
                        Duration: null,
                        Quantity: null,
                        Cost: null,
                        Subtotal: 0,
                        IsAdditional: true,
                    })
                }else{
                    this.form.InvoiceItems.push({
                        InvoiceComponentID: invoiceComponentData.ID,
                        Name: invoiceComponentData.Name,
                        Duration: 0,
                        Quantity: 0,
                        Cost: invoiceComponentData.Cost,
                        Subtotal: 0,
                        IsAdditional: true,
                    })
                }
            }

            this.calculateTotal()
        },
        resetForm(){
            this.form = {
                IsDraft: null,
                InvoiceDate: null,
                StartDate: null,
                EndDate: null,
                Discount: 0,
                Total: 0,
                InvoiceStudents: [],
                InvoiceItems: [],
                CreatedByName: null,
                UpdatedByName: null
            },

            this.noInitialInvoiceItems = false

            this.showResetConfirmationDialog = false
        },

        // validator functions

        required
    }
}
</script>

<style lang="scss" scoped>

</style>