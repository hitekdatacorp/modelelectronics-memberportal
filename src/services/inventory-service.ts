
import { ItemAvailabilityResult, type IBackOrderedPart, type IInvoiceHistoryModel } from '../types/models'
import {http, httpAlternateSite, httpWithoutInterceptors} from '@/helpers/axiosconfig'
import axios from 'axios';
import _ from 'lodash';
import { dateToUrlReadyParam } from '@/helpers/formatters';



export async function getItemAvailability(partNumber: string, lookupAlternateSiteIfFirstSiteHasNoStock: boolean = false): Promise<ItemAvailabilityResult> {    
    // lookupAlternateSiteIfFirstSiteHasNoStock means check the other site for part availability. i.e. if we're in the NJ version of the website then go lookup TX and vice versa.
 
    try {

        let result: ItemAvailabilityResult;
        let { data, status } = await http.get<ItemAvailabilityResult>(`inventory/${partNumber}/avail`);
        
        if(lookupAlternateSiteIfFirstSiteHasNoStock && !data?.exchangeAvailability?.isInStock){ // if the first site has no stock then check the other site
            let {data, status} = await httpAlternateSite.get<ItemAvailabilityResult>(`inventory/${partNumber}/avail`);
            if(data?.exchangeAvailability?.isInStock){
                return new ItemAvailabilityResult(data.siteId, data.item, data.itemExists, data.remanNumber, data.yearRange, data.alternateItems, data.isOnBackorder, data.estimatedDeliveryDate, data.exchangeAvailability, data.purchaseAvailability, data.mileageToBeSetAtDealership, data.isRadio);
            }
        }       
        console.debug(`getItemAvailability returned status: ${status}`);

        return new ItemAvailabilityResult(data.siteId, data.item, data.itemExists, data.remanNumber, data.yearRange, data.alternateItems, data.isOnBackorder, data.estimatedDeliveryDate, data.exchangeAvailability, data.purchaseAvailability, data.mileageToBeSetAtDealership, data.isRadio);        
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
