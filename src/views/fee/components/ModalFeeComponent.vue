<template>
    <v-dialog max-width="600">
        <template v-slot:activator="{ props: activatorProps }">
            <v-btn
                v-bind="activatorProps"
                text="+ Tambah Komponen Fee"
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
                                v-model="selectedFeeComponentID"
                                label="Komponen Fee"
                                :items="filteredFeeComponents()"
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
                        v-if="selectedFeeComponent"
                        density="compact"
                        class="mb-8"
                    >
                        <thead>
                            <th class="text-left pl-4">Komponen Fee</th>
                            <th class="text-right pr-4">Fee</th>
                        </thead>
                        <tbody>
                            <tr v-if="selectedFeeComponent.ID != -1">
                                <td class="text-left">{{ selectedFeeComponent.Name }}</td>
                                <td class="text-right">{{ $root.formatRupiah(parseInt(selectedFeeComponent.Price)) }}</td>
                            </tr>
                            <tr v-else>
                                <td class="text-left">{{ selectedFeeComponent.Name }}</td>
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
        fee_component_list:{
            type:Array
        },
        selected_fee_components_id:{
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
            feeComponentID: null,
            selectedFeeComponentID:null,
            selectedFeeComponent:null,
            feeComponentData: null,

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

            this.$emit('onSubmitData', this.feeComponentData)
            this.closeModal()
        },
        handleCancel(){            
            this.closeModal()
        },
        closeModal(){
            this.selectedFeeComponentID = null
            this.selectedFeeComponent = null
            this.feeComponentID = null
            this.$refs.close.$el.click()
        },
        filteredFeeComponents(){

            const filtered_fee_components =  this.fee_component_list.filter(component => component.ID === -1 || !this.selected_fee_components_id.includes(component.ID))

            return filtered_fee_components
        },
        selectComponent(){
            this.selectedFeeComponent = this.filteredFeeComponents().find(component => component.ID === this.selectedFeeComponentID)
            this.feeComponentData = this.filteredFeeComponents().find(component => component.ID === this.selectedFeeComponentID)
        },

        //validation rules,
        required,

    }
}
</script>