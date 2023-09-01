<script setup lang="ts">

import { toNumber } from 'lodash';
import { reactive, watch, ref, computed } from 'vue'
import { useToast } from "vue-toastification";
import { useAuthStore } from '@/stores/auth-store';
import { useVuelidate } from '@vuelidate/core';
import { required, helpers, maxLength, minLength, sameAs  } from '@vuelidate/validators';

import { changeCustomerPassword } from '@/services/customer-service';

import LoadingComponent from '../components/LoadingComponent.vue';
import { useRouter } from 'vue-router';


const toast = useToast();
const store = useAuthStore();

const router = useRouter();

let changePasswordForm = ref({
  password: '',
  confirmPassword: ''
});

// setup form validation
const rules = {
  password: { required, minLength: minLength(5), maxLength: maxLength(25), 
    mustNotEqualCustomerNumber: helpers.withMessage('Password must not be the same as your Customer Number', function(value: string) {
      return value !== store.customerNumber;
    }),
    // upperCase: helpers.withMessage('Password must contain at least 1 upper case character', function(value: string) {
    //   return !/[A-Z]/.test(value);
    // }),
    // lowerCase: helpers.withMessage('Password must contain at least 1 lower case character', function(value: string) {
    //   return !/[a-z]/.test(value);
    // }),
    // number: helpers.withMessage('Password must contain at least 1 number', function(value: string) {
    //   return !/[0-9]/.test(value);
    // })
   },
  confirmPassword: { required, maxLength: maxLength(25), sameAs: helpers.withMessage('Confirm Password field must match the Password field.', function(value: string) {
    return value === changePasswordForm.value.password;
  })  }
};
const v$ = useVuelidate(rules, changePasswordForm);

const isLoading = ref(false);
const isLoadingAlternates = ref(false);

async function changePassword(e: Event) {
  e.preventDefault();
  console.log('changing password...');

  v$.value.$touch();
  const isFormValid = await v$.value.$validate();
  if(!isFormValid){
    return;
  }

  isLoading.value = true;

  try {
    await changeCustomerPassword(store.customerNumber!, changePasswordForm.value.password);
        
    toast.success('Password changed successfully!');
    
    router.push('advexchange');
  } catch (err) {
    toast.error('Error changing password. Please try again later.');
  } finally {
    isLoading.value = false;    
  }
}

</script>

<template>
  <main class="changepassword-form">
    <h4>Setup your password</h4>
    <div class="container">
      <div class="row">
        <form @submit.prevent="changePassword">
          <div class="row mb-3">
            <label class="col-sm-4 col-form-label read-only">Dealership Name</label>
            <div class="col-sm-8 read-only-field">{{ store.name }}</div>
          </div>
          <div class="row mb-3">
            <label class="col-sm-4 col-form-label read-only">Dealer Code / Account Number</label>
            <div class="col-sm-8 read-only-field">{{ store.customerNumber }}</div>
          </div>

          <div class="row mb-3">
            <label for="password" class="col-sm-4 col-form-label req">Password</label>
            <div class="col-sm-8">
              <input type="password" class="form-control" name="password" id="password"
                v-model="changePasswordForm.password" @blur="v$.password.$touch"
                autocomplete="new-password" />
              <div class="input-errors" v-for="error of v$?.password?.$errors" :key="error.$uid">
                <div class="error-msg">{{ error.$message }}</div>
              </div>
            </div>
          </div>

          <div class="row mb-3">
            <label for="passwordConfirm" class="col-sm-4 col-form-label req">Confirm Password</label>
            <div class="col-sm-8">
              <input type="password" class="form-control" name="passwordConfirm" id="passwordConfirm"
                v-model="changePasswordForm.confirmPassword" @blur="v$.confirmPassword.$touch"
                autocomplete="new-password" />
              <div class="input-errors" v-for="error of v$?.confirmPassword?.$errors" :key="error.$uid">
                <div class="error-msg">{{ error.$message }}</div>
              </div>
            </div>
          </div>

          <div class="row pt-4 pb-5">
            <div class="col-sm-12">
              <input type="submit" class="btn btn-primary" value="Change Password" />
            </div>
          </div>
        </form>
      </div>
      <LoadingComponent v-if="isLoadingAlternates" view-box="0 0 300 500"></LoadingComponent>
    </div>
  </main>
</template>


<style lang="scss">
main.changepassword-form {

  max-width: 700px;
  padding-top: 2rem;

  .input-group {
    justify-content: center;
  }

  >h4 {
    text-align: center;
  }
}

h4,
h5 {
  text-align: center;
}
</style>