import StudentRegistration from "./pages/StudentRegistration.vue"
import TutorRegistration from "./pages/TutorRegistration.vue"
import StudentRegistrationSuccess from "./pages/StudentRegistrationSuccess.vue"
import TutorRegistrationSuccess from "./pages/TutorRegistrationSuccess.vue"

const routes = [
    {
        path: "/registrasi/siswa",
        name: "StudentRegistration",
        component: StudentRegistration
    },
    {
        path: "/registrasi/tutor",
        name: "TutorRegistration",
        component: TutorRegistration
    },
    {
        path: "/registrasi/siswa/success",
        name: "StudentRegistrationSuccess",
        component: StudentRegistrationSuccess
    },
    {
        path: "/registrasi/tutor/success",
        name: "TutorRegistrationSuccess",
        component: TutorRegistrationSuccess
    },
]

export default routes