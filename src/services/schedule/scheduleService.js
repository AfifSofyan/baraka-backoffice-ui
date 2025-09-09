import axios from "axios";
import { BASE_URL } from "@/config/api-config.js";
import { buildQuery } from "@/utils/request/queryParamBuilder";

export default {
    async getScheduleList({
        scheduleMode,
        searchText,
        page,
        perPage
    })
    {
        const queryParam = buildQuery({
            scheduleMode: scheduleMode,
            searchText: searchText,
            page: page,
            perPage: perPage
        })

        try {
            const response = await axios.get(`${BASE_URL}/schedules${queryParam}`,
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

    async getScheduleDetail(id){
        try {
            const response = await axios.get(`${BASE_URL}/schedules/${id}`,
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

    async createSchedule(data){
        try {
            const response = await axios.post(`${BASE_URL}/schedules`,
            data,
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
    async updateSchedule(data, id){
        try {
            const response = await axios.patch(`${BASE_URL}/schedules/${id}`,
            data,
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

    async deleteSchedule(id){
        try {
            const response = await axios.delete(`${BASE_URL}/schedules/${id}`,
            {
                headers:{
                    authorization:JSON.parse(localStorage.getItem('auth.token'))
                }
            })
        } catch (error) {
            
        }
    }
}