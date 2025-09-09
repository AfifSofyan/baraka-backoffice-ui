import axios from "axios";
import { BASE_URL } from "@/config/api-config.js";
import { buildQuery } from "@/utils/request/queryParamBuilder";

export default {
    async getTutorList({
        searchText,
        capabilityID,
        isDraft,
        page,
        perPage
    })
    {
        const queryParam = buildQuery({
            searchText: searchText,
            capabilityID: capabilityID,
            isDraft: isDraft,
            page: page,
            perPage: perPage
        })

        try {
            const response = await axios.get(`${BASE_URL}/tutors${queryParam}`,
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
    async getTutorIDAndName(){
        try {
            const response = await axios.get(`${BASE_URL}/tutors/simplified`,{
                // headers:{
                //     authorization:JSON.parse(localStorage.getItem('auth.token'))
                // }
            })

            return response
        } catch (error) {
            throw error
        }
    },
    async getTutorIDAndNameWithoutFee({
        startDate,
        endDate
    }){
        const queryParam = buildQuery({
            startDate: startDate,
            endDate: endDate
        })

        try {
            const response = await axios.get(`${BASE_URL}/tutors/withoutfee${queryParam}`,{
                headers:{
                    authorization:JSON.parse(localStorage.getItem('auth.token'))
                }
            })

            return response
        } catch (error) {
            throw error
        }
    },
    async getTotalNewRegistrants(){
        try {
            const response = await axios.get(`${BASE_URL}/tutors/newregistrants`,{
                headers:{
                    authorization:JSON.parse(localStorage.getItem('auth.token'))
                }
            })

            return response.data
        } catch (error) {
            throw error
        }
    },
    async createTutor(data){
        try {
            const response = await axios.post(`${BASE_URL}/tutors`,
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
    async registerTutor(data){
        try {
            const response = await axios.post(`${BASE_URL}/tutors/register`, data)

            return response.data
        } catch (error) {
            throw error
        }
    },
    async updateTutor(data, id){
        try {
            const response = await axios.patch(`${BASE_URL}/tutors/${id}`,
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
    async updateTutorByUserID(data, id){
        try {
            const response = await axios.patch(`${BASE_URL}/tutors/user/${id}`,
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
    async getTutorDetail(id){
        try {
            const response = await axios.get(`${BASE_URL}/tutors/${id}`,
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
    async getTutorDetailByUserID(id){
        try {
            const response = await axios.get(`${BASE_URL}/tutors/user/${id}`,
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
    async deleteTutor(id){
        try {
            const response = await axios.delete(`${BASE_URL}/tutors/${id}`,
            {
                headers:{
                    authorization:JSON.parse(localStorage.getItem('auth.token'))
                }
            })
        } catch (error) {
            
        }
    }
}