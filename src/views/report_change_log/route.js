import ResponseList from "@/views/response/pages/ResponseList.vue"
import ResponseCreate from "@/views/response/pages/ResponseCreate.vue"
import ResponseDetail from "@/views/response/pages/ResponseDetail.vue"
import ResponseEdit from "@/views/response/pages/ResponseEdit.vue"
import ReportChangeLogList from "./pages/ReportChangeLogList.vue"

const routes = [
    {
        path: "laporan/changelogs",
        name: "ReportChangeLogList",
        component: ReportChangeLogList
    },
]

export default routes