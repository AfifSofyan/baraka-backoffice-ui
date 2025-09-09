import axios from "axios";
import { BASE_URL } from "@/config/api-config.js";
import { buildQuery } from "@/utils/request/queryParamBuilder";

export default {
    async getReportChangeLogList({
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
            const response = await axios.get(`${BASE_URL}/reportchangelogs${queryParam}`,
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
    async getReportChangeLogDetail(id){
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