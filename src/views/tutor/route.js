import TutorList from "@/views/tutor/pages/TutorList.vue";
import TutorCreate from "@/views/tutor/pages/TutorCreate.vue";
import TutorDetail from "@/views/tutor/pages/TutorDetail.vue";
import TutorEdit from "@/views/tutor/pages/TutorEdit.vue";

const routes = [
    {
        path: "tutor",
        name: "TutorList",
        component: TutorList
    },
    {
        path: "tutor/create",
        name: "TutorCreate",
        component: TutorCreate,
    },
    {
        path: "tutor/:id",
        name: "TutorDetail",
        component: TutorDetail,
    },
    {
        path: "tutor/edit/:id",
        name: "TutorEdit",
        component: TutorEdit,
    }
]

export default routes