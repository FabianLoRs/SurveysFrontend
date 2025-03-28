import axios from "axios";
import { CREATE_POLL_ENDPOINT, CREATE_POLL_REPLY_ENDPOINT, GET_POLL_WITH_QUESTIONS_ENDPOINT } from "../utils/endpoints";
import { PollReply } from '../types/index';

export const savePoll = (data: any) => {
    return axios.post(CREATE_POLL_ENDPOINT, data);
}

export const getPollWithQuestions = (uuid: string) => {
    return axios.get(GET_POLL_WITH_QUESTIONS_ENDPOINT(uuid));
}

export const createPollReply = (pollReply: PollReply) => {
    return axios.post(CREATE_POLL_REPLY_ENDPOINT, pollReply);
}