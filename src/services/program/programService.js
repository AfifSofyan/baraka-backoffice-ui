import axios from "axios";
import { BASE_URL } from "@/config/api-config.js";
import { buildQuery } from "@/utils/request/queryParamBuilder";

export default {
    async getProgramList()
    {
        try {
            const response = await axios.get(`${BASE_URL}/programs`,)

            return response
        } catch (error) {
            throw error
        }
    },    
}