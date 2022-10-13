<script setup lang="ts">

import * as yup from 'yup';
import { computed, reactive, ref, toRef, watch } from 'vue';
import NotificationCard from '@/components/NotificationCard.vue';
import IconArrayRightRed from '@/components/icons/IconArrayRightRed.vue';
import type { OrderViewModel } from '@/types/viewmodels';
import dayjs from 'dayjs';
import Datepicker from '@vuepic/vue-datepicker';
import { useVuelidate } from '@vuelidate/core'
import { required, email } from '@vuelidate/validators'

const props = defineProps({
  partNumber: { required: true, type: String },
  dealershipName: { required: true, type: String },
  dealershipCode: { required: true, type: String },
  contactName: { type: String, required: true },
  emailAddress: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  customerName: { type: String, required: true },
  mileage: { type: String, required: true },
  vin: { type: String, required: true },
  partNumberObtained: { type: String, required: true },
  isWarranty: { type: Boolean, required: false },
  isCore: { type: Boolean, required: false },
  isGoodwill: { type: Boolean, required: false },
  roNumber: { type: String, required: true },
  poNumber: { type: String, required: true },
  serviceManagerFullName: { type: String, required: true },
  deliveryDate: { type: Date, required: false },
  hours: { type: String, required: true },
  customerComplaint: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zip: { type: String, required: true },
  shippingMethod: { type: String, required: true },
  comments: { type: String, required: false },
  vuelidate: {}
});


const emit = defineEmits<{
  (e: 'onSubmit'): void,
  (e: 'update:contactName'): void,
  (e: 'update:emailAddress'): void,
  (e: 'update:phoneNumber'): void,
  (e: 'update:customerName'): void,
  (e: 'update:mileage'): void,
  (e: 'update:vin'): void,
  (e: 'update:partNumberObtained'): void,
  (e: 'update:isWarranty', v: boolean): void,
  (e: 'update:isCore', v: boolean): void,
  (e: 'update:isGoodwill', v: boolean): void,
  (e: 'update:poNumber'): void,
  (e: 'update:roNumber'): void,
  (e: 'update:serviceManagerFullName', v: string): void,
  (e: 'update:deliveryDate', v: Date | null): void,
  (e: 'update:hours', v: string): void,
  (e: 'update:customerComplaint'): void,
  (e: 'update:address'): void,
  (e: 'update:city'): void,
  (e: 'update:state'): void,
  (e: 'update:zip'): void,
  (e: 'update:shippingMethod'): void,
  (e: 'update:comments'): void,
}>();

function updateIsWarrantyFieldHandler(v: boolean) {
  emit('update:isWarranty', v);
  if (v === true) {
    emit('update:isCore', false);
  } else {
    emit('update:isGoodwill', false);
  }
}

function updateIsGoodwillFieldHandler(v: boolean) {
  emit('update:isGoodwill', v);

  if (v === false) {
    emit('update:serviceManagerFullName', '');
    emit('update:deliveryDate', null);
    emit('update:hours', '');
  }
}

function updateDeliveryDateFieldHandler(modelData: string) {
  const dt = new Date(modelData);
  emit('update:deliveryDate', dt);
}

const deliveryDateFormat = (date: Date) => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${month}/${day}/${year}`;
}

let calcShipDate = computed(() => {

  if(!props.shippingMethod) {
    return '';
  }

  let dt = dayjs(new Date());
  if(props.shippingMethod === 'ground') {    
    dt = dt.add(1, 'day');
  }  
  return dt.format('dddd, MM/DD/YYYY');
});

let calcArrivalDate = computed(() => {
  if(!props.shippingMethod) {
    return '';
  }

  let dt = dayjs(new Date());
  if(props.shippingMethod === 'ground') {    
    dt = dt.add(4, 'day');
  } else if(props.shippingMethod === 'overnight'){
    dt = dt.add(1, 'day');
  }

  return dt.format('dddd, MM/DD/YYYY');
});

function clearOrderFields(props: any) {
  (Object.keys(props)).forEach(key => {
    (props[key] as string) = '';
  });
}

function clearForm() {
  clearOrderFields(props);
}

let deliveryDateRef = ref(props.deliveryDate);



// setup form validation
const rules = {
  contactName: {required},
  emailAddress: {required, email}
};

// setup validation with vuelidate 
const v$ = useVuelidate(rules, props);


</script>
  
<template>


  <form @submit.prevent="emit('onSubmit')">
    <div class="form-section">
      <div class="form-section-header">
        <div class="over-score">&nbsp;</div>
        <h4>Contact Information</h4>
      </div>

      <div class="row mb-3">
        <div class="col-xxl-4 col-xl-4 col-6">
          <label class="form-label read-only">DEALERSHIP NAME</label>
          <div class="read-only-field">{{props.dealershipName}}</div>
        </div>
        <div class="col-xxl-3 col-xl-4 col-6">
          <label class="form-label read-only">DEALER CODE</label>
          <div class="read-only-field">{{props.dealershipCode}}</div>
        </div>
      </div>

      <div class="row">
        <div class="col-md-12 col-lg-6 col-xl-4">
          <label for="contactName" class="form-label req">Contact Name</label>
          <input type="text" class="form-control" id="contactName" name="contactName" :value="contactName"
            @input="$emit('update:contactName', ($event.target as HTMLInputElement).value)" />
            <div class="input-errors" v-for="error of v$?.contactName?.$errors" :key="error.$uid">
              <div class="error-msg">{{ error.$message }}</div>
            </div>
        </div>
        <div class="col-md-12 col-lg-6 col-xl-5">
          <label for="emailAddress" class="form-label req">Email Address</label>
          <input type="email" class="form-control" id="emailAddress" name="emailAddress" :value="emailAddress"
            @input="$emit('update:emailAddress', ($event.target as HTMLInputElement).value)" />

        </div>
        <div class="col-xl-3">
          <label for="phoneNumber" class="form-label req">Phone Number</label>
          <input type="text" class="form-control" id="phoneNumber" name="phoneNumber" :value="phoneNumber"
            @input="$emit('update:phoneNumber', ($event.target as HTMLInputElement).value)" />

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
          <input type="text" class="form-control" id="customerName" name="customerName" :value="customerName"
            @input="$emit('update:customerName', ($event.target as HTMLInputElement).value)" />
        </div>
        <div class="col-md-12 col-lg-6 col-xl-5">
          <label for="mileage" class="form-label req">Mileage</label>
          <input type="text" class="form-control" id="mileage" name="mileage" :value="mileage"
            @input="$emit('update:mileage', ($event.target as HTMLInputElement).value)" />
        </div>
        <div class="col-xl-3">
          <label for="vin" class="form-label req">VIN</label>
          <input type="text" class="form-control" id="vin" name="vin" :value="vin"
            @input="$emit('update:vin', ($event.target as HTMLInputElement).value)" />
        </div>
      </div>

      <div class="row gy-sm-3 mb-3">
        <div class="col-md-12 col-lg-6 col-xl-4">
          <label for="partSelect" class="form-label req">How did you obtain the part number?</label>
          <select class="form-select" id="partSelect" name="partSelect" aria-label="Part number questionairre"
            :value="partNumberObtained"
            @change="$emit('update:partNumberObtained', ($event.target as HTMLInputElement).value)">
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
              autocomplete="off" :value="true" @change="updateIsWarrantyFieldHandler(true)" />
            <label class="form-check-label" for="warrantyExchangeYes" style="padding: .5em 1em;">Yes</label>
          </div>
          <div class="form-check form-check-inline form-radio-button">
            <input type="radio" class="form-check-input" name="warrantyExchange" id="warrantyExchangeNo"
              autocomplete="off" :value="false" @change="updateIsWarrantyFieldHandler(false)" />
            <label class="form-check-label" for="warrantyExchangeNo" style="padding: .5em 1em;">No</label>
          </div>
        </div>
        <div class="col-md-12 col-lg-6 col-xl-3" v-if="isWarranty === false">
          <label for="core" class="form-label req">Do you have a core?</label> <br />
          <div class="form-check form-check-inline form-radio-button">
            <input type="radio" class="form-check-input" name="core" id="coreYes" autocomplete="off" :value="true"
              @change="$emit('update:isCore', true)" />
            <label class="form-check-label" for="coreYes" style="padding: .5em 1em;">Yes</label>
          </div>
          <div class="form-check form-check-inline form-radio-button">
            <input type="radio" class="form-check-input" name="core" id="coreNo" autocomplete="off" :value="false"
              @change="$emit('update:isCore', false)" />
            <label class="form-check-label" for="coreNo" style="padding: .5em 1em;">No</label>
          </div>
        </div>
        <div class="col" v-if="isCore === true">
          <label for="poNumber" class="form-label req">PO #</label>
          <input type="text" class="form-control" id="poNumber" name="poNumber" :value="poNumber"
            @input="$emit('update:poNumber', ($event.target as HTMLInputElement).value)" />
        </div>
        <div class="col-xl-3 col-6" v-if="isWarranty === true">
          <label for="roNumber" class="form-label req">RO #</label>
          <input type="text" class="form-control" id="roNumber" name="roNumber" :value="roNumber"
            @input="$emit('update:roNumber', ($event.target as HTMLInputElement).value)" />
        </div>
      </div>

      <div class="row gy-3">

        <div class="col-sm-12 col-md-12 col-lg-4 col-xxl-2" v-if="isWarranty === true">
          <label for="goodwill" class="form-label req">Is Goodwill?</label>
          <br />
          <div class="form-check form-check-inline form-radio-button">
            <input type="radio" class="form-check-input" name="goodwill" id="goodwillYes" autocomplete="off"
              :value="true" @change="updateIsGoodwillFieldHandler(true)" />
            <label class="form-check-label" for="goodwillYes" style="padding: .5em 1em;">Yes</label>
          </div>
          <div class="form-check form-check-inline form-radio-button">
            <input type="radio" class="form-check-input" name="goodwill" id="goodwillNo" autocomplete="off"
              :value="false" @change="updateIsGoodwillFieldHandler(false)" />
            <label class="form-check-label" for="goodwillNo" style="padding: .5em 1em;">No</label>
          </div>
        </div>

        <div class="col-sm-12 col-md-12 col-lg-7 col-xxl-5" v-if="isGoodwill === true">
          <label for="serviceManager" class="form-label req">Service Manager's Full Name for Goodwill</label>
          <input type="text" class="form-control" id="serviceManager" name="serviceManager"
            :value="serviceManagerFullName"
            @input="$emit('update:serviceManagerFullName', ($event.target as HTMLInputElement).value)" />
        </div>

        <div class="col-sm-6 col-md-6 col-lg-4 col-xxl-3" v-if="isGoodwill === true">
          <label for="deliveryDate" class="form-label req">Delivery Date</label>

          <Datepicker id="deliveryDate" name="deliveryDate" v-model="deliveryDateRef"
            @update:modelValue="updateDeliveryDateFieldHandler" utc :format="deliveryDateFormat" autoApply />

          <!-- <input type="date" class="form-control" id="deliveryDate" name="deliveryDate" :value="deliveryDate"
            @input="updateDeliveryDateFieldHandler(($event.target as HTMLInputElement).value)"  /> -->
        </div>

        <div class="col-sm-6 col-md-6 col-lg-2 col-xxl-2" v-if="isGoodwill === true">
          <label for="hours" class="form-label req">Hours</label>
          <input type="text" class="form-control" id="hours" name="hours" :value="hours"
            @input="$emit('update:hours', ($event.target as HTMLInputElement).value)" />
        </div>
      </div>

      <div class="row">
        <div class="col-12">
          <label for="complaint" class="form-label req">Customer Complaint</label> <span class="label-postscript">(Do
            not use INOP)</span>
          <input type="text" class="form-control" id="complaint" name="complaint" :value="customerComplaint"
            @input="$emit('update:customerComplaint', ($event.target as HTMLInputElement).value)" />
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
          <input type="text" class="form-control" id="address" name="address" :value="address"
            @input="$emit('update:address', ($event.target as HTMLInputElement).value)" />
        </div>
        <div class="col-md-12 col-lg-6 col-xl-4">
          <label for="city" class="form-label req">City</label>
          <input type="text" class="form-control" id="city" name="city" :value="city"
            @input="$emit('update:city', ($event.target as HTMLInputElement).value)" />
        </div>
        <div class="col-md-6 col-lg-3 col-xl-2">
          <label for="stateSelect" class="form-label req">State</label>
          <select class="form-select" id="stateSelect" name="stateSelect" aria-label="Choose US state" :value="state"
            @change="$emit('update:state', ($event.target as HTMLInputElement).value)">
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
          <input type="text" class="form-control" id="zip" name="zip" :value="zip"
            @input="$emit('update:zip', ($event.target as HTMLInputElement).value)" />
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
              autocomplete="off" :value="shippingMethod" @change="$emit('update:shippingMethod', 'overnight')"
              style="min-width: 100px;" />
            <label class="form-check-label" for="shippingMethodOvernight" style="padding: .5em 1em; min-width: 9em;">Overnight
              Air</label>
          </div>
          <div class="form-check form-check-inline form-radio-button">
            <input type="radio" class="form-check-input" name="shippingMethod" id="shippingMethodGround"
              autocomplete="off" :value="shippingMethod" @change="$emit('update:shippingMethod', 'ground')"
               />
            <label class="form-check-label" for="shippingMethodGround" style="padding: .5em 1em; min-width: 9em;">Ground</label>
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
        <textarea class="form-control" row="2" id="comments" name="comments" :value="comments"
          @input="$emit('update:comments', ($event.target as HTMLInputElement).value)"></textarea>
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
        <!-- <input type="button" class="btn btn-secondary btn-cancel-clear" value="Clear Form" @click="clearForm()" /> -->

        <a href="" class="btn btn-secondary btn-cancel-clear" @click.prevent="clearForm()">Clear Form</a>
      </div>
    </div>

  </form>

</template>
  
<style lang="scss" >
@import '@/assets/scss/variables';
@import '@vuepic/vue-datepicker/src/VueDatePicker/style/main.scss';

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
</style>