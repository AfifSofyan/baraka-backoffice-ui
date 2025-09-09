<template>
    <v-dialog v-model="showConfirmationDialog" width="550" persistent>
        <v-card>
            <v-card-title v-if="title" class="pl-6 color-secondary">{{ title }}</v-card-title>

            <v-card-text>
                <p class="text-justify">{{ confirmationText }}</p>
            </v-card-text>

            <v-card-actions>
                <v-spacer/>
                <v-btn
                    variant="plain"
                    color="danger"
                    @click="() => $emit('handleCancel')"
                >
                BATAL
                </v-btn>
                <v-btn
                    variant="plain"
                    color="primary"
                    @click="() => $emit('handleOK')"
                >
                OK
                </v-btn>
                <v-spacer/>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
    export default{
        props:{
            isOpen:{
                type:Boolean,
                required:true
            },
            confirmationText:{
                type:String,
                required:true
            },
            title:{
                type:String
            }
        },
        data(){
            return{
                showConfirmationDialog:false
            }
        },
        watch:{
            isOpen(newVal, oldVal){
                this.showConfirmationDialog = newVal

            },
            modal(newVal, oldVal){
                if(!newVal){
                    this.$emit('handleCancel')
                }
            }
        },
    }
</script>