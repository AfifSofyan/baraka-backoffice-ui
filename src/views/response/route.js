import ResponseList from "@/views/response/pages/ResponseList.vue"
import ResponseCreate from "@/views/response/pages/ResponseCreate.vue"
import ResponseDetail from "@/views/response/pages/ResponseDetail.vue"
import ResponseEdit from "@/views/response/pages/ResponseEdit.vue"

const routes = [
    {
        path: "laporan/responsi",
        name: "ResponseList",
        component: ResponseList
    },
    {
        path: "laporan/responsi/create",
        name: "ResponseCreate",
        component: ResponseCreate
    },
    {
        path: "laporan/responsi/:id",
        name: "ResponseDetail",
        component: ResponseDetail
    },
    {
        path: "laporan/responsi/edit/:id",
        name: "ResponseEdit",
        component: ResponseEdit
    }
]

export default routes