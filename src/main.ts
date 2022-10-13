import { createApp, provide, ref } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

//import _crypto from 'crypto'
/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'
/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
/* import specific icons */
import { faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { faVuejs, faGoogle, faFacebook, faTwitter, faGithub } from '@fortawesome/free-brands-svg-icons'

import Toast, { POSITION, type PluginOptions, useToast } from "vue-toastification";
// Import the CSS or use your own!
import "vue-toastification/dist/index.css";

//import { useAuthStore } from './stores/auth-store';
import VueProgressBar from "@aacassandra/vue3-progressbar";

import Datepicker from '@vuepic/vue-datepicker';


// create our vue app
const app = createApp(App);
app.use(createPinia());
app.use(router);

const progressBarOptions = {
    color: "#c40000",
    failedColor: "#874b4b",
    thickness: "5px",
    transition: {
        speed: "1.5s",
        opacity: "0.6s",
        termination: 600,
    },
    autoRevert: true,
    location: "top",
    inverse: false,
};

app.use(VueProgressBar, progressBarOptions);

const toastOptions: PluginOptions = {
    newestOnTop: true,
    maxToasts: 3,
    containerClassName: 'custom-toast-container',
    timeout: 4000,
    position: POSITION.TOP_CENTER,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    closeOnClick: true,
    hideProgressBar: true,
    toastDefaults: {
        success: {
            position: POSITION.TOP_CENTER,
            toastClassName: 'custom-toast-success',
            bodyClassName: 'custom-toast-success-body',
        }
    }
}
app.use(Toast, toastOptions);

// create a globally provided value using Injection Keys
//let userProfile = new UserProfile('aaa6621b-b50b-4a73-932f-ecdcd53bdabe', 'pantuofermo', 'pantuofermo@gmail.com', 3500.50, new Date())
//app.provide(UserProfileInjectionKey, ref(userProfile))

/* add fontawesome icons to the library */
library.add(faTrashCan, faVuejs, faGoogle, faFacebook, faTwitter, faGithub)

app.component('font-awesome-icon', FontAwesomeIcon);

// add qrcode scanner component
//app.component('qrcode-scanner', () => import('./components/qrcode-scanner.vue'));


app.component('Datepicker', Datepicker);


// mount the vue app
app.mount('#app')

//export const myAppReference = app;

