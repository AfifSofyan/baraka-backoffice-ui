import axios from "axios";
import { BASE_URL } from "@/config/api-config.js";
import { buildQuery } from "@/utils/request/queryParamBuilder";

export default {
    async getGeneratedFeeList({
        startDate,
        endDate,
        tutorID,
        searchText,
        page,
        perPage
    })
    {
        const queryParam = buildQuery({
            startDate: startDate,
            endDate: endDate,
            tutorID: tutorID,
            searchText: searchText,
            page: page,
            perPage: perPage
        })

        try {
            const response = await axios.get(`${BASE_URL}/fee/generated${queryParam}`,
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
    async getFeeComponents({
        isActive
    })
    {
        const queryParam = buildQuery({
            isActive: isActive,
        })

        try {
            const response = await axios.get(`${BASE_URL}/fee/components${queryParam}`,
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
    async getFeesDraft({
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
            const response = await axios.get(`${BASE_URL}/fee/draft${queryParam}`,
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
    async getSentFees({
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
            const response = await axios.get(`${BASE_URL}/fee/sent${queryParam}`,
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
    async getFeeDetail(id){
        try {
            const response = await axios.get(`${BASE_URL}/fee/${id}`,
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
    async getFeeDetailByUniqePath(uniquePath){
        try {
            const response = await axios.get(`${BASE_URL}/fee/detail/${uniquePath}`,
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
    async createFee(data){
        try {
            const response = await axios.post(`${BASE_URL}/fee`,
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

    async updateFee(data, id){
        try {
            const response = await axios.patch(`${BASE_URL}/fee/${id}`,
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

    async deleteFee(id){
        try {
            const response = await axios.delete(`${BASE_URL}/fee/${id}`,
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