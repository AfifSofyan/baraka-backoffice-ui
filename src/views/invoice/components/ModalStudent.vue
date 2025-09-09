<template>
    <v-dialog max-width="700">
        <template v-slot:activator="{ props: activatorProps }">
            <v-btn
                v-bind="activatorProps"
                text="Tambah Siswa"
                variant="tonal"
                color="primary"
                elevation="2"
                rounded="lg"
            ></v-btn>
        </template>
        <template v-slot:default="{ isActive }">
            <v-btn
                class="d-none"
                ref="close"
                @click="isActive.value = false"
            ></v-btn>
            <v-card 
                class="rounded-lg pa-4"
                elevation="2"
            >
                <v-form v-model="validForm" @submit.prevent="handleSubmit">
                    <v-row class="my-4">
                        <v-col cols="12" md="6" class="my-0">
                            <v-autocomplete 
                                v-model="studentID"
                                label="Siswa"
                                :items="filteredStudents()"
                                item-title="Name"
                                item-value="ID"
                                variant="outlined"    
                                :readonly="type == 'detail'"
                                @update:model-value="generateInvoice"
                                :rules="[required]"
                            />
                        </v-col>
                    </v-row>

                    <v-table 
                        v-if="generatedInvoice"
                        density="compact"
                        class="mb-8"
                    >
                        <thead>
                            <th>No</th>
                            <th class="text-left pl-4">Komponen Invoice</th>
                            <th class="text-center">Durasi(Menit)</th>
                            <th class="text-center">Total Pertemuan</th>
                            <th class="text-right pr-4">Biaya per Pertemuan</th>
                            <th class="text-right pr-4">Subtotal</th>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in generatedInvoice.InvoiceItems">
                                <td class="text-center">{{ index + 1 }}</td>
                                <td>{{ item.Name }}</td>
                                <td>{{ item.Quantity }}</td>
                                <td class="text-center">{{ item.Duration }}</td>
                                <td class="text-right">{{ $root.formatRupiah(item.Cost) }}</td>
                                <td class="text-right">{{ $root.formatRupiah(item.Subtotal) }}</td>
                            </tr>
                        </tbody>
                    </v-table>

                    <div class="d-flex justify-end">
                        <BrkButton
                            buttonText="Batal"
                            color="danger"
                            @click="handleCancel"
                            class="mr-2"
                        />
                        <BrkButton
                            buttonText="Submit"
                            color="secondary"
                            type="submit"
                        />
                    </div>
                </v-form>
            </v-card>
        </template>        
    </v-dialog>
</template>

<script>
import BrkButton from "@/components/pages/BrkButton.vue";
import ConfirmationDialog from "@/components/ConfirmationDialog.vue";
import invoiceService from "@/services/invoice/invoiceService";
import { required } from '@/utils/app/validator.js';

export default{
    props:{
        type:{
            type:String
        },
        student_list:{
            type:Array
        },
        selected_students_id:{
            type:Array
        },
        date_range:{
            type:Object
        }
    },
    emits: ['isLoading', 'onSubmitData'],
    components:{
        BrkButton,
        ConfirmationDialog
    },
    data(){
        return{
            studentID: null,
            replicatedInvoice: null, // to be returned when student has no invoice generated
            generatedInvoice:null, // to be shown in modal list
            invoiceData: null, // to be submitted to parent

            // other variables related to form
            validForm: false,
            dialogIsActive: false,
            refFired: false
            // other variables related to form
        }
    },
    methods:{
        
        handleSubmit(){
            if(!this.validForm){
                return
            }

            if(this.invoiceData){
                this.$emit('onSubmitData', this.invoiceData)
            }else{
                this.$emit('onSubmitData', this.replicatedInvoice)
            }
            this.closeModal()
        },
        handleCancel(){            
            this.closeModal()
        },
        closeModal(){
            this.generatedInvoice = null
            this.studentID = null

            if(!this.refFired){
                this.$refs.close.$el.click() // if the process is fired from the parent component using ref, the $el is referred to undefined $refs.close
            }
            this.refFired = false
        },
        async generateInvoice(){
            this.generatedInvoice = null

            this.$emit('isLoading', true)
            try {
                const response = await invoiceService.getGeneratedInvoiceList({
                    startDate: this.date_range.startDate,
                    endDate: this.date_range.endDate,
                    studentID: this.studentID,
                })

                this.generatedInvoice = response.data.data[0]
                this.invoiceData = response.data.data[0]

                if(!this.generatedInvoice){
                    this.replicatedInvoice = this.student_list.find(student => student.ID == this.studentID)
                    this.replicatedInvoice = {
                        InvoiceStudents: [
                            {
                                StudentID: this.replicatedInvoice.ID,
                                StudentName: this.replicatedInvoice.Name
                            }
                        ]
                    }
                }
            } catch (error) {
                this.$root.showSnackbar(error.response ? error.response.data.message : error.message)
            } finally{
                this.$emit('isLoading', false)
            }
        },

        filteredStudents(){

            const filtered_students =  this.student_list.filter(student => !this.selected_students_id.includes(student.ID))

            return filtered_students
        },

        //validation rules,
        required,

    }
}
</script>