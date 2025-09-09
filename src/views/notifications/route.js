import NotificationList from "@/views/notifications/pages/NotificationList.vue"
import NotificationDetail from "@/views/notifications/pages/NotificationDetail.vue"

const routes = [
    {
        path: "notification",
        name: "Notification List",
        component: NotificationList
    },
    {
        path: "notification/:id",
        name: "Notification Detail",
        component: NotificationDetail
    }
]

export default routes