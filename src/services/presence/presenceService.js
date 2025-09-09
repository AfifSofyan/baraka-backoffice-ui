import axios from "axios";
import { BASE_URL } from "@/config/api-config.js";
import { buildQuery } from "@/utils/request/queryParamBuilder";

export default {
    async getPresenceList({
        presenceMode,
        searchText,
        startDate,
        endDate,
        page,
        perPage
    })
    {
        const queryParam = buildQuery({
            presenceMode: presenceMode,
            searchText: searchText,
            startDate: startDate,
            endDate: endDate,
            page: page,
            perPage: perPage
        })

        try {
            const response = await axios.get(`${BASE_URL}/presence${queryParam}`,
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
    async createPresenceScheduleNote(data){
        try {
            const response = await axios.post(
                `${BASE_URL}/presence/schedulenote`, 
                data,
                {
                    headers:{
                        authorization:JSON.parse(localStorage.getItem('auth.token'))
                    }
                }
            )
    
            return response.data
        } catch (error) {
            throw error
        }
    },
    async updatePresenceScheduleNote(data, id){
        try {
            const response = await axios.patch(
                `${BASE_URL}/presence/schedulenote/${id}`, 
                data,
                {
                    headers:{
                        authorization:JSON.parse(localStorage.getItem('auth.token'))
                    }
                }
            )
    
            return response.data
        } catch (error) {
            throw error
        }
    },
    async deletePresenceScheduleNote(id){
        try {
            const response = await axios.delete(
                `${BASE_URL}/presence/schedulenote/${id}`,
                {
                    headers:{
                        authorization:JSON.parse(localStorage.getItem('auth.token'))
                    }
                }
            )

            return response.data
        } catch (error) {
            throw error
        }
    },
    async createPresenceReportNote(data){
        try {
            const response = await axios.post(
                `${BASE_URL}/presence/reportnote`, 
                data,
                {
                    headers:{
                        authorization:JSON.parse(localStorage.getItem('auth.token'))
                    }
                }
            )
    
            return response.data
        } catch (error) {
            throw error
        }
    },
    async updatePresenceReportNote(data, id){
        try {
            const response = await axios.patch(
                `${BASE_URL}/presence/reportnote/${id}`, 
                data,
                {
                    headers:{
                        authorization:JSON.parse(localStorage.getItem('auth.token'))
                    }
                }
            )
    
            return response.data
        } catch (error) {
            throw error
        }
    },
    async deletePresenceReportNote(id){
        try {
            const response = await axios.delete(
                `${BASE_URL}/presence/reportnote/${id}`,
                {
                    headers:{
                        authorization:JSON.parse(localStorage.getItem('auth.token'))
                    }
                }
            )

            return response.data
        } catch (error) {
            throw error
        }
    }
}