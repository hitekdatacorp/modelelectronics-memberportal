import axios from 'axios';
import { useToast } from 'vue-toastification';
import _ from 'lodash';


// const WEB_API_SERVICE_URL = 'https://localhost:7228/';

// const PUBLIC_SITE_DEV_URL = 'https://localhost:44368/';
// const PUBLIC_SITE_PROD_URL = 'https://www.modelelectronics.com/';

export const PUBLIC_SITE_URL = import.meta.env.VITE_PUBLIC_SITE_URL;

const axiosConfig = {
    baseURL: `${import.meta.env.VITE_API_URL}`,
    headers: { 'Content-Type': 'application/json' }
};


// create our axios http service with global interceptors added. here we will add a global error handling function to deal with the various errors returned from our rest api.
export const http = axios.create(axiosConfig);

http.interceptors.request.use( config => {    

   // app.config.globalProperties.$Progress.start(); // for every request start  the progress bar    

    if(config && config.url && config.headers) {
        //const authStore = useAuthStore();
        //config.headers['Authorization'] = authStore.authHeader(config.baseURL!)['Authorization'] || '';
    }
    return config;
});

http.interceptors.response.use( resp => {    
    //app.config.globalProperties.$Progress.finish(); // for every request finish the progress bar    

   return resp;
}, error => {
   // app.config.globalProperties.$Progress.fail(); // for every request error fail  the progress
    const toast = useToast();

    // check for 'unauthorized response'.
    if(error.response && (error.response.status === 401 || error.response.status === 403)) {  
       // const authStore = useAuthStore();      
       // authStore.logout();
    }
    // handle our "ProblemDetails" json object which is returned from our REST API whenever an application error or a validation error occurs.
    // check for ValidationProblemDetails object returned from our REST API
    else if(error.response && error.response.status === 400 && error.response.data ) {
        // loop over the ModelState errors (which is an object, not an array)
        if(error.response.data && error.response.data.errors && Object.keys(error.response.data.errors).length){ 
            let errs = error.response.data.errors;
            let keys = Object.keys(errs);
            for(const key in keys) {
                let msgArr = errs[keys[key]]; // this is an array
                toast.error(msgArr[0]); // for now only show the first error. once the user corrects the error then the second pass will show the other error(s)
            }     
        } else if(error.response.data.detail){ // simple validation error occurred (not a ModelState validation error)
            toast.error(error.response.data.detail );
        }           
    }
    // check for Internal Server Error (status code 500). Our Rest Api still returns a ProblemDetails object (which is similar to the ValidationProblemDetail object)
    else if(error.response && error.response.status === 500 && error.response.data && error.response.data.detail){
        //let's not display server error messages here => toast.error(error.response.data.detail); 
        toast.error('A server error occurred. Please try again or contact a system administrator')
        console.log(error.response.data);
    }
    else {
        if(_.isString(error)) {
            toast.error(error);                        
        } else if(axios.isAxiosError(error)){
            console.log(error);
            toast.error(error.message);         
        }                
    }
    return Promise.reject(error);
});

// create a version of the http service without the global interceptors added. This is useful in ajax operations we want to perform 'quietly' without the interceptors interferring.
export const httpWithoutInterceptors = axios.create(axiosConfig);
