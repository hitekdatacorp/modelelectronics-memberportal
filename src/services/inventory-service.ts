
import { ItemAvailabilityResult } from '../types/models'
import {IS_NJ_URL, IS_TX_URL, http, httpAlternateSite, httpWithoutInterceptors} from '@/helpers/axiosconfig'
import axios from 'axios';

import _ from 'lodash';


export async function getItemAvailability(partNumber: string, lookupAlternateSite: boolean = false): Promise<ItemAvailabilityResult> {    
    // lookupAlternateSite means check the other site for availability. i.e. if we're in the NJ version of the website then go lookup TX and vice versa.
 
    try {
        const { data, status } = lookupAlternateSite ? await httpAlternateSite.get<ItemAvailabilityResult>(`inventory/${partNumber}/avail`) : await http.get<ItemAvailabilityResult>(`inventory/${partNumber}/avail`);
        console.debug(`getItemAvailability returned status: ${status}`);

        const result = new ItemAvailabilityResult(data.siteId, data.item, data.itemExists, data.remanNumber, data.yearRange, data.alternateItems, data.isOnBackorder, data.estimatedDeliveryDate, data.exchangeAvailability, data.purchaseAvailability, data.mileageToBeSetAtDealership, data.isRadio);

        return result;
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

export async function getItemAvailabilityForPurchase(partNumber: string, lookupAlternateSite: boolean = false): Promise<ItemAvailabilityResult> {    
    try {
        const { data, status } = lookupAlternateSite ? await httpAlternateSite.get<ItemAvailabilityResult>(`inventory/${partNumber}/purchaseavail`) : await http.get<ItemAvailabilityResult>(`inventory/${partNumber}/purchaseavail`);
        console.debug(`getItemAvailability returned status: ${status}`);

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

