import axios from "axios";
import { BASE_URL } from "@/config/api-config.js";
import { buildQuery } from "@/utils/request/queryParamBuilder";

export default {
    async getCapabilityList()
    {
        try {
            const response = await axios.get(`${BASE_URL}/capabilities`,)

            return response
        } catch (error) {
            throw error
        }
    },    
}