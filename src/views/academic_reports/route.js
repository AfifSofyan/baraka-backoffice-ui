import Academics from "@/views/academic_reports/pages/Academics.vue"
import AcademicReportCreate from "./pages/AcademicReportCreate.vue"
import AcademicReportDetail from "./pages/AcademicReportDetail.vue"

const routes = [
    {
        path: "laporan/akademik",
        name: "Academics",
        component: Academics
    },
    {
        path: "laporan/akademik/create",
        name: "AcademicReportCreate",
        component: AcademicReportCreate
    },
    {
        path: "laporan/akademik/detail/:id",
        name: "AcademicReportDetail",
        component: AcademicReportDetail
    }
]

export default routes