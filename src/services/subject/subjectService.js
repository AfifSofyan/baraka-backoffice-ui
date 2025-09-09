import axios from "axios";
import { BASE_URL } from "@/config/api-config.js";
import { buildQuery } from "@/utils/request/queryParamBuilder";

export default {
    async getSubjectList()
    {
        try {
            const response = await axios.get(`${BASE_URL}/subjects`,)

            return response
        } catch (error) {
            throw error
        }
    },    
}