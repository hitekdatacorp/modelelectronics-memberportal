<script setup lang="ts">

import { useAuthStore } from '@/stores/auth-store';
import { onMounted, ref } from 'vue';
import Datepicker from '@vuepic/vue-datepicker';
import { dateTimeToShortDateString } from '@/helpers/formatters';
import { useVuelidate } from '@vuelidate/core';
import { required, email, helpers, maxLength, requiredIf, integer  } from '@vuelidate/validators';
import {usPhoneNumber, vinNumber} from '@/helpers/validators';
import * as surveyService from '@/services/survey-service';
import * as orderService from '@/services/order-service';

const props = defineProps<{orderId?: number}>();

onMounted(async () => {
  if(props.orderId) {

    var order = await orderService.getOrder(props.orderId);
    
    survey.value.serviceDate = new Date().toDateString();
    survey.value.deliveryDate = order.deliveryDate ?? '';
    survey.value.customerComplaint = order.complaint ?? '';    
    survey.value.tacCaseNumber = order.tacCaseNumber ?? '';
    survey.value.roNumber = order.roNumber ?? '';
    survey.value.partNumber = order.partNumber ?? '';
    survey.value.vin = order.vin ?? '';
  }
})

const store = useAuthStore();
let survey = ref({
  dealerCode: store.customerNumber,
  dealerName: store.name,
  deliveryDate: '',
  serviceDate: '',
  vin: '',
  make: '',
  model: '',
  modelYear: null,
  roNumber: '',
  mileage: null,
  partNumber: '',
  orderedByName: '',
  escRaNumber: '',
  serviceTechName: '',
  serviceTechPhoneNumber: '',
  tacCaseNumber: '',
  typeOfProblem: '',
  customerComplaint: '',
  problemWasDuplicatedOrVerified: true,
  vehicleCodes: '',


  unitType: '' 
});

// setup form validation
const rules = {
  serviceDate: {required},
  deliveryDate: {required},
  vin: {vinNumber: helpers.withMessage('Not a valid VIN number', vinNumber)},
  make: {required, maxLength: maxLength(255)},
  model: {required,  maxLength: maxLength(255)},
  modelYear: {required,  maxLength: maxLength(4)},
  roNumber: {required},
  mileage: {required, integer: helpers.withMessage('Mileage must be a valid number. Please remove any commas or decimals or any other special character', integer) },
  partNumber: {required,  maxLength: maxLength(255)},
  orderedByName: {required},
  escRaNumber: {required},
  serviceTechName: {required,  maxLength: maxLength(255)},
  serviceTechPhoneNumber: {required, phoneNumber: helpers.withMessage('Not a valid phone number', usPhoneNumber)},
  //tacCaseNumber: {required},
  typeOfProblem: {required},
  
  
  
  unitType: {required}
};
const v$ = useVuelidate(rules, survey);

async function onSubmit() {
  
  const isFormValid = await v$.value.$validate();

  console.log('Radio Survey on Submit called...');
  console.debug(survey.value);
  
  if(!isFormValid){
    return;
  }

  try {
    let data = await surveyService.postRadioSurvey(survey.value);  
  } catch {

  }  
}
</script>

<template>
  <main class="radio">
    <h3>GM PQC Radio Survey</h3>
    <div style="width: 100%; text-align: center;">
      <span class="req-label">Required Field</span>
    </div>
    <div style="width: 100%; text-align: center;">
      Explanation here as to why this survey is required
    </div>

    <div class="survey-form">
      <form @submit.prevent="onSubmit">
        <div class="row mb-3">
          <label class="col-sm-4 col-form-label read-only">Dealership Name</label>
          <div class="col-sm-8 read-only-field">{{store.name}}</div>
        </div>
        <div class="row mb-3">
          <label class="col-sm-4 col-form-label read-only">Dealer Code</label>
          <div class="col-sm-8 read-only-field">{{store.customerNumber}}</div>
        </div>
        <div class="row mb-3">
          <label for="serviceDate" class="col-sm-4 col-form-label req">Service Date</label>
          <div class="col-sm-8" style="text-align: left;">
            <Datepicker id="serviceDate" name="serviceDate" class="" v-model="survey.serviceDate" utc
              :format="dateTimeToShortDateString" autoApply placeholder="DD/MM/YYYY"
              @blur="v$.serviceDate.$touch" />
              <div class="input-errors" v-for="error of v$?.serviceDate?.$errors" :key="error.$uid">
                <div class="error-msg">{{ error.$message }}</div>
              </div>
          </div>
        </div>
        <div class="row mb-3">
          <label for="deliveryDate" class="col-sm-4 col-form-label req">Delivery Date</label>
          <div class="col-sm-8">
            <Datepicker id="deliveryDate" name="deliveryDate" v-model="survey.deliveryDate" utc
              :format="dateTimeToShortDateString" autoApply placeholder="DD/MM/YYYY" 
              @blur="v$.deliveryDate.$touch" />
              <div class="input-errors" v-for="error of v$?.deliveryDate?.$errors" :key="error.$uid">
                <div class="error-msg">{{ error.$message }}</div>
              </div>
          </div>
        </div>
        <div class="row mb-3">
          <label for="vin" class="col-sm-4 col-form-label req">VIN</label>
          <div class="col-sm-8">
            <input type="text" class="form-control" name="vin" id="vin" v-model="survey.vin" @blur="v$.vin.$touch" />
              <div class="input-errors" v-for="error of v$?.vin?.$errors" :key="error.$uid">
                <div class="error-msg">{{ error.$message }}</div>
              </div>
          </div>
        </div>
        <div class="row mb-3">
          <label for="make" class="col-sm-4 col-form-label req">Make</label>
          <div class="col-sm-8">
            <input type="text" class="form-control" name="make" id="make" v-model="survey.make" @blur="v$.make.$touch" />
              <div class="input-errors" v-for="error of v$?.make?.$errors" :key="error.$uid">
                <div class="error-msg">{{ error.$message }}</div>
              </div>
          </div>
        </div>

        <div class="row mb-3">
          <label for="model" class="col-sm-4 col-form-label req">Model</label>
          <div class="col-sm-8">
            <input type="text" class="form-control" name="model" id="model" v-model="survey.model" @blur="v$.model.$touch" />
              <div class="input-errors" v-for="error of v$?.model?.$errors" :key="error.$uid">
                <div class="error-msg">{{ error.$message }}</div>
              </div>
          </div>
        </div>

        <div class="row mb-3">
          <label for="modelYear" class="col-sm-4 col-form-label req">Model Year</label>
          <div class="col-sm-8">
            <input type="text" class="form-control" name="modelYear" id="modelYear" v-model="survey.modelYear" @blur="v$.modelYear.$touch" />
              <div class="input-errors" v-for="error of v$?.modelYear?.$errors" :key="error.$uid">
                <div class="error-msg">{{ error.$message }}</div>
              </div>
          </div>
        </div>

        <div class="row mb-3">
          <label for="roNumber" class="col-sm-4 col-form-label req">RO#</label>
          <div class="col-sm-8">
            <input type="text" class="form-control" name="roNumber" id="roNumber" v-model="survey.roNumber" @blur="v$.roNumber.$touch" />
              <div class="input-errors" v-for="error of v$?.roNumber?.$errors" :key="error.$uid">
                <div class="error-msg">{{ error.$message }}</div>
              </div>
          </div>
        </div>

        <div class="row mb-3">
          <label for="mileage" class="col-sm-4 col-form-label req">Odometer Mileage</label>
          <div class="col-sm-8">
            <input type="text" class="form-control" name="mileage" id="mileage"
              v-model="survey.mileage" @blur="v$.mileage.$touch" />
              <div class="input-errors" v-for="error of v$?.mileage?.$errors" :key="error.$uid">
                <div class="error-msg">{{ error.$message }}</div>
              </div>
          </div>
        </div>

        <div class="row mb-3">
          <label for="partNumber" class="col-sm-4 col-form-label req">Part Number</label>
          <div class="col-sm-8">
            <input type="text" class="form-control" name="partNumber" id="partNumber" v-model="survey.partNumber" @blur="v$.partNumber.$touch" />
              <div class="input-errors" v-for="error of v$?.partNumber?.$errors" :key="error.$uid">
                <div class="error-msg">{{ error.$message }}</div>
              </div>
          </div>
        </div>

        <div class="row mb-3">
          <label for="orderedByName" class="col-sm-4 col-form-label req">Ordered By (Name)</label>
          <div class="col-sm-8">
            <input type="text" class="form-control" name="orderedByName" id="orderedByName" v-model="survey.orderedByName" @blur="v$.orderedByName.$touch" />
              <div class="input-errors" v-for="error of v$?.orderedByName?.$errors" :key="error.$uid">
                <div class="error-msg">{{ error.$message }}</div>
              </div>
          </div>
        </div>

        <div class="row mb-3">
          <label for="escRaNumber" class="col-sm-4 col-form-label req">ESC RA#</label>
          <div class="col-sm-8">
            <input type="text" class="form-control" name="escRaNumber" id="escRaNumber" v-model="survey.escRaNumber" @blur="v$.escRaNumber.$touch" />
              <div class="input-errors" v-for="error of v$?.escRaNumber?.$errors" :key="error.$uid">
                <div class="error-msg">{{ error.$message }}</div>
              </div>
          </div>
        </div>

        <div class="row mb-3">
          <label for="serviceTechName" class="col-sm-4 col-form-label req">Service Tech Name</label>
          <div class="col-sm-8">
            <input type="text" class="form-control" name="serviceTechName" id="serviceTechName"
              v-model="survey.serviceTechName" @blur="v$.serviceTechName.$touch" />
              <div class="input-errors" v-for="error of v$?.serviceTechName?.$errors" :key="error.$uid">
                <div class="error-msg">{{ error.$message }}</div>
              </div>
          </div>
        </div>

        <div class="row mb-3">
          <label for="serviceTechPhoneNumber" class="col-sm-4 col-form-label req">Service Tech Phone #</label>
          <div class="col-sm-8">
            <input type="text" class="form-control" name="serviceTechPhoneNumber" id="serviceTechPhoneNumber"
              v-model="survey.serviceTechPhoneNumber" @blur="v$.serviceTechPhoneNumber.$touch" />
              <div class="input-errors" v-for="error of v$?.serviceTechPhoneNumber?.$errors" :key="error.$uid">
                <div class="error-msg">{{ error.$message }}</div>
              </div>
          </div>
        </div>

        <div class="row mb-3">
          <label for="tacCaseNumber" class="col-sm-4 col-form-label">TAC Case #</label>
          <div class="col-sm-8">
            <input type="text" class="form-control" name="tacCaseNumber" id="tacCaseNumber"
              v-model="survey.tacCaseNumber"  />
              
          </div>
        </div>

        <fieldset class="row mb-3">
          <legend class="col-form-label col-sm-4 pt-0 req">Type of Problem</legend>
          <div class="col-sm-8">
            <div class="form-check">
              <input class="form-check-input" type="radio" name="typeOfProblem" id="rdoCdPlayer" value="CD player" v-model="survey.typeOfProblem">
              <label class="form-check-label" for="rdoCdPlayer">CD player</label>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="radio" name="typeOfProblem" id="rdoRadioReception" value="Radio Reception" v-model="survey.typeOfProblem">
              <label class="form-check-label" for="rdoRadioReception">Radio Reception</label>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="radio" name="typeOfProblem" id="rdoSoundQuality"
                value="Sound Quality/Speakers" v-model="survey.typeOfProblem">
              <label class="form-check-label" for="rdoSoundQuality">Sound Quality/Speakers</label>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="radio" name="typeOfProblem" id="rdoRadioDisplay" value="Radio Display" v-model="survey.typeOfProblem">
              <label class="form-check-label" for="rdoRadioDisplay">Radio Display</label>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="radio" name="typeOfProblem" id="rdoFaceplateControlsEtc" value="Faceplate/Controls/Buttons/Knobs" v-model="survey.typeOfProblem">
              <label class="form-check-label" for="rdoFaceplateControlsEtc">Faceplate/Controls/Buttons/Knobs</label>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="radio" name="typeOfProblem" id="rdoDvd" value="DVD" v-model="survey.typeOfProblem">
              <label class="form-check-label" for="rdoDvd">DVD</label>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="radio" name="typeOfProblem" id="rdoHardDrive" value="Hard Drive" v-model="survey.typeOfProblem">
              <label class="form-check-label" for="rdoHardDrive">Hard Drive</label>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="radio" name="typeOfProblem" id="rdoNavigationSystem" value="Navigation System" v-model="survey.typeOfProblem">
              <label class="form-check-label" for="rdoNavigationSystem">Navigation System</label>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="radio" name="typeOfProblem" id="rdoRearSeatEntertainmentSystem" value="Rear Seat Entertainment System" v-model="survey.typeOfProblem">
              <label class="form-check-label" for="rdoRearSeatEntertainmentSystem">Rear Seat Entertainment System</label>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="radio" name="typeOfProblem" id="rdoOther" value="Other" v-model="survey.typeOfProblem">
              <label class="form-check-label" for="rdoOther">Other</label>
            </div>
             
              <div class="input-errors" v-for="error of v$?.typeOfProblem?.$errors" :key="error.$uid">
                <div class="error-msg">{{ error.$message }}</div>
              </div>
          </div>
        </fieldset>

        <fieldset class="row mb-3">
          <legend class="col-form-label col-sm-4 pt-0 req">Unit Type</legend>
          <div class="col-sm-8">
            <div class="form-check">
              <input class="form-check-input" type="radio" name="unitType" id="rdoRadio" value="Radio" v-model="survey.unitType">
              <label class="form-check-label" for="rdoRadio">Radio</label>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="radio" name="unitType" id="rdoNavigationSystem" value="Navigation System" v-model="survey.unitType">
              <label class="form-check-label" for="rdoNavigationSystem">Navigation System</label>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="radio" name="unitType" id="rdoRadioSilverbox"
                value="Radio - Silverbox" v-model="survey.unitType">
              <label class="form-check-label" for="rdoRadioSilverbox">Radio - Silverbox</label>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="radio" name="unitType" id="rdoFaceplateSilverbox" value="Faceplate - Silverbox" v-model="survey.unitType">
              <label class="form-check-label" for="rdoFaceplateSilverbox">Faceplate - Silverbox</label>
            </div>          
             
              <div class="input-errors" v-for="error of v$?.unitType?.$errors" :key="error.$uid">
                <div class="error-msg">{{ error.$message }}</div>
              </div>
          </div>
        </fieldset>

     

        <div class="row pt-4 pb-5">
          <div class="col-sm-12">
            <input type="submit" class="btn btn-primary" value="Submit Survey" />
          </div>
        </div>
      </form>
    </div>
  </main>
</template>

<style lang="scss">
  @import '@vuepic/vue-datepicker/src/VueDatePicker/style/main.scss';
</style>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

.radio {
  min-height: 50vh;
  padding-top: 2rem;

  &>div,
  &>h3 {
    width: 100%;
    // text-align: center;
  }

  h3 {
    width: 100%;
    text-align: center;
  }

  .survey-form {
    margin-top: 2rem;
    background-color: $secondary-background;

    form {
      margin: 0 auto;
      max-width: 600px;
      font-size: 16px;     

      legend {
        float: left;
      }

      .read-only-field {
        padding-top: calc(0.375rem + 1px);
        padding-bottom: calc(0.375rem + 1px);
      }
    }

    div.row {
      div[class^="col"] {
        text-align: left;
      }
    }
  }
}

.req {}
</style>
