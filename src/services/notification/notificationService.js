import axios from "axios";
import { BASE_URL } from "@/config/api-config.js";
import { buildQuery } from "@/utils/request/queryParamBuilder";

export default {
    async getUnreadNotifications()
    {
        try {
            const response = await axios.get(`${BASE_URL}/notifications/unread`,
                {
                    headers:{
                        authorization:JSON.parse(localStorage.getItem('auth.token'))
                    }
                })

            return response
        } catch (error) {
            throw error
        }
    },
    
    async getAllNotifications({
        page,
        perPage
    })
    {
        try {
            const queryParam = buildQuery({
                page: page,
                perPage: perPage
            })

            const response = await axios.get(`${BASE_URL}/notifications${queryParam}`,
                {
                    headers:{
                        authorization:JSON.parse(localStorage.getItem('auth.token'))
                    }
                })

            return response
        } catch (error) {
            throw error
        }
    },

    async getNotificationDetail(id)
    {
        try {
            const response = await axios.get(`${BASE_URL}/notifications/${id}`,
                {
                    headers:{
                        authorization:JSON.parse(localStorage.getItem('auth.token'))
                    }
                })

            return response
        } catch (error) {
            throw error
        }
    },

    async markNotificationAsRead(id)
    {
        try {
            const response = await axios.patch(`${BASE_URL}/notifications/read/${id}`,
            {},
            {
                headers:{
                    authorization:JSON.parse(localStorage.getItem('auth.token'))
                }
            })

            return response.data
        } catch (error) {
            throw error
        }
    },

    async markAllNotificationsAsRead()
    {
        try {
            const response = await axios.patch(`${BASE_URL}/notifications/read_all`,
            {},
            {
                headers:{
                    authorization:JSON.parse(localStorage.getItem('auth.token'))
                }
            })

            return response.data
        } catch (error) {
            throw error
        }
    }
}