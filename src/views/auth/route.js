import Login from "@/views/auth/pages/Login.vue"
import ForgetPassword from "@/views/auth/pages/ForgetPassword.vue"
import Forbidden from "@/views/auth/pages/Forbidden.vue"
import NotAuthorized from "@/views/auth/pages/NotAuthorized.vue"

const routes = [
    {
        path: '/login',
        name: 'Login',
        component: Login,
    },
    {
        path: '/forgetpassword',
        name: 'ForgetPassword',
        component: ForgetPassword
    },
    {
        path: '/forbidden',
        name: 'ForbiddenPage',
        component: Forbidden
    },
    {
        path: '/notauthorized',
        name: 'NotAuthorizedPage',
        component: NotAuthorized
    }
]

export default routes