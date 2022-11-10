<script setup lang="ts">

import { useAuthStore } from '@/stores/auth-store';
import { ref } from 'vue';
import Datepicker from '@vuepic/vue-datepicker';
import { dateTimeToShortDateString } from '@/helpers/formatters';
import { useVuelidate } from '@vuelidate/core';
import { required, email, helpers, maxLength, requiredIf, integer  } from '@vuelidate/validators';
import {usPhoneNumber, vinNumber} from '@/helpers/validators';
import * as surveyService from '@/services/survey-service';

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

  // optional fields to be filled out by the user based on which typeOfProblem was selected
  gagesAtFault: [],
  gageFaultCondition: '',
  electronicDisplayFaultCondititon: '',
  physicalDamage: '',
  telltales: '',
  hudFaultCondition: '',  
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
  customerComplaint: {required},
  problemWasDuplicatedOrVerified: {required},
  vehicleCodes: {required}    
};
const v$ = useVuelidate(rules, survey);

async function onSubmit() {
  
  const isFormValid = await v$.value.$validate();

  console.log('Cluster Survey on Submit called...');
  console.debug(survey.value);
  
  if(!isFormValid){
    return;
  }

  try {
    let data = await surveyService.postClusterSurvey(survey.value);  
  } catch {

  }  
}
</script>

<template>
  <main class="cluster">
    <h3>GM PQC Cluster Survey</h3>
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
              <input class="form-check-input" type="radio" name="typeOfProblem" id="rdoGages" value="Gages" v-model="survey.typeOfProblem">
              <label class="form-check-label" for="rdoGages">Gages</label>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="radio" name="typeOfProblem" id="rdoOdometerOrDic" value="Odometer or DIC" v-model="survey.typeOfProblem">
              <label class="form-check-label" for="rdoOdometerOrDic">Odometer or DIC</label>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="radio" name="typeOfProblem" id="rdoPhysicalDefectOrDamage"
                value="Physical Defect\Damage" v-model="survey.typeOfProblem">
              <label class="form-check-label" for="rdoPhysicalDefectOrDamage">Physical Defect\Damage</label>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="radio" name="typeOfProblem" id="rdoTelltale" value="Telltale" v-model="survey.typeOfProblem">
              <label class="form-check-label" for="rdoTelltale">Telltale</label>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="radio" name="typeOfProblem" id="rdoHud" value="HUD" v-model="survey.typeOfProblem">
              <label class="form-check-label" for="rdoHud">HUD</label>
            </div>
             
              <div class="input-errors" v-for="error of v$?.typeOfProblem?.$errors" :key="error.$uid">
                <div class="error-msg">{{ error.$message }}</div>
              </div>
          </div>
        </fieldset>
        <hr />

        <h3 style="margin-top: 2rem;">Problem Description</h3>
        <div style="font-size:1.5em; width: 100%; text-align: center; margin-bottom: 2em;">
          Must be complete for all issues
        </div>

        <div class="row pb-4">
          <div class="col-12">
            <label for="complaint" class="form-label req">Customer Complaint</label>
            <input type="text" class="form-control" id="customerComplaint" name="customerComplaint"
              v-model="survey.customerComplaint" @blur="v$.customerComplaint.$touch" />
              <div class="input-errors" v-for="error of v$?.customerComplaint?.$errors" :key="error.$uid">
                <div class="error-msg">{{ error.$message }}</div>
              </div>
          </div>
        </div>

        <div class="row pb-4">
          <div class="col-sm-12">
            <label for="problemWasDuplicatedOrVerified" class="form-label req">Was the problem duplicated and / or
              verified?</label>
            <br />
            <div class="form-check form-check-inline form-radio-button">
              <input type="radio" class="form-check-input" name="problemWasDuplicatedOrVerified" id="rdoDupYes"
                autocomplete="off" :value="true" v-model="survey.problemWasDuplicatedOrVerified" />
              <label class="form-check-label" for="rdoDupYes" style="padding: .5em 1em;">Yes</label>
            </div>
            <div class="form-check form-check-inline form-radio-button">
              <input type="radio" class="form-check-input" name="problemWasDuplicatedOrVerified" id="rdoDupNo"
                autocomplete="off" :value="false" v-model="survey.problemWasDuplicatedOrVerified" />
              <label class="form-check-label" for="rdoDupNo" style="padding: .5em 1em;">No</label>
            </div>
            <div class="input-errors" v-for="error of v$?.problemWasDuplicatedOrVerified?.$errors" :key="error.$uid">
                <div class="error-msg">{{ error.$message }}</div>
              </div>
          </div>
        </div>

        <div class="row pb-4">
          <div class="col-12">
            <label for="vehicleCodes" class="form-label req">Identify any codes (by module) that are present in the
              vehicle. List both the history and current codes</label>
            <input type="text" class="form-control" id="vehicleCodes" name="vehicleCodes"
              v-model="survey.vehicleCodes" @blur="v$.vehicleCodes.$touch" />
              <div class="input-errors" v-for="error of v$?.vehicleCodes?.$errors" :key="error.$uid">
                <div class="error-msg">{{ error.$message }}</div>
              </div>
          </div>
        </div>

        <div class="row pb-5" v-if="survey.typeOfProblem === 'Gages'">
          <div class="col-12">
            <label for="vehicleCodes" class="form-label req">GAGE ISSUES (Identify the gage(s) at fault and check all that apply)</label>            
            <div class="form-check">
              <input class="form-check-input" type="checkbox" name="gagesAtFault" id="chkSpeedometer" value="Speedometer" v-model="survey.gagesAtFault">
              <label class="form-check-label" for="chkSpeedometer">Speedometer</label>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="checkbox" name="gagesAtFault" id="chkTachometer" value="Tachometer" v-model="survey.gagesAtFault">
              <label class="form-check-label" for="chkTachometer">Tachometer</label>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="checkbox" name="gagesAtFault" id="chkFuelGage" value="Fuel Gage" v-model="survey.gagesAtFault">
              <label class="form-check-label" for="chkFuelGage">Fuel Gage</label>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="checkbox" name="gagesAtFault" id="chkCoolantTemp" value="Coolant Temp" v-model="survey.gagesAtFault">
              <label class="form-check-label" for="chkCoolantTemp">Coolant Temp</label>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="checkbox" name="gagesAtFault" id="chkOilPressure" value="Oil Pressure" v-model="survey.gagesAtFault">
              <label class="form-check-label" for="chkOilPressure">Oil Pressure</label>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="checkbox" name="gagesAtFault" id="chkBattery" value="Battery" v-model="survey.gagesAtFault">
              <label class="form-check-label" for="chkBattery">Battery</label>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="checkbox" name="gagesAtFault" id="chkTransTemp" value="Trans Temp" v-model="survey.gagesAtFault">
              <label class="form-check-label" for="chkTransTemp">Trans Temp</label>
            </div>                         
          </div>
        </div>

        <div class="row pb-5" v-if="survey.typeOfProblem === 'Gages'">
          <div class="col-12">
            <label for="gageFaultCondition" class="form-label">If gage inoperative or noisy, describe gage(s) fault condition</label>
            <input type="text" class="form-control" id="gageFaultCondition" name="gageFaultCondition"
              v-model="survey.gageFaultCondition"  />              
          </div>
        </div>

        <div class="row pb-5" v-if="survey.typeOfProblem === 'Odometer or DIC'">
          <div class="col-12">
            <label for="electronicDisplayFaultCondititon" class="form-label">ODOMETER, PRNDL or DIC ISSUES</label>
            <input type="text" class="form-control" id="electronicDisplayFaultCondititon" name="electronicDisplayFaultCondititon"
              v-model="survey.electronicDisplayFaultCondititon"  />              
          </div>
        </div>

        <div class="row pb-5" v-if="survey.typeOfProblem === 'Physical Defect\\Damage'">
          <div class="col-12">
            <label for="physicalDamage" class="form-label">PHYSICAL DEFECT/DAMAGE ISSUES</label>
            <input type="text" class="form-control" id="physicalDamage" name="physicalDamage"
              v-model="survey.physicalDamage"  />              
          </div>
        </div>

        <div class="row pb-5" v-if="survey.typeOfProblem === 'Telltale'">
          <div class="col-12">
            <label for="telltales" class="form-label">TELLTALE & INDICATOR ISSUES </label>
            <input type="text" class="form-control" id="telltales" name="telltales"
              v-model="survey.telltales"  />              
          </div>
        </div>

        <div class="row pb-5" v-if="survey.typeOfProblem === 'HUD'">
          <div class="col-12">
            <label for="hudFaultCondition" class="form-label">HEADS-UP DISPLAY ISSUES</label>
            <input type="text" class="form-control" id="hudFaultCondition" name="hudFaultCondition"
              v-model="survey.hudFaultCondition"  />              
          </div>
        </div>


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

.cluster {
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
