<script setup lang="ts">

import * as yup from 'yup';
import dayjs from 'dayjs';
import { getItemAvailability } from '@/services/inventory-service';
import { useAuthStore } from '@/stores/auth-store';
import type { ItemAvailabilityResult } from '@/types/models';
import { computed, onMounted, reactive, ref } from 'vue';
import { onBeforeRouteUpdate } from 'vue-router';
import { useToast } from 'vue-toastification';
import PartCardMini from '../components/PartCardMini.vue';
import NotificationCard from '../components/NotificationCard.vue';
import IconArrayRightRed from '../components/icons/IconArrayRightRed.vue';
import LoadingComponent from '../components/LoadingComponent.vue';
import LoadingComponentLarge from '../components/LoadingComponentLarge.vue';
import OrderForm from '../components/forms/OrderForm.vue';
import type { OrderFormViewModel } from '@/types/viewmodels';
import { required, email } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';


const props = defineProps({
  partNumber: { required: true, type: String }
});


const toast = useToast();
const store = useAuthStore();

const order = reactive<OrderFormViewModel>({

  partNumber: props.partNumber,
  dealershipName: store.name!,
  dealershipCode: store.customerNumber!,
  contactName: '',
  emailAddress: '',
  phoneNumber: '',
  customerName: '',
  mileage: '',
  vin: '',
  partNumberObtained: '',

  // isWarranty: false,
  // isCore: false,
  // isGoodwill: false,

  roNumber: '',
  poNumber: '',
  serviceManagerFullName: '',
  //deliveryDate: ,
  hours: '',
  customerComplaint: '',

  address: '',
  city: '',
  state: '',
  zip: '',
  shippingMethod: '',
  //comments, ''
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



function placeOrder() {
  console.debug('order being placed...');
  console.debug('current order Model: ');
  console.debug(order);  


  //order.contactName = 'mycontactname';  

  // isLoading.value = true;
  // setTimeout(() => {
  //   toast.success('Order Placed');

  //   clearOrderFields(order);
  //   isLoading.value = false;

  // }, 2000);
}



// setup form validation
const rules = {
  contactName: {required},
  emailAddress: {required, email}
};

// setup validation with vuelidate 
const v$ = useVuelidate(rules, order);


</script>
  
<template>

  <main class="order-main">

    <div class="row">
      <div class="col-md-3 order-sidebar justify-content-center">
        <PartCardMini v-bind:item-avail="searchResult"></PartCardMini>
      </div>
      <div class="col order-form-main">

        <div class="top-space">
          <span class="req-label">Required Field</span>
        </div>

        <LoadingComponentLarge v-if="isLoading" view-box="0 0 700 500"></LoadingComponentLarge>
        <OrderForm :part-number="props.partNumber" :dealership-name="store.name!"
          :dealership-code="store.customerNumber!" v-model:contact-name="order.contactName" v-model:email-address="order.emailAddress"
          v-model:phone-number="order.phoneNumber" v-model:customer-name="order.customerName" v-model:mileage="order.mileage"
          v-model:vin="order.vin" v-model:part-number-obtained="order.partNumberObtained" v-model:is-warranty="order.isWarranty"
          v-model:is-core="order.isCore" v-model:is-goodwill="order.isGoodwill" v-model:po-number="order.poNumber"
          v-model:ro-number="order.roNumber" v-model:service-manager-full-name="order.serviceManagerFullName"
          v-model:delivery-date="order.deliveryDate" v-model:hours="order.hours" v-model:customer-complaint="order.customerComplaint"
          v-model:address="order.address" v-model:city="order.city" v-model:state="order.state" v-model:zip="order.zip"
          v-model:shipping-method="order.shippingMethod" v-model:comments="order.comments"
          @on-submit="placeOrder()"
          :vuelidate="v$"></OrderForm>
      </div>
    </div>
  </main>

</template>
  
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