
import { AccountTypes, DealerRoles } from '@/types/enumtypes';
import { defineStore } from 'pinia'
import { useRouter } from 'vue-router';
import * as customerService from '../services/customer-service'
import { UserProfile, CustomerModel, AuthenticateResponse } from '../types/models'


const router = useRouter();

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
  const expiresUtcTimestamp = localStorage.getItem('user-expires');

  if(expiresUtcTimestamp !== null) {

    let expiresUtcDt = parseInt(expiresUtcTimestamp);
    if(expiresUtcDt > new Date().getTime()) {
      state.profile = JSON.parse(profileFromLocalStorage);
    }
  }
}

export const useAuthStore = defineStore({
  id: 'auth-store',
  state: () => (state),
  getters: {
    customerNumber: (state) => state.profile?.customer?.friendlyCustomerNumber,
    name: (state) => state.profile?.customer?.name,
    email: (state) => state.profile?.customer?.email,
    phone: (state) => state.profile?.customer?.phone,
    address: (state) => state.profile?.customer?.address,
    city: (state) => state.profile?.customer?.city,
    state: (state) => state.profile?.customer?.state,
    zip: (state) => state.profile?.customer?.zip,
    isAccountingLogin: () => {
      return state.profile?.customer?.accountType == AccountTypes.Accounting;
    },
    isGMDealer: () => {
      return state.profile?.customer?.dealerManufacturer === DealerRoles.GM;
    },
    isNissanDealer: () => {
      return state.profile?.customer?.dealerManufacturer === DealerRoles.NissanInfiniti;
    },
    isInternationalDealer: () => {
      return state.profile?.customer?.dealerManufacturer === DealerRoles.International;
    },
    isOtherDealer() {
      return !this.isGMDealer && !this.isNissanDealer && !this.isInternationalDealer;
    },
    isGMOrOtherDealer(){
      return this.isGMDealer || this.isOtherDealer;
    }
    //returnUrl: (state) => state.returnUrl
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

      let dt = new Date();
      dt.setTime(dt.getTime() + (2 * 60 * 60 * 1000)); // add 4 hours to the current datetime. that's when it should expire
      localStorage.setItem('user-expires', dt.getTime().toString());

      return authenticateResponse;
    },

    isAuthenticated() {
      return this.profile !== null && this.profile.token !== null;
    },

    authHeader(url: string) {
      // return auth header with jwt if user is logged in and request is to the api url
      const isLoggedIn = !!this.profile?.token;
      const isApiUrl =  url.startsWith(import.meta.env.VITE_API_URL);
      if (isLoggedIn && isApiUrl) {
        return { Authorization: `Bearer ${this.profile?.token}` };
      } else {
        return {};
      }
    },

    logout() {
      this.profile = null;
      this.returnUrl = null;
      localStorage.removeItem('user');
      if(router !== null && router !== undefined){
        router.push('/');
      } else {
        // try the window object
        window.location.href = '/';
      }
    },

    setReturnUrl(url: string) {
      this.returnUrl = url;
    }
  }
});
