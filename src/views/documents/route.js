import Invoice from "./pages/Invoice.vue"
import Fee from "./pages/Fee.vue"
import Academic from "./pages/Academic.vue"

const routes = [
    {
        path: "/document/invoice/:uniquePath",
        name: "InvoiceDocument",
        component: Invoice
    },
    {
        path: "/document/fee/:uniquePath",
        name: "FeeDocument",
        component: Fee
    },
    {
        path: "/document/laporan/akademik/:uniquePath",
        name: "AcademicDocument",
        component: Academic
    },
    
]

export default routes