import StudentList from "@/views/student/pages/StudentList.vue";
import StudentCreate from "@/views/student/pages/StudentCreate.vue";
import StudentDetail from "@/views/student/pages/StudentDetail.vue";
import StudentEdit from "@/views/student/pages/StudentEdit.vue";

const routes = [
    {
        path: "siswa",
        name: "StudentList",
        component: StudentList
    },
    {
        path: "siswa/create",
        name: "StudentCreate",
        component: StudentCreate,
    },
    {
        path: "siswa/:id",
        name: "StudentDetail",
        component: StudentDetail,
    },
    {
        path: "siswa/edit/:id",
        name: "StudentEdit",
        component: StudentEdit,
    }
]

export default routes