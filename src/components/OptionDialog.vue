<template>
    <v-dialog v-model="showOptionDialog" width="550" persistent>
        <v-card>
            <v-card-text>
                {{ optionText }}
            </v-card-text>

            <v-card-actions>
                <v-spacer/>
                <v-btn
                    variant="plain"
                    @click="() => $emit('handleCancel')"
                >
                BATAL
                </v-btn>
                <v-btn
                    variant="plain"
                    @click="() => $emit('handleOpt1')"
                >
                {{ opt1 }}
                </v-btn>
                <v-btn
                    variant="plain"
                    @click="() => $emit('handleOpt2')"
                >
                {{ opt2 }}
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
            optionText:{
                type:String,
                required:true
            },
            opt1:{
                type:String,
                required:true
            },
            opt2:{
                type:String,
                required:true
            }
        },
        data(){
            return{
                showOptionDialog:false
            }
        },
        watch:{
            isOpen(newVal, oldVal){
                this.showOptionDialog = newVal

            },
            modal(newVal, oldVal){
                if(!newVal){
                    this.$emit('handleCancel')
                }
            }
        },
    }
</script>