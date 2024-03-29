<script setup lang="ts">

import * as yup from 'yup';
import dayjs from 'dayjs';
import { getItemAvailability } from '@/services/inventory-service';
import { useAuthStore } from '@/stores/auth-store';
import type { ItemAvailabilityResult } from '@/types/models';
import { computed, onMounted, reactive, ref, type PropType } from 'vue';
import { onBeforeRouteUpdate, useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import PartCardMini from '../components/PartCardMini.vue';
import NotificationCard from '../components/NotificationCard.vue';
import IconArrayRightRed from '../components/icons/IconArrayRightRed.vue';
import IconCloseXBlack from '../components/icons/IconCloseXBlack.vue';
import LoadingComponent from '../components/LoadingComponent.vue';
import LoadingComponentLarge from '../components/LoadingComponentLarge.vue';
import OrderForm from '../components/forms/OrderForm.vue';
import type { OrderFormViewModel } from '@/types/viewmodels';
import { required, email } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';
import { OrderType, PartTypes } from '@/types/enumtypes';
import { toCurrencyString } from '@/helpers/formatters';
import * as orderService from '@/services/order-service';


const props = defineProps({
  partNumber: { required: true, type: String },
  orderType: { required: true, type: String as PropType<OrderType> },
  isWarrantyExchange: { required: false, type: Boolean}
});


const toast = useToast();
const store = useAuthStore();
const router = useRouter();

const order = reactive<OrderFormViewModel>({
  orderType: props.orderType,
  partNumber: props.partNumber,
  isWarrantyExchange: props.isWarrantyExchange,
  dealerName: store.name!,
  dealerCode: store.customerNumber!,
  contactName: '',
  emailAddress: store.email ?? '',
  phoneNumber: store.phone ?? '',
  customerName: '',
  mileage: '',
  vin: '',
  partNumberObtained: '',

  // isWarrantyExchange: false,
  // isCore: false,
  // isGoodwill: false,

  roNumber: '',
  poNumber: '',
  serviceManagerFullName: '',
  //deliveryDate: ,
  //hours: null,
  customerComplaint: '',

  address: store.address ?? '',
  city: store.city ?? '',
  state: store.state ?? '',
  zip: store.zip ?? '',
  shippingMethod: '',

  //comments, ''
  customerMailingAddress: '',
  customerMailingCity: '',
  customerMailingState: '',
  customerMailingZip: '',

  technicianName: ''
});



let showCoreMessage = ref(false);
let isLoading = ref(false);
let searchResult = ref<ItemAvailabilityResult | null>(null);

const loadSideBar = async () => {

  // only perform cross-site checks for non-nissan dealers
  let shouldCheckCrossSiteInventory = !store.isNissanDealer;

  let itemResult = await getItemAvailability(props.partNumber, shouldCheckCrossSiteInventory);
  searchResult.value = itemResult;

  order.isRadio = itemResult.isRadio;
}



onMounted(() => {
  loadSideBar();
})

// This gets called right before the view is updated/refreshed (usually by clicking on a router link). view's get refreshed when they're already been 
// rendered once and then the user tries to re-render it by editing another user. here all we have to do to update the view is swap out the client reference.
onBeforeRouteUpdate((to, from) => {
  //clientService.getClient(to.params.id as string).then(res => client.value = res);  
});


let purchasePartPriceText = computed(() => {
  if (searchResult.value?.purchaseAvailability?.retailChargePriceMessage) {
    return searchResult.value?.purchaseAvailability?.retailChargePriceMessage;
  } else if (searchResult.value?.item?.retailPrice) {
    return toCurrencyString(searchResult.value?.item.retailPrice || 0);
  }
  return '';
});



function placeOrder(isFormValid: boolean) {

  console.debug('order being placed...');
  console.debug('current order Model: ');
  console.debug(order);

  if (!isFormValid) {
    console.log('form is not valid');
    toast.error('The form is not valid. Please check to make sure you filled out all of the required fields.');
    return;
  }

  if (order.isWarrantyExchange === false && order.isCore !== undefined && order.isCore !== null && order.isCore === false) {
    showCoreMessage.value = true;
    return;
  }

  isLoading.value = true;
  setTimeout(async () => { // we use setTimeout to simulate a delay in the order being placed. this is so we can see the loading spinner in action.

    try {
      // create the order
      let orderResult = await orderService.createOrder(order);

      let item = searchResult.value?.item;
      let availability = searchResult.value?.exchangeAvailability;

      if (order.isWarrantyExchange && availability?.partIsRestricted) {

        if (item?.partType === PartTypes.Cluster || item?.partType === PartTypes.Lcd) {

          toast.success('Your order was successfully placed. Because this is a Cluster part, you must fill out the CLUSTER survey and submit it.', {
            timeout: false
          });

          // redirect user to the Pqc Cluster survey for them to fill out the form
          router.push(`/clustersurvey/${orderResult.orderId}`);
          return;
        } else if (item?.partType === PartTypes.Radio) {

          toast.success('Your order was successfully placed. Because this is a Radio part, you must fill out the RADIO survey and submit it.', {
            timeout: false
          });

          // redirect user to the Pqc Radio survey for them to fill out the form.
          router.push(`/radiosurvey/${orderResult.orderId}`);
          return;
        }
      }

      toast.success('Order was successfully placed.');
      let orderId = orderResult.orderId;

      if (props.orderType === OrderType.Exchange) {
        router.push(`/advexchange/order/${props.orderType}/${props.partNumber}/confirm/${orderId}`);
      } else if (props.orderType === OrderType.Purchase) {
        router.push(`/outrightpurchase/order/${props.orderType}/${props.partNumber}/confirm/${orderId}`);
      }      

    } finally {
      isLoading.value = false;
    }

  }, 1000);
}

function purchasePart() {
  router.push({ name: 'orderpurch', params: { partNumber: props.partNumber, orderType: OrderType.Purchase } });
}

function showCoreMessageHandler(showCore: boolean) {
  showCoreMessage.value = showCore;
}

</script>
  
<template>

  <main class="order-main">

    <div class="row">
      <div class="col-md-3 order-sidebar justify-content-center">
        <PartCardMini v-bind:item-avail="searchResult" :is-warranty-exchange="props.isWarrantyExchange"></PartCardMini>
      </div>
      <div class="col order-form-main">

        <RouterView />

        <div
          v-if="router.currentRoute.value.name !== 'orderconfirm1' && router.currentRoute.value.name !== 'orderconfirm2'">

          <div class="top-space">
            <span class="req-label">Required Field</span>
          </div>
          <LoadingComponentLarge v-if="isLoading" view-box="0 0 700 500"></LoadingComponentLarge>
          <OrderForm v-show="!isLoading" :order-type="props.orderType" :part-number="props.partNumber" 
            :dealer-name="store.name!" :dealer-code="store.customerNumber!" :part-is-restricted="searchResult?.exchangeAvailability?.partIsRestricted ?? undefined"
            v-model:is-warranty-exchange="order.isWarrantyExchange"
            v-model:contact-name="order.contactName"
            v-model:email-address="order.emailAddress" v-model:phone-number="order.phoneNumber"
            v-model:customer-name="order.customerName" v-model:mileage="order.mileage" v-model:vin="order.vin"
            v-model:part-number-obtained="order.partNumberObtained"
             v-model:is-radio="order.isRadio"
            v-model:is-media-stuck="order.isMediaStuck" v-model:is-core="order.isCore"
            v-model:is-goodwill="order.isGoodwill" v-model:po-number="order.poNumber" v-model:ro-number="order.roNumber"
            v-model:service-manager-full-name="order.serviceManagerFullName" v-model:delivery-date="order.deliveryDate"
            v-model:hours="order.hours" v-model:customer-complaint="order.customerComplaint"
            v-model:address="order.address" v-model:city="order.city" v-model:state="order.state"
            v-model:zip="order.zip" v-model:shipping-method="order.shippingMethod" v-model:comments="order.comments"
            v-model:customer-mailing-address="order.customerMailingAddress"
            v-model:customer-mailing-city="order.customerMailingCity"
            v-model:customer-mailing-state="order.customerMailingState"
            v-model:technician-name="order.technicianName"
            v-model:customer-mailing-zip="order.customerMailingZip" @on-show-core-message="showCoreMessageHandler"
            @on-submit="placeOrder"></OrderForm>
        </div>
      </div>

      <vue-final-modal v-model="showCoreMessage" classes="modal-container" content-class="modal-content">
        <button class="modal__close" @click="showCoreMessage = false">
          <IconCloseXBlack />
        </button>

        <span class="modal__title">If you don't have a core for <span style="color: #0041A3">part #
            {{ props.partNumber }}</span> you will need
          to do an outright purchase for this part.</span>
        <div class="modal__content">
          <p class="purchase-box">
          <div>
            <label>OUTRIGHT PURCHASE PRICE</label>
          </div>
          <div>
            <div class="price">{{ purchasePartPriceText }}</div>
          </div>
          </p>
          <p style="margin-top: 2em;">
          <div style="width: fit-content; margin: 0 auto;">
            <button type="button" class="btn btn-secondary" @click="purchasePart"
              :disabled="searchResult?.purchaseAvailability?.retailChargePriceMessage !== null && searchResult?.purchaseAvailability?.retailChargePriceMessage !== ''">Purchase</button>
          </div>
          </p>
        </div>
      </vue-final-modal>

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