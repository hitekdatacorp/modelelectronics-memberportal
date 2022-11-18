<script setup lang="ts">

import * as yup from 'yup';
import dayjs from 'dayjs';
import { getItemAvailability } from '@/services/inventory-service';
import { useAuthStore } from '@/stores/auth-store';
import type { ItemAvailabilityResult } from '@/types/models';
import { computed, onMounted, reactive, ref, type PropType } from 'vue';
import { onBeforeRouteUpdate, RouterView, useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import PartCardMini from '../components/PartCardMini.vue';
import NotificationCard from '../components/NotificationCard.vue';
import IconArrayRightRed from '../components/icons/IconArrayRightRed.vue';
import IconCloseXBlack from '../components/icons/IconCloseXBlack.vue';
import LoadingComponent from '../components/LoadingComponent.vue';
import LoadingComponentLarge from '../components/LoadingComponentLarge.vue';
import OrderForm from '../components/forms/OrderForm.vue';
import type { NissanOrderFormViewModel, OrderFormViewModel } from '@/types/viewmodels';
import { required, email, helpers, integer, maxLength } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';
import { OrderType, PartTypes } from '@/types/enumtypes';
import { toCurrencyString } from '@/helpers/formatters';
import * as orderService from '@/services/order-service';
import { vinNumber, usPhoneNumber } from '@/helpers/validators';
import StateDropdown from '@/components/StateDropdown.vue';

const props = defineProps({
  partNumber: { required: true, type: String },
  orderType: { required: true, type: String as PropType<OrderType> }
});


const toast = useToast();
const store = useAuthStore();
const router = useRouter();

const order = reactive<NissanOrderFormViewModel>({
  orderType: OrderType.Nissan,
  partNumber: props.partNumber,
  dealerName: store.name!,
  dealerCode: store.customerNumber!,
  contactName: '',
  emailAddress: store.email ?? '',
  phoneNumber: store.phone ?? '',
  address: store.address ?? '',
  city: store.city ?? '',
  state: store.state ?? '',
  zip: store.zip ?? '',
  mileage: '',
  mileageType: 'MPH', // either MPH or KPH
  vin: '',
  dealerReferenceNumber: '',
  customerComplaint: '',
});

let isLoading = ref(false);
let searchResult = ref<ItemAvailabilityResult | null>(null);

const loadSideBar = async () => {
  let itemResult = await getItemAvailability(props.partNumber);
  searchResult.value = itemResult;
}



onMounted(() => {
  loadSideBar();
})

// This gets called right before the view is updated/refreshed (usually by clicking on a router link). view's get refreshed when they're already been 
// rendered once and then the user tries to re-render it by editing another user. here all we have to do to update the view is swap out the client reference.
onBeforeRouteUpdate((to, from) => {
  //clientService.getClient(to.params.id as string).then(res => client.value = res);  
});

function onStateSelectChangeHandler(v: string) {
  order.state = v;
}

async function placeOrder() {

  console.debug('order being placed...');
  console.debug('current order Model: ');
  console.debug(order);

  const isFormValid = await v$.value.$validate();

  if (!isFormValid) {
    console.log('form is not valid');
    toast.error('The form is not valid. Please check to make sure you filled out all of the required fields.');
    return;
  }

  isLoading.value = true;
  setTimeout(async () => {

    try {
      // create the order
      let orderResult = await orderService.createNissanOrder(order);        

      toast.success('Order was successfully placed.');
      let orderId = orderResult.orderId;

      router.push(`/speedometer/order/${props.orderType}/${props.partNumber}/confirm/${orderId}`);
    
    } finally {
      isLoading.value = false;
    }

  }, 1000);
}


// setup form validation
const rules = {
  contactName: { required },
  emailAddress: { required, email },
  phoneNumber: {
    required,
    phoneNumber: helpers.withMessage('Not a valid phone number', usPhoneNumber)
  },

  vin: { vinNumber: helpers.withMessage('Not a valid VIN number', vinNumber) },
  dealerReferenceNumber: { required },
  mileage: { required, integer: helpers.withMessage('Mileage must be a valid number. Please remove any commas or decimals or any other special character', integer) },
  mileageType: { required },
  partNumber: { required, maxLength: maxLength(255) },

  address: { required },
  city: { required },
  state: { required },
  zip: { required },
};
const v$ = useVuelidate(rules, order);

</script>
  
<template>

  <main class="order-main">

    <div class="row">
      <div class="col-md-3 order-sidebar justify-content-center">
        <PartCardMini v-bind:item-avail="searchResult"></PartCardMini>
      </div>
      <div class="col order-form-main">

        <RouterView />

        <div
          v-if="router.currentRoute.value.name !== 'orderconfirmnissan'">

          <div class="top-space">
            <span class="req-label">Required Field</span>
          </div>
          <LoadingComponentLarge v-if="isLoading" view-box="0 0 700 500"></LoadingComponentLarge>

          <form @submit.prevent="placeOrder()" ref="form">
            <div class="form-section">
              <div class="form-section-header">
                <div class="over-score">&nbsp;</div>
                <h4>Contact Information</h4>
              </div>

              <div class="row mb-3">
                <div class="col-xxl-4 col-xl-4 col-6">
                  <label class="form-label read-only">DEALERSHIP NAME</label>
                  <div class="read-only-field">{{ store.name }}</div>
                </div>
                <div class="col-xxl-3 col-xl-4 col-6">
                  <label class="form-label read-only">DEALER CODE</label>
                  <div class="read-only-field">{{ store.customerNumber }}</div>
                </div>
              </div>

              <div class="row mb-3">
                <div class="col-md-12 col-lg-6 col-xl-4">
                  <label for="contactName" class="form-label req">Contact Name</label>
                  <input type="text" class="form-control" id="contactName" name="contactName"
                    v-model="order.contactName" @blur="v$.contactName.$touch" />
                  <div class="input-errors" v-for="error of v$?.contactName?.$errors" :key="error.$uid">
                    <div class="error-msg">{{ error.$message }}</div>
                  </div>
                </div>
                <div class="col-md-12 col-lg-6 col-xl-5">
                  <label for="emailAddress" class="form-label req">Email Address</label>
                  <input type="email" class="form-control" id="emailAddress" name="emailAddress"
                    v-model="order.emailAddress" @blur="v$.emailAddress.$touch" />
                  <div class="input-errors" v-for="error of v$?.emailAddress?.$errors" :key="error.$uid">
                    <div class="error-msg">{{ error.$message }}</div>
                  </div>
                </div>
                <div class="col-xl-3">
                  <label for="phoneNumber" class="form-label req">Phone Number</label>
                  <input type="text" class="form-control" id="phoneNumber" name="phoneNumber"
                    v-model="order.phoneNumber" @blur="v$.phoneNumber.$touch" />
                  <div class="input-errors" v-for="error of v$?.phoneNumber?.$errors" :key="error.$uid">
                    <div class="error-msg">{{ error.$message }}</div>
                  </div>

                </div>
              </div>

              <div class="row mb-3">
                <div class="col-md-12 col-lg-6 col-xl-4">
                  <label for="address" class="form-label req">Address</label>
                  <input type="text" class="form-control" id="address" name="address" v-model="order.address"
                    @blur="v$.address.$touch" />
                  <div class="input-errors" v-for="error of v$?.address?.$errors" :key="error.$uid">
                    <div class="error-msg">{{ error.$message }}</div>
                  </div>
                </div>
                <div class="col-md-12 col-lg-6 col-xl-4">
                  <label for="city" class="form-label req">City</label>
                  <input type="text" class="form-control" id="city" name="city" v-model="order.city"
                    @blur="v$.city.$touch" />
                  <div class="input-errors" v-for="error of v$?.city?.$errors" :key="error.$uid">
                    <div class="error-msg">{{ error.$message }}</div>
                  </div>
                </div>
                <div class="col-md-6 col-lg-3 col-xl-2">
                  <label for="stateSelect" class="form-label req">State</label>

                  <StateDropdown class="form-select" id="stateSelect" name="stateSelect" aria-label="Choose US state"
                    :value="order.state"
                    @change="onStateSelectChangeHandler(($event.target as HTMLInputElement).value)">
                  </StateDropdown>
                  <div class="input-errors" v-for="error of v$?.state?.$errors" :key="error.$uid">
                    <div class="error-msg">{{ error.$message }}</div>
                  </div>
                </div>
                <div class="col-md-6 col-lg-3 col-xl-2">
                  <label for="zip" class="form-label req">ZIP</label>
                  <input type="text" class="form-control" id="zip" name="zip" v-model="order.zip"
                    @blur="v$.zip.$touch" />
                  <div class="input-errors" v-for="error of v$?.zip?.$errors" :key="error.$uid">
                    <div class="error-msg">{{ error.$message }}</div>
                  </div>
                </div>
              </div>
            </div>

            <div class="form-section">
              <div class="form-section-header mb-3">
                <div class="over-score">&nbsp;</div>
                <h4>Vehicle Odometer</h4>
                <NotificationCard>
                  <!-- <span style="font-size: 1em; font-family: Inter-Bold; font-weight: bold;">GM Requirement: </span>
                  <span>If unit is on restriction you'll be automatically forwarded to the correct PQC survey.</span> -->
                </NotificationCard>
              </div>

              <div class="row mb-3 gy-3">
                <div class="col-xs-6 col-md-6 col-lg-5">
                  <label for="mileage" class="form-label req">Actual Mileage on Existing Odometer</label>
                  <input type="text" class="form-control" id="mileage" name="mileage" v-model="order.mileage"
                    @blur="v$.mileage.$touch" aria-describedby="mileageHelp" />
                  <div id="mileageHelp" class="form-text">Do not put tenths of a mile</div>
                  <div class="input-errors" v-for="error of v$?.mileage?.$errors" :key="error.$uid">
                    <div class="error-msg">{{ error.$message }}</div>
                  </div>
                </div>
                <div class="col-xs-6 col-md-5 col-lg-3">
                  <label for="mileage" class="form-label">&nbsp;</label>
                  <select class="form-select" id="mileageType" name="mileageType" aria-label="MPH or KPH"
                    v-model="order.mileageType">
                    <option value="MPH" selected>MPH</option>
                    <option value="KPH">KPH</option>
                  </select>
                  <div class="input-errors" v-for="error of v$?.mileageType?.$errors" :key="error.$uid">
                    <div class="error-msg">{{ error.$message }}</div>
                  </div>
                </div>
              </div>


            </div>

            <div class="form-section">
              <div class="form-section-header mb-3">
                <div class="over-score">&nbsp;</div>
                <h4>Customer Information</h4>
                <NotificationCard>
                  <!-- <span style="font-size: 1em; font-family: Inter-Bold; font-weight: bold;">GM Requirement: </span>
                  <span>If unit is on restriction you'll be automatically forwarded to the correct PQC survey.</span> -->
                </NotificationCard>

                <div class="row mb-3">
                  <div class="col-xs-6 col-md-6 col-lg-5">
                    <label for="vin" class="form-label req">VIN</label>
                    <input type="text" class="form-control" id="vin" name="vin" v-model="order.vin" />
                    <div class="input-errors" v-for="error of v$?.vin?.$errors" :key="error.$uid">
                      <div class="error-msg">{{ error.$message }}</div>
                    </div>
                  </div>

                  <div class="col-xs-6 col-md-6 col-lg-5">
                    <label for="vin" class="form-label req">Dealer Reference Number</label>
                    <input type="text" class="form-control" id="dealerReferenceNumber" name="dealerReferenceNumber"
                      v-model="order.dealerReferenceNumber" />
                    <div class="input-errors" v-for="error of v$?.dealerReferenceNumber?.$errors" :key="error.$uid">
                      <div class="error-msg">{{ error.$message }}</div>
                    </div>
                  </div>
                </div>

                <div class="row mb-3">
                  <div class="col-12">
                    <label for="complaint" class="form-label req">Customer Complaint</label> <span
                      class="label-postscript">(Do not use INOP)</span>
                    <input type="text" class="form-control" id="complaint" name="complaint" v-model="order.customerComplaint"                     
                      @blur="v$.customerComplaint.$touch" />
                    <div class="input-errors" v-for="error of v$?.customerComplaint?.$errors" :key="error.$uid">
                      <div class="error-msg">{{ error.$message }}</div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

                  
          <div class="row pt-4 pb-4">
            <div class="col-6 col-lg-4">
              <input type="submit" class="btn btn-primary" value="Place My Order" />
            </div>
            
          </div>

          </form>

        </div>
      </div>
    </div>
  </main>

</template>
  
<style lang="scss" scoped>
:deep(.modal-container) {
  display: flex;
  justify-content: center;
  align-items: center;

  opacity: 1;
}

:deep(.modal-content) {
  max-width: 800px;
  // min-height: 400px;
  position: relative;
  display: flex;
  flex-direction: column;
  margin: 0 1rem;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.25rem;
  background: #FFFFFF 0% 0% no-repeat padding-box;
  box-shadow: 0px 0px 10px #00000029;
}

p.purchase-box {
  background-color: #F0F4FA;
  margin: 0 auto;
  width: fit-content;
  padding: 1.5em 3em;
  background: #F0F4FA 0% 0% no-repeat padding-box;
  opacity: 1;

  label {
    text-align: left;
    font: normal normal bold 0.8rem/1.1rem Inter-Bold;
    letter-spacing: 0px;
    color: #000000;
    text-transform: uppercase;
    opacity: 0.54;
  }

  .price {
    text-align: center;
    font-family: Inter-Bold;
    font-size: 2em;
  }
}

.modal__title {
  text-align: center;
  font: normal normal bold 24px/33px Inter-Bold;
  letter-spacing: 0px;
  opacity: 1;
  margin: 2em 2rem 2rem 0;

}

.modal__close {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
}
</style>

<style scoped>
/* .dark-mode div::v-deep .modal-content {
  border-color: #2d3748;
  background-color: #fff;
} */
</style>

<style lang="scss">
@import '@/assets/scss/variables';



.order-sidebar {
  @media (min-width: 768px) {
    min-width: 350px !important;
  }
}

.order-form-main {
  background-color: $secondary-background;

  .top-space {
    padding: 1rem 0;
  }

  .form-section {
    padding: 1.8rem;
    margin-bottom: 1em;
    background: #FFFFFF 0% 0% no-repeat padding-box;
    box-shadow: 0px 0px 10px #00000029;
    opacity: 1;

    .form-section-header {
      .over-score {
        width: 70px;
        border-top: 4px solid $primary;
      }
    }
  }
}
</style>