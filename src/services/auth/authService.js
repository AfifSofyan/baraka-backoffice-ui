import axios from "axios";
import { BASE_URL } from "@/config/api-config.js";
import { buildQuery } from "@/utils/request/queryParamBuilder";

export default {
    async login({
        usernameOrEmail,
        password
    })
    {
        try {
            const response = await axios.post(`${BASE_URL}/login`, {
                usernameOrEmail: usernameOrEmail,
                password: password
            },
            {
                withCredentials: true,
            })

            const loginData = response.data

            const now = Date.now()
            const TOKEN_DURATION = 1000 * 60 * 60 * 24 * 29 // 29 days
            const expiresAt = now + TOKEN_DURATION

            localStorage.setItem('id', JSON.stringify(loginData.data.id))
            localStorage.setItem('username', JSON.stringify(loginData.data.username))
            localStorage.setItem('email', JSON.stringify(loginData.data.email))
            localStorage.setItem('menuList', JSON.stringify(loginData.data.menuList))
            localStorage.setItem('menuAccess', JSON.stringify(loginData.data.menuAccess))
            localStorage.setItem('roleName', JSON.stringify(loginData.data.roleName))
            localStorage.setItem('roleID', JSON.stringify(loginData.data.roleID))
            localStorage.setItem('nickname', JSON.stringify(loginData.data.nickname))
            localStorage.setItem('name', JSON.stringify(loginData.data.name))
            localStorage.setItem('profilePicture', JSON.stringify(loginData.data.profilePicture))
            localStorage.setItem('auth.token', JSON.stringify(loginData.data.token))
            localStorage.setItem('auth.token_expiration', expiresAt)
    
            return loginData
        } catch (error) {
            throw error
        }
    },

    async isAuthorizedToAccess(menuName)
    {
        const queryParam = buildQuery({
            menuName: menuName
        })

        try {
            const response = await axios.get(`${BASE_URL}/isauthorizedtoaccess${queryParam}`,
            {
                headers:{
                    authorization:JSON.parse(localStorage.getItem('auth.token'))
                }
            })

            return response.data.isAuthorized
        } catch (error) {
            console.error(error.response ? error.response.data.message : error.message)
        }
    },

    async checkPassword({
        username,
        password
    }){
        try {
            const response = await axios.post(`${BASE_URL}/checkpassword`,
            {
                username: username,
                password: password
            })

            return response.data
        } catch (error) {
            throw error
        }
    },
    async forgetPassword({
        email
    }){
        try {
            const response = await axios.post(`${BASE_URL}/forgetpassword`,
            {
                email: email
            })

            return response.data
        } catch (error) {
            throw error
        }
    },
    async checkEmailVerification(){
        try {
            const response = await axios.get(`${BASE_URL}/checkemailverification`,
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
    async logout()
    {
        try {
            const response = await axios.delete(`${BASE_URL}/logout`,
            {
                withCredentials: true,
            })
            localStorage.clear();

        } catch (error) {
            throw error
        }
    },   
    async getUsernames()
    {
        try {
            const response = await axios.get(`${BASE_URL}/usernames`)

            return response.data
        }catch(error){
            throw error
        }
    },
    async getEmails()
    {
        try {
            const response = await axios.get(`${BASE_URL}/emails`)

            return response.data
        }catch(error){
            throw error
        }
    },
    async updateUser(data, id){
        try {
            const response = await axios.patch(`${BASE_URL}/edituser/${id}`,
            data,
            {
                headers:{
                    authorization:JSON.parse(localStorage.getItem('auth.token'))
                }
            })

            const userDetail = response.data.data

            localStorage.setItem('id', JSON.stringify(userDetail.id))
            localStorage.setItem('username', JSON.stringify(userDetail.username))
            localStorage.setItem('email', JSON.stringify(userDetail.email))
            localStorage.setItem('authorization', JSON.stringify(userDetail.token))

            return response.data
        } catch (error) {
            throw error
        }
    },
    async sendEmailVerification(){
        try {
            const response = await axios.get(`${BASE_URL}/sendverificationemail`,
            {
                headers:{
                    authorization:JSON.parse(localStorage.getItem('auth.token'))
                }
            })

            return response
        } catch (error) {
            throw error
        }
    }
}