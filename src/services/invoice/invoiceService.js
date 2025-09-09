import axios from "axios";
import { BASE_URL } from "@/config/api-config.js";
import { buildQuery } from "@/utils/request/queryParamBuilder";

export default {
    async getGeneratedInvoiceList({
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
            const response = await axios.get(`${BASE_URL}/invoice/generated${queryParam}`,
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
    async getInvoiceComponents({
        isActive
    })
    {
        const queryParam = buildQuery({
            isActive: isActive,
        })

        try {
            const response = await axios.get(`${BASE_URL}/invoice/components${queryParam}`,
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
    async getInvoicesDraft({
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
            const response = await axios.get(`${BASE_URL}/invoice/draft${queryParam}`,
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
    async getSentInvoices({
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
            const response = await axios.get(`${BASE_URL}/invoice/sent${queryParam}`,
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
    async getInvoiceDetail(id){
        try {
            const response = await axios.get(`${BASE_URL}/invoice/${id}`,
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
    async getInvoiceDetailByUniqePath(uniquePath){
        try {
            const response = await axios.get(`${BASE_URL}/invoice/detail/${uniquePath}`,
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
    async createInvoice(data){
        try {
            const response = await axios.post(`${BASE_URL}/invoice`,
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

    async updateInvoice(data, id){
        try {
            const response = await axios.patch(`${BASE_URL}/invoice/${id}`,
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

    async deleteInvoice(id){
        try {
            const response = await axios.delete(`${BASE_URL}/invoice/${id}`,
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