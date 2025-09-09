<template>
    <v-container v-if="isAuthorized">
        <BrkTitle 
            title="Buat Data Tutor Baru"
            :useBackButton="true"
            @back="back"
            color="primary"
            class="mb-4"
        />

        <Form
            type="create"
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
    props:{

    },
    data(){
        return {
            isAuthorized: false,
        }
    },
    async created(){
        this.isAuthorized = await this.$root.isAuthorizedToAccess("Tambah Tutor")
    },
    methods:{
        back(){
            this.$router.push("/backoffice/tutor")
        }
    }

}
</script>