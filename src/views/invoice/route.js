import Invoice from "@/views/invoice/pages/Invoice.vue"
import InvoiceCreate from "@/views/invoice/pages/InvoiceCreate.vue"
import InvoiceEdit from "@/views/invoice/pages/InvoiceEdit.vue"

const routes = [
    {
        path: "invoice",
        name: "Invoice",
        component: Invoice
    },
    {
        path: "invoice/create",
        name: "InvoiceCreate",
        component: InvoiceCreate
    },
    {
        path: "invoice/edit/:id",
        name: "InvoiceEdit",
        component: InvoiceEdit
    }
]

export default routes