
import { ItemAvailabilityResult, type IBackOrderedPart, type IInvoiceHistoryModel } from '../types/models'
import {http, httpWithoutInterceptors} from '@/helpers/axiosconfig'
import axios from 'axios';
import _ from 'lodash';
import { dateToUrlReadyParam } from '@/helpers/formatters';



export async function getItemAvailability(partNumber: string): Promise<ItemAvailabilityResult> {    
    try {
        const { data, status } = await http.get<ItemAvailabilityResult>(`inventory/${partNumber}/avail`);
        console.debug(`getItemAvailability returned status: ${status}`);

        const result = new ItemAvailabilityResult(data.item, data.itemExists, data.remanNumber, data.yearRange, data.alternateItems, data.isOnBackorder, data.estimatedDeliveryDate, data.exchangeAvailability, data.purchaseAvailability, data.mileageToBeSetAtDealership, data.isRadio);

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

export async function getItemAvailabilityForPurchase(partNumber: string): Promise<ItemAvailabilityResult> {    
    try {
        const { data, status } = await http.get<ItemAvailabilityResult>(`inventory/${partNumber}/purchaseavail`);
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


export async function getNissanBackOrderedParts(salesRepId: string): Promise<Array<IBackOrderedPart>> {      

    try {
        const { data, status } = await http.get<Array<IBackOrderedPart>>(`inventory/nissanbo/${salesRepId}`);

        console.debug(`getNissanBackOrderedParts returned status: ${status}`);

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
