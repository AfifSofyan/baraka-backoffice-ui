<template>
    <v-dialog v-model="modal" width="500" persistent>
        <v-form 
            v-model="validForm"
            @submit.prevent
        >
            <v-card class="pb-4">
                <v-toolbar color="secondary" class="color-white">
                    <v-card-title>
                        Catatan Presensi
                    </v-card-title>

                    <v-spacer/>

                    <v-btn 
                        icon
                        variant="plain"
                        @click="handleModalClose"
                    >
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-toolbar>

                <v-card-text>
                    <div class="mb-8 mt-2 color-slate" v-if="selectedNote" style="font-size: 14px;">
                        <p><span class="d-inline-block" style="width:140px">Tutor</span> : {{ selectedNote.TutorName }}</p>
                        <p><span class="d-inline-block" style="width:140px">Siswa</span> : {{ selectedNote.StudentName }}</p>
                        <p><span class="d-inline-block" style="width:140px">Tanggal</span> : {{ $root.formatDate(selectedNote.Date) }}</p>
                        <p><span class="d-inline-block" style="width:140px">Dibuat Oleh</span> : {{ selectedNote.CreatedByName }}</p>
                        <p
                            v-if="selectedNote.CreatedDate != selectedNote.UpdatedDate"
                        ><span class="d-inline-block" style="width:140px">Diperbaharui Oleh</span> : {{ selectedNote.UpdatedByName }}</p>
                    </div>
                    <div class="mb-8 mt-2 color-slate" v-else style="font-size: 14px;">
                        <p><span class="d-inline-block" style="width:140px">Tutor</span> : {{ cardDetail.TutorName }}</p>
                        <p><span class="d-inline-block" style="width:140px">Siswa</span> : {{ cardDetail.StudentName }}</p>
                        <p><span class="d-inline-block" style="width:140px">Tanggal</span> : {{ $root.formatDate(cardDetail.Date) }}</p>
                    </div>
                    <v-text-field 
                        variant="outlined"
                        label="catatan"
                        v-model="form.Note"
                        :rules="[required]"
                    />
                </v-card-text>

                <v-radio-group 
                    v-model="form.TypeID" 
                    inline 
                    class="px-4 py-0"
                    color="secondary"
                    :rules="[required]"
                >
                    <v-radio 
                        v-for="noteType in presenceNoteTypeList" 
                        :label="noteType.Name"
                        :value="noteType.ID"
                    ></v-radio>
                </v-radio-group>

                <v-card-actions class="pr-6">
                    <v-spacer />

                    <BrkButton 
                        v-if="selectedNote && $root.hasAccess('Edit Catatan Presensi')"
                        buttonText="Edit"
                        color="secondary"
                        icon="mdi-pencil-outline"
                        type="submit"
                        @click="handleSubmit('edit')"
                    />

                    <BrkButton 
                        v-if="selectedNote && $root.hasAccess('Hapus Catatan Presensi')"
                        buttonText="Hapus"
                        color="danger"
                        icon="mdi-trash-can-outline"
                        @click="handleSubmit('delete')"
                    />

                    <BrkButton 
                        v-if="!selectedNote && $root.hasAccess('Tambah Catatan Presensi')"
                        buttonText="Tambah Catatan"
                        color="secondary"
                        icon="mdi-plus"
                        type="submit"
                        @click="handleSubmit('add')"
                    />

                </v-card-actions>
            </v-card>

            <ConfirmationDialog
                :isOpen="showConfirmationDialog"
                :confirmationText="confirmationText"
                @handleCancel="showConfirmationDialog = false"
                @handleOK="submit"
            />
        </v-form>
    </v-dialog>
</template>

<script>
import { presence_note_type_list } from '@/utils/database-static-records/presence_note_type.js';
import BrkButton from '@/components/pages/BrkButton.vue';
import { required } from '@/utils/app/validator';
import ConfirmationDialog from '@/components/ConfirmationDialog.vue';
import presenceService from '@/services/presence/presenceService.js';

export default{
    props:{
        isOpen:{
            type:Boolean,
            required:true
        },
        selectedNote:{
            type:Object
        },
        cardDetail:{
            type:Object
        }
    },
    components:{
        BrkButton,
        ConfirmationDialog,
    },
    data(){
        return {
            modal:this.isOpen,
            presenceNoteTypeList: presence_note_type_list,
            form:{
                Note:null,
                TypeID:null,
                ReportID:null,
                ScheduleID:null,
                Date:null
            },

            showConfirmationDialog:false,
            confirmationText:'',

            validForm:false,
            submitType:null,
            submitText:{
                add: "Anda akan menambahkan catatan presensi. Lanjutkan?",
                edit: "Anda akan memperbaharui catatan presensi tersebut. Lanjutkan?",
                delete: "Anda akan menghapus catatan presensi tersebut. Lanjutkan?"
            }
        }
    },
    watch:{
        isOpen(newVal, oldVal){
            this.modal = newVal
            this.form.Note = this.selectedNote ? this.selectedNote.Note : null,
            this.form.TypeID = this.selectedNote ? this.selectedNote.TypeID : null

        },
        modal(newVal, oldVal){
            if(!newVal){
                this.$emit('handleModalClose')
            }
        }
    },
    methods:{
        handleModalClose(){
            this.modal = false
            this.$emit('handleModalClose')
        },
        handleSubmit(submitType){
            if(!this.validForm){
                return
            }
            this.submitType = submitType
            this.showConfirmationDialog = true
            this.confirmationText = this.submitText[this.submitType]
            
        },
        async submit(){
            try {
                if(this.submitType === 'add'){
                    if(this.cardDetail.Type === 'schedule'){
                        this.form = {
                            ...this.form,
                            ScheduleID : this.cardDetail.ScheduleID,
                            Date: this.cardDetail.Date
                        }

                        await this.createPresenceScheduleNote()
                    }
                    if(this.cardDetail.Type === 'report'){
                        this.form = {
                            ...this.form,
                            ReportID : this.cardDetail.ReportID,
                            Date: this.$root.formatDate(this.cardDetail.Date, 'inputDate')
                        }

                        await this.createPresenceReportNote()
                    }
                }
                else if(this.submitType === 'delete'){
                    if(this.selectedNote.ScheduleID != null){
                        await this.deletePresenceScheduleNote()
                    }else if(this.selectedNote.ReportID != null){
                        await this.deletePresenceReportNote()
                    }
                }
                else if(this.submitType === 'edit'){
                    if(this.selectedNote.ScheduleID != null){
                        await this.updatePresenceScheduleNote()
                    }else if(this.selectedNote.ReportID != null){
                        await this.updatePresenceReportNote()
                    }
                }
            } catch (error) {
                this.$root.showSnackbar(error.response ? error.response.data.message : error.message)
            }
        },
        async createPresenceScheduleNote(){
            const data = await presenceService.createPresenceScheduleNote(this.form)

            this.$root.showSnackbar(data.message)

            this.showConfirmationDialog = false
            this.$emit('handleModalClose')

            this.$emit('handleCreateScheduleNote', data.data[0])
        },
        async updatePresenceScheduleNote(){
            const data = await presenceService.updatePresenceScheduleNote(this.form, this.selectedNote.ID)

            this.$root.showSnackbar(data.message)

            this.showConfirmationDialog = false
            this.$emit('handleModalClose')

            this.$emit('handleUpdateScheduleNote', data.data[0])
        },
        async deletePresenceScheduleNote(){
            const data = await presenceService.deletePresenceScheduleNote(this.selectedNote.ID)

            this.$root.showSnackbar(data.message)

            this.showConfirmationDialog = false
            this.$emit('handleModalClose')

            this.$emit('handleDeleteScheduleNote', this.selectedNote)
        },
        async createPresenceReportNote(){
            const data = await presenceService.createPresenceReportNote(this.form)

            this.$root.showSnackbar(data.message)

            this.showConfirmationDialog = false
            this.$emit('handleModalClose')

            this.$emit('handleCreateReportNote', data.data[0])
        },
        async updatePresenceReportNote(){
            const data = await presenceService.updatePresenceReportNote(this.form, this.selectedNote.ID)

            this.$root.showSnackbar(data.message)

            this.showConfirmationDialog = false
            this.$emit('handleModalClose')

            this.$emit('handleUpdateReportNote', data.data[0])
        },
        async deletePresenceReportNote(){
            const data = await presenceService.deletePresenceReportNote(this.selectedNote.ID)

            this.$root.showSnackbar(data.message)

            this.showConfirmationDialog = false
            this.$emit('handleModalClose')

            this.$emit('handleDeleteReportNote', this.selectedNote)
        },


        required,
    }
}
</script>