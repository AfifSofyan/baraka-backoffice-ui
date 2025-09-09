import ScheduleList from "@/views/schedule/pages/ScheduleList.vue";
import ScheduleCreate from "@/views/schedule/pages/ScheduleCreate.vue";
import ScheduleDetail from "@/views/schedule/pages/ScheduleDetail.vue";
import ScheduleEdit from "@/views/schedule/pages/ScheduleEdit.vue";

const routes = [
    {
        path: "jadwal",
        name: "ScheduleList",
        component: ScheduleList
    },
    {
        path: "jadwal/create",
        name: "ScheduleCreate",
        component: ScheduleCreate,
    },
    {
        path: "jadwal/:id",
        name: "ScheduleDetail",
        component: ScheduleDetail
    },
    {
        path: "jadwal/edit/:id",
        name: "ScheduleEdit",
        component: ScheduleEdit
    }
]

export default routes