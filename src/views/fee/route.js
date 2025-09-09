import Fee from "@/views/fee/pages/Fee.vue"
import FeeCreate from "@/views/fee/pages/FeeCreate.vue"
import FeeEdit from "@/views/fee/pages/FeeEdit.vue"

const routes = [
    {
        path: "fee",
        name: "Fee",
        component: Fee
    },
    {
        path: "fee/create",
        name: "FeeCreate",
        component: FeeCreate
    },
    {
        path: "fee/edit/:id",
        name: "FeeEdit",
        component: FeeEdit
    }
]

export default routes