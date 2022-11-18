<script setup lang="ts">
 import LoginForm from '@/components/LoginForm.vue'
 import { reactive, watch, ref } from 'vue'
 import { useToast } from "vue-toastification";
 import { useAuthStore } from '@/stores/auth-store';
 import router from '@/router'

 const toast = useToast();
 const store = useAuthStore();

let customerNumber = ref('');
let password = ref('');
 
async function login() {
  console.debug(`Entered login method. customer number is ${customerNumber.value}. password is ${password.value}.`);
  // no try catch block needed because we handle our errors globally (see axios config)
  const response = await store.authenticate(customerNumber.value, password.value);
  toast.success('Login successful!');
  customerNumber.value = '';
  password.value = '';

  // go to member landing page which is the check stock view
  if(store.returnUrl){
    console.debug('return url fullpath is: ' + store.returnUrl);
    let returnUrlCopy = store.returnUrl;
    store.setReturnUrl('');

    router.push(returnUrlCopy);
  } else {
    console.debug('going to advanced exchange page')

    if(!store.isNissanDealer){
      router.push('/advexchange');
    } else {
      router.push('speedometer');
    }
    
  } 
}
 
</script>

<template>
  <main class="login-form">
    
    <LoginForm v-model:customerNumber="customerNumber" 
               v-model:password="password" 
               @on-submit="login()" 
               :show-register='false'
               :show-social-icons="false"/>
  </main>
</template>

<style>
 main.login-form {
    max-width: 600px;    
    padding-top: 2rem;
 }
</style>
