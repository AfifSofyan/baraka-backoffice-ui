import axios from "axios";
import { BASE_URL } from "@/config/api-config.js";
import { buildQuery } from "@/utils/request/queryParamBuilder";

export default {
    async getGeneratedAcademicReportList({
        startDate,
        endDate,
        studentID,
        searchText,
        page,
        perPage
    })
    {
        const queryParam = buildQuery({
            startDate: startDate,
            endDate: endDate,
            studentID: studentID,
            searchText: searchText,
            page: page,
            perPage: perPage
        })

        try {
            const response = await axios.get(`${BASE_URL}/academics/generated${queryParam}`,
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
    async getAcademicReportsDraft({
        startDate,
        endDate,
        searchText,
        page,
        perPage
    }){
        const queryParam = buildQuery({
            startDate: startDate,
            endDate: endDate,
            searchText: searchText,
            page: page,
            perPage: perPage
        })
        try {
            const response = await axios.get(`${BASE_URL}/academics/draft${queryParam}`,
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
    async getSentAcademicReports({
        startDate,
        endDate,
        searchText,
        userID,
        page,
        perPage
    }){
        const queryParam = buildQuery({
            startDate: startDate,
            endDate: endDate,
            searchText: searchText,
            userID: userID,
            page: page,
            perPage: perPage
        })
        try {
            const response = await axios.get(`${BASE_URL}/academics/sent${queryParam}`,
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
    async getAcademicReportDetail(id){
        try {
            const response = await axios.get(`${BASE_URL}/academics/${id}`,
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
    async getAcademicReportDetailByUniqePath(uniquePath){
        try {
            const response = await axios.get(`${BASE_URL}/academics/detail/${uniquePath}`,
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
    async createAcademicReport(data){
        try {
            const response = await axios.post(`${BASE_URL}/academics`,
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
    
    async updateAcademicReport(data, id){
        try {
            const response = await axios.patch(`${BASE_URL}/academics/${id}`,
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

    async deleteAcademicReport(id){
        try {
            const response = await axios.delete(`${BASE_URL}/academics/${id}`,
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