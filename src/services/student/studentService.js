import axios from "axios";
import { BASE_URL } from "@/config/api-config.js";
import { buildQuery } from "@/utils/request/queryParamBuilder";

export default {
    async getStudentList({
        searchText,
        studentStatusID,
        page,
        perPage
    })
    {
        const queryParam = buildQuery({
            searchText: searchText,
            studentStatusID: studentStatusID,
            page: page,
            perPage: perPage
        })

        try {
            const response = await axios.get(`${BASE_URL}/students${queryParam}`,
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
    async getTotalNewRegistrants(){
        try {
            const response = await axios.get(`${BASE_URL}/students/newregistrants`,{
                headers:{
                    authorization:JSON.parse(localStorage.getItem('auth.token'))
                }
            })

            return response.data
        } catch (error) {
            throw error
        }
    },
    async getStudentIDAndName(){
        try {
            const response = await axios.get(`${BASE_URL}/students/simplified`,{
                // headers:{
                //     authorization:JSON.parse(localStorage.getItem('auth.token'))
                // }
            })

            return response
        } catch (error) {
            throw error
        }
    },
    async getStudentIDAndNameBasedOnRole(){
        try {
            const response = await axios.get(`${BASE_URL}/students/basedonrole`,{
                headers:{
                    authorization:JSON.parse(localStorage.getItem('auth.token'))
                }
            })

            return response
        } catch (error) {
            throw error
        }
    },
    async getStudentIDAndNameWithoutInvoice({
        startDate,
        endDate
    }){
        const queryParam = buildQuery({
            startDate: startDate,
            endDate: endDate
        })

        try {
            const response = await axios.get(`${BASE_URL}/students/withoutinvoice${queryParam}`,{
                headers:{
                    authorization:JSON.parse(localStorage.getItem('auth.token'))
                }
            })

            return response
        } catch (error) {
            throw error
        }
    },
    async getStudentIDAndNameWithoutAcademicReport({
        startDate,
        endDate
    }){
        const queryParam = buildQuery({
            startDate: startDate,
            endDate: endDate
        })

        try {
            const response = await axios.get(`${BASE_URL}/students/withoutacademicreport${queryParam}`,{
                headers:{
                    authorization:JSON.parse(localStorage.getItem('auth.token'))
                }
            })

            return response
        } catch (error) {
            throw error
        }
    },
    async createStudent(data){
        try {
            const response = await axios.post(`${BASE_URL}/students`,
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
    async registerStudent(data){
        try {
            const response = await axios.post(`${BASE_URL}/students/register`, data)

            return response.data
        } catch (error) {
            throw error
        }
    },
    async updateStudent(data, id){
        try {
            const response = await axios.patch(`${BASE_URL}/students/${id}`,
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
    async updateStudentByUserID(data, id){
        try {
            const response = await axios.patch(`${BASE_URL}/students/user/${id}`,
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
    async getStudentDetail(id){
        try {
            const response = await axios.get(`${BASE_URL}/students/${id}`,
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
    async getStudentDetailByUserID(id){
        try {
            const response = await axios.get(`${BASE_URL}/students/user/${id}`,
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
    async deleteStudent(id){
        try {
            const response = await axios.delete(`${BASE_URL}/students/${id}`,
            {
                headers:{
                    authorization:JSON.parse(localStorage.getItem('auth.token'))
                }
            })
        } catch (error) {
            
        }
    }
}