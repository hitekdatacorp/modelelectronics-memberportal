
import type { CustomerModel as CustomerModel, AuthenticateResponse } from '../types/models'
import {http, httpWithoutInterceptors} from '@/helpers/axiosconfig'
import axios from 'axios';
import _ from 'lodash';


export async function authenticateCustomer(userName: string, password: string, noGlobalErrorHandling?: boolean): Promise<AuthenticateResponse> {    
    try {

        let web = noGlobalErrorHandling ? httpWithoutInterceptors : http;

        const { data, status } = await web.post<AuthenticateResponse>(`customers/authenticate`, {
            userName: userName,
            password: password
        });

        console.debug(`authenticateCustomer returned status: ${status}`);

        return data;
    } catch (error) { // here we catch any low level errors like network errors and the like. Any server error/exception will be returned as a json object and won't be thrown here as an exception
        if (axios.isAxiosError(error)) {
            console.log('error message: ', error.message);
            return Promise.reject(error.message);
        } else {
            console.log('unexpected error: ', error);
            return Promise.reject('An unexpected error occurred');
        }
    }    
}

export async function getCustomers(): Promise<CustomerModel[]> {    
    try {
        const { data, status } = await http.get<CustomerModel[]>(`customers`);
        console.debug(`GetCustomers returned status: ${status}`);

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


export async function getCustomer(id: number | string): Promise<CustomerModel> {    
    try {        
        const { data, status } = await http.get<CustomerModel>(`customers/${id}`);
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

export async function createCustomer(Customer: CustomerModel): Promise<void> {    
    try {
        const { data, status } = await http.post(`customers`, Customer);
        console.debug(`createCustomer returned status: ${status}.`);
        console.debug(data);
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

export async function updateCustomer(Customer: CustomerModel): Promise<void> {    
    try {
        const res = await http.put(`customers/${Customer.customerNumber}`, Customer);
        console.debug(`updateCustomer returned status: ${res.status}`);        
        console.debug(res.data);
        return res.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.log('error message: ', error.message);
            console.log(error);
            return Promise.reject(error.message);
        } else {
            console.log('unexpected error: ', error);
            return Promise.reject('An unexpected error occurred');
        }
    }    
}

export async function deleteCustomer(id: string): Promise<void | number> {    
    try {
        const { data, status } = await http.delete(`Customers/${id}`);
        console.debug(`deleteCustomer returned status: ${status}`);
        console.debug(data);
        return Promise.resolve(status);
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
