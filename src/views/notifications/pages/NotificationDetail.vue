<template>
    <v-container>
        <!-- <BrkTitle 
            title="Detail Notifikasi"
            :useBackButton="true"
            @back="back"
            color="primary"
            class="mb-4"
        /> -->
        <div v-if="notification" class="ma-4">
            <h5 class="text-h5">{{ notification.Title }}</h5>  
            <p class="mt-4">{{ notification.Text }}</p>

            <v-btn v-if="notification.RedirectUrl" class="mt-4" @click="onActionClick">{{ notification.ActionTitle }}</v-btn>
        </div>
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
                notification: null
            }
        },
        computed: {
            id() {
                return this.$route.params.id;
            },
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
                    const response = await notificationService.getNotificationDetail(this.id)
                    this.notification = response.data[0]

                    if(!this.notification.IsRead){
                        await notificationService.markNotificationAsRead(this.id)
                    }
                } catch (error) {
                    this.$root.showSnackbar(error.response ? error.response.data.message : error.message)
                } finally{
                    this.$emit('isLoading', false)
                }
            },
            onActionClick(){
              if(this.notification.RedirectUrl.includes('backoffice')){
                this.$router.push(this.notification.RedirectUrl)
              }else if(this.notification.RedirectUrl.includes('document')){
                const routeUrl = this.$router.resolve({ path: this.notification.RedirectUrl }).href;
                window.open(routeUrl, '_blank');
              }
            },
            back(){
                this.$router.push("/backoffice/notification")
            }
        }
    }
</script>