import AcademicForm from "./pages/AcademicForm.vue"
import AcademicFormSuccess from "./pages/AcademicFormSuccess.vue"

const routes = [
    {
        path: "/form_akademik",
        name: "AcademicForm",
        component: AcademicForm
    },
    {
        path: "/form_akademik/success",
        name: "AcademicFormSuccess",
        component: AcademicFormSuccess
    }
]

export default routes