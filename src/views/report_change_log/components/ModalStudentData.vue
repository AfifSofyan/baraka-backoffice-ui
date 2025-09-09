<template>
    <v-dialog max-width="700">
        <template v-slot:activator="{ props: activatorProps }">
            <v-btn
                v-bind="activatorProps"
                text="Tambah Data Siswa"
                variant="tonal"
                color="primary"
                elevation="2"
                rounded="lg"
                @click="initData"
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
                    <v-row>
                        <v-col cols="12" md="6" class="my-0">
                            <v-autocomplete 
                                v-model="form.StudentID"
                                label="Siswa"
                                :items="filteredStudents()"
                                item-title="Name"
                                item-value="ID"
                                variant="outlined"
                                :rules="[required]"    
                                :readonly="type == 'detail'"
                            />
                            <v-text-field 
                                label="Topik"
                                v-model="form.Topic"
                                variant="outlined"
                                :rules="[required]"
                                :readonly="type == 'detail'"
                            />
                            <v-autocomplete 
                                v-model="form.AffectiveID"
                                label="Penilaian Afektif"
                                :items="affective_list"
                                item-title="Name"
                                item-value="ID"
                                variant="outlined"
                                :rules="[required]"    
                                :readonly="type == 'detail'"
                            />                
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" class="my-0 px-3">
                            <v-label class="pb-4 px-4">Skor Kuis</v-label>
                            <v-slider
                                v-model="form.Score"
                                :step="1"
                                max="10"
                                min="0"
                                show-ticks="always"
                                thumb-label="always"
                                tick-size="4"
                            />
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" class="my-0">
                            <div class="mb-4 font-12 font-italic font-weight-light text-justify">
                                <p>Catatan Hasil Pembelajaran harus mencakup:</p>
                                <p>1. Capaian pemahaman siswa terkait setiap teori/prinsip/persamaan/rumus/dll.</p>
                                <p>2. Kemampuan siswa dalam menyelesakan soal (jika melakukan latihan soal) untuk setiap tingkatan yang berbeda.</p>
                                <p>3. Materi apa yang belum/kurang dipahami siswa dan strategi pembelajaran berikutnya.</p>
                                <p>CONTOH:</p>
                                <p>Alhamdulillah ananda sudah mampu memahami materi tentang hukum ohm dan daya listrik dengan baik dan dapat menyelesaikan soal-soal sederhana tentang materi ini dengan tepat. Akan tetapi ananda terkadang masih belum mampu menyelesaikan soal-soal pengembangan tentang materi ini (seperti mengonversi rumus daya untuk besaran I,R dan besaran V,R) dengan cukup baik. Perlu memperbanyak latihan untuk menyelesaikan soal-soal daya tersebut dengan berbagai variasi rumus.</p>
                            </div>
                            <v-textarea
                                v-model="form.Note"
                                variant="outlined"
                                label="Catatan Hasil Pembelajaran"
                                :rules="[required, minLength(150)]"
                                :counter="150"
                            />
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" md="6" class="my-0">
                            <v-text-field 
                                label="Materi Selanjutnya"
                                v-model="form.NextTopic"
                                variant="outlined"
                                :rules="[required]"
                                :readonly="type == 'detail'"
                            />
                        </v-col>
                    </v-row>

                    <div class="d-flex justify-end" v-if="type !='detail'">
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
                            @click="handleSubmit()"
                        />
                    </div>
                </v-form>
            </v-card>
        </template>        
    </v-dialog>
</template>

<script>
import BrkDatePicker from "@/components/pages/BrkDatePicker.vue";
import BrkTimePicker from "@/components/pages/BrkTimePicker.vue";
import BrkButton from "@/components/pages/BrkButton.vue";
import ConfirmationDialog from "@/components/ConfirmationDialog.vue";
import { affective_list } from "@/utils/database-static-records/affective.js";
import { required, minLength } from '@/utils/app/validator.js';

export default{
    props:{
        type:{
            type:String
        },
        subject_list:{
            type:Array
        },
        student_list:{
            type:Array
        },
        selected_students_id:{
            type:Array
        },
        selected_student_data:{
            type:Object
        }
    },
    components:{
        BrkDatePicker,
        BrkTimePicker,
        BrkButton,
        ConfirmationDialog
    },
    data(){
        return{
            validForm: false,
            form:{
                // reports model
                StudentID: null,
                SubjectID: null,
                Topic: null,
                Score: 5,
                AffectiveID: 1,
                Note: null,
                NextTopic: null,
                // reports model
                
            },

            // static database records related to reports
            affective_list: affective_list,
            // static database records related to reports

            // non-static database records related to reports
            studentList: this.student_list,
            subjectList: this.subject_list,
            // non-static database records related to reports


            // other variables related to form
            affective_ticks_labels:  affective_list.reduce((acc, obj) => {
                acc[obj.ID] = obj.Name;
                return acc;
            }, {}),

            dialogIsActive: false,
            // other variables related to form
        }
    },
    methods:{
        initData(){
            this.form = {
                StudentID: null,
                SubjectID: null,
                Topic: null,
                Score: 5,
                AffectiveID: 1,
                Note: null,
                NextTopic: null,
            }
        },
        handleSubmit(){

            if(!this.validForm){
                return
            }

            this.$emit('onSubmitData', this.form)
            this.closeModal()
        },
        handleCancel(){            
            this.closeModal()
        },
        closeModal(){
            this.$refs.close.$el.click()
        },
        score(val){
            return this.scores[val - 1]
        },
        filteredStudents(){
            const filtered_students =  this.student_list.filter(student => !this.selected_students_id.includes(student.ID))

            return filtered_students
        },


        // validator functions

        required,
        minLength
    }
}
</script>

<style scoped>
    .custom-slider{
        font-size: 12px;
    }
</style>