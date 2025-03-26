import axios from "axios";
import { CREATE_POLL_ENDPOINT } from "../utils/endpoints";

export const savePoll = (data: any) => {
    return axios.post(CREATE_POLL_ENDPOINT, data);
}