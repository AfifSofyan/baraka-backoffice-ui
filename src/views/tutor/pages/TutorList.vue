<template>
    <v-container v-if="isAuthorized">
        <BrkTitle 
            title="Daftar Tutor"
            :useBackButton="true"
            @back="back"
            color="primary"
            class="mb-4"
        />
        
        <v-container>
            <v-row class="mx-1 mb-4">
                <BrkButton
                    v-if="$root.hasAccess('Tambah Tutor')"
                    buttonText="Tambah Tutor"
                    icon="mdi-plus"
                    color="primary"
                    @click="() => $router.push('/backoffice/tutor/create')"
                />
            </v-row>
            <v-row>
                <v-col cols="12" sm="6" md="5" class="py-0">
                    <BrkSearch
                        placeholder="Cari nama atau telp ..."
                        @isLoading="() => $emit('isLoading', true)"
                        @handleSearchChange="handleSearchChange"
                    />
                </v-col>
                <!-- <v-col cols="12" sm="5" md="4" class="py-0">
                    <v-autocomplete 
                        v-model="capabilityID"
                        label="Mata Pelajaran"
                        :items="capabilityList"
                        item-title="SubjectToTeach"
                        item-value="ID"
                        @update:model-value="handleCapabilityChange"
                        variant="outlined"
                        
                    />
                </v-col> -->
                <v-col cols="12" sm="5" md="4" class="py-0">
                    <v-autocomplete 
                        v-model="isDraft"
                        label="Status Keaktifan Tutor"
                        :items="
                            [
                                {
                                    ID:0,
                                    Name:'Aktif'
                                },
                                {
                                    ID:1,
                                    Name:'Pendaftar Baru'
                                }
                            ]
                        "
                        item-title="Name"
                        item-value="ID"
                        @update:model-value="handleIsDraftChange"
                        variant="outlined"
                        
                    />
                </v-col>
            </v-row>
        </v-container>

        <v-table
            v-if="tutorList.length > 0"
            density="compact"
            class="px-4"
        >
            <thead>
                <tr>
                    <th>No</th>
                    <th>Nama</th>
                    <th width="100">Gender</th>
                    <th>Jurusan</th>
                    <th>Perguruan Tinggi</th>
                    <th style="width:150px !important"></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(tutor, index) in tutorList">
                    <td>{{ perPage * ( page - 1 ) + index + 1 }}</td>
                    <td>
                        <span>{{ tutor.Name }}</span>
                        <v-icon class="ml-4" color="#d82c2c" v-if="tutor.IsDraft">mdi-new-box</v-icon>
                    </td>
                    <td>{{ tutor.GenderName }}</td>
                    <td>{{ tutor.Major }}</td>
                    <td>{{ tutor.College }}</td>
                    <td class="text-right">
                        <BrkActionButton 
                            :hasDetail="$root.hasAccess('Detail Tutor')"
                            :hasEdit="$root.hasAccess('Edit Tutor')"
                            :hasDelete="tutor.IsDraft"
                            @handleDetailClick="() => $router.push(`/backoffice/tutor/${tutor.ID}`)"
                            @handleEditClick="() => $router.push(`/backoffice/tutor/edit/${tutor.ID}`)"
                            @handleDeleteClick="handleDeleteTutor(tutor)"
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
        @handleOK="deleteTutor"
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
    import tutorService from '@/services/tutor/tutorService.js';
    import capabilityService from '@/services/capability/capabilityService.js';

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
                isAuthorized:false,
                searchText: "",
                isDraft: 0,
                capabilityID: null,
                capabilityList: [],
                page: 1,
                perPage: 10,
                tutorList: [],
                paginationInfo: {},

                selectedTutorToDelete: null,
                showDeleteConfirmationDialog: false,
                deleteConfirmationText: ''
            }
        },
        async created(){
            this.isAuthorized = await this.$root.isAuthorizedToAccess("Tutor")
            this.$emit('isLoading', true)

            await this.fetchCapabilityData()
            await this.loadData()
        },
        methods:{
            async loadData(){
                await this.fetchTutorData()
            },
            async fetchTutorData(){
                this.$emit('isLoading', true)
                try {
                    const response = await tutorService.getTutorList({
                        searchText: this.searchText,
                        capabilityID: this.capabilityID,
                        isDraft: this.isDraft,
                        page: this.page,
                        perPage: this.perPage
                    })

                    this.tutorList = response.data.data
                    this.paginationInfo = response.data.paginationInfo
                } catch (error) {
                    console.log(error)
                    this.$root.showSnackbar(error.response ? error.response.data.message : error.message)
                } finally{
                    this.$emit('isLoading', false)
                }
            },
            async fetchCapabilityData(){
                try {
                    const response = await capabilityService.getCapabilityList()

                    this.capabilityList = response.data
                } catch (error) {
                    this.$root.showSnackbar(error.response ? error.response.data.message : error.message)
                }
            },
            async handleSearchChange(searchText){
                this.page = 1
                this.searchText = searchText
                await this.loadData()
            },
            async handleCapabilityChange(){
                this.page = 1
                await this.loadData()
            },
            async handleIsDraftChange(){
                this.page = 1
                await this.loadData()
            },
            handleDeleteTutor(tutor){
                if(!tutor.IsDraft){
                    this.$root.showSnackbar('Anda Tidak Dapat Menghapus Data Tutor')
                }else{
                    this.selectedTutorToDelete = tutor
                    this.deleteConfirmationText = `Anda akan menghapus tutor pendaftar baru atas nama ${this.selectedTutorToDelete.Name}. Lanjutkan?`
                    this.showDeleteConfirmationDialog = true
                }
            },
            async deleteTutor(){
                try {
                    this.$emit('isLoading', true)

                    const data = await tutorService.deleteTutor(this.selectedTutorToDelete.ID)

                    await this.loadData()

                    EventBus.emit('CheckTotalNewRegistrants')

                    this.showDeleteConfirmationDialog = false

                    this.$emit('isLoading', false)
                } catch (error) {
                    this.$root.showSnackbar(error.response ? error.response.data.message : error.message);
                }
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