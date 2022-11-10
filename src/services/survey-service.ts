

import {http, httpWithoutInterceptors} from '@/helpers/axiosconfig'
import axios from 'axios';
import _ from 'lodash';



export async function postClusterSurvey(surveyData: any): Promise<void> {    
    
    try {
        const { data, status } = await http.post('survey/cluster', surveyData);
        console.debug(`postClusterSurvey returned status: ${status}`);

       return data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.log('error message: ', error.message);
            return Promise.reject(error.message);
        } else {
            console.log('unexpected error: ', error);
            return Promise.reject('An unexpected error occurred');
        }
    }    
}

export async function postRadioSurvey(surveyData: any): Promise<void> {    
    
    try {
        const { data, status } = await http.post('survey/radio', surveyData);
        console.debug(`postRadioSurvey returned status: ${status}`);

       return data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.log('error message: ', error.message);
            return Promise.reject(error.message);
        } else {
            console.log('unexpected error: ', error);
            return Promise.reject('An unexpected error occurred');
        }
    }    
}