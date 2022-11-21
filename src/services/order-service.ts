
import type {CreateOrderResult, IInvoiceHistoryModel, IOrderModel} from '../types/models';
import {http, httpWithoutInterceptors} from '@/helpers/axiosconfig'
import axios from 'axios';
import _ from 'lodash';
import { dateToUrlReadyParam } from '@/helpers/formatters';
import { OrderType } from '@/types/enumtypes';
import type { InternationalOrderFormViewModel, NissanOrderFormViewModel, OrderFormViewModel } from '@/types/viewmodels';


export async function createOrder(order: OrderFormViewModel): Promise<CreateOrderResult> {                    

    try {        
        const { data, status } = await http.post<CreateOrderResult>('orders', order);
        console.debug(`createOrder returned status: ${status}`);

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


export async function createNissanOrder(order: NissanOrderFormViewModel): Promise<CreateOrderResult> {                    

    try {        
        const { data, status } = await http.post<CreateOrderResult>('orders/nissan', order);
        console.debug(`createOrder returned status: ${status}`);

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

export async function createInternationalOrder(order: InternationalOrderFormViewModel): Promise<CreateOrderResult> {                    

    try {        
        const { data, status } = await http.post<CreateOrderResult>('orders/intl', order);
        console.debug(`createOrder returned status: ${status}`);

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


export async function getOrder(orderId: number): Promise<IOrderModel> {    
    try {
        const { data, status } = await http.get<IOrderModel>(`orders/${orderId}`);
        console.debug(`getOrder returned status: ${status}`);        

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

export async function getOrderHistory(orderType: OrderType, customerNumber: string, orderDateFrom?: Date | null, orderDateTo?: Date | null, orderNumber?: string | null, poNumber?: string | null, customerName?: string | null): Promise<Array<IInvoiceHistoryModel>> {    

    let url = '';

    if(orderType === OrderType.Purchase){
        url = `orders/saleshistory/${customerNumber}/?orderType=${orderType}&`;
    } else {
        url = `orders/exchangehistory/${customerNumber}/?orderType=${orderType}&`;
    }

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
        const { data, status } = await http.get<Array<IInvoiceHistoryModel>>(url);
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
