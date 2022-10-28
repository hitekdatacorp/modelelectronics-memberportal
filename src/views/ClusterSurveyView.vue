<script setup lang="ts">

import { useAuthStore } from '@/stores/auth-store';
import { ref } from 'vue';
import Datepicker from '@vuepic/vue-datepicker';
import { dateTimeToShortDateString } from '@/helpers/formatters';

import * as surveyService from '@/services/survey-service';

const store = useAuthStore();
let survey = ref({
  deliveryDate: '',
  serviceDate: '',
  vin: '',
  make: '',
  model: '',
  modelYear: '',
  roNumber: '',
  odometerMileage: '',
  partNumber: '',
  orderedBy: '',
  escRaNumber: '',
  serviceTechName: '',
  serviceTechPhone: '',
  tacCaseNumber: '',
  customerComplaint: '',
  problemWasDuplicatedOrVerified: true,
  vehicleCodes: ''
});

function onSubmit() {

  console.log('Cluster Survey on Submit called...');
  
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
              :format="dateTimeToShortDateString" autoApply placeholder="DD/MM/YYYY" />
          </div>
        </div>
        <div class="row mb-3">
          <label for="deliveryDate" class="col-sm-4 col-form-label req">Delivery Date</label>
          <div class="col-sm-8">
            <Datepicker id="deliveryDate" name="deliveryDate" v-model="survey.deliveryDate" utc
              :format="dateTimeToShortDateString" autoApply placeholder="DD/MM/YYYY" />
          </div>
        </div>
        <div class="row mb-3">
          <label for="vin" class="col-sm-4 col-form-label req">VIN</label>
          <div class="col-sm-8">
            <input type="text" class="form-control" name="vin" id="vin" v-model="survey.vin" />
          </div>
        </div>
        <div class="row mb-3">
          <label for="make" class="col-sm-4 col-form-label req">Make</label>
          <div class="col-sm-8">
            <input type="text" class="form-control" name="make" id="make" v-model="survey.make" />
          </div>
        </div>

        <div class="row mb-3">
          <label for="model" class="col-sm-4 col-form-label req">Model</label>
          <div class="col-sm-8">
            <input type="text" class="form-control" name="model" id="model" v-model="survey.model" />
          </div>
        </div>

        <div class="row mb-3">
          <label for="modelYear" class="col-sm-4 col-form-label req">Model Year</label>
          <div class="col-sm-8">
            <input type="text" class="form-control" name="modelYear" id="modelYear" v-model="survey.modelYear" />
          </div>
        </div>

        <div class="row mb-3">
          <label for="roNumber" class="col-sm-4 col-form-label req">RO#</label>
          <div class="col-sm-8">
            <input type="text" class="form-control" name="roNumber" id="roNumber" v-model="survey.roNumber" />
          </div>
        </div>

        <div class="row mb-3">
          <label for="odometerMileage" class="col-sm-4 col-form-label req">Odometer Mileage</label>
          <div class="col-sm-8">
            <input type="text" class="form-control" name="odometerMileage" id="odometerMileage"
              v-model="survey.odometerMileage" />
          </div>
        </div>

        <div class="row mb-3">
          <label for="partNumber" class="col-sm-4 col-form-label req">Part Number</label>
          <div class="col-sm-8">
            <input type="text" class="form-control" name="partNumber" id="partNumber" v-model="survey.partNumber" />
          </div>
        </div>

        <div class="row mb-3">
          <label for="orderedBy" class="col-sm-4 col-form-label req">Ordered By (Name)</label>
          <div class="col-sm-8">
            <input type="text" class="form-control" name="orderedBy" id="orderedBy" v-model="survey.orderedBy" />
          </div>
        </div>

        <div class="row mb-3">
          <label for="escRaNumber" class="col-sm-4 col-form-label req">ESC RA#</label>
          <div class="col-sm-8">
            <input type="text" class="form-control" name="escRaNumber" id="escRaNumber" v-model="survey.escRaNumber" />
          </div>
        </div>

        <div class="row mb-3">
          <label for="serviceTechName" class="col-sm-4 col-form-label req">Service Tech Name</label>
          <div class="col-sm-8">
            <input type="text" class="form-control" name="serviceTechName" id="serviceTechName"
              v-model="survey.serviceTechName" />
          </div>
        </div>

        <div class="row mb-3">
          <label for="serviceTechPhone" class="col-sm-4 col-form-label req">Service Tech Phone #</label>
          <div class="col-sm-8">
            <input type="text" class="form-control" name="serviceTechPhone" id="serviceTechPhone"
              v-model="survey.serviceTechPhone" />
          </div>
        </div>

        <div class="row mb-3">
          <label for="tacCaseNumber" class="col-sm-4 col-form-label req">TAC Case #</label>
          <div class="col-sm-8">
            <input type="text" class="form-control" name="tacCaseNumber" id="tacCaseNumber"
              v-model="survey.tacCaseNumber" />
          </div>
        </div>

        <fieldset class="row mb-3">
          <legend class="col-form-label col-sm-4 pt-0">Type of Problem</legend>
          <div class="col-sm-8">
            <div class="form-check">
              <input class="form-check-input" type="radio" name="typeOfProblem" id="rdoGages" value="Gages" checked>
              <label class="form-check-label" for="rdoGages">Gages</label>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="radio" name="typeOfProblem" id="rdoOdometerOrDic" value="Odometer or DIC">
              <label class="form-check-label" for="rdoOdometerOrDic">Odometer or DIC</label>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="radio" name="typeOfProblem" id="rdoPhysicalDefectOrDamage"
                value="Physical Defect\Damage">
              <label class="form-check-label" for="rdoPhysicalDefectOrDamage">Physical Defect\Damage</label>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="radio" name="typeOfProblem" id="rdoTelltale" value="Telltale">
              <label class="form-check-label" for="rdoTelltale">Telltale</label>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="radio" name="typeOfProblem" id="rdoHud" value="HUD">
              <label class="form-check-label" for="rdoHud">HUD</label>
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
              v-model="survey.customerComplaint" />
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
          </div>
        </div>

        <div class="row pb-5">
          <div class="col-12">
            <label for="vehicleCodes" class="form-label req">Identify any codes (by module) that are present in the
              vehicle. List both the history and current codes</label>
            <input type="text" class="form-control" id="vehicleCodes" name="vehicleCodes"
              v-model="survey.vehicleCodes" />
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

      .form-check-input[type=radio] {
        margin-right: 10px;

      }

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
