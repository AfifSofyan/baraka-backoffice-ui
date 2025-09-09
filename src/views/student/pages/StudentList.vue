<template>
    <v-container v-if="isAuthorized">
        <BrkTitle 
            title="Daftar Siswa"
            :useBackButton="true"
            @back="back"
            color="primary"
            class="mb-4"
        />
        
        <v-container>
            <v-row class="mx-1 mb-4">
                <BrkButton
                    v-if="$root.hasAccess('Tambah Siswa')"
                    buttonText="Tambah Siswa"
                    icon="mdi-plus"
                    color="primary"
                    @click="() => $router.push('/backoffice/siswa/create')"
                />
            </v-row>
            <v-row>
                <v-col cols="12" sm="6" md="5" class="py-0">
                    <BrkSearch
                        placeholder="Cari nama, telp, alamat atau sekolah ..."
                        @isLoading="() => $emit('isLoading', true)"
                        @handleSearchChange="handleSearchChange"
                    />
                </v-col>
                <v-col cols="12" sm="5" md="4" class="py-0">
                    <v-autocomplete 
                        v-model="studentStatusID"
                        label="Status Siswa"
                        :items="student_status_list"
                        item-title="Name"
                        item-value="ID"
                        @update:model-value="handleStudentStatusChange"
                        variant="outlined"
                        
                    />
                </v-col>
            </v-row>
        </v-container>

        <v-table
            v-if="studentList.length > 0"
            density="compact"
            class="px-4"
        >
            <thead>
                <tr>
                    <th>No</th>
                    <th>Nama</th>
                    <th width="100">Gender</th>
                    <th>Kelas</th>
                    <th>Program</th>
                    <th style="width:150px !important"></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(student, index) in studentList">
                    <td>{{ perPage * ( page - 1 ) + index + 1 }}</td>
                    <td>
                        <span>{{ student.Name }}</span>
                        <v-icon class="ml-4" color="#d82c2c" v-if="student.StatusName == 'Pendaftar Baru'">mdi-new-box</v-icon>
                    </td>
                    <td>{{ student.GenderName }}</td>
                    <td>{{ student.GradeName }}</td>
                    <td>{{ student.ProgramName }}</td>
                    <td class="text-right">
                        <BrkActionButton 
                            :hasDetail="$root.hasAccess('Detail Siswa')"
                            :hasEdit="$root.hasAccess('Edit Siswa')"
                            :hasDelete="student.StatusName == 'Pendaftar Baru'"
                            @handleDetailClick="() => $router.push(`/backoffice/siswa/${student.ID}`)"
                            @handleEditClick="() => $router.push(`/backoffice/siswa/edit/${student.ID}`)"
                            @handleDeleteClick="handleDeleteStudent(student)"
                        />
                    </td>
                </tr>
            </tbody>
        </v-table>
        <BrkNoData v-else/>


        <BrkPagination 
            :initialPage="page"
            :initialPerPage="perPage"
            :paginationInfo="paginationInfo"
            @handlePageChange="handlePageChange"
            @handlePerPageChange="handlePerPageChange"
        />
    </v-container>

    <ConfirmationDialog
        :isOpen="showDeleteConfirmationDialog"
        :confirmationText="deleteConfirmationText"
        @handleCancel="showDeleteConfirmationDialog = false"
        @handleOK="deleteStudent"
    />
</template>

<script>
    import { EventBus } from "@/eventBus";
    import BrkTitle from '@/components/pages/BrkTitle.vue';
    import BrkSearch from '@/components/pages/BrkSearch.vue';
    import BrkPagination from '@/components/pages/BrkPagination.vue';
    import BrkNoData from '@/components/pages/BrkNoData.vue';
    import BrkButton from "@/components/pages/BrkButton.vue";
    import BrkActionButton from '@/components/pages/BrkActionButton.vue';
    import ConfirmationDialog from '@/components/ConfirmationDialog.vue';
    import studentService from '@/services/student/studentService.js';
    import { student_status_list } from '@/utils/database-static-records/student_status.js';

    export default {
        components:{
            BrkTitle,
            BrkSearch,
            BrkPagination,
            BrkNoData,
            BrkButton,
            BrkActionButton,
            ConfirmationDialog
        },
        data(){
            return {
                isAuthorized: false,
                searchText: "",
                studentStatusID: student_status_list.find(status => status.Name == "Aktif").ID,
                student_status_list: student_status_list,
                page: 1,
                perPage: 10,
                studentList: [],
                paginationInfo: {},

                selectedStudentToDelete: null,
                showDeleteConfirmationDialog: false,
                deleteConfirmationText: ''

            }
        },
        async created(){
            this.isAuthorized = await this.$root.isAuthorizedToAccess("Siswa")
            this.loadData()
        },
        methods:{
            async loadData(){
                await this.fetchStudentData()
            },
            async fetchStudentData(){
                this.$emit('isLoading', true)
                try {
                    const response = await studentService.getStudentList({
                        searchText: this.searchText,
                        studentStatusID: this.studentStatusID,
                        page: this.page,
                        perPage: this.perPage
                    })

                    this.studentList = response.data.data
                    this.paginationInfo = response.data.paginationInfo
                } catch (error) {
                    this.$root.showSnackbar(error.response ? error.response.data.message : error.message)
                } finally{
                    this.$emit('isLoading', false)
                }
            },
            handleDeleteStudent(student){
                if(student.StatusName != 'Pendaftar Baru'){
                    this.$root.showSnackbar('Anda Tidak Dapat Menghapus Data Siswa')
                }else{
                    this.selectedStudentToDelete = student
                    this.deleteConfirmationText = `Anda akan menghapus siswa pendaftar baru atas nama ${this.selectedStudentToDelete.Name}. Lanjutkan?`
                    this.showDeleteConfirmationDialog = true
                }
            },
            async deleteStudent(){
                try {
                    this.$emit('isLoading', true)

                    const data = await studentService.deleteStudent(this.selectedStudentToDelete.ID)

                    await this.loadData()

                    EventBus.emit('CheckTotalNewRegistrants')

                    this.showDeleteConfirmationDialog = false

                    this.$emit('isLoading', false)
                } catch (error) {
                    this.$root.showSnackbar(error.response ? error.response.data.message : error.message);
                }
            },
            async handleSearchChange(searchText){
                this.page = 1
                this.searchText = searchText
                await this.loadData()
            },
            async handleStudentStatusChange(){
                this.page = 1
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