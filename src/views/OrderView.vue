<script setup lang="ts">

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

type OrderViewModel = {

  contactName: string | null,
  emailAddress: string | null,
  phoneNumber: string | null,
  customerName: string | null,
  mileage: string | null,
  vin: string | null,
  partNumberObtained: string | null,

  isWarranty: boolean | null,
  isCore: boolean | null,
  isGoodwill: boolean | null,

  roNumber: string | null,
  poNumber: string | null,
  serviceManagerFullName: string | null,
  deliveryDate: Date | null,
  hours: string | null,
  customerComplaint: string | null,

  address: string | null,
  city: string | null,
  state: string | null,
  zip: string | null,
  shippingMethod: string | null,
  comments: string | null,
}

const toast = useToast();
const store = useAuthStore();

const order = reactive<OrderViewModel>({
  contactName: null,
  emailAddress: null,
  phoneNumber: null,
  customerName: null,
  mileage: null,
  vin: null,
  partNumberObtained: null,


  isWarranty: null,
  isCore: null,
  isGoodwill: null,

  roNumber: null,
  poNumber:  null,
  serviceManagerFullName: null,
  deliveryDate: null,
  hours: null,
  customerComplaint: null,

  address: null,
  city: null,
  state: null,
  zip: null,
  shippingMethod: null,
  comments: null,

});

const props = defineProps({
  partNumber: { required: true, type: String }
});

let isLoading = ref(false);
let searchResult = ref<ItemAvailabilityResult | null>(null);

const loadSideBar = async () => {
  let itemResult = await getItemAvailability(props.partNumber);

  searchResult.value = itemResult;
}

function clearOrderFields(order: OrderViewModel) {

  // Object.keys(order).forEach(key => {
  //   order[key] = null;
  // });

  order.contactName=  null;
  order.emailAddress=  null;
  order.phoneNumber=  null;
  order.customerName=  null;
  order.mileage=  null;
  order.vin=  null;
  order.partNumberObtained=  null;


  order.isWarranty=  null;
  order.isCore=  null;
  order.isGoodwill=  null;

  order.roNumber=  null;
  order.poNumber=   null;
  order.serviceManagerFullName=  null;
  order.deliveryDate=  null;
  order.hours=  null;
  order.customerComplaint=  null;

  order.address=  null;
  order.city=  null;
  order.state=  null;
  order.zip=  null;
  order.shippingMethod=  null;
  order.comments= null;
}

onMounted(() => {
  loadSideBar();
})

// This gets called right before the view is updated/refreshed (usually by clicking on a router link). view's get refreshed when they're already been 
// rendered once and then the user tries to re-render it by editing another user. here all we have to do to update the view is swap out the client reference.
onBeforeRouteUpdate((to, from) => {

  //clientService.getClient(to.params.id as string).then(res => client.value = res);  
});


let calcShipDate = computed(() => {
  const dt = dayjs(new Date());
  return dt.format('dddd, MM/DD/YYYY');
});

let calcArrivalDate = computed(() => {
  let dt = new Date();
  dt.setDate(dt.getDate() + 1);
  const dts = dayjs(dt);
  return dts.format('dddd, MM/DD/YYYY');
});


function placeOrder(e: Event) {
  e.preventDefault();
  console.debug('order being placed...');
  console.debug('current order Model: ');
  console.debug(order);

  isLoading.value = true;
  setTimeout(() => {
    toast.success('Order Placed');

    clearOrderFields(order);
    isLoading.value = false;

  }, 2000);
}

function clearForm() {
  clearOrderFields(order);
}

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
        <form @submit.prevent="placeOrder" v-if="!isLoading">
          <div class="form-section">
            <div class="form-section-header">
              <div class="over-score">&nbsp;</div>
              <h4>Contact Information</h4>
            </div>

            <div class="row mb-3">
              <div class="col-xxl-4 col-xl-4 col-6">
                <label class="form-label read-only">DEALERSHIP NAME</label>
                <div class="read-only-field">{{store.name}}</div>
              </div>
              <div class="col-xxl-3 col-xl-4 col-6">
                <label class="form-label read-only">DEALER CODE</label>
                <div class="read-only-field">{{store.customerNumber}}</div>
              </div>
            </div>

            <div class="row">
              <div class="col-md-12 col-lg-6 col-xl-4">
                <label for="contactName" class="form-label req">Contact Name</label>
                <input type="text" class="form-control" id="contactName" v-model="order.contactName" />
              </div>
              <div class="col-md-12 col-lg-6 col-xl-5">
                <label for="emailAddress" class="form-label req">Email Address</label>
                <input type="email" class="form-control" id="emailAddress" v-model="order.emailAddress" />
              </div>
              <div class="col-xl-3">
                <label for="phoneNumber" class="form-label req">Phone Number</label>
                <input type="text" class="form-control" id="phoneNumber" v-model="order.phoneNumber" />
              </div>
            </div>

          </div>


          <div class="form-section">
            <div class="form-section-header mb-3">
              <div class="over-score">&nbsp;</div>
              <h4>Order Information</h4>
              <NotificationCard>
                <span style="font-size: 1em; font-family: Inter-Bold; font-weight: bold;">GM Requirement: </span>
                <span>If unit is on restriction you'll be automatically forwarded to the correct PQC survey.</span>
              </NotificationCard>
            </div>

            <div class="row mb-3 gy-3">
              <div class="col-md-12 col-lg-6 col-xl-4">
                <label for="customerName" class="form-label req">Customer Name</label>
                <input type="text" class="form-control" id="customerName" />
              </div>
              <div class="col-md-12 col-lg-6 col-xl-5">
                <label for="mileage" class="form-label req">Mileage</label>
                <input type="text" class="form-control" id="mileage" />
              </div>
              <div class="col-xl-3">
                <label for="vin" class="form-label req">VIN</label>
                <input type="text" class="form-control" id="vin" />
              </div>
            </div>

            <div class="row gy-sm-3 mb-3">
              <div class="col-md-12 col-lg-6 col-xl-4">
                <label for="partSelect" class="form-label req">How did you obtain the part number?</label>
                <select class="form-select" id="partSelect" aria-label="Part number questionairre">
                  <option value="">----</option>
                  <option value="From Unit">From Unit</option>
                  <option value="Tech2">Tech2</option>
                  <option value="Catalogue">Catalogue</option>
                  <option value="TAC">TAC</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div class="col-md-12 col-lg-6 col-xl-4">
                <label for="warrantyExchange" class="form-label req">Is this a Warranty Exchange?</label> <br />
                <div class="form-check form-check-inline form-radio-button">
                  <input type="radio" class="form-check-input" name="warrantyExchange" id="warrantyExchangeYes"
                    autocomplete="off" :value="true" v-model="order.isWarranty" />
                  <label class="form-check-label" for="warrantyExchangeYes" style="padding: .5em 1em;">Yes</label>
                </div>
                <div class="form-check form-check-inline form-radio-button">
                  <input type="radio" class="form-check-input" name="warrantyExchange" id="warrantyExchangeNo"
                    autocomplete="off" :value="false" v-model="order.isWarranty" />
                  <label class="form-check-label" for="warrantyExchangeNo" style="padding: .5em 1em;">No</label>
                </div>
              </div>
              <div class="col-md-12 col-lg-6 col-xl-3" v-if="order.isWarranty !== null && order.isWarranty === false">
                <label for="core" class="form-label req">Do you have a core?</label> <br />
                <div class="form-check form-check-inline form-radio-button">
                  <input type="radio" class="form-check-input" name="core" id="coreYes" autocomplete="off" :value="true"
                    v-model="order.isCore" />
                  <label class="form-check-label" for="coreYes" style="padding: .5em 1em;">Yes</label>
                </div>
                <div class="form-check form-check-inline form-radio-button">
                  <input type="radio" class="form-check-input" name="core" id="coreNo" autocomplete="off" :value="false"
                    v-model="order.isCore" />
                  <label class="form-check-label" for="coreNo" style="padding: .5em 1em;">No</label>
                </div>
              </div>
              <div class="col" v-if="order.isCore !== null && order.isCore === true">
                <label for="poNumber" class="form-label req">PO #</label>
                <input type="text" class="form-control" id="poNumber" />
              </div>
              <div class="col-xl-3 col-6" v-if="order.isWarranty !== null && order.isWarranty === true">
                <label for="roNumber" class="form-label req">RO #</label>
                <input type="text" class="form-control" id="roNumber" />
              </div>
            </div>

            <div class="row gy-3">

              <div class="col-sm-12 col-md-12 col-lg-4 col-xxl-2"
                v-if="order.isWarranty !== null && order.isWarranty === true">
                <label for="goodwill" class="form-label req">Is Goodwill?</label>
                <br />
                <div class="form-check form-check-inline form-radio-button">
                  <input type="radio" class="form-check-input" name="goodwill" id="goodwillYes" autocomplete="off"
                    :value="true" v-model="order.isGoodwill" />
                  <label class="form-check-label" for="goodwillYes" style="padding: .5em 1em;">Yes</label>
                </div>
                <div class="form-check form-check-inline form-radio-button">
                  <input type="radio" class="form-check-input" name="goodwill" id="goodwillNo" autocomplete="off"
                    :value="false" v-model="order.isGoodwill" />
                  <label class="form-check-label" for="goodwillNo" style="padding: .5em 1em;">No</label>
                </div>
              </div>

              <div class="col-sm-12 col-md-12 col-lg-7 col-xxl-5"
                v-if="order.isGoodwill !== null && order.isGoodwill === true">
                <label for="serviceManager" class="form-label req">Service Manager's Full Name for Goodwill</label>
                <input type="text" class="form-control" id="serviceManager" />
              </div>

              <div class="col-sm-6 col-md-6 col-lg-4 col-xxl-3"
                v-if="order.isGoodwill !== null && order.isGoodwill === true">
                <label for="deliveryDate" class="form-label req">Delivery Date</label>
                <input type="date" class="form-control" id="deliveryDate" />
              </div>

              <div class="col-sm-6 col-md-6 col-lg-2 col-xxl-2"
                v-if="order.isGoodwill !== null && order.isGoodwill === true">
                <label for="hours" class="form-label req">Hours</label>
                <input type="text" class="form-control" id="hours" />
              </div>
            </div>

            <div class="row">
              <div class="col-12">
                <label for="complaint" class="form-label req">Customer Complaint</label> <span
                  class="label-postscript">(Do not use INOP)</span>
                <input type="text" class="form-control" id="complaint" v-model="order.c" />
              </div>
            </div>
          </div>

          <!-- SHIPPING INFO -->
          <div class="form-section">
            <div class="form-section-header">
              <div class="over-score">&nbsp;</div>
              <h4>Shipping Information</h4>
            </div>

            <div class="row mb-3">
              <div class="col-md-12 col-lg-6 col-xl-4">
                <label for="address" class="form-label req">Address</label>
                <input type="text" class="form-control" id="address" />
              </div>
              <div class="col-md-12 col-lg-6 col-xl-4">
                <label for="city" class="form-label req">City</label>
                <input type="text" class="form-control" id="city" />
              </div>
              <div class="col-md-6 col-lg-3 col-xl-2">
                <label for="stateSelect" class="form-label req">State</label>
                <select class="form-select" id="stateSelect" aria-label="Choose US state">
                  <option value="">----</option>
                  <option value="AL">Alabama</option>
                  <option value="AK">Alaska</option>
                  <option value="AZ">Arizona</option>
                  <option value="AR">Arkansas</option>
                  <option value="CA">California</option>
                  <option value="CO">Colorado</option>
                  <option value="CT">Connecticut</option>
                  <option value="DE">Delaware</option>
                  <option value="DC">District Of Columbia</option>
                  <option value="FL">Florida</option>
                  <option value="GA">Georgia</option>
                  <option value="HI">Hawaii</option>
                  <option value="ID">Idaho</option>
                  <option value="IL">Illinois</option>
                  <option value="IN">Indiana</option>
                  <option value="IA">Iowa</option>
                  <option value="KS">Kansas</option>
                  <option value="KY">Kentucky</option>
                  <option value="LA">Louisiana</option>
                  <option value="ME">Maine</option>
                  <option value="MD">Maryland</option>
                  <option value="MA">Massachusetts</option>
                  <option value="MI">Michigan</option>
                  <option value="MN">Minnesota</option>
                  <option value="MS">Mississippi</option>
                  <option value="MO">Missouri</option>
                  <option value="MT">Montana</option>
                  <option value="NE">Nebraska</option>
                  <option value="NV">Nevada</option>
                  <option value="NH">New Hampshire</option>
                  <option value="NJ">New Jersey</option>
                  <option value="NM">New Mexico</option>
                  <option value="NY">New York</option>
                  <option value="NC">North Carolina</option>
                  <option value="ND">North Dakota</option>
                  <option value="OH">Ohio</option>
                  <option value="OK">Oklahoma</option>
                  <option value="OR">Oregon</option>
                  <option value="PA">Pennsylvania</option>
                  <option value="RI">Rhode Island</option>
                  <option value="SC">South Carolina</option>
                  <option value="SD">South Dakota</option>
                  <option value="TN">Tennessee</option>
                  <option value="TX">Texas</option>
                  <option value="UT">Utah</option>
                  <option value="VT">Vermont</option>
                  <option value="VA">Virginia</option>
                  <option value="WA">Washington</option>
                  <option value="WV">West Virginia</option>
                  <option value="WI">Wisconsin</option>
                  <option value="WY">Wyoming</option>
                </select>
              </div>
              <div class="col-md-6 col-lg-3 col-xl-2">
                <label for="zip" class="form-label req">ZIP</label>
                <input type="text" class="form-control" id="zip" />
              </div>
            </div>

            <div class="row  mb-3">
              <div class="col-12">
                <label class="form-label req" style="margin-bottom: 0;" for="shippingMethod">Choose Your Shipping Method
                </label>
                <br />
                <span style="font-weight: bold; font-size: .8em; color: #c40000">For Special Coverage/Campaign cluster
                  exchanges: </span>
                <span style="font-size: .8em;">Your unit will be shipped Fedex Ground unless other has been
                  specified.</span>
              </div>
            </div>
            <div class="row mb-3">
              <div class="col-12 col-lg-5">
                <div class="form-check form-check-inline form-radio-button">
                  <input type="radio" class="form-check-input" name="shippingMethod" id="shippingMethodOvernight"
                    autocomplete="off" value="overnight" />
                  <label class="form-check-label" for="shippingMethodOvernight" style="padding: .5em 1em;">Overnight
                    Air</label>
                </div>
                <div class="form-check form-check-inline form-radio-button">
                  <input type="radio" class="form-check-input" name="shippingMethod" id="shippingMethodGround"
                    autocomplete="off" value="ground" />
                  <label class="form-check-label" for="shippingMethodGround" style="padding: .5em 1em;">Ground</label>
                </div>
              </div>

              <div class="col-5 col-lg-3">
                <label class="form-label read-only">SHIP DATE</label>
                <div class="read-only-field">{{calcShipDate}}</div>
              </div>
              <div class="col-2 col-lg-1 d-flex align-items-center">
                <IconArrayRightRed>
                </IconArrayRightRed>
              </div>
              <div class="col-5 col-lg-3">
                <label class="form-label read-only">EST. ARRIVAL DATE</label>
                <div class="read-only-field">{{calcArrivalDate}}</div>
              </div>

            </div>

            <div class="row mb-3">
              <label class="form-label" for="comments">Comments</label>
              <textarea class="form-control" row="2" id="comments"></textarea>
            </div>
            <div class="row">
              <NotificationCard>
                <span style="font-size: 1em; font-family: Inter-Bold; font-weight: bold;">This core is due back within
                  30 days of it's shipping date. </span>
              </NotificationCard>
            </div>
          </div>

          <div class="row pt-4 pb-4">
            <div class="col-6 col-lg-4">
              <input type="submit" class="btn btn-primary" value="Place My Order" />
            </div>
            <div class="col-6 col-lg-3">
              <input type="button" class="btn btn-secondary" value="Clear Form" @click="clearForm()" />
            </div>
          </div>

        </form>
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