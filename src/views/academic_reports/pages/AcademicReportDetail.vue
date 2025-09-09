<template>
    <v-container v-if="isAuthorized">
        <BrkTitle 
            title="Detail Laporan Akademik"
            :useBackButton="true"
            @back="back"
            color="primary"
            class="mb-4"
        />

        <Form
            type="detail"
            @isLoading="(state) => $emit('isLoading', state)"
        />
</v-container>
</template>

<script>
import BrkTitle from '@/components/pages/BrkTitle.vue';
import Form from '../components/Form.vue';

export default{
    emits: ['isLoading'],
    components:{
        BrkTitle,
        Form
    },
    data(){
        return {
            isAuthorized: false
        }
    },
    async created(){
        this.isAuthorized = await this.$root.isAuthorizedToAccess("Detail Laporan Akademik")
    },
    methods:{
        back(){
            this.$router.push("/backoffice/fee")
        }
    }

}
</script>