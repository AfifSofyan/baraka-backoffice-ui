import axios from "axios";
import { BASE_URL } from "@/config/api-config.js";
import { buildQuery } from "@/utils/request/queryParamBuilder";

export default {
    async getProvinceList()
    {
        try {
            const response = await axios.get(`${BASE_URL}/location/provinces`,)

            return response
        } catch (error) {
            throw error
        }
    },  
    
    async getCitiesByProvinceID(provinceID)
    {
        const queryParam = buildQuery({
            provinceID: provinceID
        })

        try {

            const response = await axios.get(`${BASE_URL}/location/cities${queryParam}`)

            return response
        } catch (error) {
            throw error
        }
    }
}