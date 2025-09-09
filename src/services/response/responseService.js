import axios from "axios";
import { BASE_URL } from "@/config/api-config.js";
import { buildQuery } from "@/utils/request/queryParamBuilder";

export default {
    async getResponseList({
        startDate,
        endDate,
        searchText,
        page,
        perPage
    })
    {
        const queryParam = buildQuery({
            startDate: startDate,
            endDate: endDate,
            searchText: searchText,
            page: page,
            perPage: perPage
        })

        try {
            const response = await axios.get(`${BASE_URL}/response${queryParam}`,
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
    async createReport(data){
        try {
            const response = await axios.post(`${BASE_URL}/response`,
            data,
            {
                // headers:{
                //     authorization:JSON.parse(localStorage.getItem('auth.token'))
                // }
            })

            return response.data
        } catch (error) {
            throw error
        }
    },
    async updateReport(data, id){
        try {
            const response = await axios.patch(`${BASE_URL}/response/${id}`,
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
    async deleteReport(id){
        try {
            const response = await axios.delete(`${BASE_URL}/response/${id}`,
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
    async getReportDetail(id){
        try {
            const response = await axios.get(`${BASE_URL}/response/${id}`,
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
}