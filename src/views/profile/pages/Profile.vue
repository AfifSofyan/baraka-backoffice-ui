<template>
    <BrkTitle 
        title="Profil"
        color="primary"
        class="mb-2"
    />
    <v-tabs
        v-model="tab"
        color="secondary"
        align-tabs="start"
    >
        <v-tab value="account">Akun</v-tab>
        <v-tab value="detail">Detail</v-tab>
    </v-tabs>
    <v-window v-model="tab">
        <v-window-item value="account" class="py-8">
            <Account />
        </v-window-item>
        <v-window-item value="detail" class="py-8">
            <AdminDetail v-if="roleID == roleList.find(role => role.Name == 'superadmin').ID || roleID == roleList.find(role => role.Name == 'admin').ID"/>
            <TutorDetail v-if="roleID == roleList.find(role => role.Name == 'tutor').ID"/>
            <StudentDetail v-if="roleID == roleList.find(role => role.Name == 'student').ID"/>
        </v-window-item>
    </v-window>

</template>

<script>
import BrkTitle from '@/components/pages/BrkTitle.vue';
import { role_list } from '@/utils/database-static-records/roles';
import Account from '@/views/profile/components/Account.vue';
import StudentDetail from '@/views/profile/components/StudentDetail.vue';
import TutorDetail from '@/views/profile/components/TutorDetail.vue';
import AdminDetail from '@/views/profile/components/AdminDetail.vue';

export default{
    components:{
        BrkTitle,
        Account,
        StudentDetail,
        TutorDetail,
        AdminDetail,
    },
    data(){
        return {
            roleID: JSON.parse(localStorage.getItem('roleID')),
            roleList: role_list,
            tab: null,
        }
    }
}
</script>