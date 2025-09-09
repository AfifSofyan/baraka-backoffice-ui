<template>
    <v-dialog max-width="600">
        <template v-slot:activator="{ props: activatorProps }">
            <v-btn
                v-bind="activatorProps"
                text="+ Tambah Komponen Invoice"
                variant="tonal"
                color="secondary"
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
                                v-model="selectedInvoiceComponentID"
                                label="Komponen Invoice"
                                :items="filteredInvoiceComponents()"
                                item-title="Name"
                                item-value="ID"
                                variant="outlined"
                                :readonly="type == 'detail'"
                                :rules="[required]"
                                @update:model-value="selectComponent()"
                            />
                        </v-col>
                    </v-row>

                    <v-table 
                        v-if="selectedInvoiceComponent"
                        density="compact"
                        class="mb-8"
                    >
                        <thead>
                            <th class="text-left pl-4">Komponen Invoice</th>
                            <th class="text-right pr-4">Biaya / 90 Menit</th>
                        </thead>
                        <tbody>
                            <tr v-if="selectedInvoiceComponent.ID != -1">
                                <td class="text-left">{{ selectedInvoiceComponent.Name }}</td>
                                <td class="text-right">{{ $root.formatRupiah(parseInt(selectedInvoiceComponent.Cost)) }}</td>
                            </tr>
                            <tr v-else>
                                <td class="text-left">{{ selectedInvoiceComponent.Name }}</td>
                                <td class="text-right">0</td>
                            </tr>
                        </tbody>
                    </v-table>

                    <div class="d-flex justify-end">
                        <BrkButton
                            buttonText="Batal"
                            color="danger"
                            @click="handleCancel()"
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
import { required } from '@/utils/app/validator.js';

export default{
    props:{
        type:{
            type:String
        },
        invoice_component_list:{
            type:Array
        },
        selected_invoice_components_id:{
            type:Array
        }
    },
    emits: ['isLoading', 'onSubmitData'],
    components:{
        BrkButton,
        ConfirmationDialog
    },
    data(){
        return{
            invoiceComponentID: null,
            selectedInvoiceComponentID:null,
            selectedInvoiceComponent:null,
            invoiceComponentData: null,

            // other variables related to form
            validForm: false,
            dialogIsActive: false,
            // other variables related to form
        }
    },
    methods:{
        
        handleSubmit(){

            if(!this.validForm){
                return
            }

            this.$emit('onSubmitData', this.invoiceComponentData)
            this.closeModal()
        },
        handleCancel(){            
            this.closeModal()
        },
        closeModal(){
            this.selectedInvoiceComponentID = null
            this.selectedInvoiceComponent = null
            this.invoiceComponentID = null
            this.$refs.close.$el.click()
        },
        filteredInvoiceComponents(){

            const filtered_invoice_components =  this.invoice_component_list.filter(component => component.ID === -1 || !this.selected_invoice_components_id.includes(component.ID))

            return filtered_invoice_components
        },
        selectComponent(){
            this.selectedInvoiceComponent = this.filteredInvoiceComponents().find(component => component.ID === this.selectedInvoiceComponentID)
            this.invoiceComponentData = this.filteredInvoiceComponents().find(component => component.ID === this.selectedInvoiceComponentID)
        },

        //validation rules,
        required,

    }
}
</script>