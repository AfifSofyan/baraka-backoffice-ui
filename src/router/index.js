// Composables
import { createRouter, createWebHistory } from 'vue-router'

import AuthRoutes from "@/views/auth/route.js"
import DashboardRoutes from "@/views/dashboard/route.js"
import StudentRoutes from "@/views/student/route.js"
import PresenceRoutes from "@/views/presence/route.js"
import TutorRoutes from "@/views/tutor/route.js"
import ScheduleRoutes from "@/views/schedule/route.js"
import ProfileRoutes from "@/views/profile/route.js"
import ResponseRoutes from "@/views/response/route.js"
import InvoiceRoutes from "@/views/invoice/route.js"
import AcademicReportRoutes from "@/views/academic_reports/route.js"
import AccessRoutes from "@/views/access/route.js"
import AccountRoutes from "@/views/accounts/route.js"
import BankRoutes from "@/views/banks/route.js"
import FeeRoutes from "@/views/fee/route.js"
import FeeComponentRoutes from "@/views/fee_components/route.js"
import InvoiceComponentRoutes from "@/views/invoice_components/route.js"
import SubjectRoutes from "@/views/subjects/route.js"
import DocumentRoutes from "@/views/documents/route.js"
import RegistrationRoutes from "@/views/registration/route.js"
import OpenAccessRoutes from "@/views/open_access/route.js"
import ReportChangeLogRoutes from "@/views/report_change_log/route.js"
import WebsiteEmbeddedPagesRoutes from "@/views/website/route.js"
import NotificationRoutes from "@/views/notifications/route.js"

function withRequiredAuthMeta(routes) {
  return routes.map(route => ({
    ...route,
    meta: { ...(route.meta || {}), requiresAuth: true }
  }))
}

const routes = [
  ...AuthRoutes,
  ...DocumentRoutes,
  ...RegistrationRoutes,
  ...OpenAccessRoutes,
  ...WebsiteEmbeddedPagesRoutes,
  {
    path: '/backoffice',
    name: 'Back Office',
    component: () => import('@/layouts/default/Default.vue'),
    children: withRequiredAuthMeta([
      ...DashboardRoutes,
      ...StudentRoutes,
      ...PresenceRoutes,
      ...TutorRoutes,
      ...ScheduleRoutes,
      ...ProfileRoutes,
      ...ResponseRoutes,
      ...InvoiceRoutes,
      ...AcademicReportRoutes,
      ...AccessRoutes,
      ...AccountRoutes,
      ...BankRoutes,
      ...FeeRoutes,
      ...FeeComponentRoutes,
      ...InvoiceComponentRoutes,
      ...SubjectRoutes,
      ...NotificationRoutes
      // ...ReportChangeLogRoutes
    ]),
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

// Auth check global guard
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('auth.token')
  const expiresAt = localStorage.getItem('auth.token_expiration')
  const isExpired = expiresAt && Date.now() > parseInt(expiresAt)

  if (isExpired) {
    localStorage.clear()
    return next({ name: 'Login' })
  }

  if (isAuthenticated && (to.name === 'Login')) {
    return next({ name: 'Dashboard' })
  }

  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'Login'})
  } else {
    next()
  }
})

export default router
