<template>
    <v-container v-if="isAuthorized">
        <BrkTitle 
            title="Form Akademik"
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
        this.isAuthorized = await this.$root.isAuthorizedToAccess("Detail Responsi")
    },
    methods:{
        back(){
            this.$router.push("/backoffice/laporan/responsi")
        }
    }

}
</script>