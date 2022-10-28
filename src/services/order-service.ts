
import type {OrderModel} from '../types/models';
import {http, httpWithoutInterceptors} from '@/helpers/axiosconfig'
import axios from 'axios';
import _ from 'lodash';
import { dateToUrlReadyParam } from '@/helpers/formatters';
import { OrderType } from '@/types/enumtypes';


export async function getOrderHistory(orderType: OrderType, customerNumber: string, orderDateFrom?: Date | null, orderDateTo?: Date | null, orderNumber?: string | null, poNumber?: string | null, customerName?: string | null): Promise<Array<OrderModel>> {    

    let url = `orders/${customerNumber}/?orderType=${orderType}&`;

    if(orderDateFrom) {
        url += `startDate=${dateToUrlReadyParam(orderDateFrom)}&`;
    }
    if(orderDateTo) {
        url += `endDate=${dateToUrlReadyParam(orderDateTo)}&`;
    }
    if(orderNumber) {
        url += `orderNumber=${orderNumber}&`;
    }
    if(poNumber) {
        url += `poNumber=${poNumber}&`;
    }
    if(customerName) {
        url += `customerName=${customerName}&`;
    }


    try {
        const { data, status } = await http.get<Array<OrderModel>>(url);
        console.debug(`getOrderHistory returned status: ${status}`);

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

const VITE_INVOICEGENERATOR_URL = import.meta.env.VITE_INVOICEGENERATOR_URL;

export function getOrderInvoiceUrl(orderNumber: number, orderType: OrderType) {

    let t: string;
    switch(orderType){
        case OrderType.Exchange:
            t = 'E';
            break;
        case OrderType.Purchase:
            t = 'S'
            break;
        default:
            t = 'S';
    }

    let url = `${VITE_INVOICEGENERATOR_URL}?wo=${orderNumber}&type=${t}`;

    return url;
}

const VITE_INVOICE_TRACKING_URL_FORMAT_AIRBORN: string = import.meta.env.VITE_INVOICE_TRACKING_URL_FORMAT_AIRBORN;
const VITE_INVOICE_TRACKING_URL_FORMAT_UPS: string = import.meta.env.VITE_INVOICE_TRACKING_URL_FORMAT_UPS;
const VITE_INVOICE_TRACKING_URL_FORMAT_FEDEX: string = import.meta.env.VITE_INVOICE_TRACKING_URL_FORMAT_FEDEX;

export function getOrderTrackingUrl(trackingNumber: string) {
    if(!trackingNumber) return '';
    let url: string = '';
    if(trackingNumber.startsWith("W")) {
        url = VITE_INVOICE_TRACKING_URL_FORMAT_AIRBORN.replace('{0}', trackingNumber);
    } else if(trackingNumber.length >= 2 && trackingNumber.substring(1, 2) === 'Z') {
        url = VITE_INVOICE_TRACKING_URL_FORMAT_UPS.replace('{0}', trackingNumber);
    } else if(trackingNumber) {
        url = VITE_INVOICE_TRACKING_URL_FORMAT_FEDEX.replace('{0}', trackingNumber);
    }    

    return url;
}
