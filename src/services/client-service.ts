
import type { Client as Client, Gender } from '../types/models'
import {http} from '@/helpers/axiosconfig'
import axios from 'axios';



export async function getClients(): Promise<Client[]> {    
    try {
        
        const { data, status } = await http.get<Client[]>(`clients`);
        console.debug(`GetClients returned status: ${status}`);

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


export async function getClient(id: string): Promise<Client> {    
    try {
        const { data, status } = await http.get<Client>(`clients/${id}`);
        console.debug(`GetClient returned status: ${status}`);

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

export async function createClient(client: Client): Promise<void> {    
    try {
        const { data, status } = await http.post(`clients`, client);
        console.debug(`createClient returned status: ${status}.`);
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

export async function updateClient(client: Client): Promise<void> {    
    try {
        const res = await http.put(`clients/${client.id}`, client);
        console.debug(`updateClient returned status: ${res.status}`);        
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

export async function deleteClient(id: string): Promise<void | number> {    
    try {
        const { data, status } = await http.delete(`clients/${id}`);
        console.debug(`deleteClient returned status: ${status}`);
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
