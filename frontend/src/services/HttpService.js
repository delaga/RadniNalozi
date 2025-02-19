import axios from "axios";
import { PRODUKCIJA } from "../constants";


export const HttpService = axios.create({
    baseURL: PRODUKCIJA + '/api/v1',
    headers: {
        'Content-Type':'application/json'
    }
});