<template>
    <v-container>
        <BrkTitle 
            title="Notifikasi"
            :useBackButton="true"
            @back="back"
            color="primary"
            class="mb-4"
        />

        <v-table
            v-if="notifications.length > 0"
            density="compact"
            class="px-4"
        >
            <thead>
                <tr>
                    <th></th>
                    <th>Tanggal</th>
                    <th width="100">Title</th>
                    <th>Text</th>
                    <th style="width:150px !important"></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(notification, index) in notifications">
                    <td>
                        <v-icon color="primary">{{ notification.Icon }}</v-icon>
                    </td>
                    <td>{{ $root.formatDate(notification.Date) }}</td>
                    <td>{{ notification.Title }}</td>
                    <td>{{ notification.Text }}</td>
                    <td class="text-right">
                        <!-- <BrkActionButton 
                            :hasDetail="true"
                            @handleDetailClick="() => $router.push(`/backoffice/notification/${notification.ID}`)"
                        /> -->
                        <v-btn v-if="notification.IsRead" elevation="0" density="compact" size="22" class="mx-1" icon @click="() => $router.push(`/backoffice/notification/${notification.ID}`)">
                            <v-icon class="color-primary" size="24">mdi-eye-outline</v-icon>
                        </v-btn>
                        <v-hover v-else>
                            <template v-slot:default="{ isHovering, props }">
                                <v-btn elevation="0" density="compact" size="22" class="mx-1" icon v-bind="props" @click="() => $router.push(`/backoffice/notification/${notification.ID}`)">
                                    <v-icon class="icon-default" color="primary" size="24" :icon="isHovering ? 'mdi-eye-outline' : 'mdi-minus'"></v-icon>
                                </v-btn>
                            </template>
                        </v-hover>
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
</template>

<script>
    import BrkTitle from '@/components/pages/BrkTitle.vue';
    import BrkSearch from '@/components/pages/BrkSearch.vue';
    import BrkPagination from '@/components/pages/BrkPagination.vue';
    import BrkNoData from '@/components/pages/BrkNoData.vue';
    import BrkButton from "@/components/pages/BrkButton.vue";
    import BrkActionButton from '@/components/pages/BrkActionButton.vue';
    import ConfirmationDialog from '@/components/ConfirmationDialog.vue';
    import notificationService from '@/services/notification/notificationService';

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
                page: 1,
                perPage: 15,
                paginationInfo: {},
                notifications: []
            }
        },
        async created(){
            this.loadData()
        },
        methods:{
            async loadData(){
                await this.fetchNotificationData()
            },
            async fetchNotificationData(){
                this.$emit('isLoading', true)

                try {
                    const response = await notificationService.getAllNotifications({
                        page: this.page,
                        perPage: this.perPage
                    })
                    this.notifications = response.data.data

                    this.paginationInfo = response.data.paginationInfo
                } catch (error) {
                    this.$root.showSnackbar(error.response ? error.response.data.message : error.message)
                } finally{
                    this.$emit('isLoading', false)
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
