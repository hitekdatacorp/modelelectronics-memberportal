
import { defineStore } from 'pinia'
import * as customerService from '../services/customer-service'
import { UserProfile, CustomerModel, AuthenticateResponse } from '../types/models'
import router from '@/router'

type AuthStoreState = {
  profile: UserProfile | null,
  returnUrl: string | null
};

const state: AuthStoreState = {
  profile: null,
  returnUrl: null
};

const profileFromLocalStorage = localStorage.getItem('user');
if(profileFromLocalStorage !== null){
  state.profile = JSON.parse(profileFromLocalStorage);
}

export const useAuthStore = defineStore({
  id: 'auth-store',
  state: () => (state),
  getters: {
    customerNumber: (state) => state.profile?.customer?.friendlyCustomerNumber,
    name: (state) => state.profile?.customer?.name,
    email: (state) => state.profile?.customer?.email    
  },  
  actions: {
    async fetchCustomer(customerNumber: string): Promise<CustomerModel> {
      const user = await customerService.getCustomer(customerNumber);
      return user;
    },

    async authenticate(customerNumber: string, password: string, noGlobalErrorHandling?: boolean): Promise<AuthenticateResponse> {
      const authenticateResponse = await customerService.authenticateCustomer(customerNumber, password, noGlobalErrorHandling);

      if (authenticateResponse === null || !authenticateResponse.authenticationSucceeded) {
        return Promise.reject('Authentication unsuccessful. Either the username or password was incorrect');
      }

      this.profile = new UserProfile(authenticateResponse.token, authenticateResponse.userMustChangePassword, authenticateResponse.customer);

      // store user details and jwt in local storage to keep user logged in between page refreshes
      localStorage.setItem('user', JSON.stringify(this.profile));

      return authenticateResponse;
    },

    isAuthenticated() {
      return this.profile !== null && this.profile.token !== null;
    },

    authHeader(url: string) {
      // return auth header with jwt if user is logged in and request is to the api url
      const isLoggedIn = !!this.profile?.token;
      const isApiUrl = url.startsWith(import.meta.env.VITE_API_URL);
      if (isLoggedIn && isApiUrl) {
        return { Authorization: `Bearer ${this.profile?.token}` };
      } else {
        return {};
      }
    },

    logout() {
      this.profile = null;
      localStorage.removeItem('user');
      router.push('/login');
    },

    setReturnUrl(url: string) {
      this.returnUrl = url;
    }
  }
});
